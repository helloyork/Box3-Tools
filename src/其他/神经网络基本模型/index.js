/**
 * !info {Project} -来自Nomen
 * 神经网络训练模型，附有一段训练示例
 */



console.clear();

class Nodes {
    constructor(ID, val) {
        this.id = ID;
        this.incomingConnections = [];
        this.outgoingConnections = [];
        if (val === undefined) {
            val = 0;
        }
        this.value = val;
        this.bias = 0;
    }
}

class Connection {
    constructor(inID, outID, weight) {
        this.in = inID;
        this.out = outID;
        if (weight === undefined) {
            weight = 1;
        }
        this.id = inID + ":" + outID;
        this.weight = weight;
    }
}

class Network {
    constructor(config) {
        this.nodes = {};
        this.inputs = [];
        this.hidden = [];
        this.outputs = [];
        this.connections = {};
        this.nodes.BIAS = new Nodes("BIAS", 1);
        if (config !== undefined) {
            var inputNum = config.inputNodes || 0;
            var hiddenNum = config.hiddenNodes || 0;
            var outputNum = config.outputNodes || 0;
            this.createNodes(inputNum, hiddenNum, outputNum);
            if (config.createAllConnections) {
                this.createAllConnections(true);
            }
        }
    }
    createNodes = function (inputNum, hiddenNum, outputNum) {
        for (var i = 0; i < inputNum; i++) {
            this.addInput();
        }
        for (var j = 0; j < hiddenNum; j++) {
            this.addHidden();
        }
        for (var k = 0; k < outputNum; k++) {
            this.addOutput();
        }
    }
    addInput = function (value) {
        var nodeID = "INPUT:" + this.inputs.length;
        if (value === undefined) {
            value = 0;
        }
        this.nodes[nodeID] = new Nodes(nodeID, value);
        this.inputs.push(nodeID);
    }
    addHidden = function () {
        var nodeID = "HIDDEN:" + this.hidden.length;
        this.nodes[nodeID] = new Nodes(nodeID);
        this.hidden.push(nodeID);
    }
    addOutput = function () {
        var nodeID = "OUTPUT:" + this.outputs.length;
        this.nodes[nodeID] = new Nodes(nodeID);
        this.outputs.push(nodeID);
    }
    getNodeByID = function (nodeID) {
        return this.nodes[nodeID];
    }
    getNode = function (type, index) {
        if (type.toUpperCase() == "INPUT") {
            return this.nodes[this.inputs[index]];
        } else if (type.toUpperCase() == "HIDDEN") {
            return this.nodes[this.hidden[index]];
        } else if (type.toUpperCase() == "OUTPUT") {
            return this.nodes[this.outputs[index]];
        }
        return null;
    }
    getConnection = function (connectionID) {
        return this.connections[connectionID];
    }
    calculate = function calculate() {
        this.updateNodeConnections();
        for (var i = 0; i < this.hidden.length; i++) {
            this.calculateNodeValue(this.hidden[i]);
        }
        for (var j = 0; j < this.outputs.length; j++) {
            this.calculateNodeValue(this.outputs[j]);
        }
    }
    updateNodeConnections = function () {
        for (var nodeKey in this.nodes) {
            this.nodes[nodeKey].incomingConnections = [];
            this.nodes[nodeKey].outgoingConnections = [];
        }
        for (var connectionKey in this.connections) {
            this.nodes[this.connections[connectionKey].in].outgoingConnections.push(connectionKey);
            this.nodes[this.connections[connectionKey].out].incomingConnections.push(connectionKey);
        }
    }
    calculateNodeValue = function (nodeID) {
        var sum = 0;
        for (var incomingIndex = 0; incomingIndex < this.nodes[nodeID].incomingConnections.length; incomingIndex++) {
            var connection = this.connections[this.nodes[nodeID].incomingConnections[incomingIndex]];
            sum += this.nodes[connection.in].value * connection.weight;
        }
        this.nodes[nodeID].value = sigmoid(sum);
    }
    addConnection = function (inID, outID, weight) {
        if (weight === undefined) {
            weight = 1;
        }
        this.connections[inID + ":" + outID] = new Connection(inID, outID, weight);
    }
    createAllConnections = function (randomWeights) {
        if (randomWeights === undefined) {
            randomWeights = false;
        }
        var weight = 1;
        for (var i = 0; i < this.inputs.length; i++) {
            for (var j = 0; j < this.hidden.length; j++) {
                if (randomWeights) {
                    weight = Math.random() * 4 - 2;
                }
                this.addConnection(this.inputs[i], this.hidden[j], weight);
            }
            if (randomWeights) {
                weight = Math.random() * 4 - 2;
            }
            this.addConnection("BIAS", this.inputs[i], weight);
        }
        for (var k = 0; k < this.hidden.length; k++) {
            for (var l = 0; l < this.outputs.length; l++) {
                if (randomWeights) {
                    weight = Math.random() * 4 - 2;
                }
                this.addConnection(this.hidden[k], this.outputs[l], weight);
            }
            if (randomWeights) {
                weight = Math.random() * 4 - 2;
            }
            this.addConnection("BIAS", this.hidden[k], weight);
        }
    }
    setNodeValue = function (nodeID, value) {
        this.nodes[nodeID].value = value;
    }
    setInputs = function (array) {
        for (var i = 0; i < array.length; i++) {
            this.nodes[this.inputs[i]].value = array[i];
        }
    }
    setMultipleNodeValues = function (valuesByID) {
        for (var key in valuesByID) {
            this.nodes[key].value = valuesByID[key];
        }
    }
}

