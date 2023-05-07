/**
 * !info {Project} -来自网络
 * PG SQL 操作
 */



class message {
    constructor(state, inform) {
        return { state: state === true ? 'Succeeded' : 'Failed', inform: inform }
    }
}
const value = {
    coin: 100,
}
class sql {
    constructor(tableName, init) {
        this.tableName = tableName;
        this.initValues = init;
        this.initialized = false;
    }    
    async init() {
        if (this.initialized) return;
        try {
            if((await db.sql`SELECT * FROM ${this.tableName} WHERE id = system`).length){
                console.log(`===[ ${this.tableName} inited ]===`);
                this.initialized = true;
                return;
            }
            db.sql`CREATE TABLE IF NOT EXISTS ${this.tableName}(
                key CHAR(16) NOT NULL,
                value TEXT NOT NULL
            )`
            console.log(`===[ ${this.tableName} init succeeded ]===`)
            // var row=db.sql`SELECT * FROM ${this.tableName} WHERE key=system`
            // if(row && !row.length){
            //     var data=JSON.stringify({initialized:true,tableName:this.tableName})
            //     db.sql`INSERT INTO ${this.tableName} VALUES(system,data)`;
            // }
            this.initialized = true;
        } catch (error) {
            throw new Error(`===[ ${this.tableName} init failed ]===\n${error}`)
        }
    }
    async initPlayer(targetEntity) {
        if (!this.initialized) {console.log('TABLE did not INIT');return;};
        Object.assign(entity, this.initValues);
        if (!targetEntity.player.userKey) return;
        const values = await db.sql`SELECT * FROM ${this.tableName} WHERE id = ${targetEntity.player.userKey}`;
        if (rows && !rows.length) {
            db.sql`INSERT INTO ${this.tableName} VALUES(${targetEntity.player.userKey},${value})`;
        } else {
            Object.assign(targetEntity, JSON.parse(values[0].value));
        }
    }
    async ALL() {
        if (!this.initialized) {console.log('TABLE did not INIT');return;};
        console.warn(`db.sql'SELECT * FROM ${this.tableName}'`)
        for await (const rows of db.sql`SELECT * FROM ${this.tableName}`) {//${this.tableName}
            // row.then((ele)=>{
            //     console.log(ele.key,":",JSON.parse(ele.value))
            // })
        }
    }
    async DROP() {
        // if (!this.initialized) {console.log('TABLE did not INIT');return;};
        await db.sql`DELETE FROM ${this.tableName}`;
        this.initialized = false;
    }
}



