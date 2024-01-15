/**
 * !info {Module} -来自PGAoT-VAS
 */

/**
 * @class 
 * @classdesc 计时器
 * @desc 计时器，原理与setTimeout()相同。但自己实现，可控
 */
class Timer {
    constructor() {
        this.loop = false;
        this.cd = 0;
        this.callback = null;
        this.timecount = 0;
        this.isStop = true;
    }

    /**
     * @method 
     * @param {number} cd 间隔时间
     * @param {number} cb 回调函数
     * @param {boolean} loop 【默认否】是否循环
     * @desc 设置计时器配置
     */
    setTimer(cd, cb, loop = false) {
        this.loop = loop;
        this.cd = cd;
        this.callback = cb;
    }

    /**
     * @method 
     * @desc 开始计时器
     */
    start() {
        this.timecount = 0;
        this.isStop = false;
    }

    /**
     * @method 
     * @param {number} dt 时间值
     * @desc 更新计时器
     */
    update(dt) {
        if (this.isStop) return;
        this.timecount += dt;
        if (this.timecount >= this.cd) {
            if (this.callback) this.callback();
            if (this.loop) {
                this.timecount -= this.cd;
            }
            else {
                this.isStop = true;
            }
        }
    }

    /**
     * @method 
     * @desc 停止计时器
     */
    stop() {
        this.isStop = true;
    }
}
module.exports = { Timer }