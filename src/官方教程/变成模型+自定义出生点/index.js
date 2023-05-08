/**
 * !info {Project} -来自(shequ.codemao.cn/community/371088)@吉吉喵
 * 有不少同学都在问的代码教程来咯！
 * 分别是让自己变成模型的样子
 * 以及自定义出生点！
 */



// 1.变成模型
for (const e of world.querySelectorAll('*')) {
    e.collides = true //实体可以被碰撞
    e.fixed = true //实体固定位置
    e.onEntityContact(({ other }) => {
        if (other.isPlayer) { // 如果跟当前实体碰撞的是玩家实体
            e.destroy()  //当前实体消失
            other.player.invisible = true // 玩家皮肤隐藏
            other.mesh = e.mesh // 玩家的外形换成当前实体的外形
            other.meshScale.copy(e.meshScale) // 玩家外形的缩放比例设成跟当前实体一样
            other.player.scale = e.meshScale.scale(e.bounds.y / other.bounds.y) //喵家的隐形碰撞盒缩放到模型刚好贴地
        }
    })
}


// 如果模型的朝向有问题
// 那么就要修正一下方向：
const Quat = new Box3Quaternion(0, 0, 0, 1)
for (const e of world.querySelectorAll('*')) {
    e.collides = true
    e.fixed = true
    e.onEntityContact(({ other }) => {
        if (other.isPlayer) { // 如果跟当前实体碰撞的是玩家实体
            other.player.invisible = true // 玩家皮肤隐藏
            other.mesh = e.mesh // 玩家的外形换成当前实体的外形
            other.meshScale.copy(e.meshScale) // 玩家外形的缩放比例设成跟当前实体一样

            //如果模型方向不正确, 则建议在模型编辑器里把模型转向修正

            // 也可以尝试下面其中一行代码, 但不同的模型需要转的角度不同, 无法通用
            // other.meshOrientation = Quat.rotateY(Math.PI) // 如果模型方向不对, 尝试旋转180度来修正, Math.PI是180度的弧度值
            // other.meshOrientation = Quat.rotateY(Math.PI/2) // 如果模型方向不对, 尝试旋转90度来修正
            // other.meshOrientation = Quat.rotateY(-Math.PI/2) // 如果模型方向不对, 尝试旋转-90度来修正

            other.player.scale = e.meshScale.scale(e.bounds.y / other.bounds.y) //喵家的隐形碰撞盒缩放到模型刚好贴地
        }
    })
}



// 2.自定义出生点

// 在某个坐标出生的4种写法：  
world.onPlayerJoin(({entity})=>{
    entity.player.spawnPoint.set(4, 11, 4)
    entity.player.forceRespawn()
})
world.onPlayerJoin(({entity})=>{
    entity.player.spawnPoint.set(4, 11, 4)
    entity.position.copy(entity.player.spawnPoint)
})
world.onPlayerJoin(({entity})=>{
    entity.player.spawnPoint = new Box3Vector3(4, 11, 4)
    entity.player.forceRespawn()
})
world.onPlayerJoin(({entity})=>{
    entity.player.spawnPoint = new Box3Vector3(4, 11, 4)
    entity.position.copy(entity.player.spawnPoint)
})

// 在某个模型的位置出生：
world.onPlayerJoin(({entity})=>{
    entity.player.spawnPoint = world.querySelector('#出生点').position
    entity.position.copy(entity.player.spawnPoint)
    entity.position.y += 10
})