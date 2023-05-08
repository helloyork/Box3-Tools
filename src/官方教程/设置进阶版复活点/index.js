/**
 * !info {Project} -来自(shequ.codemao.cn/community/416346)@吉吉喵
 * 跑酷、pvp游戏必备的小技巧来啦！
 * 学会这三种进阶版的复活点写法
 * 基本上就能驾驭大部分的地图玩法了～
 */



// 获取场景里的复活点模型，命名为respawnPoint
// 具体模型可以用任意你喜欢的模型替换，名称也可以替换成你想要的命名
const respawnPoint = world.querySelector(`#复活点`)

// 监听方块与实体的碰撞
world.onVoxelContact(({entity, voxel})=> {
    // 将方块id转换名称
    const voxelName = voxels.name(voxel);
    // 如果方块名称是熔岩
    if (voxelName === 'lava02'){
        // 使实体受到100点伤害
        // 目的是为了直接触发实体的'onDie'事件
        //  *这里为了方便演示，将伤害值直接调到生命值(hp)的上限100点，
        //   具体调到多少点可以自行设置，只要玩家累计受到100点伤害就会触发entity的'onDie'事件
        entity.hurt(100)
    }
})

// 当玩家进入地图时
world.onPlayerJoin(({ entity }) => {
    // 首先要开启enableDamage(允许伤害)，如果不设置为true的话，玩家是不会受到伤害的！
    entity.enableDamage = true
    // 给玩家的'onDie'事件添加处理的逻辑
    // 'onDie'事件会在玩家的生命值(hp)减少到0及以下时触发
    entity.onDie(() => {
        // 设置复活点的主要API: entity.player.spawnPoint

        // 1.在指定位置复活。
        // 复活点设置为世界里的'复活点模型'的坐标(position)
        // 当角色复活的时候就会出现在'复活点模型'的位置上
        // -------------------------打开下面一行注释测试效果，同时给2&3的代码注释掉---------------------------------
        entity.player.spawnPoint = respawnPoint.position.clone();
        // -------------------------打开上面一行注释测试效果，同时给2&3的代码注释掉---------------------------------

        // 2.在指定区域复活
        // const xPos = 72 + Math.random() * 5
        // const zPos = 63 + Math.random() * 5
        // entity.player.spawnPoint = new Box3Vector3(xPos, 15, zPos);


        // 3.在随机区域复活
        // const xPos = 0 + Math.random() * 126
        // const zPos = 0 + Math.random() * 126
        // entity.player.spawnPoint = new Box3Vector3(xPos, 15, zPos);

        // 设置好复活点之后，记得调用forceRespawn() API
        // 这样就可以强制玩家复活到上面设置好的位置了
        entity.player.forceRespawn()
    })
})