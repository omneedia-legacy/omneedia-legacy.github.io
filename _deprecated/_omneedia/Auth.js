
Ext.define("omneedia.Auth", {
    singleton: true,
	logout: function()
	{
		$('.omneedia-overlay').show();
		if (Settings.TYPE=="mobile") {
			if (!Settings.REMOTE_AUTH) Settings.REMOTE_AUTH="";
			Auth.window = window.open(Settings.REMOTE_AUTH+"/logout", "_blank","location=no");
			$(Auth.window).on('loadstart', function(e) {
				Auth.window.close();
				//window.location.reload(true);
				//navigator.app.loadUrl('index.html');
			});
		} else {
			if (!Settings.REMOTE_AUTH) Settings.REMOTE_AUTH="";
			var divo=document.createElement('div');
			divo.className="QxOverlay";
			divo.style.zIndex="99999999999999999";
			document.getElementsByTagName('body')[0].appendChild(divo);
			
			Auth.window = window.open(Settings.REMOTE_AUTH+"/logout", "_blank");
			__INTERVAL__=window.setInterval(function(){
				if (Settings.REMOTE_AUTH) var a_auth=Settings.REMOTE_AUTH; else var a_auth="";
				Ext.Ajax.request({
							url: a_auth+"/account",
							method: "POST",
							withCredentials: true,
							useDefaultXhrHeader: false,			
							success: function(response,opts) {				

							},
							failure: function(response,opts) {
								window.clearInterval(__INTERVAL__);
								location.href=location.href;
							}});		
			},1000);			
		}
	},	
	doLogin: function(fn)
	{
	
		var divo=document.createElement('div');
		divo.className="QxOverlay";
		document.getElementsByTagName('body')[0].appendChild(divo);	
				
		$("#appLoadingIndicator").fadeOut('slow');		
		
		var div=document.createElement('div');
		
		if (Settings.TYPE=="mobile") {
			if (App.isPhone)
			div.className="QxLoginBox smartphone animated fadeInDownBig";
			else
			div.className="QxLoginBox tablet animated fadeInDownBig";
		} else div.className="QxLoginBox animated fadeInDownBig";
		document.getElementsByTagName('body')[0].appendChild(div);
		console.log(Settings);
		$('<table width="100%" height="100%" border="0"><tr class=CWaitSignOn style="display:none"><td width=100% height=100% valign=middle align="center">En attente des informations d\'identification<br>&nbsp;<br><button class=css_btn_cancel>Annuler</button></td></tr><tr class=CSignOn><td class="QxPassports" width=100% height=100% valign=middle align="center"><div class=qxAboutLogo style="position:absolute;top:10px;width:100%;margin-bottom:10px"></div><big><b>'+Settings.TITLE+'</b></big><br>&nbsp;<br>&nbsp;</td></tr></table>').appendTo('.QxLoginBox');

		for (var jk=0;jk<Settings.AUTH.passports.length;jk++) {
			if (!Settings.AUTH.passport[Settings.AUTH.passports[jk]]) {
				Settings.AUTH.passport[Settings.AUTH.passports[jk]]={
					caption: "&nbsp;Sign in with "+Settings.AUTH.passports[jk]
				} 
			} else {
				if (_(Settings.AUTH.passport[Settings.AUTH.passports[jk]].caption)) sign_in_with=_(Settings.AUTH.passport[Settings.AUTH.passports[jk]].caption); else sign_in_with="Sign in with "+Settings.AUTH.passports[jk];
				Settings.AUTH.passport[Settings.AUTH.passports[jk]]={
					caption: '&nbsp;'+sign_in_with
				}			
			};
			$('.QxPassports').html($('.QxPassports').html()+'<a class="button_passport '+Settings.AUTH.passports[jk]+'">'+Settings.AUTH.passport[Settings.AUTH.passports[jk]].caption+'</a>');
		};
		$('.css_btn_cancel').click(function() {
			$('.CWaitSignOn').hide();
			$('.CSignOn').show();			
		});
		
		$('.button_passport').click(function(e) {
			$('.CWaitSignOn').show();
			$('.CSignOn').hide();
			var target=e.target.className.split('button_passport ')[1];
			if (Settings.REMOTE_AUTH)
			var win = window.open(Settings.REMOTE_AUTH+"/auth/"+target, "_blank","location=no");
			else {
				var win = window.open("/auth/"+target, "_blank");
				win.focus();
			};
		    document.socket.on('#auth',function(response) {
			Auth.User=JSON.parse(response);
				$('.QxOverlay').remove();
				Auth._vague.unblur();						
				$('.QxLoginBox').addClass('bounceOutDown');
				window.setTimeout(function(){$('.QxLoginBox').remove();},1000);					
				if (Settings.TYPE!="mobile") {
				Ext.getCmp('GlobalMenuUser').setText(Auth.User.mail.split('@')[0]);
					Ext.getCmp('GlobalMenuUser').show();
				};
				if (fn) fn(Auth.User);
			});
		});
	},
	user: function(cb)
	{
		if (Settings.REMOTE_AUTH) var a_auth=Settings.REMOTE_AUTH; else var a_auth="";
		Ext.Ajax.request({
			url: a_auth+"/account",
			method: "POST",
			params: {
				"udid" : App.udid
			},			
			withCredentials: true,
			useDefaultXhrHeader: false,			
			success: function(response,opts) {				
				Auth.User=JSON.parse(response.responseText);
				cb(Auth.User);
			},
			failure: function(response,opts) {
				//Auth.doLogin();
			}
		});
	},
	User: {},
	login: function(fn)
	{
		if (Settings.REMOTE_AUTH) var a_auth=Settings.REMOTE_AUTH; else var a_auth="";
		Auth._vague=$('.x-panel').Vague();
		Auth._vague.blur({
			intensity:      3,
			forceSVGUrl:    false,
			animationOptions: {
				duration: 1000,
				easing: 'linear'
			}
		});		
		
		Ext.Ajax.request({
			url: a_auth+"/account",
			method: "POST",
			params: {
				"udid" : App.udid
			},								
			withCredentials: true,
            useDefaultXhrHeader: false,			
			success: function(response,opts) {
				
				Auth.User=JSON.parse(response.responseText);
				
				$('.QxOverlay').remove();
				Auth._vague.unblur();
				$('.QxLoginBox').addClass('bounceOutDown');						
				$('.x-panel').addClass('QxSharp');
				if (Settings.TYPE=="mobile") $('.x-container').addClass('QxSharp');
				window.setTimeout(function(){$('.QxLoginBox').remove();},1000);
				if (Settings.TYPE!="mobile") {
					Ext.getCmp('GlobalMenuUser').setText(Auth.User.mail.split('@')[0]);
					Ext.getCmp('GlobalMenuUser').show();
				};
				if (fn) fn(Auth.User);
			},
			failure: function(response,opts) {
				Auth.doLogin(fn);
			}
		});
	}
});

Auth = omneedia.Auth;