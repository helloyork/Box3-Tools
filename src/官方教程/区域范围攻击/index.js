/**
 * !info {Project} -来自(shequ.codemao.cn/community/433216)@可乐OωO
 * 区域范围攻击
 */



console.clear(); //清空控制台信息
const Quat = new Box3Quaternion(0, 0, 0, 1); //初始化四元数，用于旋转
const e = world.querySelector('#炮台'); //获取炮台实体

world.onPlayerJoin(({ entity }) => { //当玩家进入时
    entity.position.set(32, 13, 32); //设置玩家的坐标为 { x: 32, y: 13, z: 32 }
    entity.player.spawnPoint.copy(entity.position); //设置玩家的重生点为位置，也就是 { x: 32, y: 13, z: 32 }
    entity.enableDamage = true; //让玩家允许受到伤害
});

const zone = world.addZone({ //添加一个炮台检测的区域
    selector: 'player', //区域内的物体搜索条件，这里为玩家
    bounds: { //指定检测区域
        lo: e.position.sub({ x: 15, y: 2, z: 15 }), //最低点，这里用位置的sub方法来实现一个位置减去另一个位置的功能
        hi: e.position.add({ x: 15, y: 5, z: 15 }), //最高点，这里用位置的add方法来实现一个位置加上另一个位置的功能
    },
});

zone.onEnter(({ entity }) => { //如果炮台检测的区域进入了玩家
    entity.interval = setInterval(async () => { //每2秒执行一次，把这个程序放在entity.interval中
        if (zone.entities().includes(entity)) { //如果玩家在这个区域里
            let direction = entity.position.sub(e.position); //用位置的sub方法算出方向
            let face = direction.clone(); //用clone函数复制一个一样的位置对象
            let d = Quat.rotateY(Math.atan2(face.z, face.x)); //用初始化四元数的rotateY方法来旋转Y轴，用atan2函数来计算旋转弧度，这样我们就得到了一个玩家方向的四元数
            e.meshOrientation = d; //设置子弹的旋转值为玩家方向

            let bullet = world.createEntity({ //创建一个子弹实体
                mesh: 'mesh/子弹.vb', //模型为子弹模型
                meshScale: [1/16, 1/16, 1/16], //大小为默认大小，[1/16, 1/16, 1/16]
                collides: true, //开启碰撞
                gravity: false, //不受重力影响
                position: e.position, //在玩家的位置生成子弹
                velocity: face.scale(0.15), //子弹的初速度是玩家方向，因为速度太快了，所以要用位置的scale方法来把xyz各乘上0.15
                meshOrientation: d.rotateY(Math.PI / 2), //子弹的头指向玩家，这里还需要用四元数的rotateY方法来旋转90度
            });

            bullet.onEntityContact(({ other }) => { //每当子弹碰到另一个实体
                if (other.hp > 0) { //如果这个实体的血量大于0
                    other.hurt(10, { //被碰实体受10点伤害
                        damageType: '炮台的子弹', //伤害类型设为“炮台的子弹” 
                    });
                    bullet.destroy(); //攻击之后子弹消失，防止重复攻击
                }
            });

            await sleep(1500); //等1.5秒后
            if (!bullet.destroyed) { //如果这个子弹还没有清除
                bullet.destroy(); //清除子弹，防止子弹数量太多超过服务器负载
            }
        }
    }, 2000);
});

zone.onLeave(({ entity }) => {
    if (entity.interval) clearInterval(entity.interval); //如果entity.interval这个程序存在，把每2秒执行一次的子弹程序取消，防止多个子弹程序一起发生
});

world.onDie(async ({ entity, damageType }) => { //当有玩家S亡时
    if (entity.interval) clearInterval(entity.interval); //如果entity.interval这个程序存在，把每2秒执行一次的子弹程序取消，防止多个子弹程序一起发生
    while (1) { //无限循环，防止玩家点“×”
        let respawnDialog = await entity.player.dialog({ //该玩家弹出一个对话框
            type: Box3DialogType.SELECT, //类型为选择对话框
            title: '死亡提示', //将对话框的标题设为“死亡提示”
            content: `你被 ${damageType} 击杀了`, //将对话框的内容设为一个模板字符串，拼接方式为 '你被' + damageType + '击杀了'
            options: ['重生'], //对话框的选项只有一个，就是“重生”
        });

        if (respawnDialog) { //如果玩家点击了选项（因为选项只有一个，所以这行代码的意思还可以是“如果玩家点击了‘重生’”）
            entity.player.forceRespawn(); //让玩家重生
            break; //退出无限循环
        } //这里不用判断“如果玩家没有点击选项”了，因为这是无限循环，如果不点击选项就没有break，自然就直接进行下一轮循环（重新弹出一遍对话框）了
    }
});