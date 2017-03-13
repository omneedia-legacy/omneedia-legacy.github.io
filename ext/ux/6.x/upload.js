/*

CONNECTION

*/

/**
 * Modified Ext.data.Connection object, adapted to be able to report progress.
 */

Ext.define('Ext.ux.upload.data.Connection', {
    extend : 'Ext.data.Connection',

    /**
     * @cfg {Function}
     * 
     * Callback fired when a progress event occurs (xhr.upload.onprogress).
     */
    progressCallback : null,

    request : function(options) {
        var progressCallback = options.progress;
        if (progressCallback) {
            this.progressCallback = progressCallback;
        }

        this.callParent(arguments);
    },

    getXhrInstance : function() {
        var xhr = this.callParent(arguments);

        if (this.progressCallback) {
            xhr.upload.onprogress = this.progressCallback;
        }

        return xhr;
    }
});

/**
 * Abstract filename encoder.
 */
Ext.define('Ext.ux.upload.header.AbstractFilenameEncoder', {

    config : {},

    type : 'generic',

    contructor : function(config) {
        //this.initConfig(config);
    },

    encode : function(filename) {},

    getType : function() {
        return this.type;
    }
});

/**
 * Base64 filename encoder - uses the built-in function window.btoa().
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window.btoa
 */
Ext.define('Ext.ux.upload.header.Base64FilenameEncoder', {
    extend : 'Ext.ux.upload.header.AbstractFilenameEncoder',

    config : {},

    type : 'base64',

    encode : function(filename) {
        return window.btoa(unescape(encodeURIComponent(filename)));
    }
});


/*

UPLOADER

*/

/**
 * Abstract uploader object.
 * 
 * The uploader object implements the the upload itself - transports data to the server. This is an "abstract" object
 * used as a base object for all uploader objects.
 * 
 */
Ext.define('Ext.ux.upload.uploader.AbstractUploader', {
    mixins : {
        observable : 'Ext.util.Observable'
    },

    config : {
        /**
         * @cfg {Number} [maxFileSize=50000000]
         * 
         * (NOT IMPLEMENTED) The maximum file size allowed to be uploaded.
         */
        maxFileSize : 50000000,

        /**
         * @cfg {String} url (required)
         * 
         * The server URL to upload to.
         */
        url : '',

        /**
         * @cfg {Number} [timeout=60000]
         * 
         * The connection timeout in miliseconds.
         */
        timeout : 60 * 1000,

        /**
         * @cfg {String} [contentType='application/binary']
         * 
         * The content type announced in the HTTP headers. It is autodetected if possible, but if autodetection
         * cannot be done, this value is set as content type header.
         */
        contentType : 'application/binary',

        /**
         * @cfg {String} [filenameHeader='X-File-Name']
         * 
         * The name of the HTTP header containing the filename.
         */
        filenameHeader : 'X-File-Name',

        /**
         * @cfg {String} [sizeHeader='X-File-Size']
         * 
         * The name of the HTTP header containing the size of the file.
         */
        sizeHeader : 'X-File-Size',

        /**
         * @cfg {String} [typeHeader='X-File-Type']
         * 
         * The name of the HTTP header containing the MIME type of the file.
         */
        typeHeader : 'X-File-Type',

        /**
         * @cfg {Object}
         * 
         * Additional parameters to be sent with the upload request.
         */
        params : {},

        /**
         * @cfg {Object}
         * 
         * Extra headers to be sent with the upload request.
         */
        extraHeaders : {},

        /**
         * @cfg {Object/String}
         * 
         * Encoder object/class used to encode the filename header. Usually used, when the filename
         * contains non-ASCII characters.
         */
        filenameEncoder : null,

        filenameEncoderHeader : 'X-Filename-Encoder'
    },

    /**
     * Constructor.
     * @param {Object} [config]
     */
    constructor : function(config) {
        this.mixins.observable.constructor.call(this);

        /*this.addEvents({
            uploadfailure : true,
            uploadsuccess : true,
            uploadprogress : true
        });*/

        //this.initConfig(config);
    },

    /**
     * @protected
     */
    initHeaders : function(item) {
        var headers = this.extraHeaders || {},
            filename = item.getFilename();

		/*
		 * If there is a filename encoder defined - use it to encode the filename
		 * in the header and set the type of the encoder as an additional header.
		 */
        var filenameEncoder = this.initFilenameEncoder();
        if (filenameEncoder) {
            filename = filenameEncoder.encode(filename);
            headers[this.filenameEncoderHeader] = filenameEncoder.getType();
        }
        headers[this.filenameHeader] = filename;
        headers[this.sizeHeader] = item.getSize();
        headers[this.typeHeader] = item.getType();

        return headers;
    },

    /**
     * @abstract
     * 
     * Upload a single item (file). 
     * **Implement in subclass**
     * 
     * @param {Ext.ux.upload.Item} item
     */
    uploadItem : function(item) {},

    /**
     * @abstract
     * 
     * Aborts the current upload. 
     * **Implement in subclass**
     */
    abortUpload : function() {},

    /**
     * @protected
     */
    initFilenameEncoder : function() {
        if (Ext.isString(this.filenameEncoder)) {
            this.filenameEncoder = Ext.create(this.filenameEncoder);
        }

        if (Ext.isObject(this.filenameEncoder)) {
            return this.filenameEncoder;
        }

        return null;
    }

});

/**
 * Abstract uploader with features common for all XHR based uploaders.
 */
Ext.define('Ext.ux.upload.uploader.AbstractXhrUploader', {
    extend : 'Ext.ux.upload.uploader.AbstractUploader',

    onUploadSuccess : function(response, options, item) {
        var info = {
            success : true,
            message : '',
            response : response
        };

        if (response.responseText) {
            var responseJson = Ext.decode(response.responseText);
            if (responseJson) {
                Ext.apply(info, {
                    success : responseJson.success,
                    message : responseJson.message
                });

				var eventName = info.success ? 'uploadsuccess' : 'uploadfailure';
                this.fireEvent(eventName, item, info);
                return;
            }
        }

        this.fireEvent('uploadsuccess', item, info);
    },

    onUploadFailure : function(response, options, item) {
        var info = {
            success : false,
            message : 'http error',
            response : response
        };

        this.fireEvent('uploadfailure', item, info);
    },

    onUploadProgress : function(event, item) {
        this.fireEvent('uploadprogress', item, event);
    }
});


/**
 * Uploader implementation which uses a FormData object to send files through XHR requests.
 * 
 */
Ext.define('Ext.ux.upload.uploader.FormDataUploader', {
    extend : 'Ext.ux.upload.uploader.AbstractXhrUploader',

    requires : [
        'Ext.ux.upload.data.Connection'
    ],

    method : 'POST',
    xhr : null,

    initConnection : function() {
        var xhr = new XMLHttpRequest(),
            method = this.method,
            url = '/';

        xhr.open(method, url, true);

        this.abortXhr = function() {
            this.suspendEvents();
            xhr.abort();
            this.resumeEvents();
        };

        return xhr;
    },

    uploadItem : function(item) {
        var file = item.getFileApiObject();
		
        item.setUploading();

        var formData = new FormData();
        formData.append(file.name, file);

        var xhr = this.initConnection();

        xhr.setRequestHeader(this.filenameHeader, file.name);
        xhr.setRequestHeader(this.sizeHeader, file.size);
        xhr.setRequestHeader(this.typeHeader, file.type);

        var loadendhandler = Ext.Function.bind(this.onLoadEnd, this, [
                item
            ], true);

        var progresshandler = Ext.Function.bind(this.onUploadProgress, this, [
                item
            ], true);

        xhr.addEventListener('loadend', loadendhandler, true);
        xhr.upload.addEventListener("progress", progresshandler, true);

        xhr.send(formData);
    },

    /**
     * Implements {@link Ext.ux.upload.uploader.AbstractUploader#abortUpload}
     */
    abortUpload : function() {
        this.abortXhr();
    },

    /**
     * @protected
     * 
     * A placeholder for the abort procedure.
     */
    abortXhr : function() {
    },

    onLoadEnd : function(event, item) {
        var response = event.target;

        if (response.status != 200) {
            return this.onUploadFailure(response, null, item);
        }

        return this.onUploadSuccess(response, null, item);
    }
});

