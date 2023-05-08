/**
 * !info {Project} -来自(shequ.codemao.cn/community/379286)@吉吉喵
 * 分组PK是一种常见的多人游戏模式
 * 今天吉吉喵就叫你如何给玩家分组对战～
 */



function joinRed(entity) {
    entity.addTag('red')//加红队标签
    entity.player.color.set(1, 0, 0)//变红
    world.say(`${entity.player.name} 被分配到红队`)
}

function joinBlue(entity) {
    entity.addTag('blue')//加蓝队标签
    entity.player.color.set(0, 0, 1)//变蓝
    world.say(`${entity.player.name} 被分配到蓝队`)
}

world.onPlayerJoin(({ entity }) => {

    const red = world.querySelectorAll('.red') //红队玩家列表
    const blue = world.querySelectorAll('.blue') //蓝队玩家列表
    if (red.length === blue.length) {//如果两队人数相同
        if (Math.random() < 0.5) {//随机加入其中一队
            joinBlue(entity)//加入蓝队
        }
        else {
            joinRed(entity)//加入红队
        }
    }
    else if (red.length > blue.length) {//如果红队人多
        joinBlue(entity)//加入蓝队
    }
    else {
        joinRed(entity)//加入红队
    }

})