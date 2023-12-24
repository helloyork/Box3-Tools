

// 如何去除注释
// 1.打开替换界面
// 2.在上面的框输入 "\n? *\/\/ (.*)"，并使用正则表达式（那个 ".*" 的图标就是）
// 3.清除下面的框中的文本
// 4.全部替换


// 创建黄色方框示例
// 创建方框节点，并作为根节点的子节点
uiWrapper.createChildNode(UiBox)  // 不要加分号（下同）
    // 设置位置          创建 Coord2                                    只设置位移
    .config("position", UiNodeWrapper.createCoord2({ x: 10, y: 10 }))
    // 设置背景色                创建 Vec3
    .config("backgroundColor", Vec3.create({ r: 255, g: 255, b: 0 }))
    // 设置大小      创建 Coord2                                      只设置位移
    .config("size", UiNodeWrapper.createCoord2({ x: 100, y: 100 }));


// 创建黄色方框示例 - 原版 API 实现
// 创建方框节点
var boxNode = UiBox.create();
// 设置位置
boxNode.position.copy({ x: 10, y: 10 });
// 设置背景色
boxNode.backgroundColor.copy({ r: 255, g: 255, b: 0 });
// 设置大小
boxNode.size.offset.copy({ x: 100, y: 100 });
// 设置为根节点的子节点
boxNode.parent = ui;





// 创建用户信息示例（使用模板信息）
// 创建背景框架，并作为根节点的子元素
uiWrapper.createChildNode(UiBox)
    // 设置位置（下方部分代码省略注释）
    .config("position", UiNodeWrapper.createCoord2({ x: 25, y: 25 }))
    // 设置背景色
    .config("backgroundColor", { r: 0, g: 0, b: 255 })
    // 设置大小
    .config("size", UiNodeWrapper.createCoord2({ x: 250, y: 250 }))
    // 设置 zIndex
    .config("zIndex", 1)
    // 将节点添加到背景框架
    .appendChild(
        // 创建昵称文本
        UiNodeWrapper.createNode(UiText)
            .config("position", UiNodeWrapper.createCoord2({ x: 10, y: 10 }))
            // 设置文本内容
            .config("textContent", "七式草莓")
            // 设置文本大小
            .config("textFontSize", 14)
            // 设置文本颜色
            .config("textColor", { r: 255, g: 255, b: 255 })
            .config("zIndex", 2),
        // 创建UID文本
        UiNodeWrapper.createNode(UiText)
            .config("position", UiNodeWrapper.createCoord2({ x: 10, y: 50 }))
            .config("textContent", "UID: 73448")
            .config("textFontSize", 7)
            .config("textColor", { r: 127, g: 127, b: 127 })
            .config("zIndex", 2)
    );


// 如果使用函数封装节点，还可以写成这样
// 封装文本节点
function text(x, y, content, fontSize, color){
    // 创建文本节点并返回
    return UiNodeWrapper.createNode(UiText)
        // 设置位置（下方部分代码省略注释）
        .config("position", UiNodeWrapper.createCoord2({ x, y }))
        // 设置文本内容
        .config("textContent", content)
        // 设置文本大小
        .config("textFontSize", fontSize)
        // 设置文本颜色
        .config("textColor", color)
        // 设置 zIndex
        .config("zIndex", 2)
}
// 创建背景框架，并作为根节点的子元素
uiWrapper.createChildNode(UiBox)
    .config("position", UiNodeWrapper.createCoord2({ x: 25, y: 25 }))
    // 设置背景色
    .config("backgroundColor", { r: 0, g: 0, b: 255 })
    // 设置大小
    .config("size", UiNodeWrapper.createCoord2({ x: 250, y: 250 }))
    .config("zIndex", 1)
    // 将节点添加到背景框架
    .appendChild(
        // 创建昵称文本
        text(10, 10, "七式草莓", 14, { r: 255, g: 255, b: 255 }),
        // 创建UID文本
        text(10, 50, "UID: 73448", 7, { r: 127, g: 127, b: 127 })
    )


// 创建用户信息示例（使用模板信息） - 原版 API 实现
// 创建背景框架
var userInfoBox = UiBox.create();
// 设置位置（下方部分代码省略注释）
userInfoBox.position.offset.copy({ x: 25, y: 25 });
// 设置背景色
userInfoBox.backgroundColor.copy({ r: 0, g: 0, b: 255 });
// 设置大小
userInfoBox.size.offset.copy({ x: 250, y:250 });
// 设置 zIndex
userInfoBox.zIndex = 1;

// 创建昵称文本
var usernameText = UiText.create();
usernameText.position.offset.copy({ x: 10, y: 10 });
// 设置文本内容
usernameText.textContent = "七式草莓";
// 设置文本大小
usernameText.textFontSize = 14;
// 设置文本颜色
usernameText.textColor.copy({ r: 255, g: 255, b: 255 });
usernameText.zIndex = 2;
// 将昵称文本添加到背景框架
usernameText.parent = userInfoBox;

// 创建UID文本
var uidText = UiText.create();
uidText.position.offset.copy({ x: 10, y: 50 });
uidText.textContent = "UID: 73448";
uidText.textFontSize = 7;
uidText.textColor.copy({ r: 127, g: 127, b: 127 });
uidText.zIndex = 2;
// 将UID文本添加到背景框架
uidText.parent = userInfoBox;

// 将背景框架添加到根节点
userInfoBox.parent = ui;


// 原版 API 的实现（函数封装）
function text(x, y, content, fontSize, color){
    var text = UiText.create();
    // 设置位置（下方部分代码省略注释）
    uidText.position.offset.copy({ x, y });
    uidText.textContent = content;
    uidText.textFontSize = fontSize;
    uidText.textColor.copy(color);
    uidText.zIndex = 2;
    // 设置 zIndex
    return text;
}
// 创建用户信息示例（使用模板信息） - 原版 API 实现
// 创建背景框架
var userInfoBox = UiBox.create();
userInfoBox.position.offset.copy({ x: 25, y: 25 });
// 设置背景色
userInfoBox.backgroundColor.copy({ r: 0, g: 0, b: 255 });
// 设置大小
userInfoBox.size.offset.copy({ x: 250, y:250 });
userInfoBox.zIndex = 1;

// 创建昵称文本
var usernameText = text(10, 10, "七式草莓", 14, { r: 255, g: 255, b: 255 });
// 将昵称文本添加到背景框架
usernameText.parent = userInfoBox;
// 创建UID文本
var uidText = text(10, 50, "UID: 73448", 7, { r: 127, g: 127, b: 127 });
// 将昵称文本添加到背景框架
uidText.parent = userInfoBox;

// 将背景框架添加到根节点
userInfoBox.parent = ui;

