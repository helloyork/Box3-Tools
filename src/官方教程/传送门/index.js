/**
 * !info {Project} -来自(shequ.codemao.cn/community/358096)@吉吉喵
 * player.link里的是要传送的地图的地址
 * 这里喵喵用了entiy.onInteract的API
 * 所以按E就可以执行传送
 * 但是你们可以用其他的方式哦
 * 比如发送一串字符传送等等
 * 还等你来发掘～
 */



console.clear()
var door = world.querySelector('#门')

door.enableInteract = true
door.interactRadius = 2.5

door.onInteract(({ entity }) => {
    entity.player.link('https://box3.codemao.cn/p/6a4e57e1f91817445b21')
})