/**
 * Uploader implementation - with the Connection object in ExtJS 4
 * 
 */
Ext.define('Ext.ux.upload.uploader.ExtJsUploader', {
    extend : 'Ext.ux.upload.uploader.AbstractXhrUploader',

    requires : [
        'Ext.ux.upload.data.Connection'
    ],

    config : {
        /**
         * @cfg {String} [method='PUT']
         * 
         * The HTTP method to be used.
         */
        method : 'PUT',

        /**
         * @cfg {Ext.data.Connection}
         * 
         * If set, this connection object will be used when uploading files.
         */
        connection : null
    },

    /**
     * @property
     * @private
     * 
     * The connection object.
     */
    conn : null,

    /**
     * @private
     * 
     * Initializes and returns the connection object.
     * 
     * @return {Ext.ux.upload.data.Connection}
     */
    initConnection : function() {
        var conn,
            url = this.url;

        if (this.connection instanceof Ext.data.Connection) {
            conn = this.connection;
        } else {

            if (this.params) {
                url = Ext.urlAppend(url, Ext.urlEncode(this.params));
            }

            conn = Ext.create('Ext.ux.upload.data.Connection', {
                disableCaching : true,
                method : this.method,
                url : url,
                timeout : this.timeout,
                defaultHeaders : {
                    'Content-Type' : this.contentType,
                    'X-Requested-With' : 'XMLHttpRequest'
                }
            });
        }

        return conn;
    },

    /**
     * @protected
     */
    initHeaders : function(item) {
        var headers = this.callParent(arguments);

        headers['Content-Type'] = item.getType();

        return headers;
    },

    /**
     * Implements {@link Ext.ux.upload.uploader.AbstractUploader#uploadItem}
     * 
     * @param {Ext.ux.upload.Item} item
     */
    uploadItem : function(item) {
        var file = item.getFileApiObject();
        if (!file) {
            return;
        }

        item.setUploading();

        this.conn = this.initConnection();

        /*
         * Passing the File object directly as the "rawFata" option.
         * Specs:
         *   https://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html#the-send()-method
         *   http://dev.w3.org/2006/webapi/FileAPI/#blob
         */
        this.conn.request({
            scope : this,
            headers : this.initHeaders(item),
            rawData : file,

            success : Ext.Function.bind(this.onUploadSuccess, this, [
                    item
                ], true),
            failure : Ext.Function.bind(this.onUploadFailure, this, [
                    item
                ], true),
            progress : Ext.Function.bind(this.onUploadProgress, this, [
                    item
                ], true)
        });

    },

    /**
     * Implements {@link Ext.ux.upload.uploader.AbstractUploader#abortUpload}
     */
    abortUpload : function() {
        if (this.conn) {
        	/*
        	 * If we don't suspend the events, the connection abortion will cause a failure event. 
        	 */
        	this.suspendEvents();
            this.conn.abort();
            this.resumeEvents();
        }
    }
});


/**
 * Uploader implementation - with the Connection object in ExtJS 4
 * 
 */
Ext.define('Ext.ux.upload.uploader.ExtJsUploader', {
    extend : 'Ext.ux.upload.uploader.AbstractUploader',

    requires : [
        'Ext.ux.upload.data.Connection'
    ],

    /**
     * @property
     * 
     * The connection object.
     */
    conn : null,

    /**
     * @private
     * 
     * Initializes and returns the connection object.
     * 
     * @return {Ext.ux.upload.data.Connection}
     */
    initConnection : function() {
        var url = this.url;
        if (this.params) {
            url = Ext.urlAppend(url, Ext.urlEncode(this.params));
        }

        var conn = Ext.create('Ext.ux.upload.data.Connection', {
            disableCaching : true,
            method : this.method,
            url : url,
            timeout : this.timeout,
            defaultHeaders : {
                'Content-Type' : this.contentType,
                'X-Requested-With' : 'XMLHttpRequest'
            }
        });

        return conn;
    },

    /**
     * Implements {@link Ext.ux.upload.uploader.AbstractUploader#uploadItem}
     * 
     * @param {Ext.ux.upload.Item} item
     */
    uploadItem : function(item) {
        var file = item.getFileApiObject();

        if (!file) {
            return;
        }

        item.setUploading();

        this.conn = this.initConnection();

        this.conn.request({
            scope : this,
            headers : this.initHeaders(item),
            xmlData : file,

            success : Ext.Function.bind(this.onUploadSuccess, this, [
                    item
                ], true),
            failure : Ext.Function.bind(this.onUploadFailure, this, [
                    item
                ], true),
            progress : Ext.Function.bind(this.onUploadProgress, this, [
                    item
                ], true)
        });
    },

    /**
     * Implements {@link Ext.ux.upload.uploader.AbstractUploader#abortUpload}
     */
    abortUpload : function() {
        if (this.conn) {
            this.conn.abort();
        }
    },

    onUploadSuccess : function(response, options, item) {
        var info = {
            success : false,
            message : 'general error',
            response : response
        };

        if (response.responseText) {
            var responseJson = Ext.decode(response.responseText);
            if (responseJson && responseJson.success) {
                Ext.apply(info, {
                    success : responseJson.success,
                    message : responseJson.message
                });

                this.fireEvent('uploadsuccess', item, info);
                return;
            }

            Ext.apply(info, {
                message : responseJson.message
            });
        }

        this.fireEvent('uploadfailure', item, info);
    },

    onUploadFailure : function(response, options, item) {
        var info = {
            success : false,
            message : 'http error',
            response : response
        };

        this.fireEvent('uploadfailure', item, info);
    },

    onUploadProgress : function(event, item) {
        this.fireEvent('uploadprogress', item, event);
    }
});

Ext.define('Ext.ux.upload.uploader.DummyUploader', {
    extend : 'Ext.ux.upload.uploader.AbstractUploader',

    delay : 1000,

    uploadItem : function(item) {
        item.setUploading();

        var task = new Ext.util.DelayedTask(function() {
            this.fireEvent('uploadsuccess', item, {
                success : true,
                message : 'OK',
                response : null
            });
        }, this);

        task.delay(this.delay);
    },

    abortUpload : function() {
    }
});



/*

END UPLOADER

*/






/*

* LIBRARY

*/


Ext.define('Ext.ux.upload.Store', {
    extend : 'Ext.data.Store',

    fields : [
        {
            name : 'filename',
            type : 'string'
        }, {
            name : 'size',
            type : 'integer'
        }, {
            name : 'type',
            type : 'string'
        }, {
            name : 'status',
            type : 'string'
        }, {
            name : 'message',
            type : 'string'
        }
    ],

    proxy : {
        type : 'memory',
        reader : {
            type : 'array',
            idProperty : 'filename'
        }
    }
});


/**
 * The grid displaying the list of uploaded files (queue).
 * 
 * @class Ext.ux.upload.ItemGridPanel
 * @extends Ext.grid.Panel
 */
