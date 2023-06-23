/**
 * !info {Project} -来自蓝buff
 * 在全地图范围内，如果一个grass（草方块）上面有其他方块，就把草方块变成dirt（泥土）
*/
async function fwg() {
    const size = 256;
    const heigh = 62;
    var fix = 0;
    for (var x = 0; x < size; x++) {
        console.log('进度 % ' + x / 256 * 100);
        for (var y = 0; y < heigh; y++) {
            for (var z = 0; z < size; z++) {
                if (voxels.getVoxel(x, y, z) == voxels.id("grass")) {
                    if (voxels.getVoxel(x, y + 1, z) != voxels.id("air")) {
                        voxels.setVoxel(x, y, z, "dirt");
                        fix++;
                    }
                }
            }
        }
        await sleep(100);
    }
    console.log('一共修复' + fix + '个不美观的草方块')
}
fwg();