Ext.define('KitchenSink.view.pivot.PivotController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.pivot',

    init: function(view){
        var events = ['pivotgroup', 'pivotitem', 'pivottotal', 'pivotgroupcell', 'pivotitemcell', 'pivottotalcell'],
            tapEvents = ['tap', 'singletap', 'doubletap', 'taphold'],
            eventListeners = {scope: this},
            i, j;

        for(i = 0; i < events.length; i++){
            for(j = 0; j < tapEvents.length; j++){
                eventListeners[events[i] + tapEvents[j]] = this.getPivotEventHandler(events[i] + tapEvents[j]);
            }
        }
        eventListeners.pivotgroupexpand = this.getPivotEventHandler('pivotgroupexpand');
        eventListeners.pivotgroupcollapse = this.getPivotEventHandler('pivotgroupcollapse');

        this.getView().on(eventListeners);

        return this.callParent([view]);
    },

    getPivotEventHandler: function(event){
        return function(){
            Ext.log({msg: event + ': ', dump: arguments});
        }
    },

    yearLabelRenderer: function(value){
        return 'Year ' + value;
    },

    monthLabelRenderer: function(value){
        return Ext.Date.monthNames[value];
    },

    expandAll: function(){
        this.getView().expandAll();
    },

    collapseAll: function(){
        this.getView().collapseAll();
    }

});