Ext.define('Ext.ux.upload.ItemGridPanel', {
    extend : 'Ext.grid.Panel',

    requires : [
        'Ext.selection.CheckboxModel', 'Ext.ux.upload.Store'
    ],

    layout : 'fit',
    border : 0,

    viewConfig : {
        scrollOffset : 40
    },

    config : {
        queue : null,

        textFilename : 'Filename',
        textSize : 'Size',
        textType : 'Type',
        textStatus : 'Status',
        textProgress : '%'
    },

    constructor : function(config) {
        //this.initConfig(config);

        return this.callParent(arguments);
    },

    initComponent : function() {

        if (this.queue) {
            this.queue.on('queuechange', this.onQueueChange, this);
            this.queue.on('itemchangestatus', this.onQueueItemChangeStatus, this);
            this.queue.on('itemprogressupdate', this.onQueueItemProgressUpdate, this);
        }

        Ext.apply(this, {
            store : Ext.create('Ext.ux.upload.Store'),
            selModel : Ext.create('Ext.selection.CheckboxModel', {
                checkOnly : true
            }),
            columns : [
                {
                    xtype : 'rownumberer',
                    width : 50
                }, {
                    dataIndex : 'filename',
                    header : this.textFilename,
                    flex : 1
                }, {
                    dataIndex : 'size',
                    header : this.textSize,
                    width : 100,
                    renderer : function(value) {
                        return Ext.util.Format.fileSize(value);
                    }
                }, {
                    dataIndex : 'type',
                    header : this.textType,
                    width : 150
                }, {
                    dataIndex : 'status',
                    header : this.textStatus,
                    width : 50,
                    align : 'right',
                    renderer : this.statusRenderer
                }, {
                    dataIndex : 'progress',
                    header : this.textProgress,
                    width : 50,
                    align : 'right',
                    renderer : function(value) {
                        if (!value) {
                            value = 0;
                        }
                        return value + '%';
                    }
                }, {
                    dataIndex : 'message',
                    width : 1,
                    hidden : true
                }
            ]
        });

        this.callParent(arguments);
    },

    onQueueChange : function(queue) {
        this.loadQueueItems(queue.getItems());
    },

    onQueueItemChangeStatus : function(queue, item, status) {
        this.updateStatus(item);
    },

    onQueueItemProgressUpdate : function(queue, item) {
        this.updateStatus(item);
    },

    /**
     * Loads the internal store with the supplied queue items.
     * 
     * @param {Array} items
     */
    loadQueueItems : function(items) {
        var data = [];
        var i;

        for (i = 0; i < items.length; i++) {
            data.push([
                items[i].getFilename(),
                items[i].getSize(),
                items[i].getType(),
                items[i].getStatus(),
                items[i].getProgressPercent()
            ]);
        }

        this.loadStoreData(data);
    },

    loadStoreData : function(data, append) {
        this.store.loadData(data, append);
    },

    getSelectedRecords : function() {
        return this.getSelectionModel().getSelection();
    },

    updateStatus : function(item) {
        var record = this.getRecordByFilename(item.getFilename());
        if (!record) {
            return;
        }

        var itemStatus = item.getStatus();
        // debug.log('[' + item.getStatus() + '] [' + record.get('status') + ']');
        if (itemStatus != record.get('status')) {
            this.scrollIntoView(record);

            record.set('status', item.getStatus());
            if (item.isUploadError()) {
                record.set('tooltip', item.getUploadErrorMessage());
            }
        }

        record.set('progress', item.getProgressPercent());
        record.commit();
    },

    getRecordByFilename : function(filename) {
        var index = this.store.findExact('filename', filename);
        if (-1 == index) {
            return null;
        }

        return this.store.getAt(index);
    },

    getIndexByRecord : function(record) {
        return this.store.findExact('filename', record.get('filename'));
    },

    statusRenderer : function(value, metaData, record, rowIndex, colIndex, store) {
        var iconCls = 'ux-mu-icon-upload-' + value;
        var tooltip = record.get('tooltip');
        if (tooltip) {
            value = tooltip;
        } else {
            'upload_status_' + value;
        }
        value = '<span class="ux-mu-status-value ' + iconCls + '" data-qtip="' + value + '" />';
        return value;
    },

    scrollIntoView : function(record) {

        var index = this.getIndexByRecord(record);
        if (-1 == index) {
            return;
        }

        this.getView().focusRow(index);
        return;
        var rowEl = Ext.get(this.getView().getRow(index));
        // var rowEl = this.getView().getRow(index);
        if (!rowEl) {
            return;
        }

        var gridEl = this.getEl();

        // debug.log(rowEl.dom);
        // debug.log(gridEl.getBottom());

        if (rowEl.getBottom() > gridEl.getBottom()) {
            rowEl.dom.scrollIntoView(gridEl);
        }
    }
});

/**
 * The object is responsible for uploading the queue.
 * 
 */
Ext.define('Ext.ux.upload.Manager', {
    mixins : {
        observable : 'Ext.util.Observable'
    },

    requires : [
        'Ext.ux.upload.uploader.AbstractUploader'
    ],

    config : {
        uploader : null,
        uploaderOptions : null,
        synchronous : true,
        filenameEncoder : null
    },

    DEFAULT_UPLOADER_CLASS : 'Ext.ux.upload.uploader.FormDataUploader',

    constructor : function(config) {
        this.mixins.observable.constructor.call(this);
/*
        this.addEvents({
            'beforeupload' : true,

            /**
             * @event
             * 
             * Fired when the upload completes.
             * 
             * @param {Ext.ux.upload.Manager} manager
             * @param {Ext.ux.upload.Queue} queue
             * @param {number} errorCount 
             */
           // 'uploadcomplete' : true,

            /**
             * @event
             * 
             * Fired after the upload has been aborted.
             * 
             * @param {Ext.ux.upload.Manager} manager
             * @param {Ext.ux.upload.Queue} queue
             */
            //'abortupload' : true,

            /**
             * @event
             * 
             * Fired after a single item has been uploaded successfully.
             * 
             * @param {Ext.ux.upload.Manager} manager
             * @param {Ext.ux.upload.Item} item
             * @param {Object} info
             */
            //'itemuploadsuccess' : true,

            /**
            * @event
            * 
            * Fired after an error has occurred while uploading an item.
            * 
            * @param {Ext.ux.upload.Manager} manager
            * @param {Ext.ux.upload.Item} item
            * @param {Object} info
            */
            //'itemuploadfailure' : true
       // });

       // this.initConfig(config);

        if (!(this.uploader instanceof Ext.ux.upload.uploader.AbstractUploader)) {
            var uploaderClass = this.DEFAULT_UPLOADER_CLASS;
            if (Ext.isString(this.uploader)) {
                uploaderClass = this.uploader;
            }

            var uploaderOptions = this.getUploaderOptions() || {};
            Ext.applyIf(uploaderOptions, {
                success : this.onUploadSuccess,
                failure : this.onUploadFailure,
                progress : this.onUploadProgress,
                filenameEncoder : this.getFilenameEncoder()
            });

            this.uploader = Ext.create(uploaderClass, uploaderOptions);
        }

        this.mon(this.uploader, 'uploadsuccess', this.onUploadSuccess, this);
        this.mon(this.uploader, 'uploadfailure', this.onUploadFailure, this);
        this.mon(this.uploader, 'uploadprogress', this.onUploadProgress, this);

        Ext.apply(this, {
            syncQueue : null,
            currentQueue : null,
            uploadActive : false,
            errorCount : 0
        });
    },

    uploadQueue : function(queue) {
        if (this.uploadActive) {
            return;
        }

        this.startUpload(queue);

        if (this.synchronous) {
            this.uploadQueueSync(queue);
            return;
        }

        this.uploadQueueAsync(queue);

    },

    uploadQueueSync : function(queue) {
        this.uploadNextItemSync();
    },

    uploadNextItemSync : function() {
        if (!this.uploadActive) {
            return;
        }

        var item = this.currentQueue.getFirstReadyItem();
        if (!item) {
            return;
        }

        this.uploader.uploadItem(item);
    },

    uploadQueueAsync : function(queue) {
        var i;
        var num = queue.getCount();

        for (i = 0; i < num; i++) {
            this.uploader.uploadItem(queue.getAt(i));
        }
    },

    startUpload : function(queue) {
        queue.reset();

        this.uploadActive = true;
        this.currentQueue = queue;
        this.fireEvent('beforeupload', this, queue);
    },

    finishUpload : function() {
        this.fireEvent('uploadcomplete', this, this.currentQueue, this.errorCount);
    },

    resetUpload : function() {
        this.currentQueue = null;
        this.uploadActive = false;
        this.errorCount = 0;
    },

    abortUpload : function() {
        this.uploader.abortUpload();
        this.currentQueue.recoverAfterAbort();
        this.resetUpload();

        this.fireEvent('abortupload', this, this.currentQueue);
    },

    afterItemUpload : function(item, info) {
        if (this.synchronous) {
            this.uploadNextItemSync();
        }

        if (!this.currentQueue.existUploadingItems()) {
            this.finishUpload();
        }
    },

    onUploadSuccess : function(item, info) {
        item.setUploaded(info.message);
        this.fireEvent('itemuploadsuccess', this, item, info);

        this.afterItemUpload(item, info);
    },

    onUploadFailure : function(item, info) {
        item.setUploadError(info.message);

        this.fireEvent('itemuploadfailure', this, item, info);
        this.errorCount++;

        this.afterItemUpload(item, info);
    },

    onUploadProgress : function(item, event) {
        item.setProgress(event.loaded);
    }
});

