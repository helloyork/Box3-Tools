
class Game {
    /* static */
    static instance = null;
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

    /* constructor */
    constructor(config) {
        this._loadConfig(config);
    }

    /* public */

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



