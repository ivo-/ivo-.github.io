/*!
 *| VOIDSTUDIO.EU BALLOON SHOW
 *|
 *| ALL OF THE JAVASCRIPT MAGIC IS HERE
 *|
 *| COPYRIGHT (C) 2010 VOIDSTUDIO
 */
 
//$ DEBUG OPTION:
//$
//$ Не изпълнявай анимации
//$
jQuery.fx.off = false;
//$

//$ За представяне на стойностите на фомрмите като JavaScript обект
$.fn.getFormValues = function(){
    var obj = {};

    $.each( $(this).serialize().split('&'), function( i, value ){
        obj[ decodeURIComponent((value = value.split('='))[0]) ] = decodeURIComponent(value[1]);
    });

    return obj;
};

//$ За зареждане на картинки
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

//$ Връща боря на собствените свойства и методи на обект
$.keysLength = function( object ){
	var length = 0;
	
	for( var property in object )
		if( object.hasOwnProperty( property ) )
			length++;
    
	return length;
};

// Copyright (c) 2005-2007 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
jQuery.easing.spring = function( x, t, b, c, d ){
	var pos = t/d;
	return c*(1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6))) + b; 
};

$(function( e, tmp ){
	//$ 
	//$ Константи за работа на скрипта
	//$ Редактирайте свободно само тази част кода
	//$
	
	//$ Минимални размери на страницата
	var PAGE_MIN_WIDTH = 1024;
	var PAGE_MIN_HEIGHT = 1000;
	
	//$ Праметри за главните четири балона
	var BALLOON_WIDTH = 119;
	var BALLOON_HEIGHT = 154;
	
	//$ Позициите за подреждане на балоните,
	//$ изчислени спрямо минималната резолюция
	var BALLOON_FIX_TOP = 50;
	var BALLOON_FIX_LEFT = 125;
	
	var BALLOON_DISTANCE_VERTICAL = 338;
	var BALLOON_DISTANCE_HORIZONTAL = 640;
	
	//$ Параметри за контейнерите със съдржанието
	var CONTENT_PADDING_X = 100;
	var CONTENT_PADDING_Y = 100;
	
	//$ Параметри за движението на главните четири балона
	var BALLOONS_MOVEMENT_VERTICAL_OFFSET = 150;
	var BALLOONS_MOVEMENT_HORIZONTAL_OFFSET = 100;
	
	var BALLOONS_MOVEMENT_HORIZONTAL_AREA = 300;
	
	var BALLOONS_MOVEMENT_DELTA_SPEED = 35;
	var BALLOONS_MOVEMENT_PAUSE = 5000;
	
	var BALLOONS_MOVEMENT_FRAMES = 8;
	var BALLOONS_MOVEMENT_FPS = 10;
	
	//$ За да не застъпват footer-а
	var BALLOONS_MIN_BOTTOM = 351;
	
	//$ За самолетчето
	var PLANE_WIDTH = 38;
	
	//$ За състезанието с балони	
	var RACE_MIN_SPEED = 1300;
	var RACE_MAX_SPEED = 2700;
	
	var RACE_MIN_PARTS = 3;
	var RACE_MAX_PARTS = 6;
	
	var RACE_START_LEFT = 40;
	
	//$ За сайта и инфорамцията
	var SITE_SHOW_DURATION = 1800;
	var PAGES_FADE_EFFECT_SPEED = 600;
	
	//$ Запазва основните елементи
	var WINDOW = $( window );
	var DOCUMENT = $( document );
	var BODY = $( document.body );
	
	//$ Размери на прозореца в момента на зареждането
	var WINDOW_WIDTH = WINDOW.width();
	var WINDOW_HEIGHT = WINDOW.height();
	
	//$ Запазва основните елементи
	//$
	//$ Елементите на самолетчето
	var PLANE = $( '#planeTrack' );
	var FADE = $( '#fade' );
	
	//$ Елементите на прелоадъра
	var LOADER = $( '#loader' );
	var PERCENT = $( 'i', LOADER[0] );
	
	//$ Главните балони
	var BALLOONS = [];
	var BALLOON_LOGO = $( '#balloonLogo' );
	
	//$ Меню и съдържание
	var MAIN_MENU = $( '#mainMenu' );
	var HIDE_MENU = $( '#hideMenu' );
	var SHOW_MENU = $( '#showMenu' );
	var CONTENT = $( '#content' );
	
	var PAGE_CONTENT = $( '#pageContent' );
	var START_MENU = $( '#startMenu' );
	
	//$ Страниците и менюто за страниците
	var PAGES = $( 'div.pageContent[id!=startMenu]', PAGE_CONTENT[0] );
	var PAGES_BUTTONS = $( 'a.pageButton', START_MENU );
	var HIDE_PAGE_BUTTON = $( 'a.hideButton', PAGE_CONTENT[0] );
	
	//$ Носещия балон
	var BEARING_BALLOON = $( '#bearingBalloon' );
	
	var SITE_ON = $( '#site-on' );
	var SITE_OFF = $( '#site-off' );
	
	//$ Известяване на резултата от състезанието
	var RACE_RESULT = $( '#raceResult' );
	
	//$ Елементи от footer-а
	var SUN = $( '#sun' );
	var FOOTER = $( '#footer' );
	var FOOTER_LOGO = $( '#footerLogo' );
	
	//$
	//$ Всчики операции се извършват от кода надолу
	//$ Не е препоръчително да редактирате кода надолу
	//$
	
	//$ Пуснат ли е сайта и текуща страница
	var SITE = true, currentPage;
	
	//$ Не позволява ширината на страницата да е по-малка от минималната
	if( WINDOW_WIDTH < PAGE_MIN_WIDTH )
		CONTENT.css( 'width', PAGE_MIN_WIDTH + 'px' );
	
	//$ Не позволява височината на страницата да е по-малка от минималната
	if( WINDOW_HEIGHT < PAGE_MIN_HEIGHT )
		CONTENT.css( 'height', PAGE_MIN_HEIGHT + 'px' );
	
	//$ Текущите размери на страницата
	var CURRENT_PAGE_WIDTH = parseFloat( CONTENT.css( 'width' ) );
	var CURRENT_PAGE_HEIGHT = parseFloat( CONTENT.css( 'height' ) );
	
	//$ Отколнение от ляво, спрямо минималната резолюция
	var OFFSET_LEFT = 0;
	
	if( CURRENT_PAGE_WIDTH > PAGE_MIN_WIDTH )
		BALLOON_FIX_LEFT += (OFFSET_LEFT = (CURRENT_PAGE_WIDTH - PAGE_MIN_WIDTH)/2);
	
	//$ Добавя функционалностите на главното меню
	//$
	
	var siteToggleRun = false;
	
	//$ Показване на сайта
	SITE_ON.click(function(e){
		if( siteToggleRun || SITE )
			return;
		siteToggleRun = true;
		
		//$ Променя менюто
		SITE = true;
		SITE_OFF.mouseout();
		
		balloonsOrder(function(){
			BALLOON_LOGO.stop(true).animate({ left: -1*BALLOON_WIDTH + 'px' }, 1000, function(){
				//$ Спира активността на скрития балон
				BALLOON_LOGO.spStop().stopRandom();
				
				PAGE_CONTENT.show();
				
				//$ Показва сайта
				PAGE_CONTENT.delay( 1000 ).animate({
					left: BALLOON_FIX_LEFT + BALLOON_WIDTH + 'px'
				}, {
					duration: SITE_SHOW_DURATION,
					easing: 'easeOutSine',
					complete: function(){
						//$ Показва менюто
						START_MENU.css('display', 'block').animate( { opacity: '1' }, PAGES_FADE_EFFECT_SPEED, function(){
							siteToggleRun = false;
						});
					}
				});
			});
		});
	});
	
	//$ Скриване на сайта
	SITE_OFF.click(function(e){
		if( siteToggleRun || !SITE )
			return;
		siteToggleRun = true;
		
		//$ Променя главното меню
		SITE = false;
		SITE_ON.mouseout();
		
		//$ Скрива менюто на сайта
		( currentPage || START_MENU ).animate( { opacity: '0' }, PAGES_FADE_EFFECT_SPEED, function(){
			//$ Скрива сайта
			PAGE_CONTENT.animate({
				left: BALLOON_WIDTH - BALLOON_DISTANCE_HORIZONTAL + 'px'
			}, {
				duration: SITE_SHOW_DURATION, 
				easing: 'easeInSine',
					complete: function() {
						PAGE_CONTENT.hide();
						
						//$ Връща режима към шоу с балони
						balloonsChaotic();
						BALLOON_LOGO.spStart().startRandom();
						
						siteToggleRun = false;
					}
			});
		});
	});
	
	//$ Ефекти за елементите от менюто
	//$
	//$ CSS свойства за съдържанието на страницата
	//$
	PAGE_CONTENT.css({
		top: BALLOON_FIX_TOP + BALLOON_HEIGHT + 50 + 'px',
		left: BALLOON_WIDTH - BALLOON_DISTANCE_HORIZONTAL + 'px',
		width: BALLOON_DISTANCE_HORIZONTAL - BALLOON_WIDTH + 'px',
		height: BALLOON_DISTANCE_VERTICAL + 'px'
	});
	
	//$ Какво ли не правим за да е валиден css-а
	START_MENU.css( 'opacity', '0' );
	PAGES.css( 'display', 'none' );
	
	//$ Показване на странците при клик
	PAGES_BUTTONS.each( function( i ){
		//$ Номерирва елементите
		$( this ).data( 'num', i );
		$( PAGES[i] ).data( 'num', i );
	}).click( function( e ){
		//$ Запазва текущата страница
		currentPage = $( PAGES[ $(this).data('num') ] );
		
		//$ Скрива менюто
		START_MENU.animate( { opacity: '0' }, PAGES_FADE_EFFECT_SPEED, function(){
			START_MENU.css('display', 'none');
			
			//$ Показва текущата страница
			currentPage.css({
				'display': 'block',
				'opacity': '0'
			}).animate( { opacity: '1' }, PAGES_FADE_EFFECT_SPEED );
		});
		
		return false;
	});
	
	//$ Скриване на страниците
	HIDE_PAGE_BUTTON.click(function(e){
		//$ Скрива текущата страница
		currentPage.animate( { opacity: '0' }, PAGES_FADE_EFFECT_SPEED, function(){
			currentPage.css('display', 'none');
			currentPage = false;
			
			//$ Показва менюто
			START_MENU.css('display', 'block').animate( { opacity: '1' }, PAGES_FADE_EFFECT_SPEED );
		});
		
		return false;
	});
	
	//$ Започва състезанието между два балона
	//$
	//$ Разделя разстоянието на произволен брой равни части и 
	//$ анимира балоните за всяка част с призволна сорост. Печели този
	//$ балон, който изпълни всички анимицаии първи
	//$
	$('#race').click(function(e){
		if( SITE ) return;
		
		//$ Изчислява частите и помяната
		var parts = $._spritely.randomIntBetween( RACE_MIN_PARTS, RACE_MAX_PARTS );
		var update = '+=' + Math.round((CURRENT_PAGE_WIDTH - RACE_START_LEFT - BALLOON_WIDTH)/parts) + 'px';
		
		//$ Връща балоните в начална позиция
		BALLOONS[0].stop(true).animate({
			top: BALLOONS[0].fix.top + 'px',
			left: RACE_START_LEFT + 'px'
		}, 900 );
		
		BALLOONS[1].stop(true).animate({
			top: BALLOONS[1].fix.top + 'px',
			left: RACE_START_LEFT + 'px'
		}, 900 );
		
		var p1=parts;
		function b1(){
			if( ! --p1 ){
				BALLOONS[1].stop(true);
				RACE_RESULT.css(
					'backgroundImage', 'url("img/win1.png")'
				).animate(
					{ top: '200px' }, 600, 'swing', function(){
						setTimeout( function(){
							RACE_RESULT.animate( { top: '-299px' }, 600, 'swing' )
						}, 5000 );
					}
				);
			}
		}
		
		var p2=parts;
		function b2(){
			if( ! --p2 ){
				BALLOONS[0].stop(true);
				RACE_RESULT.css(
					'backgroundImage', 'url("img/win2.png")'
				).animate(
					{ top: '200px' }, 600, 'swing', function(){
						setTimeout( function(){
							RACE_RESULT.animate( { top: '-299px' }, 600, 'swing' )
						}, 5000 );
					}
				);
			}
		}
			
		//$ Започва състезанието
		for( var i=0; i<parts; i++ ){
			BALLOONS[0].animate({
				left: update
			}, $._spritely.randomIntBetween( RACE_MIN_SPEED, RACE_MAX_SPEED ), 'linear', b1 );
			
			BALLOONS[1].animate({
				left: update
			}, $._spritely.randomIntBetween( RACE_MIN_SPEED, RACE_MAX_SPEED ), 'linear', b2 );
		}
	});
	
	//$ Скрива менюто
	HIDE_MENU.click(function(e){
		MAIN_MENU.animate({ top: -1*MAIN_MENU.outerHeight() + 'px' }, 500, 'swing', function(){
			SHOW_MENU.animate({ top: '0px' }, 200, 'swing' )
		});
	});
	
	SHOW_MENU.click(function(e){
		SHOW_MENU.animate({ top: '-14px' }, 200, 'swing', function(){
			MAIN_MENU.animate({ top: '0px' }, 500, 'swing' )
		});
	});
	
	//$ Съдържа всички картинки, които трябва да бъдат заредени
	//$ След зареждането на всяка от картинките тя се добавя, където трябва
	var IMAGES = {
		"img/Sun.png": function( img ){
			SUN.css({
				'backgroundImage': "url('" + img + "')",
				'left': 780 + OFFSET_LEFT + 'px'
			});
		},
		"img/VoidFooter.gif": function( img ){
			//$ NOTE: fix за минималната резолюция
			FOOTER_LOGO.attr( 'src', img ).css( 'left', 270 + (CURRENT_PAGE_WIDTH <= 1024 ? 120 : 0) + OFFSET_LEFT + 'px' );
		},
		"img/clouds/cloud1.png": function( img ){
			$( '#cloud1' ).css({
				'backgroundImage': 'url("' + img + '")',
				'width': '100%',
				'height': '232px'
			});
		},
		"img/clouds/cloud2.png": function( img ){
			$( '#cloud2' ).css({
				'backgroundImage': 'url("' + img + '")',
				'width': '385px',
				'height': '252px'
			});
		},
		"img/clouds/cloud4.png": function( img ){
			$( '#cloud4' ).css({
				'backgroundImage': 'url("' + img + '")',
				'width': '100%',
				'height': '245px'
			});
		},
		"img/clouds/cloud5.png": function( img ){
			$( '#cloud5' ).css({
				'backgroundImage': 'url("' + img + '")',
				'width': '144px',
				'height': '134px'
			});
		},
		"img/clouds/cloud6.png": function( img ){
			$( '#cloud6' ).css({
				'backgroundImage': 'url("' + img + '")',
				'width': '390px',
				'height': '217px'
			});
		},
		"img/clouds/cloud7.png": function( img ){
			$( '#cloud7' ).css({
				'backgroundImage': 'url("' + img + '")',
				'height': '441px'
			});
		},
		"img/clouds/cloud8.png": function( img ){
			$( '#cloud8' ).css({
				'backgroundImage': 'url("' + img + '")',
				'width': '540px',
				'height': '384px'
			});
		},
		"img/clouds/cloud9.png": function( img ){
			$( '#cloud9' ).css({
				'backgroundImage': 'url("' + img + '")',
				'width': '100%', //336px
				'height': '201px'
			});
		},
		"img/clouds/cloud10.png": function( img ){
			$( '#cloud10' ).css({
				'backgroundImage': 'url("' + img + '")',
				'width': '100%',//304px
				'height': '178px'
			});
		},
		"img/clouds/cloud11.png": function( img ){
			$( '#cloud11' ).css({
				'backgroundImage': 'url("' + img + '")',
				'width': '195px',
				'height': '114px'
			});
		},
		
		
		
		"img/balloon1.png": function( img ){
			BALLOONS[0] = $( '#balloon1' ).css({
				'backgroundImage': 'url("' + img + '")',
				
				'width': BALLOON_WIDTH + 'px',
				'height': BALLOON_HEIGHT + 'px',
				
				'top': BALLOON_FIX_TOP + 'px',
				'left': BALLOON_FIX_LEFT + 'px'
			});
		},
		"img/balloon2.png": function( img ){
			BALLOONS[1] = $( '#balloon2' ).css({
				'backgroundImage': 'url("' + img + '")',
				
				'width': BALLOON_WIDTH + 'px',
				'height': BALLOON_HEIGHT + 'px',
				
				'top': BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL + 'px',
				'left': BALLOON_FIX_LEFT + 'px'
			});
		},
		"img/balloon3.png": function( img ){
			BALLOONS[2] = $( '#balloon3' ).css({
				'backgroundImage': 'url("' + img + '")',
				
				'width': BALLOON_WIDTH + 'px',
				'height': BALLOON_HEIGHT + 'px',
				
				'top': BALLOON_FIX_TOP + 'px',
				'left': BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL + 'px'
			});
		},
		"img/balloon4.png": function( img ){
			BALLOONS[3] = $( '#balloon4' ).css({
				'backgroundImage': 'url("' + img + '")',
				
				'width': BALLOON_WIDTH + 'px',
				'height': BALLOON_HEIGHT + 'px',
				
				'top': BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL + 'px',
				'left': BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL + 'px'
			});
		},
		"img/balloonLogo.png": function( img ){
			BALLOON_LOGO.css({
				'backgroundImage': 'url("' + img + '")',
				
				'width': BALLOON_WIDTH + 'px',
				'height': BALLOON_HEIGHT + 'px',
				
				//$ NOTE: балона се зарежда на произволна позиция по небето
				'top': $._spritely.randomIntBetween( BALLOON_HEIGHT, CURRENT_PAGE_HEIGHT - BALLOON_HEIGHT - 351 ) + 'px',
				'left': $._spritely.randomIntBetween( BALLOON_WIDTH, CURRENT_PAGE_WIDTH - BALLOON_WIDTH ) + 'px'
			});
		},
		
		
		"img/smallerBaloons/SmallBaloon1.png": function( img ){
			$( '#b1' ).css({
				'backgroundImage': 'url("' + img + '")'
			});
		},
		"img/smallerBaloons/SmallBaloon2.png": function( img ){
			$( '#b2' ).css({
				'backgroundImage': 'url("' + img + '")'
			});
		},
		"img/smallerBaloons/SmallBaloon3.png": function( img ){
			$( '#b3' ).css({
				'backgroundImage': 'url("' + img + '")'
			});
		},
		"img/smallerBaloons/SmallBaloon4.png": function( img ){
			$( '#b4' ).css({
				'backgroundImage': 'url("' + img + '")'
			});
		},
		"img/smallerBaloons/Small.png": function( img ){
			$( '#b5' ).css({
				'backgroundImage': 'url("' + img + '")'
			});
		},
		"img/smallerBaloons/Small2.png": function( img ){
			$( '#b6' ).css({
				'backgroundImage': 'url("' + img + '")'
			});
		},
		
		
		"img/smallerBaloons/contacts.png, img/smallerBaloons/contacts-hover.png, img/tooltip.png, img/contacts_tooltip.png": function( img ){
			var elm = $( '#bContacts' ).css({
				'backgroundImage': 'url("' + img[0] + '")'
			}).hover(function(e){
				elm[0].style.backgroundImage = 'url("' + img[1] + '")';
			}, function(e){
				elm[0].style.backgroundImage = 'url("' + img[0] + '")';
			}).click(function(e){
				tooltip.slideToggle();
			}), tooltip = $( '#bContacts_tooltip' ).css( 'background-image', 'url("' + img[2] + '")' );
			
			$( 'img', tooltip )[0].src = img[3];
		},
		"img/smallerBaloons/credits.png, img/smallerBaloons/credits-hover.png, img/tooltip2.png": function( img ){
			var elm = $( '#bCredits' ).css({
				'backgroundImage': 'url("' + img[0] + '")'
			}).hover(function(e){
				elm[0].style.backgroundImage = 'url("' + img[1] + '")';
			}, function(e){
				elm[0].style.backgroundImage = 'url("' + img[0] + '")';
			}).click(function(e){
				tooltip.slideToggle();
			}), tooltip = $( '#bCredits_tooltip' ).css( 'background-image', 'url("' + img[2] + '")' );
		},
		
		'img/Platno.png': function( img ){
			PAGE_CONTENT.css({
				'backgroundImage': 'url("' + img + '")'
			});
		},
		
		'img/BalloonSmaller.png': function( img ){
			BEARING_BALLOON.css({
				'backgroundImage': 'url("' + img + '")'
			});
		},
		
		'img/menu/menu_bg.png, img/menu/menu_left.png, img/menu/menu_right.png': function(img){
			$('#menu')[0].style.backgroundImage = "url('"+img[0]+"')";
			$('#menu_left')[0].style.backgroundImage = "url('"+img[1]+"')";
			$('#menu_right')[0].style.backgroundImage = "url('"+img[2]+"')";
		},
		'img/menu/mode_icon.png, img/menu/race_icon.png, img/menu/shapes_icon.png': function(img){
			$('#menu img[alt=mode_icon]')[0].src = img[0];
			$('#menu img[alt=race_icon]')[0].src = img[1];
			$('#menu img[alt=shapes_icon]')[0].src = img[2];
		},
		'img/menu/site.png, img/menu/site_hover.png': function( img ){
			SITE_ON.hover(
				function(){ SITE_ON.css( 'background-image', "url('"+img[1]+"')" ); },
				function(){ SITE_ON.css( 'background-image', "url('"+img[[SITE ? 1 : 0]]+"')" ); }
			).mouseout();
		},
		'img/menu/balloon_show.png, img/menu/balloon_show_hover.png': function( img ){
			SITE_OFF.hover(
				function(){ SITE_OFF.css( 'background-image', "url('"+img[1]+"')" ); },
				function(){ SITE_OFF.css( 'background-image', "url('"+img[SITE ? 0 : 1]+"')" ); }
			).mouseout();
		},
		'img/menu/race.png, img/menu/race_hover.png': function( img, elm ){
			(elm = $('#race')).hover(
				function(){ elm.css( 'background-image', "url('"+img[1]+"')" ); },
				function(){ elm.css( 'background-image', "url('"+img[0]+"')" ); }
			).mouseout();
		},
		'img/menu/logo.png': function( img ){
			$('#menu_logo')[0].src = img;
		},
		
		'img/about-h.png, img/about.png': function(img){
			$('#index_button').mouseover(function(e){
				this.style.backgroundImage = 'url("'+img[1]+'")';
			}).mouseout(function(e){
				this.style.backgroundImage = 'url("'+img[0]+'")';
			}).mouseout();
			
			$('#index p.pageTitle img')[0].src = img[1];
		},
		'img/services-h.png, img/services.png': function(img){
			$('#whatWeDo_button').mouseover(function(e){
				this.style.backgroundImage = 'url("'+img[1]+'")';
			}).mouseout(function(e){
				this.style.backgroundImage = 'url("'+img[0]+'")';
			}).mouseout();
			
			$('#whatWeDo p.pageTitle img')[0].src = img[1];
		},
		'img/portfolio-h.png, img/portfolio.png': function(img){
			$('#portfolio_button').mouseover(function(e){
				this.style.backgroundImage = 'url("'+img[1]+'")';
			}).mouseout(function(e){
				this.style.backgroundImage = 'url("'+img[0]+'")';
			}).mouseout();
			
			$('#portfolio p.pageTitle img')[0].src = img[1];
		},
		'img/contacts-h.png, img/contacts.png': function(img){
			$('#contacts_button').mouseover(function(e){
				this.style.backgroundImage = 'url("'+img[1]+'")';
			}).mouseout(function(e){
				this.style.backgroundImage = 'url("'+img[0]+'")';
			}).mouseout();
			
			$('#contacts p.pageTitle img')[0].src = img[1];
		},
		
		'img/content_bg.jpg': function(img){
			START_MENU.css('background-image', 'url("'+img+'")');
			PAGES.css('background-image', 'url("'+img+'")');
		},
		'img/bullet.png': function(img){
			$( 'img.img-bullet', PAGE_CONTENT ).attr( 'src', img );
		},
		
		'img/man.png, img/tools.png, img/rocket.png': function(img){
			$('#index img.graphic').each(function(i){
				this.src = img[i];
			});
		},
		
		'img/bottom_lines.png': function(img){
			$( 'img.img-bottomLines', PAGE_CONTENT ).attr( 'src', img );
		},
		
		'img/contact_info.png': function(img){
			$( '#contactsLeft img' ).attr( 'src', img );
		},
		
		'img/win1.png, img/win2.png': function(){},
		
		'img/menu/hide_menu.png, img/menu/hide_menu_h.png': function(img){
			HIDE_MENU.hover(function(e){
				HIDE_MENU.css( 'background-image', 'url("' + img[0] + '")' );
			}, function(e){
				HIDE_MENU.css( 'background-image', 'url("' + img[1] + '")' );
			}).mouseout();
		},
		'img/showMenu.png, img/showMenu-h.png': function(img){
			SHOW_MENU.hover(function(e){
				SHOW_MENU.css( 'background-image', 'url("' + img[1] + '")' );
			}, function(e){
				SHOW_MENU.css( 'background-image', 'url("' + img[0] + '")' );
			}).mouseout();
		}
	},
	
	//$ Картинките, които трябва да бъдат заредени първи,
	//$ защото участват в прелоадъра
	loaderImages = ['img/plane_track.png', 'img/plane.png', 'img/background.png'];
	
	//$ Форми, които могат да заемат балоните
	var FORMS = {
		triangle: {
			title: 'Триъгълник',
			positions: [
				[ BALLOON_FIX_TOP, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL/2 ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/2, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL/4 ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/2, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL*3/4],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL, BALLOON_FIX_LEFT ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL ]
			]
		},
		square: {
			title: 'Квадрат',
			positions: [
				[ BALLOON_FIX_TOP, BALLOON_FIX_LEFT ],
				[ BALLOON_FIX_TOP, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL, BALLOON_FIX_LEFT ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/2, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL/2 ]
			]
		},
		smile: {
			title: 'Усмивка',
			positions: [
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/6, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL*1/5 ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/4 + 40, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL*2/5 ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/4 + 60, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL*3/5 ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/4 + 40, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL*4/5 ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/6, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL*5/5 ]
			]
		},
		pentagon: {
			title: 'Петоъгълник',
			positions: [
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/3, BALLOON_FIX_LEFT ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/3, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL, BALLOON_FIX_LEFT  + BALLOON_DISTANCE_HORIZONTAL/5],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL*4/5 ],
				[ BALLOON_FIX_TOP, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL/2 ]
			]
		}, 
		line: {
			title: 'Линия',
			positions: [
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/2, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL*1/5 ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/2, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL*2/5 ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/2, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL*3/5 ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/2, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL*4/5 ],
				[ BALLOON_FIX_TOP + BALLOON_DISTANCE_VERTICAL/2, BALLOON_FIX_LEFT + BALLOON_DISTANCE_HORIZONTAL*5/5 ]
			]
		}
	};
	
	//$ Добавя типовете форми към менюто
	$.each( FORMS, function( i ){
		var form = $( '#form-' + i , MAIN_MENU ).click( function(e){
			if( !SITE ) goToPositions( FORMS[i].positions );
		});
		
		IMAGES['img/menu/'+i+'.png, img/menu/'+i+'-h.png'] = function( img ){
			form.mouseover(function(e){
				form.css( 'background-image', 'url("'+img[1]+'")' );
			}).mouseout(function(e){
				form.css( 'background-image', 'url("'+img[0]+'")' );
			}).mouseout();
		};
	});
	
	//$ Зарежа footer-а в зависимост от резолюцията
	var footerImg;
	
	if( CURRENT_PAGE_WIDTH < 1024 )
		footerImg = "img/footer/footer_w1024.png";
	else if( CURRENT_PAGE_WIDTH < 1280 )
		footerImg = "img/footer/footer_w1280.png";
	else if( CURRENT_PAGE_WIDTH < 1366 )
		footerImg = "img/footer/footer_w1366.png";
	else if( CURRENT_PAGE_WIDTH < 1440 )
		footerImg = "img/footer/footer_w1440.png";
	else if( CURRENT_PAGE_WIDTH < 1680 )
		footerImg = "img/footer/footer_w1680.png";
	else if( CURRENT_PAGE_WIDTH < 1920 )
		footerImg = "img/footer/footer_w1920.png";
		
	//$ Добавя картинката към списъка за презареждане
	IMAGES[ footerImg ] = function( img ){
		FOOTER.css({
			'backgroundImage': "url('" + img + "')"
		});
	};
	
	//$ Всичко останало се извършва след
	//$ зареждането на прелоаръра
	$.preload( loaderImages, function(){
		//$ Брой на картинките и брой на заредените картинки
		var length = $.keysLength( IMAGES ),
			finished = 0;
		
		//$ Как ще се update-ва loader-а при всяка картинка
		var update = 100/length;
		
		//$ Последната стойност
		var last = 0, l = 0, stopLoadImages = false;
		
		//$ Презарежда картинките
		$.each( IMAGES, function( url ){
			$.preload( url.split(","), function( imgs ){
				//$ Спира зареждането на картинките
				if( stopLoadImages ) return;
				
				//$ Изпълнява handler-а за картинката
				IMAGES[ url ]( imgs );
				IMAGES[ url ].executed = true;
				
				//$ Порменя loader-а
				PLANE.animate( { width: Math.ceil(last += update) + '%' }, 100, "linear", check );
			});
		});
		
		//$ За всеки случай...
		$(window).load(function(){
			stopLoadImages = true;
			
			PLANE.stop( true );
			
			$.each( IMAGES, function( url ){
				if( !this.executed )
					this( url.split(",") );
			});
			
			var f = finished, $last = finished*update;
			
			while( ++f <= length )
				PLANE.animate( { width: Math.ceil($last += update) + '%' }, 100, "linear", check );
		});
		
		//$ Извъщва проерка след всяка заредена картинка
		function check(){
			if( ++finished == length ){
				//$ Картинките са заредени на 100%
				PLANE.css( 'width', '100%' );
				PERCENT.html( 100 );
				
				//$ Стартира timeline-a
				timeline( false, function(){
					//$ Ефекти за главните четири балона
					$.each( BALLOONS, function( i ){
						//$ Дали се отнася за балон от дясно
						var right = !(i == 1 || i == 0);
						
						//$ Дали се отнася за балон от горе
						var top = (i%2) ? 1 : 0, t;
						
						//$ Започва сменяне на фреймовете на клатенето на балона
						(t = this).sprite({
							fps: BALLOONS_MOVEMENT_FPS,
							no_of_frames: BALLOONS_MOVEMENT_FRAMES
						}).isDraggable();
						
						//$ Запазва за всеки балон началната позиция
						this.fix = {
							top: BALLOON_FIX_TOP + ( top ? BALLOON_DISTANCE_VERTICAL : 0 ),
							left: BALLOON_FIX_LEFT + ( right ? BALLOON_DISTANCE_HORIZONTAL : 0 )
						};
						
						//$ След определен преиод от време балонът се измества
						//$ на (почти) произволно място в небето
						//$
						//$ NOTE: правя го с таймер, за да се избегне
						//$	едновременното движение на всички балони, 
						//$    което не може да се избегне напълно, но поне не се
						//$	движат през цялто времеме едновременно
						setTimeout( t.startSpRandom = function(){
							t.spRandom({
								top: -BALLOON_HEIGHT/2,
								left: t.fix.left - (right ? BALLOONS_MOVEMENT_HORIZONTAL_AREA : BALLOONS_MOVEMENT_HORIZONTAL_OFFSET),
								right: t.fix.left + (right ? BALLOONS_MOVEMENT_HORIZONTAL_OFFSET : BALLOONS_MOVEMENT_HORIZONTAL_AREA),
								bottom: CURRENT_PAGE_HEIGHT - BALLOON_HEIGHT - BALLOONS_MIN_BOTTOM,
								deltaSpeed: BALLOONS_MOVEMENT_DELTA_SPEED,
								pause: BALLOONS_MOVEMENT_PAUSE
							})
						}, BALLOONS_MOVEMENT_PAUSE / BALLOONS.length * i );
					});
					
					//$ За балона с логото
					BALLOON_LOGO.sprite({
						fps: BALLOONS_MOVEMENT_FPS,
						no_of_frames: BALLOONS_MOVEMENT_FRAMES
					}).isDraggable().spRandom({
						top: -BALLOON_HEIGHT/2,
						left: BALLOON_WIDTH,
						right: CURRENT_PAGE_WIDTH - BALLOON_WIDTH,
						bottom: CURRENT_PAGE_HEIGHT - BALLOON_HEIGHT - BALLOONS_MIN_BOTTOM,
						deltaSpeed: BALLOONS_MOVEMENT_DELTA_SPEED,
						pause: BALLOONS_MOVEMENT_PAUSE
					});
					
					//$ Ефект за самолетчето
					//$
					//$ Прелита за 50 секунди на всеки 10 секунди
					//$
					(function( c ){
						c = arguments.callee;
						
						PLANE
							.css({
								width: '0px',
								top: '600px',
								opacity: '',
								zIndex: '0',
								display: 'block'
							})
							.animate({ width: CURRENT_PAGE_WIDTH + PLANE_WIDTH + 'px' }, 50000, 'linear')
							.animate({ opacity: '0' }, 500, 'jswing', function(){
								setTimeout( c, 10000 );
							});
					})();
					
					//$ Зарежда сайта
					if( SITE ){
						SITE = false;
						SITE_ON.click();
					}
				});
			} else {
				//$ Променя заредените проценти от изображенията
				PERCENT.html( Math.ceil(l += update) );
			}
		}
	});
	
	//$ Формира timeline с всички анимации, 
	//$ които трябва да се извършат последователно
	function timeline( reverse, callback ){
		//$ Текуща анимация
		var motion = 0;
		
		//$ Списък на анимциите
		var motionList = [
			function(){ PLANE.animate({ 'width': CURRENT_PAGE_WIDTH + PLANE_WIDTH + "%" }, 200, "swing", next ); },
			function(){
				MAIN_MENU.css({
					'left': '50%',
					'marginLeft': '-' + MAIN_MENU.outerWidth()/2 + 'px'
				});
				
				
				next();
			},
			function(){ PLANE.animate({ 'opacity': "0" }, 300, "swing", next ); },
			function(){ LOADER.animate({ 'opacity': "0" }, 300, "swing", next ); },
			function(){
				PLANE.css( 'display', 'none' );
				LOADER.remove();
				next();
			},
			function(){
				$('#cloud10').pan({
					fps: 20, 
					speed: 1, 
					dir: 'left',
					startPos: CURRENT_PAGE_WIDTH - 304,
					minLeft: -304,
					startLeft: CURRENT_PAGE_WIDTH
				});
				$('#cloud9').pan({
					fps: 25,
					speed: 1,
					dir: 'left',
					startPos: 570,
					minLeft: -336,
					startLeft: CURRENT_PAGE_WIDTH
				});
				$('#cloud4').pan({
					fps: 20,
					speed: 1,
					dir: 'left',
					startPos: 70,
					minLeft: -605,
					startLeft: CURRENT_PAGE_WIDTH
				});
				
				next();
			},
			function(){ FADE.animate({ 'opacity': "0" }, 800, "swing", next ); },
			function(){ FADE.css( 'display', 'none' ); next(); }
		];
		
		//$ Трябва винаги да е функция
		callback = callback || function(){};
		
		if( reverse ){
			var firstMotion = motionList.length;
			motionList.unshift( callback );
		} else {
			var firstMotion = 0;
			motionList.push( callback );
		}
		
		//$ Изпълнява първата анимация
		motionList[ firstMotion ]();
		
		//$ Изпълнява следващата анимация
		function next(){
			motionList[ Math.abs( firstMotion - ++motion ) ]();
		}
	}
	
	//$ Подрежда балоните в квадрат
	function balloonsOrder(callback){
		var length = BALLOONS.length;
		
		$.each( BALLOONS, function( i ){
			var params = { top: this.fix.top + 'px' };
				params[ this.fix.left ? 'left' : 'right' ] = (this.fix.left || this.fix.right) + 'px';
			
			this.stopRandom().stop(true).animate( params, 700, 'jswing', function(){
				if( ! --length && callback )
					callback();
			});
		});
	}
	
	//$ Връща балоните отново в хаотичен ред
	function balloonsChaotic( callback ){
		$.each( BALLOONS, function( i ){
			this.startRandom();
		});
		
		if( callback ) callback();
	}
	
	//$ Анимира балоните до определни позиции
	//$
	//$ Иползва се за анимациите за заемане на различни форми
	//$
	function goToPositions( positions ){
		$.each( BALLOONS, function(i){
			//$ Анимира всеки един от четирите главни балона до
			//$ позицията, която е зададен за него в параметъра
			this.stop(true).animate({
				top: (i = positions[i])[0] + 'px',
				left: i[1] + 'px'
			}, 1000 );
		});
		
		//$ Ако участва и балона с логото
		if( positions[4] )
		
		//$ Анимира балона с логото
		BALLOON_LOGO.stop(true).animate({
			top: positions[4][0] + 'px',
			left: positions[4][1] + 'px'
		}, 1000 );
	}
	
	//$ При всеяко преоразмеряване на прозореца
	//$ страницата се презарежда
	$( window ).resize(function( e ){
		this.location.reload();
	});
});