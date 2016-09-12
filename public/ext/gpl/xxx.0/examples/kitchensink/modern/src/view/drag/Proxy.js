/**
 * This example shows options for using a proxy while dragging.
 */
Ext.define('KitchenSink.view.drag.Proxy', {
    extend: 'Ext.Component',
    xtype: 'drag-proxy',

    cls: 'stretch-html',
    padding: 5,
    html: [
        '<div class="proxy-none proxy-source">No proxy</div>',
        '<div class="proxy-original proxy-source">Element as proxy with revert: true</div>',
        '<div class="proxy-placeholder proxy-source">Placeholder</div>'
    ].join(''),

    initialize: function() {
        this.callParent();

        // No proxy, just track the mouse cursor
        this.noneSource = new Ext.drag.Source({
            element: this.element.down('.proxy-none'),
            constrain: this.element,
            proxy: 'none',
            listeners: {
                dragmove: function(source, info) {
                    var pos = info.proxy.current,
                        html = Ext.String.format('X: {0}, Y: {1}', Math.round(pos.x), Math.round(pos.y));

                    source.getElement().setHtml(html);
                },
                dragend: function(source) {
                    source.getElement().setHtml('No proxy');
                }
            }
        });

        // Use the drag element as the proxy. Animate it back into
        // position on drop.
        this.originalSource = new Ext.drag.Source({
            element: this.element.down('.proxy-original'),
            revert: true,
            constrain: this.element,
            proxy: 'original'
        });

        // Leave the drag element in place and create a custom
        // placeholder.
        this.customSource = new Ext.drag.Source({
            element: this.element.down('.proxy-placeholder'),
            constrain: this.element,
            proxy: {
                type: 'placeholder',
                cls: 'proxy-drag-custom',
                html: 'Custom'
            }
        });
    }
    //<example>
    ,destroy: function() {
        this.callParent();
        this.noneSource = Ext.destroy(this.noneSource);
        this.originalSource = Ext.destroy(this.originalSource);
        this.customSource = Ext.destroy(this.customSource);
    }
    //</example>

});
