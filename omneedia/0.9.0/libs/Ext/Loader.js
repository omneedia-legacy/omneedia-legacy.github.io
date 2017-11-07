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
	}
	, _kickstart: function (o, fn) {
		var _p = this;
		if (window.Kickstart) {
			if (Kickstart.load) Kickstart.load();
		};
		_p.FORMS = Ext.create('Ext.container.Viewport', {
			id: "OAContainer"
			, layout: "card"
			, border: false
			, items: []
		});
		Ext.require(Settings.NAMESPACE + '.view.' + o);
		Ext.onReady(function () {
			var kickstarter = Ext.create(Settings.NAMESPACE + '.view.' + o);
			kickstarter.on('render', function (me) {
				if (window.Kickstart) {
					if (Kickstart.ready) Kickstart.ready();
				};
				if (fn) fn(me);
			});
			_p.FORMS.add(kickstarter);
		});
	}
	, load: function (fn) {
		App.getAcceptedLangs(function (lang) {
			App.loadLang(lang, function () {
				if (!App.libs) Manifest();
				else App.require(App.libs, Manifest);
			});
		});
	}
});