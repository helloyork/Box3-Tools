/**
 * !info {Project} -来自(shequ.codemao.cn/community/374598)@吉吉喵
 * 皮肤虽然有限
 * 但可穿戴装备是无限的！
 * 学会这项技能
 * 你就是岛上最靓的崽～
 */



world.onPlayerJoin(({entity}) => {
    entity.player.addWearable({
        bodyPart: Box3BodyPart.HEAD,
        mesh: 'mesh/三级盔.vb',
        orientation: new Box3Quaternion(0,1,0,0).rotateY(-Math.PI/2),
        offset: new Box3Vector3(0,0.4,0.1),
    });
    entity.player.addWearable({
        bodyPart: Box3BodyPart.RIGHT_HAND,
        mesh: 'mesh/95式 [精美].vb',
        orientation: new Box3Quaternion(0,1,0,0).rotateY(Math.PI),
        offset: new Box3Vector3(-0.05,-0.1,0.5),
        scale: Box3Vector3 = new Box3Vector3(0.3, 0.3, 0.3),
    });
});
