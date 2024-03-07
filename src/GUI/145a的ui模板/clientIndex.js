
/**
 * !Info {Project} -来自145a
 * ui模板 0.5
 * ui模板是145lab的一部分
 * clientIndex.js
 */
console.clear();

let FONT_SIZE = Math.max(15, Math.floor(screenWidth / 60));

function setupTextDisplay(node) {
    node.textFontSize = FONT_SIZE;
    node.autoResize = "XY";
    node.textColor.copy({ r: 255, g: 255, b: 255 });
    node.backgroundColor.copy({ r: 0, g: 0, b: 0 });
    node.backgroundOpacity = 0.1;
    node.parent = ui;
}

const leftDisplay = UiText.create();
leftDisplay.name = "left";
leftDisplay.position.offset.copy({ x: screenWidth / 100, y: 16 });
leftDisplay.size.offset.copy({ x: 0, y: 0 });
leftDisplay.textXAlignment = "Left";
leftDisplay.textYAlignment = "Center";
setupTextDisplay(leftDisplay);
leftDisplay.textContent = "";

const topDisplay = UiText.create();
topDisplay.name = "top";
topDisplay.anchor.x = 0.5;
topDisplay.position.offset.copy({ x: screenWidth / 2, y: screenHeight / 10 });
topDisplay.size.offset.copy({ x: screenWidth / 3, y: 0 });
topDisplay.textXAlignment = "Center";
topDisplay.textYAlignment = "Bottom";
setupTextDisplay(topDisplay);
topDisplay.textContent = "";

const bottomDisplay = UiText.create();
bottomDisplay.name = "bottom";
bottomDisplay.anchor.copy({ x: 0.5, y: 0.5 });
bottomDisplay.position.offset.copy({ x: screenWidth / 2, y: screenHeight - screenHeight / 10 });
bottomDisplay.size.offset.copy({ x: 0, y: 0 });
bottomDisplay.textXAlignment = "Center";
bottomDisplay.textYAlignment = "Bottom";
setupTextDisplay(bottomDisplay);
bottomDisplay.textContent = "";

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
            for (const name of Object.keys(args.data)) {
                ui.findChildByName(name).textContent = args.data[name];
            }
            break;
    }
});
remoteChannel.sendServerEvent({
    name: "register",
    data: {
        screenHeight: screenHeight,
        screenWidth: screenWidth
    }
});
//请勿删除最后一行