var CommandList = new Class({
	Extends: Command,
	_commands: [],
	_count: 0,
	_intervalId:null,
	initialize: function(commands) {
		this._commands = commands ? commands.slice() : [];
		this._count = 0;
	},
	addCommand: function(com) {
		this._commands.push(com);
	},
	execute:function(){
		//console.log('execute');
	},
});