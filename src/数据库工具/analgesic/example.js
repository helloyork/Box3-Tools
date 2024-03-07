
const { Analgesic, DataTypes  } = require("./analgesic.js");

const analgesic = new Analgesic({
    concurrentLimit: 10,
});
let table1 = analgesic.define("table2", {
    id: {
        type: DataTypes.NUMBER,
        unique: true,
        nullable: false,
    },
    name: DataTypes.STRING,
    age: DataTypes.NUMBER,
});

!async function(){
    // 进行同步
    // 初始化必须要进行同步
    await table1.sync();

    // 创建一条新数据
    await table1.create({
        id: 1,
        name: "Tom",
        age: 20,
    });

    // 查找一条id>0 && id<2的数据
    // 或者id: 1直接进行精准查找
    // 使用$like进行模糊搜索（RegExp）
    let result = await table1.find({
        id: {
            $lt: 2,
            $gt: 0,
        },
    });

    // 输出查找结果
    console.log(JSON.stringify((await result[0].get()).value));
}();
