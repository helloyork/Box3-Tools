
class RemoteGroups {
    constructor(target) {
        this.target = target;
    }
    send(message){

    }
}

class RemoteServerWrapper {
    static quitCode = {
        "1": "传入的实体/实体组不正确",
        "2": "非服务端"
    }
    constructor(target) {
        let t;
        if ((Array.isArray(target) && target.every(v => v instanceof GameEntity)) || target instanceof GameEntity) t = this.client = new RemoteGroups(target)
        else throw this._quit("1");
        try {remoteChannel}catch{ throw this._quit("2")}
    }
    _quit(c) {
        return new Error(`[Remote Server] ${this.constructor.quitCode[c]}`);
    }
}
