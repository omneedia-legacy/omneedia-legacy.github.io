/**
 * This example shows how to create a pivot grid and display the results in
 * a tabular layout.
 *
 * The tabular layout is similar to the "Tabular Form" layout in Excel.
 */
Ext.define('KitchenSink.view.pivot.LayoutTabular', {
    extend: 'Ext.Container',
    xtype: 'tabular-pivot-grid',
    controller: 'pivot',

    requires: [
        'Ext.pivot.Grid'
    ],

    // <example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/pivot/PivotController.js'
    }, {
        type: 'Store',
        path: 'modern/src/store/Sales.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            height: 400,
            padding: 8,
            shadow: true,
            tbarPadding: '5 8',
            width: 600
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
                height: undefined,
                padding: undefined,
                shadow: undefined,
                tbarPadding: '12 8',
                width: undefined
            },
            ios: {
                tbarPadding: undefined
            }
        }
    },

    padding: '${padding}', //give room for the grid's shadow
    shadow: false,
    // </example>

    height: '${height}',
    layout: 'fit',
    width: '${width}',

    items: [{
        xtype: 'pivotgrid',
        shadow: '${shadow}',
        reference: 'pivotgrid',
        // Set this to false if multiple dimensions are configured on leftAxis and
        // you want to automatically expand the row groups when calculations are ready.
        startRowGroupsCollapsed: false,
        // Set this to false if multiple dimensions are configured on topAxis and
        // you want to automatically expand the col groups when calculations are ready.
        startColGroupsCollapsed: false,
        matrix: {
            type: 'local',
            store: {
                type: 'sales'
            },
            // Set layout type to "tabular"
            viewLayoutType: 'tabular',
            // Configure the aggregate dimensions. Multiple dimensions are supported.
            aggregate: [{
                dataIndex: 'value',
                header: 'Total',
                aggregator: 'sum',
                width: 110
            }],
            // Configure the left axis dimensions that will be used to generate
            // the grid rows
            leftAxis: [{
                dataIndex: 'person',
                header: 'Person',
                width: 150
            }, {
                dataIndex: 'company',
                header: 'Company',
                sortable: false,
                width: 150
            }, {
                dataIndex: 'country',
                header: 'Country',
                width: 150
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
            }]
        },
        listeners: {
            pivotgroupexpand: 'onPivotGroupExpand',
            pivotgroupcollapse: 'onPivotGroupCollapse'
        }
    }, {
        xtype: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        padding: '${tbarPadding}',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            margin: '0 10 0 0',
            shadow: '${buttonShadow}',
            ui: 'action'
        },
        items: [{
            text: 'Expand all',
            handler: 'expandAll'
        }, {
            text: 'Collapse all',
            handler: 'collapseAll'
        }]
    }]
});
