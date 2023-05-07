/**
 * !info {Project} -来自Nomen
 * 带堆叠上限的背包系统（？
 */



const topBag = 64;//物品堆叠上限，默认64


world.onPlayerJoin(async ({ entity }) => {
    entity.bag = [];
    Object.assign(entity, {
        give: function (name, count) {
            if (count > topBag) return;//检测输入是否大于背包最大堆叠
            if (name === undefined || count === undefined) return;//检测信息是否完全，防止报错
            var prop = [];
            for (let i in this.bag) { if (this.bag[i].name == name) prop.push(parseInt(i)); }//抽取所有此物品的项目
            if (prop.length == 0) { this.bag.push({ name, count }); return; }//如果不存在项目，则直接推入物品
            if ((this.bag[prop[prop.length - 1]].count + count) > topBag) {//如果存在该项目但是剩余空间不足
                if (this.bag[prop[prop.length - 1]].count == topBag) { this.bag.push({ name, count }); return; }
                let c = this.bag[prop[prop.length - 1]].count
                this.bag[prop[prop.length - 1]].count = topBag;//补全当前项目
                this.bag.push({ name, count: count - (topBag - c) })//将多余最高堆叠的项目推入背包 topBag-(count-(this.bag[prop[prop.length-1]].count))  
            } else {
                this.bag[prop[prop.length - 1]].count += count//否则直接推入项目
            }
        },
        show: function () {
            this.bag.forEach((item) => {
                console.log(item.name, ":", item.count)
            })
        },
        remove: function (name, count) {
            if (name === undefined || count === undefined) return;//检测信息是否完全，防止报错
            var prop = [];
            for (let i in this.bag) { if (this.bag[i].name == name) prop.push(parseInt(i)); }//抽取所有此物品的项目
            var allCount = 0;
            prop.forEach((elei) => { allCount += this.bag[elei].count; })
            if (allCount < count) return false;
            for (let i = prop.length-1;i>=0;i--) {
                if (this.bag[prop[(i)]].count >= count) {
                    this.bag[prop[(i)]].count -= count;
                    if (this.bag[prop[(i)]].count == 0) this.bag.splice(prop[i], 1);
                    console.warn(this.bag[prop[(i)]].count)
                    return true;
                } else {
                    count -= this.bag[prop[(i)]].count;
                    this.bag.splice(prop[i], 1);
                }
            }
        }
    })
})



