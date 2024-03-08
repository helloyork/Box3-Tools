// @ts-nocheck

declare type GameLoggerMethod = (...args: any[]) => void;

declare const console: {
    assert: (assertion: any, ...args: any[]) => void;
    log: GameLoggerMethod;
    debug: GameLoggerMethod;
    error: GameLoggerMethod;
    warn: GameLoggerMethod;
    clear: GameLoggerMethod;
};

declare const world: GameWorld;
declare const voxels: GameVoxels;
declare const resources: {
    ls: (path?: string) => GameAssetListEntry[];
};
declare const db: GameDatabase;
declare const storage: GameStorage;
declare const http: GameHttpAPI;
declare const rtc: GameRTC;
declare const gui: GameGUI;
declare const remoteChannel: ServerRemoteChannel;

declare function sleep(ms: number): Promise<void>;

declare const require: {
    (module: string): any;
    resolve: (path: string) => string;
};
declare const module: {
    exports: any;
};
declare const exports: any;
declare const __dirname: string;
declare const __filename: string;

interface GUIData {
    name: string;
    attributes?: {
        [name: string]: string | number;
    };
    children?: GUIData[];
}
interface GUIBind<T extends string> {
    event: string;
    selector?: string;
    action: T;
}
interface GUIBindDefinition<T> {
    drag: {
        attributes: {
            [name: string]: 'x' | '-x' | 'y' | '-y';
        };
        targetSelector: string;
    };
    show: {
        name: T;
        allowMultiple?: boolean;
    };
    remove: {
        targetSelector: string;
    };
    sendMessage: {
        messageName: string;
        messageData?: string[];
    };
    clipboardWrite: {
        targetSelector: string;
        attributeName: string;
    };
}
declare type GUIBindTypeMap<T> = {
    [key in keyof GUIBindDefinition<T>]: GUIBind<key> & GUIBindDefinition<T>[key];
};
declare type GUIBindTypes<T> = GUIBindTypeMap<T>[keyof GUIBindTypeMap<T>];
interface GUIConfigItem<T extends string> {
    display?: boolean;
    bindings?: GUIBindTypes<T>[];
    data: string | GUIData;
}
declare type GUIConfig<T extends string, U extends T> = {
    [name in T]: GUIConfigItem<U>;
};
declare type JSONValue = string | number | boolean | {
    [x: string]: JSONValue;
} | Array<JSONValue>;
declare enum GameLogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3
}
declare type GameLoggerMethod = (...args: any[]) => void;
declare class GameConsole {
    clear: () => void;
    constructor(log: (level: GameLogLevel, message: string) => void, clear: () => void);
    assert: (assertion: any, ...args: any[]) => void;
    log: GameLoggerMethod;
    debug: GameLoggerMethod;
    error: GameLoggerMethod;
    warn: GameLoggerMethod;
    dir: () => void;
    dirxml: () => void;
    group: () => void;
    groupCollapsed: () => void;
    groupEnd: () => void;
    table: () => void;
    time: () => void;
    timeEnd: () => void;
    timeLog: () => void;
    timeStamp: () => void;
    trace: () => void;
}


declare type TELEPORT_ERROR_STATUS = 'PLAYER_OFFLINE' | 'ACCESS_DENIED' | 'UNKNOWN';
declare type TeleportType = (mapId: string, players: GameEntity[]) => Promise<void>;
interface GameSoundEffectConfig {
    sample: string;
    radius: number;
    gain: number;
    gainRange: number;
    pitch: number;
    pitchRange: number;
}
/**
 * A single sound effect table
 */
declare class GameSoundEffect implements GameSoundEffectConfig {
    /**
     * Sample weight
     */
    radius: number;
    /**
     * Volume gain, makes sound louder
     */
    gain: number;
    /**
     * Variability in volume gain
     */
    gainRange: number;
    /**
     * Pitch adjustment multiplier.
     * * 1 : normal
     * * < 1 : slower playback
     * * > 1 : faster playback
     */
    pitch: number;
    /**
     * Variability in pitch
     */
    pitchRange: number;
    /**
     * Path to sample
     */
    sample: string;
}
/**
 * Triggers can be used to detect when an object enters some zone or leaves.
 */
declare class GameZone {
    /**
     * List all entities
     */
    entities: () => GameEntity[];
    /**
     * Triggered when an entity enters the zone
     */
    onEnter: GameEventChannel<GameTriggerEvent>;
    nextEnter: GameEventFuture<GameTriggerEvent>;
    /**
     * Triggers when an entity leaves the zone
     */
    onLeave: GameEventChannel<GameTriggerEvent>;
    nextLeave: GameEventFuture<GameTriggerEvent>;
    /**
     * Destroys the zone
     */
    remove: () => void;
    /**
     * Bounds of the zone
     */
    bounds: GameBounds3;
    /**
     * Selector filter
     */
    selector: GameSelectorString;
    /**
     * Controls how much the object's mass applies to the force
     * 0 = behaves like gravity
     * 1 = behaves like wind
     */
    massScale: number;
    /**
     * The amount of force to apply to the object
     */
    force: GameVector3;
    fogEnabled: boolean;
    fogColor: GameRGBColor;
    fogStartDistance: number;
    fogHeightOffset: number;
    fogHeightFalloff: number;
    fogDensity: number;
    fogMax: number;
    snowEnabled: boolean;
    snowDensity: number;
    snowSizeLo: number;
    snowSizeHi: number;
    snowFallSpeed: number;
    snowSpinSpeed: number;
    snowColor: GameRGBAColor;
    snowTexture: string;
    rainEnabled: boolean;
    rainDensity: number;
    rainDirection: GameVector3;
    rainSpeed: number;
    rainSizeLo: number;
    rainSizeHi: number;
    rainInterference: number;
    rainColor: GameRGBAColor;
    skyEnabled: boolean;
    skyMode: 'natural' | 'manual';
    skySunPhase: number;
    skySunFrequency: number;
    skyLunarPhase: number;
    skySunDirection: GameVector3;
    skySunLight: GameRGBColor;
    skyLeftLight: GameRGBColor;
    skyRightLight: GameRGBColor;
    skyBottomLight: GameRGBColor;
    skyTopLight: GameRGBColor;
    skyFrontLight: GameRGBColor;
    skyBackLight: GameRGBColor;
    /**
     * @ignore
     */
    constructor(
        /**
         * List all entities
         */
        entities: () => GameEntity[],
        /**
         * Triggered when an entity enters the zone
         */
        onEnter: GameEventChannel<GameTriggerEvent>, nextEnter: GameEventFuture<GameTriggerEvent>,
        /**
         * Triggers when an entity leaves the zone
         */
        onLeave: GameEventChannel<GameTriggerEvent>, nextLeave: GameEventFuture<GameTriggerEvent>,
        /**
         * Destroys the zone
         */
        remove: () => void);
}
/**
 * Trigger constructor parameters
 */
declare type GameZoneConfig = {
    bounds: GameBounds3;
    selector: GameSelectorString;
    massScale: number;
    force: GameVector3;
    fogEnabled: boolean;
    fogColor: GameRGBColor;
    fogStartDistance: number;
    fogHeightOffset: number;
    fogHeightFalloff: number;
    fogDensity: number;
    fogMax: number;
    snowEnabled: boolean;
    snowDensity: number;
    snowSizeLo: number;
    snowSizeHi: number;
    snowFallSpeed: number;
    snowSpinSpeed: number;
    snowColor: GameRGBAColor;
    snowTexture: string;
    rainEnabled: boolean;
    rainDensity: number;
    rainDirection: GameVector3;
    rainSpeed: number;
    rainSizeLo: number;
    rainSizeHi: number;
    rainInterference: number;
    rainColor: GameRGBAColor;
    skyEnabled: boolean;
    skyMode: 'natural' | 'manual';
    skySunPhase: number;
    skySunFrequency: number;
    skyLunarPhase: number;
    skySunDirection: GameVector3;
    skySunLight: GameRGBColor;
    skyLeftLight: GameRGBColor;
    skyRightLight: GameRGBColor;
    skyBottomLight: GameRGBColor;
    skyTopLight: GameRGBColor;
    skyFrontLight: GameRGBColor;
    skyBackLight: GameRGBColor;
};
declare enum GameAnimationPlaybackState {
    PENDING = "pending",
    RUNNING = "running",
    FINISHED = "finished"
}
declare enum GameAnimationDirection {
    NORMAL = "normal",
    REVERSE = "reverse",
    WRAP = "wrap",
    WRAP_REVERSE = "wrap-reverse",
    ALTERNATE = "alternate",
    ALTERNATE_REVERSE = "alternate-reverse"
}
declare enum GameEasing {
    NONE = "none",
    LINEAR = "linear",
    QUADRATIC = "quadratic",
    SINE = "sine",
    EXP = "exp",
    BACK = "back",
    ELASTIC = "elastic",
    BOUNCE = "bounce",
    CIRCLE = "circle"
}
interface GameAnimationPlaybackConfig {
    startTick: number;
    delay: number;
    endDelay: number;
    duration: number;
    direction: GameAnimationDirection;
    iterationStart: number;
    iterations: number;
}
declare class GameAnimation<KeyframeType, TargetType> {
    /**
     * Animation target object (could be world, player or entity)
     */
    target: TargetType;
    /**
     * Returns all animation keyframes
     */
    keyframes: () => Partial<KeyframeType>[];
    /**
     * Starts or restarts playback for the animation.
     */
    play: (playback?: Partial<GameAnimationPlaybackConfig>) => void;
    /**
     * Cancels current animation playback
     */
    cancel: () => void;
    /**
     * Fires when animation begins
     */
    onReady: GameEventChannel<GameAnimationEvent<KeyframeType, TargetType>>;
    nextReady: GameEventFuture<GameAnimationEvent<KeyframeType, TargetType>>;
    /**
     * Fires when animation completes successfully
     */
    onFinish: GameEventChannel<GameAnimationEvent<KeyframeType, TargetType>>;
    nextFinish: GameEventFuture<GameAnimationEvent<KeyframeType, TargetType>>;
    /**
     * Current playback time for animation (in animation frames)
     */
    currentTime: number;
    /**
     * Start tick for animation
     */
    startTime: number;
    /**
     * Current playback state for animation
     */
    playState: GameAnimationPlaybackState;
    /**
     * Playback rate in frames per tick
     */
    playbackRate: number;
    /**
     * @ignore
     */
    constructor(
        /**
         * Animation target object (could be world, player or entity)
         */
        target: TargetType,
        /**
         * Returns all animation keyframes
         */
        keyframes: () => Partial<KeyframeType>[], currentTime: () => number, startTime: () => number, playState: () => GameAnimationPlaybackState, playbackRate: () => number,
        /**
         * Starts or restarts playback for the animation.
         */
        play: (playback?: Partial<GameAnimationPlaybackConfig>) => void,
        /**
         * Cancels current animation playback
         */
        cancel: () => void,
        /**
         * Fires when animation begins
         */
        onReady: GameEventChannel<GameAnimationEvent<KeyframeType, TargetType>>, nextReady: GameEventFuture<GameAnimationEvent<KeyframeType, TargetType>>,
        /**
         * Fires when animation completes successfully
         */
        onFinish: GameEventChannel<GameAnimationEvent<KeyframeType, TargetType>>, nextFinish: GameEventFuture<GameAnimationEvent<KeyframeType, TargetType>>);
    then<T>(resolve: (event: GameAnimationEvent<KeyframeType, TargetType>) => T, reject?: (error: any) => any): any;
}
interface GameWorldKeyframe {
    duration: number;
    easeIn: GameEasing;
    easeOut: GameEasing;
    fogColor: GameRGBColor;
    fogStartDistance: number;
    fogHeightOffset: number;
    fogHeightFalloff: number;
    fogUniformDensity: number;
    maxFog: number;
    lightMode: 'natural' | 'manual';
    sunPhase: number;
    sunFrequency: number;
    lunarPhase: number;
    sunDirection: GameVector3;
    sunLight: GameRGBColor;
    skyLeftLight: GameRGBColor;
    skyRightLight: GameRGBColor;
    skyBottomLight: GameRGBColor;
    skyTopLight: GameRGBColor;
    skyFrontLight: GameRGBColor;
    skyBackLight: GameRGBColor;
    rainDensity: number;
    rainDirection: GameVector3;
    rainSpeed: number;
    rainSizeLo: number;
    rainSizeHi: number;
    rainInterference: number;
    rainColor: GameRGBAColor;
    snowDensity: number;
    snowSizeLo: number;
    snowSizeHi: number;
    snowFallSpeed: number;
    snowSpinSpeed: number;
    snowColor: GameRGBAColor;
    snowTexture: string;
    gravity: number;
    airFriction: number;
}
declare class Sound {
    resume: (currentTime?: number) => void;
    setCurrentTime: (currentTime: number) => void;
    pause: () => void;
    stop: () => void;
    constructor(resume: (currentTime?: number) => void, setCurrentTime: (currentTime: number) => void, pause: () => void, stop: () => void);
}
/**
 * {@link Game.GameWorld} is the main entry point to the engine API.  Using this object you can control
 * global scene properties like the weather, timeOfDay, etc. and perform searches on the set of all {@link Game.GameEntity}
 * which exist in the world.
 */
