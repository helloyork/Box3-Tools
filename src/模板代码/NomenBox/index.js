/**
 * !info {Project} - 来自Nomen
 *  NomenBox：快速集成，快速调用工具与插件，拒绝代码污染与不匹配 - https://shequ.codemao.cn/community/557622
*/

const plug = {
    id: "string",
    namespace: "string",
    events: {
        "onload": () => console.log("load"),
        "plugin:onload": () => console.log("plugin load")
    },
    exports: () => { return "hi!" },
    defaults: (data) => { console.log(data) }
}

class NomenBox {
    static get defaultConfig() {
        return {
            db: null,
            warning: true,
            info: true,
            pluginShared: {},
            plugins: []
        }
    }
    static get errorMessages() {
        return {
            "-3": "事件订阅器必须是一个回调函数",
            "-2": "事件名称必须是一个有效字符串",
            "-1": "配置是必须的",
            "1": "尝试导入一个不存在的插件时发生错误"
        }
    }
    static get nthis() {
        return this._nthis ? this._nthis : (this._nthis = Symbol("nthis"), this._nthis)
    }
    static getInstance() {
        return this.__instance;
    }

    /* Constructor */
    constructor(config) {
        // console.log(this.constructor)
        if (this.constructor.getInstance()) return this.constructor.getInstance();
        if (!config) throw this._genError("-1");
        this.assignConfig(config);
        this._events = {};
        this._plugCache = [];
        this._plugins = [];
        this._initPlugins(config.plugins);
        this.constructor.__instance = this;
    }

    /* Methods */
    async init() {
        await this._initDatabase(); // TODO
        this._triggerEvent("oninit", {
            [this.constructor.nthis]: this,
            shareToPlugin: this.shareToPlugin.bind(this),
            noticeToPlugin: this.noticeToPlugin.bind(this),
            sendToPlugin: this.sendToPlugin.bind(this),
            pluginInfo: this.pluginInfo.bind(this),
        });
    }
    assignConfig(config) {
        let o = {}, defalutConfig = this.constructor.defaultConfig;
        Object.keys(defalutConfig).forEach(k => o[k] == config[k] || defalutConfig[k]);
        Object.assign(this, defalutConfig, o);
    }
    pluginInfo(id) {
        if (!this._plugins[id]) return null;
        return {
            id: this._plugins[id].id,
            namespace: this._plugins[id].namespace,
            version: this._plugins[id].version || "0.0.1",
            eventsLength: Object.keys(this._plugins[id].events).length,
            listeningEvents: Object.keys(this._plugins[id].events)
        }
    }
    shareToPlugin(...data) {
        Object.assign(this.pluginShared, ...data);
    }
    noticeToPlugin(id, msg) {
        this._triggerEvent(`notification:${id}`, msg)
    }
    sendToPlugin(id, data) {
        if (this._plugins[id] && this._plugins[id].defaults) this._plugins[id].defaults(data)
    }
    plug(id) {
        if (!this._plugins[id]) throw this._genError("1");
        if (this._plugCache[id]) return this._plugCache[id];
        if (this._plugins[id].exports) return this._plugins[id].exports({
            [this.constructor.nthis]: this,
            pluginShared: this.pluginShared
        });
    }
    run(c) {
        return c({
            [this.constructor.nthis]: this,
            plug: this.plug.bind(this),
            shareToPlugin: this.shareToPlugin.bind(this),
            noticeToPlugin: this.noticeToPlugin.bind(this),
            sendToPlugin: this.sendToPlugin.bind(this),
            pluginInfo: this.pluginInfo.bind(this),
        })
    }

    /* Event Describer */
    onInit(c) {
        this._describeEvent("oninit", c);
    }

