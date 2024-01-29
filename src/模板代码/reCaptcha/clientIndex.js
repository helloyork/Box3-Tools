
function log(t){
    remoteChannel.sendServerEvent({type: "log", data: t});
}



const { parse, render, GUIAnimation, createUiNodeWrapper, RemoteClientWrapper } = load();


const UiNodeWrapper = createUiNodeWrapper();
UiNodeWrapper.prototype.off = function (type, listener) { this.node.events.off(type, listener) };
const Animation = GUIAnimation();
const uiWrapper = new UiNodeWrapper(ui);




// reCaptcha小组件
let createFrame = (...args) => {
    return parse(`
<box height=400 width=400 id="rc-frame" bc="#000">
    <box id="rc-head" height=100 width=400 bc="#fff">
        <text id="rc-head-text">${args[0]}</text>
    </box>
    <box id="rc-body" x=110>
        ${args[1].join("\n")}
    </box>
    <box id="rc-confirm" height=80 width=150>
        <text>确认</text>
    </box>
</box>`);
};

function reCaptcha(uiWrapper, title, sources, callback) {
    function arrangeGridImages(imageSize) {
        const grid = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
        return grid.map(([x, y]) => {
            return { x: x * imageSize, y: y * imageSize };
        });
    }
    let grid = arrangeGridImages(50);
    render(ui, createFrame(title, sources.map((v, i) => {
        return `<img src="${v}" height=50 width=50 id="${v}" x=${grid[i].x} y=${grid[i].y} z-index=5/>`;
    })));
    let imgs = sources.map(v => uiWrapper.findChildByName(v)), confirmButton = uiWrapper.findChildByName("rc-confirm"),
        selected = {}, events = [];
    if (!imgs || !Array.isArray(imgs) || imgs.length !== 9) throw new Error("啊这，为什么找不到我刚创建的body了嘞？");
    imgs.forEach(v => {
        let f = () => {
            if (selected[v.node.name]) {
                selected[v.node.name] = false;
                v.config("scale", 1);
            } else {
                selected[v.node.name] = true;
                v.config("scale", 1.1);
            }
        };
        events.push([v, f]);
        v.eventOn("pointerdown", f);
    });
    confirmButton.eventOnce("pointerdown", () => {
        callback(Object.keys(selected).filter(v => selected[v]));
        events.forEach(([v, f]) => v.off("pointerdown", f));
    });
}

reCaptcha(uiWrapper, "选择下图中全部的红绿灯", 
    new Array(9).fill("https://www.bing.com/th?id=OPN.RTNews__HoUg5kTNfRKnQJy41fMJA&w=186&h=88&c=7&rs=2&qlt=80&pid=PopNow"),
    (selected) => {
        console.log(selected);
    }
)



