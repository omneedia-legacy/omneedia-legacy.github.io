try {
	if (!App) App={};	
} catch(e) {
	App={};
}

App.DB = {
	remote: ""
	, namespace: ""
	, DB: ""
	, get: function (uri, cb, cb2) {
		if (uri.indexOf('://')==-1) return cb(false);
		var post=[
		{
			"action":	"__QUERY__",
			"method":	"exec",
			"data":	[
				{"__SQL__":	uri}
			],
			"type":	"rpc",
			"tid":	1
		}
		];
		var url=Settings.DB[uri.split('://')[0]];
		url+="/api";
		url=url.replace(/([^:]\/)\/+/g, url);
		$.ajax({
            type: 'post',
            url: url,
            data: JSON.stringify(post),
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function (data) {
				data=JSON.parse(data);
            	cb(data[0].result);
            }
        });
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

		/*function getAllChildren(panel) {
			var children = panel.items ? panel.items.items : [];
			Ext.each(children, function (child) {
				children = children.concat(getAllChildren(child));
			})
			return children;
		};*/
		var db = uri.split('://');
		var table = db[1];
		var db = db[0];
		var data = {};
		var missingfields = [];
		/*if (obj instanceof Ext.Component) {
			var all = getAllChildren(obj);
			console.log(all);
			var witness = 0;
			for (var i = 0; i < all.length; i++) {
				if (all[i].bindTo) {
					if (all[i].getValue) {
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
		}
		else
		*/
		App.__QUERY__.post(db, table, obj, cb);
	}
};