declare class GameWorld {
    /**
     * Public URL of the currently running world
     */
    url: URL;
    /**
     * Returns the remaining number of entities the script is allowed to create
     * @category entities
     */
    entityQuota: () => number;
    /**
     * @category health
     */
    onRespawn: GameEventChannel<GameRespawnEvent>;
    nextRespawn: GameEventFuture<GameRespawnEvent>;
    /**
     * Creates a new {@link Game.GameEntity} or makes a copy of an existing entity.
     * If entity quota is exceeded, then returns null.
     * @param config A set of initial values for the entity or a new entity which we want to copy
     * @returns A newly created entity with the given parameters
     * @category entity
     */
    createEntity: (config: Partial<GameEntityConfig>) => GameEntity | null;
    /**
     * The entities in game can be searched using a jQuery selector-like syntax.
     * For more examples see {@link Game.GameSelectorString}
     *
     * @param selector a selector search pattern
     * @returns the first entity which matches the selector/
     * @category entity
     */
    querySelector: (selector: GameSelectorString) => GameEntity | null;
    /**
     * The entities in game can be searched using a jQuery selector-like syntax
     * For more examples see {@link Game.GameSelectorString}
     *
     * @param selector a selector search pattern
     * @returns All entities which match the selector
     * @category entity
     */
    querySelectorAll: (selector: GameSelectorString) => GameEntity[];
    /**
     * Test a selector on an entity
     *
     * @param selector the selector pattern to test
     * @param entity The entity to test
     * @category entity
     */
    testSelector: (selector: GameSelectorString, entity: GameEntity) => boolean;
    /**
     * Disables collisions between the set of all entities matching aSelector and bSelector
     *
     * @param aSelector the selector for the first set of entities
     * @param bSelector the selector for the second set of entities
     * @category physics
     */
    addCollisionFilter: (aSelector: GameSelectorString, bSelector: GameSelectorString) => void;
    /**
     * Removes collision filter between aSelector and bSelector
     *
     * @param aSelector the selector for the first set of entities
     * @param bSelector the selector for the second set of entities
     * @category physics
     */
    removeCollisionFilter: (aSelector: GameSelectorString, bSelector: GameSelectorString) => void;
    /**
     * Clears all collision filters
     *
     * @category physics
     */
    clearCollisionFilters: () => void;
    /**
     * Returns a list of all currently active collision filters
     *
     * @returns All currently active collision filters
     * @category physics
     */
    collisionFilters: () => string[][];
    /**
     * Shoots a ray through the world from `origin` in `direction`
     * @param origin the start point of the ray
     * @param direction the direction of the ray
     * @param options An option configuration parameter
     * @returns Information about the resulting raycast
     * @category search
     */
    raycast: (origin: GameVector3, direction: GameVector3, options?: Partial<GameRaycastOptions>) => GameRaycastResult;
    /**
     * Search for all entities contained in a bounding box
     * @param bounds the bounding box to search
     * @returns All entities contained in ``bounds``
     */
    searchBox: (bounds: GameBounds3) => GameEntity[];
    /**
     * Plays an animation on the world object
     */
    animate: (keyframes: Partial<GameWorldKeyframe>[], playbackInfo?: Partial<GameAnimationPlaybackConfig>) => GameAnimation<GameWorldKeyframe, GameWorld>;
    getAnimations: () => GameAnimation<GameWorldKeyframe, GameWorld>[];
    getEntityAnimations: () => GameAnimation<GameEntityKeyframe, GameEntity>[];
    getPlayerAnimations: () => GameAnimation<GamePlayerKeyframe, GamePlayer>[];
    /**
     * An event handler called each tick
     * @category tick
     */
    onTick: GameEventChannel<GameTickEvent>;
    nextTick: GameEventFuture<GameTickEvent>;
    /**
     * Called when an entity takes damage
     * @category health
     */
    onTakeDamage: GameEventChannel<GameDamageEvent>;
    nextTakeDamage: GameEventFuture<GameDamageEvent>;
    /**
     * Called when an entity dies
     * @category health
     */
    onDie: GameEventChannel<GameDieEvent>;
    nextDie: GameEventFuture<GameDieEvent>;
    /**
     * Called whenever a player joins the game
     * @category player
     */
    onPlayerJoin: GameEventChannel<GamePlayerEntityEvent>;
    nextPlayerJoin: GameEventFuture<GamePlayerEntityEvent>;
    /**
     * Called whenever a player leaves the game
     * @category player
     */
    onPlayerLeave: GameEventChannel<GamePlayerEntityEvent>;
    nextPlayerLeave: GameEventFuture<GamePlayerEntityEvent>;
    /**
     * Called whenever an entity is created
     * @category entity
     */
    onEntityCreate: GameEventChannel<GameEntityEvent>;
    nextEntityCreate: GameEventFuture<GameEntityEvent>;
    /**
     * Called whenever an entity is destroyed
     * @category chat
     */
    onEntityDestroy: GameEventChannel<GameEntityEvent>;
    nextEntityDestroy: GameEventFuture<GameEntityEvent>;
    /**
     * Broadcast a global message to all players
     * @param message is some text we want to broadcast
     * @category player
     */
    say: (message: string) => void;
    /**
     * Called whenever a player says something
     * @category player
     */
    onChat: GameEventChannel<GameChatEvent>;
    nextChat: GameEventFuture<GameChatEvent>;
    /**
     * Called whenever a player clicks on an object
     * @category player
     */
    onClick: GameEventChannel<GameClickEvent>;
    nextClick: GameEventFuture<GameClickEvent>;
    /**
     * Called whenever a player pushes a button
     * @category player
     */
    onPress: GameEventChannel<GameInputEvent>;
    nextPress: GameEventFuture<GameInputEvent>;
    /**
     * Called whenever a player releases a button
     * @category player
     */
    onRelease: GameEventChannel<GameInputEvent>;
    nextRelease: GameEventFuture<GameInputEvent>;
    /**
     * Called whenever two entities collide
     * @category entity
     */
    onEntityContact: GameEventChannel<GameEntityContactEvent>;
    nextEntityContact: GameEventFuture<GameEntityContactEvent>;
    /**
     * Called whenever two entities stop colliding
     * @category entity
     */
    onEntitySeparate: GameEventChannel<GameEntityContactEvent>;
    nextEntitySeparate: GameEventFuture<GameEntityContactEvent>;
    /**
     * Called whenever an entity touches a voxel
     * @category entity
     */
    onVoxelContact: GameEventChannel<GameVoxelContactEvent>;
    nextVoxelContact: GameEventFuture<GameVoxelContactEvent>;
    /**
     * Called whenever an entity stops touching a voxel
     * @category entity
     */
    onVoxelSeparate: GameEventChannel<GameVoxelContactEvent>;
    nextVoxelSeparate: GameEventFuture<GameVoxelContactEvent>;
    /**
     * Called when an entity enters a fluid
     * @category entity
     */
    onFluidEnter: GameEventChannel<GameFluidContactEvent>;
    nextFluidEnter: GameEventFuture<GameFluidContactEvent>;
    /**
     * Called when an entity leaves a fluid
     * @category entity
     */
    onFluidLeave: GameEventChannel<GameFluidContactEvent>;
    nextFluidLeave: GameEventFuture<GameFluidContactEvent>;
    /**
     * Zones
     * @category zone
     */
    zones: () => GameZone[];
    addZone: (config: Partial<GameZoneConfig>) => GameZone;
    removeZone: (trigger: GameZone) => void;
    /**
     * @category interactive
     */
    onInteract: GameEventChannel<GameInteractEvent>;
    nextInteract: GameEventFuture<GameInteractEvent>;
    /**
     * Called when player buy product success
     * @category player
     */
    onPlayerPurchaseSuccess: GameEventChannel<GamePurchaseSuccessEvent>;
    nextPlayerPurchaseSuccess: GameEventFuture<GamePurchaseSuccessEvent>;
    /**
     * Plays a sound at a given location
     */
    sound: (spec: {
        sample: string;
        position?: GameVector3;
        radius?: number;
        gain?: number;
        pitch?: number;
    } | string) => Sound;
    /**
     * åœ°å›¾ç»„å†…ä¼ é€èƒ½åŠ›ï¼Œèƒ½å¤Ÿä»¤ Player è¢«ä¼ é€åˆ°å…¶ä»–åœ°å›¾ä¸­
     */
    teleport: TeleportType;
    /**
     * The name of the project (read only)
     */
    projectName: string;
    currentTick: number;
    /**
     * Type of lighting to use for the sky and ambient light
     */
    lightMode: 'natural' | 'manual';
    /**
     * The initial phase of the sun's motion through the sky.  The time of day is calculated using the formula:
     * `timeOfDay = (sunPhase + sunFrequency * tick) % 1`
     * @category weather
     */
    sunPhase: number;
    /**
     * The frequency at which the sun moves through the sky.  Higher values = faster sun movement.
     * @category weather
     */
    sunFrequency: number;
    /**
     * The phase of the moon.  Must be between 0 and 1
     * @category weather
     */
    lunarPhase: number;
    /**
     * Direction of sun (only used if ambientLightMode === 'manual)
     * @category weather
     */
    sunDirection: GameVector3;
    /**
     * Light level of the sun (only used if ambientLightMode === 'manual')
     * @category weather
     */
    sunLight: GameRGBColor;
    /**
     * -x direction ambient light value (only used if ambientLightMode === 'manual')
     * @category weather
     */
    skyLeftLight: GameRGBColor;
    /**
     * +x direction ambient light value (only used if ambientLightMode === 'manual')
     * @category weather
     */
    skyRightLight: GameRGBColor;
    /**
     * -y direction ambient light value (only used if ambientLightMode === 'manual')
     * @category weather
     */
    skyBottomLight: GameRGBColor;
    /**
     * +y direction ambient light value (only used if ambientLightMode === 'manual')
     * @category weather
     */
    skyTopLight: GameRGBColor;
    /**
     * -z direction ambient light value (only used if ambientLightMode === 'manual')
     * @category weather
     */
    skyFrontLight: GameRGBColor;
    /**
     * +z direction ambient light value (only used if ambientLightMode === 'manual')
     * @category weather
     */
    skyBackLight: GameRGBColor;
    /**
     * Fog color
     * @category weather
     */
    fogColor: GameRGBColor;
    /**
     * Distance when fog starts
     * @category weather
     */
    fogStartDistance: number;
    /**
     * Height that fog starts at
     * @category weather
     */
    fogHeightOffset: number;
    /**
     * Rate that height fog decays
     * @category weather
     */
    fogHeightFalloff: number;
    /**
     * Amount of uniform fog (if > 0, cannot see skybox)
     * @category weather
     */
    fogUniformDensity: number;
    /**
     * Maximum amount of fog
     * @category weather
     */
    maxFog: number;
    /**
     * @category weather
     */
    snowDensity: number;
    /**
     * @category weather
     */
    snowSizeLo: number;
    /**
     * @category weather
     */
    snowSizeHi: number;
    /**
     * @category weather
     */
    snowFallSpeed: number;
    /**
     * @category weather
     */
    snowSpinSpeed: number;
    /**
     * @category weather
     */
    snowColor: GameRGBAColor;
    /**
     * @category weather
     */
    snowTexture: string;
    /**
     * @category weather
     */
    rainDensity: number;
    /**
     * @category weather
     */
    rainDirection: GameVector3;
    /**
     * @category weather
     */
    rainSpeed: number;
    /**
     * @category weather
     */
    rainSizeLo: number;
    /**
     * @category weather
     */
    rainSizeHi: number;
    /**
     * @category weather
     */
    rainInterference: number;
    /**
     * @category weather
     */
    rainColor: GameRGBAColor;
    /**
     * Amount and direction of gravitational field
     * @category physics
     */
    gravity: number;
    /**
     * Amount of air friction
     * @category physics
     */
    airFriction: number;
    /**
     * Use obb rigid body to solve physics
     * @category physics
     */
    useOBB: boolean;
    /**
     * Plays when a voxel breaks
     * @category sound
     */
    breakVoxelSound: GameSoundEffect;
    /**
     * Plays when a voxel is placed
     * @category sound
     */
    placeVoxelSound: GameSoundEffect;
    /**
     * Plays when a player joins
     * @category sound
     */
    playerJoinSound: GameSoundEffect;
    /**
     * Plays when a player leaves
     * @category sound
     */
    playerLeaveSound: GameSoundEffect;
    /**
     * Ambient sound, plays in background globally
     * @category sound
     */
    ambientSound: GameSoundEffect;
    /**
     * @ignore
     */
    constructor(
        /**
         * Public URL of the currently running world
         */
        url: URL,
        /**
         * Returns the remaining number of entities the script is allowed to create
         * @category entities
         */
        entityQuota: () => number,
        /**
         * @category health
         */
        onRespawn: GameEventChannel<GameRespawnEvent>, nextRespawn: GameEventFuture<GameRespawnEvent>,
        /**
         * Creates a new {@link Game.GameEntity} or makes a copy of an existing entity.
         * If entity quota is exceeded, then returns null.
         * @param config A set of initial values for the entity or a new entity which we want to copy
         * @returns A newly created entity with the given parameters
         * @category entity
         */
        createEntity: (config: Partial<GameEntityConfig>) => GameEntity | null,
        /**
         * The entities in game can be searched using a jQuery selector-like syntax.
         * For more examples see {@link Game.GameSelectorString}
         *
         * @param selector a selector search pattern
         * @returns the first entity which matches the selector/
         * @category entity
         */
        querySelector: (selector: GameSelectorString) => GameEntity | null,
        /**
         * The entities in game can be searched using a jQuery selector-like syntax
         * For more examples see {@link Game.GameSelectorString}
         *
         * @param selector a selector search pattern
         * @returns All entities which match the selector
         * @category entity
         */
        querySelectorAll: (selector: GameSelectorString) => GameEntity[],
        /**
         * Test a selector on an entity
         *
         * @param selector the selector pattern to test
         * @param entity The entity to test
         * @category entity
         */
        testSelector: (selector: GameSelectorString, entity: GameEntity) => boolean,
        /**
         * Disables collisions between the set of all entities matching aSelector and bSelector
         *
         * @param aSelector the selector for the first set of entities
         * @param bSelector the selector for the second set of entities
         * @category physics
         */
        addCollisionFilter: (aSelector: GameSelectorString, bSelector: GameSelectorString) => void,
        /**
         * Removes collision filter between aSelector and bSelector
         *
         * @param aSelector the selector for the first set of entities
         * @param bSelector the selector for the second set of entities
         * @category physics
         */
        removeCollisionFilter: (aSelector: GameSelectorString, bSelector: GameSelectorString) => void,
        /**
         * Clears all collision filters
         *
         * @category physics
         */
        clearCollisionFilters: () => void,
        /**
         * Returns a list of all currently active collision filters
         *
         * @returns All currently active collision filters
         * @category physics
         */
        collisionFilters: () => string[][],
        /**
         * Shoots a ray through the world from `origin` in `direction`
         * @param origin the start point of the ray
         * @param direction the direction of the ray
         * @param options An option configuration parameter
         * @returns Information about the resulting raycast
         * @category search
         */
        raycast: (origin: GameVector3, direction: GameVector3, options?: Partial<GameRaycastOptions>) => GameRaycastResult,
        /**
         * Search for all entities contained in a bounding box
         * @param bounds the bounding box to search
         * @returns All entities contained in ``bounds``
         */
        searchBox: (bounds: GameBounds3) => GameEntity[],
        /**
         * Plays an animation on the world object
         */
        animate: (keyframes: Partial<GameWorldKeyframe>[], playbackInfo?: Partial<GameAnimationPlaybackConfig>) => GameAnimation<GameWorldKeyframe, GameWorld>, getAnimations: () => GameAnimation<GameWorldKeyframe, GameWorld>[], getEntityAnimations: () => GameAnimation<GameEntityKeyframe, GameEntity>[], getPlayerAnimations: () => GameAnimation<GamePlayerKeyframe, GamePlayer>[],
        /**
         * An event handler called each tick
         * @category tick
         */
        onTick: GameEventChannel<GameTickEvent>, nextTick: GameEventFuture<GameTickEvent>,
        /**
         * Called when an entity takes damage
         * @category health
         */
        onTakeDamage: GameEventChannel<GameDamageEvent>, nextTakeDamage: GameEventFuture<GameDamageEvent>,
        /**
         * Called when an entity dies
         * @category health
         */
        onDie: GameEventChannel<GameDieEvent>, nextDie: GameEventFuture<GameDieEvent>,
        /**
         * Called whenever a player joins the game
         * @category player
         */
        onPlayerJoin: GameEventChannel<GamePlayerEntityEvent>, nextPlayerJoin: GameEventFuture<GamePlayerEntityEvent>,
        /**
         * Called whenever a player leaves the game
         * @category player
         */
        onPlayerLeave: GameEventChannel<GamePlayerEntityEvent>, nextPlayerLeave: GameEventFuture<GamePlayerEntityEvent>,
        /**
         * Called whenever an entity is created
         * @category entity
         */
        onEntityCreate: GameEventChannel<GameEntityEvent>, nextEntityCreate: GameEventFuture<GameEntityEvent>,
        /**
         * Called whenever an entity is destroyed
         * @category chat
         */
        onEntityDestroy: GameEventChannel<GameEntityEvent>, nextEntityDestroy: GameEventFuture<GameEntityEvent>,
        /**
         * Broadcast a global message to all players
         * @param message is some text we want to broadcast
         * @category player
         */
        say: (message: string) => void,
        /**
         * Called whenever a player says something
         * @category player
         */
        onChat: GameEventChannel<GameChatEvent>, nextChat: GameEventFuture<GameChatEvent>,
        /**
         * Called whenever a player clicks on an object
         * @category player
         */
        onClick: GameEventChannel<GameClickEvent>, nextClick: GameEventFuture<GameClickEvent>,
        /**
         * Called whenever a player pushes a button
         * @category player
         */
        onPress: GameEventChannel<GameInputEvent>, nextPress: GameEventFuture<GameInputEvent>,
        /**
         * Called whenever a player releases a button
         * @category player
         */
        onRelease: GameEventChannel<GameInputEvent>, nextRelease: GameEventFuture<GameInputEvent>,
        /**
         * Called whenever two entities collide
         * @category entity
         */
        onEntityContact: GameEventChannel<GameEntityContactEvent>, nextEntityContact: GameEventFuture<GameEntityContactEvent>,
        /**
         * Called whenever two entities stop colliding
         * @category entity
         */
        onEntitySeparate: GameEventChannel<GameEntityContactEvent>, nextEntitySeparate: GameEventFuture<GameEntityContactEvent>,
        /**
         * Called whenever an entity touches a voxel
         * @category entity
         */
        onVoxelContact: GameEventChannel<GameVoxelContactEvent>, nextVoxelContact: GameEventFuture<GameVoxelContactEvent>,
        /**
         * Called whenever an entity stops touching a voxel
         * @category entity
         */
        onVoxelSeparate: GameEventChannel<GameVoxelContactEvent>, nextVoxelSeparate: GameEventFuture<GameVoxelContactEvent>,
        /**
         * Called when an entity enters a fluid
         * @category entity
         */
        onFluidEnter: GameEventChannel<GameFluidContactEvent>, nextFluidEnter: GameEventFuture<GameFluidContactEvent>,
        /**
         * Called when an entity leaves a fluid
         * @category entity
         */
        onFluidLeave: GameEventChannel<GameFluidContactEvent>, nextFluidLeave: GameEventFuture<GameFluidContactEvent>,
        /**
         * Zones
         * @category zone
         */
        zones: () => GameZone[], addZone: (config: Partial<GameZoneConfig>) => GameZone, removeZone: (trigger: GameZone) => void,
        /**
         * @category interactive
         */
        onInteract: GameEventChannel<GameInteractEvent>, nextInteract: GameEventFuture<GameInteractEvent>,
        /**
         * Called when player buy product success
         * @category player
         */
        onPlayerPurchaseSuccess: GameEventChannel<GamePurchaseSuccessEvent>, nextPlayerPurchaseSuccess: GameEventFuture<GamePurchaseSuccessEvent>,
        /**
         * Plays a sound at a given location
         */
        sound: (spec: {
            sample: string;
            position?: GameVector3;
            radius?: number;
            gain?: number;
            pitch?: number;
        } | string) => Sound,
        /**
         * åœ°å›¾ç»„å†…ä¼ é€èƒ½åŠ›ï¼Œèƒ½å¤Ÿä»¤ Player è¢«ä¼ é€åˆ°å…¶ä»–åœ°å›¾ä¸­
         */
        teleport: TeleportType);
}
/**
 * {@link Game.GameVoxels} gives an interface for all the voxels in Game.  You can use it to control the terrain
 */
