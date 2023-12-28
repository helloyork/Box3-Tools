
class RemoteGroups {
    constructor(target) {
        this.target = Array.isArray(target) ? target : [target];
        this.listeners = [];
    }
    send(message) {
        remoteChannel.sendClientEvent(this.target, message);
    }
    sendOne(entity, message) {
        if (this.target.includes(entity)) {
            remoteChannel.sendClientEvent([entity], message)
        }
    }
    each(c) {
        this.target.forEach(v => c(v, this));
    }
    add(entity) {
        this.target.push(entity);
    }
    cancel(entity) {
        this.target = this.target.filter(v => v !== entity);
    }
    stop() {
        this.listeners.forEach(v => v.cancel());
        this.target = [];
        this.listeners = [];
    }
    _register(f, hdls, port) {
        this.listeners.push(remoteChannel.onServerEvent((a) => {
            if (a.args?.port !== port) return;
            if (this.target.includes(a.entity) && typeof a.args?.id !== "number") hdls[a.args?.id]?.(a);
            if (this.target.includes(a.entity)) f(a);
        }));
    }
}

/**
 * @callback WhenGetMessage
 * @param {JSONValue} arg 客户端发送的数据
 */
/**
 * @typedef {Object} RemoteServerEventToken
 * @property {Function} cancel 取消事件
 */
/**
 * @typedef {Object} RemoteServerEvent
 * @property {GameEntity} type 玩家实例
 * @property {WhenGetMessage} handler 回调函数，当事件触发时执行
 * @property {number} id 会话id
 */
