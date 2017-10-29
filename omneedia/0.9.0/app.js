/**
 * Version: 0.9.0
 * Build Date: 20-Oct-2018
 * Copyright (c) 2006-2018, Omneedia. (http://www.omneedia.com/). All rights reserved.
 * License: GPL.
 * Website: http://www.omneedia.com/
 *
 * CHANGELOG
 * ---------
 * 0.9.0	Initial commit
 *
 */

// set location origin
if (!window.location.origin)
	window.location.origin = window.location.protocol + "//" + window.location.host;

// Remote API
if (!Settings.REMOTE_API) Settings.REMOTE_API = document.location.origin;

// Define App
App={
	version : '0.9.0',
    versionDetail : {
        major : 0,
        minor : 9,
        patch : 0
    }
};



/**
 * Copies all the properties of config to obj.
 * @param {Object} obj The receiver of the properties
 * @param {Object} config The source of the properties
 * @param {Object} defaults A different object that will also be applied for default values
 * @return {Object} returns obj
 * @member App apply
 */
App.apply = function(o, c, defaults){
    // no "this" reference for friendly out of scope calls
    if(defaults){
        App.apply(o, defaults);
    }
    if(o && c && typeof c == 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
};

App.apply(App,{
	global: (function () {
    	return this;
    })(),	
	namespaceCache: {},	
    createNamespace: function (namespace, constructor,extend) {
		var cache = App.namespaceCache,
			ns = cache[namespace],
			i, n, part, parts, partials;
		function getArgs(func) {
		  // First match everything inside the function argument parens.
		  var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

		  // Split the arguments string into an array comma delimited.
		  return args.split(',').map(function(arg) {
			// Ensure no inline comments are parsed and trim the whitespace.
			return arg.replace(/\/\*.*\*\//, '').trim();
		  }).filter(function(arg) {
			// Ensure no undefined values are added.
			return arg;
		  });
		};
		if (!ns) {
			ns = App.global;
			if (namespace) {
				partials = [];
				parts = namespace.split('.');
				for (i = 0, n = parts.length; i < n; ++i) {
					part = parts[i];
					if (constructor) {
						if (extend)
						ns = ns[part] || (ns[part] = (function() {
							var _p=eval(extend);	
							_p.apply(this,arguments);
							return constructor; 
						})());
						else
						ns = ns[part] || (ns[part] = constructor);
					} else
					ns = ns[part] || (ns[part] = {});
					partials.push(part);
					cache[partials.join('.')] = ns; // build up prefixes as we go
				}
			}
		};
		return ns;
    },	
	/**
	 * Returns true if the passed value is not undefined.
	 * @param {Mixed} value The value to test
	 * @return {Boolean}
    */
    isDefined : function(v){
    	return typeof v !== 'undefined';
    },	
	applyIf : function(o, c){
		if(o){
			for(var p in c){
				if(!App.isDefined(o[p])){
					o[p] = c[p];
				}
			}
		};
		return o;
    },
	/* 
	UUID Generator
	*/
	uuid: function() {
		var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var chars = CHARS
			, uuid = new Array(36)
			, rnd = 0
			, r;
		for (var i = 0; i < 36; i++) {
			if (i == 8 || i == 13 || i == 18 || i == 23) {
				uuid[i] = '-';
			} else if (i == 14) {
				uuid[i] = '4';
			} else {
				if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
				r = rnd & 0xf;
				rnd = rnd >> 4;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		};
		return uuid.join('');		
	},
	IOKey: md5(new Date().toMySQL().split(' ')[0]),
	/**
     * @method define
	 * Defines a class
     */
	define: function (className, o) {
		// We create statics objects
		if (o.statics) {
			var object=App.createNamespace(className);
			App.apply(object,o.statics);
			if (o.extend) {
				var _p=eval(o.extend);
				var items=Object.getOwnPropertyNames(_p);
				for (var i=0;i<items.length;i++) object[items[i]]=_p[items[i]];
			};
		} else {
			// We create objects
			if (!o.constructor) throw "GURU MEDITATION: No constructor found";
			var object=App.createNamespace(className,o.constructor,o.extend);
			if (o.extend) {
				var proto=eval(o.extend+".prototype");
				object.prototype = proto;
				object.prototype.constructor = o.constructor;
			};
			for (var el in o) {
				if (el!="constructor") object.prototype[el]=o[el];	
			};
		};
		return object;
	},
	logger: {
		oldConsoleLog: null,
		enable: function() {
			if(this.oldConsoleLog == null) return;
			window['console']['log'] = this.oldConsoleLog;
		},
		disable: function() {
			this.oldConsoleLog = console.log;
			window['console']['log'] = function() {};
		}
	},	
	isURLOnline: function(url,cb) {
    	var req = new XMLHttpRequest();
    	req.open('HEAD', url);
    	req.onreadystatechange = function() {
			if (this.readyState == this.DONE) {
				cb(this.status != 404);
			}
    	};
		req.send();
	},
	require: function (module, cb) {		
		if (Settings.DEBUG) {
			module=module.replace(/\./g,'/');
			alert(module);
			var script="";
			var config={};
			var zobj=[];			
			function req(scripts,i,cb) {
				if (!scripts[i]) return cb();
				scripts[i]=scripts[i].replace(/{version}/g,config.version);
				for (var el in config.repositories) {
					if (scripts[i].indexOf(el)>-1) scripts[i]=config.repositories[el]+scripts[i].split(el)[1];	
				};			
				if (scripts[i].indexOf('http')==-1) {
					scripts[i]=App.origin()+script.replace('.json','/')+scripts[i];
				};				
				App.request(scripts[i],function(e,b) {
					window.eval(b);
					req(scripts,i+1,cb);
				})	
			};
			function reqns(scripts,i,cb,arr) {
				if (!scripts[i]) return cb(arr);
				scripts[i]=scripts[i].replace(/{version}/g,config.version);
				for (var el in config.repositories) {
					if (scripts[i].indexOf(el)>-1) scripts[i]=config.repositories[el]+scripts[i].split(el)[1];	
					if (scripts[i].indexOf('http')==-1) {
						scripts[i]=App.origin()+script.replace('.json','/')+scripts[i];
					}
				};				
				App.request(scripts[i],function(e,b) {
					arr.push(b);
					reqns(scripts,i+1,cb,arr);
				})	
			};			
			function reqObj(s,i,cb) {
				if (!s[i]) return cb();
				for (var el in s[i]) {
					if (!App.isArray(s[i][el])) s[i][el]=[s[i][el]];
					reqns(s[i][el],0,function(arr) {
						window.eval(config.namespace+'.'+el+'=function() {'+arr.join('\n')+'}');
						reqObj(s,i+1,cb);
					},[])	
				};
			};			
			for (var el in Settings.PATHS) {
				if (module.indexOf(el)>-1) {
					/*if (Settings.PATHS[el].indexOf('/')==Settings.PATHS[el].length) script=Settings.PATHS[el]+module.split(el)[1]; else */script=Settings.PATHS[el]+'/'+module.split(el)[1]; 	
				}
			};
			if (script=="") script=module;
			//script=script.replace(/\./g,'/');
			if (script.indexOf('.json')==-1) script+=".json";
			//alert(script);
			App.request(script,function(e,b) {
				config=JSON.parse(b);
				var scripts=config.package.js;
				var scr=[];
				for (var i=0;i<scripts.length;i++) {
					if (App.isObject(scripts[i])) {
						zobj.push(scripts[i]);
					} else scr.push(scripts[i]);
				};
				for (var i=0;i<config.package.css.length;i++) {
					var url=config.package.css[i];
					url=url.replace(/{version}/g,config.version);
					for (var el in config.repositories) {
						if (url.indexOf(el)>-1) url=config.repositories[el]+url.split(el)[1];	
					};
					if (url.indexOf('http')==-1) url=App.origin()+script.replace('.json','/')+url;	
					var link=document.createElement('link');
					link.rel="stylesheet";
					link.type="text/css";
					link.href=url;
					document.getElementsByTagName('head')[0].appendChild(link);
				};
				req(scr,0,function() {
					reqObj(zobj,0,cb);
				});
			});			
		};
	},	
	request: function(o,cb) {
		function param(object) {
			var encodedString = '';
			for (var prop in object) {
				if (object.hasOwnProperty(prop)) {
					if (encodedString.length > 0) {
						encodedString += '&';
					}
					encodedString += encodeURI(prop + '=' + object[prop]);
				}
			};
			return encodedString;
		};		
		var xhr = new XMLHttpRequest();
		var error={};
		if (!App.isObject(o)) o={url:o};
		if ((!o.uri) && (!o.url)) throw "GURU MEDITATION: No URL parameter";
		if (o.uri) var url=o.uri;
		if (o.url) var url=o.url;
		if (!o.method) var method="GET"; else var method=o.method;
		var reqListener = function() {
			if (xhr.status === 200) {
        		cb(null,xhr.responseText,xhr);
    		}
    		else {
				cb(xhr,null);
    		}			
		};
		var updateProgress = function(p) {
			//console.log(p);
		};
		var transferFailed = function(e) {
			cb(e,null);
		};
		var transferCanceled = function() {
			//console.log('z');
		};
		xhr.addEventListener( "load" , reqListener,false );
		xhr.addEventListener( "progress" , updateProgress, false);
		xhr.addEventListener( "error" , transferFailed, false);
		xhr.addEventListener( "abort" , transferCanceled, false);	
		xhr.open( method , url );
		if (method=="GET") xhr.send();
		if (method=="POST") {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			if (o.form) xhr.send(encodeURI(param(o.form))); else {
				if (o.data) {
					xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
					xhr.send(JSON.stringify(o.data)); 
				} else xhr.send();
			}
		};
	},
	__key__: new Persist.Store(Settings.NAMESPACE.replace(/\./g, '')),
	key: {
		set: function (key, value) {
			if (!key) return false;
			if (!value) return false;
			if (value !== null && typeof value === 'object') value = JSON.stringify(value);
			App.__key__.set(key, value);
		}, 
		remove: function (key) {
			App.__key__.remove(key);
		}, 
		get: function (key) {
			var response = App.__key__.get(key);
			try {
				return JSON.parse(response);
			} catch (e) {
				return response;
			}
		}
	}
});

// Generate App Unique ID
App.uid = App.uuid();

App.apply(App,{
	$: function(obj) {
		try {
			var elem=document.querySelectorAll(obj);
		} catch(e) {
			var elem=[];
			var span=document.createElement('span');
			span.innerHTML=obj;
			elem.push(span);
		};
		return {
			css: function(key,value) {
				for (var i=0;i<elem.length;i++) {	
					if (elem[i]) {
						if (!value) return elem[i].style[key]; else {
							elem[i].style[key]=value;
						}
					}
				}
			},
			html: function(xhtml) {
				for (var i=0;i<elem.length;i++) {
					if (elem[i]) {
						if (!xhtml) return elem[i].innerHTML; else elem[i].innerHTML=xhtml;
					}
				};
			},
			remove: function() {
				for (var i=0;i<elem.length;i++) {
					if (elem[i]) elem[i].parentNode.removeChild(elem[i]);
				};
			},
			click: function(fn) {
				for (var i=0;i<elem.length;i++) {
					elem[i].addEventListener('click',fn,true);
				}
			},
			appendTo: function(div) {
				for (var i=0;i<elem.length;i++) {
					if (elem[i]) {
						if (App.isString(div)) div=document.querySelector(div);
						if (div) div.appendChild(elem[i]);
					};
				}
			},
			addClass: function(cl) {
				for (var i=0;i<elem.length;i++) {
					if (elem[i]) elem[i].classList.add(cl);
				}
			},
			removeClass: function(cl) {
				for (var i=0;i<elem.length;i++) {
					if (elem[i]) elem[i].classList.remove(cl);
				}
			},
			show: function() {
				for (var i=0;i<elem.length;i++) {
					if (elem[i]) elem[i].style.display="";
				}
			},
			hide: function() {
				for (var i=0;i<elem.length;i++) {
					if (elem[i]) elem[i].style.display="none";
				}
			}
		}
	}
});

App.import = function(scripts, cb) {
	var loadScript = function(url,i,callback) {
		if (!url[i]) return callback();
		var script = document.createElement("script")
		script.type = "text/javascript";
		if (script.readyState){  //IE
			script.onreadystatechange = function(){
				if (script.readyState == "loaded" ||
						script.readyState == "complete"){
					script.onreadystatechange = null;
					loadScript(url,i+1,callback);
				}
			};
		} else {  //Others
			script.onload = function(){
				loadScript(url,i+1,callback);
			};
		};
		script.src = url[i];
		document.getElementsByTagName("head")[0].appendChild(script);
	};
	if (typeof scripts === 'string') scripts=[scripts];
	loadScript(scripts,0,cb);
};

App.apply(App,{
	shortid: function(previous) {
		var generate = function() {
			var ID_LENGTH = 8;
			var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
			var rtn = '';
			for (var i = 0; i < ID_LENGTH; i++) rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
			return rtn;
		};
		var UNIQUE_RETRIES = 9999;
		previous = previous || [];
		var retries = 0;
		var id;

		// Try to generate a unique ID,
		// i.e. one that isn't in the previous.
		while(!id && retries < UNIQUE_RETRIES) {
			id = generate();
			if(previous.indexOf(id) !== -1) {
				id = null;
				retries++;
			}
		};

		return id;
	},
	IO: {
		subscribe: function (uri) {
			uri = uri.split(' ');
			for (var i = 0; i < uri.length; i++) {
				if (uri[i].indexOf("#") > -1) document.socket.emit('#create', uri[i]);
			}
		}, 
		on: function (uri, cb) {
			document.socket.on(uri, cb);
		}, 
		send: function (uri, data, users) {
			var o = {
				uri: uri
				, data: data
				, users: users
			};
			if (uri.indexOf("#") > -1) document.socket.emit('#send', JSON.stringify(o));
		}
	}
});

App.apply(App, {
	isEmpty: function(value, allowEmptyString) {
		return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (App.isArray(value) && value.length === 0);
	},

	/**
	 * Returns true if the passed value is a JavaScript Array, false otherwise.
	 *
	 * @param {Object} target The target to test
	 * @return {Boolean}
	 * @method
	 */
	isArray: ('isArray' in Array) ? Array.isArray : function(value) {
		return toString.call(value) === '[object Array]';
	},

	/**
	 * Returns true if the passed value is a JavaScript Date object, false otherwise.
	 * @param {Object} object The object to test
	 * @return {Boolean}
	 */
	isDate: function(value) {
		return toString.call(value) === '[object Date]';
	},

	/**
	 * Returns true if the passed value is a JavaScript Object, false otherwise.
	 * @param {Object} value The value to test
	 * @return {Boolean}
	 * @method
	 */
	isObject: (toString.call(null) === '[object Object]') ?
	function(value) {
		// check ownerDocument here as well to exclude DOM nodes
		return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
	} :
	function(value) {
		return toString.call(value) === '[object Object]';
	},

	/**
	 * @private
	 */
	isSimpleObject: function(value) {
		return value instanceof Object && value.constructor === Object;
	},
	/**
	 * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
	 * @param {Object} value The value to test
	 * @return {Boolean}
	 */
	isPrimitive: function(value) {
		var type = typeof value;

		return type === 'string' || type === 'number' || type === 'boolean';
	},

	/**
	 * Returns true if the passed value is a JavaScript Function, false otherwise.
	 * @param {Object} value The value to test
	 * @return {Boolean}
	 * @method
	 */
	isFunction:
	// Safari 3.x and 4.x returns 'function' for typeof <NodeList>, hence we need to fall back to using
	// Object.prototype.toString (slower)
	(typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function(value) {
		return !!value && toString.call(value) === '[object Function]';
	} : function(value) {
		return !!value && typeof value === 'function';
	},

	/**
	 * Returns true if the passed value is a number. Returns false for non-finite numbers.
	 * @param {Object} value The value to test
	 * @return {Boolean}
	 */
	isNumber: function(value) {
		return typeof value === 'number' && isFinite(value);
	},

	/**
	 * Validates that a value is numeric.
	 * @param {Object} value Examples: 1, '1', '2.34'
	 * @return {Boolean} True if numeric, false otherwise
	 */
	isNumeric: function(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	},

	/**
	 * Returns true if the passed value is a string.
	 * @param {Object} value The value to test
	 * @return {Boolean}
	 */
	isString: function(value) {
		return typeof value === 'string';
	},

	/**
	 * Returns true if the passed value is a boolean.
	 *
	 * @param {Object} value The value to test
	 * @return {Boolean}
	 */
	isBoolean: function(value) {
		return typeof value === 'boolean';
	},

	/**
	 * Returns true if the passed value is an HTMLElement
	 * @param {Object} value The value to test
	 * @return {Boolean}
	 */
	isElement: function(value) {
		return value ? value.nodeType === 1 : false;
	},

	/**
	 * Returns true if the passed value is a TextNode
	 * @param {Object} value The value to test
	 * @return {Boolean}
	 */
	isTextNode: function(value) {
		return value ? value.nodeName === "#text" : false;
	},

	/**
	 * Returns true if the passed value is defined.
	 * @param {Object} value The value to test
	 * @return {Boolean}
	 */
	isDefined: function(value) {
		return typeof value !== 'undefined';
	},

	/**
	 * Returns `true` if the passed value is iterable, that is, if elements of it are addressable using array
	 * notation with numeric indices, `false` otherwise.
	 *
	 * Arrays and function `arguments` objects are iterable. Also HTML collections such as `NodeList` and `HTMLCollection'
	 * are iterable.
	 *
	 * @param {Object} value The value to test
	 * @return {Boolean}
	 */
	isIterable: function(value) {
		// To be iterable, the object must have a numeric length property and must not be a string or function.
		if (!value || typeof value.length !== 'number' || typeof value === 'string' || App.isFunction(value)) {
			return false;
		}

		// Certain "standard" collections in IE (such as document.images) do not offer the correct
		// Javascript Object interface; specifically, they lack the propertyIsEnumerable method.
		// And the item property while it does exist is not typeof "function"
		if (!value.propertyIsEnumerable) {
			return !!value.item;
		}

		// If it is a regular, interrogatable JS object (not an IE ActiveX object), then...
		// If it has its own property called "length", but not enumerable, it's iterable
		if (value.hasOwnProperty('length') && !value.propertyIsEnumerable('length')) {
			return true;
		}

		// Test against whitelist which includes known iterable collection types
		return iterableRe.test(toString.call(value));
	}
});

App.apply(App,{
	/**
	 * Convert an image
	 * to a base64 url
	 * @param  {String}   url
	 * @param  {Function} callback
	 * @param  {String}   [outputFormat=image/png]
	 */
	convertImgToBase64URL: function(url, callback, outputFormat) {
		var img = new Image();
		img.crossOrigin = 'Anonymous';
		if (!outputFormat) var outputFormat = 'image/png';
		img.onload = function () {
			var canvas = document.createElement('CANVAS')
				, ctx = canvas.getContext('2d')
				, dataURL;
			canvas.height = this.height;
			canvas.width = this.width;
			ctx.drawImage(this, 0, 0);
			dataURL = canvas.toDataURL(outputFormat);
			callback(dataURL);
			canvas = null;
		};
		if (url.indexOf('url(') > -1) url = url.split('url(')[1].split(')')[0];
		if (url.indexOf('http') == -1) callback(url);
		else {
			img.src = url;
		}
	},
	loadAPI: function (api) {
		var script_tag = document.createElement('script');
		script_tag.setAttribute("type", "text/javascript");
		script_tag.setAttribute("src", api);
		(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
	}, 
	readFile: function (file, cb) {
		var reader = new FileReader();
		reader.onload = function (e) {
			var text = reader.result;
			cb(text, e);
		};
		reader.readAsDataURL(file);
	}, 
	origin: function () {
		return window.location.protocol + "//" + window.location.host;
	}
});


App.apply(App,{
	/**
	 * @namespace App
	 * @method blur
	 *
	 * Blur the app
	 */
	blur: function(OBJ) {
		if (!OBJ) var OBJ=document.getElementsByTagName('body')[0]; else OBJ=document.querySelector(OBJ);
		var _createSvgElement = function(tagName) {
    		return document.createElementNS('http://www.w3.org/2000/svg', tagName);
    	};
		var svgUrl = document.location.protocol + '//' + document.location.host + document.location.pathname + document.location.search;
		var svg = _createSvgElement('svg');
    	var filter = _createSvgElement('filter');
		filter.id = "blurme"+App.uuid();
		var _svgGaussianFilter = _createSvgElement('feGaussianBlur');
		_svgGaussianFilter.setAttribute('stdDeviation','5');
		svg.setAttribute('style', 'position:absolute');
    	svg.setAttribute('width', '0');
    	svg.setAttribute('height', '0');
		filter.appendChild(_svgGaussianFilter);
    	svg.appendChild(filter);
		document.getElementsByTagName('body')[0].appendChild(svg);
		var cssFilterValue = 'url(' + svgUrl + '#' + filter.id + ')';
		OBJ.style['filter']=cssFilterValue;
	},
	/**
	 * @namespace App
	 * @method blur
	 *
	 * unBlur the app
	 */
	unblur: function(OBJ) {
		if (!OBJ) var OBJ=document.getElementsByTagName('body')[0]; else OBJ=document.querySelector(OBJ);
		OBJ.style['filter']='';
	}
});

window.addEventListener('error', function(e) {
	console.log('%c GURU MEDITATION ', 'background: #222; color: #bada55');
    console.log({
        lineno: e.lineno,
        colno: e.colno,
        filename: e.filename,
        message: e.error.message,
        stack: e.error.stack
    })
});

if(!Settings.DEBUG){
    if(!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "info"];
    for(var i=0;i<methods.length;i++){
        console[methods[i]] = function(){};
    }
}