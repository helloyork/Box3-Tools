
/**
 * !Info {Project} -来自145a
 * ui模板 0.3
 * ui模板是145lab的一部分
 * clientIndex.js
 */
console.clear();

let FONT_SIZE = Math.max(15, Math.floor(Math.sqrt(screenWidth * screenHeight)/40));

function setupTextDisplay(node) {
    node.textFontSize = FONT_SIZE;
    node.autoResize = "XY";
    node.textColor.copy({ r: 255, g: 255, b: 255 });
    node.backgroundColor.copy({ r: 0, g: 0, b: 0 });
    node.backgroundOpacity = 0.1;
    node.parent = ui;
}

const topDisplay = UiText.create();
topDisplay.size.offset.x = 0;
topDisplay.size.offset.y = 0;
topDisplay.textXAlignment = "Left";
topDisplay.textYAlignment = "Bottom";
setupTextDisplay(topDisplay);
topDisplay.textContent = "欢迎使用145lab";
input.uiEvents.on("pointerup", (args) => {
    if (args?.target?.name) {
        remoteChannel.sendServerEvent({
            name: "click",
            data: args.target.name
        });
    }
});
remoteChannel.events.on("client", (args) => {
    switch (args.name) {
        case "display":
            topDisplay.textContent = args.data.top;
            break;
    }
});
//请勿删除最后一行