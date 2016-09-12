Ext.define('KitchenSink.view.LabelAsPlaceHolder', {
    extend: 'Ext.form.Panel',
    xtype: 'labelasplaceholder',

    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Text',
        'Ext.field.TextArea'
    ],

    config: {
        items: {
            xtype: 'fieldset',
            defaults: {
                labelAlign: 'top'
            },
            items: [
                {
                    xtype: 'textfield',
                    label: 'Title',
                    labelAsPlaceHolder: true
                },
                {
                    xtype: 'textfield',
                    label: 'Price',
                    labelAsPlaceHolder: true
                },
                {
                    xtype: 'textfield',
                    label: 'Specific Location (optional)',
                    labelAsPlaceHolder: true
                },
                {
                    xtype: 'textareafield',
                    label: 'Description',
                    labelAsPlaceHolder: true
                }
            ]
        }
    }
});
