/**
 * @info {mudole} --来自145a
 * 如题
 */
/**
 * 缓冲时间，防止http报错429
 * @type {number}
 */
storage.REQUEST_MIN_INTERVAL = 1000;
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
        updater(host[cacheKey]);
        host[isWaitingKey] = false;
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
 * 用户默认云属性
 * @type {JSONValue}
 */
storage.DEFAULT_USER_DATA = {
    items: [],
    totalScore: 0,
    joinTime: 0,
    money: 0,
    smallErasers: 0,
    boxes: [],
    bestScore: 0,
}
/**
 * @typedef {function(a,b):number} Sorter
 * @type {Object<Sorter>}
 */
Array.SorterType = {
    DESC: (a, b) => b - a,
    ASC: (a, b) => a - b
}
Array.SorterType
/**
 * 为用户初始化云属性，建议优先执行
 * {@link storage.DEFAULT_USER_DATA}
 * @param {GamePlayerEntity} user
 */
GameDataStorage.prototype.setupUser = async function (user) {
    if (!user || !user.isPlayer) throw `setupUser的参数不太对劲`;
    if (!user.player.userId) return;
    let dataStorage = this;
    const data = await dataStorage.get(user.player.userId);
    console.warn(JSON.stringify(data))
    if (!data) {
        dataStorage.set(user.player.userId, storage.DEFAULT_USER_DATA);
        Object.assign(user, storage.DEFAULT_USER_DATA)
        return await dataStorage.setupUser(user);
    }
    Object.keys(storage.DEFAULT_USER_DATA).forEach(key => {
        storage.setupCloudVariable(user, key, data.value[key], async (value) => {
            dataStorage.update(user.player.userId, ({ value: v }) => {
                v[key] = value;
                console.log(JSON.stringify(v))
                return v;
            });
        });
    })
    user.name = user.player.name;
}
/**
 * 获取排行榜
 * {@link Array.SorterType}
 * @param {string} type
 * @param {string} displayType
 * @param {number} num
 * @param {Sorter} sorter
 */
GameDataStorage.prototype.getRank = async function (type, displayType, num = 10, sorter) {
    let data = (await this.list({
        cursor: 0,
        pageSize: Infinity
    })).getCurrentPage().map(v => ({
        key: v.key,
        value: v.value
    }));
    data.sort((a, b) => sorter(a.value[type], b.value[type]));
    let result = data.slice(0, num).reduce((p, v) => p + `\n${v.value.name} ${v.value[type]}`, `用户  ${displayType}`);
    return result;
}
//请勿删除最后一行