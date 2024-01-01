
// 导入RCW，如果已有则不需要这一步
const RemoteClientWrapper = require("../../端连接/RemoteWrapper/1.1.0/Remote.client.js");
// 初始化RCW
const rcw = RemoteClientWrapper(80);

// 导入UiNodeWrapper，如果已有则不需要这一步
const UiNodeWrapper = require("UiWrapper.js").createUiNodeWrapper();
// 配置uiWrapper
const uiWrapper = new UiNodeWrapper(ui);

// 定义与一个fetch函数
function fetch(path, content) {
    return new Promise(resolve => {
        rcw.communicate({ path, ...content }, (v) => {
            resolve(v);
        })
    })
}

// 由于服务端特性，我们需要先等待
setTimeout(() => {
    fetch("/user/profile", {
        method: "GET",
    }).then(v => {
        // 这里是设置数据在GUI上的显示
        uiWrapper.findChildByName("coin")
            .config("textContent", v.coin);
        uiWrapper.findChildByName("photo")
            .config("image", v.photo);
        uiWrapper.findChildByName("name")
            .config("textContent", v.name);
    })
}, 1000)


