/**
 * !info {Project} -来自Nomen
 * @version 1.7.3
 * @requires NomenSQLite@1.2.1
 * NomenFS 基于SQL的文件与目录管理系统 - 介绍：shequ.codemao.cn/community/540876
 */

class NomenFS {
    constructor(ns) {
        if (!this.operator) this.operator = (new ns()).operate('NomenFileSystemMain');
        if (NomenFS.instance) return NomenFS.instance;
    }
    static async launch(NomenSQLite) {
        if (NomenSQLite) var ns = NomenSQLite;
        else throw new Error('NomenSQLite不存在')
        let NSqlite = await ns.launch({
            'NomenFileSystemMain': [
                { name: 'type', type: ns.DataType.TEXT, notnull: true },
                { name: 'path', type: ns.DataType.TEXT, notnull: true },
                { name: 'parent', type: ns.DataType.TEXT, notnull: true },
                { name: 'creationdate', type: ns.DataType.TEXT, notnull: true },
                { name: 'property', type: ns.DataType.TEXT, notnull: true },
                { name: 'owner', type: ns.DataType.TEXT },
                { name: 'file', type: ns.DataType.TEXT },
            ]
        }, ns.LaunchAction.CREATE_OR_LAUNCH, (v, r) => { if (r) throw NomenFS.ErrorGenerator('0', r) });
        if (!this.instance) this.instance = new this(ns);
        if (!this.operator) this.operator = NSqlite.operate('NomenFileSystemMain');
        return this.instance;
    }

    /** 静态方法 */
    static getInstance() {
        if (!this.instance) {
            this.instance = new NomenFS();
        }
        return this.instance;
    }
    static ErrorGenerator(errorcode, errMessage) {
        return new Error(`[NomenFileSystem: ErrorCode:${errorcode}] ${NomenFS.ErrorCode[errorcode]}${errMessage ? ' : ' + errMessage : ''}`)
    }
    static pathSolver(path) {
        if (typeof path == "string") {
            if (path.startsWith('.')) path = path.substring(1);
            if (!path.startsWith('/')) path = `/${path}`;
        }
        return path;
    }
    static filePropertyGenerator(property) {
        let init = {
            readonly: false,
        }
        Object.assign(init, property);
        return init;
    }

    /** 静态属性 */
    static fileType = {
        'file': 'file',
        'folder': 'folder'
    }
    static ErrorCode = {
        "-3": 'Must specify a file name or folder name',
        "-2": 'The file name must not contain the following characters:[  "/" ":" "?" """ "<" ">" "\'" "|" "\\" "*" "~"  ]',
        "-1": 'Incoming parameters do not match expectations',
        "0": 'Unexpected errors',
        "1": 'File does not exist',
        "2": 'Folder does not exist',
        "3": 'A file or folder with the same name already exists in the current location'
    }

