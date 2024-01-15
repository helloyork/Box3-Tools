/**
 * !info {Module} -来自PGAoT-VAS
 */

/**
 * @class 
 * @classdesc 数学空间计算工具类
 */
class Utils {
    /**深拷贝ES5方式 */
    static deepClone(origin, target) {
        var tar = target || {};
        var toStr = Object.prototype.toString;
        var arrType = '[object Array]';
        for (var k in origin) {
            if (origin.hasOwnProperty(k)) {
                if (typeof origin[k] === 'object' && origin[k] !== null) {
                    tar[k] = toStr.call(origin[k]) === arrType ? [] : {};
                    Utils.deepClone(origin[k], tar[k]);
                } else {
                    tar[k] = origin[k];
                }
            }
        }
        return tar;
    }

    /**
     * @method 
     * @param {number} x 数值
     * @return {number} 求导后的值
     * @desc Sigmoid函数，非线性平滑
     */
    static Derivative(x) {
        let sx = Utils.Sigmoid(x)
        return sx * (1 - sx)
    }
    static Sigmoid(x) {
        let ex = Math.E ** x
        return ex / (ex + 1)
    }

    /**
     * @method 
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @return {number} 随机值
     * @desc 在指定范围内随机选择一个数
     */
    static random(min, max) {
        return Math.random() * (max - min) + min;
    };

    /**
     * @method 
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @return {number} 随机值
     * @desc 在指定范围内随机选择一个数，取整
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * @method 
     * @param {number} x x坐标
     * @param {number} y y坐标
     * @param {number} z z坐标
     * @return {Object} 球形坐标
     * @desc 笛卡尔转球型坐标
     */
    static descartesToSphere(x, y, z) {
        let rho = Math.sqrt((x * x) + (y * y) + (z * z));
        let phi = Math.atan2(y, x);
        let theta = Math.acos(z / rho);

        return {
            rho: rho, phi: phi, theta: theta
        }
    }

    /**
     * @method 
     * @param {number} rho 点到坐标原点的距离
     * @param {number} phi 点的“纬度”
     * @param {number} theta 点的“经度”
     * @return {Object} 笛卡尔坐标
     * @desc 球型转笛卡尔坐标
     */
    static sphereToDescartes(rho, phi, theta) {
        let x = rho * Math.sin(theta) * Math.cos(phi);
        let y = rho * Math.sin(theta) * Math.sin(phi);
        let z = rho * Math.cos(theta);

        return {
            x: x, y: y, z: z
        }
    }

    /**
     * @method 
     * @param {Object} vec1 向量1
     * @param {Object} vec2 向量2
     * @return {number} 夹角度数
     * @desc 获取向量夹角
     */
    static getAngleBeetweenVector(vec1, vec2) {
        return Math.acos((vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z) /
            Math.pow((vec1.x * vec1.x + vec1.y * vec1.y + vec1.z * vec1.z) * (vec2.x * vec2.x + vec2.y * vec2.y + vec2.z * vec2.z), 0.5));
    }

    /**
     * @method 
     * @param {Object} v 向量
     * @return {number} 数值
     * @desc 归一化
     */
    static getNormalize(v) {
        let root = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        return v.scale(1 / root);
    }

    /**
     * @method 
     * @param {Object} vecBef 向量
     * @param {Object} vecAft 向量
     * @return {Object} 矩阵
     * @desc 获取两个方向向量间的旋转矩阵
     */
    static getRotationMatrixByVecs(vecBef, vecAft) {
        let axis = vecBef.cross(vecAft);
        let tem = vecBef.dot(vecAft);
        let tep = Math.sqrt(vecBef.dot(vecBef) * vecAft.dot(vecAft));
        let angle = Math.acos(tem / tep);
        if (isNaN(angle)) angle = Math.acos(tep / tem);


        return Utils.getRotationMatrix(angle, axis);
    }

    /**
     * @method 
     * @param {Object} vec 向量
     * @param {Object} matrix 矩阵
     * @return {Object} 旋转后的向量
     * @desc 向量旋转
     */
    static rotateVec3(vec, matrix) {
        let x = matrix[0][0] * vec.x + matrix[1][0] * vec.y + matrix[2][0] * vec.z;
        let y = matrix[0][1] * vec.x + matrix[1][1] * vec.y + matrix[2][1] * vec.z;
        let z = matrix[0][2] * vec.x + matrix[1][2] * vec.y + matrix[2][2] * vec.z;

        return new GameVector3(x, y, z);
    }

