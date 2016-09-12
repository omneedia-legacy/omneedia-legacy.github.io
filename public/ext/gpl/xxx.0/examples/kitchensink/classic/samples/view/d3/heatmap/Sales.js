Ext.define('KitchenSink.view.d3.heatmap.Sales', {
    extend: 'Ext.panel.Panel',
    xtype: 'd3-view-heatmap-sales',
    controller: 'heatmap-sales',

    requires: [
        'Ext.d3.HeatMap'
    ],

    // <example>
    // Content between example tags is omitted from code preview.
    otherContent: [
        {
            type: 'Store',
            path: 'classic/samples/store/SalesPerEmployee.js'
        }
    ],
    // </example>

    width: 960,
    height: 600,

    layout: 'fit',
    resizable: true,

    tbar: [
        '->',
        {
            text: 'Refresh Data',
            handler: 'onRefreshData'
        },
        {
            text: 'Refresh Data and Size',
            handler: 'onRefreshDataAndSize'
        }
    ],

    items: {
        xtype: 'd3-heatmap',
        reference: 'heatmap',

        store: {
            type: 'salesperemployee'
        },

        padding: {
            top: 20,
            right: 30,
            bottom: 70,
            left: 120
        },

        xAxis: {
            axis: {
                orient: 'bottom'
            },
            scale: {
                type: 'ordinal'
            },
            title: {
                text: 'Employee',
                attr: {
                    'font-size': '14px'
                }
            },
            field: 'employee'
        },

        yAxis: {
            axis: {
                orient: 'left'
            },
            scale: {
                type: 'ordinal'
            },
            title: {
                text: 'Day',
                attr: {
                    'font-size': '14px'
                }
            },
            field: 'day'
        },

        colorAxis: {
            scale: {
                type: 'linear',
                range: ['#ffffd9', '#49b6c4', '#225ea8']
            },
            field: 'sales'
        },

        legend: {
            docked: 'right',
            padding: 50,
            items: {
                count: 10,
                slice: [1],
                reverse: true,
                size: {
                    x: 60,
                    y: 30
                }
            }
        },

        tiles: {
            attr: {
                'stroke': '#081d58',
                'stroke-width': 2
            },
            labels: true
        },

        title: {
            docked: 'top',
            title: {
                text: 'Sales per Employee per Day'
            },
            subtitle: {
                text: ''
            }
        }
    }
});
