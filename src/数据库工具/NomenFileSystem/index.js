
class NomenFileSystem extends NomenSQLite {
    constructor() {
        super();
        if (NomenFileSystem.fsinstance) return NomenFileSystem.fsinstance;
        NomenFileSystem.fsinstance = this;
    }
    static async launch() {
        let NSqlite = await super.launch({
            'NomenFileSystemMain': [
                { name: 'type', type: super.DataType.TEXT, notnull: true },
                { name: 'path', type: super.DataType.TEXT, notnull: true },
                { name: 'parent', type: super.DataType.TEXT, notnull: true },
                { name: 'creationdate', type: super.DataType.TEXT, notnull: true },
                { name: 'property', type: super.DataType.TEXT, notnull: true },
                { name: 'owner', type: super.DataType.TEXT },
                { name: 'file', type: super.DataType.TEXT },
            ]
        }, super.LaunchAction.CREATE_OR_LAUNCH, (v, r) => { if (r.length) throw this.ErrorGenerator('0', r) });
        if (!this.fsinstance) this.fsinstance = new this();
        this.operator = NSqlite.operate('NomenFileSystemMain');
        return this.fsinstance;
    }
    static fsinstance = null;
    fs = {
        fileType: NomenFileSystem.fileType,
        ErrorGenerator: NomenFileSystem.ErrorGenerator,
        get operator(){
            return NomenFileSystem.operator;
        },
        pathSolver(path) {
            if (typeof path == "string") {
                if (path.startsWith('.')) path = path.substring(1);
                if (!path.startsWith('/')) path = `/${path}`;
            }
            this._pathParser(path);
            return path;
        },
        filePropertyGenerator(property) {
            let init = {
                readonly: false,
            }
            Object.assign(init, property);
            return init;
        },
        _pathParser(path) {
            let p = path.split('/').slice(0, -1).join('/');
            let c = path.split('/').slice(-1);
            if (/[/:?"<>|~'\\*]/g.test(c)) throw NomenFileSystem.ErrorGenerator("-2");
            if (!c.length) throw NomenFileSystem.ErrorGenerator("-3");
            return { parentFolder: p.length ? p : '/', currentFile: c[0] }
        },
        async readFile(path) {
            if (typeof path != "string") throw NomenFileSystem.ErrorGenerator("-1");
            let result = await this.operator.select('path', this.pathSolver(path));
            if (result.length) return result[0].file;
            else throw NomenFileSystem.ErrorGenerator("1");
        },
        async writeFile(path, content, readonly = false) {
            path = this.pathSolver(path);
            if (typeof path != "string" || typeof content !== "string") throw NomenFileSystem.ErrorGenerator("-1");
            let cpath = this._pathParser(path);
            let ctn = {
                type: this.fileType['file'],
                path,
                parent: cpath.parentFolder,
                creationdate: Date.now(),
                property: JSON.stringify(this.filePropertyGenerator({ readonly })),
            };
            if (content) ctn.file = content;
            let prt = await this.operator.select('path', cpath.parentFolder);
            if (cpath.parentFolder !== '/' && (!prt.length || prt[0].type != this.fileType['folder'])) throw NomenFileSystem.ErrorGenerator("2");
            let crt = await this.operator.select('path', path);
            if (crt[0] && crt[0].type == this.fileType['folder']) throw NomenFileSystem.ErrorGenerator("3");
            if (crt.length) await this.operator.update(`path=${path}`, ctn);
            else await this.operator.insert(ctn);
            return path;
        },
        async mkdir(path, readonly = false) {
            path = this.pathSolver(path);
            if (typeof path != "string" || path=='/') throw this.ErrorGenerator("-1");
            let fd = await this.operator.select('path', path);
            let cpath = this._pathParser(path);
            if (fd.length && fd[0].type == this.fileType['file']) throw this.ErrorGenerator("3");
            if (!fd.length) {
                if (cpath.parentFolder != '/' && !(await this.operator.select('path', cpath.parentFolder)).length) {
                    await this.mkdir(cpath.parentFolder);
                }
                await this.operator.insert({
                    type: this.fileType['folder'],
                    path,
                    parent: cpath.parentFolder,
                    creationdate: Date.now(),
                    property: JSON.stringify(this.filePropertyGenerator({ readonly })).replace(/"/g, '\\"'),
                });
            }
            return path;
        },
        async unlink(path) {
            if (typeof path != "string") throw this.ErrorGenerator("-1");
            return await this.operator.remove('path', this.pathSolver(path));
        },
        async readdir(path) {
            path = this.pathSolver(path);
            if (typeof path != "string") throw this.ErrorGenerator("-1");
            if(path=='/')return (await this.operator.select('parent', '/')).map(v=>v.path);
            let parentFolder = await this.operator.select('path', path);
            if (!parentFolder.length) throw this.ErrorGenerator("2");
            if(parentFolder.length && parentFolder[0].type == NomenFileSystem.fileType["file"])throw this.ErrorGenerator("3");
            return (await this.operator.select('parent', path)).map(v => v.path);
        },
        async rmdir(path) {
            path = this.pathSolver(path);
            if (typeof path != "string") throw this.ErrorGenerator("-1");
            let targetFolder = await this.operator.select('path', path);
            if (!targetFolder.length) throw this.ErrorGenerator("2");
            let childFolder = await this.operator.select('parent', path);
            if (childFolder.length) {
                for (let i = 0; i < childFolder.length; i++) {
                    if ((await this.operator.select('parent', childFolder[i].path)).length) await this.rmdir(childFolder[i].path);
                    await this.operator.remove('path', childFolder[i].path);
                }
            }
            await this.operator.remove('path', path);
            return path;
        },
        async appendFile(path, content) {
            path = this.pathSolver(path);
            if (typeof path != "string") throw this.ErrorGenerator("-1");
            let tf = await this.operator.select('path', path);
            if (!tf.length) throw this.ErrorGenerator("1");
            if (tf[0].type == NomenFileSystem.fileType["folder"]) throw this.ErrorGenerator("3");
            await this.writeFile(path, tf[0].file.concat(content));
            return path;
        },
        async rename(path, newname) {
            path = this.pathSolver(path);
            if (typeof path != "string") throw this.ErrorGenerator("-1");
            let tt = await this.operator.select('path', path);
            if (!tt.length) throw this.ErrorGenerator("1");
            if (tt[0].type == NomenFileSystem.fileType["file"]) {
                await this.operator.update(`path=${path}`, { path: path.replace(/\/[^\/]*$/, '/' + newname) });
            } else if (tt[0].type == NomenFileSystem.fileType["folder"]) {
                function cname(rname, match) {
                    for (let i = 0; i < rname.length; i++) {
                        if (match[i]&&(match[i] != rname[i])) {
                            rname[i] = match[i]
                            break;
                        }
                    }
                    return rname;
                }
                function inpath(rname, match) {
                    for (let i = 0; i < rname.length; i++) {
                        if (match[i]&&(match[i] != rname[i])) return true;
                    }
                    return false;
                }
                let allFile = await this.operator.select('*');
                for (let i = 0; i < allFile.length; i++) {
                    if(!inpath(allFile[i].path.split('/').slice(1),path.split('/').slice(1))){
                        console.log(allFile[i].path+' // '+`/${cname(allFile[i].path.split('/').slice(1),path.replace(/\/[^\/]*$/, '/' + newname).split('/').slice(1)).join('/')}`)
                        await this.operator.update(`path=${allFile[i].path}`, {
                            path: `/${cname(allFile[i].path.split('/').slice(1),path.replace(/\/[^\/]*$/, '/' + newname).split('/').slice(1)).join('/')}`,
                            parent: `/${cname(allFile[i].path.split('/').slice(1),path.replace(/\/[^\/]*$/, '/' + newname).split('/').slice(1)).join('/')}`
                        });
                    }
                }
            }
            return path;
        },
    }
    static fileType = {
        'file': 'file',
        'folder': 'folder'
    }
    static ErrorGenerator(errorcode, errMessage) {
        return new Error(`[NomenFileSystem: ErrorCode:${errorcode}] ${NomenFileSystem.ErrorCode[errorcode]}${errMessage ? ' : ' + errMessage : ''}`)
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
}


/**
 * 读取文件内容
 * @param {string} path 路径
 */
ns.fs.readFile('/src/playerData/nomen.json');

/**
 * 写入文件内容
 * @param {string} path 路径
 * @param {string} content 文本内容
 */
ns.fs.writeFile('/src/playerData/nomen.json','"{name:\\"Nomen\\",coin:10},bag:[\\"By NomenTeam - Nomen\\",\\"EasyCoding\\"]"');

/**
 * 创建文件夹
 * @param {string} path 文件夹路径，自动创建子文件夹
 */
ns.fs.mkdir('/src/playerData');

/**
 * 删除文件
 * @param {string} path 路径
 */
ns.fs.unlink('/src/playerData/nomen.json');

/**
 * 读取文件夹下的第一层子目录
 * @param {string} path 路径
 */
ns.fs.readdir('/src/playerData');

/**
 * 删除文件夹
 * @param {string} path 路径
 */
ns.fs.rmdir('/src/playerData');

/**
 * 将文本内容写入到文件的最后
 * @param {string} path 路径
 * @param {string} content 文本内容
 */
ns.fs.appendFile('/usr/.config/NomenSQLiteConfig.env','tables = "{}"');

/**
 * 重命名文件或文件夹
 * @param {string} path 路径
 * @param {string} newname 新名字
 */
ns.fs.rename('/src/playerData/nomen.json','nomenyyds.json');
