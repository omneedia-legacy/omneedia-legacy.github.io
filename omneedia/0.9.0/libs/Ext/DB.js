
App.define("App.DB", {
    statics : {
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
			} else {
				var db=uri.split('://')[0];
				if (Settings.DB[db]) {
					var param={
						url: Settings.DB[db],
						method: "POST",
						data: [
						{
							"action":	"__QUERY__",
							"method":	"exec",
							"data":	[
								{"__SQL__":	uri}
							],
							"type":	"rpc",
							"tid":	1
						}
						]
					};
					App.request(param,function(e,b) {
						if (!e) {
							var data=JSON.parse(b);
							console.log(data);
            				if (data.length>0) cb(data[0].result); else cb([]);
						} else return cb(false);
					});
				} else App.__QUERY__.exec({
					__SQL__: uri
				}, cb);
			}
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

DB = App.DB;