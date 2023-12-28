

function SocketClientWrapper({ port } = {}){
    if (!new.target) throw "SocketClientWrapper must be called with new";
    this.port = port || 6100;
    this.state = 0;
    this.listeners = [];
    this.id = null;
    Object.assign(this, {
        CONNECTING: 0,
        OPEN: 1,
        CLOSED: 2,
        onopen: ()=>{},
        onmessage: ()=>{},
        onerror: ()=>{},
        onclose: ()=>{},
        onpong: ()=>{}
    });
    let wrap = (message, type) => {
        return {
            port: this.port,
            type,
            id: this.id,
            data: message,
        }
    }
    function exec(f, ...args){
        if(typeof f==="function") return f(...args);
        else return null;
    }
    let error = (e)=>{
        exec(this.onerror, e);
        return new Error(e);
    }
    this.ping = function (f) {
        this.send(undefined, "ping");
        this.onpong = f;
    }
    this.send = function (message, type = "data") {
        if (this.state !== this.OPEN) {
            throw error("套接字实例非连接状态");
        }
        if (!this.id) {
            throw error("无法正确获取会话id，请尝试重新实例化！");
        }
        remoteChannel.sendServerEvent(wrap(message, type));
    }
    this.close = function (code = 1005) {
        this.send({reason: code}, "disconnect");
        this.state = this.CLOSED;
        exec(this.onclose, code);
        this.listeners.forEach(v => remoteChannel.events.remove("client", v));
    }
    let _l = (v) => {
        let value = (typeof v === "object" && v !== null) ? v : { data: v };
        if (this.state === this.CONNECTING) {
            if (value.type === "connect") {
                this.state = this.OPEN;
                this.id = value.data.id;
                exec(this.onopen, this);
            }
        } else if (this.state === this.OPEN) {
            if (value.type === "ping") {
                this.send(undefined, "_pong");
            } else if (value.type === "data") {
                exec(this.onmessage, value.data);
            } else if (value.type === "disconnect") {
                this.state = this.CLOSED;
                this.listeners.forEach(v => remoteChannel.events.remove("client", v));
                exec(this.onclose, value.data.reason);
            } else if (value.type === "pong"){
                exec(this.onpong);
            }
        }
    }
    this.listeners.push(_l);
    remoteChannel.events.on("client", _l);
    remoteChannel.sendServerEvent({type:"connect", port: this.port});
}
