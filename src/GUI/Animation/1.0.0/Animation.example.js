// 这个例子，将创建一个提示文字，并在显示的时候从屏幕左上角移动到视野内

const UiNodeWrapper = createUiNodeWrapper();
const uiWrapper = new UiNodeWrapper(ui);

const Animation = GUIAnimation();

let r = uiWrapper.createChildNode(UiText)
    .config("position", UiNodeWrapper.createCoord2({ x: -100, y: 25 })) // 开始时将文字隐藏在屏幕外面
    .config("textContent", "欢迎加入游戏！")


let ani = new Animation({
    easingFunction: Animation.easing.easeInOutSine, // 使用easeInOutSine作为填充效果
    begin: 0,   // 开始时
    end: 100,   // 结束时
    time: 1000, // 持续时间
    delay: 1    // 动画刷新间隔，越小动画越流畅
});

ani.start(c => {
    // 当动画刷新时，调用工具更改文字的位置
    r.config("position", UiNodeWrapper.createCoord2({ x: c, y: 25 }));
});
ani.onStop((a) => {
    console.log("stop!");
});
ani.onStart((a) => {
    console.log("start!");
});

/*
ani.cancel()可以取消事件
GUIAnimation可以传入配置参数
interval指的是全局刷新时间，如果这个值调高，那么全局刷新速度就会降低，注意，这会更改动画持续时间，通常建议为1
easeFunctions是一个对象，将会被赋值到easing上用于扩展easing函数
*/
