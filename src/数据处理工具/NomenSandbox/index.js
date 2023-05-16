/**
 * !info {Project} -来自Nomen
 * Nomen沙盒，为不受信任的代码提供安全的运行空间 - shequ.codemao.cn/wiki/forum/540497
 */




class NomenSandbox {
    constructor(config, _code) {
        this.timeout = config.timeout || 10 * 1000;
        this.permision = config.permission || {};
        this.finish = false;
        this._cancel = false;
        this.pgm = `try {
            return (async () => {
                let __st = setTimeout(() => {
                    if (sandbox.__finish__) { clearTimeout(__st); return; }
                    sandbox.__complete(new Error('[NomenSandbox] Sandbox Execute Timeout'));
                    throw new Error('[NomenSandbox] Sandbox Execute Timeout');
                }, ${this.timeout});
                with (sandbox) {
                    (async () => { return await ${(typeof _code == "function") ? '(' + _code.toString() + ')()' : _code} })()
                        .then(v => __complete(v))
                        .catch(e => __complete('[NomenSandbox: Error When execute user script]'+e))
                        .finally(() =>  __finish__ = true)
                };
            })()
        } catch (err) { __complete('[NomenSandbox: Error When Runing NomenSandbox]'+err) }`;
    }
    run() {
        if (this.finish) return;
        return (async () => {
            let r = this;
            Object.assign(this.permision, {
                get __finish__() { return r.finish || r._cancel },
                r,
                setInterval,
                clearInterval,
                setTimeout,
                clearTimeout,
                Error,
                Promise,
            })
            try {
                let result = await new Promise(resolve => {
                    r.permision.__complete = (v) => resolve(v)
                    const sandbox = new Proxy(r.permision, {
                        has() { return true },
                        get(target, key) { return (key == Symbol.unscopables) ? undefined : target[key] }
                    });
                    const cd = new Function('sandbox', r.pgm);
                    cd(sandbox)
                        .then(v => {
                            this.finish = true;
                        }).catch(e => { })
                });
                return result
            } catch (err) {
                return err;
            }
        })()
    }
}


const config = {
    timeout: 5 * 1000,
    permission: {
        str: 'NomenYYDS',
        log: (t) => console.log(t),
        voxels,
    },
};

async function main() {
    var code = async () => {
        voxels.setVoxel(11,45,14,'NomenYYDS!')
    }; // 此处可以是某些加密了的毁图boom
    let ns = new NomenSandbox(config, code);// 初始化沙盒
    try {
        let res = await ns.run(); // 启动沙盒
        console.log(res);  // 获取用户脚本返回的
    } catch (err) {
        console.log('Error When Main' + err); // 要try-catch不然会致命
    }
}
main()