    /* Private Methods */
    _require(path) {
        let nrequire = function (p) {
            try {
                return { module: require(p) }
            } catch {
                return { module: null }
            }
        }
        if (typeof path == "string" && path.startsWith("./") && path.endsWith(".js")) return nrequire(path)
        else if (typeof path == "string" && !path.startsWith("./")) return nrequire(`./${path}.js`)
        else if (Array.isArray(path) && path.every(v => typeof v == "string")) return path.map(v => nrequire(v));
    }
    _pluginExec(id, event, ...arg) {
        try {
            if (this._plugins[id].events && this._plugins[id].events[event]) {
                this._plugins[id].events[event](...arg);
            }
        } catch (error) {
            this._error(`插件[${id}]运行时遇到错误：${error}`)
        }
    }
    _initPlugins(plugins) {
        if (Array.isArray(plugins)) {
            plugins.forEach(p => {
                try {
                    if (p.namespace && p.id && p.id.length >= 1 && this._plugins[p.namespace + ":" + p.id] == undefined) {
                        console.log(p.namespace + ":" + p.id)
                        this._plugins[p.namespace + ":" + p.id] = p;
                        if (this._plugins[p.namespace + ":" + p.id].events) {
                            Object.keys(this._plugins[p.namespace + ":" + p.id].events).forEach(e => {
                                this._describeEvent(e, this._plugins[p.namespace + ":" + p.id].events[e]);
                            })
                        };
                        this._triggerEvent("plugin:onload", {
                            [this.constructor.nthis]: this,
                            plugin: p
                        })
                        this._info(`插件载入：[${p.namespace + ":" + p.id}]`);
                    } else if (!p.namespace && (!p.id || p.id.length <= 0)) {
                        this._warn(`存在未知的插件，无法载入，请检查你的插件集`);
                    } else if (this._plugins[p.namespace + ":" + p.id]) {
                        this._warn(`插件 ${p.namespace + ":" + p.id} 已经存在，请检查是否存在冲突`)
                    }
                } catch (error) {
                    this._error(`尝试载入插件时遇到错误：${error}`)
                }
            })
        }
    }
    async _initDatabase(arg) {
        if (!this.db) this._db = null
        else if (this.db && typeof this.db == "function") this._db = await this.db(arg)
        else if (typeof this.db == "object") this._db = this.db;
    }
    _info(msg) {
        this._logout("log", msg);
    }
    _warn(msg) {
        this._logout("warn", msg);
    }
    _error(msg) {
        this._logout("error", msg);
    }
    _logout(level, msg) {
        let lvms = {
            "log": "info",
            "warn": "warning",
            "error": "error"
        };
        if (this[lvms[level]] || level == "error") console[level](`[NomenBox ${lvms[level].toUpperCase()}] ${msg}`)
    }
    _describeEvent(event, c) {
        if (typeof event !== "string") throw this._genError("-2");
        if (!this._events[event]) this._events[event] = [];
        if (typeof c !== "function") throw this._genError("-3");
        this._events[event].push(c);
    }
    _triggerEvent(event, ...arg) {
        if (this._events[event]) this._events[event].forEach(v => v(...arg));
    }
    _genError(code) {
        let errorMessages = this.constructor.errorMessages;
        return new Error(`[NomenBox: ${code}]${errorMessages[code] ? errorMessages[code] : "error when running NomenBox"}`)
    }
}

const config = {
    db: null,                          // 一个db标准，插件将可以读取
    warning: true,                     // 是否输出警告
    info: true,                        // 是否输出信息
    plugins: require("./plugins.js")   // 插件的数组 plugin[]
}

let box = new NomenBox(config);
box.init();
box.onInit(async ({ shareToPlugin, noticeToPlugin, sendToPlugin }) => {
    shareToPlugin({
        data: "一些数据，插件将可以读取"
    });
    noticeToPlugin("nomina:mynewPlugin", "一些信息，该id的插件将会收到这条提醒");
    sendToPlugin("nomina:mynewPlugin", "一些信息，该id的插件将会收到这些信息")
    box.run(function ({ plug, noticeToPlugin }) {
        console.log(JSON.stringify(box.pluginInfo("nomina:mynewPlugin"))) // 输出插件信息
        let mnp = plug("nomina:mynewPlugin"); // 导入插件
        mnp.send("world"); // 调用插件，这个时候会输出: hello world! 我是一个方法，可以被使用者调用
        noticeToPlugin("nomina:mynewPlugin", "再次提醒！")
    })
});

module.exports = [
    {
        id: "mynewPlugin",
        namespace: "nomina",
        version: "0.0.1",
        events: {
            "oninit": () => console.log("NomenBox载入的时候会调用，等价于box.onInit，与用户同时监听到事件发生"),
            "plugin:onload": (data) => {
                console.log("插件载入的时候会调用");
                // 提示，一个更高级的用法是获取当前环境下的NomenBox实例
                console.log(`你猜怎么着，我其实知道你的NomenBox实例，它就是: ${data[NomenBox.nthis]}`);
                console.log(`同时，我也可以获取我自己: ${data.plugin}`)
            },
            "notification:nomina:mynewPlugin": () => console.log("我收到了你使用noticeToPlugin发送的提醒")
        },
        exports: () => {
            return {
                send: (data) => { console.log(`hello ${data}! 我是一个方法，可以被使用者调用，使用者只需要plug("nomina:mynewPlugin").send("world")就可以了`) }
            }
        },
        defaults: (data) => { console.log(`我收到了你使用sendToPlugin发送的数据:${data}`) }
    }
]

/*

*/





