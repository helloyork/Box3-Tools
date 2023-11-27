/**
 * !info {Project} -来自Nomen
 * @version 1.2.4
 * NomenSQLite SQL数据管理系统
 */

class NomenSQLite {
    constructor() {
        if (NomenSQLite.instance) return NomenSQLite.instance;
        NomenSQLite.instance = this;
    }
    static launched = false;
    static get version(){
        return "1.2.4".split(".").map(v=>Number(v));
    };
    static async launch(config, action, callback) {
        if (!config) throw new Error('请传入配置参数后重试');
        if (!this.instance) this.instance = new NomenSQLite();
        else return this.instance;
        this.tables = config || {};
        this._data = {};
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
        console.log(JSON.stringify(this._data));
        if (!Object.keys(this._data).length) return this.instance;
        let errMessage = '';
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
        this.launched = true;
        if (typeof callback == "function") callback(null, errMessage);
        return this.instance;
    }
    _exec(cmd, p) {
        return (typeof cmd == 'string') ? db.sql.apply(null, [cmd.split(/(?<!\\)[\?](?=(?:[^"]*"[^"]*")*[^"]*$)/g), ...(p ? p : [])]) : new Promise(resolve => resolve(new TypeError('传入参数有误，预期应该为string')))
    }
    getAllTables() {
        return Object.keys(NomenSQLite._data);
    }
    async getAllTablesInDatabase() {
        return (await this._exec(`SELECT * FROM sqlite_master`)).map(v => v.name)
    }
    operate(name) {
        let t = this;
        if (typeof name == "string") return {
            select(column, value) {
                let p = [];
                return t._exec(`SELECT * FROM "${name}" ${column == "*" ? `` : (`WHERE "${column}" = ` + (p.push(value), "?"))}`, p)
            },
            remove(column, value) {
                let p = [];
                return t._exec(`DELETE FROM "${name}" ${column == "*" ? `` : (`WHERE "${column}" = ` + (p.push(value), '?'))}`, p)
            },
            insert(value) {
                if (Object.prototype.toString.call(value) == '[object Object]' && Object.keys(value).length) {
                    let p = [];
                    let eString = `(${Object.keys(value).map(v => `"${v}"`).join(',')}) VALUES(${Object.values(value).map(v => { p.push(v); return `?`; }).join(',')})`;
                    return t._exec(`INSERT INTO "${name}" ${eString}`, p);
                } else return null;
            },
            update(column, value) {
                if (Object.prototype.toString.call(value) == '[object Object]' && Object.keys(value).length && typeof column == "string" && column.includes('=')) {
                    let eArr = [], p = [];
                    Object.entries(value).forEach(([k, v]) => eArr.push(`"${k}" = ${(p.push(v), '?')}`));
                    let aString = `${column == "*" ? "" : 'WHERE "' + column.split('=')[0] + '"=' + (p.push(column.split('=')[1]), '?')}`;
                    return t._exec(`UPDATE "${name}" SET ${eArr} ${aString}`, p);
                } else return null;
            }
        }
        return {};
    }
    static getInstance() {
        return this.instance ? this.instance : new this();
    }
    static instance = null;
    static LaunchAction = {
        CREATE_OR_LAUNCH: 'createlaunch',
        LAUNCH: 'launch'
    }
    static DataType = {
        NUMBER: 'INTEGER',
        FLOAT: 'REAL',
        TEXT: 'TEXT',
        NULL: 'NULL'
    }
}

module.exports = {
    NomenSQLite
}
