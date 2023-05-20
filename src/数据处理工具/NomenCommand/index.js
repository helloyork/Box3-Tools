class NomenCommand {
    constructor(cmd) {
        if (!cmd.length) throw new Error('Command String Required');
        this.fun = cmd.trim().split(' ')[0];
        this.arg = cmd.trim().split(' ').slice(1);
        if (NomenCommand.commands[this.fun] === undefined) throw new Error('Command not found');
        for (let i = 0; i < NomenCommand.commands[this.fun].arg.length; i++) {
            if ((function (a, b) {
                let t = a.filter(v => v.required);
                for (let i = 0; i < t.length; i++) {
                    if (!NomenCommand.typeDetector[t[i].type](b[i])) return false;
                }
                return true;
            })(NomenCommand.commands[this.fun].arg[i], this.arg)) {
                this.cmd = this.nparser(i, this.fun, this.arg);
                this.serial = i;
                return this;
            }
        }
        throw new Error('[NomenCommand] Unexpected parameters');
    }
    nparser(serial, command, arg) {
        log({ serial, command, arg });
        let args = {};
        for (let i = 0; i < NomenCommand.commands[command].arg[serial].length; i++) {
            if (arg[i] === undefined) throw new Error('[NomenCommand] Argument Missing: ' + NomenCommand.commands[command].arg[serial][i].name)
            if (NomenCommand.typeConverter[NomenCommand.commands[command].arg[serial][i].type])
                args[NomenCommand.commands[command].arg[serial][i].name] =
                    NomenCommand.typeConverter[NomenCommand.commands[command].arg[serial][i].type](arg[i])
        }
        return args;
    }
    exec(executor) {
        return NomenCommand.commands[this.fun].exec(this.serial, executor, this.cmd);
    }
    static commands = {
        'say': {
            arg: [
                [{ name: 'content', type: 'string', required: false }],
                [{ name: 'content', type: 'ncselector', required: false }]
            ],
            exec: function (serial, executor, { content, content2 }) {
                world.say([content, content.exec()][serial]);
            }
        },
        'add': {
            arg: [
                [{ name: 'num1', type: 'number', required: true }, { name: 'num2', type: 'number', required: true }]
            ],
            exec: function (serial, executor, { num1, num2 }) {
                return (num1 + num2)
            }
        },
        'name': {
            arg: [
                [{ name: 'player', type: 'ncselector', required: true }]
            ],
            exec: function (serial, executor, { player }) {
                world.say(player.exec(executor)[0].player.name)
            }
        },
        '__#NCESCheck__': (() => {
            let r = new Error('"NCSelector"是NomenCommand必须依赖项，请先在当前作用域内检查NCSelector是否存在，或创建"NCSelector.js"并作为模块导出');
            try {
                let Nl = require('./NCSelector.js').NCSelector;
                if (Nl) NomenCommand.NCSelector = Nl;
            } catch {
                try {
                    if (NCSelector !== undefined) NomenCommand.NCSelector = NCSelector;
                    else throw new Error('NCSelector Not Found');
                } catch { throw r }
            }
        })()
    }
    static typeDetector = {
        'string': (c) => { return typeof c == "string" },
        'ncselector': (c) => { return !!c.length && (!c.startsWith('"') && !c.endsWith('"')) },
        'json': (c) => {
            try {
                return !!JSON.parse(c);
            } catch { return false }
        },
        'number': (c) => { return !isNaN(c) }
    }
    static typeConverter = {
        'string': (c) => { return c.replace(/^"(.*)"$/, '$1') },
        'ncselector': (c) => { return new this.NCSelector(c) },
        'json': (c) => { return JSON.parse(c) },
        'number': (c) => { return Number(c) }
    }
    static subscribeCommand(name, arg, exec) {
        if (typeof name == 'string' && Array.isArray(arg) && typeof exec == "function") {
            this.commands[name] = { arg, exec };
        }
    }
}

/**
 * 大声叫出一个y坐标大于8的玩家的名字
 * executor改为执行者，如果缺失，可能会导致某些指令出错
 */
(new NomenCommand('name @e[y=8..,type=player]')).exec(executor);

/**
 * 大声喊话
 */
(new NomenCommand('say HELLONOMEN!')).exec(executor);

/**
 * 数学运算！
 * 返回值 15
 */
(new NomenCommand('add 12 3')).exec(executor);