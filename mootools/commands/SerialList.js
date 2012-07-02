var SerialList = new Class({
	Extends: CommandList,
	currentCommands: null,
	initialize: function(commands) {
		this.parent(commands);
	},
	execute: function() {
		if(!this._count){
			this.parent();
		}
		if (this._count >= this._commands.length) {
			this.dispatchComplete();
		} else {
			this.currentCommand = this._commands[this._count];
			this.currentCommand.addEvent('command_complete', function() {
				this._count++;
				this.execute();
			}.bind(this));
			this.currentCommand.execute();
		}
	}
});