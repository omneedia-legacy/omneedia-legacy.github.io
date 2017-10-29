

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};







if (Settings.DEBUG) {
	var io_start=function(io) {
		
		if (Settings.REMOTE_API.indexOf('https')>-1)
		document.socket = io.connect(Settings.REMOTE_API, {secure: true,transports: ['xhr-polling']});
		else
		document.socket = io.connect(Settings.REMOTE_API);

		document.socket.on('connect', function () {
			var sessionid = document.socket.io.engine.id;

			try {
				App.unblur();
			} catch (e) {};
			$('.omneedia-overlay').hide();
		});
		document.socket.on('disconnect', function () {
			try {
				App.blur();
			} catch (e) {};
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
						App.blur();
					} catch (e) {};
					location.reload();
				}
			};
		});
		Ext.define("omneedia.IO", {
			statics: {
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
			}
		});

		App.IO = omneedia.IO;
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
};







function encrypt(alpha, key) {
	var keys = [];
	alpha = Base64.encode(alpha);

	function getkey(o) {
		var position = o % keys.length;
		return keys[position];
	};
	for (var i = 0; i < key.length; i++) {
		keys[keys.length] = key.charCodeAt(i);
	};
	var data = [];
	for (var i = 0; i < alpha.length; i++) {
		var _key = getkey(i);
		var _num = _key + alpha.charCodeAt(i) * 1;
		data[data.length] = _num.toString(16);
	};
	return Base64.encode(data.join(''));
};

function decrypt(alpha, key) {
	var keys = [];
	alpha = Base64.decode(alpha);

	function getkey(o) {
		var position = o % keys.length;
		return keys[position];
	};
	for (var i = 0; i < key.length; i++) {
		keys[keys.length] = key.charCodeAt(i);
	};
	var data = [];
	var i = 0;
	while (i < alpha.length) {
		var str = alpha.substr(i, 2);
		data[data.length] = str;
		i = i + 2;
	};

	var alpha = "";
	for (var i = 0; i < data.length; i++) {
		var _key = getkey(i);
		var _num = parseInt(data[i], 16) - _key;
		alpha += String.fromCharCode(_num);
	};
	return Base64.decode(alpha);
};


function Poster() {
	var postBinding = "poster";
	var receiveBinding = "receiver";
	var setMessageCallback, unsetMessageCallback, currentMsgCallback
		, intervalId, lastHash, cacheBust = 1;

	if (window.postMessage) {

		if (window.addEventListener) {
			setMessageCallback = function (callback) {
				window.addEventListener('message', callback, false);
			}

			unsetMessageCallback = function (callback) {
				window.removeEventListener('message', callback, false);
			}
		} else {
			setMessageCallback = function (callback) {
				window.attachEvent('onmessage', callback);
			}

			unsetMessageCallback = function (callback) {
				window.detachEvent('onmessage', callback);
			}
		}

		this[postBinding] = function (message, targetUrl, target) {
			if (!targetUrl) {
				return;
			}

			// The browser supports window.postMessage, so call it with a targetOrigin
			// set appropriately, based on the targetUrl parameter.
			target.postMessage(message, targetUrl.replace(/([^:]+:\/\/[^\/]+).*/, '$1'));
		}

		// Since the browser supports window.postMessage, the callback will be
		// bound to the actual event associated with window.postMessage.
		this[receiveBinding] = function (callback, sourceOrigin, delay) {
			// Unbind an existing callback if it exists.
			if (currentMsgCallback) {
				unsetMessageCallback(currentMsgCallback);
				currentMsgCallback = null;
			}

			if (!callback) {
				return false;
			}

			// Bind the callback. A reference to the callback is stored for ease of
			// unbinding.
			currentMsgCallback = setMessageCallback(function (e) {
				switch (Object.prototype.toString.call(sourceOrigin)) {
				case '[object String]':
					if (sourceOrigin !== e.origin) {
						return false;
					}
					break;
				case '[object Function]':
					if (sourceOrigin(e.origin)) {
						return false;
					}
					break;
				}

				callback(e);
			});
		};

	} else {

		this[postBinding] = function (message, targetUrl, target) {
			if (!targetUrl) {
				return;
			}

			// The browser does not support window.postMessage, so set the location
			// of the target to targetUrl#message. A bit ugly, but it works! A cache
			// bust parameter is added to ensure that repeat messages trigger the
			// callback.
			target.location = targetUrl.replace(/#.*$/, '') + '#' + (+new Date) + (cacheBust++) + '&' + message;
		}

		// Since the browser sucks, a polling loop will be started, and the
		// callback will be called whenever the location.hash changes.
		this[receiveBinding] = function (callback, sourceOrigin, delay) {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			}

			if (callback) {
				delay = typeof sourceOrigin === 'number' ? sourceOrigin : typeof delay === 'number' ? delay : 100;

				intervalId = setInterval(function () {
					var hash = document.location.hash
						, re = /^#?\d+&/;
					if (hash !== lastHash && re.test(hash)) {
						lastHash = hash;
						callback({
							data: hash.replace(re, '')
						});
					}
				}, delay);
			}
		};

	}

	return this;
};





