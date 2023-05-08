/**
 * !info {Project} -来自(shequ.codemao.cn/community/418160)@吉吉喵
 * 还记得编程猫博物馆颁奖典礼前炫酷的倒计时吗？
 * 氛围感拉满～
 */



console.clear()

/**
 * 字符形状对应的方块点位
 * 值为1，则显示方块
 * 值为0，则不显示方块
 * 以此来拼凑出字符的形状
 */
const charMap = {
    '0': [
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
    ],
    '1': [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
    ],
    '2': [
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 1],
    ],
    '3': [
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
    ],
    '4': [
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1],
    ],
    '5': [
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
    ],
    '6': [
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
    ],
    '7': [
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1],
        [0, 0, 1],
        [0, 0, 1],
    ],
    '8': [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
    ],
    '9': [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
    ],
    ':': [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
    ],
}

/**
 * 渲染一个字符
 * @parame char 需渲染的字符
 * @parame position 字符左上角位置
 */
function renderOneChar(char, position) {
    // 获取字符对应的方块点位，点位数据为二维数组
    const charData = charMap[char]
    // 遍历点位二维数组
    for (let i = 0; i < charData.length; i++) {
        const row = charData[i]
        // 遍历点位第i行
        for (let j = 0; j < row.length; j++) {
            const value = row[j]
            // 每一行方块的x坐标，随着列数增加而增加
            const x = position.x + j
            // 每一行方块的y坐标，随着行数增加而降低
            const y = position.y - i
            // 每一行方块的z坐标相同
            const z = position.z
            if (value == 0) {
                // 值为0，则不显示方块
                voxels.setVoxelId(x, y, z, 0)
            } else {
                voxels.setVoxel(x, y, z, 'red_light')
            }
        }
    }
}

/**-------------测试 renderOneChar 函数---------------- */
renderOneChar('2', new Box3Vector3(20, 20, 20))
/**-------------测试 renderOneChar 函数---------------- */



/**
 * 渲染一个字符串
 * @parame str 需渲染的字符串
 * @parame position 字符串第一个字符的左上角位置
 */
function renderString(str, position) {
    // 遍历每个字符，依次渲染
    for (let i = 0; i < str.length; i++) {
        // 观察charMap可知每个字符占用宽度为3，再加上字符间应有间距,因此每个字符的x要相距4
        const pos = position.add(new Box3Vector3(4 * i, 0, 0))
        renderOneChar(str[i], pos)
    }
}

/**-------------测试 renderString 函数---------------- */
renderString('22', new Box3Vector3(35, 20, 20))
/**-------------测试 renderString 函数---------------- */



/** 获取符合00：00格式的字符串 */
function getTimeStr(time) {
    if (time > 0) {
        if (time >= 10) {
            t = time
        } else {
            // 小于10时，前面补一个0
            t = '0' + time
        }
    } else {
        // 等于0时，用两个0代替
        t = '00'
    }
    return t
}

/**
 * 开始倒计时
 * @parame totalTime  总计时（单位：秒）
 * @parame position 倒计时的左上角位置
 */
async function startCountDown(totalTime, position) {
    let time = totalTime
    // 每隔1秒判断一次，直到时间减为0
    while (time >= 0) {
        // 获得分钟数
        const minute = Math.floor(time / 60)
        // 获得秒数
        const second = time % 60
        // 转化为符合规则的字符串
        const minuteStr = getTimeStr(minute)
        // 转化为符合规则的字符串
        const secondStr = getTimeStr(second)
        // 用":"拼凑出时间字符串
        const timeStr = minuteStr + ':' + secondStr
        // 渲染出时间字符串
        renderString(timeStr, position)
        // 每隔1秒 时间变量减一
        await sleep(1000)
        time--
    }
}

/**-------------测试 startCountDown 函数---------------- */
// 总倒计时 72秒
const totalTime = 72
// 倒计时的左上角位置
const position = new Box3Vector3(55, 20, 20)
startCountDown(totalTime, position)
/**-------------测试 startCountDown 函数---------------- */
