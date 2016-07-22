Ext.define('Ext.ux.ObjectBrowser', {
    
	extend: 'Ext.tree.Panel',
	alias:	'widget.objectbrowser',
	
	initComponent: function () {
    		Ext.apply(this, {
			forceFit: true,
			useArrows: true,
			rootVisible: false,
			multiSelect: false,
			autoScroll:true,
			columns: [{
				xtype: 'treecolumn',
				text: 'Key',
				sortable: true,
				dataIndex: 'key',
				width: 300
			}, {
				text: 'Value',
				sortable: true,
				dataIndex: 'value',
				flex: 1
			}]
		});
		if (!this.data) this.data=[];
		this.store = this.createStore(this.data);
		Ext.ux.ObjectBrowser.superclass.initComponent.apply(this, arguments);
	},
    
	createStore: function (data) {
		Ext.define(this.id + '-Objects', {
			extend: 'Ext.data.Model',
			fields: [{
				name: 'key',
				type: 'string'
			}, {
				name: 'value',
				type: 'string'
			}]
		});

    	var o = { text: 'root' };
    	o.children = this.parseObject(data);
    	
		var store = Ext.create('Ext.data.TreeStore', {
        		folderSort: true,
			model: this.id + '-Objects',
			proxy: {
				type: 'memory',
				data: o
			}
		});
		return store;
	},
	setData: function(result) {
		var store = this.createStore(result);
		this.reconfigure(store);
		this.getStore().load();	
		this.getStore().sort('key', 'ASC');
	},
	parseObject: function (o) {
		var items = [];

		if (o.hasOwnProperty('length') && (typeof o === 'object')) {
			var idx = o.length;
			while (idx--) {
				if (typeof o[idx] === 'object') {
					items.push({
						key: '[' + idx + ']',
						value: '',
						iconCls: 'tree-node-' + this.findType(o[idx]),
						children: this.parseObject(o[idx])
					});
				} else {
					var dat=o[idx];
					try {
						if (dat.indexOf('<div')==-1) { 
							if (dat.indexOf('http')>-1) {
								if (dat.indexOf('jpg')>-1) dat='<p align=center><img width=300 src="'+dat+'"></img><br><a target=_blank href="'+dat+'">'+dat+'</a></p>';
								else
								if (dat.indexOf('png')>-1) dat='<p align=center><img width=300 src="'+dat+'"></img><br><a target=_blank href="'+dat+'">'+dat+'</a></p>';
								else
								dat='<a target=_blank href="'+dat+'">'+dat+'</a>';
							}
						}
					}catch(ex) {
					
					};
					items.push({
						key: '[' + idx + ']',
						value: dat,
						leaf: true,
						iconCls: 'tree-node-' + this.findType(o[idx])
					});
				}
			}
		}
		else if (!o.hasOwnProperty('length') && (typeof o === 'object')) {
			for (var key in o) {
				if (o.hasOwnProperty(key)) {
					if (typeof o[key] === 'object') {
						items.push({
							key: key,
							value: '',
							iconCls: 'tree-node-' + this.findType(o[key]),
							children: this.parseObject(o[key])
						});
					} else {
						var dat=o[key];
						try {
							if (dat.indexOf('<div')==-1) { 
								if (dat.indexOf('http')>-1) {
									if (dat.indexOf('jpg')>-1) dat='<p align=center><img width=300 src="'+dat+'"></img><br><a target=_blank href="'+dat+'">'+dat+'</a></p>';
									else
									if (dat.indexOf('png')>-1) dat='<p align=center><img width=300 src="'+dat+'"></img><br><a target=_blank href="'+dat+'">'+dat+'</a></p>';
									else
									dat='<a target=_blank href="'+dat+'">'+dat+'</a>';
								}
							}
						}catch(ex) {
						
						};
						items.push({
							key: key,
							value: dat,
							leaf: true,
							iconCls: 'tree-node-' + this.findType(o[key]),
						});
					}
				}
			}
		}

		return items;
	},

	findType: function (o) {
		if (typeof o === 'object') {
			if (o.hasOwnProperty('length')) {
				return 'array';
			} else {
				return 'object';
			}
		} else {
			return typeof o;
		}
	}
});