var Wait = new Class({
	Extends: Command,
	_delay: null,
	intervalId: null,
	initialize: function(delay) {
		this._delay = delay;
	},
	execute: function() {
		this.intervalId = setInterval(function() {
			clearInterval(this.intervalId);
			this.complete();
		}.bind(this), this._delay);
	},
	complete: function() {
		this.dispatchComplete();
	}
});