/**
 * !info {Project} -来自Nomen
 * NomenSQLite示例-玩家存档:介绍帖子https://shequ.codemao.cn/community/539624
 */



const NomenSQLite = require('./src.index.js').NomenSQLite;
const Tables = {
    'NomenSQLite': [//这是一个表格
        { name: 'userkey', type: NomenSQLite.DataType.TEXT, notnull: true }, // 这是一行数据，类型为TEXT，名字叫userKey，不能为空
        { name: 'bag', type: NomenSQLite.DataType.TEXT, notnull: false },
        { name: 'coin', type: NomenSQLite.DataType.NUMBER, notnull: false }
    ],
};


var NomenUser = null;
(async () => {
    //初始化并启动NomenSQLite
    let Nomen = await NomenSQLite.launch(Tables, NomenSQLite.LaunchAction.CREATE_OR_LAUNCH, (a, b) => { console.error(b) });

    //然后初始化NomenSQLite这个表格的管理器
    NomenUser = Nomen.operate('NomenSQLite');
})()

const BAG = []//玩家背包初始状态
const COIN = 0;//玩家金币初始状态

//当玩家进入的时候
world.onPlayerJoin(async ({ entity }) => {
    //如果数据库和NomenSQLite没有准备好就重试
    while (true) {
        if (NomenUser && NomenUser.select) break;
    }

    //读取玩家的数据，使用玩家唯一的userKey进行标识
    let result = await NomenUser.select('userkey', entity.player.userKey);

    //如果玩家存在存档
    if (result.length) {

        //将玩家的金币设置为存档中的金币
        entity.coin = result[0].coin;

        //将玩家的背包解析出来
        entity.bag = JSON.parse(result[0].bag);
    } else {
        //如果不存在存档，就插入一个新的存档
        await NomenUser.insert({
            userkey: entity.player.userKey, //玩家唯一标识符
            bag: JSON.stringify(BAG), //玩家背包
            coin: COIN //玩家金币
        })
    }
})

world.onPlayerLeave(({ entity }) => {
    //更新玩家云存档
    NomenUser.update(`userkey=${entity.player.userKey}`//使用userKey搜寻玩家的旧存档
        , {
            bag: JSON.stringify(entity.bag), //玩家背包
            coin: entity.coin //玩家金币
        })
})