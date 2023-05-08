/**
 * !info {Project} -来自(shequ.codemao.cn/community/439092)@BZIClaw
 * 实现的效果是当地图内玩家人数满足3人时游戏开局！
 */



console.clear();  // 清空控制台

world.onPlayerJoin(({ entity }) => {  // 当实体进入地图
    if (entity.isPlayer) {  // 如果实体是一个玩家
        entity.addTag('NotInGame');  // 添加标签 “不在游戏中”
        if (world.querySelectorAll('player').length >= 3) {  // 如果玩家的数量 >= 3 则开始游戏
            for (const c of world.querySelectorAll('.NotInGame')) {  // 让所有不在游戏中的玩家传送到 “游戏区”
                c.player.spawnPoint.set(60, 15, 76);  // 重新重生点
                c.player.forceRespawn();  // 强制传送
                c.removeTag('NotInGame');  // 删掉标签 “不在游戏中”
                c.player.dialog({  // 对话框
                    type: Box3DialogType.TEXT,
                    title: `欢迎`,
                    content: `人数已超过 3 人，可进入游戏~~`
                })
            }
        } 
        else {  // 如果玩家人数不够，就执行这些代码
            entity.player.spawnPoint.set(41, 37, 44);  // 在上层 “休息区” 出生
            entity.player.forceRespawn();  // 强制传送（重生）
            entity.player.dialog({  // 发送对话框
                type: Box3DialogType.TEXT,
                title: `欢迎`,
                content: `目前人数未达到 3 人，请等待其他玩家进入~~`
            })
        }
    }
});