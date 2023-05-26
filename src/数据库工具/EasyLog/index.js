/**
 * !info {Project} -来自Nomen
 * @version 1.0.0
 * @requires NomenFS@1.7.3
 * @requires NomenSQLite@1.2.2
 * EasyLog 快速添加或者读取log
 */



function EasyLog(ns) {
    if (!ns || ns === undefined) throw new Error('请传入一个正确的NomenFS实例');
    ns.log = async function (title, content) {
        let path = `/log/${title}.log`;
        await this.mkdir('/log');
        if ((await this.readdir('/log')).includes(path)) await this.appendFile(path, `\n${content}`)
        else await this.writeFile(path, content)
        return title;
    };
    ns.readLog = async function (title) {
        try { return await this.readFile(`/log/${title}.log`) }
        catch { return null }
    }
}

module.exports = {
    initLog
}