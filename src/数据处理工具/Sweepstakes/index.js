/**
 * !info {Module} -来自PGAoT-VAS
 */

const Dictionary = require("./dictionary.js").Dictionary;
/**
 * @class 
 * @constructor  
 * @classdesc 抽奖基础方法，不需要实例化父类。
 * @desc 支持自定义奖项数据，权重/数量抽奖方式。以及玩家报名，取消报名，单次抽奖，一键抽奖。
 */
class SweepstakesManagerBase {
    constructor(awardsArr, quantity = true) {
        /**
        * @member {Array<object>} 
        * @desc 奖项数据，可由开发者修改奖项数据
        * {id:奖项ID,name:奖项名称,weight?:权重值,number?:奖项数量}
        */
        this.awardsArr = awardsArr;

        /**
        * @member {boolean} 
        * @desc 抽中后是否扣除奖项数量
        */
        this.isquantity = quantity;

        /**
        * @member {object} 
        * @desc 已报名的玩家字典，整个生命周期结束前都不会变动，玩家userId->玩家对象
        */
        this.registerByPlayerDic = new Dictionary();

        /**
        * @member {object} 
        * @desc 等待抽奖的玩家字典，中奖后移除此玩家。玩家userId->玩家对象
        */
        this.waitByPlayerDic = new Dictionary();

        /**
        * @member {object} 
        * @desc 已获奖的玩家字典，奖项ID->玩家userId列表
        */
        this.winnersByPrizeDic = new Dictionary();
        for (const value of this.awardsArr) {
            this.winnersByPrizeDic.Add(value.id, []);
        }
    }

    /**
     * @method 
     * @property {?GameEntity} entity 玩家对象[可空]
     * @return {Array<number> || object} 玩家userId或玩家对象
     * @desc 获取已报名的玩家userId或玩家对象
     */
    getRegisterByPlayer(entity = null) {
        if (entity) return this.registerByPlayerDic.TryGetValue(entity.player.userId);
        return this.registerByPlayerDic.GetKeys();
    }

    /**
     * @method 
     * @property {string} id 奖项ID
     * @return {Array<number>} 玩家userId
     * @desc 获取指定奖项的已获奖玩家userId列表
     */
    getWinnersByPrize(id) {
        return this.winnersByPrizeDic.TryGetValue(id);
    }

    /**
     * @method 
     * @property {?GameEntity} entity 玩家对象[可空]
     * @return {Array<number> || object} 玩家userId或玩家对象
     * @desc 获取等待抽奖玩家userId或玩家对象
     */
    geWaitByPlayer(entity) {
        if (entity) return this.waitByPlayerDic.TryGetValue(entity.player.userId);
        return this.waitByPlayerDic.GetKeys();
    }

    /**
     * @method 
     * @property {GameEntity} entity 玩家对象
     * @return {boolean} 是否报名成功，如失败是因为此玩家已经报名了。
     * @desc 指定玩家新增抽奖报名 
     */
    addRegisterByPlayer(entity) {
        if (this.registerByPlayerDic.TryGetValue(entity.player.userId)) return false;
        this.registerByPlayerDic.Add(entity.player.userId, entity);
        this.waitByPlayerDic.Add(entity.player.userId, entity);
        return true;
    }

    /**
     * @method 
     * @property {GameEntity} entity 玩家对象
     * @return {boolean} 是否取消成功
     * @desc 指定玩家取消抽奖报名
     */
    removeRegisterByPlayer(entity) {
        this.waitByPlayerDic.Remove(entity.player.userId)
        this.registerByPlayerDic.Remove(entity.player.userId);
        return true;
    }

    /**
     * @method 
     * @property {GameEntity} entity 玩家对象
     * @return {object || boolean} 是否抽奖成功
     * @desc 抽奖一次，抽奖后自动写入已获奖的玩家字典中
     */
    setDrawByOne(entity) {

    }

    /**
     * @method 
     * @return {boolean} 是否抽奖完成
     * @desc 一键全部抽奖，抽奖后自动写入已获奖的玩家字典中
     */
    setDrawByALL() {
        for (const entity of this.waitByPlayerDic.GetValues()) {
            this.setDrawByOne(entity);
        }
        return true;
    }

