/**
 * Demonstrates a TimePanel
 */
Ext.define('KitchenSink.view.panels.TimePanel', {
    extend: 'Ext.Container',
    xtype: 'panel-time',

    requires: [
        'Ext.panel.Time'
    ],

    height: '100%',
    width: '100%',
    layout: {
        type: 'box',
        pack: 'center',
        align: 'center'
    },
    scrollable: true,

    items: {
        xtype: 'timepanel',
        shadow: true
    }
});
