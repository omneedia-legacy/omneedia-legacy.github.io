App.apply(App, {
    control: {
        create: function (el, data, methods, sss) {
            var obj = {};
            obj.template = el;
            obj.data = data;
            obj.methods = methods;
            if (sss) {
                var arr = {};
                Object.assign(arr, obj, sss);
                obj = arr;
            };
            return new Vue(obj)
        }
    },
    controls: [],
    stacks: {
        views: {},
        controllers: {},
        viewControllers: {},
        requires: {},
        isLoaded: {}
    },
    config: {},
    /**
     * @namespace App
     * @class application
     * Implement the application (MVC)
     * 
     */
    application: function (o) {
        this.config = o;

        if (o.launch) o.launch();

        function loadRequire(req, ndx, cb) {
            if (!req) req = [];
            if (!req[ndx]) return cb();
            if (App.stacks.requires[req[ndx]]) return loadRequire(req, ndx + 1, cb);
            if (!Settings.DEBUG) return loadRequire(req, ndx + 1, cb);
            if (req[ndx].indexOf('api') > -1) {
                var classname = req[ndx].split('.')[1];
                var url = Settings.REMOTE_API + Settings.API_REMOTE[classname];
            };
            App.request(url, function (e, b) {
                App.stacks.requires[req[ndx]] = b;
                window.eval(b);
                loadRequire(req, ndx + 1, cb);
            });
        };

        function loadControllers(ctrl, ndx, cb) {
            if (!ctrl[ndx]) return cb();
            if (App.stacks.controllers[ctrl[ndx]]) return loadControllers(ctrl, ndx + 1, cb);
            if (!Settings.DEBUG) return loadControllers(ctrl, ndx + 1, cb);
            var url = Settings.PATHS['Contents'] + '/controller/' + ctrl[ndx] + '.js';
            App.request(url, function (e, b) {
                App.stacks.controllers[ctrl[ndx]] = b;
                window.eval(b);
                var Require = App.controller[ctrl[ndx]].require;
                loadRequire(Require, 0, function () {
                    loadControllers(ctrl, ndx + 1, cb);
                });
            });
        };

        function loadViewControllers(ctrl, ndx, cb) {
            if (!ctrl[ndx]) return cb();
            if (App.stacks.viewControllers[ctrl[ndx]]) return loadViewControllers(ctrl, ndx + 1, cb);
            if (!Settings.DEBUG) return loadViewControllers(ctrl, ndx + 1, cb);
            var url = Settings.PATHS['Contents'] + '/view/' + ctrl[ndx] + '/' + ctrl[ndx] + '.js';
            App.request(url, function (e, b) {
                App.stacks.viewControllers[ctrl[ndx]] = b;
                window.eval(b);
                var Require = App.viewController[ctrl[ndx]].require;
                loadRequire(Require, 0, function () {
                    loadViewControllers(ctrl, ndx + 1, cb);
                });
            });
        };

        function initMainController() {
            var maincontroller = o.controllers[0];
            if (App.controller[maincontroller].init) {
                App.controller[maincontroller].init();
                App.controller[maincontroller].isLoaded = true;
            };

        };

        document.addEventListener("deviceready", function () {
            if (window.StatusBar) StatusBar.hide();
            App.getAcceptedLangs(function (lang) {
                App.loadLang(lang, function () {
                    loadControllers(o.controllers, 0, function () {
                        loadViewControllers(o.viewControllers, 0, initMainController);
                    });
                })
            });
        }, false);

    },
    /**
     * @namespace App
     * @class controller
     * Implement the Controller Abstraction class (MVC)
     * 
     */
    controller: {
        define: function (name, obj) {
            var me = this;
            obj.isLoaded = false;
            obj.control = function (o) {
                obj.controls = o;
            };
            App.controller[name] = obj;
        }
    },
    /**
     * @namespace App
     * @class viewcontroller
     * Implement the Controller Abstraction class (MVC)
     * 
     */
    viewController: {
        define: function (name, obj) {
            var me = this;
            obj.isLoaded = false;
            obj.control = function (o) {
                obj.controls = o;
            };
            App.viewController[name] = obj;
        }
    },
    init: function (view, onload) {

        function setup(c, v) {
            var page = {
                id: v
            };
            if (Settings.DEBUG) {
                var link = document.createElement('link');
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = Settings.PATHS['Contents'] + '/view/' + page.id + '/' + page.id + '.css';
                document.getElementsByTagName('head')[0].appendChild(link);
            };
            App.request(Settings.PATHS['Contents'] + '/view/' + page.id + '/' + page.id + '.html', function (e, b) {
                App.$('ion-app').html(b);
            });
            return;
            var o = App.config;
            for (var i = 0; i < o.controllers.length; i++) {
                if (App.controller[o.controllers[i]].init) {
                    if (App.controller[o.controllers[i]].isLoaded === false) {
                        App.controller[o.controllers[i]].isLoaded = true;
                        App.controller[o.controllers[i]].init();
                    };
                };
                if (App.controller[o.controllers[i]].views.indexOf(page.id) > -1) {
                    if (App.controller[o.controllers[i]].controls) {
                        if (App.controller[o.controllers[i]].controls[page.id]) {
                            var page = App.controller[o.controllers[i]].controls[page.id];
                            for (var elx in page) {
                                if (elx != "view") {
                                    var config = page[elx];
                                    if ((config.data) || (config.methods)) {
                                        config.el = elx;
                                        App.control[elx] = new Vue(config);
                                        if (App.controls.indexOf(elx) == -1) App.controls.push(elx);
                                    } else {
                                        for (var events in page[elx]) {
                                            var evt = App.controller[o.controllers[i]][page[elx][events]];
                                            if (typeof page[elx][events] === "function") {
                                                App.$(elx).on(events, page[elx][events]);
                                            };
                                            if (typeof page[elx][events] === "string") {
                                                App.$(elx).on(events, App.controller[o.controllers[i]][page[elx][events]]);
                                            }
                                        }
                                    }

                                }
                            }
                        }
                    }
                };
            };
        };

        var maincontroller = -1;
        var me = this;

        for (var el in App.controller) {
            if (App.controller[el].init) var maincontroller = App.controller[el];
        };

        setup(maincontroller, view);

        if (maincontroller == -1) return;

    }
});