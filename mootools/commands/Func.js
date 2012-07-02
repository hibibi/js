var Func = new Class({
	Extends: Command,
	_scope:null,
	_func: null,
	_params: [],
	_dispatcher: null,
	_eventType: null,
	initialize: function(scope, func, params, dispatcher, eventType) {
		this._scope = scope;
		this._func = func;
		this._params = params.slice();
		this._dispatcher = dispatcher;
		this._eventType = eventType;
	},
	execute: function() {
		if (this._dispatcher != null) {
			this._dispatcher.addEvent(this._eventType, function() {
				this.dispatchComplete();
			}.bind(this));
			this._func.apply(this._scope, this._params);
		} else {
			this._func.apply(this._scope, this._params);
			this.dispatchComplete();
		}
	}
});