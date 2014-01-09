/**
  * jQuery Underline Plugin
  *
  * Autor: Ivailo Hristov
*/

/*
	jQuery( selector ).underline( options ); 
		=> ( underline / remove underline )
	
	options.distance => space between underline and element
	options.clipLeft => underline clip from left
	options.clipRight => underline clip from right
	
	options.easing => animation easing
	options.duration => animation duration
	
	jQuery.fn.underline.setDefaults( options )
		=> set your default options
*/

(function( $ ){
	var DEFAULT_DISTANCE = 0;
	var DEFAULT_CLIP_LEFT = 0;
	var DEFAULT_CLIP_RIGHT = 0;
	
	var DEFAULT_EASING = "swing";
	var DEFAULT_DURATION = 200;
	
	var undefined;
	
	var UNDERLINE = $("<hr style='" +
		[
			"display: block",
			"margin: 0px",
			"padding: 0px",
			"position: absolute",
			"bottom: auto",
			"right: auto",
			"background: transparent",
			"border: none", 
			"border-bottom: solid 1px black",
			"clip: auto",
			"height: auto",
			"width: auto",
			"min-height: none",
			"max-height: none",
			"min-width: none",
			"max-width: none",
			"z-index: 681"
		].join(";")
	+ "' />");
	
	$.fn.underline = function( opts ){
		( opts = opts || {} ).underline = UNDERLINE.clone( false );
		
		if( opts.style ) opts.underline[0].style.borderBottomStyle = opts.style;
		if( opts.color ) opts.underline[0].style.borderBottomColor = opts.color;
		if( opts.width ) opts.underline[0].style.borderBottomWidth = opts.width;
		
		opts.distance = opts.distance || DEFAULT_DISTANCE;
		opts.clipRight = opts.clipRight || DEFAULT_CLIP_RIGHT;
		opts.clipLeft = opts.clipLeft || DEFAULT_CLIP_LEFT;
		
		opts.easing = opts.easing || DEFAULT_EASING;
		opts.duration = opts.duration || DEFAULT_DURATION;
		
		return this.each(function(i){
			var elm = $( this ), cache;
			
			if( cache = elm.data( "underline" ) ) {
				cache.animate( {width: "0px"}, opts.duration, opts.easing, function(){
					cache.remove();
				});
				
				elm.removeData( "underline" );
			} else {
				var offset = elm.offset(), underline = opts.underline.clone( false );
				
				elm.data( "underline", underline );
				
				underline.css({
					top: offset.top + elm.outerHeight() + opts.distance +"px",
					left: offset.left + opts.clipLeft + "px",
					width: "0px"
				}).appendTo( document.body ).animate( {width: elm.outerWidth() - opts.clipLeft - opts.clipRight + "px"}, opts.duration, opts.easing );
			}
		});
	};
	
	$.fn.underline.setDefaults = function( opts ){
		if( !opts ) 			return;
		
		if( opts.distance !== undefined ) 	DEFAULT_DISTANCE = opts.distance;
		if( opts.clipLeft !== undefined ) 	DEFAULT_CLIP_LEFT = opts.clipLeft;
		if( opts.clipRight !== undefined )	DEFAULT_CLIP_RIGHT = opts.clipRight;
		
		if( opts.easing !== undefined ) 	DEFAULT_EASING = opts.easing;
		if( opts.duration !== undefined ) 	DEFAULT_DURATION = opts.duration;
	};
})( jQuery );