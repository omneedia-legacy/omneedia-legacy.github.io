/**
 * This example shows data binding using unary operators in expressions.
 */
Ext.define('KitchenSink.view.binding.AlgebraUnary', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.binding-algebra-unary',

    bodyPadding: 10,

    viewModel: {
        type: 'default',
        data: {
            x: 1,
            package: 'core'
        }
    },

    defaults: {
        xtype: 'textfield',
        readOnly: true
    },

    items: [{
        xtype: 'spinnerfield',
        stepValue: 1,
        readOnly: false,
        label: 'x',
        bind: '{x}'
    }, {
        label: '!x',
        bind: '{!x}'
    },{
        label: '+x',
        bind: '{+x}'
    },{
        label: '-x',
        bind: '{-x}'
    },{
        label: 'Globals',
        //expressions should have at least one token to be evaluated
        bind: 'ExtJS version: {@Ext.versions.core.version} ({package})'
    }]
});