declare class GameVoxels {
    /**
     * Size of the voxel grid along the x/y/z dimensions
     */
    shape: GameVector3;
    /**
     * An array of all supported voxel types
     * @category names
     */
    VoxelTypes: string[];
    /**
     * @param name the human readable name for the voxel
     * @returns the voxel id number
     * @category names
     */
    id: (name: string) => number;
    /**
     * @param id the numerical id of a voxel
     * @returns the human readable voxel name
     * @category names
     */
    name: (id: number) => string;
    /**
     * Sets a voxel in the grid
     * @param voxel The name of the voxel or its voxel id
     * @param rotation The rotation code of the voxel
     * @returns the id of the updated voxel
     */
    setVoxel: (x: number, y: number, z: number, voxel: number | string, rotation?: number | string) => number;
    /**
     * Get the type of a voxel at some point
     * @returns the voxel type code at point x/y/z
     */
    getVoxel: (x: number, y: number, z: number) => number;
    /**
     * Get the rotation of a voxel at point x/y/z
     * @returns the voxel rotation code
     */
    getVoxelRotation: (x: number, y: number, z: number) => number;
    /**
     * Sets a voxel in the grid directly using its id code
     * @category advanced
     */
    setVoxelId: (x: number, y: number, z: number, voxel: number) => number;
    /**
     * Retrieves the voxel id in the grid
     * @category advanced
     */
    getVoxelId: (x: number, y: number, z: number) => number;
    /**
     * @ignore
     */
    constructor(
        /**
         * Size of the voxel grid along the x/y/z dimensions
         */
        shape: GameVector3,
        /**
         * An array of all supported voxel types
         * @category names
         */
        VoxelTypes: string[],
        /**
         * @param name the human readable name for the voxel
         * @returns the voxel id number
         * @category names
         */
        id: (name: string) => number,
        /**
         * @param id the numerical id of a voxel
         * @returns the human readable voxel name
         * @category names
         */
        name: (id: number) => string,
        /**
         * Sets a voxel in the grid
         * @param voxel The name of the voxel or its voxel id
         * @param rotation The rotation code of the voxel
         * @returns the id of the updated voxel
         */
        setVoxel: (x: number, y: number, z: number, voxel: number | string, rotation?: number | string) => number,
        /**
         * Get the type of a voxel at some point
         * @returns the voxel type code at point x/y/z
         */
        getVoxel: (x: number, y: number, z: number) => number,
        /**
         * Get the rotation of a voxel at point x/y/z
         * @returns the voxel rotation code
         */
        getVoxelRotation: (x: number, y: number, z: number) => number,
        /**
         * Sets a voxel in the grid directly using its id code
         * @category advanced
         */
        setVoxelId: (x: number, y: number, z: number, voxel: number) => number,
        /**
         * Retrieves the voxel id in the grid
         * @category advanced
         */
        getVoxelId: (x: number, y: number, z: number) => number);
}
declare type GamePlayerEntity = GameEntity & {
    player: GamePlayer;
    isPlayer: true;
};
declare type GamePlayerEntityEvent = GameEntityEvent & {
    entity: GamePlayerEntity;
};
/**
 * A set of parameters which can be used to specify an entity
 */
interface GameEntityConfig {
    position: GameVector3;
    velocity: GameVector3;
    bounds: GameVector3;
    mass: number;
    friction: number;
    restitution: number;
    collides: boolean;
    fixed: boolean;
    gravity: boolean;
    mesh: string;
    meshColor: GameRGBAColor;
    meshScale: GameVector3;
    meshOrientation: GameQuaternion;
    meshMetalness: number;
    meshEmissive: number;
    meshShininess: number;
    particleRate: number;
    particleRateSpread: number;
    particleLimit: number;
    particleColor: GameRGBColor[];
    particleSize: number[];
    particleSizeSpread: number;
    particleLifetime: number;
    particleLifetimeSpread: number;
    particleVelocity: GameVector3;
    particleVelocitySpread: GameVector3;
    particleDamping: number;
    particleAcceleration: GameVector3;
    particleNoise: number;
    particleNoiseFrequency: number;
    particleTarget: GameEntity | null;
    particleTargetWeight: number;
    enableInteract: boolean;
    interactColor: GameRGBColor;
    interactHint: string;
    interactRadius: number;
    hurtSound: GameSoundEffectConfig;
    dieSound: GameSoundEffectConfig;
    interactSound: GameSoundEffectConfig;
    chatSound: GameSoundEffectConfig;
    id: string;
    tags: (() => string[]) | string[];
}
interface GameHurtOptions {
    attacker: GameEntity;
    damageType: string;
}
interface GameEntityKeyframe {
    duration: number;
    easeIn: GameEasing;
    easeOut: GameEasing;
    position: GameVector3;
    velocity: GameVector3;
    mass: number;
    friction: number;
    restitution: number;
    collides: boolean;
    fixed: boolean;
    gravity: boolean;
    mesh: string;
    meshInvisible: boolean;
    meshScale: GameVector3;
    meshOrientation: GameQuaternion;
    meshOffset: GameVector3;
    meshColor: GameRGBAColor;
    meshMetalness: number;
    meshEmissive: number;
    meshShininess: number;
    particleRate: number;
    particleRateSpread: number;
    particleLimit: number;
    particleLifetime: number;
    particleLifetimeSpread: number;
    particleVelocity: GameVector3;
    particleVelocitySpread: GameVector3;
    particleColor: GameRGBColor[];
    particleSize: number[];
    particleSizeSpread: number;
    particleDamping: number;
    particleAcceleration: GameVector3;
    particleNoise: number;
    particleNoiseFrequency: number;
    particleTarget: GameEntity | null;
    particleTargetWeight: number;
    interactColor: GameRGBColor;
}
/**
 * Entities are game objects in Game.  They can be used to encode things like players, objects, etc.
 */
