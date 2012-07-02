var ParallelList = new Class({
	Extends: CommandList,
	initialize: function(commands) {
		this.parent(commands);
	},
	execute: function() {
		var len = this._commands.length;
		this._count = 0;
		for(var i=0; i<len; i++){
			this._commands[i].addEvent('command_complete', function() {
				if (++this._count >= len) {
					this.dispatchComplete();
				}
			}.bind(this))
			this._commands[i].execute();
		}
	},
});