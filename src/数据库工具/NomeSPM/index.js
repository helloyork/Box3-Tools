const NomenSPM = require("./NomenSPM.js");

let NomenSPMI = new NomenSPM({
    fields: ["coin", "weapons"], // 受到管理的字段名，例如entity.weapons和entity.coin则为["weapons", "coin"]
    init: {
        coin: 100, // 指定字段的初始值，如果不存在则为undefined
        weapons: {
            leftHand: ["钻石剑"]
        }
    }
})

world.onPlayerJoin(async ({ entity }) => {
    let res = await NomenSPMI.load(entity); // 载入玩家数据 (Promise)

    console.log(JSON.stringify(res)); // 玩家的字段数据

    if (!res.data) { // 如果数据不存在
        await NomenSPMI.init(entity); // 初始化玩家数据 (Promise)
        console.log(`欢迎 ${entity.player.name} 第一次来到这里`);
    }

    console.log(`${entity.player.name}的金币数量是${entity.coin}`);

    entity.coin = 114514; 

    console.log(`${entity.player.name}的金币数量被修改为${entity.coin}`);
});

world.onPlayerLeave(async({entity})=>{
    await NomenSPMI.save(entity); // 保存玩家数据 (Promise)
})

// 第一个参数应该是指定玩家的userKey，第二个参数操作一个虚拟玩家，请注意，对于虚拟玩家的操作，函数只会记录受到管理的字段，其余字段将被忽略
// 该函数能让控制者轻松的修改不在地图内的玩家，只需对于虚拟玩家如同普通玩家一样操作，不需要面对抽象的返回值和SQL步骤
// (Promise)
NomenSPMI.update("玩家的userKey",(entity)=>{
    entity.coin=0; // 将虚拟玩家的金币数量设置为0
    return entity; // 上传虚拟玩家
})


// 删除指定玩家的字段记录
NomenSPMI.del("玩家的userKey");
