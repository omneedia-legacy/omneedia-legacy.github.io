Ext.define('Calendar.view.calendar.Panel', {
    extend: 'Ext.calendar.panel.Panel',
    xtype: 'app-calendar',

    config: {
        sideHeaderCfg: null
    },

    constructor: function() {
        var me = this,
            sidebar;

        me.callParent(arguments);

        // TODO: virtual getSideBarConfig()
        sidebar = me.down('#sideBar');
        sidebar.setUi('default');
        me.sideHeaderItem = sidebar.insert(0, me.getSideHeaderCfg());
    },

    privates: {
        onMenuButtonTap: function() {
            var me = this,
                initialized = !!me.sheet;

            this.callParent(arguments);

            if (!initialized && me.sheet) {
                me.sheet.insert(0, me.sideHeaderItem);
                me.sheet.setUi('default');
            }
        }
    }
});
