// @ts-nocheck

interface Box3SoundEffectConfig {
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
declare class Box3SoundEffect implements Box3SoundEffectConfig {
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
declare class Box3Zone {
    /**
     * List all entities
     */
    entities: () => Box3Entity[];
    /**
     * Triggered when an entity enters the zone
     */
    onEnter: Box3EventChannel<Box3TriggerEvent>;
    nextEnter: Box3EventFuture<Box3TriggerEvent>;
    /**
     * Triggers when an entity leaves the zone
     */
    onLeave: Box3EventChannel<Box3TriggerEvent>;
    nextLeave: Box3EventFuture<Box3TriggerEvent>;
    /**
     * Destroys the zone
     */
    remove: () => void;
    /**
     * Bounds of the zone
     */
    bounds: Box3Bounds3;
    /**
     * Selector filter
     */
    selector: Box3SelectorString;
    /**
     * Controls how much the object's mass applies to the force
     * 0 = behaves like gravity
     * 1 = behaves like wind
     */
    massScale: number;
    /**
     * The amount of force to apply to the object
     */
    force: Box3Vector3;
    fogEnabled: boolean;
    fogColor: Box3RGBColor;
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
    snowColor: Box3RGBAColor;
    snowTexture: string;
    rainEnabled: boolean;
    rainDensity: number;
    rainDirection: Box3Vector3;
    rainSpeed: number;
    rainSizeLo: number;
    rainSizeHi: number;
    rainInterference: number;
    rainColor: Box3RGBAColor;
    skyEnabled: boolean;
    skyMode: 'natural' | 'manual';
    skySunPhase: number;
    skySunFrequency: number;
    skyLunarPhase: number;
    skySunDirection: Box3Vector3;
    skySunLight: Box3RGBColor;
    skyLeftLight: Box3RGBColor;
    skyRightLight: Box3RGBColor;
    skyBottomLight: Box3RGBColor;
    skyTopLight: Box3RGBColor;
    skyFrontLight: Box3RGBColor;
    skyBackLight: Box3RGBColor;
    /**
     * @ignore
     */
    constructor(
        /**
         * List all entities
         */
        entities: () => Box3Entity[],
        /**
         * Triggered when an entity enters the zone
         */
        onEnter: Box3EventChannel<Box3TriggerEvent>, nextEnter: Box3EventFuture<Box3TriggerEvent>,
        /**
         * Triggers when an entity leaves the zone
         */
        onLeave: Box3EventChannel<Box3TriggerEvent>, nextLeave: Box3EventFuture<Box3TriggerEvent>,
        /**
         * Destroys the zone
         */
        remove: () => void);
}
/**
 * Trigger constructor parameters
 */
declare type Box3ZoneConfig = {
    bounds: Box3Bounds3;
    selector: Box3SelectorString;
    massScale: number;
    force: Box3Vector3;
    fogEnabled: boolean;
    fogColor: Box3RGBColor;
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
    snowColor: Box3RGBAColor;
    snowTexture: string;
    rainEnabled: boolean;
    rainDensity: number;
    rainDirection: Box3Vector3;
    rainSpeed: number;
    rainSizeLo: number;
    rainSizeHi: number;
    rainInterference: number;
    rainColor: Box3RGBAColor;
    skyEnabled: boolean;
    skyMode: 'natural' | 'manual';
    skySunPhase: number;
    skySunFrequency: number;
    skyLunarPhase: number;
    skySunDirection: Box3Vector3;
    skySunLight: Box3RGBColor;
    skyLeftLight: Box3RGBColor;
    skyRightLight: Box3RGBColor;
    skyBottomLight: Box3RGBColor;
    skyTopLight: Box3RGBColor;
    skyFrontLight: Box3RGBColor;
    skyBackLight: Box3RGBColor;
};
declare enum Box3AnimationPlaybackState {
    PENDING = "pending",
    RUNNING = "running",
    FINISHED = "finished"
}
declare enum Box3AnimationDirection {
    NORMAL = "normal",
    REVERSE = "reverse",
    WRAP = "wrap",
    WRAP_REVERSE = "wrap-reverse",
    ALTERNATE = "alternate",
    ALTERNATE_REVERSE = "alternate-reverse"
}
declare enum Box3Easing {
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
interface Box3AnimationPlaybackConfig {
    startTick: number;
    delay: number;
    endDelay: number;
    duration: number;
    direction: Box3AnimationDirection;
    iterationStart: number;
    iterations: number;
}
declare class Box3Animation<KeyframeType, TargetType> {
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
    play: (playback?: Partial<Box3AnimationPlaybackConfig>) => void;
    /**
     * Cancels current animation playback
     */
    cancel: () => void;
    /**
     * Fires when animation begins
     */
    onReady: Box3EventChannel<Box3AnimationEvent<KeyframeType, TargetType>>;
    nextReady: Box3EventFuture<Box3AnimationEvent<KeyframeType, TargetType>>;
    /**
     * Fires when animation completes successfully
     */
    onFinish: Box3EventChannel<Box3AnimationEvent<KeyframeType, TargetType>>;
    nextFinish: Box3EventFuture<Box3AnimationEvent<KeyframeType, TargetType>>;
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
    playState: Box3AnimationPlaybackState;
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
        keyframes: () => Partial<KeyframeType>[], currentTime: () => number, startTime: () => number, playState: () => Box3AnimationPlaybackState, playbackRate: () => number,
        /**
         * Starts or restarts playback for the animation.
         */
        play: (playback?: Partial<Box3AnimationPlaybackConfig>) => void,
        /**
         * Cancels current animation playback
         */
        cancel: () => void,
        /**
         * Fires when animation begins
         */
        onReady: Box3EventChannel<Box3AnimationEvent<KeyframeType, TargetType>>, nextReady: Box3EventFuture<Box3AnimationEvent<KeyframeType, TargetType>>,
        /**
         * Fires when animation completes successfully
         */
        onFinish: Box3EventChannel<Box3AnimationEvent<KeyframeType, TargetType>>, nextFinish: Box3EventFuture<Box3AnimationEvent<KeyframeType, TargetType>>);
    then<T>(resolve: (event: Box3AnimationEvent<KeyframeType, TargetType>) => T, reject?: (error: any) => any): any;
}
interface Box3WorldKeyframe {
    duration: number;
    easeIn: Box3Easing;
    easeOut: Box3Easing;
    fogColor: Box3RGBColor;
    fogStartDistance: number;
    fogHeightOffset: number;
    fogHeightFalloff: number;
    fogUniformDensity: number;
    maxFog: number;
    lightMode: 'natural' | 'manual';
    sunPhase: number;
    sunFrequency: number;
    lunarPhase: number;
    sunDirection: Box3Vector3;
    sunLight: Box3RGBColor;
    skyLeftLight: Box3RGBColor;
    skyRightLight: Box3RGBColor;
    skyBottomLight: Box3RGBColor;
    skyTopLight: Box3RGBColor;
    skyFrontLight: Box3RGBColor;
    skyBackLight: Box3RGBColor;
    rainDensity: number;
    rainDirection: Box3Vector3;
    rainSpeed: number;
    rainSizeLo: number;
    rainSizeHi: number;
    rainInterference: number;
    rainColor: Box3RGBAColor;
    snowDensity: number;
    snowSizeLo: number;
    snowSizeHi: number;
    snowFallSpeed: number;
    snowSpinSpeed: number;
    snowColor: Box3RGBAColor;
    snowTexture: string;
    gravity: number;
    airFriction: number;
}
/**
 * {@link Box3.Box3World} is the main entry point to the engine API.  Using this object you can control
 * global scene properties like the weather, timeOfDay, etc. and perform searches on the set of all {@link Box3.Box3Entity}
 * which exist in the world.
 */
declare class Box3World {
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
    onRespawn: Box3EventChannel<Box3RespawnEvent>;
    nextRespawn: Box3EventFuture<Box3RespawnEvent>;
    /**
     * Creates a new {@link Box3.Box3Entity} or makes a copy of an existing entity.
     * If entity quota is exceeded, then returns null.
     * @param config A set of initial values for the entity or a new entity which we want to copy
     * @returns A newly created entity with the given parameters
     * @category entity
     */
    createEntity: (config: Partial<Box3EntityConfig>) => Box3Entity | null;
    /**
     * The entities in box3 can be searched using a jQuery selector-like syntax.
     * For more examples see {@link Box3.Box3SelectorString}
     *
     * @param selector a selector search pattern
     * @returns the first entity which matches the selector/
     * @category entity
     */
    querySelector: (selector: Box3SelectorString) => Box3Entity | null;
    /**
     * The entities in box3 can be searched using a jQuery selector-like syntax
     * For more examples see {@link Box3.Box3SelectorString}
     *
     * @param selector a selector search pattern
     * @returns All entities which match the selector
     * @category entity
     */
    querySelectorAll: (selector: Box3SelectorString) => Box3Entity[];
    /**
     * Test a selector on an entity
     *
     * @param selector the selector pattern to test
     * @param entity The entity to test
     * @category entity
     */
    testSelector: (selector: Box3SelectorString, entity: Box3Entity) => boolean;
    /**
     * Disables collisions between the set of all entities matching aSelector and bSelector
     *
     * @param aSelector the selector for the first set of entities
     * @param bSelector the selector for the second set of entities
     * @category physics
     */
    addCollisionFilter: (aSelector: Box3SelectorString, bSelector: Box3SelectorString) => void;
    /**
     * Removes collision filter between aSelector and bSelector
     *
     * @param aSelector the selector for the first set of entities
     * @param bSelector the selector for the second set of entities
     * @category physics
     */
    removeCollisionFilter: (aSelector: Box3SelectorString, bSelector: Box3SelectorString) => void;
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
    raycast: (origin: Box3Vector3, direction: Box3Vector3, options?: Partial<Box3RaycastOptions>) => Box3RaycastResult;
    /**
     * Search for all entities contained in a bounding box
     * @param bounds the bounding box to search
     * @returns All entities contained in ``bounds``
     */
    searchBox: (bounds: Box3Bounds3) => Box3Entity[];
    /**
     * Plays an animation on the world object
     */
    animate: (keyframes: Partial<Box3WorldKeyframe>[], playbackInfo?: Partial<Box3AnimationPlaybackConfig>) => Box3Animation<Box3WorldKeyframe, Box3World>;
    getAnimations: () => Box3Animation<Box3WorldKeyframe, Box3World>[];
    getEntityAnimations: () => Box3Animation<Box3EntityKeyframe, Box3Entity>[];
    getPlayerAnimations: () => Box3Animation<Box3PlayerKeyframe, Box3Player>[];
    /**
     * An event handler called each tick
     * @category tick
     */
    onTick: Box3EventChannel<Box3TickEvent>;
    nextTick: Box3EventFuture<Box3TickEvent>;
    /**
     * Called when an entity takes damage
     * @category health
     */
    onTakeDamage: Box3EventChannel<Box3DamageEvent>;
    nextTakeDamage: Box3EventFuture<Box3DamageEvent>;
    /**
     * Called when an entity dies
     * @category health
     */
    onDie: Box3EventChannel<Box3DieEvent>;
    nextDie: Box3EventFuture<Box3DieEvent>;
    /**
     * Called whenever a player joins the game
     * @category player
     */
    onPlayerJoin: Box3EventChannel<Box3PlayerEntityEvent>;
    nextPlayerJoin: Box3EventFuture<Box3PlayerEntityEvent>;
    /**
     * Called whenever a player leaves the game
     * @category player
     */
    onPlayerLeave: Box3EventChannel<Box3PlayerEntityEvent>;
    nextPlayerLeave: Box3EventFuture<Box3PlayerEntityEvent>;
    /**
     * Called whenever an entity is created
     * @category entity
     */
    onEntityCreate: Box3EventChannel<Box3EntityEvent>;
    nextEntityCreate: Box3EventFuture<Box3EntityEvent>;
    /**
     * Called whenever an entity is destroyed
     * @category chat
     */
    onEntityDestroy: Box3EventChannel<Box3EntityEvent>;
    nextEntityDestroy: Box3EventFuture<Box3EntityEvent>;
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
    onChat: Box3EventChannel<Box3ChatEvent>;
    nextChat: Box3EventFuture<Box3ChatEvent>;
    /**
     * Called whenever a player clicks on an object
     * @category player
     */
    onClick: Box3EventChannel<Box3ClickEvent>;
    nextClick: Box3EventFuture<Box3ClickEvent>;
    /**
     * Called whenever a player pushes a button
     * @category player
     */
    onPress: Box3EventChannel<Box3InputEvent>;
    nextPress: Box3EventFuture<Box3InputEvent>;
    /**
     * Called whenever a player releases a button
     * @category player
     */
    onRelease: Box3EventChannel<Box3InputEvent>;
    nextRelease: Box3EventFuture<Box3InputEvent>;
    /**
     * Called whenever two entities collide
     * @category entity
     */
    onEntityContact: Box3EventChannel<Box3EntityContactEvent>;
    nextEntityContact: Box3EventFuture<Box3EntityContactEvent>;
    /**
     * Called whenever two entities stop colliding
     * @category entity
     */
    onEntitySeparate: Box3EventChannel<Box3EntityContactEvent>;
    nextEntitySeparate: Box3EventFuture<Box3EntityContactEvent>;
    /**
     * Called whenever an entity touches a voxel
     * @category entity
     */
    onVoxelContact: Box3EventChannel<Box3VoxelContactEvent>;
    nextVoxelContact: Box3EventFuture<Box3VoxelContactEvent>;
    /**
     * Called whenever an entity stops touching a voxel
     * @category entity
     */
    onVoxelSeparate: Box3EventChannel<Box3VoxelContactEvent>;
    nextVoxelSeparate: Box3EventFuture<Box3VoxelContactEvent>;
    /**
     * Called when an entity enters a fluid
     * @category entity
     */
    onFluidEnter: Box3EventChannel<Box3FluidContactEvent>;
    nextFluidEnter: Box3EventFuture<Box3FluidContactEvent>;
    /**
     * Called when an entity leaves a fluid
     * @category entity
     */
    onFluidLeave: Box3EventChannel<Box3FluidContactEvent>;
    nextFluidLeave: Box3EventFuture<Box3FluidContactEvent>;
    /**
     * Zones
     * @category zone
     */
    zones: () => Box3Zone[];
    addZone: (config: Partial<Box3ZoneConfig>) => Box3Zone;
    removeZone: (trigger: Box3Zone) => void;
    /**
     * @category interactive
     */
    onInteract: Box3EventChannel<Box3InteractEvent>;
    nextInteract: Box3EventFuture<Box3InteractEvent>;
    /**
     * Plays a sound at a given location
     */
    sound: (spec: {
        sample: string;
        position?: Box3Vector3;
        radius?: number;
        gain?: number;
        pitch?: number;
    } | string) => void;
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
    sunDirection: Box3Vector3;
    /**
     * Light level of the sun (only used if ambientLightMode === 'manual')
     * @category weather
     */
    sunLight: Box3RGBColor;
    /**
     * -x direction ambient light value (only used if ambientLightMode === 'manual')
     * @category weather
     */
    skyLeftLight: Box3RGBColor;
    /**
     * +x direction ambient light value (only used if ambientLightMode === 'manual')
     * @category weather
     */
    skyRightLight: Box3RGBColor;
    /**
     * -y direction ambient light value (only used if ambientLightMode === 'manual')
     * @category weather
     */
    skyBottomLight: Box3RGBColor;
    /**
     * +y direction ambient light value (only used if ambientLightMode === 'manual')
     * @category weather
     */
    skyTopLight: Box3RGBColor;
    /**
     * -z direction ambient light value (only used if ambientLightMode === 'manual')
     * @category weather
     */
    skyFrontLight: Box3RGBColor;
    /**
     * +z direction ambient light value (only used if ambientLightMode === 'manual')
     * @category weather
     */
    skyBackLight: Box3RGBColor;
    /**
     * Fog color
     * @category weather
     */
    fogColor: Box3RGBColor;
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
    snowColor: Box3RGBAColor;
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
    rainDirection: Box3Vector3;
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
    rainColor: Box3RGBAColor;
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
     * Plays when a voxel breaks
     * @category sound
     */
    breakVoxelSound: Box3SoundEffect;
    /**
     * Plays when a voxel is placed
     * @category sound
     */
    placeVoxelSound: Box3SoundEffect;
    /**
     * Plays when a player joins
     * @category sound
     */
    playerJoinSound: Box3SoundEffect;
    /**
     * Plays when a player leaves
     * @category sound
     */
    playerLeaveSound: Box3SoundEffect;
    /**
     * Ambient sound, plays in background globally
     * @category sound
     */
    ambientSound: Box3SoundEffect;
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
        onRespawn: Box3EventChannel<Box3RespawnEvent>, nextRespawn: Box3EventFuture<Box3RespawnEvent>,
        /**
         * Creates a new {@link Box3.Box3Entity} or makes a copy of an existing entity.
         * If entity quota is exceeded, then returns null.
         * @param config A set of initial values for the entity or a new entity which we want to copy
         * @returns A newly created entity with the given parameters
         * @category entity
         */
        createEntity: (config: Partial<Box3EntityConfig>) => Box3Entity | null,
        /**
         * The entities in box3 can be searched using a jQuery selector-like syntax.
         * For more examples see {@link Box3.Box3SelectorString}
         *
         * @param selector a selector search pattern
         * @returns the first entity which matches the selector/
         * @category entity
         */
        querySelector: (selector: Box3SelectorString) => Box3Entity | null,
        /**
         * The entities in box3 can be searched using a jQuery selector-like syntax
         * For more examples see {@link Box3.Box3SelectorString}
         *
         * @param selector a selector search pattern
         * @returns All entities which match the selector
         * @category entity
         */
        querySelectorAll: (selector: Box3SelectorString) => Box3Entity[],
        /**
         * Test a selector on an entity
         *
         * @param selector the selector pattern to test
         * @param entity The entity to test
         * @category entity
         */
        testSelector: (selector: Box3SelectorString, entity: Box3Entity) => boolean,
        /**
         * Disables collisions between the set of all entities matching aSelector and bSelector
         *
         * @param aSelector the selector for the first set of entities
         * @param bSelector the selector for the second set of entities
         * @category physics
         */
        addCollisionFilter: (aSelector: Box3SelectorString, bSelector: Box3SelectorString) => void,
        /**
         * Removes collision filter between aSelector and bSelector
         *
         * @param aSelector the selector for the first set of entities
         * @param bSelector the selector for the second set of entities
         * @category physics
         */
        removeCollisionFilter: (aSelector: Box3SelectorString, bSelector: Box3SelectorString) => void,
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
        raycast: (origin: Box3Vector3, direction: Box3Vector3, options?: Partial<Box3RaycastOptions>) => Box3RaycastResult,
        /**
         * Search for all entities contained in a bounding box
         * @param bounds the bounding box to search
         * @returns All entities contained in ``bounds``
         */
        searchBox: (bounds: Box3Bounds3) => Box3Entity[],
        /**
         * Plays an animation on the world object
         */
        animate: (keyframes: Partial<Box3WorldKeyframe>[], playbackInfo?: Partial<Box3AnimationPlaybackConfig>) => Box3Animation<Box3WorldKeyframe, Box3World>, getAnimations: () => Box3Animation<Box3WorldKeyframe, Box3World>[], getEntityAnimations: () => Box3Animation<Box3EntityKeyframe, Box3Entity>[], getPlayerAnimations: () => Box3Animation<Box3PlayerKeyframe, Box3Player>[],
        /**
         * An event handler called each tick
         * @category tick
         */
        onTick: Box3EventChannel<Box3TickEvent>, nextTick: Box3EventFuture<Box3TickEvent>,
        /**
         * Called when an entity takes damage
         * @category health
         */
        onTakeDamage: Box3EventChannel<Box3DamageEvent>, nextTakeDamage: Box3EventFuture<Box3DamageEvent>,
        /**
         * Called when an entity dies
         * @category health
         */
        onDie: Box3EventChannel<Box3DieEvent>, nextDie: Box3EventFuture<Box3DieEvent>,
        /**
         * Called whenever a player joins the game
         * @category player
         */
        onPlayerJoin: Box3EventChannel<Box3PlayerEntityEvent>, nextPlayerJoin: Box3EventFuture<Box3PlayerEntityEvent>,
        /**
         * Called whenever a player leaves the game
         * @category player
         */
        onPlayerLeave: Box3EventChannel<Box3PlayerEntityEvent>, nextPlayerLeave: Box3EventFuture<Box3PlayerEntityEvent>,
        /**
         * Called whenever an entity is created
         * @category entity
         */
        onEntityCreate: Box3EventChannel<Box3EntityEvent>, nextEntityCreate: Box3EventFuture<Box3EntityEvent>,
        /**
         * Called whenever an entity is destroyed
         * @category chat
         */
        onEntityDestroy: Box3EventChannel<Box3EntityEvent>, nextEntityDestroy: Box3EventFuture<Box3EntityEvent>,
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
        onChat: Box3EventChannel<Box3ChatEvent>, nextChat: Box3EventFuture<Box3ChatEvent>,
        /**
         * Called whenever a player clicks on an object
         * @category player
         */
        onClick: Box3EventChannel<Box3ClickEvent>, nextClick: Box3EventFuture<Box3ClickEvent>,
        /**
         * Called whenever a player pushes a button
         * @category player
         */
        onPress: Box3EventChannel<Box3InputEvent>, nextPress: Box3EventFuture<Box3InputEvent>,
        /**
         * Called whenever a player releases a button
         * @category player
         */
        onRelease: Box3EventChannel<Box3InputEvent>, nextRelease: Box3EventFuture<Box3InputEvent>,
        /**
         * Called whenever two entities collide
         * @category entity
         */
        onEntityContact: Box3EventChannel<Box3EntityContactEvent>, nextEntityContact: Box3EventFuture<Box3EntityContactEvent>,
        /**
         * Called whenever two entities stop colliding
         * @category entity
         */
        onEntitySeparate: Box3EventChannel<Box3EntityContactEvent>, nextEntitySeparate: Box3EventFuture<Box3EntityContactEvent>,
        /**
         * Called whenever an entity touches a voxel
         * @category entity
         */
        onVoxelContact: Box3EventChannel<Box3VoxelContactEvent>, nextVoxelContact: Box3EventFuture<Box3VoxelContactEvent>,
        /**
         * Called whenever an entity stops touching a voxel
         * @category entity
         */
        onVoxelSeparate: Box3EventChannel<Box3VoxelContactEvent>, nextVoxelSeparate: Box3EventFuture<Box3VoxelContactEvent>,
        /**
         * Called when an entity enters a fluid
         * @category entity
         */
        onFluidEnter: Box3EventChannel<Box3FluidContactEvent>, nextFluidEnter: Box3EventFuture<Box3FluidContactEvent>,
        /**
         * Called when an entity leaves a fluid
         * @category entity
         */
        onFluidLeave: Box3EventChannel<Box3FluidContactEvent>, nextFluidLeave: Box3EventFuture<Box3FluidContactEvent>,
        /**
         * Zones
         * @category zone
         */
        zones: () => Box3Zone[], addZone: (config: Partial<Box3ZoneConfig>) => Box3Zone, removeZone: (trigger: Box3Zone) => void,
        /**
         * @category interactive
         */
        onInteract: Box3EventChannel<Box3InteractEvent>, nextInteract: Box3EventFuture<Box3InteractEvent>,
        /**
         * Plays a sound at a given location
         */
        sound: (spec: {
            sample: string;
            position?: Box3Vector3;
            radius?: number;
            gain?: number;
            pitch?: number;
        } | string) => void);
}
/**
 * {@link Box3.Box3Voxels} gives an interface for all the voxels in Box3.  You can use it to control the terrain
 */
declare class Box3Voxels {
    /**
     * Size of the voxel grid along the x/y/z dimensions
     */
    shape: Box3Vector3;
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
        shape: Box3Vector3,
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
declare type Box3PlayerEntity = Box3Entity & {
    player: Box3Player;
    isPlayer: true;
};
declare type Box3PlayerEntityEvent = Box3EntityEvent & {
    entity: Box3PlayerEntity;
};
/**
 * A set of parameters which can be used to specify an entity
 */
interface Box3EntityConfig {
    position: Box3Vector3;
    velocity: Box3Vector3;
    bounds: Box3Vector3;
    mass: number;
    friction: number;
    restitution: number;
    collides: boolean;
    fixed: boolean;
    gravity: boolean;
    mesh: string;
    meshColor: Box3RGBAColor;
    meshScale: Box3Vector3;
    meshOrientation: Box3Quaternion;
    meshMetalness: number;
    meshEmissive: number;
    meshShininess: number;
    particleRate: number;
    particleRateSpread: number;
    particleLimit: number;
    particleColor: Box3RGBColor[];
    particleSize: number[];
    particleSizeSpread: number;
    particleLifetime: number;
    particleLifetimeSpread: number;
    particleVelocity: Box3Vector3;
    particleVelocitySpread: Box3Vector3;
    particleDamping: number;
    particleAcceleration: Box3Vector3;
    particleNoise: number;
    particleNoiseFrequency: number;
    particleTarget: Box3Entity | null;
    particleTargetWeight: number;
    enableInteract: boolean;
    interactColor: Box3RGBColor;
    interactHint: string;
    interactRadius: number;
    hurtSound: Box3SoundEffectConfig;
    dieSound: Box3SoundEffectConfig;
    interactSound: Box3SoundEffectConfig;
    chatSound: Box3SoundEffectConfig;
    id: string;
    tags: (() => string[]) | string[];
}
interface Box3HurtOptions {
    attacker: Box3Entity;
    damageType: string;
}
interface Box3EntityKeyframe {
    duration: number;
    easeIn: Box3Easing;
    easeOut: Box3Easing;
    position: Box3Vector3;
    velocity: Box3Vector3;
    mass: number;
    friction: number;
    restitution: number;
    collides: boolean;
    fixed: boolean;
    gravity: boolean;
    mesh: string;
    meshInvisible: boolean;
    meshScale: Box3Vector3;
    meshOrientation: Box3Quaternion;
    meshOffset: Box3Vector3;
    meshColor: Box3RGBAColor;
    meshMetalness: number;
    meshEmissive: number;
    meshShininess: number;
    particleRate: number;
    particleRateSpread: number;
    particleLimit: number;
    particleLifetime: number;
    particleLifetimeSpread: number;
    particleVelocity: Box3Vector3;
    particleVelocitySpread: Box3Vector3;
    particleColor: Box3RGBColor[];
    particleSize: number[];
    particleSizeSpread: number;
    particleDamping: number;
    particleAcceleration: Box3Vector3;
    particleNoise: number;
    particleNoiseFrequency: number;
    particleTarget: Box3Entity | null;
    particleTargetWeight: number;
    interactColor: Box3RGBColor;
}
/**
 * Entities are game objects in Box3.  They can be used to encode things like players, objects, etc.
 */
declare class Box3Entity implements Box3EntityConfig {
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
    onDestroy: Box3EventChannel<Box3EntityEvent>;
    nextDestroy: Box3EventFuture<Box3EntityEvent>;
    /**
     * Called when entity takes damage
     * @category health
     */
    onTakeDamage: Box3EventChannel<Box3DamageEvent>;
    nextTakeDamage: Box3EventFuture<Box3DamageEvent>;
    /**
     * Called when an entity dies
     * @category health
     */
    onDie: Box3EventChannel<Box3DieEvent>;
    nextDie: Box3EventFuture<Box3DieEvent>;
    /**
     * Deals damage to an entity
     * @category health
     */
    hurt: (amount: number, options?: Partial<Box3HurtOptions>) => void;
    /**
     * Makes the entity talk
     * @category chat
     */
    say: (message: string) => void;
    /**
     * Plays an animation on an entity
     */
    animate: (keyframes: Partial<Box3EntityKeyframe>[], playbackInfo?: Partial<Box3AnimationPlaybackConfig>) => Box3Animation<Box3EntityKeyframe, Box3Entity>;
    getAnimations: () => Box3Animation<Box3EntityKeyframe, Box3Entity>[];
    /**
     * Called whenever a player clicks on this entity
     */
    onClick: Box3EventChannel<Box3ClickEvent>;
    nextClick: Box3EventFuture<Box3ClickEvent>;
    /**
     * Called when the entity touches another entity
     * @category physics
     */
    onEntityContact: Box3EventChannel<Box3EntityContactEvent>;
    nextEntityContact: Box3EventFuture<Box3EntityContactEvent>;
    /**
     * Called when the entity stops touching another entity
     * @category physics
     */
    onEntitySeparate: Box3EventChannel<Box3EntityContactEvent>;
    nextEntitySeparate: Box3EventFuture<Box3EntityContactEvent>;
    /**
     * Called when the entity touches a voxel
     * @category physics
     */
    onVoxelContact: Box3EventChannel<Box3VoxelContactEvent>;
    nextVoxelContact: Box3EventFuture<Box3VoxelContactEvent>;
    /**
     * Called when the entity stops touching a voxel
     * @category physics
     */
    onVoxelSeparate: Box3EventChannel<Box3VoxelContactEvent>;
    nextVoxelSeparate: Box3EventFuture<Box3VoxelContactEvent>;
    /**
     * Called when the entity enters a fluid
     * @category physics
     */
    onFluidEnter: Box3EventChannel<Box3FluidContactEvent>;
    nextFluidEnter: Box3EventFuture<Box3FluidContactEvent>;
    /**
     * Called when the entity leaves a fluid
     * @category physics
     */
    onFluidLeave: Box3EventChannel<Box3FluidContactEvent>;
    nextFluidLeave: Box3EventFuture<Box3FluidContactEvent>;
    /**
     * Called when an entity interact with another entity
     * @category interactive
     */
    onInteract: Box3EventChannel<Box3InteractEvent>;
    nextInteract: Box3EventFuture<Box3InteractEvent>;
    /**
     * Play a sound effect at the location of this entity
     * @category sound
     */
    sound: (spec: {
        sample: string;
        radius?: number;
        pitch?: number;
        gain?: number;
    } | string) => void;
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
    position: Box3Vector3;
    /**
     * @category physics
     */
    velocity: Box3Vector3;
    /**
     * Radius of the entity's bounding box along x/y/z
     * @category physics
     */
    bounds: Box3Vector3;
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
    contactForce: Box3Vector3;
    /**
     * Returns a list of all active body contacts
     * @category physics
     */
    entityContacts: Box3EntityContact[];
    /**
     * Returns a list of all active voxel contacts
     * @category physics
     */
    voxelContacts: Box3VoxelContact[];
    /**
     * Returns a list of all active fluid contacts
     * @category physics
     */
    fluidContacts: Box3FluidContact[];
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
    meshScale: Box3Vector3;
    /**
     * @category mesh
     */
    meshOrientation: Box3Quaternion;
    /**
     * @category mesh
     */
    meshOffset: Box3Vector3;
    /**
     * @category mesh
     */
    meshColor: Box3RGBAColor;
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
    player?: Box3Player;
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
    particleColor: Box3RGBColor[];
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
    particleVelocity: Box3Vector3;
    /**
     * Particle velocity randomization range.  Units are voxels/tick
     * @category particle
     */
    particleVelocitySpread: Box3Vector3;
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
    particleAcceleration: Box3Vector3;
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
    particleTarget: Box3Entity | null;
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
    interactColor: Box3RGBColor;
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
    chatSound: Box3SoundEffect;
    /**
     * Plays when entity takes damage
     * @category sound
     */
    hurtSound: Box3SoundEffect;
    /**
     * Plays when entity dies
     * @category sound
     */
    dieSound: Box3SoundEffect;
    /**
     * Plays when entity is interacted with
     * @category sound
     */
    interactSound: Box3SoundEffect;
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
        onDestroy: Box3EventChannel<Box3EntityEvent>, nextDestroy: Box3EventFuture<Box3EntityEvent>,
        /**
         * Called when entity takes damage
         * @category health
         */
        onTakeDamage: Box3EventChannel<Box3DamageEvent>, nextTakeDamage: Box3EventFuture<Box3DamageEvent>,
        /**
         * Called when an entity dies
         * @category health
         */
        onDie: Box3EventChannel<Box3DieEvent>, nextDie: Box3EventFuture<Box3DieEvent>,
        /**
         * Deals damage to an entity
         * @category health
         */
        hurt: (amount: number, options?: Partial<Box3HurtOptions>) => void,
        /**
         * Makes the entity talk
         * @category chat
         */
        say: (message: string) => void,
        /**
         * Plays an animation on an entity
         */
        animate: (keyframes: Partial<Box3EntityKeyframe>[], playbackInfo?: Partial<Box3AnimationPlaybackConfig>) => Box3Animation<Box3EntityKeyframe, Box3Entity>, getAnimations: () => Box3Animation<Box3EntityKeyframe, Box3Entity>[],
        /**
         * Called whenever a player clicks on this entity
         */
        onClick: Box3EventChannel<Box3ClickEvent>, nextClick: Box3EventFuture<Box3ClickEvent>,
        /**
         * Called when the entity touches another entity
         * @category physics
         */
        onEntityContact: Box3EventChannel<Box3EntityContactEvent>, nextEntityContact: Box3EventFuture<Box3EntityContactEvent>,
        /**
         * Called when the entity stops touching another entity
         * @category physics
         */
        onEntitySeparate: Box3EventChannel<Box3EntityContactEvent>, nextEntitySeparate: Box3EventFuture<Box3EntityContactEvent>,
        /**
         * Called when the entity touches a voxel
         * @category physics
         */
        onVoxelContact: Box3EventChannel<Box3VoxelContactEvent>, nextVoxelContact: Box3EventFuture<Box3VoxelContactEvent>,
        /**
         * Called when the entity stops touching a voxel
         * @category physics
         */
        onVoxelSeparate: Box3EventChannel<Box3VoxelContactEvent>, nextVoxelSeparate: Box3EventFuture<Box3VoxelContactEvent>,
        /**
         * Called when the entity enters a fluid
         * @category physics
         */
        onFluidEnter: Box3EventChannel<Box3FluidContactEvent>, nextFluidEnter: Box3EventFuture<Box3FluidContactEvent>,
        /**
         * Called when the entity leaves a fluid
         * @category physics
         */
        onFluidLeave: Box3EventChannel<Box3FluidContactEvent>, nextFluidLeave: Box3EventFuture<Box3FluidContactEvent>,
        /**
         * Called when an entity interact with another entity
         * @category interactive
         */
        onInteract: Box3EventChannel<Box3InteractEvent>, nextInteract: Box3EventFuture<Box3InteractEvent>,
        /**
         * Play a sound effect at the location of this entity
         * @category sound
         */
        sound: (spec: {
            sample: string;
            radius?: number;
            pitch?: number;
            gain?: number;
        } | string) => void);
}
/**
 * An active entity pair contact
 */
declare class Box3EntityContact {
    other: Box3Entity;
    force: Box3Vector3;
    axis: Box3Vector3;
    constructor(other: Box3Entity, force: Box3Vector3, axis: Box3Vector3);
}
/**
 * An active voxel contact state
 */
declare class Box3VoxelContact {
    x: number;
    y: number;
    z: number;
    voxel: number;
    force: Box3Vector3;
    axis: Box3Vector3;
    constructor(x: number, y: number, z: number, voxel: number, force: Box3Vector3, axis: Box3Vector3);
}
/**
 * An active fluid contact
 */
declare class Box3FluidContact {
    voxel: number;
    volume: number;
    constructor(voxel: number, volume: number);
}
/**
 * Player movement state
 */
declare enum Box3PlayerMoveState {
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
declare enum Box3PlayerWalkState {
    NONE = "",
    CROUCH = "crouch",
    WALK = "walk",
    RUN = "run"
}
declare enum Box3BodyPart {
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
declare type Box3SkinInvisible = {
    [key in Box3BodyPart]: boolean;
};
interface Box3WearableSpec {
    bodyPart: Box3BodyPart;
    mesh: string;
    color: Box3RGBColor;
    emissive: number;
    metalness: number;
    shininess: number;
    orientation: Box3Quaternion;
    scale: Box3Vector3;
    offset: Box3Vector3;
}
declare class Box3Wearable implements Box3WearableSpec {
    /**
     * The player this wearable is attached to
     */
    player: Box3Player | null;
    /**
     * Which body part this wearable is attached to
     */
    bodyPart: Box3BodyPart;
    /**
     * The mesh of this wearable
     */
    mesh: string;
    /**
     * Optional color tint of the wearable
     */
    color: Box3RGBColor;
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
    orientation: Box3Quaternion;
    /**
     * Scale of wearable along x/y/z
     */
    scale: Box3Vector3;
    /**
     * Offset of wearable
     */
    offset: Box3Vector3;
    remove(): void;
}
/**
 * Dialog stuff
 */
declare enum Box3DialogType {
    TEXT = "text",
    SELECT = "select",
    INPUT = "input"
}
declare type Box3DialogSelectResponse = {
    index: number;
    value: string;
};
declare type Box3DialogResponse = Box3DialogSelectResponse | string | null;
/**
 * Parameters for dialog
 */
declare type Box3DialogParams = {
    /**
     * Type of dialog
     */
    type: Box3DialogType;
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
    titleBackgroundColor?: Box3RGBAColor;
    /**
     * Color of dialog text
     */
    titleTextColor?: Box3RGBAColor;
    /**
     * Color of dialog background
     */
    contentBackgroundColor?: Box3RGBAColor;
    /**
     * Color of text
     */
    contentTextColor?: Box3RGBAColor;
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
    lookTarget?: Box3Vector3 | Box3Entity;
    /**
     * If target entity is given, then offset from target entity
     */
    lookTargetOffset?: Box3Vector3;
    /**
     * Camera up vector
     */
    lookUp?: Box3Vector3;
    /**
     * Camera eye position
     */
    lookEye?: Box3Vector3 | Box3Entity;
    /**
     * If camera eye is entity, then offset from entity location
     */
    lookEyeOffset?: Box3Vector3;
};
declare type Box3TextDialogParams = {
    type: Box3DialogType.TEXT;
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
    titleBackgroundColor?: Box3RGBAColor;
    /**
     * Color of dialog text
     */
    titleTextColor?: Box3RGBAColor;
    /**
     * Color of dialog background
     */
    contentBackgroundColor?: Box3RGBAColor;
    /**
     * Color of text
     */
    contentTextColor?: Box3RGBAColor;
    /**
     * If set, draw an arrow
     */
    hasArrow?: boolean;
    /**
     * Target for object
     */
    lookTarget?: Box3Vector3 | Box3Entity;
    /**
     * If target entity is given, then offset from target entity
     */
    lookTargetOffset?: Box3Vector3;
    /**
     * Camera up vector
     */
    lookUp?: Box3Vector3;
    /**
     * Camera eye position
     */
    lookEye?: Box3Vector3 | Box3Entity;
    /**
     * If camera eye is entity, then offset from entity location
     */
    lookEyeOffset?: Box3Vector3;
};
declare type Box3SelectDialogParams = {
    type: Box3DialogType.SELECT;
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
    titleBackgroundColor?: Box3RGBAColor;
    /**
     * Color of dialog text
     */
    titleTextColor?: Box3RGBAColor;
    /**
     * Color of dialog background
     */
    contentBackgroundColor?: Box3RGBAColor;
    /**
     * Color of text
     */
    contentTextColor?: Box3RGBAColor;
    /**
     * Option list
     */
    options: string[];
    /**
     * Target for object
     */
    lookTarget?: Box3Vector3 | Box3Entity;
    /**
     * If target entity is given, then offset from target entity
     */
    lookTargetOffset?: Box3Vector3;
    /**
     * Camera up vector
     */
    lookUp?: Box3Vector3;
    /**
     * Camera eye position
     */
    lookEye?: Box3Vector3 | Box3Entity;
    /**
     * If camera eye is entity, then offset from entity location
     */
    lookEyeOffset?: Box3Vector3;
};
declare type Box3InputDialogParams = {
    type: Box3DialogType.INPUT;
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
    titleBackgroundColor?: Box3RGBAColor;
    /**
     * Color of dialog text
     */
    titleTextColor?: Box3RGBAColor;
    /**
     * Color of dialog background
     */
    contentBackgroundColor?: Box3RGBAColor;
    /**
     * Color of text
     */
    contentTextColor?: Box3RGBAColor;
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
    lookTarget?: Box3Vector3 | Box3Entity;
    /**
     * If target entity is given, then offset from target entity
     */
    lookTargetOffset?: Box3Vector3;
    /**
     * Camera up vector
     */
    lookUp?: Box3Vector3;
    /**
     * Camera eye position
     */
    lookEye?: Box3Vector3 | Box3Entity;
    /**
     * If camera eye is entity, then offset from entity location
     */
    lookEyeOffset?: Box3Vector3;
};
declare type Box3DialogCancelOption = {
    cancel: () => void;
};
/**
 * Dialog call signature
 */
declare type Box3DialogCall = ((params: Box3TextDialogParams) => (Promise<string | null> & Box3DialogCancelOption)) | ((params: Box3SelectDialogParams) => (Promise<Box3DialogSelectResponse | null> & Box3DialogCancelOption)) | ((params: Box3InputDialogParams) => (Promise<string | null> & Box3DialogCancelOption));
declare enum Box3CameraMode {
    FOLLOW = "follow",
    FPS = "fps",
    FIXED = "fixed",
    RELATIVE = "relative"
}
declare enum Box3CameraFreezedAxis {
    NONE = "",
    X = "x",
    Y = "y",
    Z = "z",
    XY = "xy",
    XZ = "xz",
    YZ = "yz",
    XYZ = "xyz"
}
declare enum Box3InputDirection {
    NONE = "none",
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal",
    BOTH = "both"
}
interface Box3PlayerKeyframe {
    duration: number;
    easeIn: Box3Easing;
    easeOut: Box3Easing;
    scale: number;
    color: Box3RGBColor;
    metalness: number;
    emissive: number;
    shininess: number;
    invisible: boolean;
    showName: boolean;
    colorLUT: string;
    cameraMode: Box3CameraMode;
    cameraEntity: Box3Entity | null;
    cameraTarget: Box3Vector3;
    cameraUp: Box3Vector3;
    cameraPosition: Box3Vector3;
    cameraFreezedAxis: Box3CameraFreezedAxis;
    cameraFovY: number;
    cameraDistance: number;
}
/**
 * Players correspond to users which are connected to the game
 */
declare class Box3Player {
    /**
     * Sends a private message directly to player
     * @category chat
     */
    directMessage: (message: string) => void;
    /**
     * Called whenever player initiates a chat event
     * @category chat
     */
    onChat: Box3EventChannel<Box3ChatEvent>;
    nextChat: Box3EventFuture<Box3ChatEvent>;
    /**
     * Called whenever player presses a button
     * @category input
     */
    onPress: Box3EventChannel<Box3InputEvent>;
    nextPress: Box3EventFuture<Box3InputEvent>;
    /**
     * Called whenever a player releases a buttin
     * @category input
     */
    onRelease: Box3EventChannel<Box3InputEvent>;
    nextRelease: Box3EventFuture<Box3InputEvent>;
    /**
     * @category health
     */
    onRespawn: Box3EventChannel<Box3RespawnEvent>;
    nextRespawn: Box3EventFuture<Box3RespawnEvent>;
    /**
     * @category health
     */
    forceRespawn: () => void;
    /**
     * Opens a dialog for this player
     * @category dialog
     */
    dialog: Box3DialogCall;
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
    wearables: (bodyPart?: Box3BodyPart) => Box3Wearable[];
    /**
     * Attach a new wearable object to the player
     * @category display
     */
    addWearable: (spec: Partial<Box3Wearable>) => Box3Wearable;
    /**
     * Remove a wearable object from a player
     * @param wearable is the wearable to remove
     * @category display
     */
    removeWearable: (wearable: Box3Wearable) => void;
    /**
     * Play sound for player
     * @category sound
     */
    sound: (spec: {
        sample: string;
        gain?: number;
        pitch?: number;
    } | string) => void;
    /**
     * Play an animation
     */
    animate: (keyframes: Partial<Box3PlayerKeyframe>[], playbackConfig?: Box3AnimationPlaybackConfig) => Box3Animation<Box3PlayerKeyframe, Box3Player>;
    getAnimations: () => Box3Animation<Box3PlayerKeyframe, Box3Player>[];
    /**
     * Kick the user off the server
     */
    kick: () => void;
    /**
     * Name of the player.  Constant.
     */
    name: string;
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
    spawnPoint: Box3Vector3;
    /**
     * Movement bounds
     * @category spawn
     */
    movementBounds: Box3Bounds3;
    /**
     * @category display
     */
    scale: number;
    /**
     * @category dipsplay
     */
    color: Box3RGBColor;
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
    cameraMode: Box3CameraMode;
    /**
     * In FPS or FOLLOW mode, the entity which the player's camera follows
     * @category camera
     */
    cameraEntity: Box3Entity | null;
    /**
     * Target point for the camera in FIXED mode
     * @category camera
     */
    cameraTarget: Box3Vector3;
    /**
     * Up vector for camera in FIXED mode
     * @category camera
     */
    cameraUp: Box3Vector3;
    /**
     * Eye position of camera in FIXED mode
     * @category camera
     */
    cameraPosition: Box3Vector3;
    /**
     * Freeze camera axis in RELATIVE mode
     * @category camera
     */
    cameraFreezedAxis: Box3CameraFreezedAxis;
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
    freezedForwardDirection: Box3Vector3 | null;
    /**
     * @category state
     */
    moveState: Box3PlayerMoveState;
    /**
     * @category state
     */
    walkState: Box3PlayerWalkState;
    /**
     * @category input
     */
    swapInputDirection: boolean;
    /**
     * @category input
     */
    reverseInputDirection: Box3InputDirection;
    /**
     * @category input
     */
    disableInputDirection: Box3InputDirection;
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
    enable3DCursor: boolean;
    /**
     * @category input
     */
    facingDirection: Box3Vector3;
    /**
     * @category input
     */
    cameraPitch: number;
    /**
     * Plays when player respawns
     * @category sound
     */
    spawnSound: Box3SoundEffect;
    /**
     * Plays when player jumps
     * @category sound
     */
    jumpSound: Box3SoundEffect;
    /**
     * Plays when player double jumps
     * @category sound
     */
    doubleJumpSound: Box3SoundEffect;
    /**
     * Plays when player lands
     * @category sound
     */
    landSound: Box3SoundEffect;
    /**
     * Plays when player crouches
     * @category sound
     */
    crouchSound: Box3SoundEffect;
    /**
     * Plays when player takes a step
     * @category sound
     */
    stepSound: Box3SoundEffect;
    /**
     * Plays when player takes a single swim stroke
     * @category sound
     */
    swimSound: Box3SoundEffect;
    /**
     * Plays when player presses action 0
     * @category sound
     */
    action0Sound: Box3SoundEffect;
    /**
     * Plays when player presses action 1
     * @category sound
     */
    action1Sound: Box3SoundEffect;
    /**
     * Plays when entity enters water
     * @category sound
     */
    enterWaterSound: Box3SoundEffect;
    /**
     * Plays when entity leaves water
     * @category sound
     */
    leaveWaterSound: Box3SoundEffect;
    /**
     * Sound for player start flying
     * @category sound
     */
    startFlySound: Box3SoundEffect;
    /**
     * Sound for player stop flying
     * @category sound
     */
    stopFlySound: Box3SoundEffect;
    /**
     * Background music for this player
     * @category sound
     */
    music: Box3SoundEffect;
    /**
     * If true, then player can't chat
     * @category chat
     */
    muted: boolean;
    /**
     * Skin parts invisible
     * @category display
     */
    skinInvisible: Box3SkinInvisible;
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
        onChat: Box3EventChannel<Box3ChatEvent>, nextChat: Box3EventFuture<Box3ChatEvent>,
        /**
         * Called whenever player presses a button
         * @category input
         */
        onPress: Box3EventChannel<Box3InputEvent>, nextPress: Box3EventFuture<Box3InputEvent>,
        /**
         * Called whenever a player releases a buttin
         * @category input
         */
        onRelease: Box3EventChannel<Box3InputEvent>, nextRelease: Box3EventFuture<Box3InputEvent>,
        /**
         * @category health
         */
        onRespawn: Box3EventChannel<Box3RespawnEvent>, nextRespawn: Box3EventFuture<Box3RespawnEvent>,
        /**
         * @category health
         */
        forceRespawn: () => void,
        /**
         * Opens a dialog for this player
         * @category dialog
         */
        dialog: Box3DialogCall,
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
        wearables: (bodyPart?: Box3BodyPart) => Box3Wearable[],
        /**
         * Attach a new wearable object to the player
         * @category display
         */
        addWearable: (spec: Partial<Box3Wearable>) => Box3Wearable,
        /**
         * Remove a wearable object from a player
         * @param wearable is the wearable to remove
         * @category display
         */
        removeWearable: (wearable: Box3Wearable) => void,
        /**
         * Play sound for player
         * @category sound
         */
        sound: (spec: {
            sample: string;
            gain?: number;
            pitch?: number;
        } | string) => void,
        /**
         * Play an animation
         */
        animate: (keyframes: Partial<Box3PlayerKeyframe>[], playbackConfig?: Box3AnimationPlaybackConfig) => Box3Animation<Box3PlayerKeyframe, Box3Player>, getAnimations: () => Box3Animation<Box3PlayerKeyframe, Box3Player>[],
        /**
         * Kick the user off the server
         */
        kick: () => void);
}
/**
 * Result of performing a raycast.  Contains information about the raycast and what it hit.
 */
declare class Box3RaycastResult {
    /**
     * If true, raycast hit an object
     */
    hit: boolean;
    /**
     * The entity hit by the raycast
     */
    hitEntity: Box3Entity | null;
    /**
     * The voxel id hit by the raycast (0 if no voxel was hit)
     */
    hitVoxel: number;
    /**
     * Start point of the ray cast
     */
    origin: Box3Vector3;
    /**
     * Direction of the raycast
     */
    direction: Box3Vector3;
    /**
     * Distance traveled along the ray
     */
    distance: number;
    /**
     * Position of the ray intersection
     */
    hitPosition: Box3Vector3;
    /**
     * Normal vector on surface at point of intersection
     */
    normal: Box3Vector3;
    /**
     * If a voxel was hit, the grid coordinates of the hit voxel
     */
    voxelIndex: Box3Vector3;
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
        hitEntity: Box3Entity | null,
        /**
         * The voxel id hit by the raycast (0 if no voxel was hit)
         */
        hitVoxel: number,
        /**
         * Start point of the ray cast
         */
        origin: Box3Vector3,
        /**
         * Direction of the raycast
         */
        direction: Box3Vector3,
        /**
         * Distance traveled along the ray
         */
        distance: number,
        /**
         * Position of the ray intersection
         */
        hitPosition: Box3Vector3,
        /**
         * Normal vector on surface at point of intersection
         */
        normal: Box3Vector3,
        /**
         * If a voxel was hit, the grid coordinates of the hit voxel
         */
        voxelIndex: Box3Vector3);
}
/**
 * Configuration parameters passed into a raycast method
 */
interface Box3RaycastOptions {
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
    ignoreSelector: Box3SelectorString;
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
declare type Box3EventChannel<EventType> = (handler: (event: EventType) => void) => Box3EventHandlerToken;
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
declare type Box3EventFuture<EventType> = (filter?: (event: EventType) => boolean) => Promise<EventType>;
/**
 * Returned by a {@link Box3.Box3EventChannel} whenever a handler is registered.  Can be used to cancel the handler.
 * @category events
 */
declare class Box3EventHandlerToken {
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
 * An event which is fired each tick by {@link Box3.Box3World.onTick}.
 * @category events
 */
declare class Box3TickEvent {
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
 * Triggered by {@link Box3.Box3World.onPlayerJoin}, {@link Box3.Box3World.onPlayerLeave}, {@link Box3.Box3World.onEntityCreate}, {@link Box3.Box3World.onEntityDestroy} and {@link Box3.Box3Entity.onDestroy}
 * @category events
 */
declare class Box3EntityEvent {
    /**
     * The time the event occured
     */
    tick: number;
    /**
     * The entity that was created/destroyed
     */
    entity: Box3Entity;
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
        entity: Box3Entity);
}
/**
 * Fired whenever an entity activates or deactivates a trigger
 * @category events
 */
declare class Box3TriggerEvent {
    /**
     * Time event occured
     */
    tick: number;
    /**
     * Entity which triggered event
     */
    entity: Box3Entity;
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
        entity: Box3Entity);
}
/**
 * Fired whenever an entity takes damage
 * Triggered by {@link Box3.Box3World.onTakeDamage} {@link Box3.Box3Entity.onTakeDamage}
 * @category events
 */
declare class Box3DamageEvent {
    /**
     * Time event occured
     */
    tick: number;
    /**
     * Entity which received damage
     */
    entity: Box3Entity;
    /**
     * Amount of damage
     */
    damage: number;
    /**
     * Entity attacker
     */
    attacker: Box3Entity | null;
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
        entity: Box3Entity,
        /**
         * Amount of damage
         */
        damage: number,
        /**
         * Entity attacker
         */
        attacker: Box3Entity | null,
        /**
         * Damage type
         */
        damageType: string);
}
/**
 * Fired whenever an entity takes dies.
 * Triggered by {@link Box3.Box3World.onTakeDamage} {@link Box3.Box3Entity.onTakeDamage}
 * @category events
 */
declare class Box3DieEvent {
    /**
     * Time event occured
     */
    tick: number;
    /**
     * Entity which received damage
     */
    entity: Box3Entity;
    /**
     * Entity attacker
     */
    attacker: Box3Entity | null;
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
        entity: Box3Entity,
        /**
         * Entity attacker
         */
        attacker: Box3Entity | null,
        /**
         * Damage type
         */
        damageType: string);
}
/**
 * Triggered whenever a player respawns
 * @category events
 */
