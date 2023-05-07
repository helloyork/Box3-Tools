/**
 * !info {Module} -来自Nomen
 * Nomen SQL 通用模板（适用于PG和SQLite）
 */



class Nomen {
    constructor(timeSleep = 2000) { var init = (async () => { console.log(`[ Nomen正在尝试启动数据库，请稍后 ]`); while (true) { try { await db.sql`CREATE TABLE IF NOT EXISTS "Nomen" ("type" TEXT NOT NULL,value TEXT)`; console.log(`Nomen主数据库启动成功`); return; } catch (e) { const msg = e.message; if (msg.includes('timeout')) { world.say(`| Nomen数据库遇到致命错误，请联系官方进行修复 |\n错误消息为:启动超时`) } else { count++; console.log(`尝试启动中`); } } await sleep(timeSleep); } })(); }
    insert = async function (type, value) { if (['init', 'Nomen', 'sql', 'table'].includes(type)) { console.error('Cannot use reserved words'); return; } return await db.sql`INSERT INTO "Nomen" (type,value) VALUES(${type},${value})` };
    update = async function (type, value, olddata) { await db.sql`UPDATE "Nomen" SET value = ${value} WHERE type = ${type}`; };
    select = async function (type) { if (type == "*") { const values = await db.sql`select  * from "Nomen"`; return values; } else { const values = await db.sql`select * from "Nomen" WHERE "type" = ${type}`; return values; } };
    remove = function (type) { if (['init', 'Nomen', 'sql', 'table'].includes(type)) { console.error('Cannot use reserved words'); return; } db.sql`DELETE FROM "Nomen" WHERE type = ${type}` };
    clear = function () { db.sql`DELETE FROM "Nomen"` };
    show = async function () { const values = await db.sql`select  * from "Nomen"`; values.forEach((t) => { console.log(Object.values(t)) }) }
}

module.exports = {
    Nomen
}
