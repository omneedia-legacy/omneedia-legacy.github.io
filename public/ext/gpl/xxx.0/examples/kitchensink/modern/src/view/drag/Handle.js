/**
 * This example shows how to specify handles. Only the child boxes inside
 * the main element can trigger a drag.
 */
Ext.define('KitchenSink.view.drag.Handle', {
    extend: 'Ext.Component',
    xtype: 'drag-handle',

    cls: 'stretch-html',
    padding: 5,
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

    initialize: function() {
        this.callParent();

        // This source uses handles to represent a repeating element,
        // so when the item is dragged, contextual information can
        // be gained from the item.
        this.repeatSource = new Ext.drag.Source({
            groups: 'repeat',
            element: this.element.down('.handle-repeat'),
            handle: '.handle',
            constrain: this.element,
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
            element: this.element.down('.handle-handles'),
            handle: '.handle',
            constrain: this.element
        });
    }
    //<example>
    ,destroy: function() {
        this.callParent();
        this.repeatSource = Ext.destroy(this.repeatSource);
        this.repeatTarget = Ext.destroy(this.repeatTarget);
        this.handleSource = Ext.destroy(this.handleSource);
    }
    //</example>

});
