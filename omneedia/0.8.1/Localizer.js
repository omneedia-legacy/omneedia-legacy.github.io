Lang = function (x) {
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