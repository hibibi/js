var Listen = new Class({
	Extends:Command,
	_dispatcher:null,
	_eventType:null,
	initialize:function(dispatcher,eventType){
		this._dispatcher = dispatcher;
		this._eventType = eventType;
	},
	execute:function(){
		this._dispatcher.addEvent(this._eventType,function(){
			this.dispatchComplete();
		}.bind(this));
	}
});