Ext.define("omneedia.App", {
	statics: {


		, model: {
			get: function (name) {
				eval('var _p=' + APP_NAMESPACE + ".model." + name);
				return _p;
			}
			, create: function (cfg) {
				return Ext.define('MODEL_' + Math.uuid(), cfg);
			}
			, define: function (name, o, z) {
				if (!z) o.extend = "Ext.data.Model";
				else o.extend = z;
				//console.log('=='+z);
				//alert(o.extend);
				if (o.config) {
					if (o.config.api) {
						if (o.config.api instanceof Object) {
							var api = {};
							if (o.config.api.create) api.create = o.config.api.create;
							if (o.config.api.read) api.read = o.config.api.read;
							if (o.config.api.update) api.update = o.config.api.update;
							if (o.config.api.destroy) api.destroy = o.config.api.destroy;
							var pudid = false;
							if (Auth.User) pudid = Auth.User.pudid;
							if (o.config.extraParams) {
								var proxy = {
									type: "direct"
									, extraParams: {
										pudid: pudid
										, __SQL__: o.config.extraParams.__SQL__
									}
									, api: api
								};
							} else {
								var proxy = {
									type: "direct"
									, extraParams: {
										pudid: pudid
									}
									, api: api
								};
							}
						} else {
							if (o.config.extraParams) {
								var proxy = {
									type: "direct"
									, extraParams: {
										pudid: pudid
										, __SQL__: o.config.extraParams.__SQL__
									}
									, directFn: o.config.api
								}
							} else {
								var proxy = {
									type: "direct"
									, extraParams: {
										pudid: pudid
									}
									, directFn: o.config.api
								}
							}
						}
						if (proxy) o.config.proxy = proxy;
						o.config.api = null;
					};
					if (o.config.db) {
						if (o.config.db.schema) {
							if (Settings.REMOTE_API) my_url = Settings.REMOTE_API + "/db/" + o.config.db.schema + ":model";
							o.config.proxy = {
								type: 'rest'
								, extraParams: {
									fields: Ext.encode(o.config.db.fields)
									, where: Ext.encode(o.config.db.where)
								}
								, url: my_url
							};
							o.config.db = null;
						}
					};
				} else {
					if (o.api) {
						if (o.api instanceof Object) {
							var api = {};
							if (o.api.create) api.create = o.api.create;
							if (o.api.read) api.read = o.api.read;
							if (o.api.update) api.update = o.api.update;
							if (o.api.destroy) api.destroy = o.api.destroy;
							var pudid = false;
							if (Auth.User) pudid = Auth.User.pudid;
							var proxy = {
								type: "direct"
								, extraParams: {
									pudid: pudid
								}
								, api: api
							};
						} else {
							var proxy = {
								type: "direct"
								, extraParams: {
									pudid: pudid
								}
								, directFn: o.api
							};
						};
						if (proxy) o.proxy = proxy;
						o.api = null;
					};
					if (o.db) {
						if (o.db.schema) {
							if (Settings.REMOTE_API) my_url = Settings.REMOTE_API + "/db/" + o.db.schema + ":model";
							o.proxy = {
								type: 'rest'
								, extraParams: {
									fields: Ext.encode(o.db.fields)
									, where: Ext.encode(o.db.where)
								}
								, url: my_url
							};
							o.db = null;
						}
					};
				};
				if (o.requires) {
					for (var i = 0; i < o.requires.length; i++) {
						o.requires[i] = APP_NAMESPACE + ".model." + o.requires[i];
					}
				};
				return Ext.define(APP_NAMESPACE + ".model." + name, o);
			}
		}
		, override: function (name, o) {
			return Ext.define(APP_NAMESPACE + '.overrides.' + name, o);
		}
		, store: {
			createColumns: function (grid, cb) {
				var store = grid.getStore();
				store.on('load', function (data) {
					var model = data.model.getFields();
					var tabs = [];
					for (var i = 0; i < model.length; i++) {
						tabs.push({
							text: model[i].name
							, width: 150
							, dataIndex: model[i].name
						});
					};
					grid.reconfigure(store, tabs);
					cb();
				});
			}
			, createEditorColumns: function (grid) {
				var store = grid.getStore();
				store.on('load', function (data) {
					var model = data.model.getFields();
					var tabs = [];
					for (var i = 0; i < model.length; i++) {
						console.log(model[i].type.type);
						var o = {
							text: model[i].name
							, width: 150
							, dataIndex: model[i].name
							, editor: {
								allowBlank: true
							}
							, field: field
						};
						var field = {};
						if (model[i].type.type == "int") {
							o.editor = {
								xtype: 'numberfield'
								, allowBlank: true
							};
							o.xtype = "numbercolumn";
							o.format = "0";
						};
						if (model[i].type.type == "date") {
							delete o.editor;
							o.xtype = "datecolumn";
							o.field = {
								xtype: 'datefield'
								, allowBlank: true
								, format: 'm/d/Y'
							};
						};
						tabs.push(o);
					};
					grid.reconfigure(store, tabs);
				});
			}
			, define: function (name, o) {
				o.extend = "Ext.data.Store";
				if (Settings.TYPE == "mobile") {
					if (o.config.model) o.config.model = APP_NAMESPACE + ".model." + o.config.model;
					if (o.requires) {
						for (var i = 0; i < o.requires.length; i++) {
							o.requires[i] = APP_NAMESPACE + ".model." + o.requires[i];
							o.config.model = o.requires[i];
						}
					}
				} else {
					if (o.model) {
						if (!o.requires) o.requires = [];
						o.requires[0] = o.model;
						o.model = APP_NAMESPACE + ".model." + o.model;
					};
					if (o.requires) {
						for (var i = 0; i < o.requires.length; i++) {
							o.requires[i] = APP_NAMESPACE + ".model." + o.requires[i];
							o.model = o.requires[i];
						}
					}
				}
				return Ext.define(APP_NAMESPACE + ".store." + name, o);
			}
			, get: function (name) {
				eval('var _p=' + APP_NAMESPACE + ".store." + name);
				return _p;
			}
			, create: function (name, cfg) {
				// generate uniqueid for temp model class
				function _guid() {
					return ("M" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4)
				};
				var guid = _guid();

				if (name instanceof Object == true) {
					cfg = name;
					if (cfg.type) var xtd=App.STOREMODELS[cfg.type]; else var xtd={name:"store",model:"Ext.data.Model",store:"Ext.data.Store"};
				} else {
					if (cfg) {
						if (cfg.type) var xtd=App.STOREMODELS[cfg.type]; else var xtd={name:"store",model:"Ext.data.Model",store:"Ext.data.Store"};
					} else {
						var xtd={name:"store",model:"Ext.data.Model",store:"Ext.data.Store"};
						var cfg={};
					};

                    // *** UQL string
					if (name.indexOf('://') > -1) {
						if ((Settings.TYPE == "mobile") && (Ext.getVersion().major < 5))
							App.model.define(guid, {
								config: {
									api: {
										read: "App.__QUERY__.exec"
									}
									, extraParams: {
										__SQL__: name
									}
								}
							},xtd.model);
						else
							App.model.define(guid, {
								api: {
									read: "App.__QUERY__.exec"
								}
								, extraParams: {
									__SQL__: name
								}
							},xtd.model);
						if (typeof cfg=='string') cfg={};
						cfg.model = APP_NAMESPACE + ".model." + guid;
						cfg.require = [];
						cfg.require[0] = APP_NAMESPACE + ".model." + guid;
					} else {
                        // *** WebService
						if (name.indexOf('.') > -1) {

							if ((Settings.TYPE == "mobile") && (Ext.getVersion().major < 5))
							App.model.define(guid,{config: {
								api: {
									read: name
								}
							}},xtd.model);
							else
							App.model.define(guid,{
								api: {
									read: name
								}
							},xtd.model);

							cfg.model = APP_NAMESPACE + ".model." + guid;
							cfg.require = [];
							cfg.require.push(APP_NAMESPACE + ".model." + guid);
						} else {
							if (typeof cfg=='string') cfg={};
							cfg.model = APP_NAMESPACE + ".model." + name;
							cfg.require = [];
							cfg.require[0] = APP_NAMESPACE + ".model." + name;
						}
					}
				};
				try {
					/*console.log(xtd.store);
					console.log(cfg);*/
					var myStore = Ext.create(xtd.store, cfg);
					if (!myStore.getProxy().extraParams) myStore.getProxy().extraParams = {};
					myStore.getProxy().extraParams.__SQL__ = name;
				} catch (e) {
					console.log(e);
				};
				return myStore;
			}
		}
		, require: function (n, cb) {
			var list = [];
			for (var j = 0; j < n.length; j++) {
				for (var el in Settings.PATHS) {
					if (el == n[j].substr(0, el.length)) {
						list.push(Settings.PATHS[el] + n[j].substr(el.length, 255).replace(/\./g, '/') + '.js');
					};
				};
			};
			if (list.length > 0) require(list, cb);
			else cb();
		}
		, controller: {
			define: function (name, o) {
				o.extend = "Ext.app.Controller";
				if (o.requires) {
					for (var i = 0; i < o.requires.length; i++) {
						o.requires[i] = APP_NAMESPACE + ".controller." + o.requires[i];
					}
				}
				return Ext.define(APP_NAMESPACE + ".controller." + name, o);
			}
			, create: function (name) {
				return Ext.create(APP_NAMESPACE + ".controller." + name);
			}
		}
		, view: {
			define: function (name, o) {
				if (o.requires) {
					for (var i = 0; i < o.requires.length; i++) {
						o.requires[i] = APP_NAMESPACE + ".view." + o.requires[i];
					}
				};
				return Ext.define(APP_NAMESPACE + ".view." + name, o);
			}
			, create: function (name, o) {
				if (o)
					return Ext.create(APP_NAMESPACE + ".view." + name, o);
				else
					return Ext.create(APP_NAMESPACE + ".view." + name);
			}
			, show: function (name, o) {
				if ((Settings.TYPE == "mobile") && (Ext.getVersion().major < 5)) {
					var viewport = Ext.Viewport;
					viewport.add(App.view.create(name));
					viewport.getLayout().setAnimation(o);
					viewport.setActiveItem(viewport.items.items.length - 1);
					return viewport.items.items.length - 1;
				} else {
					alert('not yet implemented');
				}
			}
			, hide: function (name, o) {
				if ((Settings.TYPE == "mobile") && (Ext.getVersion().major < 5)) {
					var viewport = Ext.Viewport;
					viewport.getLayout().setAnimation(o);
					viewport.setActiveItem(0);
				} else {
					alert('not yet implemented');
				}
			}
			, back: function (type, direction) {
				if ((Settings.TYPE == "mobile") && (Ext.getVersion().major < 5)) {
					var items
						, current
						, previous;

					items = Ext.Viewport.getItems();

					current = items.get(items.length - 1);
					previous = items.get(items.length - 2);

					Ext.Viewport.on({
						activeitemchange: function (itemToDestroy) {
							itemToDestroy.destroy();
						}
						, scope: this
						, single: true
						, order: 'after'
						, args: [current]
					});

					Ext.Viewport.animateActiveItem(previous, {
						type: type
						, direction: direction
					});
				} else {
					alert('not yet implemented');
				}
			}
		}
		, _kickstart: function (o, fn) {
			var _p = this;
			//document.getElementsByTagName('body')[0].style.background = "#FFFFFF";

			$('#appLoadingIcon').removeClass('slideInDown').addClass('slideOutUp');

			$('#bootstrap').fadeOut('slow', function () {
				if (Settings.TYPE == "mobile") {
					_p.FORMS = Ext.Viewport;
				} else {
					_p.FORMS = Ext.create('Ext.container.Viewport', {
						id: "OAContainer"
						, layout: "card"
						, border: false
						, items: []
					});

				};
				Ext.require(APP_NAMESPACE + '.view.' + o);
				Ext.onReady(function() {

					var kickstarter = Ext.create(APP_NAMESPACE + '.view.' + o);

					kickstarter.on('render', function (me) {
						if (fn) fn(me);
					});
					_p.FORMS.add(kickstarter);
				});
			});

		}
		, init: function (o, fn) {

			App.__INIT__ = o;
			App.uid = Math.uuid();
			App.__key__ = new Persist.Store(Settings.NAMESPACE.replace(/\./g, ''));
			App.key = {
				set: function (key, value) {
					if (!key) return false;
					if (!value) return false;
					if (value !== null && typeof value === 'object') value = JSON.stringify(value);
					App.__key__.set(key, value);
				}
				, remove: function (key) {
					App.__key__.remove(key);
				}
				, get: function (key) {
					var response = App.__key__.get(key);
					try {
						return JSON.parse(response);
					} catch (e) {
						return response;
					}

				}
			};

			if (!App.key.get('app.udid')) App.key.set('app.udid', Base64.encode(Math.uuid() + '|' + navigator.userAgent));
			App.udid = App.key.get('app.udid');

			User = {};
			App._kickstart(o, fn);
		}
		, _loadingfailed: function () {
			var o = document.getElementById('appLoadingFailed');
			document.getElementById('appLoadingIcon').style.opacity = "0.3";
			o.className = "appLoadingFailed";
			document.getElementById('appLoadingIndicator').style.display = "none";
		}
		, _loadCulture: function (fn) {
			// Culture
			try {
				Culture.init();
				Culture.update(fn);
			} catch (e) {
				// no culture
				fn();
			};
		}
		, __LOAD__: function (fn) {
			if (!fn) fn = Manifest;

			try {
				if (App.libs.length == 0)
					App._loadCulture(fn);
				else {
					try {
						Require(App.libs, function () {
							App._loadCulture(fn);
						});
					} catch(e) {
						require(App.libs, function () {
							App._loadCulture(fn);
						});
					}
				}
			} catch (e) {
				App._loadCulture(fn);
			};
		}
		, load: function (fn) {

			// API
			if (Settings.TYPE == "mobile") {
				if (!window.device) {
					if (!Settings.DEBUG) {
						Ext.define("omneedia.IO", {
							statics: {
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
							}
						});
						App.IO = omneedia.IO;

						if (Settings.REMOTE_API.indexOf('https')>-1)
						document.socket = io.connect(Settings.REMOTE_API, {secure: true,transports: ['xhr-polling']});
						else
						document.socket = io.connect(Settings.REMOTE_API);
						document.socket.on('connect', function () {
						});
						document.socket.on('disconnect', function () {});
					};
					App.__LOAD__(fn);
				} else {

				document.addEventListener("deviceready", function () {
					if (!Settings.DEBUG) {
						Ext.define("omneedia.IO", {
							statics: {
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
							}
						});
						App.IO = omneedia.IO;

						if (Settings.REMOTE_API.indexOf('https')>-1)
						document.socket = io.connect(Settings.REMOTE_API, {secure: true,transports: ['xhr-polling']});
						else
						document.socket = io.connect(Settings.REMOTE_API);
						document.socket.on('connect', function () {
						});
						document.socket.on('disconnect', function () {});

					};

					if (parseFloat(window.device.version) >= 7) {
						StatusBar.overlaysWebView(false);
						StatusBar.backgroundColorByHexString("#f8f9f9");
						StatusBar.styleDefault();
					};
					App.__LOAD__(fn);
				}, false);
				};
			} else App.__LOAD__(fn);
		}
		, add: function (name, fx) {
			var _p = this;

			if (fx) {
				fx = fx.split(':');
				var direction = fx[1];
				fx = fx[0];
			}
			try {
				Culture.update(function () {
					var form = Ext.create(APP_NAMESPACE + '.view.' + name);
					_p.FORMS.add(form);
				});
			} catch (e) {
				var form = Ext.create(APP_NAMESPACE + '.view.' + name);
				_p.FORMS.add(form);
			};
		}
		, items: function () {
			return this.FORMS.items.items;
		}
		, show: function (ndx) {
			FORMS.layout.setActiveItem(ndx);
		}
	}
});

