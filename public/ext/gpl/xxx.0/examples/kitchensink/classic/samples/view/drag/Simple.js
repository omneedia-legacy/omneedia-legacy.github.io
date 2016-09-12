/**
 * This example shows how to setup a simple drag for an element.
 */
Ext.define('KitchenSink.view.drag.Simple', {
    extend: 'Ext.panel.Panel',
    xtype: 'drag-simple',

    width: 800,
    height: 500,
    title: 'Simple Drag',
    bodyPadding: 5,

    html: '<div class="simple-source">Drag Me!</div>',

    afterRender: function() {
        this.callParent(arguments);
        this.source = new Ext.drag.Source({
            element: this.el.down('.simple-source'),
            constrain: this.body,
            listeners: {
                dragmove: function(source, info) {
                    var pos = info.element.current,
                        html = Ext.String.format('X: {0}, Y: {1}', pos.x, pos.y);

                    source.getElement().setHtml(html);
                },
                dragend: function(source) {
                    source.getElement().setHtml('Drag Me!');
                }
            }
        });
    }
    //<example>
    ,onDestroy: function() {
        this.callParent();
        this.source = Ext.destroy(this.source);
    }
    //</example>
});
