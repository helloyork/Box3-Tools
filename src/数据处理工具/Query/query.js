/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable indent */

function Query() {
    function tokenize(selector) {
        const regex = /([.#]?[\w-]+|\*|>|\[.+?\])|\s+/g;
        const tokens = [];
        let match;
        while ((match = regex.exec(selector)) !== null) {
            const token = match[0];
            if (token === ">") {
                if (tokens.length > 0 && tokens[tokens.length - 1].type === "descendant") {
                    tokens.pop();
                }
                tokens.push({ type: "child" });
            } else if (token.trim() === "") {
                if (tokens.length > 0 && tokens[tokens.length - 1].type !== "descendant") {
                    tokens.push({ type: "descendant" });
                }
            } else if (token.startsWith(".")) {
                tokens.push({ type: "class", value: token.slice(1) });
            } else if (token.startsWith("#")) {
                tokens.push({ type: "id", value: token.slice(1) });
            } else if (token.startsWith("[")) {
                const attribute = token.slice(1, -1).split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g).map((attr) => {
                    const [key, value] = attr.split(/=(?=(?:[^"]*"[^"]*")*[^"]*$)/g);
                    return { key, value };
                });
                tokens.push({ type: "attribute", value: attribute });
            } else {
                tokens.push({ type: "tag", value: token });
            }
        }
        return tokens;
    }
    function parse(tokens) {
        let node = {
            type: "node",
            child: null,
            needDriectChild: false,
            filter: []
        };
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            if (["id", "class", "tag", "attribute"].includes(token.type)) {
                node.filter.push(token);
            } else if (token.type === "child") {
                node.needDriectChild = true;
            } else if (token.type === "descendant") {
                let child = parse(tokens.slice(i + 1));
                node.child = child;
                break;
            } else {
                throw new Error("Unknow token type");
            }
        }
        return node;
    }
    const root = ui;
    function filter(obj, filters) {
        let res = true;
        filters.forEach(v => {
            if (!res) return;
            if (v.type === "tag") {
                let r = {
                    "box": UiBox,
                    "text": UiText,
                    "image": UiImage
                };
                if (!(obj instanceof r[v.value])) {
                    res = false;
                }
            } else if (v.type === "id") {
                if (obj.name !== v.value) {
                    res = false;
                }
            } else if (v.type === "class") {
                if (!obj.classList?.includes(v.value)) {
                    res = false;
                }
            } else if (v.type === "attribute") {
                let attr = obj.attributes;
                if(attr) v.value.forEach(a => {
                    if (attr[a.key] !== a.value) {
                        res = false;
                    }
                });
            }
        });
        return res;
    }
    function querySelectorAll(selector) {
        let tree;
        if (typeof selector === "string") {
            tree = parse(tokenize(selector));
        } else {
            tree = selector;
        }
        let result = [];
        const traverseChildren = (node) => {
            if (node.children) {
                node.children.forEach(child => {
                    if (filter(child, tree.filter)) {
                        result.push(child);
                    }
                    traverseChildren(child);
                });
            }
        };
        traverseChildren(this);
        return result;
    }
    function querySelector(selector) {
        return this.querySelectorAll(selector)[0];
    }
    function _createClass(Ui) {
        return class __class_constructor__ {
            static create(...args) {
                const instance = new __class_constructor__(...args);
                return new Proxy(instance, {
                    get(target, prop, receiver) {
                        if (prop in target) return Reflect.get(target, prop, receiver);
                        else return Reflect.get(target.__node, prop, receiver);
                    },
                    set(target, prop, value, receiver) {
                        if (prop in target) return Reflect.set(target, prop, value, receiver);
                        else return Reflect.set(target.__node, prop, value, receiver);
                    }
                });
            }
            constructor(...args) {
                this.__node = Ui.create(...args);
                this._children = [];
            }
            get children() { return this._children; }
            set parent(p) { this.__node.parent = p.__node || p; p._children?.push(this); }
            get parent() { return this.__node.parent; }
            querySelectorAll(selector) { return querySelectorAll.call(this, selector); }
            querySelector(selector) { return querySelector.call(this, selector); }
        };
    }
    const __UiBox = _createClass(UiBox);
    const __UiText = _createClass(UiText);
    const __UiImage = _createClass(UiImage);
    (function _init(parent = root) {
        parent.querySelectorAll = querySelectorAll.bind(parent);
        parent.querySelector = querySelector.bind(parent);
        parent.children.forEach(child => _init(child));
    })();
    return {
        querySelectorAll,
        querySelector,
        UiBox: __UiBox,
        UiText: __UiText,
        UiImage: __UiImage
    };
}
