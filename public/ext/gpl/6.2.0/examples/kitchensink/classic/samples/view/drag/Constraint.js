/**
 * This example shows various options for constraining draggable items.
 */
Ext.define('KitchenSink.view.drag.Constraint', {
    extend: 'Ext.panel.Panel',
    xtype: 'drag-constraint',

    width: 800,
    height: 500,
    title: 'Drag Constraints',
    bodyPadding: 5,

    html: [
        '<div class="constrain-drag-ct">',
            '<div class="constrain-parent constrain-source">To parent</div>',
        '</div>',
        '<div class="constrain-vertical constrain-source">Vertical</div>',
        '<div class="constrain-horizontal constrain-source">Horizontal</div>',
        '<div class="constrain-snap constrain-source">snap: 60,50</div>'
    ].join(''),

    afterRender: function() {
        this.callParent(arguments);

        // Constrain to the direct parent element
        this.toParentSource = new Ext.drag.Source({
            element: this.el.down('.constrain-parent'),
            constrain: {
                // True means constrain to the parent element
                element: true
            }
        });

        // Allow only vertical dragging. Constrain to the owner panel.
        this.verticalSource = new Ext.drag.Source({
            element: this.el.down('.constrain-vertical'),
            constrain: {
                element: this.body,
                vertical: true
            }
        });

        // Allow only horizontal dragging. Constrain to the owner panel.
        this.horizontalSource = new Ext.drag.Source({
            element: this.el.down('.constrain-horizontal'),
            constrain: {
                // Constrain dragging vertically only. Also to the parent container.
                element: this.body,
                horizontal: true
            }
        });

        // Snap drag to a [30, 50] grid. Constrain to the owner panel.
        this.snapSource = new Ext.drag.Source({
            element: this.el.down('.constrain-snap'),
            constrain: {
                element: this.body,
                snap: {
                    x: 60,
                    y: 50
                }
            }
        });
    }
    //<example>
    ,onDestroy: function() {
        this.callParent();
        this.toParentSource = Ext.destroy(this.toParentSource);
        this.verticalSource = Ext.destroy(this.verticalSource);
        this.horizontalSource = Ext.destroy(this.horizontalSource);
        this.snapSource = Ext.destroy(this.snapSource);
    }
    //</example>

});
