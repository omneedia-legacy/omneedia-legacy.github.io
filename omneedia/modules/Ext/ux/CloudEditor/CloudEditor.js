App.define('ace.mode.javascript',{});
Ext.define("Ext.ux.CloudEditor", {
	extend: 'Ext.Panel',
	alias : 'widget.CloudEditor',
	setTheme: function(t) {
		this.editor.setTheme(t);
	},
	initComponent: function() {

		var _p=this;
		function UUID() {
			var s = [];
			var hexDigits = "0123456789abcdef";
			for (var i = 0; i < 36; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
			s[8] = s[13] = s[18] = s[23] = "_";

			var uuid = s.join("");
			return uuid;
		};
		this.layout = "fit";
		this.padding = 0;
		this.border = false;
		this.frame = false;
		this.bodyStyle = 'background:transparent;';	
		var cmp='ED_'+UUID();
		this.items = {
				html: '<div style="width:100%;height:100%" id="'+cmp+'"></div>',
				border: false
		};		
		this.callParent(arguments);
		this.on('render',function() {
			this.setHeight(this.up().getHeight()-3);
			var _p=this;
			this.up().on('resize', function () {
				_p.setHeight(_p.up().getHeight()-3);
				_p.editor.resize();
			});
			_p.editor = ace.edit(cmp);
			var session = _p.editor.getSession();
			_p.editor.session.setOption("useWorker", false);
			//require("ace/config").set("workerPath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.9/");
			//_p.editor.setTheme("ace/theme/terminal");
			_p.editor.getSession().setMode("ace/mode/javascript");
		});
	}
});
