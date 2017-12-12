App.define("App.DB", {
    statics: {
        remote: "",
        namespace: "",
        DB: "",
        get: function(uri, cb, cb2) {
            var db = uri.split('://')[0];
            if (Settings.DB[db]) {
                var param = {
                    url: Settings.DB[db],
                    method: "POST",
                    data: [{
                        "action": "__QUERY__",
                        "method": "exec",
                        "data": [
                            { "__SQL__": uri }
                        ],
                        "type": "rpc",
                        "tid": 1
                    }]
                };
                App.request(param, function(e, b) {
                    if (!e) {
                        var data = JSON.parse(b);
                        if (data.length > 0) cb(data[0].result);
                        else cb([]);
                    } else return cb(false);
                });
            } else App.__QUERY__.exec({
                __SQL__: uri
            }, cb);

        },
        del: function(uri, obj, cb) {
            var db = uri.split('://');
            if (!Array.isArray(obj)) {
                cb = obj;
                var obj = [];
                if (db[1].split('?').length >= 1) {
                    var sp = db[1].split('?')[1];
                    if (sp.indexOf('=') > -1) {
                        sp = sp.split('=')[1];
                    };
                    obj = sp.split(',');
                }
            };
            var table = db[1].split('?')[0];
            var field = db[1].split('?')[1];
            var db = db[0];
            App.__QUERY__.del(db, table, obj, cb);
        },
        post: function(uri, obj, cb) {
            var data = [];
            var db = uri.split('://');
            var table = db[1];
            var db = db[0];
            var data = {};
            var missingfields = [];
            App.__QUERY__.post(db, table, obj, cb);
        }
    }
});

DB = App.DB;