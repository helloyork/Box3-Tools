/* eslint-disable no-unused-vars */

class Events {
    constructor() {
        this.events = {};
    }
    listen(name, handler) {
        if (!this.events[name]) this.events[name] = [];
        this.events[name].push(handler);
        return {
            cancel: () => this.remove(name, handler)
        };
    }
    emit(name, ...args) {
        if (this.events[name]) this.events[name].forEach(handler => {
            try {
                handler(...args);
            } catch (err) {
                console.error(err, err.stack);
            }
        });
    }
    once(name, handler) {
        const f = (...args) => {
            handler(...args);
            this.events[name] = this.events[name].filter(v => v !== f);
        };
        this.listen(name, f);
        return {
            cancel: () => this.remove(name, f)
        };
    }
    remove(name, handler) {
        if (this.events[name]) this.events[name] = this.events[name].filter(v => v !== handler);
    }
    hasListener(name) {
        return !!this.events[name] && this.events[name].length > 0;
    }
    clear(name) {
        if (this.events[name]) {
            this.events[name] = [];
        }
    }
    countListeners(name) {
        return this.events[name] ? this.events[name].length : 0;
    }
}
