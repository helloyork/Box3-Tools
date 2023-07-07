class NomenDBCore {
    constructor(config) {
        if (!config) throw new Error("The config is required");
        if (!config.name) throw new Error("The table name is required");
        if (!["sqlite", "postgre"].includes(config.db)) throw new Error("The database type should be \"postgre\" or \"sqlite\"");
        let { executor, name, db, query, debug } = config;
        this._sql = typeof executor == "function" ? executor : db.sql;
        this._name = name;
        this.db = db;
        this.query = query || [];
        this.debug = debug || true;
        this._limit = undefined;
        this._offset = undefined;
        this._order = [];
    }
    where(...arg) {
        let operators = {
            "postgre": ["=", "!=", "<>", "<", ">", "<=", ">="],
            "sqlite": ["==", "=", "!=", "<>", "<", ">", "<=", ">=", "!<", "!>"]
        }
        if (arg.length == 3 && operators[this.db].includes(arg[1]) && typeof arg[0] == "string") {
            this.query.push(arg);
        } else if (arg.length == 1) {
            for (let n of Object.keys(arg[0])) {
                this.query.push([n, ({
                    "postgre": "=",
                    "sqlite": "="
                })[this.db], arg[0][n]]);
            };
        }
        return this;
    }
    insert(value) {
        let strs = [], params = [], k = this;
        if (Array.isArray(value)) {
            strs = [`INSERT INTO ${this._name} VALUES (`];
            params = value;
            for (let i = 0; i < Object.values(value).length - 1; i++) {
                strs.push(",")
            }
            strs.push(")");
        } else {
            strs = [`INSERT INTO ${this._name} (${Object.keys(value).join(",")}) VALUES (`];
            params = Object.values(value);
            for (let i = 0; i < Object.values(value).length - 1; i++) {
                strs.push(",")
            }
            strs.push(")");
        }
        return new Promise(r => {
            this._exec(strs.join("?"), params)
                .then(() => r(k));
        });
    }
    select(query) {
        let req = Array.isArray(query) ? query.join(",") : query;
        let { params, strs } = this._genSelector(this.query);
        console.log(JSON.stringify({ params, strs }))
        let output = `SELECT ${req} FROM ${this._name} ${this.query.length ? "WHERE " + (strs[0] ? strs.join("") : "") : ""}`
        output = output.concat(` ${this._order.length ? `ORDER BY ` + this._order.map(v => v.key + " " + v.type).join(",") : ""} ` +
            `${this._limit ? "LIMIT " + Number(this._limit) : ""} ${(this._offset && this._limit) ? "OFFSET " + Number(this._offset) : ""}`)
        console.log(JSON.stringify(strs))
        return this._exec(output, params);
    }
    update(...value) {
        let exc = [], mparams = [], k = this;
        if (value.length == 2) {
            exc.push(`UPDATE ${this._name} SET ${value[0]} ${value[1]}`);
            mparams.push(value[2]);
        } else {
            for (let i = 0; i < Object.keys(value[0]).length; i++) {
                exc.push((i == 0 ? `UPDATE ${this._name} SET ` : ",") + `${Object.keys(value[0])[i]}=`);
                mparams.push(value[0][Object.keys(value[0])[i]]);
            }
        }
        if (this.query.length) {
            let { params, strs } = this._genSelector(this.query);
            strs[0] = (` WHERE `).concat(strs[0]);
            exc = exc.concat(strs);
            mparams = mparams.concat(params);
        }
        return new Promise(r => {
            k._exec(exc.join("?"), mparams).then(() => r(k))
        })
    }
    del() {
        let k = this;
        if (this.query.length) {
            let { params, strs } = this._genSelector(this.query);
            strs[0] = (`DELETE FROM ${this._name} WHERE `).concat(strs[0]);
            return new Promise(r => {
                k._exec(strs.join("?"), params).then(() => r(k))
            })
        } else {
            return new Promise(r => {
                k._exec(`DELETE FROM ${k._name}`).then(() => r(k));
            })
        }
    }
    _genSelector(query) {
        let params = [], strs = [], f = false;
        query.forEach(v => {
            if (v.length == 1) {
                strs[strs.length - 1] = strs[strs.length - 1].concat(" AND ", v[0]);
            } else if (v.length > 1) {
                strs.push((f ? " AND " : (f = true, "")) + v[0] + v[1] + "?");
                params.push(v[2]);
            }
        });
        return { params, strs }
    }
    order(...order) {
        if (order.length == 2 && ["ASC", "DESC"].includes(order[1])) {
            this._order.push({ key: order[0], type: order[1] })
        } else if (order.length == 1) {
            Object.keys(order[0]).filter(v => ["ASC", "DESC"].includes(order[0][v])).forEach(k => {
                this._order.push({ key: k, type: order[0][k] });
            });
        }
        return this;
    }
    limit(limit) {
        this._limit = limit;
        return this;
    }
    offset(offset) {
        this._offset = offset;
        return this;
    }
    addStringQuery(query) {
        this.log(1, `Do not use method addStringQuery to add query, it is unsafe`);
        this.query.push(query.toString ? query.toString() : query);
        return this;
    }
    async _exec(ex, params) {
        console.log(ex)
        let result = await this._sql([...ex.split(/(?<!\\)[\?](?=(?:[^"]*"[^"]*")*[^"]*$)/g)], ...params || []);
        if (this.handler) this.handler(result);
        return this.hook ? this.hook(result) : result;
    }
    log(level, message) {
        let levelsMessage = ["INFO", "WARN", "ERROR"];
        if (this.debug || level == 2) {
            console[["log", "warn", "error"][level]](`NomenDBCore [${levelsMessage[level]}] ${message}`);
        }
    }
}

module.exports.NomenDBCore = NomenDBCore;