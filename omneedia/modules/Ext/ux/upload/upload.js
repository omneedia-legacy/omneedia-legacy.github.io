Ext.define('Ext.ux.upload.Progress', {
    extend: 'Ext.window.Window',
    height: 500,
    width: 300,
    layout: "fit",
    initComponent: function (win) {
        var me = this;
        this.title = this._lang.uploading;
        this.listeners = {
            show: function (p) {
                var files = me._files;
                for (var i = 0; i < files.length; i++) {
                    me.down('grid').getStore().add({
                        filename: files[i].name,
                        filesize: files[i].size,
                        filetype: files[i].type,
                        progress: 0
                    });
                };

                function upload(files, ndx, cb) {
                    if (!files[ndx]) {
                        me._parent.fireEvent('complete', me._parent);
                        return cb();
                    };

                    var file = files[ndx];

                    var formData = new FormData();
                    formData.append(file.name, file);

                    var xhr = new XMLHttpRequest();
                    var method = "POST";
                    var url = me._url;

                    xhr.open(method, url, true);

                    xhr.abortXhr = function () {
                        this.suspendEvents();
                        xhr.abort();
                        this.resumeEvents();
                        me._parent.fireEvent('cancel', me._parent);
                    };

                    xhr.setRequestHeader(this.filenameHeader, file.name);
                    xhr.setRequestHeader(this.sizeHeader, file.size);
                    xhr.setRequestHeader(this.typeHeader, file.type);

                    function loadendhandler(x) {
                        me._parent.down('grid').getStore().add({
                            docId: x.currentTarget.responseText.replace(/"/g, ""),
                            filename: files[0].name,
                            filesize: files[0].size,
                            filetype: files[0].type
                        });
                        me._parent.fireEvent('upload', me._parent, {
                            docId: x.currentTarget.responseText.replace(/"/g, ""),
                            filename: files[0].name,
                            filesize: files[0].size,
                            filetype: files[0].type
                        });
                        files.shift();
                        p.down('grid').getStore().load();
                        upload(files, 0, cb);
                    };

                    function progresshandler(item) {
                        try {
                            var record = p.down('grid').getStore().getAt(0);
                            record.set('progress', parseInt((100 * item.loaded) / item.total));
                            record.commit();
                        } catch (e) {

                        }
                    };
                    xhr.addEventListener('loadend', loadendhandler, true);
                    xhr.upload.addEventListener("progress", progresshandler, true);
                    xhr.send(formData);
                };
                upload(files, 0, function () {
                    var results = [];
                    for (var i = 0; i < me._parent.down('grid').getStore().getData().items.length; i++) {
                        results.push(me._parent.down('grid').getStore().getData().items[i].data);
                    };
                    me.close();
                });
            }
        };
        this.getFiles = function () {
            return this.items.items[0].getStore().data;
        };
        this.items = [{
            xtype: "grid",
            columns: [{
                    header: me._lang.filename,
                    dataIndex: "filename",
                    flex: 1,
                    renderer: function (value) {
                        return '<div style="margin-top:3px;margin-bottom:3px;">' + value + '</div>'
                    }
                },
                {
                    width: 110,
                    hidden: false,
                    dataIndex: "progress",
                    renderer: function (v, m, r) {
                        var html = [
                            '<div style="border:1px solid #EEEEEE;margin:2px;width:100%;height:17px">',
                            '<div style="width:' + v + '%;height:15px;top:0px;left:0px;position:relative;background-color:aqua"></div>',
                            '</div>'
                        ];
                        return html.join('');
                    }
                }
            ],
            store: App.store.create({
                fields: ["filename", "progress"],
                data: []
            })
        }];
        this.bbar = [
            '->',
            {
                xtype: "button",
                text: me._lang.cancel,
                handler: function (p) {
                    p.up('window').close();
                }
            }
        ]
        this.callParent(arguments);
    }
});

Ext.define('Ext.ux.upload.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.uploadpanel',
    lang: {
        browse: "Joindre un document",
        browse_ico: "icobrowse",
        uploading: "Téléversement",
        trash: "",
        trash_ico: "upload_trash",
        cancel: "Cancel",
        filename: "Fichiers",
        size: "Taille",
        type: "Type",
        delete: "Supprimer"
    },
    initComponent: function () {
        var me = this;
        me.files = [];
        me.uploadFiles = [];
        this.url = "/";
        this.layout = "fit";
        this.getFiles = function () {
            var dta = me.down('grid').items.items[0].getStore().data.items;
            var DTA = [];
            for (var i = 0; i < dta.length; i++) {
                DTA.push(dta[i].data);
            };
            return DTA;
        };

        this.setFiles = function (data) {
            me.down('grid').items.items[0].getStore().loadData(data);
        };

        if (me.readOnly) tbar = false;
        else tbar = [{
            xtype: "button",
            text: me.lang.browse,
            iconCls: me.lang.browse_ico,
            handler: function () {
                me.inputField = document.createElement('input');
                me.inputField.type = 'file';
                me.inputField.hidden = false;
                me.inputField.multiple = true;
                document.getElementsByTagName('body')[0].appendChild(me.inputField);
                me.inputField.click();
                me.inputField.addEventListener('change', function (x) {
                    if (x.target.files.length <= 0) return;
                    var files = [];
                    for (var i = 0; i < x.target.files.length; i++) files.push(x.target.files[i]);
                    var w1 = Ext.create('Ext.ux.upload.Progress', {
                        modal: true,
                        _files: files,
                        _url: me.url,
                        _parent: me,
                        _lang: me.lang
                    });
                    w1.show();
                });
            }
        }, '->', {
            xtype: "button",
            iconCls: me.lang.trash_ico,
            text: me.lang.trash,
            handler: function (p) {
                var sels = p.up('grid').getSelectionModel().getSelection();
                var dels = [];
                for (var i = 0; i < sels.length; i++) {
                    dels.push(sels[i].data.docId);
                    p.up('grid').getStore().remove(sels[i]);
                };
                me.fireEvent('del', me, dels);
            }
        }];

        this.items = [{
            xtype: "grid",
            multiSelect: true,
            tbar: tbar,
            columns: [{
                    text: me.lang.filename,
                    dataIndex: "filename",
                    flex: 1,
                    renderer: function (value) {
                        return '<div style="margin-top:3px;margin-bottom:3px;">' + value + '</div>'
                    }
                },
                {
                    text: me.lang.type,
                    align: "center",
                    dataIndex: "filetype",
                    width: 100,
                    renderer: function (value) {
                        return '<div style="margin-top:3px;margin-bottom:3px;">' + value + '</div>'
                    }
                },
                {
                    text: me.lang.size,
                    align: "right",
                    dataIndex: "filesize",
                    width: 50,
                    renderer: function (value) {
                        return '<div style="margin-top:3px;margin-bottom:3px;">' + value + '</div>'
                    }
                }
            ],
            border: false,
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
                itemdblclick: function (p, record) {
                    me.fireEvent('itemdblclick', p, record.data);
                },
                beforeitemcontextmenu: function (view, record, item, index, e) {
                    e.stopEvent();
                    /*
                    if (me.readOnly) return;
                    var gridMenu = Ext.create('Ext.menu.Menu', {
                        items: [{
                            text: me.lang.delete,
                            handler: function () {
                                view.getStore().remove(record);
                            }
                        }]
                    });
                    gridMenu.showAt(e.getXY());*/
                }
            }
        }];
        this.callParent(arguments);
    }
});