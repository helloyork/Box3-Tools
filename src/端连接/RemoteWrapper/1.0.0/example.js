
/**
在RemoteWrapper中，通信分为两种协议：data和communicate
data用于直接传输消息，而communicate则用于交换消息

communicate会话中，接收方必须回应，否则可能导致无限等待，在服务端RemoteServerWrapper提供了timer函数用于控制超时
如果想要直接向客户端发送消息，可以直接操作rmsInstance.client.send发送原始数据
*/

// 玩家进行抽卡的例子
// 当玩家点击抽卡按钮，服务端返回结果
// 使用七莓大佬的UiWrapper作为按钮进行演示

// CLIENT clientIndex.js
let rmc = RemoteClientWrapper();

pullButton.eventOnce("pointerdown", ()=>{
    rmc.communicate({
        action: "抽卡", // 发送的自定义的内容，可以是你想要的任何东西
    },(result)=>{
        CREATE_DIALOG(result.message); // 显示弹窗，展示服务端发送的结果，结果应该是 {message: "无锋剑x1"}
    });
});


// SERVER index.js
world.onPlayerJoin(({ entity }) => {
    let rms = new RemoteServerWrapper(entity); // 初始化管理器
    rms.onMessage("communicate", async (request, entity) => {
        if(request.action === "抽卡"){
            entity.yuanshi -= 160;
            let result = RANDOM_TRASH(); // 随机生成抽卡结果
            await entity.UPDATE_DATA();
            return {message: result}; // 直接作为函数返回即可，函数可以是异步函数
        }
    })
});


// 另一个例子，展示简易聊天框
// CLIENT clientIndex.js
rmc = RemoteClientWrapper();
sendButton.eventOnce("pointerdown", ()=>{
    rmc.send(chatBox.findChildByName("textbox").text); // 假想的文字输入框
    rmc.onMessage("data", (message)=>{ // 收到来自服务器的新消息
        chatBox.createChildNode(UiText)
            .config("textContent", message); // 创建文本并且显示给玩家
    })
});


// SERVER index.js
let rms = new RemoteServerWrapper(); // 全局玩家聊天管理器
world.onPlayerJoin(({ entity }) => {
    rms.add(entity); // 将玩家加入管理器
    RemoteServerWrapper.listen(entity, "data", (arg)=>{ // 单独监听玩家，实际作用和onMessage差不多
        rms.send(arg, "data"); // 向所有收管理的玩家广播该玩家发送的消息
    });
});
world.onPlayerLeave(({entity})=>{
    rms.cancel(entity); // 当玩家退出的时候取消管理这名玩家以释放资源
})

