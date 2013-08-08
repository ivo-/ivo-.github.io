/*
 * VOID STUDIO JAVASCRIPT
*/

// добавяне на съдържанието и ефекти 

$.preload = function( imgs, callback ){
	if( !$.isArray(imgs) )
		imgs = [ imgs ];
	
	var length = imgs.length;
	var loaded = 0;
	
	$.each( imgs, function( i, url ){
		( i = new Image() ).onload = function(e){
			this.onload = null;
			
			if( ++loaded == length )
				callback( imgs );
		};
		
		i.src = url;
	});
};

$.fn._extend = function(obj){
	for( var name in obj )
		this[ name ] = obj[ name ];
	
	return this;
};
// Copyright (c) 2005-2007 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
jQuery.easing.spring = function(x, t, b, c, d) {
	var pos = t/d;
	return c*(1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6))) + b; 
};

$(function(e){
	var tmp;
	
	//$ Създава нужните константи
	var DOCUMENT_HEIGHT = $(document).height();
	var DOCUMENT_WIDTH = $(document).width();
	
	var LOADER_WIDTH = 760;
	var LOADER_HEIGHT = 1;
	
	var PAPER_WIDTH = 365;
	var PAPER_HEIGHT = 190;
	
	var DOT_TOP = 47;
	var DOT_LEFT = 210;
	
	var BUTTON_WIDTH = 284;
	var SIDE_BUTTON_HEIGHT = 317;
	var MIDDLE_BUTTON_HEIGHT = 410;
	
	var BUTTON_CENTER_X = ( DOCUMENT_WIDTH - BUTTON_WIDTH ) / 2;
	var BUTTON_SPACE_X = 140;
	var BUTTON_PUSH_DISTANCE = 60;
	
	var BOX_HEIGHT = 270;
	var BOX_BORDER_HEIGHT = 9;
	
	var BUTTON_ICON_WIDTH = 80;
	var BUTTON_ICON_HEIGHT = 80;
	
	var LETTER_WIDTH = 17;
	var LETTER_HEIGHT = 21;
	var UNDERLINE_HEIGHT = 3;
	
	var FOOTER_HEIGHT = 30;
	
	var MIN_WIDTH = LOADER_WIDTH + 100;
	var MIN_HEIGHT = MIDDLE_BUTTON_HEIGHT + PAPER_HEIGHT + 2*FOOTER_HEIGHT;
	var MAX_HEIGHT = MIDDLE_BUTTON_HEIGHT + PAPER_HEIGHT + 5*FOOTER_HEIGHT;
	
	if( DOCUMENT_WIDTH < MIN_WIDTH )
		DOCUMENT_WIDTH = MIN_WIDTH;
	
	if( DOCUMENT_HEIGHT < MIN_HEIGHT )
		DOCUMENT_HEIGHT = MIN_HEIGHT;
	else if( DOCUMENT_HEIGHT > MAX_HEIGHT )
		DOCUMENT_HEIGHT = MAX_HEIGHT;
	
	/*@cc_on		
		//$ Изрязязва невидимата част от елементите.
		//$ за да се избегне припокриване (IE 6-7 z-index bug) 
		var CLIP = ["rect(auto ", (TMP = ( BUTTON_WIDTH - BUTTON_ICON_WIDTH ) / 2) + BUTTON_ICON_WIDTH, "px auto ", TMP + "px)"].join("");
		var IE6_7 = $.browser.version == 6 || $.browser.version == 7;
		
		if ( IE6_7 ) {
			document.getElementById('phone').style.clip = CLIP;
			document.getElementById('spanner').style.clip = CLIP;
			document.getElementById('mail').style.clip = CLIP;
		}
	@*/
	
	//$ Слой с хоризонталната линия
	var loader = $("#loader").css({
		top: (DOCUMENT_HEIGHT - LOADER_HEIGHT + PAPER_HEIGHT)/2 + "px",
		left: (DOCUMENT_WIDTH - LOADER_WIDTH)/2 + "px",
		width: "0px",
		height: LOADER_HEIGHT + "px"
	});
	
	//$ Слой с листчето и логото
	var bouncing, paper = $("#paper").css({
		top: -PAPER_HEIGHT + "px",
		left: (DOCUMENT_WIDTH - PAPER_WIDTH)/2 + "px",
		width: PAPER_WIDTH + "px",
		height: PAPER_HEIGHT + "px"
	});
	
	//$ Играещата точка
	var dot = $("#bouncingDot").css({
		position: "absolute",
		top: "-19px",
		left: DOT_LEFT + "px"
	});
	
	//$ Вместо ImageMap, очертава размерите
	//$ на логото приблизително точно
	$('<div style="width:245px;height:95px;position:absolute;top:35px;left:60px;cursor:pointer;z-index:7;"></div>')
		.mouseenter(function(e){
			if( !bouncing ){
				bouncing = true;
				
				dot.animate({ top: "-=30px" }, 300, "jswing")
				   .animate({ top: "+=30px" }, 800, "easeOutBounce", function(){ bouncing = false; } );
			}
		}).appendTo( paper[0] );
	
	//$ Слой съдържащ надписа "studio"
	var letters = $("div#letters")._extend({
		lettersList: $("div#letters div").each(function(i){
			this.style.top = 7 - i + "px";
			this.style.left = i*20 + "px";
			this.style.width = "0px";
			this.style.height = "0px";
		})._extend({
			letter: $("img.letter").css("top", UNDERLINE_HEIGHT + "px"),
			underline: $("img.underline")
		}).data( "playing", "finish" ).mouseenter(function(e){
			var imgs = this.getElementsByTagName("img"), $this = this, i = -2;
			
			if( $.data( this, "playing" ) !== "finish" )
				return;
			//$("#vs").html($.data( this, "playing" ));
			$.data( this, "playing", "rising" );
			
			$( imgs[0] ).animate({ top: -LETTER_HEIGHT + "px" }, 200, "jswing", function(){
				++i || $.data( $this, "playing", "top" );
			});
			$( imgs[1] ).animate({ bottom: LETTER_HEIGHT - UNDERLINE_HEIGHT + "px" }, 200, "jswing", function(){
				++i || $.data( $this, "playing", "top" );
			});
			
		}).mouseleave(function(e){
			var imgs = this.getElementsByTagName("img"), $this = this, i = -2;
			
			if( $.data( this, "playing" ) == "fall" || $.data( this, "playing" ) == "finish" )
				return;
			
			$.data( this, "playing", "fall" );
			
			/* Effect fall elstic */
			$( imgs[0] ).animate({ top: "3px" }, 400, "spring", function(){
				++i || $.data( $this, "playing", "finish" );
			});
			
			$( imgs[1] ).animate({ bottom: "0px" }, 400, "spring", function(){
				++i || $.data( $this, "playing", "finish" );
			});
		})
	}).css({
		width: "120px",
		height: "30px",
		top: "135px",
		left: ( DOCUMENT_WIDTH - 120 ) / 2 + 5.5 + "px"
	});
	
	//$ Слоеве с бутоните
	var buttons = { _list: ["phone", "spanner", "mail"] };

	$.each( buttons._list, function(i){
		//$ Средната черичка е най-дълга
		var buttonHeight = i == 1 ? MIDDLE_BUTTON_HEIGHT : SIDE_BUTTON_HEIGHT;
		var out, shown = false;
		
		var pushDuration = 200;
		var pushEasing = "jswing";
		
		( buttons[ this ] = $( "#" + this ) )._extend({
			IMG: $( "#" + this + " > img" ).css({
				top: -( ( DOCUMENT_HEIGHT - buttonHeight + PAPER_HEIGHT )/2 + BUTTON_ICON_HEIGHT ) + "px",
				left: ( BUTTON_WIDTH - BUTTON_ICON_WIDTH ) / 2 + "px",
				width: BUTTON_ICON_WIDTH + "px",
				height: BUTTON_ICON_HEIGHT + "px"
			})._extend({ 
				_topToGo: ( buttonHeight - BUTTON_ICON_HEIGHT ) / 2 + "px"
			}).mouseover(function(e){
				if( shown )
					return;
				
				if( i ) {
					if( i - 2 ) {
						buttons[ buttons._list[ i + 1 ] ].stop().animate({ left: BUTTON_CENTER_X + BUTTON_SPACE_X + BUTTON_PUSH_DISTANCE + "px" }, pushDuration, pushEasing );
						buttons[ buttons._list[ i - 1 ] ].stop().animate({ left: BUTTON_CENTER_X - BUTTON_SPACE_X - BUTTON_PUSH_DISTANCE + "px" }, pushDuration, pushEasing );
					} else {
						buttons[ buttons._list[ i - 1 ] ].stop().animate({ left: BUTTON_CENTER_X - BUTTON_PUSH_DISTANCE + "px" }, pushDuration, pushEasing );
						buttons[ buttons._list[ i - 2 ] ].stop().animate({ left: BUTTON_CENTER_X - BUTTON_SPACE_X - BUTTON_PUSH_DISTANCE + "px" }, pushDuration, pushEasing );
					}
				} else {
					buttons[ buttons._list[ i + 1 ] ].stop().animate({ left: BUTTON_CENTER_X + BUTTON_PUSH_DISTANCE + "px" }, pushDuration, pushEasing );
					buttons[ buttons._list[ i + 2 ] ].stop().animate({ left: BUTTON_CENTER_X + BUTTON_SPACE_X + BUTTON_PUSH_DISTANCE + "px" }, pushDuration, pushEasing );
				}
			}).mouseout(out = function(e){
				if( shown )
					return;
					
				if( i ) {
					if( i - 2 ) {
						buttons[ buttons._list[ i + 1 ] ].stop().animate({ left: BUTTON_CENTER_X + BUTTON_SPACE_X + "px" }, pushDuration, pushEasing );
						buttons[ buttons._list[ i - 1 ] ].stop().animate({ left: BUTTON_CENTER_X - BUTTON_SPACE_X + "px" }, pushDuration, pushEasing );
					} else {
						buttons[ buttons._list[ i - 1 ] ].stop().animate({ left: BUTTON_CENTER_X + "px" }, pushDuration, pushEasing );
						buttons[ buttons._list[ i - 2 ] ].stop().animate({ left: BUTTON_CENTER_X - BUTTON_SPACE_X + "px" }, pushDuration, pushEasing );
					}
				} else {
					buttons[ buttons._list[ i + 1 ] ].stop().animate({ left: BUTTON_CENTER_X + "px" }, pushDuration, pushEasing );
					buttons[ buttons._list[ i + 2 ] ].stop().animate({ left: BUTTON_CENTER_X + BUTTON_SPACE_X + "px" }, pushDuration, pushEasing );
				}
			}).click(function(e){
				if( shown )
					return;
				
				shown = true;
				
				//$ Преди анимацията добавя изрязаните части 
				/*@cc_on
					if ( IE6_7 ) this.parentNode.style.clip = "rect(auto auto auto auto)";
				@*/
				
				(tmp = buttons[ buttons._list[ i ] ]).IMG.animate({ top: "-=160" }, 500, "jswing");
				tmp.INFO.animate({ top: "-=160", height: BOX_HEIGHT + "px" }, 500, "jswing");
			}),
			INFO: $( "#" + this + " > div" ).css({
				top: buttonHeight/2 + "px",
				left: "0px",
				width: BUTTON_WIDTH + "px",
				height: "0px"
			})
		}).css({
			top: ( DOCUMENT_HEIGHT - buttonHeight + PAPER_HEIGHT )/2 + "px",
			left: -BUTTON_WIDTH + "px",
			width: BUTTON_WIDTH + "px",
			height: buttonHeight + "px"
		}).mouseleave(function(e){
			if( !shown )
				return;
				
			(tmp = buttons[ buttons._list[ i ] ]).IMG.animate({ top: "+=160" }, 500, "jswing");
			tmp.INFO.animate({ top: "+=160", height: "0px" }, 500, "jswing"
				//$ Отново орязва елемнта след скриването информацията
				/*@cc_on , function(){ if ( IE6_7 ) buttons[ buttons._list[ i ] ][0].style.clip = CLIP; } @*/);
			
			shown = false;
			out(e);
		});
	});
	
	//$ Фуутър елемента
	$("#footer").css({
		//$ Малко по-дълъг от loader-а
		width: LOADER_WIDTH + 40 + "px",
		height: FOOTER_HEIGHT + "px",
		//$ Центриране според новата ширина
		left: ( DOCUMENT_WIDTH - LOADER_WIDTH - 40 ) / 2 + "px",
		top: (tmp = ( DOCUMENT_HEIGHT + PAPER_HEIGHT + MIDDLE_BUTTON_HEIGHT - FOOTER_HEIGHT )/2) + (DOCUMENT_HEIGHT - tmp)/2 + "px"
	});
	
	$("#vs").mouseover(function(e){
		$( this ).underline();
	}).mouseout(function(e){
		$( this ).underline();
	});
	
	$("#cs").hover(function(e){
		$(this).underline();
	}, function(e){
		$(this).underline();
	});
	
	var IMAGES = {
		"img/paper.png": function(){
			paper[0].style.backgroundImage = "url('img/paper.png')";
		},
		"img/bouncingDot.png": function(){
			dot[0].src = "img/bouncingDot.png";
		},
		"img/boxMiddle.png": function(){
			buttons.phone.INFO[0].style.backgroundImage = "url('img/boxMiddle.png')";
			buttons.spanner.INFO[0].style.backgroundImage = "url('img/boxMiddle.png')";
			buttons.mail.INFO[0].style.backgroundImage = "url('img/boxMiddle.png')";
		},
		"img/boxTop.png": function(){
			$('img.boxTop').attr("src", "img/boxTop.png");
		},
		"img/boxBottom.png": function(){
			$('img.boxBottom').attr("src", "img/boxBottom.png");
		},
		"img/phone.png": function(){
			buttons.phone.IMG[0].src = "img/phone.png";
		},
		"img/spanner.png": function(){
			buttons.spanner.IMG[0].src = "img/spanner.png";
		},
		"img/mail.png": function(){
			buttons.mail.IMG[0].src = "img/mail.png";
		},
		"img/sideLine.png": function(){
			buttons.phone[0].style.backgroundImage = "url('img/sideLine.png')";
			buttons.mail[0].style.backgroundImage = "url('img/sideLine.png')";
		},
		"img/middleLine.png": function(){
			buttons.spanner[0].style.backgroundImage = "url('img/middleLine.png')";
		},
		"img/letters/S.png, img/letters/T.png, img/letters/U.png, img/letters/D.png, img/letters/I.png, img/letters/O.png": function( imgs ){
			letters.lettersList.letter.each( function(i){
				this.src = imgs[ i ];
			});
		},
		"img/letters/S_.png, img/letters/T_.png, img/letters/U_.png, img/letters/D_.png, img/letters/I_.png, img/letters/O_.png": function( imgs ){
			letters.lettersList.underline.each( function(i){
				this.src = imgs[ i ];
			});
		}
	}, loaderImage = "img/loader.png";
	
	//$ Поставя катинката за прелоадъра
	loader.css( "background-image", 'url("'+ loaderImage +'")' );
	
	//$ Всичко останало се извършва след
	//$ зареждането на прелоаръра
	$.preload( loaderImage, function(){
		var length = 12, finished = 0;
		var update = "+="+ LOADER_WIDTH/length +'px';
		
		$.each( IMAGES, function(url){
			$.preload( url.split(","), function( imgs ){
				IMAGES[ url ]( imgs );
				
				loader.animate({ width: update }, 200, "linear", check);
			});
		});
		
		function check(){
			if( ++finished == length ){
				$("#phone, #spanner, #mail, #paper, #letters").supersleight({ apply_positioning: false });
				$("#paper").supersleight({ apply_positioning: false, withoutChildren: true });
				timeline( false );
			}
		}
		
		function timeline( reverse, callback ){
			var motion = 0;
			var motionList = [
				function(){ buttons.phone.animate({ left: (centerX - spaceX) + "px" }, 800, "swing", motionList[ Math.abs( firstMotion - ++motion ) ] ); },
				function(){ buttons.spanner.animate({ left: centerX + "px" }, 800, "swing", motionList[ Math.abs( firstMotion - ++motion ) ] ); },
				function(){ buttons.mail.animate({ left: (centerX + spaceX) + "px" }, 800, "swing", motionList[ Math.abs( firstMotion - ++motion ) ] ); },
				
				function(){ buttons.phone.IMG.animate({ top: phoneTop }, 400, "swing", motionList[ Math.abs( firstMotion - ++motion ) ] ); },
				function(){ buttons.spanner.IMG.animate({ top: spannerTop }, 400, "swing", motionList[ Math.abs( firstMotion - ++motion ) ] ); },
				function(){ buttons.mail.IMG.animate({ top: mailTop }, 400, "swing", motionList[ Math.abs( firstMotion - ++motion ) ] ); },
				
				function(){ paper.animate( { top: (reverse ? -PAPER_HEIGHT + "px" : "0px") }, 700, "easeOutBounce", motionList[ Math.abs( firstMotion - ++motion ) ] ); }
			];
			
			letters.lettersList.each( function(i){
				motionList.push( function(){
					$(letters.lettersList[ i ]).animate({ width: LETTER_WIDTH + "px", height: UNDERLINE_HEIGHT + "px" }, 200, motionList[ Math.abs( firstMotion - ++motion ) ] );
				});
			}).each( function(i){
				motionList.push( function(){
					$(letters.lettersList[ i ]).animate({ height: LETTER_HEIGHT + "px" }, 200, motionList[ Math.abs( firstMotion - ++motion ) ] );
				});
			});
			
			motionList.push( function(){ 
				dot.animate( { top: (reverse ? "-19px" : DOT_TOP + "px") }, 800, "easeOutBounce", motionList[ Math.abs( firstMotion - ++motion ) ] );
			});
			
			var phoneTop = buttons.phone.IMG._topToGo;
				buttons.phone.IMG._topToGo = buttons.phone.IMG[0].style.top;
			var spannerTop = buttons.spanner.IMG._topToGo;
				buttons.spanner.IMG._topToGo = buttons.spanner.IMG[0].style.top;
			var mailTop = buttons.mail.IMG._topToGo;
				buttons.mail.IMG._topToGo = buttons.mail.IMG[0].style.top;
			
			if( reverse ){
				var centerX = -BUTTON_WIDTH;
				var spaceX = 0;
				var firstMotion = motionList.length;
				motionList.unshift( callback );
			} else {
				var centerX = BUTTON_CENTER_X;
				var spaceX = BUTTON_SPACE_X;
				var firstMotion = 0;
				motionList.push( callback );
			}
			
			motionList[ firstMotion ]();
		}
	});
	
	//$ При всеяко преоразмеряване на прозореца
	//$ страницата се презарежда
	$(window).resize(function(e){
		this.location.reload();
	});
});