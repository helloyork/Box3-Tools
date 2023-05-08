/**
 * !info {Project} -来自(shequ.codemao.cn/community/377745)@吉吉喵
 * AOE，强力有效的范围性技能
 * 能够作用于多个目标
 * 是游戏中居家旅行打架必备之技能
 * 今天喵师傅就传你这招！
 */



console.clear()

const mscale = 1 / 16
const n = [-4, -3, -2, -1, 0, 1, 2, 3, 4]

// 生成一堆小人
for (let x of n) {
    for (let y of n) {
        for (let z of n) {
            const e = world.createEntity({
                mesh: 'mesh/小人.vb',
                fixed: true,
                collides: false,
                position: [x * 4 + 64, y * 3 + 16, z * 4 + 64],
                meshScale: [mscale, mscale, mscale],
            })
            e.enableDamage = true
            e.onDie(() => {
                e.destroy()
            })
        }
    }
}

world.onPlayerJoin(({ entity }) => {
    entity.enableDamage = true 
})


function killZone(pos, radius, fn) { //球状AOE
    for (const e of world.querySelectorAll('*')) {//遍历所有实体
        const dist = e.position.distance(pos)//计算作用点与当前实体的距离
        if (dist <= radius) {//当距离小于等于有效作用半径
            fn(e, dist)//传递当前实体和距离到回调函数并执行
        }
    }
}

async function killBox(pos, size, fn) { //盒状AOE
    //搜索包围盒内的所有实体
    const entities = world.searchBox({
        lo: [pos.x - size, pos.y - size, pos.z - size], //包围盒下边界
        hi: [pos.x + size, pos.y + size, pos.z + size], //包围盒上边界
    })

    for (const e of entities) { //遍历所有找到的实体
        fn(e)
    }
}

async function makeDamage(e, dmg, color) {
    e.hurt(Math.max(1, dmg)) //max用于防止负数伤害

    e.meshColor.copy(color) //当前实体变色
    await sleep(500)
    e.meshColor.set(1, 1, 1, 1) //恢复正常颜色
}

const RED = new Box3RGBAColor(1, 0, 0, 1)
const GREEN = new Box3RGBAColor(0, 1, 0, 1)
const BLUE = new Box3RGBAColor(0, 0, 1, 1)
world.onPress(({ entity, button, raycast }) => {
    if (button === Box3ButtonType.CROUCH) { //下蹲键触发自身球状AOE
        const range = 8//AOE有效作用半径
        killZone(entity.position, range, async (e, dist) => {
            if (e === entity) return//如果当前实体是AOE施放者, 就不继续执行, 避免伤到自己
            const ratio = (range - dist) / range //计算距离百分比, 离得越近ratio越趋向1, 离得越远ratio越趋向0
            makeDamage(e, 100 * ratio, RED)
        })
    }
    else if (button === Box3ButtonType.ACTION0) { //左键触发远距离球状AOE
        const range = 8//AOE有效作用半径
        killZone(raycast.hitPosition, range, async (e, dist) => {
            if (e === entity) return//如果当前实体是AOE施放者, 就不继续执行, 避免伤到自己
            const ratio = (range - dist) / range //计算距离百分比, 离得越近ratio越趋向1, 离得越远ratio越趋向0
            makeDamage(e, 100 * ratio, GREEN)
        })
    }
    else if (button === Box3ButtonType.ACTION1) { //右键触发远距离盒状AOE
        const size = 7 //AOE盒的大小
        killBox(raycast.hitPosition, size, (e) => {
            if (e === entity) return//如果当前实体是AOE施放者, 就不继续执行, 避免伤到自己
            makeDamage(e, 20, BLUE)
        })
    }
})