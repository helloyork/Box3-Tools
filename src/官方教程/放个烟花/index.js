/**
 * !info {Project} -来自(shequ.codemao.cn/community/374423)@吉吉喵
 * 还记得“挑战32”颁奖典礼上吉吉喵控制的烟花效果吗？
 * 原理很简单：是通过粒子效果实现的
 */



console.clear()

function particleSpread(entity, colorList, scale = 1) {
    entity.particleRate = 550//粒子生成速率
    entity.particleLifetime = 2//粒子存活时间为2秒
    entity.particleColor = colorList//粒子的颜色列表
    entity.particleSize = [15 * scale, 10 * scale, 5 * scale, 2 * scale, scale]//粒子在5个阶段的大小
    entity.particleSizeSpread = 2 * scale//粒子的大小的随机变化幅度
    entity.particleVelocitySpread = [20 * scale, 20 * scale, 20 * scale]//粒子XYZ方向速度的随机变化幅度
    entity.particleAcceleration = [0, -10 * scale, 0]//粒子往下飘落模拟重力效果
}

const YELLOW = new Box3RGBColor(10, 10, 2)//黄
const CYAN = new Box3RGBColor(2, 10, 10)//青
const MAGENTA = new Box3RGBColor(10, 2, 10)//品红
const RED = new Box3RGBColor(10, 2, 2)//红
const GREEN = new Box3RGBColor(2, 10, 2)//绿
const BLUE = new Box3RGBColor(2, 2, 10)//蓝

//各个颜色5个粒子阶段的颜色列表
const ColorList = [
    [YELLOW, YELLOW, YELLOW, YELLOW, YELLOW],
    [CYAN, CYAN, CYAN, CYAN, CYAN],
    [MAGENTA, MAGENTA, MAGENTA, MAGENTA, MAGENTA],
    [RED, RED, RED, RED, RED],
    [GREEN, GREEN, GREEN, GREEN, GREEN],
    [BLUE, BLUE, BLUE, BLUE, BLUE],
]


function randomColor() {
    return ColorList[Math.floor(ColorList.length * Math.random())] //随机选取一个颜色列表
}

const MeshScale = [1 / 16, 1 / 16, 1 / 16] //默认的模型缩放系数
async function particleShoot(entity) {
    const fireball = world.createEntity({
        bounds: [0, 0, 0], // 隐形实体默认大小是1x1x1的方块, 现在把它从方块缩成大小为0x0x0的1个点
        collides: false, // 开启碰撞
        gravity: false, // 不受重力影响
        position: entity.position,
    })

    const color = randomColor()//随机颜色
    particleSpread(fireball, color, 0.3) //粒子大小系数缩到0.3, 形成小火球

    await sleep(100) // 等待0.1秒后升空
    fireball.velocity.set(0, 1, 0) // 火球速度为每秒向上1格

    await sleep(2000) //升空2秒后爆炸

    fireball.velocity.set(0, 0, 0) // 火球停止运动
    particleSpread(fireball, color, 1) // 系数增大到1, 让火球变大

    await sleep(1500) //大火球等待1.5秒后消失
    fireball.destroy()
}

const firework = world.querySelector('#新年烟花-1')
firework.enableInteract = true
firework.interactRadius = 3
firework.onInteract(async () => {
    var n = 3 //每次
    while (n-- > 0) {
        particleShoot(firework)//在"新年烟花-1"实体的位置发射烟花
        await sleep(2000)//每隔2秒射1发
    }
})