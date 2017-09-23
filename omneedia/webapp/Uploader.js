
Ext.define("omneedia.webapp.Uploader.Image", {
	extend: "Ext.Panel",
	xtype: "uploadimage",
	height: 120,
	getValue: function()
	{
		try {
			return $('#'+this.id+'_dragload').html().split('src=')[1].split('"')[1];
		} catch(e) {
			return ""
		}
	},
	setValue: function(b64)
	{
		$('#'+this.id+'_img').remove();
		$('<img style="position:absolute;top:0px;left:0px;width:100%;height:100%" id="'+this.id+'_img"></img>').appendTo('#'+this.id+'_dragload');
		$('#'+this.id+'_img').attr('src', b64);
	},
	onDrop: function()
	{
		this.fireEvent('drop', this);		
	},
	onRender: function() {
        this.autoEl = Ext.apply({}, this.initialConfig, this.autoEl);
        this.callParent(arguments);
		var _p=this;
		$('<img style="position:absolute;top:0px;left:0px;width:100%;height:100%" id="'+this.id+'_img"></img>').appendTo('#'+this.id+'_dragload');
		$(document).on('drop', '#'+this.id+'_img', function(e) {
			if(e.originalEvent.dataTransfer){
					if(e.originalEvent.dataTransfer.files.length) {
						var f=e.originalEvent.dataTransfer.files[0];
						e.preventDefault();
						e.stopPropagation();
						if (!f.type.match('image/jpeg')) {
							if (!f.type.match('image/png')) {
								if (!f.type.match('image/gif')) return false;
							}
						};						
						var reader = new FileReader();
						reader.onload = function(evt){
							$('#'+_p.id+'_img').attr('src', evt.target.result);
							_p.value=evt.target.result;
							_p.onDrop();
						};
						reader.readAsDataURL(f); 
					}  
			};
			return false;
		});
		
    },

	initComponent: function() {
        Ext.apply(this, {
			html: '<div id="'+this.id+'_dragload"><h1>...</h1></div>'
        });
        this.callParent(arguments);
    }
});
