/**
 * This example shows how data can be exchanged between
 * sources and targets.
 */
Ext.define('KitchenSink.view.drag.Data', {
    extend: 'Ext.Component',
    xtype: 'drag-data',

    padding: 5,

    html: [
        '<div class="data-source">',
            '<div data-days="2" class="handle">Overnight</div>',
            '<div data-days="7" class="handle">Expedited</div>',
            '<div data-days="21" class="handle">Standard</div>',
        '</div>',
        '<div class="data-target">Drop delivery option here</div>'
    ].join(''),

    initialize: function() {
        this.callParent(arguments);

        // When the drag starts, the describe method is used to extract the
        // relevant data that the drag represents and is pushed into the info
        // object for consumption by the target.
        this.source = new Ext.drag.Source({
            element: this.element.down('.data-source'),
            handle: '.handle',
            constrain: this.element,
            describe: function(info) {
                info.setData('postage-duration', info.eventTarget.getAttribute('data-days'));
            },
            listeners: {
                dragstart: function(source, info) {
                    source.getProxy().setHtml(info.eventTarget.innerHTML);
                }
            },
            proxy: {
                type: 'placeholder',
                cls: 'data-proxy'
            }
        });

        this.target = new Ext.drag.Target({
            element: this.element.down('.data-target'),
            validCls: 'data-target-valid',
            listeners: {
                drop: this.onDrop
            }
        });
    },

    onDrop: function(target, info) {
        // Get the data from the info object and use it to display
        // the expectation to the user.
        info.getData('postage-duration').then(function(duration) {
            var s = Ext.String.format('Your parcel will arrive within {0} days', duration);
            Ext.Msg.alert('Delivery set', s);
        });
    }
    //<example>
    ,destroy: function() {
        this.callParent();
        this.target = this.source = Ext.destroy(this.source, this.target);
    }
    //</example>
});