declare class GameEntity implements GameEntityConfig {
    /**
     * Set of all tags assigned to the entity in the editor
     * @category selectors
     */
    tags: () => string[];
    /**
     * Adds a new tag to the entity
     * @category selectors
     */
    addTag: (tag: string) => void;
    /**
     * Removes a tag from the entity
     * @category selectors
     */
    removeTag: (tag: string) => void;
    /**
     * Tests if an entity has a tag
     * @category selectors
     */
    hasTag: (tag: string) => boolean;
    /**
     * Destroys the entity
     * @category destroy
     */
    destroy: () => void;
    /**
     * Called when the entity is destroyed
     * @category destroy
     */
    onDestroy: GameEventChannel<GameEntityEvent>;
    nextDestroy: GameEventFuture<GameEntityEvent>;
    /**
     * Called when entity takes damage
     * @category health
     */
    onTakeDamage: GameEventChannel<GameDamageEvent>;
    nextTakeDamage: GameEventFuture<GameDamageEvent>;
    /**
     * Called when an entity dies
     * @category health
     */
    onDie: GameEventChannel<GameDieEvent>;
    nextDie: GameEventFuture<GameDieEvent>;
    /**
     * Deals damage to an entity
     * @category health
     */
    hurt: (amount: number, options?: Partial<GameHurtOptions>) => void;
    /**
     * Makes the entity talk
     * @category chat
     */
    say: (message: string) => void;
    /**
     * Plays an animation on an entity
     */
    animate: (keyframes: Partial<GameEntityKeyframe>[], playbackInfo?: Partial<GameAnimationPlaybackConfig>) => GameAnimation<GameEntityKeyframe, GameEntity>;
    getAnimations: () => GameAnimation<GameEntityKeyframe, GameEntity>[];
    /**
     * Called whenever a player clicks on this entity
     */
    onClick: GameEventChannel<GameClickEvent>;
    nextClick: GameEventFuture<GameClickEvent>;
    /**
     * Called when the entity touches another entity
     * @category physics
     */
    onEntityContact: GameEventChannel<GameEntityContactEvent>;
    nextEntityContact: GameEventFuture<GameEntityContactEvent>;
    /**
     * Called when the entity stops touching another entity
     * @category physics
     */
    onEntitySeparate: GameEventChannel<GameEntityContactEvent>;
    nextEntitySeparate: GameEventFuture<GameEntityContactEvent>;
    /**
     * Called when the entity touches a voxel
     * @category physics
     */
    onVoxelContact: GameEventChannel<GameVoxelContactEvent>;
    nextVoxelContact: GameEventFuture<GameVoxelContactEvent>;
    /**
     * Called when the entity stops touching a voxel
     * @category physics
     */
    onVoxelSeparate: GameEventChannel<GameVoxelContactEvent>;
    nextVoxelSeparate: GameEventFuture<GameVoxelContactEvent>;
    /**
     * Called when the entity enters a fluid
     * @category physics
     */
    onFluidEnter: GameEventChannel<GameFluidContactEvent>;
    nextFluidEnter: GameEventFuture<GameFluidContactEvent>;
    /**
     * Called when the entity leaves a fluid
     * @category physics
     */
    onFluidLeave: GameEventChannel<GameFluidContactEvent>;
    nextFluidLeave: GameEventFuture<GameFluidContactEvent>;
    /**
     * Called when an entity interact with another entity
     * @category interactive
     */
    onInteract: GameEventChannel<GameInteractEvent>;
    nextInteract: GameEventFuture<GameInteractEvent>;
    /**
     * Play a sound effect at the location of this entity
     * @category sound
     */
    sound: (spec: {
        sample: string;
        radius?: number;
        pitch?: number;
        gain?: number;
    } | string) => Sound;
    /**
     * motion controller
     * @category motion
     */
    motion: GameMotionController<GameEntity>;
    /**
     * Name of entity seed in the editor
     * @category selectors
     */
    id: string;
    /**
     * If true, entity is destroyed.
     * @category destroy
     */
    destroyed: boolean;
    /**
     * @category physics
     */
    position: GameVector3;
    /**
     * @category physics
     */
    velocity: GameVector3;
    /**
     * Radius of the entity's bounding box along x/y/z
     * @category physics
     */
    bounds: GameVector3;
    /**
     * Mass of entity
     * @category physics
     */
    mass: number;
    /**
     * Controls object stickiness (0 = slippery, 1 = sticky)
     * @category physics
     */
    friction: number;
    /**
     * Controls bouncy (0 = soft, 1 = bouncy)
     * @category physics
     */
    restitution: number;
    /**
     * If false, object does not collide
     * @category physics
     */
    collides: boolean;
    /**
     * If false, object does not fall
     * @category physics
     */
    gravity: boolean;
    /**
     * If true, object does not move
     * @category physics
     */
    fixed: boolean;
    /**
     * Net contact force applied to this object
     * @category physics
     */
    contactForce: GameVector3;
    /**
     * Returns a list of all active body contacts
     * @category physics
     */
    entityContacts: GameEntityContact[];
    /**
     * Returns a list of all active voxel contacts
     * @category physics
     */
    voxelContacts: GameVoxelContact[];
    /**
     * Returns a list of all active fluid contacts
     * @category physics
     */
    fluidContacts: GameFluidContact[];
    /**
     * Hash of entity mesh.  If set to empty string/'' then entity does not have a mesh.
     * Unless object is a player, if mesh is set then mesh is used to compute object bounds
     * @category mesh
     */
    mesh: string;
    /**
     * Makes the mesh invisible
     * @category mesh
     */
    meshInvisible: boolean;
    /**
     * @category mesh
     */
    meshScale: GameVector3;
    /**
     * @category mesh
     */
    meshOrientation: GameQuaternion;
    /**
     * @category mesh
     */
    meshOffset: GameVector3;
    /**
     * @category mesh
     */
    meshColor: GameRGBAColor;
    /**
     * @category mesh
     */
    meshMetalness: number;
    /**
     * @category mesh
     */
    meshEmissive: number;
    /**
     * @category mesh
     */
    meshShininess: number;
    /**
     * @category health
     */
    enableDamage: boolean;
    /**
     * @category health
     */
    showHealthBar: boolean;
    /**
     * @category health
     */
    hp: number;
    /**
     * @category health
     */
    maxHp: number;
    /**
     * If true, then the entity is a player
     * @category player
     */
    isPlayer: boolean;
    /**
     * Reference to all player specific state and methods
     * @category player
     */
    player?: GamePlayer;
    /**
     * Particle emission in rate in particles / second
     * @category particle
     */
    particleRate: number;
    /**
     * Variability in particle emission.
     * @category particle
     */
    particleRateSpread: number;
    /**
     * Maxmimum number of particles this entity can emit
     * @category particle
     */
    particleLimit: number;
    /**
     * Particle color spline.  Maximum 5 entries, particles interpolate colors along these 5 points over their lifetime.
     * Colors are emissive values and can be any number between 0 and 256
     * @category particle
     */
    particleColor: GameRGBColor[];
    /**
     * Particle size spline.  Maximum 5 entries, particles interpolate size along these 5 points over their lifetime.
     * @category particle
     */
    particleSize: number[];
    /**
     * Particle size distribution
     * @category particle
     */
    particleSizeSpread: number;
    /**
     * Controls how long each particle lives in seconds
     * @category particle
     */
    particleLifetime: number;
    /**
     * Variation in particle lifetime in seconds
     * @category particle
     */
    particleLifetimeSpread: number;
    /**
     * Particle velocity bias.  Units are voxels/tick
     * @category particle
     */
    particleVelocity: GameVector3;
    /**
     * Particle velocity randomization range.  Units are voxels/tick
     * @category particle
     */
    particleVelocitySpread: GameVector3;
    /**
     * Particle damping exponent.
     * 0 = no damping
     * positive values slow particles
     * negative values accelerate particles
     * @category particle
     */
    particleDamping: number;
    /**
     * Particle acceleration/gravity force vector
     * Units are voxels/(tick^2)
     * @category particle
     */
    particleAcceleration: GameVector3;
    /**
     * Particle noise amplitude.  Affects particle movement
     * @category particle
     */
    particleNoise: number;
    /**
     * Particle noise frequency.  Increase rate of movement from noise bias
     * @category particle
     */
    particleNoiseFrequency: number;
    /**
     * Particle target entity
     * @category particle
     */
    particleTarget: GameEntity | null;
    /**
     * Particle target weight
     * @category particle
     */
    particleTargetWeight: number;
    /**
     * Enables interaction
     * @category interact
     */
    enableInteract: boolean;
    /**
     * Color of the interact hint text
     * @category interact
     */
    interactColor: GameRGBColor;
    /**
     * Hint text of interactive entity
     * @category interact
     */
    interactHint: string;
    /**
     * Radius around entity for interactivity
     * @category interact
     */
    interactRadius: number;
    /**
     * Plays when an entity chat
     * @category sound
     */
    chatSound: GameSoundEffect;
    /**
     * Plays when entity takes damage
     * @category sound
     */
    hurtSound: GameSoundEffect;
    /**
     * Plays when entity dies
     * @category sound
     */
    dieSound: GameSoundEffect;
    /**
     * Plays when entity is interacted with
     * @category sound
     */
    interactSound: GameSoundEffect;
    /**
     * @ignore
     */
    constructor(
        /**
         * Set of all tags assigned to the entity in the editor
         * @category selectors
         */
        tags: () => string[],
        /**
         * Adds a new tag to the entity
         * @category selectors
         */
        addTag: (tag: string) => void,
        /**
         * Removes a tag from the entity
         * @category selectors
         */
        removeTag: (tag: string) => void,
        /**
         * Tests if an entity has a tag
         * @category selectors
         */
        hasTag: (tag: string) => boolean,
        /**
         * Destroys the entity
         * @category destroy
         */
        destroy: () => void,
        /**
         * Called when the entity is destroyed
         * @category destroy
         */
        onDestroy: GameEventChannel<GameEntityEvent>, nextDestroy: GameEventFuture<GameEntityEvent>,
        /**
         * Called when entity takes damage
         * @category health
         */
        onTakeDamage: GameEventChannel<GameDamageEvent>, nextTakeDamage: GameEventFuture<GameDamageEvent>,
        /**
         * Called when an entity dies
         * @category health
         */
        onDie: GameEventChannel<GameDieEvent>, nextDie: GameEventFuture<GameDieEvent>,
        /**
         * Deals damage to an entity
         * @category health
         */
        hurt: (amount: number, options?: Partial<GameHurtOptions>) => void,
        /**
         * Makes the entity talk
         * @category chat
         */
        say: (message: string) => void,
        /**
         * Plays an animation on an entity
         */
        animate: (keyframes: Partial<GameEntityKeyframe>[], playbackInfo?: Partial<GameAnimationPlaybackConfig>) => GameAnimation<GameEntityKeyframe, GameEntity>, getAnimations: () => GameAnimation<GameEntityKeyframe, GameEntity>[],
        /**
         * Called whenever a player clicks on this entity
         */
        onClick: GameEventChannel<GameClickEvent>, nextClick: GameEventFuture<GameClickEvent>,
        /**
         * Called when the entity touches another entity
         * @category physics
         */
        onEntityContact: GameEventChannel<GameEntityContactEvent>, nextEntityContact: GameEventFuture<GameEntityContactEvent>,
        /**
         * Called when the entity stops touching another entity
         * @category physics
         */
        onEntitySeparate: GameEventChannel<GameEntityContactEvent>, nextEntitySeparate: GameEventFuture<GameEntityContactEvent>,
        /**
         * Called when the entity touches a voxel
         * @category physics
         */
        onVoxelContact: GameEventChannel<GameVoxelContactEvent>, nextVoxelContact: GameEventFuture<GameVoxelContactEvent>,
        /**
         * Called when the entity stops touching a voxel
         * @category physics
         */
        onVoxelSeparate: GameEventChannel<GameVoxelContactEvent>, nextVoxelSeparate: GameEventFuture<GameVoxelContactEvent>,
        /**
         * Called when the entity enters a fluid
         * @category physics
         */
        onFluidEnter: GameEventChannel<GameFluidContactEvent>, nextFluidEnter: GameEventFuture<GameFluidContactEvent>,
        /**
         * Called when the entity leaves a fluid
         * @category physics
         */
        onFluidLeave: GameEventChannel<GameFluidContactEvent>, nextFluidLeave: GameEventFuture<GameFluidContactEvent>,
        /**
         * Called when an entity interact with another entity
         * @category interactive
         */
        onInteract: GameEventChannel<GameInteractEvent>, nextInteract: GameEventFuture<GameInteractEvent>,
        /**
         * Play a sound effect at the location of this entity
         * @category sound
         */
        sound: (spec: {
            sample: string;
            radius?: number;
            pitch?: number;
            gain?: number;
        } | string) => Sound,
        /**
         * motion controller
         * @category motion
         */
        motion: GameMotionController<GameEntity>);
}
interface GameMotionConfig {
    name: string;
    iterations: number;
}
interface GameMotionClipConfig {
    motions: GameMotionConfig[];
    iterations: number;
}
declare class GameMotionController<TargetType> {
    /**
     * Create motion handler by name (could be motion list)
     */
    loadByName: (config: string | GameMotionConfig[] | GameMotionClipConfig) => GameMotionHandler<TargetType>;
    /**
     * Pause motion
     */
    pause: () => void;
    /**
     * Resume motion
     */
    resume: () => void;
    /**
     * Set default motion by name
     */
    setDefaultMotionByName: (motionName?: string) => void;
    /**
     * @ignore
     */
    constructor(
        /**
         * Create motion handler by name (could be motion list)
         */
        loadByName: (config: string | GameMotionConfig[] | GameMotionClipConfig) => GameMotionHandler<TargetType>,
        /**
         * Pause motion
         */
        pause: () => void,
        /**
         * Resume motion
         */
        resume: () => void,
        /**
         * Set default motion by name
         */
        setDefaultMotionByName: (motionName?: string) => void);
}
declare class GameMotionHandler<TargetType> {
    /**
     * Motion target object (entity)
     */
    readonly target: TargetType;
    /**
     * Starts playback for the motion.
     */
    play: () => void;
    /**
     * Cancels current motion playback
     */
    cancel: () => void;
    /**
     * Fires when motion completes successfully
     */
    onFinish: GameEventChannel<GameMotionEvent<TargetType>>;
    nextFinish: GameEventFuture<GameMotionEvent<TargetType>>;
    /**
     * @ignore
     */
    constructor(
        /**
         * Motion target object (entity)
         */
        target: TargetType,
        /**
         * Starts playback for the motion.
         */
        play: () => void,
        /**
         * Cancels current motion playback
         */
        cancel: () => void,
        /**
         * Fires when motion completes successfully
         */
        onFinish: GameEventChannel<GameMotionEvent<TargetType>>, nextFinish: GameEventFuture<GameMotionEvent<TargetType>>);
}
declare class GameMotionEvent<TargetType> {
    /**
     * Tick that click event occurred
     */
    tick: number;
    readonly target: TargetType;
    motionHandler: GameMotionHandler<TargetType>;
    cancelled: boolean;
    /**
     * @ignore
     */
    constructor(
        /**
         * Tick that click event occurred
         */
        tick: number, target: TargetType, motionHandler: GameMotionHandler<TargetType>, cancelled: boolean);
}
/**
 * An active entity pair contact
 */
declare class GameEntityContact {
    other: GameEntity;
    force: GameVector3;
    axis: GameVector3;
    constructor(other: GameEntity, force: GameVector3, axis: GameVector3);
}
/**
 * An active voxel contact state
 */
declare class GameVoxelContact {
    x: number;
    y: number;
    z: number;
    voxel: number;
    force: GameVector3;
    axis: GameVector3;
    constructor(x: number, y: number, z: number, voxel: number, force: GameVector3, axis: GameVector3);
}
/**
 * An active fluid contact
 */
declare class GameFluidContact {
    voxel: number;
    volume: number;
    constructor(voxel: number, volume: number);
}
/**
 * Player movement state
 */
declare enum GamePlayerMoveState {
    FLYING = "fly",
    GROUND = "ground",
    SWIM = "swim",
    FALL = "fall",
    JUMP = "jump",
    DOUBLE_JUMP = "jump2"
}
/**
 * Player walking state
 */
