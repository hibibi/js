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

var Func = new Class({
	Extends: Command,
	_func: null,
	_params: [],
	_dispatcher: null,
	_eventType: null,
	initialize: function(func, params, dispatcher, eventType) {
		this._func = func;
		this._params = params.slice();
		this._dispatcher = dispatcher;
		this._eventType = eventType;
	},
	execute: function() {
		this._func.apply(null, this._params);
		if (this._dispatcher != null) {
			this._dispatcher.addEvent(this._eventType, function() {
				this.complete();
			}.bind(this));
		} else {
			this.complete();
		}
	},
	complete: function() {
		this.dispatchComplete();
	}
});

var Listen = new Class({
	Extends:Command,
	_dispatcher:null,
	_eventType:null,
	initialize:function(dispather,eventType){
		this._dispathcer = dispather;
		this._eventType = eventType;
	},
	execute:function(){
		this._dispatcher.addEvent(this._eventType,function(){
			this.dispatchComplete();
		}.bind(this));
	}
})

var DoFxMorph = new Class({
	Extends:Command,
	_morph:null,
	_target:null,
	_duration:null,
	_transition:Fx.Transitions.Quad.easeOut,
	_options:{},
	initialize:function(target,duration,transition,options){
		this._morph = new Fx.Morph(target,{transition:transition,duration:duration}); 
		this._options = options;
	},
	execute:function(){
		this._morph.addEvent('complete',function(){
			this.dispatchComplete();
		}.bind(this));
		this._morph.start(this._options);
	}
});

var DoTimeLineLite = new Class({
	Extends:Command,
	_timeline:null,
	_options:null,
	initialize:function(options){
		this._timeline = new TimelineLite(options);
		this._timeline.eventCallback('onComplete',function(){
			this.dispatchComplete();
		})
		this._timeline.pause();
	},
	append:function(tween){
		this._timeline.append(tween);
	},
	insert:function(tween){
		this._timeline.insert(tween);
	}
});

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
	},
});

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
