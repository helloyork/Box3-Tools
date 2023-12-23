/**
 * 事件处理模块
 */
declare class EventEmitter<EventMap extends Record<string, any>> {
    /**
     * 监听指定的事件。
     * @param type - 监听的事件类型，是个字符串。
     * @param listener - 监听到事件类型后的处理函数。
     */
    on<K extends keyof EventMap>(type: K, listener: (event: EventMap[K]) => void): void;
    /**
     * 与 on 的区别是仅触发一次。
     * @param type - 监听的事件类型，是个字符串。
     * @param listener - 监听到事件类型后的处理函数。
     */
    once<K extends keyof EventMap>(type: K, listener: (event: EventMap[K]) => void): void;
    /**
     * 移除找到的第一个 listener。
     * @param type - 要移除的事件类型。
     * @param listener - 要移除的事件处理函数。
     */
    remove<K extends keyof EventMap>(type: K, listener: (event: EventMap[K]) => void): void;
    /**
     * 移除找到的所有 listener，不传则移除事件下所有。
     * @param type - 要移除的事件类型。
     * @param listener - 可选，要移除的事件处理函数。
     */
    removeAll<K extends keyof EventMap>(type?: K, listener?: (event: EventMap[K]) => void): void;
    /**
     * 与 on 是同一个方法，只是方法名不同。
     * @param type - 监听的事件类型，是个字符串。
     * @param listener - 监听到事件类型后的处理函数。
     */
    add<K extends keyof EventMap>(type: K, listener: (event: EventMap[K]) => void): void;
    /**
     * 与 remove 是同一个方法，只是方法名不同。
     * @param type - 要移除的事件类型。
     * @param listener - 要移除的事件处理函数。
     */
    off<K extends keyof EventMap>(type: K, listener: (event: EventMap[K]) => void): void;
    /**
     * 触发指定的事件
     */
    emit<K extends keyof EventMap>(type: K, event: EventMap[K]): void;
}

declare type ClientRemoteChannelEvents = {
    client: any;
};
declare class ClientRemoteChannel {
    /**
     * 向服务端发送服务端事件。
     */
    sendServerEvent: (event: any) => void;
    /**
     * 监听服务端发来的ClientEvent。
     */
    readonly events: EventEmitter<ClientRemoteChannelEvents>;
}

declare class Coord2 {
    readonly offset: Vec2;
    readonly scale: Vec2;
    static create(val?: Coord2): Coord2;
}
declare class Vec2 {
    x: number;
    y: number;
    copy(val: Vec2): void;
    static create(val?: Vec2): Vec2;
}
declare class Vec3 {
    x: number;
    y: number;
    z: number;
    r: number;
    g: number;
    b: number;
    copy(val: Vec3): void;
    static create(val?: Vec3): Vec3;
}

interface UiEvent {
    target: UiNode;
}
declare type UiNodeEvents = {
    pointerdown: UiEvent;
    pointerup: UiEvent;
};
/**
 * 基础节点
 */
declare class UiNode {
    name: string;
    readonly children: ReadonlyArray<UiNode>;
    parent: UiNode | undefined;
    findChildByName: (name: string) => UiNode | undefined;
    /**
     * 管理节点相关的事件
     */
    events: EventEmitter<UiNodeEvents>;
    /**
     * 对节点进行缩放
     */
    uiScale: UiScale | undefined;
    /**
     * 克隆节点
     */
    clone: () => this;
}
declare class UiRenderable extends UiNode {
    readonly anchor: Vec2;
    readonly position: Coord2;
    readonly backgroundColor: Vec3;
    backgroundOpacity: number;
    readonly size: Coord2;
    zIndex: number;
    autoResize: 'NONE' | 'X' | 'Y' | 'XY';
    visible: boolean;
    pointerEventBehavior: PointerEventBehavior;
}
declare class UiBox extends UiRenderable {
    private constructor();
    static create(): UiBox;
}
declare class UiText extends UiRenderable {
    textContent: string;
    textFontSize: number;
    readonly textColor: Vec3;
    textXAlignment: 'Center' | 'Left' | 'Right';
    textYAlignment: 'Center' | 'Top' | 'Bottom';
    static create(): UiText;
}
declare class UiImage extends UiRenderable {
    image: string;
    imageOpacity: number;
    static create(): UiImage;
}
declare class UiComponent {
}
declare class UiScale extends UiComponent {
    scale: number;
    static create(): UiScale;
}
/**
 * 指针事件行为
 */
