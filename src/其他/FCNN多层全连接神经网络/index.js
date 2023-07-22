
function E(yOutput, yTarget) {
    return Math.pow(yOutput - yTarget, 2) / 2
}

class Neuron {
    constructor(id, value) {
        this._id = id;
        this._value = value;
        this._incomingConnection = [];
        this._outgoingConnection = [];
        this.error = 0;
    }
    setValue(value) {
        this._value = value;
    }
    getValue() {
        return this._value;
    }
    getId() {
        return this._id;
    }
    addIncomingConnection(connection) {
        this._incomingConnection.push(connection);
    }
    getIncomingConnections() {
        return this._incomingConnection;
    }
    addOutgoingConnection(connection) {
        this._outgoingConnection.push(connection);
    }
    getOutgoingConnections() {
        return this._outgoingConnection;
    }
    toString() {
        return `neuron: ${this.getId()}`
    }
    updateWeights(learningRate, targetData, isOutput) {
        if (isOutput) {
            for (let i = 0; i < this.getIncomingConnections().length; i++) {
                this.getIncomingConnections()[i].setWeight(
                    this.getIncomingConnections()[i].getWeight() - learningRate * (
                        -(E(this.getValue(), targetData)) * targetData * (1 - targetData) * (
                            this.getIncomingConnections()[i].getIncomingNeuron().getValue()
                        )
                    )
                )
            }
        } else {
            for (let i = 0; i < this.getIncomingConnections().length; i++) {
                this.getIncomingConnections()[i].setWeight(
                    this.getIncomingConnections()[i].getWeight() - learningRate * this.error * this.getIncomingConnections()[i].getIncomingNeuron().getValue()
                )
            }
        }
    }
    calculateError() {
        this.error = 0;
        this.getOutgoingConnections().forEach(c => {
            this.error += c.getOutgoingNeuron().error * c.getWeight();
        });
        this.error *= this.getValue() * (1 - this.getValue());
    }
}

class Connection {
    constructor(id, incoming, outgoing, weight = 1) {
        this._id = id;
        this._incoming = incoming;
        this._outgoing = outgoing;
        this._weight = weight;
    }
    connect() {
        this._incoming.addOutgoingConnection(this);
        this._outgoing.addIncomingConnection(this);
    }
    setWeight(weight) {
        this._weight = weight;
    }
    getWeight() {
        return this._weight;
    }
    getIncomingNeuron() {
        return this._incoming;
    }
    getOutgoingNeuron() {
        return this._outgoing;
    }
    toString() {
        return `connection: [${this._incoming.toString()}--${this._outgoing.toString()}]`;
    }
}

