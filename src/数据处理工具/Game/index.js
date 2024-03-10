


/**
 * **REQUIRES**  
 * Game  
 * - Events  
 * - ModuleManager  
 * - - Require  
 * - StorageProvider  
 * @class
 */
/**
 * @typedef {import("./exports").ModuleManager} ModuleManager
 * @typedef {import("./exports").Events} Events
 * @typedef {import("./exports").Require} Require
 * @typedef {import("./exports").StorageProvider} StorageProvider
 */
class Game {
    /* static */
    /**@type {{Events: typeof Events, ModuleManager: typeof ModuleManager, Require: typeof Require, StorageProvider: typeof StorageProvider}} */
    static imports = {
        Events: null,
        ModuleManager: null,
        Require: null,
        StorageProvider: null
    };
    static instance = null;
    static Logger = {
        _gen(type, m) { return `[${type}] ${m}`; },
        log(m) { console.log(this._gen("LOG", m)); },
        warn(m) { console.warn(this._gen("WARN", m)); },
        error(m) {
            if (!(m instanceof Error)) m = new Error(m);
            console.error(this._gen("ERROR", m.message + "\n" + m.stack));
        }
    };
    static textMap = {
        "error:timeLimitExceeded": "Time Limit Exceeded",
        "error:storageProviderMissing": "StorageProvider is not set.",
        "error:storageMissing": "Storage ${name} is not initialized."
    };
    static defaultConfig = {
        storages: [],
        allowAutoStorageInit: true
    };
    static Utils = {
        timeLimit: async (fn, time) => {
            return Promise.race([fn(), new Promise((_, reject) => setTimeout(() => reject(new Error(this.getText("error:timeLimitExceeded"))), time))]);
        }
    };
    static getText(key, arg = {}) {
        return this.textMap[key].replace(/\$\{(\w+)\}/g, (m, key) => arg[key]);
    }
    static setImports(imports) {
        Object.keys(imports).forEach(key => {
            this.imports[key] = imports[key];
        });
    }

    /* static public */
    static getInstance(...args) {
        if (Game.instance === null) {
            Game.instance = new Game(...args);
        }
        return Game.instance;
    }

    /* */
    config = {};
    storage = {};
    Game = Game;
    imports = Game.imports;

    /**@type {Events} */
    events = null;
    /**@type {ModuleManager} */
    moduleManager = null;

    /* constructor */
    constructor(config) {
        if (this.constructor.instance !== null) {
            return this.constructor.instance;
        }
        this._loadConfig(config);
    }

    /* public */
    setStorageProvider(storage) {
        this._storageProvider = storage;
        return this;
    }
    initStorage(name, ...args) {
        if (!this._storageProvider) throw this.error(this.Game.getText("error:storageProviderMissing"));
        this.storage[name] = Reflect.construct(this._storageProvider, [name, ...args]);
        return this;
    }
    getStorage(name) {
        if (!this.storage[name] && !this.config.allowAutoStorageInit) throw this.error(this.Game.getText("error:storageMissing", { name }));
        return this.storage[name] || (this.initStorage(name), this.storage[name]);
    }
    error(m) {
        this.Game.Logger.error(m);
        return m;
    }

    /* private */
    _storageProvider = null;
    _init() {
        this.events = Reflect.construct(this.Game.imports.Events, []);
        this.moduleManager = Reflect.construct(this.Game.imports.ModuleManager, [{}]);
        this.config.storages.forEach(name => {
            this.initStorage(name);
        });
        return this;
    }
    _loadConfig(config) {
        Object.keys(Game.defaultConfig).forEach(key => {
            this.config[key] = Object.prototype.hasOwnProperty.call(config, key) ? config[key] : Game.defaultConfig[key];
        });
        return this;
    }

    /* event */

    /* getter & setter */
}



