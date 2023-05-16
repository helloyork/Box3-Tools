/**
 * !info {Project} -来自网络
 * 衰落伤害
 */



voxels.isFluid = (voxel) => { return ['water', 364, 'strawberry_juice', 412, 'lime_juice', 414, 'blueberry_juice', 416, 'lemon_juice', 418, 'grape_juice', 420, voxels.name(422), 422, voxels.name(424), 424, voxels.name(426), 426, voxels.name(428), 428, voxels.name(430), 430].includes(voxel) }
var xzCo = 0.44921875
var yCo = 1.6
world.onPlayerJoin(async ({ entity }) => {
    entity.enableDamage = true
    entity.maxHp = 100
    entity.hp = 100
    const g = voxels.getVoxel
    entity.fallHigh = 0
    entity.highY = entity.position.y
    entity.contactList = () => {
        return [
            g(entity.position.x + xzCo, entity.position.y - yCo, entity.position.z + xzCo),
            g(entity.position.x + xzCo, entity.position.y - yCo, entity.position.z - xzCo),
            g(entity.position.x - xzCo, entity.position.y - yCo, entity.position.z + xzCo),
            g(entity.position.x - xzCo, entity.position.y - yCo, entity.position.z - xzCo),
            g(entity.position.x + xzCo, entity.position.y - yCo, entity.position.z),
            g(entity.position.x - xzCo, entity.position.y - yCo, entity.position.z),
            g(entity.position.x, entity.position.y - yCo, entity.position.z + xzCo),
            g(entity.position.x, entity.position.y - yCo, entity.position.z - xzCo),
            g(entity.position.x, entity.position.y - yCo, entity.position.z)]
    }
    entity.ifContact = function () {
        for (const count of entity.
            contactList()) {
            if (count != 0) {
                if (voxels.isFluid(count)) {
                    this.fallHigh = 0
                    return false
                } return true
            }
        } return false
    }
    while (entity) {
        await sleep(64)
        if (entity.ifContact()) {
            if (voxels.isFluid(g(entity.position.x, entity.position.y - 1, entity.position.z))) continue
            if (entity.fallHigh > 6) {
                const hurt = entity.fallHigh / 3 * 18 * ~(world.gravity * 100) / 100
                entity.hurt(hurt)
                entity.player.directMessage(`你受到${hurt}点高空伤害`)
                entity.fallHigh = 0
            } else {
                entity.fallHigh = 0
            }
        } if (entity.highY > Math.floor(entity.position.y)) {
            entity.fallHigh += 1
            entity.highY = Math.floor(entity.position.y)
        } else {
            entity.highY = Math.floor(entity.position.y)
        }
    }
})
world.onFluidEnter(({ entity }) => {
    if (entity.isPlayer) entity.fallHigh = 0
})