/**
 * Upload status bar.
 * 
 * @class Ext.ux.upload.StatusBar
 * @extends Ext.toolbar.Toolbar
 */
Ext.define('Ext.ux.upload.StatusBar', {
    extend : 'Ext.toolbar.Toolbar',

    config : {
        selectionMessageText : 'Selected {0} file(s), {1}',
        uploadMessageText : 'Upload progress {0}% ({1} of {2} file(s))',
        textComponentId : 'mu-status-text'
    },

    constructor : function(config) {
        //this.initConfig(config);

        return this.callParent(arguments);
    },

    initComponent : function() {

        Ext.apply(this, {
            items : [
                {
                    xtype : 'tbtext',
                    itemId : this.textComponentId,
                    text : '&nbsp;'
                }
            ]
        });

        this.callParent(arguments);
    },

    setText : function(text) {
        this.getComponent(this.textComponentId).setText(text);
    },

    setSelectionMessage : function(fileCount, byteCount) {
        this.setText(Ext.String.format(this.selectionMessageText, fileCount, Ext.util.Format.fileSize(byteCount)));
    },

    setUploadMessage : function(progressPercent, uploadedFiles, totalFiles) {
        this.setText(Ext.String.format(this.uploadMessageText, progressPercent, uploadedFiles, totalFiles));
    }

});

/**
 * A "browse" button for selecting multiple files for upload.
 * 
 */
Ext.define('Ext.ux.upload.BrowseButton', {
    extend : 'Ext.form.field.File',

    buttonOnly : true,

    iconCls : 'ux-mu-icon-action-browse',
    buttonText : 'Browse...',

    initComponent : function() {

        /*this.addEvents({
            'fileselected' : true
        });*/

        Ext.apply(this, {
            buttonConfig : {
                iconCls : this.iconCls,
                text : this.buttonText
            }
        });

        this.on('afterrender', function() {

            // Allow picking multiple files at once.
            this.setMultipleInputAttribute();

        }, this);

        this.on('change', function(field, value, options) {
			console.log(field);
			console.log(this.fileInputEl.dom);
            var files = this.fileInputEl.dom.files;
			console.log(files);
			
            if (files) {
                this.fireEvent('fileselected', this, files);
            }
        }, this);

        this.callParent(arguments);
    },

    reset : function() {
        this.callParent(arguments);
        this.setMultipleInputAttribute();
    },

    setMultipleInputAttribute : function(inputEl) {
        inputEl = inputEl || this.fileInputEl;
        inputEl.dom.setAttribute('multiple', '1');
    }


}
);

/**
 * A single item designated for upload.
 * 
 * It is a simple object wrapping the native file API object.
 */
Ext.define('Ext.ux.upload.Item', {
    mixins : {
        observable : 'Ext.util.Observable'
    },

    STATUS_READY : 'ready',
    STATUS_UPLOADING : 'uploading',
    STATUS_UPLOADED : 'uploaded',
    STATUS_UPLOAD_ERROR : 'uploaderror',

    progress : null,
    status : null,

    config : {
        /**
         * @cfg {Object} fileApiObject (required)
         * 
         * A native file API object
         */
        fileApiObject : null,

        /**
         * @cfg {String}
         * 
         * The upload error message associated with this file object
         */
        uploadErrorMessage : ''
    },

    constructor : function(config) {
        this.mixins.observable.constructor.call(this);

        /*this.addEvents({
            changestatus : true,
            progressupdate : true
        });*/

        this.initConfig(config);

        Ext.apply(this, {
			fileApiObject: config.fileApiObject,
            status : this.STATUS_READY,
            progress : 0
        });
    },

    reset : function() {
        this.uploadErrorMessage = '';
        this.setStatus(this.STATUS_READY);
        this.setProgress(0);
    },

    getFileApiObject : function() {
        return this.fileApiObject;
    },

    getId : function() {
        return this.getFilename();
    },

    getName : function() {
        return this.getProperty('name');
    },

    getFilename : function() {
        return this.getName();
    },

    getSize : function() {
        return this.getProperty('size');
    },

    getType : function() {
        return this.getProperty('type');
    },

    getProperty : function(propertyName) {
        if (this.fileApiObject) {
            return this.fileApiObject[propertyName];
        }

        return null;
    },

    getProgress : function() {
        return this.progress;
    },

    getProgressPercent : function() {
        var progress = this.getProgress();
        if (!progress) {
            return 0;
        }

        var percent = Ext.util.Format.number((progress / this.getSize()) * 100, '0');
        if (percent > 100) {
            percent = 100;
        }

        return percent;
    },

    setProgress : function(progress) {
        this.progress = progress;
        this.fireEvent('progressupdate', this);
    },

    getStatus : function() {
        return this.status;
    },

    setStatus : function(status) {
        this.status = status;
        this.fireEvent('changestatus', this, status);
    },

    hasStatus : function(status) {
        var itemStatus = this.getStatus();

        if (Ext.isArray(status) && Ext.Array.contains(status, itemStatus)) {
            return true;
        }

        if (itemStatus === status) {
            return true;
        }

        return false;
    },

    isReady : function() {
        return (this.status == this.STATUS_READY);
    },

    isUploaded : function() {
        return (this.status == this.STATUS_UPLOADED);
    },

    setUploaded : function(message) {
        this.setProgress(this.getSize());
		this.message=message;
        this.setStatus(this.STATUS_UPLOADED);
    },

    isUploadError : function() {
        return (this.status == this.STATUS_UPLOAD_ERROR);
    },

    getUploadErrorMessage : function() {
        return this.uploadErrorMessage;
    },

    setUploadError : function(message) {
        this.uploadErrorMessage = message;
        this.setStatus(this.STATUS_UPLOAD_ERROR);
    },

    setUploading : function() {
        this.setStatus(this.STATUS_UPLOADING);
    }
});


/**
 * Data structure managing the upload file queue.
 * 
 */
