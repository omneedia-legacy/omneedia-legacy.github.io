App.define("App.DB", {
    statics: {
        remote: "",
        namespace: "",
        DB: "",
        ajax: function(o) {
            var xhr = new XMLHttpRequest();
            xhr.open(o.type, o.url);
            xhr.setRequestHeader('Content-Type', o.contentType);
            xhr.onload = function() {
                if (xhr.status === 200) o.success(xhr.responseText);
                else {
                    if (o.error) o.error(xhr.status);
                }
            };
            if ((typeof o.data === "object") && (o.data !== null)) xhr.send(JSON.stringify(o.data));
            else xhr.send(o.data);
        },
        get: function(uri, cb, cb2) {
            var db = uri.split('://')[0];
            if (Settings.DB[db]) {

                var post = [{
                    "action": "__QUERY__",
                    "method": "exec",
                    "data": [{ "__SQL__": uri }],
                    "type": "rpc",
                    "tid": 1
                }];

                this.ajax({
                    type: 'post',
                    url: Settings.DB[db],
                    data: JSON.stringify(post),
                    contentType: "application/json; charset=utf-8",
                    success: function(data) {
                        data = JSON.parse(data);
                        if (typeof data[0].data === "string") return cb(data[0].data);
                        if (!typeof data[0].result) return cb(data[0]);
                        cb(data[0].result);
                    }
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

            if (Settings.DB[db]) {

                var post = [{
                    "action": "__QUERY__",
                    "method": "del",
                    "data": [db, table, obj],
                    "type": "rpc",
                    "tid": 1
                }];

                this.ajax({
                    type: 'post',
                    url: Settings.DB[db],
                    data: JSON.stringify(post),
                    contentType: "application/json; charset=utf-8",
                    success: function(data) {
                        data = JSON.parse(data);
                        if (typeof data[0].data === "string") return cb(data[0].data);
                        if (!typeof data[0].result) return cb(data[0]);
                        cb(data[0].result);
                    }
                });

            } else App.__QUERY__.del(db, table, obj, cb);
        },
        post: function(uri, obj, cb) {
            var data = [];
            var db = uri.split('://');
            var table = db[1];
            var db = db[0];
            var data = {};
            var missingfields = [];
            if (Settings.DB[db]) {

                var post = [{
                    "action": "__QUERY__",
                    "method": "post",
                    "data": [db, table, obj],
                    "type": "rpc",
                    "tid": 1
                }];

                this.ajax({
                    type: 'post',
                    url: Settings.DB[db],
                    data: JSON.stringify(post),
                    contentType: "application/json; charset=utf-8",
                    success: function(data) {
                        data = JSON.parse(data);
                        if (typeof data[0].data === "string") return cb(data[0].data);
                        if (!typeof data[0].result) return cb(data[0]);
                        cb(data[0].result);
                    }
                });

            } else App.__QUERY__.post(db, table, obj, cb);
        }
    }
});

DB = App.DB;