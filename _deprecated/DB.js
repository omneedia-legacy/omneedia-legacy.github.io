
Ext.define("omneedia.DB", {
    statics : {
		remote : "",
		namespace: "",	
		DB: "",
		using : function(namespace,uri)
		{
			var _p=this;
			this.namespace=APP_NAMESPACE;
			
			if (Settings) {			
				if (Settings.REMOTE_API) this.remote=Settings.REMOTE_API;
			}			
			
			if (!namespace) throw("GURU MEDITATION: db namespace not provided");
			if (!uri) throw("GURU MEDITATION: db uri not provided");
			
			var db=uri.split('db://')[1];
			if (!db) throw("GURU MEDITATION: Invalid db uri");
			
			/* remote */
			if (this.remote!="")
			{
				var remote="http://"+this.remote+"/db/"+db+"/?javascript="+namespace;
				var script=document.createElement('script');
				script.src=remote;
				document.getElementsByTagName('head')[0].appendChild(script);
			}
		}
	}
});

DB = omneedia.DB;
