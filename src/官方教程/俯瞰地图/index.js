/**
 * !info {Project} -来自(shequ.codemao.cn/community/419961)@吉吉喵
 * 当你的地图面积非常大时
 * 如何才能快速看到全景、并定位自己所在的位置？
 * 今天这招，就教你们“登高望远”
 * 俯瞰地图全景：
 */



// 点击鼠标右键（B），弹出对话框，视线变为俯视
world.onPlayerJoin(({ entity }) => {
    entity.player.onPress(async ({ button }) => {
        if (button == Box3ButtonType.ACTION1) {
            // 将摄像机看向地图中心
            const lookTarget = new Box3Vector3(63, 8, 63);

            // 将摄像机的位置置于地图大概中心处，并往上拉升到y轴150处，确保看到完整的地形
            const lookEye = new Box3Vector3(63, 150, 63);

            // lookUp用来调整相机角度，可以使画面上下左右颠倒。默认值是(0,1,0)
            // 由于视线是俯视，需要确保lookUp与相机视线方向不平行,需修改为(1,0,0)或者(0,0,1)
            const lookUp = new Box3Vector3(1, 0, 0)

            entity.player.dialog({
                type: Box3DialogType.TEXT,
                content: `俯视`,
                lookEye: lookEye,
                lookTarget: lookTarget,
                lookUp: lookUp
            })
        }
    })
})



// 实现多个方向的效果
// 我们生成一个浮在空中的立方体,每个面颜色不同，方便实现6个方向的观察测试。
function cube(sx, sy, sz, xsize, ysize, zsize) {
    var xend = sx + xsize
    var yend = sy + ysize
    var zend = sz + zsize
    for (var x = sx; x < xend; x++) {
        for (var y = sy; y < yend; y++) {
            for (var z = sz; z < zend; z++) {
                if (x === sx) {
                    voxels.setVoxel(x, y, z, 'green_light')
                }
                if (x === xend - 1) {
                    voxels.setVoxel(x, y, z, 'red_light')
                }
                if (y === sy) {
                    voxels.setVoxel(x, y, z, 'black')
                }
                if (y === yend - 1) {
                    voxels.setVoxel(x, y, z, 'white_light')
                }
                if (z === sz) {
                    voxels.setVoxel(x, y, z, 'blue_light')
                }
                if (z === zend - 1) {
                    voxels.setVoxel(x, y, z, 'yellow_light')
                }
            }
        }
    }
}

//在{x:50, y:50, z:50} 位置，建造一个长20格，宽20格，高20格的空心立方体
cube(50, 50, 50, 20, 20, 20)



world.onPlayerJoin(({ entity }) => {
    entity.player.onPress(async ({ button }) => {
        if (button == Box3ButtonType.ACTION0) {
            let loop = true
            // 只要不是选择了退出，都反复让用户选择要看的颜色那一面
            while (loop) {
                let sel = await entity.player.dialog({
                    type: Box3DialogType.SELECT,
                    content: '选择要看的颜色',
                    options: ['黄色', '蓝色', '红色', '绿色', '白色', '黑色', '退出']
                })

                if (sel) {
                    // 初始化相机参数
                    const lookTarget = new Box3Vector3(0, 0, 0)
                    const lookEye = new Box3Vector3(0, 0, 0)
                    const lookUp = new Box3Vector3(0, 1, 0)


                    // 根据选择的颜色，将lookTarget设置为所看颜色面的中心点坐标
                    // 并将lookEye沿着视线拉远距离

                    // z轴视线
                    if (sel.value == '黄色') {
                        lookTarget.set(60, 60, 50)
                        lookEye.set(60, 60, 180)
                    }
                    // z轴视线
                    if (sel.value == '蓝色') {
                        lookTarget.set(60, 60, 50)
                        lookEye.set(60, 60, -60)
                    }
                    // x轴视线
                    if (sel.value == '红色') {
                        lookTarget.set(50, 60, 60)
                        lookEye.set(180, 60, 60)
                    }
                    // x轴视线
                    if (sel.value == '绿色') {
                        lookTarget.set(50, 60, 60)
                        lookEye.set(-60, 60, 60)
                    }
                    // y轴视线俯视
                    if (sel.value == '白色') {
                        lookTarget.set(60, 70, 60)
                        lookEye.set(60, 150, 60)
                        // 相机lookUp与相机视线方向不能平行，需修改为(1,0,0)或者(0,0,1)
                        lookUp.set(1, 0, 0)
                    }
                    // y轴视线仰视
                    if (sel.value == '黑色') {
                        lookTarget.set(60, 70, 60)
                        lookEye.set(60, 10, 60)
                        // 相机lookUp与相机视线方向不能平行，需修改为(1,0,0)或者(0,0,1)
                        lookUp.set(0, 0, 1)
                    }
                    if (sel.value == '退出') {
                        // 用户选择退出，则退出选择界面
                        loop = false
                    } else {

                        // 使用用户选择所对应的参数来设置相机，并弹出对话框
                        await entity.player.dialog({
                            type: Box3DialogType.TEXT,
                            content: `看向${sel.value}面`,
                            lookEye: lookEye,
                            lookTarget: lookTarget,
                            lookUp: lookUp
                        })
                    }
                }
            }
        }
    })
})