var DB = /** @class */ (function () {
    function DB() {
    }
    DB.get = function (uri, cb) {
        function ajax(o) {
            var xhr = new XMLHttpRequest();
            xhr.open(o.type, o.url);
            xhr.setRequestHeader('Content-Type', o.contentType);
            xhr.onload = function () {
                if (xhr.status === 200)
                    o.success(xhr.responseText);
                else {
                    if (o.error)
                        o.error(xhr.status);
                }
            };
            if ((typeof o.data === "object") && (o.data !== null))
                xhr.send(JSON.stringify(o.data));
            else
                xhr.send(o.data);
        }
        if (uri.indexOf('://') == -1)
            return cb(false);
        var post = [
            {
                "action": "__QUERY__",
                "method": "exec",
                "data": [
                    { "__SQL__": uri }
                ],
                "type": "rpc",
                "tid": 1
            }
        ];
        var url = Settings.DB[uri.split('://')[0]];
        url += "/api";
        url = url.replace(/([^:]\/)\/+/g, url);
        ajax({
            type: 'post',
            url: url,
            data: JSON.stringify(post),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                data = JSON.parse(data);
                cb(data[0].result);
            }
        });
    };
    return DB;
}());
export { DB };
//# sourceMappingURL=DB.js.map