Ext.define('KitchenSink.view.grid.CheckboxSelection', {
    extend: 'Ext.grid.Panel',
    xtype: 'checkbox-selection',

    //<example>
    otherContent: [{
        type: 'Store',
        path: 'classic/samples/store/Companies.js'
    }, {
        type: 'Model',
        path: 'classic/samples/model/Company.js'
    }],
    profiles: {
        classic: {
            width: 700
        },
        neptune: {
            width: 750
        }
    },
    //</example>

    title: 'Framed with Checkbox Selection and Horizontal Scrolling',
    width: '${width}',
    height: 300,

    store: 'Companies',
    columnLines: true,
    frame: true,
    selType: 'checkboxmodel',

    columns: [{
        text: "Company",
        dataIndex: 'name',

        flex: 1
    }, {
        text: "Price",
        dataIndex: 'price',

        formatter: 'usMoney'
    }, {
        text: "Change",
        dataIndex: 'change'
    }, {
        text: "% Change",
        dataIndex: 'pctChange'
    }, {
        text: "Last Updated",
        dataIndex: 'lastChange',

        width: 120,
        formatter: 'date("m/d/Y")'
    }]
});
