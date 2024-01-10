/**
 * !Info {Module} -来自145a
 * 145Storage 3.2
 */
/**
 * 缓冲时间，防止http报错429
 * @type {number}
 */
storage.REQUEST_MIN_INTERVAL = 64;
/**
 * 初始化云属性
 * @param {object} host
 * @param {string} key
 * @param {any} defaultValue
 * @param {function(JSONValue)} updater
 */
storage.setupCloudVariable = async function (host, key, defaultValue, updater) {
    const cacheKey = `_${key}_cache`;
    const isWaitingKey = `_${key}_isWaiting`;
    const scheduleUpdateKey = `_${key}_scheduleUpdate`;
    host[cacheKey] = defaultValue;
    host[isWaitingKey] = false;
    host[scheduleUpdateKey] = async function () {
        if (host[isWaitingKey]) return;
        host[isWaitingKey] = true;
        await sleep(storage.REQUEST_MIN_INTERVAL);
        host[isWaitingKey] = false;
        updater(host[cacheKey]);
    }
    if (typeof host[cacheKey] === "object") {
        host[key] = new Proxy(host[cacheKey], {
            set(target, property, value, receiver) {
                Reflect.set(target, property, value, receiver);
                host[scheduleUpdateKey]();
                return true;
            }
        });
    } else {
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
    }
}
/**
 * @typedef {function(a,b):number} Sorter
 * @type {Object<Sorter>}
 */
Array.SorterType = {
    DESC: (a, b) => b - a,
    ASC: (a, b) => a - b
}
/**
 * 初始化一个145DataStorage
 * @param {String} name
 * @param {JSONValue} defaultUserData 用户默认属性和数据类型
 * @returns {GameDataStorage}
 */
storage.get145DataStorage = function (name, defaultUserData) {
    let host = storage.getDataStorage(name);
    Object.assign(defaultUserData, {
        name: "游客",//此项不可删除
        joinTimes: 0,//此项不可删除
    });
    /**
     * 为用户初始化
     * @param {GamePlayerEntity} user
     */
    host.setupUser = async function (user) {
        if (!user || !user.isPlayer) throw `setupUser的参数不太对劲`;
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
            if(typeof data.value[key] !== typeof defaultUserData[key]){
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
        user.joinTime += 1;
    }
    /**
     * 获取排行榜
     * {@link Array.SorterType}
     * @param {string} type
     * @param {string} displayType
     * @param {number} num
     * @param {Sorter} sorter
     */
    host.getRank = async function (type, displayType, num = 10, sorter) {
        let data = (await this.list({
            cursor: 0,
            pageSize: Number.MAX_SAFE_INTEGER - 1
        })).getCurrentPage().map(v => ({
            key: v.key,
            value: v.value
        })).filter(v=>!["null","undefined"].includes(typeof v.value[type]));
        data.sort((a, b) => sorter(a.value[type], b.value[type]));
        let result = `用户名 ${displayType}\n` + data.slice(0, num).map((v) => `${v.value.name} ${v.value[type]}`).join("\n");
        return result;
    }
    return host;
}
//请勿删除最后一行