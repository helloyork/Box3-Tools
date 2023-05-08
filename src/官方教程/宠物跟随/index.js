/**
 * !info {Project} -来自(shequ.codemao.cn/community/378184)@吉吉喵
 * 想拥有一只独一无二的跟随宠物吗？
 * 想成为《学习吧！小精灵》里的被精灵环绕的大神吗？
 * 学会这招，你就是岛上最靓的崽～
 */



console.clear()
const mscale = 1 / 16
const Quat = new Box3Quaternion(0, 0, 0, 1)

function buddyFollow(entity, mesh, y) {
    const buddy = world.createEntity({
        mesh,
        position: entity.position,
        meshScale: [mscale, mscale, mscale],
        gravity: false, //不受重力影响
        fixed: false, //可推移
        collides: true, //可碰撞
        friction: 0, //无摩擦力
        mass: 0.01, //非常轻
    })

    const tgPos = entity.position//僚机的目标位置
    const budPos = buddy.position//僚机的当前位置
    const facing = entity.player.facingDirection//玩家的朝向
    const ratio = 0.3//追随的灵敏度, 最好设在0.5左右, 1.0表示立即移到玩家位置

    const dist = 2 //与玩家保持的距离
    const yOffset = y //y轴位移, 保持僚机在头顶或脚下

    const ticker = world.onTick(() => {

        //要让小精灵跟在玩家背后, 需要计算xz轴的位移: 玩家朝向的反方向
        const xOffset = -facing.x * dist
        const zOffset = -facing.z * dist

        //当前位置与目标位置在xyz轴的差距
        const xDiff = tgPos.x - budPos.x
        const yDiff = tgPos.y - budPos.y
        const zDiff = tgPos.z - budPos.z

        //计算xyz方向上 当前位置向目标位置靠拢的速度
        const 喵 = (xDiff + xOffset) * ratio
        const vy = (yDiff + yOffset) * ratio
        const vz = (zDiff + zOffset) * ratio

        buddy.velocity.set(喵, vy, vz)//设置僚机速度

        if (buddy.velocity.sqrMag() > 0.005) {//速度要足够大, 才触发转向, 防止抖动
            buddy.meshOrientation = Quat.rotateY(Math.atan2(zDiff, xDiff)) //让小精灵一直面向玩家
        }
    })

    return () => {
        ticker.cancel() //关掉tick循环
        buddy.destroy() //移除僚机实体
    }
}

world.onPlayerJoin(({ entity }) => {
    entity.setPet = buddyFollow(entity, 'mesh/皮卡丘.vb', -1) //给玩家增加宠物
})

world.onPlayerLeave(({ entity }) => {
    //玩家离开地图时, 切记一定要关掉tick循环以及销毁小精灵实体, 否则随着人数增加, 服务器积累到一定程度就会崩溃
    entity.setPet() //干掉宠物
})