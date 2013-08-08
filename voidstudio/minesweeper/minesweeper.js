/**
*
* Minesweeper Game
*
* Author: ivcho92@gmail.com (voidstudio.eu)
* Design: hr.vladev@gmail.com (voidstudio.eu)
*
**/

// NOTE: 	с лаптоп под OPERA втория бутон не може да бъде уловен,
//		също под OPERA не може да бъде спряно контекстното меню.

(function(){	
	var DEFAULT_OPTS = {
		rows: 10,
		columns: 10,
		mines: 20
	};
	var CLASSES = {
		hover: "minesweeper_h",
		flag: "minesweeper_f",
		xflag: "minesweeper_xf",
		bomb: "minesweeper_b",
		"0": "minesweeper_0",
		"1": "minesweeper_1",
		"2": "minesweeper_2",
		"3": "minesweeper_3",
		"4": "minesweeper_4",
		"5": "minesweeper_5",
		"6": "minesweeper_6",
		"7": "minesweeper_7",
		"8": "minesweeper_8"
	};
	var MASSAGES = [
		"<p id='new_game'>Нова игра</p>",
		"<p id='new_game'>Съжалявам, мина отнесе главата ви,<br /> докато разчиствахте полето!</p>",
		"<p id='new_game'>Честито! Успешно разчистихте мините!</p>"
	];
	
	this.Minesweeper = function( opts ){
		opts = opts || {};
		
		var field = document.createElement("div");
		var rows = opts.rows || DEFAULT_OPTS.rows;
		var columns = opts.columns || DEFAULT_OPTS.columns;
		var mines = opts.mines || DEFAULT_OPTS.mines;
		var masgs = opts.masgs || MASSAGES;
		
		var reset = false;
		var flags = mines;
		var checked = 0;
		var timer = false;
		var winn = false;
		
		for( var j=1, str=""; j<=columns; j++ )
			str += "<td></td>";
		
		for( var i=1, html = "", td; i<=rows; i++ )
			html += "<tr>"+ str +"</tr>";
		
		field.className = "Minesweeper";
		field.innerHTML = "<p>Minesweeper a.k.a. Минички</p><center><h4 id='bombs'>20</h4><h4 id='smile'></h4><h4 id='time'>0</h4></center><div></div><table cellspacing='0' cellpadding='0'>"+ html +"</table>";
		
		var resetField = ( i = field.getElementsByTagName("h4") )[1];
			resetField.onclick = function( e ){ gameReset(); };
		var flagsField = i[0];
			setFlags( flags );
		var timerField = i[2];
		
		var cells = toArray( field.getElementsByTagName("td") );
		for( i=0, j=cells.length; i<j; i++ ){
			// Невероятно, но изравнява клетките по височина :P
			( td = cells[i] ).style.height = "0px"; 
			
			td.num = i;
			
			td.onmouseover = over;
			td.onmouseout = out;
			td.onmousedown = click;
			td.oncontextmenu = td.onclick = Flase;
		};
		
		var massage = field.getElementsByTagName("div")[0];
			massage.onclick = function( e ){
				gameReset();
				this.style.display = "none";
			};
			showMassage( masgs[0] );
		
		( opts.appendTo || document.body ).appendChild( field );
		
		return {
			remove: function(){
				field.parentNode.removeChild( field );
			}
		};
		
		function walk( elm, func ){
			/*
				0  _ _ _ 4		columns = 5;
				5  _ _ _  9		
				10 _ _ _ 14		if( num % columns ){ alert( 'елемента не е първи на реда си' ); }
				15 _ _ _ 19		if( (num+1) % columns ){ 	 alert( 'елемента не е последен на реда си' ); }
			*/
			var num = elm.num, notFirst = num%columns, notLast = (num + 1)%columns;
			
			if( notFirst ){
				if( (i = cells[ num - 1 ]) && i.around !== "x" ) func( i );
				if( (i = cells[ num - 1 + columns ]) && i.around !== "x" ) func( i );
				if( (i = cells[ num - 1 - columns ]) && i.around !== "x" ) func( i );
			} 
			
			if( notLast ) {
				if( (i = cells[ num + 1 ]) && i.around !== "x" ) func( i );
				if( (i = cells[ num + 1 + columns ]) && i.around !== "x" ) func( i );
				if( (i = cells[ num + 1 - columns ]) && i.around !== "x" ) func( i );
			}
			
			if( (i = cells[ num + columns ]) && i.around !== "x" ) func( i );
			if( (i = cells[ num - columns ]) && i.around !== "x" ) func( i );
		};
		
		function click( e ){
			if( !timer ){
				updateTimer();
				timer = setInterval( updateTimer, 1000 );
			}
			
			if ( !(e = e || window.event).which && e.button )
				e.which = (e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) ));
			
			if( e.which == 3 || e.which == 2 ){
				if( this.className == CLASSES.flag ){
					this.clicked = false;
					this.className = CLASSES.hover;
					setFlags( ++flags );
					checked -= 2;
				} else if( flags && !this.clicked ) {
					this.className = CLASSES.flag;
					this.clicked = true;
					setFlags( --flags );
				}
			} else if( this.clicked ){
				return false;
			} else if( CLASSES[ this.around ] ){
				this.clicked = true;
				
				this.className = CLASSES[ this.around ];
				
				if( this.around == 0 )
					walk( this, function( elm ){
						if( elm.around !== "x" )
							click.call( elm, { which: 1 } );
					});
			}else {
				this.className = CLASSES.bomb;
				this.clicked = true;
				
				if( reset )
					return false;
				
				reset = true;
				
				forEach( cells, function( i ){
					if( !this.clicked )
						click.call( this, { which: 1 } );
					else if( this.className == CLASSES.flag && this.around !== "x" )
						this.className = CLASSES.xflag;
				});
				
				reset = false;
				
				showMassage( masgs[1] );
				
				return false;
			}
			
			if( ++checked === cells.length ){
				winn = true;
				showMassage( masgs[2] );
			}
			
			return false;
		};

		function gameReset(){
			if( timer ){
				clearInterval( timer );
				timer = null;
			}
			
			checked = 0;
			winn = false;
			flags = setFlags( mines );
			timerField.innerHTML = 0;
			
			forEach( cells, function( i ){
				this.clicked = false;
				this.around = 0;
				this.className = "";
			});
			
			forEach( arrRandom( cells, mines ), function( i ){
				this.around = "x";
				
				walk( this, function( elm ){ elm.around +=1 } );
			});
		};
		
		function showMassage( msg ){
			if( timer ){
				clearInterval( timer );
				timer = null;
				
				if( opts.onFinish )
					opts.onFinish( winn, timerField.innerHTML*1 );
			}
			
			massage.innerHTML = msg;
			massage.style.display = "block";
		};
		
		function setFlags( num ){
			flagsField.innerHTML = num;
			
			return num;
		}
		
		function updateTimer(){
			timerField.innerHTML = timerField.innerHTML*1 + 1;
		}
	};
	
	function over( e ){
		if( !this.clicked )
			this.className = CLASSES.hover;
	};
	
	function out( e ){
		if( !this.clicked )
			this.className = "";
	};
	
	function arrRandom( arr, num ){
		var ret = [], i;
			arr = arr.slice();
		
		while( num-- )
			ret.push( arr.splice( i = Math.floor( Math.random()*arr.length ), 1 )[0] );
		
		return ret;
	};
	
	function forEach( array, func ){
		for( var i = 0, j = array.length; i<j; )
			if( func.call( array[ i ], i, array[ i++ ] ) === false ) break;
	}
	
	function toArray( nodeList ){
		var result = [];
		
		for( var i=0, j=nodeList.length; i<j; result.push( nodeList[ i++ ] ) ){};
		
		return result;
	};
	
	function Flase(){ return false; };
})();