/**
 * !Info {Project} -来自145a
 * 145powerTag 1.1
 */
world.querySelectorAll(".powerTag").forEach(entity=>{
    entity.tags().forEach(tag=>{
        if(tag[0]="?"){
            const entry = tag.slice(1).split("=");
            entity[entry[0]] = eval(entry[1]);
            entity.removeTag(tag);
        }
    });
});
//请勿删除最后一行