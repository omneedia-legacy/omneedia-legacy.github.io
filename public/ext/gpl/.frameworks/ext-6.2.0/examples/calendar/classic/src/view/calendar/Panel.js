Ext.define('Calendar.view.calendar.Panel', {
    extend: 'Ext.calendar.panel.Panel',
    xtype: 'app-calendar',

    config: {
        sideHeaderCfg: []
    },

    initComponent: function() {
        var me = this,
            sidebar;

        me.callParent(arguments);

        // TODO: virtual getSideBarConfig()
        sidebar = me.down('#sideBar');
        sidebar.bodyPadding = 0;
        sidebar.ui = 'default';
        sidebar.setLayout({ type: 'vbox', align: 'stretch' });
        sidebar.insert(0, me.getSideHeaderCfg());
    }
});