Ext.define('Ext.ux.upload.Queue', {
    extend : 'Ext.util.MixedCollection',

    requires : [
        'Ext.ux.upload.Item'
    ],

    /**
     * Constructor.
     * 
     * @param {Object} config
     */
    constructor : function(config) {

        this.callParent(arguments);

       /*this.addEvents({
            multiadd : true,
            multiremove : true,
            queuechange : true,
            itemchangestatus : true,
            itemprogressupdate : true
        });*/

        this.on('clear', function() {
            this.fireEvent('queuechange', this);
        }, this);

    },

    /**
     * Adds files to the queue.
     * 
     * @param {FileList} fileList
     */
    addFiles : function(fileList) {
        var i;
        var items = [];
        var num = fileList.length;

        if (!num) {
            return;
        }

        for (i = 0; i < num; i++) {
            items.push(this.createItem(fileList[i]));		
        }

        this.addAll(items);

        this.fireEvent('multiadd', this, items);
        this.fireEvent('queuechange', this);
    },

    /**
     * Uploaded files are removed, the rest are set as ready.
     */
    reset : function() {
        this.clearUploadedItems();

        this.each(function(item) {
            item.reset();
        }, this);
    },

    /**
     * Returns all queued items.
     * 
     * @return {Ext.ux.upload.Item[]}
     */
    getItems : function() {
        return this.getRange();
    },

    /**
     * Returns an array of items by the specified status.
     * 
     * @param {String/Array}
     * @return {Ext.ux.upload.Item[]}
     */
    getItemsByStatus : function(status) {
        var itemsByStatus = [];

        this.each(function(item, index, items) {
            if (item.hasStatus(status)) {
                itemsByStatus.push(item);
            }
        });

        return itemsByStatus;
    },

    /**
     * Returns an array of items, that have already been uploaded.
     * 
     * @return {Ext.ux.upload.Item[]}
     */
    getUploadedItems : function() {
        return this.getItemsByStatus('uploaded');
    },

    /**
     * Returns an array of items, that have not been uploaded yet.
     * 
     * @return {Ext.ux.upload.Item[]}
     */
    getUploadingItems : function() {
        return this.getItemsByStatus([
            'ready', 'uploading'
        ]);
    },

    /**
     * Returns true, if there are items, that are currently being uploaded.
     * 
     * @return {Boolean}
     */
    existUploadingItems : function() {
        return (this.getUploadingItems().length > 0);
    },

    /**
     * Returns the first "ready" item in the queue (with status STATUS_READY).
     * 
     * @return {Ext.ux.upload.Item/null}
     */
    getFirstReadyItem : function() {
        var items = this.getRange();
        var num = this.getCount();
        var i;

        for (i = 0; i < num; i++) {
            if (items[i].isReady()) {
                return items[i];
            }
        }

        return null;
    },

    /**
     * Clears all items from the queue.
     */
    clearItems : function() {
        this.clear();
    },

    /**
     * Removes the items, which have been already uploaded, from the queue.
     */
    clearUploadedItems : function() {
        this.removeItems(this.getUploadedItems());
    },

    /**
     * Removes items from the queue.
     * 
     * @param {Ext.ux.upload.Item[]} items
     */
    removeItems : function(items) {
        var num = items.length;
        var i;

        if (!num) {
            return;
        }

        for (i = 0; i < num; i++) {
            this.remove(items[i]);
        }

        this.fireEvent('queuechange', this);
    },

    /**
     * Removes the items identified by the supplied array of keys.
     * 
     * @param {Array} itemKeys
     */
    removeItemsByKey : function(itemKeys) {
        var i;
        var num = itemKeys.length;

        if (!num) {
            return;
        }

        for (i = 0; i < num; i++) {
            this.removeItemByKey(itemKeys[i]);
        }

        this.fireEvent('multiremove', this, itemKeys);
        this.fireEvent('queuechange', this);
    },

    /**
     * Removes a single item by its key.
     * 
     * @param {String} key
     */
    removeItemByKey : function(key) {
        this.removeAtKey(key);
    },

    /**
     * Perform cleanup, after the upload has been aborted.
     */
    recoverAfterAbort : function() {
        this.each(function(item) {
            if (!item.isUploaded() && !item.isReady()) {
                item.reset();
            }
        });
    },

    /**
     * @private
     * 
     * Initialize and return a new queue item for the corresponding File object.
     * 
     * @param {File} file
     * @return {Ext.ux.upload.Item}
     */
    createItem : function(file) {

        var item = Ext.create('Ext.ux.upload.Item', {
            fileApiObject : file
        });
		
		console.log('-------');
		console.log(item);
		console.log('-------');
		
        item.on('changestatus', this.onItemChangeStatus, this);
        item.on('progressupdate', this.onItemProgressUpdate, this);

        return item;
    },

    /**
     * A getKey() implementation to determine the key of an item in the collection.
     * 
     * @param {Ext.ux.upload.Item} item
     * @return {String}
     */
    getKey : function(item) {
        return item.getId();
    },

    onItemChangeStatus : function(item, status) {
        this.fireEvent('itemchangestatus', this, item, status);
    },

    onItemProgressUpdate : function(item) {
        this.fireEvent('itemprogressupdate', this, item);
    },

    /**
     * Returns true, if the item is the last item in the queue.
     * 
     * @param {Ext.ux.upload.Item} item
     * @return {boolean}
     */
    isLast : function(item) {
        var lastItem = this.last();
        if (lastItem && item.getId() == lastItem.getId()) {
            return true;
        }

        return false;
    },

    /**
     * Returns total bytes of all files in the queue.
     * 
     * @return {number}
     */
    getTotalBytes : function() {
        var bytes = 0;

        this.each(function(item, index, length) {
            bytes += item.getSize();
        }, this);

        return bytes;
    }
});










/*

* PANEL

*/


/**
 * The main upload panel, which ties all the functionality together.
 * 
 * In the most basic case you need just to set the upload URL:
 * 
 *     @example
 *     var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
 *         uploaderOptions: {
 *             url: '/api/upload'
 *         }
 *     });
 *     
 * It uses the default ExtJsUploader to perform the actual upload. If you want to use another uploade, for
 * example the FormDataUploader, you can pass the name of the class:
 * 
 *     @example
 *     var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
 *         uploader: 'Ext.ux.upload.uploader.FormDataUploader',
 *         uploaderOptions: {
 *             url: '/api/upload',
 *             timeout: 120*1000
 *         }
 *     });
 *     
 * Or event an instance of the uploader:
 * 
 *     @example
 *     var formDataUploader = Ext.create('Ext.ux.upload.uploader.FormDataUploader', {
 *         url: '/api/upload'
 *     });
 *     
 *     var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
 *         uploader: formDataUploader
 *     });
 * 
 */
