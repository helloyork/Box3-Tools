/**
 * !info {Project} -来自(shequ.codemao.cn/community/368401)@吉吉喵
 * -生成山丘的代码-
 */



// 1.点击鼠标摧毁方块

world.onPlayerJoin(({ entity }) => {
    entity.player.enable3DCursor = true // 开启方块光标
})

world.onPress(({ raycast, button }) => {
    if (button === Box3ButtonType.ACTION0) {
        const pos = raycast.voxelIndex // 射线指到的方块位置
        voxels.setVoxel(pos.x, pos.y, pos.z, '')
    }
})



// 2.点击鼠标建造方块

world.onPlayerJoin(({ entity }) => {
    entity.player.enable3DCursor = true // 开启方块光标
})

world.onPress(({ raycast, button }) => {
    if (button === Box3ButtonType.ACTION0) {
        const pos = raycast.voxelIndex.add(raycast.normal) // 射线指到的方块位置加上被选中的面的法线向量
        voxels.setVoxel(pos.x, pos.y, pos.z, 'stone')
    }
})



// 3.点击鼠标切换方块

const voxelList = ['stone', 'dirt', 'grass', 'lava01'] // 可选方块

world.onPlayerJoin(({ entity }) => {
    entity.selected = 0 // 当前选定方块的序号
    entity.player.enable3DCursor = true // 开启方块光标
})

world.onPress(({ entity, raycast, button }) => {
    if (button === Box3ButtonType.ACTION0) {
        const vox = voxelList[entity.selected]
        const pos = raycast.voxelIndex.add(raycast.normal) // 射线指到的方块位置加上被选中的面的法线向量
        voxels.setVoxel(pos.x, pos.y, pos.z, vox)
    }
    else if (button === Box3ButtonType.ACTION1) {
        entity.selected = (entity.selected + 1) % voxelList.length
        const vox = voxelList[entity.selected]
        entity.player.directMessage(`当前选定"${vox}"`)
    }
})



// 3.点击鼠标切换方块

world.onPlayerJoin(({ entity }) => {
    entity.selected = 0 // 当前选定方块的序号
    entity.player.enable3DCursor = true // 开启方块光标
})

world.onPress(({ entity, raycast, button }) => {
    if (button === Box3ButtonType.ACTION0) {
        const vox = voxelList[entity.selected]
        const pos = raycast.voxelIndex.add(raycast.normal) // 射线指到的方块位置加上被选中的面的法线向量
        voxels.setVoxel(pos.x, pos.y, pos.z, vox)
    }
    else if (button === Box3ButtonType.ACTION1) {
        entity.selected = (entity.selected + 1) % voxelList.length
        const vox = voxelList[entity.selected]
        entity.player.directMessage(`当前选定"${vox}"`)
    }
})