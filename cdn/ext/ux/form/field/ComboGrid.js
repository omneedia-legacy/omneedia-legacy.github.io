/**
 * A Picker field that contains a tree panel on its popup, enabling selection of tree nodes.
 */
Ext.define('Ext.ux.form.field.ComboGrid', {

    extend: 'Ext.form.field.Picker',
    xtype: 'gridpicker',
    
    uses: [
        'Ext.grid.Panel',
    ],

    triggerCls: Ext.baseCSSPrefix + 'form-arrow-trigger',

    config: {
        /**
         * @cfg {Ext.data.TreeStore} store
         * A tree store that the tree picker will be bound to
         */
        store: null,

        /**
         * @cfg {String} displayField
         * The field inside the model that will be used as the node's text.
         * Defaults to the default value of {@link Ext.tree.Panel}'s `displayField` configuration.
         */
        displayField: null,

        /**
         * @cfg {Array} columns
         * An optional array of columns for multi-column trees
         */
        columns: null,
    },
    
    texts: {
	    
	    selectItems: '???????',
	    
	    closeItems: '???????'
    },
   
    editable: false,

    /**
     * @event select
     * Fires when a tree node is selected
     * @param {Ext.ux.TreePicker} picker        This tree picker
     * @param {Ext.data.Model} record           The selected record
     */

    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    },
    

    /**
     * Creates and returns the tree panel to be used as this field's picker.
     */
    createPicker: function() {
        var me = this,
	        opts = Ext.apply({
	        	shrinkWrapDock: 2,
                manageHeight: false,
        		store: me.store,
                displayField: me.displayField,
                columns: me.columns,
                columnLines: true,
                rowLines: true,
                forceFit: true,
                layout: 'fit',
                floating: true,
                multiSelect: true,
                selModel: {
					selType: 'checkboxmodel'
				},
                viewConfig: {
                	stripeRows: true,
                },
                listeners: {
                    scope: me,
                    itemclick: me.onItemClick,
                },
                dockedItems: me.getDockedItems()
                
	        }, me.listConfig);
        
        var picker = me.picker = Ext.create('Ext.grid.Panel', opts);
        
        return picker;
    },
    
    getDockedItems: function(){
		var me = this;
		var bar = this.dockedItems = new Ext.toolbar.Toolbar({
			dock: 'bottom',
			items: [
				new Ext.toolbar.Fill(),
				new Ext.Button({
					text: me.texts.selectItems,
					handler: me.onGetSelected,
					scope: me,
					glyph: 0xf00c,
				}),
				new Ext.Button({
					text: me.texts.closeItems,
					handler: me.onClose,
					scope: me,
					glyph: 0xf00d
				})
			]
		});
		
		return bar;
    },

    
    onClose: function(){
    
	    this.collapse();
    },
    
    onSelect: function(view, record){
	    
    },
    
    onGetSelected: function(btn, e){
	    var me = this;
	    var grid = me.getPicker();
	    var selection = grid.getSelectionModel().getSelection();
	    
	    if( Ext.isArray(selection) ){
		    
		    var data = [];
		    Ext.Array.each(selection, function(record){
		    	
				Ext.Array.push(data, record);
				me.fireEvent('select', me, record);
		    }, me);
		    
		    this. _setValue(data);
		    this.onClose();
	    }
	    
    },
    
    onItemClick: function(view, record, node, rowIndex, e) {
    	
    	if( !view.ownerCt.multiSelect ){
	    	
	    	this.selectItem(view, record);
	    	this.collapse(); 
    	}
    },
    
    selectItem: function(view, record) {
        var me = this;
        
        me. _setValue(record);
        me.fireEvent('select', me, record);
        
    },
    
    
    onExpand: function() {
        var me = this,
            picker = me.getPicker(),
            store = picker.store,
            value = me.value,
            selected = [];

		if( !Ext.isEmpty(value) ){
			
			Ext.Array.each(value.split(','), function(id){
				
				Ext.Array.push(selected, store.getById(id));
			}, me);
		}
		
		picker.getSelectionModel().select(selected);
    },    

    
    _setValue: function(record) {
        var me = this,
        	displays = [],
        	values = [];
        
		if( !Ext.isArray(record) && Ext.isObject(record) ){
			
			displays.push(record ? record.get(me.displayField) : '');
			values.push(record ? record.get(me.valueField) : '');
		}else{
			
			Ext.Array.each( record, function(item){
			
				Ext.Array.push(displays, (item ? item.get(me.displayField) : ''));
				Ext.Array.push(values, (item ? item.get(me.valueField) : ''));
			}, me);
		}
		
		me.setValue( values );
		me.setRawValue( displays );
		
        return me;
    },
    
    alignPicker: function() {
        var me = this,
            picker;

        if (me.isExpanded) {
            picker = me.getPicker();
            if (me.matchFieldWidth) {

                picker.setWidth(me.bodyEl.getWidth());
            }
            if (picker.isFloating()) {
                me.doAlign();
            }
        }
    },
    

});