global.DB = {
    async poll() {
        while (true) {
            try {
                await db.sql`select 1;`
                break
            } catch (e) {
                world.say('pg数据库启动中...')
            }
            await sleep(1000)
        }
    },
    async insert(tbName, dict, key) {
        const keyList = Object.keys(dict)
        const valList = Object.values(dict).map((v, i) => {
            if (v.constructor === Array || v.constructor === Object) {
                return JSON.stringify(v)
            }
            return v
        })
        let cmd
        if (key) {
            cmd = [`INSERT INTO ${tbName} (${keyList})VALUES(`, ...(','.repeat(keyList.length - 1)), `) ON CONFLICT (${key}) DO NOTHING;`]
        } else {
            cmd = [`INSERT INTO ${tbName} (${keyList})VALUES(`, ...(','.repeat(keyList.length - 1)), `);`]
        }
        while (true) {
            try {
                return await db.sql(cmd, ...valList)
            } catch (e) {
                world.say(e.stack)
            }
            await sleep(300)
        }
    },
    async upsert(tbName, dict, key = 'userkey') {
        const keyList = Object.keys(dict)
        const valList = Object.values(dict).map((v, i) => {
            if (v.constructor === Array || v.constructor === Object) {
                return JSON.stringify(v)
            }
            return v
        })
        const cmd = [`INSERT OR REPLACE INTO ${tbName} (${keyList})VALUES(`, ...(','.repeat(keyList.length - 1)), `) ON CONFLICT (${key}) DO NOTHING;`]

        try {
            return await db.sql(cmd, ...valList)
        } catch (e) {
            world.say(e.stack + '\n' + cmd + '\n' + valList)
        }
    },
    async update(tbName, key, dict) {
        let id = dict[key]
        delete dict[key]
        let keyList = Object.keys(dict)
        const valList = Object.values(dict)
        let head = keyList.shift()
        let tail = keyList.map((e, i) => `,${e}=`)
        const cmd = [`UPDATE ${tbName} SET ${head}=`, ...tail, ` WHERE ${key}=`, ';']
        return await db.sql(cmd, ...valList, id)
    },
    async updateAll(tbName, dict) {
        let keyList = Object.keys(dict)
        const valList = Object.values(dict)
        let head = keyList.shift()
        let tail = keyList.map((e, i) => `,${e}=`)
        const cmd = [`UPDATE ${tbName} SET ${head}=`, ...tail, ';']
        return await db.sql(cmd, ...valList)
    },
    async del(tbName, cond) {
        const cmd = [`DELETE FROM ${tbName} WHERE ${cond};`]
        try {
            return await db.sql(cmd)
        } catch (e) {
            world.say(e.stack + '\n@' + cmd + '\n#' + cond)
        }
    },
    async find(tbName, cond) {
        cond = cond ? `WHERE ${cond}` : ''
        const cmd = [`SELECT * FROM ${tbName} ${cond} LIMIT 1;`]
        try {
            return (await db.sql(cmd))[0]
        } catch (e) {
            world.say(e.stack + '\n@' + cmd + '\n#' + cond)
        }
    },
    async findAll(tbName, cond) {
        cond = cond ? `WHERE ${cond}` : ''
        const cmd = [`SELECT * FROM ${tbName} ${cond};`]
        try {
            return await db.sql(cmd)
        } catch (e) {
            world.say(e.stack + '\n@' + cmd + '\n#' + cond)
        }
    },
    async drop(tbName) {
        const cmd = [`DROP TABLE ${tbName}`]
        return await db.sql(cmd)
    },
    async count(tbName) {
        const cmd = [`SELECT COUNT(*) FROM ${tbName}`]
        const out = (await db.sql(cmd))[0]['count']
        try {
            return out
        } catch (e) {
            world.say(e.stack)
        }
    },
    async table(tbName, dict) {
        const cmd = [`CREATE TABLE IF NOT EXISTS ${tbName} (${Object.entries(dict).map(([k, v]) => `${k} ${v}`).join(',')});`]
        try {
            return await db.sql(cmd)
        } catch (e) {
            world.say(e.stack)
        }
    },
    async rank(tbName, col, where, lim = 100, ord = 'desc') {
        const cond = where ? `WHERE ${where} ` : ''
        const cmd = [`SELECT * FROM ${tbName} ${cond} ORDER BY ${col} ${ord} LIMIT ${lim};`]
        try {
            return await db.sql(cmd)
        } catch (e) {
            world.say(e.stack)
        }
    },
    async savePlayer(user, ...keyList) {
        if (user.isGuest()) return
        const data = user.data
        const valList = keyList.map(e => {
            const v = data[e]
            if (v.constructor === Array || v.constructor === Object) {
                return JSON.stringify(v)
            } else if (v.constructor === Number) {
                return v
            }
            return v
        })
        let head = keyList.shift()
        let tail = keyList.map((e, i) => `,${e}=`)
        const cmd = [`UPDATE player SET ${head}=`, ...tail, ` WHERE userkey=`, '']
        while (true) {
            try {
                return await db.sql(cmd, ...valList, user.player.userKey)
            } catch (e) {
                world.say(e.stack + '\n@' + cmd + '\n#' + valList)
            }
            await sleep(300)
        }
    },
    async loadPlayer(user, list) {
        const userKey = user.player.userKey
        while (true) {
            try {
                const data = (await (db.sql`SELECT * FROM player WHERE userkey=${userKey}`))[0]
                if (data) {
                    for (const k of list) {
                        data[k] = JSON.parse(data[k])
                    }
                    user.data = data
                    return true
                }
                return false
            } catch (e) {
                world.say(e.stack)
            }
            await sleep(300)
        }
    },
}

async function initDB() {
    await DB.poll()
    await DB.table('record', {
        time: "int not null",
        boss: "varchar(30) default ''",
        result: 'int default 0',
        catSoldier: 'int default 0',
        spiderSoldier: 'int default 0',
        mentaSoldier: 'int default 0',
        buboSoldier: 'int default 0',
    })
    // 加新字段
    try {
        await db.sql`ALTER TABLE record ADD rhinoSoldier  int default 0`
    } catch (e) {
        console.log(e)
    }
}
initDB()
