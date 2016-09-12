/**
 * This example shows how to setup a simple drag for an element.
 */
Ext.define('KitchenSink.view.drag.Simple', {
    extend: 'Ext.Component',
    xtype: 'drag-simple',

    cls: 'stretch-html',
    padding: 5,
    html: '<div class="simple-source">Drag Me!</div>',

    initialize: function() {
        this.callParent();
        this.source = new Ext.drag.Source({
            element: this.element.down('.simple-source'),
            constrain: true,
            listeners: {
                dragmove: function(source, info) {
                    var pos = info.element.current,
                        html = Ext.String.format('X: {0}, Y: {1}', Math.round(pos.x), Math.round(pos.y));

                    source.getElement().setHtml(html);
                },
                dragend: function(source) {
                    source.getElement().setHtml('Drag Me!');
                }
            }
        });
    }
    //<example>
    ,destroy: function() {
        this.source = Ext.destroy(this.source);
        this.callParent();
    }
    //</example>
});