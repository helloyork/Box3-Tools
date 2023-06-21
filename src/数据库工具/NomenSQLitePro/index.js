/**
 * !info {Project} -来自Nomen
 * NomenSQLitePro:介绍帖子https://shequ.codemao.cn/community/539869
 */




class NomenSQLitePro {
    constructor() {
        if (NomenSQLitePro.instance) return NomenSQLitePro.instance;
        NomenSQLitePro.instance = this;
    }
    static instance = null;
    static plugins = {};
    static pluginUsing = false;
    static LaunchAction = {
        CREATE_OR_LAUNCH: 'createlaunch',
        LAUNCH: 'launch'
    }
    static DataType = {
        NUMBER: 'INTEGER',
        FLOAT: 'REAL',
        TEXT: 'TEXT',
        NULL: 'NULL',
        BLOB: 'BLOB'
    }
    static launched = false;
    static debug = false;
    static getInstance() {
        if (!this.instance) new this();
        return this.instance;
    }
    static async launch(config, action, callback) {
        if (!config) throw new Error('请传入配置参数后重试');
        if (!this.instance) this.instance = new NomenSQLitePro();
        else return this.instance;
        let time = Date.now()
        this.tables = config.tables || {};
        this._data = {};
        this.debug = config.debug || false;
        this.warn = config.warn || false;
        this.info = config.info || false;
        this.pluginUsing = Array.isArray(config.plugins);
        if (!Object.keys(this.tables).length) this._data = null;
        Object.keys(this.tables).forEach(v => {
            if (Array.isArray(this.tables[v]) && this.tables[v].length) {
                this._data[v] = [];
                this.tables[v].forEach(r => {
                    if (typeof r.name == "string" && Object.values(this.DataType).includes(r.type)) {
                        this._data[v].push({ name: r.name, type: r.type, notnull: r.notnull || false });
                    }
                })
            }
        })
        if (NomenSQLitePro.debug) console.log(`[DEBUG]${JSON.stringify(this._data)}`);
        if (!Object.keys(this._data).length) return this.instance;
        if (this.pluginUsing) await this._subscribePlugin(config.plugins);
        let errMessage = null;
        if (typeof action == "string" && action.includes('create')) {
            for (let i = 0; i < Object.keys(this._data).length; i++) {
                let eString = `CREATE TABLE IF NOT EXISTS "${Object.keys(this._data)[i]}" 
                (${this._data[Object.keys(this._data)[i]].reduce((p, c) => {
                    let str = `"${c.name}" ${c.type} ${c.notnull ? 'NOT NULL' : ''}`;
                    return p ? p.concat(',', str) : str;
                }, false)})`;
                try { await this.instance._exec(eString); } catch (err) {
                    errMessage.concat(err);
                }
            }
        }
        if (config.autoUpdateColumn) {
            try { await this.instance.update() } catch (err) {
                console.error(`[ERROR]SQL NomenSQLitePro Error: ${err}`)
            }
        }
        this.launched = true;
        if (typeof callback == "function") callback(null, errMessage);
        if (NomenSQLitePro.info) console.log(`[INFO] NomenSQLitePro启动完成 耗时：${Date.now() - time}ms`)
        return this.instance;
    }
    _exec(cmd) {
        return (typeof cmd == 'string') ? db.sql([cmd]) : new Promise(resolve => resolve(new TypeError('传入参数有误，预期应该为string')))
    }
    async update() {
        function parseSql(sql) {
            let _sql = sql.match(/\(([\s\S]*)\)/)[1].replace(/\n/g, '');
            const regex = /"([^"]+)"\s+([^,]+)(?:,|$)/g;
            const result = [];
            let match;
            while ((match = regex.exec(_sql)) !== null) {
                result.push({ name: match[1], rule: match[2] });
            }
            return result;
        }
        function diffArray(s, f) {
            return s.concat(f).reduce(function (c, r) {
                if (!s.includes(r) || !f.includes(r)) c.push(r);
                return c;
            }, []);
        }
        let result = await db.sql([`SELECT * FROM sqlite_master`]);
        if (NomenSQLitePro.info) console.log(`[INFO]Start Update`);
        for (let i = 0; i < result.length; i++) {
            if (NomenSQLitePro._data[result[i].name] && diffArray(parseSql(result[i].sql).map(v => v.name), NomenSQLitePro._data[result[i].name].map(v => v.name)).length) {
                if (NomenSQLitePro.debug) console.log(`[DEBUG]${result[i].name} ${JSON.stringify(parseSql(result[i].sql))} ${result[i].sql}`)
                await this._updateColumn(NomenSQLitePro._data[result[i].name], result[i].name);
            }
        }
        if (NomenSQLitePro.info) console.log(`[INFO]Update Finish`)
    };
    async _updateColumn(data, name) {
        function g(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            for (var i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
            return result;
        }
        let tbName = g(16);
        await this._exec(`BEGIN TRANSACTION`);
        if (NomenSQLitePro.warn) console.warn(`[WARNING]SQL TABLE ${name} 已被 NomenSQLitePro(${tbName})锁定`)
        await this._exec(`CREATE TABLE IF NOT EXISTS "${tbName}" (${data.reduce((p, c) => {
            let str = `"${c.name}" ${c.type} ${c.notnull ? 'NOT NULL' : ''}`;
            return p ? p.concat(',', str) : str;
        }, false)});`);
        await this._exec(`INSERT INTO ${tbName} SELECT ${data.reduce((p, c) => {
            let str = `"${c.name}"`;
            return p ? p.concat(',', str) : str;
        }, false)} FROM ${name};`);
        await this._exec(`DROP TABLE ${name};`);
        await this._exec(`ALTER TABLE ${tbName} RENAME TO ${name};`);
        await this._exec(`COMMIT`);
        if (NomenSQLitePro.warn) console.warn(`[WARNING]SQL TABLE ${name} 已重写并释放`)
    }
    operate(name) {
        let t = this;
        if (typeof name == "string") return {
            select(column, value) {
                return t._exec(`SELECT * FROM "${name}" ${column == "*" ? `` : (`WHERE "${column}" = ` + `"${value}"`)}`);
            },
            remove(column, value) {
                return t._exec(`DELETE FROM "${name}" ${column == "*" ? `` : (`WHERE "${column}" = ` + `"${value}"`)}`)
            },
            insert(value) {
                if (Object.prototype.toString.call(value) == '[object Object]' && Object.keys(value).length) {
                    let eString = `(${Object.keys(value).map(v => `"${v}"`).join(',')}) VALUES(${Object.values(value).map(v => `"${v}"`).join(',')})`;
                    return t._exec(`INSERT INTO "${name}" ${eString}`);
                } else return null;
            },
            update(column, value) {
                if (Object.prototype.toString.call(value) == '[object Object]' && Object.keys(value).length && typeof column == "string" && column.includes('=')) {
                    let eArr = [];
                    Object.entries(value).forEach(([k, v]) => eArr.push(`"${k}" = "${v}"`));
                    let aString = `${column == "*" ? "" : 'WHERE "' + column.split('=')[0] + '"="' + column.split('=')[1] + '"'}`;
                    return t._exec(`UPDATE "${name}" SET ${eArr} ${aString}`);
                } else return null;
            }
        }
        return {};
    }
    static async evalAll(fc, cg) {
        let rc = [];
        Object.keys(this.plugins).map(v => (this.plugins[v][fc] || (() => { }))).forEach(v => rc.push(new Promise(r => r(v({ NomenSQLitePro, ...cg })))));
        let result = await new Promise((resolve, reject) => {
            Promise.all([...rc, new Promise((r, j) => setTimeout(() => j('Time out'), 12 * 1000))])
                .then(() => resolve({ ok: true }))
                .catch(reason => reject({ reason, ok: false }));
        });
        if (!result.ok && result.reason == 'Time out') console.error('[ERROR] NomenSQLitePro Plugins Time out 插件执行超时');
        else if (!result.ok) console.error(`[ERROR] NomenSQLitePro Plugins Error 插件执行错误\n${result.reason}`);
        return;
    }
    static _subscribePlugin(plugins) {
        if (NomenSQLitePro.warn) console.warn(`[WARNING] 正在尝试载入插件，NomenSQLitePro无法保证插件是否具有危害，NomenSQLitePro对于载入具有危害的插件导致的问题不负责任`);
        try {
            if (!plugins || !Array.isArray(plugins) || !plugins.length || plugins.some(v => typeof v != "object")) return;
            plugins.forEach((v, i) => {
                if (typeof v.name == "string" && this.plugins[v.name] === undefined && typeof v.version == "string") {
                    this.plugins[v.name] = {};
                    Object.defineProperty(this.plugins[v.name], 'id', {
                        get() { return i },
                        set(v) { return v }
                    });
                }
                else {
                    if (NomenSQLitePro.warn) console.warn(`[WARNING] ID为${i}的插件载入失败，请检查插件注册格式`)
                    return;
                }
                Object.assign(this.plugins[v.name], { ...v, log: "" });
                if (NomenSQLitePro.warn && (this.plugins[v.name].onLoad && (this.plugins[v.name].onLoad.toString.includes('delete ') || this.plugins[v.name].onLoad.toString.includes('while')))) {
                    console.warn(`[WARNING] 插件"${v.name}"(ID:${i})可能存在有害行为，请进行检查`);
                };
                if (this.plugins[v.name].onLoad) this.plugins[v.name].onLoad({ NomenSQLitePro });
                if (NomenSQLitePro.info) console.log(`[INFO] 插件"${v.name}"(ID:${i})载入成功`);
            })
        } catch (err) {
            console.error(`[ERROR]SQL NomenSQLitePro 尝试载入插件时发生错误: ${err}`);
        }
    }
}


