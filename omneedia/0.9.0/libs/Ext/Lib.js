/**
 * @method getAllChildren
 * return (object) All children of a panel 
 */
function getAllChildren(panel) {
	var children = panel.items ? panel.items.items : [];
	Ext.each(children, function (child) {
		children = children.concat(getAllChildren(child));
	})
	return children;
};
/**
 * @method getAllChildrenIds
 * return (Array) All children id of a panel 
 */
function getAllChildrenIds(panel) {
	var children = getAllChildren(panel);
	for (var i = 0, l = children.length; i < l; i++) {
		children[i] = children[i].getId();
	}
	return children;
};
Ext.define('Ext.overrides.layout.container.Container', {
	override: 'Ext.layout.container.Container'
	, notifyOwner: function () {
		this.owner.afterLayout(this);
	}
});
/**
 * Layout patcher
 * override Ext.layout.container.Container 
 */
Ext.define('Ext.overrides.layout.container.Container', {
	override: 'Ext.layout.container.Container'
	, notifyOwner: function () {
		this.owner.afterLayout(this);
	}
});
App.apply(App, {
	remote: ""
	, APP: {}
	, libs: []
	, namespace: Settings.NAMESPACE
	, /**
	 * @method getArray
	 * @param {Array} obj Array of objects
	 * @param {String} field
	 * 
	 * var o = [{field: "test"},{field: "test2"}];
	 * var arr=getArray(o,'field');
	 * result in ["test","test2"];
	 * @return (Array) - flat array from an array of objects 
	 */
	getArray: function (obj, field) {
		var data = [];
		for (var i = 0; i < obj.length; i++) {
			data.push(obj[i][field]);
		};
		return data;
	}
});
/**
 * @namespace App
 * @class info
 * 
 */
App.define('App.info', {
	statics: {
		loading: function (alpha) {
			if (!alpha) alpha = "";
			var opts = {
				lines: 13
				, length: 11
				, width: 5
				, radius: 17
				, corners: 1
				, rotate: 0
				, color: '#FFF'
				, speed: 1
				, trail: 60
				, shadow: false
				, hwaccel: false
				, className: 'spinner'
				, zIndex: 2e9
				, top: 'auto'
				, left: 'auto'
			};
			var target = document.createElement("div");
			document.body.appendChild(target);
			var spinner = new Spinner(opts).spin(target);
			App._loading = _Overlay({
				text: alpha
				, spinner: spinner
			});
		}
		, success: function (alpha) {
			if (!alpha) alpha = "";
			App._loading = _Overlay({
				icon: "overlay_check"
				, text: alpha
			});
		}
		, error: function (alpha) {
			if (!alpha) alpha = "";
			App._loading = _Overlay({
				icon: "overlay_error"
				, text: alpha
			});
		}
		, hide: function () {
			if (App._loading) App._loading.hide();
		}
	}
});
/**
 * @class App
 * @method stores
 * return all the stores components listed in an Ext component
 * @param {Ext} Ext component
 * @param {String} field
 * 
 */
