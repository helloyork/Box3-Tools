/**
 * !info {Project} -来自网络
 * 围棋
 */


console.clear();

// 贴目
const KOMI = 7.5;

// 聊天命令
const RESIGN_RE = /^我认输/i;
const PASS_RE = /^过/i;
const FINISH_COUNT_RE = /^清点完毕/i;
const RESET_RE = /^重置/i;

// 管理员
const ADMIN_NAMES = ['吉吉喵', 'Gorikokka'];

// 每秒多少tick
const TICKS_PER_SECOND = (1024 / 64);
// 基本时限
const MAIN_TICKS = 10 * 60 * TICKS_PER_SECOND;
// 基本时限用完后的读秒时间
const LIGHTNING_TICKS = 10 * TICKS_PER_SECOND;

// 是否允许自我对弈
const ALLOW_SELF_PLAY = false;

// 数字方块
const DIGIT = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
];

// 棋盘方块
const B = {
    '+': voxels.id('board1'),
    'T': voxels.id('board4'),
    'L': voxels.id('board3'),
    '.': voxels.id('board2'),
}

// 用户控制方块旋转
const R = {
    N: 0x8000,
    S: 0,
    E: 0xc000,
    W: 0x4000,
};

// 棋子名称
const COLORS = [
    '黑',
    '白',
];

// 正常棋子的mesh
const STONE_MESH = [
    world.querySelector('.black_stone').mesh,
    world.querySelector('.white_stone').mesh,
];

// 标红棋子的mesh
const CURRENT_STONE_MESH = [
    world.querySelector('.cur_black_stone').mesh,
    world.querySelector('.cur_white_stone').mesh,
];

// 碗的mesh
const BOWL_MESH = [
    world.querySelector('.black_bowl').mesh,
    world.querySelector('.white_bowl').mesh,
];

// 按钮的mesh
const CHOOSE_BUTTON_MESH = world.querySelector('.choose_button').mesh;

const teleport = (function(/* 传送相关 */) {
    const locations = {};
    // 获取预置的地点
    world.querySelectorAll('.地点').forEach((e) => {
        locations[e.id] = e.position;
        e.destroy();
    });
    // 处理绝对传送
    world.onEntityContact(({entity, other}) => {
        if (other.isPlayer && entity.hasTag('绝对传送')) {
            const attr = getEntityAttr(entity);
            const pos = locations[attr['目的地']];
            if (pos) other.position.copy(pos);
        }
    });
    // 处理相对传送
    world.onEntityContact(({entity, other}) => {
        if (other.isPlayer && entity.hasTag('相对传送')) {
            const attr = getEntityAttr(entity);
            other.position.addEq({
                x: Number(attr.x) || 0,
                y: Number(attr.y) || 0,
                z: Number(attr.z) || 0,
            });
        }
    });
    return function(e, name) {
        const pos = locations[name];
        if (e && e.isPlayer && pos) e.position.copy(pos);
    }
})();