/**
 * Convert an image
 * to a base64 url
 * @param  {String}   url
 * @param  {Function} callback
 * @param  {String}   [outputFormat=image/png]
 */
function convertImgToBase64URL(url, callback, outputFormat) {
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
}

if (Settings.DEBUG) {

	for (var i = 0; i < Settings.RESOURCES.length; i++) {
		var link = document.createElement('link');
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = Settings.RESOURCES[i];
		document.getElementsByTagName('head')[0].appendChild(link);
	};

};

/*
 * jQuery pageSlide
 * Version 2.0
 * http://srobbin.com/jquery-pageslide/
 *
 * jQuery Javascript plugin which slides a webpage over to reveal an additional interaction pane.
 *
 * Copyright (c) 2011 Scott Robbin (srobbin.com)
 * Dual licensed under the MIT and GPL licenses.
 */
;
(function (b) {
	function j(e, a) {
		if (0 === e.indexOf("#")) b(e).clone(!0).appendTo(c.empty()).show();
		else {
			if (a) {
				var d = b("<iframe />").attr({
					src: e
					, frameborder: 0
					, hspace: 0
					, scrolling: "no"
				}).css({
					width: "100%"
					, height: "100%"
					, overflow: 'hidden'
				});
				c.html(d)
			} else c.load(e);
			c.data("localEl", !1)
		}
	}

	function k(b, a) {
		var d = c.outerWidth(!0)
			, f = {}
			, g = {};

		if (!c.is(":visible") && !h) {

			h = !0;
			switch (b) {
			case "left":
				c.css({
					left: "auto"
					, right: "-" + d + "px"
				});
				f["margin-left"] = "-=" + d;
				g.right = "+=" + d;
				break;
			default:
				c.css({
					left: "-" + d + "px"
					, right: "auto"
				}), f["margin-left"] = "+=" + d, g.left = "+=" + d
			}
			l.animate(f, a);
			c.show().animate(g, a, function () {
				h = !1
			})
		}
	}
	var l = b("body")
		, c = b("#pageslide")
		, h = !1
		, m;
	0 == c.length && (c = b("<div />").attr("id", "pageslide").css("display", "none").appendTo(b("body")));
	b.fn.pageslide = function (e) {
		this.click(function (a) {
			var d = b(this)
				, f = b.extend({
					href: d.attr("href")
				}, e);
			a.preventDefault();
			a.stopPropagation();
			c.is(":visible") && d[0] == m ? b.pageslide.close() : (b.pageslide(f), m = d[0])
		})
	};
	b.fn.pageslide.defaults = {
		speed: 200
		, direction: "right"
		, modal: !1
		, iframe: !0
		, href: null
	};
	b.pageslide = function (e) {
		var a = b.extend({}, b.fn.pageslide.defaults, e);
		c.is(":visible") && c.data("direction") != a.direction ? b.pageslide.close(function () {
			j(a.href, a.iframe);
			k(a.direction, a.speed)
		}) : (j(a.href, a.iframe), c.is(":hidden") && k(a.direction, a.speed));
		c.data(a);
		document.getElementById('pageslide').style.position = 'absolute';
		document.getElementById('pageslide').style.top = '0px';
		document.getElementById('pageslide').style.overflow = 'hidden';
		document.getElementById('pageslide').style.height = '100%';
	};
	b.pageslide.close = function (c) {

		var a = b("#pageslide")
			, d = a.outerWidth(!0)
			, f = a.data("speed")
			, g = {}
			, i = {};
		if (!a.is(":hidden") && !h) {
			h = !0;
			switch (a.data("direction")) {
			case "left":
				g["margin-left"] = 0;
				i.right = "-=" + d;
				break;
			default:
				g["margin-left"] = "-=" + d, i.left = "-=" + d
			};
			a.animate(i, f);
			l.animate(g, f, function () {
				a.hide();
				h = !1;
				"undefined" != typeof c && c()
			})
		}
	};
	c.click(function (b) {
		b.stopPropagation()
	});
	b(document).bind("click keyup", function (e) {
		"keyup" == e.type && 27 != e.keyCode || c.is(":visible") && !c.data("modal") && b.pageslide.close()
	})
})(jQuery);