class BackpropNetwork extends Network {
    constructor(config) {
        super(config);
        this.inputData = {};
        this.targetData = {};
        this.learningRate = 0.5;
        this.step = 0;
        this.error = 0;
        this.averageError = [];
        if (config !== undefined) {
            if (config.learningRate !== undefined) {
                this.learningRate = config.learningRate;
            }
            if (config.inputData !== undefined) {
                this.setInputData(config.inputData);
            }
            if (config.targetData !== undefined) {
                this.setTargetData(config.targetData);
            }
        }
    }
    backpropagate = function () {
        this.step++;
        if (this.inputData[this.step] === undefined) {
            this.averageError.push(this.error / this.step);
            this.error = 0;
            this.step = 0;
        }
        for (var inputKey in this.inputData[this.step]) {
            this.nodes[inputKey].value = this.inputData[this.step][inputKey];
        }
        this.calculate();
        var currentTargetData = this.targetData[this.step];
        var totalError = this.getTotalError();
        this.error += totalError;
        var newWeights = {};
        for (var i = 0; i < this.outputs.length; i++) {
            var outputNode = this.nodes[this.outputs[i]];
            for (var j = 0; j < outputNode.incomingConnections.length; j++) {
                var hiddenToOutput = this.connections[outputNode.incomingConnections[j]];
                var deltaRuleResult = -(currentTargetData[this.outputs[i]] - outputNode.value) * outputNode.value * (1 - outputNode.value) * this.nodes[hiddenToOutput.in].value;
                newWeights[hiddenToOutput.id] = hiddenToOutput.weight - this.learningRate * deltaRuleResult;
            }
        }
        for (var k = 0; k < this.hidden.length; k++) {
            var hiddenNode = this.nodes[this.hidden[k]];
            for (var l = 0; l < hiddenNode.incomingConnections.length; l++) {
                var inputToHidden = this.connections[hiddenNode.incomingConnections[l]];
                var total = 0;
                for (var m = 0; m < hiddenNode.outgoingConnections.length; m++) {
                    var outgoing = this.connections[hiddenNode.outgoingConnections[m]];
                    var outgoingNode = this.nodes[outgoing.out];
                    total += ((-(currentTargetData[outgoing.out] - outgoingNode.value)) * (outgoingNode.value * (1 - outgoingNode.value))) * outgoing.weight;
                }
                var outOverNet = hiddenNode.value * (1 - hiddenNode.value);
                var netOverWeight = this.nodes[inputToHidden.in].value;
                var result = total * outOverNet * netOverWeight;
                newWeights[inputToHidden.id] = inputToHidden.weight - this.learningRate * result;
            }
        }
        for (var key in newWeights) {
            this.connections[key].weight = newWeights[key];
        }
    }
    addTarget = function (outputNodeID, target) {
        this.targetData[outputNodeID] = target;
    }
    setInputData = function () {
        var all = arguments;
        if (arguments.length == 1 && arguments[0].constructor == Array) {
            all = arguments[0];
        }
        this.inputData = {};
        for (var i = 0; i < all.length; i++) {
            var data = all[i];
            var instance = {};
            for (var j = 0; j < data.length; j++) {
                instance["INPUT:" + j] = data[j];
            }
            this.inputData[i] = instance;
        }
    }
    setTargetData = function () {
        var all = arguments;
        if (arguments.length == 1 && arguments[0].constructor == Array) {
            all = arguments[0];
        }
        this.targetData = {};
        for (var i = 0; i < all.length; i++) {
            var data = all[i];
            var instance = {};
            for (var j = 0; j < data.length; j++) {
                instance["OUTPUT:" + j] = data[j];
            }
            this.targetData[i] = instance;
        }
    }
    getTotalError = function () {
        var sum = 0;
        for (var i = 0; i < this.outputs.length; i++) {
            sum += Math.pow(this.targetData[this.step][this.outputs[i]] - this.nodes[this.outputs[i]].value, 2) / 2;
        }
        return sum;
    }
}

function sigmoid(t) {
    return 1 / (1 + Math.exp(-t));
}



var count = 10000;
var times = 20;
var timeout = 100;

let runner = (async (count, times) => {
    console.log(`> 脚本响应`);
    var startTime = new Date().getTime()
    var network = new BackpropNetwork({
        inputNodes: 4,
        hiddenNodes: 4,
        outputNodes: 1,
        createAllConnections: true,
        inputData: [[1, 1], [1, 0], [0, 1], [0, 0]],
        targetData: [[1], [0], [0], [1]],
        learningRate: 1
    });
    var endTime = new Date().getTime();
    console.log('> 模型初始化完成,耗时:',(endTime-startTime),'ms ,训练次数为：' + (count * times));

    var startTime = new Date().getTime()
    console.log('< 开始训练...');
    for (let c = 0; c < times; c++) {
        for (var i = 0; i < count; i++) {
            network.backpropagate();
        }
        console.log('< 训练运行中,当前训练次数：' + (c));
    }
    var endTime = new Date().getTime()
    console.log('> 训练完成,耗时 ' + (endTime - startTime) + ' ms')
    console.log('> 模型输出节点1：', network.getNode("OUTPUT", 0).value);
})(count, times)