App.apply(App, {
	stores: function (x) {
		var cc = 0;

		function getAllChildren(panel) {
			var children = panel.items ? panel.items.items : [];
			Ext.each(children, function (child) {
				children = children.concat(getAllChildren(child));
			})
			return children;
		};

		function counter(l, cb) {
			if (cc == l) cb();
			cc++;
		};
		var tab = [];
		if (x instanceof Ext.Component) {
			var all = getAllChildren(x);
			for (var i = 0; i < all.length; i++) {
				if (all[i].store) {
					tab.push(all[i].getStore());
				};
			};
			return {
				get: function () {
					return tab;
				}
				, on: function (event, cb) {
					for (var i = 0; i < tab.length; i++) {
						tab[i].on(event, function (x) {
							counter(tab.length - 1, cb);
						});
					};
				}
			};
		}
		else return false;
	}
});
App.apply(App, {
	get: function (x, z) {
		if (!z) {
			if (Ext.ComponentQuery.query(x).length > 0) return Ext.ComponentQuery.query(x)[0];
			else return null;
		}
		else {
			if (typeof x === 'object') {
				if (x.query(z).length > 0) return x.query(z)[0];
			}
			else return null;
		}
	}
	, getData: function (obj) {
		function getAllChildren(panel) {
			var children = panel.items ? panel.items.items : [];
			Ext.each(children, function (child) {
				children = children.concat(getAllChildren(child));
			})
			return children;
		};
		var data = {};
		var missingfields = [];
		if (obj instanceof Ext.Component) {
			var all = getAllChildren(obj);
			var witness = 0;
			for (var i = 0; i < all.length; i++) {
				if (all[i].bindTo) {
					if (all[i].getValue) {
						data[all[i].bindTo] = all[i].getValue();
					}
				}
				else {
					if (all[i].getValue) {
						if (all[i].itemId) data[all[i].xtype + '#' + all[i].itemId] = all[i].getValue();
					}
				}
			};
			return data;
		}
		else return {
			result: {
				message: "MISMATCHED_TYPE"
				, success: false
			}
		};
	}
	, getAll: function (x, z) {
		if (!z) return Ext.ComponentQuery.query(x);
		else {
			if (typeof x === 'object') return x.query(z);
		}
	}
	/*, notify: function (label, conf) {
		Ext.create('widget.uxNotification', {
			position: 'tr'
			, cls: 'ux-notification-light'
			, closable: true
			, title: window.title
			, width: 250
			, height: 115
			, iconCls: 'ux-notification-icon-information'
			, html: label
		}).show();
	}*/
	, using: function (namespace) {
		var _p = this;
		this.namespace = Settings.NAMESPACE;
		var url = Settings.REMOTE_API + "/api/" + namespace + "?javascript";
		if (Settings.DEBUG) {
			App.libs.push(url);
		}
	}
	, STOREMODELS: {
		'tree': {
			name: "treestore"
			, model: "Ext.data.TreeModel"
			, store: "Ext.data.TreeStore"
		}
		, 'events': {
			name: "eventstore"
			, model: "Ext.ux.Scheduler.model.Event"
			, store: "Ext.ux.Scheduler.data.EventStore"
		}
		, 'resources': {
			name: "resourcestore"
			, model: "Ext.ux.Scheduler.model.Resource"
			, store: "Ext.ux.Scheduler.data.ResourceStore"
		}
		, 'resourcestree': {
			name: "resourcestore"
			, model: "Ext.ux.Scheduler.model.Resource"
			, store: "Ext.ux.Scheduler.data.ResourceTreeStore"
		}
	}
	, items: function () {
		return this.FORMS.items.items;
	}
	, FORMS: {}
	, show: function (ndx) {
		this.FORMS.layout.setActiveItem(ndx);
	}
	, override: function (name, o) {
		return Ext.define(Settings.NAMESPACE + '.overrides.' + name, o);
	}
});
/**
 * @namespace App
 * @class model
 * Implement the Model Abstraction class (MVC)
 * 
 */
App.define('App.model', {
	statics: {
		get: function (name) {
			eval('var _p=' + Settings.NAMESPACE + ".model." + name);
			return _p;
		}
		, create: function (cfg) {
			return Ext.define('MODEL_' + Math.uuid(), cfg);
		}
		, define: function (name, o, z) {
			if (!z) o.extend = "Ext.data.Model";
			else o.extend = z;
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
				}
				else {
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
			if (o.requires) {
				for (var i = 0; i < o.requires.length; i++) {
					o.requires[i] = Settings.NAMESPACE + ".model." + o.requires[i];
				}
			};
			return Ext.define(Settings.NAMESPACE + ".model." + name, o);
		}
	}
});
/**
 * @namespace App
 * @class view
 * Implement the View Abstraction class (MVC)
 * 
 */