// extend $.ajax

(function ($, window, undefined) {
	//is onprogress supported by browser?
	var hasOnProgress = ("onprogress" in $.ajaxSettings.xhr());

	//If not supported, do nothing
	if (!hasOnProgress) {
		return;
	}

	//patch ajax settings to call a progress callback
	var oldXHR = $.ajaxSettings.xhr;
	$.ajaxSettings.xhr = function () {
		var xhr = oldXHR();
		if (xhr instanceof window.XMLHttpRequest) {
			xhr.addEventListener('progress', this.progress, false);
		}

		if (xhr.upload) {
			xhr.upload.addEventListener('progress', this.progress, false);
		}

		return xhr;
	};
})(jQuery, window);

function ParsedQueryString() {
	this._init();
}

ParsedQueryString.version = '1.0';

ParsedQueryString.prototype = {
	_init: function () {
		this._parameters = {};

		if (location.search.length <= 1)
			return;
		var pairs = location.search.substr(1).split(/[&;]/);
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i].split(/=/);
			var name = this._decodeURL(pair[0]);
			if (Boolean(pair[1])) {
				var value = this._decodeURL(pair[1]);
				if (Boolean(this._parameters[name]))
					this._parameters[name].push(value);
				else
					this._parameters[name] = [value];
			}
		}
	},

	_decodeURL: function (url) {
		return decodeURIComponent(url.replace(/\+/g, " "));
	},

	param: function (name) {
		if (Boolean(this._parameters[name]))
			return this._parameters[name][0];
		else
			return "";
	},

	params: function (name) {
		if (Boolean(name)) {
			if (Boolean(this._parameters[name])) {
				var values = [];
				for (var i = 0; i < this._parameters[name].length; i++)
					values.push(this._parameters[name][i]);
				return values;
			} else
				return [];
		} else {
			var names = [];
			for (var name in this._parameters)
				names.push(name);
			return names;
		}
	}
};

