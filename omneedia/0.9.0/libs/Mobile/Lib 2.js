App.apply(App, {
    stacks: {
        views: {},
        controllers: {}
    },
    /**
     * @namespace App
     * @class application
     * Implement the application (MVC)
     * 
     */
    application: function(o) {
        var maincontroller = o.controllers[0];
        var url = Settings.PATHS['Contents'] + '/controller/' + maincontroller + '.js';
        if (Settings.DEBUG) {
            App.request(url, function(e, b) {
                //console.log(e);
                window.eval(b);
            })
        };
        o.launch();
    },
    /**
     * @namespace App
     * @class controller
     * Implement the Controller Abstraction class (MVC)
     * 
     */
    controller: {
        define: function(name, obj) {
            var stacks = [];
            var me = this;

            function loadViews(view, ndx, cb) {
                if (!view[ndx]) return cb();
                if (App.stacks.views[view[ndx]]) return loadViews(view, ndx + 1, cb);
                var url = Settings.PATHS['Contents'] + '/view/' + view[ndx] + '/' + view[ndx] + '.html';
                App.request(url, function(e, b) {
                    App.stacks.views[view[ndx]] = b;
                    loadViews(view, ndx + 1, cb);
                });
            };
            if (!obj) return;
            obj.control = function(o) {
                for (var el in o) {
                    var item = o[el];
                    for (var z in o[el]) {
                        console.log("App.$(" + el + ").on(" + z + ", " + o[el[z]] + ");");
                        console.log(App.$(el).dom());
                        App.$(el).on(z, function() {
                            alert('bidon');
                        });
                        console.log(document.querySelector('ons-list-item'));
                        App.$('ons-list-item').on('click', function() {
                            alert('bidon');
                        });
                    }
                };
            };
            if (obj.views) loadViews(obj.views, 0, function() {
                obj.init();
            });
        },
        create: function() {

        }
    },
    loadView: function(view, cb) {
        App.$(App.stacks.views[view]).appendTo(App.$('body'));
    },
    init: function(view, onload) {
        var boot = function() {
            window.setTimeout(function() {
                function fade(el, type, ms) {
                    var isIn = type === 'in',
                        opacity = isIn ? 0 : 1,
                        interval = 50,
                        duration = ms,
                        gap = interval / duration,
                        self = this;
                    if (isIn) {
                        el.style.display = 'inline';
                        el.style.opacity = opacity;
                    };

                    function func() {
                        opacity = isIn ? opacity + gap : opacity - gap;
                        el.style.opacity = opacity;

                        if (opacity <= 0) el.style.display = 'none'
                        if (opacity <= 0 || opacity >= 1) {
                            App.loadView(view);
                            window.clearInterval(fading);
                        }
                    };
                    var fading = window.setInterval(func, interval);
                };
                var appLoadingIcon = document.getElementById('appLoadingIcon');
                var bootstrap = document.getElementById('bootstrap');
                appLoadingIcon.classList.remove('slideInDown');
                appLoadingIcon.classList.add('slideOutUp');
                fade(bootstrap, 'out', 1000);

                if (onload) onload();
            }, 1000);
        }
        document.addEventListener("deviceready", boot, false);
    }
})