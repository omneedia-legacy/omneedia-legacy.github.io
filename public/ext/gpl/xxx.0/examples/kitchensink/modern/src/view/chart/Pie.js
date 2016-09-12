/**
 * Demonstrates how to use Ext.chart.series.Pie
 */
Ext.define('KitchenSink.view.chart.Pie', {
    extend: 'Ext.Panel',
    requires: [
        'Ext.chart.PolarChart',
        'Ext.chart.series.Pie',
        'Ext.chart.interactions.Rotate'
    ],

    controller: 'chart',

    layout: 'fit',
    items: [{
        xtype: 'toolbar',
        docked: 'top',
        cls: 'charttoolbar',
        items: [{
            xtype: 'spacer'
        }, {
            iconCls: 'x-fa fa-picture-o',
            text: 'Theme',
            handler: 'onThemeChange'
        }, {
            iconCls: 'x-fa fa-refresh',
            text: 'Refresh',
            handler: 'onRefresh'
        }, {
            text: 'Reset',
            handler: 'onReset'
        }]
    }, {
        xtype: 'polar',
        store: {
            type: 'pie',
            numRecords: 5
        },
        interactions: ['rotate', 'itemhighlight'],
        legend: {
            position: 'right',
            verticalWidth: 70
        },
        innerPadding: Ext.os.is.Desktop ? 40 : 10,
        series: [{
            type: 'pie',
            xField: 'g1',
            label: {
                field: 'name'
            },
            donut: 30,
            highlightCfg: {
                margin: 20
            },
            style: {
                stroke: 'white',
                miterLimit: 10,
                lineCap: 'miter',
                lineWidth: 2
            }
        }],
        axes: []
    }]
});