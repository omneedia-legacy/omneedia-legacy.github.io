Ext.define('KitchenSink.view.d3.TreeMapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.treemap',
    
    marketCapValue: function (node) {
        return node.data.cap;
    },

    onNodeValueToggle: function (segmentedButton, button, pressed) {
        var treemap = this.lookupReference('treemap'),
            value = segmentedButton.getValue();

        treemap.setNodeValue(value === 1 ? 'count' : this.marketCapValue);
    }
    
});