declare class Box3RespawnEvent {
    /**
     * Time event occured
     */
    tick: number;
    /**
     * Entity which received damage
     */
    entity: Box3PlayerEntity;
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
        entity: Box3PlayerEntity);
}
/**
 * An event which is fired whenever two entities collide
 * Triggered by {@link Box3.Box3World.onEntityContact}, {@link Box3.Box3World.onEntitySeparate}, {@link Box3.Box3Entity.onEntityContact}, {@link Box3.Box3Entity.onEntitySeparate}
 * @category events
 */
declare class Box3EntityContactEvent {
    /**
     * Time at which the entities collided
     */
    tick: number;
    /**
     * The first entity in the pair
     */
    entity: Box3Entity;
    /**
     * The second entity in the pair
     */
    other: Box3Entity;
    /**
     * The separating axis of the collision
     */
    axis: Box3Vector3;
    /**
     * The amount of force imparted by the collision
     */
    force: Box3Vector3;
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
        entity: Box3Entity,
        /**
         * The second entity in the pair
         */
        other: Box3Entity,
        /**
         * The separating axis of the collision
         */
        axis: Box3Vector3,
        /**
         * The amount of force imparted by the collision
         */
        force: Box3Vector3);
}
/**
 * An event which is fired whenever an entity comes into contact with terrain
 * Triggered by {@link Box3.Box3World.onVoxelContact}, {@link Box3.Box3World.onVoxelSeparate}, {@link Box3.Box3Entity.onVoxelContact}, {@link Box3.Box3Entity.onVoxelSeparate}
 * @category events
 */