declare enum GamePlayerWalkState {
    NONE = "",
    CROUCH = "crouch",
    WALK = "walk",
    RUN = "run"
}
declare enum GameBodyPart {
    HIPS = "hips",
    TORSO = "torso",
    NECK = "neck",
    HEAD = "head",
    LEFT_SHOULDER = "leftShoulder",
    LEFT_UPPER_ARM = "leftUpperArm",
    LEFT_LOWER_ARM = "leftLowerArm",
    LEFT_HAND = "leftHand",
    LEFT_UPPER_LEG = "leftUpperLeg",
    LEFT_LOWER_LEG = "leftLowerLeg",
    LEFT_FOOT = "leftFoot",
    RIGHT_SHOULDER = "rightShoulder",
    RIGHT_UPPER_ARM = "rightUpperArm",
    RIGHT_LOWER_ARM = "rightLowerArm",
    RIGHT_HAND = "rightHand",
    RIGHT_UPPER_LEG = "rightUpperLeg",
    RIGHT_LOWER_LEG = "rightLowerLeg",
    RIGHT_FOOT = "rightFoot"
}
declare type GameSkinValue = string | undefined | null;
declare type GameSkin = {
    [key in GameBodyPart]: GameSkinValue;
};
declare type GameSkinInvisible = {
    [key in GameBodyPart]: boolean;
};
interface GameWearableSpec {
    bodyPart: GameBodyPart;
    mesh: string;
    color: GameRGBColor;
    emissive: number;
    metalness: number;
    shininess: number;
    orientation: GameQuaternion;
    scale: GameVector3;
    offset: GameVector3;
}
declare class GameWearable implements GameWearableSpec {
    /**
     * The player this wearable is attached to
     */
    player: GamePlayer | null;
    /**
     * Which body part this wearable is attached to
     */
    bodyPart: GameBodyPart;
    /**
     * The mesh of this wearable
     */
    mesh: string;
    /**
     * Optional color tint of the wearable
     */
    color: GameRGBColor;
    /**
     * Emissive modifier for wearable
     */
    emissive: number;
    /**
     * Metalness modifier for wearable
     */
    metalness: number;
    /**
     * Shininess modifier for wearable
     */
    shininess: number;
    /**
     * Orientation of wearable
     */
    orientation: GameQuaternion;
    /**
     * Scale of wearable along x/y/z
     */
    scale: GameVector3;
    /**
     * Offset of wearable
     */
    offset: GameVector3;
    remove(): void;
}
/**
 * Dialog stuff
 */
declare enum GameDialogType {
    TEXT = "text",
    SELECT = "select",
    INPUT = "input"
}
declare type GameDialogSelectResponse = {
    index: number;
    value: string;
};
declare type GameDialogResponse = GameDialogSelectResponse | string | null;
/**
 * Parameters for dialog
 */
declare type GameDialogParams = {
    /**
     * Type of dialog
     */
    type: GameDialogType;
    /**
     * Title of dialog
     */
    title?: string;
    /**
     * Message of dialog
     */
    content: string;
    /**
     * Background color of dialog
     */
    titleBackgroundColor?: GameRGBAColor;
    /**
     * Color of dialog text
     */
    titleTextColor?: GameRGBAColor;
    /**
     * Color of dialog background
     */
    contentBackgroundColor?: GameRGBAColor;
    /**
     * Color of text
     */
    contentTextColor?: GameRGBAColor;
    /**
     * Show an arrow in text dialog
     */
    hasArrow?: boolean;
    /**
     * Options for select dialog
     */
    options?: string[];
    /**
     * Default input text
     */
    placeholder?: string;
    /**
     * Confirm text for input
     */
    confirmText?: string;
    /**
     * Target for object
     */
    lookTarget?: GameVector3 | GameEntity;
    /**
     * If target entity is given, then offset from target entity
     */
    lookTargetOffset?: GameVector3;
    /**
     * Camera up vector
     */
    lookUp?: GameVector3;
    /**
     * Camera eye position
     */
    lookEye?: GameVector3 | GameEntity;
    /**
     * If camera eye is entity, then offset from entity location
     */
    lookEyeOffset?: GameVector3;
};
declare type GameTextDialogParams = {
    type: GameDialogType.TEXT;
    /**
     * Title of dialog
     */
    title?: string;
    /**
     * Message of dialog
     */
    content: string;
    /**
     * Background color of dialog
     */
    titleBackgroundColor?: GameRGBAColor;
    /**
     * Color of dialog text
     */
    titleTextColor?: GameRGBAColor;
    /**
     * Color of dialog background
     */
    contentBackgroundColor?: GameRGBAColor;
    /**
     * Color of text
     */
    contentTextColor?: GameRGBAColor;
    /**
     * If set, draw an arrow
     */
    hasArrow?: boolean;
    /**
     * Target for object
     */
    lookTarget?: GameVector3 | GameEntity;
    /**
     * If target entity is given, then offset from target entity
     */
    lookTargetOffset?: GameVector3;
    /**
     * Camera up vector
     */
    lookUp?: GameVector3;
    /**
     * Camera eye position
     */
    lookEye?: GameVector3 | GameEntity;
    /**
     * If camera eye is entity, then offset from entity location
     */
    lookEyeOffset?: GameVector3;
};
declare type GameSelectDialogParams = {
    type: GameDialogType.SELECT;
    /**
     * Title of dialog
     */
    title?: string;
    /**
     * Message for dialog
     */
    content: string;
    /**
     * Background color of dialog
     */
    titleBackgroundColor?: GameRGBAColor;
    /**
     * Color of dialog text
     */
    titleTextColor?: GameRGBAColor;
    /**
     * Color of dialog background
     */
    contentBackgroundColor?: GameRGBAColor;
    /**
     * Color of text
     */
    contentTextColor?: GameRGBAColor;
    /**
     * Option list
     */
    options: string[];
    /**
     * Target for object
     */
    lookTarget?: GameVector3 | GameEntity;
    /**
     * If target entity is given, then offset from target entity
     */
    lookTargetOffset?: GameVector3;
    /**
     * Camera up vector
     */
    lookUp?: GameVector3;
    /**
     * Camera eye position
     */
    lookEye?: GameVector3 | GameEntity;
    /**
     * If camera eye is entity, then offset from entity location
     */
    lookEyeOffset?: GameVector3;
};
declare type GameInputDialogParams = {
    type: GameDialogType.INPUT;
    /**
     * Title of dialog
     */
    title?: string;
    /**
     * Dialog message
     */
    content: string;
    /**
     * Background color of dialog
     */
    titleBackgroundColor?: GameRGBAColor;
    /**
     * Color of dialog text
     */
    titleTextColor?: GameRGBAColor;
    /**
     * Color of dialog background
     */
    contentBackgroundColor?: GameRGBAColor;
    /**
     * Color of text
     */
    contentTextColor?: GameRGBAColor;
    /**
     * Default text for input
     */
    placeholder?: string;
    /**
     * Confirmation text
     */
    confirmText?: string;
    /**
     * Target for object
     */
    lookTarget?: GameVector3 | GameEntity;
    /**
     * If target entity is given, then offset from target entity
     */
    lookTargetOffset?: GameVector3;
    /**
     * Camera up vector
     */
    lookUp?: GameVector3;
    /**
     * Camera eye position
     */
    lookEye?: GameVector3 | GameEntity;
    /**
     * If camera eye is entity, then offset from entity location
     */
    lookEyeOffset?: GameVector3;
};
declare type GameDialogCancelOption = {
    cancel: () => void;
};
/**
 * Dialog call signature
 */
declare type GameDialogCall = ((params: GameTextDialogParams) => Promise<string | null> & GameDialogCancelOption) | ((params: GameSelectDialogParams) => Promise<GameDialogSelectResponse | null> & GameDialogCancelOption) | ((params: GameInputDialogParams) => Promise<string | null> & GameDialogCancelOption);
declare enum GameCameraMode {
    FOLLOW = "follow",
    FPS = "fps",
    FIXED = "fixed",
    RELATIVE = "relative"
}
declare enum GameCameraFreezedAxis {
    NONE = "",
    X = "x",
    Y = "y",
    Z = "z",
    XY = "xy",
    XZ = "xz",
    YZ = "yz",
    XYZ = "xyz"
}
declare enum GameInputDirection {
    NONE = "none",
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal",
    BOTH = "both"
}
interface GamePlayerKeyframe {
    duration: number;
    easeIn: GameEasing;
    easeOut: GameEasing;
    scale: number;
    color: GameRGBColor;
    metalness: number;
    emissive: number;
    shininess: number;
    invisible: boolean;
    showName: boolean;
    showIndicator: boolean;
    colorLUT: string;
    cameraMode: GameCameraMode;
    cameraEntity: GameEntity | null;
    cameraTarget: GameVector3;
    cameraUp: GameVector3;
    cameraPosition: GameVector3;
    cameraFreezedAxis: GameCameraFreezedAxis;
    cameraFovY: number;
    cameraDistance: number;
}
/**
 * Players correspond to users which are connected to the game
 */
