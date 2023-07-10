/**
 * !info {Project} -来自Nomen
 * @version 1.0.0
 * @requires NomenSQLite
 * @requires NomenDBCore
 * 玩家数据远程管理的便捷方案
 */


class NomenSPM {
    constructor(config) {
        let nspm = NomenSPM;
        let on, t = this;
        this.tableName = "spmplayerdata";
        let dbcoreConfig = {
            executor: db.sql,
            name: this.tableName,
            db: "sqlite"
        };
        ["NomenDBCore", "NomenSQLite"].forEach(v => {
            let c = t.nrequire(`./${v}.js`);
            if (!c.module) {
                on = true;
                console.error(`${v} should export from "${v}.js"`);
            } else {
                t[v] = c.module[v];
            }
        });
        if (on) return;
        if (!config || !Array.isArray(config.fields)) throw new Error("Config Invalid");
        let { fields, init } = config;
        this.fields = fields || [];
        this.init = init || [];
        this.state = false;
        if (!nspm.getInstance()) nspm.instance = this;
        this.load = async function (_this) {
            if (!t.state) await t._init();
            let e = _this, result = await new t.NomenDBCore(dbcoreConfig).where({
                userkey: e.player.userKey
            }).limit(1).select("*");
            return new Promise(c => {
                if (result.length) {
                    let res = JSON.parse(result[0].data)
                    fields.forEach(v => {
                        if (res[v] !== undefined) e[v] = res[v]
                        else e[v] = init[v];
                    });
                    c({ data: res });
                } else {
                    c({ data: null });
                }
            })
        };
        this.init = async function (_this, data) {
            if (!t.state) await t._init();
            let e = _this, r = await new t.NomenDBCore(dbcoreConfig).where({
                userkey: e.player.userKey
            }).limit(1).select("*");
            if (r.length) return;
            await new t.NomenDBCore(dbcoreConfig).insert({
                userkey: e.player.userKey,
                data: JSON.stringify(data || init)
            });
        };
        this.save = async function (_this) {
            if (!t.state) await t._init();
            let e = _this;
            let data = fields.map(v => {
                return e[v] ? e[v] : init[v];
            });
            await new t.NomenDBCore(dbcoreConfig).where({
                userkey: e.player.userKey
            }).update({
                data: JSON.stringify(data)
            });
        };
    }
    static instance;
    static getInstance() {
        return this.instance;
    }
    nrequire(path) {
        try {
            return { module: require(path) }
        } catch {
            return { module: null }
        }
    }
    async _init() {
        if (this.state) return;
        if (!this.NomenSQLite.version || !this.NomenSQLite.version[1] >= 2 || !this.NomenSQLite.version[2] >= 3) throw new Error("NomenSQLite version should be at least 1.2.3 or higher");
        await this.NomenSQLite.launch({
            [this.tableName]: [
                { name: 'userkey', type: this.NomenSQLite.DataType.TEXT, notnull: true },
                { name: 'data', type: this.NomenSQLite.DataType.TEXT },
            ],
        }, this.NomenSQLite.LaunchAction.CREATE_OR_LAUNCH);
        this.state = true;
    }
    async update(userkey, operate) {
        if (!userkey || typeof userkey != "string" || typeof operate != "function") return;
        let t = this;
        function NomenSPMData() {
            this.NomenSPM = t.NomenSPM;
            this.player = {
                userKey: userkey
            }
        }
        Object.keys(NomenSPMData.prototype, Box3Entity.prototype);
        let target = new NomenSPMData;
        await this.load(target);
        let result = await operate(target);
        if (result) {
            if (!t.state) await t._init();
            let e = result;
            let data = this.fields.map(v => {
                return result[v] ? result[v] : t.init[v];
            });
            await new t.NomenDBCore({
                executor: db.sql,
                name: t.tableName,
                db: "sqlite"
            }).where({
                userkey
            }).update({
                data: JSON.stringify(data)
            });
        }
    }
    async del(userkey) {
        if (!this.state) await this._init();
        let r = await new this.NomenDBCore({
            executor: db.sql,
            name: this.tableName,
            db: "sqlite"
        }).where({
            userkey
        }).del();
    }
}

exports.module.NomenSPM = NomenSPM;