declare class Box3VoxelContactEvent {
    /**
     * The time of the contact event
     */
    tick: number;
    /**
     * The entity which touched the terrain
     */
    entity: Box3Entity;
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
    axis: Box3Vector3;
    /**
     * Collision force
     */
    force: Box3Vector3;
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
        entity: Box3Entity,
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
        axis: Box3Vector3,
        /**
         * Collision force
         */
        force: Box3Vector3);
}
/**
 * An event which is fired whenever an entity enters or leaves a fluid
 * Triggered by {@link Box3.Box3World.onFluidEnter}, {@link Box3.Box3World.onFluidLeave}, {@link Box3.Box3Entity.onFluidEnter}, {@link Box3.Box3Entity.onFluidLeave}
 * @category events
 */
declare class Box3FluidContactEvent {
    /**
     * Time event occured
     */
    tick: number;
    /**
     * Entity which modified
     */
    entity: Box3Entity;
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
        entity: Box3Entity,
        /**
         * The id of the fluid voxel
         */
        voxel: number);
}
/**
 * Triggered by {@link Box3.Box3World.onChat} and {@link Box3.Box3Entity.onChat}
 * @category events
 */
declare class Box3ChatEvent {
    /**
     * Time chat event occured
     */
    tick: number;
    /**
     * Entity which initiated chat event
     */
    entity: Box3Entity;
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
        entity: Box3Entity,
        /**
         * What the entity said in the chat event
         */
        message: string);
}
/**
* Triggered by {@link Box3.Box3World.onInteract} and {@link Box3.Box3Entity.onInteract}
 * @category events
 */
