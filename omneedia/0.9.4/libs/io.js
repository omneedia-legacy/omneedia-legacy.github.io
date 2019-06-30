function setToken() {
    var d = new Date().toMySQL().split(' ')[0];
    return Base64.encode(md5(d));
};

window.addEventListener('offline', function (event) {
    window.live('off');
});
window.addEventListener('online', function (event) {
    window.live('on');
});

if (Settings.REMOTE_API) {

    App.apply(App, {
        io: {
            socket: {},
            connect: function (options) {
                var me = this;
                if (!options) options = {};
                options = App.apply(options, {
                    autoReconnect: true,
                    autoReconnectOptions: {
                        initialDelay: 1000
                    },
                    port: Settings.REMOTE_API.substr(Settings.REMOTE_API.lastIndexOf(':') + 1, 255).match(/\d+/)[0] * 1 * 1
                });
                if (!options.port) options.port = 443;
                //window.socket = socketCluster.create(options);
                window.socket = socketCluster.create();
                this.socket = window.socket;

                if (Settings.DEBUG) {
                    window.socket.on('#log #server', function (data) {
                        console.log('%c ' + 'LOG:', 'color: #00F; font-size:12px', data);
                    });
                };

                this.socket.on('connect', function (s) {
                    App.status = s;
                    if (Settings.DEBUG) {
                        console.log('%c*** omneedia is running in development mode', 'font-weight:bold');
                        App.unblur();
                        try {
                            document.querySelector('.omneedia-overlay').style.display = "none";
                        } catch (e) {

                        };
                    };
                    var event = new Event('connect');
                    me.dispatchEvent(event);
                });
                this.socket.on('disconnect', function (s) {
                    if (Settings.DEBUG) {
                        App.blur();
                        setTimeout(function () {
                            document.location.reload(true);
                        }, 2000);
                        try {
                            document.querySelector('.omneedia-overlay').style.display = "";
                        } catch (e) {

                        };
                    };
                    var event = new Event('disconnect');
                    me.dispatchEvent(event);
                });

            },
            subscribe: function (str, options, cb) {
                var me = this;
                var sc = this.socket.subscribe(str, options);
                this.socket.emit(str);
                sc.on('subscribe', function (r) {
                    me.socket.emit(str);
                    if (cb) cb(null, r);
                });
                sc.on('subscribeFail', function (err) {
                    if (cb) cb(err);
                });
                return sc;
            },
            send: function (event, str, opt) {
                return this.socket.emit(event, str, cb);
            },
            on: function (s, cb) {
                return this.socket.on(s, cb);
            },
            off: function (s, cb) {
                return this.socket.off(s, cb);
            },
            publish: function (channelName, data, callback) {
                return this.socket.publish(channelName, data, callback);
            },
            unsubscribe: function (channelName) {
                return this.socket.unsubscribe(channelName);
            },
            watch: function (channelName, handler) {
                return this.socket.watch(channelName, handler);
            },
            unwatch: function (channelName, handler) {
                return this.socket.unwatch(channelName, handler);
            },
            watchers: function (channelName) {
                return this.socket.watchers(channelName);
            },
            subscriptions: function () {
                return this.socket.subscriptions(true);
            }
        }
    });
    App.io.connect();

}