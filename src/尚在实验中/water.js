let virtualVoxels = {get(){}, set(){}};
function add(a, b) {
    return a.map((v, i) => v + b[i]);
}
function waterSource({x,y,z}) {
    water([x,y,z,7], virtualVoxels);
}
function water(source, vv) {
    let ol = [];
    let r = [[1, 0, 1, -1], [-1, 0, 1, -1], [1, 0, -1, -1], [-1, 0, -1, -1], [0, -1, 0, 0]];
    r.forEach(e => {
        let [x,y,z,l] = add(source, e);
        if (vv.get(x,y,z).level < l && voxels.getVoxelId(x,y,z) === 0) {
            ol.push([x,y,z,l]);
        }
    });
    ol.forEach(v=>{
        water(v, vv);
    });
}
