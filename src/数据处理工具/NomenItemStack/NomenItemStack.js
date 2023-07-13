/**
 * !info {Module} -来自Nomen
 * 整活）NomenItemStack：快捷管理物品栈/背包，具有堆叠上限和全map操作 - https://shequ.codemao.cn/community/550650
 */


/**
 * @typedef {object} NomenItemStackItem
 * @property {string | number} id 相同id的物品可以堆叠，依靠id查找
 * @property {number} num 数量
 * @property {boolean} canStack 是否能堆叠
 */
/**
 * @typedef {object} NomenItemStackConfig
 * @property {number | undefined} maxItem
 */


class NomenItemStack {
    /**
     * @param {NomenItemStackItem[] | undefined} is 
     * @param {NomenItemStackConfig | undefined} config
     */
    constructor(is, config) {
        if (!is) is = [];
        if (!config) config = {};
        this.IS = this.parse(is) || [];
        this.maxItem = config.maxItem || 64;
    }

    /**@param {NomenItemStackItem|string} is  */
    parse(is) {
        function check(l) {
            if (Array.isArray(l)) {
                return l.filter(v => v.id !== undefined);
            };
            return null;
        }
        if (typeof is == "string") {
            try {
                return check(JSON.parse(is))
            } catch {
                return null;
            }
        };
        return check(is);
    }

    /**@param {NomenItemStackItem} item  */
    add(item, _skip) {
        if (item.canStack !== undefined && !item.canStack) {
            for (let i = 0; i < item.num; i++) {
                this.IS.push({ ...item, num: 1 });
            }
            return;
        }
        if (this.IS.filter(v => v.id == item.id).length && _skip !== true) {
            let l = item.num, r = this.IS.filter(v => v.id == item.id);
            for (let i = 0; i < r.length; i++) {
                if (l <= 0) return;
                if (r[i].num + l > this.maxItem) {
                    l -= this.maxItem - r[i].num;
                    r[i].num += this.maxItem - r[i].num;
                } else {
                    l = 0;
                    r[i].num += l;
                    return;
                }
            };
            this, this.add({ ...item, num: l }, true)
        } else {
            if (item.num > this.maxItem) {
                let r = (item.num - (item.num % this.maxItem)) / this.maxItem;
                for (let i = 0; i < r; i++) {
                    this.IS.push({
                        ...item,
                        num: this.maxItem
                    });
                };
                if (item.num % this.maxItem) {
                    this.IS.push({
                        ...item,
                        num: item.num % this.maxItem
                    });
                }
            }
            else {
                this.IS.push({
                    ...item,
                    num: item.num
                });
            }

        }
    }

    num(id) {
        if (!this.get(id).length) return false;
        return this.IS
            .filter(v => v.id == id)
            .map(v => v.num)
            .filter(v => typeof v == "number")
            .reduce((a, b) => a + b, 0);
    }

    enough(id, num) {
        if (!this.get(id).length) return false;
        return this.num(id) >= num;
    }

    remove(id, num) {
        if (!this.enough(id, num)) return false;
        let l = num, r = this.get(id), td = [];
        for (let d of r) {
            if (d.num > l) {
                d.num -= l;
                this.IS = this.IS.filter(v => v.num > 0)
                return true;
            } else {
                l -= d.num;
                d.num = 0;
                if (l == 0) {
                    this.IS = this.IS.filter(v => v.num > 0)
                    return true;
                }
            }
        }
    }

    has(id) {
        return !!this.IS.filter(v => v.id == id).length;
    }
    get(id) {
        return this.IS.filter(v => v.id == id);
    }
    entries() {
        return [Object.keys(this._gen()), Object.values(this._gen())];
    }
    forEach(c) {
        return this.IS.forEach(c);
    }
    delete(id) {
        this.IS = this.IS.filter(v => v.id != id);
    }
    keys() {
        return Object.keys(this._gen())
    }
    values() {
        return Object.values(this._gen())
    }
    clear() {
        this.IS = [];
    }
    _gen() {
        let output = {};
        this.IS.forEach(v => {
            if (output[v.id]) {
                output[v.id] += v.num;
            } else {
                output[v.id] = v;
            }
        });
        return output;
    }
}

module.exports.NomenItemStack = NomenItemStack;

