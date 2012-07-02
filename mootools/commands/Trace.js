var Trace = new Class({
	Extends: Command,
	_params: [],
	initialize: function(params) {
		this._params = params;
	},
	execute: function() {
		//console.log(this._params);
		if (!('console' in window)) {
			window.console = {};
			window.console.log = function(this._params){
				return this._params;
			};
		}
		this.dispatchComplete();
	}
});