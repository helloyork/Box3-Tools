

// 此类型声明文件是给 Visual Studio Code 等 IDE 使用的
// 如果你使用的是神岛代码编辑器，此文件对你没用任何作用，你可以使用带 JSDoc 的代码来实现类型提示（当安装允许使用类型声明文件的插件时除外）

// 重要提醒：
// 此类型声明文件对应的 UiWrapper 的版本为 1.0.0
// 如果 console.log 输出的版本号与类型声明中的不相同，请更换类型声明文件的版本

// 作者：七式草莓
// 如果需要使用 UiWrapper，请勿删除或修改任何注释！
// 如果你的代码需要去除 JSDoc 以减小体积，可以下载七式草莓提供的 UiWrapper.client.min.js


type EventMap<NodeType extends { events: EventEmitter<Record<string, any>> }> = NodeType["events"] extends EventEmitter<infer EventMap> ? EventMap : any;
declare class UiNodeWrapper<NodeType> {
    /**
     * 创建节点打包器（重复创建会返回对应的打包器）
     * @param node 节点对象
     */
    constructor(node: NodeType);
    /**
     * UiWrapper 的版本号
     */
    static version: "1.0.0";
    /**
     * 根据 offset 和 scale 创建 Coord2
     * @param offset coord2 的 offset
     * @param scale coord2 的 scale
     */
    static createCoord2(offset?: Vec2 | null, scale?: Vec2 | null): Coord2;
    /**
     * 创建节点
     * @param nodeClass 节点的类对象
     */
    static createNode<NodeType>(nodeClass: { create(): NodeType }): UiNodeWrapper<NodeType>;
    /**
     * 节点对应的打包器，如无必要请勿修改
     */
    static nodes: WeakMap<UiNode, UiNodeWrapper<UiNode>>;
    /**
     * 获取节点打包器，用来提供内部实现。如果需要创建节点打包器，直接使用 new UiNodeWrapper(node) 即可。如果传入无效对象，将会返回 null
     * @param node 节点对象
     */
    static get<NodeType>(node: NodeType | null): UiNodeWrapper<NodeType> | null;
    /**
     * 获取实际节点对象，如果不是节点对象则报错
     * @param node 节点对象或其打包器
     */
    static getUiNode<NodeType>(node: UiNodeWrapper<NodeType> | NodeType): NodeType;
    /**
     * 打包器对应的节点对象
     */
    node: NodeType;
    /**
     * 节点的子节点（只读）
     * @readonly
     */
    children: UiNodeWrapper<UiNode>[];
    /**
     * 节点的父节点（可修改）。当读取时，总是返回 UiNodeWrapper 或空值，但是设置时使用也可以使用 UiNode 和无效值。非根节点的父节点为空时，该节点将不会被渲染。
     */
    parent: UiNodeWrapper<UiNode> | null;
    /**
     * 节点是否会被渲染。请注意，此属性只与 node.parent 有关系，与可见节点的 node.visible 没有任何关系。
     */
    displayed: boolean;
    /**
     * 设置节点属性并返回自身，在链式调用中这个方法很有用。Vec2 和 Vec3 也可以正常设置。如果设置 Coord2，可以使用 options 控制设置的属性。如 imageNodeWrapper.config("image", "路径或url")
     * @param key 节点属性的键名
     * @param value 节点属性的值
     * @param options 如果设置的是 Coord2，此参数将决定设置哪个属性（"all" 为都设置，默认 "offset"）
     */
    config<Key extends keyof NodeType>(key: Key, value: NodeType[Key], options?: "offset" | "scale" | "all"): UiNodeWrapper<NodeType>;
    /**
     * 创建节点，并将创建的节点添加到本节点的子节点。
     * @param nodeClass 节点的类对象
     */
    createChildNode<NodeType>(nodeClass: { create(): NodeType }): UiNodeWrapper<NodeType>;
    /**
     * 监听指定的事件并返回自身，在链式调用中这个方法很有用。如 nodeWrapper.eventOn("pointerdown", 处理器函数)
     * @param type 监听的事件类型
     * @param listener 监听到事件类型后的处理函数。请注意，event.target 里返回的不是节点打包器对象
     */
    eventOn<Type extends keyof EventMap<NodeType>>(type: Type, listener: (event: EventMap<NodeType>[Type]) => void): UiNodeWrapper<NodeType>;
    /**
     * 监听一次指定的事件并返回自身，在链式调用中这个方法很有用。如 nodeWrapper.eventOn("pointerdown", 处理器函数)
     * @param type 监听的事件类型
     * @param listener 监听到事件类型后的处理函数。请注意，event.target 里返回的不是节点打包器对象
     */
    eventOnce<Type extends keyof EventMap<NodeType>>(type: Type, listener: (event: EventMap<NodeType>[Type]) => void): UiNodeWrapper<NodeType>;
    /**
     * 添加子节点（如果是无效值将忽略）
     * @param childrenNode 子节点列表。请注意，如果要传入数组请使用展开运算符
     */
    appendChild(...childrenNode: (UiNodeWrapper<UiNode> | UiNode | null)[]): void;
    /**
     * 替换子节点（如果新的子节点是无效值将会删除子节点）
     * @param targetChild 要被替换的目标节点
     * @param newChild 新的节点（如果为无效值将删除目标节点）
     */
    replaceChild(targetChild: UiNodeWrapper<UiNode> | UiNode, newChild: UiNodeWrapper<UiNode> | UiNode | null): void;
    /**
     * 删除子节点（如果是无效值将忽略）
     * @param childrenNode 子节点列表。请注意，如果要传入数组请使用展开运算符
     */
    removeChild(...childrenNode: (UiNodeWrapper<UiNode> | UiNode | null)[]): void;
    /**
     * 判断本节点是否包含某个节点。请注意，类似于本节点包含另一个节点包含子节点时也会返回 true
     * @param target 要判断的子节点
     */
    contains(target: UiNodeWrapper<UiNode> | UiNode): boolean;
    /**
     * 按名称查找子节点，返回对应子节点对象。节点名称可在编辑模式下的属性面板中查看。请注意，使用此方法进行查找会返回 UiNodeWrapper，在未找到时返回 null
     * @param name 子节点的名称
     */
    findChildByName(name: string): UiNodeWrapper<UiNode> | null;
    /**
     * 克隆节点，包括其子节点。请注意，使用此方法进行克隆会返回 UiNodeWrapper
     */
    clone(): UiNodeWrapper<NodeType>;
}
/**
 * 全局常量 ui 的打包器对象
 */
declare const uiWrapper: UiNodeWrapper<UiNode>

