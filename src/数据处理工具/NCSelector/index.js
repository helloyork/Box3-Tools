class NCSelector {
    constructor(selectorString) {
        if (!selectorString || !selectorString.length) throw new Error('Selector String Required')
        this.data = [];
        let match = /@([a-zA-Z])(?:\[(.*?)\])?/;
        if (selectorString.match(match) && selectorString.match(match)[1]) this.type = selectorString.match(match)[1]
        else { this.type = selectorString; return; }
        if (selectorString.match(match)[2] && selectorString.match(match)[2].length) {
            selectorString.match(match)[2].match(/("[^"]*"|[^,])+/g).forEach(v => {
                this.data.push(this.parseCondition(v));
            })
        };
    }
    parseCondition(condition) {
        let r = condition.match(/([^=!]+)(=!|=)(("[^"]*")|[^,]+)/);
        return { a: r[1].trim(), e: r[2].trim() == '=', b: r[3].trim(), };
    }
    exec(executor) {
        var target;
        if (NCSelector.selectorType[this.type]) target = NCSelector.selectorType[this.type](executor)
        else var target = world.querySelectorAll('player').filter(v => v.player.name == this.type);
        if(this.data.length) this.data.forEach(v => {
            if(v.a=='limit')return
            target = target.filter(r => { return NCSelector.detector[v.a] ? NCSelector.detector[v.a](r, v, executor) : false });
        });
        if (this.data.filter(v => v.a == "limit").length) { target = target.slice(0, parseInt(this.data.filter(v => v.a == "limit")[0].b)) };
        return target;
    }
    addCondition(condition) {
        if (!condition) return;
        this.data.push(this.parseCondition(condition));
        return this.data;
    }
    removeCondition(condition) {
        if (!condition) return;
        this.data = this.data.filter(v => v !== this.parseCondition(condition));
        return this.data;
    }
    static selectorType = {
        'p': (executor) => {
            if (!executor) return [];
            let min = Infinity;
            let minP = null;
            world.querySelectorAll('player').filter(v => v !== executor).forEach(v => {
                if (v.position.distance(executor.position) < min) { minP = v; min = v.position.distance(executor.position); }
            })
            return [minP];
        },
        'a': () => { return world.querySelectorAll('player') },
        'e': () => { return world.querySelectorAll('*').filter(v => !v.hp <= 0) },
        'r': () => { return [world.querySelectorAll('player')[Math.floor(Math.random() * world.querySelectorAll('player').length)]] },
        's': (executor) => { return executor ? [executor] : [] }
    }
    static entityType = {
        'player': (e) => { return e.isPlayer },
    }
    static detector = {
        'name': (target, data) => {
            let result = target.name == data.b.replace(/^"(.*)"$/, '$1')
            return data.e ? result : !result;
        },
        'x': (target, data) => {
            let r = 'x', result;
            if (data.b.startsWith('..') || data.b.endsWith('..')) result = this.compareRelatedNum(target.position[r], data.b)
            else result = Math.floor(target.position[r]) == parseInt(data.b);
            return data.e ? result : !result
        },
        'y': (target, data) => {
            let r = 'y', result;
            if (data.b.startsWith('..') || data.b.endsWith('..')) result = this.compareRelatedNum(target.position[r], data.b)
            else result = Math.floor(target.position[r]) == parseInt(data.b);
            return data.e ? result : !result
        },
        'z': (target, data) => {
            let r = 'z', result;
            if (data.b.startsWith('..') || data.b.endsWith('..')) result = this.compareRelatedNum(target.position[r], data.b)
            else result = Math.floor(target.position[r]) == parseInt(data.b);
            return data.e ? result : !result
        },
        'distance': (target, data, executor) => {
            let result;
            if (data.b.startsWith('..') || data.b.endsWith('..')) result = this.compareRelatedNum(Math.floor(target.position.distance(executor.distance)), data.b)
            else result = Math.floor(target.position.distance(executor.distance)) == parseInt(data.b);
            return data.e ? result : !result
        },
        'tag': (target, data) => {
            let result = target.hasTag(data.b.replace(/^"(.*)"$/, '$1'));
            return data.e ? result : !result;
        },
        'type': (target, data) => {
            let result = this.entityType[data.b.replace(/^"(.*)"$/, '$1')] ? this.entityType[data.b.replace(/^"(.*)"$/, '$1')](target) : false;
            return data.e ? result : !result;
        }
    }
    static compareRelatedNum(num, npnum) {
        if (npnum.startsWith('..')) return num <= Number(npnum.replace(/^\.+|\.+$/g, ""))
        else if (npnum.endsWith('..')) return num >= Number(npnum.replace(/^\.+|\.+$/g, ""));
        return;
    }
    static subscribeDetector(name, handler) {
        if (typeof name == "string" && typeof handler == "function") this.detector[name] = handler;
    }
    static subscribeEntityType(name, handler) {
        if (typeof name == "string" && typeof handler == "function") this.entityType[name] = handler;
    }
}


/**
 * 搜寻一个实体，要求类型为玩家，y坐标大于8
 */
(new NCSelector('@e[type=player,y=8..]')).exec(executor)

/**
 * 搜寻一个实体，y坐标小于8，x为5
 */
(new NCSelector('@e[y=..8,x=5]')).exec(executor)

/**
 * 搜寻一个玩家，包含标签NomenQwQ
 */
(new NCSelector('@a[tag="NomenQwQ"]')).exec(executor)

/**
 * 搜寻一个实体，与执行者的距离大于3
 */
(new NCSelector('@e[distance=3..]')).exec(executor)

/**
 * 搜寻执行者本身
 */
(new NCSelector('@s')).exec(executor);