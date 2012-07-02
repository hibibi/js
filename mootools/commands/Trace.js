var Trace = new Class({
	Extends: Command,
	_params: [],
	initialize: function(params) {
		this._params = params;
	},
	execute: function() {
		console.log(this._params);
		this.dispatchComplete();
	}
});