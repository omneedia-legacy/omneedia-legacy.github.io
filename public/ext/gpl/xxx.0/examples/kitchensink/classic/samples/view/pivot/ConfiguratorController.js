/**
 * Controls the configurator example.
 */
Ext.define('KitchenSink.view.pivot.ConfiguratorController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.pivotconfig',

    changeDock: function(button, checked){
        if(checked) {
            this.getView().getPlugin('configurator').setDock(button.text.toLowerCase());
        }
    },

    getCustomMenus: function (panel, options) {
        options.menu.add({
            text: 'Custom menu item',
            handler: function(){
                Ext.Msg.alert('Custom menu item', Ext.String.format('Do something for "{0}"', options.field.getHeader()));
            }
        });
    },

    monthLabelRenderer: function(v){
        return Ext.Date.monthNames[v];
    },

    yearLabelRenderer: function(v){
        return v ? 'Year ' + v : v;
    },

    coloredRenderer: function(v, meta){
        if(meta) {
            meta.style = Ext.String.format('color: {0};', v > 500 ? 'green' : 'red');
        }
        return Ext.util.Format.number(v, '0,000.00');
    }

});