    /**
     * @method 
     * @property {object} awards 奖项数据
     * @property {GameEntity} entity 玩家对象
     * @return {boolean} 是否设置成功
     * @desc [私有方法]抽中的奖项玩家处理
     */
    _addWinnersByPrizeDic(awards, entity) {
        let winnersByPrize = this.winnersByPrizeDic.TryGetValue(awards.id);
        winnersByPrize.push(entity.player.userId);
        this.waitByPlayerDic.Remove(entity.player.userId);
        return this.winnersByPrizeDic.SetValue(awards.id, winnersByPrize);
    }

    /**
     * @method 
     * @property {Array<object>} cawardsArr 奖项数据列表
     * @property {function} calculationFun 自定义计算方式
     * @return {object} 奖项数据
     * @desc [私有方法]抽中后奖项数量是否减少
     */
    _isAndSetQuantityByPrize(cawardsArr, calculationFun) {
        if (!this.isquantity) return cawardsArr[calculationFun(cawardsArr)];
        let awardsArr = cawardsArr.filter(item => item.number > 0);
        if (!awardsArr.length) return false;
        let random = calculationFun(awardsArr);
        let data = awardsArr[random];
        data.number--;
        this.awardsArr = awardsArr;
        return data;
    }
}

/**
 * @class 
 * @constructor  
 * @classdesc 权重抽奖
 * @desc 按照权重方式进行抽奖
 */
class SweepstakesByWeight extends SweepstakesManagerBase {
    constructor(awardsArr, quantity) {
        super(awardsArr, quantity);
        /**
        * @member {Array<object>} 
        * @desc 按权重从小到大排序后的奖项数据，
        */
        this.awardsByWeightArr = this.awardsArr.sort((a, b) => {
            return (a.weight - b.weight)
        })
        /**
        * @member {number} 
        * @desc 计算奖项权重最大
        */
        this.weightByMax = this.awardsByWeightArr[this.awardsArr.length - 1].weight;
    }

    /**
     * @method 
     * @property {GameEntity} entity 玩家对象
     * @return {object || boolean} 是否抽奖成功
     * @desc 重写父类，按权重方式，单次抽奖
     */
    setDrawByOne(entity) {
        if (!this.waitByPlayerDic.TryGetValue(entity.player.userId)) return false;
        let data = this._getRandomWeightByMin();
        return data && this._addWinnersByPrizeDic(data, entity) ? data : false;
    }

    /**
     * @method 
     * @return {object || boolean} 得到最小权重满足奖项数据
     * @desc [私有方法]得到随机权重值
     */
    _getRandomWeightByMin() {
        return this._isAndSetQuantityByPrize(this.awardsByWeightArr, (awardsArr) => {
            let random = Math.random() * this.weightByMax;
            for (var i = 0; i < this.awardsByWeightArr.length; i++) {
                if (random <= this.awardsByWeightArr[i].weight) {
                    return i;
                }
            }
        });
    }
}

/**
 * @class 
 * @constructor  
 * @classdesc 数量随机抽奖
 * @desc 按照随机方式进行抽奖
 */
class SweepstakesByQuantity extends SweepstakesManagerBase {
    constructor(awardsArr, quantity) {
        super(awardsArr, quantity);
    }

    /**
     * @method 
     * @property {GameEntity} entity 玩家对象
     * @return {object || boolean} 是否抽奖成功
     * @desc 重写父类，按随机方式，单次抽奖
     */
    setDrawByOne(entity) {
        if (!this.waitByPlayerDic.TryGetValue(entity.player.userId)) return false;
        let data = this._getRandomByPrize();
        return data && this._addWinnersByPrizeDic(data, entity) ? data : false;
    }

    /**
     * @method 
     * @return {object} 得到满足奖项数据
     * @desc [私有方法]得到随机奖项
     */
    _getRandomByPrize() {
        return this._isAndSetQuantityByPrize(this.awardsArr, (awardsArr) => {
            return Math.floor(Math.random() * awardsArr.length);
        });
    }
}


module.exports = {
    SweepstakesByWeight,
    SweepstakesByQuantity
};
