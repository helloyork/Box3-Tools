/**
 * !Info {Module} -来自145a
 * 145terrain 1.0
 */
class Terrain {
    constructor() {
        this.data = [];
    }
    /**
     * @param {GameVector3} spot
     */
    at(spot){
        if(!this.data[spot.x]||!this.data[spot.x][spot.y])return 0;
        return this.data[spot.x][spot.y][spot.z];
    }
    /**
     * @param {GameBounds3} bounds
     */
    read(bounds) {
        for (let x = 0; x < bounds.hi.x - bounds.lo.x; x++) {
            this.data[x] = [];
            for (let y = 0; y < bounds.hi.y - bounds.lo.y; y++) {
                this.data[x][y] = [];
                for (let z = 0; z < bounds.hi.z - bounds.lo.z; z++) {
                    this.data[x][y][z] = voxels.getVoxelId(x + bounds.lo.x, y + bounds.lo.y, z + bounds.lo.z);
                }
            }
        }
    }
    /**
     * @param {GameBounds3} bounds
     */
    write(bounds) {
        for (let x = 0; x < bounds.hi.x - bounds.lo.x; x++) {
            for (let y = 0; y < bounds.hi.y - bounds.lo.y; y++) {
                for (let z = 0; z < bounds.hi.z - bounds.lo.z; z++) {
                    voxels.setVoxelId(x + bounds.lo.x, y + bounds.lo.y, z + bounds.lo.z, this.data[x][y][z]);
                }
            }
        }
    }
}
/**
 * @param {GameBounds3} bounds
 */
voxels.clear = function (bounds) {
    for (let x = 0; x < bounds.hi.x - bounds.lo.x; x++) {
        for (let y = 0; y < bounds.hi.y - bounds.lo.y; y++) {
            for (let z = 0; z < bounds.hi.z - bounds.lo.z; z++) {
                voxels.setVoxel(x + bounds.lo.x, y + bounds.lo.y, z + bounds.lo.z, 0);
            }
        }
    }
}
/**
 * @param {GameBounds3} bounds
 */
voxels.read = function (bounds) {
    let terrain = new Terrain();
    terrain.read(bounds);
    return terrain;
}
/**
 * @param {GameBounds3} bounds
 * @param {Terrain} terrain
 */
voxels.write = function (bounds, terrain) {
    terrain.write(bounds);
}
//请勿删除最后一行