Ext.define('KitchenSink.view.D3Tree', {
    extend: 'Ext.Panel',
    requires: [
        'KitchenSink.view.TreeViewModel',
        'Ext.d3.hierarchy.tree.HorizontalTree'
    ],

    viewModel: {
        type: 'tree'
    },

    session: true,

    config: {
        cls: 'card1',
        layout: 'fit',
        items: [{
            xtype: 'd3-tree',
            interactions: {
                type: 'panzoom',
                zoom: {
                    extent: [0.3, 3],
                    doubleTap: false
                }
            },
            nodeSize: [20, 250],
            bind: {
                store: '{store}'
            }
        }]
    }
});
