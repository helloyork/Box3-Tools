
class SocketError extends Error {
    constructor(message, socket) {
        super(message);
        this.name = "SocketError";
        this.socket = socket;
    }
}
/**
 * @typedef SocketEventToken
 * @property {Function} cancel 调用后取消事件
 */
class Socket {
    static messageType = {
        DATA: "data",
        PING: "ping",
        PONG: "pong",
        CONNECT: "connect",
        CLOSE: "close"
    }
    static states = {
        CONNECTING: 0,
        OPEN: 1,
        CLOSED: 2
    }
    /**
     * 请注意，一般来讲你不应该手动实例化这个类，该类用于与客户端进行通信，需要进行一些配置，SocketServerWrapper会自动操作
     * @constructor
     * @param {GameEntity} entity 监听的玩家实例
     * @param {number} id 会话id
     * @param {number} port 端口号
     */
    constructor(entity, id, port) {
        this.target = entity;
        this.state = Socket.states.CONNECTING;
        this.listener = [];
        this.id = id;
        this.port = port;
        this.events = {
            "message": [],
            "error": [],
            "connect": [],
            "disconnect": [],
            "ping": [],
            "_pong": []
        };
        this._start();
    }
    /**
     * 
     * @param {"message"|"error"|"connect"|"disconnect"|"ping"} type 监听类型
     * @param {Function} f 当事件触发时运行，message事件会收到数据，其他事件没有任何参数传入
     * @returns {Object} 取消令牌
     * @returns {SocketEventToken} 事件取消
     */
    listen(type, f) {
        if (Object.keys(this.events).includes(type)) {
            this.events[type].push(f);
            return {
                cancel: () => this.events[type] = this.events[type].filter(v => v !== f)
            }
        }
    }
    removeListener(type) {
        if (this.events[type] && !type.startsWith("_")) this.events[type] = [];
    }
    /**
     * 发送一条消息
     * @param {JSONValue} message 发送的数据
     * @param {Object} [c] 额外配置 
     */
    send(message, c) {
        try {
            if (this.state === Socket.states.OPEN) remoteChannel.sendClientEvent(this.target, this.wrap({
                data: message,
                ...c
            }));
            else throw new SocketError("套接字实例非连接状态", this);
        } catch (err) {
            this._emit("error", err);
        }
    }
    /**
     * 断开连接
     * @param {number} code 根据协议，你需要提供一个连接断开的理由，默认为1005，即CLOSE_NO_STATUS
     */
    disconnect(code = 1005) {
        this.send({reason: code}, {type: "disconnect"})
        this._emit(this._parse(args).type, this._parse(args).data?.reason);
        this._stop();
    }
    wrap({ id = this.id, data, type = Socket.messageType.DATA, time = Date.now() }) {
        return {
            id,
            data,
            type,
            time
        }
    }
    /**
     * 尝试发送一条ping消息，如果客户端处于连接状态并且符合连接协议，则会返回pong消息，可以通过观察是否超时来判定
     * @example ping((time)=>console.log(`客户端依旧存活，当前时间${new Date(time).toString()}`));
     * @param {Function} f 当收到pong之后触发
     * @returns {Promise<void>} 当收到pong之后承诺被解决
     */
    async ping(f) {
        if (this.state !== Socket.states.OPEN) throw new Error("套接字实例非连接状态");
        return new Promise(resolve => {
            remoteChannel.sendClientEvent(this.target, this.wrap({
                type: Socket.messageType.PING,
            }));
            let r = this.listen("_pong", () => {
                f(Date.now());
                r.cancel();
                resolve(Date.now());
            })
        })
    }
    _emit(type, ...args) {
        if (this.events[type]) {
            this.events[type].forEach(v => v(...args));
        }
    }
    _parse(d) {
        if (typeof d === "object" && d !== null) return d;
        else return { data: d };
    }
    _start() {
        if (this.state !== Socket.states.CONNECTING) return;
        this.state = Socket.states.OPEN;
        this._emit("connect");
        this.listener.push(remoteChannel.onServerEvent(({ args }) => {
            if (this._parse(args).port === this.port && this._parse(args).id === this.id) {
                if (this._parse(args).type === Socket.messageType.PING) {
                    this.send(undefined, {type: Socket.messageType.PONG});
                    this._emit("ping");
                } else if (this._parse(args).type === Socket.messageType.CLOSE) {
                    this._emit(this._parse(args).type, this._parse(args).data?.reason);
                    this._stop();
                } else if (this._parse(args).type === Socket.messageType.DATA) {
                    this._emit("message", this._parse(args).data);
                }else {
                    this._emit(this._parse(args).type, this._parse(args).data);
                }
            }
        }), world.onPlayerLeave(({ entity }) => {
            if (entity === this.target) {
                this._emit("disconnect");
                this._stop();
            }
        }));
    }
    _stop() {
        if (this.state === Socket.states.OPEN) {
            this.state = Socket.states.CLOSED;
            this.listener.forEach(v => v.cancel());
            Object.keys(this.events).forEach(k => this.removeListener(k));
        }
    }
}

class SocketServerWrapper {
    static get defaultConfig() {
        return {
            port: 6100,
        }
    }
    /**
     * @param {Object} [config] 配置
     * @param {number} [config.port=6100] 端口号，默认为6100
     */
    constructor(config = {}) {
        this.events = {};
        this.clients = [];
        this.listeners = [];
        this._assign(config);
        this._start();
    }
    /**
     * @callback SocketServerEvent
     * @param {Socket} client Socket连接实例
     * @param {JSONValue} [data] 本次消息的数据
     */
    /**
     * 
     * @param {"connect"|"message"|"disconnect"} type 监听类型
     * @param {SocketServerEvent} f 回调函数，参数为client,data
     * @param {number} [id] 会话id
     * @returns {SocketEventToken} 事件取消
     */
    on(type, f, id) {
        this._registerEvent(type);
        if (typeof f === "function") {
            this.events[type].push({ handler: f, id });
            return {
                cancel: () => this.events[type] = this.events[type].filter(v => v.handler !== f)
            }
        }
    }
    _start() {
        this.listeners.push(remoteChannel.onServerEvent(({ entity, args }) => {
            let a = this._toData(args);
            if (a.port !== this.port) return;
            if (a.type === "connect") {
                let client = new Socket(entity, Date.now(), this.port);
                client.listen("disconnect", () => this._emit("disconnect", a.id, client))
                client.send({ id: client.id }, { type: Socket.messageType.CONNECT });
                this._emit("connect", a.id, client);
            } else if (a.type === "message" && this.clients.some(c => c.id === a.id && c.target === entity)) {
                this._emit("message", a.id, this.clients.filter(c => c.id === a.id && c.target === entity)[0], a.data);
            }
        }))
    }
    _toData(data) {
        if (typeof data === "object" && data !== null) return data
        else return { data };
    }
    _assign(c) {
        let o = {}, dc = this.constructor.defaultConfig;
        Object.keys(dc).forEach(v => {
            if (c[v]) o[v] = c[v];
            else o[v] = dc[v];
        });
        Object.assign(this, o);
    }
    _emit(type, id, ...args) {
        if (Array.isArray(this.events[type])) {
            this.events[type].filter(v => !id || v.id === id).forEach(f => {
                f.handler(...args);
            })
        }
    }
    _registerEvent(type) {
        if (!this.events[type]) this.events[type] = [];
    }
}