Ext.define('Ext.ux.upload.Panel', {
    extend : 'Ext.panel.Panel',
	alias: 'widget.uploadpanel',
    requires : [
        'Ext.ux.upload.ItemGridPanel',
        'Ext.ux.upload.Manager',
        'Ext.ux.upload.StatusBar',
        'Ext.ux.upload.BrowseButton',
        'Ext.ux.upload.Queue'
    ],

    config : {

        /**
         * @cfg {Object/String}
         * 
         * The name of the uploader class or the uploader object itself. If not set, the default uploader will
         * be used.
         */
        uploader: 'Ext.ux.upload.uploader.FormDataUploader',

        /**
         * @cfg {Object}
         * 
         * Configuration object for the uploader. Configuration options included in this object override the
         * options 'uploadUrl', 'uploadParams', 'uploadExtraHeaders', 'uploadTimeout'.
         */
        uploaderOptions : null,

        /**
         * @cfg {boolean} [synchronous=false]
         * 
         * If true, all files are uploaded in a sequence, otherwise files are uploaded simultaneously (asynchronously).
         */
        synchronous : true,

        /**
         * @cfg {String} uploadUrl
         * 
         * The URL to upload files to. Not required if configured uploader instance is passed to this panel.
         */
        uploadUrl : '',

        /**
         * @cfg {Object}
         * 
         * Params passed to the uploader object and sent along with the request. It depends on the implementation of the
         * uploader object, for example if the {@link Ext.ux.upload.uploader.ExtJsUploader} is used, the params are sent
         * as GET params.
         */
        uploadParams : {},

        /**
         * @cfg {Object}
         * 
         * Extra HTTP headers to be added to the HTTP request uploading the file.
         */
        uploadExtraHeaders : {},

        /**
         * @cfg {Number} [uploadTimeout=6000]
         * 
         * The time after the upload request times out - in miliseconds.
         */
        uploadTimeout : 60000,

        /**
         * @cfg {Object/String}
         * 
         * Encoder object/class used to encode the filename header. Usually used, when the filename
         * contains non-ASCII characters. If an encoder is used, the server backend has to be
         * modified accordingly to decode the value.
         */
        filenameEncoder : null,

        // strings
        textOk : 'OK',
        textUpload : 'Téléverser',
        textBrowse : 'Parcourir',
        textAbort : 'Annuler',
        textRemoveSelected : 'Supprimer la sélection',
        textRemoveAll : 'Tout supprimer',

        // grid strings
        textFilename : 'Fichier',
        textSize : 'Taille',
        textType : 'Type',
        textStatus : 'Etat',
        textProgress : '%',

        // status toolbar strings
        selectionMessageText : 'Selection {0} fichier(s), {1}',
        uploadMessageText : 'Téléverser en cours {0}% ({1} of {2} fichier(s))',

        // browse button
        buttonText : 'Parcourir...'
    },

    /**
     * @property {Ext.ux.upload.Queue}
     * @private
     */
    queue : null,

    /**
     * @property {Ext.ux.upload.ItemGridPanel}
     * @private
     */
    grid : null,

    /**
     * @property {Ext.ux.upload.Manager}
     * @private
     */
    uploadManager : null,

    /**
     * @property {Ext.ux.upload.StatusBar}
     * @private
     */
    statusBar : null,

    /**
     * @property {Ext.ux.upload.BrowseButton}
     * @private
     */
    browseButton : null,

    /**
     * Constructor.
     */
    constructor : function(config) {
        // this.initConfig(config);
        return this.callParent(arguments);
    },

    /**
     * @private
     */
    initComponent : function() {
		this.uploader = 'Ext.ux.upload.uploader.FormDataUploader';
  /*      this.addEvents({

            'uploadcomplete' : true,
			'itemuploadsuccess': true,
			'itemuploadfailure': true
        });
*/
        this.queue = this.initQueue();

        this.grid = Ext.create('Ext.ux.upload.ItemGridPanel', {
            queue : this.queue,
            textFilename : this.textFilename,
            textSize : this.textSize,
            textType : this.textType,
            textStatus : this.textStatus,
            textProgress : this.textProgress
        });

        this.uploadManager = this.createUploadManager();
		
        this.uploadManager.on('uploadcomplete', this.onUploadComplete, this);
        this.uploadManager.on('itemuploadsuccess', this.onItemUploadSuccess, this);
        this.uploadManager.on('itemuploadfailure', this.onItemUploadFailure, this);

        this.statusBar = Ext.create('Ext.ux.upload.StatusBar', {
            dock : 'bottom',
            selectionMessageText : this.selectionMessageText,
            uploadMessageText : this.uploadMessageText
        });

        Ext.apply(this, {
            title : this.dialogTitle,
            autoScroll : true,
            layout : 'fit',
            uploading : false,
            items : [
                this.grid
            ],
            dockedItems : [
                this.getTopToolbarConfig(), this.statusBar
            ]
        });

        this.on('afterrender', function() {
            this.stateInit();
        }, this);

        this.callParent(arguments);
    },

    createUploadManager : function() {
        var uploaderOptions = this.getUploaderOptions() || {};

        Ext.applyIf(uploaderOptions, {
            url : this.uploadUrl,
            params : this.uploadParams,
            extraHeaders : this.uploadExtraHeaders,
            timeout : this.uploadTimeout
        });

        var uploadManager = Ext.create('Ext.ux.upload.Manager', {
            uploader : this.uploader,
            uploaderOptions : uploaderOptions,
            synchronous : this.getSynchronous(),
            filenameEncoder : this.getFilenameEncoder()
        });
		
        return uploadManager;
    },

    /**
     * @private
     * 
     * Returns the config object for the top toolbar.
     * 
     * @return {Array}
     */
    getTopToolbarConfig : function() {

        this.browseButton = Ext.create('Ext.ux.upload.BrowseButton', {
            itemId : 'button_browse',
            buttonText : this.buttonText
        });
        this.browseButton.on('fileselected', this.onFileSelection, this);

        return {
            xtype : 'toolbar',
            itemId : 'topToolbar',
            dock : 'top',
            items : [
                this.browseButton,
                '-',
                {
                    itemId : 'button_upload',
                    text : this.textUpload,
                    iconCls : 'ux-mu-icon-action-upload',
                    scope : this,
                    handler : this.onInitUpload
                },
                '-',
                {
                    itemId : 'button_abort',
                    text : this.textAbort,
                    iconCls : 'ux-mu-icon-action-abort',
                    scope : this,
                    handler : this.onAbortUpload,
                    disabled : true
                },
                '->',
                {
                    itemId : 'button_remove_selected',
                    text : this.textRemoveSelected,
                    iconCls : 'ux-mu-icon-action-remove',
                    scope : this,
                    handler : this.onMultipleRemove
                },
                '-',
                {
                    itemId : 'button_remove_all',
                    text : this.textRemoveAll,
                    iconCls : 'ux-mu-icon-action-remove',
                    scope : this,
                    handler : this.onRemoveAll
                }
            ]
        }
    },

    /**
     * @private
     * 
     * Initializes and returns the queue object.
     * 
     * @return {Ext.ux.upload.Queue}
     */
    initQueue : function() {
        var queue = Ext.create('Ext.ux.upload.Queue');

        queue.on('queuechange', this.onQueueChange, this);

        return queue;
    },

    onInitUpload : function() {
        if (!this.queue.getCount()) {
            return;
        }

        this.stateUpload();
        this.startUpload();
    },

    onAbortUpload : function() {
        this.uploadManager.abortUpload();
        this.finishUpload();
        this.switchState();
    },

    onUploadComplete : function(manager, queue, errorCount) {
        this.finishUpload();
        if (errorCount) {
            this.stateQueue();
        } else {
            this.stateInit();
        }
        this.fireEvent('uploadcomplete', this, manager, queue.getUploadedItems(), errorCount);
        manager.resetUpload();
    },

    /**
     * @private
     * 
     * Executes after files has been selected for upload through the "Browse" button. Updates the upload queue with the
     * new files.
     * 
     * @param {Ext.ux.upload.BrowseButton} input
     * @param {FileList} files
     */
    onFileSelection : function(input, files) {
		alert('x');
		console.log(files);
		return;
        this.queue.clearUploadedItems();
        this.queue.addFiles(files);
        this.browseButton.reset();
    },

    /**
     * @private
     * 
     * Executes if there is a change in the queue. Updates the related components (grid, toolbar).
     * 
     * @param {Ext.ux.upload.Queue} queue
     */
    onQueueChange : function(queue) {
        this.updateStatusBar();

        this.switchState();
    },

    /**
     * @private
     * 
     * Executes upon hitting the "multiple remove" button. Removes all selected items from the queue.
     */
    onMultipleRemove : function() {
        var records = this.grid.getSelectedRecords();
        if (!records.length) {
            return;
        }

        var keys = [];
        var i;
        var num = records.length;

        for (i = 0; i < num; i++) {
            keys.push(records[i].get('filename'));
        }

        this.queue.removeItemsByKey(keys);
    },

    onRemoveAll : function() {
        this.queue.clearItems();
    },

    onItemUploadSuccess : function(item, info) {
		this.fireEvent('itemuploadsuccess',info);
    },

    onItemUploadFailure : function(item, info) {
		this.fireEvent('itemuploadfailure',info);
    },

    startUpload : function() {
        this.uploading = true;
        this.uploadManager.uploadQueue(this.queue);
    },

    finishUpload : function() {
        this.uploading = false;
    },

    isUploadActive : function() {
        return this.uploading;
    },

    updateStatusBar : function() {
        if (!this.statusBar) {
            return;
        }

        var numFiles = this.queue.getCount();

        this.statusBar.setSelectionMessage(this.queue.getCount(), this.queue.getTotalBytes());
    },

    getButton : function(itemId) {
        var topToolbar = this.getDockedComponent('topToolbar');
        if (topToolbar) {
            return topToolbar.getComponent(itemId);
        }
        return null;
    },

    switchButtons : function(info) {
        var itemId;
        for (itemId in info) {
            this.switchButton(itemId, info[itemId]);
        }
    },

    switchButton : function(itemId, on) {
        var button = this.getButton(itemId);

        if (button) {
            if (on) {
                button.enable();
            } else {
                button.disable();
            }
        }
    },

    switchState : function() {
        if (this.uploading) {
            this.stateUpload();
        } else if (this.queue.getCount()) {
            this.stateQueue();
        } else {
            this.stateInit();
        }
    },

    stateInit : function() {
        this.switchButtons({
            'button_browse' : 1,
            'button_upload' : 0,
            'button_abort' : 0,
            'button_remove_all' : 1,
            'button_remove_selected' : 1
        });
    },

    stateQueue : function() {
        this.switchButtons({
            'button_browse' : 1,
            'button_upload' : 1,
            'button_abort' : 0,
            'button_remove_all' : 1,
            'button_remove_selected' : 1
        });
    },

    stateUpload : function() {
        this.switchButtons({
            'button_browse' : 0,
            'button_upload' : 0,
            'button_abort' : 1,
            'button_remove_all' : 1,
            'button_remove_selected' : 1
        });
    }

});


