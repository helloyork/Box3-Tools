/**
 * !info {Project} -来自Nomen
 * @version 1.0.0
 * NomenDBCore: 真正轻量级链式易于理解的通用SQL表格数据管理器 - https://shequ.codemao.cn/community/549057
 */


/*

(constructor)NomenDBCore(NomenDBCoreConfig)
NomenDBCoreConfig {
    executor?: function, 命令执行者，在执行语句时会传入：string[],...any[],默认为db.sql
    name: string, 
    db: "postgre"|"sqlite",
    debug?: boolean 如果为真，则会输出信息和警告
}

(instance)NomenDBCore.where(string,string,string | {})
如果为一个长度为3的数组，则第1项是字段名，第2项是运算符，第3项是值
例如：where("awa","=","qwq") => awa="qwq"
或者传入一个对象，例如 { awa: "qwq", Nomen: 114 } => awa="qwq" AND Nomen=114

(instance)NomenDBCore.insert([] | {}) => Promise<NomenDBCore>
传入一个数组时，则按照该顺序插入值
传入对象时，则按照键值对应插入值
请注意，你不应该让用户引用和操作你的字段名，这可能会存在注入风险

(instance)NomenDBCore.select(string | string[]) => Promise
传入字符串时，则返回此字符串列上的数据，如果为列表，则返回列表中字符串的数据
例如: select("*") => SELECT * FROM
select(["qwq","awa"]) => SELECT qwq,awa FROM

(instance)NomenDBCore.limit(number)
传入一个数字，限制返回的数据量

(instance)NomenDBCore.offset(number)
传入一个数字，指定返回数据的偏移量，例如执行翻页操作

(instance)NomenDBCore.del() => Promise
删除数据
警告：如果实例上没有where作为限制，则删除全部内容

(instance)NomenDBCore.update(value) => Promise
更新数据，如果传入三个字符串，则解析字符串为表达式如where所示并且更新
如果为对象则解析为多表达式并且更新
警告：如果实例上没有where作为限制，则更新全部内容

(instance)NomenDBCore.order(string,"ACS"|"DESC" | {})
如果传入两个字符串，则第一个字符串为键名，第二个字符串为排序方式，只能是"ACS"升序或"DESC"降序
如果传入对象，则分别按照键值排序
例如: {awa:"ACS",qwq:"DESC"} => ORDER BY awa ACS qwq DESC

(instance)NomenDBCore.addStringQuery(string)
请尽量不要使用该方法，该方法会将字符串作为搜索参数直接插入，具有被注入的风险
例如: addStringQuery("userKey=123") => WHERW userKey=123



*/

const NomenDBCore = require("./NomenDBCore.js")

let MyFirstNomenDBCore = new NomenDBCore({
    executor: db.sql,
    name: "Nomen",
    db: "sqlite"
});

MyFirstNomenDBCore.where({
    awa: 1, // 筛选awa为1的数据
    qwq: "qwq"  // 的同时筛选qwq为“qwq”的数据
})
    .limit(1) // 限制为仅获取1条数据
    .offset(2) // 偏移量2
    .order({
        awa: "ASC" // 按照awa字段排序，使用ASC升序，这里可以指定多个字段
    })
    .select("*") // 选择所有字段，返回Promise



let MySecondNomenDBCore = new NomenDBCore({
    executor: db.sql,
    name: "Nomen",
    db: "sqlite"
});

MySecondNomenDBCore.where({
    awa: 2 // 筛选awa值为2的数据
})
    .update({
        awa: 114, // 更新awa的值为114
        qwq: 514
    }) // 返回Promise<NomenDBCore>


MyFirstNomenDBCore.hook = function (data) {
    return data.filter(v => v.coin >= 10); // 将结果筛选为coin大于10的数据
}



