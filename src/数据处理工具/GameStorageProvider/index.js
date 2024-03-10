/* eslint-disable no-unused-vars */

class StorageProvider {
    constructor() {
        this.storage = null;
    }

    setStorage(storage) {
        this.storage = storage;
        return this;
    }
    call(obj, key, args) {
        if (typeof obj[key] === "function") {
            return obj[key](...args);
        }
        throw new Error(`Provider ${obj.constructor.name || "StorageProvider"} does not have method ${key}`);
    }

    set(key, value) {
        return this.call(this.storage, "set", [key, value]);
    }
    update(key, handler) {
        return this.call(this.storage, "update", [key, handler]);
    }
    get(key) {
        return this.call(this.storage, "get", [key]);
    }
    list() {
        return this.call(this.storage, "list", []);
    }
    remove(key) {
        return this.call(this.storage, "remove", [key]);
    }
}

