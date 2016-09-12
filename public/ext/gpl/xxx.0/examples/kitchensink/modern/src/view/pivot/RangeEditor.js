/**
 *
 * This example shows how to create a pivot grid and edit the results.
 *
 * DblClick a cell to open the RangeEditor view that helps you update the pivot cell records.
 *
 */
Ext.define('KitchenSink.view.pivot.RangeEditor', {
    extend: 'Ext.pivot.Grid',

    requires: [
        'KitchenSink.store.Sales',
        'KitchenSink.view.pivot.RangeEditorController',
        'Ext.pivot.plugin.RangeEditor'
    ],

    controller: 'kspivotrangeeditor',

    plugins: [{
        type: 'pivotrangeeditor'
    }],

    // These events are fired by the RangeEditor plugin
    listeners: {
        pivotbeforeupdate: 'pivotBeforeUpdate',
        pivotupdate: 'pivotUpdate'
    },

    matrixConfig: {
        type: 'local',
        store: {
            type: 'sales'
        }
    },

    // Configure the aggregate dimensions. Multiple dimensions are supported.
    aggregate: [{
        dataIndex:  'value',
        header:     'Total',
        aggregator: 'sum',
        width:      120
    }],

    // Configure the left axis dimensions that will be used to generate the grid rows
    leftAxis: [{
        dataIndex:  'company',
        header:     'Company',
        width:      120
    },{
        dataIndex:  'country',
        header:     'Country',
        direction:  'DESC',
        width:      150
    }],

    /**
     * Configure the top axis dimensions that will be used to generate the columns.
     * When columns are generated the aggregate dimensions are also used. If multiple aggregation dimensions
     * are defined then each top axis result will have in the end a column header with children
     * columns for each aggregate dimension defined.
     */
    topAxis: [{
        dataIndex:  'year',
        header:     'Year'
    }, {
        dataIndex:  'month',
        header:     'Month',
        labelRenderer:  'monthLabelRenderer'
    }],

    items: [{
        docked: 'top',
        xtype: 'toolbar',
        items: [{
            xtype: 'button',
            text: 'Expand all',
            handler: 'expandAll'
        },{
            xtype: 'button',
            text: 'Collapse all',
            handler: 'collapseAll'
        }]
    }]

});