declare enum PointerEventBehavior {
    /**
     * 不响应，且不允许位于元素后方的其他元素响应。
     */
    DISABLE_AND_BLOCK_PASS_THROUGH = 0,
    /**
     * 不响应。
     */
    DISABLE = 1,
    /**
     * 不允许位于元素后方的其他元素响应。
     */
    BLOCK_PASS_THROUGH = 2,
    /**
     * 正常响应。
     */
    ENABLE = 3
}
/**
 * 游戏屏幕的宽度，取决于玩家进入游戏时的屏幕大小。
 */
declare const screenWidth: number;
/**
 * 游戏屏幕的高度，取决于玩家进入游戏时的屏幕大小。
 */
declare const screenHight: number;

/**
 * 指针锁定状态变化事件。
 */
declare type PointerLockChangeEvent = {
    /**
     * 表示指针是否锁定。
     */
    isLocked: boolean;
};
/**
 * 玩家指针锁定状态变化或出错时产生的事件。
 */
declare type PointerLockEvents = {
    pointerlockchange: PointerLockChangeEvent;
    pointerlockerror: undefined;
};

/**
 * 全局监听玩家的输入。
 */
declare class InputSystem {
    /**
     * 全局监听玩家指针与UI元素交互时的产生的事件。
     */
    readonly uiEvents: EventEmitter<UiNodeEvents>;
    /**
     * 全局监听当玩家指针锁定状态变化或出错时产生的事件。
     */
    readonly pointerLockEvents: EventEmitter<PointerLockEvents>;
    /**
     * 调用后解锁指针。
     */
    unlockPointer(): void;
    /**
     * 调用后锁定指针，由于浏览器限制，此操作可能会失败。
     * 有兴趣可以查看https://w3c.github.io/pointerlock/#dom-element-requestpointerlock。
     */
    lockPointer(): void;
}

declare const ui: UiNode;
declare const remoteChannel: ClientRemoteChannel;
/**
 * 延迟指定毫秒后返回一个resolve的Promise对象。
 * @param ms - 延迟的毫秒数。
 * @returns 一个Promise，在指定的毫秒数后resolve。
 * @example
 *
 * // 返回Promise，有两种基本用法
 * // #1
 *
 * sleep(1000).then(() => {
 *   console.log('这句话将在一秒后输出。')
 * })
 *
 * // #2
 *
 * (async () => {
 *     await sleep(1000);
 *     console.log('这句话将在一秒后输出。')
 * })();
 */
declare function sleep(ms: number): Promise<void>;
/**
 * 用于延迟执行函数的计时器，delayMs毫秒后异步执行回调函数callback。
 * 该函数自身是同步的，返回用于清除此计时器的ID，可在 clearTimeout 中使用。
 * @param callback - 要延迟执行的回调函数。
 * @param delayMs - 延迟的毫秒数。
 * @returns 用于清除计时器的ID。
 */
declare function setTimeout(callback: Function, delayMs: number): number;
/**
 * 用于清除传入ID对应的 setTimeout 计时器。
 * @param id - 要清除的计时器的ID。
 */
declare function clearTimeout(id: number): void;
/**
 * 用于定时执行函数的计时器，每 delayMs 毫秒后异步执行回调函数 callback。
 * 该函数自身是同步的，返回用于清除此计时器的ID，可在 clearInterval 中使用。
 * @param callback - 要定时执行的回调函数。
 * @param delayMs - 间隔的毫秒数。
 * @returns 用于清除计时器的ID。
 */
declare function setInterval(callback: Function, delayMs: number): number;
/**
 * 用于清除传入ID对应的 setInterval 计时器。
 * @param id - 要清除的计时器的ID。
 */
declare function clearInterval(id: number): void;
/**
 * 全局监听玩家的输入。
 */
declare const input: InputSystem;