declare class Box3InteractEvent {
    /**
     * Time of event
     */
    tick: number;
    /**
     * Entity initiating interaction
     */
    entity: Box3PlayerEntity;
    /**
     * Entity which received interaction
     */
    targetEntity: Box3Entity;
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
        entity: Box3PlayerEntity,
        /**
         * Entity which received interaction
         */
        targetEntity: Box3Entity);
}
/**
 * Type of a button pressed by a player
 * @category events
 */
declare enum Box3ButtonType {
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
 * Triggered by {@link Box3.Box3World.onPress}, {@link Box3.Box3World.onRelease}, {@link Box3.Box3Player.onPress}, {@link Box3.Box3Player.onRelease}
 * @category events
 */
declare class Box3InputEvent {
    /**
     * The time the button was pressed
     */
    tick: number;
    /**
     * A reference to the player which pressed the button
     */
    entity: Box3PlayerEntity;
    /**
     * The position of the entity at the time the pressed the button
     */
    position: Box3Vector3;
    /**
     * The button which was input by the player
     */
    button: Box3ButtonType;
    /**
     * If true, then this is a press event.  Otherwise if false this is a release event
     */
    pressed: boolean;
    /**
     * The result of a raycast query initiated by the player at the exact instant they pressed the button from the perspective of their camera.
     */
    raycast: Box3RaycastResult;
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
        entity: Box3PlayerEntity,
        /**
         * The position of the entity at the time the pressed the button
         */
        position: Box3Vector3,
        /**
         * The button which was input by the player
         */
        button: Box3ButtonType,
        /**
         * If true, then this is a press event.  Otherwise if false this is a release event
         */
        pressed: boolean,
        /**
         * The result of a raycast query initiated by the player at the exact instant they pressed the button from the perspective of their camera.
         */
        raycast: Box3RaycastResult);
}
declare class Box3ClickEvent {
    /**
     * Tick that click event occurred
     */
    tick: number;
    /**
     * Entity that got clicked
     */
    entity: Box3Entity;
    /**
     * Entity which initiated the click event
     */
    clicker: Box3PlayerEntity;
    /**
     * Button which was pressed ACTION0 = LeftClick, ACTION1 = RightClick
     */
    button: Box3ButtonType.ACTION0 | Box3ButtonType.ACTION1;
    /**
     * Distance from clicker to entity
     */
    distance: number;
    /**
     * Position of clicker at time of click
     */
    clickerPosition: Box3Vector3;
    /**
     * Raycast from clicker -> entity
     */
    raycast: Box3RaycastResult;
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
        entity: Box3Entity,
        /**
         * Entity which initiated the click event
         */
        clicker: Box3PlayerEntity,
        /**
         * Button which was pressed ACTION0 = LeftClick, ACTION1 = RightClick
         */
        button: Box3ButtonType.ACTION0 | Box3ButtonType.ACTION1,
        /**
         * Distance from clicker to entity
         */
        distance: number,
        /**
         * Position of clicker at time of click
         */
        clickerPosition: Box3Vector3,
        /**
         * Raycast from clicker -> entity
         */
        raycast: Box3RaycastResult);
}
declare class Box3AnimationEvent<KeyframeType, TargetType> {
    tick: number;
    target: TargetType;
    animation: Box3Animation<KeyframeType, TargetType>;
    cancelled: boolean;
    /**
     * @ignore
     */
    constructor(tick: number, target: TargetType, animation: Box3Animation<KeyframeType, TargetType>, cancelled: boolean);
}
/**
 * Selectors are a powerful syntax for searching all of the objects in a game.  The interface for selectors in box3 is modeled after the DOM APIs.
 *
 * * ```javascript
 * const entities = world.querySelector('*');           // all entities in the world
 * const players = world.querySelectorAll('player');    // all players in the game
 * const theChair = world.querySelector('#chair');      // the first entity whose id is "chair"
 * const boxes = world.querySelectorAll('.box');        // all entities tagged with "box"
 * const boxChair = world.querySelector('.box .red');
 * ```
 */
