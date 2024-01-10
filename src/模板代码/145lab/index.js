/** 
 * !Info {Module} -来自145a
 * 145lab.js 3.1
 */
require("./145storage.js");
/*config*/
let DEFAULT_USER_DATA = {
    character: "",
    contribution: 0,
    exp: 0,
    money: 0,
    health: 50,
    weaponLevel: 1,
    weaponDurable:1
};
let TIPS = [

];
let HELP = TIPS.join("\n");
let ADDS = [
    "把繁琐交给145lab，专注于地图本身",
    "广告招商中"
];
/*camera*/
class CameraViewTypeData {
    constructor(displayName, setup) {
        this.displayName = displayName;
        this.setup = setup;
    }
}
let CameraViewType = {
    Fps: new CameraViewTypeData("第一人称", (entity) => {
        entity.player.cameraMode = "fps";
    }),
    Follow: new CameraViewTypeData("第三人称", (entity) => {
        entity.player.cameraMode = "follow";
    }),
    /*WideFollow: new CameraViewTypeData("第三人称广角", (entity) => {
        entity.player.cameraMode = "follow";
        entity.player.cameraFovY = 0.35;
    }),
    OverlookFollow: new CameraViewTypeData("俯视(触屏专用)", (entity) => {
        entity.player.cameraMode = GameCameraMode.RELATIVE;
        entity.player.cameraPosition = new GameVector3(-0.01, 60, 0);
        entity.player.swapInputDirection = true;
        entity.player.reverseInputDirection = GameInputDirection.HORIZONTAL;
        entity.player.cameraFreezedAxis = GameCameraFreezedAxis.Y;
        entity.player.freezedForwardDirection = new GameVector3(0, 0, 1);
        entity.player.canFly = false;
    })*/
}
/*storage*/
storage.userDataStorage = storage.get145DataStorage("main", DEFAULT_USER_DATA);
/*setup*/
GamePlayer.setup145lab = async function (entity) {
    /*dialog*/
    entity.dialogResult = null;
    entity.basicDialog = async function (params) {
        return this.dialogResult = await this.player.dialog(params);//await gui.dialog(this, params.title, params.content, params.options, gui.DialogPositionType.FULL_SCREEN);
    }
    entity.textDialog = async function (title, content) {
        return await this.basicDialog({
            type: "text",
            title: title,
            content: content
        });
    }
    entity.selectDialog = async function (title, content, options) {
        return await this.basicDialog({
            type: "select",
            title: title,
            content: content,
            options: options
        });
    }
    entity.inputDialog = async function (title, content, placeholder, confirmText) {
        return this.dialogResult = await this.player.dialog({
            type: "input",
            title: title,
            content: content,
            placeholder: placeholder,
            console: confirmText
        });
    }
    entity.cancelDialog = async function () {
        this.player.cancelDialogs();
    }
    /*debug*/
    entity.debugBridgeRun = function (input) {
        let output;
        try {
            output = eval(input);
        } catch (e) {
            output = e;
        }
        return output
    }
    entity.debugBridgeConsole = async function () {
        while (true) {
            await this.inputDialog("145lab", "145lab Debug Bridge", "命令", "执行");
            if (!this.dialogResult) break;
            await this.textDialog("145lab", this.debugBridgeRun(this.dialogResult));
        }
    }
    /*tips*/
    entity.viewTip = function () {
        return "Tips：" + TIPS[Math.floor(Math.random() * TIPS.length)];
    }
    /*ad*/
    entity.viewAd = function () {
        return `[广告]${ADDS[Math.floor(Math.random() * ADDS.length)]}`;
    }
    /*help*/
    entity.viewHelp = async function () {
        await this.textDialog("帮助", HELP);
    }
    /*camera*/
    entity.chooseCameraView = async function () {
        const config = Object.values(CameraViewType);
        do {
            await this.selectDialog(
                "选择你的视角",
                "选择你喜欢的视角",
                config.map(v => v.displayName)
            );
        } while (!this.dialogResult);
        config[this.dialogResult.index].setup(this);
    }
    entity.watchGlobal = async function () {
        const previousMode = this.player.cameraMode;
        const previousPosition = this.player.cameraPosition.clone();
        const previousTarget = this.player.cameraTarget.clone();
        const previousUp = this.player.cameraUp.clone();
        this.player.cameraMode = "fixed";
        this.player.cameraPosition.set(128, 250, 128);
        this.player.cameraTarget.set(128, 0, 128);
        this.player.cameraUp.set(1, 0, 0);
        this.player.directMessage("按任意键退出小地图");
        await this.player.nextPress();
        this.player.cameraMode = previousMode;
        this.player.cameraTarget.copy(previousTarget);
        this.player.cameraPosition.copy(previousPosition);
        this.player.cameraUp.copy(previousUp);
    }
    /*storage*/
    entity.manageData = async function () {
        await this.selectDialog("管理145lab储存的个人数据", `userId:${this.player.userId}\n已储存的数据:${JSON.stringify((await storage.userDataStorage.get(this.player.userId)).value)}`, ["删除个人数据"]);
        if (!this.dialogResult) return;
        switch (this.dialogResult.value) {
            case "删除个人数据":
                await this.selectDialog("删除个人数据", "是否要删除您的个人数据？此操作不可逆", ["删除个人数据"]);
                if (!this.dialogResult) break;
                entity.player.kick();
                storage.userDataStorage.remove(entity.player.userId);
                break;
        }
    }
    await storage.userDataStorage.setupUser(entity);
}
//请勿删除最后一行