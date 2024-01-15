/**
 * !info {Module} -来自PGAoT-VAS
 */

//参考文档：https://apifox.com/apidoc/shared-f3366919-0f59-46c4-9ff0-34b48cbc6f03
const { Utils } = require("./Utils.js");
/**BasicCamera Game摄像机摇臂父类配置
 * @param {Arr[GameEntity]} entityPlayer 视角实体
 * @param {GameEntity} camera 相机
 * @param {GameCameraMode} cameraMode 原始视角
 * @param {Arr[x,y,z]} offset 跟随者笛卡尔坐标偏移量
*/
class BasicCamera {
    constructor(entityPlayer, camera, cameraMode, offset = [null, null, null]) {
        /**刷新速度（毫秒） */
        this.speed = 50;
        /**轴偏移量 */
        [this.offset_X, this.offset_Y, this.offset_Z] = offset;
        /**视角实体*/
        this.e = entityPlayer;
        /**摄像机 */
        this.entity = camera;
        /**原始视角 */
        this.cameraMode = cameraMode;
        /**调试模式 */
        this.clack = false;
        /**调试下的定位点大小 */
        this.clackMeshScale = null;
        /**摄像机当前看向方向 */
        this.fixedPosition = null;
        /**摄像机是否停止运行 */
        this.stop = true;
        /**摄像机停止是否回到原本实体上 */
        this.stopinit = true
        /**自定义全局结束回调函数 */
        this.callback = null
        this.timer = null
    }

    /**遍历视角实体 */
    QuerySelector(callback) {
        for (let i = 0; i < this.e.length; i++) {
            if (callback) callback(this.e[i]);
        }
    }

    /**摄像机实体状态
    * @param {boolean} b 显示隐藏
    */
    MeshInvisible(b) {
        this.entity.meshInvisible = b
    }

    /**检查移动轨迹，用于测试环境中参考
     *  @param {number} clackMeshScale 定位点实体等比例缩放值
    */
    Click(clackMeshScale) {
        this.clackMeshScale = clackMeshScale
        this.clack = true
        this.QuerySelector((i) => {
            i.player.canFly = true
            i.player.spectator = true
            i.player.invisible = true
            i.player.showName = false
        })

    }

    /**Game视角到摄像机*/
    CameraEntity2(entity = null) {
        if (entity) {
            entity.player.cameraEntity = this.entity
        } else {
            this.QuerySelector((i) => {
                i.player.cameraEntity = this.entity
            })
        }
    }

    /**摄像机设置 */
    CameraSettings(cameraMode = this.cameraMode, e = null, cameraUp = new GameVector3(0, 1, 0), fovY = 0.25, disableInput = GameInputDirection.BOTH, cameraEntity = this.entity) {
        this.fixedPosition = e
        this.QuerySelector((i) => {
            i.player.cameraEntity = cameraEntity
            i.player.cameraMode = cameraMode;
            i.player.cameraPosition = this.entity.position
            i.player.cameraTarget = this.fixedPosition
            i.player.cameraUp = cameraUp
            i.player.cameraFovY = fovY
            i.player.disableInputDirection = disableInput;
        })
    }

    /**结束运行 */
    EndTime() {
        this.stop = true
        clearInterval(this.timer);
    }

    /**Game视角回到视角实体*/
    CameraEntity(entity = null) {
        if (entity) {
            entity.player.cameraEntity = entity
            entity.player.cameraMode = this.cameraMode;
            entity.player.cameraFovY = 0.25
            entity.player.disableInputDirection = GameInputDirection.NONE;
        } else {
            this.QuerySelector((i) => {
                i.player.cameraEntity = i
                i.player.cameraMode = this.cameraMode;
                i.player.cameraFovY = 0.25
                i.player.disableInputDirection = GameInputDirection.NONE;
            })
        }
    }

