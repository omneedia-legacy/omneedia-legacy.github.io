function setToken() {
    var d = new Date().toMySQL().split(' ')[0];
    return Base64.encode(md5(d));
};

if (Settings.REMOTE_API) {
    if (Settings.REMOTE_API.indexOf('https') > -1)
        document.socket = io.connect(Settings.REMOTE_API, {
            query: "engine=worker&iokey=" + setToken() + '&z=' + window.z,
            secure: true,
            transports: ['polling']
        });
    else
        document.socket = io.connect(Settings.REMOTE_API, {
            query: "engine=worker&iokey=" + setToken() + '&z=' + window.z,
            reconnection: true,
            reconnectionDelay: 1000
        });
}


if (Settings.DEBUG) {
    document.socket.on('connect', function () {
        App.unblur();
        try {
            document.querySelector('.omneedia-overlay').style.display = "none";
        } catch (e) {

        };
    });
}

document.socket.on('disconnect', function () {
    if (Settings.DEBUG) App.blur();
});

document.socket.on('connect', function () {

});

if (Settings.DEBUG) {
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
}

document.socket.on('SERVER__LOG', function (data) {
    console.log('%c ' + 'LOG:', 'color: #00F; font-size:12px', data);
});
document.socket.on('SERVER__INFO', function (data) {
    console.info('%c' + 'INFO: \n', 'color: green; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
});
document.socket.on('SERVER__WARN', function (data) {
    console.warn('%c' + 'WARN: \n', 'color: orange; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
});
document.socket.on('SERVER__DEBUG', function (data) {
    console.debug('%c' + 'DEBUG: \n', 'color: black; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
});
document.socket.on('SERVER__ERROR', function (data) {
    console.error('%c' + 'ERROR: \n', 'color: red; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
});



App.define("App.IO", {
    socket: {},
    constructor: function (cc) {
        if (!cc) return false;
        if (cc.indexOf('https') > -1)
            this.socket = io(cc, {
                secure: true,
                transports: ['polling']
            });
        else
            this.socket = io(cc, {
                transports: ['polling']
            });
    },
    connect: function (cc) {
        if (cc.indexOf('https') > -1)
            this.socket = io(cc, {
                secure: true,
                transports: ['polling']
            });
        else
            this.socket = io(cc);
    },
    subscribe: function (uri) {
        uri = uri.split(' ');
        for (var i = 0; i < uri.length; i++) {
            if (uri[i].indexOf("#") > -1) this.socket.emit('#create', uri[i]);
        }
    },
    on: function (event, cb) {
        this.socket.on(event, cb);
    },
    send: function (uri, data, users) {
        var o = {
            uri: uri,
            data: data,
            users: users
        };
        if (uri.indexOf("#") > -1) this.socket.emit('#send', JSON.stringify(o));
    }

});