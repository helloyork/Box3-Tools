/**
 * !info {Module} -来自Nomen
 * Nomen SQL FireWall带防火墙版本，可用进行备份，按照唯一序列id操作等操作（适用于SQLite）
 */



class Nomen {
    constructor() {
        if (global.nomen !== undefined) return;
        const init = (async () => {
            await db.sql`CREATE TABLE IF NOT EXISTS Nomen (type TEXT NOT NULL,value TEXT)`; const values = await db.sql`SELECT * FROM Nomen WHERE type = "init"`;
            if (values && !values.length) { await db.sql`INSERT INTO Nomen (type,value) VALUES('init',${useNomen[0]})`; console.log(`[Nomen INIT]`); for (let ind in useNomen) { await db.sql`INSERT INTO Nomen (type,value) VALUES('Nomen',${useNomen[ind]})` } db.sql`CREATE INDEX index ON Nomen (type,id,rowid)`; }
            else if (values[0].value != useNomen[0]) { await db.sql`UPDATE Nomen SET value = ${useNomen[0]} WHERE type = 'init'`; db.sql`DELETE FROM Nomen WHERE type = 'Nomen'`; for (let ind in useNomen) { await db.sql`INSERT INTO Nomen (type,value) VALUES('Nomen',${useNomen[ind]})`; console.clear(); console.log(`> [ Nomen UPDATE (${parseInt(ind, 10) + 1}/${useNomen.length}) ]`) } console.log(`< [ Nomen UPDATE COMPLETED ]`) } else { console.log(`[Nomen INITED]`) };
            delete this.then
            return this
        })()
        this.then = init.then.bind(init)
    }
    data = {
        select: async function (type) { if (type == "*") { const values = await db.sql`select rowid, * from Nomen`; return values; } else { const values = await db.sql`select rowid, * from Nomen WHERE type = ${type}`; return values; } },
        selectID: async function (id) { const values = await db.sql`select rowid, * from Nomen WHERE rowid = ${id}`; return values; },
        deletel: async function (type) { if (reserve.includes(type)) { console.error('Cannot use reserved words'); return; } db.sql`DELETE FROM Nomen WHERE type = ${type}` },
        deleteID: async function (id) { return await db.sql`DELETE FROM Nomen WHERE rowid = ${id}` },
        update: async function (type, value) { return await db.sql`UPDATE Nomen SET value = ${value} WHERE type = ${type}`; },
        updateID: async function (type, value) { return await db.sql`UPDATE Nomen SET value = ${value} WHERE type = ${type}`; },
        insert: async function (type, value) { if (reserve.includes(type)) { console.error('Cannot use reserved words'); return; } return await db.sql`INSERT INTO Nomen (type,value) VALUES(${type},${value})` },
        clear: function () { db.sql`DELETE FROM Nomen WHERE type <> 'init' AND type <> 'Nomen'` },
        setAll: function (value) { db.sql`UPDATE Nomen SET value = ${value} WHERE type <> 'init' AND type <> 'patch' AND type <> 'Nomen'` },
        reset: async function () { await db.sql`DELETE FROM Nomen WHERE type <> 'init' AND type <> 'Nomen'`; for (; ;) { } }
    }
    dataBase = {
        all: async function () { console.log('====='); const values = await db.sql`select rowid, * from Nomen`; values.forEach((value) => { if (reserve.includes(value.type)) { console.warn(`[${value.type}]`, ':', value.value) } else { console.log(value.rowid, ':', value.type, ':', value.value) } }); console.log('====='); return values; },
        drop: function () { db.sql`DROP TABLE Nomen` },
        erase: function () { db.sql`DROP TABLE Nomen`; db.sql`DROP TABLE NomenClone`; console.error('[ERASE Nomen]'); },
        outRow: async function (type) { const out = await db.sql`select rowid, * from Nomen WHERE type = ${type}`; console.log(out); },
        outRowID: async function (id) { const out = await db.sql`select * from Nomen WHERE rowid = ${id}`; console.log(out); }
    }
    fireWall = {
        PATCH: async function () { const values = await db.sql`SELECT * FROM Nomen WHERE type = "patch"`; if (values && !values.length) return; values.forEach((value) => { eval(value.value); }) },
        backup: async function (id) {
            await db.sql`CREATE TABLE IF NOT EXISTS NomenClone (id TEXT NOT NULL,value TEXT NOT NULL)`;
            const valuesInClone = await db.sql`SELECT * FROM NomenClone WHERE id=${id}`; if (valuesInClone.length) { console.error('[BACKUP VOLUME ALREADY EXISTS]') }
            const values = await db.sql`SELECT * FROM Nomen`; if (values && !values.length) { console.error(`[NO VALUE IN Nomen TABLE]`); return; }
            await db.sql`INSERT INTO NomenClone  (id,value) VALUES(${id},${JSON.stringify(values)})`;
            const backups = await db.sql`SELECT * FROM NomenClone`; console.log(`Nomen BACKUP SUCCESS ; LENGTH: ` + backups.length)
        }, recover: async function (id) {
            await db.sql`CREATE TABLE IF NOT EXISTS NomenClone (id TEXT NOT NULL,value TEXT NOT NULL)`;
            const values = await db.sql`SELECT * FROM NomenClone WHERE id = ${id}`;
            if (values && !values.length) { console.error(`[NO ROWS IN NomenClone TABLE]`); return; } var rows = JSON.parse(values[0].value); var row = [];
            for (let ind1 in rows) { if (!reserve.includes(rows[ind1].type)) row.push(rows[ind1]) }
            await db.sql`DELETE FROM Nomen`; await db.sql`INSERT INTO Nomen (type,value) VALUES('init',${useNomen[0]})`;
            for (let ind in useNomen) { await db.sql`INSERT INTO Nomen (type,value) VALUES('Nomen',${useNomen[ind]})`; console.clear(); console.log(`> [ Nomen UPDATE (${parseInt(ind, 10) + 1}/${useNomen.length}) ]`); }
            for (let ind in rows) { if (!reserve.includes(rows[ind].type)) { await db.sql`INSERT INTO Nomen (type,value) VALUES(${rows[ind].type},${rows[ind].value})`; console.clear(); console.log(`< [ Nomen UPDATE (COMPLETED) ]`); console.log(`> [ Nomen RECOVE (${parseInt(ind, 10) + 1}/${rows.length}) ]`) } }
            console.clear(); console.log(`< [ Nomen UPDATE (COMPLETED) ]`); console.log(`< [ Nomen RECOVER (COMPLETED) ]`)
        }, show: async function () {
            await db.sql`CREATE TABLE IF NOT EXISTS NomenClone (id TEXT NOT NULL,value TEXT NOT NULL)`;
            const values = await db.sql`SELECT * FROM NomenClone`;
            if (values && !values.length) { console.error(`[NO BACKUPS]`); return; }
            values.forEach((row) => { console.log(row.id, ":", row.value) })
        },
        deletel: function (id) { db.sql`DELETE FROM NomenClone WHERE id = ${id}` },
        drop: function () { db.sql`DROP TABLE NomenClone` },
        clear: function () { db.sql`DELETE FROM NomenClone` },
    }
}

module.exports = {
    Nomen
}