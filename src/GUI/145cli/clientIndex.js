/**
 * !Info {Project} -来自145a
 * 145cli 0.2
 * clientIndex.js
 */

"use strict";

console.clear();

const COLORS = {
    BLACK: Vec3.create({ r: 0, g: 0, b: 0 }),
    WHITE: Vec3.create({ r: 255, g: 255, b: 255 }),
    RED: Vec3.create({ r: 255, g: 0, b: 0 }),
    ORANGE: Vec3.create({ r: 255, g: 127, b: 0 }),
    GREEN: Vec3.create({ r: 0, g: 255, b: 0 }),
    BLUE: Vec3.create({ r: 0, g: 255, b: 255 }),
}

const background = UiBox.create();
background.backgroundColor.copy(COLORS.BLACK);
background.size.offset.copy({ x: screenWidth, y: screenHeight });

const fontSize = Math.max(10, Math.floor(screenWidth / 50));
let lineNum = 0;
const defaultDisplay = [
    {
        color: "GREEN",
        content: "145cli 0.2"
    }
];

for (let i = 0; i < screenHeight * 0.9 / fontSize; i += 1) {
    const line = UiText.create();
    line.name = `line${i}`;
    line.position.offset.y = i * fontSize;
    line.position.offset.x = 0;
    line.textColor.copy(COLORS.WHITE);
    line.textFontSize = fontSize;
    line.size.offset.y = fontSize;
    line.size.offset.x = screenWidth;
    line.textXAlignment = "Left";
    line.textYAlignment = "Center";
    line.autoResize = "X";
    line.textContent = "";
    line.parent = background;
    lineNum += 1;
}

async function display(arr) {
    if (arr.length > lineNum) throw new RangeError("Too much lines to display");
    for (let i = 0; i < arr.length; i++) {
        if (!COLORS[arr[i].color]) throw new TypeError("Invalid color");
        const node = background.findChildByName(`line${i}`);
        node.textContent = arr[i].content;
        node.textColor.copy(COLORS[arr[i].color]);
    }
}

remoteChannel.sendServerEvent({
    name: "newCliClient",
    data: {
        cliLineNum: lineNum,
        cliFontSize: fontSize,
        cliScreenWidth: screenWidth,
        cliDisplay: defaultDisplay
    }
});

remoteChannel.events.on("client", (args) => {
    switch (args.name) {
        case "cliDisplay":
            display(args.data);
            break;
    }
});


background.parent = ui;

//请勿删除最后一行