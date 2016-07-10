Ext.define('KitchenSink.view.TreeViewModel', {
    extend: 'Ext.app.ViewModel',

    requires: [
        'KitchenSink.model.Tree',
        'Ext.data.TreeStore'
    ],

    alias: 'viewmodel.tree',

    stores: {
        store: {
            type: 'tree',
            model: 'KitchenSink.model.Tree',
            autoLoad: true
        }
    },

    data: {
        selection: undefined
    }

});
