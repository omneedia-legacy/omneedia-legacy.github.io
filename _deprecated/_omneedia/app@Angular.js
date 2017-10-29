/**
 * Version: 1.1.0
 * Build Date: 13-Nov-2015
 * Copyright (c) 2006-2015, Omneedia. (http://www.omneedia.com/). All rights reserved.
 * License: ***.
 * Website: http://www.omneedia.com/
 *
 * CHANGELOG
 * ---------
 * 1.0.0	Initial commit
 * 1.1.0	Change iOS webapp settings for native app
 * 
 */

try {
	if (!AppMobile) AppMobile={};	
} catch(e) {
	AppMobile={};
}

if (!window.location.origin) window.location.origin = window.location.protocol + "//" + window.location.host;

var io_start=function(io) {
		document.socket = io.connect(document.location.origin);
		document.socket.on('connect', function () {
			var sessionid = document.socket.io.engine.id;
			AppMobile.unblur();
		});
		document.socket.on('disconnect', function () {
			AppMobile.blur();
		});
		document.socket.on('log', function (data) {
			console.log('%c ' + 'LOG: SERVER', 'color: #00F; font-size:12px', data);
		});
		document.socket.on('info', function (data) {
			console.info('%c' + 'INFO: SERVER \n', 'color: green; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
		});
		document.socket.on('warn', function (data) {
			console.warn('%c' + 'WARN: SERVER \n', 'color: orange; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
		});
		document.socket.on('debug', function (data) {
			console.debug('%c' + 'DEBUG: SERVER \n', 'color: black; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
		});
		document.socket.on('error', function (data) {
			console.error('%c' + 'ERROR: SERVER \n', 'color: red; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
		});
		document.socket.on('session', function (data) {
			var data = JSON.parse(data);
			if (!localStorage.getItem("session")) localStorage.setItem('session', data.pid);
			else {
				if (localStorage.getItem("session") != data.pid) {
					localStorage.setItem('session', data.pid);
					try {
						AppMobile.blur();
					} catch (e) {};
					location.reload();
				}
			};
		});
		/*AppMobile.IO = {
				subscribe: function (uri) {
					uri = uri.split(' ');
					for (var i = 0; i < uri.length; i++) {
						if (uri[i].indexOf("#") > -1) document.socket.emit('#create', uri[i]);
					}
				}
				, on: function (uri, cb) {
					document.socket.on(uri, cb);
				}
				, send: function (uri, data, users) {
					var o = {
						uri: uri
						, data: data
						, users: users
					};
					if (uri.indexOf("#") > -1) document.socket.emit('#send', JSON.stringify(o));
				}
		};	*/
};
try {
	if (Require) {
		Require.config({
			shim: {
				"socketio": {
					exports: 'io'
				}
			},
			paths: {
				"socketio": 'http://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io'
			}
		});
		Require(['socketio'], function(io){
			io_start(io);
		});	
	}	
}catch(e){
	require.config({
		shim: {
			"socketio": {
				exports: 'io'
			}
		},
		paths: {
			socketio: 'http://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io'
		}
	});
	require(['socketio'], function(io){
		io_start(io);
	});
};

/**
 *
 * Version: 0.0.6
 * Author: Gianluca Guarini
 * Contact: gianluca.guarini@gmail.com
 * Website: http://www.gianlucaguarini.com/
 * Twitter: @gianlucaguarini
 *
 * Copyright (c) Gianluca Guarini
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 **/


(function (window, document, $) {
	'use strict';

	// Plugin private cache
	// static vars
	var cache = {
			filterId: 0
		}
		, $body = $('body');

	var Vague = function (elm, customOptions) {
		// Default options
		var defaultOptions = {
				intensity: 5
				, forceSVGUrl: false
				, animationOptions: {
					duration: 1000
					, easing: 'linear'
				}
			}, // extend the default options with the ones passed to the plugin
			options = $.extend(defaultOptions, customOptions),

			/*
			 *
			 * Helpers
			 *
			 */

			_browserPrefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
			, _cssPrefixString = {}
			, _cssPrefix = function (property) {
				if (_cssPrefixString[property] || _cssPrefixString[property] === '') return _cssPrefixString[property] + property;
				var e = document.createElement('div');
				var prefixes = ['', 'Moz', 'Webkit', 'O', 'ms', 'Khtml']; // Various supports...
				for (var i in prefixes) {
					if (typeof e.style[prefixes[i] + property] !== 'undefined') {
						_cssPrefixString[property] = prefixes[i];
						return prefixes[i] + property;
					}
				}
				return property.toLowerCase();
			}, // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css-filters.js
			_support = {
				cssfilters: function () {
					var el = document.createElement('div');
					el.style.cssText = _browserPrefixes.join('filter' + ':blur(2px); ');
					return !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
				}(),

				// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg-filters.js
				svgfilters: function () {
					var result = false;
					try {
						result = typeof SVGFEColorMatrixElement !== undefined &&
							SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE == 2;
					} catch (e) {}
					return result;
				}()
			},

			/*
			 *
			 * PRIVATE VARS
			 *
			 */

			_blurred = false, // cache the right prefixed css filter property
			_cssFilterProp = _cssPrefix('Filter')
			, _svgGaussianFilter
			, _filterId, // to cache the jquery animation instance
			_animation,

			/*
			 *
			 * PRIVATE METHODS
			 *
			 */

			/**
			 * Create any svg element
			 * @param  { String } tagName: svg tag name
			 * @return { SVG Node }
			 */

			_createSvgElement = function (tagName) {
				return document.createElementNS('http://www.w3.org/2000/svg', tagName);
			},

			/**
			 *
			 * Inject the svg tag into the DOM
			 * we will use it only if the css filters are not supported
			 *
			 */

			_appendSVGFilter = function () {
				// create the svg and the filter tags
				var svg = _createSvgElement('svg')
					, filter = _createSvgElement('filter');

				// cache the feGaussianBlur tag and make it available
				// outside of this function to easily update the blur intensity
				_svgGaussianFilter = _createSvgElement('feGaussianBlur');

				// hide the svg tag
				// we don't want to see it into the DOM!
				svg.setAttribute('style', 'position:absolute');
				svg.setAttribute('width', '0');
				svg.setAttribute('height', '0');
				// set the id that will be used as link between the DOM element to blur and the svg just created
				filter.setAttribute('id', 'blur-effect-id-' + cache.filterId);

				filter.appendChild(_svgGaussianFilter);
				svg.appendChild(filter);
				// append the svg into the body
				$body.append(svg);

			};

		/*
		 *
		 * PUBLIC VARS
		 *
		 */

		// cache the DOM element to blur
		this.$elm = elm instanceof $ ? elm : $(elm);


		/*
		 *
		 * PUBLIC METHODS
		 *
		 */

		/**
		 *
		 * Initialize the plugin creating a new svg if necessary
		 *
		 */

		this.init = function () {
			// checking the css filter feature
			if (_support.svgfilters) {
				_appendSVGFilter();
			}
			// cache the filter id
			_filterId = cache.filterId;
			// increment the filter id static var
			cache.filterId++;

			return this;

		};

		/**
		 *
		 * Blur the DOM element selected
		 *
		 */

		this.blur = function () {

			var cssFilterValue, // variables needed to force the svg filter URL
				loc = window.location
				, svgUrl = options.forceSVGUrl ? loc.protocol + '//' + loc.host + loc.pathname + loc.search : '';

			// use the css filters if supported
			if (_support.cssfilters) {
				cssFilterValue = 'blur(' + options.intensity + 'px)';
				// .. or use the svg filters
			} else if (_support.svgfilters) {
				// update the svg stdDeviation tag to set up the blur intensity
				_svgGaussianFilter.setAttribute('stdDeviation', options.intensity);
				cssFilterValue = 'url(' + svgUrl + '#blur-effect-id-' + _filterId + ')';
			} else {
				// .. use the IE css filters
				cssFilterValue = 'progid:DXImageTransform.Microsoft.Blur(pixelradius=' + options.intensity + ')';
			}

			// update the DOM element css
			try {
				this.$elm[0].style[_cssFilterProp] = cssFilterValue;
			} catch (e) {

			}
			// set the _blurred internal var to true to cache the element current status
			_blurred = true;

			return this;
		};


		/**
		 * Animate the blur intensity
		 * @param  { Int } newIntensity: new blur intensity value
		 * @param  { Object } customAnimationOptions: default jQuery animate options
		 */

		this.animate = function (newIntensity, customAnimationOptions) {
			// control the new blur intensity checking if it's a valid value
			if (typeof newIntensity !== 'number') {
				throw (typeof newIntensity + ' is not a valid number to animate the blur');
			} else if (newIntensity < 0) {
				throw ('I can animate only positive numbers');
			}
			// create a new jQuery deferred instance
			var dfr = new $.Deferred();

			// kill the previous animation
			if (_animation) {
				_animation.stop(true, true);
			}

			// trigger the animation using the jQuery Animation class
			_animation = new $.Animation(options, {
					intensity: newIntensity
				}, $.extend(options.animationOptions, customAnimationOptions))
				.progress($.proxy(this.blur, this))
				.done(dfr.resolve);

			// return the animation deferred promise
			return dfr.promise();
		};

		/**
		 *
		 * Unblur the DOM element
		 *
		 */
		this.unblur = function () {
			// set the DOM filter property to none
			this.$elm.css(_cssFilterProp, 'none');
			_blurred = false;
			return this;
		};

		/**
		 *
		 * Trigger alternatively the @blur and @unblur methods
		 *
		 */

		this.toggleblur = function () {
			if (_blurred) {
				this.unblur();
			} else {
				this.blur();
			}
			return this;
		};
		/**
		 * Destroy the Vague.js instance removing also the svg filter injected into the DOM
		 */
		this.destroy = function () {
			// do we need to remove the svg filter?
			if (_support.svgfilters) {
				$('filter#blur-effect-id-' + _filterId).parent().remove();
			}

			this.unblur();

			// clear all the property stored into this Vague.js instance
			for (var prop in this) {
				delete this[prop];
			}

			return this;
		};
		// init the plugin
		return this.init();
	};

	// export the plugin as a jQuery function
	$.fn.Vague = function (options) {
		return new Vague(this, options);
	};

}(window, document, jQuery));

AppMobile.blur = function () {
	$('.omneedia-overlay').show();		
	AppMobile._vague.blur();
};

AppMobile.unblur = function (fx) {
	$('.omneedia-overlay').hide();
	AppMobile._vague.unblur();
}

for (var i = 0; i < Settings.RESOURCES.length; i++) {
	var link = document.createElement('link');
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = Settings.RESOURCES[i];
	console.log(Settings.RESOURCES[i]);
	document.getElementsByTagName('head')[0].appendChild(link);
};

AppMobile._vague = $('Body').Vague({
	intensity: 4, 
	forceSVGUrl: false, 
	animationOptions: {
		duration: 1000, 
		easing: 'linear'
	}
});

AppMobile.blur();