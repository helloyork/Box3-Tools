
// 简单的例子：
// 由于客户端特性，我们无法在客户端储存敏感的HTML数据，所以我们需要从服务端获取

// SERVER index.js
world.onPlayerJoin(({ entity }) => {
    remoteChannel.sendClientEvent(entity, "<box height=200 width=300 scale=20% x=20 y=40><text>awaawaawaawa</text></box>")
})

// CLIENT clientIndex.js
remoteChannel.events.on("client", (arg) => {
    let nodes = parser(lexer(arg)); // 进行解析
    render(ui, nodes); // 挂载到ui上并且渲染
})


/*
语法应该是这样的
<标签名></闭合标签(如果有)>
以及属性语法
<标签名 key=value>
key可以是以下内容


x
x偏移

y
y偏移

height/h
高度

width/w
宽度

name/id
名字

scale/resize
缩放

backgroundOpacity/background-opacity
背景透明度

zIndex/z-index/z-Index
图层位置

autoResize/auto-resize
自动缩放方式：'NONE' | 'X' | 'Y' | 'XY'

visible
可见性

textContent/text/text-content
文字内容（通常只要直接包含在标签内部就会自动设置）

textFontSize/text-font-size/font-size/text-size
文字尺寸

textXAlignment/text-align-x/textXAlign
x对齐：'Center' | 'Left' | 'Right'

textYAlignment/text-align-y/textYAlign
y对其：'Center' | 'Top' | 'Bottom'

image/src/image-src
图片链接

imageOpacity/opacity/img-oct
图片透明度

backgroundColor/background-color/bc
背景颜色，例如：<box background-color=rgb(11,45,14)></box>

textColor/text-color/tc/color
文字颜色，例如：<text tc=rgb(11,45,14)></text>
*/