// 创建游戏实例
async function playGo (name, size, originX, originY, originZ) {
    // 用于计算星点x的位置
    const STAR_MOD = {
        19: [6, 3],
        13: [3, 0],
        9: [2, 0],
        7: [2, 0],
    };
    // 计时条长度
    const CLOCK_LENGTH = size <= 9 ? 3 : 5;

    // 棋盘大小, 默认19
    if (!(size in STAR_MOD)) {
        size = 19;
    }

    // 存储某个位置的棋子的实体对象
    const pieces = new Array(size * size);
    // 记录某个位置的棋子颜色. -1:空, 0:黑, 1:白
    const board = new Array(size * size);
    // 用于标记某个位置是否被访问过(用于搜索算法)
    const visited = new Array(size * size);
    // 存储所有棋盘状态, 用于判断全局同形
    const prevBoards = [];
    // 对弈双方玩家的实体
    const playerEntities = [ null, null ];
    // 对弈双方玩家的名称
    const playerNames = ['NULL', 'NULL'];
    // 双方的分数
    const score = [ 0, 0 ];
    // 双方的计时
    const clock = [ 0, 0 ];
    // 当前玩家 0:黑, 1:白
    let currentPlayer = 0;
    // 游戏状态 wiat:等待, play:对局中, end:结束
    let gameState = 'wait';
    // 记录连续过的次数, 达到两次时则结束对局
    let passCount = 0;
    // 上次落子的位置
    let lastPieceIdx = -1;
    // 记录该房间的玩家, 对局开始后会把非对局玩家传送到场外
    const visitors = new Set();

    // 用于发送通知
    function broadcast(s) {
        world.say(`[${name}]: ${s}`);
    }

    // 处理对局开始前离开的玩家
    function leaveVisotor(e) {
        teleport(e, `${name}观战室`);
        for (let i = 0; i < 2; i++) {
            if (playerEntities[i] == e) {
                playerEntities[i] = null;
                playerNames[i] = null;
            }
        }
        visitors.delete(e);
    }
    // 玩家离开房间的处理
    world.querySelector(`.${name}离开房间`).onEntityContact(({other}) => {
        if (gameState === 'play') {
            resign(other);
        } else {
            leaveVisotor(other);
        }
    });
    // 触碰到入口, 直接传送到下方
    world.querySelector(`.${name}入口`).onEntityContact(({other}) => {
        if (gameState !== 'play') {
            visitors.add(other);
            other.position.y -= 5;
        }
    });
    // 创建棋盘
    function createBoard () {
        const [MOD, VAL] =  STAR_MOD[size];
        const border = voxels.id('palace_lamp');
        const borderLight = voxels.id('lantern_02');
        // 边缘上方的白灯
        voxels.setVoxelId(originX - 1, originY + 1, originZ - 1, borderLight);
        voxels.setVoxelId(originX + size, originY + 1, originZ - 1, borderLight);
        voxels.setVoxelId(originX - 1, originY + 1, originZ + size, borderLight);
        voxels.setVoxelId(originX + size, originY + 1, originZ + size, borderLight);
        // 棋盘边缘的灯
        for (let i = 0; i <= size; ++i) {
            voxels.setVoxelId(originX + i, originY, originZ + size, border);
            voxels.setVoxelId(originX + i - 1, originY, originZ - 1, border);
            voxels.setVoxelId(originX + size, originY, originZ + i - 1, border);
            voxels.setVoxelId(originX - 1, originY, originZ + i , border);
        }
        // 创建size * size的棋盘
        for (let x = 0; x < size; ++x) {
            for (let z = 0; z < size; ++z) {
                // 通常来讲是交点
                let p = B['+'];
                // 以下四个判断用于判断是否是边角
                if (x === 0 && z === 0) { 
                    p = B['L'] | R['S'];
                } else if (x === 0 && z === size - 1) {
                    p = B['L'] | R['E'];
                } else if (x === size -1 && z === 0) {
                    p = B['L'] | R['W'];
                } else if (x === size -1 && z === size - 1) {
                    p = B['L'] | R['N'];
                // 以下四个判断用于判断是否是边缘
                } else if (x === 0) {
                    p = B['T'] | R['E'];
                } else if (x === size -1) {
                    p = B['T'] | R['W'];
                } else if (z === 0) {
                    p = B['T'] | R['S'];
                } else if (z === size -1) {
                    p = B['T'] | R['N'];
                // 判断是否是星点
                } else if (x > 0 && x < size - 1 && z > 0 && z < size - 1 && (x % MOD) === VAL && (z % MOD) === VAL) {
                    p = B['.'];
                }
                voxels.setVoxelId(x + originX, originY, z + originZ, p);
            }
        }
    }

    // 用于绘制数字条
    function drawNumber (x, y, z, n, dx, dz, rotation) {
        for (let i = 0; i < CLOCK_LENGTH; ++i) {
            voxels.setVoxel(x, y, z, DIGIT[n % 10], rotation);
            x += dx;
            z += dz;
            n = (n / 10) | 0;
        }
    }

    // 绘制双方的计时
    function drawClock(time) {
        drawNumber(originX + size + 2, originY - 1, originZ + size - CLOCK_LENGTH + 1, time !== undefined ? time : (clock[0] / TICKS_PER_SECOND) | 0, 0, 1, 3);
        drawNumber(originX - 3, originY - 1, originZ + CLOCK_LENGTH - 2, time !== undefined ? time : (clock[1] / TICKS_PER_SECOND) | 0, 0, -1, 5);
    }

    // 把二维棋盘位置x, y变换为数组下标, 用于pieces和board
    function index (x, y) {
        return x + y * size;
    }

    // 初始化游戏
    function setup () {
        // 重置棋盘
        for (let i = 0; i < size * size; ++i) {
            board[i] = -1;
            if (pieces[i]) {
                pieces[i].destroy();
            }
            pieces[i] = null;
        }
        // 重置分数
        score[0] = 0;
        score[1] = KOMI;
        // 重置当前玩家
        currentPlayer = 0;
        // 重置历史棋盘状态
        prevBoards.length = 0;
        // 重置玩家
        playerEntities[0] = playerEntities[1] = null;
        playerNames[0] = playerNames[1] = 'NULL'
        // 重置状态
        gameState = 'wait';
        // 重置连续过的次数
        passCount = 0;
        // 重置计时
        clock[0] = clock[1] = MAIN_TICKS;
    }

    // 检查某个位置是否有气
    function hasLiberties (pX, pY) {
        // 重置visited
        visited.fill(false);
        // 初始化访问队列
        const toVisit = [ pX, pY ];
        // 获取起始点颜色
        const c = board[index(pX, pY)];
        // 标记起始点为已访问
        visited[index(pX, pY)] = true;

        // 默认无气
        let libs = false;
        // 把x,y放入访问队列
        function push (x, y) {
            const idx = index(x, y);
            // 访问过了就不放
            if (visited[idx]) {
                return;
            }
            const d = board[idx];
            if (d === c) {
                // 颜色相同才放
                toVisit.push(x, y);
                visited[idx] = true;
            } else if (d < 0) {
                // 该位置(x, y)为空, 表示有气
                libs = true;
            }
        }
        // 广度优先算法(BFS)
        for (let i = 0; i < toVisit.length; i += 2) {
            // 获取队列前端的位置
            const x = toVisit[i];
            const y = toVisit[i + 1];
            // 向上下左右四个方向进行搜索
            if (x > 0) { push(x - 1, y); }
            if (x < size - 1) { push(x + 1, y); }
            if (y > 0) { push(x, y - 1); }
            if (y < size - 1) { push(x, y + 1); }
        }
        // 返回结果
        return libs;
    }

    // 计算提子
    function capture (x, y, koTest) {
        // 无子直接返回
        if (board[index(x, y)] < 0) {
            return;
        }
        const libs = hasLiberties(x, y);
        // 对局中, 有气不能提子
        if (gameState === 'play' && libs) {
            return;
        }
        for (let x = 0; x < size; ++x) {
            for (let y = 0; y < size; ++y) {
                const idx = index(x, y);
                // 复用hasLiberties产生的访问结果, 被访问过表示需要被提走
                if (visited[idx]) {
                    // 如果不是预演, 就执行提子
                    if (!koTest) {
                        // 对方玩家
                        const c = board[idx] ^ 1;
                        // 棋子实体
                        const p = pieces[idx];
                        // 对方分数+1
                        score[c] += 1;
                        // 销毁棋子
                        p.destroy();
                        pieces[idx] = null;
                    }
                    // 标记为空
                    board[idx] = -1;
                }
            }
        }
    }

    // 恢复棋子
    function restorePiece() {
        if (lastPieceIdx >= 0 && pieces[lastPieceIdx]) {
            pieces[lastPieceIdx].mesh = STONE_MESH[board[lastPieceIdx]];
        }
    }

    // 落子
    function placePiece (x, y) {
        const c = currentPlayer;
        const idx = index(x, y);

        // 检查落子位置是否为空
        if (board[idx] >= 0) {
            return;
        }

        // 尝试落子
        board[idx] = c;
        
        // 备份棋盘状态
        const koTest = board.slice();

        // 预演计算提子
        if (x > 0) { capture(x - 1, y, true); }
        if (x < size - 1) { capture(x + 1, y, true); }
        if (y > 0) { capture(x, y - 1, true); }
        if (y < size - 1) { capture(x, y + 1, true); }
        capture(x, y, true);

        // 计算提子后的状态
        const ko = board.join();

        // 恢复棋盘到计算提子前的状态
        for (let j = 0; j < koTest.length; ++j) {
            board[j] = koTest[j];
        }

        // 检查当前棋盘状态是否已经出现过
        for (let i = 0; i < prevBoards.length; ++i) {
            if (prevBoards[i] === ko) {
                // 状态重复, 落子无效
                board[idx] = -1;
                return;
            }
        }

        // 复原上个棋子
        restorePiece();
        // 创建棋子对象
        pieces[idx] = world.createEntity({
            position: [
                originX + x + 0.5,
                originY + 1.125,
                originZ + y + 0.5,
            ],
            meshScale: [1 / 24, 1 / 24, 1 / 24],
            mesh: CURRENT_STONE_MESH[c],
            gravity: false,
            collides: true,
            fixed: true,
        });

        // 计算提子(这回事真的了)
        if (x > 0) { capture(x - 1, y); }
        if (x < size - 1) { capture(x + 1, y); }
        if (y > 0) { capture(x, y - 1); }
        if (y < size - 1) { capture(x, y + 1); }
        capture(x, y);
        
        // 保存当前棋盘状态
        prevBoards.push(board.join());

        // 切换到下个玩家
        currentPlayer ^= 1;

        // 清空pass计数
        passCount = 0;

        // 更新clock
        clock[currentPlayer] = Math.max(clock[currentPlayer], LIGHTNING_TICKS);

        // 更新最后落子的位置
        lastPieceIdx = idx;
        return true;
    }

    // 计算分数
    function countScore () {
        visited.fill(false);
        // 表示空地是否和黑子/白子相邻
        const adj = [ false, false ];
        // 计算x,y的得分
        function count (x, y) {
            // 棋盘外为0分
            if (x < 0 || y < 0 || x >= size || y >= size) {
                return 0;
            }

            const idx = index(x, y);
            // 之前访问过(计算过)为0分
            if (visited[idx]) {
                return 0;
            }
            // 标记为访问过(计算过)
            visited[idx] = true;

            const b = board[idx];
            // 空地才计算
            if (b === -1) {
                return (1 + // 空地本身1分
                    // 递归的计算上下左右的分数
                    count(x - 1, y) +
                    count(x + 1, y) + 
                    count(x, y - 1) +
                    count(x, y + 1)
                );
            }
            // 不是空地, 则标记为可已达到某个颜色的棋子
            adj[b] = true;
            return 0;
        }
        // 遍历size*size棋盘的每个棋子
        for (let x = 0; x < size; ++x) {
            for (let y = 0; y < size; ++y) {
                // 初始化标记
                adj[0] = adj[1] = false;
                // 计算得分
                const s = count(x, y);
                // 只能有一方获得该分数
                if (adj[0] && !adj[1]) {
                    score[0] += s;
                } else if (adj[1] && !adj[0]) {
                    score[1] += s;
                }
            }
        }
    }

    // 过
    function pass (entity) {
        if (gameState === 'play') {
            if (entity === playerEntities[currentPlayer]) {
                broadcast(`${playerNames[currentPlayer]} 弃权一手`);
                // 增加过的技术
                passCount += 1;
                // 切换当前玩家
                currentPlayer ^= 1;

                // 更新clock
                clock[currentPlayer] = Math.max(clock[currentPlayer], LIGHTNING_TICKS);

                // 连续过2次 对局结束
                if (passCount >= 2) {
                    restorePiece();
                    gameState = 'count';
                    passCount = 0;
                    currentPlayer = -1;
                    broadcast('请点击对方死子进行标记');
                    broadcast('点击己方已被标记的棋子表示确认死子');
                    broadcast('双方清点完成后请发送 清点完毕');
                }
            }
        }
    }
    
    // 认输
    function resign (entity) {
        for (let i = 0; i < 2; ++i) {
            if (entity === playerEntities[i]) {
                if (gameState === 'play' || gameState === 'count') {
                    broadcast(`${playerNames[i]} 认输`);
                    score[i] = -Infinity;
                    gameState = 'done';
                }
            }
        }
    }

    // 清点完毕
    function finishCount (entity) {
        if (gameState === 'count') {
            for (let i = 0; i < 2; ++i) {
                if (entity === playerEntities[i]) {
                    passCount |= 1 << i;
                }
            }
            if (passCount === 3) {
                gameState = 'done';
            }
        }
    }

    // 创建期盼
    createBoard();
    // 绘制计时
    drawClock(0);
    // 创建碗
    [
        [originX + size + 3, originZ],
        [originX - 3, originZ + size],
    ].map(([x, z], i) => world.createEntity({
        position: [
            x,
            originY + 0.5,
            z,
        ],
        mesh: BOWL_MESH[i],
        meshScale: [1 / 16, 1 / 16, 1 / 16],
        fixed: true,
        collides: true,
        gravity: false,
    }));
    // 创建选择按钮
    const chooseButtons = [originX + size + 2.5, originX - 2.5].map((x) => world.createEntity({
        position: [
            x,
            originY + 0.3,
            originZ + size / 2,
        ],
        mesh: CHOOSE_BUTTON_MESH,
        meshScale: [1 / 24, 1 / 24, 1 / 24],
        fixed: true,
        collides: true,
        gravity: false,
    }))

    // 下棋处理
    const removeTips = [false, false];
    world.onPress(({ entity, button, raycast:{ hitPosition:{x, y, z}, hitEntity } }) => {
        if (gameState === 'play') { // 正常落子
            // 对局
            if (button !== 'action0' || // 判断按钮
                entity !== playerEntities[currentPlayer] || // 是否是对弈的玩家
                Math.abs(y - originY) > 2) { // 是否在棋盘上方
                return;
            }
            // 计算位置
            const dx = Math.floor(x) - originX;
            const dz = Math.floor(z) - originZ;
            // 判断是否在棋盘上
            if (dx < 0 || dx >= size || dz < 0 || dz >= size) {
                return;
            }
            // 落子
            placePiece(dx, dz);
        } else if (gameState === 'count' && hitEntity) { // 清算死子
            const idx = pieces.indexOf(hitEntity);
            if (idx < 0) {
                return;
            }
            const x = Math.floor(hitEntity.position.x - originX);
            const y = Math.floor(hitEntity.position.z - originZ);
            const c = board[idx];
            if (entity !== playerEntities[c]) {
                // 点击对方棋子, 切换标记状态
                if (hitEntity.mesh === STONE_MESH[c]) {
                    hitEntity.mesh = CURRENT_STONE_MESH[c];
                    // 只提示一次, 不然太烦人了
                    if (!removeTips[c]) {
                        hitEntity.say(`请${playerNames[c]}确认死子`);
                        removeTips[c] = true;
                    }
                } else if (hitEntity.mesh === CURRENT_STONE_MESH[c]) {
                    hitEntity.mesh = STONE_MESH[c];
                }
            } else if (hitEntity.mesh === CURRENT_STONE_MESH[c]) {
                // 点击了己方已被标记的棋子, 表示确认为死子, 执行提子
                capture(x, y);
            }
        }
    });

    // 选择按钮
    chooseButtons.forEach((button, c) => {
        button.onEntityContact(({ other }) => {
            if (gameState === 'wait' && other.isPlayer && playerEntities[c] !== other) {
                playerEntities[c] = other;
                playerNames[c] = other.player.name;
                broadcast(`${playerNames[c]}执${COLORS[c]}棋`);
                // 如果不允许自我对弈, 则只能选择一方
                if (!ALLOW_SELF_PLAY && playerEntities[c^1] === other) {
                    playerEntities[c^1] = null;
                    playerNames[c^1] = 'NULL';
                }
            }
        });
    });

    // 离开则认输
    world.onPlayerLeave(({ entity }) => resign(entity));

    // 可以通过聊天来过或认输
    world.onChat(({ entity, message }) => {
        if (message.match(PASS_RE)) {
            pass(entity);
        } else if (message.match(RESIGN_RE)) {
            resign(entity);
        } else if (message.match(FINISH_COUNT_RE)) {
            finishCount(entity);
        } else if (ADMIN_NAMES.includes(entity.player.name) && message.match(RESET_RE)) {
            const resetName = message.split(/\s+/)[1];
            if (resetName === name && gameState != 'wait') {
                gameState = 'done';
                broadcast(`管理员${entity.player.name}进行了重置`)
            }
        }
    });
    
    while (true) {
        // 初始化
        setup();

        // 等待双方玩家选择颜色
        while (!playerEntities[0] || !playerEntities[1]) {
            await world.nextTick();
        }

        // 把非对弈玩家传送走
        for (const v of visitors) {
            if (playerEntities.includes(v)) continue;
            teleport(v, `${name}观战室`);
        }
        visitors.clear();

        broadcast('对局开始');
        gameState = 'play';
        // 处理每回合, 直到对局结束
        while (gameState === 'play') {
            await world.nextTick();
            if (--clock[currentPlayer] <= 0) {
                pass(playerEntities[currentPlayer]);
            }
            drawClock();
        }

        if (gameState !== 'done') {
            // 等待清算完毕
            while (gameState === 'count') {
                await world.nextTick();
            }
            // 计算分数
            countScore();
            // 通知结果
            broadcast(`对局结束: 黑棋${score[0]}目 vs 白棋${score[1]}目`);
            const winner = score[0] > score[1] ? 0 : 1;
            broadcast(`执${COLORS[winner]}棋的选手${playerNames[winner]}获胜.`);
        }

        // 清空计时
        drawClock(0);
        // 把对弈玩家传送走
        playerEntities.forEach((e) => teleport(e, `${name}观战室`));
        // 既然对局已经结束, 就让棋盘上的棋子动起来, 这样会很有趣
        pieces.forEach((p) => {
            if (p) {
                p.collides = true;
                p.fixed = false;
                p.gravity = true;
                p.velocity.x += 0.1 * (Math.random() - 0.5);
                p.velocity.y += 0.1 * Math.random();
                p.velocity.z += 0.1 * (Math.random() - 0.5)
            }
        });

        // 十秒后开始下一轮
        await sleep(10 * 1000);
    }
}

// 获取通过标签定义的实体属性
function getEntityAttr(e) {
    const attr = {};
    e.tags().forEach((tag) => {
        const g = tag.match(/(\S+)\s*:\s*(\S+)/);
        if (g) {
            attr[g[1]] = g[2];
        }
    });
    return attr;
}

// 在所有添加了go_spawner的实体的位置 创建游戏实例
world.querySelectorAll('.go_spawner').forEach((e) => {
    const attr = getEntityAttr(e);
    if ('name' in attr) {
        playGo(attr.name, parseInt(attr.size) || 9,
            Math.floor(e.position.x),
            Math.floor(e.position.y),
            Math.floor(e.position.z));
    }  
});
    

// 删除临时实体
world.querySelectorAll('.temporary').forEach((e) => e.destroy());
// 对所有玩家启用ActionA
world.onPlayerJoin(({ entity }) => {
    entity.player.enableActionA = true;
});