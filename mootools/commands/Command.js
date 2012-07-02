var Command = new Class({
	Implements: [Events],
	_scope: null,
	_myfunc: null,
	_params: [],
	initialize: function(scope, func, params) {
		this._scope = scope;
		this._func = func;
		this._params = params.slice();
	},
	execute: function() {
		this._func.apply(this._scope, this._params);
		this.dispatchComplete();
	},
	dispatchComplete: function() {
		this.fireEvent('command_complete', [this], 0);
	},
	toString:'Object Command'
});
