/**
 *
 * This example shows how to create a locked pivot grid. All columns that are generated for
 * the left axis dimensions are locked.
 *
 */
Ext.define('KitchenSink.view.pivot.Locked', {
    extend: 'Ext.pivot.Grid',
    xtype: 'locked-pivot-grid',
    controller: 'pivotlayout',

    requires: [
        'KitchenSink.store.pivot.Sales',
        'KitchenSink.view.pivot.LayoutController'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/pivot/LayoutController.js'
    },{
        type: 'Model',
        path: 'classic/samples/model/pivot/Sale.js'
    },{
        type: 'Store',
        path: 'classic/samples/store/pivot/Sales.js'
    }],
    profiles: {
        classic: {
            width: 600,
            height: 350,
            totalColumnWidth: 90,
            companyColumnWidth: 80
        },
        neptune: {
            width: 750,
            height: 350,
            totalColumnWidth: 90,
            companyColumnWidth: 80
        },
        graphite: {
            width: 750,
            height: 600,
            totalColumnWidth: 130,
            companyColumnWidth: 110
        }
    },
    //</example>

    title: 'Locked pivot',
    width: '${width}',
    height: '${height}',
    collapsible: true,
    multiSelect: true,

    selModel: {
        type: 'rowmodel'
    },

    // Set this to true to lock leftAxis dimensions
    enableLocking: true,
    // Set this to false if multiple dimensions are configured on leftAxis and
    // you want to automatically expand the row groups when calculations are ready.
    startRowGroupsCollapsed: false,

    matrix: {
        type: 'local',
        store: {
            type: 'sales'
        },

        // Set layout type to "outline". If this config is missing then
        // the default layout is "outline"
        viewLayoutType: 'outline',

        // Configure the aggregate dimensions. Multiple dimensions are supported.
        aggregate: [{
            dataIndex: 'value',
            header: 'Total',
            aggregator: 'sum',
            width: '${totalColumnWidth}'
        }],

        // Configure the left axis dimensions that will be used to generate
        // the grid rows
        leftAxis: [{
            dataIndex: 'person',
            header: 'Person',
            width: 80
        }, {
            dataIndex: 'company',
            header: 'Company',
            sortable: false,
            width: '${companyColumnWidth}'
        }],

        /**
         * Configure the top axis dimensions that will be used to generate
         * the columns.
         *
         * When columns are generated the aggregate dimensions are also used.
         * If multiple aggregation dimensions are defined then each top axis
         * result will have in the end a column header with children columns
         * for each aggregate dimension defined.
         */
        topAxis: [{
            dataIndex: 'year',
            header: 'Year'
        }, {
            dataIndex: 'country',
            header: 'Country'
        }]
    },

    tbar: [{
        text: 'Collapsing',
        menu: [{
            text: 'Collapse all',
            handler: 'collapseAll'
        },{
            text: 'Expand all',
            handler: 'expandAll'
        }]
    },{
        text: 'Subtotals position',
        menu: {
            defaults: {
                xtype: 'menucheckitem',
                group: 'subtotals',
                checkHandler: 'subtotalsHandler'
            },
            items: [{
                text: 'First',
                checked: true
            },{
                text: 'Last'
            },{
                text: 'None'
            }]
        }
    },{
        text: 'Totals position',
        menu: {
            defaults: {
                xtype: 'menucheckitem',
                group: 'totals',
                checkHandler: 'totalsHandler'
            },
            items: [{
                text: 'First'
            },{
                text: 'Last',
                checked: true
            },{
                text: 'None'
            }]
        }
    }]
});
