/**
 * !info {Project} -来自(shequ.codemao.cn/community/362114)@吉吉喵
 * -生成山丘的代码-
 */



function cylinder(cx, cy, cz, vox, radius, height) {
    var xend = cx + radius;
    var yend = cy + height;
    var zend = cz + radius;
    for (var x = cx - radius; x <= xend; x++) {
        for (var z = cz - radius; z <= zend; z++) {
            var dx = x - cx;
            var dz = z - cz;
            if (Math.round(Math.sqrt(dx * dx + dz * dz)) <= radius) {
                for (var y = cy; y < yend; y++) {
                    voxels.setVoxel(x, y, z, vox);
                }
            }
        }
    }
}

for (var i = 0; i < 300; i++) { /* 300个随机圆柱体构成场景 */
    let x = Math.random() * 125; /* x坐标 */
    let z = Math.random() * 125; /* z坐标 */
    let h = Math.random() * 4; /* 高 0~3.9999 */
    let r = 2 + Math.random() * 5; /* 半径 2~6.9999 */
    cylinder(x, 9, z, 'dirt', r, h);
}

for (var y = 9; y < 13; y++) { /* 扫描9~12层的格子 */
    for (var x = 0; x < 127; x++) {
        for (var z = 0; z < 127; z++) {
            /* 如果当前格子不为空而它上面那格是空的, 则表示它是复杂地形的表面 */
            if (voxels.getVoxel(x, y, z) != 0 && voxels.getVoxel(x, y + 1, z) == 0) {
                voxels.setVoxel(x, y, z, 'grass'); /* 土块替换成草地 */
            }
        }
    }
}