/**
 * VERSION: beta 1.24
 * DATE: 2012-05-17
 * JavaScript
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * Copyright (c) 2008-2012, GreenSock. All rights reserved. 
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * corporate Club GreenSock members, the software agreement that was issued with the corporate 
 * membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue || (window._gsQueue = [])).push( function() {

	_gsDefine("plugins.ScrollToPlugin", ["plugins.TweenPlugin"], function(TweenPlugin) {
		
		var ScrollToPlugin = function(props, priority) {
				TweenPlugin.call(this, "scrollTo");
				this._overwriteProps.pop();
			},
			p = ScrollToPlugin.prototype = new TweenPlugin("scrollTo"),
			_getX = function() {
				return (window.pageXOffset != null) ? window.pageXOffset : (document.documentElement.scrollLeft != null) ? document.documentElement.scrollLeft : document.body.scrollLeft;
			}, 
			_getY = function() {
				return (window.pageYOffset != null) ? window.pageYOffset : (document.documentElement.scrollTop != null) ? document.documentElement.scrollTop : document.body.scrollTop;
			},
			_setRatio = TweenPlugin.prototype.setRatio; //speed optimization (quicker lookup)
		
		p.constructor = ScrollToPlugin;
		ScrollToPlugin.API = 2;
		
		p._onInitTween = function(target, value, tween) {
			this.x = _getX();
			this.y = _getY();
			if (value.x != null) {
				this._addTween(this, "x", this.x, value.x, "scrollTo_x", true);
			} else {
				this.skipX = true;
			}
			if (value.y != null) {
				this._addTween(this, "y", this.y, value.y, "scrollTo_y", true);
			} else {
				this.skipY = true;
			}
			return true;
		};
		
		p._kill = function(lookup) {
			if (lookup.scrollTo_x) {
				this.skipX = true;
			}
			if (lookup.scrollTo_x) {
				this.skipY = true;
			}
			return TweenPlugin.prototype._kill.call(this, lookup);
		}
		
		p.setRatio = function(v) {
			_setRatio.call(this, v);
			window.scrollTo((!this.skipX) ? this.x : _getX(), (!this.skipY) ? this.y : _getY());
		};
		
		TweenPlugin.activate([ScrollToPlugin]);
		
		return ScrollToPlugin;
		
	}, true);

}); if (window._gsDefine) { _gsQueue.pop()(); }