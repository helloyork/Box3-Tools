/**
 * !info {Project} -来自网络
 * 打字机.js
 */


world.onVoxelContact(({ x, y, z, voxel }) => {
    const voxelName = voxels.name(voxel);
    if (voxelName === 'rock') {
        voxels.setVoxel(46, 11, 52, 'lantern_02');
    }
});

async function change() {
    while (true) {
        voxels.setVoxel(157, 43, 60, 'grass')
        voxels.setVoxel(157, 43, 61, 'grass')
        voxels.setVoxel(157, 43, 62, 'grass')
        voxels.setVoxel(157, 43, 63, 'grass')
        await sleep(5000)
        voxels.setVoxel(157, 43, 60, 'lantern_01')
        voxels.setVoxel(157, 43, 61, 'lantern_01')
        voxels.setVoxel(157, 43, 62, 'lantern_01')
        voxels.setVoxel(157, 43, 63, 'lantern_01')
        await sleep(5000)
    }
}change();

console.clear()

/**
 * 字符形状对应的方块点位
 * 值为1，则显示方块
 * 值为0，则不显示方块
 * 以此来拼凑出字符的形状
 */
const charMap = {
    '0': [
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
    ],
    '1': [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
    ],
    '2': [
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 1],
    ],
    '3': [
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
    ],
    '4': [
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1],
    ],
    '5': [
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
    ],
    '6': [
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
    ],
    '7': [
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1],
        [0, 0, 1],
        [0, 0, 1],
    ],
    '8': [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
    ],
    '9': [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
    ],
    ':': [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
    ],
}

/**
 * 渲染一个字符
 * @parame char 需渲染的字符
 * @parame position 字符左上角位置
 */
function renderOneChar(char, position) {
    // 获取字符对应的方块点位，点位数据为二维数组
    const charData = charMap[char]
    // 遍历点位二维数组
    for (let i = 0; i < charData.length; i++) {
        const row = charData[i]
        // 遍历点位第i行
        for (let j = 0; j < row.length; j++) {
            const value = row[j]
            // 每一行方块的x坐标，随着列数增加而增加
            const x = position.x + j
            // 每一行方块的y坐标，随着行数增加而降低
            const y = position.y - i
            // 每一行方块的z坐标相同
            const z = position.z
            if (value == 0) {
                // 值为0，则不显示方块
                voxels.setVoxelId(x, y, z, 0)
            } else {
                voxels.setVoxel(x, y, z, 'red_light')
            }
        }
    }
}

/**------测试 renderOneChar 函数-------- */
renderOneChar('2', new Box3Vector3(20, 20, 20))
/**------测试 renderOneChar 函数-------- */


/**
 * 渲染一个字符串
 * @parame str 需渲染的字符串
 * @parame position 字符串第一个字符的左上角位置
 */
function renderString(str, position) {
    // 遍历每个字符，依次渲染
    for (let i = 0; i < str.length; i++) {
        // 观察charMap可知每个字符占用宽度为3，再加上字符间应有间距,因此每个字符的x要相距4
        const pos = position.add(new Box3Vector3(4 * i, 0, 0))
        renderOneChar(str[i], pos)
    }
}

/**------测试 renderString 函数-------- */
renderString('22', new Box3Vector3(35, 20, 20))
/**------测试 renderString 函数-------- */



/** 获取符合00：00格式的字符串 */
function getTimeStr(time) {
    if (time > 0) {
        if (time >= 10) {
            t = time
        } else {
            // 小于10时，前面补一个0
            t = '0' + time
        }
    } else {
        // 等于0时，用两个0代替
        t = '00'
    }
    return t
}

/**
 * 开始倒计时
 * @parame totalTime  总计时（单位：秒）
 * @parame position 倒计时的左上角位置
 */
async function startCountDown(totalTime, position) {
    let time = totalTime
    // 每隔1秒判断一次，直到时间减为0
    while (time >= 0) {
        // 获得分钟数
        const minute = Math.floor(time / 60)
        // 获得秒数
        const second = time % 60
        // 转化为符合规则的字符串
        const minuteStr = getTimeStr(minute)
        // 转化为符合规则的字符串
        const secondStr = getTimeStr(second)
        // 用":"拼凑出时间字符串
        const timeStr = minuteStr + ':' + secondStr
        // 渲染出时间字符串
        renderString(timeStr, position)
        // 每隔1秒 时间变量减一
        await sleep(1000)
        time--
    }
}

/**------测试 startCountDown 函数------- */
// 总倒计时 72秒
const totalTime = 72
// 倒计时的左上角位置
const position = new Box3Vector3(55, 20, 20)
startCountDown(totalTime, position)
/**------测试 startCountDown 函数------- */


