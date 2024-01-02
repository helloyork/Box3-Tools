
function GUIAnimation({ interval = 1, easeFunctions } = {}) {
    let animations = [], time = 0;
    let timer = setInterval(() => {
        time++;
        animations.filter(a => ((time - a.startTime) % a.delay === 0)).forEach(v => {
            if (time - v.startTime >= v.time) {
                animations = animations.filter(t => t !== v);
                v.stop();
            }
            else v.animate(time);
        });
    }, interval);
    class Animation {
        static easing = {
            easeInSine: (x) => (1 - Math.cos((x * Math.PI) / 2)),
            easeOutSine: (x) => (Math.sin((x * Math.PI) / 2)),
            easeInOutSine: (x) => (-(Math.cos(Math.PI * x) - 1) / 2)
        };
        static stop() {
            clearInterval(timer);
        };
        constructor(config) {
            let def = {easingFunction: (x) => x,begin: 0,end: 1,time: 1000,delay: 10};
            Object.keys(def).forEach(k => this[k] = config[k] ? config[k] : def[k]);
            this._onStop = [];
            this._onStart = [];
            this.current = 0;
            this.pending = false;
        }
        start(trigger) {
            if (!this.pending) {
                this.pending = true;
                this.startTime = time;
                this.trigger = trigger;
                this.current = 0;
                animations.push(this);
                this._onStart.forEach(v => v(this));
            }
        }
        animate() {
            this.current += this.delay;
            this.trigger(this.begin + (this.end - this.begin) * this.easingFunction(this.current / this.time));
        }
        stop() {
            this.pending = false;
            this._onStop.forEach(v => v(this));
        }
        onStop(f) {
            this._onStop.push(f);
            return {
                cancel: () => this._onStop = this._onStop.filter(v => v !== f)
            }
        }
        onStart(f) {
            this._onStart.push(f);
            return {
                cancel: () => this._onStart = this._onStart.filter(v => v !== f)
            }
        }
    };
    if (easeFunctions) Object.assign(Animation.easing, easeFunctions);
    return Animation;
}
