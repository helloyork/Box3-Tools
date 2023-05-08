/**
 * !info {Project} -来自(shequ.codemao.cn/community/373142)@吉吉喵
 * 作为岛上最受欢迎的游戏类型
 * 跑酷是很多萌新都会选择的玩法
 * 除了存档功能之外
 * 吉吉喵今天再教你两招
 * 让你的跑酷地图与众不同！
 */



// 弹射板代码：
const pad = world.querySelector('#弹射跳板-1')
pad.onEntityContact(({ other, axis }) => {
    if (axis.y === -1) { // 如果是往下踩
        other.velocity.y = 2 // 设置玩家的瞬时y轴速度为2
    }
})



// 加速带代码：
const speedBump = world.querySelector('#加速带-1')
speedBump.onEntityContact(async ({ other }) => {
    if (other.isPlayer) {
        if (other.speedUp) {
            return //如果已经在加速中就不再加速
        }
        other.speedUp = true

        //记住正常的速度
        const oldSpeed = other.player.runSpeed
        const oldAccel = other.player.runAcceleration

        //双倍速度
        other.player.runSpeed *= 2
        other.player.runAcceleration *= 2

        await sleep(1000) // 等待一秒

        //恢复正常速度
        other.player.runSpeed = oldSpeed
        other.player.runAcceleration = oldAccel

        other.speedUp = false
    }
})