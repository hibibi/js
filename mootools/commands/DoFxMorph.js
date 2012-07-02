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