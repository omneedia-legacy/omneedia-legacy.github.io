/**
 * Modified Ext.data.Connection object, adapted to be able to report progress.
 */
Ext.define('Ext.ux.data.Connection', {
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

Ext.define('Ext.ux.upload.Store', {
    extend : 'Ext.data.Store',
    fields : [
        {
            name : 'name',
            type : 'string'
        }, {
            name : 'size',
            type : 'integer'
        }, {
            name : 'type',
            type : 'string'
        }, {
            name : 'status',
            type : 'integer'
        },{
            name : 'progress',
            type : 'integer'
        }, {
            name : 'message',
            type : 'string'
        },
        {
            name : 'file'
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
 * @class Ext.ux.upload.transport.Abstract
 * @extends Ext.util.Observable
 *
 * @author Sebastian Widelak (c) 2013
 */
Ext.define('Ext.ux.upload.transport.Abstract', {
    extend: 'Ext.util.Observable',
    requires: ['Ext.ux.upload.Store'],
    files: null,
    directParams: {
        extType: 'rpc',
        extUpload: true,
        extMethod: '',
        extAction: ''
    },
    statics: {
        STATUS: {
            'pending': 0,
            'in progress': 1,
            'failure': 2,
            'success': 3,
            'abort' : 4
        }
    },
    config: {

        /**
         * @cfg {Number} id
         *
         * Unique id of uploader
         */
        id: null,

        /**
         * @cfg {Object} params (required)
         *
         * Additional parameters to be send with upload request
         */
        params: {},

        /**
         * @cfg {Number} [maxFileSize=500000000]
         *
         * The maximum file size allowed to be uploaded.
         */
        maxFileSize: 500000000,

        /**
         * @cfg {String} url (required)
         *
         * The server URL to upload to.
         */
        url: null,

        /**
         * @cfg {String} url (required)
         *
         * The direct method which will be used to upload.
         */
        directMethod: '',

        /**
         * @cfg {Number} [timeout=60000]
         *
         * The connection timeout in miliseconds.
         */
        timeout: 60 * 1000,

        /**
         * @cfg {String} [contentType='application/binary']
         *
         * The content type announced in the HTTP headers. It is autodetected if possible, but if autodetection
         * cannot be done, this value is set as content type header.
         */
        contentType: 'application/binary',

        /**
         * @cfg {Object} acceptedTypes (required)
         *
         * Object with accepted type of files
         */
        acceptedTypes: {},

        /**
         * @cfg {Object} acceptedTypes (required)
         *
         * Object with extra headers
         */
        extraHeaders: {},

        /**
         * @cfg {String} [method='POST']
         *
         * The HTTP method to be used.
         */
        method: 'POST',

        /**
         * @cfg {String} [filenameHeader='X-File-Name']
         *
         * The name of the HTTP header containing the filename.
         */
        filenameHeader: 'X-File-Name',

        /**
         * @cfg {String} [sizeHeader='X-File-Size']
         *
         * The name of the HTTP header containing the size of the file.
         */
        sizeHeader: 'X-File-Size',

        /**
         * @cfg {String} [typeHeader='X-File-Type']
         *
         * The name of the HTTP header containing the MIME type of the file.
         */
        typeHeader: 'X-File-Type'
    },
    listeners: {
    },
    constructor: function (cfg) {
        var me = this;
        me.addEvents({
            /**
             * @event
             *
             * Fired when dropped file has not accepted extension.
             *
             */
            'notaccepted': true,
            /**
             * @event
             *
             * Fired when progress of upload was changed
             *
             */
            'progresschange': true,
            /**
             * @event
             *
             * Fired when error occurred.
             *
             */
            'failure': true,
            /**
             * @event
             *
             * Fired when file was uploaded.
             *
             */
            'success': true,
            /**
             * @event
             * @param formData
             * @param record
             *
             * Fires when upload process start.
             *
             */
            'beforeupload': true,
            /**
             * @event
             * @param status
             * @param event
             * @param record
             *
             * Fired whatever file was uploaded or error occurred.
             *
             */
            'afterupload': true,
            /**
             * @event
             * @param event
             * @param record
             *
             * Fired after request timeout.
             *
             */
            'timeout': true
        });
        me.initConfig(cfg);
        if (typeof me.config.url === 'undefined') {
            throw Error("uploadUrl missing in configuration object");
        }
        /**
         * create unique id
         */
        me.id = me.config.id = 'transport-' + (me.config.id || (+new Date()) + Math.floor(Math.random() * 101));

        /**
         * create store for files
         */
        me.files = Ext.create('Ext.ux.upload.Store', {
            storeId: this.getId()
        });
        me.callParent(arguments);
        me.directParams = me.initDirectParams();
        me.on('progresschange', me.onFileProgress);
        me.on('success', me.onFileSuccess);
        me.on('failure', me.onFileFailure);
    },
    /**
     * @returns {null}
     *
     * Return current id
     */
    getId: function () {
        return this.config.id;
    },
    /**
     * @returns {Ext.ux.upload.Store}
     *
     * return store of files ready to upload
     */
    getFiles: function () {
        return this.files;
    },
    /**
     * @private
     * @param file
     * @returns {{name: *, size: *, type: *, status: number, progress: number, message: string, file: *}}
     *
     * Convert file object to store model
     */
    getFileModel: function (file) {
        return {
            name: file.name,
            size: file.size,
            type: file.type,
            status: 0,
            progress: 0,
            message: '',
            file: file
        }
    },
    /**
     *
     * @param fileType
     * @returns {*}
     */
    setAcceptedFileType: function (fileType) {
        this.config.acceptedTypes[fileType] = true;
        return this;
    },
    /**
     * @private
     * @param file
     * @returns {boolean}
     */
    isAccepted: function (file) {
        var ret = true;
        if(Ext.Object.getSize(this.config.acceptedTypes) > 0 && !this.config.acceptedTypes[file.type]){
            ret = false;
        }
        if(file.size > this.config.maxFileSize) {
            ret = false;
        }
        return ret;
    },
    /**
     * @private
     * @param files
     * @returns {*}
     *
     * Add new files to upload queue
     */
    addFiles: function (files) {
        for (var i = 0, len = files.length; i < len; i++) {
            if (this.isAccepted(files[i])) {
                this.files.add(this.getFileModel(files[i]));
            } else {
                this.fireEvent('notaccepted', files[i]);
            }
        }
        return this;
    },
    /**
     * Initialize params if send using direct
     * @returns {*}
     */
    initDirectParams: function () {
        var directMethod = this.config.directMethod,
            parts = directMethod.split("."),
        directParams = {
            extType: 'rpc',
            extUpload: true,
            extMethod: '',
            extAction: ''
        };
        directParams.extMethod = parts.pop();
        directParams.extAction = parts.join(".");
        return directParams;
    },
    onFileProgress: function (event, item) {
        if (event.lengthComputable) {
            var complete = (event.loaded / event.total * 100 | 0);
            item.set({
                progress : complete,
                status : Ext.ux.upload.transport.Abstract.STATUS["in progress"]
            });
        }
    },
    onFileSuccess: function (json, event, item) {
        item.set('status', Ext.ux.upload.transport.Abstract.STATUS["success"]);
    },
    onFileFailure: function (json, event, item) {
        if(event.target.status === 0){
            item.set('status', Ext.ux.upload.transport.Abstract.STATUS["abort"]);
        }else{
            item.set('status', Ext.ux.upload.transport.Abstract.STATUS["failure"]);
        }
    },
    /**
     * @abstract
     * @private
     * @returns {Ext.ux.data.Connection}
     *
     * Initialize connection
     */
    initConnection: function () {
    },
    /**
     * @abstract
     */
    upload: function () {
    },
    /**
     * @abstract
     * @param item Ext.data.model
     *
     * Upload single item
     */
    uploadItem: function (item) {
    },
    /**
     * @abstract
     * @protected
     *
     * Prepare request headers
     */
    initHeaders: function (item) {
    },
    /**
     * @abstract
     * @protected
     *
     * Abort xhr request
     */
    abortUpload: function () {
    }
});

/**
 * @class Ext.ux.upload.transport.ExtJS
 * @extends Ext.ux.upload.Basic
 *
 * @author Sebastian Widelak (c) 2013
 */
Ext.define('Ext.ux.upload.transport.ExtJS', {
    requires: ['Ext.ux.upload.transport.Abstract'],
    extend: 'Ext.ux.upload.transport.Abstract',
    config : {
        /**
         * @cfg {String} [method='POST']
         *
         * The HTTP method to be used.
         */
        method: 'POST',

        /**
         * @cfg {Ext.data.Connection}
         *
         * If set, this connection object will be used when uploading files.
         */
        connection : null
    },
    initConnection: function () {
        var conn,
            url = this.config.url;
        if (this.conn instanceof Ext.data.Connection) {
            conn = this.conn;
        } else {
            if (this.config.params) {
                url = Ext.urlAppend(url, Ext.urlEncode(this.config.params));
            }
            conn = Ext.create('Ext.ux.data.Connection', {
                disableCaching: true,
                method: this.config.method,
                url: url,
                timeout: this.config.timeout,
                defaultHeaders: {
                    'Content-Type': this.config.contentType,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
        }
        return conn;
    },
    uploadItem: function (item) {
        var me = this;
        me.conn = me.initConnection();
        me.conn.request({
            scope: this,
            headers: this.initHeaders(item),
            rawData: item.file,
            success: function (response, options, item) {
                console.log(arguments);
                me.fireEvent('success');
            },
            failure: function (response, options, item) {
                console.log(arguments);
                me.fireEvent('failure');
            },
            progress: function (response, options, item) {
                console.log(arguments);
                me.fireEvent('progresschange');
            }
        });
    },
    /**
     * @protected
     */
    initHeaders: function (item) {
        var headers = this.extraHeaders || {};
        headers[this.config.filenameHeader] = item.get('name');
        headers[this.config.sizeHeader] = item.get('size');
        headers[this.config.typeHeader] = item.get('type');
        headers['Content-Type'] = item.get('type');
        console.log('headers', headers);
        return headers;
    },
    abortUpload: function () {
        if (this.conn) {
            this.suspendEvents();
            this.conn.abort();
            this.resumeEvents();
        }
    }
});

/**
 * @class Ext.ux.upload.DD
 * @extends Ext.ux.upload.Basic
 *
 * @author Sebastian Widelak (c) 2013
 */
Ext.define('Ext.ux.upload.transport.Xhr', {
    requires: ['Ext.ux.upload.transport.Abstract'],
    extend: 'Ext.ux.upload.transport.Abstract',
    initConnection: function () {
        var xhr = new XMLHttpRequest(),
            method = this.method,
            url = this.url;

        xhr.open(method, url, true);

        this.abortXhr = function () {
            xhr && xhr.abort();
        };
        this.clearXhr = function () {
            xhr = null;
        }

        return xhr;
    },
    /**
     *
     * @param item
     */
    uploadItem: function (item) {
        var me = this,
            file = item.get('file'),
            formData = new FormData(),
            xhr = this.initConnection(),
            json;

        Ext.Object.each(this.getParams(), function (key, value) {
            console.log(arguments);
            formData.append(key, value);
        });
        Ext.Object.each(this.directParams, function (key, value) {
            formData.append(key, value);
        });
        formData.append(file.name, file);
        xhr.setRequestHeader(this.config.filenameHeader, file.name);
        xhr.setRequestHeader(this.config.sizeHeader, file.size);
        xhr.setRequestHeader(this.config.typeHeader, file.type);
        xhr.addEventListener('loadend', function (event) {
            var response = event.target;
            if (response.status != 200) {
                me.fireEvent('failure', {}, event, item);
            } else {
                try {
                    json = Ext.JSON.decode(response.responseText);
                } catch (e) {
                    json = {};
                }
                if (json.success) {
                    me.fireEvent('success', json, event, item);
                } else {
                    me.fireEvent('failure', json, event, item);
                }
            }
            me.clearXhr();
            return me.fireEvent('afterupload', response.status, event, item);
        }, true);
        xhr.upload.addEventListener("progress", function (event) {
            return me.fireEvent('progresschange', event, item);
        }, true);
        xhr.timeout = me.getTimeout();
        xhr.addEventListener('timeout', function (event) {
            me.fireEvent('timeout', event, item);
        });
        me.fireEvent('beforeupload', formData, item);
        xhr.send(formData);
    },
    /**
     *
     */
    upload: function () {
        var me = this,
            idx =
                me.getFiles().findBy(function (r) {
                    if (r.get('status') === Ext.ux.upload.transport.Abstract.STATUS["pending"]) {
                        return true;
                    }
                });
        if (idx > -1) {
            me.uploadItem(me.getFiles().getAt(idx));
            me.on('afterupload', function (status){
                if(status === 0){
                    return;
                }
                setTimeout(function () {
                    me.upload();
                }, 150);
            }, me, {single: true});
        }
    },

    /**
     * Implements {@link Ext.ux.upload.uploader.AbstractUploader#abortUpload}
     */
    abortUpload: function () {
        this.abortXhr();
    },

    /**
     * @protected
     *
     * A placeholder for the abort procedure.
     */
    abortXhr: function () {
    },

    /**
     * @protected
     *
     * A placeholder for the remove procedure.
     */
    clearXhr: function () {
    }

});


/**
 * @class Ext.ux.upload.DD
 * @extends Ext.ux.upload.Basic
 *
 * @author Sebastian Widelak (c) 2013
 */
Ext.define('Ext.ux.upload.DD', {
    requires: ['Ext.ux.upload.transport.Xhr'],
    extend: 'Ext.util.Observable',
    transport: null,
    config: {
        id: null,
        directMethod: null,
        url: null,
        params: {},
        acceptedTypes: {},
        dropZone: null
    },
    /**
     *
     * @param cfg
     */
    constructor: function (cfg) {
        var me = this;
        me.initConfig(cfg);
        me.callParent(arguments);
        me.addEvents({
            /**
             * @event
             *
             * Fired when dragged element is over drop zone.
             *
             */
            'dragover': true,
            /**
             * @event
             *
             * Fired when dragged element left drop zone
             *
             */
            'dragout': true,
            /**
             * @event
             *
             * Fired when element was dropped.
             *
             */
            'drop': true
        });
        /**
         * test browser compatibility
         */
        me.testCompatibility();
        if (me.tests.dnd) {
            /**
             * Headers drag&drop if browser allow on that
             */
            me.initDragDrop();
            me.transport = me.initTransport();
        }
    },
    getDropZone: function () {
        return this.config.dropZone;
    },
    /**
     * @private
     */
    initDragDrop: function () {
        var me = this,
            collection = Ext.create('Ext.util.MixedCollection'),
            dropZone = me.getDropZone(),
            dom = dropZone.getEl().dom,
            style = '#' + dom.id + ' * { pointer-events: none; }',
            styleEl = document.createElement('style');

        dom.ondrop = function (e) {
            e.preventDefault();
            collection = Ext.create('Ext.util.MixedCollection');
            if (Ext.Array.contains(e.dataTransfer.types, "Files")) {
                me.transport.addFiles(e.dataTransfer.files);
            }
            me.fireEvent('drop', dropZone, e.dataTransfer.files);
            return false;
        };
        dom.ondragenter = function (e) {
            try {
                if (e.relatedTarget.nodeType == 3) return false;
            } catch (err) {
            }
            if (e.target === e.relatedTarget) return false;
            if (collection.getCount() === 0) {
                var len = e.dataTransfer.mozItemCount || e.dataTransfer.items.length;
                me.fireEvent('dragover', dropZone, len, e.dataTransfer, e);
            }
            collection.add(e.target);
            return false
        };
        dom.ondragleave = function (e) {
            try {
                if (e.relatedTarget.nodeType == 3) return false;
            } catch (err) {
            }
            if (e.target === e.relatedTarget) return false;
            setTimeout(function () {
                collection.remove(e.target);
                if (collection.getCount() === 0) {
                    me.fireEvent('dragout', dropZone);
                }
            }, 1);
            return false;
        }
        styleEl.innerHTML = style;
        dom.appendChild(styleEl);
    },
    /**
     *
     * @returns {Ext.ux.upload.transport.Abstract}
     */
    initTransport: function () {
        var me = this,
            transport,
            _class;
        if (this.transport instanceof Ext.ux.upload.transport.Abstract) {
            transport = this.transport;
        } else {
            if (me.tests['progress'] && me.tests['formdata']) {
                _class = 'Ext.ux.upload.transport.Xhr';
            } else {
                console.warn('progress and form data not supported');
                //todo: older browser support
            }
            transport = Ext.create(_class, this.config);
        }
        return transport;
    },
    /**
     * @private
     */
    testCompatibility: function () {
        var me = this;
        me.tests = {
            dnd: 'draggable' in document.createElement('span'),
            formdata: !!window.FormData,
            progress: "upload" in new XMLHttpRequest
        };
    },
    getTransport: function () {
        return this.transport;
    },
    upload: function () {
        this.getTransport().upload();
    },
    abort: function () {
        this.getTransport().abortUpload();
    }
});

Ext.define('Ext.ux.container.Upload', {
    requires: ['Ext.ux.upload.DD'],
    extend: 'Ext.container.Container',
    alias: 'widget.uploadbox',
    alternateClassName: 'Ext.UploadBox',
    layout: 'fit',
    emptyDragZoneMsg: "Upload zone",
    dragZoneOverMsg: "Add {0} file(s) to upload query",
    progressMsg: "{0} files to upload.",
    notAcceptedMsg : "{0} has not accepted extension or is to big",
    timeoutMsg : "Request for {0} has exceeded the allowed timeout.",
    processed : 0,
    listeners : {},
    config: {
        /**
         * @config
         *
         * Determines that files are auto loaded after drop or not
         */
        autoUpload: false
    },
    initComponent: function () {
        var me = this;
        me.addEvents([
        /**
         * @event
         *
         * Fired when drag & drop was initialized
         *
         */
            'ddinit'
        ]);
        me.items = [
            {
                xtype: 'panel',
                frame: false,
                border: 0,
                layout: 'vbox',
                tbar: [
                    {
                        xtype: 'button',
                        text: 'Upload',
                        itemId: 'ux-upload-btn-upload',
                        handler: function () {
                            var btn = this,
                                abort = btn.next();
                            me.upload.upload();
                            btn.setVisible(false);
                            abort.setVisible(true);
                        },
                        disabled: true
                    },
                    {
                        xtype: 'button',
                        itemId: 'ux-upload-btn-abort',
                        handler: function () {
                            var abort = this,
                                btn = abort.prev();
                            me.upload.abort();
                            btn.setVisible(true);
                            abort.setVisible(false);
                        },
                        text: 'Abort',
                        hidden: true
                    },
                    {
                        xtype: 'button',
                        itemId: 'ux-upload-btn-clear',
                        text: 'Clear queue',
                        handler: function () {
                            var clear = this,
                                abort = clear.prev(),
                                btn = abort.prev();
                            me.upload.abort();
                            me.upload.getTransport().getFiles().removeAll();
                            me.processed = 0;
                            me.updateInfo();
                            btn.setDisabled(true);
                            btn.setVisible(true);
                            abort.setVisible(false);
                            clear.setVisible(false);
                        },
                        hidden: true
                    }
                ],
                items: [
                    {
                        xtype: 'container',
                        itemId: 'uploadBox',
                        flex: 1,
                        width: '100%',
                        style: 'border-bottom: 1px solid #99bce8;',
                        layout: {
                            align: 'stretch',
                            pack: 'center',
                            type: 'vbox'
                        },
                        items: [
                            {
                                xtype: 'container',
                                html: 'Upload zone',
                                style: 'text-align: center;'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        width: '100%',
                        layout: 'absolute',
                        items: [
                            {
                                xtype: 'container',
                                height: 28,
                                anchor: '0%',
                                itemId: 'upload-box-progress',
                                style: 'border-right: 1px solid #99bce8;',
                                cls: 'x-toolbar-default'
                            },
                            {
                                xtype: 'container',
                                itemId: 'upload-box-info',
                                html: '',
                                y: 7,
                                x: 5,
                                width: '100%'
                            }
                        ]
                    }
                ]
            }
        ];
        Ext.apply(me.listeners, {
            afterrender: me.afterContainerRender
        });
        me.callParent(arguments);
    },
    afterContainerRender: function () {
        var me = this,
            btnUpload = me.down('#ux-upload-btn-upload'),
            btnClear = me.down('#ux-upload-btn-clear'),
            btnAbort = me.down('#ux-upload-btn-abort'),
            progressBar = me.down('#upload-box-progress'),
            interval = [],
            lastReqTime = 0;
        me.upload = Ext.create('Ext.ux.upload.DD', {
            dropZone: me.down('#uploadBox'),
            id: me.id,
            url: me.url,
            directMethod: me.directMethod || '',
            acceptedTypes: me.acceptedTypes,
            maxFileSize : me.maxFileSize,
            timeout: me.timeout,
            listeners: {
                dragover: function (el, count) {
                    el.removeAll();
                    el.add({
                        xtype: 'container',
                        html: Ext.String.format(me.dragZoneOverMsg, count),
                        style: 'text-align: center;'
                    });
                },
                dragout: function (el) {
                    me.resetDropZone(el);
                },
                drop: function (el) {
                    var files = me.upload.getTransport().getFiles();
                    me.resetDropZone(el);
                    if (files.count() > 0) {
                        btnUpload.setDisabled(false);
                        btnClear.setVisible(true);
                        if(me.getAutoUpload()){
                            btnAbort.setVisible(true);
                            btnUpload.setVisible(false);
                            me.upload.upload();
                        }else{

                        }
                    } else {
                        btnUpload.setDisabled(true);
                        btnClear.setVisible(false);
                    }
                    me.updateInfo();
                }
            }
        });
        me.updateInfo();
        me.fireEvent('ddinit', me.upload);
        /**
         * additional listeners to controll upload processes
         */
        me.upload.getTransport().on('notaccepted', function (file){
            var tooltip = Ext.create('Ext.tip.ToolTip', {
                title: 'Warning',
                target: '',
                anchor: 'right',
                html: '',
                width: 415,
                autoHide: false,
                closable: true,
                closeAction : 'destroy'
            });
            tooltip.setTarget(btnUpload.id);
            tooltip.html = Ext.String.format(me.notAcceptedMsg, file.name);
            tooltip.show();
        });
        me.upload.getTransport().on('beforeupload', function () {
            progressBar
                .getEl()
                .sequenceFx()
                .animate({
                    duration: 0,
                    to: {
                        width: 0
                    }
                });
            lastReqTime = +new Date();
        });
        me.upload.getTransport().on('progresschange', function (e, item) {
            var width = progressBar.up().getWidth() * item.get('progress') / 100,
                currReqTime = +new Date();
            interval.push(currReqTime - lastReqTime);
            lastReqTime = currReqTime;
            progressBar
                .getEl()
                .sequenceFx()
                .animate({
                    duration: me.calculateDuration(interval),
                    to: {
                        width: width
                    }
                });
        });
        me.upload.getTransport().on('afterupload', function () {
            var transport = me.upload.getTransport(),
                files = transport.getFiles(),
                toUpload = 0,
                inProgress = 0;
            me.processed++;
            /**
             * clear interval array
             */
            interval = [];
            files.each(function (r) {
                switch (r.get('status')) {
                    case Ext.ux.upload.transport.Abstract.STATUS["pending"]:
                        toUpload++;
                        break;
                    case Ext.ux.upload.transport.Abstract.STATUS["in progress"]:
                        inProgress++;
                        break;
                }
            });
            if (!toUpload) {
                btnUpload.setDisabled(true);
                if (!inProgress) {
                    btnUpload.setVisible(true);
                    btnAbort.setVisible(false);
                }
            }
            me.updateInfo();
        });
        me.upload.getTransport().on('timeout', function (e, item) {
            var tooltip = Ext.create('Ext.tip.ToolTip', {
                title: 'Warning',
                target: '',
                anchor: 'right',
                html: '',
                width: 415,
                autoHide: false,
                closable: true,
                closeAction : 'destroy'
            });
            tooltip.setTarget(btnUpload.id);
            tooltip.html = Ext.String.format(me.timeoutMsg, item.get('name'));
            tooltip.show();
        });
    },
    resetDropZone: function (el) {
        var me = this;
        el.removeAll();
        el.add({
            xtype: 'container',
            html: me.emptyDragZoneMsg,
            style: 'text-align: center;'
        });
    },
    calculateDuration: function (elmt) {
        var sum = 0;
        for (var i = 0; i < elmt.length; i++) {
            sum += parseInt(elmt[i]);
        }
        return sum / elmt.length;
    },
    updateInfo: function () {
        var me = this,
            progressInfo = me.down('#upload-box-info'),
            files = me.upload.getTransport().getFiles();
        progressInfo.removeAll();
        progressInfo.add({
            xtype: 'container',
            html: Ext.String.format(me.progressMsg, files.count() - this.processed)
        });
    }
});