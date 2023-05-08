/**
 * !info {Project} -来自(shequ.codemao.cn/community/437424)@(恶.管)tiger666250
 * 多重对话之术！
 * 地图需包含两个npc模型
 * 与A对话（弹窗）后会接到与B对话的任务
 * 在与B对话完成任务后回来和A互动
 * 将会触发不同的对话内容
 */



console.clear()
async function text(entity, title, content) {//将一个text封装成函数，调用时更加的简单
    return await entity.player.dialog({
        type: Box3DialogType.TEXT,//text
        title,//标题
        content//内容
    })
}
//正片开始
for (const npc of world.querySelectorAll('.npc')) {//在地图中找到所有有npc标签的实体
    npc.enableInteract = true;//你可以和npc互动
    npc.interactRadius = 5;//互动范围为5
    npc.interactHint = npc.id//实体名称为模型的id
    if (npc.id == '吉吉喵') {//如果他是吉吉喵
        npc.onInteract(async ({ entity }) => {//判断互动
            if (entity.jq == 1) {//如果剧情变量为1时，应该让吉吉喵给玩家布置任务
                //以下是剧情
                text(entity, '吉吉喵', `${entity.player.name}，我做好了一碗鸡汤，快去给雷电猴吃吧！`)
                text(entity, '吉吉喵', `把鸡汤给了雷电猴后就过来报道哦~`)
                text(entity, '吉吉喵', `任务1：把鸡汤给雷电猴`)
                entity.player.directMessage('你获得了一碗 鸡汤')
                //变量调整，让玩家去找雷电猴
                entity.jq = 2;
            } else if (entity.jq == 2) {//如果剧情变量为2时，吉吉喵没有需要干的事情，但是为了使情节丰富，我加了一句
                text(entity, '吉吉喵', `你任务没有完成，完成后再回来`);
            } else if (entity.jq == 3) {//如果剧情变量为3时，吉吉喵的任务完成了~
                text(entity, '吉吉喵', `啊哈哈哈哈哈哈哈哈哈哈哈哈我的任务完成啦~`);
            }
        })
    }
    if (npc.id == '雷电猴') {//如果他是雷电猴
        npc.onInteract(async ({ entity }) => {//判断互动
            if (entity.jq == 1) {//如果剧情变量为1时，雷电猴不知道发生了什么，为了使情节丰富，我又加了一句
                text(entity, '雷电猴', `hi`)
            } else if (entity.jq == 2) {//如果剧情变量为2时，雷电猴应该要把鸡汤喝了
                //以下是剧情
                text(entity, '雷电猴', `这是吉吉喵给我的鸡汤是吧，我试试，你看喝鸡汤多是一件美事啊~~`);
                text(entity, '雷电猴', `雷电猴喝下了鸡汤`);
                text(entity, '雷电猴', `任务2：回去找吉吉喵报道吧`)
                entity.player.directMessage('你的任务完成了，可以回去报道了')
                //变量调整，让玩家回去报道
                entity.jq = 3;
            } else if (entity.jq == 3) {//如果剧情变量为3时，雷电猴喝完了鸡汤，认为鸡汤味道好极了
                text(entity, '雷电猴', `这鸡汤不咸不淡，味道好极了！`);
            }
        })
    }
}
world.onPlayerJoin(async ({ entity }) => {//如果玩家进入地图，将玩家的剧情变量变成1
    entity.jq = 1;//剧情，用来判断剧情的变量
})