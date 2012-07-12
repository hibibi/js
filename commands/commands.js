/**
 * 新しいCommandインスタンスを作成します。
 * @class Commandのコアクラス
 * @param {Object} scope Functionのスコープです。
 * @param {Function} func コマンドで起動するfunctionです。
 * @param {Array} params functionの引数です。
 */
var Command = function(scope, func, params) {
    this.scope = scope;
    this.func = func;
    this.params = params ? params.slice() : [];
};
Command.prototype = new EventDispatcher();
Command.prototype.execute = function() {
    this.func.apply(this.scope, this.params);
    this.dispatchComplete();
};
Command.prototype.dispatchComplete = function() {
    this.dispatchEvent('command_complete');
};
/**
 * 新しいWaitコマンドを作成します。
 * @param {Number} delay ミリ秒で指定します。
 */
var Wait = function(delay) {
    this.delay = delay;
};
Wait.prototype = new Command();
Wait.prototype.execute = function() {
    var home = this;
    setTimeout(function() {
        home.dispatchComplete();
    }, this.delay);
};
/**
 * 新しいFuncコマンドを作成します
 * @param {Object} scope
 * @param {Function} func
 * @param {Array} params
 * @param {Object} dispatcher
 * @param {String} eventType
 **/
var Func = function(scope, func, params, dispatcher, eventType) {
    this.scope = scope;
    this.func = func;
    this.params = params ? params.slice() : params;
    this.dispatcher = dispatcher;
    this.eventType = eventType;
};
Func.prototype = new Command();
Func.prototype.execute = function() {
	var home = this;
    if (this.dispatcher != null) {
        this.dispatcher.addEventListener(this.eventType, function() {
            home.dispatchComplete();
        });
        this.func.apply(this.scope, this.params);
    } else {
    console.log('nodis')
        this.func.apply(this.scope, this.params);
        this.dispatchComplete();
    }
};
/**
 * 新しいListenコマンドを作成します。
 * param {Object} dispatcher
 * param {String} eventType
 **/
var Listen = function(dispatcher, eventType) {
    this.dispatcher = dispatcher;
    this.eventType = eventType;
};
Listen.prototype = new Command();
Listen.prototype.execute = function() {
    var home = this;
    console.log(this.dispatcher)
    this.dispatcher.addEventListener(this.eventType, function() {
        home.dispatchComplete();
    });
};
/**
 * 新しいDoTweenLiteコマンドを作成します。（要：TweenLite）
 * param {String} angle
 * param {Object} target
 * param {Number} time
 * param {Object} options
 **/
var DoTweenLite = function(angle, target, time, options) {
    this.angle = angle ? angle : 'to';
    this.target = target;
    this.time = time;
    this.options = options;
};
DoTweenLite.prototype = new Command();
DoTweenLite.prototype.execute = function() {
	var home = this;
    var t = TweenLite[this.angle](this.target, this.time, this.options);
    t.eventCallback('onComplete', function() {
        home.dispatchComplete();
    });
};
/**
 * 新しいCommandListを作成します。
 * param {Array} commands
 **/
var CommandList = function(commands) {
    this.commands = commands ? commands.slice() : [];
    this.count = 0;
};
CommandList.prototype = new Command();
CommandList.prototype.addCommand = function() {
	if(arguments){
    	for(var i=0; i<arguments.length; i++){
    		this.commands.push(arguments[i]);
    	}
    }
};
CommandList.prototype.execute = function() {

};
/**
 * 新しいSerialListコマンドを作成します。
 * param {Array} param commands
 **/
var SerialList = function(commands) {
	
    this.commands = commands ? commands.slice() : [];
    this.currentCommand = null;
};
SerialList.prototype = new CommandList();
SerialList.prototype.execute = function() {
	var home = this;
    if (this.count >= this.commands.length) {
        this.dispatchComplete();
    } else {
        this.currentCommand = this.commands[this.count];
        this.currentCommand.addEventListener('command_complete', function() {
            home.count++;
            home.execute();
        });
        this.currentCommand.execute();
    }
};
/**
 * 新しいParallelListコマンドを作成します。
 * param {Array} param commands
 **/
var ParallelList = function(commands) {
	this.commands = commands ? commands.slice() : [];
    //this.constructor(commands);
};
ParallelList.prototype = new CommandList();
ParallelList.prototype.execute = function(){
    var len = this.commands.length;
    this.count = 0;
    var home = this;
    for(var i=0; i<len; i++){
        this.commands[i].addEventListener('command_complete',function(){
            if(++home.count >= len){
                home.dispatchComplete();
            }
        });
        this.commands[i].execute();
    }
};
/**
 * 新しいTraceコマンドを作成します。
 * @param {Array} params
**/
var Trace = function(){
	this.params = [];
    if(arguments){
    	for(var i=0; i<arguments.length; i++){
    		this.params.push(arguments[i]);
    	}
    }
};
Trace.prototype = new Command();
Trace.prototype.execute = function(){
    console.log(this.params);
    this.dispatchComplete();
}