/*
 DB
 */

Ext.define("omneedia.DB", {
	statics: {
		remote: ""
		, namespace: ""
		, DB: ""
		, get: function (uri, cb, cb2) {
			function getAllChildren(panel) {
				var children = panel.items ? panel.items.items : [];
				Ext.each(children, function (child) {
					children = children.concat(getAllChildren(child));
				})
				return children;
			};
			if (cb instanceof Ext.Component) {
				App.__QUERY__.exec({
					__SQL__: uri
				}, function (o) {
					var oo = o;
					if (o.data.length >= 1) o = o.data[0];
					var all = getAllChildren(cb);
					for (var i = 0; i < all.length; i++) {
						if (all[i].bindTo) {
							if ((all[i].setValue) && (o[all[i].bindTo])) {
								if (all[i].xtype.indexOf('date') > -1) o[all[i].bindTo] = o[all[i].bindTo].toDate();
								all[i].setValue(o[all[i].bindTo]);
							}
						};
					};
					if (cb2) cb2(oo);
				});
			} else App.__QUERY__.exec({
				__SQL__: uri
			}, cb);
		}
		, del: function (uri, obj, cb) {
			var db = uri.split('://');
			if (!Array.isArray(obj)) {
				cb = obj;
				var obj = [];
				if (db[1].split('?').length >= 1) {
					var sp = db[1].split('?')[1];
					if (sp.indexOf('=') > -1) {
						sp = sp.split('=')[1];
					};
					console.log(sp);
					obj = sp.split(',');
				}
			};
			var table = db[1].split('?')[0];
			var field = db[1].split('?')[1];
			var db = db[0];
			console.log(db);
			console.log(table);
			console.log(obj);
			App.__QUERY__.del(db, table, obj, cb);
		}
		, post: function (uri, obj, cb) {
			var data = [];

			function getAllChildren(panel) {
				var children = panel.items ? panel.items.items : [];
				Ext.each(children, function (child) {
					children = children.concat(getAllChildren(child));
				})
				return children;
			};
			var db = uri.split('://');
			var table = db[1];
			var db = db[0];
			var data = {};
			var missingfields = [];
			if (obj instanceof Ext.Component) {
				var all = getAllChildren(obj);
				console.log(all);
				var witness = 0;
				for (var i = 0; i < all.length; i++) {
					if (all[i].bindTo) {
						if (all[i].getValue) {
							/*if (!all[i].allowBlank) {
								if ((all[i].getValue()=="") || (!all[i].getValue())) {
									witness=1;
									if (all[i].fieldLabel) missingfields.push(all[i].fieldLabel); else missingfields.push(all[i].bind);
								}
							};*/
							data[all[i].bindTo] = all[i].getValue();
						}
					};
				};
				if (witness == 0) App.__QUERY__.post(db, table, data, cb);
				else {
					var response = {
						result: {
							message: "MISSING_FIELDS"
							, success: false
							, data: missingfields
						}
					};
					cb(response);
				};
			} else App.__QUERY__.post(db, table, obj, cb);
		}
	}
});