declare class GamePlayer {
    /**
     * Sends a private message directly to player
     * @category chat
     */
    directMessage: (message: string) => void;
    /**
     * Called whenever player initiates a chat event
     * @category chat
     */
    onChat: GameEventChannel<GameChatEvent>;
    nextChat: GameEventFuture<GameChatEvent>;
    /**
     * Called whenever player presses a button
     * @category input
     */
    onPress: GameEventChannel<GameInputEvent>;
    nextPress: GameEventFuture<GameInputEvent>;
    /**
     * Called whenever a player releases a buttin
     * @category input
     */
    onRelease: GameEventChannel<GameInputEvent>;
    nextRelease: GameEventFuture<GameInputEvent>;
    /**
     * @category health
     */
    onRespawn: GameEventChannel<GameRespawnEvent>;
    nextRespawn: GameEventFuture<GameRespawnEvent>;
    /**
     * @category health
     */
    forceRespawn: () => void;
    /**
     * Opens a dialog for this player
     * @category dialog
     */
    dialog: GameDialogCall;
    /**
     * Cancels any open dialogs for this player
     * @category dialog
     */
    cancelDialogs: () => void;
    /**
     * Opens a hyperlink on the client
     * @category web
     */
    link: (href: string, options?: {
        isConfirm?: boolean;
        isNewTab?: boolean;
    }) => void;
    /**
     * List all wearable objects attached to the player
     * @param bodyPart is an optional filter to show only wearables attached to a specific body part
     * @category display
     */
    wearables: (bodyPart?: GameBodyPart) => GameWearable[];
    /**
     * Attach a new wearable object to the player
     * @category display
     */
    addWearable: (spec: Partial<GameWearable>) => GameWearable;
    /**
     * Remove a wearable object from a player
     * @param wearable is the wearable to remove
     * @category display
     */
    removeWearable: (wearable: GameWearable) => void;
    /**
     * Set player skin by skin name
     * @category display
     */
    setSkinByName: (skinName: string) => void;
    /**
     * Reset player to default skin
     * @category display
     */
    resetToDefaultSkin: () => void;
    /**
     * Clear player custom skin and restore to avatar skin
     * @category display
     */
    clearSkin: () => void;
    /**
     * Play sound for player
     * @category sound
     */
    sound: (spec: {
        sample: string;
        gain?: number;
        pitch?: number;
    } | string) => Sound;
    /**
     * Play an animation
     */
    animate: (keyframes: Partial<GamePlayerKeyframe>[], playbackConfig?: GameAnimationPlaybackConfig) => GameAnimation<GamePlayerKeyframe, GamePlayer>;
    getAnimations: () => GameAnimation<GamePlayerKeyframe, GamePlayer>[];
    /**
     * Kick the user off the server
     */
    kick: () => void;
    /**
     * Reset camera pitch
     */
    setCameraPitch: (value: number) => void;
    /**
     * Reset camera pitch
     */
    setCameraYaw: (value: number) => void;
    /**
     * open product purchase dialog
     * @category web
     */
    openMarketplace: (productIds: number[]) => void;
    getMiaoShells: () => Promise<number>;
    /**
     * open share modal
     * @category web
     */
    share: (content: string) => void;
    /**
     * Name of the player.  Constant.
     */
    name: string;
    /**
     * user id for login player
     */
    userId: string;
    /**
     * Unique user key for this player.  Can be used to save their info into the database.
     */
    userKey: string;
    /**
     * User id of player if logged in.
     */
    boxId: string;
    /**
     * Player URL
     */
    url: URL;
    /**
     * Initial spawn point of player
     * @category spawn
     */
    spawnPoint: GameVector3;
    /**
     * Movement bounds
     * @category spawn
     */
    movementBounds: GameBounds3;
    /**
     * @category display
     */
    scale: number;
    /**
     * @category dipsplay
     */
    color: GameRGBColor;
    /**
     * @category display
     */
    metalness: number;
    /**
     * @category display
     */
    emissive: number;
    /**
     * @category display
     */
    shininess: number;
    /**
     * @category display
     */
    invisible: boolean;
    /**
     * @category display
     */
    showName: boolean;
    /**
     * @category display
     */
    showIndicator: boolean;
    /**
     * @category health
     */
    dead: boolean;
    /**
     * Color grading look up table, applied to player to tint game state
     */
    colorLUT: string;
    /**
     * Camera behavior mode.
     *  + `"FPS"` - First person camera
     *  + `"FOLLOW"` - Third person follow camera (default)
     *  + `"FIXED"` - Third person fixed camera
     *  + `"RELATIVE"` - Third person camera relative to player position
     * @category camera
     */
    cameraMode: GameCameraMode;
    /**
     * In FPS or FOLLOW mode, the entity which the player's camera follows
     * @category camera
     */
    cameraEntity: GameEntity | null;
    /**
     * Target point for the camera in FIXED mode
     * @category camera
     */
    cameraTarget: GameVector3;
    /**
     * Up vector for camera in FIXED mode
     * @category camera
     */
    cameraUp: GameVector3;
    /**
     * Eye position of camera in FIXED mode
     * @category camera
     */
    cameraPosition: GameVector3;
    /**
     * Freeze camera axis in RELATIVE mode
     * @category camera
     */
    cameraFreezedAxis: GameCameraFreezedAxis;
    /**
     * Camera fov y
     * @category camera
     */
    cameraFovY: number;
    /**
     * Camera distance
     * @category camera
     */
    cameraDistance: number;
    /**
     * If true, player is allowed to fly
     * @category movement
     */
    canFly: boolean;
    /**
     * If true, player is a ghost and can pass through walls
     * @category movement
     */
    spectator: boolean;
    /**
     * Maximum walking speed
     * @category movement
     */
    walkSpeed: number;
    /**
     * Walking acceleration
     * @category movement
     */
    walkAcceleration: number;
    /**
     * Maximum running speed
     * @category movement
     */
    runSpeed: number;
    /**
     * Running acceleration
     * @category movement
     */
    runAcceleration: number;
    /**
     * Crouching walk speed
     * @category movement
     */
    crouchSpeed: number;
    /**
     * Crouching walk acceleration
     * @category movement
     */
    crouchAcceleration: number;
    /**
     * Maximum swim speed
     * @category movement
     */
    swimSpeed: number;
    /**
     * Swim acceleration
     * @category movement
     */
    swimAcceleration: number;
    /**
     * Maximum flying speed
     * @category movement
     */
    flySpeed: number;
    /**
     * Flying acceleration
     * @category movement
     */
    flyAcceleration: number;
    /**
     * Jump speed
     * @category movement
     */
    jumpSpeedFactor: number;
    /**
     * Jump acceleration rate
     * @category movement
     */
    jumpAccelerationFactor: number;
    /**
     * Jump velocity impulse
     * @category movement
     */
    jumpPower: number;
    /**
     * Double jump velocity impulse
     * @category movement
     */
    doubleJumpPower: number;
    /**
     * @category movement
     */
    freezedForwardDirection: GameVector3 | null;
    /**
     * @category state
     */
    moveState: GamePlayerMoveState;
    /**
     * @category state
     */
    walkState: GamePlayerWalkState;
    /**
     * @category input
     */
    swapInputDirection: boolean;
    /**
     * @category input
     */
    reverseInputDirection: GameInputDirection;
    /**
     * @category input
     */
    disableInputDirection: GameInputDirection;
    /**
     * @category input
     */
    walkButton: boolean;
    /**
     * @category input
     */
    crouchButton: boolean;
    /**
     * @category input
     */
    jumpButton: boolean;
    /**
     * If true, player input button action 0 is enabled
     * @category input
     */
    enableAction0: boolean;
    /**
     * If true, player input button action 1 is enabled
     * @category input
     */
    enableAction1: boolean;
    /**
     * @category input
     */
    action0Button: boolean;
    /**
     * @category input
     */
    action1Button: boolean;
    /**
     * @category input
     */
    enableJump: boolean;
    /**
     * @category input
     */
    enableDoubleJump: boolean;
    /**
     * @category input
     */
    enableCrouch: boolean;
    /**
     * @category input
     */
    enable3DCursor: boolean;
    /**
     * @category input
     */
    facingDirection: GameVector3;
    /**
     * @category input
     */
    cameraYaw: number;
    /**
     * @category input
     */
    cameraPitch: number;
    /**
     * Plays when player respawns
     * @category sound
     */
    spawnSound: GameSoundEffect;
    /**
     * Plays when player jumps
     * @category sound
     */
    jumpSound: GameSoundEffect;
    /**
     * Plays when player double jumps
     * @category sound
     */
    doubleJumpSound: GameSoundEffect;
    /**
     * Plays when player lands
     * @category sound
     */
    landSound: GameSoundEffect;
    /**
     * Plays when player crouches
     * @category sound
     */
    crouchSound: GameSoundEffect;
    /**
     * Plays when player takes a step
     * @category sound
     */
    stepSound: GameSoundEffect;
    /**
     * Plays when player takes a single swim stroke
     * @category sound
     */
    swimSound: GameSoundEffect;
    /**
     * Plays when player presses action 0
     * @category sound
     */
    action0Sound: GameSoundEffect;
    /**
     * Plays when player presses action 1
     * @category sound
     */
    action1Sound: GameSoundEffect;
    /**
     * Plays when entity enters water
     * @category sound
     */
    enterWaterSound: GameSoundEffect;
    /**
     * Plays when entity leaves water
     * @category sound
     */
    leaveWaterSound: GameSoundEffect;
    /**
     * Sound for player start flying
     * @category sound
     */
    startFlySound: GameSoundEffect;
    /**
     * Sound for player stop flying
     * @category sound
     */
    stopFlySound: GameSoundEffect;
    /**
     * Background music for this player
     * @category sound
     */
    music: GameSoundEffect;
    /**
     * If true, then player can't chat
     * @category chat
     * @deprecated currently not in use
     */
    muted: boolean;
    /**
     * Skin parts
     * @category display
     */
    skin: GameSkin;
    /**
     * Skin parts invisible
     * @category display
     */
    skinInvisible: GameSkinInvisible;
    navigator: PlayerNavigator;
    /**
     * @ignore
     */
    constructor(
        /**
         * Sends a private message directly to player
         * @category chat
         */
        directMessage: (message: string) => void,
        /**
         * Called whenever player initiates a chat event
         * @category chat
         */
        onChat: GameEventChannel<GameChatEvent>, nextChat: GameEventFuture<GameChatEvent>,
        /**
         * Called whenever player presses a button
         * @category input
         */
        onPress: GameEventChannel<GameInputEvent>, nextPress: GameEventFuture<GameInputEvent>,
        /**
         * Called whenever a player releases a buttin
         * @category input
         */
        onRelease: GameEventChannel<GameInputEvent>, nextRelease: GameEventFuture<GameInputEvent>,
        /**
         * @category health
         */
        onRespawn: GameEventChannel<GameRespawnEvent>, nextRespawn: GameEventFuture<GameRespawnEvent>,
        /**
         * @category health
         */
        forceRespawn: () => void,
        /**
         * Opens a dialog for this player
         * @category dialog
         */
        dialog: GameDialogCall,
        /**
         * Cancels any open dialogs for this player
         * @category dialog
         */
        cancelDialogs: () => void,
        /**
         * Opens a hyperlink on the client
         * @category web
         */
        link: (href: string, options?: {
            isConfirm?: boolean;
            isNewTab?: boolean;
        }) => void,
        /**
         * List all wearable objects attached to the player
         * @param bodyPart is an optional filter to show only wearables attached to a specific body part
         * @category display
         */
        wearables: (bodyPart?: GameBodyPart) => GameWearable[],
        /**
         * Attach a new wearable object to the player
         * @category display
         */
        addWearable: (spec: Partial<GameWearable>) => GameWearable,
        /**
         * Remove a wearable object from a player
         * @param wearable is the wearable to remove
         * @category display
         */
        removeWearable: (wearable: GameWearable) => void,
        /**
         * Set player skin by skin name
         * @category display
         */
        setSkinByName: (skinName: string) => void,
        /**
         * Reset player to default skin
         * @category display
         */
        resetToDefaultSkin: () => void,
        /**
         * Clear player custom skin and restore to avatar skin
         * @category display
         */
        clearSkin: () => void,
        /**
         * Play sound for player
         * @category sound
         */
        sound: (spec: {
            sample: string;
            gain?: number;
            pitch?: number;
        } | string) => Sound,
        /**
         * Play an animation
         */
        animate: (keyframes: Partial<GamePlayerKeyframe>[], playbackConfig?: GameAnimationPlaybackConfig) => GameAnimation<GamePlayerKeyframe, GamePlayer>, getAnimations: () => GameAnimation<GamePlayerKeyframe, GamePlayer>[],
        /**
         * Kick the user off the server
         */
        kick: () => void,
        /**
         * Reset camera pitch
         */
        setCameraPitch: (value: number) => void,
        /**
         * Reset camera pitch
         */
        setCameraYaw: (value: number) => void,
        /**
         * post message to iframe parent
         * @category web
         */
        postMessage: (event: {
            type: string;
            value: object;
            isOld: boolean;
        }) => void,
        /**
         * add listener for message event of iframe parent
         * @category web
         */
        addEventListener: (type: NavigatorEventType, listener: (event: {
            data: object;
        }) => void) => void,
        /**
         * open product purchase dialog
         * @category web
         */
        openMarketplace: (productIds: number[]) => void, getMiaoShells: () => Promise<number>,
        /**
         * open share modal
         * @category web
         */
        share: (content: string) => void);
}
/**
 * Player ç”¨æˆ·è®¾å¤‡ç›¸å…³çš„æŽ¥å£
 */
declare class PlayerNavigator {
    emitEvent: (type: string, value: object) => void;
    addEventListener: (type: NavigatorEventType, listener: (event: {
        data: object;
    }) => void) => void;
    dispatchEvent: (type: string, value: object) => void;
    constructor(emitEvent: (type: string, value: object) => void, addEventListener: (type: NavigatorEventType, listener: (event: {
        data: object;
    }) => void) => void, dispatchEvent: (type: string, value: object) => void);
}
declare type NavigatorEventType = 'message';
/**
 * Result of performing a raycast.  Contains information about the raycast and what it hit.
 */
declare class GameRaycastResult {
    /**
     * If true, raycast hit an object
     */
    hit: boolean;
    /**
     * The entity hit by the raycast
     */
    hitEntity: GameEntity | null;
    /**
     * The voxel id hit by the raycast (0 if no voxel was hit)
     */
    hitVoxel: number;
    /**
     * Start point of the ray cast
     */
    origin: GameVector3;
    /**
     * Direction of the raycast
     */
    direction: GameVector3;
    /**
     * Distance traveled along the ray
     */
    distance: number;
    /**
     * Position of the ray intersection
     */
    hitPosition: GameVector3;
    /**
     * Normal vector on surface at point of intersection
     */
    normal: GameVector3;
    /**
     * If a voxel was hit, the grid coordinates of the hit voxel
     */
    voxelIndex: GameVector3;
    /**
     * @ignore
     */
    constructor(
        /**
         * If true, raycast hit an object
         */
        hit: boolean,
        /**
         * The entity hit by the raycast
         */
        hitEntity: GameEntity | null,
        /**
         * The voxel id hit by the raycast (0 if no voxel was hit)
         */
        hitVoxel: number,
        /**
         * Start point of the ray cast
         */
        origin: GameVector3,
        /**
         * Direction of the raycast
         */
        direction: GameVector3,
        /**
         * Distance traveled along the ray
         */
        distance: number,
        /**
         * Position of the ray intersection
         */
        hitPosition: GameVector3,
        /**
         * Normal vector on surface at point of intersection
         */
        normal: GameVector3,
        /**
         * If a voxel was hit, the grid coordinates of the hit voxel
         */
        voxelIndex: GameVector3);
}
/**
 * Configuration parameters passed into a raycast method
 */
interface GameRaycastOptions {
    /**
     * Maximum distance allowed for ray to travel
     */
    maxDistance: number;
    /**
     * If true, ignore fluid voxels
     */
    ignoreFluid: boolean;
    /**
     * If true, don't test intersection against voxels
     */
    ignoreVoxel: boolean;
    /**
     * If true, don't test intersection against entities
     */
    ignoreEntities: boolean;
    /**
     * Ignore selected entities
     */
    ignoreSelector: GameSelectorString;
}
/**
 * You can subscribe to events coming from some object using an EventChannel.
 *
 * Event channels take an event handler as input and return a token which can be used to cancel the handler.
 *
 * **Example:**
 * ```typescript
 * const token = world.onTick(() => console.log("tick !"));
 * setTimeout(() => {
 *      console.log('cancel tick handler');
 *      token.cancel();
 *      // no more tick events will be logged
 * }, 1000);
 * ```
 *
 * @param handler The handler callback which is invoked whenever the event is fired
 * @typeparam EventType The type of the event which is emitted by the channel
 * @returns An event handler token which can be used to cancel the event handler
 * @category events
 */
declare type GameEventChannel<EventType> = (handler: (event: EventType) => void) => GameEventHandlerToken;
/**
 * Promises give another way to work with events. You can use promises to organize long sequences of events
 * with structured programming.  In some cases this can lead to much simpler and cleaner code, but you must
 * use caution.  Asynchronous code can be interrupted when it is waiting, which means things in the world
 * can change outside your code.  Also errors generated in asynchronous code do not get stack traces,
 * which can complicate debugging.  Consider these things and use promises carefully
 *
 * **Example:**
 * ```typescript
 * // Wait for 2 players to enter the world
 * async function waitForPlayers (count) {
 *      while (world.querySelectorAll('player').length < 2) {
 *          const { entity } = await world.nextPlayerJoin();
 *          world.say(entity.player.name + ' joined');
 *      }
 * }
 *
 * waitForPlayers.then(() => world.say('game ready'));
 * ```
 *
 * @param filter An optional function which checks the type of event.  If the filter is not true, then the event is not dispatched.  If no filter is supplied, then the future will fire on the next event.
 * @typeparam EventType The type of the event which is emitted by the channel
 * @returns A promise which resolves once an event which matches the filter fires
 * @category events
 */
declare type GameEventFuture<EventType> = (filter?: (event: EventType) => boolean) => Promise<EventType>;
/**
 * Returned by a {@link Game.GameEventChannel} whenever a handler is registered.  Can be used to cancel the handler.
 * @category events
 */
declare class GameEventHandlerToken {
    /**
     * Cancels the event handler
     */
    cancel: () => void;
    /**
     * Resumes listening with the event handler
     */
    resume: () => void;
    /**
     * Checks if the handler is active
     */
    active: () => boolean;
    /**
     * @ignore
     */
    constructor(
        /**
         * Cancels the event handler
         */
        cancel: () => void,
        /**
         * Resumes listening with the event handler
         */
        resume: () => void,
        /**
         * Checks if the handler is active
         */
        active: () => boolean);
}
/**
 * An event which is fired each tick by {@link Game.GameWorld.onTick}.
 * @category events
 */
declare class GameTickEvent {
    /**
     * Tick at which the event was fired
     */
    tick: number;
    /**
     * Last tick which was handled
     */
    prevTick: number;
    /**
     * If we had to skip any ticks due to the scripts lagging
     */
    skip: boolean;
    /**
     * Wall clock time between ticks
     */
    elapsedTimeMS: number;
    /**
     * @ignore
     */
    constructor(
        /**
         * Tick at which the event was fired
         */
        tick: number,
        /**
         * Last tick which was handled
         */
        prevTick: number,
        /**
         * If we had to skip any ticks due to the scripts lagging
         */
        skip: boolean,
        /**
         * Wall clock time between ticks
         */
        elapsedTimeMS: number);
}
/**
 * An event which is fired whenever some entity is created or destroyed.
 * Triggered by {@link Game.GameWorld.onPlayerJoin}, {@link Game.GameWorld.onPlayerLeave}, {@link Game.GameWorld.onEntityCreate}, {@link Game.GameWorld.onEntityDestroy} and {@link Game.GameEntity.onDestroy}
 * @category events
 */
