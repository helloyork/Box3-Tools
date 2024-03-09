/**
 * !info {Project} -来自Nomen
 * NomenPostgre:介绍帖子
 */



class NomenPostgre {
    constructor() {
        if (NomenPostgre.instance) return NomenPostgre.instance;
        NomenPostgre.instance = this;
    }
    static launched = false;
    static async launch(config, action) {
        if (!config) throw new Error("请传入配置参数后重试");
        if (!this.instance) this.instance = new NomenPostgre();
        else return this.instance;
        this.tables = config || {};
        this._data = {};
        if (!Object.keys(this.tables).length) this._data = null;
        Object.keys(this.tables).forEach(v => {
            if (Array.isArray(this.tables[v]) && this.tables[v].length) {
                this._data[v] = [];
                this.tables[v].forEach(r => {
                    if (typeof r.name == "string" && Object.values(this.DataType).includes(r.type)) {
                        this._data[v].push({ name: r.name, type: r.type, notnull: !!r.notnull, unique: !!r.unique, check: r.check || false });
                    }
                });
            }
        });
        console.log(JSON.stringify(this._data));
        if (!Object.keys(this._data).length) return this.instance;
        if (typeof action == "string" && action.includes("create")) {
            for (let i = 0; i < Object.keys(this._data).length; i++) {
                let eString = `CREATE TABLE IF NOT EXISTS "${Object.keys(this._data)[i]}" 
                (${this._data[Object.keys(this._data)[i]].reduce((p, c) => {
        let str = `"${c.name}" ${c.type} ${c.notnull ? "NOT NULL" : ""} ${c.unique ? "UNIQUE" : ""} ${c.check ? "CHECK(" + c.check + ")" : ""}`;
        return p ? p.concat(",", str) : str;
    }, false)})`;
                await (async function (t) {
                    while (true) {
                        try { await t.instance._exec(eString); break; } catch (err) {
                            if (!err.message.includes("timeout")) {
                                throw err;
                            }
                        }
                    }
                    return;
                })(this);
            }
        }
        this.launched = true;
        return this.instance;
    }
    _exec(cmd) {
        return (typeof cmd == "string") ? db.sql([cmd]) : new Promise(resolve => resolve(new TypeError("传入参数有误，预期应该为string")));
    }
    getAllTables() {
        return Object.keys(NomenPostgre._data);
    }
    operate(name) {
        let t = this;
        if (typeof name == "string" && NomenPostgre.launched) return {
            select(column, value) {
                return t._exec(`SELECT * FROM "${name}" ${column == "*" ? "" : (`WHERE "${column}" = ` + `'${value}'`)}`);
            },
            remove(column, value) {
                return t._exec(`DELETE FROM "${name}" ${column == "*" ? "" : (`WHERE "${column}" = ` + `'${value}'`)}`);
            },
            insert(value) {
                if (Object.prototype.toString.call(value) == "[object Object]" && Object.keys(value).length) {
                    let eString = `(${Object.keys(value).map(v => `"${v}"`).join(",")}) VALUES(${Object.values(value).map(v => (typeof v == "number") ? v : `'${v}'`).join(",")})`;
                    return t._exec(`INSERT INTO "${name}" ${eString}`);
                } else return null;
            },
            update(column, value) {
                if (Object.prototype.toString.call(value) == "[object Object]" && Object.keys(value).length && typeof column == "string" && column.includes("=")) {
                    let eArr = [];
                    Object.entries(value).forEach(([k, v]) => eArr.push(`"${k}" = '${v}'`));
                    let aString = `${column == "*" ? "" : "WHERE \"" + column.split("=")[0] + "\" = '" + column.split("=")[1] + "'"}`;
                    return t._exec(`UPDATE "${name}" SET ${eArr} ${aString}`);
                } else return null;
            }
        };
        return {};
    }
    static instance = null;
    static LaunchAction = {
        CREATE_OR_LAUNCH: "createlaunch",
        LAUNCH: "launch"
    };
    static DataType = {
        NUMBER: "INTEGER",
        BIGINT: "BIGINT",
        MONEY: "MONEY",
        FLOAT: "REAL",
        TEXT: "TEXT",
        NULL: "NULL",
        BOOLEAN: "BOOLEAN",
        POINT: "POINT",
        LINE: "LINE",
        LSEG: "LSEG",
        BOX: "BOX",
        PATH: "PATH",
        POLYGON: "POLYGON",
        CIRCLE: "CIRCLE",
        CIDR: "CIDR",
        INET: "INET",
        JSON: "JSON"
    };
}


const Tables = {
    "Nomenawa": [
        { name: "coin", type: NomenPostgre.DataType.NUMBER, notnull: true },
        { name: "bag", type: NomenPostgre.DataType.TEXT, notnull: false }
    ],
    "Nomenawa2": [
        { name: "coin", type: NomenPostgre.DataType.NUMBER, notnull: true, check: "coin > 10" },
        // check属性，如果coin大于10则可以插入，否则抛出错误
        // notnull属性，如果为true，则该列无法插入null值，这意味着insert方法中为插入该列的值则会抛出错误
        { name: "bignumber", type: NomenPostgre.DataType.BIGINT },
        // BIGINT类型，大型整数
        { name: "uniquecolumn", type: NomenPostgre.DataType.TEXT, unique: true }
        // unique值，唯一，如果插入已经存在的值会抛出错误
    ],
};


(async () => {
    let Nomen = await NomenPostgre.launch(Tables, NomenPostgre.LaunchAction.CREATE_OR_LAUNCH);

    let NomenTable = Nomen.operate("Nomenawa2"); // 初始化该表格的管理器

    await NomenTable.insert({ coin: 11, bignumber: "1145141919810", uniquecolumn:"NOMENYYDS" }); 
    // 插入一个数据，请注意，如果缺少具有unique或not null约束列的值的话会抛出报错

    await NomenTable.update("coin=11",{bignumber:"1234567890",uniquecolumn:"NomenYYDS!"}); // 更新coin=11的列上的两个属性

    console.log(JSON.stringify(await NomenTable.select("coin","11"))); // 查询coin为11的值

    await NomenTable.remove("coin",11);  // 删除coin为11的所有列

    console.log(JSON.stringify(await NomenTable.select("*"))); // 查看所有的数据

    console.log(Nomen.getAllTables()); // 查看所有的受管理的表格
})();

module.exports = {
    NomenPostgre
};

