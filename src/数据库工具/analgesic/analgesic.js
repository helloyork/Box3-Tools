/* eslint-disable no-undef */
/**
 * !info {Module} - 来自Nomen
 * 该库不能用于生产环境！尚未进行测试，并且含有大量问题
 */

const DataTypes = {
    STRING: "string",
    NUMBER: "number",
    BOOLEAN: "boolean",
    JSON: "json",
};

class DBError extends Error {
    static Codes = {
        DB_CONFIG_ERROR: "DB_CONFIG_ERROR",
        CONFIG_ERROR: "CONFIG_ERROR",
        DB_ERROR: "DB_ERROR",
        DATA_TYPE_ERROR: "DATA_TYPE_ERROR",
        DATA_UNNULLABLE: "DATA_UNNULLABLE",
        DATA_REPEATED: "DATA_REPEATED",
    };
    static isError = (err) => err instanceof DBError;
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
class Events {
    constructor() {
        this.events = {};
    }
    listen(name, handler) {
        if (!this.events[name]) this.events[name] = [];
        this.events[name].push(handler);
        return {
            cancel: () => this.remove(name, handler)
        };
    }
    emit(name, ...args) {
        if (this.events[name]) this.events[name].forEach(handler => {
            try {
                handler(...args);
            } catch (err) {
                Logger.error(err, err.stack);
            }
        });
    }
    once(name, handler) {
        const f = (...args) => {
            handler(...args);
            this.events[name] = this.events[name].filter(v => v !== f);
        };
        this.listen(name, f);
        return {
            cancel: () => this.remove(name, f)
        };
    }
    remove(name, handler) {
        if (this.events[name]) this.events[name] = this.events[name].filter(v => v !== handler);
    }
}
// @TODO
class DataCache {
    constructor(data, exp, enableCache = true) {
        this.data = data;
        this.exp = exp;
        this.enableCache = enableCache;
    }
    get() {
        return this.data;
    }
    set(data) {
        this.data = data;
    }
    expire() {
        this.exp = 0;
    }
    isExpired() {
        return this.exp <= Date.now();
    }
}
// @TODO
class Data {
    /**
     * @param {Table} parent 
     * @param {string} key 
     * @param {*} value 
     */
    constructor(parent, key, value) {
        this.parent = parent;
        this.key = key;
        this.value = value;
    }
    async save() {
        return await this.parent.setByKey(this.key, this.value);
    }
    async del() {
        return await this.parent.delByKey(this.key);
    }
    async get() {
        return await this.parent.getByKey(this.key);
    }
    getCache() {
        if (this.parent.data[this.key] && this.parent.data[this.key].isExpired()) {
            throw this.parent._reject(DBError.Codes.DATA_EXPIRED, {
                "$0": this.key
            });
        }
        return this.parent.data[this.key]?.get();
    }
    async set(value) {
        return await this.parent.setByKey(this.key, value);
    }
    async exists() {
        return !!(await this.parent.getByKey(this.key));
    }
}
// @TODO
class TaskPool {
    constructor(limit) {
        this.limit = limit || 5;
        this.currentTasks = 0;
        this.queue = [];
        this._whenError = [];
    }
    addTask(task) {
        if (this.currentTasks >= this.limit) {
            this.queue.push(task);
        } else {
            this.executeTask(task);
        }
    }
    whenError(handler) {
        this._whenError.push(handler);
    }
    executeTask(task) {
        this.currentTasks++;
        task().then(() => {
            this.currentTasks--;
            if (this.queue.length > 0) {
                this.executeTask(this.queue.shift());
            }
        }).catch(error => {
            this.whenError.forEach(handler => handler(task, error));
            this.currentTasks--;
            if (this.queue.length > 0) {
                const nextTask = this.queue.shift();
                this.executeTask(nextTask);
            }
        });
    }
}
/**
 * @typedef {{[string]: TableStructure}} TableStructureSet
 */
/**
 * @typedef {Object} TableStructure
 * @property {string} type
 * @property {boolean} nullable
 * @property {boolean} unique
 * @property {any} defaultValue
 * @property {any} value
 */
class Table {
    static defaultStructure = {
        type: DataTypes.STRING,
        nullable: true,
        unique: false,
        defaultValue: null,
    };
    static Utils = {
        generateUUID: () => {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                let r = (Math.random() * 16) | 0,
                    v = c === "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        }
    };
    /**@type {Analgesic} */
    parent;
    /**@type {typeof Analgesic} */
    ParentConstructor;
    /**@type {GameDataStorage} */
    db;
    /**@type {TableStructureSet} */
    // primary key: {[[child key]: child row]}
    structure = {};
    /**@type {{[string]: DataCache}} */
    data = {};
    /**@type {TaskPool} */
    pool;
    /**
     * @param {Analgesic} parent 
     * @param {GameDataStorage} db 
     */
    constructor(parent, db) {
        if (!db.destroy) {
            throw parent._reject(DBError.Codes.DB_CONFIG_ERROR, {
                "$0": "GameStorage",
                "$1": parent.Analgesic.Utils.preciseType(db)
            });
        }
        this.db = db;
        this.parent = parent;
        this.pool = new TaskPool(this.parent.config.concurrentLimit);
    }

    /* Public */
    /**
     * @param {TableStructureSet|{[string]:string}} value 
     * @returns {Table}
     */
    setStructure(value) {
        this.structure = {};
        for (let [key, val] of Object.entries(value)) {
            this.structure[key] = {
                ...Table.defaultStructure,
                ...((typeof val === "string") ? { type: val } : val)
            };
        }
        return this;
    }
    // @TODO
    async syncForce() {
        await this._downloadLocalForce();
    }
    async sync() {
        await this._downloadLocalForce();
        this._formatLocalDatas();
        await this._uploadCloudAll();
        return this;
    }
    /**
     * 创建一行数据
     * @param {Object} data 
     * @returns {Promise<Data|DBError>}
     */
    async create(data) {
        let key = await this._create(data);
        return new Data(this, key, data);
    }
    /**
     * 按照id获取数据
     * @param {string} key 
     * @returns {Promise<Data|DBError>}
     */
    async getByKey(key) {
        let value = await this._get(key);
        if (DBError.isError(value)) throw value;
        return new Data(this, key, value);
    }
    /**
     * 按照过滤器获取数据
     * @param {Object} filter
     * @returns {Promise<Array<Data>>}
     */
    async find(filter) {
        await this._updateLocalAll();
        let result = {};
        for (let [key, val] of Object.entries(this.data)) {
            if (Object.keys(filter).every(k => {
                if (typeof filter[k] === "object") {
                    if (filter[k].$gt !== undefined && val.get().value[k] <= filter[k].$gt) {
                        return false;
                    }
                    if (filter[k].$lt !== undefined && val.get().value[k] >= filter[k].$lt) {
                        return false;
                    }
                    if (filter[k].$like !== undefined && !new RegExp(filter[k].$like).test(val.get().value[k])) {
                        return false;
                    }
                } else if (val.get().value[k] !== filter[k]) {
                    return false;
                }
                return true;
            })) {
                result[key] = val.get().value;
            }
        }
        return Object.keys(result).map(k => new Data(this, k, result[k]));
    }
    /**
     * 按照id设置数据
     * @param {string} key 
     * @param {Object} value 
     * @returns {Promise<Data|DBError>}
     */
    async setByKey(key, value) {
        await this._set(key, value);
        return new Data(this, key, value);
    }
    /**
     * 按照id删除数据
     * @param {string} key 
     * @returns {Promise<void|DBError>}
     */
    async delByKey(key) {
        return await this._del(key);
    }
    /**
     * @param {Object} filter 
     * @returns 
     */
    async delByFilter(filter) {
        let targets = await this.find(filter);
        let tasks = targets.map(v => this._createTask(async () => {
            await this._del(Object.keys(v)[0]);
        }));
        let result = await Promise.all(this._createTasks(tasks));
        if (result.some(v => DBError.isError(v))) {
            return result.find(v => DBError.isError(v));
        }
    }
    async clear() {
        await this._clear();
    }

    /* Private */
    _cache(key, value) {
        return new DataCache({ key, value }, this.parent.config.cacheExpire + Date.now(), this.parent.config.allowCache);
    }
    async _set(key, value) {
        await this._updateLocalAll();
        let data = this._format(value);
        if (DBError.isError(data)) throw data;
        await this._upload(key, data);
        this.data[key] = this._cache(key, data);
    }
    async _create(data) {
        await this._updateLocalAll();
        if (Object.keys(this.structure).filter(k => !this.structure[k].nullable).some(k => data[k] === undefined &&
            (this.structure[k].defaultValue === undefined || this.structure[k].defaultValue === null))) {
            throw this.parent._reject(DBError.Codes.DATA_UNNULLABLE, {
                "$0": Object.keys(this.structure).filter(k => !this.structure[k].nullable).find(k => data[k] === undefined)
            });
        }
        if (Object.keys(this.structure).filter(k => this.structure[k].unique).some(k => {
            return Object.values(this.data).some(v => v.get().value[k] === data[k]);
        })) {
            throw this.parent._reject(DBError.Codes.DATA_REPEATED, {
                "$0": Object.keys(this.structure).filter(k => this.structure[k].unique).find(k => {
                    return Object.values(this.data).some(v => v.get().value[k] === data[k]);
                })
            });
        }
        let key = Table.Utils.generateUUID();
        await this._set(key, data);
        return key;
    }
    async _get(key) {
        if (!this.data[key] || this.data[key].isExpired()) {
            await this._download(key);
        }
        return this.data[key].get().value;
    }
    async _del(key) {
        await this._updateLocalAll();
        await this.db.remove(key);
        delete this.data[key];
    }
    async _clear() {
        await this._updateLocalAll();
        Object.keys(this.data).forEach(k => {
            this.db.remove(k);
            delete this.data[k];
        });
    }
    /**
     * @param {Object} data 
     * @returns {TableStructure|DBError}
     */
    _structureFilter(data) {
        let result = {}, keys = Object.keys(this.structure);
        for (let [key, val] of Object.entries(data)) {
            if (!keys.includes(key)) continue;
            if (this.parent.Analgesic.Utils.preciseType(val) !== this.structure[key].type) {
                return this.parent._reject(DBError.Codes.DATA_TYPE_ERROR, {
                    "$0": this.structure[key].type,
                    "$1": this.parent.Analgesic.Utils.preciseType(val)
                });
            }
            if (!Object.prototype.hasOwnProperty.call(data, key)) {
                if (this.structure[key].nullable) {
                    result[key] = this.structure[key].defaultValue;
                } else {
                    return this.parent._reject(DBError.Codes.DATA_UNNULLABLE, {
                        "$0": key
                    });
                }
            } else {
                result[key] = val;
            }
        }
        return result;
    }
    /**
     * @param {Object} data 
     * @returns {TableStructure|DBError}
     */
    _format(data) {
        data = data instanceof DataCache ? data.get().value : data;
        return this._structureFilter(data);
    }
    /**
     * @returns {{[string]: DataCache}}
     */
    _formatLocalDatas() {
        let result = {};
        for (let [key, val] of Object.entries(this.data)) {
            let filteredData = this._format(val);
            if (DBError.isError(filteredData)) throw filteredData;
            result[key] = this._cache(key, filteredData);
        }
        this.data = result;
        return result;
    }
    /**
     * @param {{task: function}} task 
     */
    async _createTask(task) {
        return new Promise((resolve, reject) => {
            this.pool.addTask(async () => {
                try {
                    resolve(await task());
                } catch (err) {
                    reject(err);
                }
            });
        });
    }
    /**
     * @param {[{task: function}]} tasks 
     * @returns {[Promise]}
     */
    async _createTasks(tasks) {
        return Promise.all(tasks.map(v => this._createTask(v.task)));
    }
    async _download(key, tried = 0) {
        let task = this._createTask(async () => {
            let result = await this.db.get(key);
            this.data[key] = this._cache(key, result.value);
            return result;
        });
        return task.catch(async err => {
            if (tried < this.parent.config.maxTryTimes) {
                await new Promise(resolve => setTimeout(resolve, this.parent.config.tryInterval));
                return this._download(key, tried + 1);
            } else {
                return this._reject(DBError.Codes.DB_ERROR, {
                    "$0": `Failed to download data with key: ${key} after ${tried} times of trying.\nError Message:\n${err}`,
                });
            }
        });
    }
    async _upload(key, value, tried = 0) {
        let task = this._createTask(async () => {
            return await this.db.set(key, value);
        });
        return task.catch(async err => {
            if (tried < this.parent.config.maxTryTimes) {
                await new Promise(resolve => setTimeout(resolve, this.parent.config.tryInterval));
                return this._upload(key, value, tried + 1);
            }
            return this._reject(DBError.Codes.DB_ERROR, {
                "$0": `Failed to upload data with key: ${key} after ${tried} times of trying.\nError Message:\n${err}`,
            });
        });
    }
    async _uploadCloudAll() {
        let tasks = await Promise.all(Object.keys(this.data)
            .filter(k => !this.data[k].isExpired())
            .map(k => this._upload(k, this.data[k].get().value)));
        tasks.filter(v => DBError.isError(v)).forEach(v => {
            this.parent.events.emit(Analgesic.Events.DB_ERROR, v);
            console.error(v.message);
        });
        return tasks;
    }
    async _downloadLocalForce() {
        let result = {};
        let queryList = await this.db.list({
            cursor: 0,
            pageSize: 1000,
        });
        let isLastPage = false;
        while (!isLastPage) {
            for (let value of queryList.getCurrentPage()) {
                result[value.key] = value.value;
            }
            isLastPage = queryList.isLastPage;
            await queryList.nextPage();
        }
        for (let [k, v] of Object.entries(result)) {
            this.data[k] = this._cache(k, v);
        }
        return result;
    }
    async _updateLocalAll() {
        let expiredCache = Object.values(this.data).filter(v => v.isExpired()).map(v => v.get()?.key);
        let tasks = await Promise.all(expiredCache.map(v => this._download(v)));
        tasks.filter(v => DBError.isError(v)).forEach(v => {
            this.parent.events.emit(Analgesic.Events.DB_ERROR, v);
            console.error(v.message);
        });
        return tasks;
    }
}
/**
 * @typedef {Object} DBConfig
 * @property {boolean} allowMultipleTry
 * @property {number} maxTryTimes
 * @property {number} tryInterval
 * @property {boolean} allowCache
 * @property {number} cacheExpire
 * @property {number} concurrentLimit
 */
class Analgesic {
    /* Static */
    static instance = null;
    static getInstance = (...args) => {
        if (!Analgesic.instance) {
            Analgesic.instance = new Analgesic(...args);
        }
        return Analgesic.instance;
    };
    static Utils = {
        /**
         * @param {*} value 
         * @returns {"undefined"|"null"|"boolean"|"number"|"bigint"|"string"|"symbol"|"function"|"object"|"array"|"date"|"regexp"|"error"|"map"|"set"}
         */
        preciseType(value) {
            return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
        }
    };
    static DataTypes = DataTypes;
    static LocalText = {
        "zh-CN": {
            DB_CONFIG_ERROR: "配置错误，预期应该是一个{$0}，实际得到{$1}。",
            CONFIG_ERROR: "配置错误，预期应该是一个对象，实际得到{$0}。",
            DB_ERROR: "数据库错误：{$0}",
            DATA_TYPE_ERROR: "数据类型错误，预期应该是一个{$0}，实际得到{$1}。",
            DATA_UNNULLABLE: "数据错误，字段{$0}不能为空。",
            DATA_REPEATED: "数据错误，字段{$0}重复。",
            DATA_EXPIRED: "数据错误，字段{$0}已过期。",
        },
        "en-US": {
            DB_CONFIG_ERROR: "Configuration error, expected to be a {$0}, but got {$1}.",
            CONFIG_ERROR: "Configuration error, expected to be an object, but got {$0}.",
            DB_ERROR: "Database error: {$0}",
            DATA_TYPE_ERROR: "Data type error, expected to be a {$0}, but got {$1}.",
            DATA_UNNULLABLE: "Data error, field {$0} cannot be null.",
            DATA_REPEATED: "Data error, field {$0} repeated.",
            DATA_EXPIRED: "Data error, field {$0} expired.",
        }
    };
    static localLang = "zh-CN";
    static localize = (text, args = {}, lang) => {
        lang = lang || Analgesic.localLang;
        let localizedText = (Analgesic.LocalText[lang] && Analgesic.LocalText[lang][text]) ? Analgesic.LocalText[lang][text] : text;
        for (let key in args) {
            localizedText = localizedText.replace(new RegExp(`\\{\\${key}\\}`, "g"), () => args[key]);
        }
        return localizedText;
    };
    static setLocalLang = (lang) => {
        return Analgesic.LocalText[lang] && (Analgesic.localLang = lang);
    };
    static defaultConfig = {
        allowMultipleTry: true,
        maxTryTimes: 3,
        tryInterval: 1000,
        allowCache: true,
        cacheExpire: 1000 * 60 * 5,
        concurrentLimit: 5,
    };
    static Events = {
        DB_ERROR: "db_error",
    };

