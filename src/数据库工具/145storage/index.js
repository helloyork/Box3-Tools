/**
 * !Info {Module} -来自145a
 * 145storage 3.8
 * 145storage是145lab的一部分
 */
/**
 * 缓冲时间
 * @type {number}
 */
storage.REQUEST_MIN_INTERVAL = 100;
class DeepProxy {
    /**
     * @param {object} target
     * @param {object} handler
     */
    constructor(target, handler) {
        const deepHandler = Object.assign({}, handler);
        deepHandler.get = (target, p, ...receiver) => {
            const value = Reflect.get(target, p, ...receiver);
            if (typeof (value) === "object" && value !== null) {
                return new DeepProxy(value, handler);
            } else {
                if (handler.get) {
                    return handler.get(target, p, ...receiver);
                } else {
                    return value;
                }
            }
        };
        return new Proxy(target, deepHandler);
    };
}
/**
 * @param {object} host
 * @param {string} key
 * @param {any} defaultValue
 * @param {function(JSONValue)} updater
 */
storage.setupCloudVariable = async function (host, key, defaultValue, updater) {
    const cacheKey = `_${key}_cache_`;
    const objectCacheKey = `_${key}_object_cache_`;
    const isWaitingKey = `_${key}_isWaiting_`;
    const scheduleUpdateKey = `_${key}_scheduleUpdate_`;
    host[cacheKey] = typeof defaultValue === "object"?Object.assign({},defaultValue):defaultValue;
    host[isWaitingKey] = false;
    host[scheduleUpdateKey] = async function () {
        if (host[isWaitingKey]) return;
        host[isWaitingKey] = true;
        await sleep(storage.REQUEST_MIN_INTERVAL);
        host[isWaitingKey] = false;
        updater(host[cacheKey]);
    }
    Object.defineProperty(host, key, {
        get() {
            return host[cacheKey];
        },
        set(value) {
            host[cacheKey] = value;
            host[scheduleUpdateKey]();
            return true;
        }
    });
    if (typeof defaultValue === "object" && defaultValue !== null) {
        host[objectCacheKey] = defaultValue;
        host[cacheKey] = new DeepProxy(host[objectCacheKey], {
            set(target, property, value, receiver) {
                Reflect.set(target, property, value, receiver);
                host[scheduleUpdateKey]();
                return true;
            }
        });
    }
}
/**
 * @param {String} name
 * @param {JSONValue} defaultUserData 用户默认属性和数据类型，其中name自带
 * @returns {GameDataStorage}
 */
storage.get145DataStorage = function (name, defaultUserData) {
    let host = storage.getDataStorage(name);
    Object.assign(defaultUserData, {
        name: "游客"
    });
    /**
     * @param {GamePlayerEntity} user
     */
    host.setupUser = async function (user) {
        if (!user || !user.isPlayer) throw `setupUser的参数不对`;
        if (!user.player.userId) return;
        let dataStorage = this;
        const data = await dataStorage.get(user.player.userId);
        if (!data) {
            await dataStorage.set(user.player.userId, defaultUserData);
            return await dataStorage.setupUser(user);
        }
        user._isPreparingUpdate_ = false;
        user._storageUpdateCache_ = {};
        Object.keys(defaultUserData).forEach(key => {
            if (data.value[key] == null || typeof data.value[key] !== typeof defaultUserData[key]) {
                data.value[key] = defaultUserData[key];
            }
            user._storageUpdateCache_[key] = data.value[key];
            storage.setupCloudVariable(user, key, data.value[key], async (value) => {
                user._storageUpdateCache_[key] = value;
                if (user._isPreparingUpdate_) return;
                user._isPreparingUpdate_ = true;
                await sleep(storage.REQUEST_MIN_INTERVAL);
                dataStorage.set(user.player.userId, user._storageUpdateCache_);
                user._isPreparingUpdate_ = false;
            });
        });
        user.name = user.player.name;
    }
    /**
     * @param {string} name
     * @param {string} displayName
     * @param {number} num
     * @param {boolean} ascending
     * @returns {string}
     */
    host.getRank = async function (name, displayName, num = 100, ascending) {
        const data = (await this.list({
            cursor: 0,
            pageSize: num,
            constraintTarget: name,
            ascending: ascending
        })).getCurrentPage().map(v => ({
            key: v.key,
            value: v.value
        }));
        let result = `用户名 ${displayName}\n` + data.map((v) => `${v.value.name} ${v.value[name]}`).join("\n");
        return result;
    }
    return host;
}
//请勿删除最后一行