Ext.namespace('Ext.ux.form');

Ext.define('Ext.ux.form.SearchBox', {
    extend: 'Ext.form.TwinTriggerField',
    alias: 'widget.ux-searchbox',

    initComponent: function() {
        var _cp = this;
        _cp.addEvents({
            click: true
        });

        this.searchFunction = null
        this.clearFunction = null;
        this.incremental = true;
        this.triggerCls = Ext.baseCSSPrefix + 'form-search-trigger';
        this.enableKeyEvents = true;

        this.onTriggerClick = function() {
            _cp.fireEvent('click', _cp.getValue());
        };

        this.callParent();
    }
});