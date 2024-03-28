/* eslint-disable no-undef */

const { Game } = require("../index.js");
const modules = require("../exports.js");

class Service {
    serviceProvider = null;

    service = null;
    /**@param {Game} game */
    constructor(game) {
        this.game = game;
    }
    start() { }
    stop() { }
    getStatus() { }
    config() { }
}


class TestServiceProvider {
    constructor() {
    }
    log() {
        console.log("service");
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
        this.service.log();
    }
    stop() {
        this.game.Game.Logger.log("TestService Stop");
    }
    getStatus() {
        return "TestService Status";
    }
    config(...args) {
        this.game.Game.Logger.log("TestService Build");
        console.log(args);
    }
}


Game.setImports(modules);
const game = new Game({});
game.Game.Logger.log("Game Start");
game.configService(game.registerServiceProvider("TestService", TestService), {
    config: {
        a: 1
    }
}).build();

game.launchService("TestService");
