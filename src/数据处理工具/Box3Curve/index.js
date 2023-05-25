/**
 * EasyCurve 是由萌新大佬开发的一款便于构建各种曲线的模块
 * 此工具完全开源，免费试用，共所有人学习与参考
 * @author 萌新大佬 <https://box3.codemao.cn/u/mxdlorzorz>
 * @version 1.0.0
 */

//Bezier curves
class Bezier{
    yht=[1];
    /**
     * @param {Box3Vector3[]} controllPoints 控制点(相对值) 不包括起点！起点相对值默认{x:0,y:0,z:0}
     */
    constructor(...controllPoints){
        let l=controllPoints.length;
        if(l<1){
            console.error('Invalid controll points number: '+l);
            return;
        }
        this.controllPoints=controllPoints;
        this.l=l;
        for(let i=1;i<=l;i++)this.yht.push(this.yht[i-1]*(l-i+1)/i);
    }
    /**
     * @param {number} t 表示获取什么时刻的位置 t在0~1之间
     * @returns 
     */
    getPosition(t){
        if(t<0||t>1){
            console.error("Invalid time");
            return new Box3Vector3(0,0,0);
        }
        let x=0,y=0,z=0;
        for(let i=0;i<this.controllPoints.length;i++){
            x+=this.controllPoints[i].x*this.yht[i]*((1-t)**(this.l-i))*(t**i);
            y+=this.controllPoints[i].y*this.yht[i]*((1-t)**(this.l-i))*(t**i);
            z+=this.controllPoints[i].z*this.yht[i]*((1-t)**(this.l-i))*(t**i);
        }
        return new Box3Vector3(x,y,z);
    }
}

// example
let x = new Bezier({ x: 1, y: 0, z: 1 }, { x: 0, y: 5, z: 2 }, { x: 10, y: 0, z: 3 }, { x: 3, y: 2, z: 9 });//创建一个曲线
world.onPlayerJoin(async ({ entity }) => {//当玩家进入地图
    for (let i = 1; i <= 500; i++) {//循环五百次迭代
        await sleep(10);//每次更新视角间隔10ms
        entity.player.cameraMode = 'fixed';//相机视角固定
        //设置相机位置为贝塞尔曲线位置加上一定值再放大
        entity.player.cameraPosition = x.getPosition(i / 500/* i/500可以将0~1这段时间等分为500段进行计算 */).add({ x: 1, y: 2, z: 1 }).scale(10);
        entity.player.cameraTarget =  entity.position.clone();//始终看向玩家
        entity.player.cameraUp = new Box3Vector3(0,1,0);//正常是角
    }
})

//exports
module.exports = {
    Bezier,
}