/*
Init
*/

omneedia['app@ExtJS']={};


App.DB = omneedia.DB; // deprecated
DB = omneedia.DB;

App.loadLang = function(lang,url,cb) {
	function reqListener () {
		if (!this.response) this.response="";
		window.eval( 'i18n_framework["'+lang+'"]=function(){'+this.response+'};' );
		return cb();
	};
	function transferFailed() {
		// fallback
		window.eval( 'i18n_framework["'+lang+'"]=function(){};' );
		return cb();
	};
	var newXHR = new XMLHttpRequest();
	newXHR.addEventListener( 'load' , reqListener,false );
	//newXHR.addEventListener( "progress" , updateProgress, false);
	newXHR.addEventListener( "error" , transferFailed, false);
	//newXHR.addEventListener( "abort" , transferCanceled, false);	
	newXHR.open( 'GET', url.replace(/{lang}/g,lang) );
	newXHR.send();	
};

var windowWidth = window.screen.width < window.outerWidth ?
	window.screen.width : window.outerWidth;


/*
MODAL BLUR
*/

if (Settings.blur == "1") {
	Ext.define('patches.ExtZIndexManager', {
		override: 'Ext.ZIndexManager'
		, _hideModalMask: function (comp) {
			this.callParent(arguments);
			if (App._modal) {
				App._modal.unblur();
				delete App._modal;
			};
			try {
				this.mask.removeCls(this.customMaskCls);
			} catch (e) {};
		}
		, _showModalMask: function (comp) {
			this.callParent(arguments);
			App._modal = $('.x-panel').Vague().blur({
				intensity: 3
				, forceSVGUrl: false
				, animationOptions: {
					duration: 1000
					, easing: 'linear'
				}
			});
			// mask is a reusable element, so each time it needs to accept only the relevant style
			this.mask.removeCls(this.customMaskCls);
			this.customMaskCls = 'modal-mask-' + comp.ui;
			this.mask.addCls(this.customMaskCls);
		}
	});
};