    /**内部方法，轨迹例子配置 */
    SetParticle(r, g, b) {
        Object.assign(this.entity, {
            particleRate: 100,
            particleSize: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            particleLifetime: 100000,
            particleColor: [
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
                new GameRGBColor(r / 255, g / 255, b / 255),
            ],
        });
    }
    /**设置结束移动自定义函数 */
    SetEndMoveFunc(callback) {
        if (callback) this.callback = callback
    }

    /**获取当前运行状态 */
    GetStop() {
        return this.stop
    }
    //得到当前类所属返回缓动效果(逐渐变速)
    GetEntityEaseInCubic(degreee) {
        return {
            '1': Math.abs(degreee) / 100,
            '2': Math.abs(1 - degreee) / 100
        }
    }
}


/**GameCameraMoves  Game摄像机摆臂移动（3阶内，连续）
 * @param {Str} anchorsName 定位点名称（不带数字）
 * @param {Arr[]} cdata 定位点数据（二维列表）
*/
class GameCameraMoves extends BasicCamera {
    constructor(entityPlayer, camera, cameraMode, anchorsName, cdata, offset = [null, null, null]) {
        super(entityPlayer, camera, cameraMode, offset)
        /**定位点名称（不带数字） */
        this.anchorsName = "#" + anchorsName;
        /**测试，快速到点 */
        //this.demo = 0
        /**当前定位点 */
        this.anchorRecords = 0;
        /**定位点读档 */
        this.anchorRecordscdata = 0;
        /*定位点数据 */
        this.cdata = cdata;
    }
    /**开始移动 */
    Run(b = true) {
        this.stopinit = b
        if (this.stop) {
            this.GetPositioningStyle()
            this.stop = false
        }
    }

    //得到当前类所属返回同步速度
    GetEntity() {
        return this.GetRnchorRecordscdataArr()[1]
    }

    //回调当前自定义函数
    GetRnchorRecordscdataCallback(i, ...args) {
        if (!this.GetRnchorRecordscdataArr()[i]) return;
        return this.GetRnchorRecordscdataArr()[i](...args)
    }

    //得到当前类所属返回缓动效果
    GetEntityLinear(degreee) {
        return this.GetRnchorRecordscdataArr()[2] == 1 || this.GetRnchorRecordscdataArr()[2] == 2
            ? this.GetEntityEaseInCubic(degreee)[this.GetRnchorRecordscdataArr()[2]]
            : degreee < 0.5
                ? ((Math.pow(2 * degreee, 2) * ((this.GetRnchorRecordscdataArr()[2] + 1) * 2 * degreee - this.GetRnchorRecordscdataArr()[2])) / 2) / 100
                : ((Math.pow(2 * degreee - 2, 2) * ((this.GetRnchorRecordscdataArr()[2] + 1) * (degreee * 2 - 2) + this.GetRnchorRecordscdataArr()[2]) + 2) / 2) / 100;
    }
    //得到当前类所属返回初始位置
    GetEntityAngle() {
        let p = world.querySelector(this.anchorsName + '0').position;
        return new GameVector3(p.x, p.y, p.z)
    }
    /**移动 */
    Go(v) {

        let r = Math.round(Math.random() * 255), g = Math.round(Math.random() * 255), b = Math.round(Math.random() * 255);
        let degreee = 0, deger = 0;
        this.timer = setInterval(() => {
            if (this.fixedPosition) {
                this.QuerySelector((i) => {
                    i.player.cameraTarget = this.fixedPosition
                    i.player.cameraPosition = this.entity.position
                })
            }
            // if (this.demo > this.anchorRecordscdata) {
            //     this.speed = 1
            // } else {
            //     this.speed = 200
            // }

            degreee += this.GetEntity()
            //缓动函数，1：逐渐减速，2：逐渐加速。null：匀速。其他数字：后顿前倾
            this.GetRnchorRecordscdataArr()[2] == 1 || this.GetRnchorRecordscdataArr()[2] == 2
                ? deger += this.GetEntityLinear(degreee)
                : deger = degreee
            this.clack && this.cdata.length >= this.anchorRecordscdata ? this.SetParticle(r, g, b) : null;

            this.entity.position = this.BesselDictionary(deger)[v]
            if (deger >= 1) {

                this.GetRnchorRecordscdataCallback(4, this.entity.position, this.GetRnchorRecordscdataArr()[3])
                setTimeout(() => {
                    this.anchorRecords += v
                    this.GetPositioningStyle()
                }, this.GetRnchorRecordscdataArr()[3])
                clearInterval(this.timer)
            }
        }, this.speed)
    }
    /**内部方法，得到下定位点位置处理样式 */
    GetPositioningStyle() {

        if (this.cdata.length > this.anchorRecordscdata) {
            this.stop = false
            this.Go(this.cdata[this.anchorRecordscdata][0])
        } else {
            this.Initialiser()
            this.stop = true
            return
        }

        this.anchorRecordscdata += 1

    }

