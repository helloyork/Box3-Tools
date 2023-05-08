/**
 * !info {Project} -来自(shequ.codemao.cn/community/413663)@吉吉喵
 * 久违的小技巧教程来也！
 * 今天带来的是一个非常简单的小教程：
 * 让每一天都随机出现不同的天气
 * 能够很好的配合地图场景需要
 * 非常实用哦
 */



//在左侧工具栏点击 场景->全局特效 打开"飘雪"才能使下雪代码生效
world.snowTexture = 'snow/snow.part'



async function init() {

    while (true) {//无限循环
        if (Math.random() < 0.5) {
            world.rainDensity = 0//停雨
        }
        else {
            world.rainDensity = 0.5//下雨
        }

        if (Math.random() < 0.5) {
            world.snowDensity = 0//停雪
        }
        else {
            world.snowDensity = 0.1//下雪
        }

        if (Math.random() < 0.5) {//停雾
            world.fogUnifor喵ensity = 0
        }
        else {//起雾
            world.fogUnifor喵ensity = 0.1
        }

        world.sunPhase = 0.25 //白天
        await sleep(5000)//等待5000毫秒

        world.sunPhase = 0.75 //黑夜
        await sleep(10000)//等待10000毫秒
      }
}

init()