/**
 * This example shows options for using a proxy while dragging.
 */
Ext.define('KitchenSink.view.drag.Proxy', {
    extend: 'Ext.panel.Panel',
    xtype: 'drag-proxy',

    width: 600,
    height: 500,
    title: 'Drag Proxies',
    bodyPadding: 5,

    html: [
        '<div class="proxy-none proxy-source">No proxy</div>',
        '<div class="proxy-original proxy-source">Element as proxy with revert: true</div>',
        '<div class="proxy-placeholder proxy-source">Placeholder</div>'
    ].join(''),

    afterRender: function() {
        this.callParent(arguments);

        // No proxy, just track the mouse cursor
        this.noneSource = new Ext.drag.Source({
            element: this.el.down('.proxy-none'),
            constrain: this.body,
            proxy: 'none',
            listeners: {
                dragmove: function(source, info) {
                    var pos = info.proxy.current,
                        html = Ext.String.format('X: {0}, Y: {1}', pos.x, pos.y);

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
            element: this.el.down('.proxy-original'),
            revert: true,
            constrain: this.body,
            proxy: 'original'
        });

        // Leave the drag element in place and create a custom
        // placeholder.
        this.customSource = new Ext.drag.Source({
            element: this.el.down('.proxy-placeholder'),
            constrain: this.body,
            proxy: {
                type: 'placeholder',
                cls: 'proxy-drag-custom',
                html: 'Custom'
            }
        });
    }
    //<example>
    ,onDestroy: function() {
        this.callParent();
        this.noneSource = Ext.destroy(this.noneSource);
        this.originalSource = Ext.destroy(this.originalSource);
        this.customSource = Ext.destroy(this.customSource);
    }
    //</example>

});
