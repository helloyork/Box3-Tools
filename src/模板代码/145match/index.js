/**
 * !Info {Module} -来自145a
 * 145match 1.0
 */
class Match {
    /**
     * @param {function} onStart
     * @param {function(number)} onSecond
     * @param {function():boolean} canEnd
     * @param {function} onEnd
     */
    constructor(onStart, onSecond, canEnd, onEnd) {
        this.timeSecond = 0;
        this.onStart = onStart;
        this.onSecond = onSecond;
        this.canEnd = canEnd;
        this.onEnd = onEnd;
    }
    async play() {
        this.onStart();
        this.timeSecond = 0
        do {
            this.timeSecond += 1;
            this.onSecond(this.timeSecond);
            await sleep(999);
        } while (!this.canEnd())
        this.onEnd();
        this.timeSecond = 0;
    }
}
world.createMatch = function (...params) {
    return new Match(...params);
}
//请勿删除最后一行