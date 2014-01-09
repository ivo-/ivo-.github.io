/**
*
 * *****************************
 * THIS IS NOT THE OFFICIAL SOFTWARE VERSION DO NOT USE
 * DOWNLOAD OFFICIAL WERSION FROM SITE
 * 
 * Версията на софтуера е мнодифицирана специално за работата
 * на текущия проект. Не използвайте тази версия, а свалете официалнта
 * от сайта на адрес | http://spritely.net/ |
 * 
 * CONTRIBUTOR: ivcho92@gmail.com
 * *****************************
 *
*/

/*
 * jQuery spritely 0.2.1
 * http://spritely.net/
 *
 * Documentation:
 * http://spritely.net/documentation/
 *
 * Copyright 2010, Peter Chater, Artlogic Media Ltd, http://www.artlogic.net/
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Change history:
 * Version 0.2.1
 *   - animate function will stop cycling after play_frames has completed
 * Version 0.2
 *   - added isDraggable method (requires jquery-ui) $('#sprite').sprite().isDraggable({start: null, stop: function() {alert('Ouch! You dropped me!')});
 *   - sprites may be set to play a limited number of frames when instantiated, e.g. $('#sprite').sprite({fps: 9, no_of_frames: 3, play_frames: 30})
 *   - sprite speed may be controlled at any point by setting the frames-per-second $('#sprite').fps(20);
 *   - sprites with multiple rows of frames may have there 'state' changed, e.g. to make the second row of frames
 *     active, use: $('#sprite').spState(2); - to return to the first row, use $('#sprite').spState(1);
 *   - background element speed may be controlled at any point with .spSpeed(), e.g. $('#bg1').spSpeed(10)
 *   - background elements may be set to a depth where 100 is the viewer (up close) and 0 is the horizon, e.g.:
 *     $('#bg1').pan({fps: 30, speed: 2, dir: 'left', depth: 30});
 *     $('#bg2').pan({fps: 30, speed: 3, dir: 'left', depth: 70});
 *     relative speed of backgrounds may now be set in a single action with $('#bg1, #bg2').spRelSpeed(20);
 *     which will make elements closer to the horizon (lower depths) move slower than closer elements (higher depths)
 */
