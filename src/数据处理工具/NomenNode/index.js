/**
 * !info {Module} -来自Nomen
 * @version 1.0.0
 * NomenGUI & NomenNode: 何不以DOM的形式便捷的管理你的GUI界面？ - https://shequ.codemao.cn/community/552140
 */



class NomenNode {
    constructor({ display, bindings, data, children, entity, name }) {
        if (!entity) throw new Error("Entity is required");
        this.display = display;
        this.bindings = bindings;
        this.data = data;
        this.entity = entity;
        this.children = children || [];
        this.name = name;
        this.id = data.id || "_";
    }
    appendChild(child) {
        if (!(child instanceof NomenNode)) return;
        this.children.push(child);
        return this.children.length;
    }
    cloneNode(deep) {
        return new NomenNode({
            display: this.display,
            bindings: this.bindings,
            data: this.data,
            children: deep === true ? (this.children.map(v => v.cloneNode(true))) : this.children,
            entity: this.entity
        });
    }
    contains(otherNode) {
        return this.children.includes(otherNode);
    }
    hasChildNodes() {
        return !!this.children.length;
    }
    isSameNode(otherNode) {
        return this === otherNode;
    }
    insertBefore(newNode, referenceNode) {
        if (!(newNode instanceof NomenNode) || !~this.children.indexOf(referenceNode)) return;
        this.children.splice(this.children.indexOf(referenceNode), 0, newNode);
    }
    removeChild(child) {
        if (!~this.children.indexOf(child)) return;
        this.children.splice(this.children.indexOf(child), 1);
    }
    replaceChild(newChild, oldChild) {
        if (!(newChild instanceof NomenNode) || !~this.children.indexOf(oldChild)) return;
        this.children.splice(this.children.indexOf(oldChild), 1, newChild)
    }
    toData(isChild) {
        return isChild ? {
            attributes: { ...this.data.attributes, id: this.id, },
            name: this.data.name,
            children: this.hasChildNodes() ? this.children.map(v => v.toData(true)) : undefined
        } : {
            display: this.display,
            data: {
                attributes: { ...this.data.attributes, id: this.id, },
                name: this.data.name,
                children: this.hasChildNodes() ? this.children.map(v => v.toData(true)) : undefined
            },
        }
    }
    setAttribute(name, value) {
        this.data.attributes[name] = value;
    }
    getAttribute(name) {
        return this.data.attributes[name]
    }
    async setAttributeSync(name, value) {
        this.setAttribute(name, value);
        return await gui.setAttribute(this.entity, `#${this.data.id}`, name, value);
    }
    async getAttributeSync(name) {
        return await gui.getAttribute(this.entity, `#${this.data.id}`, name);
    }
}