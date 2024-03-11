


/**
 * **REQUIRES**  
 * Game  
 * - Events  
 * - ModuleManager  
 * - - Require  
 * - StorageProvider  
 */
/**
 * @typedef {import("./exports").ModuleManager} ModuleManager
 * @typedef {import("./exports").Events} Events
 * @typedef {import("./exports").Require} Require
 * @typedef {import("./exports").StorageProvider} StorageProvider
 */
class Service {
    serviceProvider = null;

    service = null;
    /**@param {Game} game */
    constructor(game) {
        this.game = game;
        this._init();
    }
    _init() {
        if (!this.serviceProvider) throw this.game.error(this.game.Game.getText("error:serviceProviderMissing"));
        this.service = Reflect.construct(this.serviceProvider, []);
        return this;
    }
    start() { }
    stop() { }
    getStatus() { }
    build(...args) { }
}
class Game {
    /* static */
    /**@type {{Events: typeof Events, ModuleManager: typeof ModuleManager, Require: typeof Require, StorageProvider: typeof StorageProvider}} */
    static imports = {
        Events: null,
        ModuleManager: null,
        Require: null,
        StorageProvider: null,
    };
    static instance = null;
    static Logger = {
        _gen(type, m) { return `[${type}] ${m}`; },
        log(m) { console.log(this._gen("LOG", m)); },
        warn(m) { console.warn(this._gen("WARN", m)); },
        error(m) {
            if (!(m instanceof Error)) m = new Error(m);
            console.error(this._gen("ERROR", m.message + "\n" + m.stack));
            return m;
        }
    };
    static textMap = {
        "error:timeLimitExceeded": "Time Limit Exceeded",
        "error:importsMissing": "Imports ${name} is missing.",
        "error:serviceProviderMissing": "Service Provider is missing.",
        "error:serviceMissing": "Service ${name} is missing.",
    };
    static EventTypes = {
        ERROR: {
            UNKNOWN_ERROR: "error:unknownError",
        }
    };
    static defaultConfig = {
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
    imports = Game.imports;
    Game = Game;
    /**@type {{moduleManager: ModuleManager, events: Events}} */
    game = {
        moduleManager: null,
        events: null,
    };
    services = {};
    _serviceProviders = {};

    /**@type {Events} */
    events = null;

    /* constructor */
    constructor(config) {
        if (this.constructor.instance !== null) {
            return this.constructor.instance;
        }
        this._loadConfig(config)._init();
    }

    /* public */
    registerServiceProvider(name, service) {
        this._serviceProviders[name] = service;
        return service;
    }
    buildService(service, ...args) {
        if (typeof service === "string") {
            this.services[service] = this._serviceProviders[service];
        } else {
            let name = Object.keys(this._serviceProviders).find(key => this._serviceProviders[key] === service);
            if (!name) throw this.error(this.getText("error:serviceMissing", { name }));
            this.services[name] = Reflect.construct(service, [this]);
            this.services[name].build(...args);
            return this;
        }
        return this;
    }
    launchService(name) {
        if (!this.services[name]) throw this.error(this.getText("error:serviceMissing", { name }));
        this.services[name].start();
        return this;
    }
    stopService(name) {
        if (!this.services[name]) throw this.error(this.getText("error:serviceMissing", { name }));
        this.services[name].stop();
        return this;
    }
    restartService(name) {
        return this.stopService(name).launchService(name);
    }
    getService(name) {
        return this.services[name];
    }
    registerModule(name, module) {
        this.game.moduleManager.addModule(name, module, false);
        return this;
    }
    requireModule(name) {
        return this.game.moduleManager.require(name);
    }
    build() {
        this._build();
        return this;
    }
    error(m) {
        return this.Game.Logger.error(m);
    }

    /* private */
    _build() {
        this.game.moduleManager.build();
        return this;
    }
    _init() {
        Object.keys(this.Game.imports).forEach(key => {
            if (!this.Game.imports[key]) throw this.error(this.Game.getText("error:importsMissing", { name: key }));
        });
        this.game.events = Reflect.construct(this.Game.imports.Events, []);
        this.game.moduleManager = Reflect.construct(this.Game.imports.ModuleManager, [{}]);
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


export { Game, Service };
