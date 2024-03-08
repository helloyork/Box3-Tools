/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const { require } = requireFrom();

require("./test1.js");

function requireFrom(_ = {
    /* Add your modules here */
    "./test1.js": function() {
        console.log("test1");
        console.log(require("./test2.js").output);
    },
    "./test2.js": function() {
        console.log("test2");
        module.exports.output = "test2";
    }
}) {
    let modules = {};
    class Executable {
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
        constructor(func) {
            this.module = Executable.getExecutableString(func);
        }
        getArgs({ module } = {}) {
            return {
                args: ["args"],
                content: {
                    module,
                    require
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
            }).content);
            this.cache = result.module?.exports || {};
            return this.cache;
        }
    }
    function require(module) {
        if (modules[module]) {
            return modules[module].exec();
        }
        throw new Error(`Module ${module} not found`);
    }
    Object.keys(_).forEach((key) => {
        modules[key] = new Executable(_[key]);
    });
    return {
        require,
    };
}
