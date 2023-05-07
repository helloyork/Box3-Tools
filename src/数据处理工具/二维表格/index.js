/**
 * !info {Module} -来自Nomen
 * 二维表格工具函数
 */


/**
 * 查找指定表格的指定位置的内容
 * 
 * @param {Array} board 指定表格
 * @param {*} line 指定表格的行数
 * @param {*} column 指定表格的列数
 * @returns {string} 查找到的内容
 */
function boardfind(board, line, column) { return board[line - 1][column - 1]; }

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
        arr[i] = new Array(column).fill(0); 
    } 
    return arr; 
}

/**
 * 在控制台输出带有格式的表格
 * 
 * @param {Array} board 指定输出的表格
 */
function boardshow(board) { board.forEach((ar) => { console.log(ar) }); }

/**
 * 删除指定表格的列或行
 * 
 * @param {Array} board  指定表格
 * @param {number} line 指定表格的行
 * @param {number} column 指定表格的列
 */
function boarddel(board, line, column) { if (line) { board.splice((line - 1), 1) } if (column) { board.forEach((obj) => { obj.splice(column - 1, 1) }) } }

/**
 * 修改指定表格的指定位置
 * 
 * @param {Array} board 指定表格
 * @param {number} line 指定表格的行
 * @param {number} column 指定表格的列
 * @param {string} content 修改的内容
 */
function boardset(board, line, column, content) { board[line - 1][column - 1] = content; }

module.exports = {
    boardfind,
    creatboard,
    boardshow,
    boarddel,
    boardset
}
