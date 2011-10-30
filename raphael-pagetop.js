/*!
 * RaphaelPagetop
 * @author mach3
 * @version 1.0
 * @requires jQuery.js, Raphael.js
 * @example
 *
 *   // Simple Example
 *   $("#myElement").addPagetop(); // Attach the button to the element.
 *   $("#myElement").removePagetop(); // Remove it.
 *
 *   // Example with option
 *   $("#myElement").addPagetop( {
 *     path : "....", // SVG Path expression as string
 *     width : 32, // Button width as integer
 *     height : 32, // Button height as integer
 *     color : "#222", // Button fill color for default as string
 *     hoverColor : "#c90", // Button fill color for hover state as string
 *     marginBottom : 20 // Pixel size of margin bottom as number
 *   } );
 *
 */
(function($, undefined){
	
	/**
	 * RaphaelPagetop
	 * @class Add the button to scroll to page top to the element.
	 * @constructor
	 * @param {Object} option Configuration options.
	 */
	var RaphaelPagetop = function( option ){

		var my, _my;

		my = this;
		_my = {};

		my.option = {
			container : null,
			path : "M0,4V28Q0,32,4,32H32V0H4Q0,0,0,4z"
				+ "M22,22L16,16l-6,6L6,19l6-6L16,9l3,3L26,19L22,22z",
			width : 32,
			height : 32,
			color : "#222",
			hoverColor : "#c90",
			marginBottom : 20,
			id : "raphael-page-top"
		};

		_my.vars = {
			visible : false
		};

		my.container = null;
		my.buttonContainer = null;
		my.button = null;

		/**
		 * Set configuration.
		 * @private
		 * @param {Object} option Configuration option.
		 */
		_my.config = function( option ){
			var i;
			for( i in option ){
				if( my.option.hasOwnProperty( i ) ){
					my.option[i] = option[i];
				}
			}
		};

		/**
		 * Initialize
		 * @public
		 * @param {Object} option Configuration options.
		 * @returns {Object} RaphaelPagetop object itself.
		 */
		my.init = function( option ){
			if( option ){
				_my.config( option );
			}
			// setup elements
			my.container = my.option.container;
			my.buttonContainer = _my.getButtonContainer();
			my.button = _my.getButtonElement();
			// events
			$(window).bind( "scroll", my.update );
			// initialize
			my.update();
			return my;
		};

		/**
		 * Create element to contains the button.
		 * @private
		 * @return {Object} jQuery object.
		 */
		_my.getButtonContainer = function(){
			return $("<div>")
				.attr({
					id : my.option.id
				})
				.css({
					position : "absolute",
					overflow : "hidden",
					top : - ( my.option.height ),
					right : 0,
					width : my.option.width,
					height : my.option.height
				})
				.prependTo( $("body") );
		};

		/**
		 * Create button element. ( Set object of Raphael )
		 * @private
		 * @return {Object} Set object of Raphael.
		 */
		_my.getButtonElement = function(){
			var paper, set, shape, rect, dist;
			// set up button elements
			paper = Raphael( my.option.id, my.option.width, my.option.height );
			set = paper.set();
			shape = paper.path( my.option.path )
				.attr({ stroke : "none", fill : my.option.color });
			rect = paper.rect( 0, 0, my.option.width, my.option.height )
				.attr({ fill : "#fff", opacity : 0, cursor : "hand" });
			set.push( shape, rect );
			// events for buttons
			set.hover(
				function(){
					_my.changeFillColor( shape, my.option.hoverColor );
				},
				function(){
					_my.changeFillColor( shape, my.option.color );
				}
			);
			set.click(function(){
				$("html,body").animate({
					scrollTop : 0
				});
				_my.changeFillColor( shape, my.option.color );
			});
			// add methods
			dist = "t{{x}},0".replace( "{{x}}", my.option.width );
			set.transform( dist );
			set.hide = function(){
				this.animate( { transform : dist }, 300, "bounce" );
				return this;
			};
			set.show = function(){
				this.animate( { transform : "t0,0" }, 300, "bounce" );
				return this;
			};
			return set;
		};

		/**
		 * Change fill color of the shape
		 * @private
		 * @param {Object} element Raphael Element object.
		 * @param {String} color Color string.
		 */
		_my.changeFillColor = function( element, color ){
			element.animate( { fill : color }, 300, "linear" );
		};

		/**
		 * Update position and statuses of button.
		 * @public
		 * @returns {Object} RaphaelPagetop object itself.
		 */
		my.update = function(){
			var con, opt, scroll, y;
			con = my.container;
			opt = my.option;
			scroll = $(document).scrollTop();
			y = Math.min(
				( con.height() + con.offset().top - opt.height ),
				( scroll + $("html").prop( "clientHeight" ) - opt.marginBottom - opt.height )
			);
			my.buttonContainer.stop().animate(
				{ top : y },
				500,
				function(){
					var v = scroll > 0 ;
					if( v !== _my.vars.visible ){
						my.setVisible( v );
					}
				}
			);
			return my;
		};

		/**
		 * Set visibility of button.
		 * If 'true' is passed, show button, if not, hide it.
		 * @param {Boolean} visible
		 * @returns {Object} RaphaelPagetop object itself.
		 */
		my.setVisible = function( visible ){
			_my.vars.visible = visible;
			if( visible ){
				my.button.show();
			} else {
				my.button.hide();
			}
			return my;
		};

		/**
		 * Destoy itself. ( Remove elements for buttons from DOM )
		 * @public
		 */
		my.destroy = function(){
			my.buttonContainer.remove();
			$(window).unbind( "scroll", my.update );
		};

		my.init( option );
	};

	$.fn.extend({
		/**
		 * Add page top button to the element.
		 * @params {Object} option Configuration options.
		 * @returns {Object} jQuery object itself.
		 */
		addPagetop : function( option ){
			this.each(function(){
				var me, pagetop;
				me = $(this);
				pagetop = new RaphaelPagetop(
					$.extend( option, { container : me } )
				);
				me.data( "raphaelPagetop", pagetop );
			});
			return this;
		},
		/**
		 * Remove the page top button from the element.
		 * @returns {Object} jQuery object itself.
		 */
		removePagetop : function(){
			var pagetop = $(this).data("raphaelPagetop");
			if( pagetop ){
				pagetop.destroy();
			}
			return this;
		}
	});

})(jQuery);