    /**内部方法，得到定位点 
    * @param {number} v 下定位点号
    */
    GetPositioning(v) {

        if (this.clack) world.querySelector(this.anchorsName + (this.anchorRecords + v)).meshScale = new GameVector3(this.clackMeshScale, this.clackMeshScale, this.clackMeshScale);
        return world.querySelector(this.anchorsName + (this.anchorRecords + v)).position;
    }
    /**内部方法，获取当前运行状态Arr */
    GetRnchorRecordscdataArr() {
        return this.cdata.length >= this.anchorRecordscdata ? this.cdata[this.anchorRecordscdata - 1] : this.cdata[0];
    }
    /**内部方法，结束运行后初始化 */
    Initialiser() {
        this.CameraEntity()
        this.entity.position = this.GetEntityAngle()
        /**当前定位点 */
        this.anchorRecords = 0
        /**定位点读档 */
        this.anchorRecordscdata = 0
        /**回调函数 */
        if(this.callback) this.callback.call(this,this.e)

    }

    /**内部方法，移动配置 */
    BesselDictionary(degreee) {
        return {
            '1': GameBessel.OneBezier(degreee, [this.GetPositioning(0).x + this.offset_X, this.GetPositioning(0).y + this.offset_Y, this.GetPositioning(0).z + this.offset_Z], [this.GetPositioning(1).x + this.offset_X, this.GetPositioning(1).y + this.offset_Y, this.GetPositioning(1).z + this.offset_Z]),
            '2': GameBessel.TwoBezier(degreee, [this.GetPositioning(0).x + this.offset_X, this.GetPositioning(0).y + this.offset_Y, this.GetPositioning(0).z + this.offset_Z], [this.GetPositioning(1).x + this.offset_X, this.GetPositioning(1).y + this.offset_Y, this.GetPositioning(1).z + this.offset_Z], [this.GetPositioning(2).x + this.offset_X, this.GetPositioning(2).y + this.offset_Y, this.GetPositioning(2).z + this.offset_Z]),
            '3': GameBessel.ThreeBezier(degreee, [this.GetPositioning(0).x + this.offset_X, this.GetPositioning(0).y + this.offset_Y, this.GetPositioning(0).z + this.offset_Z], [this.GetPositioning(1).x + this.offset_X, this.GetPositioning(1).y + this.offset_Y, this.GetPositioning(1).z + this.offset_Z], [this.GetPositioning(2).x + this.offset_X, this.GetPositioning(2).y + this.offset_Y, this.GetPositioning(2).z + this.offset_Z], [this.GetPositioning(3).x + this.offset_X, this.GetPositioning(3).y + this.offset_Y, this.GetPositioning(3).z + this.offset_Z])
        }
    }
}



