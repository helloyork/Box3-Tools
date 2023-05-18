/**
 * EasyController 是由萌新大佬开发的一款便于管理文件，代码的便捷工具
 * 此工具完全开源，免费试用，共所有人学习与参考
 * 建议单独设立文件使用，并首个require
 * @author 萌新大佬 <https://box3.codemao.cn/u/mxdlorzorz>
 * @version 1.0.0
 */

//init

const assetTypes ={
    'js':'代码',
    'image':'图片',
    'lut':'滤镜',
    'snow':'雪花纹样',
    'mesh':'模型',
    'sound':'音乐/音效',
    'directory':'文件夹',
};
!function init(){
    console.clear();
    console.log('EasyController加载中...');
    console.log(`检测到EasyController存储位置:[${__dirname||'.'}/${__filename}]`);
    console.log('[EasyController]整理文件中...');
    console.log('[EasyController]文件：');
    /**
     * @param {Box3AssetListEntry[]} asts
     */
    function dir(asts,deep){
        for(const ast of asts){
            var log='';
            for(let i=1;i<=deep;i++)log+='····';
            console.log(`${log}[${assetTypes[ast.type]}]${ast.path.split('/').pop()}`);
            if(ast.type==Box3AssetType.DIRECTORY)dir(resources.ls(ast.path),deep+1);
        }
    }
    dir(resources.ls('.'),1);
}();

//tools
function getFileName(){
    try{
        throw Error();
    }catch(err){
        return err.stack.split('\n').
        find(x=>x.includes('eval')).slice(13).split(':')[0];
    }
}
function getLine(){
    try{
        throw Error();
    }catch(err){
        return err.stack.split('\n').
        find(x=>x.includes('eval')).slice(13).split(':')[1];
    }
}

//logger

class Logger{
    /**
     * 为每个文件建立独立对话框
     * @param {boolean?} showLine 是否显示输出的行数，默认为false
     * @param {boolean?} showTime 是否显示输出的时间，默认为false
     */
    constructor(showLine,showTime){
        this.filename=getFileName();
        this.showLine=showLine||false;
        this.showTime=showTime||false;
        this.log(`[logger] ${this.filename}logger加载完毕`);
    }
    get preLog(){
        var log='';
        var d=new Date();
        if(this.showTime)log+=`[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`;
        log+='['+this.filename;
        if(this.showLine)log+=':'+getLine();
        return log+']';
    }
    log(...args){
        return console.log(this.preLog,...args);
    }
    warn(...args){
        return console.warn(this.preLog,...args);
    }
    error(...args){
        return console.error(this.preLog,...args);
    }
    clear(){
        console.clear();
        console.log(`clear at ${this.preLog}`);
    }
}

//exports

module.exports={    
    Logger,
}