class NeuralNetwork {
    static get defaultConfig() {
        return {
            input: 2,
            hidden: [3, 2, 3],
            output: 1,
            learningRate: 0.5,
            randomWeight: () => {
                return (Math.random() * 4 - 2);
            },
            activationFunctions: [function sigmoid(x) {
                return 1 / (1 + Math.exp(-x));
            },],
            outputActivationFunction: function softmax(x) {
                let exps = x.map(val => Math.exp(val - Math.max(...x)));
                return exps.map(val => val / exps.reduce((acc, val) => acc + val, 0));
            }
        }
    }
    constructor(config) {
        this.initAssign(this.constructor.defaultConfig, config);
        this._targetData = config.targetData;
        this._inputData = config.inputData;
        this.connections = [];
        this.step = 0;
        this.net = {
            "in": [],
            "hidden": [],
            "out": []
        };
        this.initNodes(config.input, config.hidden, config.output);
        this.initConnections(this.randomWeight);
    }
    initNodes(inNum, hidden, outNum) {
        for (let i = 0; i < inNum; i++) {
            this.addInputNode(new Neuron(`INPUT-${this.net["in"].length}`, 0));
        }
        for (let hid = 0; hid < hidden.length; hid++) {
            for (let i = 0; i < hidden[hid]; i++) {
                this.addHiddenNode(hid, new Neuron(`HIDDEN-${hid}-${i}`));
            }
        }
        for (let i = 0; i < outNum; i++) {
            this.addOutputNode(new Neuron(`OUTPUT-${this.net["out"].length}`, 0));
        }
    }
    initAssign(d, c) {
        let cf = {};
        Object.keys(c)
            .filter(v => this.constructor.defaultConfig[v] !== undefined)
            .forEach(v => cf[v] = c[v]);
        Object.assign(this, d, cf);
    }
    initConnections(randomWeight = () => 0) {
        function createConnection(a, b) {
            return new Connection(`${a.getId()}--${b.getId()}`, a, b, randomWeight());
        }
        this.forEachInputToFirstHidden((a, b) => {
            this.connections.push(createConnection(a, b));
        })
        this.forEachHiddenToNext((a, b) => {
            this.connections.push(createConnection(a, b));
        })
        this.connections.forEach(v => v.connect());
    }
    train() {
        if (this.step >= this._inputData.length) {
            this.step = 0;
        }
        this.calculate(this._inputData[this.step]);
        for (let i = 0; i < this.net["out"].length; i++) {
            this.net["out"][i].error = this.net["out"][i].getValue() - this._targetData[this.step][i];
            this.net["out"][i].updateWeights(this.learningRate, this._targetData[this.step][i], true);
        }
        for (let i = this.net["hidden"].length - 1; i >= 0; i--) {
            for (let r = this.net["hidden"][i].length - 1; r >= 0; r--) {
                this.net["hidden"][i][r].calculateError();
                this.net["hidden"][i][r].updateWeights(this.learningRate, this._inputData[this.step][i]);
            }
        }
        this.step++;
    }
    calculate(data) {
        this._setInputNodes(data);
        let c = (a, b, i) => {
            a.setValue(
                (this.activationFunctions[i] ? this.activationFunctions[i] : this.activationFunctions[0])(
                    a.getIncomingConnections()
                        .map(v => v.getIncomingNeuron().getValue() * v.getWeight())
                        .reduce((p, c) => p + c, 0)
                )
            );
        };
        this.forEachHiddenToNext(c);
        let outputs = [];
        this.forEachOutput((a) => {
            outputs.push(
                a.getIncomingConnections()
                    .map(v => v.getIncomingNeuron().getValue() * v.getWeight())
                    .reduce((p, c) => p + c, 0)
            )
        });
        this._setOutputNodes(this.outputActivationFunction(outputs));
    }
    forEachInputToFirstHidden(c) {
        for (let i = 0; i < this.net["in"].length; i++) {                                 // 遍历传入单元
            for (let r = 0; r < this.net["hidden"][0].length; r++) {                      // 遍历第一层隐含
                c(this.net["in"][i], this.net["hidden"][0][r])
            }
        }
    }
    forEachOutput(c) {
        for (let i = 0; i < this.net["out"].length; i++) {
            c(this.net["out"][i])
        }
    }
    forEachHiddenToNext(c) {
        for (let i = 0; i < this.net["hidden"].length; i++) {                             // 每一层
            for (let r = 0; r < this.net["hidden"][i].length; r++) {                      // 每一个单元
                if (this.net["hidden"][i + 1]) {                                          // 如果下一层存在
                    for (let next = 0; next < this.net["hidden"][i + 1].length; next++) { // 遍历下一层每一个单元
                        c(this.net["hidden"][i][r], this.net["hidden"][i + 1][next], i)
                    }
                } else {
                    for (let next = 0; next < this.net["out"].length; next++) {           // 遍历输出层每一个单元
                        c(this.net["hidden"][i][r], this.net["out"][next], i)
                    }
                }
            }
        }
    }
    _setInputNodes(data) {
        for (let i = 0; i < data.length; i++) {
            this.net["in"][i]?.setValue(data[i]);
        }
    }
    _setOutputNodes(data) {
        for (let i = 0; i < data.length; i++) {
            this.net["out"][i]?.setValue(data[i]);
        }
    }
    setInputData(data) {
        if (Array.isArray(data)) this._inputData = data;
        return this;
    }
    setTargetData(data) {
        if (Array.isArray(data)) this._targetData = data;
        return this;
    }
    getOutput() {
        return this.net["out"].map(v => `${v.getId()}: ${v.getValue()}`)
    }
    addInputNode(node) {
        this.net["in"].push(node);
    }
    addHiddenNode(f, node) {
        if (!this.net["hidden"][f]) this.net["hidden"][f] = [];
        this.net["hidden"][f].push(node);
    }
    addOutputNode(node) {
        this.net["out"].push(node);
    }
}

let u = new NeuralNetwork({
    input: 3,
    hidden: [64, 64, 64],
    output: 4,
    learningRate: 0.1
});
u.setInputData([
    [1.0, 0.0, 20.0],   // 红色
    [0.0, 1.0, 0.0],   // 绿色
    [0.0, 0.0, 1.0],   // 蓝色
    [1.0, 1.0, 0.0]    // 黄色
]).setTargetData([
    [1, 0, 0, 0],      // 红色
    [0, 1, 0, 0],      // 绿色
    [0, 0, 1, 0],      // 蓝色
    [0, 0, 0, 1]       // 黄色
]);

for (let i = 0; i < 3000; i++) {
    if (i % 100 == 0) console.log(u.getOutput()); // if (i % 100 == 0) 
    u.train();
}
u.calculate([0.0, 1.0, 0.0]);
console.log("a: " + u.getOutput());

u.calculate([1.0, 1.0, 0.0]);
console.log("b: " + u.getOutput());

u.calculate([0.0, 0.0, 1.0]);
console.log("c: " + u.getOutput());

u.calculate([1.0, 0.0, 0.0]);
console.log("d: " + u.getOutput());

u.calculate([0.7, 0.1, 0.2]);
console.log("e: " + u.getOutput());

// console.log(u.net.hidden);
console.log(u.getOutput());
console.log(u.net["out"][0].error)







