Ext.define('KitchenSink.view.d3.TreeMapTooltip', {
    extend: 'Ext.panel.Panel',
    xtype: 'd3-view-treemap-tooltip',
    controller: 'treemap-tooltip',

    requires: [
        'KitchenSink.view.d3.StocksViewModel',
        'Ext.d3.hierarchy.TreeMap'
    ],

    // <example>
    // Content between example tags is omitted from code preview.
    otherContent: [
        {
            type: 'Controller',
            path: 'classic/samples/view/d3/TreeMapTooltipController.js'
        },
        {
            type: 'Model',
            path: 'classic/samples/model/Stock.js'
        },
        {
            type: 'View Model',
            path: 'classic/samples/view/d3/StocksViewModel.js'
        },
        {
            type: 'Data',
            path: 'data/tree/tree.json'
        },
        {
            type: 'Styles',
            path: 'classic/sass/src/view/d3/TreeMapTooltip.scss'
        }
    ],
    // </example>

    width: 930,
    height: 600,

    layout: 'border',

    viewModel: {
        type: 'stocks'
    },

    session: true,
    resizable: {
        constrain: true
    },

    items: {
        region: 'center',

        xtype: 'panel',
        layout: 'fit',
        items: {
            xtype: 'd3-treemap',
            reference: 'treemap',
            interactions: {
                type: 'panzoom',
                pan: {
                    momentum: false
                },
                zoom: {
                    doubleTap: false
                }
            },
            bind: {
                store: '{store}',
                selection: '{selection}'
            },
            rootVisible: false,
            selectEventName: null,
            expandEventName: null,
            nodeValue: function (node) {
                return node.data.cap;
            },
            tooltip: {
                bodyStyle: {
                    background: '#e67e22',
                    padding: '10px'
                },
                renderer: 'onTooltip'
            },
            colorAxis: {
                scale: {
                    type: 'linear',
                    domain: [-5, 0, 5],
                    range: ['#E45649', '#ECECEC', '#50A14F']
                },
                field: 'change',
                processor: function (axis, scale, node, field) {
                    return node.isLeaf() ? scale(node.data[field]) : '#ececec';
                }
            }
        }
    }
});
