


/**
 * **REQUIRES**  
 * Game  
 * - Events  
 * - ModuleManager  
 * - - Require  
 * - StorageProvider  
 * @class
 */
class Game {
    /* static */
    static imports = {
        "Events": null,
        "ModuleManager": null,
        "Require": null,
        "StorageProvider": null
    };
    static setImports(imports) {
        Object.keys(imports).forEach(key => {
            Game.imports[key] = imports[key];
        });
    }
    static instance = null;
    static Logger = {
        _gen(type, m) {return `[${type}] ${m}`;},
        log(m) {console.log(this._gen("LOG", m));},
        warn(m) {console.warn(this._gen("WARN", m));},
        error(m) {console.error(this._gen("ERROR", m));}
    };
    static defaultConfig = {
    };

    /* static public */
    static getInstance(...args) {
        if (Game.instance === null) {
            Game.instance = new Game(...args);
        }
        return Game.instance;
    }

    /* */
    config = {};
    storage = null;
    Game = Game;
    imports = Game.imports;

    /* constructor */
    constructor(config) {
        if (this.constructor.instance !== null) {
            return this.constructor.instance;
        }
        this._loadConfig(config);
    }

    /* public */
    setStorageProvider(storage) {
        this.storage = storage;
        return this;
    }

    /* private */
    _loadConfig(config) {
        Object.keys(Game.defaultConfig).forEach(key => {
            this.config[key] = Object.prototype.hasOwnProperty.call(config, key) ? config[key] : Game.defaultConfig[key];
        });
        return this;
    }

    /* event */

    /* getter & setter */
}



