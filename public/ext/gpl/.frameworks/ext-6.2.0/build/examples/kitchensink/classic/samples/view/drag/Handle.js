/**
 * This example shows how to specify handles. Only the child boxes inside
 * the main element can trigger a drag.
 */
Ext.define('KitchenSink.view.drag.Handle', {
    extend: 'Ext.panel.Panel',
    xtype: 'drag-handle',

    width: 600,
    height: 400,
    title: 'Drag Handles',
    bodyPadding: 5,

    html: [
        '<div class="handle-handles handle-source">',
            '<div class="handle">Drag</div>',
        '</div>',
        '<div class="handle-repeat handle-source">',
            '<div class="handle">Foo</div>',
            '<div class="handle">Bar</div>',
            '<div class="handle">Baz</div>',
        '</div>'
    ].join(''),

    afterRender: function() {
        this.callParent(arguments);

        // This source uses handles to represent a repeating element,
        // so when the item is dragged, contextual information can
        // be gained from the item.
        this.repeatSource = new Ext.drag.Source({
            groups: 'repeat',
            element: this.el.down('.handle-repeat'),
            handle: '.handle',
            constrain: this.body,
            listeners: {
                dragstart: function(source, info) {
                    source.getProxy().setHtml(info.eventTarget.innerHTML);
                }
            },
            proxy: {
                type: 'placeholder',
                cls: 'handle-proxy'
            }
        });

        // This source is only draggable by the handle.
        this.handleSource = new Ext.drag.Source({
            element: this.el.down('.handle-handles'),
            handle: '.handle',
            constrain: this.body
        });
    }
    //<example>
    ,onDestroy: function() {
        this.callParent();
        this.repeatSource = Ext.destroy(this.repeatSource);
        this.handleSource = Ext.destroy(this.handleSource);
    }
    //</example>

});
