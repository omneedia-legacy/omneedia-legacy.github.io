i18n_framework = {};
i18n = {};

_ = function (x) {
    App.DEFAULT_LANG = window.localStorage['LANG'];
    try {
        return i18n[App.DEFAULT_LANG][x];
    } catch (ex) {
        return x;
    }
};

App.apply(App, {
    getAcceptedLangs: function (cb) {
        if (Settings.PLATFORM == "mobile") {
            function successCallback(o) {
                cb(o.value);
            };

            function errorCallback(o) {
                cb(navigator.language || navigator.userLanguage);
            };
            if (navigator.globalization) navigator.globalization.getPreferredLanguage(successCallback, errorCallback);
            else {

                App.request({
                    url: Settings.REMOTE_API + "i18n"
                }, function (e, r) {
                    // fallback to navigator
                    if (e) cb(navigator.language || navigator.userLanguage);
                    else {
                        cb(r);
                    }
                });

            }

        } else {
            App.request({
                url: Settings.REMOTE_API + "i18n"
            }, function (e, r) {
                // fallback to navigator
                if (e) cb(navigator.language || navigator.userLanguage);
                else {
                    cb(r);
                }
            });
        }
    },
    loadLang: function (lang, cb) {
        var _LANG = [];

        function ll(urls, i, cb) {
            if (!urls[i]) return cb();
            var url = urls[i];
            var lang = App.DEFAULT_LANG.split('|')[1].split(',');
            if (lang[0].indexOf('-') > -1) lang[0] = lang[0].split('-')[0] + '-' + lang[0].split('-')[1].toUpperCase();
            var url0 = url.replace(/{lang}/g, lang[0]);

            if (lang[1]) var url1 = url.replace(/{lang}/g, lang[1]);
            else {
                if (lang[0].indexOf('-') > -1) var url1 = url.replace(/{lang}/g, lang[0].split('-')[0]);
                else url1 = "-1";
            }

            function addLang() {
                if (url1.indexOf('.json') > -1) {

                    _LANG.push('i18n["' + App.DEFAULT_LANG.split('|')[0] + '"]=Object.assign(i18n["' + App.DEFAULT_LANG.split('|')[0] + '"],' + this.response + ');');
                } else _LANG.push(this.response);
                return ll(urls, i + 1, cb);
            };

            function failed() {
                //alert(urls[i]);
                return ll(urls, i + 1, cb);
            };
            var XHR = new XMLHttpRequest();

            XHR.addEventListener('load', addLang, false);
            XHR.addEventListener("error", failed, false);
            XHR.open('GET', url0);
            XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            XHR.send();

        };
        var current = "";

        if (window.localStorage['LANG']) App._lang = window.localStorage['LANG'];
        if (!App._lang) {
            for (var i = 0; i < Settings.LANGS.length; i++) {
                if (lang.toLowerCase().indexOf(Settings.LANGS[i].toLowerCase()) > -1) current = Settings.LANGS[i] + '|' + lang;
            };
        } else {
            if (App._lang.indexOf('-') > -1) {
                current = App._lang + '|' + App._lang;
            } else {
                current = App._lang + '|' + App._lang + ',' + App._lang + '-' + App._lang.toUpperCase();
            };
        };
        /* Fallback to current */
        if (current == "") {
            if (Settings.LANGS[0].indexOf('-') > -1) {
                App.DEFAULT_LANG = Settings.LANGS[0] + '|' + Settings.LANGS[0];
            } else {
                App.DEFAULT_LANG = Settings.LANGS[0] + '|' + Settings.LANGS[0] + ',' + Settings.LANGS[0] + '-' + Settings.LANGS[0].toUpperCase();
            };
        } else App.DEFAULT_LANG = current;
        if (Settings.DEBUG) {
            // in DEBUG, we load it dynamically
            Settings['i18n'].push(Settings.REMOTE_API + 'Contents/Culture/' + App.DEFAULT_LANG.split('|')[0] + '.js');
            ll(Settings['i18n'], 0, function () {
                App.DEFAULT_LANG = App.DEFAULT_LANG.split('|')[0];
                window.localStorage.setItem('LANG', App.DEFAULT_LANG);


                window.eval('if (!i18n["' + App.DEFAULT_LANG + '"]) i18n["' + App.DEFAULT_LANG + '"]={};i18n_framework["' + App.DEFAULT_LANG + '"]=function(){' + _LANG.join(' ') + '};');
                console.log(i18n_framework[App.DEFAULT_LANG]);
                //return;
                i18n_framework[App.DEFAULT_LANG]();
                //return;
                cb();
            });
        } else {
            App.DEFAULT_LANG = App.DEFAULT_LANG.split('|')[0];
            window.localStorage.setItem('LANG', App.DEFAULT_LANG);
            // in PROD, It's always binded to source code
            if (App.DEFAULT_LANG.indexOf('-') > -1) {
                var a = App.DEFAULT_LANG.split('-')[0].toLowerCase();
                var b = App.DEFAULT_LANG.split('-')[1].toUpperCase();
                App.DEFAULT_LANG = a + '-' + b;
                console.log(a);
                console.log(b);
                console.log(App.DEFAULT_LANG);
            };
            try {
                i18n_framework[App.DEFAULT_LANG]();
            } catch (e) {

            };
            cb();
        }
    }
});