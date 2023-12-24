

# UiWrapper 教程

UiWrapper 是一个提供了子节点管理和链式调用优化的框架。

UiWrapper 的运行环境为 Pro 编辑器的客户端。

UiWrapper 的作者为 [七式草莓](https://dao3.fun/profile/73448)。

# 注意事项

1.此教程不会教你如何使用官方的 API 编辑 UI，如需入门官方的 API，请去 [Nomen 的教程（编程猫社区）](https://shequ.codemao.cn/community/674361)。

2.此教程对应的 UiWrapper 的版本为 1.0.0，如果使用的 UiWrapper 不是此版本，可以根据更新日志查看变更。

3.本教程可能会存在不准确的地方，UiWrapper 也可能会出现 bug。如果发现此类情况，请报告给七式草莓。

4.下文中有的地方将 UiNodeWrapper 叫做节点打包器（简称打包器）。

# 安装

因为神岛的客户端只能编写一个文件，为了减少对顶部空间的占用，已经将主要的代码放在底部。你只需要在顶部添加下面两行代码即可完成初始化。（在 UiWrapper 的代码中已经有初始化代码了，请按照注释放在相应位置即可）

```js
const UiNodeWrapper = createUiNodeWrapper();
const uiWrapper = new UiNodeWrapper(ui);
```

请注意，如果你使用的是 UiWrapper.client.min.js（下方简称为 min.js），而且没有使用类型声明文件，将会显示为 any 类型，属于正常现象。

实际上，只有第一行是必须的。但是由于经常使用根节点的打包器，所以强烈建议添加第二行。

# 基础使用

## new UiNodeWrapper

创建节点对应的 UiNodeWrapper，参数为节点对象。

在上面安装的初始化代码中，就有给根节点创建打包器的代码。

请注意，你可以重复为同一个节点创建 UiNodeWrapper，实际上返回的值是相同的。

下方的代码总是输出 true：
```js
console.log(new UiNodeWrapper(ui) === new UiNodeWrapper(ui));
```

## UiNodeWrapper.node

返回对应的节点对象（只读）

下方的代码总是输出 true：
```js
console.log(new UiNodeWrapper(ui).node === ui);
```

# 子节点管理优化

下面的内容假设你会你会使用基础的官方 API，如果你不会使用，可以阅读 Nomen 的教程 和官方文档。

## UiNodeWrapper.appendChild

添加子节点，可以传入多个参数，也可以传入无效值（这样将会被忽略）

参数：要添加的节点，可以为 UiNodeWrapper，也可以为官方 API 中的节点对象。这个参数为剩余参数。（如果你不懂什么是剩余参数，就当它是个普通参数就行）

返回值：无返回值。

示例：往根节点添加两个空白的文本节点。
```js
uiWrapper.appendChild(UiText.create(), UiText.create());
```

 > 注意：
 >
 > 1.在示例中使用的是官方 API 的创建节点方法，你也可以使用 UiNodeWrapper 的创建方法（UiNodeWrapper.createNode(UiText)），这会返回打包器对象。
 >
 > 2.实际上你也可以使用 uiWrapper.createChildNode(UiText) 来创建节点并作为自身的子节点（返回值为创建的节点的打包器）

为了理解直观，在只有一个参数（child，类型为官方 API 的节点对象或无效值）输入的情况下，则实现代码为（父节点在这里为 node，类型为官方 API 的节点对象）：

```js
if(child) child.parent = node;
```

## UiNodeWrapper.removeChild

删除子节点，可以传入多个参数，也可以传入无效值（这样将会被忽略）

参数：要删除的节点，可以为 UiNodeWrapper，也可以为官方 API 中的节点对象。这个参数为剩余参数。（如果你不懂什么是剩余参数，就当它是个普通参数就行）

返回值：无返回值。

为了理解直观，在只有一个参数（child，类型为官方 API 的节点对象或无效值）输入的情况下，则实现代码为：

```js
if(child) child.parent = null;
```

## UiNodeWrapper.replaceChild

替换子节点，第一个参数为被替换的节点，第二个为插入的节点（如果为无效值，此方法等效于 removeChild）。

参数：被替换的节点、插入的节点。两者均可以为 UiNodeWrapper，也可以为官方 API 中的节点对象。

返回值：无返回值。

请注意，此方法不是修改被替换的节点为插入的节点来实现的，而是删除被替换的节点，然后添加插入的节点（不会拷贝）。

示例：将根节点上的 textNode1（类型为 UiText） 替换成 textNode2（类型为 UiNodeWrapper）：
```js
uiWrapper.replaceChild(textNode1, textNode2);
```

## UiNodeWrapper.contains

检查自身是否包含目标节点。

参数：目标节点，可以为 UiNodeWrapper，也可以为官方 API 中的节点对象。

请注意，如果是自身的子节点为另一个节点，另一个节点的子节点为目标节点也会返回 true。

下方的代码总是输出 true：
```js
var node = UiNodeWrapper.createNode(UiText);
uiWrapper.createChildNode(UiBox).appendChild(node);
console.log(uiWrapper.contains(node));
```

## UiNodeWrapper.createChildNode

创建一个节点作为自身的子节点（下文会简称为创建子节点），并返回对应的打包器。

参数：节点所在的类，例如 UiText。如果上面没有静态的 create 方法，则不可创建。

示例：在根节点创建一个子节点（类型为文本节点，即 UiText），并定义变量 textNode 存储对应的打包器。
```js
var textNode = uiWrapper.createChildNode(UiText);
```

# 链式调用优化

本节的内容假设你会使用链式调用，如果你不知道什么是链式调用，请自行上网搜索。

在 UI 的链式调用中，作者个人习惯按照创建节点、设置属性、绑定事件、创建子节点的顺序来调用（个人习惯，不是最优习惯）。

## UiNodeWrapper.config（属性值不为 Coord2）

设置自身属性为一个值，并返回自身。

如果属性为 Vec2 或 Vec3，此方法不会直接设置，而是拷贝内容到自身的对应属性。

参数：参数的键名、参数的内容（可以为无效值）。

返回值：自身。

请注意，如果设置 uiScale，请勿直接传入数字。

示例：创建一个文本节点作为根节点的子元素，并设置文本内容、文本大小、文本颜色。
```js
uiWrapper.createChildNode(UiText)
    .config("textContent", "文本内容")
    .config("textFontSize", 10)
    .config("textColor", { r: 0, g: 255, b: 0 });
```

为了理解直观，如果设置的属性不为 Vec2、Vec3、Coord2，则实现代码为（假设节点对象为 node，键名为 key，值为 value）：
```js
node[key] = value;
```

## UiNodeWrapper.config（属性值为 Coord2）

设置自身属性为一个值，并返回自身。

由于 Coord2 内部逻辑复杂，强烈推荐你只设置 offset。

参数：参数的键名、参数的内容，设置的内容（"offset"、"scale"、"all" 三选一，默认为 "offset"）。

返回值：自身。

示例：创建一个文本节点作为根节点的子元素，并设置文本内容和位置。
```js
uiWrapper.createChildNode(UiText)
    .config("textContent", "文本内容")
    .config("position", uiWrapper.createCoord2({ x: 25, y: 25 }));
```

## UiNodeWrapper.eventOn

绑定一个事件，并返回自身。

参数：事件类型、事件处理器（与官方 API 处理器的参数相同）。

返回值：自身。

请注意，事件处理器中的 event.target 为节点对象，并非节点打包器！

示例：点击白框时输出 "Click!"：
```js
uiWrapper.createChildNode(UiBox)
    .eventOn("pointerdown", () => console.log("Click!"));
```

为了理解直观，实现代码为（假设节点对象为 node，事件类型为 type，事件触发时会输出 "Click!"）
```js
node.events.on(type, () => console.log("Click!"));
```

## UiNodeWrapper.eventOnce

绑定一个只触发一次的事件，并返回自身。

参数：事件类型、事件处理器（与官方 API 处理器的参数相同）。

返回值：自身。

请注意，事件处理器中的 event.target 为节点对象，并非节点打包器！

示例：第一次点击白框时输出 "Click!"：
```js
uiWrapper.createChildNode(UiBox)
    .eventOnce("pointerdown", () => console.log("Click!"));
```

为了理解直观，实现代码为（假设节点对象为 node，事件类型为 type，事件触发时会输出 "Click!"）
```js
node.events.once(type, () => console.log("Click!"));
```


