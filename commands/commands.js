/**
 * 新しいCommandインスタンスを作成します。
 * @class Commandのコアクラス
 * @param {Object} scope Functionのスコープです。
 * @param {Function} func コマンドで起動するfunctionです。
 * @param {Array} params functionの引数です。
 */
var Command = function(scope, func, params) {
    _scope = scope;
    _func = func;
    _params = params.slice();
    _self = this;
};
Command.prototype = new EventDispatcher();
Command.prototype.execute = function() {
    _func.apply(_scope, _params);
};
Command.prototype.dispatchComplate = function() {
    this.dispatcheEvent('command_complete');
};
/**
 * 新しいWaitコマンドを作成します。
 * @param {Number} delay ミリ秒で指定します。
 */
var Wait = function(delay) {
    _delay = delay;
    _self = this;
};
Wait.prototype = new Command();
Wait.prototype.execute = function() {
    setTimeout(function() {
        _self.dispatchComplete();
    }, delay);
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
    _scope = scope;
    _func = func;
    _params = params.slice();
    _dispathcer = dispatcher;
    _eventType = _eventType;
};
Func.prototype = new Command();
Func.prototype.execute = function() {
    if (_dispatcher != null) {
        _dispatcher.addEvent(_eventType, function() {
            _self.dispatchComplete();
        });
    } else {
        _func.apply(_scope, _params);
        _self.dispatchComplete();
    }
};
/**
 * 新しいListenコマンドを作成します。
 * param {Object} dispatcher
 * param {String} eventType
 **/
var Listen = function(disptcher, eventType) {
    _dispatcher = dispatcher;
    _eventtype = eventType;
    _self = this;
};
Listen.prototype = new Command();
Listen.prptotype.execute = function() {
    _dispatcher.addEvent(_eventType, function() {
        _self.dispatchComplete();
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
    _angle = angle ? angle : 'to';
    _target = target;
    _time = time;
    _options = options;
    _self = this;
};
DoTweenLite.prototype = new Command();
DoTweenLite.prototype.execute = function() {
    var t = TweenLite[_angle](_target, _time, _options);
    t.eventCallback('onComplete', function() {
        _self.dispatchComplete();
    });
};
/**
 * 新しいCommandListを作成します。
 * param {Array} commands
 **/
var CommandList = function(commands) {
    _commands = commands.slice();
    _count = 0;
};
CommandList.prototype = new Command();
CommandList.prototype.addCommand = function(command) {
    _commands.push(command);
};
CommandList.prototype.execute = function() {

};
/**
 * 新しいSerialListコマンドを作成します。
 * param {Array} param commands
 **/
var SerialList = function(commands) {
    this.constructor(commands);
    _currentCommand = null;
};
SerialList.prototype = new CommandList();
SerialList.prototype.execute = function() {
    if (_count >= _commands.length) {
        _self._dispatchComplete();
    } else {
        _currentCommand = _commands[_count];
        _currentCommand.addEventListener('command_complete', function() {
            _count++;
            _self.execute();
        });
        _currentCommand.execute();
    }
};
SerialList.prototype.getCurrentCommand = function(){
    return _currentCommand;
}
/**
 * 新しいParallelListコマンドを作成します。
 * param {Array} param commands
 **/
var ParallelList = function() {
    this.constructor(commands);
};
ParallelList.prototype = new CommandList();
ParallelList.prototype.execute = function(){
    var len = _commands.length;
    _count = 0;
    for(var i=0; i<len; i++){
        _commands[i].addEventListener('command_complete',function(){
            if(++_count >= len){
                _self.dispatchComplete();
            }
        });
        _commands[i].execute();
    }
};
/**
 * 新しいTraceコマンドを作成します。
 * @param {Array} params
**/
var Trace = function(params){
    _params = params.slice();
};
Trace.prototype = new Command();
Trace.prototype.execute = function(){
    console.log(_params);
    _self.dispatchComplete();
};​