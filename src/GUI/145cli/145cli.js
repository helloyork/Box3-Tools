/**
 * !Info {Project} 来自145a
 * 145cli 0.2
 */
"use strict";

const { XZ } = require("./XZ.js");

function splitDisplayLine(lineLength, content) {
    let str = content;
    let lengthCount = 0;
    let result = [];
    let i = 0;
    while (str.length > i) {
        i += 1;
        const charCode = str.charCodeAt(i);
        if (["i", "l", ";", ",", ".", "!", "*", "|"].includes(str[i])) {
            lengthCount += 0.3;
        } else if (charCode > 255) {
            lengthCount += 1;
        } else {
            lengthCount += 0.6;
        }
        if (lengthCount >= lineLength) {
            result.push(str.slice(0, i));
            str = str.slice(i + 1);
            lengthCount = i = 0;
        }
    }
    result.push(str);
    if (result.length === 1) return [content];
    return result;
}

function setupClient(entity) {
    entity.cliLineLength = Math.floor(entity.cliScreenWidth / entity.cliFontSize);
    entity.echo = function (color, content) {
        content = String(content);
        if (content.includes("\n")) {
            content.split("\n").forEach(v => this.echo(color, v));
            return;
        }
        const arr = splitDisplayLine(this.cliLineNum, content);
        this.cliDisplay.push(...arr.map(v => ({ color: color, content: v })));
        while (this.cliDisplay.length > this.cliLineNum) {
            this.cliDisplay.shift();
        }
        remoteChannel.sendClientEvent(this, {
            name: "cliDisplay",
            data: this.cliDisplay
        });
    };
    entity.input = async function (content) {
        return this.dialogResult = await this.player.dialog({
            type: "input",
            content: content,
            contentBackgroundColor: new GameRGBAColor(0, 0, 0, 0),
            contentTextColor: new GameRGBAColor(0, 1, 0, 1)
        });
    };
    entity.xz = function (script) {
        const x = XZ.create();
        x.command = script;
        try {
            x.run((v) => this.echo("WHITE", v));
        } catch (e) {
            entity.echo("RED", `${e}`);
        }
    };
    entity.xzRunner = async function () {
        let script = [];
        while (true) {
            const next = await this.input(`\$`);
            const commends = next.split(";").map(v=>v.startsWith(" ")?v.slice(1):v).filter(v=>v.length>0);
            if (!next) continue;
            if (next === "run") {
                entity.echo("GREEN", "开始运行");
                this.xz(script.join("\n"));
                script = [];
                entity.echo("GREEN", "结束运行");
            } else {
                script.push(...commends);
                for (let i = 0; i < commends.length; i++) {
                    this.echo("GREEN", `\$ ${commends[i]}`);
                }
            }
        }
    }
    entity.xzRunner();
}
remoteChannel.onServerEvent(async ({ entity, args }) => {
    if (args.name === "newCliClient") {
        Object.assign(entity, args.data);
        setupClient(entity);
        entity.echo("GREEN", "连接成功\nXZ解释器版本:20240110\n使用;分行\n输入“run”运行");
        entity.addTag("cliClient");
    }
});
//请勿删除最后一行