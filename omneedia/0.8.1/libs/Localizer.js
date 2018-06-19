/*Lang = function (x) {
	try {
		return i18n[Culture.LANG][x];
	} catch (ex) {
		return x;
	}
};

_ = function (x) {
	try {
		return i18n[Culture.LANG][x];
	} catch (ex) {
		return x;
	}
};

Ext.define("omneedia.Localizer", {

	singleton: true,
	isLoaded: false,

	LANG: "",
	ULANG: "",

	init: function () {
		try {
			if (Settings.DEBUG) i18n = {};
			if (Settings.DEBUG) i18n_framework = {};
		} catch (e) {};

		Array.prototype.inArray = function (p_val) {
			return (this.indexOf(p_val) < -1);
		};

		Culture.ULANG = (navigator.language) ? navigator.language : navigator.userLanguage;

		Culture.ULANG = Culture.ULANG.split('-')[0];

		if (LANGS.indexOf(Culture.ULANG) > -1) {
			Culture.LANG = Culture.ULANG;
		} else {
			Culture.LANG = LANGS[0];
		};

		if (window.localStorage['LANG']) Culture.LANG = window.localStorage['LANG'];

	},
	update: function (fn) {

		if (Culture.isLoaded) fn();
		else {
			if (Culture.LANG) {
				if (Culture.LANG.split('-US').length > 0) Culture.LANG = Culture.LANG.split('-US')[0];
				var url = ["Contents/Culture/" + Culture.LANG + ".js"];
				if (!Settings.CDN) var CDN = "https://cdn.omneedia.com";
				else var CDN = Settings.CDN;
				var url2 = [CDN + "/omneedia/0.8.1/framework.lang/" + Settings.TYPE + "/ext-lang-" + Culture.LANG + ".js"];
				if (Settings.DEBUG) {
					Require(url2, function () {
						i18n_framework[Culture.LANG]();
						Require(url, function () {
							Culture.isLoaded = true;
							if (fn) fn();
						});
					});
				} else {
					Culture.isLoaded = true;
					i18n_framework[Culture.LANG]();
					if (fn) fn();
				}
			} else {
				Culture.isLoaded = true;
				if (fn) fn();
			}
		}
	}
});

Culture = omneedia.Localizer;
Culture.init();
*/

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


Ext.define("omneedia.Localizer", {

	singleton: true,
	isLoaded: false,

	LANG: "",
	ULANG: "",
	getAcceptedLangs: function (cb) {
		var api = Settings.REMOTE_API;
		if (api.lastIndexOf('/') - 1 != api.length) {
			api += '/';
		};

		if (Settings.PLATFORM == "mobile") {
			function successCallback(o) {
				cb(o.value);
			};

			function errorCallback(o) {
				cb(navigator.language || navigator.userLanguage);
			};
			navigator.globalization.getPreferredLanguage(successCallback, errorCallback);
		} else {
			App.request({
				url: api + "i18n"
			}, function (e, r) {
				// fallback to navigator
				if (e) cb(navigator.language || navigator.userLanguage);
				else {
					cb(r);
				}
			});
		}
	},
	init: function (cb) {
		var _LANG = [];
		var current = "";

		var api = Settings.REMOTE_API;

		if (api.lastIndexOf('/') - 1 != api.length) {
			api += '/';
		};

		Culture.getAcceptedLangs(function (lang) {


			function ll(urls, i, cb) {
				if (!urls[i]) return cb();

				var url = urls[i];
				if (!App.DEFAULT_LANG) App.DEFAULT_LANG = current;

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
				Settings['i18n'].push(api + 'Contents/Culture/' + App.DEFAULT_LANG.split('|')[0] + '.js');
				ll(Settings['i18n'], 0, function () {
					App.DEFAULT_LANG = App.DEFAULT_LANG.split('|')[0];
					window.localStorage.setItem('LANG', App.DEFAULT_LANG);
					window.eval('if (!i18n["' + App.DEFAULT_LANG + '"]) i18n["' + App.DEFAULT_LANG + '"]={};i18n_framework["' + App.DEFAULT_LANG + '"]=function(){' + _LANG.join(' ') + '};');
					i18n_framework[App.DEFAULT_LANG]();
					Culture.LANG = App.DEFAULT_LANG;
					if (cb) cb();
				});
			} else {
				App.DEFAULT_LANG = App.DEFAULT_LANG.split('|')[0];
				window.localStorage.setItem('LANG', App.DEFAULT_LANG);
				// in PROD, It's always binded to source code
				i18n_framework[App.DEFAULT_LANG]();
				Culture.LANG = App.DEFAULT_LANG;
				if (cb) cb();
			}

		});
	},
	update: function () {
		if (Culture.isLoaded) fn();
		else {
			if (Culture.LANG) {
				if (Culture.LANG.split('-US').length > 0) Culture.LANG = Culture.LANG.split('-US')[0];
				var url = ["Contents/Culture/" + Culture.LANG + ".js"];
				if (!Settings.CDN) var CDN = "https://cdn.omneedia.com";
				else var CDN = Settings.CDN;
				var url2 = [CDN + "/omneedia/0.8.1/framework.lang/" + Settings.TYPE + "/ext-lang-" + Culture.LANG + ".js"];
				if (Settings.DEBUG) {
					Require(url2, function () {
						i18n_framework[Culture.LANG]();
						Require(url, function () {
							Culture.isLoaded = true;
							if (fn) fn();
						});
					});
				} else {
					Culture.isLoaded = true;
					i18n_framework[Culture.LANG]();
					if (fn) fn();
				}
			} else {
				Culture.isLoaded = true;
				if (fn) fn();
			}
		}
	}
});

Culture = omneedia.Localizer;