declare type Box3SelectorString = string;
/**
 * Interface for all project resources
 */
declare class Box3ResourceSystem {
    ls: (path?: string) => Box3AssetListEntry[];
    constructor(ls: (path?: string) => Box3AssetListEntry[]);
}
/**
 * Describes the type of an asset
 */
declare enum Box3AssetType {
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
declare class Box3AssetListEntry {
    /**
     * Fully qualified path of asset, split by directory
     */
    path: string;
    /**
     * Type of asset
     */
    type: Box3AssetType;
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
        type: Box3AssetType);
}
/**
 * A standard SQL database
 */
declare class Box3Database {
    /**
     * Executes a SQL query on this database
     */
    sql: (sql: string[], ...params: (number | string | Uint8Array | boolean | null)[]) => Box3QueryResult;
    /**
     * @ignore
     */
    constructor(
        /**
         * Executes a SQL query on this database
         */
        sql: (sql: string[], ...params: (number | string | Uint8Array | boolean | null)[]) => Box3QueryResult);
}
/**
 * Query result api
 */
declare class Box3QueryResult implements AsyncIterable<any> {
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
declare type Box3LoggerMethod = (...args: any[]) => void;

declare const console: {
    assert: (assertion, ...args: any[]) => void;
    log: Box3LoggerMethod;
    debug: Box3LoggerMethod;
    error: Box3LoggerMethod;
    warn: Box3LoggerMethod;
    clear: Box3LoggerMethod;
};

declare const world: Box3World;
declare const voxels: Box3Voxels;
declare const resources: {
    ls: (path?: string) => Box3AssetListEntry[];
};
declare const storage: Box3StorageAPI;
declare const http: Box3HttpAPI;

declare function sleep(ms: number): Promise<void>;

declare const require: {
    (module: string): any;
    resolve: (path: string) => string;
};
declare const module: {
    exports: any,
};
declare const exports: any;
declare const __dirname: string;
declare const __filename: string; declare type Box3HttpFetchParams = {};
declare class Box3HttpFetchResponse {
    status: number;
    statusText: string;
    json: () => Promise<any>;
    text: () => Promise<string>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    close: () => Promise<void>;
    constructor(status: number, statusText: string, json: () => Promise<any>, text: () => Promise<string>, arrayBuffer: () => Promise<ArrayBuffer>, close: () => Promise<void>);
    get ok(): boolean;
}
declare class Box3HttpRequest {
}
declare class Box3HttpResponse {
}
declare type Box3HttpHandler = (request: Box3HttpRequest, response: Box3HttpResponse) => void;
declare class Box3HttpAPI {
    url: string;
    fetch: (url: string, params?: Box3HttpFetchParams) => Promise<Box3HttpFetchResponse>;
    onRequest: (handler: Box3HttpHandler) => void;
    constructor(url: string, fetch: (url: string, params?: Box3HttpFetchParams) => Promise<Box3HttpFetchResponse>, onRequest: (handler: Box3HttpHandler) => void);
}

declare class Box3Quaternion {
    w: number;
    x: number;
    y: number;
    z: number;
    constructor(w: number, x: number, y: number, z: number);
    static rotationBetween(a: Box3Vector3, b: Box3Vector3): Box3Quaternion;
    static fromAxisAngle(axis: Box3Vector3, rad: number): Box3Quaternion;
    static fromEuler(x: number, y: number, z: number): Box3Quaternion;
    set(w: number, x: number, y: number, z: number): Box3Quaternion;
    copy(q: Box3Quaternion): Box3Quaternion;
    getAxisAngle(_q: Box3Quaternion): {
        axis: Box3Vector3;
        angle: number;
    };
    rotateX(_rad: number): Box3Quaternion;
    rotateY(_rad: number): Box3Quaternion;
    rotateZ(_rad: number): Box3Quaternion;
    dot(q: Box3Quaternion): number;
    add(v: Box3Quaternion): Box3Quaternion;
    sub(v: Box3Quaternion): Box3Quaternion;
    angle(q: Box3Quaternion): number;
    mul(q: Box3Quaternion): Box3Quaternion;
    inv(): Box3Quaternion;
    div(q: Box3Quaternion): Box3Quaternion;
    slerp(q: Box3Quaternion, n: number): Box3Quaternion;
    mag(): number;
    sqrMag(): number;
    normalize(): Box3Quaternion;
    equals(q: Box3Quaternion): boolean;
    clone(): Box3Quaternion;
    toString(): string;
}
declare class Box3Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
    static fromPolar(mag: number, phi: number, theta: number): Box3Vector3;
    set(x: number, y: number, z: number): Box3Vector3;
    copy(v: Box3Vector3): Box3Vector3;
    add(v: Box3Vector3): Box3Vector3;
    sub(v: Box3Vector3): Box3Vector3;
    mul(v: Box3Vector3): Box3Vector3;
    div(v: Box3Vector3): Box3Vector3;
    addEq(v: Box3Vector3): Box3Vector3;
    subEq(v: Box3Vector3): Box3Vector3;
    mulEq(v: Box3Vector3): Box3Vector3;
    divEq(v: Box3Vector3): Box3Vector3;
    dot(v: Box3Vector3): number;
    cross(v: Box3Vector3): Box3Vector3;
    scale(n: number): Box3Vector3;
    clone(): Box3Vector3;
    lerp(v: Box3Vector3, n: number): Box3Vector3;
    mag(): number;
    sqrMag(): number;
    towards(v: Box3Vector3): Box3Vector3;
    distance(v: Box3Vector3): number;
    normalize(): Box3Vector3;
    angle(v: Box3Vector3): number;
    max(v: Box3Vector3): Box3Vector3;
    min(v: Box3Vector3): Box3Vector3;
    exactEquals(v: Box3Vector3): boolean;
    equals(v: Box3Vector3): boolean;
    toString(): string;
}
declare class Box3Bounds3 {
    lo: Box3Vector3;
    hi: Box3Vector3;
    constructor(lo: Box3Vector3, hi: Box3Vector3);
    static fromPoints(...points: Box3Vector3[]): Box3Bounds3;
    intersect(b: Box3Bounds3): Box3Bounds3;
    contains(b: Box3Vector3): boolean;
    containsBounds(b: Box3Bounds3): boolean;
    intersects(b: Box3Bounds3): boolean;
    set(lox: number, loy: number, loz: number, hix: number, hiy: number, hiz: number): Box3Bounds3;
    copy(b: Box3Bounds3): Box3Bounds3;
    toString(): string;
}
declare class Box3RGBAColor {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number);
    set(r: number, g: number, b: number, a: number): Box3RGBAColor;
    copy(c: Box3RGBAColor): Box3RGBAColor;
    add(rgba: Box3RGBAColor): Box3RGBAColor;
    sub(rgba: Box3RGBAColor): Box3RGBAColor;
    mul(rgba: Box3RGBAColor): Box3RGBAColor;
    div(rgba: Box3RGBAColor): Box3RGBAColor;
    addEq(rgba: Box3RGBAColor): Box3RGBAColor;
    subEq(rgba: Box3RGBAColor): Box3RGBAColor;
    mulEq(rgba: Box3RGBAColor): Box3RGBAColor;
    divEq(rgba: Box3RGBAColor): Box3RGBAColor;
    lerp(rgba: Box3RGBAColor, n: number): Box3RGBAColor;
    blendEq(rgb: Box3RGBColor): Box3RGBColor;
    equals(rgba: Box3RGBAColor): boolean;
    clone(): Box3RGBAColor;
    toString(): string;
}
declare class Box3RGBColor {
    r: number;
    g: number;
    b: number;
    static random(): Box3RGBColor;
    constructor(r: number, g: number, b: number);
    set(r: number, g: number, b: number): Box3RGBColor;
    copy(c: Box3RGBColor): Box3RGBColor;
    add(rgb: Box3RGBColor): Box3RGBColor;
    sub(rgb: Box3RGBColor): Box3RGBColor;
    mul(rgb: Box3RGBColor): Box3RGBColor;
    div(rgb: Box3RGBColor): Box3RGBColor;
    addEq(rgb: Box3RGBColor): Box3RGBColor;
    subEq(rgb: Box3RGBColor): Box3RGBColor;
    mulEq(rgb: Box3RGBColor): Box3RGBColor;
    divEq(rgb: Box3RGBColor): Box3RGBColor;
    lerp(rgb: Box3RGBColor, n: number): Box3RGBColor;
    equals(rgb: Box3RGBColor): boolean;
    clone(): Box3RGBColor;
    toRGBA(): Box3RGBAColor;
    toString(): string;
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
