Ext.define('KitchenSink.view.d3.Transitions', {
    extend: 'Ext.panel.Panel',
    xtype: 'd3-view-transitions',
    controller: 'transitions',

    requires: [
        'Ext.d3.svg.Svg'
    ],

    // <example>
    // Content between example tags is omitted from code preview.
    otherContent: [
        {
            type: 'Controller',
            path: 'classic/samples/view/d3/TransitionsController.js'
        }
    ],
    // </example>

    width: 960,
    height: 500,

    layout: 'fit',

    items: {
        xtype: 'd3',
        listeners: {
            scenesetup: 'onSceneSetup'
        }
    }
});
