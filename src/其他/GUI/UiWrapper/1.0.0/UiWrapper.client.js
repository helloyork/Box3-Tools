

// 创建 UiWrapper 代码
// 这两行代码必须放在最顶部！
const UiNodeWrapper = createUiNodeWrapper();
const uiWrapper = new UiNodeWrapper(ui);



// UiWrapper 核心代码
// 下述代码可以放在最后
let uiNodeWrapperIsCreated = false
/**
 * @template NodeType
 * @typedef {NodeType["events"] extends EventEmitter<infer EventMap> ? EventMap : any} EventMap
 */
/**
 * @returns {typeof UiNodeWrapper}
 */
function createUiNodeWrapper() {
    // 作者：七式草莓
    // 如果需要使用 UiWrapper，请勿删除或修改任何注释！
    // 如果你需要去除 JSDoc 以减小体积，可以下载七式草莓提供的 UiWrapper.client.min.js
    const UiNode = ui.constructor;
    /**
     * @template NodeType
     */
    class UiNodeWrapper {
        /**
         * @param {NodeType} node
         */
        constructor(node) {
            if (!(node instanceof UiNode)) throw new Error("参数 node 类型必须为 UiNode（或其子类）");
            /**
             * 原始节点对象
             * @type {NodeType}
             */
            this.node = node;
            if (UiNodeWrapper.nodes.has(this)) throw new Error("请勿重复创建 UiNodeWrapper（出现此错误的常见原因：修改了内部代码，或使用了通过 constructor 属性获取的构造函数创建 UiNodeWrapper）");
            UiNodeWrapper.nodes.set(node, this);
        };
        /**
         * UiWrapper 的版本号
         * @type {"1.0.0"}
         */
        static version = "1.0.0";
        /**
         * 根据 offset 和 scale 创建 Coord2
         * @param {Vec2 | null} [offset]
         * @param {Vec2 | null} [scale]
         */
        static createCoord2(offset, scale) {
            let coord2 = Coord2.create();
            if (offset) coord2.offset.copy(offset);
            if (scale) coord2.scale.copy(scale);
            return coord2
        };
        /**
         * 创建节点
         * @template NodeType
         * @param {{ create(): NodeType }} nodeClass
         * @returns {UiNodeWrapper<NodeType>}
         */
        static createNode(nodeClass) {
            if (!nodeClass || !nodeClass.create) throw new Error("createNode: nodeConstructor 必须是一个有效的可创建UI节点的构造函数");
            return this.get(nodeClass.create());
        };
        /**
         * 节点对应的打包器，如无必要请勿修改
         * @type {WeakMap<UiNode, UiNodeWrapper<UiNode>>}
         */
        static nodes = new WeakMap();
        /**
         * 获取节点打包器，用来提供内部实现。如果需要创建节点打包器，直接使用 new UiNodeWrapper(node) 即可。如果传入无效对象，将会返回 null
         * @template NodeType
         * @param {NodeType | null} node
         * @returns {UiNodeWrapper<NodeType> | null}
         */
        static get(node) {
            if (!node) return null;
            if (UiNodeWrapper.nodes.has(node)) return UiNodeWrapper.nodes.get(node);
            return new UiNodeWrapper(node);
        };
        /**
         * 获取实际节点对象，如果不是节点对象则报错
         * @template NodeType
         * @param {UiNodeWrapper<NodeType> | NodeType} node
         * @returns {NodeType}
         */
        static getUiNode(node) {
            if (node instanceof UiNode) return node;
            if (node instanceof UiNodeWrapper) return node.node;
            throw new Error("在需要传递节点的参数中传递了不是节点的对象！");
        };
        /**
         * 节点的子节点（只读）
         * @returns {UiNodeWrapper<UiNode>[]}
         */
        get children() {
            return Array.from(this.node.children).map((node) => UiNodeWrapper.get(node));
        };
        /**
         * 节点的父节点（可修改）。非根节点的父节点为空时，该节点将不会被渲染
         * @returns {UiNodeWrapper<UiNode> | null}
         */
        get parent() {
            if (!this.node.parent) return null;
            return UiNodeWrapper.get(this.node);
        };
        /**
         * @param {UiNodeWrapper | UiNode | null}
         */
        set parent(node) {
            if (!node) {
                this.node.parent = void 0;
                return;
            }
            this.node.parent = UiNodeWrapper.getUiNode(node);
        }
        /**
         * 节点是否会被渲染。请注意，此属性只与 node.parent 有关系，与可见节点的 node.visible 没有任何关系。
         */
        get displayed() {
            let currentNode = this.node
            while (currentNode !== ui && currentNode.parent) currentNode = currentNode.parent;
            return currentNode === ui;
        };
        /**
         * 设置节点属性并返回自身，在链式调用中这个方法很有用。Vec2 和 Vec3 也可以正常设置。如果设置 Coord2，可以使用 options 控制设置的属性（"all" 为都设置，默认为 "offset"）。如 imageNodeWrapper.config("image", "路径或url")
         * @template {keyof NodeType} Key
         * @param {Key} key
         * @param {NodeType[Key]} value
         * @param {"offset" | "scale" | "all"} [options]
         * @returns {UiNodeWrapper<NodeType>}
         */
        config(key, value, options = "offset") {
            if (["children", "events"].includes(key)) throw new Error(`nodeWrapper.config: 不能设置只读属性 ${key}`);
            if (typeof this.node[key] === "function") throw new Error(`nodeWrapper.config: 不能设置方法 ${key}`);
            let oldValue = this.node[key];
            if (oldValue instanceof Vec2 || oldValue instanceof Vec3) {
                oldValue.copy(value);
            } else if (oldValue instanceof Coord2) {
                if (options === "offset" || options === "all") oldValue.offset.copy(value.offset);
                if (options === "scale" || options === "all") oldValue.scale.copy(value.scale);
            } else {
                this.node[key] = value;
            }
            return this;
        };
        /**
         * 创建节点，并将创建的节点添加到本节点的子节点。
         * @template NodeType
         * @param {{ create(): NodeType }} nodeClass
         * @returns {UiNodeWrapper<NodeType>}
         */
        createChildNode(nodeClass) {
            if (!nodeClass || !nodeClass.create) throw new Error("createNode: nodeConstructor 必须是一个有效的可创建UI节点的构造函数");
            let node = nodeClass.create();
            node.parent = this.node;
            return UiNodeWrapper.get(node);
        };
        /**
         * 监听指定的事件并返回自身，在链式调用中这个方法很有用。如 nodeWrapper.eventOn("pointerdown", 处理器函数)
         * @template {keyof EventMap<NodeType>} Type
         * @param {Type} type 监听的事件类型
         * @param {(event: EventMap<NodeType>[Type]) => void} listener 监听到事件类型后的处理函数。请注意，event.target 里返回的不是节点打包器对象
         * @returns {UiNodeWrapper<NodeType>}
         */
        eventOn(type, listener) {
            this.node.events.on(type, listener);
        };
        /**
         * 监听一次指定的事件并返回自身，在链式调用中这个方法很有用。如 nodeWrapper.eventOnce("pointerdown", 处理器函数)
         * @template {keyof EventMap<NodeType>} Type
         * @param {Type} type 监听的事件类型
         * @param {(event: EventMap<NodeType>[Type]) => void} listener 监听到事件类型后的处理函数。请注意，event.target 里返回的不是节点打包器对象
         * @returns {UiNodeWrapper<NodeType>}
         */
        eventOnce(type, listener) {
            this.node.events.once(type, listener);
        };
        /**
         * 添加子节点（如果是无效值将忽略）
         * @param {(UiNodeWrapper<UiNode> | UiNode | null)[]} childrenNode
         */
        appendChild(...childrenNode) {
            childrenNode.forEach((node) => {
                if (!node) return;
                node.node.parent = UiNodeWrapper.getUiNode(this.node);
            });
        };
        /**
         * 替换子节点（如果新的子节点是无效值将会删除子节点）
         * @param {UiNodeWrapper<UiNode> | UiNode} targetChild
         * @param {UiNodeWrapper<UiNode> | UiNode | null} newChild
         */
        replaceChild(targetChild, newChild) {
            let targetChildNode = UiNodeWrapper.getUiNode(targetChild);
            let newChildNode = void 0;
            if (newChild) newChildNode = UiNodeWrapper.getUiNode(newChild);
            if (targetChildNode.parent === this.node) targetChildNode.parent = void 0;
            if (newChildNode) newChildNode.parent = this;
        };
        /**
         * 删除子节点（如果是无效值将忽略）
         * @param {(UiNodeWrapper<UiNode> | UiNode | null)[]} childrenNode
         */
        removeChild(...childrenNode) {
            childrenNode.forEach((node) => {
                if (!node) return;
                let targetChildNode = UiNodeWrapper.getUiNode(node);
                if (targetChildNode.parent === this.node) targetChildNode.parent = void 0;
            })
        };
        /**
         * 判断本节点是否包含某个节点。请注意，类似于本节点包含另一个节点包含子节点时也会返回 true
         * @param {UiNodeWrapper<UiNode> | UiNode} target
         * @returns {boolean}
         */
        contains(target) {
            let targetNode = UiNodeWrapper.get(target);
            let currentNode = targetNode;
            while (currentNode !== this.node && currentNode.parent) currentNode = currentNode.parent;
            return currentNode === this.node;
        };
        /**
         * 按名称查找子节点，返回对应子节点对象。节点名称可在编辑模式下的属性面板中查看。请注意，使用此方法进行查找会返回 UiNodeWrapper，在未找到时返回 null
         * @param {string} name
         * @returns {UiNodeWrapper<UiNode> | null}
         */
        findChildByName(name) {
            let child = this.node.findChildByName(name);
            if (!child) return null;
            return UiNodeWrapper.get(child);
        };
        /**
         * 克隆节点，包括其子节点。请注意，使用此方法进行克隆会返回 UiNodeWrapper
         * @returns {UiNodeWrapper<NodeType>}
         */
        clone() {
            return UiNodeWrapper.get(this.node.clone());
        };
    };
    // 让直接使用 new UiNodeWrapper(node) 不会出现问题
    return new Proxy(UiNodeWrapper, {
        construct(target, argArray, newTarget) {
            if (argArray[0] instanceof UiNodeWrapper) return UiNodeWrapper;
            if (argArray.length <= 0 || !(argArray[0] instanceof UiNode)) throw new Error("创建 UiNodeWrapper 时需要一个参数 node，并且类型为 UiNode");
            if (target.nodes.has(argArray[0])) return target.nodes.get(argArray[0]);
            return Reflect.construct(target, argArray, newTarget);
        }
    });
}