const tablesData = {
    'Nomenawa2': [
        { name: 'userkey', type: NomenSQLitePro.DataType.TEXT, notnull: true },
        { name: 'coin', type: NomenSQLitePro.DataType.NUMBER },
        { name: 'bag', type: NomenSQLitePro.DataType.TEXT }
    ],
    'Nomenawa3': [
        { name: 'userkeyawa4', type: NomenSQLitePro.DataType.TEXT, notnull: true },
        { name: 'coin2', type: NomenSQLitePro.DataType.NUMBER },
        { name: 'bag', type: NomenSQLitePro.DataType.TEXT }
    ],
};
const NomenSQLiteProConfig = {
    debug: false, /* 是否显示调试信息 */
    warn: false, /* 是否显示警告信息 */
    info: false, /* 是否显示标识信息 */
    autoUpdateColumn: false, /* 是否自动更新表格 */
    tables: tablesData, /* 传入表格结构 */
    plugins: [], /* 传入插件Obj信息[] */
};

const ExamplePlugin = {
    name:"ExamplePlugin",
    version:"v1.0.0",
    onLoad(){
        console.log('hi! Plugin loading');
    }
}

await NomenSQLitePro.launch(NomenSQLiteProConfig, NomenSQLitePro.LaunchAction.CREATE_OR_LAUNCH, (e, r) => console.log(r));



