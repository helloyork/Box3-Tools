/* eslint-disable no-unused-vars */
class Require {
    static Executable = class Executable {
        static getExecutableString(str) {
            return `;const {module,require} = args;(function(){(${typeof str === "string" ? str : str.toString()})?.()})();return {module};`;
        }
        static createFunction(args, body) {
            return new Function(...args, body);
        }
        cache = null;
        exports = null;
        _module = {
            exports: {},
        };
        constructor(func, require) {
            this.module = Executable.getExecutableString(func);
            this.require = require;
        }
        getArgs({ module, require } = { require: this.require}) {
            return {
                args: ["args"],
                content: {
                    module,
                    require,
                }
            };
        }
        getModule() {
            return this._module;
        }
        exec() {
            if (this.cache) return this.cache;
            let result = Executable.createFunction(this.getArgs().args, this.module)(this.getArgs({
                module: this.getModule(),
                require: this.require
            }).content);
            this.cache = result.module?.exports || {};
            return this.cache;
        }
    };
    constructor(modules = []) {
        this.modules = {};
        this.addModules(modules);
    }
    getModules() {
        return this.modules;
    }
    addModules(modules) {
        Object.keys(modules).forEach((key) => {
            this.addModule(key, modules[key]);
        });
        return this;
    }
    addModule(name, func) {
        this.modules[name] = Reflect.construct(Require.Executable, [func, this.require.bind(this)]);
        return this;
    }
    require(module) {
        if (this.getModules()[module]) {
            return this.getModules()[module].exec();
        }
        throw new Error(`Module ${module} not found`);
    }
}