Ext.define('omneedia.webapp.GlobalMenu', {
	extend: 'Ext.Panel',
	xtype: "Menu",
	border: false,
	constructor:function(cnfg){
		
		var _p=this;
		this.callParent(arguments);
		this.initConfig(cnfg);
		var menu=[];
		menu[0]={
			iconCls: "qxIcon",
			text: "<b>"+window.document.title+"</b>",
			menu: {
				items: [
					{
						text: "A propos de...",
						handler: function()
						{
							Ext.create("Ext.Window",{                   
								title 	: 'A propos de...',
								width 	: 500,
								modal 	: true,
								closable: true,
								resizable: false,
								height	: 331,
								layout	: "vbox",
								bodyStyle: "background-color:white",
								border: false,
								buttonAlign: "center",
								listeners: {
									show: function() {
										/*
										var Authors="";
										for (var i=0;i<Settings.AUTHORS.length;i++)
										{
											Authors+='<br><a href="mailto:'+Settings.AUTHORS[i].email+'">'+Settings.AUTHORS[i].name+'</a><br><small>'+Settings.AUTHORS[i].company+'</small>';
										};
										//this.items.items[2].update('<div class=AboutBoxTitle>'+window.document.title+'</div><div class=AboutBoxVersion>version '+Settings.VERSION+'.'+Settings.BUILD+'<br><br>Auteurs :'+Authors+'</div>');
										*/
									}
								},
								bbar: [
									{
										text:"Credits",
										hidden: true,
										handler: function() {
											Ext.create("Ext.Window",{                   
												title 	: 'Credits',
												width 	: 400,
												height	: 500,												
												modal 	: true,
												closable: true,
												resizable: false,
												layout	: "vbox",
												bodyStyle: "background-color:white",
												border: false,
												bbar: [
													'->',
													{
														text: "Fermer",
														handler: function(w) {
															w.up().up().close();
														}
													}
												],
												items: [
												
												]
											}).show().center();								
										}
									},
									{
										text:"Licence",
										hidden: true,
										handler: function() {
											Ext.create("Ext.Window",{                   
												title 	: 'License',
												width 	: 640,
												height	: 550,												
												modal 	: true,
												closable: true,
												resizable: true,
												layout	: "vbox",
												bodyStyle: "background-color:white",
												border: false,
												bbar: [
													'->',
													{
														text: "Fermer",
														handler: function(w) {
															w.up().up().close();
														}
													}
												],
												items: [
												
												]
											}).show().center();
										}
									},
									'->',
									{
										text: "Fermer",
										handler: function(w) {
											w.up().up().close();
										}
									}
								],
								items: [
									{
										height:10,
										border: false
									},
									{
										layout: "hbox",
										border: false,
										items: [
										{
											xtype: "panel",
											border: false,
											baseCls: "qxAboutLogo",
											width: 150,
											height: 150
										},
										{
											xtype: "panel",
											flex: 1,
											height:150,
											width:500,
											border: false,
											html: "<div class=AboutBoxTitle>"+window.document.title+"<div class=AboutBoxDescription>"+Settings.DESCRIPTION+"</div><div class=AboutBoxVersion>version "+Settings.VERSION+"."+Settings.BUILD+"</div><div class=AboutBoxCopyright>"+Settings.COPYRIGHT+"</div>"
										}
										]
									},
									{
										layout: "hbox",
										width: "100%",
										border: false,
										items: [
											{
												border: false,
												html: "<div class=AboutBoxLicence>EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS PROVIDE THE SOFTWARE \"AS IS\" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU. SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING WILL ANY COPYRIGHT HOLDER, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF THE SOFTWARE TO OPERATE WITH ANY OTHER PROGRAMS), EVEN IF SUCH HOLDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</div>",
												flex: 1
											}
										]
									},
								]
							}).show().center();
	
						}
					},
					{
						iconCls: "mnu_preferences",
						text: "Préférences"
					}
				]
			}		
		};
		for (var i=0;i<this.menu.length;i++)
		{
			menu[i+1]=this.menu[i];
		};
		menu[i+1]='->';
		menu[i+2]={
			id: "GlobalMenuUser",
			menu: {
				items: [
					{
						text: "Déconnexion",
						handler: function()
						{
							Auth.logout();
						}
					}
				]
			}		
		};
		menu[i+3]={
			id: "GlobalMenuDateTime"
		};
		menu[i+4]={
			id: "GlobalMenuLang",
			menu: {
				items: [
				
				]
			}
		};				
		menu[i+5]={
			iconCls: 'QxNotificationBar',
			handler: function()
			{
				$.pageslide({ direction: 'left', href:'/notificationcenter.plugin' });
			}
		};		
		var tbar=new Ext.Toolbar({
			items: menu
		});
		this.addDocked(tbar);
		window.setInterval(function(){
			Ext.getCmp('GlobalMenuDateTime').setText(Ext.Date.format(new Date(), 'D d M Y H:i:s '));
		},1000);
		Ext.getCmp('GlobalMenuUser').hide();
		
		if (Settings.TYPE!="mobile") {
			Auth.user(function(o){
				if (o.mail) {
					Ext.getCmp('GlobalMenuUser').setText(o.mail.split('@')[0]);
					Ext.getCmp('GlobalMenuUser').show();
				};		
			});
			for (var i=0;i<Settings.LANGS.length;i++)
			{
				Ext.getCmp('GlobalMenuLang').menu.add({
					text: Settings.LANGS[i].toUpperCase(),
					handler: function(x) {
						window.localStorage['LANG']=x.text.toLowerCase();
						location.href=location.href;
					}
				});
				Ext.getCmp('GlobalMenuLang').setText(Culture.LANG.toUpperCase());
			};			
		}
	}
});