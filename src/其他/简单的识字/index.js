/**
 * !info {Project} -来自Nomen
 * 使用特定算法识字
 */



console.clear();

//谷歌大佬首先搞出的东西，贼nb
// 置信度？
//一个数字积累的，可信度
// 什么东西，2是什么
//哦，这是将用户输入的信息转换为0和1两种状态
//-1是不匹配，减少置信度，1是匹配，增加置信度
var test = [
    [-1, -1, -1, -1, -1, -1, -1, -1,],
    [-1, -1, -1, 1, -1, -1, -1, -1,],
    [-1, -1, 1, -1, -1,-1, -1, -1,],
    [-1, -1, -1, -1, 1, 1, -1, -1,],
    [-1, -1, -1, -1, -1, -1, -1, -1,],
    [-1, -1, -1, -1, -1, -1, -1, -1,],
    [-1, -1, 1, 1, -1, -1, -1, -1,],
    [-1, -1, -1, -1, -1, -1, -1, -1,],
]
var weight = [
    [
        [-1, -1, -1, 1, 1, -1, -1, -1,],
        [-1, -1, -1, 1, 1, -1, -1, -1,],
        [-1, -1, -1, 1, 1, -1, -1, -1,],
        [-1, -1, -1, 1, 1, -1, -1, -1,],
        [-1, -1, -1, 1, 1, -1, -1, -1,],
        [-1, -1, -1, 1, 1, -1, -1, -1,],
        [-1, -1, -1, 1, 1, -1, -1, -1,],
        [-1, -1, -1, 1, 1, -1, -1, -1,],
    ],
    [
        [-1, -1, -1, -1, -1, -1, -1, -1,],
        [-1, -1, -1, 1, 1, -1, -1, -1,],
        [-1, -1, 1, -1, -1, 1, -1, -1,],
        [-1, -1, -1, -1, -1, 1, -1, -1,],
        [-1, -1, -1, -1, 1, -1, -1, -1,],
        [-1, -1, -1, 1, -1, -1, -1, -1,],
        [-1, -1, 1, 1, 1, 1, -1, -1,],
        [-1, -1, -1, -1, -1, -1, -1, -1,],
    ],
    [
        [-1, -1, -1, -1, -1, -1, -1, -1,],
        [-1, -1, -1, 1, 1, -1, -1, -1,],
        [-1, -1, 1, -1, -1, 1, -1, -1,],
        [-1, -1, -1, -1, -1, 1, -1, -1,],
        [-1, -1, -1, -1, 1, -1, -1, -1,],
        [-1, -1, -1, -1, -1, 1, -1, -1,],
        [-1, -1, 1, 1, 1, -1, -1, -1,],
        [-1, -1, -1, -1, -1, -1, -1, -1,],
    ],
]



function index(weight, item) {
    let weights = [];
    let all = {};
    let map = creatboard(weight[0].length, weight[0][0].length);
    for (let i in weight) {
        for (let x = 0; x < weight[i].length; x++) {
            for (let y = 0; y < weight[i][x].length; y++) {
                map[x][y] = calculator(scanner(weight[i], [x, y], 3), scanner(item, [x, y], 3));
            }
        }
        let a = 0;
        map.forEach((v) => { a += sum(v) });
        all[i] = a;
    }
    return all;
}

let result = index(weight, test);
Object.keys(result).forEach((v) => {
    console.log(v, ':', (result[v]))
})

function log(map) {
    map.forEach(v => console.log(v))
}

// g(z) = g( x1*w1 + x2*w2 + b )
// w和x为权重，b为偏移项

// sigmoid函数 ：
// 逻辑乙状函数式 : g(z) = 1 / ( 1 + e^-z ) = e^x / e^x + 1
// 其中z是一个线性组合，比如z可以等于：b + * + *。通过代入很大的正数或很小的负数到g(z)函数中可知，其结果趋近于0或1
// 也就是说，sigmoid函数的功能是相当于把一个实数压缩至0到1之间
// 当z是非常大的正数时，g(z)会趋近于1，而z是非常小的负数时，则g(z)会趋近于0。

// 神经元隐藏层
// h(_1) = g(_1)( W(_1)^T X + B(_1) )
// _1是隐藏层深度 ，W为权重，b为偏差，g为激活函数

/**
 * sigmoid非线性函数
 * @param {Number} t 
 * @returns 
 */
function sigmoid(t) {
    return 1 / (1 + Math.exp(-t));
}

/**
 * 修正线性单元
 * 对于输入的负值，输出全为0，对于正值，原样输出
 * @param {Number} y 
 */
function relu(y) {
    return Math.max(0, y);
}

/**
 * 创建指定行数指定列数的表格
 * 
 * @param {number} line 创建的表格行数
 * @param {number} column 创建的表格列数
 * @returns {Array} 返回创建的表格
 */
function creatboard(line, column) {
    var arr = new Array(line);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(column).fill(-1);
    }
    return arr;
}

/**
 * 扫描给定点的矩阵
 * @param {Number[][]} map 
 * @param {Number[]} position 
 * @param {Number} size 
 * @returns {Number[][]} 指定大小的矩阵
 */
function scanner(map, position = [0, 0], size = 3) {
    let precision = [map.length, map[0].length];
    if (precision[0] * precision[1] == 0) return false;
    let claMap = creatboard(size, size);
    for (let cla of surroundPosition(parseInt(position[0], 10), parseInt(position[1], 10), size)) {
        if (map[cla[0]] === undefined || map[cla[0]][cla[1]] === undefined) {
            claMap[cla[0] - position[0]][cla[1] - position[1]] = -1;
        } else {
            claMap[cla[0] - position[0]][cla[1] - position[1]] = map[cla[0]][cla[1]];
        }
    }
    return claMap;
}

/**
 * 
 * @param {Number[][]} item 
 * @param {Number[][]} map 
 * @returns {Number} 总权重
 */
function calculator(item, map) {
    let weight = 0;
    for (let x in map) {
        for (let y in map[x]) {
            map[x][y] = item[x][y] * map[x][y];
        }
    }
    map.forEach((value) => { weight += sum(value) });
    return weight;
}

/**
 * 向右下方延申指定步长的矩阵
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} foot 步长
 */
function surroundPosition(x, y, foot) {
    let surround = [];
    for (let i = 0; i < foot; i++) {
        for (let r = 0; r < foot; r++) {
            surround.push([x + i, y + r])
        }
    }
    return surround;
}



/**
 * 求总合
 * @param {Number[]} arr 
 * @returns {Number}
 */
function sum(arr) {
    return arr.reduce(function (prev, curr) {
        return prev + curr;
    });
}

Object.assign(globalThis, { sum, surroundPosition, scanner, calculator, test, weight })


