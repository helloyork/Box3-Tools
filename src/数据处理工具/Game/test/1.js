/* eslint-disable no-undef */

import { Game } from "../index.js";
import modules from "../exports.js";

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
    build() { }
}


class WorldService extends Service {
    /**
     * @param {GamePlayerEntityEvent} name 
     * @param {handler: (event: GameEventChannel => void)} f 
     * @returns {GameEventHandlerToken}
     */
    on(name, f) {
        return world[name]?.(f);
    }
}

class TestServiceProvider {
    constructor() {
        this.a = 1;
    }
    log() {
        console.log(this.a);
    }
}
class TestService {
    serviceProvider = TestServiceProvider;
    /**@param {Game} game */
    constructor(game){
        this.game = game;
        this._init();
    }
    _init() {
        if (!this.serviceProvider) throw this.game.error(this.game.Game.getText("error:serviceProviderMissing"));
        this.service = Reflect.construct(this.serviceProvider, []);
        return this;
    }
    start() {
        this.game.Game.Logger.log("TestService Start");
    }
    stop() {
        this.game.Game.Logger.log("TestService Stop");
    }
    getStatus() {
        return "TestService Status";
    }
    build(...args) {
        this.game.Game.Logger.log("TestService Build");
        console.log(args);
    }
}

// new WorldService().on("a",(({entity})=>{}))
class StorageService extends Service {
    start() {

    }
}

Game.setImports(modules);
const game = new Game({});
game.Game.Logger.log("Game Start");
game.buildService(game.registerServiceProvider("TestService", TestService), {
    config: {
        a: 1
    }
}).build();

game.launchService("TestService");
