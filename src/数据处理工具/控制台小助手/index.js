/**
 * !info {Module} -来自Nomen
 * 控制台小助手，以特定格式美观的输出一个对象结构，自动tab，换行，暂时无法处理自调用
 */



/**
 * 
 * @param {*} Content 输入内容
 * @param {Number} maxDepth 最大展开深度，如果超出展开深度，则以类型形式输出
 * @returns 
 */
function log(Content, maxDepth = 3, depth = 0, startWord = '') {
    if (depth >= maxDepth) { console.log("—— ".repeat(depth) + startWord + Object.prototype.toString.call(Content)); return; }
    let t = Object.prototype.toString.call(Content).slice(8, -1);
    function logout(c){console.log("—— ".repeat(depth) + startWord + c)}
    if (t == "Number") console.log("—— ".repeat(depth) + startWord + Content);
    else if (t == "String") logout(`"${Content}"`);
    else if (t == "Boolean") logout(Content);
    else if (t == "Undefined") logout("undefined");
    else if (t == "Null") logout("null");
    else if (t == "Function") logout(`function ${Content.name}`);
    else if (t == "Date") logout(Content.toDateString());
    else if (t == "Array") logout(JSON.stringify(Content));
    else if (t == "Object") {
        logout("{")
        Object.keys(Content).forEach(v => {log(Content[v], 3, depth + 1, v + ": ");})
        console.log("—— ".repeat(depth) + "}");
    } else {
        if (Content.toString) console.log("—— ".repeat(depth) + startWord + Content.toString());
        else console.log("—— ".repeat(depth) + startWord + Object.prototype.toString.call(Content))
    }
}

module.exports = {
    log
}

/*

log({
    content: 'Hello world!',
    count: 3,
    item: {
        name: 'World',
        call: 'Hello',
        coin: 10,
        map: (new WeakMap()),
        item:{
            coin:20,
            item:{
                coin:30,
                depth:1,
            }
        }
    },
    date: (new Date()),
    bag: ['awa', 'awa', 'awa'],
    say: function (c) { console.log(c) }
});

*/

