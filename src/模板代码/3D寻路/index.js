/**
 * !info {Project} -来自Nomen
 * 在地图内三维寻路
 */



console.clear()

world.onPlayerJoin(({ entity }) => {
    entity.player.canFly = true;
})


const mapL = 128;//地图最大x
const mapC = 128;//地图最大z
const mapY = 128;//实现寻路机制的高度
const down = 5;
const start = {//开始地点的x和y
    x: 72,
    y: 32,
    m: 35
}
const end = {//终点地点的x和y
    x: 27,
    y: 28,
    m: 29
}
const cnTouch=[];//屏蔽方块

const res = searchRoad(start.x, start.m, start.y, end.x, end.m, end.y);//搜索
if (res) {//如果成功
    res.forEach((t) => {//遍历结果数组
        voxels.setVoxel(t.x, t.m, t.y, "sand")
        console.log("done")
    })
} else {
    console.log("none……")
}

function creatcab(x, y, z) {
    var arr = new Array(x);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(y);
        for (var p = 0; p < arr[i].length; p++) {
            arr[i][p] = new Array(z).fill(0)
        }
    }//快速创建三维数组
    return { rows: x, cols: z, arr: arr, };
}

function creatMap(xm, zm, mm) {//创建一个三维数组，记录地图所有方块
    var board = creatcab(xm, zm)
    for (let x = 0; x < xm; x++) {
        for (let y = 0; y < zm; y++) {
            for (let m = 0; m < mm; m++) {
                board.arr[x][m][y] = (voxels.getVoxel(x, m, y) == 0) ? 0 : (cnTouch.includes(voxels.getVoxel(x,m,y)?2:1))
            }//获取方块内容，如果不为空气，则是1，如果是屏蔽方块，则是2，屏蔽方块不会被探测
        }
    }
    return board
}

function searchRoad(start_x, start_m, start_y, end_x, end_m, end_y) {
    var MAP = creatMap(mapL, mapY, mapC)
    var openList = [],//开启的列表，表示待探测的路线
        closeList = [],//关闭的列表，表示无价值的路线
        result = [],//最终结果路线
        result_index;//结果路线的索引
    openList.push({ x: start_x, m: start_m, y: start_y, G: 0 });//将初始点推入开启列表
    do {
        var currentPoint = openList.pop();//弹出开启列表尾项
        closeList.push(currentPoint);//获取需要探测的点
        var surroundPoint = SurroundPoint(currentPoint);//获取周围需要探测的点
        for (var i in surroundPoint) {//遍历探测点
            var item = surroundPoint[i];
            if (checkPath(item,MAP)//检查点是否可用
            ) {
                var g = currentPoint.G + ((currentPoint.x - item.x) * (currentPoint.y - item.y)
                 * (currentPoint.m - item.m) == 0 ? 10 : 15);//推断代价，直线前进代价为10，斜线前进代价为15
                //斜线前进代价越高，算法越倾向于走直线
                //斜线前进代价越低，算法越倾向于走斜线
                if (!existList(item, openList)) {//如果不在开启列表中
                    item['H'] = Math.abs(end_x - item.x) * 10 + Math.abs(end_y - item.y) * 10 + Math.abs(end_m - item.m) * 10;
                    //计算H值，即到下一个点位的消耗
                    item['G'] = g; item['F'] = item.H + item.G;
                    //计算G值，即到终点的预计消耗
                    item['parent'] = currentPoint;//设置该点位的父节点
                    openList.push(item);//向开启列表中推入该路线
                }
                else {
                    var index = existList(item, openList);//获取在开启列表中的索引
                    if (g < openList[index].G) {//如果代价更小（路线更优）
                        openList[index].parent = currentPoint;//更改父节点
                        openList[index].G = g;//更改代价
                        openList[index].F = g + openList[index].H;//更改F值，即总消耗
                    }
                }
            }
        }
        if (openList.length == 0) break;//如果开启列表中没有路径需要探测了
        openList.sort(sortF);//按照最终消耗排序

    } while (!(result_index = existList({ x: end_x, m: end_m, y: end_y }, openList)));
    //重复执行上面的代码块并且将索引指向当前点在开启列表中的索引
    //直到开启列表没有内容
    if (!result_index) {
        result = [];
        return false;
    }//如果没有路线，则返回假
    else {
        var currentObj = openList[result_index];
        //将当前点设为开启列表中索引位置的点
        do {//在数组开头推入路径节点的信息
            result.unshift({
                x: currentObj.x,
                y: currentObj.y,
                m: currentObj.m
            });
            currentObj = currentObj.parent;//推断父节点向前寻找上一个节点
        } while (currentObj.x != start_x || currentObj.y != start_y || currentObj.m != start_m);//如果当前点不为初始点则重复执行
    }
    return result;//返回最终的结果
    //这是一个数组，表示了所有节点的x m y

}


function existList(point, list) {
    //判断列表中是否含有该点
    for (var i in list) { if (point.x == list[i].x && point.y == list[i].y && point.m == list[i].m) { return i; } }
    return false;
}


function sortF(a, b) {
    //按照F值排序
    return b.F - a.F;
}


function SurroundPoint(curPoint) {
    //用于获取周围要探测的点
    var x = curPoint.x, y = curPoint.y, m = curPoint.m;
    var surround = [];
    for (let i = (-down); i <= down; i++) {
        //按照高度循环
        surround.push(//将四面八方的点推入surround
            { m: m + i, x: x - 1, y: y - 1 },
            { m: m + i, x: x, y: y - 1 },
            { m: m + i, x: x + 1, y: y - 1 },
            { m: m + i, x: x + 1, y: y },
            { m: m + i, x: x + 1, y: y + 1 },
            { m: m + i, x: x, y: y + 1 },
            { m: m + i, x: x - 1, y: y + 1 },
            { m: m + i, x: x - 1, y: y },
        )
    }
    return surround
}

function checkPath(item,MAP) {
    if (item.x >= 0 
        && item.y >= 0 //判断是否真实存在或在地图上
        && item.m >= 0 
        && item.x < MAP.rows 
        && MAP.arr[item.x][item.m][item.y] != 1 //是否被堵塞
        && MAP.arr[item.x][item.m][item.y] != 1 
        && MAP.arr[item.x][item.m][item.y] != 2 //是否为屏蔽方块
        && MAP.arr[item.x][item.m + 1][item.y] != 1 //头顶不能有方块，一般来说玩家实体高度为2.115，此处按照2格来算
        && MAP.arr[item.x][item.m - 1][item.y] == 1 //判断能踩
        && !existList(item, closeList)//是否被关闭（一般探测完没有价值的点会被丢弃在关闭列表中
    ) return true;//如果该点可用，则返回真
    else return false
}

