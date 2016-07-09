Ext.define('KitchenSink.view.D3SunburstZoom', {
    extend: 'Ext.Panel',
    requires: [
        'KitchenSink.view.TreeViewModel',
        'Ext.d3.hierarchy.partition.Sunburst'
    ],

    viewModel: {
        type: 'tree'
    },

    session: true,

    config: {
        cls: 'card1',
        layout: 'fit',
        items: [{
            xtype: 'd3-sunburst',
            reference: 'd3',
            padding: 20,
            bind: {
                store: '{store}'
            },
            nodeChildren: function (node) {
                // Always render top 3 levels of nodes, whether or not they are expanded.
                return node.getDepth() < 2 ? node.childNodes : null;
            },
            nodeSelectTransition: false,
            listeners: {
                selectionchange: function (sunburst, node) {
                    sunburst.zoomInNode(node);
                }
            }
        }]
    }
});