App.define('App.view', {
	statics: {
		define: function (name, o) {
			if (o.requires) {
				for (var i = 0; i < o.requires.length; i++) {
					o.requires[i] = Settings.NAMESPACE + ".view." + o.requires[i];
				}
			};
			return Ext.define(Settings.NAMESPACE + ".view." + name, o);
		}
		, create: function (name, o) {
			if (o) return Ext.create(Settings.NAMESPACE + ".view." + name, o);
			else return Ext.create(Settings.NAMESPACE + ".view." + name);
		}
		, show: function (name, o) {
			alert('not yet implemented');
		}
		, hide: function (name, o) {
			alert('not yet implemented');
		}
		, back: function (type, direction) {
			alert('not yet implemented');
		}
	}
});
/**
 * @namespace App
 * @class store
 * Implement the Store Abstraction class (MVC)
 * 
 */
App.define("App.store", {
	statics: {
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
			if (o.model) {
				if (!o.requires) o.requires = [];
				o.requires[0] = o.model;
				o.model = Settings.NAMESPACE + ".model." + o.model;
			};
			if (o.requires) {
				for (var i = 0; i < o.requires.length; i++) {
					o.requires[i] = Settings.NAMESPACE + ".model." + o.requires[i];
					o.model = o.requires[i];
				}
			};
			return Ext.define(Settings.NAMESPACE + ".store." + name, o);
		}
		, get: function (name) {
			eval('var _p=' + Settings.NAMESPACE + ".store." + name);
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
				if (cfg.type) var xtd = App.STOREMODELS[cfg.type];
				else var xtd = {
					name: "store"
					, model: "Ext.data.Model"
					, store: "Ext.data.Store"
				};
			}
			else {
				if (cfg) {
					if (cfg.type) var xtd = App.STOREMODELS[cfg.type];
					else var xtd = {
						name: "store"
						, model: "Ext.data.Model"
						, store: "Ext.data.Store"
					};
				}
				else {
					var xtd = {
						name: "store"
						, model: "Ext.data.Model"
						, store: "Ext.data.Store"
					};
					var cfg = {};
				};
				// *** UQL string
				if (name.indexOf('://') > -1) {
					App.model.define(guid, {
						api: {
							read: "App.__QUERY__.exec"
						}
						, extraParams: {
							__SQL__: name
						}
					}, xtd.model);
					if (typeof cfg == 'string') cfg = {};
					cfg.model = Settings.NAMESPACE + ".model." + guid;
					cfg.require = [];
					cfg.require[0] = Settings.NAMESPACE + ".model." + guid;
				}
				else {
					// *** WebService
					if (name.indexOf('.') > -1) {
						App.model.define(guid, {
							api: {
								read: name
							}
						}, xtd.model);
						cfg.model = Settings.NAMESPACE + ".model." + guid;
						cfg.require = [];
						cfg.require.push(Settings.NAMESPACE + ".model." + guid);
					}
					else {
						if (typeof cfg == 'string') cfg = {};
						cfg.model = Settings.NAMESPACE + ".model." + name;
						cfg.require = [];
						cfg.require[0] = Settings.NAMESPACE + ".model." + name;
					}
				}
			};
			try {
				var myStore = Ext.create(xtd.store, cfg);
				if (!myStore.getProxy().extraParams) myStore.getProxy().extraParams = {};
				myStore.getProxy().extraParams.__SQL__ = name;
			}
			catch (e) {
				console.log(e);
			};
			return myStore;
		}
	}
});
/**
 * @namespace App
 * @class controller
 * Implement the Controller Abstraction class (MVC)
 * 
 */
App.define('App.controller', {
	statics: {
		define: function (name, o) {
			o.extend = "Ext.app.Controller";
			if (o.requires) {
				for (var i = 0; i < o.requires.length; i++) {
					o.requires[i] = Settings.NAMESPACE + ".controller." + o.requires[i];
				}
			};
			return Ext.define(Settings.NAMESPACE + ".controller." + name, o);
		}
		, create: function (name) {
			return Ext.create(Settings.NAMESPACE + ".controller." + name);
		}
	}
});