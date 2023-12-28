// 注：SocketWrapper系列默认通信虚拟端口为6100

// 一个简单的通信示例
// SERVER index.js
let ssw = new SocketServerWrapper(); // 初始化
ssw.on("connect", (client /* 当连接成功后，会实例化一个Socket */) => {
    console.log(`[server] 连接成功，实例id: ${client.id}`); // 当实例连接成功时打印消息
    client.listen("message", (d) => console.log(`[server] 收到来自客户端发送的消息: ${d}`));
    client.listen("disconnect", (d) => { console.log(`[server] 客户端断开了连接，理由是: ${d.reason}`) });
    client.send("你好客户端！");
    client.ping(() => console.log(`[server] pong!`)); // 尝试ping一下，当收到pong之后会执行回调
});


// CLIENT clientIndex.js
let scw = new SocketClientWrapper(); // 初始化
scw.onmessage = (d) => console.log(`[client] 收到来自服务端的消息: ${d}`);
scw.onerror = console.error; // 用于输出报错信息
scw.onopen = () => {
    scw.send("hello!"); // 发送消息
    scw.ping(() => { // 当收到pong之后用理由"1145"关闭会话
        console.log(`[client] pong!`);
        scw.close(1145);
    })
};
scw.onclose = (code)=>{
    console.log(`[client] 服务器断开了连接，理由是: ${code}`);
}