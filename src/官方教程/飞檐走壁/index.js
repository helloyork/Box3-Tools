/**
 * !info {Project} -来自(shequ.codemao.cn/community/419110)@吉吉喵
 * 虽然阿吉是一只猫
 * 但一直有一个飞檐走壁的梦想
 * 今天这个教程，就是为了让你们化身超级英雄蜘蛛侠
 * 在城市山川间荡着蛛丝冒险～
 * 快来学习吧！
 */



console.clear()

/** --------------生成围墙的代码----------------- */
for (let x = 0; x < 126; x++) {
    for (let y = 9; y < 126; y++) {
        voxels.setVoxel(x, y, 0, 'stone')
        voxels.setVoxel(x, y, 125, 'stone')
    }
}
for (let z = 0; z < 126; z++) {
    for (let y = 9; y < 126; y++) {
        voxels.setVoxel(0, y, z, 'stone')
        voxels.setVoxel(125, y, z, 'stone')
    }
}
/** --------------生成围墙的代码----------------- */


world.onPlayerJoin(({ entity }) => {
    entity.player.onPress(async ({ raycast, button }) => {
        // 点击鼠标左键 发射蛛丝，并飞向蛛丝射中的位置
        if (button == Box3ButtonType.ACTION0) {

            // 首先实现发射蜘蛛丝的效果
            // 并拿到蜘蛛丝的实体做后续操作
            const spiderSilk = fireSpiderSilk(raycast, entity)

            // 使用animate模拟飞行过程中，蛛丝逐渐缩短的效果
            shortenSpiderSilk(raycast, spiderSilk)

            await sleep(1000)

            // 蛛丝开始缩放后，给玩家沿着蛛丝方向的速度，模拟蛛丝拉扯飞行的效果
            firePlayer(raycast, entity)

            // 最后要记得销毁蛛丝，避免卡顿
            await sleep(500)
            spiderSilk.destroy()
        }
    })
})

/** 发射玩家 */
function firePlayer(raycast, entity) {
    // 准心击中位置与玩家位置做向量减法，获得蛛丝的方向向量
    const direction = raycast.hitPosition.sub(entity.position)
    // 给方向向量乘以一个合适的系数，模拟玩家飞出去的效果。y轴速度小一些的原因是避免飞太高
    const velocity = new Box3Vector3(direction.x * 0.15, direction.y * 0.1, direction.z * 0.15)
    entity.velocity = velocity.clone()

    // 小技巧~~如果射中了其他玩家，可以给他一个反方向速度，模拟粘过来的效果
    if (raycast.hitEntity && raycast.hitEntity.isPlayer) {
        raycast.hitEntity.velocity = velocity.scale(-1)
    }
}

/** 蛛丝缩短的效果 */
function shortenSpiderSilk(raycast, spiderSilk) {
    // 飞行过程中，蛛丝变化的属性有：position、meshScale
    // 如果只缩短蛛丝，而不更改蛛丝位置，不能完整模拟出效果
    // 蛛丝初始生成位置
    const startPos = spiderSilk.position
    // 蛛丝在缩短的过程中需要移动到准心击中的位置
    const endPos = raycast.hitPosition
    // 蛛丝初始缩放值
    const initialScale = spiderSilk.meshScale
    // 蛛丝最终需沿x轴缩到最短
    const endScale = new Box3Vector3(0, 1 / 16, 1 / 16)
    const ani = spiderSilk.animate([
        { position: startPos, meshScale: initialScale, duration: 1 },
        { position: endPos, meshScale: endScale, duration: 0 },
    ])


    ani.play({
        duration: 16 * 0.45, // 播放过程0.45秒，如需更改缩放时间，更改这个数值。相应的也需更改玩家的飞行速度
        iterations: 1, // 只播放一次
        direction: Box3AnimationDirection.NORMAL, // 正常播放
    })
}

/** 发射蜘蛛丝 */
function fireSpiderSilk(raycast, entity) {
    // 摧毁准心对准的方块，用来标记击中的位置
    voxels.setVoxel(raycast.voxelIndex.x, raycast.voxelIndex.y, raycast.voxelIndex.z, 0)
    // 准心击中位置与玩家位置做向量减法，获得蛛丝的方向向量
    const direction = raycast.hitPosition.sub(entity.position)
    // 通过射出的方向向量，计算出蛛丝的旋转四元数
    const meshOrientation = getOrientationByVector(direction)
    // 准心击中位置与玩家位置的距离，为蛛丝的长度
    const distance = raycast.hitPosition.distance(entity.position)
    // 1/16 为基准缩放值。蛛丝的设计模型为沿x轴方向设计，且为两个方块长度。因此x轴缩放值为1 / 16 * distance / 2
    const initialScale = new Box3Vector3(1 / 16 * distance / 2, 1 / 16, 1 / 16)
    // 蛛丝的生成位置应为 准心击中位置与玩家位置的向量插值的中心点
    const initialPos = entity.position.lerp(raycast.hitPosition, 0.5)
    // 用各种计算好的数值创建蛛丝
    const spiderSilk = world.createEntity({
        mesh: "mesh/钢丝.vb",
        position: initialPos,
        collides: false,
        gravity: false,
        meshScale: initialScale,
        meshOrientation: meshOrientation
    })
    return spiderSilk
}

// 本示例中用到的钢丝模型为沿着x轴方向设计。因此用的Box3Quaternion(0, 0, 0, 1)四元数去做旋转计算
// 如果大家使用沿其他轴向设计的模型，请使用下面注释的四元数去做旋转计算
const Quat = new Box3Quaternion(0, 0, 0, 1) // 沿x轴方向设计的蛛丝，初始化四元数，用于旋转计算
// const Quat = new Box3Quaternion(0.000, 0.000, -0.707, 0.707) // 沿y轴方向设计的资源用
// const Quat = new Box3Quaternion(0.000, 0.707, 0.000, 0.707) // 沿z轴方向设计的资源用

/** 通过射出的方向向量，计算出蛛丝的旋转四元数 */
function getOrientationByVector(vector3) {
    const src = vector3
    let dx = src.x
    let dy = src.y
    let dz = src.z
    let dist = Math.sqrt(dx * dx + dz * dz)
    const rotx = Math.atan2(dy, dist)
    return Quat.rotateX(rotx).rotateY(Math.atan2(dz, dx))
}