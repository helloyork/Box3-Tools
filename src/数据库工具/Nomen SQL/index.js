/**
 * !info {Project} -来自Nomen
 * Nomen SQL 通用模板实际应用
 */



let _Nomen = require('./index.src.js').Nomen;
const nomen = new _Nomen();

world.onPlayerJoin(async ({ entity }) => {
    Object.assign(entity, {
        getData: async function () {
            Object.assign(this, Value)
            if (!this.player.userKey) return;
            nomen.select(this.player.userKey).then((ret) => {
                if (!ret.length) { nomen.insert(this.player.userKey, JSON.stringify(Value)); return; }
                Object.assign(this, JSON.parse(ret[0].value));
            })
        },
        update: async function () {
            if (!this.player.userKey) return;
            console.log(JSON.stringify(this.getSelf()))
            nomen.update(this.player.userKey, JSON.stringify(this.getSelf()))
        },
        getSelf: function () {
            const result = {}
            Object.keys(Value).forEach((tar) => {
                if (!this[tar]) result[tar] = this[tar] = Value[tar];
                else result[tar] = this[tar];
            })
            return result;
        }
    })
    entity.getData();
})
world.onPlayerLeave(({ entity }) => {
    entity.update();
})