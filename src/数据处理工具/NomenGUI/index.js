/**
 * !info {Project} -来自Nomen
 * NomenGUI & NomenNode: 何不以DOM的形式便捷的管理你的GUI界面？ - https://shequ.codemao.cn/community/552140
 */



world.onPlayerJoin(async ({ entity }) => {
    let root = new NomenGUI(entity); // 如果你觉得原来的根节点长得不好，可以自行创建新节点作为第二参数，但是千万确保这个根节点的id是NomenGUIE-Root
    await root.init(); // 初始化文档
    root.root.appendChild(new NomenNode({ // 创建一个元素，id为awa2，然后插入到文档中
        display: true,
        "data": {
            "name": "label",
            "attributes": {
                "text": "awa2",
                "fontSize": 40,
                "color": "#FF0000",
                "top": 0,
                "height": 10,
                "width": 600
            },
            "id": "awa2" // id可自定义，但是必须是全局唯一
        },
        entity: entity // 这里必须是玩家实体
    }))
    let u = new NomenNode({ // 创建一个元素awa3，然后插入到文档中
        display: true,
        "data": {
            "name": "label",
            "attributes": {
                "text": "awa3: 我是另一个awa",
                "fontSize": 40,
                "color": "#FF0000",
                "top": 120,
                "height": 10,
                "width": 600
            },
            "id": "awa3"
        },
        entity: entity
    });
    u.appendChild(new NomenNode({ // 在awa3下创建子元素awa4
        display: true,
        "data": {
            "name": "label",
            "attributes": {
                "text": "我是awa3的子节点，相对于awa3下挪动了114像素",
                "fontSize": 40,
                "color": "#FF0000",
                "top": 114,
                "height": 10,
                "width": 600
            },
            "id": "awa4"
        },
        entity: entity
    }));
    root.root.appendChild(u); // 将awa3插入到文档中
    u.setAttribute("text", "我是变化后的awa3，但是如果你觉得Nomen是一个很棒的人，那么，我觉得这件事情真的是是太酷辣"); // 更改awa3的text属性
    // 更多的节点方法已被支持，可以查阅DOM JS以获得更多信息
    await root.refresh(); // 重新计算文档信息
    await root.render(); // 重新初始化文档的显示

    // 或者实时修改当前元素在文档中信息
    await u.setAttributeSync("text","这是一个被实事修改的新值");

    // 还有删除元素
    root.root.removeChild(u);
    // 任何非同步操作都需要重新计算和重新显示
    await root.refresh(); // 重新计算文档信息
    await root.render(); // 重新初始化文档的显示
})