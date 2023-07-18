/**
 * [Archived] !info {Module} -来自Nomen
 * @version 1.0.0
 * @requires NomenGUI
 * 警告，本文件可能存在非标准特性，请谨慎投入生产
 * NomenGUI & NomenNode: 何不以DOM的形式便捷的管理你的GUI界面？ - https://shequ.codemao.cn/community/552140
 */



class NomenGUI {
    constructor(entity, root) {
        if (NomenGUI.instance) return NomenGUI.instance;
        NomenGUI.instance = this;
        this.root = null;
        this.entity = entity;
        this._defalutroot = root instanceof NomenNode ? root : undefined;
    }
    async init(nodes) {
        if (this.root) return;
        this.nodes = nodes;
        this.bin = {};
        let size = await this.getSize();
        this.root = this._defalutroot || new NomenNode({
            display: true,
            data: {
                name: "label",
                id: "NomenGUIE-Root",
                attributes: {
                    "height": size.height,
                    "width": size.width,
                }
            },
            children: nodes ? nodes.filter(v => v instanceof NomenNode) : undefined,
            entity: this.entity
        });
    }
    async render() {
        await gui.remove(this.entity, "#NomenGUIE-Root");
        await gui.init(this.entity, this.bin);
    }
    async getSize() {
        let t = this;
        await gui.init(this.entity, {
            "NomenGUI-DSize": {
                display: true,
                data: `<dialog percentWidth="100" percentHeight="100" id="fullscreen"></dialog>`
            }
        });
        return {
            width: await gui.getAttribute(t.entity, "#fullscreen", "width"),
            height: await gui.getAttribute(t.entity, "#fullscreen", "height"),
            _remove: await gui.remove(t.entity, "#NomenGUI-DSize")
        };
    }
    async refresh(node) {
        if (!node) node = this.root;
        let size = await this.getSize();
        this.root.setAttribute("height", size.height);
        this.root.setAttribute("width", size.width);
        this.bin[`NomenGUIE${node.id}`] = node.toData();
    }
    static instance = null;
    static getInstance() {
        return this.instance;
    }
}

module.exports = {
    NomenGUI
}