/*

DIALOG

*/


/**
 * The main upload dialog.
 * 
 * Mostly, this will be the only object you need to interact with. Just initialize it and show it:
 * 
 *      @example
 *      var dialog = Ext.create('Ext.ux.upload.Dialog', {
 *          dialogTitle: 'My Upload Widget',
 *          uploadUrl: 'upload.php'
 *      });
 * 
 *      dialog.show();
 * 
 */
Ext.define('Ext.ux.upload.Dialog', {
    extend : 'Ext.window.Window',

    requires : [
        'Ext.ux.upload.ItemGridPanel',
        'Ext.ux.upload.Manager',
        'Ext.ux.upload.StatusBar',
        'Ext.ux.upload.BrowseButton',
        'Ext.ux.upload.Queue'
    ],

    /**
     * @cfg {Number} [width=700]
     */
    width : 700,

    /**
     * @cfg {Number} [height=500]
     */
    height : 500,

    config : {
        /**
         * @cfg {String}
         * 
         * The title of the dialog.
         */
        dialogTitle : '',

        /**
         * @cfg {boolean} [synchronous=false]
         * 
         * If true, all files are uploaded in a sequence, otherwise files are uploaded simultaneously (asynchronously).
         */
        synchronous : true,

        /**
         * @cfg {String} uploadUrl (required)
         * 
         * The URL to upload files to.
         */
        uploadUrl : '',

        /**
         * @cfg {Object}
         * 
         * Params passed to the uploader object and sent along with the request. It depends on the implementation of the
         * uploader object, for example if the {@link Ext.ux.upload.uploader.ExtJsUploader} is used, the params are sent
         * as GET params.
         */
        uploadParams : {},

        /**
         * @cfg {Object}
         * 
         * Extra HTTP headers to be added to the HTTP request uploading the file.
         */
        uploadExtraHeaders : {},

        /**
         * @cfg {Number} [uploadTimeout=6000]
         * 
         * The time after the upload request times out - in miliseconds.
         */
        uploadTimeout : 60000,

        // dialog strings
        textClose : 'Fermer',
        textOk : 'OK',
        textUpload : 'Téléverser',
        textBrowse : 'Parcourir',
        textAbort : 'Annuler',
        textRemoveSelected : 'Supprimer la sélection',
        textRemoveAll : 'Tout supprimer',

        // grid strings
        textFilename : 'Fichier',
        textSize : 'Taille',
        textType : 'Type',
        textStatus : 'Etat',
        textProgress : '%',

        // status toolbar strings
        selectionMessageText : 'Selection {0} fichier(s), {1}',
        uploadMessageText : 'Téléverser en cours {0}% ({1} of {2} fichier(s))',

        // browse button
        buttonText : 'Parcourir...'
		
	
    },

    /**
     * @property {Ext.ux.upload.Queue}
     */
    queue : null,

    /**
     * @property {Ext.ux.upload.ItemGridPanel}
     */
    grid : null,

    /**
     * @property {Ext.ux.upload.Manager}
     */
    uploadManager : null,

    /**
     * @property {Ext.ux.upload.StatusBar}
     */
    statusBar : null,

    /**
     * @property {Ext.ux.upload.BrowseButton}
     */
    browseButton : null,

    /**
     * Constructor.
     */
    constructor : function(config) {
       // this.initConfig(config);

        return this.callParent(arguments);
    },

    /**
     * @private
     */
    initComponent : function() {

/*        this.addEvents({

            'uploadcomplete' : true,
			'itemuploadsuccess': true,
			'itemuploadfailure': true
        });
*/
        this.queue = this.initQueue();

        this.grid = Ext.create('Ext.ux.upload.ItemGridPanel', {
            queue : this.queue,
            textFilename : this.textFilename,
            textSize : this.textSize,
            textType : this.textType,
            textStatus : this.textStatus,
            textProgress : this.textProgress
        });

        this.uploadManager = Ext.create('Ext.ux.upload.Manager', {
            url : this.uploadUrl,
            synchronous : this.synchronous,
            params : this.uploadParams,
            extraHeaders : this.uploadExtraHeaders,
            uploadTimeout : this.uploadTimeout
        });

        this.uploadManager.on('uploadcomplete', this.onUploadComplete, this);
        this.uploadManager.on('itemuploadsuccess', this.onItemUploadSuccess, this);
        this.uploadManager.on('itemuploadfailure', this.onItemUploadFailure, this);

        this.statusBar = Ext.create('Ext.ux.upload.StatusBar', {
            dock : 'bottom',
            selectionMessageText : this.selectionMessageText,
            uploadMessageText : this.uploadMessageText
        });

        Ext.apply(this, {
            title : this.dialogTitle,
            autoScroll : true,
            layout : 'fit',
            uploading : false,
            items : [
                this.grid
            ],
            dockedItems : [
                this.getTopToolbarConfig(),
                {
                    xtype : 'toolbar',
                    dock : 'bottom',
                    ui : 'footer',
                    defaults : {
                        minWidth : this.minButtonWidth
                    },
                    items : [
                        '->',
                        {
                            text : this.textClose,
                            // iconCls : 'ux-mu-icon-action-ok',
                            cls : 'x-btn-text-icon',
                            scope : this,
                            handler : function() {
                                this.close();
                            }
                        }
                    ]
                },
                this.statusBar
            ]
        });

        this.on('afterrender', function() {
            this.stateInit();
        }, this);

        this.callParent(arguments);
    },

    /**
     * @private 
     * 
     * Returns the config object for the top toolbar.
     * 
     * @return {Array}
     */
    getTopToolbarConfig : function() {

        this.browseButton = Ext.create('Ext.ux.upload.BrowseButton', {
            id : 'button_browse',
            buttonText : this.buttonText
        });
        this.browseButton.on('fileselected', this.onFileSelection, this);

        return {
            xtype : 'toolbar',
            dock : 'top',
            items : [
                this.browseButton,
                '-',
                {
                    id : 'button_upload',
                    text : this.textUpload,
                    iconCls : 'ux-mu-icon-action-upload',
                    scope : this,
                    handler : this.onInitUpload
                },
                '-',
                {
                    id : 'button_abort',
                    text : this.textAbort,
                    iconCls : 'ux-mu-icon-action-abort',
                    scope : this,
                    handler : this.onAbortUpload,
                    disabled : true
                },
                '->',
                {
                    id : 'button_remove_selected',
                    text : this.textRemoveSelected,
                    iconCls : 'ux-mu-icon-action-remove',
                    scope : this,
                    handler : this.onMultipleRemove
                },
                '-',
                {
                    id : 'button_remove_all',
                    text : this.textRemoveAll,
                    iconCls : 'ux-mu-icon-action-remove',
                    scope : this,
                    handler : this.onRemoveAll
                }
            ]
        }
    },

    /**
     * @private
     * 
     * Initializes and returns the queue object.
     * 
     * @return {Ext.ux.upload.Queue}
     */
    initQueue : function() {
        var queue = Ext.create('Ext.ux.upload.Queue');

        queue.on('queuechange', this.onQueueChange, this);

        return queue;
    },

    onInitUpload : function() {
        if (!this.queue.getCount()) {
            return;
        }

        this.stateUpload();
        this.startUpload();
    },

    onAbortUpload : function() {
        this.uploadManager.abortUpload();
        this.finishUpload();
        this.switchState();
    },

    onUploadComplete : function(manager, queue, errorCount) {
        this.finishUpload();
        this.stateInit();
        this.fireEvent('uploadcomplete', this, manager, queue.getUploadedItems(), errorCount);
    },

    /**
     * @private
     * 
     * Executes after files has been selected for upload through the "Browse" button. Updates the upload queue with the
     * new files.
     * 
     * @param {Ext.ux.upload.BrowseButton} input
     * @param {FileList} files
     */
    onFileSelection : function(input, files) {
		console.log(files);
		this.queue.clearUploadedItems();

        this.queue.addFiles(files);
				        return;		
        this.browseButton.reset();
    },

    /**
     * @private
     * 
     * Executes if there is a change in the queue. Updates the related components (grid, toolbar).
     * 
     * @param {Ext.ux.upload.Queue} queue
     */
    onQueueChange : function(queue) {
        this.updateStatusBar();

        this.switchState();
    },

    /**
     * @private
     * 
     * Executes upon hitting the "multiple remove" button. Removes all selected items from the queue.
     */
    onMultipleRemove : function() {
        var records = this.grid.getSelectedRecords();
        if (!records.length) {
            return;
        }

        var keys = [];
        var i;
        var num = records.length;

        for (i = 0; i < num; i++) {
            keys.push(records[i].get('filename'));
        }

        this.queue.removeItemsByKey(keys);
    },

    onRemoveAll : function() {
        this.queue.clearItems();
    },

    onItemUploadSuccess : function(item, info) {
		this.fireEvent('itemuploadsuccess',info);
    },

    onItemUploadFailure : function(item, info) {
		this.fireEvent('itemuploadfailure',info);
    },

    startUpload : function() {
        this.uploading = true;
        this.uploadManager.uploadQueue(this.queue);
    },

    finishUpload : function() {
        this.uploading = false;
    },

    isUploadActive : function() {
        return this.uploading;
    },

    updateStatusBar : function() {
        if (!this.statusBar) {
            return;
        }

        var numFiles = this.queue.getCount();

        this.statusBar.setSelectionMessage(this.queue.getCount(), this.queue.getTotalBytes());
    },

    getButton : function(id) {
        return Ext.ComponentMgr.get(id);
    },

    switchButtons : function(info) {
        var id;
        for (id in info) {
            this.switchButton(id, info[id]);
        }
    },

    switchButton : function(id, on) {
        var button = this.getButton(id);

        if (button) {
            if (on) {
                button.enable();
            } else {
                button.disable();
            }
        }
    },

    switchState : function() {
        if (this.uploading) {
            this.stateUpload();
        } else if (this.queue.getCount()) {
            this.stateQueue();
        } else {
            this.stateInit();
        }
    },

    stateInit : function() {
        this.switchButtons({
            'button_browse' : 1,
            'button_upload' : 0,
            'button_abort' : 0,
            'button_remove_all' : 1,
            'button_remove_selected' : 1
        });
    },

    stateQueue : function() {
        this.switchButtons({
            'button_browse' : 1,
            'button_upload' : 1,
            'button_abort' : 0,
            'button_remove_all' : 1,
            'button_remove_selected' : 1
        });
    },

    stateUpload : function() {
        this.switchButtons({
            'button_browse' : 0,
            'button_upload' : 0,
            'button_abort' : 1,
            'button_remove_all' : 1,
            'button_remove_selected' : 1
        });
    }

});

