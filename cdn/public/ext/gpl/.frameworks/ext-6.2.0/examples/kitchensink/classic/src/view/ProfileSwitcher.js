Ext.define('KitchenSink.view.ProfileSwitcher', {
    extend: 'Ext.Component',
    xtype: 'profileSwitcher',
    cls: [ 'ks-profile-switcher', 'fa', 'fa-bars' ],

    readProfileInfo: function() {
        // These come from index.html
        this.profile = KitchenSink.profileName;
        this.locale = KitchenSink.locale;
    },

    setQueryParam: function(name, value, preserveHash) {
        var query = Ext.Object.fromQueryString(location.search),
            queryString;

        query[name] = value;

        queryString = Ext.Object.toQueryString(query);
        if (preserveHash) {
            location.search = queryString;
        } else {
            window.location = location.pathname + '?' + queryString;
        }
    },

    initComponent: function() {
        var me = this,
            menuItems = [],
            classicProfiles = {
                triton: 'Triton',
                neptune: 'Neptune',
                'neptune-touch': 'Neptune Touch',
                crisp: 'Crisp',
                'crisp-touch': 'Crisp Touch',
                classic: 'Classic',
                gray: 'Gray'
            },
            modernProfiles = {
                'modern-triton': 'Modern Triton',
                'modern-neptune': 'Modern Neptune',
                material: 'Material'//,
                //ios: 'iOS'
            },
            menu, profileId;

        me.readProfileInfo();

        function makeItem(value, text, paramName) {
            paramName = paramName || "profile";

            var checked = value === (paramName === "profile" ? me.profile : me.locale);

            return {
                text: text,
                group: (paramName === 'profile' ? 'profilegroup' : 'localegroup'),
                checked: checked,
                handler: function () {
                    if (!checked) {
                        if(paramName === 'profile') {
                            me.setQueryParam('profile', value, value in classicProfiles);
                        } else {
                            me.setQueryParam('locale', value);
                        }
                    }
                }
            };
        }

        for (profileId in classicProfiles) {
            menuItems.push(makeItem(profileId, classicProfiles[profileId]));
        }

        menuItems.push('-');

        for (profileId in modernProfiles) {
            menuItems.push(makeItem(profileId, modernProfiles[profileId]));
        }

        menuItems.push('-');

        menuItems.push(makeItem('en', 'English', 'locale'));
        menuItems.push(makeItem('he', 'Hebrew', 'locale'));

        menu = new Ext.menu.Menu({
            items: menuItems
        });

        this.on({
            scope: this,
            click: function (e) {
                menu.showBy(this);
            },
            element: 'el'
        });

        this.callParent();
    }
});
