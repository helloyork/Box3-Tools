/**
 * !info {Project} -来自Nomen
 * 指令系统，在聊天框输入“/mute Nomen“
 */



console.clear()
world.addCollisionFilter('player', 'player')
world.onPlayerJoin(({entity})=>{
    entity.player.spawnPoint = new Box3Vector3(16, 11, 16)
    entity.player.forceRespawn()
})

world.onPlayerJoin(async ({ entity }) => {
    entity.isOP=['Nomen'].includes(entity.player.name)?true:false;
    Object.assign(entity, {
        'ban': function (name) {
            if (!entity.isOP) { entity.player.directMessage('权限不足'); return; }
            find(name).player.kick()
        },
        'kill': function (name) {
            if (!entity.isOP) { entity.player.directMessage('权限不足'); return; }
            find(name).hp = 0;
        },
        'mute': function (name) {
            if (!entity.isOP) { entity.player.directMessage('权限不足'); return; }
            find(name).player.mute = !find(name).player.mute;
        },
        'fix': function () {
            entity.hp = 0;
        },
        'help': function (name) {
            commandList.forEach((com) => {
                entity.player.directMessage(com);
            })
        },
        'add': function (...param) {
            let a = 0;
            param.forEach((r) => {
                a += r;
            })
            entity.player.directMessage(a)
        },
    })
})

world.onChat(({ message: m, entity }) => {
    if (m[0] == '$' && admin.includes(e.player.name)) {
        const evals = m.replace('$', '')
        try {
            e.player.directMessage('~>' + evals)
            e.player.directMessage('<~' + eval(evals))
        } catch (err) {
            e.player.directMessage(err)
        }
    } else if (m[0] == '/') {
        var cmd = m.substring(1).split(/\s+/);
        if (entity[cmd[0]] === undefined) {
            entity.player.directMessage('您的指令不存在或无效')
        } else {
            var params = cmd.slice(1, cmd.length);
            var paramIn = '';
            params.forEach((param) => {
                paramIn = isNumber(param) ? paramIn.concat(param, ',') : paramIn.concat(`'`, param, `'`, ',');
            })
            console.log(paramIn)
            paramIn.substring(0, params.length - 1);
            console.log(`entity.${cmd[0]}(${paramIn})`)
            eval(`entity[cmd[0]](${paramIn})`);
        }
    }
});
function find(n) { return world.querySelectorAll('player').filter(e => e.player.name === n)[0]; }
function isNumber(value) { var patrn = /^[0-9]*[1-9][0-9]*$/; if (patrn.exec(value) == null || value == "") { return false } else { return true } }

const commandList = ['msg:私聊', 'help:获取指令帮助', 'save:安全保存', 'fix:卡点脱离（慎用）']
