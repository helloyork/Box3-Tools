/**
 * !info {Project} - 来自145a
 * 注意⚠145lab仍在开发，目前不稳定。有bug一定要反馈!!!
 * 未来会成为一个代码模板(?)
 * 特别鸣谢(排名不分先后):疾风雀，无极玄天，冷鱼闲风，AMC，ray_crazy，万嘉麒，暗影虚空，快乐孙悟空，一剑走天下
 */
"use strict";
var _145labversion = "2.0 beta";
var AdminPassword = "a";
world.say(world.projectName);
//Basic
var AsyncFunction = async function () { }.constructor;
var warn = async function (warn) {
    world.say(concat("⚠", warn, "⚠"));
}
var error = async function (error) {
    if (error.stack) {
        error = error.stack;
    }
    warn(concat(__filename, space, error));
    if (world.isPublishedMode) {
        await sleep(10000);
        for (; ;) { }
    }
}
var debug = function (value, tag = "log") {
    world.say(concat("<~ ", tag, ": ", stringify(value)));
    return value;
}
var getTypeof = function (input) {
    return Object.prototype.toString.apply(input).slice(8, -1);
}
var stringify = function (input, depth = 3) {
    let output = "";
    const type = getTypeof(input);
    switch (type) {
        case "Object":
            output += "{";
            for (const value in input) {
                output += value;
                output += ":";
                if (depth > 0 && !Object.is(input[value], input)) {
                    output += stringify(input[value], depth - 1);
                } else {
                    output += getTypeof(input[value]);
                }
                output += ",";
            }
            if (output != "{") {
                output = output.slice(0, -1);
            }
            output += "}";
            break;
        case "Array":
            output += "[";
            for (const value of input) {
                if (depth > 0) {
                    output += stringify(value, depth - 1);
                } else {
                    output += getTypeof(value);
                }
                output += ",";
            }
            if (output != "[") {
                output = output.slice(0, -1);
            }
            output += "]";
            break;
        case "String":
            output += concat("\"", input, "\"");
            break;
        default:
            output += input;
            break;
    }
    return output;
}
var deepClone = function (obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    let clone = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            clone[key] = deepClone(obj[key]);
        }
    }
    return clone;
}
var sleepWhile = function (checkFunc, awaitMS = 100) {
    return new Promise((reslove, reject) => {
        const loop = setInterval(() => {
            if (!checkFunc()) {
                clearInterval(loop);
                reslove();
            }
        }, awaitMS);
    });
}
var commend = function (code, user) {
    world.say(`~> ${code}`);
    let result;
    try {
        if (code.includes("await")) {
            result = new AsyncFunction("", code)();
        } else {
            result = eval(code);
        }
    } catch (e) {
        result = e;
    } finally {
        world.say(`<~ ${result}`);
    }
    return result;
}
//Addons
var addPatch = function (patch) {
    warn(concat("已添加补丁: ", patch));
    patch();
    db.data.system.patches.push(String(patch));
}
var clearPatches = function () {
    db.data.system.patches = [];
    warn("补丁已全部清除");
}
var runPatches = async function () {
    if (db.data.system.patches.length > 0) {
        warn("补丁程序开始运行");
        for (const patch of db.data.system.patches) {
            eval(patch)();
        }
    }
}
//String
var endline = "\n";
var space = " ";
var concat = function (...value) {
    return value.join("");
}
String.prototype.sliceFrom = function (beginChar, endChar) {
    //此方法已弃用，将在2.1版本被移除
    return this.slice(beginChar && this.includes(beginChar) ? this.indexOf(beginChar) : 0, endChar ? this.indexOf(endChar) : this.length);
}
//Math
Math.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//Object
Object.hasValue = function (object, value) {
    return Object.values(object).includes(value);
}
Object.filter = function (object, filter) {
    return Object.fromEntries(Object.entries(object).filter(filter));
}
Object.getKey = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}
Object.forEach = (object, func) => {
    return Object.entries(object).forEach(func);
}
Object.reduce = function (object, reducer, defaultValue) {
    return Object.entries(object).reduce(reducer, defaultValue);
}
//Array
Array.prototype.pickOne = function () {
    return this[Math.randomInt(0, this.length - 1)];
}
Array.prototype.spliceWhere = function (value, num, add) {
    const index = this.indexOf(value);
    if (index < 0) return null;
    if (add) {
        return this.splice(index, num, add);
    } else {
        return this.splice(index, num);
    }
}
Array.prototype.replace = function (replacer, replacement) {
    return this.reduce((p, v) => {
        if (getTypeof(replacer) == "RegExp") {
            v = v.replace(replacer, replacement);
        } else if (getTypeof(replacer) === "Function") {
            v = replacer(v) ? replacement : v;
        } else {
            v = (v === replacer) ? replacement : v;
        }
        p.push(v);
        return p;
    },
        []
    )
}
//Date
Date.prototype.toChineseLocaleString = function () {
    return this.toLocaleString("zh-CN", {
        hour12: false,
        timeZone: "Asia/ShangHai"
    });
}
//World
world.runningMS = 0;
world.findPlayer = function (name) {
    return world.querySelectorAll("player").find(p => p.player.name.includes(name));
}
world.filterEntity = function (filter) {
    return world.querySelectorAll("*").filter(filter);
}
world.findEntity = function (finder) {
    return world.querySelectorAll("*").find(finder);
}
world.allPlayers = function () {
    return world.querySelectorAll("player");
}
world.isAdmin = function (user) {
    return user.player.url.searchParams.get("u") === AdminPassword;
}
world.isPublishedMode = world.url.pathname.includes("/p/");
//Voxel
voxels.getVoxelPosition = async function (voxel, low = new Box3Vector3(0, 0, 0), high = voxels.shape) {
    if (getTypeof(voxel) === "String") {
        voxel = voxels.id(voxel);
    }
    let returns = [];
    let count = 0;
    for (let y = low.y; y < high.y; y++) {
        for (let x = low.x; x < high.x; x++) {
            for (let z = low.x; z < high.z; z++) {
                if (voxels.getVoxel(x, y, z) === voxel) {
                    returns.push(new Box3Vector3(x, y, z));
                    if (count % 100 === 0) {
                        await sleep(1);
                    }
                }
            }
        }
    }
    return returns;
}
voxels.replace = async function (voxel, replaceVoxel, low = new Box3Vector3(0, 0, 0), high = voxels.shape) {
    (await voxels.getVoxelPosition(voxel, low, high)).forEach(({ x, y, z }) => {
        voxels.setVoxel(x, y, z, replaceVoxel);
    });
}
voxels.getCode = async function (low = new Box3Vector3(0, 0, 0), high = voxels.shape) {
    let arr = [];
    let count = 0;
    for (let y = low.y; y < high.y; y++) {
        for (let x = low.x; x < high.x; x++) {
            for (let z = low.z; z < high.z; z++) {
                if (voxels.getVoxel(x, y, z) != 0) {
                    arr.push([
                        x,
                        y,
                        z,
                        voxels.getVoxel(x, y, z),
                        voxels.getVoxelRotation(x, y, z)
                    ]);
                    if (count % 100 === 0) {
                        await sleep(1);
                    }
                }
            }
        }
    }
    return arr;
}
voxels.clear = async function (low = new Box3Vector3(0, 0, 0), high = voxels.shape) {
    let count = 0;
    for (const y = low.y; y < high.y; y++) {
        for (const x = low.x; x < high.x; x++) {
            for (const z = low.z; z < high.z; z++) {
                if (voxels.getVoxel(x, y, z) != 0) {
                    count++;
                    voxels.setVoxel(x, y, z, 0);
                    if (count % 100 === 0) {
                        await sleep(1);
                    }
                }
            }
        }
    }
}
voxels.setFromCode = async function (code) {
    for (const [x, y, z, voxel, rotation] of code) {
        voxels.setVoxel(x, y, z, voxel, rotation);
        await sleep(1);
    }
}
var Characters = {
    "0": "zero",
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine",
    "+": "add",
    "-": "subtract",
    "?": "question_mark",
    "!": "exclamation_mark",
    "=": "equal",
    " ": "black",
    "&": "ampersand",
    "*": "asterisk",
    "@": "at",
    "\\": "backslash",
    "]": "bracket_close",
    "[": "bracket_open",
    "^": "caret",
    ":": "colon",
    ",": "comma",
    "$": "dollar",
    ">": "greater_than",
    "<": "less_than",
    "(": "paren_open",
    ")": "paren_close",
    "%": "percent",
    ".": "period",
    "#": "pound",
    "'": "quotation_mark",
    ";": "semicolon",
    "/": "slash",
    "~": "tilde",
    " ": "air"
}
voxels.print = function (pos, direction = [new Box3Vector3(0, 0, 1), new Box3Vector3(0, -1, 0)], image) {
    let p1 = new Box3Vector3().copy(pos);
    if (getTypeof(image) === "String") {
        image = image.toUpperCase();
        image = image.split(endline);
        for (const i of Object.keys(image)) {
            image[i] = image[i].split("");
            for (const c of Object.keys(Characters)) {
                image[i] = image[i].replace(c, Characters[c]);
            }
        }
    }
    for (const i of image) {
        let p2 = new Box3Vector3().copy(p1);
        for (const e of i) {
            voxels.setVoxel(p2.x, p2.y, p2.z, e);
            p2.addEq(direction[0]);
        }
        p1.addEq(direction[1]);
    }
}
//Vector3
//Bounds3
Box3Bounds3.fromPoint = function (point, radius) {
    return Box3Bounds3.fromPoints(
        point.add(new Box3Vector3(radius, radius, radius)),
        point.sub(new Box3Vector3(radius, radius, radius))
    );
}
//Zone
//Quaternion
var Quat = new Box3Quaternion(0, 0, 0, 1);
Box3Quaternion.prototype.toEuler = function quatToEuler() {
    const q = this;
    const qw = q.w, qx = q.x, qy = q.y, qz = q.z
    const xx = Math.atan2(-2 * (qy * qz - qw * qx), qw * qw - qx * qx - qy * qy + qz * qz);
    let yy = Math.asin(2 * (qx * qz + qw * qy));
    const zz = Math.atan2(-2 * (qx * qy - qw * qz), qw * qw + qx * qx - qy * qy - qz * qz);
    if (Math.abs(qx) < 0.704) {
        yy = Math.PI - yy
    }
    return new Box3Vector3(xx, yy, zz)
}
//Entity Animation
Box3Entity.prototype.moveTo = async function (position, time = 1) {
    const ani = this.animate([
        {
            position: this.position,
            duration: 1
        },
        {
            position: position,
            duration: 0
        }
    ], {
        duration: time * 16
    });
    return ani;
}
Box3Entity.prototype.move = async function (velocity, time) {
    return await this.moveTo(this.position.add(velocity), time);
}
//Entity hurt
Box3Entity.prototype.armor = 0;
Box3Entity.prototype.takeDamage = function(damage=0,attacker = null){
    return this.hurt(damage-this.armor,{attacker:attacker});
}
//Entity
Box3Entity.prototype.quat = new Box3Quaternion().clone(Quat);
Box3Entity.prototype.originateByVelocity = function (plane) {
    const quat = this.quat;
    this.meshOrientation.copy(quat.rotateX(Math.atan2(e.velocity.y, e.velocity.x)).add(Quat.rotateY(e.velocity.z, e.velocity.x)));
}
//Player
Box3Entity.prototype.refresh = function () {
    if (!this.isPlayer) return;
    this.player.link(this.player.url, {
        isConfirm: false,
        isNewTab: false
    });
}
Box3Entity.prototype.isSetupedUser = false;
//Player Dialog
Box3Entity.prototype.dialogResult = null;
Box3Entity.prototype.currentDialogsNum = 0;
Box3Entity.prototype.dialogColor = {
    titleBackgroundColor: new Box3RGBAColor(0.8, 0.5, 0.3, 1),
    titleTextColor: new Box3RGBAColor(1, 1, 1, 1),
    contentBackgroundColor: new Box3RGBAColor(1, 1, 1, 1),
    contentTextColor: new Box3RGBAColor(0, 0, 0, 1)
};
Box3Entity.prototype.colorDialog = async function (prams) {
    if (!this.isPlayer) return;
    if (this.currentDialogsNum > 0) {
        return this.dialogResult = null;
    }
    this.currentDialogsNum += 1;
    this.player.invisible = !this.player.invisible;
    Object.assign(prams, this.dialogColor);
    this.dialogResult = await this.player.dialog(prams);
    this.player.invisible = !this.player.invisible;
    this.currentDialogsNum -= 1;
    return this.dialogResult;
}
Box3Entity.prototype.textDialog = async function (title, content) {
    return await this.colorDialog({
        type: "text",
        title: title,
        content: content,
    });
}
Box3Entity.prototype.selectDialog = async function (title, content, options) {
    return await this.colorDialog({
        type: "select",
        title: title,
        content: content,
        options: options.length > 0 ? options : void (0),
    });
}
Box3Entity.prototype.inputDialog = async function (title, content, placeholder, confirmText) {
    return await this.colorDialog({
        type: "input",
        title: title,
        content: content,
        placeholder: placeholder,
        confirmText: confirmText
    });
}
Box3Entity.prototype.text = async function (title, content) {
    if (String(content).length < 50 && !this.enableShortTextDialog) {
        return this.player.directMessage(concat(title, endline, content));
    }
    return await this.textDialog(...arguments);
}
Box3Entity.prototype.getInput = async function (title, content, confirmText, checkFunc, warnText = "输入内容不合法，请按提示输入正确内容") {
    await this.inputDialog(title, content, void (0), confirmText);
    if (!this.dialogResult) return;
    const result = checkFunc(this.dialogResult);
    if (!result) {
        await this.text("输入不合法", warnText);
    } else {
        return this.dialogResult;
    }
    return this.getInput(...arguments);
}
Box3Entity.prototype.loopMenu = async function (params) {
    const presentParams = params();
    const title = presentParams[0];
    const content = presentParams[1];
    const options = presentParams[2];
    await this.selectDialog(title, content, Object.keys(options));
    if (!this.dialogResult) return;
    const value = this.dialogResult.value;
    const func = options[this.dialogResult.value];
    const type = getTypeof(func);
    if (type.includes("Function")) {
        await options[value](value);
    } else if (type === "String") {
        await this[func](value);
    }
    return await this.loopMenu(...arguments);
}
//Player Notice
var Notice = class {
    constructor(value, sender = "系统") {
        this.time = Date.now();
        this.value = value;
        this.sender = sender;
    }
    static stringify (notice) {
        const time = new Date(notice.time);
        return concat(
            space, time.toChineseLocaleString(), space, notice.sender, endline,
            notice.value, endline
        );
    }
    static view = function (value, max = 500) {
        let result = "";
        if (value.length > max) {
            value.splice(max);
        }
        for (const n of value) {
            result += Notice.stringify(n);
        }
        result = result.slice(0, -1);
        return result;
    }
}
Box3Entity.prototype.sendNotice = function (value, sender, needRead = true) {
    if (!this.isPlayer) return;
    const r = new Notice(value, sender);
    this.historyNotices.unshift(r);
    if (needRead) {
        this.unreadNotices.unshift(r);
        this.player.directMessage("您收到一条消息");
    }
}
Box3Entity.prototype.readNotices = function () {
    if (!this.isPlayer) return;
    let result = Notice.view(this.unreadNotices);
    this.unreadNotices = [];
    if (!result) {
        result = "您没有未读消息";
    }
    return result;
}
Box3Entity.prototype.viewHistoryNotices = function () {
    if (!this.isPlayer) return;
    return Notice.view(this.historyNotices);
}
//Player Camera
var CameraModes = {
    "第一人称": {
        setup: function (entity) {
            entity.player.cameraMode = "fps";
        }
    },
    "第三人称": {
        setup: function (entity) {
            entity.player.cameraMode = "follow";
        }
    },
    "第三人称自动": {
        setup: function (entity) {
            entity.player.cameraMode = "fixed";
            entity.player.cameraTarget.copy(entity.position);
            entity.player.cameraPosition.copy(entity.position.sub(entity.player.facingDirection.scale(100)).add(new Box3Vector3(0, 20, 0)));
        },
        refresh: function (entity) {
            const targetPos = entity.position.sub(
                entity.player.facingDirection.scale(entity.cameraDistance)
            ).add(
                new Box3Vector3(0, entity.cameraDistance / 3, 0)
            );
            if (targetPos.distance(entity.player.cameraPosition) > 1) {
                entity.player.cameraPosition.addEq(entity.player.cameraPosition.towards(targetPos).scale(0.05))
            }
            entity.player.cameraTarget.copy(entity.position);
        }
    }
}
Box3Entity.prototype.setCameraMode = function (mode) {
    if (!this.isPlayer) return;
    if (!CameraModes[mode]) return this.cameraMode = "第三人称";
    this.cameraMode = mode;
    if (CameraModes[mode].setup) {
        CameraModes[mode].setup(this);
    }
}
Box3Entity.prototype.refreshCamera = function () {
    if (!this.isPlayer) return;
    const refresh = CameraModes[this.cameraMode].refresh;
    if (!refresh) return;
    refresh(this);
}
//Player Control
Box3Entity.prototype.setForceRun = function (mode = true) {
    if (!this.isPlayer) return;
    if (mode) {
        Object.defineProperty(this.player, "walkSpeed", {
            get() {
                return this.runSpeed;
            }
        });
    } else {
        Object.defineProperty(this.player, "walkSpeed", {
            value: 0.22
        });
    }
    this.enableForceRun = mode;
}
//Player Item
var Items = {
    "积分": {
        description: "世界内的货币",
        cannotThrow: true
    },
    "测试物品": {
        description: "供开发者调试用的测试物品",
        wear: "测试",
        recipe: {
            "积分": 1
        },
        use(user) {
            user.changeItemNum("积分", 1);
        },
        reuseAble: true
    }
}
Box3Entity.prototype.changeItemNum = function (itemName, num = 1) {
    if (!this.isPlayer) return;
    if (!Items[itemName]) throw concat("无法调整不存在的物品的数量", space, itemName);
    if (!this.items[itemName]) {
        this.items[itemName] = num;
    } else if ((this.items[itemName] + num) <= 0) {
        delete this.items[itemName];
        if (Object.hasValue(this.wearing, itemName)) {
            delete this.wearing[Object.getKey(this.wearing, itemName)];
        }
    } else {
        this.items[itemName] += num;
    }
    return this.items[itemName];
}
Box3Entity.prototype.getAllItemssSize = function () {
    if (!this.isPlayer) return;
    return Object.reduce(
        this.items,
        (p, [k, v]) => p + v,
        0
    );
}
Box3Entity.prototype.itemsToArray = function () {
    if (!this.isPlayer) return;
    const result = Object.reduce(
        this.items,
        (previousValue, currentValue) =>
            previousValue.concat(concat(Object.getKey(this.wearing,currentValue[0]) ? "[已装备]" : "", currentValue[0], " × ", currentValue[1])),
        []
    );
    return result;
}
Box3Entity.prototype.getCanCraft = function () {
    if (!this.isPlayer) return;
    const canCraft =
        Object.reduce(
            Items,
            (p, [k, v]) => {
                if (
                    v.recipe
                    &&
                    Object.entries(v.recipe).every(
                        v => this.items[v[0]] >= v[1]
                    )
                ) {
                    p[k] = v.recipe;
                }
                return p;
            },
            {}
        );
    return canCraft;
}
Box3Entity.prototype.useItem = function (itemName) {
    if (!this.isPlayer) return;
    const reuseAble = Items[itemName].reuseAble;
    const useFunc = Items[itemName].use;
    if (!this.items[itemName] || !useFunc) throw concat("无法使用不存在或不能使用的物品", space, itemName);
    if (!reuseAble) {
        this.changeItemNum(itemName, -1);
    }
    return useFunc(this);
}
Box3Entity.prototype.setItemWearing = function (itemName, state) {
    if (!this.isPlayer) return;
    const wearType = Items[itemName].wear;
    if (!this.items[itemName] || !wearType) throw concat("无法穿戴或卸下不存在或不能穿戴的物品", space, itemName);
    switch (state) {
        case true:
            this.wearing[wearType] = itemName;
            break;
        case false:
            delete this.wearing[wearType];
            break;
    }
    return state;
}
Box3Entity.prototype.viewItems = async function () {
    if (!this.isPlayer) return;
    if (this.getAllItemssSize() === 0) {
        await this.text("我的物品(0)");
        return;
    }
    while (true) {
        const itemsArray = this.itemsToArray();
        const thingsNum = this.getAllItemssSize() - this.items["积分"];
        await this.selectDialog(
            concat("我的物品(", this.getAllItemssSize(), ")"),
            thingsNum > 100 ? "背包爆满了，建议将不要的物品卖出去" : "",
            itemsArray
        );
        if (!this.dialogResult) break;
        const selectValue = this.dialogResult.value;
        const itemName = selectValue.split(space)[0];
        if (itemName.startsWith("[已装备]")) {
            itemName = itemName.slice(5);
        }
        const itemInformation = Items[itemName];
        const description = itemInformation.description;
        let options = [];
        if (itemInformation.use) {
            options.push("使用");
        }
        if (itemInformation.wear) {
            if (Object.hasValue(this.wearing, itemName)) {
                options.push("卸下");
            } else {
                options.push("装备");
            }
        }
        if (!itemInformation.cannotThrow) {
            options.push("丢弃");
        }
        await this.selectDialog(
            selectValue,
            concat(
                description
            ),
            options
        );
        if (!this.dialogResult) continue;
        switch (this.dialogResult.value) {
            case "丢弃":
                await this.getInput(
                    "丢弃",
                    concat(
                        "您现在有",
                        this.items[itemName],
                        "件",
                        space,
                        itemName,
                        endline,
                        "您要丢弃几件？"
                    ),
                    "丢弃",
                    n => +n > 0 && +n <= this.items[itemName] && +n % 1 === 0
                );
                if (!this.dialogResult) continue;
                const throwNum = +this.dialogResult;
                this.changeItemNum(itemName, -throwNum);
                await this.text(
                    "丢弃",
                    concat(
                        "已丢弃",
                        throwNum,
                        "件",
                        space,
                        itemName
                    )
                );
                break;
            case "使用":
                this.useItem(itemName);
                break;
            case "装备":
                this.setItemWearing(itemName, true);
                break;
            case "卸下":
                this.setItemWearing(itemName, false);
                break;
        }
    }
}
Box3Entity.prototype.craft = async function () {
    while (true) {
        const canCraft = this.getCanCraft();
        if (Object.keys(canCraft).length === 0) {
            await this.text(
                "合成",
                "您没有可以合成的物品"
            );
            return;
        }
        const canCraftEntries = Object.entries(canCraft);
        const options = canCraftEntries.reduce(
            (previousValue, [key, value]) => {
                previousValue.push(concat(
                    key,
                    "(",
                    Object.reduce(
                        value,
                        (previousValue, [key, value]) =>
                            previousValue + concat(
                                key,
                                "×",
                                value,
                                ",",
                            ),
                        ""
                    ).slice(0, -1),
                    ")"
                ));
                return previousValue;
            },
            []
        );
        await this.selectDialog(
            "合成",
            concat(
                "当前物品:",
                space,
                this.itemsToArray().toString()
            ),
            options
        );
        if (!this.dialogResult) break;
        const index = this.dialogResult.index;
        const value = this.dialogResult.value;
        const choseRecipe = canCraftEntries[index];
        this.changeItemNum(choseRecipe[0], 1);
        Object.keys(choseRecipe[1]).forEach(k =>
            this.changeItemNum(k, -choseRecipe[1][k])
        );
        await this.text(
            "合成",
            concat(
                "已合成",
                endline,
                value
            )
        );
    }
}
//Player interact
Box3Entity.prototype.sendMessageToPlayer = async function (head = "发送私信", targetEntity) {
    if (!this.isPlayer) return;
    if (!targetEntity.isPlayer) throw "无法给非玩家实体发送私信";
    const targetName = targetEntity.player.name;
    await this.getInput(
        head,
        concat(
            "您正在向", space, targetName, space, "发送私信", endline,
            "消息不要过长"
        ),
        "发送",
        s => s.length < 100,
        "消息过长，无法发送"
    );
    if (!this.dialogResult) return;
    this.sendNotice(
        this.dialogResult,
        concat(
            "向", space, targetName, space, "发送私信"
        ),
        false
    );
    targetEntity.sendNotice(
        this.dialogResult,
        concat(
            this.player.name,
            space,
            "私信"
        )
    );
}
Box3Entity.prototype.giveItemToPlayer = async function (head = "赠送物品", targetEntity) {
    if (!this.isPlayer) return;
    if (!targetEntity.isPlayer) throw "无法给非玩家实体赠送物品";
    const targetName = targetEntity.player.name;
    await this.selectDialog(
        "赠送物品",
        "以下是您可以赠送的物品，您要赠送什么？",
        Object.keys(this.items)
    );
    if (!this.dialogResult) return;
    const itemName = this.dialogResult.value;
    await this.getInput(
        "赠送物品",
        concat(
            "您现在有", this.items[itemName], "件", space, itemName, endline,
            "您要给", space, targetName, space, "赠送几件？"
        ),
        "赠送",
        n =>
            +n > 0
            &&
            +n <= this.items[itemName] && +n % 1 === 0
    );
    if (!this.dialogResult) return;
    const giveNum = +this.dialogResult;
    this.changeItemNum(itemName, -giveNum);
    targetEntity.changeItemNum(itemName, giveNum);
    this.sendNotice(
        concat("向", space, targetName, space, "赠送了", giveNum, "件", space, itemName),
        void (0),
        false
    );
    targetEntity.sendNotice(
        concat("收到来自", space, this.player.name, space, "赠送的", giveNum, "件", space, itemName)
    );
}
Box3Entity.prototype.interactPlayer = async function (head = "与用户互动", targetEntity) {
    const target = targetEntity.player.name;
    await this.loopMenu(() => [
        head,
        concat(
            "对方用户名:",
            space,
            targetEntity.player.name,
            endline,
            "对方BoxId:",
            space,
            targetEntity.player.boxId
        ),
        {
            "发送私信": async () => await this.sendMessageToPlayer(head, targetEntity),
            "赠送物品": async () => await this.giveItemToPlayer(head, targetEntity)
        }
    ]);
}
Box3Entity.prototype.interactSearch = async function (head = "与其它用户互动") {
    while (1) {
        let names = world.filterEntity(e =>
            e.isSetupedUser
        ).reduce(
            (p, v) => {
                p.push(v.player.name);
                return p;
            },
            []
        );
        await this.selectDialog(
            head,
            "请选择您要互动的用户",
            names
        );
        if (!this.dialogResult) break;
        const target = this.dialogResult.value;
        await this.interactPlayer(concat("与", space, target, space, "互动"), world.findPlayer(target));
    }
}
Box3Entity.prototype.sendMail = async function (head = "离线留言") {
    while (true) {
        let searchResult;
        await this.getInput(
            head,
            "请输入您要发送留言的用户(必须已经来过这个地图)的昵称/BoxId关键字",
            "查找",
            s => {
                searchResult =
                    Object.entries(db.data.users).filter(
                        value =>
                            value[1].name.toLowerCase().includes(s.toLowerCase())
                            ||
                            value[1].boxId.toLowerCase().includes(s.toLowerCase())
                    ).reduce(
                        (p, v) => {
                            p[v[1].name] = v[0];
                            return p;
                        },
                        {}
                    );
                return Object.keys(searchResult).length > 0;
            },
            "未查找到此用户，请尝试更换关键词"
        );
        if (!this.dialogResult) break;
        while (true) {
            await this.selectDialog(
                "离线留言",
                "以下是查找结果，请选择您要留言的用户",
                Object.keys(searchResult)
            );
            if (!this.dialogResult) break;
            const target = this.dialogResult.value;
            await this.getInput(
                "发送留言",
                concat(
                    "您正在向离线用户",
                    space,
                    target,
                    space,
                    "发送留言",
                    endline,
                    "消息不要过长"
                ),
                "发送",
                s => s.length < 100,
                "消息过长，无法发送"
            );
            if (!this.dialogResult) break;
            const message = new Notice(
                this.dialogResult,
                concat(
                    this.player.name,
                    space,
                    "留言"
                )
            );
            db.data.users[searchResult[target]].unreadNotices.unshift(message);
            db.data.users[searchResult[target]].historyNotices.unshift(message);
            this.sendNotice(
                this.dialogResult,
                concat(
                    "向",
                    space,
                    target,
                    space,
                    "留言"
                ),
                false
            );
        }
    }
}
//Dev
Box3Entity.prototype.console = async function (head = "调试") {
    if (!world.isAdmin(this)) {
        await this.text(
            head,
            "请使用管理员权限登录再进行调试"
        );
        return;
    }
    await this.getInput(
        head,
        "请输入代码",
        "执行",
        c => true
    );
    if (!this.dialogResult) return;
    const result = debug(commend(this.dialogResult,this), this.player.name);
    await this.text(
        head,
        concat(
            "~>",
            space,
            this.dialogResult,
            endline,
            "<~",
            space,
            result
        )
    );
}
Box3Entity.prototype.developerOptions = async function (head = "开发者选项") {
    await this.loopMenu(() => [
        head,
        "这些选项仅供开发者使用",
        {
            "调试": "console"
        }
    ]);
}
//Player settings
Box3Entity.prototype.cannotSet = async function (head = "无法设置") {
    if (!this.isPlayer) return;
    await this.text(
        head,
        "请在关闭所有对话框后在点击右上角后弹出的菜单内设置此项"
    );
}
Box3Entity.prototype.cameraModeSettings = async function (head = "切换视角") {
    if (!this.isPlayer) return;
    await this.selectDialog(
        head,
        concat(
            "当前视角:",
            this.cameraMode
        ),
        Object.keys(CameraModes)
    );
    if (!this.dialogResult) return;
    this.setCameraMode(this.dialogResult.value);
}
Box3Entity.prototype.cameraDistanceSettings = async function (head = "调节视角距离") {
    let distance;
    await this.getInput(
        head,
        concat(
            "请输入3至20之间的整数",
            endline,
            "默认为10",
            endline,
            "视角距离只在第三人称视角生效"
        ),
        void (0),
        n => {
            distance = parseInt(n);
            return distance && distance >= 3 && distance <= 20;
        },
        "数据不符合条件"
    );
    if (!this.dialogResult) return;
    this.cameraDistance = distance;
}
Box3Entity.prototype.cameraSettings = async function (head = "视角设置") {
    if (!this.isPlayer) return;
    await this.loopMenu(() => [
        head,
        void (0),
        {
            "切换视角": "cameraModeSettings",
            "调节视角距离": "cameraDistanceSettings",
            "视角灵敏度设置": "cannotSet"
        }
    ]);
}
Box3Entity.prototype.dialogSettings = async function (head = "对话框颜色设置") {
    if (!this.isPlayer) return;
    await this.loopMenu(() => {
        let options = {};
        const forceRunTag = this.enableShortTextDialog ? "使用横幅展示短消息" : "使用对话框展示短消息";
        options[forceRunTag] = async () => this.enableShortTextDialog = !this.enableShortTextDialog;
        return [
            head,
            void (0),
            options
        ];
    });
}
Box3Entity.prototype.controlSettings = async function (head = "操控设置") {
    if (!this.isPlayer) return;
    await this.loopMenu(() => {
        let options = {};
        const forceRunTag = this.enableForceRun ? "关闭强制疾跑" : "开启强制疾跑";
        options[forceRunTag] = async () => this.setForceRun(!this.enableForceRun);
        return [
            head,
            void (0),
            options
        ];
    });
}
Box3Entity.prototype.settings = async function () {
    if (!this.isPlayer) return;
    await this.loopMenu(() => {
        let options = {};
        options["对话框设置"] = "dialogSettings";
        options["视角设置"] = "cameraSettings";
        options["操控设置"] = "controlSettings";
        options["个人数据查看与管理"] = async (head) => {
            await this.loopMenu(() => [
                head,
                stringify(db.getData(this)),
                {
                    "删除个人数据": async () => {
                        this.refresh();
                        await sleep(1000);
                        delete db.data.users[this.player.userKey];
                    }
                }
            ]);
        }
        options["开发者选项"] = "developerOptions";
        return [
            "设置",
            concat(
                "用户名:",
                space,
                this.player.name,
                endline,
                "boxId:",
                space,
                this.player.boxId,
                endline,
                "userKey:",
                space,
                this.player.userKey
            ),
            options
        ]
    });
}
//Player menu
Box3Entity.prototype.menu = async function () {
    await this.loopMenu(() => {
        let options = {};
        const itemsTag = concat("我的物品(", this.getAllItemssSize(), ")");
        options[itemsTag] = "viewItems";
        options["合成"] = "craft";
        options["在线互动"] = "interactSearch";
        options["离线留言"] = "sendMail";
        options["历史消息"] = async (head) => {
            await this.textDialog(
                head,
                this.viewHistoryNotices()
            );
        }
        options["设置"] = "settings";
        return [
            "主菜单",
            concat(
                this.readNotices(),
                endline,
                "-以上是未读消息-",
                endline,
                "装备:[",
                Object.values(this.wearing),
                "]"
            ),
            options
        ]
    });
}
//Player welcome
Box3Entity.prototype.welcome = async function () {
    if (!this.isPlayer) return;
    if (this.loginCount < 2) {
        await this.text(
            "新手引导",
            concat(
                "欢迎来到 ",
                world.projectName
            )
        );
    }
    if (
        new Date(this.lastLogin).toLocaleDateString("zh-CN", { timeZone: "Asia/Shanghai" })
        !=
        new Date().toLocaleDateString("zh-CN", { timeZone: "Asia/Shanghai" })
    ) {
        this.changeItemNum("积分", 1);
        this.lastLogin = Date.now();
        await this.text(
            "每日签到",
            concat(
                "签到成功",
                endline,
                "获得",
                1,
                "积分"
            )
        );
    }
    if (this.unreadNotices.length > 0) {
        await this.text(
            "离线消息",
            this.readNotices()
        );
    }
}
//Event
var onChatFunction = async function ({ entity, message }) {
    if (world.isAdmin(entity) && message[0] === "/") {
        commend(message.slice(1), entity);
    }
    world.filterEntity(e => e.isSetupedUser === true).forEach(e => {
        e.sendNotice(message, entity.player.name, false);
    });
}
var onPlayerJoinFunction = async function ({ entity }) {
    if (!entity.player.userKey) {
        entity.player.kick();
        return;
    }
    const cmd = entity.player.url.searchParams.get("c");
    if (world.isAdmin(entity) && cmd) {
        commend(cmd, entity);
    }
    await db.setupUser(entity);
    entity.sendNotice(
        concat(
            "进入地图 ",
            " 进入次数:",
            entity.loginCount,
            " 权限:",
            world.isAdmin(entity) ? "管理员" : "普通用户"
        ),
        void (0),
        false
    );
    entity.loginCount += 1;
    world.filterEntity(e => e.isSetupedUser === true).forEach(e => {
        e.sendNotice(concat(entity.player.name, " 进入了地图"), void (0), false);
    });
    await entity.welcome();
}
var onPlayerLeaveFunction = async function ({ entity }) {
    entity.lastLogout = Date.now();
    entity.sendNotice("离开地图", void (0), false);
    world.filterEntity(e => e.isSetupedUser === true).forEach(e => {
        e.sendNotice(concat(entity.player.name, " 离开了地图"), void (0), false);
    });
}
var onPressFunction = async function ({ entity, button }) {
    if (!entity.isSetupedUser) return;
    if (entity.player.action1Button&&entity.player.crouchButton) {
        await entity.menu();
    }else if (button === "action0") {
        entity.player.enableAction0 = false;
        sleep(500).then(() => entity.player.enableAction0 = true);
    }
}
var onInteractFunction = async function ({ entity, targetEntity }) {

}
var onEntityContactFunction = async function ({ entity, other }) {

}
var onVoxelContactFunction = async function ({ entity, voxel, x, y, z }) {

}
var onTickFunction = async function ({ tick, elapsedTimeMS }) {
    world.runningMS += elapsedTimeMS - 1;
    if (tick % 32 === 0 && db.ready) {
        await db.update();
    }
    world.filterEntity(
        e => e.isSetupedUser
    ).forEach(entity => {
        entity.refreshCamera();
    });
}
//Setup
var setupEntities = async function () {
    world.filterEntity(e => e.tags().some(v => v.startsWith("?"))).forEach(e => {
        e.tags().filter(v => v.startsWith("?")).forEach(v => {
            e[
                v.split(":")[0]
            ] = eval(v.split(":")[1]);
            e.removeTag(v);
        });
    });
}
//Main loop
var main = async function () {
    await sleep(1000);
}
//Db
db.data = {
    users: {},
    system: {
        patches: []

    }
}
db.ready = false;
db.start = async function () {
    await db.sql`CREATE TABLE IF NOT EXISTS "yswlab" ("name" TINYTEXT PRIMARY KEY UNIQUE NOT NULL,"value" MEDIUMTEXT)`;
    const data = (await db.sql`SELECT * FROM "yswlab"`)[0];
    if (!data) {
        await db.update();
    } else {
        const dataValue = JSON.parse(data.value);
        for (const value in db.data.system) {
            if (dataValue.system[value]) {
                db.data.system[value] = dataValue.system[value];
            }
        }
        for (const userKey in dataValue.users) {
            for (const key in UserDefaultData) {
                if (getTypeof(UserDefaultData[key]) != getTypeof(dataValue.users[userKey][key])) {
                    dataValue.users[userKey][key] = UserDefaultData[key];
                }
            }
        }
        db.data.users = dataValue.users;
    }
    db.ready = true;
}
db.update = async function () {
    const data = JSON.stringify(db.data);
    await db.sql`INSERT INTO yswlab(name,value)VALUES("main",${data})ON CONFLICT(name)DO UPDATE SET name=excluded.name,value=excluded.value`;
}
var UserDefaultData = {
    name: "",
    boxId: "",
    items: {},
    wearing: {},
    unreadNotices: [],
    historyNotices: [],
    loginCount: 0,
    lastLogin: 0,
    lastLogout: 0,
    enableForceRun: false,
    cameraMode: "第三人称",
    cameraDistance: 10,
    enableShortTextDialog: true
};
Object.freeze(UserDefaultData);
Object.assign(Box3Entity.prototype, deepClone(UserDefaultData));
db.getData = function (user) {
    return db.data.users[user.player.userKey];
}
db.setupUser = async function (user) {
    await sleepWhile(() => !db.ready);
    const data = db.getData(user);
    if (!data) {
        db.data.users[user.player.userKey] = deepClone(UserDefaultData);
    }
    Object.keys(UserDefaultData).forEach(k => {
        Object.defineProperty(user, k, {
            get() {
                return db.data.users[user.player.userKey][k]
            },
            set(v) {
                return db.data.users[user.player.userKey][k] = v;
            },
            enumerable: true
        });
    });
    Object.defineProperty(user.player, "cameraDistance", {
        get() {
            return user.cameraDistance;
        },
        enumerable:true
    });
    user.name = user.player.name;
    user.boxId = user.player.boxId;
    user.setForceRun(user.enableForceRun);
    user.setCameraMode(user.cameraMode);
    user.isSetupedUser = true;
}
//Run
var start = function () {
    db.start().catch(error);
    setupEntities().catch(error);
    main().catch(error);
    var onChat = world.onChat(p => onChatFunction(p).catch(error));
    var onPlayerJoin = world.onPlayerJoin(p => onPlayerJoinFunction(p).catch(error));
    var onPlayerLeave = world.onPlayerLeave(p => onPlayerLeaveFunction(p).catch(error));
    var onPress = world.onPress(p => onPressFunction(p).catch(error));
    var onInteract = world.onInteract(p => onInteractFunction(p).catch(error));
    var onEntityContact = world.onEntityContact(p => onEntityContactFunction(p).catch(error));
    var onVoxelContact = world.onVoxelContact(p => onVoxelContactFunction(p).catch(error));
    var onTick = world.onTick(p => onTickFunction(p).catch(error));
}
runPatches().catch(error);
sleep(100).then(start);
//请勿删除最后一行