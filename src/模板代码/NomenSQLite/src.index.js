/**
 * !info {Project} -来自Nomen
 * NomenSQLite:介绍帖子https://shequ.codemao.cn/wiki/forum/539617
 */



class NomenSQLite {
    constructor() {
        if (NomenSQLite.instance) return NomenSQLite.instance;
        NomenSQLite.instance = this;
    }
    static launched = false;
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
        this.launched = true;
        if (typeof callback == "function") callback(null, errMessage);
        return this.instance;
    }
    _exec(cmd) {
        return (typeof cmd == 'string') ? db.sql([cmd]) : new Promise(resolve => resolve(new TypeError('传入参数有误，预期应该为string')))
    }
    getAllTables() {
        return Object.keys(NomenSQLite._data);
    }
    async getAllTablesInDatabase() {
        return (await this._exec(`SELECT * FROM sqlite_master`)).map(v => v.name)
    }
    operate(name) {
        let t = this;
        if (typeof name == "string" && NomenSQLite.launched) return {
            select(column, value) {
                return t._exec(`SELECT * FROM "${name}" ${column == "*" ? `` : (`WHERE "${column}" = ` + (typeof value == "number") ? value : `"${value}"`)}`)
            },
            remove(column, value) {
                return t._exec(`DELETE FROM "${name}" ${column == "*" ? `` : (`WHERE "${column}" = ` + (typeof value == "number") ? value : `"${value}"`)}`)
            },
            insert(value) {
                if (Object.prototype.toString.call(value) == '[object Object]' && Object.keys(value).length) {
                    let eString = `(${Object.keys(value).map(v => `"${v}"`).join(',')}) VALUES(${Object.values(value).map(v => (typeof v == "number") ? v : `"${v}"`).join(',')})`;
                    return t._exec(`INSERT INTO "${name}" ${eString}`);
                } else return null;
            },
            update(column, value) {
                if (Object.prototype.toString.call(value) == '[object Object]' && Object.keys(value).length && typeof column == "string" && column.includes('=')) {
                    let eArr = [];
                    Object.entries(value).forEach(([k, v]) => eArr.push(`"${k}" = "${v}"`));
                    let aString = `${column == "*" ? "" : 'WHERE "' + column.split('=')[0] + '"="' + column.split('=')[1] + '"'}`;
                    console.log(`UPDATE "${name}" SET ${eArr} ${aString}`)
                    return t._exec(`UPDATE "${name}" SET ${eArr} ${aString}`);
                } else return null;
            }
        }
        return {};
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
        NULL: 'NULL',
        BLOB: 'BLOB'
    }
}

module.exports = {
    NomenSQLite
}

