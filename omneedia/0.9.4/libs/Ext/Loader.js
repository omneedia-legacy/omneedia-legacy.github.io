/**
 * Loader module
 * 
 */

App.apply(App, {
    init: function (o, fn) {
        App.__INIT__ = o;
        if (!App.key.get('app.udid')) App.key.set('app.udid', Base64.encode(App.uuid() + '|' + navigator.userAgent));
        App.udid = App.key.get('app.udid');
        User = {};

        App._kickstart(o, fn);
    },
    init_langs: function () {
        for (var i = 0; i < Settings.LANGS.length; i++) {
            if (i == 0) var default_lang = Settings.LANGS[i].toUpperCase();
        };
        if (!window.localStorage.LANG) window.localStorage.LANG = default_lang;
        document.body.lang = window.localStorage.LANG;
    },
    _kickstart: function (o, fn) {
        var _p = this;

        if (window.Kickstart) {
            if (Kickstart.load) Kickstart.load();
        };
        if (Settings.TYPE != "mobile") {
            _p.FORMS = Ext.create('Ext.container.Viewport', {
                id: "OAContainer",
                layout: "card",
                border: false,
                items: []
            });
        };
        Ext.require(Settings.NAMESPACE + '.view.' + o);
        Ext.onReady(function () {
            var kickstarter = Ext.create(Settings.NAMESPACE + '.view.' + o);
            kickstarter.on('render', function (me) {
                if (window.Kickstart) {
                    if (Kickstart.ready) Kickstart.ready();
                    _p.init_langs();
                };
                if (fn) fn(me);
            });
            _p.FORMS.add(kickstarter);
        });
    },
    load: function (fn) {

        App.request('/registry.json', function (e, r) {
            try {
                Settings.registry = JSON.parse(r);
            } catch (e) {
                Settings.registry = {};
            };

            APP_NAMESPACE = Settings.NAMESPACE;
            LANGS = Settings.LANGS;

            Ext.Loader.setConfig({
                enabled: true,
                paths: Settings.PATHS
            });

            var init = function () {

                Ext.application({

                    name: APP_NAMESPACE,

                    appFolder: "",
                    autoCreateViewport: false,

                    controllers: Settings.CONTROLLERS,

                    launch: function () {
                        Ext.enableAriaButtons = false;
                        Ext.enableAriaPanels = false;
                    }

                });

            };

            function __loader__(i) {
                if (!i) var i = 0;
                if (!Settings.ux) {
                    for (var i = 0; i < Settings.API.length; i++) {
                        App.using(Settings.API[i]);
                    };
                    if (!App.libs) init();
                    else App.require(App.libs, init);
                } else {
                    if (i < Settings.ux.length) {
                        App.require(Settings.ux[i], function () {
                            __loader__(i + 1);
                        });
                    } else {
                        for (var i = 0; i < Settings.API.length; i++) {
                            App.using(Settings.API[i]);
                        };
                        if (!App.libs) init();
                        else App.require(App.libs, init);
                    }
                }

            };

            __loader__();



        });

    }

});