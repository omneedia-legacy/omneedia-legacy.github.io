Ext.define('KitchenSink.store.SalesPerEmployee', {
    extend: 'Ext.data.Store',
    alias: 'store.salesperemployee',

    fields: [
        {name: 'employee', type: 'string'},
        {name: 'day', type: 'string'},
        {name: 'sales', type: 'number'}
    ],

    employees: [
        'Adrian',
        'Alex',
        'Kevin',
        'Nige',
        'Phil',
        'Simon',
        'Don',
        'Mike',
        'Ross',
        'Vitaly'
    ],

    days: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
    ],

    generateData: function (iCount, jCount) {
        var me = this,
            data = [],
            min = 20,
            delta = 20 + Math.floor(Math.random() * 260),
            i, j;

        iCount = iCount || me.employees.length;
        jCount = jCount || me.days.length;

        for (i = 0; i < iCount; i++) {
            for (j = 0; j < jCount; j++) {
                data.push({
                    employee: me.employees[i],
                    day: me.days[j],
                    sales: min + Math.floor(Math.random() * delta)
                });
            }
        }

        return data;
    },

    refreshData: function () {
        this.setData(this.generateData());
    },

    refreshDataAndSize: function () {
        var minSize = 1;

        this.setData(this.generateData(
            minSize + Math.round(Math.random() * (this.employees.length - minSize)),
            minSize + Math.round(Math.random() * (this.days.length - minSize))
        ));
    },

    constructor: function (config) {
        config = Ext.apply({
            data: this.generateData()
        }, config);
        this.callParent([config]);
    }

});
