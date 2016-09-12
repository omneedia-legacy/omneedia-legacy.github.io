Ext.define('KitchenSink.view.d3.heatmap.HeatMap', {
    extend: 'Ext.panel.Panel',
    xtype: 'd3-view-heatmap-heatmap',

    requires: [
        'Ext.d3.HeatMap'
    ],

    // <example>
    // Content between example tags is omitted from code preview.
    otherContent: [
        {
            type: 'Store',
            path: 'classic/samples/store/HeatMap.js'
        }
    ],
    // </example>

    width: 960,
    height: 700,

    layout: 'fit',
    resizable: true,

    items: {
        xtype: 'd3-heatmap',
        store: {
            type: 'heatmap'
        },

        padding: {
            top: 20,
            right: 30,
            bottom: 20,
            left: 80
        },

        xAxis: {
            axis: {
                ticks: 'd3.time.days',
                tickFormat: "d3.time.format('%b %d')",
                orient: 'bottom'
            },
            scale: {
                type: 'time'
            },
            title: {
                text: 'Date'
            },
            field: 'date',
            step: 24 * 60 * 60 * 1000
        },

        yAxis: {
            axis: {
                orient: 'left'
            },
            scale: {
                type: 'linear'
            },
            title: {
                text: 'Count'
            },
            field: 'bucket',
            step: 100
        },
        
        colorAxis: {
            scale: {
                type: 'linear',
                range: ['white', 'green']
            },
            field: 'count',
            minimum: 0
        },

        tiles: {
            attr: {
                'stroke': 'green',
                'stroke-width': 1
            },
            labels: true
        },

        legend: {
            docked: 'bottom',
            padding: 60,
            items: {
                count: 7,
                slice: [1],
                reverse: true,
                size: {
                    x: 60,
                    y: 30
                }
            }
        }
    }
});
