/* eslint-disable no-undef */

/**
 * Version number that follows the **semver specification**  
 * for example: "^1.2.3"
 * @typedef {string} Version
 */
/**
 * @typedef {Object} ModuleDefinition
 * @property {string} name
 * @property {string} version
 * @property {string} description
 * @property {string} script
 * @property {{[key: string]: string}} dependencies
 */

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

class ModuleManager {
    /* static */
    static Require = Require;
    static _log = console.log;
    static instance = null;
    static defaultConfig = {
    };
    static isValidVersion(version) {
        return /^(\^|~)?\d+\.\d+\.\d+$/.test(version);
    }
    static perfix = {
        "^": (need, actual) => need[0] === actual[0] && need[1] === actual[1] && need[2] <= actual[2],
        "~": (need, actual) => need[0] === actual[0] && need[1] <= actual[1],
        "": (need, actual) => need[0] === actual[0] && need[1] === actual[1] && need[2] === actual[2]
    };
    static getVersionSplited(version) {
        return {
            version: [...(["^", "~"].includes(version[0]) ? version.substr(1) : version).split(".").map(v => parseInt(v)).slice(0, 3)
                , ...new Array(3 - version.split(".").length).fill(0)],
            prefix: version.startsWith("^") ? "^" : version.startsWith("~") ? "~" : ""
        };
    }
    static StructureTypes = {
        "string": v => typeof v === "string",
        "number": v => typeof v === "number",
        "boolean": v => typeof v === "boolean",
        "object": v => typeof v === "object" && !Array.isArray(v) && v !== null,
        "array": v => Array.isArray(v),
        "function": v => typeof v === "function",
        "null": v => v === null,
        "undefined": v => v === undefined,
        "dependencies": v => {
            if (typeof v !== "object" || Array.isArray(v) || v === null) return false;
            return Object.entries(v).every(([key, value]) => typeof key === "string" && this.isValidVersion(value));
        },
        "version": v => this.isValidVersion(v),
        "any": () => true
    };

    /* static public */
    static log(v) {
        if (v instanceof Error) {
            this._log(v.message + "\n" + v.stack);
        } else {
            this._log(`${v}`);
        }
    }
    /**
     * @param  {...any} args 
     * @returns {ModuleManager}
     */
    static getInstance(...args) {
        if (this.instance === null) {
            this.instance = new this(...args);
        }
        return this.instance;
    }
    static getVerifyMap() {
        return {
            name: {
                type: ["string"],
                required: true
            },
            version: {
                type: ["version"],
                required: true
            },
            description: {
                type: ["string"],
                required: true
            },
            script: {
                type: ["string"],
                required: true
            },
            dependencies: {
                type: ["dependencies"],
                required: false
            }
        };
    }
    static verifyStructure(mod, map = this.getVerifyMap()) {
        Object.entries(map).forEach(([key, value]) => {
            if (value.required && !Object.prototype.hasOwnProperty.call(mod, key)) {
                throw new Error(`${key} is required.`);
            }
            if (value.type && !value.type.some(type => (ModuleManager.StructureTypes[type](mod[key])))) {
                throw new Error(`${key} type is not correct. \nexpect ${value.type} but got ${typeof mod[key]}.`);
            }
        });
    }

    /* properties */
    config = {};
    modules = {};
    scripts = {};

    /* constructor */
    constructor(config, modules = {}) {
        this._init()
            ._loadConfig(config)
            .addModules(modules)
            .checkDependencies()
            ._syncModules();
    }

    /* public */
    /**
     * @param {ModuleDefinition} mod 
     * @param {string} script
     */
    addModule(mod, script, check = true) {
        this.registerModuleDef(mod)
            .registerScript(mod.name, script)
            ._syncModules();
        if (check) this.checkDependencies();
        return this;
    }
    /**
     * @param {ModuleDefinition[]} modules 
     */
    addModules(modules) {
        // eslint-disable-next-line no-unused-vars
        Object.entries(modules).forEach(([_, value]) => {
            this.addModule(value, value.script, false);
        });
        this.checkDependencies();
        return this;
    }
    /**
     * @param {ModuleDefinition} mod 
     */
    registerModuleDef(mod) {
        ModuleManager.verifyStructure(mod);
        this.modules[mod.name] = mod;
        return this;
    }
    registerScript(name, script) {
        this.scripts[name] = script;
        return this;
    }
    getScript(name) {
        return this.scripts[name] || (() => { });
    }
    getRequirableModules() {
        let output = {};
        Object.entries(this.modules).forEach(([key, value]) => {
            output[key] = this.getScript(value.script);
        });
        return output;
    }
    findModule(name) {
        return this.modules[name] || {};
    }
    hasModule(name) {
        return this.findModule(name).name === name;
    }
    checkVersion(need, actual) {
        let needVersion = ModuleManager.getVersionSplited(need),
            actualVersion = ModuleManager.getVersionSplited(actual);
        return ModuleManager.perfix[needVersion.prefix](needVersion.version, actualVersion.version);
    }
    checkDependencies() {
        Object.entries(this.modules).forEach(([key, value]) => {
            Object.entries(value.dependencies).forEach(([k, v]) => {
                if (!this.hasModule(k)) {
                    throw new Error(`Module ${key} has dependency ${k} but not found.`);
                }
                if (!this.checkVersion(v, this.findModule(k).version)) {
                    throw new Error(`Module ${key} has dependency ${k} but version not match.`);
                }
            });
        });
        return this;
    }
    build() {
        return this.checkDependencies()._syncModules();
    }
    require(module) {
        return this._require.require(module);
    }

    /* private */
    _init() {
        this._require = Reflect.construct(ModuleManager.Require, []);
        return this;
    }
    _addModule(name, func) {
        this._require.addModule(name, func);
        return this;
    }
    _syncModules() {
        this._require.addModules(this.getRequirableModules());
        return this;
    }
    _loadConfig(config) {
        Object.keys(ModuleManager.defaultConfig).forEach(key => {
            this.config[key] = Object.prototype.hasOwnProperty.call(config, key) ? config[key] : ModuleManager.defaultConfig[key];
        });
        return this;
    }
}

const mm = ModuleManager.getInstance({}, {
    "a": {
        "name": "a",
        "version": "^1.0.0",
        "description": "a",
        "script": "a",
        "dependencies": {
            "b": "^1.0.0"
        }
    },
    "b": {
        "name": "b",
        "version": "^1.0.1",
        "description": "b",
        "script": "b",
        "dependencies": {}
    }
}).registerScript("a", function() {
    console.log(require("b"));
    module.exports = {
        "a": 1
    };
}).registerScript("b", function() {
    module.exports = {
        "b": 2
    };
}).build();

console.log(mm.require("a"));