    /* Instance */
    /**@type {DBConfig} */
    config = {};
    /**@type {{[string]: GameStorage}} */
    dbEntryPointsCache = {};
    /**@type {Events} */
    events = new Events();
    get Analgesic() {
        return Analgesic;
    }
    /**
     * @constructor
     * @param {DBConfig} config 
     */
    constructor(config) {
        if (Analgesic.instance) {
            throw new Error("Analgesic is a singleton class, use Analgesic.getInstance() instead.");
        }
        if (Analgesic.Utils.preciseType(config) !== "object") {
            throw this._reject(DBError.Codes.CONFIG_ERROR, {
                "$0": Analgesic.Utils.preciseType(config)
            });
        }
        this.config = {
            ...Analgesic.defaultConfig,
            ...config
        };
    }

    /* Public */
    define(name, value) {
        return new Table(this, this._getDataBase(name)).setStructure(value);
    }

    /* Private */
    _reject(code, args) {
        let err = new DBError(Analgesic.localize(code, args), code);
        this.events.emit(Analgesic.Events[code], err);
        return err;
    }
    /**@returns {GameStorage} */
    _getDataBase(name) {
        return this.dbEntryPointsCache[name] || (this.dbEntryPointsCache[name] = storage.getDataStorage(name));
    }
}

module.exports = {
    Analgesic,
    DataTypes,
};

