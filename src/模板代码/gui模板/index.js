/**
 * !info {Module} -来自社区
 * gui.js 1.0
 * 贡献者 @145a @冷雨闲风 @小宏XeLa @Amc
*/
gui.ElementType = {
    DIALOG: "dialog",
    GROUP: "group",
    LABEL: "label",
    BUTTON: "button",
    IMAGE: "image"
}
gui.DialogPositionType = {
    FULL_SCREEN: "full screen",
    LEFT: "left"
}
function getStringRealLength(str) {
    str = String(str);
    let count = 0;
    for (let char of str) {
        count += char.match(/[^\x00-\xff]/) ? 2 : 1;
    }
    return count;
}
function forceEndline(str, maxLength) {
    str = String(str);
    if (getStringRealLength(str) <= maxLength) return str;
    if (typeof str != "string") {
        str += "";
    }
    let resultArr = [];
    let piece = "";
    let length = 0
    for (let char of str) {
        if (char !== "\n") {
            length += char.match(/[^\x00-\xff]/) ? 2 : 1;
            piece += char;
        }
        if (length >= maxLength || char === "\n") {
            resultArr.push(piece);
            piece = "";
            length = 0;
        }
    }
    if (piece.length > 0) resultArr.push(piece);
    let result = resultArr.join("\n");
    return result;
}
gui.getScreenResolution = async function (entity) {
    await gui.init(entity, {
        "": {
            display: true, data: `<dialog percentWidth="100" percentHeight="100" id="fullscreen"></dialog>`
        }
    });
    const screenWidth = await gui.getAttribute(entity, "#fullscreen", "width");
    const screenHeight = await gui.getAttribute(entity, "#fullscreen", "height");
    gui.remove(entity, "#fullscreen");
    return {
        width: screenWidth,
        height: screenHeight
    }
}
gui.data = function ([name, id, attributes, children]) {
    attributes.id = id;
    return {
        name: name,
        attributes: attributes,
        children: children ?
            children.map((v) => gui.data(v))
            :
            void 0
    };
}
gui.initDialog = async function (entity, position, title, content = "", options, color, canCopy = false) {
    if (!!(await gui.getAttribute(entity, "#dialogText", "id"))) {
        throw `gui对话框无法叠加`;
    }
    content = forceEndline(content, 28);
    const screen = await gui.getScreenResolution(entity);
    const x = [screen.width / 2 - 90, 100][[gui.DialogPositionType.FULL_SCREEN, gui.DialogPositionType.LEFT].indexOf(position)];
    const contentEndlineNum = content.split("\n").length - 1;
    const startY = screen.height / 2.5 - ((canCopy + options.length) * 30 + contentEndlineNum * 15);
    const contentY = startY + contentEndlineNum * 16;
    let data = {
        "dialogText": {
            display: true,
            data: gui.data([
                gui.ElementType.GROUP, "dialogText", {
                    percentWidth: 100,
                    percentHeight: 100,
                    backgroundColor: position === gui.DialogPositionType.FULL_SCREEN ? "black" : "transparent"
                },
                [
                    [
                        gui.ElementType.LABEL, "dialogTitle",
                        {
                            text: title,
                            y: startY,
                            x: x + 100 - getStringRealLength(title) * 10,
                            fontSize: 40,
                            color: color,
                            height: 100,
                            width: 400
                        }
                    ],
                    [
                        gui.ElementType.LABEL, "dialogContent",
                        {
                            text: content,
                            y: contentY,
                            x: x - 100,
                            fontSize: 30,
                            color: color,
                            height: 200,
                            percentWidth: 100
                        }
                    ]
                ]
            ])
        }
    };
    if (canCopy) {
        data["dialogContentCopyButton"] = {
            display: true,
            bindings: [
                { action: "clipboardWrite", attributeName: `copyValue`, event: "click", targetSelector: `#dialogContentCopyButton` }
            ],
            data: gui.data([
                gui.ElementType.BUTTON,
                `dialogContentCopyButton`,
                {
                    text: "复制到剪切板",
                    y: contentY + 110 + contentEndlineNum * 16,
                    x: x,
                    color: color,
                    height: 40,
                    width: 200,
                    copyValue: content
                }
            ])
        }
    }
    for (let index = 0; index < options.length; index++) {
        data[`dialogOption${index}`] = {
            display: true,
            bindings: [
                { action: "sendMessage", messageName: `pressDialogOption${index}`, event: "click", selector: `#dialogOption${index}` }
            ],
            data: gui.data([
                gui.ElementType.BUTTON,
                `dialogOption${index}`,
                {
                    text: options[index],
                    y: contentY + 140 + contentEndlineNum * 16 + ((index + canCopy) * 50),
                    x: x,
                    color: color,
                    height: 40,
                    width: 200
                }
            ])
        };
        gui.init(entity, data);
    }
}
gui.removeDialog = async function (entity) {
    if (!!await gui.getAttribute(entity, "#dialogContentCopyButton", "text")) {
        await gui.remove(entity, "#dialogContentCopyButton");
    }
    for (let index = 0; !!(await gui.getAttribute(entity, `#dialogOption${index}`, "id")); index++) {
        await gui.remove(entity, `#dialogOption${index}`);
    }
    await gui.remove(entity, "#dialogText");
}
gui.cancelDialog = async function (entity) {
    await gui.removeDialog(entity);
    entity.player.guiDialogResolve(null);
}
GamePlayer.prototype.guiDialogResolve = null;
GamePlayer.prototype.guiDialogResult = null;
gui.dialog = async function (entity, title, content, options = ["确定"], canCopy = false) {
    if (!!(await gui.getAttribute(entity, "#dialogText", "id"))) return;
    await gui.initDialog(entity, gui.DialogPositionType.FULL_SCREEN, title, content, options.concat(["关闭"]), "orange", canCopy);
    let dialogPromise = new Promise((resolve, reject) => {
        entity.player.guiDialogResolve = resolve;
    });
    return dialogPromise;
}
gui.onMessage(async ({ entity, name }) => {
    if (name.startsWith("pressDialogOption")) {
        const index = name.slice(-1);
        const value = await gui.getAttribute(entity, `#dialogOption${index}`, "text");
        entity.player.guiDialogResult = value === "关闭" ? null : { index: index, value: value };
        await gui.removeDialog(entity);
        entity.player.guiDialogResolve(entity.player.guiDialogResult);
    }
});
//请勿删除最后一行