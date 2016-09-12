Ext.define('KitchenSink.view.d3.Tree', {
    extend: 'Ext.panel.Panel',
    xtype: 'd3-view-tree',
    controller: 'tree',

    requires: [
        'KitchenSink.view.d3.TreeViewModel',
        'Ext.d3.hierarchy.tree.HorizontalTree'
    ],

    // <example>
    // Content between example tags is omitted from code preview.
    otherContent: [
        {
            type: 'Model',
            path: 'classic/samples/model/Tree.js'
        },
        {
            type: 'View Model',
            path: 'classic/samples/view/d3/TreeViewModel.js'
        },
        {
            type: 'Data',
            path: 'data/tree/tree.json'
        }
    ],
    // </example>

    width: 930,
    height: 600,

    layout: 'border',

    viewModel: {
        type: 'tree'
    },

    session: true,
    resizable: {
        constrain: true
    },

    items: [
        {
            xtype: 'treepanel',

            region: 'west',
            split: true,
            splitterResize: false,
            collapsible: true,
            minWidth: 100,
            width: 215,

            title: 'Folders',
            useArrows: true,
            displayField: 'name',

            bind: {
                store: '{store}',
                selection: '{selection}'
            }
        },
        {
            region: 'center',

            xtype: 'panel',
            layout: 'fit',
            title: 'Tree',
            items: {
                xtype: 'd3-horizontal-tree',
                interactions: {
                    type: 'panzoom',
                    zoom: {
                        extent: [0.3, 3],
                        doubleTap: false
                    }
                },
                nodeSize: [20, 250],
                bind: {
                    store: '{store}',
                    selection: '{selection}'
                }
            }
        }
    ]
});
