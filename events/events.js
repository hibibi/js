var Event = function() {
	this.target;
	this.context;
};
var EventDispatcher = function() {
	this.listeners = {};
};
EventDispatcher.prototype.addEventListener = function(type,handler,context){
	var listen = this.listeners;
	if(!listen[type]){
		listen[type] = [];
	}
	listen[type].push({handler:handler,context:context || this});
	//console.log(this,arguments.callee.prototype.constructor);
};
EventDispatcher.prototype.removeEventListener = function(type,handler){
	var listen = this.listeners;
	if(listen[type]){
		for(var i=0; i<listen[type].length; i++){
			var obj = listen[type][i];
			if(obj['handler'] == handler){
				listen[type].splice(i,1);
			}
		}
	}
}
EventDispatcher.prototype.dispatchEvent = function(type,context){
	var listen = this.listeners;
	var e = new Event();
	e.target = this;
	if(this.listeners[type]){
		for(var i=0; i<listen[type].length; i++){
			var obj = listen[type][i];
			e.context = obj['context'];
			if(e.context == this){
				obj['handler'](e);
			}
		}
	}
}