Ext.define('AddressBook.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'mainview',

    requires: [
        'AddressBook.view.Contacts',
        'AddressBook.view.contact.Show',
        'AddressBook.view.contact.Edit'
    ],

    config: {
        autoDestroy: false,

        navigationBar: {
            splitNavigation: false,
            items: [{
                xtype: 'button',
                id: 'editButton',
                text: 'Edit',
                align: 'right',
                hidden: true,
                hideAnimation: {
                    type: 'fadeOut',
                    duration: 200
                },
                showAnimation: {
                    type: 'fadeIn',
                    duration: 200
                }
            }, {
                xtype: 'button',
                id: 'saveButton',
                text: 'Save',
                ui: 'sencha',
                align: 'right',
                hidden: true,
                hideAnimation: {
                    type: 'fadeOut',
                    duration: 200
                },
                showAnimation: {
                    type: 'fadeIn',
                    duration: 200
                }
            }]
        },

        items: [{
            xtype: 'contacts'
        }]
    }
});