    /**获取旋转矩阵 */
    static getRotationMatrix(angle, axis) {
        let rotatinMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        // rotatinMatrix[0][0] = Math.cos(angle) + axis.x * axis.x * (1 - Math.cos(angle));
        // rotatinMatrix[0][1] = axis.x * axis.y * (1 - Math.cos(angle) - axis.z * Math.sin(angle));
        // rotatinMatrix[0][2] = axis.y * Math.sin(angle) + axis.x * axis.z * (1 - Math.cos(angle));

        // rotatinMatrix[1][0] = axis.z * Math.sin(angle) + axis.x *axis.y * (1 - Math.cos(angle));
        // rotatinMatrix[1][1] = Math.cos(angle) + axis.x * axis.y * (1 - Math.cos(angle));
        // rotatinMatrix[1][2] = -axis.x * Math.sin(angle) + axis.y * axis.z * (1 - Math.cos(angle));

        // rotatinMatrix[2][0] = -axis.y * Math.sin(angle) + axis.x * axis.z * (1 - Math.cos(angle));
        // rotatinMatrix[2][1] = axis.x * Math.sin(angle) + axis.y * axis.z * (1 - Math.cos(angle));
        // rotatinMatrix[2][2] = Math.cos(angle) + axis.z * axis.z * (1 - Math.cos(angle));

        rotatinMatrix[0][0] = Math.cos(angle) + axis.x * axis.x * (1 - Math.cos(angle));
        rotatinMatrix[0][1] = axis.x * axis.y * (1 - Math.cos(angle)) - axis.z * Math.sin(angle);
        rotatinMatrix[0][2] = axis.y * Math.sin(angle) + axis.x * axis.z * (1 - Math.cos(angle));

        rotatinMatrix[1][0] = axis.z * Math.sin(angle) + axis.x * axis.y * (1 - Math.cos(angle));
        rotatinMatrix[1][1] = Math.cos(angle) + axis.y * axis.y * (1 - Math.cos(angle));
        rotatinMatrix[1][2] = -axis.x * Math.sin(angle) + axis.y * axis.z * (1 - Math.cos(angle));

        rotatinMatrix[2][0] = -axis.y * Math.sin(angle) + axis.x * axis.z * (1 - Math.cos(angle));
        rotatinMatrix[2][1] = axis.x * Math.sin(angle) + axis.y * axis.z * (1 - Math.cos(angle));
        rotatinMatrix[2][2] = Math.cos(angle) + axis.z * axis.z * (1 - Math.cos(angle));
        return rotatinMatrix;
    }

    /**
     * @method 
     * @param {Object} quat 四元数
     * @return {number} 角度
     * @desc 四元数转欧拉角
     */
    static qaternionToEulerAngles(quat) {
        // console.log(quat);
        let roll = Math.atan2(2 * (quat.w * quat.z + quat.x * quat.y), 1 - 2 * (quat.z * quat.z + quat.x * quat.x)); //Z
        let yaw = Math.sin(2 * (quat.w * quat.x - quat.y * quat.z)); //Y
        let pitch = Math.atan2(2 * (quat.w * quat.y + quat.z * quat.x), 1 - 2 * (quat.y * quat.y + quat.x * quat.x));//X
        // console.log(roll+","+yaw+","+pitch);
        return Utils.getNormalize(new GameVector3(pitch, yaw, roll));
    }

    /**
     * @method 
     * @param {Object} vec 向量
     * @return {number} 角度
     * @desc 获取方向向量间的Y轴的旋转角度
     */
    static getAngleYByVecs(vec) {
        return Math.acos(vec.z /
            Math.pow((vec.x * vec.x + vec.y * vec.y + vec.z * vec.z), 0.5));
    }

    /**
     * @method 
     * @param {Object} vec 向量
     * @return {Object} 坐标
     * @desc 获取y轴旋转矩阵
     */
    static rotationByAxiaY(angle, vec) {
        return new GameVector3(Math.cos(angle) * vec.x + Math.sin(angle) * vec.z,
            vec.y, - Math.sin(angle) * vec.x + Math.cos(angle) * vec.z);
    }
}
module.exports = { Utils }