/**GameCameraLag 摄像机延迟&呼吸 
 *  @param {GameEntity} e 相机跟随者
 *  @param {GameEntity} e1 相机本身
 *  @param {number} delay 摄像机呼吸速度
 *  @param {number} breatheSpeed 摄像机延迟跟随时间
 *  @param {number} breatheAmplitudeY Y轴上下摆动幅度
 *  @param {number} radiusMultiplierY Y轴上下摆动半径倍数
*/
class GameCameraLag {
    constructor(e, e1, delay, breatheSpeed, breatheAmplitudeY, radiusMultiplierY) {
        /**摄像机跟随者*/
        this.e = e
        /**充当摄像机 */
        this.e1 = e1
        /**摄像机呼吸速度 */
        this.delay = delay
        /** 摄像机延迟跟随*/
        this.breatheSpeed = breatheSpeed
        /**Y轴上下摆动幅度 */
        this.breatheAmplitudeY = breatheAmplitudeY
        /**Y轴上下摆动半径倍数 */
        this.radiusMultiplierY = radiusMultiplierY
        /**x轴上下摆动幅度 */
        this.breatheAmplitudeX = 0.2
        /**x轴上下摆动半径倍数 */
        this.radiusMultiplierX = 0.2
        /**z轴上下摆动幅度 */
        this.breatheAmplitudeZ = 0.2
        /**z轴上下摆动半径倍数 */
        this.radiusMultiplierZ = 0.2
        /**执行速度 */
        this.degre = 0
        /**内部属性，循环跟随控制 */
        this.time = null
        /**实体位置简化 */
        this.epo = this.e.position
        /**初始化摄像机位置 */
        this.Sete1Position()
    }
    /**实体与摄像机位置同步 */
    Sete1Position() {
        this.e1.position = new GameVector3
            (
                this.epo.x,
                this.epo.y,
                this.epo.z
            )
    }
    /**得到当前实体位移坐标 */
    GetPosition() {
        return this.e1.position
    }

    /**跟随运行 */
    RunTime() {
        this.time = setInterval(() => {
            this.degre += this.delay
            this.SetLog()
        }, this.breatheSpeed);
    }
    /**结束跟随 */
    EndTime() {
        clearInterval(this.time)
    }
    /**Game视角回到充当摄像机的实体上*/
    CameraEntity2() {
        if (this.e.isPlayer) this.e.player.cameraEntity = this.e1
    }
    /**摄像机实体状态
    * @param {boolean} b 显示隐藏
    */
    MeshInvisible(b) {
        this.e1.meshInvisible = b
    }
    /**Game视角回到摄像机跟随者 */
    CameraEntity() {
        if (this.e.isPlayer) this.e.player.cameraEntity = this.e
    }
    /**设置上下摆动幅度 
    * @param {str} type 坐标轴 
    * @param {number} num 数字
    */
    SetBreatheAmplitude(type, num) {
        switch (type) {
            case 'X':
                this.breatheAmplitudeX = num
                break;
            case 'Y':
                this.breatheAmplitudeY = num
                break;
            case 'Z':
                this.breatheAmplitudeZ = num
                break;
        }
    }
    /**设置摆动半径倍数 
    * @param {str} type 坐标轴 
    * @param {number} num 半径倍速
    */
    SetradiusMultiplier(type, num) {
        switch (type) {
            case 'X':
                this.radiusMultiplierX = num
                break;
            case 'Y':
                this.radiusMultiplierY = num
                break;
            case 'Z':
                this.radiusMultiplierZ = num
                break;
        }
    }
    /**摄像机呼吸速度
    * @param {number} delay 速度
    */
    SetDelay(delay) {
        this.delay = delay
    }

    /** 摄像机延迟跟随
    *  @param {number} breatheSpeed 速度
    */
    SetBreatheSpeed(breatheSpeed) {
        this.breatheSpeed = breatheSpeed
    }
    /** 摄像机视距
    *  @param {number} x x轴大小
    *  @param {number} y y轴大小
    *  @param {number} z z轴大小
    */
    SetmeshScale(x, z, y) {
        this.e1.meshScale = new GameVector3(x, z, y)
    }