startCountDown(120, 5, 136)// 坐标，详细自行调整
async function BOOM() {
    world.sunPhase = 0.8
    const Quat = new Box3Quaternion(0, 0, 0, 1) //默认的旋转状态
    const RED = new Box3RGBColor(0.5, 0, 0) //发光的红色
    await sleep(3000)
    world.say("聚变打击即将来袭！")
    const boom = world.createEntity({
        mesh: 'mesh/核弹.vb',
        meshScale: [1 / 2, 1 / 2, 1 / 2],
        position: [100, 50, 18],
        particleRate: 80, //每秒发出80个粒子
        particleLifetime: 2, //每个粒子存活2秒
        particleColor: [RED, RED, RED, RED, RED], //粒子在5个阶段的颜色都是红色
        particleSize: [10, 10, 10, 10, 10], //粒子在5个阶段的大小都是2
        gravity: false,
    })
    boom.meshOrientation = Quat.rotateY(Math.PI / -2)
    await sleep(5000)
    world.say("核弹即将发射")
    await sleep(3000)
    world.say("倒计时:")
    await sleep(1000)
    boom.meshEmissive = 0.3
    world.say("5")
    await sleep(1000)
    boom.meshEmissive = 0
    world.say("4")
    await sleep(1000)
    boom.meshEmissive = 0.3
    world.say("3")
    await sleep(1000)
    boom.meshEmissive = 0
    world.say("2")
    await sleep(1000)
    boom.meshEmissive = 0.3
    world.say("1")
    for (let i = 0; i < 100; i++) {
        await sleep(50)
        boom.position.x -= 1
    }
    world.say("BOOM！")
    boom.destroy()
    world.sunPhase = 0.25
    await sleep(3000)
    world.say("注意持续辐射伤害！！！")
    world.querySelectorAll("player").forEach(async (e) => {
        while (e.hp > 0) {
            await sleep(1000)
            e.hp -= 1
            console.log(e.hp)
        }
    })
}
async function killBox(pos, size, fn) {
    const entities = world.searchBox({
        lo: [pos.x - size, pos.y - size, pos.z - size],
        hi: [pos.x + size, pos.y + size, pos.z + size],
    })
    for (const e of entities) {
        e.hurt(5)
        fn(e)
    }
}
async function makeDamage(e, dmg, color) {
    //e.meshcolor.copy(color)
    await sleep(500)
    //e.meshcolor.set(1,1,1)
}

const mscale = 1 / 16
const Quat = new Box3Quaternion(0, 0, 0, 1)

