// 导入RSW，如果已有则不需要这一步
const RemoteServerWrapper = require("../../端连接/RemoteWrapper/1.1.0/Remote.server.js");

class WebApp {
    /**
     * @param {RemoteServerWrapper} rms 
     */
    constructor(rms) {
        this.rms = rms;
    }
    get(path, f) {
        this.rms.onMessage("communicate", async (request, entity) => {
            if (request.path === path && request.method === "GET") {
                return await f(request, entity);
            }
        })
    }
    post(path, f) {
        this.rms.onMessage("communicate", async (request, entity) => {
            if (request.path === path && request.method === "POST") {
                return await f(request, entity);
            }
        })
    }
}

// 开始监听端口80
let rms = new RemoteServerWrapper([], {
    port: 80
});

// 创建一个模拟Web应用
let app = new WebApp(rms);
// 监听/user/profile上的GET操作
app.get("/user/profile", async (request, entity) => {
    return await GET_USER_PROFILE(entity); // 返回了Promise {coin:10, photo:"uri", name:"Nomen"}
});

// 玩家状态变化时监听或取消监听
world.onPlayerJoin(({ entity }) => {
    rms.add(entity);
});
world.onPlayerLeave(({ entity }) => {
    rms.cancel(entity);
});
