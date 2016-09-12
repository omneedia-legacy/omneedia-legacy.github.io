Ext.define('KitchenSink.view.d3.Pack', {
    extend: 'Ext.panel.Panel',
    xtype: 'd3-view-pack',

    requires: [
        'KitchenSink.view.d3.TreeViewModel',
        'Ext.d3.hierarchy.Pack'
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
            xtype: 'breadcrumb',

            region: 'north',

            bind: {
                store: '{store}',
                selection: '{selection}'
            },

            publishes: 'selection'
        },
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
            items: {
                xtype: 'd3-pack',
                padding: 20,
                bind: {
                    store: '{store}',
                    selection: '{selection}'
                }
            }
        }
    ]
});