    /**获取上下摆动幅度 
    * @param {str} type 坐标轴 
    * @param {number} num 大小 
    */
    GetBreatheAmplitude(type) {
        switch (type) {
            case 'X':
                return this.breatheAmplitudeX
            case 'Y':
                return this.breatheAmplitudeY
            case 'Z':
                return this.breatheAmplitudeZ
        }
    }
    /**获取摆动半径倍数
    * @param {str} type 坐标轴 
    */
    GetradiusMultiplier(type) {
        switch (type) {
            case 'X':
                return this.radiusMultiplierX
            case 'Y':
                return this.radiusMultiplierY
            case 'Z':
                return this.radiusMultiplierZ
        }
    }
    /**获取摄像机呼吸速度*/
    GetDelay() {
        return this.delay
    }
    /** 获取摄像机延迟跟随*/
    GetBreatheSpeed() {
        return this.breatheSpeed
    }
    /**内部方法，设置摄像机摆动 */
    Sete1XYZPosition() {
            this.e1.position = new GameVector3(
                this.epo.x + this.Cos(this.breatheAmplitudeX, this.radiusMultiplierX),
                this.epo.y + this.radiusMultiplierY * Utils.Derivative(this.breatheAmplitudeY * this.Sin(this.breatheAmplitudeY, this.radiusMultiplierY)),
                this.epo.z + this.Cos(this.breatheAmplitudeZ, this.radiusMultiplierZ)
            )
    }
    /**内部方法，获取延迟方式。 */
    SetLog() {
        this.Sete1XYZPosition()
    }
    /**呼吸系统，默认非行走中触发，作者可更加实际情况进行改动 */
    Sin(breatheAmplitude, radiusMultiplier) {
        return Math.sin(breatheAmplitude * Math.PI / 360 * this.degre) * radiusMultiplier
    }
    Cos(breatheAmplitude, radiusMultiplier) {
        return Math.cos(breatheAmplitude * Math.PI / 360 * this.degre) * radiusMultiplier
    }
}


/**贝塞尔类*/
class GameBessel {
    constructor() {
    }
    /**
    * @desc 一阶贝塞尔
    * @param {number} t 当前百分比
    * @param {Array} p1 起点坐标
    * @param {Array} p2 终点坐标
    */
    static OneBezier(t, p1, p2) {
        const [x1, y1, z1] = p1;
        const [x2, y2, z2] = p2;
        let x = x1 + (x2 - x1) * t;
        let y = y1 + (y2 - y1) * t;
        let z = z1 + (z2 - z1) * t;
        return new GameVector3(x, y, z);
    }
    /**
     * @desc 二阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} cp 控制点
     * @param {Array} p2 终点坐标
     */
    static TwoBezier(t, p1, cp, p2) {
        const [x1, y1, z1] = p1;
        const [cx, cy, cz] = cp;
        const [x2, y2, z2] = p2;
        let x = Math.pow((1 - t), 2) * x1 + 2 * t * (1 - t) * cx + Math.pow(t, 2) * x2;
        let y = Math.pow((1 - t), 2) * y1 + 2 * t * (1 - t) * cy + Math.pow(t, 2) * y2;
        let z = Math.pow((1 - t), 2) * z1 + 2 * t * (1 - t) * cz + Math.pow(t, 2) * z2;
        return new GameVector3(x, y, z);
    }
    /**
    * @desc 三阶贝塞尔
    * @param {number} t 当前百分比
    * @param {Array} p1 起点坐标
    *  @param {Array} cp1 控制点1
    * @param {Array} cp2 控制点2
    * @param {Array} p2 终点坐标
    */
    static ThreeBezier(t, p1, cp1, cp2, p2) {
        const [x1, y1, z1] = p1;
        const [x2, y2, z2] = p2;
        const [cx1, cy1, cz1] = cp1;
        const [cx2, cy2, cz2] = cp2;
        let x = x1 * Math.pow((1 - t), 3) + 3 * cx1 * t * Math.pow((1 - t), 2) + 3 * cx2 * Math.pow(t, 2) * (1 - t) + x2 * Math.pow(t, 3);
        let y = y1 * Math.pow((1 - t), 3) + 3 * cy1 * t * Math.pow((1 - t), 2) + 3 * cy2 * Math.pow(t, 2) * (1 - t) + y2 * Math.pow(t, 3);
        let z = z1 * Math.pow((1 - t), 3) + 3 * cz1 * t * Math.pow((1 - t), 2) + 3 * cz2 * Math.pow(t, 2) * (1 - t) + z2 * Math.pow(t, 3);
        return new GameVector3(x, y, z);
    }

}
/**GameHighBessel  Game摄像机摆臂移动（高阶）
 * @param {Str} anchorsName 定位点名称（不带数字）
 * @param {number} entityLinear 移动方式
*/
class GameHighBessel extends BasicCamera {
    constructor(entityPlayer, camera, cameraMode, anchorsName, entityLinear = 0, offset = [null, null, null]) {
        super(entityPlayer, camera, cameraMode, offset)
        this.entityLinear = entityLinear
        this.degreee = 0
        this.degred = 0
        /**定位点名字 */
        this.name = "#" + anchorsName;
        /**高阶定位点*/
        this.data = [];
        this.finaldata = [];
    }