declare class GameEntityEvent {
    /**
     * The time the event occured
     */
    tick: number;
    /**
     * The entity that was created/destroyed
     */
    entity: GameEntity;
    /**
     * @ignore
     */
    constructor(
        /**
         * The time the event occured
         */
        tick: number,
        /**
         * The entity that was created/destroyed
         */
        entity: GameEntity);
}
/**
 * Fired whenever an entity activates or deactivates a trigger
 * @category events
 */
declare class GameTriggerEvent {
    /**
     * Time event occured
     */
    tick: number;
    /**
     * Entity which triggered event
     */
    entity: GameEntity;
    /**
     * @ignore
     */
    constructor(
        /**
         * Time event occured
         */
        tick: number,
        /**
         * Entity which triggered event
         */
        entity: GameEntity);
}
/**
 * Fired whenever an entity takes damage
 * Triggered by {@link Game.GameWorld.onTakeDamage} {@link Game.GameEntity.onTakeDamage}
 * @category events
 */
declare class GameDamageEvent {
    /**
     * Time event occured
     */
    tick: number;
    /**
     * Entity which received damage
     */
    entity: GameEntity;
    /**
     * Amount of damage
     */
    damage: number;
    /**
     * Entity attacker
     */
    attacker: GameEntity | null;
    /**
     * Damage type
     */
    damageType: string;
    /**
     * @ignore
     */
    constructor(
        /**
         * Time event occured
         */
        tick: number,
        /**
         * Entity which received damage
         */
        entity: GameEntity,
        /**
         * Amount of damage
         */
        damage: number,
        /**
         * Entity attacker
         */
        attacker: GameEntity | null,
        /**
         * Damage type
         */
        damageType: string);
}
/**
 * Fired whenever an entity takes dies.
 * Triggered by {@link Game.GameWorld.onTakeDamage} {@link Game.GameEntity.onTakeDamage}
 * @category events
 */
declare class GameDieEvent {
    /**
     * Time event occured
     */
    tick: number;
    /**
     * Entity which received damage
     */
    entity: GameEntity;
    /**
     * Entity attacker
     */
    attacker: GameEntity | null;
    /**
     * Damage type
     */
    damageType: string;
    /**
     * @ignore
     */
    constructor(
        /**
         * Time event occured
         */
        tick: number,
        /**
         * Entity which received damage
         */
        entity: GameEntity,
        /**
         * Entity attacker
         */
        attacker: GameEntity | null,
        /**
         * Damage type
         */
        damageType: string);
}
/**
 * Triggered whenever a player respawns
 * @category events
 */
declare class GameRespawnEvent {
    /**
     * Time event occured
     */
    tick: number;
    /**
     * Entity which received damage
     */
    entity: GamePlayerEntity;
    /**
     * @ignore
     */
    constructor(
        /**
         * Time event occured
         */
        tick: number,
        /**
         * Entity which received damage
         */
        entity: GamePlayerEntity);
}
/**
 * An event which is fired whenever two entities collide
 * Triggered by {@link Game.GameWorld.onEntityContact}, {@link Game.GameWorld.onEntitySeparate}, {@link Game.GameEntity.onEntityContact}, {@link Game.GameEntity.onEntitySeparate}
 * @category events
 */
declare class GameEntityContactEvent {
    /**
     * Time at which the entities collided
     */
    tick: number;
    /**
     * The first entity in the pair
     */
    entity: GameEntity;
    /**
     * The second entity in the pair
     */
    other: GameEntity;
    /**
     * The separating axis of the collision
     */
    axis: GameVector3;
    /**
     * The amount of force imparted by the collision
     */
    force: GameVector3;
    /**
     * @ignore
     */
    constructor(
        /**
         * Time at which the entities collided
         */
        tick: number,
        /**
         * The first entity in the pair
         */
        entity: GameEntity,
        /**
         * The second entity in the pair
         */
        other: GameEntity,
        /**
         * The separating axis of the collision
         */
        axis: GameVector3,
        /**
         * The amount of force imparted by the collision
         */
        force: GameVector3);
}
/**
 * An event which is fired whenever an entity comes into contact with terrain
 * Triggered by {@link Game.GameWorld.onVoxelContact}, {@link Game.GameWorld.onVoxelSeparate}, {@link Game.GameEntity.onVoxelContact}, {@link Game.GameEntity.onVoxelSeparate}
 * @category events
 */
declare class GameVoxelContactEvent {
    /**
     * The time of the contact event
     */
    tick: number;
    /**
     * The entity which touched the terrain
     */
    entity: GameEntity;
    /**
     * x coordinate of voxel which was touched
     */
    x: number;
    /**
     * y coordinate of voxel which was touched
     */
    y: number;
    /**
     * z coordinate of voxel which was touched
     */
    z: number;
    /**
     * id of voxel
     */
    voxel: number;
    /**
     * Separating axis
     */
    axis: GameVector3;
    /**
     * Collision force
     */
    force: GameVector3;
    /**
     * @ignore
     */
    constructor(
        /**
         * The time of the contact event
         */
        tick: number,
        /**
         * The entity which touched the terrain
         */
        entity: GameEntity,
        /**
         * x coordinate of voxel which was touched
         */
        x: number,
        /**
         * y coordinate of voxel which was touched
         */
        y: number,
        /**
         * z coordinate of voxel which was touched
         */
        z: number,
        /**
         * id of voxel
         */
        voxel: number,
        /**
         * Separating axis
         */
        axis: GameVector3,
        /**
         * Collision force
         */
        force: GameVector3);
}
/**
 * An event which is fired whenever an entity enters or leaves a fluid
 * Triggered by {@link Game.GameWorld.onFluidEnter}, {@link Game.GameWorld.onFluidLeave}, {@link Game.GameEntity.onFluidEnter}, {@link Game.GameEntity.onFluidLeave}
 * @category events
 */
declare class GameFluidContactEvent {
    /**
     * Time event occured
     */
    tick: number;
    /**
     * Entity which modified
     */
    entity: GameEntity;
    /**
     * The id of the fluid voxel
     */
    voxel: number;
    /**
     * @ignore
     */
    constructor(
        /**
         * Time event occured
         */
        tick: number,
        /**
         * Entity which modified
         */
        entity: GameEntity,
        /**
         * The id of the fluid voxel
         */
        voxel: number);
}
/**
 * Triggered by {@link Game.GameWorld.onChat} and {@link Game.GameEntity.onChat}
 * @category events
 */
declare class GameChatEvent {
    /**
     * Time chat event occured
     */
    tick: number;
    /**
     * Entity which initiated chat event
     */
    entity: GameEntity;
    /**
     * What the entity said in the chat event
     */
    message: string;
    /**
     * @ignore
     */
    constructor(
        /**
         * Time chat event occured
         */
        tick: number,
        /**
         * Entity which initiated chat event
         */
        entity: GameEntity,
        /**
         * What the entity said in the chat event
         */
        message: string);
}
/**
 * Triggered by {@link Game.GameWorld.onPlayerPurchaseSuccess}
 * @category events
 */
declare class GamePurchaseSuccessEvent {
    /**
     * Time purchase success event occured
     */
    tick: number;
    /**
     * Entity which trigger purchase event
     */
    userId: string;
    /**
     * purchase product id
     */
    productId: number;
    /**
     * purchase success order number
     */
    orderId: number;
    /**
     * @ignore
     */
    constructor(
        /**
         * Time purchase success event occured
         */
        tick: number,
        /**
         * Entity which trigger purchase event
         */
        userId: string,
        /**
         * purchase product id
         */
        productId: number,
        /**
         * purchase success order number
         */
        orderId: number);
}
/**
 * Triggered by {@link Game.GameWorld.onInteract} and {@link Game.GameEntity.onInteract}
 * @category events
 */
declare class GameInteractEvent {
    /**
     * Time of event
     */
    tick: number;
    /**
     * Entity initiating interaction
     */
    entity: GamePlayerEntity;
    /**
     * Entity which received interaction
     */
    targetEntity: GameEntity;
    /**
     * @ignore
     */
    constructor(
        /**
         * Time of event
         */
        tick: number,
        /**
         * Entity initiating interaction
         */
        entity: GamePlayerEntity,
        /**
         * Entity which received interaction
         */
        targetEntity: GameEntity);
}
/**
 * Type of a button pressed by a player
 * @category events
 */
declare enum GameButtonType {
    WALK = "walk",
    RUN = "run",
    CROUCH = "crouch",
    JUMP = "jump",
    DOUBLE_JUMP = "jump2",
    FLY = "fly",
    ACTION0 = "action0",
    ACTION1 = "action1"
}
/**
 * Input events are generated whenever a player presses a button.
 * The tick of an event occurs at the exact instant the button was pressed by the player.
 * Triggered by {@link Game.GameWorld.onPress}, {@link Game.GameWorld.onRelease}, {@link Game.GamePlayer.onPress}, {@link Game.GamePlayer.onRelease}
 * @category events
 */
declare class GameInputEvent {
    /**
     * The time the button was pressed
     */
    tick: number;
    /**
     * A reference to the player which pressed the button
     */
    entity: GamePlayerEntity;
    /**
     * The position of the entity at the time the pressed the button
     */
    position: GameVector3;
    /**
     * The button which was input by the player
     */
    button: GameButtonType;
    /**
     * If true, then this is a press event.  Otherwise if false this is a release event
     */
    pressed: boolean;
    /**
     * The result of a raycast query initiated by the player at the exact instant they pressed the button from the perspective of their camera.
     */
    raycast: GameRaycastResult;
    /**
     * @ignore
     */
    constructor(
        /**
         * The time the button was pressed
         */
        tick: number,
        /**
         * A reference to the player which pressed the button
         */
        entity: GamePlayerEntity,
        /**
         * The position of the entity at the time the pressed the button
         */
        position: GameVector3,
        /**
         * The button which was input by the player
         */
        button: GameButtonType,
        /**
         * If true, then this is a press event.  Otherwise if false this is a release event
         */
        pressed: boolean,
        /**
         * The result of a raycast query initiated by the player at the exact instant they pressed the button from the perspective of their camera.
         */
        raycast: GameRaycastResult);
}
declare class GameClickEvent {
    /**
     * Tick that click event occurred
     */
    tick: number;
    /**
     * Entity that got clicked
     */
    entity: GameEntity;
    /**
     * Entity which initiated the click event
     */
    clicker: GamePlayerEntity;
    /**
     * Button which was pressed ACTION0 = LeftClick, ACTION1 = RightClick
     */
    button: GameButtonType.ACTION0 | GameButtonType.ACTION1;
    /**
     * Distance from clicker to entity
     */
    distance: number;
    /**
     * Position of clicker at time of click
     */
    clickerPosition: GameVector3;
    /**
     * Raycast from clicker -> entity
     */
    raycast: GameRaycastResult;
    /**
     * @ignore
     */
    constructor(
        /**
         * Tick that click event occurred
         */
        tick: number,
        /**
         * Entity that got clicked
         */
        entity: GameEntity,
        /**
         * Entity which initiated the click event
         */
        clicker: GamePlayerEntity,
        /**
         * Button which was pressed ACTION0 = LeftClick, ACTION1 = RightClick
         */
        button: GameButtonType.ACTION0 | GameButtonType.ACTION1,
        /**
         * Distance from clicker to entity
         */
        distance: number,
        /**
         * Position of clicker at time of click
         */
        clickerPosition: GameVector3,
        /**
         * Raycast from clicker -> entity
         */
        raycast: GameRaycastResult);
}
declare class GameAnimationEvent<KeyframeType, TargetType> {
    tick: number;
    target: TargetType;
    animation: GameAnimation<KeyframeType, TargetType>;
    cancelled: boolean;
    /**
     * @ignore
     */
    constructor(tick: number, target: TargetType, animation: GameAnimation<KeyframeType, TargetType>, cancelled: boolean);
}
/**
 * Selectors are a powerful syntax for searching all of the objects in a game.  The interface for selectors in game is modeled after the DOM APIs.
 *
 * * ```javascript
 * const entities = world.querySelector('*');           // all entities in the world
 * const players = world.querySelectorAll('player');    // all players in the game
 * const theChair = world.querySelector('#chair');      // the first entity whose id is "chair"
 * const boxes = world.querySelectorAll('.box');        // all entities tagged with "box"
 * const boxChair = world.querySelector('.box .red');
 * ```
 */
declare type GameSelectorString = string;
/**
 * Interface for all project resources
 */
declare class GameResourceSystem {
    ls: (path?: string) => GameAssetListEntry[];
    constructor(ls: (path?: string) => GameAssetListEntry[]);
}
/**
 * Describes the type of an asset
 */
declare enum GameAssetType {
    VOXEL_MESH = "mesh",
    DIRECTORY = "directory",
    COLOR_LUT = "lut",
    JS_SCRIPT = "js",
    IMAGE = "image",
    PARTICLE_TEXTURE = "snow",
    SOUND = "sound"
}
/**
 * An entry from an asset list
 */
declare class GameAssetListEntry {
    /**
     * Fully qualified path of asset, split by directory
     */
    path: string;
    /**
     * Type of asset
     */
    type: GameAssetType;
    /**
     * @ignore
     */
    constructor(
        /**
         * Fully qualified path of asset, split by directory
         */
        path: string,
        /**
         * Type of asset
         */
        type: GameAssetType);
}
/**
 * A standard SQL database
 */
declare class GameDatabase {
    /**
     * Executes a SQL query on this database
     */
    sql: (sql: string[], ...params: (number | string | Uint8Array | boolean | null)[]) => GameQueryResult;
    /**
     * @ignore
     */
    constructor(
        /**
         * Executes a SQL query on this database
         */
        sql: (sql: string[], ...params: (number | string | Uint8Array | boolean | null)[]) => GameQueryResult);
}
/**
 * Query result api
 */
