/**
 * !info {Module} -来自PGAoT-VAS
 */


/**
 * 观察者类
 * @param {Function} callback 回调方法
 * @param {any} context 观测者载体
 */
class Observer {
    constructor(callback, context) {
        this.callback = callback;
        this.context = context;
    }

    /**
     * 发送通知
     * @param {any[]} args,不定参数
     */
    notify(...args) {
        // console.log("notify");
        // console.log(this.callback);
        this.callback.call(this.context, ...args);
    }

    /**
     * 对比载体
     */
    compar(context) {
        return context == this.context;
    }
}

/**
 * 消息发送类
 */
class Emitter {
    /**监听者队列 */
    static listeners = {};

    /**
     * 注册消息监听，记住监听者销毁时候，要去把注册过的监听注销
     * @param {string} name 消息id
     * @param {Function} callback 回调方法
     * @param {any} context 监听者
     */
    static register(name, callback, context) {
        let observers = Emitter.listeners[name];
        if (!observers) {
            Emitter.listeners[name] = [];
        }
        Emitter.listeners[name].push(new Observer(callback, context));
    }

    /**
     * 注销监听
     * @param {string} name 消息id
     * @param {any} context 监听者
     */
    static remove(name, context) {
        let observers = Emitter.listeners[name];
        if (!observers) return;
        let length = observers.length;
        for (let i = 0; i < length; i++) {
            let observer = observers[i];
            if (observer.compar(context)) {
                observers.splice(i, 1);
                break;
            }
        }
        if (observers.length == 0) {
            delete Emitter.listeners[name];
        }
    }

    /**
     * 发送消息
     * @param {string} name 消息id
     * @param {any[]} args 不定参数
     */
    static fire(name, ...args) {
        let observers = Emitter.listeners[name];
        if (!observers) return;
        let length = observers.length;
        for (let i = 0; i < length; i++) {
            let observer = observers[i];
            observer.notify(...args);
        }
    }
}

module.exports.Emitter = Emitter;