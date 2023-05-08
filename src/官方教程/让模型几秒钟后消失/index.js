/**
 * !info {Project} -来自(shequ.codemao.cn/community/363908)@吉吉喵
 * 只需要下面这串神奇的代码
 * 就能让模型在固定的时间消失！
 */



async function hideAfter3Sec(entity) {
    await sleep(3000)
    entity.meshInvisible = true
  }
  
  hideAfter3Sec(world.querySelector('#灯笼'))