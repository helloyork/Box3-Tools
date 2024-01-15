/**
 * !info {Module} -来自PGAoT-VAS
 */

/**
 * @class 
 * @classdesc 字典
 * @desc 封装JS实现字典操作
 */
class Dictionary {

    constructor() {
        this.datastore = new Array();
    }

    /**
     * 存入字典
     * @param {string} key 键
     * @param {any} value 值
     */
    Add(key, value) {
        if (!this.datastore[key])
            this.datastore[key] = value;
    }

    /**
     * 从字典剔除
     * @param {string} key 键
     */
    Remove(key) {
        if (this.datastore[key]) {
            delete this.datastore[key];
        }
    }

    /**
     * 尝试获取字典中的值
     * @param {string} key 键
     * @return {any} 返回的值
     */
    TryGetValue(key) {
        if (this.datastore[key]) {
            return this.datastore[key];
        }
        return null;
    }

    /**
     * 检验键是否在字典中
     * @param {string} key 键
     * @return {boolean} 是否存在
     */
    ContainKey(key) {
        if (this.datastore[key]) {
            return true;
        }
        return false;
    }

    /**
     * 通过键修改值
     * @param {string} key 键
     * @param {any} value 值
     * @return {boolean} 是否修改成功
     */
    SetValue(key, value) {
        if (this.datastore[key]) {
            this.datastore[key] = value;
            return true;
        }
        return false;
    }

    /**
     * 获取所有的键
     * @return {object} 所有键列表
     */
    GetKeys() {
        let result = [];
        for (var key in this.datastore) {
            result.push(key);
        }
        return result;
    }

    /**
     * 获取所有的值
     * @return {object} 所有值列表
     */
    GetValues() {
        let result = [];
        for (var key in this.datastore) {
            result.push(this.datastore[key]);
        }
        return result;
    }

    /**
     * 清空字典
     */
    ClearAll() {
        for (var key in this.datastore) {
            delete this.datastore[key];
        }
    }
}

module.exports.Dictionary = Dictionary;
