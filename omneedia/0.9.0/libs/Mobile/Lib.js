App.apply(App, {
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
    application: function(o) {
        this.config = o;

        function loadRequire(req, ndx, cb) {
            if (!req) req = [];
            if (!req[ndx]) return cb();
            if (App.stacks.requires[req[ndx]]) return loadRequire(req, ndx + 1, cb);
            if (!Settings.DEBUG) return loadRequire(req, ndx + 1, cb);
            if (req[ndx].indexOf('api') > -1) {
                var classname = req[ndx].split('.')[1];
                var url = Settings.REMOTE_API + Settings.API_REMOTE[classname];
            };
            App.request(url, function(e, b) {
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
            App.request(url, function(e, b) {
                App.stacks.controllers[ctrl[ndx]] = b;
                window.eval(b);
                var Require = App.controller[ctrl[ndx]].require;
                loadRequire(Require, 0, function() {
                    loadControllers(ctrl, ndx + 1, cb);
                });
            });
        };

        function loadViewControllers(ctrl, ndx, cb) {
            if (!ctrl[ndx]) return cb();
            if (App.stacks.viewControllers[ctrl[ndx]]) return loadViewControllers(ctrl, ndx + 1, cb);
            if (!Settings.DEBUG) return loadViewControllers(ctrl, ndx + 1, cb);
            var url = Settings.PATHS['Contents'] + '/view/' + ctrl[ndx] + '/' + ctrl[ndx] + '.js';
            App.request(url, function(e, b) {
                App.stacks.viewControllers[ctrl[ndx]] = b;
                window.eval(b);
                var Require = App.viewController[ctrl[ndx]].require;
                loadRequire(Require, 0, function() {
                    loadViewControllers(ctrl, ndx + 1, cb);
                });
            });
        };

        function initMainController() {

            if (Settings.DEBUG) {
                var qry = document.location.search.split('?');
                if (qry[1]) {
                    qry = qry[1];
                    if (qry.indexOf('ionicPlatform') > -1) var _platform = qry.split('=')[1];
                    else var _platform = "-1";
                    if (window.ons) {
                        if (_platform != '-1') ons.platform.select(_platform)
                        else {
                            if (ons.platform.isIOS()) ons.platform.select('ios');
                            else ons.platform.select('android');
                        }
                    }
                } else {
                    if (window.ons) {
                        if (ons.platform.isIOS()) ons.platform.select('ios');
                        else ons.platform.select('android');
                    }
                }
            };

            var maincontroller = o.controllers[0];
            if (App.controller[maincontroller].init) {
                App.controller[maincontroller].init();
                App.controller[maincontroller].isLoaded = true;
            };

            document.addEventListener('show', function(event) {

                var page = event.target;
                if (Settings.DEBUG) {
                    var link = document.createElement('link');
                    link.rel = "stylesheet";
                    link.type = "text/css";
                    link.href = Settings.PATHS['Contents'] + '/view/' + page.id + '/' + page.id + '.css';
                    document.getElementsByTagName('head')[0].appendChild(link);
                };
                for (var i = 0; i < o.viewControllers.length; i++) {
                    if (o.viewControllers[i] == event.target.id) {
                        var ctrl = App.viewController[o.viewControllers[i]];
                        if (ctrl.controls) {
                            if (ctrl.controls.view) {
                                if (ctrl.controls.view.show) {
                                    if (typeof ctrl.controls.view.show === "function") {
                                        ctrl.controls.view.show(event);
                                    }
                                    if (typeof ctrl.controls.view.show === "string") {
                                        ctrl[ctrl.controls.view.show](event);
                                    }
                                }
                            }
                        }
                    }
                };
                for (var i = 0; i < o.controllers.length; i++) {
                    var ctrl = App.controller[o.controllers[i]];
                    if (ctrl.controls) {
                        if (ctrl.controls[event.target.id]) {
                            if (ctrl.controls[event.target.id].view) {
                                if (ctrl.controls[event.target.id].view.show) {
                                    if (typeof ctrl.controls[event.target.id].view.show === "function") {
                                        ctrl.controls[event.target.id].view.show(event);
                                    }
                                    if (typeof ctrl.controls[event.target.id].view.show === "string") {
                                        ctrl[ctrl.controls[event.target.id].view.show](event);
                                    }
                                }
                            }
                        }
                    };
                }
            });
            document.addEventListener('hide', function(event) {
                for (var i = 0; i < o.viewControllers.length; i++) {
                    if (o.viewControllers[i] == event.target.id) {
                        var ctrl = App.viewController[o.viewControllers[i]];
                        if (ctrl.controls) {
                            if (ctrl.controls.view) {
                                if (ctrl.controls.view.hide) {
                                    if (typeof ctrl.controls.view.hide === "function") {
                                        ctrl.controls.view.hide(event);
                                    }
                                    if (typeof ctrl.controls.view.hide === "string") {
                                        ctrl[ctrl.controls.view.hide](event);
                                    }
                                }
                            }
                        }
                    }
                };
                for (var i = 0; i < o.controllers.length; i++) {
                    var ctrl = App.controller[o.controllers[i]];
                    if (ctrl.controls) {
                        if (ctrl.controls[event.target.id]) {
                            if (ctrl.controls[event.target.id].view) {
                                if (ctrl.controls[event.target.id].view.hide) {
                                    if (typeof ctrl.controls[event.target.id].view.hide === "function") {
                                        ctrl.controls[event.target.id].view.hide(event);
                                    }
                                    if (typeof ctrl.controls[event.target.id].view.hide === "string") {
                                        ctrl[ctrl.controls[event.target.id].view.hide](event);
                                    }
                                }
                            }
                        }
                    };
                }
            });
            document.addEventListener('destroy', function(event) {
                for (var i = 0; i < o.viewControllers.length; i++) {
                    if (o.viewControllers[i] == event.target.id) {
                        var ctrl = App.viewController[o.viewControllers[i]];
                        if (ctrl.controls) {
                            if (ctrl.controls.view) {
                                if (ctrl.controls.view.destroy) {
                                    if (typeof ctrl.controls.view.destroy === "function") {
                                        ctrl.controls.view.destroy(event);
                                    }
                                    if (typeof ctrl.controls.view.destroy === "string") {
                                        ctrl[ctrl.controls.view.destroy](event);
                                    }
                                }
                            }
                        }
                    }
                };
                for (var i = 0; i < o.controllers.length; i++) {
                    var ctrl = App.controller[o.controllers[i]];
                    if (ctrl.controls) {
                        if (ctrl.controls[event.target.id]) {
                            if (ctrl.controls[event.target.id].view) {
                                if (ctrl.controls[event.target.id].view.destroy) {
                                    if (typeof ctrl.controls[event.target.id].view.destroy === "function") {
                                        ctrl.controls[event.target.id].view.destroy(event);
                                    }
                                    if (typeof ctrl.controls[event.target.id].view.destroy === "string") {
                                        ctrl[ctrl.controls[event.target.id].view.destroy](event);
                                    }
                                }
                            }
                        }
                    };
                }
            });
            document.addEventListener('init', function(event) {

                var page = event.target;
                var langs = page.getElementsByTagName('lang');
                for (var i = 0; i < langs.length; i++) {
                    langs[i].innerHTML = _(langs[i].innerHTML);
                };
                if (Settings.DEBUG) {
                    var link = document.createElement('link');
                    link.rel = "stylesheet";
                    link.type = "text/css";
                    link.href = Settings.PATHS['Contents'] + '/view/' + page.id + '/' + page.id + '.css';
                    document.getElementsByTagName('head')[0].appendChild(link);
                };
                for (var i = 0; i < o.viewControllers.length; i++) {
                    if (App.viewController[o.viewControllers[i]].init) {
                        if (App.viewController[o.viewControllers[i]].isLoaded === false) {
                            App.viewController[o.viewControllers[i]].isLoaded = true;
                            App.viewController[o.viewControllers[i]].init();
                        };
                    };

                    if (o.viewControllers[i] == page.id) {

                        var page = App.viewController[o.viewControllers[i]].controls;

                        for (var elx in page) {
                            for (var events in page[elx]) {
                                var evt = App.viewController[o.viewControllers[i]][page[elx][events]];
                                if (typeof page[elx][events] === "function") {
                                    App.$(elx).on(events, page[elx][events]);
                                };
                                if (typeof page[elx][events] === "string") {
                                    App.$(elx).on(events, App.viewController[o.viewControllers[i]][page[elx][events]]);
                                }
                            }
                        }
                    }
                };
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
                                    for (var events in page[elx]) {
                                        var evt = App.controller[o.controllers[i]][page[elx][events]];
                                        if (typeof page[elx][events] === "function") {
                                            if (elx != "view") App.$(elx).on(events, page[elx][events]);
                                        };
                                        if (typeof page[elx][events] === "string") {
                                            if (elx != "view") App.$(elx).on(events, App.controller[o.controllers[i]][page[elx][events]]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
            });
        };

        document.addEventListener("deviceready", function() {
            if (window.StatusBar) StatusBar.hide();
            App.getAcceptedLangs(function(lang) {
                App.loadLang(lang, function() {
                    loadControllers(o.controllers, 0, function() {
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
        define: function(name, obj) {
            var me = this;
            obj.isLoaded = false;
            obj.control = function(o) {
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
        define: function(name, obj) {
            var me = this;
            obj.isLoaded = false;
            obj.control = function(o) {
                obj.controls = o;
            };
            App.viewController[name] = obj;
        }
    },
    init: function(view, onload) {
        var maincontroller = -1;
        var me = this;

        for (var el in App.controller) {
            if (App.controller[el].init) var maincontroller = App.controller[el];
        };

        if (maincontroller == -1) return;
        if (window.ons) {
            // ONSEN UI Support
            window.setTimeout(function() {

                function kickem() {
                    var navig = document.createElement('ons-navigator');
                    navig.id = "Navigator";
                    navig.page = "view/" + view + "/" + view + ".html";
                    document.getElementsByTagName('body')[0].appendChild(navig);
                    App.navigator = App.$('#Navigator').dom();
                };

                var appLoadingIcon = document.getElementById('appLoadingIcon');
                var bootstrap = document.getElementById('bootstrap');

                if (onload) onload();
                if (Kickstart) Kickstart.load(kickem);

            }, 1000);
            return;
        };
        window.setTimeout(function() {
            function kickem() {
                // IONIC Support
                if (document.getElementsByTagName('html')[0].textContent.indexOf('ion') > -1) {
                    if (Settings.DEBUG) {
                        window.setTimeout(function() {
                            App.request(Settings.PATHS.Contents + '/../app.html', function(e, r) {
                                if (!r) {
                                    var ion = document.createElement('ion-app');
                                    document.getElementsByTagName('body')[0].appendChild(ion);
                                };
                                App.$(r).appendTo(App.$('body'));
                                console.log(me);
                                if (me.launch) me.launch();
                            });
                        }, 1000);
                    };

                };
            };
            if (onload) onload();
            if (Kickstart) Kickstart.load(kickem);

        }, 1000);


    }
});

App.apply(App, {
    file: {
        load: function(url, filename, cb) {
            if (!cb) {
                var cb = filename;
                var filename = App.shortid();
            };
            // Chemin de stockage des fichiers de l'application.
            var fileTransfer = new FileTransfer();
            if (device.platform == "iOS") {
                var store = cordova.file.dataDirectory;
            } else {
                var store = cordova.file.dataDirectory;
            };

            fileTransfer.download(
                encodeURI(url),
                store + filename,
                function(entry) {
                    cb(null, entry)
                },
                function(error) {
                    cb(error, null);
                },
                false, {
                    headers: {
                        "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                    }
                }
            );


        }
    }
});