/*
 *
 * Ext.ux.upload.FileManager
 *
 */
 
Ext.define('Ext.ux.upload.FileManager', {
    extend : 'Ext.panel.Panel',
	alias: 'widget.uploadfilemanager',
    config : {
		readOnly: false,
		files: []
    },

    /**
     * Constructor.
     */
    constructor : function(config) {
        //this.initConfig(config);
        return this.callParent(arguments);
    },

    /**
     * @private
     */
    initComponent : function() {
		var _p=this;
		this.tbar=[
			{
				xtype: "button",
				iconAlign: "left",
				iconCls: "upload_attach",							
				text: 'Joindre un document',
				handler: function() {
					var dialog = Ext.create('Ext.ux.upload.Dialog', {
						dialogTitle: 'Téléverser des fichiers',
						modal: true,
						uploaderOptions: {
							url: _p.uploader
						}
					});
					dialog.on('uploadcomplete', function(uploadPanel, manager, items, errorCount) {
						for (var i=0;i<items.length;i++) {
							_p.items.items[0].getStore().add({
								docId: items[i].message.split('|')[0],
								filename: items[i].message.split('|')[1],
								filetype: items[i].message.split('|')[2],
								filesize: items[i].message.split('|')[3]
							});							
						};
						_p.items.items[0].getView().refresh();
                        if (!errorCount) {
							dialog.close();
						}
                    }, this);
					dialog.show();				
				}
			},
			'->', {
				xtype: "button",
				iconAlign: "left",
				iconCls: "upload_trash",
				text: 'Supprimer',
				handler: function(p) {
					try {
						_p.items.items[0].getStore().remove(_p.items.items[0].getSelectionModel().getSelection());	
					}catch(e) {	};
				}
			}
		];
		this.items=[
			{
				xtype: "grid",
				border: false,
				layout: "fit",
				columns: [
					{
						text: "Fichier",
						dataIndex: "filename",
						flex: 1
					},
					{
						text: "Type",
						dataIndex: "filetype",
						width: 100
					},
					{
						text: "Taille",
						dataIndex: "filesize",
						width: 50
					}
				],
				store: App.store.create({
					fields: [
						"docId",
						"filename",
						"filetype",
						"filesize"
					],
					data: []
				}),
				listeners: {
					itemdblclick: function(p,record) {
						_p.fireEvent('itemdblclick', p, record);
					},
					beforeitemcontextmenu: function(view, record, item, index, e) {
						e.stopEvent();
						if (_p.readOnly) return;
						var gridMenu = Ext.create('Ext.menu.Menu', {
							items: [{
								text: 'Supprimer',
								handler: function() {
									view.getStore().remove(record);									
								}
							}]
						});
						gridMenu.showAt(e.getXY());
					}
				}
			}
		];
		this.clear=function() {
		
		};
		this.getFiles=function() {
			var dta=_p.items.items[0].getStore().data.items;
			var DTA=[];
			for (var i=0;i<dta.length;i++) {
				DTA.push(dta[i].data);
			};
			return DTA;
		};
		this.setFiles=function(data) {
			_p.items.items[0].getStore().loadData(data);
		};
		this.getValue=function() {
			var dta=_p.items.items[0].getStore().data.items;
			var DTA=[];
			for (var i=0;i<dta.length;i++) {
				DTA.push(dta[i].data);
			};
			_p.value=DTA;
			return DTA;
		};
		this.setValue=function(data) {
			_p.items.items[0].getStore().loadData(data);
			_p.value=data;
		};	    
		this.setReadOnly=function(b) {
			if (b) _p.getDockedItems()[0].hide();
			else _p.getDockedItems()[0].show();
			this.readOnly=b;
		};
	    /*this.addEvents({
            itemdblclick : true
        });*/
		this.callParent(arguments);
	}	
});
