Ext.define("omneedia.VideoPlayer", {
    
    singleton : true,	
	create: function(id,obj)
	{
		var src="/app/";
		swfobject.embedSWF(
			src+"StrobeMediaPlayback.swf"
			, id
			, obj.width
			, obj.height
			, "10.1.0"
			, "expressInstall.swf"
			, {
                src: obj.src,
                autoPlay: obj.autoplay,
                verbose: false,
                controlBarAutoHide: obj.controlBarAutoHide,
                controlBarPosition: obj.controlBarPosition,
                poster: obj.poster,
				streamType: "recorded",
                /*javascriptCallbackFunction: "jsbridge",*/
                plugin_hls: src+"HLSProviderOSMF.swf"
            }
			, {
	               allowFullScreen: "true",
	               wmode: "direct"
	           }
			, {
	               name: src+"StrobeMediaPlayback"
	          }
		);	
	}
	
});
