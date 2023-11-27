// 未完成
class EasyDatabase {
    static get defaultConfig() {
        return {
            NomenSQLite: null
        }
    };
    static requiredVersion = "1.2.4";
    static get version() {
        return "1.0.0".split(".").map(v => Number(v));
    };
    static Table = class Table {
        constructor(father){
            this.father = father;
        }
    };
    constructor(c) {
        this.config = {};
        this.event = {};
        this._listen(["onlog"])
        if (typeof c !== "object" || Array.isArray(c) || c === null) {
            throw this.log("error", "传入配置预期应该是对象");
        }
    }
    log(level, msg) {
        let m = {
            "error": "ERROR",
            "log": "INFO",
            "warn": "WARN"
        };
        this._trigger("onlog", level, msg);
        if (m[level]) console[level](`[EasyDatabase ${m[level]}] ${msg}`);
        if (level === "error") return new Error(`[EasyDatabase ${m[level]}] ${msg}`);
    }
    _config(c) {
        Object.assign(this.config, this.constructor.defaultConfig, c);
        if (typeof this.config.NomenSQLite !== "object " || Array.isArray(this.config.NomenSQLite) || this.config.NomenSQLite === null) {
            throw this.log("error", "需要传入NomenSQLite类构造器");
        }
        if (!this._moreThan(EasyDatabase.requiredVersion.split(".").map(v => Number(v)), this.config.NomenSQLite.version)) {
            throw this.log("error", `NomenSQLite版本错误，预期应该大于版本${EasyDatabase.requiredVersion}, 实际得到版本${this.config.NomenSQLite.version.join(".")}`);
        }
        return this;
    }
    _moreThan(a, b) {
        return a.every((v, i) => b[i] >= v);
    }
    _trigger(type, ...args) {
        if (this.event[type]) this.event[type].forEach(v => v(...args))
    }
    _listen(types) {
        types.forEach(v => {
            if (!this.event[v]) this.event[v] = [];
        });
    }
    on(type, c) {
        this._listen([type]);
        if (typeof c === "function") this.event[type].push(c);
    }
}



