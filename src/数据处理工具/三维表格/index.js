/**
 * !info {Module} -来自Nomen
 * 三维表格工具函数
 */



function cabfind(cab, x, y, z) { return cab[x][y][z]; }

function creatcab(x, y, z) {
    var arr = new Array(x);
    for (var i = 0; i < arr.length; i++) { arr[i] = new Array(y); for (var p = 0; p < arr[i].length; p++) { arr[i][p] = new Array(z).fill(0) } }
    return arr;
}

function cabshow(cab) { cab.forEach((x) => { console.log(x) }) }

function cabset(cab, x, y, z, content) { cab[x - 1][y - 1][z - 1] = content; }

module.exports = {
    cabfind,
    creatcab,
    cabshow,
    cabset
}