declare class GameQueryResult implements AsyncIterable<any> {
    next: () => Promise<{
        done: boolean;
        value: any;
    }>;
    [Symbol.asyncIterator](): this;
    return: () => Promise<{
        done: boolean;
        value: any;
    }>;
    throw: (err: any) => Promise<{
        done: boolean;
        value: any;
    }>;
    then: (resolve: (rows: any[]) => any, reject: (err: any) => any) => void;
    /**
     * @ignore
     */
    constructor(next: () => Promise<{
        done: boolean;
        value: any;
    }>, abort: () => Promise<{
        done: boolean;
        value: any;
    }>, error: (err: any) => Promise<{
        done: boolean;
        value: any;
    }>, then: (resolve: (rows: any[]) => any, reject: (err: any) => any) => void);
}
/**
 * é”™è¯¯ç è§„èŒƒï¼š{status:T; code:number, msg: string}
 * code: é”™è¯¯ç 
 * status: é”™è¯¯ç±»åž‹
 * msg: é”™è¯¯æè¿°
 */
declare type CommonError<T> = {
    status: T;
    code: number;
    msg: string;
};


interface GameGUIEvent {
    entity: GamePlayerEntity;
    name: string;
    payload: any;
}
interface GameGUIEventListener {
    (event: GameGUIEvent): void;
}
declare class GameGUI {
    init: <T extends string, U extends T>(entity: GamePlayerEntity, config: GUIConfig<T, U>) => Promise<void>;
    show: (entity: GamePlayerEntity, name: string, allowMultiple?: boolean) => Promise<void>;
    remove: (entity: GamePlayerEntity, selector: string) => Promise<void>;
    getAttribute: (entity: GamePlayerEntity, selector: string, name: string) => Promise<any>;
    setAttribute: (entity: GamePlayerEntity, selector: string, name: string, value: any) => Promise<void>;
    onMessage: (listener: GameGUIEventListener) => void;
    ui: InstanceType<any>['ui'];
    constructor(init: <T extends string, U extends T>(entity: GamePlayerEntity, config: GUIConfig<T, U>) => Promise<void>, show: (entity: GamePlayerEntity, name: string, allowMultiple?: boolean) => Promise<void>, remove: (entity: GamePlayerEntity, selector: string) => Promise<void>, getAttribute: (entity: GamePlayerEntity, selector: string, name: string) => Promise<any>, setAttribute: (entity: GamePlayerEntity, selector: string, name: string, value: any) => Promise<void>, onMessage: (listener: GameGUIEventListener) => void);
}
declare type GameHttpFetchHeaders = {
    [name: string]: string | string[];
};
declare type GameHttpFetchRequestOptions = {
    timeout?: number;
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';
    headers?: GameHttpFetchHeaders;
    body?: string | ArrayBuffer;
};
declare class GameHttpFetchResponse {
    status: number;
    statusText: string;
    headers: GameHttpFetchHeaders;
    json: () => Promise<any>;
    text: () => Promise<string>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    close: () => Promise<void>;
    constructor(status: number, statusText: string, headers: GameHttpFetchHeaders, json: () => Promise<any>, text: () => Promise<string>, arrayBuffer: () => Promise<ArrayBuffer>, close: () => Promise<void>);
    get ok(): boolean;
}
declare class GameHttpRequest {
}
declare class GameHttpResponse {
}
declare type GameHttpHandler = (request: GameHttpRequest, response: GameHttpResponse) => void;
declare class GameHttpAPI {
    fetch: (url: string, options?: GameHttpFetchRequestOptions) => Promise<GameHttpFetchResponse>;
    constructor(fetch: (url: string, options?: GameHttpFetchRequestOptions) => Promise<GameHttpFetchResponse>);
}
declare class GameQuaternion {
    w: number;
    x: number;
    y: number;
    z: number;
    constructor(w: number, x: number, y: number, z: number);
    static rotationBetween(a: GameVector3, b: GameVector3): GameQuaternion;
    static fromAxisAngle(axis: GameVector3, rad: number): GameQuaternion;
    static fromEuler(x: number, y: number, z: number): GameQuaternion;
    set(w: number, x: number, y: number, z: number): GameQuaternion;
    copy(q: GameQuaternion): GameQuaternion;
    getAxisAngle(_q: GameQuaternion): {
        axis: GameVector3;
        angle: number;
    };
    rotateX(_rad: number): GameQuaternion;
    rotateY(_rad: number): GameQuaternion;
    rotateZ(_rad: number): GameQuaternion;
    dot(q: GameQuaternion): number;
    add(v: GameQuaternion): GameQuaternion;
    sub(v: GameQuaternion): GameQuaternion;
    angle(q: GameQuaternion): number;
    mul(q: GameQuaternion): GameQuaternion;
    inv(): GameQuaternion;
    div(q: GameQuaternion): GameQuaternion;
    slerp(q: GameQuaternion, n: number): GameQuaternion;
    mag(): number;
    sqrMag(): number;
    normalize(): GameQuaternion;
    equals(q: GameQuaternion): boolean;
    clone(): GameQuaternion;
    toString(): string;
}
declare class GameVector3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
    static fromPolar(mag: number, phi: number, theta: number): GameVector3;
    set(x: number, y: number, z: number): GameVector3;
    copy(v: GameVector3): GameVector3;
    add(v: GameVector3): GameVector3;
    sub(v: GameVector3): GameVector3;
    mul(v: GameVector3): GameVector3;
    div(v: GameVector3): GameVector3;
    addEq(v: GameVector3): GameVector3;
    subEq(v: GameVector3): GameVector3;
    mulEq(v: GameVector3): GameVector3;
    divEq(v: GameVector3): GameVector3;
    dot(v: GameVector3): number;
    cross(v: GameVector3): GameVector3;
    scale(n: number): GameVector3;
    clone(): GameVector3;
    lerp(v: GameVector3, n: number): GameVector3;
    mag(): number;
    sqrMag(): number;
    towards(v: GameVector3): GameVector3;
    distance(v: GameVector3): number;
    normalize(): GameVector3;
    angle(v: GameVector3): number;
    max(v: GameVector3): GameVector3;
    min(v: GameVector3): GameVector3;
    exactEquals(v: GameVector3): boolean;
    equals(v: GameVector3): boolean;
    toString(): string;
}
declare class GameBounds3 {
    lo: GameVector3;
    hi: GameVector3;
    constructor(lo: GameVector3, hi: GameVector3);
    static fromPoints(...points: GameVector3[]): GameBounds3;
    intersect(b: GameBounds3): GameBounds3;
    contains(b: GameVector3): boolean;
    containsBounds(b: GameBounds3): boolean;
    intersects(b: GameBounds3): boolean;
    set(lox: number, loy: number, loz: number, hix: number, hiy: number, hiz: number): GameBounds3;
    copy(b: GameBounds3): GameBounds3;
    toString(): string;
}
declare class GameRGBAColor {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number);
    set(r: number, g: number, b: number, a: number): GameRGBAColor;
    copy(c: GameRGBAColor): GameRGBAColor;
    add(rgba: GameRGBAColor): GameRGBAColor;
    sub(rgba: GameRGBAColor): GameRGBAColor;
    mul(rgba: GameRGBAColor): GameRGBAColor;
    div(rgba: GameRGBAColor): GameRGBAColor;
    addEq(rgba: GameRGBAColor): GameRGBAColor;
    subEq(rgba: GameRGBAColor): GameRGBAColor;
    mulEq(rgba: GameRGBAColor): GameRGBAColor;
    divEq(rgba: GameRGBAColor): GameRGBAColor;
    lerp(rgba: GameRGBAColor, n: number): GameRGBAColor;
    blendEq(rgb: GameRGBColor): GameRGBColor;
    equals(rgba: GameRGBAColor): boolean;
    clone(): GameRGBAColor;
    toString(): string;
}
declare class GameRGBColor {
    r: number;
    g: number;
    b: number;
    static random(): GameRGBColor;
    constructor(r: number, g: number, b: number);
    set(r: number, g: number, b: number): GameRGBColor;
    copy(c: GameRGBColor): GameRGBColor;
    add(rgb: GameRGBColor): GameRGBColor;
    sub(rgb: GameRGBColor): GameRGBColor;
    mul(rgb: GameRGBColor): GameRGBColor;
    div(rgb: GameRGBColor): GameRGBColor;
    addEq(rgb: GameRGBColor): GameRGBColor;
    subEq(rgb: GameRGBColor): GameRGBColor;
    mulEq(rgb: GameRGBColor): GameRGBColor;
    divEq(rgb: GameRGBColor): GameRGBColor;
    lerp(rgb: GameRGBColor, n: number): GameRGBColor;
    equals(rgb: GameRGBColor): boolean;
    clone(): GameRGBColor;
    toRGBA(): GameRGBAColor;
    toString(): string;
}


declare type SendClientEventType = (entities: GamePlayerEntity | GamePlayerEntity[], clientEvent: JSONValue) => void;
declare type ServerEvent = {
    tick: number;
    entity: GamePlayerEntity;
    args: JSONValue;
};
declare class ServerRemoteChannel {
    sendClientEvent: SendClientEventType;
    broadcastClientEvent: (clientEvent: JSONValue) => void;
    onServerEvent: GameEventChannel<ServerEvent>;
    constructor(sendClientEvent: SendClientEventType, broadcastClientEvent: (clientEvent: JSONValue) => void, onServerEvent: GameEventChannel<ServerEvent>);
}

declare class GameRTCChannel {
    add: (entity: GamePlayerEntity) => Promise<void>;
    remove: (entity: GamePlayerEntity) => Promise<void>;
    unpublish: (entity: GamePlayerEntity) => Promise<void>;
    publishMicrophone: (entity: GamePlayerEntity) => Promise<void>;
    getPlayers: () => Promise<GamePlayerEntity[]>;
    destroy: () => Promise<void>;
    getVolume: (entity: GamePlayerEntity) => Promise<number>;
    setVolume: (entity: GamePlayerEntity, volume: number) => Promise<void>;
    getMicrophonePermission: (entity: GamePlayerEntity) => Promise<boolean>;
    constructor(add: (entity: GamePlayerEntity) => Promise<void>, remove: (entity: GamePlayerEntity) => Promise<void>, unpublish: (entity: GamePlayerEntity) => Promise<void>, publishMicrophone: (entity: GamePlayerEntity) => Promise<void>, getPlayers: () => Promise<GamePlayerEntity[]>, destroy: () => Promise<void>, getVolume: (entity: GamePlayerEntity) => Promise<number>, setVolume: (entity: GamePlayerEntity, volume: number) => Promise<void>, getMicrophonePermission: (entity: GamePlayerEntity) => Promise<boolean>);
}
declare class GameRTC {
    createChannel: (channelId?: string) => Promise<GameRTCChannel>;
    constructor(createChannel: (channelId?: string) => Promise<GameRTCChannel>);
}

declare type DB_ERROR_STATUS = 'CONSTRAINT_TARGET_INVALID' | 'PARAMS_INVALID' | 'DB_NAME_INVALID' | 'KEY_INVALID' | 'VALUE_INVALID' | 'SERVER_FETCH_ERROR' | 'REQUEST_THROTTLED' | 'UNKNOWN';
declare class GameStorage implements I.GameStorage {
    getDataStorage: (key: string) => GameDataStorage;
    getGroupStorage: (key: string) => GameDataStorage | undefined;
    constructor(getDataStorage: (key: string) => GameDataStorage, getGroupStorage: (key: string) => GameDataStorage | undefined);
}
declare type JSONValue = I.JSONValue;
declare type ResultValue = {
    key: string;
    value: JSONValue;
    version: string;
    updateTime: number;
    createTime: number;
};
declare type ListReturnValue = {
    items: ResultValue[];
    isLastPage: boolean;
};
declare type ReturnValue = I.ReturnValue;
declare type ListPageOptions = I.ListPageOptions;
/**
 *
 * A Data storage class
 * @export
 * @class GameDataStorage
 */
declare class GameDataStorage implements I.GameDataStorage {
    readonly key: string;
    set: (key: string, value: JSONValue) => Promise<void>;
    update: (key: string, handler: (prevValue: ReturnValue) => JSONValue) => Promise<void>;
    get: (key: string) => Promise<ReturnValue>;
    list: (options: ListPageOptions) => Promise<QueryList>;
    remove: (key: string) => Promise<ReturnValue>;
    constructor(key: string, set: (key: string, value: JSONValue) => Promise<void>, update: (key: string, handler: (prevValue: ReturnValue) => JSONValue) => Promise<void>, get: (key: string) => Promise<ReturnValue>, list: (options: ListPageOptions) => Promise<QueryList>, remove: (key: string) => Promise<ReturnValue>);
}
declare class QueryList implements I.QueryList {
    getCurrentPage: () => ReturnValue[];
    nextPage: () => Promise<void>;
    isLastPage: boolean;
    constructor(getCurrentPage: () => ReturnValue[], nextPage: () => Promise<void>);
}
declare class URLSearchParams {
    constructor(args: any);
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string | null;
    getAll(name: string): string[];
    forEach(callback: (this: URLSearchParams, value: string, key: string, url: URLSearchParams) => any): void;
    has(name: string): boolean;
    set(name: string, value: string): void;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    entries(): IterableIterator<string[]>;
    sort(): void;
    toString(): string;
    [Symbol.iterator](): IterableIterator<string[]>;
}
declare class URL {
    constructor(url: any, base?: any);
    get hash(): string;
    set hash(value: string);
    get host(): string;
    set host(value: string);
    get hostname(): any;
    set hostname(value: any);
    get port(): string;
    set port(value: string);
    get href(): string;
    set href(value: string);
    get origin(): string;
    get username(): string;
    set username(value: string);
    get password(): string;
    set password(value: string);
    get pathname(): string;
    set pathname(value: string);
    get protocol(): string;
    set protocol(value: string);
    get search(): string;
    set search(value: string);
    get searchParams(): URLSearchParams;
    toString(): string;
    toJSON(): string;
}
