//参考文档：https://apifox.com/apidoc/shared-f3366919-0f59-46c4-9ff0-34b48cbc6f03
const { Utils } = require("./Utils.js");
/**Box3RelativeSkeleton 相对骨骼绑定
 * @param {Arr[][Box3Vector3]} pos 骨骼移动范围
 * @param {number} moveSpeed 速度
 * @param {number} lerpSpeed 旋转速度
*/
class Box3RelativeSkeleton {
    constructor(pos, moveSpeed, lerpSpeed) {
        /**方向 */
        this.direction = new Box3Vector3(0, 0, 1);
        /**移动目标点 */
        this.targetPos = new Box3Vector3(0, 0, 0);
        /**y轴旋转 */
        this.angleY = 0;
        this.moveSpeed = moveSpeed
        this.lerpSpeed = lerpSpeed
        this.moveZoneMin = pos[0];
        this.moveZoneMax = pos[1];
        /**骨骼数据 */
        this.skeletonArr = null
        this.posArr = []
    }
    /**修改移动范围和速度*/
    SetPos(pos, moveSpeed) {
        this.moveSpeed = moveSpeed
        this.moveZoneMin = pos[0];
        this.moveZoneMax = pos[1];
    }
    /**移动到目的点 */
    MoveToTargetPos(dt) {
        //计算方向
        this.direction =
            this.direction.lerp(Utils.getNormalize(this.targetPos.sub(this.entity.position)), this.lerpSpeed * dt);//转向
        let pos = this.entity.position.add(
            this.direction.scale(this.moveSpeed * dt / 1000)); //位移
        this.entity.position = pos;
        this.UpdateParts();
        if (this.IsArrived()) {
            this.targetPos = this.GetRandTargetPos();//计算目标点
        }
    }
    /**随机一个可以移动位置 */
    GetRandTargetPos() {
        return new Box3Vector3(Utils.random(this.moveZoneMin.x,
            this.moveZoneMax.x),
            Utils.random(this.moveZoneMin.y, this.moveZoneMax.y),
            Utils.random(this.moveZoneMin.z, this.moveZoneMax.z));
    }
    /**是否到达目标点 */
    IsArrived() {
        return this.entity.position.distance(this.targetPos) <= 10;
    }
    /**看向目标 */
    LookAtTarget(dt, target) {
        //计算方向
        this.direction =
            this.direction.lerp(Utils.getNormalize(target.position.sub(this.entity.position)), 0.01 * dt);//转向
        this.angleY = Math.atan2(this.direction.z, this.direction.x) + Math.PI / 2;
        this.entity.meshOrientation = Utils.defaultQuat.rotateY(this.angleY); //模型转向

        this.UpdateParts();
    }
    /**获取所有的键 */
    GetKeys(datastore) {
        let result = [];
        for (var key in datastore) {
            result.push(key);
        }
        return result;
    }
    /**获取所有的值 */
    GetValues(datastore) {
        let result = [];
        for (var key in datastore) {
            result.push(datastore[key]);
        }
        return result;
    }
    /**获取所有的值并执行函数 */
    GetValuesCallback(datastore, callback) {
        let i = 0
        for (var key in datastore) {
            if (callback) callback(key, datastore[key], i);
            i++
        }
    }
    /** 尝试获取字典中的值*/
    TryGetValue(datastore, key) {
        if (datastore[key]) {
            return datastore[key];
        }
        return null;
    }

    /**骨骼绑定，开始执行 */
    MakeEntity(skeletonArr) {
        this.skeletonArr = skeletonArr
        this.posArr = []
        //记录偏移值
        this.GetValuesCallback(this.skeletonArr, (key, values) => {
            this.posArr.push(values.position)
        })
        //字典第一个为中心
        this.entity = this.TryGetValue(this.skeletonArr, 'entity')
        this.UpdateParts();
    }
    /**刷新所有部件 */
    UpdateParts() {
        this.angleY = Math.atan2(this.direction.z, this.direction.x) + Math.PI / 2;
        let rot = Utils.defaultQuat.rotateY(this.angleY); //模型转向
        this.entity.meshOrientation = rot;
        this.GetValuesCallback(this.skeletonArr, (key, values, i) => {
            if (key != 'entity') {
                values.meshOrientation = rot;
                let offset = Utils.rotationByAxiaY(-this.angleY, this.posArr[i]);
                values.position = this.entity.position.add(offset);
            }
        })
    }
}
module.exports = { Box3RelativeSkeleton }