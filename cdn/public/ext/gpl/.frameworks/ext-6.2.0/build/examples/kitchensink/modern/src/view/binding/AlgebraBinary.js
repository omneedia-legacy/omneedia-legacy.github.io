/**
 * This example shows data binding using binary operators in expressions.
 */
Ext.define('KitchenSink.view.binding.AlgebraBinary', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.binding-algebra-binary',

    bodyPadding: 10,

    viewModel: {
        type: 'default',
        data: {
            x: 10,
            y: 10
        }
    },

    defaults: {
        border: false,
        xtype: 'panel',
        flex: 1,
        defaults: {
            xtype: 'textfield',
            readOnly: true
        }
    },
    layout: 'hbox',

    items: [{
        items: [{
            xtype: 'spinnerfield',
            stepValue: 1,
            readOnly: false,
            label: 'x',
            bind: '{x}'
        },{
            label: 'x + y',
            bind: '{x + y}'
        }, {
            label: 'x * y',
            bind: '{x * y}'
        }, {
            label: 'x > y',
            bind: '{x > y}'
        }, {
            label: 'x >= y',
            bind: '{x >= y}'
        }, {
            label: 'x == y',
            bind: '{x == y}'
        }, {
            label: 'x === y',
            bind: '{x === y}'
        }, {
            label: 'x > y && y >= 10',
            bind: '{x > y && y >= 10}'
        }]
    }, {
        items: [{
            xtype: 'spinnerfield',
            stepValue: 1,
            readOnly: false,
            label: 'y',
            bind: '{y}'
        },{
            label: 'x - y',
            bind: '{x - y}'
        }, {
            label: 'x / y',
            bind: '{x / y}'
        }, {
            label: 'x < y',
            bind: '{x < y}'
        }, {
            label: 'x <= y',
            bind: '{x <= y}'
        }, {
            label: 'x != y',
            bind: '{x != y}'
        }, {
            label: 'x !== y',
            bind: '{x !== y}'
        }, {
            label: 'x > y || y >= 10',
            bind: '{x > y || y >= 10}'
        }]
    }]
});
