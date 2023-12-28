
function RemoteClientWrapper() {
    let events = [], seed = 2024, dport = 6000,random = () => (seed = (seed * 9301 + 49297) % 233280, parseInt(seed / 233280.0 * 1000000));
    function wrap(type, data, id, port = dport) {
        return { type, data, id, port }
    }
    function send(data, id, type = "data") {
        console.log("sent")
        remoteChannel.sendServerEvent(wrap(type, data, id));
        return id;
    }
    function onMessage(type = "data", f) {
        events.push({ type, handler: f });
        return { cancel() { events = events.filter(v => v.handler !== f); } }
    }
    function communicate(data, f) {
        events.push({
            type: "communicate", handler: (arg) => {
                f(arg);
                events = events.filter(v => v.handler !== f);
            }, id: send(data, random(), "communicate")
        });
    }
    remoteChannel.events.on("client", arg => {
        if (arg.type === "communicate") {
            events.filter(v => v.type === arg.type).forEach(f => {
                let res = f.handler(arg.data);
                if (res.then) res.then(r => send(r, arg.id))
                else send(res, arg.id);
            });
        } else if (arg.type === "data") {
            events.filter(v => v.type === arg.type).forEach(f => f.handler(arg.data));
        }
    });
    return {
        send,
        onMessage,
        communicate
    }
}

