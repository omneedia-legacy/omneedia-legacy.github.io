/**
 * Controls the RangeEditor and CellEditing plugin examples.
 */
Ext.define('KitchenSink.view.pivot.RangeEditorController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.rangeeditorcontroller',

    pivotBeforeUpdate: function(){
        Ext.log('pivotbeforeupdate triggered');
    },

    pivotUpdate: function(){
        Ext.log('pivotupdate triggered');
    }

});