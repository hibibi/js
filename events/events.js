var Event = function() {
	this.target;
	this.context;
};
var EventDispatcher = function() {
	_listeners = {};
	_self = this;
};
EventDispatcher.prototype.addEventListener = function(type,handler,context){
	if(!_listeners[type]){
		_listeners[type] = [];
	}
	listeners[type].push({handler:handler,context:context});
};
EventDispatcher.prototype.removeEventListener = function(type,handler){
	if(_listeners[type]){
		for(var i=0; i<_listeners[type].length; i++){
			var obj = _listener[type][i];
			if(obj['handler'] == handler){
				_listener[type].splice(i,1);
			}
		}
	}
}
EventDispatcher.prototype.dispatchEvent = function(type){
	var e = new Event();
	e.target = this;
	for(var i=0; i<_listeners[type].length; i++){
		var obj = _listeners[type][i];
		e.context = obj['context'];
		obj['handler'](e);
	}
}