function buddyFollow(entity, mesh, y) {
    const buddy = world.createEntity({
        mesh,
        position: entity.position,
        meshScale: [mscale, mscale, mscale],
        gravity: false, //不受重力影响
        fixed: false, //可推移
        collides: false, //可碰撞
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
        const vx = (xDiff + xOffset) * ratio
        const vy = (yDiff + yOffset) * ratio
        const vz = (zDiff + zOffset) * ratio

        buddy.velocity.set(vx, vy, vz)//设置僚机速度

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
    entity.setPet = buddyFollow(entity, 'mesh/万圣南瓜.vb', -1) //给玩家增加宠物，名称需与地图内放置的模型的名称一致
})

world.onPlayerLeave(({ entity }) => {
    //玩家离开地图时, 切记一定要关掉tick循环以及销毁小精灵实体, 否则随着人数增加, 服务器积累到一定程度就会崩溃
    entity.setPet() //清除掉宠物
})




//require('./script_2.js')




console.clear()//清除控制台记录
const hd = world.querySelector('#万圣节告示牌');
hd.enableInteract = true;
hd.interactHint = '万圣节告示牌';
hd.interactRadius = 6;
hd.onInteract(async ({ entity }) => {
    const hdz = [1];

    const hdl = await entity.player.dialog({
        type: Box3DialogType.SELECT,
        title: '万圣节告示牌',
        content: `你好，${entity.player.name}，很高兴认识你。目前版本——v.3 核对好版本游玩体验最佳哦~`,
        options: hdz
    })
    if (!hdl || hdl == null || hdl.value == '') return;
    for (const a of hdxm) {
        if (a.name == hdl.value) {
            a.dialog(entity);
            break;
        }
    }
})

world.querySelectorAll('.test').forEach((e) => {
    var type = 'r';
    world.onTick(() => {
        if (e.position.z >= 11) {
            e.position.z -= 0.3;
            type = 'l';
        } else if (e.position.z <= 6) {
            e.position.z += 0.3;
            type = 'r';
        } else {
            if (type === 'r') {
                e.position.z += 0.3;
            } else {
                e.position.z -= 0.3;
            }
        }
    })
})
world.onPlayerJoin(({ entity }) => {
    entity.player.addWearable({
        bodyPart: Box3BodyPart.TORSO,
        mesh: 'mesh/.vb',
        orientation: new Box3Quaternion(0, 1, 0, 0).rotateY(Math.PI / 2),
        scale: new Box3Vector3(1, 1, 1),
        offset: new Box3Vector3(0, 0, -0.45),
    });
});
world.onPlayerJoin(({ entity }) => {
    entity.player.addWearable({
        bodyPart: Box3BodyPart.TORSO,
        mesh: 'mesh/.vb',
        orientation: new Box3Quaternion(0, 1, 0, 0).rotateY(Math.PI / 2),
        scale: new Box3Vector3(0.5, 0.5, 0.5),
        offset: new Box3Vector3(0, 0, -0.45),
    });
});
world.onPlayerJoin(({ entity }) => {
    entity.player.addWearable({
        bodyPart: Box3BodyPart.HEAD,
        mesh: 'mesh/万圣节女巫帽.vb',            //使用代码时，此处的名称需与地图中的模型名称保持一致
        orientation: new Box3Quaternion(0, 0, 0, 0).rotateY(-Math.PI / 1),
        offset: new Box3Vector3(0, 1.5, 0),
    });

});



for (const npc of world.querySelectorAll('.NPC')) {
    npc.enableInteract = true
    npc.interactRadius = 4.5
    npc.interactHint = npc.id
    npc.interactColor.set(0, 1, 0)
    if (npc.id == '吉吉喵的分身') {
        npc.onInteract(async ({ entity }) => {
            textDialog(entity, `${entity.player.name}, 恭喜你完成了跑酷的第一季后面还会更新的1赞更新1关20赞更新1期50赞更新一季~其实作者已经更新第二季了想去的话就从我后面的传送门去吧`, npc.id)
        })
    }
    else if (npc.id == '克苏鲁之眼') {
        npc.onInteract(async ({ entity }) => {
            textDialog(entity, `哈哈${entity.player.name}我是克苏鲁遗留下的的精神部分，废话不用多说，偷偷告诉你一个方法，可以让这个地图崩溃，就是有10000人一起进来就能让这个地图崩溃了，哈哈哈哈哈哈哈哈哈呵呵哈哈哈哈哈哈哈哈哈呵呵哈哈哈哈哈哈哈哈哈~`, npc.id)
        })
    }
    else if (npc.id == '奥特曼-泽塔') {
        npc.onInteract(async ({ entity }) => {
            textDialog(entity, `你好${entity.player.name}我是泽塔奥特曼，最近光之国的奥特之父告诉我这里有怪物的脑电波，好像是怪物克苏鲁，你看见了吗？，如果看见了`, npc.id)
        })
    }
}
for (const npc of world.querySelectorAll('.密钥门')) {
    npc.enableInteract = true
    npc.interactRadius = 4
    npc.interactHint = npc.id
    if (npc.id == '密钥门') {
        npc.onInteract(async ({ entity }) => {
            const mm = await entity.player.dialog({
                type: Box3DialogType.INPUT,
                content: '请输入密钥：',
                title: npc.id
            })
            if (mm == '密码') {
                entity.player.directMessage(`密钥正确！请进`)
                entity.position.set(207.88, 11.76, 103.50)
            }
            else {
                entity.player.directMessage(`密钥错误！被认为入侵者，扣10滴血！`)
                entity.hurt(10)
            }
        })
    }
}
for (const e of world.querySelectorAll('*')) {//遍历所有实体
    if (e.id.startsWith('存档点')) {
        e.collides = true //开启碰撞
        e.fixed = true //固定实体不被推移
        e.meshScale = e.meshScale.scale(2) //放大零倍
        e.onEntityContact(({ other }) => {
            if (other.isPlayer) {
                if (e.position !== other.player.spawnPoint) {
                    other.player.directMessage('到达新的存档点')
                    other.player.spawnPoint = e.position // 玩家重生点坐标设置成存档点的坐标
                }
            }
        })
    }
}
world.onPlayerJoin(({ entity }) => {
    entity.onFluidEnter(() => {//当玩家掉到水里
        entity.position.copy(entity.player.spawnPoint)
        entity.position.y += 4
    })
})
world.onVoxelContact(({ entity, x, y, z, voxel }) => {
    const voxelName = voxels.name(voxel);
    if (voxelName === 'windygrass') {
        voxels.setVoxel(x, y, z, 'air');
        setTimeout(() => { voxels.setVoxel(x, y, z, voxel) }, 3000);
    } else if (voxelName === '') {
        voxels.setVoxel(x, y, z, 0);
    }
});

world.onPlayerJoin(({ entity }) => {
    entity.onFluidEnter(() => {//当玩家掉到水里
        entity.position.copy(entity.player.spawnPoint)
        entity.position.y += 4
    })
})
console.clear()
var door = world.querySelector('#传送门')
door.enableInteract = true
door.interactRadius = 5
door.interactHint = '传送到下一关～'

door.onInteract(({ entity }) => {
    entity.position.set(151, 12, 20)
})
console.clear()

console.clear()
var door = world.querySelector('#未来传送门-4')
door.enableInteract = true
door.interactRadius = 5
door.interactHint = '传送到出生点'

door.onInteract(({ entity }) => {
    entity.position.set(250, 13, 3)
})
var door = world.querySelector('#未来传送门-1')
door.enableInteract = true
door.interactRadius = 5
door.interactHint = '传送到下一关'

door.onInteract(({ entity }) => {
    entity.position.set(60, 10, 1)
})
var door = world.querySelector('#未来传送门-5')
door.enableInteract = true
door.interactRadius = 5
door.interactHint = '传送到挂机室'

door.onInteract(({ entity }) => {
    entity.position.set(126, 53, 130)
})


