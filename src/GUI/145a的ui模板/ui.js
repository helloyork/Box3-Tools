/**
 * !Info {Module} -来自145a
 * ui模板 0.5
 * ui模板是145lab的一部分
 * ui.js
 */
let clientRegisterToken = remoteChannel.onServerEvent(async ({ entity, args }) => {
    switch (args.name) {
        case "register":
            entity.uiDiaplayCache = {};
            entity.uiDiaplay = new Proxy(entity.uiDiaplayCache, {
                set(target, property, value) {
                    if (Reflect.get(target, property) !== value) {
                        let data = {};
                        Reflect.set(data, property, value);
                        Reflect.set(target, property, value);
                        remoteChannel.sendClientEvent(entity, {
                            name: "display",
                            data: data
                        });
                    }
                    return true;
                }
            });
            entity.addTag("uiClient");
            break;
    }
});
//请勿删除最后一行