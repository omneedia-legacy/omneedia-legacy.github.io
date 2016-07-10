Ext.define('KitchenSink.view.pivot.RangeEditorController', {
    extend: 'KitchenSink.view.pivot.PivotController',

    alias: 'controller.kspivotrangeeditor',

    pivotBeforeUpdate: function(){
        Ext.log('pivotbeforeupdate triggered');
    },

    pivotUpdate: function(){
        Ext.log('pivotupdate triggered');
    }

});