class RemoteServerWrapper {
    static quitCode = {
        "1": "传入的实体/实体组不正确",
        "2": "非服务端"
    }
    /**@type {Map<GameEntity, RemoteServerEvent>} */
    static events = new Map();
    /**
     * 监听特定玩家触发的事件
     * @param {GameEntity} entity 要监听的玩家
     * @param {"data"|"communicate"} type 会话类型
     * @param {WhenGetMessage} f 回调函数，当事件触发时执行
     * @param {number?} 会话id，如果不指定则为通用触发器，指定后仅该id的会话会被捕获
     * @returns {RemoteServerEventToken} 调用返回值的cancel属性取消事件
     */
    static listen(entity, type = "data", f, id) {
        if (!this.events.get(entity)) this.events.set(entity, []);
        this.events.get(entity).push({ type, handler: f, id });
        return {
            cancel: () => {
                this.off(entity, f);
            }
        }
    }
    /**
     * 仅监听一次特定玩家触发的事件
     * @param {GameEntity} entity 要监听的玩家
     * @param {"data"|"communicate"} type 会话类型
     * @param {WhenGetMessage} f 回调函数，当事件触发时执行
     * @param {number?} id 会话id，如果不指定则为通用触发器，指定后仅该id的会话会被捕获
     * @returns {RemoteServerEventToken} 调用返回值的cancel属性取消事件
     */
    static once(entity, type = "data", f, id) {
        if (!this.events.get(entity)) this.events.set(entity, []);
        let handler = function (...args) {
            this.off(entity, f);
            return f(...args);
        };
        this.events.get(entity).push({
            type, handler, id
        });
        return {
            cancel: () => {
                this.off(entity, handler);
            }
        }
    }
    /**
     * 向特定客户端广播消息
     * @param {GameEntity} entity 要监听的玩家
     * @param {JSONValue} message 向客户端发送的可序列化数据
     * @param {"data"|"communicate"} type 会话类型
     * @param {number} id 会话id，可通过这个id追踪会话并且监听
     * @returns {number} 会话id
     */
    static send(entity, message, type = "data", id = Date.now()) {
        remoteChannel.sendClientEvent([entity], this.wrap(type, message, id));
        return id;
    }
    static emit(type, ctype, self, id, ...args) {
        if (!this.events.get(type)) this.events.set(type, []);
        this.events.get(type).forEach(v => {
            if (typeof v.handler === "function" && (!id || !v.id || (id && id === v.id)) && v.type === ctype) {
                if (ctype === "data") v.handler.apply(this, args)
                else if (ctype === "communicate") {
                    let res = v.handler.apply(this, args);
                    if (res.then) res.then(r => self.sendOne(type, r, "data", id))
                    else self.sendOne(type, res, "data", id)
                }
            }
        });
    }
    static off(entity, f) {
        if (this.events.get(entity)) this.events.set(entity, this.events.get(entity).filter(v => v.handler !== f));
    }
    static async timer(f, ms) {
        let done = false, rejected = false, timeout;
        try {
            let result = await Promise.race([(async () => { let res = await f(); clearTimeout(timeout); done = true; return res })(),
            new Promise((_r, reject) => {
                timeout = setTimeout(() => {
                    rejected = done = true;
                    reject("Timeout");
                }, ms);
            })]);
            if (result && done && !rejected) return result;
        } catch (err) {
            if (!done) throw err;
            if (rejected) return new Error("Timeout");
        }
    }
    /**
     * 构建RemoteServer实例
     * @constructor
     * @param {GameEntity} target 目标实体，应该是 GameEntity 类型的实例。
     * @param {Object} [options={}] 配置选项。
     * @param {number} [options.port=6000] 端口号，默认为 6000。
     */
    constructor(target, { port } = { port: 6000 }) {
        if ((Array.isArray(target) && target.every(v => v instanceof GameEntity)) || target instanceof GameEntity) this.client = new RemoteGroups(target)
        else throw this._quit("1");
        try { remoteChannel } catch { throw this._quit("2") };
        this.port = port;
        this._start();
    }
    /**
     * 监听受管理的玩家发送的消息
     * @param {"data"|"communicate"} type 会话类型
     * @param {WhenGetMessage} f 回调函数，当事件触发时执行
     */
    onMessage(type, f) {
        this.client.target.forEach(entity => {
            if (!this.constructor.events.get(entity)) this.constructor.events.set(entity, []);
            this.constructor.events.get(entity).push({ type, handler: f });
        });
    }
    /**
     * 向所有当前实例管理的客户端广播消息
     * @param {JSONValue} message 向客户端发送的可序列化数据
     * @param {"data"|"communicate"} type 会话类型
     * @param {number} id 会话id，可通过这个id追踪会话并且监听
     * @returns {number} 会话id
     */
    send(message, type = "data", id = Date.now()) {
        this.client.send(this.wrap(type, message, id));
        return id;
    }
    /**
     * 向特定客户端发送消息
     * @param {GameEntity} entity 指定发送的玩家
     * @param {JSONValue} message 向客户端发送的可序列化数据
     * @param {"data"|"communicate"} type 会话类型
     * @param {number} id 会话id，可通过这个id追踪会话并且监听
     * @returns {number} 会话id
     */
    sendOne(entity, message, type = "data", id = Date.now()) {
        this.client.sendOne(entity, this.wrap(type, message, id));
        return id;
    }
    /**
     * 添加管理特定实体
     * @param {GameEntity} entity 添加管理的实体
     */
    add(entity) {
        this.client.add(entity);
    }
    /**
     * 取消管理特定实体，并且清除共享事件管理器中的受管理单位事件
     * @param {GameEntity} entity 取消管理的实体
     */
    cancel(entity) {
        this.client.cancel(entity);
        this.constructor.events.delete(entity);
    }
    /**
     * 终止当前实例，并且清除共享事件管理器中的受管理单位事件  
     * 这仅应该在你认为你需要放弃该实例并且优化资源时才能调用，停止后尝试调用实例方法可能导致错误
     */
    stop() {
        this.client.target.forEach(v => this.constructor.events.delete(entity));
        this.client.stop();
    }
    /**
     * 向所有当前实例管理的客户端交换数据  
     * 返回的数组包含着所有结果
     * @param {JSONValue} data 向客户端发送的可序列化数据
     * @param {Function} rec 当收到某个客户端返回的数据时触发回调
     * @returns {Promise<JSONValue|Error>[]} 当所有客户端均响应，返回结果数组（即使出错）
     */
    async communicateEntities(data, rec) {
        let r = [];
        this.client.each((t) => {
            r.push(new Promise(resolve => {
                if (t && !t.destroyed) {
                    this.constructor.once(t, "data", (args) => { rec(args.data); resolve(args.data); }, this.send(data, "communicate"));
                }
            }))
        });
        return Promise.all(r);
    }
    /**
     * 向特定的实例交换数据
     * @param {GameEntity} entity 玩家实例
     * @param {JSONValue} data 向客户端发送的可序列化数据
     * @param {Function} rec 当收到某个客户端返回的数据时触发回调
     * @returns {Promise<JSONValue|Error>} 当客户端均响应，返回结果（即使出错）
     */
    async communicate(entity, data, rec) {
        if (!this.client.target.includes(entity)) return null;
        return new Promise(resolve => {
            if (entity && !entity.destroyed) {
                this.constructor.once(entity, "data", (args) => { rec(args.data); resolve(args.data); }, this.sendOne(entity, data, "communicate"))
            }
        });
    }
    wrap(type, data, id) {
        return {
            type,
            data,
            id
        }
    }
    _toData(data) {
        if (typeof data === "object" && data !== null) return data
        else return { data };
    }
    _start() {
        this.client._register(({ entity, args }) => {
            this.constructor.emit(entity, this._toData(args).type, this, this._toData(args).id, args, entity);
        }, {}, this.port);
    }
    _quit(c) {
        return new Error(`[Remote Server] ${this.constructor.quitCode[c]}`);
    }
}
