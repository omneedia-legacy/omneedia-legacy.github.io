Auth = {
    logout: function () {
        App.$('.omneedia-overlay').show();
        if (Settings.TYPE == "mobile") {
            if (!Settings.REMOTE_AUTH) Settings.REMOTE_AUTH = "";
            Auth.window = window.open(Settings.REMOTE_AUTH + "/logout", "_blank", "location=no");
            Auth.window.on('loadstart', function (e) {
                Auth.window.close();
            });
        } else {
            if (!Settings.REMOTE_AUTH) Settings.REMOTE_AUTH = "";

            window.localStorage.removeItem('socketCluster.authToken');
            Auth.window = window.open(Settings.REMOTE_AUTH + "/logout", "_blank");

        }
    },
    doLogin: function (fn) {

        var divo = document.createElement('div');
        divo.className = "QxOverlay";
        document.getElementsByTagName('body')[0].appendChild(divo);
        try {
            App.get("window").close();
        } catch (e) {

        };

        if (!document.getElementById('__AUTH__LOGIN__BOX')) {
            var div = document.createElement('div');
            div.id = "__AUTH__LOGIN__BOX";
            if (Settings.TYPE == "mobile") {
                if (App.isPhone)
                    div.className = "QxLoginBox smartphone animated";
                else
                    div.className = "QxLoginBox tablet animated";
            } else div.className = "QxLoginBox animated";
            document.getElementsByTagName('body')[0].appendChild(div);
        } else App.$('#__AUTH__LOGIN__BOX').removeClass('bounceOutDown');
        App.$('#__AUTH__LOGIN__BOX').addClass('fadeInDownBig');

        App.$('#__AUTH__LOGIN__BOX').html('<table width="100%" height="100%" border="0"><tr class=CWaitSignOn style="display:none"><td width=100% height=100% valign=middle align="center">En attente des informations d\'identification<br>&nbsp;<br><a class="css_btn_cancel blue">Annuler</a></td></tr><tr class=CSignOn><td class="QxPassports" width=100% height=100% valign=middle align="center"><div class=qxAboutLogo style="position:absolute;top:10px;width:100%;margin-bottom:10px"></div><big><b>' + Settings.TITLE + '</b></big><br>&nbsp;<br>&nbsp;<br>&nbsp;</td></tr></table>');

        for (var jk = 0; jk < Settings.AUTH.passports.length; jk++) {
            if (!Settings.AUTH.passport[Settings.AUTH.passports[jk]]) {
                Settings.AUTH.passport[Settings.AUTH.passports[jk]] = {
                    caption: "Sign in with " + Settings.AUTH.passports[jk]
                }
            } else {
                /*if (_(Settings.AUTH.passport[Settings.AUTH.passports[jk]].caption)) sign_in_with = _(Settings.AUTH.passport[Settings.AUTH.passports[jk]].caption);
                else sign_in_with = "Sign in with " + Settings.AUTH.passports[jk];
                Settings.AUTH.passport[Settings.AUTH.passports[jk]] = {
                    caption: sign_in_with
                }*/
            };
            var button = '<a class="button_passport ' + Settings.AUTH.passports[jk] + ' ' + Settings.AUTH.passport[Settings.AUTH.passports[jk]].caption + '">' + '</a>';
            App.$(button).appendTo(App.$('.QxPassports'));
        };
        App.$('.css_btn_cancel').click(function () {
            App.$('.CWaitSignOn').hide();
            App.$('.CSignOn').show();
        });

        App.$('.button_passport').click(function (e) {
            App.$('.CWaitSignOn').show();
            App.$('.CSignOn').hide();
            var target = e.target.className.split(' ')[1];
            if (Settings.REMOTE_AUTH)
                var win = window.open(Settings.REMOTE_AUTH + "/auth/" + target, "_blank", "location=no");
            else {
                var win = window.open("/auth/" + target, "_blank");
                win.focus();
            };
            window.socket.on('login_error', function (data) {
                App.$('#__AUTH__LOGIN__BOX').removeClass('fadeInDownBig').addClass('bounceOutDown');
                window.setTimeout(function () {
                    document.getElementsByTagName('body')[0].outerHTML = '<div class="oa_dead_end"></div><div class="oa_dead_end_label">Une erreur est survenue dans le processus d\'identification.</div>';
                }, 1000);
            });
            window.socket.on('login', function (response) {
                console.log(response);
                console.log(window.socket);
                if (window.socket.authState == "authenticated") {
                    Auth.User = window.socket.authToken.user;
                    App.$('.QxOverlay').remove();
                    App.unblur('.x-panel');
                    App.$('#__AUTH__LOGIN__BOX').removeClass('fadeInDownBig').addClass('bounceOutDown');
                    window.setTimeout(function () {
                        //App.$(div).remove();
                    }, 1000);
                    if (Settings.TYPE != "mobile") {
                        Ext.getCmp('GlobalMenuUser').setText(Auth.User.mail.split('@')[0]);
                        Ext.getCmp('GlobalMenuUser').show();
                    };
                    if (fn) fn(Auth.User);
                }
            });
            window.socket.on('#failedauth', function (response) {
                App.$('#__AUTH__LOGIN__BOX').removeClass('fadeInDownBig').addClass('bounceOutDown');
                window.setTimeout(function () {
                    document.getElementsByTagName('body')[0].outerHTML = '<div class="oa_dead_end"></div><div class="oa_dead_end_label">Vous avez bien été identifié mais vous n\'avez pas accès a cette application.</div>';
                }, 1000);
                //App.notify('Auth', "Vous avez bien été identifié mais vous n'avez pas accès a cette application.");
            });
        });
    },
    user: function (cb) {
        try {
            return cb(window.socket.authToken.user);
        } catch (e) {
            return cb();
        }
    },
    User: {},
    login: function (fn) {
        if (!fn) throw "callback not provided";
        if (Settings.REMOTE_AUTH) var a_auth = Settings.REMOTE_AUTH;
        else var a_auth = "";

        App.blur('.x-panel');
        if (window.socket.authState != "authenticated") return Auth.doLogin(fn);
        App.request({
            url: a_auth + "/account",
            method: "POST"
        }, function (e, r) {
            if (e) return Auth.doLogin(fn);
            r = JSON.parse(r);
            if (r.response == "NOT_LOGIN") return Auth.doLogin(fn);
            Auth.User = r;
            App.$('.QxOverlay').remove();
            App.unblur('.x-panel');

            App.$('.QxLoginBox').addClass('bounceOutDown');
            App.$('.x-panel').addClass('QxSharp');
            if (Settings.TYPE == "mobile") App.$('.x-container').addClass('QxSharp');
            window.setTimeout(function () {
                App.$('.QxLoginBox').remove();
            }, 1000);
            if (fn) fn(Auth.User);
        });


        // Auth.User = window.socket.authToken.user;

    }
}