    /**得到定位点数据 */
    GetData() {
        return this.data
    }
    /**计算位置 */
    CalcMiddle(p1, p2) {
        return { x: (p2.x - p1.x) * this.degred + p1.x, y: (p2.y - p1.y) * this.degred + p1.y, z: (p2.z - p1.z) * this.degred + p1.z };
    }

    /**得到位置*/
    GetPositioning() {
        this.finaldata.forEach(({ x, y, z }, index) => {
            this.entity.position = new GameVector3(x + this.offset_X, y + this.offset_Y, z + this.offset_Z)
        });
    }

    /**计算点*/
    DrawLines(ps) {
        if (ps.length < 2) {
            const { x, y, z } = ps[0];
            this.finaldata.push({ x, y, z });
            this.GetPositioning();
            return;
        }
        const pps = [];
        for (let i = 0; i < ps.length - 1; i++) {
            pps.push(this.CalcMiddle(ps[i], ps[i + 1], ps[i + 2]));
        }
        this.DrawLines(pps)
    }

    /**定时计算，开始运行 */
    Run(p, speed = 0.01) {
        if (this.stop) {
            for (let i = 0; i <= p; i++) {
                let position = world.querySelector(this.name + i).position;
                this.data.push({ x: position.x, y: position.y, z: position.z })
            }
            this.stop = false
            this.DrawLines(this.data);
            this.degreee = 0
            this.degred = 0
            if (this.clack) {
                let r = Math.round(Math.random() * 255), g = Math.round(Math.random() * 255), b = Math.round(Math.random() * 255);
                this.SetParticle(r, g, b)
            }
            this.timer = setInterval(() => {
                this.degreee += speed;
                //缓动函数，1：逐渐减速，2：逐渐加速。null：匀速。其他数字：后顿前倾
                this.entityLinear == 1 || this.entityLinear == 2
                    ? this.degred += this.GetEntityLinear(this.degreee)
                    : this.degred = this.degreee

                this.DrawLines(this.data);
                if (this.degred >= 1) {
                    this.stop = true
                    if (this.callback) this.callback.call(this, this.e)
                    clearInterval(this.timer);
                }
            }, this.speed);
        }
    }
    //得到当前类所属返回缓动效果
    GetEntityLinear(degreee) {
        return this.entityLinear == 1 || this.entityLinear == 2
            ? this.GetEntityEaseInCubic(degreee)[this.entityLinear]
            : degreee < 0.5
                ? ((Math.pow(2 * degreee, 2) * ((this.entityLinear + 1) * 2 * degreee - this.entityLinear)) / 2) / 100
                : ((Math.pow(2 * degreee - 2, 2) * ((this.entityLinear + 1) * (degreee * 2 - 2) + this.entityLinear) + 2) / 2) / 100;
    }
}
module.exports = { GameCameraMoves, GameCameraLag, GameBessel, GameHighBessel };