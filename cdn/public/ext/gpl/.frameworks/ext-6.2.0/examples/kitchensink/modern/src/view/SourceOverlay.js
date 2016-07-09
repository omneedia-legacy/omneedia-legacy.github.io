/**
 * This is used to display the source code for any given example. Each example has a 'Source' button
 * on its top toolbar that activates this
 */
Ext.define('KitchenSink.view.SourceOverlay', {
    extend: 'Ext.TabPanel',
    xtype: 'sourceoverlay',
    id: 'sourceoverlay',
    config: {
        modal: true,
        floated: true,
        hideOnMaskTap: true,
        top: '10%',
        left: '10%',
        width: '80%',
        height: '80%',
        defaultType: 'sourceitem',
        items: [{
            xtype: 'titlebar',
            title: 'Source',
            docked: 'top',
            ui: 'neutral'
        }]
    }
});