(function($) {
	$._spritely = {
		// shared methods and variables used by spritely plugin
		animate: function(options) {
			var el = $(options.el);
			var el_id = el.attr('id');
			options = $.extend(options, $._spritely.instances[el_id] || {});
			if (options.play_frames && !$._spritely.instances[el_id]['remaining_frames']) {
				$._spritely.instances[el_id]['remaining_frames'] = options.play_frames + 1;
			}
			if (options.type == 'sprite' && options.fps) {
				var frames;
				var animate = function(el) {
					var w = options.width, h = options.height;
					if (!frames) {
						frames = [];
						total = 0
						for (var i = 0; i < options.no_of_frames; i ++) {
							frames[frames.length] = (0 - total);
							total += w;
						}
					}
					if ($._spritely.instances[el_id]['current_frame'] >= frames.length - 1) {
						$._spritely.instances[el_id]['current_frame'] = 0;
					} else {
						$._spritely.instances[el_id]['current_frame'] = $._spritely.instances[el_id]['current_frame'] + 1;
					}
					var yPos = $._spritely.getBgY(el);
					el.css('background-position', frames[$._spritely.instances[el_id]['current_frame']] + 'px ' + yPos);
					if (options.bounce && options.bounce[0] > 0 && options.bounce[1] > 0) {
						var ud = options.bounce[0]; // up-down
						var lr = options.bounce[1]; // left-right
						var ms = options.bounce[2]; // milliseconds
						el
							.animate({top: '+=' + ud + 'px', left: '-=' + lr + 'px'}, ms)
							.animate({top: '-=' + ud + 'px', left: '+=' + lr + 'px'}, ms);
					}
				}
				if ($._spritely.instances[el_id]['remaining_frames'] && $._spritely.instances[el_id]['remaining_frames'] > 0) {
					$._spritely.instances[el_id]['remaining_frames'] --;
					if ($._spritely.instances[el_id]['remaining_frames'] == 0) {
						$._spritely.instances[el_id]['remaining_frames'] = -1;
						delete $._spritely.instances[el_id]['remaining_frames'];
						return;
					} else {
						animate(el);
					}
				} else if ($._spritely.instances[el_id]['remaining_frames'] != -1) {
					animate(el);
				}
			} else if (options.type == 'pan') {
				if (!$._spritely.instances[el_id]['_stopped']) {
					if (options.dir == 'left') {
						if( options.minLeft && $._spritely.instances[el_id]['l'] <= options.minLeft )
							$._spritely.instances[el_id]['l'] = options.startLeft;
						else $._spritely.instances[el_id]['l'] = ($._spritely.instances[el_id]['l'] - (options.speed || 1)) || 0;
					} else {
						if( options.maxLeft && $._spritely.instances[el_id]['l'] >= options.maxLeft )
							$._spritely.instances[el_id]['l'] = options.startLeft;
						else $._spritely.instances[el_id]['l'] = ($._spritely.instances[el_id]['l'] + (options.speed || 1)) || 0;
					}
					
					var bp_top = $._spritely.getBgY(el);
					$(el).css('background-position', $._spritely.instances[el_id]['l'] + 'px ' + bp_top);
				}
			}
			$._spritely.instances[el_id]['options'] = options;
			window.setTimeout(function() {
				$._spritely.animate(options);
			}, parseInt(1000 / options.fps));
		},
		randomIntBetween: function(lower, higher) {
			return parseInt(rand_no = Math.floor((higher - (lower - 1)) * Math.random()) + lower);
		},
		getBgY: function(el) {
			if ($.browser.msie) {
				// fixme - the background-position property does not work
				// correctly in IE so we have to hack it here... Not ideal
				// especially as $.browser is depricated
				var bgY = $(el).css('background-position-y') || '0';
			} else {
				var bgY = ($(el).css('background-position') || ' ').split(' ')[1];
			}
			return bgY;
		},
		getBgX: function(el) {
			if ($.browser.msie) {
				// see note, above
				var bgX = $(el).css('background-position-x') || '0';
			} else {
				var bgX = ($(el).css('background-position') || ' ').split(' ')[0];
			}
			return bgX;
		}
	};
	$.fn.extend({
		spritely: function(options) {
			var options = $.extend({
				type: 'sprite',
				do_once: false,
				width: null,
				height: null,
				fps: 12,
				no_of_frames: 2,
				stop_after: null
			}, options || {});
			var el_id = $(this).attr('id');
			if (!$._spritely.instances) {
				$._spritely.instances = {};
			}
			if (!$._spritely.instances[el_id]) {
				$._spritely.instances[el_id] = {current_frame: -1};
			}
			
			if( options.startPos )
				$._spritely.instances[el_id]['l'] = options.startPos;
			
			$._spritely.instances[el_id]['type'] = options.type;
			$._spritely.instances[el_id]['depth'] = options.depth;
			options.el = this;
			options.width = options.width || $(this).width() || 100;
			options.height = options.height || $(this).height() || 100;
			var get_rate = function() {
                return parseInt(1000 / options.fps);
            }
            if (!options.do_once) {
				window.setTimeout(function() {
					$._spritely.animate(options);
				}, get_rate(options.fps));
			} else {
				$._spritely.animate(options);
			}
			return this; // so we can chain events
		},
		sprite: function(options) {
			var options = $.extend({
				type: 'sprite',
				bounce: [0, 0, 1000] // up-down, left-right, milliseconds
			}, options || {});
			return $(this).spritely(options);
		},
		pan: function(options) {
			var options = $.extend({
				type: 'pan',
				dir: 'left',
				continuous: true,
				speed: 1 // 1 pixel per frame
			}, options || {});
			return $(this).spritely(options);
		},
		flyToTap: function(options) {
			var options = $.extend({
				el_to_move: null,
				type: 'moveToTap',
				ms: 1000, // milliseconds
				do_once: true
			}, options || {});
			if (options.el_to_move) {
				$(options.el_to_move).active();
			}
			if ($._spritely.activeSprite) {
				if (window.Touch) { // iphone method see http://cubiq.org/remove-onclick-delay-on-webkit-for-iphone/9 or http://www.nimblekit.com/tutorials.html for clues...
					$(this)[0].ontouchstart = function(e) {
						var el_to_move = $._spritely.activeSprite;
						var touch = e.touches[0];
						var t = touch.pageY - (el_to_move.height() / 2);
						var l = touch.pageX - (el_to_move.width() / 2);
						el_to_move.animate({
							top: t + 'px',
							left: l + 'px'
						}, 1000);
					};
				} else {
					$(this).click(function(e) {
						var el_to_move = $._spritely.activeSprite;
						$(el_to_move).stop(true);
						var w = el_to_move.width();
						var h = el_to_move.height();
						var l = e.pageX - (w / 2);
						var t = e.pageY - (h / 2);
						el_to_move.animate({
							top: t + 'px',
							left: l + 'px'
						}, 1000);
					});
				}
			}
			return this;
		},
		isDraggable: function(options) {
			if (!$(this).draggable) {
				alert('To use the isDraggable method you need to load jquery-ui.js');
				return this;
			}
			var options = $.extend({
				type: 'isDraggable',
				start: null,
				stop: null,
				drag: null
			}, options || {});
			var el_id = $(this).attr('id');
			$._spritely.instances[el_id].isDraggableOptions = options;
			$(this).draggable({
				start: function() {
					var el_id = $(this).attr('id');
					$._spritely.instances[el_id].stop_random = true;
					$(this).stop(true);
					if ($._spritely.instances[el_id].isDraggableOptions.start) {
						$._spritely.instances[el_id].isDraggableOptions.start(this);
					}
				},
				drag: options.drag,
				stop: function() {
					var el_id = $(this).attr('id');
					$._spritely.instances[el_id].stop_random = false;
					if ($._spritely.instances[el_id].isDraggableOptions.stop) {
						$._spritely.instances[el_id].isDraggableOptions.stop(this);
					}
				}
			});
			return this;
		},
		active: function() {
			// the active sprite
			$._spritely.activeSprite = this;
			return this;
		},
		activeOnClick: function() {
			// make this the active script if clicked...
			var el = $(this);
			if (window.Touch) { // iphone method see http://cubiq.org/remove-onclick-delay-on-webkit-for-iphone/9 or http://www.nimblekit.com/tutorials.html for clues...
				el[0].ontouchstart = function(e) {
					$._spritely.activeSprite = el;
				};
			} else {
				el.click(function(e) {
					$._spritely.activeSprite = el;
				});
			}
			return this;
		},
		spRandom: function(options) {
			var options = $.extend({
				top: 50,
				left: 50,
				right: 290,
				bottom: 320,
				speed: 4000,
				pause: 0
			}, options || {});
			var el_id = $(this).attr('id');
			if (!$._spritely.instances[el_id].stop_random) {
				var elm = $('#' + el_id);
				var r = $._spritely.randomIntBetween;
				var t = r(options.top, options.bottom);
				var l = r(options.left, options.right);
				
				var opts = {
					top: t + 'px', 
					left: l + 'px'
				};
				
				if( options.deltaSpeed ) options.speed = Math.max(
					Math.abs( parseFloat( elm.css('top')  ) - t ),
					Math.abs( parseFloat( elm.css('left') ) - l )
				) * options.deltaSpeed;
				
				if( options.stopSprite )
					elm.spStop();
				
				elm.animate(opts, options.speed, options.stopSprite && function(){ elm.spStart(); });
			}
			
			this.spRandomTimer = window.setTimeout(function() {
				$('#' + el_id).spRandom(options);
			}, options.speed + options.pause);
			
			return this;
		},
		stopRandom: function(){
			var el_id = $(this).attr('id');
			
			if ($._spritely.instances[el_id])
				$._spritely.instances[el_id].stop_random = true;
			
			return this;
		},
		startRandom: function(){
			var el_id = $(this).attr('id');
			
			if ($._spritely.instances[el_id])
				$._spritely.instances[el_id].stop_random = false;
			
			return this;
		},
		makeAbsolute: function() {
			// remove an element from its current position in the DOM and
			// position it absolutely, appended to the body tag.
			return this.each(function() {
				var el = $(this);
				var pos = el.position();
				el.css({position: "absolute", marginLeft: 0, marginTop: 0, top: pos.top, left: pos.left })
					.remove()
					.appendTo("body");
			});
		
		},
		spSet: function(prop_name, prop_value) {
			var el_id = $(this).attr('id');
			$._spritely.instances[el_id][prop_name] = prop_value;
			return this;
		},
		spGet: function(prop_name, prop_value) {
			var el_id = $(this).attr('id');
			return $._spritely.instances[el_id][prop_name];
		},
		spStop: function(bool) {
			$(this).each(function() {
				var el_id = $(this).attr('id');
				$._spritely.instances[el_id]['_last_fps'] = $(this).spGet('fps');
				$._spritely.instances[el_id]['_stopped'] = true;
				$._spritely.instances[el_id]['_stopped_f1'] = bool;
				if ($._spritely.instances[el_id]['type'] == 'sprite') {
					$(this).spSet('fps', 0);
				}
				if (bool) {
					// set background image position to 0
					var bp_top = $._spritely.getBgY($(this));
					$(this).css('background-position', '0 ' + bp_top);
				}
			});
			return this;		
		},
		spStart: function() {
			$(this).each(function() {
				var el_id = $(this).attr('id');
				var fps = $._spritely.instances[el_id]['_last_fps'] || 12;
				$._spritely.instances[el_id]['_stopped'] = false;
				if ($._spritely.instances[el_id]['type'] == 'sprite') {
					$(this).spSet('fps', fps);
				}
			});
			return this;		
		},
		spToggle: function() {
			var el_id = $(this).attr('id');
			var stopped = $._spritely.instances[el_id]['_stopped'] || false;
			var stopped_f1 = $._spritely.instances[el_id]['_stopped_f1'] || false;
			if (stopped) {
				$(this).spStart();
			} else {
				$(this).spStop(stopped_f1);
			}
			return this;		
		},
		fps: function(fps) {
			$(this).each(function() {
				$(this).spSet('fps', fps);
			});
			return this;
		},
		spSpeed: function(speed) {
			$(this).each(function() {
				$(this).spSet('speed', speed);
			});
			return this;
		},
		spRelSpeed: function(speed) {
			$(this).each(function() {
				var rel_depth = $(this).spGet('depth') / 100;
				$(this).spSet('speed', speed * rel_depth);
			});
			return this;
		},
		spChangeDir: function(dir) {
			$(this).each(function() {
				$(this).spSet('dir', dir);
			});
			return this;
		},
		spState: function(n) {
			$(this).each(function() {
				// change state of a sprite, where state is the vertical
				// position of the background image (e.g. frames row)
				var yPos = ((n - 1) * $(this).height()) + 'px';
				var xPos = $._spritely.getBgX($(this));
				var bp = xPos + ' -' + yPos;
				$(this).css('background-position', bp);
			});
			return this;
		}
	})
})(jQuery);
// Stop IE6 re-loading background images continuously
try {
  document.execCommand("BackgroundImageCache", false, true);
} catch(err) {} 