function load() {
    const TokenTypes = {
        OPERATOR: "operator",
        STRING: "string",
        TEXT: "text"
    }
    const AtomTypes = {
        NODE: "node",
        ATTRIBUTES: "attributes",
        TEXT: "text",
        FUNCTION: "function"
    }

    function lexer(input) {
        const tokens = [];
        let current = 0;
        function flowText() { let char = input[current], value = []; while (/[^"<>&\x00-\x1F\x7F/=(), ]|\r?\n/i.test(char)) { value.push(char); char = input[++current]; } return value.join(""); }
        function flowString() { let char = input[current], value = []; while (char !== "\"") { if (input[current] === undefined) { throw new SyntaxError(`双引号没有被闭合`); } value.push(char); char = input[++current]; } if (input[current] === "\"") { current++; } return value.join(""); }
        function lText(length) { let value = []; for (let i = 0; i < length; i++) { value.push(input[current + i]); } return value.join(""); }
        while (current < input.length) {
            let char = input[current];
            if (/\s/.test(char)) { current++; continue; }
            if (char === "<" && [1, 2, 3].map(v => input[current + v]).join("") === "!--") { current += 4; while (lText(2) !== "--" && input[current + 2] === ">") { current++; } current += 3; continue; }
            if (["<", ">", "=", "/", "(", ",", ")"].includes(char)) { tokens.push({ type: TokenTypes.OPERATOR, value: char }); current++; continue; }
            if (char === "\"") { current++; tokens.push({ type: TokenTypes.STRING, value: flowString() }); continue; }
            if (/[^"<>&\x00-\x1F\x7F/= ]|\r?\n/i.test(char)) { tokens.push({ type: TokenTypes.TEXT, value: flowText() }); continue; }
            if (char === "&") { let parseMap = { "&amp": "&", "&lt": "<", "&gt": ">", "&quot": "\"" }; let l = Object.keys(parseMap).find(v => lText(v.length) === v); if (l) { current += l.length; tokens.push({ type: TokenTypes.TEXT, value: parseMap[l] }); continue; } }
            throw new SyntaxError(`无效或意外的字符: ${char}`);
        }
        return tokens;
    }

    function parser(tokens) {
        let current = 0;
        function wrapNode(arg = {}) { let res = { type: "", tag: "", value: null, attributes: {}, children: [], args: [] }; Object.assign(res, arg); return res; }
        function is(token, type, value) { return token.type === type && token.value === value; }
        function walk({ parent, expected }) {
            let token = tokens[current];
            if (is(token, TokenTypes.OPERATOR, "<")) { current++; let node = wrapNode(); if (is(tokens[current], TokenTypes.OPERATOR, "/")) { current++; if (tokens[current]?.type === TokenTypes.TEXT) { node.tag = tokens[current++].value; node.type = AtomTypes.NODE; } else { throw new SyntaxError(`预期应该是标签名，实际得到: ${tokens[current]?.value}`); } if (is(tokens[current], TokenTypes.OPERATOR, ">")) { current++; return node; } else { throw new SyntaxError(`你应该闭合标签`) } } if (tokens[current]?.type === TokenTypes.TEXT) { node.tag = tokens[current++].value; node.type = AtomTypes.NODE; } else { throw new SyntaxError(`预期应该是标签名，实际得到: ${tokens[current]?.value}`); } if (is(tokens[current], TokenTypes.OPERATOR, "/" && is(tokens[current + 1], TokenTypes.OPERATOR, "/"))) { current += 2; return node; } if (!is(tokens[current], TokenTypes.OPERATOR, ">")) { while (tokens[current].type === TokenTypes.TEXT) { let attr = walk({ expected: AtomTypes.ATTRIBUTES }); if (attr && attr.type === AtomTypes.ATTRIBUTES) { node.attributes[attr.attributes[0]] = attr.attributes[1]; } else if (attr && attr.type === AtomTypes.FUNCTION) { node.attributes[attr.attributes[0]] = attr } } if (is(tokens[current], TokenTypes.OPERATOR, "/") && is(tokens[current + 1], TokenTypes.OPERATOR, ">")) { current += 2; return node; } } if (is(tokens[current], TokenTypes.OPERATOR, ">")) { current++; while (!is(tokens[current], TokenTypes.OPERATOR, "<") || (!is(tokens[current + 1], TokenTypes.OPERATOR, "/")) || (!is(tokens[current + 2], TokenTypes.TEXT, node.tag))) { if (tokens[current] === undefined) { throw new SyntaxError(`严格来讲你应该闭合标签，但实际没有`); } let res = walk({ parent: node }); if (res.type === AtomTypes.TEXT) { if (node.attributes.textContent === undefined) node.attributes.textContent = ""; node.attributes.textContent = node.attributes.textContent + res.value; } else if (res.type === AtomTypes.NODE) { node.children.push(res); } } if (is(tokens[current + 3], TokenTypes.OPERATOR, ">")) { current += 4; return node; } else { throw new SyntaxError(`没有闭合的标签`); } } throw new SyntaxError(`意料之外的行为：${JSON.stringify(tokens[current])}`); }
            if (token.type === TokenTypes.TEXT) {
                let node = wrapNode();
                current++;
                if (is(tokens[current], TokenTypes.OPERATOR, "=")) {
                    node.attributes[0] = token.value; current++; if (tokens[current]?.type === TokenTypes.TEXT && is(tokens[current + 1], TokenTypes.OPERATOR, "(")) { node.type = AtomTypes.FUNCTION; node.value = tokens[current].value; current += 2; let args = []; while (!is(tokens[current], TokenTypes.OPERATOR, ")")) { if (tokens[current] === undefined) throw new SyntaxError(`未闭合的括号`); if (tokens[current].type !== TokenTypes.OPERATOR) { args.push(tokens[current]); current++; } else { throw new SyntaxError(`意外的值: ${JSON.stringify(tokens[current])}`); } if (is(tokens[current], TokenTypes.OPERATOR, ",")) { current++; } else if (is(tokens[current], TokenTypes.OPERATOR, ")")) { break; } } current++; node.args = args; return node; } node.type = AtomTypes.ATTRIBUTES; if (tokens[current]?.type !== TokenTypes.STRING && tokens[current]?.type !== TokenTypes.TEXT) throw new SyntaxError(`预期应该是字段值，实际得到${tokens[current]?.value}`); node.attributes[1] = tokens[current].value; current++; return node;
                } else if (expected === AtomTypes.ATTRIBUTES) {
                    node.type = AtomTypes.ATTRIBUTES; node.attributes[0] = token.value; return node;
                } else { node.type = AtomTypes.TEXT; node.value = token.value; return node; }
            }

            throw new SyntaxError(`预期之外的Token: ${JSON.stringify(token)}`);
        }

        let body = wrapNode({
            type: AtomTypes.NODE,
            tag: "body",
        });
        while (current < tokens.length) {
            let node = walk({ parent: body });
            if (node) body.children.push(node);
        }
        return body;
    }

    function render(ui, nodes) {
        const UiMap = { "box": UiBox, "text": UiText, "img": UiImage };
        const functions = { "rgb": (r, g, b) => (Vec3.create({ r, g, b })) };
        function exec(parent, node) {
            if (node === null) return null;
            if (node.type === AtomTypes.FUNCTION) {
                return functions[node.value]?.(...node.args.map(a => (Number(a.value) == a.value) ? parseFloat(a.value) : a.value))
            } else if (node.type === AtomTypes.NODE) {
                if (node.tag === "body") {
                    node.children.forEach(e => exec(ui, e)); return null;
                }
                let uinode = UiMap[node.tag].create();
                if (parent) uinode.parent = parent;
                Object.keys(node.attributes).forEach(k => {
                    let attr = node.attributes[k];
                    switch (k) {
                        case "x": uinode.position.offset.copy({ x: attr, y: uinode.position.offset.y }); break; case "y": uinode.position.offset.copy({ x: uinode.position.offset.x, y: attr }); break; case "height": case "h": uinode.size.offset.copy({ x: uinode.size.offset.x, y: attr }); break; case "width": case "w": uinode.size.offset.copy({ x: attr, y: uinode.size.offset.y }); break; case "name": case "id": uinode.name = attr; break; case "scale": case "resize": uinode.uiScale.scale = attr; break; case "backgroundOpacity": case "background-opacity": if (attr.endsWith("%")) attr = parseFloat(attr.slice(0, attr.length - 1)) / 100; uinode.backgroundOpacity = parseFloat(attr); break; case "zIndex": case "z-index": case "z-Index": uinode.zIndex = parseInt(attr); break; case "autoResize": case "auto-resize": uinode.autoResize = attr; break; case "visible": uinode.visible = attr === "false" ? false : (attr === "true" ? true : false); break; case "textContent": case "text": case "text-content": uinode.textContent = attr; break; case "textFontSize": case "text-font-size": case "font-size": case "text-size": uinode.textFontSize = parseFloat(attr); break; case "textXAlignment": case "text-align-x": case "textXAlign": uinode.textXAlignment = attr; break; case "textYAlignment": case "text-align-y": case "textYAlign": uinode.textYAlignment = attr; break; case "image": case "src": case "image-src": uinode.image = attr; break; case "imageOpacity": case "opacity": case "img-oct": if (attr.endsWith("%")) attr = parseFloat(attr.slice(0, attr.length - 1)) / 100; uinode.imageOpacity = parseFloat(attr); break; case "backgroundColor": case "background-color": case "bc": if (attr && attr.type === AtomTypes.FUNCTION) uinode.backgroundColor.copy(exec(parent, attr)); else uinode.backgroundColor.copy(attr); break; case "textColor": case "text-color": case "color": case "tc": if (attr && attr.type === AtomTypes.FUNCTION) uinode.textColor.copy(exec(parent, attr)); else uinode.textColor.copy(attr); break;
                    }
                })
                node.children.forEach(e => exec(ui, e));
                return null;
            }
        }
        exec(ui, nodes);
    }
    function GUIAnimation({ interval = 1, easeFunctions } = {}) { let animations = [], time = 0; let timer = setInterval(() => { time++; animations.filter(a => ((time - a.startTime) % a.delay === 0)).forEach(v => { if (time - v.startTime >= v.time) { animations = animations.filter(t => t !== v); v.stop(); } else v.animate(time); }); }, interval); class Animation { static easing = { easeInSine: (x) => (1 - Math.cos((x * Math.PI) / 2)), easeOutSine: (x) => (Math.sin((x * Math.PI) / 2)), easeInOutSine: (x) => (-(Math.cos(Math.PI * x) - 1) / 2) }; static stop() { clearInterval(timer); }; constructor(config) { let def = { easingFunction: (x) => x, begin: 0, end: 1, time: 1000, delay: 10 }; Object.keys(def).forEach(k => this[k] = config[k] ? config[k] : def[k]); this._onStop = []; this._onStart = []; this.current = 0; this.pending = false; }; start(trigger) { if (!this.pending) { this.pending = true; this.startTime = time; this.trigger = trigger; this.current = 0; animations.push(this); this._onStart.forEach(v => v(this)); } }; animate() { this.current += this.delay; this.trigger(this.begin + (this.end - this.begin) * this.easingFunction(this.current / this.time)); }; stop() { this.pending = false; this._onStop.forEach(v => v(this)); }; onStop(f) { this._onStop.push(f); return { cancel: () => this._onStop = this._onStop.filter(v => v !== f) } }; onStart(f) { this._onStart.push(f); return { cancel: () => this._onStart = this._onStart.filter(v => v !== f) } }; }; if (easeFunctions) Object.assign(Animation.easing, easeFunctions); return Animation; }
    let uiNodeWrapperIsCreated = false
    function createUiNodeWrapper() {
        if (uiNodeWrapperIsCreated) throw new Error("请勿重复执行 createUiNodeWrapper 函数！");
        uiNodeWrapperIsCreated = true;
        // 作者：七式草莓
        // 如果需要使用 UiWrapper，请勿删除或修改任何注释！
        const UiNode = ui.constructor;
        class UiNodeWrapper {
            constructor(node) {
                if (!(node instanceof UiNode)) throw new Error("参数 node 类型必须为 UiNode（或其子类）");
                this.node = node;
                if (UiNodeWrapper.nodes.has(this)) throw new Error("请勿重复创建 UiNodeWrapper（出现此错误的常见原因：修改了内部代码，或使用了通过 constructor 属性获取的构造函数创建 UiNodeWrapper）");
                UiNodeWrapper.nodes.set(node, this);
            };
            static version = "1.1.0";
            static createCoord2(offset, scale) {
                let coord2 = Coord2.create();
                if (offset) coord2.offset.copy(offset);
                if (scale) coord2.scale.copy(scale);
                return coord2
            };
            static createNode(nodeClass) {
                if (!nodeClass || !nodeClass.create) throw new Error("createNode: nodeClass 必须是一个有效的可创建UI节点的构造函数");
                return this.get(nodeClass.create());
            };
            static nodes = new WeakMap();
            static get(node) {
                if (!node) return null;
                if (UiNodeWrapper.nodes.has(node)) return UiNodeWrapper.nodes.get(node);
                return new UiNodeWrapper(node);
            };
            static getUiNode(node) {
                if (node instanceof UiNode) return node;
                if (node instanceof UiNodeWrapper) return node.node;
                throw new Error("在需要传递节点的参数中传递了不是节点的对象！");
            };
            get children() {
                return Array.from(this.node.children).map((node) => UiNodeWrapper.get(node));
            };
            get parent() {
                if (!this.node.parent) return null;
                return UiNodeWrapper.get(this.node);
            };
            set parent(node) {
                if (!node) {
                    this.node.parent = void 0;
                    return;
                }
                this.node.parent = UiNodeWrapper.getUiNode(node);
            }
            get displayed() {
                let currentNode = this.node
                while (currentNode !== ui && currentNode.parent) currentNode = currentNode.parent;
                return currentNode === ui;
            };
            config(key, value, options = "offset") {
                if (["children", "events"].includes(key)) throw new Error(`nodeWrapper.config: 不能设置只读属性 ${key}`);
                if (typeof this.node[key] === "function") throw new Error(`nodeWrapper.config: 不能设置方法 ${key}`);
                let oldValue = this.node[key];
                if (oldValue instanceof Vec2 || oldValue instanceof Vec3) {
                    oldValue.copy(value);
                } else if (oldValue instanceof Coord2) {
                    if (options === "offset" || options === "all") oldValue.offset.copy(value.offset);
                    if (options === "scale" || options === "all") oldValue.scale.copy(value.scale);
                } else if (key === "uiScale" && typeof value === "number") {
                    let uiScale = UiScale.create();
                    uiScale.scale = value;
                    this.node[key] = uiScale;
                } else {
                    this.node[key] = value;
                }
                return this;
            };
            eventOn(type, listener) {
                this.node.events.on(type, listener);
            };
            createChildNode(nodeClass) {
                if (!nodeClass || !nodeClass.create) throw new Error("createChildNode: nodeClass 必须是一个有效的可创建UI节点的构造函数");
                let node = nodeClass.create();
                node.parent = this.node;
                return UiNodeWrapper.get(node);
            };
            eventOnce(type, listener) {
                this.node.events.once(type, listener);
            };
            appendChild(...childrenNode) {
                childrenNode.forEach((node) => {
                    if (!node) return;
                    node.node.parent = UiNodeWrapper.getUiNode(this.node);
                });
            };
            replaceChild(targetChild, newChild) {
                let targetChildNode = UiNodeWrapper.getUiNode(targetChild);
                let newChildNode = void 0;
                if (newChild) newChildNode = UiNodeWrapper.getUiNode(newChild);
                if (targetChildNode.parent === this.node) targetChildNode.parent = void 0;
                if (newChildNode) newChildNode.parent = this;
            };
            removeChild(...childrenNode) {
                childrenNode.forEach((node) => {
                    if (!node) return;
                    let targetChildNode = UiNodeWrapper.getUiNode(node);
                    if (targetChildNode.parent === this.node) targetChildNode.parent = void 0;
                })
            };
            contains(target) {
                let targetNode = UiNodeWrapper.get(target);
                let currentNode = targetNode;
                while (currentNode !== this.node && currentNode.parent) currentNode = currentNode.parent;
                return currentNode === this.node;
            };
            findChildByName(name) {
                let result = this.node.children.reduce(function search(result, child) {
                    if (result) return result;
                    if (child.name === name) return child;
                    return child.children.reduce(search, result);
                }, null);
                if (!result) return null;
                return UiNodeWrapper.get(result);
            };
            clone() {
                return UiNodeWrapper.get(this.node.clone());
            };
        };
        return new Proxy(UiNodeWrapper, {
            construct(target, argArray, newTarget) {
                if (argArray[0] instanceof UiNodeWrapper) return UiNodeWrapper;
                if (argArray.length <= 0 || !(argArray[0] instanceof UiNode)) throw new Error("创建 UiNodeWrapper 时需要一个参数 node，并且类型为 UiNode");
                if (target.nodes.has(argArray[0])) return target.nodes.get(argArray[0]);
                return Reflect.construct(target, argArray, newTarget);
            }
        });
    }
    function RemoteClientWrapper(port) { let events = [], seed = 2024, dport = port || 6000, random = () => (seed = (seed * 9301 + 49297) % 233280, parseInt(seed / 233280.0 * 1000000)); function wrap(type, data, id, port = dport) { return { type, data, id, port } } function send(data, id, type = "data") { remoteChannel.sendServerEvent(wrap(type, data, id)); return id; } function onMessage(type = "data", f) { events.push({ type, handler: f }); return { cancel() { events = events.filter(v => v.handler !== f); } } } function communicate(data, f) { events.push({ type: "communicate", handler: (arg) => { f(arg); events = events.filter(v => v.handler !== f); }, id: send(data, random(), "communicate") }); } remoteChannel.events.on("client", arg => { if (arg.type === "communicate") { events.filter(v => v.type === arg.type).forEach(f => { let res = f.handler(arg.data); if (res.then) res.then(r => send(r, arg.id)); else send(res, arg.id); }); } else if (arg.type === "data") { events.filter(v => v.type === arg.type).forEach(f => f.handler(arg.data)); } }); return { send, onMessage, communicate } }
    return {
        parse: (i) => parser(lexer(i)),
        render,
        GUIAnimation,
        createUiNodeWrapper,
        RemoteClientWrapper
    }
}
