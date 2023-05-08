/**
 * !info {Project} -来自(shequ.codemao.cn/community/359895)@吉吉喵
 * 上一期我们学习了传送教程
 * 这期的小技巧是进阶版传送门
 * 教你传送到地图上任意的位置！
 */



console.clear()
var door = world.querySelector('#传送门')
door.enableInteract = true
door.interactRadius = 2
door.interactHint = '传送到瀑布上面'

door.onInteract(({ entity }) => {
    entity.position.set(61,94,46)
})


/* 或 */

console.clear()

var door1 = world.querySelector('#红门')
door1.enableInteract = true
door1.interactRadius = 2.5

var door2 = world.querySelector('#绿门')
door2.enableInteract = true
door2.interactRadius = 2.5

var door3 = world.querySelector('#蓝门')
door3.enableInteract = true
door3.interactRadius = 2.5

door1.onInteract(({ entity }) => {
    entity.position.copy(door2.position)
})

door2.onInteract(({ entity }) => {
    entity.position.copy(door3.position)
})

door3.onInteract(({ entity }) => {
    entity.position.copy(door1.position)
})