var sort_by;
(function () {
	// utility functions
	var default_cmp = function (a, b) {
			if (a == b) return 0;
			return a < b ? -1 : 1;
		}
		, getCmpFunc = function (primer, reverse) {
			var cmp = default_cmp;
			if (primer) {
				cmp = function (a, b) {
					return default_cmp(primer(a), primer(b));
				};
			}
			if (reverse) {
				return function (a, b) {
					return -1 * cmp(a, b);
				};
			}
			return cmp;
		};

	// actual implementation
	sort_by = function () {
		var fields = []
			, n_fields = arguments.length
			, field, name, reverse, cmp;

		// preprocess sorting options
		for (var i = 0; i < n_fields; i++) {
			field = arguments[i];
			if (typeof field === 'string') {
				name = field;
				cmp = default_cmp;
			} else {
				name = field.name;
				cmp = getCmpFunc(field.primer, field.reverse);
			}
			fields.push({
				name: name
				, cmp: cmp
			});
		}

		return function (A, B) {
			var a, b, name, cmp, result;
			for (var i = 0, l = n_fields; i < l; i++) {
				result = 0;
				field = fields[i];
				name = field.name;
				cmp = field.cmp;

				result = cmp(A[name], B[name]);
				if (result !== 0) break;
			}
			return result;
		}
	}
}());









if (!Settings.DEBUG) {

		// PROD // DESKTOP

			if (Settings.REMOTE_API.indexOf('https')>-1)
			document.socket = io.connect(Settings.REMOTE_API, {secure: true,transports: ['xhr-polling']});
			else
			document.socket = io.connect(Settings.REMOTE_API);
			document.socket.on('connect', function () {});
			document.socket.on('disconnect', function () {});
			Ext.define("omneedia.IO", {
				statics: {
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
				}
			});
			App.IO = omneedia.IO;

};

