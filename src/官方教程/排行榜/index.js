/**
 * !info {Project} -来自(shequ.codemao.cn/community/415223)@吉吉喵
 * 圣诞创作节下半场已经在昨天开启
 * “第一才有圣诞礼物”这个主题让你想到什么呢？
 * 没错，就是排行榜！
 * 加入这个功能，一定会让你的参赛作品赢面更大～
 */



// 当玩家进入游戏时
world.onPlayerJoin(({ entity }) => {
    // 设置刚进入游戏的玩家持有金币(coin)数量为0
    entity.player.coin = 0
    // 当玩家按下按键时，触发交互
    entity.player.onPress(({ button }) => {
        if (button === Box3ButtonType.ACTION0) {
            entity.player.dialog({
                type: Box3DialogType.TEXT,
                title: "金币排行榜",
                content: dialogContent(),
            })
        }
    })
});

// 找到世界中的"AT M"机器模型
const atm = world.querySelector(`#A喵`)
// 设置AT M机器可互动
atm.enableInteract = true
// 设置AT M机器互动距离为5
atm.interactRadius = 5;

// 监听世界中的互动事件
world.onInteract(({ entity, targetEntity }) => {
    // 判断被"互动"的实体，
    if (targetEntity.id === "A喵") {
        entity.player.coin = entity.player.coin + 1;
        world.say(`${entity.player.name}获得了1金币！`);
    }
})

// 对话框内容
function dialogContent() {
    // 首先获取当前世界中的所有玩家
    const allPlayerEntities = world.querySelectorAll('player');
    // 然后将所有的玩家进行排序，排序的规则是按照玩家持有的金币数量降序
    const sortedPlayerEntities = allPlayerEntities.sort((a, b)=>  b.player.coin - a.player.coin);
    
    
    // 接下来，我们将在排行榜上以: xxx 有 yyy 个金币 的格式展示，并且每一条信息换一行显示！

        // 首先声明一个content字符串，一会用来保存每一个玩家的信息
        let content = "";
    // 在这里需要做一个循环遍历，将刚才得到的有序的玩家数组遍历一遍
    for(const entity of sortedPlayerEntities ) {
        // 在遍历的过程中，每一次遍历，我们拿到当前的实体(entity)，
        // 将实体上的玩家名字(player.name)以及玩家金币数量(player.coin)拼接成排行榜上的一行信息
        // 这样就得到: xxx 有 yyy 个金币 的格式啦
        // 我们在这个文字的末尾加一个\n, 这样我们就能实现换行的效果
        // 紧接着，再把这行信息加上content，这样做是为了把每一个玩家的排行榜信息拼接起来，保存到content中
        content = content + `${entity.player.name}有${entity.player.coin}个金币\n`
    }
    // 最后，把得到的完整的带有玩家名称和金币数量，并且会换行的排行榜数据(content)返回出去
    return content
}