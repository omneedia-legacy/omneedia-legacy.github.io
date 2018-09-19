/**
 * This example shows how to use the number field.
 */
Ext.define('KitchenSink.view.form.Number', {
    extend: 'Ext.form.Panel',
    xtype: 'form-number',
    
    //<example>
    requires: [
        'Ext.form.field.Number'
    ],
    
    exampleTitle: 'Number Field',
    //</example>
    
    profiles: {
        classic: {
            width: 340,
            labelWidth: 110
        },
        neptune: {
            width: 340,
            labelWidth: 110
        },
        graphite: {
            width: 450,
            labelWidth: 170
        }
    },
    title: 'Number fields with spinner',
    bodyPadding: 5,
    frame: true,
    width: '${width}',
    defaultType: 'numberfield',
    
    fieldDefaults: {
        labelWidth: '${labelWidth}',
        anchor: '100%'
    },
    
    items: [{
        fieldLabel: 'Default',
        name: 'basic',
        value: 1,
        minValue: 1,
        maxValue: 125
    }, {
        fieldLabel: 'With a step of 0.4',
        name: 'test',
        minValue: -100,
        maxValue: 100,
        allowDecimals: true,
        decimalPrecision: 1,
        step: 0.4
    }, {
        hideTrigger: true,
        fieldLabel: 'Without spinner',
        name: 'without_spinner'
    }]
});
