Ext.define('KitchenSink.view.grid.Tree', {
    extend: 'Ext.grid.Tree',
    requires: [
        'Ext.grid.plugin.MultiSelection'
    ],

    viewModel: {
        type: 'tree-list'
    },

    bind: '{navItems}'
});
