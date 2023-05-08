/**
 * !info {Project} -来自(shequ.codemao.cn/community/417036)@吉吉喵
 * 相信大家都玩了B站up主火山giegie做的《3D超级马里奥》了吧
 * （没玩过的迅速去玩！搭配视频享用更美味）
 * 本期教程的主题就是用道具改变属性
 * 让你“变大变小变无敌”～
 */



// 跳跃道具
// 获取场景中的“弹簧”实体，作为跳跃道具
const jumpProp = world.querySelector('#弹簧-1')
// 为了下面方便使用，将实体命名为 跳跃道具
jumpProp.id = "跳跃道具"
// 开启道具的实体碰撞
jumpProp.collides = true

// 加速道具
// 获取场景中的“西瓜”实体，作为加速道具
const speedProp = world.querySelector('#MC西瓜-1')
// 为了下面方便使用，将实体命名为 加速道具
speedProp.id = "加速道具"
// 开启道具的实体碰撞
speedProp.collides = true

// 罚站道具
// 获取场景中的“陷阱”实体，作为罚站道具
const trapProp = world.querySelector('#陷阱-1')
// 为了下面方便使用，将实体命名为 罚站道具
trapProp.id = "罚站道具"
// 开启道具的实体碰撞
trapProp.collides = true

// 隐身道具
// 获取场景中的“隐身卡”实体，作为隐身道具
const invisibleProp = world.querySelector('#隐身技能卡-1')
// 为了下面方便使用，将实体命名为 隐身道具
invisibleProp.id = "隐身道具"
// 开启道具的实体碰撞
invisibleProp.collides = true

// 当实体与实体发生碰撞时
world.onEntityContact(async ({ entity, other }) => {
    // 首先需要判断当前碰撞的实体是玩家类型的实体触发的
    if (entity && entity.isPlayer) {
        // 由于onEntityContact事件会因为两个实体碰撞而触发，
        // 因此，当我们确定了其中一个是“玩家”类型的实体之后(entity.isPlayer)
        // 另一个实体other 便是我们要判断的实体道具
        // 接下来会根据实体类型的不同，区分碰撞到之后对玩家产生的效果

        // 如果玩家碰到的是加速道具，那么我们希望玩家可以获得一个加速效果
        // 要对玩家的移动进行加速，可以通过修改玩家的：行走速度、行走加速度、跑步速度以及跑步加速度来实现
        if (other.id === "加速道具") {
            // 加速道具被碰到之后就删除掉它(这样才像被玩家"吃掉"了)
            other.destroy()
            // 行走速度默认为0.22，这里设置为2倍的速度
            entity.player.walkSpeed = 0.44
            // 行走加速度默认为0.19，这里设置为2倍的速度
            entity.player.walkAcceleration = 0.38
            // 跑步速度默认为0.4，这里设置为2倍的速度
            entity.player.runSpeed = 0.8
            // 跑步加速度默认为0.35，这里设置为2倍的速度
            entity.player.runAcceleration = 0.7

            entity.player.directMessage(`你获得了奔跑加速！`)

            // 设置定时器，定时时间为5000毫秒(5秒)，5秒后会触发定时器内的代码
            setTimeout(() => {
                // 将玩家的移动和跑步速度复原
                entity.player.walkSpeed = 0.22
                entity.player.walkAcceleration = 0.19
                entity.player.runSpeed = 0.4
                entity.player.runAcceleration = 0.35
            }, 5000);
        }

        // 如果玩家碰到的是跳跃道具，那么我们希望玩家可以获得一个向上跳跃的效果
        if (other.id === "跳跃道具") {
            other.destroy()
            // 设置玩家的跳跃力度为原本的两倍
            entity.player.jumpPower = 0.96 * 2

            entity.player.directMessage(`你获得了跳跃加成！`)

            // 设置定时器，定时时间为5000毫秒(5秒)，5秒后会触发定时器内的代码
            setTimeout(() => {
                // 将玩家的跳跃力度复原
                entity.player.jumpPower = 0.96
            }, 5000);
        }

        // 如果玩家碰到的是罚站道具，那么我们希望玩家完全不能移动
        if (other.id === "罚站道具") {
            other.destroy()
            // 参考“加速道具”的实现方式，只要我们喵家的行走速度、行走加速度、跑步速度以及跑步加速度都设置为0
            // 玩家就没办法走路和跑步了
            entity.player.walkSpeed = 0
            entity.player.walkAcceleration = 0

            entity.player.runSpeed = 0
            entity.player.runAcceleration = 0
            // 顺便喵家的“跳跃”给关闭了，这样一来玩家不但不能走和跑，也不能跳了
            entity.player.enableJump = false

            entity.player.directMessage(`你撞到了陷阱，暂时无法行动！`)

            // 设置定时器，定时时间为5000毫秒(5秒)，5秒后会触发定时器内的代码
            setTimeout(() => {
                // 将玩家的移动和跑步速度复原
                entity.player.walkSpeed = 0.22
                entity.player.walkAcceleration = 0.19
                entity.player.runSpeed = 0.4
                entity.player.runAcceleration = 0.35
                // 将玩家的跳跃设置打开
                entity.player.enableJump = true
            }, 5000);
        }

        // 如果玩家碰到的是隐身道具，那么我们希望玩家隐身不可见
        if (other.id === "隐身道具") {
            other.destroy()
            // 隐藏所有身体部件
            for (const bodyPart in entity.player.skinInvisible) {
                entity.player.skinInvisible[bodyPart] = true;
            }

            entity.player.directMessage(`你获得了隐身效果！`)

            // 设置定时器，定时时间为5000毫秒(5秒)，5秒后会触发定时器内的代码
            setTimeout(() => {
                // 显示所有身体部件
                for (const bodyPart in entity.player.skinInvisible) {
                    entity.player.skinInvisible[bodyPart] = false;
                }
            }, 5000);
        }
    }
})