    /** 实例方法 */
    _pathParser(path) {
        let p = path.split('/').slice(0, -1).join('/');
        let c = path.split('/').slice(-1);
        if (/[/:?"<>|~'\\*]/g.test(c)) throw NomenFS.ErrorGenerator("-2");
        if (!c.length) throw NomenFS.ErrorGenerator("-3");
        return { parentFolder: p.length ? p : '/', currentFile: c[0] }
    }
    async readFile(path) {
        if (typeof path != "string") throw NomenFS.ErrorGenerator("-1");
        let result = await NomenFS.operator.select('path', NomenFS.pathSolver(path));
        if (result.length) return result[0].file;
        else throw NomenFS.ErrorGenerator("1");
    }
    async writeFile(path, content, readonly = false) {
        path = NomenFS.pathSolver(path);
        if (typeof path != "string" || typeof content !== "string") throw NomenFS.ErrorGenerator("-1");
        let cpath = this._pathParser(path);
        let ctn = {
            type: NomenFS.fileType['file'],
            path,
            parent: cpath.parentFolder,
            creationdate: Date.now(),
            property: JSON.stringify(NomenFS.filePropertyGenerator({ readonly })),
            file: content,
        };
        let prt = await NomenFS.operator.select('path', cpath.parentFolder);
        if (!prt.length || prt[0].type != NomenFS.fileType['folder']) throw NomenFS.ErrorGenerator("2");
        let crt = await NomenFS.operator.select('path', path);
        if (crt.length && crt[0].type == NomenFS.fileType['folder']) throw NomenFS.ErrorGenerator("3");
        if (crt.length)await NomenFS.operator.update(`path=${path}`, ctn)
        else await NomenFS.operator.insert(ctn);
        return path;
    }
    async mkdir(path, readonly = false) {
        path = NomenFS.pathSolver(path);
        if (typeof path != "string") throw this.ErrorGenerator("-1");
        let fd = await NomenFS.operator.select('path', path);
        let cpath = this._pathParser(path);
        if (fd.length && fd[0].type == NomenFS.fileType['file']) throw NomenFS.ErrorGenerator("3");
        if (!fd.length) {
            await NomenFS.operator.insert({
                type: NomenFS.fileType['folder'],
                path,
                parent: cpath.parentFolder,
                creationdate: Date.now(),
                property: JSON.stringify(NomenFS.filePropertyGenerator({ readonly })),
            });
            if (cpath.parentFolder) await this.mkdir(cpath.parentFolder)
        }
        return path;
    }
    async unlink(path) {
        if (typeof path != "string") throw NomenFS.ErrorGenerator("-1");
        return await NomenFS.operator.remove('path', NomenFS.pathSolver(path));
    }
    async readdir(path) {
        path = NomenFS.pathSolver(path);
        if (typeof path != "string") throw NomenFS.ErrorGenerator("-1");
        if (path == '/') return (await NomenFS.operator.select('parent', '/')).map(v => v.path);
        let parentFolder = await NomenFS.operator.select('path', path);
        if (!parentFolder.length) throw NomenFS.ErrorGenerator("2");
        if (parentFolder.length && parentFolder[0].type == NomenFS.fileType["file"]) throw NomenFS.ErrorGenerator("3");
        return (await NomenFS.operator.select('parent', path)).map(v => v.path);
    }
    async rmdir(path) {
        path = NomenFS.pathSolver(path);
        if (typeof path != "string") throw NomenFS.ErrorGenerator("-1");
        let targetFolder = await NomenFS.operator.select('path', path);
        if (!targetFolder.length) throw NomenFS.ErrorGenerator("2");
        let childFolder = await NomenFS.operator.select('parent', path);
        if (childFolder.length) {
            for (let i = 0; i < childFolder.length; i++) {
                if ((await NomenFS.operator.select('parent', childFolder[i].path)).length) await this.rmdir(childFolder[i].path);
                await NomenFS.operator.remove('path', childFolder[i].path);
            }
        }
        await NomenFS.operator.remove('path', path);
        return path;
    }
    async appendFile(path, content) {
        path = NomenFS.pathSolver(path);
        if (typeof path != "string") throw NomenFS.ErrorGenerator("-1");
        let tf = await NomenFS.operator.select('path', path);
        if (!tf.length) throw NomenFS.ErrorGenerator("1");
        if (tf[0].type == NomenFS.fileType["folder"]) throw NomenFS.ErrorGenerator("3");
        await this.writeFile(path, (tf[0].file.concat(content)));
        return path;
    }
    async rename(path, newname) {
        path = NomenFS.pathSolver(path);
        if (typeof path != "string") throw NomenFS.ErrorGenerator("-1");
        let tt = await NomenFS.operator.select('path', path);
        if (!tt.length) throw NomenFS.ErrorGenerator("1");
        if (tt[0].type == NomenFS.fileType["file"]) {
            await NomenFS.operator.update(`path=${path}`, { path: path.replace(/\/[^\/]*$/, '/' + newname) });
        } else if (tt[0].type == NomenFS.fileType["folder"]) {
            function cname(rname, match) {
                for (let i = 0; i < rname.length; i++) { if (match[i] && (match[i] != rname[i])) { rname[i] = match[i]; break; } }
                return rname;
            }
            function inpath(rname, match) {
                for (let i = 0; i < rname.length; i++) { if (match[i] && (match[i] != rname[i])) return true; }
                return false;
            }
            let allFile = await NomenFS.operator.select('*');
            for (let i = 0; i < allFile.length; i++) {
                if (!inpath(allFile[i].path.split('/').slice(1), path.split('/').slice(1))) {
                    console.log(allFile[i].path + ' // ' + `/${cname(allFile[i].path.split('/').slice(1), path.replace(/\/[^\/]*$/, '/' + newname).split('/').slice(1)).join('/')}`)
                    await NomenFS.operator.update(`path=${allFile[i].path}`, {
                        path: `/${cname(allFile[i].path.split('/').slice(1), path.replace(/\/[^\/]*$/, '/' + newname).split('/').slice(1)).join('/')}`,
                        parent: `/${cname(allFile[i].path.split('/').slice(1), path.replace(/\/[^\/]*$/, '/' + newname).split('/').slice(1)).join('/')}`
                    });
                }
            }
        }
        return path;
    }
}


/**
 * 读取文件内容
 * @param {string} path 路径
 */
ns.readFile('/src/playerData/nomen.json');

/**
 * 写入文件内容
 * @param {string} path 路径
 * @param {string} content 文本内容
 */
ns.writeFile('/src/playerData/nomen.json','"{name:\\"Nomen\\",coin:10},bag:[\\"By NomenTeam - Nomen\\",\\"EasyCoding\\"]"');

/**
 * 创建文件夹
 * @param {string} path 文件夹路径，自动创建子文件夹
 */
ns.mkdir('/src/playerData');

/**
 * 删除文件
 * @param {string} path 路径
 */
ns.unlink('/src/playerData/nomen.json');

/**
 * 读取文件夹下的第一层子目录
 * @param {string} path 路径
 */
ns.readdir('/src/playerData');

/**
 * 删除文件夹
 * @param {string} path 路径
 */
ns.rmdir('/src/playerData');

/**
 * 将文本内容写入到文件的最后
 * @param {string} path 路径
 * @param {string} content 文本内容
 */
ns.appendFile('/usr/.config/NomenSQLiteConfig.env','tables = "{}"');

/**
 * 重命名文件或文件夹
 * @param {string} path 路径
 * @param {string} newname 新名字
 */
ns.rename('/src/playerData/nomen.json','nomenyyds.json');
