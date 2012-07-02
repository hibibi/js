var DoTweenLite = new Class({
	Extends: Command,
	_angle: 'to',
	_target: null,
	_time: 0,
	_options: {},
	initialize: function(angle, target, time, options) {
		this._angle = angle ? angle : this._angle;
		this._target = target;
		this._time = time;
		this._options = options;
	},
	execute: function() {
		var t = TweenLite[this._angle](this._target, this._time, this._options);
		t.eventCallback('onComplete', function() {
			this.dispatchComplete();
		}.bind(this));
	}
});