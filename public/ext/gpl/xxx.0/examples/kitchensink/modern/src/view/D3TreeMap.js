Ext.define('KitchenSink.view.D3TreeMap', {
    extend: 'Ext.Panel',
    requires: [
        'KitchenSink.view.TreeViewModel',
        'Ext.d3.hierarchy.TreeMap'
    ],

    viewModel: {
        type: 'tree'
    },

    session: true,

    config: {
        cls: 'card1',
        layout: 'fit',
        items: [{
            xtype: 'd3-treemap',
            interactions: {
                type: 'panzoom',
                zoom: {
                    doubleTap: false
                }
            },
            bind: {
                store: '{store}'
            }
        }]
    }
});
