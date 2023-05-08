/**
 * !info {Project} -来自(shequ.codemao.cn/community/388136)@吉吉喵
 * 给玩家分组对战的进阶版教程来力！
 */



function joinRed(entity) {
    entity.addTag('red')//加红队标签
    entity.player.color.set(1, 0, 0)//变红
    world.say(`${entity.player.name} 被分配到红队`)
    entity.player.spawnPoint.set(5, 10, 64)//设置红队的出生点在地图的一边
}

function joinBlue(entity) {
    entity.addTag('blue')//加蓝队标签
    entity.player.color.set(0, 0, 1)//变蓝
    world.say(`${entity.player.name} 被分配到蓝队`)
    entity.player.spawnPoint.set(122, 10, 64)//设置蓝队的出生点在地图的另一边
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

    entity.player.forceRespawn() //传送到自己队伍的出生点
    entity.enableDamage = true //允许玩家受伤
    entity.score = 0 //玩家初始得分为0
    entity.onDie(async ({ attacker }) => {
        let attackerTeam = teamName(attacker)//对手的队名
        let myTeam = teamName(entity)//玩家的队名

        world.say(`[${attackerTeam}]${attacker.player.name} 击败了 [${myTeam}]${entity.player.name}`)
        attacker.score += 1 //当玩家被击败时, 给对手加1分

        await sleep(5000) //等待5秒后复活
        entity.player.forceRespawn() //满血回到出生点
    })
})

function teamName(entity) {
    if (entity.hasTag('red')) {//如果有红队标签
        return '红队'
    }
    else if (entity.hasTag('blue')) {//如果有蓝队标签
        return '蓝队'
    }
    return '未知队伍'
}

world.onClick(({ entity, clicker }) => {
    if ( //如果攻击者和被击者在不同的队伍, 则被击者会受伤
        (entity.hasTag('red') && clicker.hasTag('blue')) || //被击者是红队, 攻击者是蓝队
        (entity.hasTag('blue') && clicker.hasTag('red')) //或者 被击者是蓝队, 攻击者是红队
    ) {
        entity.hurt(10, { attacker: clicker }) //被点击者受到10点伤害, 并将点击者传递给onDie事件
    }
})

world.onPress(({ entity, button }) => {
    if (button == Box3ButtonType.ACTION1) { //右键查看自己的分数
        entity.player.dialog({
            type: Box3DialogType.TEXT,
            content: `本回合你击败了${entity.score}个对手`
        })
    }
})