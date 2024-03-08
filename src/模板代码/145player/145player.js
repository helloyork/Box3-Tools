/** 
 * !Info {Module} -来自145a
 * 145player 4.0
 * 145player是145lab的一部分
 */
"use strict";
const { DEFAULT_USER_DATA, TIPS, ADS } = require("./145playerConfig.js");
require("./145storage.js");
/*config*/
const HELP = TIPS.join("\n");
/*storage*/
storage.userDataStorage = storage.get145DataStorage("main", DEFAULT_USER_DATA);
/*setup*/
world.setup145player = async function (entity) {
    /*dialog*/
    entity.dialogResult = null;
    entity.basicDialog = async function (params) {
        Object.assign(params, {
            titleTextColor: new GameRGBAColor(1, 1, 1, 1),
            titleBackgroundColor: new GameRGBAColor(0, 0, 0, 0.2),
            contentBackgroundColor: new GameRGBAColor(0, 0, 0, 0.2)
        });
        return this.dialogResult = await this.player.dialog(params);//await gui.dialog(this, params.title, params.content, params.options, gui.DialogPositionType.FULL_SCREEN);
    };
    entity.textDialog = async function (title, content) {
        return await this.basicDialog({
            type: "text",
            title: title,
            content: content
        });
    };
    entity.selectDialog = async function (title, content, options) {
        return await this.basicDialog({
            type: "select",
            title: title,
            content: content,
            options: options
        });
    };
    entity.inputDialog = async function (title, content, placeholder, confirmText) {
        return this.dialogResult = await this.player.dialog({
            type: "input",
            title: title,
            content: content,
            placeholder: placeholder,
            console: confirmText
        });
    };
    entity.cancelDialog = async function () {
        this.player.cancelDialogs();
    };
    /*debug*/
    entity.debugBridgeRun = function (input) {
        let output;
        try {
            output = eval(input);
        } catch (e) {
            output = e;
        }
        return output
    };
    entity.debugBridgeConsole = async function () {
        while (true) {
            await this.inputDialog("145lab", "145lab Debug Bridge", "命令", "执行");
            if (!this.dialogResult) break;
            await this.textDialog("145lab", this.debugBridgeRun(this.dialogResult));
        }
    };
    /*tips*/
    entity.viewTip = function () {
        return "Tips：" + TIPS[Math.floor(Math.random() * TIPS.length)];
    };
    /*ad*/
    entity.viewAd = function () {
        return `[广告]${ADS[Math.floor(Math.random() * ADS.length)]}`;
    };
    /*help*/
    entity.viewHelp = async function () {
        await this.textDialog("帮助", HELP);
    };
    /*camera*/
    entity.watchGlobal = function (cameraPos) {
        const previousMode = this.player.cameraMode;
        const previousPosition = this.player.cameraPosition.clone();
        const previousTarget = this.player.cameraTarget.clone();
        const previousUp = this.player.cameraUp.clone();
        this.player.cameraMode = "fixed";
        this.player.cameraPosition.copy(cameraPos);
        this.player.cameraTarget.copy(cameraPos.sub(new GameVector3(0, 10, 0)));
        this.player.cameraUp.set(1, 0, 0);
        return () => {
            this.player.cameraMode = previousMode;
            this.player.cameraTarget.copy(previousTarget);
            this.player.cameraPosition.copy(previousPosition);
            this.player.cameraUp.copy(previousUp);
        };
    };
    /*items*/
    Object.defineProperties(entity, {
        displayItems: {
            enumerable: true,
            get() {
                return Object.entries(entity.items).map(([k, v]) => `${k} * ${v}`);
            }
        },
        totalItemsNum: {
            enumerable: true,
            get() {
                return Object.values(entity.items).reduce((p, v) => p + v, 0);
            }
        }
    });
    entity.addItem = function (name, num = 1) {
        if (entity.items[name]) {
            entity.items[name] += num;
        } else {
            entity.items[name] = num;
        }
        if (entity.items[name] < 1) {
            delete entity.items[name];
        }
    };
    /*storage*/
    entity.manageData = async function () {
        await this.selectDialog("管理145lab储存的个人数据", `userId:${this.player.userId}\n已储存的数据:${JSON.stringify((await storage.userDataStorage.get(this.player.userId)).value)}`, ["删除个人数据"]);
        switch (this.dialogResult?.value) {
            case "删除个人数据":
                await this.selectDialog("删除个人数据", "是否要删除您的个人数据？此操作不可逆", ["删除个人数据"]);
                if (!this.dialogResult) break;
                entity.player.kick();
                storage.userDataStorage.remove(entity.player.userId);
                break;
        }
    };
    await storage.userDataStorage.setupUser(entity);
};
//请勿删除最后一行