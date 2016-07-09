Ext.define('KitchenSink.view.d3.Particles', {
    extend: 'Ext.panel.Panel',
    xtype: 'd3-view-particles',
    controller: 'particles',

    requires: [
        'Ext.d3.canvas.Canvas'
    ],

    // <example>
    // Content between example tags is omitted from code preview.
    otherContent: [
        {
            type: 'Controller',
            path: 'classic/samples/view/d3/ParticlesController.js'
        },
        {
            type: 'Particle',
            path: 'classic/samples/view/d3/Particle.js'
        }
    ],
    // </example>

    width: 860,
    height: 500,

    layout: 'fit',

    items: {
        xtype: 'd3-canvas',
        // D3 is not an abstraction layer, however having crisp looking
        // Canvas visualizations on retina devices requires support for
        // resolution independence, which is provided by 'd3-canvas' component,
        // and is enabled by default.
        // For this example though, we optimize for performance, not looks.
        hdpiSupport: false,
        listeners: {
            sceneresize: 'onSceneResize',
            mousemove: {
                fn: 'onMouseMove',
                element: 'element',
                scope: 'controller'
            }
        }
    }
});
