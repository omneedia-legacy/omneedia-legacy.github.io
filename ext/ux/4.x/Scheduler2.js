Ext.define("Ext.ux.Scheduler2.crud.AbstractManager", {
    require: [ "Ext.data.StoreManager" ],
    mixins: {
        observable: Ext.util.Observable
    },
    revision: null,
    stores: null,
    storeIdProperty: "storeId",
    filterParam: "filter",
    storesIndex: null,
    activeRequests: null,
    delayedSyncs: null,
    transport: null,
    trackResponseType: false,
    phantomIdField: "$PhantomId",
    autoLoad: false,
    autoSyncTimeout: 100,
    autoSync: false,
    resetIdsBeforeSync: true,
    syncApplySequence: null,
    writeAllFields: false,
    ignoreUpdates: 0,
    createMissingRecords: false,
    autoSyncTimerId: null,
    constructor: function(b) {
        b = b || {};
        this.mixins.observable.constructor.call(this, b);
        this.activeRequests = {};
        this.delayedSyncs = [];
        this.transport = b.transport || this.transport || {};
        var a = b.stores || this.stores;
        this.stores = [];
        this.addStore(a);
        var c = b.syncApplySequence || this.syncApplySequence;
        if (c) {
            this.syncApplySequence = null;
            this.addStoreToApplySequence(c);
        }
        if (this.autoLoad) {
            this.load();
        }
    },
    updateStoreIndex: function() {
        var b = {};
        for (var d = 0, a = this.stores.length; d < a; d++) {
            var c = this.stores[d];
            if (c.storeId) {
                b[c.storeId] = this.stores[d];
            }
        }
        this.storesIndex = b;
    },
    getStoreDescriptor: function(b) {
        if (!b) {
            return;
        }
        if (b instanceof Ext.data.AbstractStore) {
            for (var c = 0, a = this.stores.length; c < a; c++) {
                if (this.stores[c].store === b) {
                    return this.stores[c];
                }
            }
        } else {
            if (typeof b == "object") {
                return this.storesIndex[b.storeId];
            } else {
                return this.storesIndex[b] || this.getStoreDescriptor(Ext.data.StoreManager.get(b));
            }
        }
    },
    getStore: function(a) {
        var b = this.getStoreDescriptor(a);
        return b && b.store;
    },
    forEachStore: function(e, d) {
        if (!e) {
            return;
        }
        var b = this.stores;
        for (var c = 0, a = b.length; c < a; c++) {
            if (e.call(d || this, b[c].store, b[c].storeId, b[c]) === false) {
                break;
            }
        }
    },
    addStore: function(p, h, a) {
        if (!p) {
            return;
        }
        if (!Ext.isArray(p)) {
            p = [ p ];
        }
        var f = [];
        for (var g = 0, c = p.length; g < c; g++) {
            var o = p[g];
            if (o instanceof Ext.data.AbstractStore) {
                o = {
                    store: o
                };
            } else {
                if (typeof o == "object") {
                    if (o.stores) {
                        if (!Ext.isArray(o.stores)) {
                            o.stores = [ o.stores ];
                        }
                        for (var d = 0, b = o.stores.length; d < b; d++) {
                            var k = o.stores[d], e = k;
                            if ("string" === typeof k) {
                                e = {
                                    storeId: k
                                };
                            }
                            e.masterStoreInfo = o;
                            o.stores[d] = e;
                        }
                    }
                } else {
                    o = {
                        store: Ext.data.StoreManager.get(o)
                    };
                }
            }
            f.push(this.fillStoreDescriptor(o));
            o.store.crudManager = this;
            if (o.store.isTreeStore) {
                o.store.setProxy({
                    type: "memory"
                });
            }
            this.bindStoreListeners(o.store);
        }
        if (typeof h === "undefined") {
            this.stores.push.apply(this.stores, f);
        } else {
            var m = h;
            if (a) {
                if (a instanceof Ext.data.AbstractStore || typeof a !== "object") {
                    a = this.getStoreDescriptor(a);
                }
                m += Ext.Array.indexOf(this.stores, a);
            }
            this.stores.splice.apply(this.stores, [].concat([ m, 0 ], f));
        }
        this.updateStoreIndex();
    },
    bindStoreListeners: function(b, a) {
        var c = {
            update: this.onStoreUpdate,
            clear: this.onStoreChange,
            scope: this
        };
        if (b.isTreeStore) {
            Ext.apply(c, {
                nodeappend: this.onStoreChange,
                nodeinsert: this.onStoreChange,
                noderemove: this.onNodeRemove
            });
        } else {
            Ext.apply(c, {
                add: this.onStoreChange,
                remove: this.onStoreChange
            });
        }
        if (a) {
            this.mun(b, c);
        } else {
            this.mon(b, c);
        }
    },
    unbindStoreListeners: function(a) {
        this.bindStoreListeners(a, true);
    },
    fillStoreDescriptor: function(d) {
        var a = d.store, c = a.storeIdProperty || this.storeIdProperty, b = a.getModel && a.getModel() || a.model;
        b = b && b.prototype;
        Ext.applyIf(d, {
            storeId: a[c],
            phantomIdField: b && b.phantomIdField,
            idProperty: b && b.idProperty,
            writeAllFields: a.writeAllFields
        });
        return d;
    },
    removeStore: function(b) {
        for (var c = 0, a = this.stores.length; c < a; c++) {
            var d = this.stores[c];
            if (d === b || d.store === b || d.storeId === b) {
                this.unbindStoreListeners(d.store);
                delete this.storesIndex[d.storeId];
                this.stores.splice(c, 1);
                if (this.syncApplySequence) {
                    this.removeStoreFromApplySequence(b);
                }
                break;
            }
        }
    },
    addStoreToApplySequence: function(c, a, e) {
        if (!c) {
            return;
        }
        if (!Ext.isArray(c)) {
            c = [ c ];
        }
        var g = [];
        for (var d = 0, b = c.length; d < b; d++) {
            var f = this.getStoreDescriptor(c[d]);
            if (f) {
                g.push(f);
            }
        }
        if (!this.syncApplySequence) {
            this.syncApplySequence = [];
        }
        if (typeof a === "undefined") {
            this.syncApplySequence.push.apply(this.syncApplySequence, g);
        } else {
            var h = a;
            if (e) {
                if (e instanceof Ext.data.AbstractStore || typeof e !== "object") {
                    e = this.getStoreDescriptor(e);
                }
                h += Ext.Array.indexOf(this.syncApplySequence, e);
            }
            this.syncApplySequence.splice.apply(this.syncApplySequence, [].concat([ h, 0 ], g));
        }
    },
    removeStoreFromApplySequence: function(b) {
        for (var c = 0, a = this.syncApplySequence.length; c < a; c++) {
            var d = this.syncApplySequence[c];
            if (d === b || d.store === b || d.storeId === b) {
                this.syncApplySequence.splice(c, 1);
                break;
            }
        }
    },
    onNodeRemove: function(a, b) {
        var c = a && a.getTreeStore();
        c && c.on("endupdate", this.onStoreChange, this, {
            single: true
        });
    },
    onStoreUpdate: function(b, a) {
        if (!b.isTreeStore || a !== b.getRoot()) {
            this.onStoreChange();
        }
    },
    onStoreChange: function() {
        if (this.ignoreUpdates) {
            return;
        }
        var a = this;
        this.fireEvent(this.hasChanges() ? "haschanges" : "nochanges", this);
        if (this.autoSync) {
            if (!this.autoSyncTimerId) {
                this.autoSyncTimerId = setTimeout(function() {
                    a.autoSyncTimerId = null;
                    a.sync();
                }, this.autoSyncTimeout);
            }
        }
    },
    hasChanges: function(b) {
        var c;
        if (b) {
            c = this.getStore(b);
            if (!c) {
                return;
            }
            return Boolean(c.getModifiedRecords().length || c.getRemovedRecords().length);
        }
        for (var d = 0, a = this.stores.length; d < a; d++) {
            c = this.stores[d].store;
            if (c.getModifiedRecords().length || c.getRemovedRecords().length) {
                return true;
            }
        }
        return false;
    },
    getLoadPackage: function(n) {
        var j = {
            type: "load",
            requestId: this.getRequestId(),
            stores: []
        };
        var m = this.stores, d = j.stores;
        for (var g = 0, e = m.length; g < e; g++) {
            var k = m[g], b = k.filterParam || k.store.filterParam || this.filterParam, a = n && n[k.storeId], h = k.pageSize || k.store.pageSize;
            if (k.store.remoteFilter && b) {
                a = a || {};
                var c = [];
                k.store.getFilters().each(function(i) {
                    c.push(i.serialize());
                });
                a[b] = c;
            }
            if (a || h) {
                var f = Ext.apply({
                    storeId: k.storeId,
                    page: 1,
                    pageSize: h
                }, a);
                m[g].currentPage = f.page;
                d.push(f);
            } else {
                d.push(k.storeId);
            }
        }
        return j;
    },
    prepareAdded: function(h, m, k) {
        var o = [];
        for (var c = 0, a = h.length; c < a; c++) {
            var d = h[c], b = {}, e = d.getFields();
            if (!b.hasOwnProperty(m)) {
                b[m] = d.getId();
            }
            for (var g = 0, n = e.length; g < n; g++) {
                var j = e[g];
                if (j) {
                    if (j.persist && (d.data.hasOwnProperty(j.name) || j.critical)) {
                        if (j.serialize) {
                            b[j.name] = j.serialize(d.data[j.name], d);
                        } else {
                            b[j.name] = d.data[j.name];
                        }
                    }
                }
            }
            if (this.resetIdsBeforeSync) {
                delete b[d.idProperty];
            }
            if (k) {
                this.processSubStores(d, b, k);
            }
            o.push(b);
        }
        return o;
    },
    prepareUpdated: function(m, p, o) {
        var q = [], b = o.writeAllFields || o.writeAllFields !== false && this.writeAllFields, e, n;
        for (var g = 0, c = m.length; g < c; g++) {
            var h = m[g], k;
            if (b) {
                e = h.getData();
                e[h.idProperty] = h.getId();
                for (k in e) {
                    n = h.getField(k);
                    if (!n || !n.persist && !n.critical) {
                        delete e[k];
                    } else {
                        if (n.serialize) {
                            e[k] = n.serialize(e[k], h);
                        } else {
                            e[k] = h.get(k);
                        }
                    }
                }
            } else {
                e = h.getChanges();
                e[h.idProperty] = h.getId();
                for (k in e) {
                    n = h.getField(k);
                    if (!n || !n.persist) {
                        delete e[k];
                    } else {
                        if (n.serialize) {
                            e[k] = n.serialize(e[k], h);
                        } else {
                            e[k] = h.get(k);
                        }
                    }
                }
                var a = h.getCriticalFields();
                for (var d = 0; d < a.length; d++) {
                    n = a[d];
                    if (n.serialize) {
                        e[n.getName()] = n.serialize(h.get(n.getName()), h);
                    } else {
                        e[n.getName()] = h.get(n.getName());
                    }
                }
            }
            if (p) {
                this.processSubStores(h, e, p);
            }
            q.push(e);
        }
        return q;
    },
    prepareRemoved: function(e) {
        var a = [], d;
        for (var c = 0, b = e.length; c < b; c++) {
            d = {};
            d[e[c].idProperty] = e[c].getId();
            a.push(d);
        }
        return a;
    },
    processSubStores: function(b, f, a) {
        for (var d = 0, h = a.length; d < h; d++) {
            var g = a[d].storeId, c = b.get(g);
            if (c) {
                var e = this.getStoreChanges(Ext.apply({
                    store: c
                }, a[d]));
                if (e) {
                    f[g] = Ext.apply(e, {
                        $store: true
                    });
                } else {
                    delete f[g];
                }
            } else {
                delete f[g];
            }
        }
    },
    getStoreChanges: function(d, g) {
        g = g || d.phantomIdField || this.phantomIdField;
        var f = d.store, e = f.getNewRecords(), c = f.getUpdatedRecords(), h = f.getRemovedRecords(), b = d.stores;
        var a;
        if (e.length) {
            e = this.prepareAdded(e, g, b);
        }
        if (c.length) {
            c = this.prepareUpdated(c, b, d);
        }
        if (h.length) {
            h = this.prepareRemoved(h);
        }
        if (e.length || c.length || h.length) {
            a = {};
            if (e.length) {
                a.added = e;
            }
            if (c.length) {
                a.updated = c;
            }
            if (h.length) {
                a.removed = h;
            }
        }
        return a;
    },
    getChangeSetPackage: function() {
        var d = {
            type: "sync",
            requestId: this.getRequestId(),
            revision: this.revision
        };
        var f = this.stores, j = 0;
        for (var b = 0, a = f.length; b < a; b++) {
            var e = f[b], g = e.phantomIdField || this.phantomIdField, h = e.storeId;
            var c = this.getStoreChanges(e, g);
            if (c) {
                j++;
                d[h] = c;
            }
        }
        return j ? d : null;
    },
    getSubStoresData: function(h, f, g, e) {
        if (!h) {
            return;
        }
        var j = [];
        var a = function(n, o) {
            for (var l = 0, i = o.length; l < i; l++) {
                var k = o[l].storeId;
                if (n[k]) {
                    j.push({
                        id: n[g],
                        storeDesc: o[l],
                        data: n[k]
                    });
                    delete n[k];
                }
            }
        };
        var d = 0, c = h.length;
        if (e) {
            for (;d < c; d++) {
                a(h[d], f);
                var b = this.getSubStoresData(h[d].children, f, g, true);
                if (b) {
                    j = j.concat(b);
                }
            }
        } else {
            for (;d < c; d++) {
                a(h[d], f);
            }
        }
        return j;
    },
    loadDataToTreeStore: function(a, d, b, e) {
        var c = d && d.rows;
        a.proxy.data = c;
        a.load();
    },
    loadDataToFlatStore: function(b, e, c, f) {
        var d = e && e.rows;
        b.totalCount = e.total;
        b.currentPage = f.currentPage;
        var a = Ext.Array.map(d, function(g) {
            return new b.model(g);
        });
        b.loadData(a, c && c.append || e.append);
        b.fireEvent("load", b, a, true);
    },
    loadDataToStore: function(a, e, p) {
        var k = a.store, f = k.getModel(), m = a.stores, n = a.idProperty || f && f.prototype && f.prototype.idProperty || "id", h = k.isTreeStore, j;
        var o = e && e.rows;
        k.metaData = e && e.metaData;
        if (o) {
            if (m) {
                j = this.getSubStoresData(o, m, n, h);
            }
            k.__loading = true;
            var c = h ? this.loadDataToTreeStore : this.loadDataToFlatStore;
            c.call(this, k, e, p, a);
            if (j) {
                for (var d = 0, b = j.length; d < b; d++) {
                    var g = j[d];
                    this.loadDataToStore(Ext.apply({
                        store: k[h ? "getNodeById" : "getById"](g.id).get(g.storeDesc.storeId)
                    }, g.storeDesc), g.data);
                }
            }
            k.__loading = false;
        }
    },
    loadData: function(c, d) {
        d = d || {};
        this.ignoreUpdates++;
        for (var e = 0, b = this.stores.length; e < b; e++) {
            var g = this.stores[e], a = g.storeId, f = c[a];
            if (f) {
                this.loadDataToStore(g, f, d[a]);
            }
        }
        this.ignoreUpdates--;
    },
    applyChangesToRecord: function(g, i, o, m) {
        var f = g.data, e = {}, c = false, a;
        if (o) {
            for (var d = 0, b = o.length; d < b; d++) {
                a = o[d].storeId;
                if (i.hasOwnProperty(a)) {
                    e[a] = true;
                    var h = g.get(a);
                    if (h) {
                        this.applyChangesToStore(Ext.apply({
                            store: h
                        }, o[d]), i[a]);
                    } else {
                        Ext.log("Can't find store for the response sub-package");
                    }
                }
            }
        }
        for (a in i) {
            if (i.hasOwnProperty(a) && !e[a]) {
                var l = i[a];
                if (!g.isEqual(f[a], l)) {
                    if (!c) {
                        c = true;
                        g.beginEdit();
                    }
                    if (a === g.idProperty) {
                        g.setId(l);
                    } else {
                        if (a == "parentId" && m.isTreeStore) {
                            var k = l && m.getNodeById(l) || m.getRoot();
                            k.appendChild(g);
                        } else {
                            g.set(a, l);
                        }
                    }
                }
            }
        }
        this.ignoreUpdates++;
        if (c) {
            g.endEdit();
        }
        this.ignoreUpdates--;
        g.commit();
    },
    applyRemovals: function(o, m, d) {
        var p = d.idProperty, n = o.isTreeStore ? o.removedNodes : o.removed, q = d.findByIdFn, a = d.removeRecordFn, h = 0;
        for (var g = 0, e = m.length; g < e; g++) {
            var f = false;
            var c = m[g][p];
            for (var l = 0, b = n.length; l < b; l++) {
                if (n[l].getId() == c) {
                    n.splice(l, 1);
                    f = true;
                    h++;
                    break;
                }
            }
            if (!f) {
                var i = q(c);
                if (i) {
                    this.ignoreUpdates++;
                    a(i);
                    Ext.Array.remove(n, i);
                    h++;
                    this.ignoreUpdates--;
                } else {
                    Ext.log("Can't find record to remove from the response package");
                }
            }
        }
        return h;
    },
    getApplyChangesToStoreHelpers: function(a) {
        if (a.isTreeStore) {
            var b = function(c) {
                return a.getNodeById(c);
            };
            return {
                findByPhantomFn: b,
                findByIdFn: b,
                addRecordFn: function(d) {
                    var c = d.parentId && a.getNodeById(d.parentId) || a.getRoot();
                    return c.appendChild(d);
                },
                removeRecordFn: function(c) {
                    return c.parentNode.removeChild(c);
                }
            };
        } else {
            return {
                findByPhantomFn: function(c) {
                    return a.data.getByKey(c);
                },
                findByIdFn: function(c) {
                    return a.getById(c);
                },
                addRecordFn: function(c) {
                    return a.add(c)[0];
                },
                removeRecordFn: function(c) {
                    return a.remove(c);
                }
            };
        }
    },
    applyChangesToStore: function(l, u) {
        var v = this, b = l.phantomIdField || v.phantomIdField, h = l.idProperty, g = l.store;
        if (!h) {
            var e = g.getModel && g.getModel() || g.model;
            e = e && e.prototype;
            h = e && e.idProperty || "id";
        }
        var p = v.getApplyChangesToStoreHelpers(g), n = p.findByPhantomFn, m = p.findByIdFn, a = p.addRecordFn, t = p.removeRecordFn;
        var i = u.rows, s = u.removed, c;
        if (i) {
            var w, o, d, f = l.stores;
            for (var r = 0, q = i.length; r < q; r++) {
                w = i[r];
                d = w[b];
                o = w[h];
                c = null;
                if (d != null) {
                    c = n(d);
                } else {
                    if (h) {
                        c = m(o);
                    }
                }
                if (c) {
                    v.applyChangesToRecord(c, w, f, g);
                } else {
                    v.ignoreUpdates++;
                    c = a(w);
                    v.ignoreUpdates--;
                    c.commit();
                }
            }
        }
        if (s && v.applyRemovals(g, s, {
            idProperty: h,
            findByIdFn: m,
            removeRecordFn: t
        })) {
            g.fireEvent("datachanged", g);
        }
    },
    applySyncResponse: function(c) {
        var b = this.syncApplySequence || this.stores;
        for (var d = 0, a = b.length; d < a; d++) {
            var e = c[b[d].storeId];
            if (e) {
                this.applyChangesToStore(b[d], e);
            }
        }
    },
    applyLoadResponse: function(a, b) {
        this.loadData(a, b);
    },
    applyResponse: function(a, b, c) {
        if (this.trackResponseType) {
            a = b.type || a;
        }
        switch (a) {
          case "load":
            this.applyLoadResponse(b, c);
            break;

          case "sync":
            this.applySyncResponse(b);
            break;
        }
    },
    getRequestId: function() {
        return Ext.Date.now();
    },
    onResponse: function(a, d, e, c) {
        this.activeRequests[a] = null;
        var b = this.decode(d);
        if (!b || !b.success) {
            this.fireEvent("requestfail", this, a, b, e);
            this.fireEvent(a + "fail", this, b, e, c);
            this.warn("CrudManager: " + a + " failed, please inspect the server response", d);
            return b;
        }
        if (this.fireEvent("beforeresponseapply", this, a, b) !== false && this.fireEvent("before" + a + "apply", this, b, c) !== false) {
            this.revision = b.revision;
            this.applyResponse(a, b, c);
            this.fireEvent("requestdone", this, a, b, e);
            this.fireEvent(a, this, b, e, c);
            if (!this.hasChanges()) {
                this.fireEvent("nochanges", this);
            }
        }
        return b;
    },
    onLoad: function(b, c, a) {
        return this.onResponse("load", b, c, a);
    },
    onSync: function(b, c, a) {
        return this.onResponse("sync", b, c, a);
    },
    load: function(e, a, d) {
        var b;
        if (typeof e === "object") {
            b = e;
            e = a;
            a = d;
            d = arguments[3];
        }
        var c = this.getLoadPackage(b);
        if (this.fireEvent("beforeload", this, c) !== false) {
            d = d || this;
            if (this.activeRequests.load) {
                this.cancelRequest(this.activeRequests.load.desc);
                this.fireEvent("loadcanceled", this, c);
            }
            this.activeRequests.load = {
                id: c.requestId
            };
            this.activeRequests.load.desc = this.sendRequest({
                data: this.encode(c),
                type: "load",
                success: function(g, h) {
                    var f = this.onLoad(g, h, b);
                    if (a && (!f || !f.success)) {
                        a.call(d, f, g, b);
                    } else {
                        if (e) {
                            e.call(d, f, g, b);
                        }
                    }
                },
                failure: function(f, g) {
                    this.onLoad(f, g);
                    if (a) {
                        a.apply(d, arguments);
                    }
                },
                scope: this
            });
        } else {
            this.fireEvent("loadcanceled", this, c);
        }
    },
    sync: function(d, a, c) {
        if (this.activeRequests.sync) {
            this.delayedSyncs.push(arguments);
            this.fireEvent("syncdelayed", this, arguments);
            return;
        }
        var b = this.getChangeSetPackage();
        c = c || this;
        if (!b) {
            if (d) {
                d.call(c, null, null);
            }
            return;
        }
        if (this.fireEvent("beforesync", this, b) === false) {
            this.fireEvent("synccanceled", this, b);
            return;
        }
        this.activeRequests.sync = {
            id: b.requestId
        };
        this.activeRequests.sync.desc = this.sendRequest({
            data: this.encode(b),
            type: "sync",
            success: function(h, f) {
                var g = this.activeRequests.sync;
                var e = this.onSync(h, f);
                if (a && (!e || !e.success)) {
                    a.call(c, e, h, g);
                } else {
                    if (d) {
                        d.call(c, e, h, g);
                    }
                }
                this.runDelayedSync();
            },
            failure: function(f, e) {
                this.onSync(f, e);
                if (a) {
                    a.apply(c, arguments);
                }
                this.runDelayedSync();
            },
            scope: this
        });
    },
    runDelayedSync: function() {
        var a = this.delayedSyncs.shift();
        if (!a) {
            return;
        }
        this.sync.apply(this, a);
    },
    commit: function() {
        for (var b = 0, a = this.stores.length; b < a; b++) {
            this.stores[b].store.commitChanges();
        }
    },
    reject: function() {
        for (var b = 0, a = this.stores.length; b < a; b++) {
            this.stores[b].store.rejectChanges();
        }
    },
    warn: function() {
        if ("console" in window) {
            var a = console;
            a.log && a.log.apply && a.log.apply(a, arguments);
        }
    },
    isLoading: function() {
        return !!this.activeRequests.load;
    }
});

Ext.define("Ext.ux.Scheduler2.app.CrudManagerDomain", {
    extend: Ext.app.EventDomain,
    singleton: true,
    type: "crudmanager",
    prefix: "crudmanager.",
    constructor: function() {
        var a = this;
        a.callParent();
        a.monitor(Ext.ux.Scheduler2.crud.AbstractManager);
    },
    match: function(d, b) {
        var a = false, c = d.alias;
        if (b === "*") {
            a = true;
        } else {
            if (c) {
                a = Ext.Array.indexOf(c, this.prefix + b) > -1;
            }
        }
        return a;
    }
});

Ext.define("Ext.ux.Scheduler2.column.Day", {
    extend: Ext.grid.column.Column,
    alias: "widget.weekview-day",
    align: "center",
    start: null,
    end: null,
    draggable: false,
    groupable: false,
    hideable: false,
    sortable: false,
    menuDisabled: true,
    enableLocking: false,
    flex: 1,
    resizable: false,
    tdCls: "sch2-timetd",
    initComponent: function() {
        var a = new Date();
        this.addCls("sch2-daycolumn-header");
        if (this.isWeekend()) {
            this.addCls("sch2-daycolumn-header-weekend");
            this.tdCls = (this.tdCls || "") + " sch2-daycolumn-weekend";
        }
        if (this.start.getDate() === a.getDate() && this.start.getMonth() === a.getMonth() && this.start.getYear() === a.getYear()) {
            this.addCls("sch2-daycolumn-header-today");
            this.tdCls = (this.tdCls || "") + " sch2-daycolumn-today";
        }
        this.callParent(arguments);
    },
    isWeekend: function() {
        var a = this.start.getDay();
        return a === 6 || a === 0;
    }
});

Ext.define("Ext.ux.Scheduler2.column.Resource", {
    extend: Ext.grid.Column,
    alias: "widget.resourcecolumn",
    align: "center",
    menuDisabled: true,
    hideable: false,
    sortable: false,
    locked: false,
    lockable: false,
    draggable: false,
    enableLocking: false,
    model: null,
    initComponent: function() {
        this.tdCls = (this.tdCls || "") + " sch2-timetd";
        this.cls = (this.cls || "") + " sch2-resourcecolumn-header";
        this.callParent(arguments);
    }
});

Ext.define("Ext.ux.Scheduler2.column.Summary", {
    extend: Ext.grid.column.Column,
    alias: [ "widget.summarycolumn" ],
    lockableScope: "top",
    showPercent: false,
    nbrDecimals: 1,
    sortable: false,
    fixed: true,
    menuDisabled: true,
    width: 80,
    dataIndex: "_sch_not_used",
    schedulerPanel: null,
    constructor: function(a) {
        this.scope = this;
        this.callParent(arguments);
        this.on("beforerender", this.onMyBeforeRender, this);
    },
    onMyBeforeRender: function() {
        this.schedulerPanel = this.up("tablepanel[lockable=true]");
    },
    getTimeAxis: function() {
        return this.schedulerPanel.getTimeAxis();
    },
    getEventStore: function() {
        return this.schedulerPanel.getEventStore();
    },
    renderer: function(j, a, g) {
        var h = this.getTimeAxis(), e = this.getEventStore(), f = h.getStart(), i = h.getEnd(), c = 0, b = this.calculate(e.getEventsForResource(g), f, i);
        if (b <= 0) {
            return "";
        }
        if (this.showPercent) {
            var d = Ext.ux.Scheduler2.util.Date.getDurationInMinutes(f, i);
            return Math.round(b * 100 / d) + " %";
        } else {
            if (b > 1440) {
                return (b / 1440).toFixed(this.nbrDecimals) + " " + Ext.ux.Scheduler2.util.Date.getShortNameOfUnit("DAY");
            }
            if (b >= 30) {
                return (b / 60).toFixed(this.nbrDecimals) + " " + Ext.ux.Scheduler2.util.Date.getShortNameOfUnit("HOUR");
            }
            return b + " " + Ext.ux.Scheduler2.util.Date.getShortNameOfUnit("MINUTE");
        }
    },
    calculate: function(c, g, d) {
        var e = 0, b, a, f = Ext.ux.Scheduler2.util.Date;
        Ext.Array.each(c, function(h) {
            b = h.getStartDate();
            a = h.getEndDate();
            if (f.intersectSpans(g, d, b, a)) {
                e += f.getDurationInMinutes(f.max(b, g), f.min(a, d));
            }
        });
        return e;
    }
});

Ext.define("Ext.ux.Scheduler2.view.HorizontalTimeAxis", {
    extend: Ext.util.Observable,
    trackHeaderOver: true,
    compactCellWidthThreshold: 15,
    baseCls: "sch2-column-header",
    tableCls: "sch2-header-row",
    headerHtmlRowTpl: '<table border="0" cellspacing="0" cellpadding="0" style="width: {totalWidth}px; {tstyle}" class="{{tableCls}} sch2-header-row-{position} {cls}"><thead><tr><tpl for="cells"><td class="{{baseCls}} {headerCls} sch2-header-cell-{align}" style="position : static; text-align: {align}; width: {width}px; {style}" tabIndex="0"headerPosition="{parent.position}" headerIndex="{[xindex-1]}"><div class="sch2-simple-timeheader">{header}</div></td></tpl></tr></thead></table>',
    model: null,
    hoverCls: "",
    containerEl: null,
    height: null,
    constructor: function(c) {
        var d = this;
        var a = !!Ext.versions.touch;
        Ext.apply(this, c);
        d.callParent(arguments);
        d.model.on("update", d.onModelUpdate, this, {
            priority: 5
        });
        d.containerEl = Ext.get(d.containerEl);
        if (!(d.headerHtmlRowTpl instanceof Ext.Template)) {
            d.headerHtmlRowTpl = d.headerHtmlRowTpl.replace("{{baseCls}}", this.baseCls).replace("{{tableCls}}", this.tableCls);
            d.headerHtmlRowTpl = new Ext.XTemplate(d.headerHtmlRowTpl);
        }
        if (d.trackHeaderOver && d.hoverCls) {
            d.containerEl.on({
                mousemove: d.highlightCell,
                delegate: ".sch2-column-header",
                scope: d
            });
            d.containerEl.on({
                mouseleave: d.clearHighlight,
                scope: d
            });
        }
        var b = {
            scope: this,
            delegate: ".sch2-column-header"
        };
        if (a) {
            b.tap = this.onElClick("tap");
            b.doubletap = this.onElClick("doubletap");
        } else {
            b.click = this.onElClick("click");
            b.dblclick = this.onElClick("dblclick");
            b.contextmenu = this.onElClick("contextmenu");
        }
        d._listenerCfg = b;
        if (d.containerEl) {
            d.containerEl.on(b);
        }
    },
    destroy: function() {
        var a = this;
        if (a.containerEl) {
            a.containerEl.un(a._listenerCfg);
            a.containerEl.un({
                mousemove: a.highlightCell,
                delegate: ".sch2-simple-timeheader",
                scope: a
            });
            a.containerEl.un({
                mouseleave: a.clearHighlight,
                scope: a
            });
        }
        a.model.un({
            update: a.onModelUpdate,
            scope: a
        });
    },
    onModelUpdate: function() {
        this.render();
    },
    getHTML: function(h, g, e) {
        var c = this.model.getColumnConfig();
        var b = this.model.getTotalWidth();
        var a = Ext.Object.getKeys(c).length;
        var f = this.height ? this.height / a : 0;
        var d = "";
        if (c.top) {
            this.embedCellWidths(c.top);
            d += this.headerHtmlRowTpl.apply({
                totalWidth: b,
                cells: c.top,
                position: "top",
                tstyle: "border-top : 0;" + (f ? "height:" + f + "px" : "")
            });
        }
        if (c.middle) {
            this.embedCellWidths(c.middle);
            d += this.headerHtmlRowTpl.apply({
                totalWidth: b,
                cells: c.middle,
                position: "middle",
                tstyle: (c.top ? "" : "border-top : 0;") + (f ? "height:" + f + "px" : ""),
                cls: !c.bottom && this.model.getTickWidth() <= this.compactCellWidthThreshold ? "sch2-header-row-compact" : ""
            });
        }
        if (c.bottom) {
            this.embedCellWidths(c.bottom);
            d += this.headerHtmlRowTpl.apply({
                totalWidth: b,
                cells: c.bottom,
                position: "bottom",
                tstyle: f ? "height:" + f + "px" : "",
                cls: this.model.getTickWidth() <= this.compactCellWidthThreshold ? "sch2-header-row-compact" : ""
            });
        }
        return d + '<div class="sch2-header-secondary-canvas"></div>';
    },
    render: function() {
        if (!this.containerEl) {
            return;
        }
        var e = this.containerEl, f = e.dom, d = f.style.display, a = this.model.getColumnConfig(), b = f.parentNode;
        f.style.display = "none";
        b.removeChild(f);
        var c = this.getHTML();
        f.innerHTML = c;
        if (!a.top && !a.middle) {
            this.containerEl.addCls("sch2-header-single-row");
        } else {
            this.containerEl.removeCls("sch2-header-single-row");
        }
        b && b.appendChild(f);
        f.style.display = d;
        this.fireEvent("refresh", this);
    },
    embedCellWidths: function(b) {
        var e = Ext.isIE7 || Ext.isSafari && !Ext.supports.Touch ? 1 : 0;
        for (var c = 0; c < b.length; c++) {
            var a = b[c];
            var d = this.model.getDistanceBetweenDates(a.start, a.end);
            if (d) {
                a.width = d - (c ? e : 0);
            } else {
                a.width = 0;
                a.style = "display: none";
            }
        }
    },
    onElClick: function(a) {
        return function(e, f) {
            f = e.delegatedTarget || f;
            var b = Ext.fly(f).getAttribute("headerPosition"), c = Ext.fly(f).getAttribute("headerIndex"), d = this.model.getColumnConfig()[b][c];
            this.fireEvent("timeheader" + a, this, d.start, d.end, e);
        };
    },
    highlightCell: function(c, a) {
        var b = this;
        if (a !== b.highlightedCell) {
            b.clearHighlight();
            b.highlightedCell = a;
            Ext.fly(a).addCls(b.hoverCls);
        }
    },
    clearHighlight: function() {
        var b = this, a = b.highlightedCell;
        if (a) {
            Ext.fly(a).removeCls(b.hoverCls);
            delete b.highlightedCell;
        }
    }
});

Ext.define("Ext.ux.Scheduler2.column.timeAxis.Horizontal", {
    extend: Ext.grid.column.Column,
    alias: "widget.timeaxiscolumn",
    draggable: false,
    groupable: false,
    hideable: false,
    sortable: false,
    resizable: false,
    menuDisabled: true,
    cls: "sch2-simple-timeaxis",
    tdCls: "sch2-timetd",
    enableLocking: false,
    timeAxisViewModel: null,
    headerView: null,
    hoverCls: "",
    ownHoverCls: "sch2-column-header-over",
    trackHeaderOver: true,
    compactCellWidthThreshold: Ext.theme && Ext.theme.name.toLowerCase() === "classic" ? 15 : 35,
    afterRender: function() {
        var b = this;
        var a = b.titleEl.createChild({
            cls: "sch2-horizontaltimeaxis-ct"
        });
        b.headerView = new Ext.ux.Scheduler2.view.HorizontalTimeAxis({
            model: b.timeAxisViewModel,
            containerEl: a,
            hoverCls: b.ownHoverCls,
            trackHeaderOver: b.trackHeaderOver,
            compactCellWidthThreshold: b.compactCellWidthThreshold
        });
        b.headerView.on("refresh", b.onTimeAxisViewRefresh, b);
        b.ownerCt.on("afterlayout", function() {
            if (!b.ownerCt) {
                return;
            }
            b.mon(b.ownerCt, "resize", b.onHeaderContainerResize, b);
            if (this.getWidth() > 0) {
                if (b.getAvailableWidthForSchedule() === b.timeAxisViewModel.getAvailableWidth()) {
                    b.headerView.render();
                } else {
                    b.timeAxisViewModel.update(b.getAvailableWidthForSchedule());
                }
                b.setWidth(b.timeAxisViewModel.getTotalWidth());
            }
        }, null, {
            single: true
        });
        this.enableBubble("timeheaderclick", "timeheaderdblclick", "timeheadercontextmenu");
        b.relayEvents(b.headerView, [ "timeheaderclick", "timeheaderdblclick", "timeheadercontextmenu" ]);
        b.callParent(arguments);
        b.focusable = false;
    },
    initRenderData: function() {
        var a = this;
        a.renderData.headerCls = a.renderData.headerCls || a.headerCls;
        return a.callParent(arguments);
    },
    destroy: function() {
        if (this.headerView) {
            this.headerView.destroy();
        }
        this.callParent(arguments);
    },
    onTimeAxisViewRefresh: function() {
        this.headerView.un("refresh", this.onTimeAxisViewRefresh, this);
        this.setWidth(this.timeAxisViewModel.getTotalWidth());
        this.headerView.on("refresh", this.onTimeAxisViewRefresh, this);
    },
    getAvailableWidthForSchedule: function() {
        var d = this.ownerCt.isVisible(true) ? this.ownerCt.getWidth() : this.ownerCt.lastBox && this.ownerCt.lastBox.width || 0, a = this.ownerCt.items, c;
        for (var b = 1; b < a.length; b++) {
            c = a.get(b);
            if (!c.hidden) {
                d -= c.isVisible(true) ? c.getWidth() : c.lastBox && c.lastBox.width || 0;
            }
        }
        return d - Ext.getScrollbarSize().width - 1;
    },
    onResize: function() {
        this.callParent(arguments);
        this.timeAxisViewModel.setAvailableWidth(this.getAvailableWidthForSchedule());
    },
    onHeaderContainerResize: function() {
        this.timeAxisViewModel.setAvailableWidth(this.getAvailableWidthForSchedule());
        this.headerView.render();
    },
    refresh: function() {
        this.timeAxisViewModel.update(null, true);
        this.headerView.render();
    }
});

Ext.define("Ext.ux.Scheduler2.column.timeAxis.Vertical", {
    extend: Ext.grid.column.Column,
    alias: "widget.verticaltimeaxis",
    align: "right",
    draggable: false,
    groupable: false,
    hideable: false,
    sortable: false,
    menuDisabled: true,
    timeAxis: null,
    timeAxisViewModel: null,
    cellTopBorderWidth: null,
    cellBottomBorderWidth: null,
    totalBorderWidth: null,
    enableLocking: false,
    locked: true,
    flex: 1,
    initComponent: function() {
        this.callParent(arguments);
        this.tdCls = (this.tdCls || "") + " sch2-verticaltimeaxis-cell";
        this.scope = this;
        this.totalBorderWidth = this.cellTopBorderWidth + this.cellBottomBorderWidth;
    },
    afterRender: function() {
        this.callParent(arguments);
        var a = this.up("panel");
        a.getView().on("resize", this.onContainerResize, this);
    },
    onContainerResize: function(c, b, a) {
        this.timeAxisViewModel.update(a - 21);
    },
    renderer: function(d, b, a, e) {
        var c = this.timeAxisViewModel.getBottomHeader();
        b.style = "height:" + (this.timeAxisViewModel.getTickWidth() - this.totalBorderWidth) + "px";
        if (c.renderer) {
            return c.renderer.call(c.scope || this, a.data.start, a.data.end, b, e);
        } else {
            return Ext.Date.format(a.data.start, c.dateFormat);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.crud.encoder.Json", {
    format: "json",
    encode: function(a) {
        return Ext.JSON.encode(a);
    },
    decode: function(a) {
        if (typeof a == "object") {
            return a;
        }
        return Ext.JSON.decode(a, true);
    }
});

Ext.define("Ext.ux.Scheduler2.crud.encoder.Xml", {
    format: "xml",
    stringReplaces: [ [ /&/g, "&amp;" ], [ /</g, "&lt;" ], [ />/g, "&gt;" ], [ /"/g, "&quot;" ] ],
    encodeString: function(e) {
        if (!e) {
            return e;
        }
        var a = e.toString(), c = this.stringReplaces;
        for (var d = 0, b = c.length; d < b; d++) {
            a = a.replace(c[d][0], c[d][1]);
        }
        return a;
    },
    encodeRecords: function(c) {
        var a = "";
        for (var d = 0, b = c.length; d < b; d++) {
            a += this.encodeRecord(c[d]);
        }
        return a;
    },
    encodeRecord: function(b) {
        var a = "<record>";
        for (var c in b) {
            var d = b[c];
            a += '<field id="' + this.encodeString(c) + '">' + (d && d.$store ? this.encodeStoreChanges({
                storeId: c
            }, d) : this.encodeString(d)) + "</field>";
        }
        a += "</record>";
        return a;
    },
    encodeStoreChanges: function(b, c) {
        var a = '<store id="' + this.encodeString(b.storeId) + '">';
        if (c.added) {
            a += "<added>" + this.encodeRecords(c.added) + "</added>";
        }
        if (c.updated) {
            a += "<updated>" + this.encodeRecords(c.updated) + "</updated>";
        }
        if (c.removed) {
            a += "<removed>" + this.encodeRecords(c.removed) + "</removed>";
        }
        a += "</store>";
        return a;
    },
    encode: function(e) {
        var a, d, b, c;
        switch (e.type) {
          case "load":
            a = '<load requestId="' + this.encodeString(e.requestId) + '">';
            for (d = 0, b = e.stores.length; d < b; d++) {
                c = e.stores[d];
                if (typeof c === "string") {
                    a += '<store id="' + this.encodeString(c) + '"/>';
                } else {
                    a += '<store id="' + this.encodeString(c.storeId) + '" page="' + this.encodeString(c.page) + '" pageSize="' + this.encodeString(c.pageSize) + '"/>';
                }
            }
            a += "</load>";
            return a;

          case "sync":
            a = '<sync requestId="' + this.encodeString(e.requestId) + '" revision="' + this.encodeString(e.revision) + '">';
            for (d in e) {
                if (e.hasOwnProperty(d)) {
                    c = this.getStore(d);
                    if (c) {
                        a += this.encodeStoreChanges(c, e[d]);
                    }
                }
            }
            a += "</sync>";
            break;
        }
        return a;
    },
    stringToXML: function(b) {
        if (!b) {
            return;
        }
        var a;
        if (window.DOMParser) {
            a = new DOMParser().parseFromString(b, "text/xml");
        } else {
            if (window.ActiveXObject) {
                a = new ActiveXObject("Microsoft.XMLDOM");
                a.async = false;
                a.loadXML(b);
            }
        }
        return a;
    },
    decodeRecords: function(d) {
        var b = [];
        for (var c = 0, a = d.length; c < a; c++) {
            b.push(this.decodeRecord(d[c]));
        }
        return b;
    },
    decodeRecord: function(f) {
        var b = f.childNodes, a = {}, g;
        for (var e = 0, c = b.length; e < c; e++) {
            var h = b[e];
            if (h.nodeName == "field") {
                g = "";
                if (h.firstChild) {
                    var d = this.getElementByTagName(h, "store");
                    g = d ? this.decodeStore(d) : h.firstChild.nodeValue;
                }
                a[h.getAttribute("id")] = g;
            }
        }
        return a;
    },
    getElementsByTagName: function(f, c) {
        var e = f.childNodes, b = [];
        for (var d = 0, a = e.length; d < a; d++) {
            if (e[d].nodeName == c) {
                b.push(e[d]);
            }
        }
        return b;
    },
    getElementByTagName: function(e, b) {
        var d = e.childNodes;
        for (var c = 0, a = d.length; c < a; c++) {
            if (d[c].nodeName == b) {
                return d[c];
            }
        }
    },
    decodeStore: function(a) {
        var d = {}, c = this.getElementsByTagName(a, "rows");
        if (c.length) {
            d.rows = this.decodeRecords(this.getElementsByTagName(c[0], "record"));
            var b = parseInt(c[0].getAttribute("total"), 10);
            if (isNaN(b) || b < d.rows.length) {
                b = d.rows.length;
            }
            d.total = b;
        }
        var e = this.getElementByTagName(a, "removed");
        if (e) {
            d.removed = this.decodeRecords(this.getElementsByTagName(e, "record"));
        }
        return d;
    },
    decode: function(a) {
        var d = typeof a == "string" ? this.stringToXML(a) : a;
        if (!d) {
            return;
        }
        var k = {}, e = d.documentElement, g = e.getElementsByTagName("store"), f, h;
        k.requestId = e.getAttribute("requestId");
        k.revision = e.getAttribute("revision");
        k.success = e.getAttribute("success") || "false";
        k.success = k.success.toLowerCase() == "true";
        if (!k.success) {
            k.code = e.getAttribute("code");
            var j = e.getElementsByTagName("message")[0];
            k.message = j && j.firstChild && j.firstChild.nodeValue;
        }
        for (var c = 0, b = g.length; c < b; c++) {
            f = g[c];
            h = f.getAttribute("id");
            if (this.getStore(h)) {
                k[h] = this.decodeStore(f);
            }
        }
        return k;
    }
});

Ext.define("Ext.ux.Scheduler2.crud.transport.Ajax", {
    defaultMethod: {
        load: "GET",
        sync: "POST"
    },
    cancelRequest: function(a) {
        Ext.Ajax.abort(a);
    },
    sendRequest: function(b) {
        var c = b.data, d = this.transport[b.type], e = d.paramName, f = Ext.apply({}, d && d.params), g = d.method || this.defaultMethod[b.type];
        var a = Ext.apply({
            url: d.url,
            method: g,
            params: f,
            failure: b.failure,
            success: function(h, i) {
                if (b.success) {
                    b.success.call(b.scope || this, h.responseXml || h.responseText);
                }
            },
            scope: b.scope
        }, d.requestConfig);
        if (!e) {
            if (this.format === "xml") {
                Ext.apply(a, {
                    xmlData: c
                });
            } else {
                Ext.apply(a, {
                    jsonData: c
                });
            }
        } else {
            a.params = a.params || {};
            a.params[e] = c;
        }
        this.fireEvent("beforesend", this, f, b.type, a);
        return Ext.Ajax.request(a);
    }
});

Ext.define("Ext.ux.Scheduler2.data.mixin.UniversalModelGetter", {
    getModelById: function(b) {
        var a = this;
        return a.getNodeById ? a.getNodeById(b) : a.getById(b);
    },
    getModelByInternalId: function(b) {
        var a = this;
        return a.byInternalIdMap ? a.byInternalIdMap[b] : a.getByInternalId(b);
    }
});

Ext.define("Ext.ux.Scheduler2.data.mixin.CacheHintHelper", {
    extend: Ext.Mixin,
    mixinConfig: {
        before: {
            loadRecords: "loadRecords",
            removeAll: "removeAll"
        }
    },
    loadRecords: function() {
        this.fireEvent("cacheresethint", this);
    },
    removeAll: function(a) {
        if (a) {
            this.fireEvent("cacheresethint", this);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.data.undoredo.mixin.StoreHint", {
    extend: Ext.Mixin,
    undoRedoPostponed: null,
    inUndoRedoTransaction: false,
    undoRedoEventBus: null,
    mixinConfig: {
        before: {
            constructor: "constructor",
            destroy: "destroy",
            fireEventArgs: "fireEventArgs",
            setRoot: "beforeSetRoot",
            fillNode: "beforeFillNode"
        },
        after: {
            setRoot: "afterSetRoot",
            fillNode: "afterFillNode"
        }
    },
    constructor: function() {
        var a = this;
        a.undoRedoEventBus = new Ext.util.Observable();
        a.callParent(arguments);
    },
    destroy: function() {
        Ext.destroy(this.undoRedoEventBus);
    },
    fireEventArgs: function(a, b) {
        var c = this;
        if (!b.hasOwnProperty("$undoRedoEventBusFired")) {
            b.$undoRedoEventBusFired = {};
        }
        if (!b.$undoRedoEventBusFired[a]) {
            b.$undoRedoEventBusFired[a] = true;
            c.undoRedoEventBus.hasListener(a) && c.undoRedoEventBus.fireEventArgs(a, b);
        }
    },
    isInUndoRedoTransaction: function() {
        return this.inUndoRedoTransaction;
    },
    onUndoRedoTransactionStart: function(a, b) {
        this.inUndoRedoTransaction = true;
    },
    onUndoRedoTransactionEnd: function(a, b) {
        this.inUndoRedoTransaction = false;
    },
    isUndoingOrRedoing: function() {
        return !!this.undoRedoPostponed;
    },
    beforeUndoRedo: function(a) {
        this.undoRedoPostponed = [];
    },
    afterUndoRedo: function(a) {
        var b = this;
        Ext.Array.forEach(b.undoRedoPostponed, function(c) {
            c();
        });
        b.undoRedoPostponed = null;
    },
    postponeAfterUndoRedo: function(a) {
        Ext.Assert && Ext.Assert.isFunction(a, "Parameter must be a function");
        this.undoRedoPostponed.push(a);
    },
    beforeSetRoot: function() {
        this.__isSettingRoot = true;
    },
    afterSetRoot: function() {
        this.__isSettingRoot = false;
        if (!this.getRoot()) {
            this.fireEvent("clear", this);
        }
    },
    beforeFillNode: function(a) {
        if (a.isRoot()) {
            this.beforeSetRoot();
        }
    },
    afterFillNode: function(a) {
        if (a.isRoot()) {
            this.afterSetRoot();
        }
    },
    isRootSettingOrLoading: function() {
        return this.isLoading() || this.isTreeStore && this.__isSettingRoot;
    }
});

Ext.define("Ext.ux.Scheduler2.model.Customizable", {
    extend: Ext.data.Model,
    customizableFields: null,
    previous: null,
    __editing: null,
    __editCounter: 0,
    constructor: function() {
        var a = this.callParent(arguments);
        return a;
    },
    onClassExtended: function(b, d, a) {
        var c = a.onBeforeCreated;
        a.onBeforeCreated = function(n, i) {
            c.apply(this, arguments);
            var j = n.prototype;
            if (!j.customizableFields) {
                return;
            }
            j.customizableFields = (n.superclass.customizableFields || []).concat(j.customizableFields);
            var g = j.customizableFields;
            var h = {};
            var l = this;
            var f = Ext.Array.findBy(n.fields, function(o) {
                return o.name === j.idProperty;
            });
            l.idField = j.idField = f;
            if (!n.fieldsMap[j.idProperty]) {
                n.fieldsMap[j.idProperty] = f;
            }
            Ext.Array.each(g, function(o) {
                if (typeof o == "string") {
                    o = {
                        name: o
                    };
                }
                h[o.name] = o;
            });
            var k = j.fields;
            var m = [];
            var e = [];
            Ext.Array.each(k, function(o) {
                if (o.isCustomizableField) {
                    e.push(o.getName());
                }
            });
            if (j.idProperty !== "id" && j.getField("id")) {
                if (!j.getField("id").hasOwnProperty("name")) {
                    e.push("id");
                }
            }
            if (j.idProperty !== "Id" && j.getField("Id")) {
                if (!j.getField("Id").hasOwnProperty("name")) {
                    e.push("Id");
                }
            }
            n.removeFields(e);
            Ext.Object.each(h, function(o, r) {
                r.isCustomizableField = true;
                var s = r.name || r.getName();
                var x = s === "Id" ? "idProperty" : s.charAt(0).toLowerCase() + s.substr(1) + "Field";
                var t = j[x];
                var w = t || s;
                var v;
                if (j.getField(w)) {
                    v = Ext.applyIf({
                        name: s,
                        isCustomizableField: true
                    }, j.getField(w));
                    j.getField(w).isCustomizableField = true;
                    v = Ext.create("data.field." + (v.type || "auto"), v);
                    g.push(v);
                } else {
                    v = Ext.applyIf({
                        name: w,
                        isCustomizableField: true
                    }, r);
                    v = Ext.create("data.field." + (v.type || "auto"), v);
                    m.push(v);
                }
                var q = Ext.String.capitalize(s);
                if (q != "Id") {
                    var u = "get" + q;
                    var p = "set" + q;
                    if (!j[u] || j[u].__getterFor__ && j[u].__getterFor__ != w) {
                        j[u] = function() {
                            return this.get(w);
                        };
                        j[u].__getterFor__ = w;
                    }
                    if (!j[p] || j[p].__setterFor__ && j[p].__setterFor__ != w) {
                        j[p] = function(y) {
                            return this.set(w, y);
                        };
                        j[p].__setterFor__ = w;
                    }
                }
            });
            n.addFields(m);
        };
    },
    set: function(f, b) {
        var a;
        var d;
        this.previous = this.previous || {};
        if (typeof f === "string") {
            a = this.get(f);
            if (a instanceof Date && !(b instanceof Date)) {
                b = this.getField(f).convert(b, this);
            }
            if (a instanceof Date && a - b || !(a instanceof Date) && a !== b) {
                this.previous[f] = a;
            } else {
                return [];
            }
        } else {
            for (var e in f) {
                a = this.get(e);
                var c = f[e];
                if (a instanceof Date && !(c instanceof Date)) {
                    c = this.getField(e).convert(c, this);
                }
                if (a instanceof Date && a - c || !(a instanceof Date) && a !== c) {
                    this.previous[e] = a;
                }
            }
        }
        d = this.callParent(arguments);
        if (!this.__editing) {
            delete this.previous;
        }
        return d;
    },
    reject: function() {
        var b = this, a = b.modified || {}, c;
        b.__editing = true;
        b.previous = b.previous || {};
        for (c in a) {
            if (a.hasOwnProperty(c)) {
                if (typeof a[c] != "function") {
                    b.previous[c] = b.get(c);
                }
            }
        }
        b.callParent(arguments);
        delete b.previous;
        b.__editing = false;
    },
    beginEdit: function() {
        this.__editCounter++;
        this.__editing = true;
        this.callParent(arguments);
    },
    cancelEdit: function() {
        this.__editCounter = 0;
        this.__editing = false;
        this.callParent(arguments);
        delete this.previous;
    },
    endEdit: function(b, c) {
        if (--this.__editCounter === 0) {
            if (!b && this.getModifiedFieldNames) {
                var a = this.editMemento;
                if (!c) {
                    c = this.getModifiedFieldNames(a.data);
                }
                if (c && c.length === 0) {
                    b = true;
                }
            }
            this.callParent([ b ].concat(Array.prototype.slice.call(arguments, 1)));
            this.__editing = false;
            delete this.previous;
        }
    }
});

Ext.define("Ext.ux.Scheduler2.model.Assignment", {
    extend: Ext.ux.Scheduler2.model.Customizable,
    idProperty: "Id",
    customizableFields: [ {
        name: "ResourceId"
    }, {
        name: "EventId"
    } ],
    resourceIdField: "ResourceId",
    eventIdField: "EventId",
    getInternalId: function() {
        return this.internalId;
    },
    getAssignmentStore: function() {
        return this.joined && this.joined[0];
    },
    getEventStore: function() {
        var a = this.getAssignmentStore();
        return a && a.getEventStore();
    },
    getResourceStore: function() {
        var a = this.getEventStore();
        return a && a.getResourceStore();
    },
    getEvent: function(a) {
        var b = this;
        a = a || b.getEventStore();
        return a && a.getModelById(b.getEventId());
    },
    getResource: function(b) {
        var a = this;
        b = b || a.getResourceStore();
        return b && b.getModelById(a.getResourceId());
    },
    getEventName: function(a) {
        var b = this.getEvent(a);
        return b && b.getName() || "";
    },
    getResourceName: function(a) {
        var b = this.getResource(a);
        return b && b.getName() || "";
    },
    isPersistable: function() {
        var b = this, a = b.getEvent(), c = b.getResource();
        return a && !a.phantom && c && !c.phantom;
    },
    fullCopy: function() {
        return this.copy.apply(this, arguments);
    }
});

Ext.define("Ext.ux.Scheduler2.locale.Locale", {
    l10n: null,
    legacyMode: true,
    localeName: null,
    namespaceId: null,
    constructor: function() {
        if (!Ext.ux.Scheduler2.locale.Active) {
            Ext.ux.Scheduler2.locale.Active = {};
            this.bindRequire();
        }
        var b = this.self.getName().split(".");
        var a = this.localeName = b.pop();
        this.namespaceId = b.join(".");
        var c = Ext.ux.Scheduler2.locale.Active[this.namespaceId];
        if (!(a == "En" && c && c.localeName != "En")) {
            this.apply();
        }
    },
    bindRequire: function() {
        var a = Ext.ClassManager.triggerCreated;
        Ext.ClassManager.triggerCreated = function(d) {
            a.apply(this, arguments);
            if (d) {
                var c = Ext.ClassManager.get(d);
                for (var b in Ext.ux.Scheduler2.locale.Active) {
                    Ext.ux.Scheduler2.locale.Active[b].apply(c);
                }
            }
        };
    },
    applyToClass: function(c, b) {
        var d = this, g = d.self.getName();
        b = b || Ext.ClassManager.get(c);
        if (b && b.activeLocaleId !== g) {
            var a = d.l10n[c];
            if (typeof a === "function") {
                a(c);
            } else {
                if (b.singleton) {
                    b.l10n = Ext.apply({}, a, b.prototype && b.prototype.l10n);
                } else {
                    Ext.override(b, {
                        l10n: a
                    });
                }
            }
            if (d.legacyMode) {
                var f;
                if (b.prototype) {
                    f = b.prototype;
                } else {
                    if (b.singleton) {
                        f = b;
                    }
                }
                if (f && f.legacyMode) {
                    if (f.legacyHolderProp) {
                        if (!f[f.legacyHolderProp]) {
                            f[f.legacyHolderProp] = {};
                        }
                        f = f[f.legacyHolderProp];
                    }
                    for (var e in a) {
                        if (typeof f[e] !== "function") {
                            f[e] = a[e];
                        }
                    }
                }
            }
            b.activeLocaleId = g;
            if (b.onLocalized) {
                b.onLocalized();
            }
        }
    },
    apply: function(g) {
        if (this.l10n) {
            var f = this;
            if (g) {
                if (!Ext.isArray(g)) {
                    g = [ g ];
                }
                var c, b;
                for (var d = 0, a = g.length; d < a; d++) {
                    if (Ext.isObject(g[d])) {
                        if (g[d].singleton) {
                            b = g[d];
                            c = Ext.getClassName(Ext.getClass(b));
                        } else {
                            b = Ext.getClass(g[d]);
                            c = Ext.getClassName(b);
                        }
                    } else {
                        b = null;
                        c = "string" === typeof g[d] ? g[d] : Ext.getClassName(g[d]);
                    }
                    if (c) {
                        if (c in this.l10n) {
                            f.applyToClass(c, b);
                        }
                    }
                }
            } else {
                Ext.ux.Scheduler2.locale.Active[this.namespaceId] = this;
                for (var e in this.l10n) {
                    f.applyToClass(e);
                }
            }
        }
    }
});

Ext.define("Ext.ux.Scheduler2.locale.En", {
    extend: Ext.ux.Scheduler2.locale.Locale,
    singleton: true,
    constructor: function(a) {
        Ext.apply(this, {
            l10n: {
                "Ext.ux.Scheduler2.util.Date": {
                    unitNames: {
                        YEAR: {
                            single: "year",
                            plural: "years",
                            abbrev: "yr"
                        },
                        QUARTER: {
                            single: "quarter",
                            plural: "quarters",
                            abbrev: "q"
                        },
                        MONTH: {
                            single: "month",
                            plural: "months",
                            abbrev: "mon"
                        },
                        WEEK: {
                            single: "week",
                            plural: "weeks",
                            abbrev: "w"
                        },
                        DAY: {
                            single: "day",
                            plural: "days",
                            abbrev: "d"
                        },
                        HOUR: {
                            single: "hour",
                            plural: "hours",
                            abbrev: "h"
                        },
                        MINUTE: {
                            single: "minute",
                            plural: "minutes",
                            abbrev: "min"
                        },
                        SECOND: {
                            single: "second",
                            plural: "seconds",
                            abbrev: "s"
                        },
                        MILLI: {
                            single: "ms",
                            plural: "ms",
                            abbrev: "ms"
                        }
                    }
                },
                "Ext.ux.Scheduler2.panel.TimelineGridPanel": {
                    weekStartDay: 1,
                    loadingText: "Loading, please wait...",
                    savingText: "Saving changes, please wait..."
                },
                "Ext.ux.Scheduler2.panel.TimelineTreePanel": {
                    weekStartDay: 1,
                    loadingText: "Loading, please wait...",
                    savingText: "Saving changes, please wait..."
                },
                "Ext.ux.Scheduler2.mixin.SchedulerView": {
                    loadingText: "Loading events..."
                },
                "Ext.ux.Scheduler2.plugin.CurrentTimeLine": {
                    tooltipText: "Current time"
                },
                "Ext.ux.Scheduler2.plugin.EventEditor": {
                    saveText: "Save",
                    deleteText: "Delete",
                    cancelText: "Cancel"
                },
                "Ext.ux.Scheduler2.plugin.SimpleEditor": {
                    newEventText: "New booking..."
                },
                "Ext.ux.Scheduler2.widget.ExportDialog": {
                    generalError: "An error occured, try again.",
                    title: "Export Settings",
                    formatFieldLabel: "Paper format",
                    orientationFieldLabel: "Orientation",
                    rangeFieldLabel: "Export range",
                    showHeaderLabel: "Add page number",
                    showFooterLabel: "Add footer",
                    orientationPortraitText: "Portrait",
                    orientationLandscapeText: "Landscape",
                    completeViewText: "Complete schedule",
                    currentViewText: "Current view",
                    dateRangeText: "Date range",
                    dateRangeFromText: "Export from",
                    pickerText: "Resize column/rows to desired value",
                    dateRangeToText: "Export to",
                    exportButtonText: "Export",
                    cancelButtonText: "Cancel",
                    progressBarText: "Exporting...",
                    exportersFieldLabel: "Export mode",
                    adjustCols: "Adjust column width",
                    adjustColsAndRows: "Adjust column width and row height",
                    specifyDateRange: "Specify date range",
                    columnPickerLabel: "Select columns",
                    dpiFieldLabel: "DPI (dots per inch)"
                },
                "Ext.ux.Scheduler2.plugin.Export": {
                    fetchingRows: "Fetching row {0} of {1}",
                    builtPage: "Built page {0} of {1}",
                    requestingPrintServer: "Please wait..."
                },
                "Ext.ux.Scheduler2.plugin.Printable": {
                    dialogTitle: "Print settings",
                    rangeFieldLabel: "Print range",
                    exportersFieldLabel: "Control pagination",
                    exportButtonText: "Print"
                },
                "Ext.ux.Scheduler2.plugin.exporter.AbstractExporter": {
                    name: "Exporter"
                },
                "Ext.ux.Scheduler2.plugin.exporter.SinglePage": {
                    name: "Single page"
                },
                "Ext.ux.Scheduler2.plugin.exporter.MultiPageVertical": {
                    name: "Multiple pages (vertically)"
                },
                "Ext.ux.Scheduler2.plugin.exporter.MultiPage": {
                    name: "Multiple pages"
                },
                "Ext.ux.Scheduler2.preset.Manager": {
                    hourAndDay: {
                        displayDateFormat: "G:i",
                        middleDateFormat: "G:i",
                        topDateFormat: "D d/m"
                    },
                    secondAndMinute: {
                        displayDateFormat: "g:i:s",
                        topDateFormat: "D, d g:iA"
                    },
                    dayAndWeek: {
                        displayDateFormat: "m/d h:i A",
                        middleDateFormat: "D d M"
                    },
                    weekAndDay: {
                        displayDateFormat: "m/d",
                        bottomDateFormat: "d M",
                        middleDateFormat: "Y F d"
                    },
                    weekAndMonth: {
                        displayDateFormat: "m/d/Y",
                        middleDateFormat: "m/d",
                        topDateFormat: "m/d/Y"
                    },
                    weekAndDayLetter: {
                        displayDateFormat: "m/d/Y",
                        middleDateFormat: "D d M Y"
                    },
                    weekDateAndMonth: {
                        displayDateFormat: "m/d/Y",
                        middleDateFormat: "d",
                        topDateFormat: "Y F"
                    },
                    monthAndYear: {
                        displayDateFormat: "m/d/Y",
                        middleDateFormat: "M Y",
                        topDateFormat: "Y"
                    },
                    year: {
                        displayDateFormat: "m/d/Y",
                        middleDateFormat: "Y"
                    },
                    manyYears: {
                        displayDateFormat: "m/d/Y",
                        middleDateFormat: "Y"
                    }
                }
            }
        });
        this.callParent(arguments);
    }
});

Ext.define("Ext.ux.Scheduler2.mixin.Localizable", {
    legacyMode: false,
    activeLocaleId: "",
    l10n: null,
    isLocaleApplied: function() {
        var b = this.singleton && this.activeLocaleId || this.self.activeLocaleId;
        if (!b) {
            return false;
        }
        for (var a in Ext.ux.Scheduler2.locale.Active) {
            if (b === Ext.ux.Scheduler2.locale.Active[a].self.getName()) {
                return true;
            }
        }
        return false;
    },
    applyLocale: function() {
        for (var a in Ext.ux.Scheduler2.locale.Active) {
            Ext.ux.Scheduler2.locale.Active[a].apply(this.singleton ? this : this.self.getName());
        }
    },
    L: function() {
        return this.localize.apply(this, arguments);
    },
    localize: function(b, d, g) {
        if (!this.isLocaleApplied() && !g) {
            this.applyLocale();
        }
        if (this.hasOwnProperty("l10n") && this.l10n.hasOwnProperty(b) && "function" != typeof this.l10n[b]) {
            return this.l10n[b];
        }
        var c = this.self && this.self.prototype;
        if (this.legacyMode) {
            var a = d || this.legacyHolderProp;
            var h = a ? this[a] : this;
            if (h && h.hasOwnProperty(b) && "function" != typeof h[b]) {
                return h[b];
            }
            if (c) {
                var e = a ? c[a] : c;
                if (e && e.hasOwnProperty(b) && "function" != typeof e[b]) {
                    return e[b];
                }
            }
        }
        var i = c.l10n && c.l10n[b];
        if (i === null || i === undefined) {
            var f = c && c.superclass;
            if (f && f.localize) {
                i = f.localize(b, d, g);
            }
            if (i === null || i === undefined) {
                throw "Cannot find locale: " + b + " [" + this.self.getName() + "]";
            }
        }
        return i;
    }
});

Ext.define("Ext.ux.Scheduler2.util.Date", {
    mixins: [ Ext.ux.Scheduler2.mixin.Localizable ],
    singleton: true,
    stripEscapeRe: /(\\.)/g,
    hourInfoRe: /([gGhHisucUOPZ]|MS)/,
    unitHash: null,
    unitsByName: {},
    constructor: function() {
        var a = Ext.Date;
        var c = this.unitHash = {
            MILLI: a.MILLI,
            SECOND: a.SECOND,
            MINUTE: a.MINUTE,
            HOUR: a.HOUR,
            DAY: a.DAY,
            WEEK: "w",
            MONTH: a.MONTH,
            QUARTER: "q",
            YEAR: a.YEAR
        };
        Ext.apply(this, c);
        var b = this;
        this.units = [ b.MILLI, b.SECOND, b.MINUTE, b.HOUR, b.DAY, b.WEEK, b.MONTH, b.QUARTER, b.YEAR ];
    },
    onLocalized: function() {
        this.setUnitNames(this.L("unitNames"));
    },
    setUnitNames: function(e) {
        var d = this.unitsByName = {};
        this.l10n.unitNames = e;
        this._unitNames = Ext.apply({}, e);
        var b = this.unitHash;
        for (var a in b) {
            if (b.hasOwnProperty(a)) {
                var c = b[a];
                this._unitNames[c] = this._unitNames[a];
                d[a] = c;
                d[c] = c;
            }
        }
    },
    betweenLesser: function(b, d, a) {
        var c = b.getTime();
        return d.getTime() <= c && c < a.getTime();
    },
    constrain: function(b, c, a) {
        return this.min(this.max(b, c), a);
    },
    compareUnits: function(c, b) {
        var a = Ext.Array.indexOf(this.units, c), d = Ext.Array.indexOf(this.units, b);
        return a > d ? 1 : a < d ? -1 : 0;
    },
    isUnitGreater: function(b, a) {
        return this.compareUnits(b, a) > 0;
    },
    copyTimeValues: function(b, a) {
        b.setHours(a.getHours());
        b.setMinutes(a.getMinutes());
        b.setSeconds(a.getSeconds());
        b.setMilliseconds(a.getMilliseconds());
    },
    add: function(b, c, e) {
        var f = Ext.Date.clone(b);
        if (!c || e === 0) {
            return f;
        }
        switch (c.toLowerCase()) {
          case this.MILLI:
            f = new Date(b.getTime() + e);
            break;

          case this.SECOND:
            f = new Date(b.getTime() + e * 1e3);
            break;

          case this.MINUTE:
            f = new Date(b.getTime() + e * 6e4);
            break;

          case this.HOUR:
            f = new Date(b.getTime() + e * 36e5);
            break;

          case this.DAY:
            f.setDate(b.getDate() + e);
            if (f.getHours() === 23 && b.getHours() === 0) {
                f = Ext.Date.add(f, Ext.Date.HOUR, 1);
            }
            break;

          case this.WEEK:
            f.setDate(b.getDate() + e * 7);
            break;

          case this.MONTH:
            var a = b.getDate();
            if (a > 28) {
                a = Math.min(a, Ext.Date.getLastDateOfMonth(this.add(Ext.Date.getFirstDateOfMonth(b), this.MONTH, e)).getDate());
            }
            f.setDate(a);
            f.setMonth(f.getMonth() + e);
            break;

          case this.QUARTER:
            f = this.add(b, this.MONTH, e * 3);
            break;

          case this.YEAR:
            f.setFullYear(b.getFullYear() + e);
            break;
        }
        return f;
    },
    getUnitDurationInMs: function(a) {
        return this.add(new Date(1, 0, 1), a, 1) - new Date(1, 0, 1);
    },
    getMeasuringUnit: function(a) {
        if (a === this.WEEK) {
            return this.DAY;
        }
        return a;
    },
    getDurationInUnit: function(e, a, c, d) {
        var b;
        switch (c) {
          case this.YEAR:
            b = this.getDurationInYears(e, a);
            break;

          case this.QUARTER:
            b = this.getDurationInMonths(e, a) / 3;
            break;

          case this.MONTH:
            b = this.getDurationInMonths(e, a);
            break;

          case this.WEEK:
            b = this.getDurationInDays(e, a) / 7;
            break;

          case this.DAY:
            b = this.getDurationInDays(e, a);
            break;

          case this.HOUR:
            b = this.getDurationInHours(e, a);
            break;

          case this.MINUTE:
            b = this.getDurationInMinutes(e, a);
            break;

          case this.SECOND:
            b = this.getDurationInSeconds(e, a);
            break;

          case this.MILLI:
            b = this.getDurationInMilliseconds(e, a);
            break;
        }
        return d ? b : Math.round(b);
    },
    getUnitToBaseUnitRatio: function(b, a) {
        if (b === a) {
            return 1;
        }
        switch (b) {
          case this.YEAR:
            switch (a) {
              case this.QUARTER:
                return 1 / 4;

              case this.MONTH:
                return 1 / 12;
            }
            break;

          case this.QUARTER:
            switch (a) {
              case this.YEAR:
                return 4;

              case this.MONTH:
                return 1 / 3;
            }
            break;

          case this.MONTH:
            switch (a) {
              case this.YEAR:
                return 12;

              case this.QUARTER:
                return 3;
            }
            break;

          case this.WEEK:
            switch (a) {
              case this.DAY:
                return 1 / 7;

              case this.HOUR:
                return 1 / 168;
            }
            break;

          case this.DAY:
            switch (a) {
              case this.WEEK:
                return 7;

              case this.HOUR:
                return 1 / 24;

              case this.MINUTE:
                return 1 / 1440;
            }
            break;

          case this.HOUR:
            switch (a) {
              case this.DAY:
                return 24;

              case this.MINUTE:
                return 1 / 60;
            }
            break;

          case this.MINUTE:
            switch (a) {
              case this.HOUR:
                return 60;

              case this.SECOND:
                return 1 / 60;

              case this.MILLI:
                return 1 / 6e4;
            }
            break;

          case this.SECOND:
            switch (a) {
              case this.MILLI:
                return 1 / 1e3;
            }
            break;

          case this.MILLI:
            switch (a) {
              case this.SECOND:
                return 1e3;
            }
            break;
        }
        return -1;
    },
    getDurationInMilliseconds: function(b, a) {
        return a - b;
    },
    getDurationInSeconds: function(b, a) {
        return (a - b) / 1e3;
    },
    getDurationInMinutes: function(b, a) {
        return (a - b) / 6e4;
    },
    getDurationInHours: function(b, a) {
        return (a - b) / 36e5;
    },
    getDurationInDays: function(c, b) {
        var a = c.getTimezoneOffset() - b.getTimezoneOffset();
        return (b - c + a * 60 * 1e3) / 864e5;
    },
    getDurationInMonths: function(b, a) {
        return (a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth());
    },
    getDurationInYears: function(b, a) {
        return this.getDurationInMonths(b, a) / 12;
    },
    min: function(b, a) {
        return b < a ? b : a;
    },
    max: function(b, a) {
        return b > a ? b : a;
    },
    intersectSpans: function(c, d, b, a) {
        return this.betweenLesser(c, b, a) || this.betweenLesser(b, c, d);
    },
    getNameOfUnit: function(a) {
        a = this.getUnitByName(a);
        switch (a.toLowerCase()) {
          case this.YEAR:
            return "YEAR";

          case this.QUARTER:
            return "QUARTER";

          case this.MONTH:
            return "MONTH";

          case this.WEEK:
            return "WEEK";

          case this.DAY:
            return "DAY";

          case this.HOUR:
            return "HOUR";

          case this.MINUTE:
            return "MINUTE";

          case this.SECOND:
            return "SECOND";

          case this.MILLI:
            return "MILLI";
        }
        throw "Incorrect UnitName";
    },
    getReadableNameOfUnit: function(b, a) {
        if (!this.isLocaleApplied()) {
            this.applyLocale();
        }
        return this._unitNames[b][a ? "plural" : "single"];
    },
    getShortNameOfUnit: function(a) {
        if (!this.isLocaleApplied()) {
            this.applyLocale();
        }
        return this._unitNames[a].abbrev;
    },
    getUnitByName: function(a) {
        if (!this.isLocaleApplied()) {
            this.applyLocale();
        }
        if (!this.unitsByName[a]) {
            Ext.Error.raise("Unknown unit name: " + a);
        }
        return this.unitsByName[a];
    },
    getNext: function(c, g, a, f) {
        var e = Ext.Date.clone(c);
        f = arguments.length < 4 ? 1 : f;
        a = a == null ? 1 : a;
        switch (g) {
          case this.MILLI:
            e = this.add(c, g, a);
            break;

          case this.SECOND:
            e = this.add(c, g, a);
            if (e.getMilliseconds() > 0) {
                e.setMilliseconds(0);
            }
            break;

          case this.MINUTE:
            e = this.add(c, g, a);
            if (e.getSeconds() > 0) {
                e.setSeconds(0);
            }
            if (e.getMilliseconds() > 0) {
                e.setMilliseconds(0);
            }
            break;

          case this.HOUR:
            e = this.add(c, g, a);
            if (e.getMinutes() > 0) {
                e.setMinutes(0);
            }
            if (e.getSeconds() > 0) {
                e.setSeconds(0);
            }
            if (e.getMilliseconds() > 0) {
                e.setMilliseconds(0);
            }
            break;

          case this.DAY:
            var d = c.getHours() === 23 && this.add(e, this.HOUR, 1).getHours() === 1;
            if (d) {
                e = this.add(e, this.DAY, 2);
                this.clearTime(e);
                return e;
            }
            this.clearTime(e);
            e = this.add(e, this.DAY, a);
            if (e.getHours() === 1) {
                this.clearTime(e);
            }
            break;

          case this.WEEK:
            this.clearTime(e);
            var b = e.getDay();
            e = this.add(e, this.DAY, f - b + 7 * (a - (f <= b ? 0 : 1)));
            if (e.getDay() !== f) {
                e = this.add(e, this.HOUR, 1);
            } else {
                this.clearTime(e);
            }
            break;

          case this.MONTH:
            e = this.add(e, this.MONTH, a);
            e.setDate(1);
            this.clearTime(e);
            break;

          case this.QUARTER:
            e = this.add(e, this.MONTH, (a - 1) * 3 + (3 - e.getMonth() % 3));
            this.clearTime(e);
            e.setDate(1);
            break;

          case this.YEAR:
            e = new Date(e.getFullYear() + a, 0, 1);
            break;

          default:
            throw "Invalid date unit";
        }
        return e;
    },
    getNumberOfMsFromTheStartOfDay: function(a) {
        return a - this.clearTime(a, true) || 864e5;
    },
    getNumberOfMsTillTheEndOfDay: function(a) {
        return this.getStartOfNextDay(a, true) - a;
    },
    getStartOfNextDay: function(b, f, e) {
        var d = this.add(e ? b : this.clearTime(b, f), this.DAY, 1);
        if (d.getDate() == b.getDate()) {
            var c = this.add(this.clearTime(b, f), this.DAY, 2).getTimezoneOffset();
            var a = b.getTimezoneOffset();
            d = this.add(d, this.MINUTE, a - c);
        }
        return d;
    },
    getEndOfPreviousDay: function(b, c) {
        var a = c ? b : this.clearTime(b, true);
        if (a - b) {
            return a;
        } else {
            return this.add(a, this.DAY, -1);
        }
    },
    timeSpanContains: function(c, b, d, a) {
        return d - c >= 0 && b - a >= 0;
    },
    compareWithPrecision: function(e, c, f) {
        var d = Ext.ux.Scheduler2.util.Date, b = Ext.Date, a;
        switch (f) {
          case d.DAY:
            e = Number(b.format(e, "Ymd"));
            c = Number(b.format(c, "Ymd"));
            break;

          case d.WEEK:
            e = Number(b.format(e, "YmW"));
            c = Number(b.format(c, "YmW"));
            break;

          case d.MONTH:
            e = Number(b.format(e, "Ym"));
            c = Number(b.format(c, "Ym"));
            break;

          case d.QUARTER:
            e = e.getFullYear() * 4 + Math.floor(e.getMonth() / 3);
            c = c.getFullYear() * 4 + Math.floor(c.getMonth() / 3);
            break;

          case d.YEAR:
            e = e.getFullYear();
            c = c.getFullYear();
            break;

          default:
          case d.MILLI:
          case d.SECOND:
          case d.MINUTE:
          case d.HOUR:
            f = f && this.getUnitDurationInMs(f) || 1;
            e = Math.floor(e.valueOf() / f);
            c = Math.floor(c.valueOf() / f);
            break;
        }
        e < c && (a = -1) || e > c && (a = +1) || (a = 0);
        return a;
    },
    getValueInUnits: function(a, b) {
        switch (b) {
          case this.MONTH:
            return a.getMonth();

          case this.DAY:
            return a.getDate();

          case this.HOUR:
            return a.getHours();

          case this.MINUTE:
            return a.getMinutes();

          case this.SECOND:
            return a.getSeconds();
        }
    },
    setValueInUnits: function(b, c, e) {
        var a = Ext.Date.clone(b), d;
        switch (c) {
          case this.YEAR:
            d = "setFullYear";
            break;

          case this.MONTH:
            d = "setMonth";
            break;

          case this.DAY:
            d = "setDate";
            break;

          case this.HOUR:
            d = "setHours";
            break;

          case this.MINUTE:
            d = "setMinutes";
            break;

          case this.SECOND:
            d = "setSeconds";
            break;

          case this.MILLI:
            d = "setMilliseconds";
            break;
        }
        a[d](e);
        return a;
    },
    getSubUnit: function(a) {
        switch (a) {
          case this.YEAR:
            return this.MONTH;

          case this.MONTH:
            return this.DAY;

          case this.DAY:
            return this.HOUR;

          case this.HOUR:
            return this.MINUTE;

          case this.MINUTE:
            return this.SECOND;

          case this.SECOND:
            return this.MILLI;
        }
    },
    setValueInSubUnits: function(a, b, c) {
        b = this.getSubUnit(b);
        return this.setValueInUnits(a, b, c);
    },
    mergeDates: function(c, b, a) {
        var d = Ext.Date.clone(c);
        switch (a) {
          case this.YEAR:
            d.setFullYear(b.getFullYear());

          case this.MONTH:
            d.setMonth(b.getMonth());

          case this.WEEK:
          case this.DAY:
            if (a === this.WEEK) {
                d = this.add(d, this.DAY, b.getDay() - d.getDay());
            } else {
                d.setDate(b.getDate());
            }

          case this.HOUR:
            d.setHours(b.getHours());

          case this.MINUTE:
            d.setMinutes(b.getMinutes());

          case this.SECOND:
            d.setSeconds(b.getSeconds());

          case this.MILLI:
            d.setMilliseconds(b.getMilliseconds());
        }
        return d;
    },
    splitToSubUnits: function(d, c, a, b) {
        a = a || 1;
        b = arguments.length < 4 ? 1 : b;
        switch (c) {
          case this.MONTH:
            return this.splitMonth(d, a, b);

          case this.WEEK:
          case this.DAY:
            return this.splitDay(d, a);

          default:
            break;
        }
    },
    splitYear: function(e, c) {
        var b = this.clearTime(e, true);
        b.setMonth(0);
        b.setDate(1);
        var a = [];
        for (var d = 0; d <= 12; d = d + c) {
            a.push(this.add(b, this.MONTH, d));
        }
        return a;
    },
    splitMonth: function(h, c, g) {
        var b = this.clearTime(h, true);
        b.setDate(1);
        b = this.add(b, this.DAY, g - b.getDay());
        var d = Ext.Date.clone(b);
        var f = this.add(b, this.MONTH, 1);
        var a = [];
        for (var e = 0; d.getTime() < f.getTime(); e = e + c) {
            d = this.add(b, this.WEEK, e);
            a.push(d);
        }
        return a;
    },
    splitWeek: function(f, c, e) {
        var b = this.add(f, this.DAY, e - f.getDay());
        b = this.clearTime(b);
        var a = [];
        for (var d = 0; d <= 7; d = d + c) {
            a.push(this.add(b, this.DAY, d));
        }
        return a;
    },
    splitDay: function(e, b) {
        var d = this.clearTime(e, true);
        var a = [];
        for (var c = 0; c <= 24; c = c + b) {
            a.push(this.add(d, this.HOUR, c));
        }
        return a;
    },
    splitHour: function(e, b) {
        var d = new Date(e.getTime());
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        var a = [];
        for (var c = 0; c <= 60; c = c + b) {
            a.push(this.add(d, this.MINUTE, c));
        }
        return a;
    },
    splitMinute: function(e, b) {
        var d = Ext.Date.clone(e);
        d.setSeconds(0);
        d.setMilliseconds(0);
        var a = [];
        for (var c = 0; c <= 60; c = c + b) {
            a.push(this.add(d, this.SECOND, c));
        }
        return a;
    },
    clearTime: function(a, b) {
        if (a.getHours() > 0 || a.getMinutes() > 0 || a.getSeconds() > 0) {
            return Ext.Date.clearTime(a, b);
        }
        return b ? Ext.Date.clone(a) : a;
    }
});

Ext.define("Ext.ux.Scheduler2.model.Range", {
    extend: Ext.ux.Scheduler2.model.Customizable,
    idProperty: "Id",
    config: Ext.versions.touch ? {
        idProperty: "Id"
    } : null,
    startDateField: "StartDate",
    endDateField: "EndDate",
    nameField: "Name",
    clsField: "Cls",
    customizableFields: [ {
        name: "StartDate",
        type: "date",
        dateFormat: "c"
    }, {
        name: "EndDate",
        type: "date",
        dateFormat: "c"
    }, {
        name: "Cls",
        type: "string"
    }, {
        name: "Name",
        type: "string"
    } ],
    setStartDate: function(a, d) {
        var c = this.getEndDate();
        var b = this.getStartDate();
        this.set(this.startDateField, a);
        if (d === true && c && b) {
            this.setEndDate(Ext.ux.Scheduler2.util.Date.add(a, Ext.ux.Scheduler2.util.Date.MILLI, c - b));
        }
    },
    setEndDate: function(b, d) {
        var a = this.getStartDate();
        var c = this.getEndDate();
        this.set(this.endDateField, b);
        if (d === true && a && c) {
            this.setStartDate(Ext.ux.Scheduler2.util.Date.add(b, Ext.ux.Scheduler2.util.Date.MILLI, -(c - a)));
        }
    },
    setStartEndDate: function(b, a) {
        this.beginEdit();
        this.set(this.startDateField, b);
        this.set(this.endDateField, a);
        this.endEdit();
    },
    getDates: function() {
        var c = [], b = this.getEndDate();
        for (var a = Ext.Date.clearTime(this.getStartDate(), true); a < b; a = Ext.ux.Scheduler2.util.Date.add(a, Ext.ux.Scheduler2.util.Date.DAY, 1)) {
            c.push(a);
        }
        return c;
    },
    forEachDate: function(b, a) {
        return Ext.Array.each(this.getDates(), b, a);
    },
    isValid: function() {
        var b = this.callParent(arguments);
        if (b) {
            var c = this.getStartDate(), a = this.getEndDate();
            b = !c || !a || a - c >= 0;
        }
        return b;
    },
    shift: function(b, a) {
        this.setStartEndDate(Ext.ux.Scheduler2.util.Date.add(this.getStartDate(), b, a), Ext.ux.Scheduler2.util.Date.add(this.getEndDate(), b, a));
    },
    fullCopy: function() {
        return this.copy.apply(this, arguments);
    },
    intersectsRange: function(d, a) {
        var c = this.getStartDate();
        var b = this.getEndDate();
        return c && b && Ext.ux.Scheduler2.util.Date.intersectSpans(c, b, d, a);
    }
});

Ext.define("Ext.ux.Scheduler2.model.Resource", {
    extend: Ext.ux.Scheduler2.model.Customizable,
    idProperty: "Id",
    config: Ext.versions.touch ? {
        idProperty: "Id"
    } : null,
    nameField: "Name",
    customizableFields: [ {
        name: "Name",
        type: "string"
    } ],
    getInternalId: function() {
        return this.internalId;
    },
    getResourceStore: function() {
        return this.joined && this.joined[0];
    },
    getEventStore: function() {
        var a = this.getResourceStore();
        return a && a.getEventStore() || this.parentNode && this.parentNode.getEventStore();
    },
    getAssignmentStore: function() {
        var a = this.getEventStore();
        return a && a.getAssignmentStore();
    },
    getEvents: function(a) {
        var b = this;
        a = a || b.getEventStore();
        return a && a.getEventsForResource(b) || [];
    },
    getAssignments: function() {
        var b = this, a = b.getEventStore();
        return a && a.getAssignmentsForResource(b);
    },
    isPersistable: function() {
        var a = this.parentNode;
        return !a || !a.phantom || a.isRoot && a.isRoot();
    }
});

Ext.define("Ext.ux.Scheduler2.util.Cache", {
    cache: null,
    constructor: function() {
        this.cache = {};
    },
    key: function(b) {
        var a;
        if (b instanceof Ext.data.Model) {
            a = b.getId().toString();
        } else {
            if (b === undefined || b === null) {
                a = "[ undefined / null ]";
            } else {
                a = b.toString();
            }
        }
        return a;
    },
    get: function(b, c) {
        var d = this, a;
        b = d.key(b);
        a = d.cache.hasOwnProperty(b) && d.cache[b];
        if (!a && c) {
            a = c();
        } else {
            if (!a) {
                a = [];
            }
        }
        d.cache[b] = a;
        return a;
    },
    add: function(c, b) {
        var d = this, a = d.key(c);
        if (!d.cache.hasOwnProperty(a)) {
            d.cache[a] = d.get(c);
        }
        Ext.Array.include(d.cache[a], b);
        return d;
    },
    remove: function(b, a) {
        var c = this;
        b = c.key(b);
        if (c.cache.hasOwnProperty(b)) {
            Ext.Array.remove(c.cache[b], a);
        }
        return c;
    },
    move: function(c, d, a) {
        var b = this;
        c = b.key(c);
        d = b.key(d);
        if (c != d && arguments.length >= 3) {
            b.remove(c, a);
            b.add(d, a);
        } else {
            if (c != d && b.cache.hasOwnProperty(c) && b.cache.hasOwnProperty(d)) {
                b.cache[d] = Ext.Array.union(b.cache[d], b.cache[c]);
                b.cache[c] = [];
            } else {
                if (c != d && b.cache.hasOwnProperty(c)) {
                    b.cache[d] = b.cache[c];
                    b.cache[c] = [];
                }
            }
        }
    },
    clear: function(a) {
        var b = this;
        if (!arguments.length) {
            b.cache = {};
        } else {
            a = b.key(a);
            if (b.cache.hasOwnProperty(a)) {
                delete b.cache[a];
            }
        }
        return b;
    },
    uncache: function(b) {
        var c = this, a;
        for (a in c.cache) {
            if (c.cache.hasOwnProperty(a)) {
                c.cache[a] = Ext.Array.remove(c.cache[a], b);
            }
        }
        return c;
    }
});

Ext.define("Ext.ux.Scheduler2.data.util.EventAssignmentsCache", {
    extend: Ext.ux.Scheduler2.util.Cache,
    assignmentStore: null,
    assignmentStoreDetacher: null,
    eventStoreDetacher: null,
    constructor: function(g) {
        var h = this, d = g.getEventStore();
        h.callParent();
        function j(n, m) {
            Ext.Array.each(m, function(o) {
                h.add(o.getEventId(), o);
            });
        }
        function b(n, m) {
            Ext.Array.each(m, function(o) {
                h.remove(o.getEventId(), o);
            });
        }
        function l(o, r, n) {
            var p = r.eventIdField, m = r.previous && p in r.previous, q = m && r.previous[p];
            if (m) {
                h.move(q, r.getEventId(), r);
            }
        }
        function k(m) {
            h.clear();
        }
        function c(m, n) {
            h.clear();
            a(n);
        }
        function i(n, o, p, m) {
            h.move(p, m);
        }
        function e(n, m) {
            Ext.Array.each(m, function(o) {
                h.clear(o);
            });
        }
        function f() {
            h.clear();
        }
        function a(m) {
            Ext.destroy(h.eventStoreDetacher);
            h.eventStoreDetacher = m && m.on({
                idchanged: i,
                remove: e,
                cacheresethint: f,
                clear: f,
                rootchange: f,
                priority: 100,
                destroyable: true
            });
        }
        h.assignmentStoreDetacher = g.on({
            add: j,
            remove: b,
            update: l,
            cacheresethint: k,
            clear: k,
            eventstorechange: c,
            priority: 100,
            destroyable: true
        });
        h.assignmentStoreFiltersDetacher = g.getFilters().on("endupdate", k, h, {
            priority: 1002,
            destroyable: true
        });
        a(d);
        h.assignmentStore = g;
    },
    destroy: function() {
        var a = this;
        Ext.destroyMembers(a, "assignmentStoreDetacher", "eventStoreDetacher");
        a.assignmentStore = null;
    },
    get: function(a, b) {
        var c = this;
        a = c.key(a);
        b = b || function() {
            return Ext.Array.filter(c.assignmentStore.getRange(), function(d) {
                return d.getEventId() == a;
            });
        };
        return c.callParent([ a, b ]);
    }
});

Ext.define("Ext.ux.Scheduler2.data.util.ResourceAssignmentsCache", {
    extend: Ext.ux.Scheduler2.util.Cache,
    assignmentStore: null,
    assignmentStoreDetacher: null,
    eventStoreDetacher: null,
    resourceStoreDetacher: null,
    constructor: function(h) {
        var j = this, f = h.getEventStore(), m = f && f.getResourceStore();
        j.callParent();
        function k(q, p) {
            Ext.Array.each(p, function(r) {
                j.add(r.getResourceId(), r);
            });
        }
        function b(q, p) {
            Ext.Array.each(p, function(r) {
                j.remove(r.getResourceId(), r);
            });
        }
        function o(r, u, q) {
            var t = u.resourceIdField, s = u.previous && t in u.previous, p = s && u.previous[t];
            if (s) {
                j.move(p, u.getResourceId(), u);
            }
        }
        function l(p) {
            j.clear();
        }
        function c(p, q) {
            a(q);
            d(q && q.getResourceStore());
        }
        function n(p, q) {
            j.clear();
            d(q);
        }
        function i(q, r, s, p) {
            j.move(s, p);
        }
        function g(p, q) {
            Ext.Array.each(q, function(r) {
                j.clear(r);
            });
        }
        function e() {
            j.clear();
        }
        function a(p) {
            Ext.destroy(j.eventStoreDetacher);
            j.eventStoreDetacher = p && p.on({
                resourcestorechange: n,
                priority: 100,
                destroyable: true
            });
        }
        function d(p) {
            Ext.destroy(j.resourceStoreDetacher);
            j.resourceStoreDetacher = p && p.on({
                idchanged: i,
                remove: g,
                clear: e,
                cacheresethint: e,
                rootchange: e,
                priority: 100,
                destroyable: true
            });
        }
        j.assignmentStoreDetacher = h.on({
            add: k,
            remove: b,
            update: o,
            clear: l,
            cacheresethint: l,
            eventstorechange: c,
            priority: 100,
            destroyable: true
        });
        j.assignmentStoreFiltersDetacher = h.getFilters().on("endupdate", l, j, {
            priority: 1002,
            destroyable: true
        });
        a(f);
        d(m);
        j.assignmentStore = h;
    },
    destroy: function() {
        var a = this;
        Ext.destroyMembers(a, "assignmentStoreDetacher", "assignmentStoreFiltersDetacher", "eventStoreDetacher", "resourceStoreDetacher");
        a.assignmentStore = null;
    },
    get: function(a, b) {
        var c = this;
        a = c.key(a);
        b = b || function() {
            return Ext.Array.filter(c.assignmentStore.getRange(), function(d) {
                return d.getResourceId() == a;
            });
        };
        return c.callParent([ a, b ]);
    }
});

Ext.define("Ext.ux.Scheduler2.data.util.AssignmentStoreEventResourcesCache", {
    extend: Ext.ux.Scheduler2.util.Cache,
    assignmentStore: null,
    assignmentStoreDetacher: null,
    eventStoreDetacher: null,
    resourceStoreDetacher: null,
    constructor: function(j) {
        var k = this, f = j.getEventStore(), o = f && f.getResourceStore();
        k.callParent();
        function m(s, r) {
            var t = k.assignmentStore.getEventStore(), u = t && t.getResourceStore();
            Ext.Array.each(r, function(w) {
                var v = u && u.getModelById(w.getResourceId());
                if (v) {
                    k.add(w.getEventId(), v);
                } else {
                    k.clear(w.getEventId());
                }
            });
        }
        function b(s, r) {
            var t = k.assignmentStore.getEventStore(), u = t && t.getResourceStore();
            Ext.Array.each(r, function(w) {
                var v = u.getModelById(w.getResourceId());
                if (v) {
                    k.remove(w.getEventId(), v);
                } else {
                    k.clear(w.getEventId());
                }
            });
        }
        function q(B, s, x) {
            var y = s.resourceIdField, C = s.previous && y in s.previous, u = C && s.previous[y], z = s.eventIdField, r = s.previous && z in s.previous, t = r && s.previous[z], w = k.assignmentStore.getEventStore(), A = w && w.getResourceStore(), v;
            if (C || r) {
                u = C ? u : s.getResourceId();
                t = r ? t : s.getEventId();
                v = A.getModelById(u);
                if (v) {
                    k.remove(t, v);
                } else {
                    k.clear(t);
                }
                v = A.getModelById(s.getResourceId());
                if (v) {
                    k.add(s.getEventId(), v);
                } else {
                    k.clear(s.getEventId());
                }
            }
        }
        function n(r) {
            k.clear();
        }
        function c(r, s) {
            k.clear();
            a(s);
            d(s && s.getResourceStore());
        }
        function l(s, t, u, r) {
            k.move(u, r);
        }
        function g(s, r) {
            Ext.Array.each(r, function(t) {
                k.clear(t);
            });
        }
        function i() {
            k.clear();
        }
        function p(r, s) {
            k.clear();
            d(s);
        }
        function h(r, s) {
            Ext.Array.each(s, function(t) {
                k.uncache(t);
            });
        }
        function e() {
            k.clear();
        }
        function a(r) {
            Ext.destroy(k.eventStoreDetacher);
            k.eventStoreDetacher = r && r.on({
                idchanged: l,
                remove: g,
                clear: i,
                cacheresethint: i,
                rootchange: i,
                resourcestorechange: p,
                priority: 100,
                destroyable: true
            });
        }
        function d(r) {
            Ext.destory(k.resourceStoreDetacher);
            k.resourceStoreDetacher = r && r.on({
                remove: h,
                clear: e,
                cacheresethint: e,
                rootchange: e,
                priority: 100,
                destroyable: true
            });
        }
        k.assignmentStoreDetacher = j.on({
            add: m,
            remove: b,
            update: q,
            clear: n,
            cacheresethint: n,
            priority: 100,
            destroyable: true
        });
        k.assignmentStore = j;
    },
    destroy: function() {
        var a = this;
        Ext.destroyMembers(a, "assignmentStoreDetacher", "eventStoreDetacher", "resourceStoreDetacher");
        a.assignmentStore = null;
    },
    get: function(a, b) {
        var c = this;
        b = b || function() {
            return c.assignmentStore.mapAssignmentsForEvent(a, function e(f) {
                return f.getResource();
            }, function d(f) {
                return !!f;
            });
        };
        return c.callParent([ a, b ]);
    }
});

Ext.define("Ext.ux.Scheduler2.data.util.AssignmentStoreResourceEventsCache", {
    extend: Ext.ux.Scheduler2.util.Cache,
    assignmentStore: null,
    assignmentStoreDetacher: null,
    eventStoreDetacher: null,
    resourceStoreDetacher: null,
    constructor: function(j) {
        var l = this, f = j.getEventStore(), o = f && f.getResourceStore();
        l.callParent();
        function m(s, r) {
            var t = l.assignmentStore.getEventStore();
            Ext.Array.each(r, function(v) {
                var u = t && t.getModelById(v.getEventId());
                if (u) {
                    l.add(v.getResourceId(), u);
                } else {
                    l.clear(v.getResourceId());
                }
            });
        }
        function b(s, r) {
            var t = l.assignmentStore.getEventStore();
            Ext.Array.each(r, function(v) {
                var u = t && t.getModelById(v.getEventId());
                if (u) {
                    l.remove(v.getResourceId(), u);
                } else {
                    l.clear(v.getResourceId());
                }
            });
        }
        function q(A, t, x) {
            var y = t.resourceIdField, B = t.previous && y in t.previous, v = B && t.previous[y], z = t.eventIdField, r = t.previous && z in t.previous, u = r && t.previous[z], w = l.assignmentStore.getEventStore(), s;
            if (B || r) {
                v = B ? v : t.getResourceId();
                u = r ? u : t.getEventId();
                s = w && w.getModelById(u);
                if (s) {
                    l.remove(v, s);
                } else {
                    l.clear(v);
                }
                s = w && w.getModelById(t.getEventId());
                if (s) {
                    l.add(t.getResourceId(), s);
                } else {
                    l.clear(t.getResourceId());
                }
            }
        }
        function n(r) {
            l.clear();
        }
        function c(r, s) {
            l.clear();
            a(s);
            d(s && s.getResourceStore());
        }
        function g(s, r) {
            Ext.Array.each(r, function(t) {
                l.uncache(t);
            });
        }
        function i() {
            l.clear();
        }
        function p(r, s) {
            l.clear();
            d(s);
        }
        function k(s, t, u, r) {
            l.move(u, r);
        }
        function h(r, s) {
            Ext.Array.each(s, function(t) {
                l.clear(t);
            });
        }
        function e() {
            l.clear();
        }
        function a(r) {
            Ext.destroy(l.eventStoreDetacher);
            l.eventStoreDetacher = r && r.on({
                remove: g,
                cacheresethint: i,
                clear: i,
                rootchange: i,
                resourcestorechange: p,
                priority: 100,
                destroyable: true
            });
        }
        function d(r) {
            Ext.destroy(l.resourceStoreDetacher);
            l.resourceStoreDetacher = r && r.on({
                idchanged: k,
                remove: h,
                cacheresethint: e,
                clear: e,
                rootchange: e,
                priority: 100,
                destroyable: true
            });
        }
        l.assignmentStoreDetacher = j.on({
            add: m,
            remove: b,
            update: q,
            cacheresethint: n,
            clear: n,
            eventstorechange: c,
            priority: 100,
            destroyable: true
        });
        a(f);
        d(o);
        l.assignmentStore = j;
    },
    destroy: function() {
        var a = this;
        Ext.destroyMembers(a, "assignmentStoreDetacher", "eventStoreDetacher", "resourceStoreDetacher");
        a.assignmentStore = null;
    },
    get: function(a, b) {
        var c = this;
        b = b || function() {
            return c.assignmentStore.mapAssignmentsForResource(a, function e(f) {
                return f.getEvent();
            }, function d(f) {
                return !!f;
            });
        };
        return c.callParent([ a, b ]);
    }
});

Ext.define("Ext.ux.Scheduler2.data.AssignmentStore", {
    extend: Ext.data.Store,
    mixins: [ Ext.ux.Scheduler2.data.mixin.UniversalModelGetter, Ext.ux.Scheduler2.data.mixin.CacheHintHelper, Ext.ux.Scheduler2.data.undoredo.mixin.StoreHint ],
    model: "Ext.ux.Scheduler2.model.Assignment",
    alias: "store.assignmentstore",
    storeId: "assignments",
    eventResourceCache: null,
    resourceEventsCache: null,
    eventStoreDetacher: null,
    resourceStoreDetacher: null,
    eventStore: null,
    constructor: function(a) {
        var b = this;
        b.callParent([ a ]);
        b.eventAssignmentsCache = b.eventAssignmentsCache || new Ext.ux.Scheduler2.data.util.EventAssignmentsCache(b);
        b.resourceAssignmentsCache = b.resourceAssignmentsCache || new Ext.ux.Scheduler2.data.util.ResourceAssignmentsCache(b);
    },
    destroy: function() {
        var a = this;
        Ext.destroyMembers(a, "eventResourceCache", "resourceEventsCache", "eventAssignmentsCache", "resourceEventsCache", "eventStoreDetacher", "resourceStoreDetacher");
        a.callParent();
    },
    getEventStore: function() {
        return this.eventStore;
    },
    setEventStore: function(a) {
        var b = this, c = b.eventStore;
        b.eventStore = a && Ext.StoreMgr.lookup(a) || null;
        b.attachToEventStore(b.eventStore);
        if ((c || a) && c !== a) {
            b.fireEvent("eventstorechange", b, a, c);
        }
    },
    attachToEventStore: function(a) {
        var b = this;
        Ext.destroy(b.eventStoreDetacher);
        if (a) {
            if (a.isTreeStore) {
                b.eventStoreDetacher = a.on({
                    noderemove: b.onEventNodeRemove,
                    resourcestorechange: b.onEventStoreResourceStoreChange,
                    scope: b,
                    destroyable: true,
                    priority: 200
                });
            } else {
                b.eventStoreDetacher = a.on({
                    remove: b.onEventRemove,
                    resourcestorechange: b.onEventStoreResourceStoreChange,
                    scope: b,
                    destroyable: true,
                    priority: 200
                });
            }
        }
        b.attachToResourceStore(a && a.getResourceStore());
    },
    attachToResourceStore: function(b) {
        var a = this;
        Ext.destroy(a.resourceStoreDetacher);
        if (b) {
            if (b.isTreeStore) {
                a.resourceStoreDetacher = b.on({
                    noderemove: a.onResourceNodeRemove,
                    scope: a,
                    destroyable: true,
                    priority: 200
                });
            } else {
                a.resourceStoreDetacher = b.on({
                    remove: a.onResourceRemove,
                    scope: a,
                    destroyable: true,
                    priority: 200
                });
            }
        }
    },
    onEventStoreResourceStoreChange: function(b, a, c) {
        this.attachToResourceStore(a);
    },
    onEventRemove: function(e, d, c, b) {
        var f = this, a;
        if (!b) {
            a = [];
            Ext.Array.each(d, function(g) {
                a = a.concat(f.getAssignmentsForEvent(g));
            });
            a.length && f.remove(a);
        }
    },
    onEventNodeRemove: function(c, e, b) {
        var d = this, a;
        if (!b) {
            a = [];
            e.cascadeBy(function(f) {
                a = a.concat(d.getAssignmentsForEvent(f));
            });
            a.length && d.remove(a);
        }
    },
    onResourceRemove: function(e, f, c, b) {
        var d = this, a;
        if (!b) {
            a = [];
            Ext.Array.each(f, function(g) {
                a = a.concat(d.getAssignmentsForResource(g));
            });
            a.length && d.remove(a);
        }
    },
    onResourceNodeRemove: function(d, e, b) {
        var c = this, a;
        if (!b) {
            a = [];
            e.cascadeBy(function(f) {
                a = a.concat(c.getAssignmentsForResource(f));
            });
            a.length && c.remove(a);
        }
    },
    mapAssignmentsForEvent: function(d, b, e) {
        var c = this, a = [];
        b = b || Ext.identityFn;
        e = e || Ext.returnTrue;
        if (b !== Ext.identityFn || e !== Ext.returnTrue) {
            Ext.Array.each(c.eventAssignmentsCache.get(d), function(g) {
                var f = b(g);
                e(f) && a.push(f);
            });
        } else {
            a = [].concat(c.eventAssignmentsCache.get(d));
        }
        return a;
    },
    mapAssignmentsForResource: function(d, b, e) {
        var c = this, a = [];
        b = b || Ext.identityFn;
        e = e || Ext.returnTrue;
        if (b !== Ext.identityFn || e !== Ext.returnTrue) {
            Ext.Array.each(c.resourceAssignmentsCache.get(d), function(g) {
                var f = b(g);
                e(f) && a.push(f);
            });
        } else {
            a = [].concat(c.resourceAssignmentsCache.get(d));
        }
        return a;
    },
    getAssignmentsForEvent: function(a) {
        return this.mapAssignmentsForEvent(a);
    },
    removeAssignmentsForEvent: function(b) {
        var a = this;
        a.remove(a.getAssignmentsForEvent(b));
    },
    getAssignmentsForResource: function(a) {
        return this.mapAssignmentsForResource(a);
    },
    removeAssignmentsForResource: function(b) {
        var a = this;
        a.remove(a.getAssignmentsForResource(b));
    },
    getResourcesForEvent: function(d) {
        var c = this, a;
        if (c.eventResourceCache) {
            a = c.eventResourceCache.get(d);
        } else {
            a = c.mapAssignmentsForEvent(d, function e(f) {
                return f.getResource();
            }, function b(f) {
                return !!f;
            });
        }
        return a;
    },
    getEventsForResource: function(d) {
        var c = this, a;
        if (c.resourceEventsCache) {
            a = c.resourceEventsCache.get(d);
        } else {
            a = c.mapAssignmentsForResource(d, function e(f) {
                return f.getEvent();
            }, function b(f) {
                return !!f;
            });
        }
        return a;
    },
    assignEventToResource: function(c, e, d) {
        var b = this, a = [];
        d = d || Ext.identityFn;
        var f = Ext.isArray(e) ? e : [ e ];
        Ext.Array.each(f, function(g) {
            if (!b.isEventAssignedToResource(c, g)) {
                var h = new b.model();
                h.setEventId(c instanceof Ext.data.Model && c.getId() || c);
                h.setResourceId(g instanceof Ext.data.Model && g.getId() || g);
                h = d(h);
                a.push(h);
            }
        });
        b.add(a);
        return a;
    },
    unassignEventFromResource: function(b, c) {
        var a = this, d;
        if (!c) {
            this.removeAssignmentsForEvent(b);
        } else {
            if (a.isEventAssignedToResource(b, c)) {
                d = a.getAssignmentForEventAndResource(b, c);
                a.remove(d);
            }
        }
        return d;
    },
    isEventAssignedToResource: function(f, g) {
        var e = this, c = e.getResourcesForEvent(f), b = false, d, a;
        g = g instanceof Ext.data.Model && g.getId() || g;
        for (d = 0, a = c.length; !b && d < a; d++) {
            b = c[d];
            b = b.getId() == g;
        }
        return b;
    },
    getAssignmentForEventAndResource: function(f, g) {
        var e = this, c = e.getAssignmentsForEvent(f), b = null, d, a;
        g = g instanceof Ext.data.Model && g.getId() || g;
        for (d = 0, a = c.length; !b && d < a; d++) {
            b = c[d];
            b = b.getResourceId() == g && b || null;
        }
        return b;
    }
});

Ext.define("Ext.ux.Scheduler2.data.CrudManager", {
    extend: Ext.ux.Scheduler2.crud.AbstractManager,
    mixins: [ Ext.ux.Scheduler2.crud.encoder.Json, Ext.ux.Scheduler2.crud.transport.Ajax ],
    resourceStore: null,
    eventStore: null,
    assignmentStore: null,
    addRelatedStores: true,
    constructor: function(c) {
        c = c || {};
        var f = c.resourceStore || this.resourceStore || new Ext.ux.Scheduler2.data.ResourceStore(), d = c.eventStore || this.eventStore || new Ext.ux.Scheduler2.data.EventStore(), h = c.assignmentStore || this.assignmentStore, b = [];
        if (d && c.addRelatedStores !== false) {
            var a = this.getEventStoreInfo(d, c);
            h = h || a.assignmentStore;
            f = f || a.resourceStore;
        }
        d && b.push(d);
        f && b.push(f);
        h && b.push(h);
        if (b.length) {
            var g = [];
            f && g.push(f);
            d && g.push(d);
            h && g.push(h);
            if (g.length) {
                c.syncApplySequence = (c.syncApplySequence || c.stores || []).concat(g);
            }
            var e = c.stores || this.stores;
            if (e && !Ext.isArray(e)) {
                e = [ e ];
            }
            c.stores = (e || []).concat(b);
        }
        this.callParent([ c ]);
        this.eventStore = this.getStoreDescriptor(d);
        this.resourceStore = this.getStoreDescriptor(f);
        this.assignmentStore = this.getStoreDescriptor(h);
    },
    getEventStoreInfo: function(c, b) {
        if (!(c instanceof Ext.data.AbstractStore)) {
            if (typeof c == "string") {
                c = Ext.data.StoreManager.get(c);
            } else {
                c = c.store;
            }
        }
        var a = {}, e = b.assignmentStore, d = b.resourceStore;
        !e && (a.assignmentStore = c.getAssignmentStore());
        !d && (a.resourceStore = c.getResourceStore());
        return a;
    },
    getResourceStore: function() {
        return this.resourceStore && this.resourceStore.store;
    },
    setResourceStore: function(a) {
        if (this.getResourceStore()) {
            this.removeStore(this.getResourceStore());
        }
        this.addStore(a);
        this.resourceStore = {
            store: a
        };
    },
    getEventStore: function() {
        return this.eventStore && this.eventStore.store;
    },
    setEventStore: function(a) {
        if (this.getEventStore()) {
            this.removeStore(this.getEventStore());
        }
        this.addStore(a);
        this.eventStore = {
            store: a
        };
    },
    getAssignmentStore: function() {
        return this.assignmentStore && this.assignmentStore.store;
    },
    setAssignmentStore: function(a) {
        if (this.getAssignmentStore()) {
            this.removeStore(this.getAssignmentStore());
        }
        this.addStore(a);
        this.assignmentStore = {
            store: a
        };
    }
});

Ext.define("Ext.ux.Scheduler2.data.util.IdConsistencyManager", {
    config: {
        eventStore: null,
        resourceStore: null,
        assignmentStore: null
    },
    eventStoreDetacher: null,
    resourceStoreDetacher: null,
    constructor: function(a) {
        this.initConfig(a);
    },
    updateEventStore: function(a, c) {
        var b = this;
        Ext.destroyMembers(b, "eventStoreDetacher");
        if (a) {
            b.eventStoreDetacher = a.on({
                idchanged: b.onEventIdChanged,
                scope: b,
                destroyable: true,
                priority: 200
            });
        }
    },
    updateResourceStore: function(a, b) {
        var c = this;
        Ext.destroyMembers(c, "resourceStoreDetacher");
        if (a) {
            c.resourceStoreDetacher = a.on({
                idchanged: c.onResourceIdChanged,
                scope: c,
                destroyable: true,
                priority: 200
            });
        }
    },
    onEventIdChanged: function(c, e, g, a) {
        var d = this, f = d.getAssignmentStore(), b;
        if (f) {
            b = d.getUpdateAssignmentEventIdFieldFn(f, g, a);
            c.on("update", b, null, {
                single: true,
                priority: 200
            });
        }
    },
    onResourceIdChanged: function(i, e, b, d) {
        var h = this, f = h.getEventStore(), g = h.getAssignmentStore(), c, a;
        if (f && !g) {
            c = h.getUpdateEventResourceIdFieldFn(f, b, d);
        }
        if (g) {
            a = h.getUpdateAssignmentResourceIdFieldFn(g, b, d);
        }
        if (c || g) {
            i.on("update", function() {
                c && c();
                a && a();
            }, null, {
                single: true,
                priority: 200
            });
        }
    },
    getUpdateEventResourceIdFieldFn: function(c, d, a) {
        var b = c.getRange();
        return function() {
            Ext.Array.each(b, function(e) {
                e.getResourceId() == d && e.setResourceId(a);
            });
        };
    },
    getUpdateAssignmentEventIdFieldFn: function(c, d, b) {
        var a = c.getAssignmentsForEvent(d);
        return function() {
            Ext.Array.each(a, function(e) {
                e.getEventId() == d && e.setEventId(b);
            });
        };
    },
    getUpdateAssignmentResourceIdFieldFn: function(c, d, b) {
        var a = c.getAssignmentsForResource(d);
        return function() {
            Ext.Array.each(a, function(e) {
                e.getResourceId() == d && e.setResourceId(b);
            });
        };
    }
});

Ext.define("Ext.ux.Scheduler2.data.util.ModelPersistencyManager", {
    config: {
        eventStore: null,
        resourceStore: null,
        assignmentStore: null
    },
    eventStoreDetacher: null,
    resourceStoreDetacher: null,
    assignmentStoreDetacher: null,
    constructor: function(a) {
        this.initConfig(a);
    },
    updateEventStore: function(a, c) {
        var b = this;
        Ext.destroyMembers(b, "eventStoreDetacher");
        if (a && a.autoSync) {
            b.eventStoreDetacher = a.on({
                beforesync: b.onEventStoreBeforeSync,
                scope: b,
                destroyable: true,
                priority: 100
            });
        }
    },
    updateResourceStore: function(a, b) {
        var c = this;
        Ext.destroyMembers(c, "resourceStoreDetacher");
        if (a && a.autoSync) {
            c.resourceStoreDetacher = a.on({
                beforesync: c.onResourceStoreBeforeSync,
                scope: c,
                destroyable: true,
                priority: 100
            });
        }
    },
    updateAssignmentStore: function(a, b) {
        var c = this;
        Ext.destroyMembers(c, "assignmentStoreDetacher");
        if (a && a.autoSync) {
            c.assignmentStoreDetacher = a.on({
                beforesync: c.onAssignmentStoreBeforeSync,
                scope: c,
                destroyable: true,
                priority: 100
            });
        }
    },
    onEventStoreBeforeSync: function(a) {
        var b = this;
        b.removeNonPersistableRecordsToCreate(a);
        return b.shallContinueSync(a);
    },
    onResourceStoreBeforeSync: function(a) {
        var b = this;
        b.removeNonPersistableRecordsToCreate(a);
        return b.shallContinueSync(a);
    },
    onAssignmentStoreBeforeSync: function(a) {
        var b = this;
        b.removeNonPersistableRecordsToCreate(a);
        return b.shallContinueSync(a);
    },
    removeNonPersistableRecordsToCreate: function(b) {
        var a = b.create || [], d, c;
        for (c = a.length - 1; c >= 0; --c) {
            d = a[c];
            if (!d.isPersistable()) {
                Ext.Array.remove(a, d);
            }
        }
        if (a.length === 0) {
            delete b.create;
        }
    },
    shallContinueSync: function(a) {
        return Boolean(a.create && a.create.length > 0 || a.update && a.update.length > 0 || a.destroy && a.destroy.length > 0);
    }
});

Ext.define("Ext.ux.Scheduler2.data.util.ResourceEventsCache", {
    extend: Ext.ux.Scheduler2.util.Cache,
    eventStore: null,
    eventStoreDetacher: null,
    resourceStoreDetacher: null,
    constructor: function(c) {
        var i = this, j = c.getResourceStore();
        i.callParent();
        function l(n, m) {
            Ext.Array.each(m, function(o) {
                i.add(o.getResourceId(), o);
            });
        }
        function e(n, m) {
            Ext.Array.each(m, function(o) {
                i.remove(o.getResourceId(), o);
            });
        }
        function d(o, r, n, q) {
            var s = r.resourceIdField, p = r.previous && s in r.previous, m = p && r.previous[s];
            if (p) {
                i.move(m, r.getResourceId(), r);
            }
        }
        function g() {
            i.clear();
        }
        function k(n, m, o) {
            i.clear();
            a(m);
        }
        function h(n, o, p, m) {
            i.move(p, m);
        }
        function f(m, n) {
            Ext.Array.each(n, function(o) {
                i.clear(o);
            });
        }
        function b() {
            i.clear();
        }
        function a(m) {
            Ext.destroy(i.resourceStoreDetacher);
            i.resourceStoreDetacher = m && m.on({
                idchanged: h,
                remove: f,
                clear: b,
                cacheresethint: b,
                rootchange: b,
                priority: 100,
                destroyable: true
            });
        }
        i.eventStoreDetacher = c.on({
            add: l,
            remove: e,
            update: d,
            clear: g,
            cacheresethint: g,
            rootchange: g,
            resourcestorechange: k,
            priority: 100,
            destroyable: true
        });
        i.eventStoreFiltersDetacher = c.getFilters().on("endupdate", g, this, {
            priority: 1002,
            destroyable: true
        });
        a(j);
        i.eventStore = c;
    },
    destroy: function() {
        var a = this;
        Ext.destroyMembers(a, "eventStoreDetacher", "eventStoreFiltersDetacher", "resourceStoreDetacher");
        a.eventStore = null;
    },
    get: function(a, b) {
        var c = this;
        a = c.key(a);
        b = b || function() {
            return Ext.Array.filter(c.eventStore.getRange(), function(d) {
                return d.getResourceId() == a;
            });
        };
        return c.callParent([ a, b ]);
    }
});

Ext.define("Ext.ux.Scheduler2.data.mixin.EventStore", {
    extend: Ext.Mixin,
    isEventStore: true,
    resourceStore: null,
    resourceStoreDetacher: null,
    assignmentStore: null,
    resourceEventsCache: null,
    idConsistencyManager: null,
    modelPersistencyManager: null,
    mixinConfig: {
        after: {
            constructor: "constructor",
            destroy: "destroy"
        }
    },
    constructor: function() {
        var a = this;
        a.resourceEventsCache = a.createResourceEventsCache();
        a.idConsistencyManager = a.createIdConsistencyManager();
        a.modelPersistencyManager = a.createModelPersistencyManager();
    },
    destroy: function() {
        var a = this;
        Ext.destroyMembers(a, "resourceEventsCache", "idConsistencyManager", "modelPersistencyManager");
    },
    createResourceEventsCache: function() {
        return new Ext.ux.Scheduler2.data.util.ResourceEventsCache(this);
    },
    createIdConsistencyManager: function() {
        var a = this;
        return new Ext.ux.Scheduler2.data.util.IdConsistencyManager({
            eventStore: a,
            resourceStore: a.getResourceStore(),
            assignmentStore: a.getAssignmentStore()
        });
    },
    createModelPersistencyManager: function() {
        var a = this;
        return new Ext.ux.Scheduler2.data.util.ModelPersistencyManager({
            eventStore: a,
            resourceStore: a.getResourceStore(),
            assignmentStore: a.getAssignmentStore()
        });
    },
    getResourceStore: function() {
        return this.resourceStore;
    },
    setResourceStore: function(b) {
        var a = this, c = a.resourceStore;
        if (a.resourceStore) {
            a.resourceStore.setEventStore(null);
            a.idConsistencyManager && a.idConsistencyManager.setResourceStore(null);
            a.modelPersistencyManager && a.modelPersistencyManager.setResourceStore(null);
        }
        a.resourceStore = b && Ext.StoreMgr.lookup(b) || null;
        if (a.resourceStore) {
            a.modelPersistencyManager && a.modelPersistencyManager.setResourceStore(a.resourceStore);
            a.idConsistencyManager && a.idConsistencyManager.setResourceStore(a.resourceStore);
            b.setEventStore(a);
        }
        if ((c || b) && c !== b) {
            a.fireEvent("resourcestorechange", a, b, c);
        }
    },
    getAssignmentStore: function() {
        return this.assignmentStore;
    },
    setAssignmentStore: function(b) {
        var a = this, c = a.assignmentStore;
        if (a.assignmentStore) {
            a.assignmentStore.setEventStore(null);
            a.idConsistencyManager && a.idConsistencyManager.setAssignmentStore(null);
            a.modelPersistencyManager && a.modelPersistencyManager.setAssignmentStore(null);
        }
        a.assignmentStore = b && Ext.StoreMgr.lookup(b) || null;
        if (a.assignmentStore) {
            a.modelPersistencyManager && a.modelPersistencyManager.setAssignmentStore(a.assignmentStore);
            a.idConsistencyManager && a.idConsistencyManager.setAssignmentStore(a.assignmentStore);
            a.assignmentStore.setEventStore(a);
            Ext.destroy(a.resourceEventsCache);
        } else {
            a.resourceEventsCache = a.createResourceEventsCache();
        }
        if ((c || b) && c !== b) {
            a.fireEvent("assignmentstorechange", a, b, c);
        }
    },
    isDateRangeAvailable: function(g, a, c, e) {
        var f = Ext.ux.Scheduler2.util.Date, b = this.getEventsForResource(e), d = true;
        Ext.each(b, function(h) {
            d = c === h || !f.intersectSpans(g, a, h.getStartDate(), h.getEndDate());
            return d;
        });
        return d;
    },
    getEventsInTimeSpan: function(f, b, a) {
        var d = new Ext.util.MixedCollection();
        var c = [];
        if (a !== false) {
            var e = Ext.ux.Scheduler2.util.Date;
            this.forEachScheduledEvent(function(i, h, g) {
                if (e.intersectSpans(h, g, f, b)) {
                    c.push(i);
                }
            });
        } else {
            this.forEachScheduledEvent(function(i, h, g) {
                if (h - f >= 0 && b - g >= 0) {
                    c.push(i);
                }
            });
        }
        d.addAll(c);
        return d;
    },
    forEachScheduledEvent: function(b, a) {
        this.each(function(e) {
            var d = e.getStartDate(), c = e.getEndDate();
            if (d && c) {
                return b.call(a || this, e, d, c);
            }
        }, this);
    },
    getTotalTimeSpan: function() {
        var a = new Date(9999, 0, 1), b = new Date(0), c = Ext.ux.Scheduler2.util.Date;
        this.each(function(d) {
            if (d.getStartDate()) {
                a = c.min(d.getStartDate(), a);
            }
            if (d.getEndDate()) {
                b = c.max(d.getEndDate(), b);
            }
        });
        a = a < new Date(9999, 0, 1) ? a : null;
        b = b > new Date(0) ? b : null;
        this.lastTotalTimeSpan = {
            start: a || null,
            end: b || a || null
        };
        return this.lastTotalTimeSpan;
    },
    filterEventsForResource: function(d, c, b) {
        var a = d.getEvents(this);
        return Ext.Array.filter(a, c, b || this);
    },
    append: function(a) {
        throw "Must be implemented by consuming class";
    },
    getResourcesForEvent: function(d) {
        var c = this, e = c.getAssignmentStore(), b = c.getResourceStore(), a;
        if (e) {
            a = e.getResourcesForEvent(d);
        } else {
            if (b) {
                d = d instanceof Ext.ux.Scheduler2.model.Event && d || c.getModelById(d);
                a = d && b.getModelById(d.getResourceId());
                a = a && [ a ] || [];
            } else {
                a = [];
            }
        }
        return a;
    },
    getEventsForResource: function(c) {
        var b = this, d = b.getAssignmentStore(), a;
        if (d) {
            a = d.getEventsForResource(c);
        } else {
            if (b.resourceEventsCache) {
                a = b.resourceEventsCache.get(c);
            } else {
                a = [];
            }
        }
        return a;
    },
    getAssignmentsForEvent: function(b) {
        var a = this, c = a.getAssignmentStore();
        return c && c.getAssignmentsForEvent(b) || [];
    },
    getAssignmentsForResource: function(b) {
        var a = this, c = a.getAssignmentStore();
        return c && c.getAssignmentsForResource(b) || [];
    },
    assignEventToResource: function(b, c) {
        var a = this, d = a.getAssignmentStore();
        if (d) {
            d.assignEventToResource(b, c);
        } else {
            b = b instanceof Ext.ux.Scheduler2.model.Event && b || a.getModelById(b);
            c = c instanceof Ext.ux.Scheduler2.model.Resource ? c.getId() : c;
            b && b.setResourceId(c);
        }
    },
    unassignEventFromResource: function(b, c) {
        var a = this, d = a.getAssignmentStore();
        if (d) {
            d.unassignEventFromResource(b, c);
        } else {
            b = b instanceof Ext.ux.Scheduler2.model.Event && b || a.getModelById(b);
            c = c instanceof Ext.ux.Scheduler2.model.Resource ? c.getId() : c;
            if (b && b.getResourceId() == c) {
                b.setResourceId(null);
            }
        }
    },
    reassignEventFromResourceToResource: function(d, a, b) {
        var c = this, e = c.getAssignmentStore();
        if (e) {
            e.unassignEventFromResource(d, a);
            e.assignEventToResource(d, b);
        } else {
            d = d instanceof Ext.ux.Scheduler2.model.Event && d || c.getModelById(d);
            a = a instanceof Ext.ux.Scheduler2.model.Resource ? a.getId() : a;
            b = b instanceof Ext.ux.Scheduler2.model.Resource ? b.getId() : b;
            if (d.getResourceId() == a) {
                d.setResourceId(b);
            }
        }
    },
    isEventAssignedToResource: function(c, d) {
        var b = this, e = b.getAssignmentStore(), a;
        if (e) {
            a = e.isEventAssignedToResource(c, d);
        } else {
            c = c instanceof Ext.ux.Scheduler2.model.Event && c || b.getModelById(c);
            d = d instanceof Ext.ux.Scheduler2.model.Resource ? d.getId() : d;
            a = c && c.getResourceId() == d || false;
        }
        return a;
    },
    removeAssignmentsForEvent: function(b) {
        var a = this, c = a.getAssignmentStore();
        if (c) {
            c.removeAssignmentsForEvent(b);
        } else {
            b = b instanceof Ext.ux.Scheduler2.model.Event && b || a.getModelById(b);
            b && b.setResourceId(null);
        }
    },
    removeAssignmentsForResource: function(c) {
        var b = this, d = b.getAssignmentStore(), a = b.getResourceStore();
        if (d) {
            d.removeAssignmentsForResource(c);
        } else {
            if (a) {
                c = c instanceof Ext.ux.Scheduler2.model.Resource && c || a.getModelById(c);
                c && Ext.Array.each(b.resourceEventsCache.get(c), function(e) {
                    e.setResourceId(null);
                });
            } else {
                c = c instanceof Ext.ux.Scheduler2.model.Resource ? c.getId() : c;
                Ext.Array.each(b.getRange(), function(e) {
                    e.getResourceId() == c && e.setResourceId(null);
                });
            }
        }
    },
    isEventPersistable: function(e) {
        var d = this, g = d.getAssignmentStore(), f, c, b, a = true;
        if (!g) {
            f = e.getResources();
            for (c = 0, b = f.length; a && c < b; ++c) {
                a = f[c].phantom !== true;
            }
        }
        return a;
    }
});

Ext.define("Ext.ux.Scheduler2.model.Event", {
    extend: Ext.ux.Scheduler2.model.Range,
    idProperty: "Id",
    customizableFields: [ {
        name: "ResourceId"
    }, {
        name: "Draggable",
        type: "boolean",
        persist: false,
        defaultValue: true
    }, {
        name: "Resizable",
        persist: false,
        defaultValue: true
    } ],
    resourceIdField: "ResourceId",
    draggableField: "Draggable",
    resizableField: "Resizable",
    getInternalId: function() {
        return this.internalId;
    },
    getEventStore: function() {
        var b = this, a = b.joined && b.joined[0];
        if (a && !a.isEventStore) {
            Ext.Array.sort(b.joined, function(d, c) {
                return (d.isEventStore || false) > (c.isEventStore || false) && -1 || 1;
            });
            a = b.joined[0];
            a = a.isEventStore ? a : null;
        }
        return a;
    },
    getResourceStore: function() {
        var a = this.getEventStore();
        return a && a.getResourceStore();
    },
    getAssignmentStore: function() {
        var a = this.getEventStore();
        return a && a.getAssignmentStore();
    },
    getResources: function() {
        var b = this, a = b.getEventStore();
        return a && a.getResourcesForEvent(b) || [];
    },
    forEachResource: function(d, c) {
        var a = this.getResources();
        for (var b = 0; b < a.length; b++) {
            if (d.call(c || this, a[b]) === false) {
                return;
            }
        }
    },
    getResource: function(e, b) {
        var d = this, a = null, c;
        b = b || d.getEventStore();
        c = b && b.getResourceStore();
        e = e == null ? d.getResourceId() : e;
        if (b && (e === null || e === undefined)) {
            a = b.getResourcesForEvent(d);
            if (a.length == 1) {
                a = a[0];
            } else {
                if (a.length > 1) {
                    Ext.Error.raise("Event::getResource() is not applicable for events with multiple assignments, please use Event::getResources() instead.");
                } else {
                    a = null;
                }
            }
        } else {
            if (c) {
                a = c.getModelById(e);
            }
        }
        return a;
    },
    setResource: function(c) {
        var b = this, a = b.getEventStore();
        a && a.removeAssignmentsForEvent(b);
        b.assign(c);
    },
    assign: function(c) {
        var b = this, a = b.getEventStore();
        c = c instanceof Ext.ux.Scheduler2.model.Resource ? c.getId() : c;
        if (a) {
            a.assignEventToResource(b, c);
        } else {
            b.setResourceId(c);
        }
    },
    unassign: function(c) {
        var b = this, a = b.getEventStore();
        c = c instanceof Ext.ux.Scheduler2.model.Resource ? c.getId() : c;
        if (a) {
            a.unassignEventFromResource(b, c);
        } else {
            if (b.getResourceId() == c) {
                b.setResourceId(null);
            }
        }
    },
    reassign: function(a, b) {
        var d = this, c = d.getEventStore();
        a = a instanceof Ext.ux.Scheduler2.model.Resource ? a.getId() : a;
        b = b instanceof Ext.ux.Scheduler2.model.Resource ? b.getId() : b;
        if (c) {
            c.reassignEventFromResourceToResource(d, a, b);
        } else {
            d.setResourceId(b);
        }
    },
    isAssignedTo: function(d) {
        var c = this, b = c.getEventStore(), a = false;
        d = d instanceof Ext.ux.Scheduler2.model.Resource && d.getId() || d;
        if (b) {
            a = b.isEventAssignedToResource(c, d);
        } else {
            a = c.getResourceId() == d;
        }
        return a;
    },
    getAssignments: function() {
        var b = this, a = b.getEventStore();
        return a && a.getAssignmentsForEvent(b);
    },
    isDraggable: function() {
        return this.getDraggable();
    },
    isResizable: function() {
        return this.getResizable();
    },
    isPersistable: function() {
        var b = this, a = b.getEventStore();
        return a && a.isEventPersistable(b);
    }
});

Ext.define("Ext.ux.Scheduler2.data.EventStore", {
    extend: Ext.data.Store,
    alias: "store.eventstore",
    mixins: [ Ext.ux.Scheduler2.data.mixin.UniversalModelGetter, Ext.ux.Scheduler2.data.mixin.CacheHintHelper, Ext.ux.Scheduler2.data.mixin.EventStore, Ext.ux.Scheduler2.data.undoredo.mixin.StoreHint ],
    storeId: "events",
    model: "Ext.ux.Scheduler2.model.Event",
    config: {
        model: "Ext.ux.Scheduler2.model.Event"
    },
    constructor: function(a) {
        var b = this;
        b.callParent([ a ]);
        b.resourceStore && b.setResourceStore(b.resourceStore);
        b.assignmentStore && b.setAssignmentStore(b.assignmentStore);
        if (b.getModel() !== Ext.ux.Scheduler2.model.Event && !(b.getModel().prototype instanceof Ext.ux.Scheduler2.model.Event)) {
            throw "The model for the EventStore must subclass Ext.ux.Scheduler2.model.Event";
        }
    },
    append: function(a) {
        this.add(a);
    }
});

Ext.define("Ext.ux.Scheduler2.util.Patch", {
    target: null,
    minVersion: null,
    maxVersion: null,
    reportUrl: null,
    description: null,
    applyFn: null,
    ieOnly: false,
    macOnly: false,
    overrides: null,
    onClassExtended: function(a, b) {
        if (Ext.ux.Scheduler2.disableOverrides) {
            return;
        }
        if (b.ieOnly && !Ext.isIE) {
            return;
        }
        if (b.macOnly && !Ext.isMac) {
            return;
        }
        if ((!b.minVersion || Ext.versions.extjs.equals(b.minVersion) || Ext.versions.extjs.isGreaterThan(b.minVersion)) && (!b.maxVersion || Ext.versions.extjs.equals(b.maxVersion) || Ext.versions.extjs.isLessThan(b.maxVersion))) {
            if (b.applyFn) {
                b.applyFn();
            } else {
                Ext.ClassManager.get(b.target).override(b.overrides);
            }
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.OperationDestroy", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.data.operation.Destroy",
    minVersion: "5.1.1",
    maxVersion: "5.1.2",
    overrides: {
        doProcess: function() {
            var c = Ext.Array.slice(this.getRecords()), a = c.length, b;
            for (b = 0; b < a; ++b) {
                c[b].setErased();
            }
        }
    }
});

Ext.define("Ext.ux.Scheduler2.data.mixin.ResourceStore", {
    eventStore: null,
    getEventStore: function() {
        return this.eventStore;
    },
    setEventStore: function(a) {
        var b = this, c;
        if (b.eventStore !== a) {
            c = b.eventStore;
            b.eventStore = a && Ext.StoreMgr.lookup(a) || null;
            b.fireEvent("eventstorechange", b, a, c);
        }
    },
    getScheduledEventsInTimeSpan: function(e, a, c) {
        var b = [];
        var d = Ext.ux.Scheduler2.util.Date;
        c = c || this.getEventStore();
        Ext.Array.each(this.getRange(), function(f) {
            Ext.Array.each(c.getEventsForResource(f), function(g) {
                if (g.intersectsRange(e, a)) {
                    b.push(g);
                }
            });
        });
        return b;
    }
});

Ext.define("Ext.ux.Scheduler2.data.ResourceStore", {
    extend: Ext.data.Store,
    model: "Ext.ux.Scheduler2.model.Resource",
    config: {
        model: "Ext.ux.Scheduler2.model.Resource"
    },
    alias: "store.resourcestore",
    mixins: [ Ext.ux.Scheduler2.data.mixin.UniversalModelGetter, Ext.ux.Scheduler2.data.mixin.CacheHintHelper, Ext.ux.Scheduler2.data.mixin.ResourceStore, Ext.ux.Scheduler2.data.undoredo.mixin.StoreHint ],
    storeId: "resources",
    constructor: function() {
        this.callParent(arguments);
        if (this.getModel() !== Ext.ux.Scheduler2.model.Resource && !(this.getModel().prototype instanceof Ext.ux.Scheduler2.model.Resource)) {
            throw "The model for the ResourceStore must subclass Ext.ux.Scheduler2.model.Resource";
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.TreeStore", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.data.TreeStore",
    minVersion: "5.1.0",
    overrides: {
        getRejectRecords: function() {
            return this.getModifiedRecords();
        },
        rejectChanges: function() {
            this.removed = this.removedNodes;
            this.callParent(arguments);
        },
        remove: function(b) {
            if (b.isModel) {
                b.remove();
            } else {
                if (b instanceof Array && b[0].isModel) {
                    for (var a = 0; a < b.length; a++) {
                        b[a].remove();
                    }
                } else {
                    this.callParent(arguments);
                }
            }
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.TreeStoreInternalIdMap", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.data.TreeStore",
    minVersion: "5.1.1",
    overrides: {
        registerNode: function(c, a) {
            var b = this;
            if (!b.byInternalIdMap) {
                b.byInternalIdMap = {};
            }
            b.byInternalIdMap[c.internalId] = c;
            b.callParent(arguments);
        },
        unregisterNode: function(c, a) {
            var b = this;
            if (b.byInternalIdMap) {
                delete b.byInternalIdMap[c.internalId];
            }
            b.callParent(arguments);
        },
        updateRoot: function() {
            this.byInternalIdMap = {};
            this.callParent(arguments);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.NodeStore", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.data.NodeStore",
    ieOnly: true,
    maxVersion: "5.1.1",
    overrides: {
        afterEdit: function(a, b) {
            if (this.getNode() && b) {
                if (Ext.Array.indexOf(b, "loaded") !== -1) {
                    return this.add(this.retrieveChildNodes(a));
                }
                if (Ext.Array.indexOf(b, "expanded") !== -1) {
                    return this.filter();
                }
                if (Ext.Array.indexOf(b, "sorted") !== -1) {
                    return this.sort();
                }
            }
            Ext.data.Store.prototype.afterEdit.apply(this, arguments);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.data.mixin.FilterableTreeStore", {
    isFilteredFlag: false,
    isHiddenFlag: false,
    treeFilter: null,
    lastTreeFilter: null,
    lastTreeHiding: null,
    allowExpandCollapseWhileFiltered: true,
    reApplyFilterOnDataChange: true,
    suspendIncrementalFilterRefresh: 0,
    filterGeneration: 0,
    currentFilterGeneration: null,
    dataChangeListeners: null,
    monitoringDataChange: false,
    filterUpdateSuspended: false,
    onClassMixedIn: function(a) {
        a.override(Ext.ux.Scheduler2.data.mixin.FilterableTreeStore.prototype.inheritables() || {});
    },
    initTreeFiltering: function() {
        this.treeFilter = new Ext.util.Filter({
            filterFn: this.isNodeFilteredIn,
            scope: this
        });
        this.dataChangeListeners = {
            nodeappend: this.onNeedToUpdateFilter,
            nodeinsert: this.onNeedToUpdateFilter,
            scope: this
        };
        Ext.apply(this.dataChangeListeners, {
            beforeload: this.onStoreBeforeLoad,
            load: this.onStoreLoad
        });
    },
    onStoreBeforeLoad: function() {
        this.filterUpdateSuspended = true;
    },
    onStoreLoad: function() {
        this.filterUpdateSuspended = false;
        this.onNeedToUpdateFilter();
    },
    startDataChangeMonitoring: function() {
        if (this.monitoringDataChange) {
            return;
        }
        this.monitoringDataChange = true;
        this.on(this.dataChangeListeners);
    },
    stopDataChangeMonitoring: function() {
        if (!this.monitoringDataChange) {
            return;
        }
        this.monitoringDataChange = false;
        this.un(this.dataChangeListeners);
    },
    onNeedToUpdateFilter: function() {
        if (this.reApplyFilterOnDataChange && !this.filterUpdateSuspended && !this.suspendIncrementalFilterRefresh) {
            this.reApplyFilter();
        }
    },
    clearTreeFilter: function() {
        if (!this.isTreeFiltered()) {
            return;
        }
        this.currentFilterGeneration = null;
        this.isFilteredFlag = false;
        this.lastTreeFilter = null;
        if (!this.isTreeFiltered(true)) {
            this.stopDataChangeMonitoring();
        }
        this.refreshNodeStoreContent();
        this.fireEvent("filter-clear", this);
    },
    reApplyFilter: function() {
        if (this.isHiddenFlag) {
            this.hideNodesBy.apply(this, this.lastTreeHiding.concat(this.isFilteredFlag));
        }
        if (this.isFilteredFlag) {
            this.filterTreeBy(this.lastTreeFilter);
        }
    },
    refreshNodeStoreContent: function() {
        var b = this, a = b.getFilters();
        if (a.indexOf(b.treeFilter) < 0) {
            b.addFilter(b.treeFilter);
        } else {
            this.getFilters().fireEvent("endupdate", this.getFilters());
        }
    },
    getIndexInTotalDataset: function(d) {
        var c = this.getRootNode(), f = -1;
        var g = this.rootVisible;
        if (!g && d == c) {
            return -1;
        }
        var b = this.isTreeFiltered();
        var a = this.currentFilterGeneration;
        var e = function(j) {
            if (b && j.__filterGen != a || j.hidden) {
                if (j == d) {
                    return false;
                }
            }
            if (g || j != c) {
                f++;
            }
            if (j == d) {
                return false;
            }
            if (!j.isLeaf() && j.isExpanded()) {
                var l = j.childNodes, i = l.length;
                for (var h = 0; h < i; h++) {
                    if (e(l[h]) === false) {
                        return false;
                    }
                }
            }
        };
        e(c);
        return f;
    },
    isTreeFiltered: function(a) {
        return this.isFilteredFlag || a && this.isHiddenFlag;
    },
    markFilteredNodes: function(i, b) {
        var h = this;
        var d = this.currentFilterGeneration;
        var c = {};
        var j = this.getRootNode(), l = this.rootVisible;
        var o = function(q) {
            var p = q.parentNode;
            while (p && !c[p.internalId]) {
                c[p.internalId] = true;
                p = p.parentNode;
            }
        };
        var a = b.filter;
        var n = b.scope || this;
        var k = b.shallow;
        var m = b.checkParents || k;
        var f = b.fullMatchingParents;
        var e = b.onlyParents || f;
        if (e && m) {
            throw new Error("Can't combine `onlyParents` and `checkParents` options");
        }
        if (l) {
            c[j.internalId] = true;
        }
        var g = function(s) {
            s.addedWhileFiltered = false;
            if (s.hidden) {
                return;
            }
            var q, t, r, p;
            if (s.isLeaf()) {
                if (a.call(n, s, c)) {
                    c[s.internalId] = true;
                    o(s);
                }
            } else {
                if (e) {
                    q = a.call(n, s);
                    t = s.childNodes;
                    r = t.length;
                    if (q) {
                        c[s.internalId] = true;
                        o(s);
                        if (f) {
                            s.cascadeBy(function(u) {
                                c[u.internalId] = true;
                            });
                            return;
                        }
                    }
                    for (p = 0; p < r; p++) {
                        if (q && t[p].isLeaf()) {
                            c[t[p].internalId] = true;
                        } else {
                            if (!t[p].isLeaf()) {
                                g(t[p]);
                            }
                        }
                    }
                } else {
                    if (m) {
                        q = a.call(n, s, c);
                        if (q) {
                            c[s.internalId] = true;
                            o(s);
                        }
                    }
                    if (!m || !k || k && (q || s == j && !l)) {
                        t = s.childNodes;
                        r = t.length;
                        for (p = 0; p < r; p++) {
                            g(t[p]);
                        }
                    }
                }
            }
        };
        g(i);
        j.cascadeBy(function(p) {
            if (c[p.internalId]) {
                p.__filterGen = d;
                if (h.allowExpandCollapseWhileFiltered && !p.isLeaf()) {
                    p.expand();
                }
            }
        });
    },
    filterTreeBy: function(c, b) {
        this.currentFilterGeneration = this.filterGeneration++;
        var a;
        if (arguments.length == 1 && Ext.isObject(arguments[0])) {
            b = c.scope;
            a = c.filter;
        } else {
            a = c;
            c = {
                filter: a,
                scope: b
            };
        }
        this.fireEvent("nodestore-datachange-start", this);
        c = c || {};
        this.markFilteredNodes(this.getRootNode(), c);
        this.startDataChangeMonitoring();
        this.isFilteredFlag = true;
        this.lastTreeFilter = c;
        this.fireEvent("nodestore-datachange-end", this);
        this.fireEvent("filter-set", this);
        this.refreshNodeStoreContent();
    },
    isNodeFilteredIn: function(c) {
        var b = this.isTreeFiltered();
        var a = this.currentFilterGeneration;
        return this.loading || !Boolean(b && c.__filterGen != a || c.hidden);
    },
    hasNativeFilters: function() {
        var c = this, b = c.getFilters(), a = b.getCount();
        return a && a > 1 || b.indexOf(c.treeFilter) < 0;
    },
    hideNodesBy: function(b, a, d) {
        var c = this;
        if (c.isFiltered() && c.hasNativeFilters()) {
            throw new Error("Can't hide nodes of a filtered tree store");
        }
        a = a || c;
        c.getRootNode().cascadeBy(function(e) {
            e.hidden = Boolean(b.call(a, e, c));
        });
        c.startDataChangeMonitoring();
        c.isHiddenFlag = true;
        c.lastTreeHiding = [ b, a ];
        if (!d) {
            c.refreshNodeStoreContent();
        }
    },
    showAllNodes: function(a) {
        this.getRootNode().cascadeBy(function(b) {
            b.hidden = false;
        });
        this.isHiddenFlag = false;
        this.lastTreeHiding = null;
        if (!this.isTreeFiltered(true)) {
            this.stopDataChangeMonitoring();
        }
        if (!a) {
            this.refreshNodeStoreContent();
        }
    },
    inheritables: function() {
        return {
            onNodeExpand: function(c, b, a) {
                if (this.isTreeFiltered(true) && c == this.getRoot()) {
                    this.callParent(arguments);
                    this.reApplyFilter();
                } else {
                    return this.callParent(arguments);
                }
            },
            onNodeCollapse: function(g, b, j, i, k) {
                var f = this;
                var d = f.data;
                var l = d.contains;
                var c = f.isTreeFiltered();
                var e = f.currentFilterGeneration;
                d.contains = function() {
                    var p, o, r;
                    var n = f.indexOf(g) + 1;
                    var q = false;
                    for (var m = 0; m < b.length; m++) {
                        if (!(b[m].hidden || c && b[m].__filterGen != e) && l.call(this, b[m])) {
                            p = g;
                            while (p.parentNode) {
                                o = p;
                                do {
                                    o = o.nextSibling;
                                } while (o && (o.hidden || c && o.__filterGen != e));
                                if (o) {
                                    q = true;
                                    r = f.indexOf(o);
                                    break;
                                } else {
                                    p = p.parentNode;
                                }
                            }
                            if (!q) {
                                r = f.getCount();
                            }
                            f.removeAt(n, r - n);
                            break;
                        }
                    }
                    return false;
                };
                this.callParent(arguments);
                if (this.isTreeFiltered()) {
                    if (f.needsLocalFilter()) {
                        b = Ext.Array.filter(b, f.filterVisible);
                    }
                    if (!b.length) {
                        var h = f.indexOf(g) + 1;
                        var a = f.indexOfNextVisibleNode(g);
                        f.removeAt(h, a - h);
                    }
                }
                d.contains = l;
            },
            handleNodeExpand: function(h, a, j) {
                var e = this;
                var f = [];
                var b = e.isTreeFiltered();
                var g = e.currentFilterGeneration;
                for (var c = 0; c < a.length; c++) {
                    var d = a[c];
                    if (!(b && d.__filterGen != g || d.hidden)) {
                        f[f.length] = d;
                    }
                }
                return this.callParent([ h, f, j ]);
            },
            onNodeInsert: function(n, a, g) {
                var j = this, h, o, k, b, l, f, c = a.raw || a.data, m, e, d, i = this.isTreeFiltered();
                if (j.filterFn) {
                    e = j.filterFn(a);
                    a.set("visible", e);
                    if (e) {
                        n.set("visible", j.filterFn(n));
                    }
                }
                if (!this.reApplyFilterOnDataChange && i) {
                    a.addedWhileFiltered = true;
                }
                j.registerNode(a, true);
                j.beginUpdate();
                if (j.isVisible(a) || i && a.addedWhileFiltered) {
                    if (g === 0 || !a.previousSibling) {
                        h = n;
                    } else {
                        for (o = a.previousSibling; o && !o.addedWhileFiltered && !o.get("visible"); o = o.previousSibling) {}
                        if (!o) {
                            h = n;
                        } else {
                            while (o.isExpanded() && o.lastChild) {
                                o = o.lastChild;
                            }
                            for (;o && !o.addedWhileFiltered && !o.get("visible"); o = o.previousSibling) {}
                            h = o;
                        }
                    }
                    j.insert(j.indexOf(h) + 1, a);
                    if (!a.isLeaf() && a.isExpanded()) {
                        if (a.isLoaded()) {
                            j.onNodeExpand(a, a.childNodes);
                        } else {
                            if (!j.fillCount) {
                                a.set("expanded", false);
                                a.expand();
                            }
                        }
                    }
                } else {
                    j.needsSync = j.needsSync || a.phantom || a.dirty;
                }
                if (!a.isLeaf() && !a.isLoaded() && !j.lazyFill) {
                    k = j.getProxy().getReader();
                    b = a.getProxy();
                    l = b ? b.getReader() : null;
                    f = l && l.initialConfig.rootProperty ? l : k;
                    m = f.getRoot(c);
                    if (m) {
                        d = a.childType;
                        j.fillNode(a, f.extractData(m, d ? {
                            model: d
                        } : undefined));
                    }
                }
                j.endUpdate();
            },
            isFiltered: function() {
                return this.callParent(arguments) || this.isTreeFiltered();
            }
        };
    }
});

Ext.define("Ext.ux.Scheduler2.data.ResourceTreeStore", {
    extend: Ext.data.TreeStore,
    mixins: [ Ext.ux.Scheduler2.patches.NodeStore, Ext.ux.Scheduler2.data.mixin.UniversalModelGetter, Ext.ux.Scheduler2.data.mixin.CacheHintHelper, Ext.ux.Scheduler2.data.mixin.ResourceStore, Ext.ux.Scheduler2.data.mixin.FilterableTreeStore, Ext.ux.Scheduler2.data.undoredo.mixin.StoreHint ],
    alias: "store.resourcetreestore",
    model: "Ext.ux.Scheduler2.model.Resource",
    storeId: "resources",
    constructor: function() {
        this.callParent(arguments);
        this.initTreeFiltering();
        if (this.getModel() !== Ext.ux.Scheduler2.model.Resource && !(this.getModel().prototype instanceof Ext.ux.Scheduler2.model.Resource)) {
            throw "The model for the ResourceTreeStore must subclass Ext.ux.Scheduler2.model.Resource";
        }
    },
    setRootNode: function() {
        this.isSettingRoot = true;
        var a = this.callParent(arguments);
        this.isSettingRoot = false;
        return a;
    }
});

Ext.define("Ext.ux.Scheduler2.model.TimeAxisTick", {
    extend: Ext.ux.Scheduler2.model.Range,
    startDateField: "start",
    endDateField: "end"
});

Ext.define("Ext.ux.Scheduler2.data.TimeAxis", {
    extend: Ext.data.JsonStore,
    model: "Ext.ux.Scheduler2.model.TimeAxisTick",
    continuous: true,
    originalContinuous: null,
    autoAdjust: true,
    unit: null,
    increment: null,
    resolutionUnit: null,
    resolutionIncrement: null,
    weekStartDay: null,
    mainUnit: null,
    shiftUnit: null,
    shiftIncrement: 1,
    defaultSpan: 1,
    isConfigured: false,
    adjustedStart: null,
    adjustedEnd: null,
    visibleTickStart: null,
    visibleTickEnd: null,
    presetName: null,
    mode: "plain",
    startTime: 0,
    endTime: 24,
    constructor: function(a) {
        var c = this;
        a = a || {};
        if (c.setModel) {
            c.setModel(c.model);
        }
        c.setMode(a.mode || c.mode);
        c.originalContinuous = c.continuous;
        c.callParent(arguments);
        c.on(Ext.versions.touch ? "refresh" : "datachanged", function(d) {
            c.fireEvent("reconfigure", c, false);
        });
        c.on("endreconfigure", function(d, e) {
            d.fireEvent("reconfigure", d, e);
        });
        if (a.viewPreset) {
            var b = Ext.ux.Scheduler2.preset.Manager.getPreset(a.viewPreset);
            b && c.consumeViewPreset(b);
        }
        if (a.start || c.start) {
            c.reconfigure(a);
        }
    },
    reconfigure: function(d, a) {
        this.isConfigured = true;
        Ext.apply(this, d);
        var k = this.getAdjustedDates(d.start, d.end, true);
        var j = this.getAdjustedDates(d.start, d.end);
        var b = j.start;
        var e = j.end;
        if (this.fireEvent("beforereconfigure", this, b, e) !== false) {
            this.fireEvent("beginreconfigure", this);
            var h = this.unit;
            var i = this.increment || 1;
            var g = this.generateTicks(b, e, h, i, this.mainUnit);
            this.removeAll(true);
            this.suspendEvents();
            this.add(g);
            if (this.getCount() === 0) {
                Ext.Error.raise("Invalid time axis configuration or filter, please check your input data.");
            }
            this.resumeEvents();
            var c = Ext.ux.Scheduler2.util.Date;
            var f = g.length;
            if (this.isContinuous()) {
                this.adjustedStart = k.start;
                this.adjustedEnd = this.getNext(f > 1 ? g[f - 1].start : k.start, h, i);
            } else {
                this.adjustedStart = this.getStart();
                this.adjustedEnd = this.getEnd();
            }
            do {
                this.visibleTickStart = (this.getStart() - this.adjustedStart) / (c.getUnitDurationInMs(h) * i);
                if (this.visibleTickStart >= 1) {
                    this.adjustedStart = c.getNext(this.adjustedStart, h, i);
                }
            } while (this.visibleTickStart >= 1);
            do {
                this.visibleTickEnd = f - (this.adjustedEnd - this.getEnd()) / (c.getUnitDurationInMs(h) * i);
                if (f - this.visibleTickEnd >= 1) {
                    this.adjustedEnd = c.getNext(this.adjustedEnd, h, -1);
                }
            } while (f - this.visibleTickEnd >= 1);
            this.fireEvent("endreconfigure", this, a);
        }
    },
    setMode: function(a) {
        this.mode = a;
        if (a === "calendar") {
            this.generateTicksValidatorFn = function(b) {
                if (this.startTime > 0 || this.endTime < 24) {
                    return b.getHours() >= this.startTime && b.getHours() < this.endTime;
                } else {
                    return true;
                }
            };
        } else {
            this.generateTicksValidatorFn = function() {
                return true;
            };
        }
    },
    setTimeSpan: function(c, a) {
        var b = this.getAdjustedDates(c, a);
        c = b.start;
        a = b.end;
        if (this.getStart() - c !== 0 || this.getEnd() - a !== 0) {
            this.reconfigure({
                start: c,
                end: a
            });
        }
    },
    filterBy: function(b, a) {
        this.continuous = false;
        a = a || this;
        this.clearFilter(true);
        this.suspendEvents(true);
        this.filter([ {
            filterFn: function(d, c) {
                return b.call(a, d.data, c);
            }
        } ]);
        if (this.getCount() === 0) {
            this.clearFilter();
            this.resumeEvents();
            Ext.Error.raise("Invalid time axis filter - no ticks passed through the filter. Please check your filter method.");
        }
        this.resumeEvents();
    },
    isContinuous: function() {
        return this.continuous && !this.isFiltered();
    },
    clearFilter: function() {
        this.continuous = this.originalContinuous;
        this.callParent(arguments);
    },
    generateTicks: function(a, d, g, i) {
        var h = [], f, b = Ext.ux.Scheduler2.util.Date, e = 0;
        g = g || this.unit;
        i = i || this.increment;
        var j = this.getAdjustedDates(a, d);
        a = j.start;
        d = j.end;
        while (a < d) {
            f = this.getNext(a, g, i);
            if (!this.autoAdjust && f > d) {
                f = d;
            }
            if (g === b.HOUR && i > 1 && h.length > 0 && e === 0) {
                var c = h[h.length - 1];
                e = (c.start.getHours() + i) % 24 - c.end.getHours();
                if (e !== 0) {
                    f = b.add(f, b.HOUR, e);
                }
            }
            this.generateTicksValidatorFn(a) && h.push({
                start: a,
                end: f
            });
            a = f;
        }
        return h;
    },
    getVisibleTickTimeSpan: function() {
        return this.isContinuous() ? this.visibleTickEnd - this.visibleTickStart : this.getCount();
    },
    getAdjustedDates: function(b, e, d) {
        var c = Ext.ux.Scheduler2.util.Date;
        b = b || this.getStart();
        e = e || c.add(b, this.mainUnit, this.defaultSpan);
        if (this.mode === "calendar") {
            if (this.shiftUnit === c.MONTH) {
                var g = c.add(b, c.WEEK, 1);
                var f = c.add(e, c.WEEK, -1);
                if (!e) {
                    e = this.getNext(b, this.shiftUnit, 1);
                    e = this.ceilDate(e, false, this.shiftUnit, 1);
                    e = this.ceilDate(e, false, this.mainUnit, 1);
                }
                if (g.getMonth() !== b.getMonth() && f.getMonth() !== e.getMonth()) {
                    return {
                        start: b,
                        end: e
                    };
                }
            }
            var i = this.floorDate(b, false, this.shiftUnit, 1);
            i = this.floorDate(i, false, this.mainUnit, 1);
            var h = this.getNext(b, this.shiftUnit, 1);
            var a = this.ceilDate(h, false, this.shiftUnit, 1);
            a = this.ceilDate(a, false, this.mainUnit, 1);
            return {
                start: i,
                end: a
            };
        } else {
            return this.autoAdjust || d ? {
                start: this.floorDate(b, false, this.autoAdjust ? this.mainUnit : this.unit, 1),
                end: this.ceilDate(e, false, this.autoAdjust ? this.mainUnit : this.unit, 1)
            } : {
                start: b,
                end: e
            };
        }
    },
    getTickFromDate: function(d) {
        var j = this.data.items;
        var h = j.length - 1;
        if (d < j[0].data.start || d > j[h].data.end) {
            return -1;
        }
        var f, g, b;
        if (this.isContinuous()) {
            if (d - j[0].data.start === 0) {
                return this.visibleTickStart;
            }
            if (d - j[h].data.end === 0) {
                return this.visibleTickEnd;
            }
            var k = this.adjustedStart;
            var a = this.adjustedEnd;
            var c = Math.floor(j.length * (d - k) / (a - k));
            if (c > h) {
                c = h;
            }
            g = c === 0 ? k : j[c].data.start;
            b = c == h ? a : j[c].data.end;
            f = c + (d - g) / (b - g);
            if (f < this.visibleTickStart || f > this.visibleTickEnd) {
                return -1;
            }
            return f;
        } else {
            for (var e = 0; e <= h; e++) {
                b = j[e].data.end;
                if (d <= b) {
                    g = j[e].data.start;
                    f = e + (d > g ? (d - g) / (b - g) : 0);
                    return f;
                }
            }
        }
        return -1;
    },
    getDateFromTick: function(e, i) {
        if (e === this.visibleTickEnd) {
            return this.getEnd();
        }
        var b = Math.floor(e), g = e - b, h = this.getAt(b);
        if (!h) {
            return null;
        }
        var f = h.data;
        var a = b === 0 ? this.adjustedStart : f.start;
        var d = b == this.getCount() - 1 && this.isContinuous() ? this.adjustedEnd : f.end;
        var c = Ext.ux.Scheduler2.util.Date.add(a, Ext.ux.Scheduler2.util.Date.MILLI, g * (d - a));
        if (i) {
            c = this[i + "Date"](c);
        }
        return c;
    },
    getTicks: function() {
        var a = [];
        this.each(function(b) {
            a.push(b.data);
        });
        return a;
    },
    getStart: function() {
        var a = this.first();
        if (a) {
            return new Date(a.data.start);
        }
        return null;
    },
    getEnd: function() {
        var a = this.last();
        if (a) {
            return new Date(a.data.end);
        }
        return null;
    },
    floorDate: function(e, g, h, a) {
        g = g !== false;
        var c = Ext.Date.clone(e), d = g ? this.getStart() : null, l = a || this.resolutionIncrement, k;
        if (h) {
            k = h;
        } else {
            k = g ? this.resolutionUnit : this.mainUnit;
        }
        var b = Ext.ux.Scheduler2.util.Date;
        var f = function(n, m) {
            return Math.floor(n / m) * m;
        };
        switch (k) {
          case b.MILLI:
            if (g) {
                c = b.add(d, b.MILLI, f(b.getDurationInMilliseconds(d, c), l));
            }
            break;

          case b.SECOND:
            if (g) {
                c = b.add(d, b.MILLI, f(b.getDurationInSeconds(d, c), l) * 1e3);
            } else {
                c.setMilliseconds(0);
                c.setSeconds(f(c.getSeconds(), l));
            }
            break;

          case b.MINUTE:
            if (g) {
                c = b.add(d, b.SECOND, f(b.getDurationInMinutes(d, c), l) * 60);
            } else {
                c.setMinutes(f(c.getMinutes(), l));
                c.setSeconds(0);
                c.setMilliseconds(0);
            }
            break;

          case b.HOUR:
            if (g) {
                c = b.add(d, b.MINUTE, f(b.getDurationInHours(this.getStart(), c), l) * 60);
            } else {
                c.setMinutes(0);
                c.setSeconds(0);
                c.setMilliseconds(0);
                c.setHours(f(c.getHours(), l));
            }
            break;

          case b.DAY:
            if (g) {
                c = b.add(d, b.DAY, f(b.getDurationInDays(d, c), l));
            } else {
                Ext.ux.Scheduler2.util.Date.clearTime(c);
                c.setDate(f(c.getDate() - 1, l) + 1);
            }
            break;

          case b.WEEK:
            var j = c.getDay() || 7;
            var i = this.weekStartDay || 7;
            Ext.ux.Scheduler2.util.Date.clearTime(c);
            c = b.add(c, b.DAY, j >= i ? i - j : -(7 - i + j));
            if (c.getDay() !== i && c.getHours() === 23) {
                c = b.add(c, b.HOUR, 1);
            }
            break;

          case b.MONTH:
            if (g) {
                c = b.add(d, b.MONTH, f(b.getDurationInMonths(d, c), l));
            } else {
                Ext.ux.Scheduler2.util.Date.clearTime(c);
                c.setDate(1);
                c.setMonth(f(c.getMonth(), l));
            }
            break;

          case b.QUARTER:
            Ext.ux.Scheduler2.util.Date.clearTime(c);
            c.setDate(1);
            c = b.add(c, b.MONTH, -(c.getMonth() % 3));
            break;

          case b.YEAR:
            if (g) {
                c = b.add(d, b.YEAR, f(b.getDurationInYears(d, c), l));
            } else {
                c = new Date(f(e.getFullYear() - 1, l) + 1, 0, 1);
            }
            break;
        }
        return c;
    },
    roundDate: function(r, b) {
        var l = Ext.Date.clone(r), s = this.resolutionIncrement;
        b = b || this.getStart();
        switch (this.resolutionUnit) {
          case Ext.ux.Scheduler2.util.Date.MILLI:
            var e = Ext.ux.Scheduler2.util.Date.getDurationInMilliseconds(b, l), d = Math.round(e / s) * s;
            l = Ext.ux.Scheduler2.util.Date.add(b, Ext.ux.Scheduler2.util.Date.MILLI, d);
            break;

          case Ext.ux.Scheduler2.util.Date.SECOND:
            var i = Ext.ux.Scheduler2.util.Date.getDurationInSeconds(b, l), q = Math.round(i / s) * s;
            l = Ext.ux.Scheduler2.util.Date.add(b, Ext.ux.Scheduler2.util.Date.MILLI, q * 1e3);
            break;

          case Ext.ux.Scheduler2.util.Date.MINUTE:
            var n = Ext.ux.Scheduler2.util.Date.getDurationInMinutes(b, l), a = Math.round(n / s) * s;
            l = Ext.ux.Scheduler2.util.Date.add(b, Ext.ux.Scheduler2.util.Date.SECOND, a * 60);
            break;

          case Ext.ux.Scheduler2.util.Date.HOUR:
            var m = Ext.ux.Scheduler2.util.Date.getDurationInHours(b, l), j = Math.round(m / s) * s;
            l = Ext.ux.Scheduler2.util.Date.add(b, Ext.ux.Scheduler2.util.Date.MINUTE, j * 60);
            break;

          case Ext.ux.Scheduler2.util.Date.DAY:
            var c = Ext.ux.Scheduler2.util.Date.getDurationInDays(b, l), f = Math.round(c / s) * s;
            l = Ext.ux.Scheduler2.util.Date.add(b, Ext.ux.Scheduler2.util.Date.DAY, f);
            break;

          case Ext.ux.Scheduler2.util.Date.WEEK:
            Ext.ux.Scheduler2.util.Date.clearTime(l);
            var o = l.getDay() - this.weekStartDay, t;
            if (o < 0) {
                o = 7 + o;
            }
            if (Math.round(o / 7) === 1) {
                t = 7 - o;
            } else {
                t = -o;
            }
            l = Ext.ux.Scheduler2.util.Date.add(l, Ext.ux.Scheduler2.util.Date.DAY, t);
            break;

          case Ext.ux.Scheduler2.util.Date.MONTH:
            var p = Ext.ux.Scheduler2.util.Date.getDurationInMonths(b, l) + l.getDate() / Ext.Date.getDaysInMonth(l), h = Math.round(p / s) * s;
            l = Ext.ux.Scheduler2.util.Date.add(b, Ext.ux.Scheduler2.util.Date.MONTH, h);
            break;

          case Ext.ux.Scheduler2.util.Date.QUARTER:
            Ext.ux.Scheduler2.util.Date.clearTime(l);
            l.setDate(1);
            l = Ext.ux.Scheduler2.util.Date.add(l, Ext.ux.Scheduler2.util.Date.MONTH, 3 - l.getMonth() % 3);
            break;

          case Ext.ux.Scheduler2.util.Date.YEAR:
            var k = Ext.ux.Scheduler2.util.Date.getDurationInYears(b, l), g = Math.round(k / s) * s;
            l = Ext.ux.Scheduler2.util.Date.add(b, Ext.ux.Scheduler2.util.Date.YEAR, g);
            break;
        }
        return l;
    },
    ceilDate: function(c, b, f) {
        var e = Ext.Date.clone(c);
        b = b !== false;
        var a = b ? this.resolutionIncrement : 1, g = false, d;
        if (f) {
            d = f;
        } else {
            d = b ? this.resolutionUnit : this.mainUnit;
        }
        switch (d) {
          case Ext.ux.Scheduler2.util.Date.HOUR:
            if (e.getMinutes() > 0 || e.getSeconds() > 0 || e.getMilliseconds() > 0) {
                g = true;
            }
            break;

          case Ext.ux.Scheduler2.util.Date.DAY:
            if (e.getHours() > 0 || e.getMinutes() > 0 || e.getSeconds() > 0 || e.getMilliseconds() > 0) {
                g = true;
            }
            break;

          case Ext.ux.Scheduler2.util.Date.WEEK:
            Ext.ux.Scheduler2.util.Date.clearTime(e);
            if (e.getDay() !== this.weekStartDay || c.getTime() - e.getTime() > 0) {
                g = true;
            }
            break;

          case Ext.ux.Scheduler2.util.Date.MONTH:
            Ext.ux.Scheduler2.util.Date.clearTime(e);
            if (e.getDate() !== 1 || c.getTime() - e.getTime() > 0) {
                g = true;
            }
            break;

          case Ext.ux.Scheduler2.util.Date.QUARTER:
            Ext.ux.Scheduler2.util.Date.clearTime(e);
            if (e.getMonth() % 3 !== 0 || e.getDate() !== 1 || c.getTime() - e.getTime() > 0) {
                g = true;
            }
            break;

          case Ext.ux.Scheduler2.util.Date.YEAR:
            Ext.ux.Scheduler2.util.Date.clearTime(e);
            if (e.getMonth() !== 0 || e.getDate() !== 1 || c.getTime() - e.getTime() > 0) {
                g = true;
            }
            break;

          default:
            break;
        }
        if (g) {
            return this.getNext(e, d, a);
        } else {
            return e;
        }
    },
    getNext: function(b, c, a) {
        return Ext.ux.Scheduler2.util.Date.getNext(b, c, a, this.weekStartDay);
    },
    getResolution: function() {
        return {
            unit: this.resolutionUnit,
            increment: this.resolutionIncrement
        };
    },
    setResolution: function(b, a) {
        this.resolutionUnit = b;
        this.resolutionIncrement = a || 1;
    },
    shift: function(a, b) {
        this.setTimeSpan(Ext.ux.Scheduler2.util.Date.add(this.getStart(), b, a), Ext.ux.Scheduler2.util.Date.add(this.getEnd(), b, a));
    },
    shiftNext: function(a) {
        a = a || this.getShiftIncrement();
        var b = this.getShiftUnit();
        this.setTimeSpan(Ext.ux.Scheduler2.util.Date.add(this.getStart(), b, a), Ext.ux.Scheduler2.util.Date.add(this.getEnd(), b, a));
    },
    shiftPrevious: function(a) {
        a = -(a || this.getShiftIncrement());
        var b = this.getShiftUnit();
        this.setTimeSpan(Ext.ux.Scheduler2.util.Date.add(this.getStart(), b, a), Ext.ux.Scheduler2.util.Date.add(this.getEnd(), b, a));
    },
    getShiftUnit: function() {
        return this.shiftUnit || this.mainUnit;
    },
    getShiftIncrement: function() {
        return this.shiftIncrement || 1;
    },
    getUnit: function() {
        return this.unit;
    },
    getIncrement: function() {
        return this.increment;
    },
    getRowTicks: function() {
        if (this.mode === "plain") {
            return;
        } else {
            var c = this.getStart();
            var a = Ext.ux.Scheduler2.util.Date.add(c, this.headerConfig.middle.splitUnit, 1);
            var b = this.findBy(function(d) {
                return d.getStartDate().getTime() >= a.getTime();
            });
            if (b === -1) {
                return this.getRange();
            }
            return this.getRange(0, b - 1);
        }
    },
    dateInAxis: function(a) {
        return Ext.ux.Scheduler2.util.Date.betweenLesser(a, this.getStart(), this.getEnd());
    },
    timeSpanInAxis: function(b, a) {
        if (this.isContinuous()) {
            return Ext.ux.Scheduler2.util.Date.intersectSpans(b, a, this.getStart(), this.getEnd());
        } else {
            return b < this.getStart() && a > this.getEnd() || this.getTickFromDate(b) !== this.getTickFromDate(a);
        }
    },
    isRangeInAxis: function(b) {
        var c = b.getStartDate(), a = b.getEndDate();
        if (!c || !a) {
            return false;
        }
        return this.timeSpanInAxis(c, a);
    },
    forEachAuxInterval: function(h, b, a, f) {
        f = f || this;
        var c = this.getEnd(), g = this.getStart(), e = 0, d;
        if (g > c) {
            throw "Invalid time axis configuration";
        }
        while (g < c) {
            d = Ext.ux.Scheduler2.util.Date.min(this.getNext(g, h, b || 1), c);
            a.call(f, g, d, e);
            g = d;
            e++;
        }
    },
    consumeViewPreset: function(a) {
        Ext.apply(this, {
            unit: a.getBottomHeader().unit,
            increment: a.getBottomHeader().increment || 1,
            resolutionUnit: a.timeResolution.unit,
            resolutionIncrement: a.timeResolution.increment,
            mainUnit: a.getMainHeader().unit,
            shiftUnit: a.shiftUnit,
            shiftIncrement: a.shiftIncrement || 1,
            defaultSpan: a.defaultSpan || 1,
            presetName: a.name,
            headerConfig: a.headerConfig
        });
    }
});

Ext.define("Ext.ux.Scheduler2.data.undoredo.Manager", {
    extend: Ext.util.Observable,
    stores: null,
    storesById: null,
    treeStoreListeners: null,
    flatStoreListeners: null,
    undoQueue: null,
    redoQueue: null,
    ignoredFieldNames: {
        expanded: 1
    },
    state: "created",
    transactionBoundary: "manual",
    transactionMaxDuration: 100,
    transactionTimeout: null,
    currentTransaction: null,
    constructor: function(b) {
        var c = this;
        b = b || {};
        Ext.apply(c, b);
        c.treeStoreListeners = {
            nodeappend: c.onTreeStoreAppend,
            nodeinsert: c.onTreeStoreInsert,
            noderemove: c.onTreeStoreRemove,
            update: c.onTreeStoreUpdate,
            load: c.clearQueues,
            clear: c.clearQueues,
            scope: c
        };
        c.flatStoreListeners = {
            add: c.onFlatStoreAdd,
            remove: c.onFlatStoreRemove,
            update: c.onFlatStoreUpdate,
            load: c.clearQueues,
            clear: c.clearQueues,
            scope: c
        };
        c.callParent([ b ]);
        var a = c.stores || [];
        c.stores = [];
        c.storesById = {};
        c.undoQueue = [];
        c.redoQueue = [];
        Ext.Array.forEach(a, function(d) {
            c.addStore(d);
        });
    },
    addStore: function(a) {
        a = Ext.data.StoreMgr.lookup(a);
        Ext.Assert && Ext.Assert.isObject(a, "Must provide a store or a valid store id");
        this.stores.push(a);
        this.storesById[a.storeId] = a;
    },
    getStoreById: function(a) {
        return this.storesById[a];
    },
    bindStore: function(a) {
        (a.undoRedoEventBus || a).on(this.getStoreTypeListeners(a));
    },
    unbindStore: function(a) {
        (a.undoRedoEventBus || a).un(this.getStoreTypeListeners(a));
    },
    getStoreTypeListeners: function(a) {
        var b;
        if (Ext.data.TreeStore && a instanceof Ext.data.TreeStore) {
            b = this.treeStoreListeners;
        } else {
            b = this.flatStoreListeners;
        }
        return b;
    },
    removeStore: function(a) {
        Ext.Array.remove(this.stores, a);
        this.storesById[a.storeId] = null;
        this.unbindStore(a);
    },
    forEachStore: function(a) {
        Ext.Array.forEach(this.stores, a, this);
    },
    onAnyChangeInAnyStore: function(a) {
        if (this.state === "paused" || a.isRootSettingOrLoading && a.isRootSettingOrLoading()) {
            return false;
        }
        if (!this.currentTransaction) {
            this.startTransaction();
        }
        return true;
    },
    hasPersistableChanges: function(a, c) {
        var b = this.ignoredFieldNames;
        return Ext.Array.reduce(c, function(d, f) {
            var e = a.getField(f);
            return d || !e || e.persist && (!a.isNode || !b.hasOwnProperty(f));
        }, false);
    },
    onFlatStoreUpdate: function(c, a, b, d) {
        if (!this.onAnyChangeInAnyStore(c) || b != "edit" || !d || !d.length || !this.hasPersistableChanges(a, d)) {
            return;
        }
        this.currentTransaction.addAction(new Ext.ux.Scheduler2.data.undoredo.action.flat.Update({
            record: a,
            fieldNames: d
        }));
    },
    onFlatStoreAdd: function(b, a, c) {
        if (!this.onAnyChangeInAnyStore(b)) {
            return;
        }
        this.currentTransaction.addAction(new Ext.ux.Scheduler2.data.undoredo.action.flat.Add({
            store: b,
            records: a,
            index: c
        }));
    },
    onFlatStoreRemove: function(c, b, d, a) {
        if (!this.onAnyChangeInAnyStore(c)) {
            return;
        }
        this.currentTransaction.addAction(new Ext.ux.Scheduler2.data.undoredo.action.flat.Remove({
            store: c,
            records: b,
            index: d,
            isMove: a
        }));
    },
    onTreeStoreUpdate: function(c, a, b, d) {
        if (!this.onAnyChangeInAnyStore(c) || b != "edit" || !d || !d.length || !this.hasPersistableChanges(a, d)) {
            return;
        }
        this.currentTransaction.addAction(new Ext.ux.Scheduler2.data.undoredo.action.flat.Update({
            record: a,
            fieldNames: d
        }));
    },
    onTreeStoreAppend: function(c, a, b) {
        if (!c || !this.onAnyChangeInAnyStore(c.getTreeStore())) {
            return;
        }
        if (a.$undoRedoMoving) {
            delete a.$undoRedoMoving;
        } else {
            this.currentTransaction.addAction(new Ext.ux.Scheduler2.data.undoredo.action.tree.Append({
                parent: c,
                newChild: a
            }));
        }
    },
    onTreeStoreInsert: function(c, a, b) {
        if (!c || !this.onAnyChangeInAnyStore(c.getTreeStore())) {
            return;
        }
        if (a.$undoRedoMoving) {
            delete a.$undoRedoMoving;
        } else {
            this.currentTransaction.addAction(new Ext.ux.Scheduler2.data.undoredo.action.tree.Insert({
                parent: c,
                newChild: a,
                insertedBefore: b
            }));
        }
    },
    onTreeStoreRemove: function(c, d, a, b) {
        if (!this.onAnyChangeInAnyStore(c.getTreeStore())) {
            return;
        }
        if (a) {
            d.$undoRedoMoving = true;
        }
        this.currentTransaction.addAction(new Ext.ux.Scheduler2.data.undoredo.action.tree.Remove({
            parent: c,
            removedChild: d,
            nextSibling: b.nextSibling,
            isMove: a
        }));
    },
    start: function() {
        if (this.state == "created" || this.state == "disabled") {
            this.fireEvent("start", this);
        }
        if (this.state !== "hold") {
            this.forEachStore(this.bindStore);
            this.state = "enabled";
        }
    },
    stop: function() {
        this.endTransaction();
        this.forEachStore(this.unbindStore);
        this.state = "disabled";
        this.clearQueues();
        this.fireEvent("stop", this);
    },
    clearQueues: function() {
        this.clearUndoQueue();
        this.clearRedoQueue();
    },
    pause: function() {
        this.state = "paused";
    },
    resume: function() {
        this.state = "enabled";
    },
    hold: function() {
        Ext.Assert && Ext.Assert.isObject(this.currentTransaction, "Can't hold, no transaction is currently in progress");
        this.state = "hold";
    },
    release: function() {
        Ext.Assert && Ext.Assert.isObject(this.currentTransaction, "Can't release, no transaction is currently in progress");
        this.state = "enabled";
    },
    getUndoQueue: function() {
        return this.undoQueue.slice();
    },
    getRedoQueue: function() {
        return this.redoQueue.slice();
    },
    clearUndoQueue: function() {
        if (this.undoQueue.length) {
            this.undoQueue = [];
            this.fireEvent("undoqueuechange", this, this.undoQueue.slice());
        }
    },
    clearRedoQueue: function() {
        if (this.redoQueue.length) {
            this.redoQueue = [];
            this.fireEvent("redoqueuechange", this, this.redoQueue.slice());
        }
    },
    startTransaction: function(c) {
        var a = this, b;
        if (a.state == "disabled") {
            return;
        }
        if (a.currentTransaction) {
            a.endTransaction();
        }
        b = new Ext.ux.Scheduler2.data.undoredo.Transaction({
            title: c
        });
        a.currentTransaction = b;
        a.notifyStoresAboutTransactionStart(b);
        if (a.transactionBoundary == "timeout") {
            a.scheduleEndTransaction();
        }
    },
    scheduleEndTransaction: function() {
        var a = this;
        if (a.transactionTimeout) {
            clearTimeout(a.transactionTimeout);
        }
        a.transactionTimeout = setTimeout(function() {
            if (a.state !== "hold") {
                a.endTransaction();
                a.transactionTimeout = null;
            } else {
                a.scheduleEndTransaction();
            }
        }, a.transactionMaxDuration);
    },
    endTransaction: function() {
        var b = this, a = b.currentTransaction;
        if (!a) {
            return false;
        }
        b.currentTransaction = null;
        if (b.transactionBoundary == "timeout") {
            clearTimeout(b.transactionTimeout);
            b.transactionTimeout = null;
        }
        if (a.hasActions()) {
            b.addTransaction(a);
        }
        b.notifyStoresAboutTransactionEnd(a);
        return a.hasActions();
    },
    addTransaction: function(a) {
        this.undoQueue.push(a);
        this.fireEvent("undoqueuechange", this, this.undoQueue.slice());
        if (this.redoQueue.length) {
            this.redoQueue.length = 0;
            this.fireEvent("redoqueuechange", this, this.redoQueue.slice());
        }
        this.fireEvent("transactionadd", this, a);
    },
    undo: function(d) {
        var b = this.undoQueue, a, e, c;
        if (this.state == "disabled" || d === 0 || !b.length) {
            return;
        }
        if (d instanceof Ext.ux.Scheduler2.data.undoredo.Transaction) {
            a = Ext.Array.indexOf(b, d);
            if (a == -1) {
                return;
            }
            d = b.length - a;
        }
        d = d || 1;
        this.fireEvent("beforeundo", this);
        this.pause();
        this.notifyStoresAboutUndoRedoStart();
        for (c = 0; c < d; c++) {
            e = b.pop();
            e.undo();
            this.redoQueue.unshift(e);
        }
        this.notifyStoresAboutUndoRedoComplete();
        this.fireEvent("undoqueuechange", this, b.slice());
        this.fireEvent("redoqueuechange", this, this.redoQueue.slice());
        this.resume();
        this.fireEvent("afterundo", this);
    },
    redo: function(c) {
        var d = this.redoQueue, e, a, b;
        if (this.state == "disabled" || c === 0 || !d.length) {
            return;
        }
        if (c instanceof Ext.ux.Scheduler2.data.undoredo.Transaction) {
            a = Ext.Array.indexOf(d, c);
            if (a == -1) {
                return;
            }
            c = a + 1;
        }
        c = c || 1;
        this.fireEvent("beforeredo", this);
        this.pause();
        this.notifyStoresAboutUndoRedoStart();
        for (b = 0; b < c; b++) {
            e = this.redoQueue.shift();
            e.redo();
            this.undoQueue.push(e);
        }
        this.notifyStoresAboutUndoRedoComplete();
        this.fireEvent("redoqueuechange", this, this.redoQueue.slice());
        this.fireEvent("undoqueuechange", this, this.undoQueue.slice());
        this.resume();
        this.fireEvent("afterredo", this);
    },
    notifyStoresAboutTransactionStart: function(a) {
        this.forEachStore(function(b) {
            b.onUndoRedoTransactionStart && b.onUndoRedoTransactionStart(this, a);
        });
    },
    notifyStoresAboutTransactionEnd: function(a) {
        this.forEachStore(function(b) {
            b.onUndoRedoTransactionEnd && b.onUndoRedoTransactionEnd(this, a);
        });
    },
    notifyStoresAboutUndoRedoStart: function() {
        this.forEachStore(function(a) {
            a.beforeUndoRedo && a.beforeUndoRedo(this);
        });
    },
    notifyStoresAboutUndoRedoComplete: function() {
        this.forEachStore(function(a) {
            a.afterUndoRedo && a.afterUndoRedo(this);
        });
    }
});

Ext.define("Ext.ux.Scheduler2.data.undoredo.Transaction", {
    actions: null,
    title: null,
    constructor: function(a) {
        a = a || {};
        Ext.apply(this, a);
        this.callParent([ a ]);
        this.actions = [];
    },
    hasActions: function() {
        return this.actions.length > 0;
    },
    addAction: function(a) {
        this.actions.push(a);
    },
    getActions: function() {
        return this.actions;
    },
    undo: function() {
        for (var a = this.actions.length - 1; a >= 0; a--) {
            this.actions[a].undo();
        }
    },
    redo: function() {
        for (var a = 0; a < this.actions.length; a++) {
            this.actions[a].redo();
        }
    }
});

Ext.define("Ext.ux.Scheduler2.data.undoredo.action.Base", {
    constructor: function(a) {
        Ext.apply(this, a);
    },
    undo: function() {
        throw new Error("Abstract method call");
    },
    redo: function() {
        throw new Error("Abstract method call");
    }
});

Ext.define("Ext.ux.Scheduler2.data.undoredo.action.flat.Add", {
    extend: Ext.ux.Scheduler2.data.undoredo.action.Base,
    store: null,
    records: null,
    index: null,
    undo: function() {
        this.store.remove(this.records);
    },
    redo: function() {
        this.store.insert(this.index, this.records);
    },
    getRecord: function() {
        return this.records[0];
    }
});

Ext.define("Ext.ux.Scheduler2.data.undoredo.action.flat.Remove", {
    extend: Ext.ux.Scheduler2.data.undoredo.action.Base,
    store: null,
    records: null,
    index: null,
    isMove: false,
    undo: function() {
        var a = this;
        a.store.insert(a.index, a.records);
    },
    redo: function() {
        var a = this;
        a.store.remove(a.records);
    },
    getRecord: function() {
        return this.records[0];
    }
});

Ext.define("Ext.ux.Scheduler2.data.undoredo.action.flat.Update", {
    extend: Ext.ux.Scheduler2.data.undoredo.action.Base,
    config: {
        record: null,
        fieldNames: null
    },
    oldValues: null,
    newValues: null,
    constructor: function(a) {
        var b = this;
        b.callParent([ a ]);
        b.initConfig(a);
        b.saveValues();
    },
    saveValues: function() {
        var b = this, a = b.getRecord(), c = b.getFieldNames();
        if (c) {
            b.oldValues = Ext.Array.map(c, function(d) {
                return b.processSavingOldValue(d, a);
            });
            b.newValues = Ext.Array.map(c, function(d) {
                return b.processSavingNewValue(d, a);
            });
        }
    },
    undo: function() {
        var b, d = this, a = d.getRecord(), e = d.getFieldNames(), c;
        if (e) {
            b = d.self.CUSTOMLY_PROCESSED;
            a.beginEdit();
            c = Ext.Array.reduce(e, function(h, j, f) {
                var g;
                if (j) {
                    g = d.processRestoringValue(d.oldValues[f], j, a);
                    if (g !== b) {
                        h[j] = g;
                    }
                }
                return h;
            }, {});
            a.set(c);
            a.endEdit();
        }
    },
    redo: function() {
        var b, d = this, a = d.getRecord(), e = d.getFieldNames(), c;
        if (e) {
            b = d.self.CUSTOMLY_PROCESSED;
            a.beginEdit();
            c = Ext.Array.reduce(e, function(h, j, f) {
                var g;
                if (j) {
                    g = d.processRestoringValue(d.newValues[f], j, a);
                    if (g !== b) {
                        h[j] = g;
                    }
                }
                return h;
            }, {});
            a.set(c);
            a.endEdit();
        }
    },
    processSavingOldValue: function(b, a) {
        return (a.previous || a.previousValues)[b];
    },
    processSavingNewValue: function(b, a) {
        return a.get(b);
    },
    processRestoringValue: Ext.identityFn,
    inheritableStatics: {
        CUSTOMLY_PROCESSED: {}
    }
});

Ext.define("Ext.ux.Scheduler2.data.undoredo.action.tree.Append", {
    extend: Ext.ux.Scheduler2.data.undoredo.action.Base,
    parent: null,
    newChild: null,
    undo: function() {
        this.parent.removeChild(this.newChild);
    },
    redo: function() {
        this.parent.appendChild(this.newChild);
    },
    getRecord: function() {
        return this.newChild;
    }
});

Ext.define("Ext.ux.Scheduler2.data.undoredo.action.tree.Insert", {
    extend: Ext.ux.Scheduler2.data.undoredo.action.Base,
    parent: null,
    newChild: null,
    insertedBefore: null,
    undo: function() {
        this.parent.removeChild(this.newChild);
    },
    redo: function() {
        this.parent.insertBefore(this.newChild, this.insertedBefore);
    },
    getRecord: function() {
        return this.newChild;
    }
});

Ext.define("Ext.ux.Scheduler2.data.undoredo.action.tree.Remove", {
    extend: Ext.ux.Scheduler2.data.undoredo.action.Base,
    parent: null,
    removedChild: null,
    nextSibling: null,
    newParent: null,
    newNextSibling: null,
    isMove: false,
    undo: function() {
        if (this.isMove) {
            this.newParent = this.removedChild.parentNode;
            this.newNextSibling = this.removedChild.nextSibling;
        }
        this.parent.insertBefore(this.removedChild, this.nextSibling);
    },
    redo: function() {
        if (this.isMove) {
            this.newParent.insertBefore(this.removedChild, this.newNextSibling);
        } else {
            this.parent.removeChild(this.removedChild);
        }
    },
    getRecord: function() {
        return this.removedChild;
    }
});

Ext.define("Ext.ux.Scheduler2.data.undoredo.model.BaseFlat", {
    extend: Ext.data.Model,
    modelName: null,
    previous: null,
    set: function(e, d) {
        var b;
        var c = this.previous = this.previous || {};
        if (arguments.length > 1) {
            b = this.get(e);
            if (b !== d) {
                c[e] = b;
            }
        } else {
            for (var a in e) {
                b = this.get(a);
                if (b !== e[a]) {
                    c[a] = b;
                }
            }
        }
        this.callParent(arguments);
    },
    afterEdit: function() {
        this.callParent(arguments);
        delete this.previous;
    },
    reject: function() {
        var b = this, a = b.modified;
        b.previous = b.previous || {};
        for (var c in a) {
            if (a.hasOwnProperty(c) && typeof a[c] != "function") {
                b.previous[c] = b.get(c);
            }
        }
        b.callParent(arguments);
        delete b.previous;
    }
});

Ext.define("Ext.ux.Scheduler2.eventlayout.Horizontal", {
    nbrOfBandsByResource: null,
    bandIndexToPxConvertFn: null,
    bandIndexToPxConvertScope: null,
    constructor: function(a) {
        Ext.apply(this, a);
        this.nbrOfBandsByResource = {};
    },
    clearCache: function(a) {
        if (a) {
            delete this.nbrOfBandsByResource[a.internalId];
        } else {
            this.nbrOfBandsByResource = {};
        }
    },
    getNumberOfBands: function(c, b) {
        var a = this.nbrOfBandsByResource;
        if (a.hasOwnProperty(c.internalId)) {
            return a[c.internalId];
        }
        var e = Ext.isFunction(b) ? b() : b;
        var d = Ext.Array.map(e, function(f) {
            return {
                start: f.getStartDate(),
                end: f.getEndDate(),
                event: f
            };
        });
        return this.applyLayout(d, c);
    },
    applyLayout: function(a, c) {
        var d = a.slice();
        var b = this;
        d.sort(function(f, e) {
            return b.sortEvents(f.event, e.event);
        });
        return this.nbrOfBandsByResource[c.internalId] = this.layoutEventsInBands(d);
    },
    sortEvents: function(f, d) {
        var g = f.getStartDate();
        var e = d.getStartDate();
        var c = g - e === 0;
        if (c) {
            return f.getEndDate() > d.getEndDate() ? -1 : 1;
        } else {
            return g < e ? -1 : 1;
        }
    },
    layoutEventsInBands: function(b) {
        var a = 0;
        do {
            var c = b[0];
            while (c) {
                c.top = this.bandIndexToPxConvertFn.call(this.bandIndexToPxConvertScope || this, a, c.event);
                Ext.Array.remove(b, c);
                c = this.findClosestSuccessor(c, b);
            }
            a++;
        } while (b.length > 0);
        return a;
    },
    findClosestSuccessor: function(a, j) {
        var f = Infinity, b, g = a.end, h, c = a.end - a.start === 0;
        for (var e = 0, d = j.length; e < d; e++) {
            h = j[e].start - g;
            if (h >= 0 && h < f && (h > 0 || j[e].end - j[e].start > 0 || !c)) {
                b = j[e];
                f = h;
            }
        }
        return b;
    }
});

Ext.define("Ext.ux.Scheduler2.eventlayout.Table", {
    extend: Ext.ux.Scheduler2.eventlayout.Horizontal,
    timeAxisViewModel: null,
    layoutEventsInBands: function(c) {
        var h = this.timeAxisViewModel;
        var f = h.timeAxis;
        var a = 0;
        do {
            var e = c[0];
            while (e) {
                e.top = this.bandIndexToPxConvertFn.call(this.bandIndexToPxConvertScope || this, a, e.event);
                var b = Math.floor(f.getTickFromDate(e.start));
                var g = this.timeAxisViewModel.getPositionFromDate(f.getAt(b).getStartDate());
                var d = this.timeAxisViewModel.getTickWidth();
                e.left = g;
                e.width = d;
                Ext.Array.remove(c, e);
                e = this.findClosestSuccessor(e, c);
            }
            a++;
        } while (c.length > 0);
        return a;
    },
    findClosestSuccessor: function(e, d) {
        var f = this.timeAxisViewModel.timeAxis;
        var g = Math.floor(f.getTickFromDate(e.start));
        var c = f.getAt(g);
        for (var b = 0, a = d.length; b < a; b++) {
            if (d[b].start >= c.getEndDate()) {
                return d[b];
            }
        }
    }
});

Ext.define("Ext.ux.Scheduler2.eventlayout.Vertical", {
    view: null,
    constructor: function(a) {
        Ext.apply(this, a);
    },
    applyLayout: function(a, g) {
        if (a.length === 0) {
            return;
        }
        var u = this;
        a.sort(function(j, i) {
            return u.sortEvents(j.event, i.event);
        });
        var d, c, h = this.view, k = Ext.ux.Scheduler2.util.Date, n = 1, r, b, e, q;
        for (var s = 0, p = a.length; s < p; s++) {
            e = a[s];
            d = e.start;
            c = e.end;
            b = this.findStartSlot(a, e);
            var t = this.getCluster(a, s);
            if (t.length > 1) {
                e.left = b.start;
                e.width = b.end - b.start;
                q = 1;
                while (q < t.length - 1 && t[q + 1].start - e.start === 0) {
                    q++;
                }
                var o = this.findStartSlot(a, t[q]);
                if (o && o.start < .8) {
                    t = t.slice(0, q);
                }
            }
            var f = t.length, m = (b.end - b.start) / f;
            for (q = 0; q < f; q++) {
                t[q].width = m;
                t[q].left = b.start + q * m;
            }
            s += f - 1;
        }
        for (s = 0, p = a.length; s < p; s++) {
            a[s].width = a[s].width * g;
            a[s].left = h.barMargin + a[s].left * g;
        }
    },
    findStartSlot: function(c, d) {
        var a = this.getPriorOverlappingEvents(c, d), b;
        if (a.length === 0) {
            return {
                start: 0,
                end: 1
            };
        }
        for (b = 0; b < a.length; b++) {
            if (b === 0 && a[0].left > 0) {
                return {
                    start: 0,
                    end: a[0].left
                };
            } else {
                if (a[b].left + a[b].width < (b < a.length - 1 ? a[b + 1].left : 1)) {
                    return {
                        start: a[b].left + a[b].width,
                        end: b < a.length - 1 ? a[b + 1].left : 1
                    };
                }
            }
        }
        return false;
    },
    getPriorOverlappingEvents: function(e, f) {
        var g = Ext.ux.Scheduler2.util.Date, h = f.start, b = f.end, c = [];
        for (var d = 0, a = Ext.Array.indexOf(e, f); d < a; d++) {
            if (g.intersectSpans(h, b, e[d].start, e[d].end)) {
                c.push(e[d]);
            }
        }
        c.sort(this.sortOverlappers);
        return c;
    },
    sortOverlappers: function(b, a) {
        return b.left < a.left ? -1 : 1;
    },
    getCluster: function(e, g) {
        if (g >= e.length - 1) {
            return [ e[g] ];
        }
        var c = [ e[g] ], h = e[g].start, b = e[g].end, a = e.length, f = Ext.ux.Scheduler2.util.Date, d = g + 1;
        while (d < a && f.intersectSpans(h, b, e[d].start, e[d].end)) {
            c.push(e[d]);
            h = f.max(h, e[d].start);
            b = f.min(e[d].end, b);
            d++;
        }
        return c;
    },
    sortEvents: function(f, d) {
        var g = f.getStartDate(), i = f.getEndDate();
        var e = d.getStartDate(), h = d.getEndDate();
        var c = g - e === 0;
        if (c) {
            return i > h ? -1 : 1;
        } else {
            return g < e ? -1 : 1;
        }
    }
});

Ext.define("Ext.ux.Scheduler2.feature.AbstractTimeSpan", {
    extend: Ext.AbstractPlugin,
    mixins: {
        observable: Ext.util.Observable
    },
    lockableScope: "top",
    schedulerView: null,
    timeAxis: null,
    containerEl: null,
    expandToFitView: false,
    disabled: false,
    cls: null,
    clsField: "Cls",
    template: null,
    store: null,
    renderElementsBuffered: false,
    renderDelay: 15,
    refreshSizeOnItemUpdate: true,
    _resizeTimer: null,
    _renderTimer: null,
    showHeaderElements: false,
    headerTemplate: null,
    innerHeaderTpl: null,
    headerContainerCls: "sch2-header-secondary-canvas",
    headerContainerEl: null,
    renderingDoneEvent: null,
    constructor: function(a) {
        this.uniqueCls = this.uniqueCls || "sch2-timespangroup-" + Ext.id();
        Ext.apply(this, a);
        this.mixins.observable.constructor.call(this);
        this.callParent(arguments);
    },
    setDisabled: function(a) {
        if (a) {
            this.removeElements();
        }
        this.disabled = a;
    },
    removeElements: function() {
        this.removeBodyElements();
        if (this.showHeaderElements) {
            this.removeHeaderElements();
        }
    },
    getBodyElements: function() {
        if (this.containerEl) {
            return this.containerEl.select("." + this.uniqueCls);
        }
        return null;
    },
    getHeaderContainerEl: function() {
        var c = this.headerContainerEl, b = Ext.baseCSSPrefix, a;
        if (!c || !c.dom) {
            if (this.schedulerView.isHorizontal()) {
                a = this.panel.getHorizontalTimeAxisColumn().headerView.containerEl;
            } else {
                a = this.panel.el.down("." + b + "grid-inner-locked ." + b + "panel-body ." + b + "grid-view");
            }
            if (a) {
                c = a.down("." + this.headerContainerCls);
                if (!c) {
                    c = a.appendChild({
                        cls: this.headerContainerCls
                    });
                }
                this.headerContainerEl = c;
            }
        }
        return c;
    },
    getHeaderElements: function() {
        var a = this.getHeaderContainerEl();
        if (a) {
            return a.select("." + this.uniqueCls);
        }
        return null;
    },
    removeBodyElements: function() {
        var a = this.getBodyElements();
        if (a) {
            a.each(function(b) {
                b.destroy();
            });
        }
    },
    removeHeaderElements: function() {
        var a = this.getHeaderElements();
        if (a) {
            a.each(function(b) {
                b.destroy();
            });
        }
    },
    getElementId: function(a) {
        return this.uniqueCls + "-" + a.internalId;
    },
    getHeaderElementId: function(a) {
        return this.uniqueCls + "-header-" + a.internalId;
    },
    getTemplateData: function(a) {
        return this.prepareTemplateData ? this.prepareTemplateData(a) : a.data;
    },
    getElementCls: function(a, c) {
        var b = a.clsField || this.clsField;
        if (!c) {
            c = this.getTemplateData(a);
        }
        return this.cls + " " + this.uniqueCls + " " + (c[b] || "");
    },
    getHeaderElementCls: function(a, c) {
        var b = a.clsField || this.clsField;
        if (!c) {
            c = this.getTemplateData(a);
        }
        return "sch2-header-indicator " + this.uniqueCls + " " + (c[b] || "");
    },
    init: function(a) {
        if (Ext.versions.touch && !a.isReady()) {
            a.on("viewready", function() {
                this.init(a);
            }, this);
            return;
        }
        if (Ext.isString(this.innerHeaderTpl)) {
            this.innerHeaderTpl = new Ext.XTemplate(this.innerHeaderTpl);
        }
        var b = this.innerHeaderTpl;
        if (!this.headerTemplate) {
            this.headerTemplate = new Ext.XTemplate('<tpl for=".">', '<div id="{id}" class="{cls}" style="{side}:{position}px;">' + (b ? "{[this.renderInner(values)]}" : "") + "</div>", "</tpl>", {
                renderInner: function(c) {
                    return b.apply(c);
                }
            });
        }
        this.schedulerView = a.getSchedulingView();
        this.panel = a;
        this.timeAxis = a.getTimeAxis();
        this.store = Ext.StoreManager.lookup(this.store);
        if (!this.store) {
            Ext.Error.raise("Error: You must define a store for this plugin");
        }
        if (!this.schedulerView.getEl()) {
            this.schedulerView.on({
                afterrender: this.onAfterRender,
                scope: this
            });
        } else {
            this.onAfterRender();
        }
    },
    onAfterRender: function(c) {
        var a = this.schedulerView;
        this.containerEl = a.getSecondaryCanvasEl();
        this.storeListeners = {
            load: this.renderElements,
            datachanged: this.renderElements,
            clear: this.renderElements,
            add: this.renderElements,
            remove: this.renderElements,
            update: this.refreshSingle,
            addrecords: this.renderElements,
            removerecords: this.renderElements,
            updaterecord: this.refreshSingle,
            expand: this.renderElements,
            collapse: this.renderElements,
            scope: this
        };
        this.store.on(this.storeListeners);
        a.on({
            bufferedrefresh: this.renderElements,
            refresh: this.renderElements,
            itemadd: this.refreshSizeOnItemUpdate ? this.refreshSizes : this.renderElements,
            itemremove: this.refreshSizeOnItemUpdate ? this.refreshSizes : this.renderElements,
            itemupdate: this.refreshSizeOnItemUpdate ? this.refreshSizes : this.renderElements,
            groupexpand: this.renderElements,
            groupcollapse: this.renderElements,
            columnwidthchange: this.renderElements,
            resize: this.renderElements,
            scope: this
        });
        if (a.headerCt) {
            a.headerCt.on({
                add: this.renderElements,
                remove: this.renderElements,
                scope: this
            });
        }
        this.panel.on({
            viewchange: this.renderElements,
            show: this.refreshSizes,
            modechange: this.forceNewRenderingTimeout,
            scope: this
        });
        var b = a.getRowContainerEl();
        if (b && b.down(".sch2-timetd", true)) {
            this.renderElements();
        }
    },
    forceNewRenderingTimeout: function() {
        this.renderElementsBuffered = false;
        clearTimeout(this._renderTimer);
        clearTimeout(this._resizeTimer);
        this.renderElements();
    },
    refreshSizesInternal: function() {
        if (!this.schedulerView.isDestroyed && this.schedulerView.isHorizontal()) {
            var a = this.schedulerView.getTimeSpanRegion(new Date(), null, this.expandToFitView);
            this.getBodyElements().setHeight(a.bottom - a.top);
        }
    },
    refreshSizes: function() {
        clearTimeout(this._resizeTimer);
        this._resizeTimer = Ext.Function.defer(this.refreshSizesInternal, this.renderDelay, this);
    },
    renderElements: function() {
        if (this.renderElementsBuffered || this.disabled) {
            return;
        }
        this.renderElementsBuffered = true;
        clearTimeout(this._renderTimer);
        this._renderTimer = Ext.Function.defer(this.renderElementsInternal, this.renderDelay, this);
    },
    setElementX: function(b, a) {
        if (this.panel.rtl) {
            b.setRight(a);
        } else {
            b.setLeft(a);
        }
    },
    getHeaderElementPosition: function(b) {
        var a = this.schedulerView.getTimeAxisViewModel();
        return Math.round(a.getPositionFromDate(b));
    },
    renderBodyElementsInternal: function(a) {
        Ext.DomHelper.append(this.containerEl, this.generateMarkup(false, a));
    },
    getHeaderElementData: function(a, b) {
        throw "Abstract method call";
    },
    renderHeaderElementsInternal: function(a) {
        var b = this.getHeaderContainerEl();
        if (b) {
            Ext.DomHelper.append(b, this.generateHeaderMarkup(false, a));
        }
    },
    renderElementsInternal: function() {
        this.renderElementsBuffered = false;
        if (this.disabled || this.schedulerView.isDestroyed) {
            return;
        }
        if (Ext.versions.extjs && !this.schedulerView.getEl().down("." + Ext.baseCSSPrefix + "grid-item-container")) {
            return;
        }
        this.removeElements();
        this.renderBodyElementsInternal();
        if (this.showHeaderElements) {
            this.headerContainerEl = null;
            this.renderHeaderElementsInternal();
        }
        if (this.renderingDoneEvent) {
            this.fireEvent(this.renderingDoneEvent, this);
        }
    },
    generateMarkup: function(c, b) {
        var e = this.timeAxis.getStart(), a = this.timeAxis.getEnd(), d = this.getElementData(e, a, b, c);
        return this.template.apply(d);
    },
    generateHeaderMarkup: function(b, a) {
        var c = this.getHeaderElementData(a, b);
        return this.headerTemplate.apply(c);
    },
    getElementData: function(d, c, a, b) {
        throw "Abstract method call";
    },
    updateBodyElement: function(b) {
        var c = Ext.get(this.getElementId(b));
        if (c) {
            var e = this.timeAxis.getStart(), a = this.timeAxis.getEnd(), d = this.getElementData(e, a, [ b ])[0];
            if (d) {
                c.dom.className = d.$cls;
                c.setTop(d.top);
                this.setElementX(c, d.left);
                c.setSize(d.width, d.height);
            } else {
                Ext.destroy(c);
            }
        } else {
            this.renderBodyElementsInternal([ b ]);
        }
    },
    updateHeaderElement: function(a) {
        var b = Ext.get(this.getHeaderElementId(a));
        if (b) {
            var c = this.getHeaderElementData([ a ])[0];
            if (c) {
                b.dom.className = c.cls;
                if (this.schedulerView.isHorizontal()) {
                    this.setElementX(b, c.position);
                    b.setWidth(c.size);
                } else {
                    b.setTop(c.position);
                    b.setHeight(c.size);
                }
            } else {
                Ext.destroy(b);
            }
        } else {
            this.renderHeaderElementsInternal([ a ]);
        }
    },
    destroy: function() {
        clearTimeout(this._renderTimer);
        clearTimeout(this._resizeTimer);
        this.store.un(this.storeListeners);
        if (this.store.autoDestroy) {
            this.store.destroy();
        }
    },
    refreshSingle: function(b, a) {
        a = a instanceof Array ? a : [ a ];
        Ext.Array.each(a, function(c) {
            this.updateBodyElement(c);
            if (this.showHeaderElements) {
                this.updateHeaderElement(c);
            }
        }, this);
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.Lines", {
    extend: Ext.ux.Scheduler2.feature.AbstractTimeSpan,
    alias: "plugin.scheduler_lines",
    cls: "sch2-timeline",
    showTip: true,
    innerTpl: null,
    prepareTemplateData: null,
    side: null,
    init: function(a) {
        if (Ext.isString(this.innerTpl)) {
            this.innerTpl = new Ext.XTemplate(this.innerTpl);
        }
        this.side = a.rtl ? "right" : "left";
        var b = this.innerTpl;
        if (!this.template) {
            this.template = new Ext.XTemplate('<tpl for=".">', '<div id="{id}" ' + (this.showTip ? 'title="{[this.getTipText(values)]}" ' : "") + 'class="{$cls}" style="' + this.side + ':{left}px;top:{top}px;height:{height}px;width:{width}px">' + (b ? "{[this.renderInner(values)]}" : "") + "</div>", "</tpl>", {
                getTipText: function(c) {
                    return a.getSchedulingView().getFormattedDate(c.Date) + " " + (c.Text || "");
                },
                renderInner: function(c) {
                    return b.apply(c);
                }
            });
        }
        this.callParent(arguments);
    },
    generateMarkup: function(b, a) {
        return this.schedulerView.getMode() === "calendar" ? "" : this.callParent(arguments);
    },
    generateHeaderMarkup: function(b, a) {
        return this.schedulerView.getMode() === "calendar" ? "" : this.callParent(arguments);
    },
    getElementData: function(m, q, c) {
        var t = this.store, j = this.schedulerView, p = j.isHorizontal(), f = c || t.getRange(), h = [], r, a, o = j.getTimeSpanRegion(m, null, this.expandToFitView), k, b, e;
        if (Ext.versions.touch) {
            r = "100%";
        } else {
            r = p ? o.bottom - o.top : 1;
        }
        a = p ? 1 : o.right - o.left;
        for (var g = 0, d = f.length; g < d; g++) {
            k = f[g];
            b = k.get("Date");
            if (b && Ext.ux.Scheduler2.util.Date.betweenLesser(b, m, q)) {
                var n = j.getCoordinateFromDate(b);
                e = Ext.apply({}, this.getTemplateData(k));
                e.id = this.getElementId(k);
                e.$cls = this.getElementCls(k, e);
                e.width = a;
                e.height = r;
                if (p) {
                    e.left = n;
                } else {
                    e.top = n;
                }
                h.push(e);
            }
        }
        return h;
    },
    getHeaderElementData: function(c) {
        var a = this.timeAxis.getStart(), k = this.timeAxis.getEnd(), m = this.schedulerView.isHorizontal(), g = [], h, b, j, e;
        c = c || this.store.getRange();
        for (var f = 0, d = c.length; f < d; f++) {
            h = c[f];
            b = h.get("Date");
            if (b && Ext.ux.Scheduler2.util.Date.betweenLesser(b, a, k)) {
                j = this.getHeaderElementPosition(b);
                e = this.getTemplateData(h);
                e = Ext.apply({
                    side: m ? this.side : "top",
                    cls: this.getHeaderElementCls(h, e),
                    position: j
                }, e);
                e.id = this.getHeaderElementId(h);
                g.push(e);
            }
        }
        return g;
    }
});

Ext.define("Ext.ux.Scheduler2.feature.ColumnLines", {
    extend: Ext.ux.Scheduler2.plugin.Lines,
    cls: "sch2-column-line",
    showTip: false,
    timeAxisViewModel: null,
    renderingDoneEvent: "columnlinessynced",
    useLowestHeader: null,
    init: function(a) {
        this.timeAxis = a.getTimeAxis();
        this.timeAxisViewModel = a.timeAxisViewModel;
        this.panel = a;
        this.store = new Ext.data.JsonStore({
            fields: [ "Date" ]
        });
        this.callParent(arguments);
        a.on({
            modechange: this.populate,
            destroy: this.onHostDestroy,
            scope: this
        });
        this.timeAxisViewModel.on("update", this.populate, this);
        this.populate();
    },
    onHostDestroy: function() {
        this.timeAxisViewModel.un("update", this.populate, this);
    },
    populate: function() {
        this.store.setData(this.getData());
    },
    getElementData: function() {
        var a = this.schedulerView;
        if (a.isHorizontal() && a.store.getCount() > 0) {
            return this.callParent(arguments);
        }
        return [];
    },
    getData: function() {
        var a = this.panel, m = [];
        if (a.isHorizontal()) {
            var k = this.timeAxisViewModel;
            var g = this.useLowestHeader ? k.getLowestHeader() : k.columnLinesFor;
            var e = !!(k.headerConfig && k.headerConfig[g].cellGenerator);
            if (e) {
                var o = k.getColumnConfig()[g];
                for (var d = 1, b = o.length; d < b; d++) {
                    m.push({
                        Date: o[d].start
                    });
                }
            } else {
                var c, j, n = k.getColumnConfig(), f;
                if (g === "bottom") {
                    c = "middle";
                } else {
                    if (g === "middle") {
                        c = "top";
                    }
                }
                j = n[c];
                if (j) {
                    var h = k.headerConfig;
                    if (h[c].increment !== h[g].increment || h[c].unit !== h[g].unit) {
                        f = {};
                        Ext.Array.each(j, function(i) {
                            f[i.start.getTime()] = 1;
                        });
                    }
                }
                k.forEachInterval(g, function(q, l, p) {
                    if (p > 0) {
                        m.push({
                            Date: q,
                            Cls: f && f[q.getTime()] ? "sch2-column-line-solid" : ""
                        });
                    }
                });
            }
        }
        return m;
    }
});

Ext.define("Ext.ux.Scheduler2.util.ScrollManager", {
    singleton: true,
    vthresh: 25,
    hthresh: 25,
    increment: 100,
    frequency: 500,
    animate: true,
    animDuration: 200,
    activeCmp: null,
    activeEl: null,
    scrollElRegion: null,
    scrollProcess: {},
    pt: null,
    scrollWidth: null,
    scrollHeight: null,
    direction: "both",
    constructor: function() {
        this.doScroll = Ext.Function.bind(this.doScroll, this);
    },
    triggerRefresh: function() {
        if (this.activeEl) {
            this.refreshElRegion();
            this.clearScrollInterval();
            this.onMouseMove();
        }
    },
    doScroll: function() {
        var f = this.scrollProcess, g = f.cmp, h = g.rtl, b = f.dir[0], i = this.increment, c = this.activeCmp.getScrollX(), a = this.activeCmp.getScrollY();
        if (b === "r") {
            i = Math.min(i, h ? c : this.scrollWidth - c - this.activeEl.dom.clientWidth);
        } else {
            if (b === "d") {
                i = Math.min(i, this.scrollHeight - a - this.activeEl.dom.clientHeight);
            }
        }
        i = Math.max(i, 0);
        var e = 0, d = 0;
        if (b === "r") {
            e = i;
        }
        if (b === "l") {
            e = -i;
        }
        if (b === "u") {
            d = -i;
        }
        if (b === "d") {
            d = i;
        }
        if (h) {
            e = -e;
        }
        g.scrollBy(e, d, {
            duration: this.animDuration,
            callback: this.triggerRefresh,
            scope: this
        });
    },
    clearScrollInterval: function() {
        var a = this.scrollProcess;
        if (a.id) {
            clearTimeout(a.id);
        }
        a.id = 0;
        a.cmp = null;
        a.dir = "";
    },
    isScrollAllowed: function(a) {
        switch (this.direction) {
          case "both":
            return true;

          case "horizontal":
            return a === "right" || a === "left";

          case "vertical":
            return a === "up" || a === "down";

          default:
            throw "Invalid direction: " + this.direction;
        }
    },
    startScrollInterval: function(b, a) {
        if (!this.isScrollAllowed(a)) {
            return;
        }
        this.clearScrollInterval();
        this.scrollProcess.cmp = b;
        this.scrollProcess.dir = a;
        this.scrollProcess.id = setTimeout(this.doScroll, this.frequency);
    },
    onMouseMove: function(g) {
        var o = g ? g.getPoint() : this.pt, n = o.x, l = o.y, h = this.scrollProcess, m = this.activeCmp, d = m.getScrollX(), c = m.getScrollY(), a, k = m.rtl, b = this.activeEl, j = this.scrollElRegion, f = b.dom, i = this;
        this.pt = o;
        if (j && j.contains(o) && b.isScrollable()) {
            if (j.bottom - l <= i.vthresh && this.scrollHeight - c - f.clientHeight > 0) {
                if (h.cmp != m) {
                    this.startScrollInterval(m, "down");
                }
                return;
            } else {
                if (j.right - n <= i.hthresh && (k ? d > 0 : this.scrollWidth - d - f.clientWidth > 0)) {
                    if (h.cmp != m) {
                        this.startScrollInterval(m, "right");
                    }
                    return;
                } else {
                    if (l - j.top <= i.vthresh && c > 0) {
                        if (h.cmp != m) {
                            this.startScrollInterval(m, "up");
                        }
                        return;
                    } else {
                        if (n - j.left <= i.hthresh && (k ? f.clientWidth + d < this.scrollWidth : d > 0)) {
                            if (h.cmp != m) {
                                this.startScrollInterval(m, "left");
                            }
                            return;
                        }
                    }
                }
            }
        }
        this.clearScrollInterval();
    },
    refreshElRegion: function() {
        this.scrollElRegion = this.activeEl.getRegion();
    },
    activate: function(b, c) {
        var a = Ext.getScrollbarSize();
        this.direction = c || "both";
        this.activeCmp = b;
        this.activeEl = b.getEl();
        var d = b.getScrollable().getMaxPosition();
        this.scrollWidth = d.x + b.getWidth() - a.width;
        this.scrollHeight = d.y + b.getHeight() - a.height;
        this.refreshElRegion();
        this.activeEl.on("mousemove", this.onMouseMove, this);
    },
    deactivate: function() {
        this.clearScrollInterval();
        this.activeEl.un("mousemove", this.onMouseMove, this);
        this.activeEl = this.activeCmp = this.scrollElRegion = this.scrollWidth = this.scrollHeight = null;
        this.direction = "both";
    }
});

Ext.define("Ext.ux.Scheduler2.util.DragTracker", {
    extend: Ext.dd.DragTracker,
    xStep: 1,
    yStep: 1,
    deferredActivation: 0,
    constructor: function() {
        this.callParent(arguments);
        this.on("dragstart", function() {
            var b = this.el;
            var a = {
                scroll: this.onMouseMove,
                pinchstart: this.onMouseUp,
                scope: this
            };
            b.on(a);
            this.on("dragend", function() {
                b.un(a);
            }, this, {
                single: true
            });
        });
        this.moveListener = {
            pinchstart: this.abortWait,
            touchend: this.abortWait,
            mouseup: this.abortWait,
            mousemove: this.onMoveWhileWaiting,
            scope: this,
            capture: true
        };
    },
    setXStep: function(a) {
        this.xStep = a;
    },
    startScroll: null,
    deferTimer: null,
    deferTolerance: 10,
    moveListener: null,
    setYStep: function(a) {
        this.yStep = a;
    },
    onMoveWhileWaiting: function(d, a) {
        var c = d.getXY();
        var b = this.startXY;
        if (Math.max(Math.abs(b[0] - c[0]), Math.abs(b[1] - c[1])) > this.deferTolerance) {
            this.abortWait();
            this.onMouseUp(d);
        }
    },
    abortWait: function() {
        clearTimeout(this.deferTimer);
        this.deferTimer = null;
        Ext.getDoc().un(this.moveListener);
    },
    getRegion: function() {
        var j = this.startXY, f = this.el.getScroll();
        if (Ext.isIE && this.rtl) {
            f.left = this.el.dom.scrollWidth - this.el.getWidth() - f.left;
        }
        var l = this.getXY(), c = l[0], b = l[1], h = f.left - this.startScroll.left, m = f.top - this.startScroll.top, i = j[0] - h, g = j[1] - m, e = Math.min(i, c), d = Math.min(g, b), a = Math.abs(i - c), k = Math.abs(g - b);
        return new Ext.util.Region(d, e + a, d + k, e);
    },
    onMouseDown: function(c, b) {
        if (c.event.touches && c.event.touches.length > 1) {
            return;
        }
        c.stopPropagation = Ext.emptyFn;
        this.startXY = c.getXY();
        if (this.deferredActivation) {
            var a = this;
            Ext.getDoc().on(this.moveListener);
            this.deferTimer = setTimeout(function() {
                var d = a.deferredActivation;
                Ext.getDoc().un(a.moveListener);
                a.deferredActivation = false;
                a.onMouseDown(c, b);
                a.deferredActivation = d;
            }, this.deferredActivation);
            return;
        }
        this.callParent([ c, b ]);
        this.lastXY = this.startXY;
        this.startScroll = this.el.getScroll();
        if (Ext.isIE && this.rtl) {
            this.startScroll.left = this.el.dom.scrollWidth - this.el.getWidth() - this.startScroll.left;
        }
    },
    onMouseMove: function(g, f) {
        if (this.active && g.type === "mousemove" && Ext.isIE9m && !g.browserEvent.button) {
            g.preventDefault();
            this.onMouseUp(g);
            return;
        }
        g.preventDefault();
        var d = g.type === "scroll" ? this.lastXY : g.getXY(), b = this.startXY;
        if (!this.active) {
            if (Math.max(Math.abs(b[0] - d[0]), Math.abs(b[1] - d[1])) > this.tolerance) {
                this.triggerStart(g);
            } else {
                return;
            }
        }
        var a = d[0], h = d[1];
        if (this.xStep > 1) {
            a -= this.startXY[0];
            a = Math.round(a / this.xStep) * this.xStep;
            a += this.startXY[0];
        }
        if (this.yStep > 1) {
            h -= this.startXY[1];
            h = Math.round(h / this.yStep) * this.yStep;
            h += this.startXY[1];
        }
        var c = this.xStep > 1 || this.yStep > 1;
        if (!c || a !== d[0] || h !== d[1]) {
            this.lastXY = [ a, h ];
            if (this.fireEvent("mousemove", this, g) === false) {
                this.onMouseUp(g);
            } else {
                this.onDrag(g);
                this.fireEvent("drag", this, g);
            }
        }
    }
});

Ext.define("Ext.ux.Scheduler2.tooltip.ClockTemplate", {
    extend: Ext.XTemplate,
    minuteHeight: 8,
    minuteTop: 2,
    hourHeight: 8,
    hourTop: 2,
    handLeft: 10,
    mode: "hour",
    getRotateStyle: function(a) {
        return "transform:rotate(Ddeg);-ms-transform:rotate(Ddeg);-moz-transform: rotate(Ddeg);-webkit-transform: rotate(Ddeg);-o-transform:rotate(Ddeg);".replace(/D/g, a);
    },
    getRotateStyleIE: function() {
        var c = Math.PI / 180, b = Math.cos, a = Math.sin;
        return function(d, j, n) {
            var g = this, h = d * c, f = b(h), l = a(h), i = n * a((90 - d) * c), k = n * b((90 - d) * c), m = Math.min(n, n - i), e = d > 180 ? k : 0, o = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11 = " + f + ", M12 = " + -l + ", M21 = " + l + ", M22 = " + f + ")";
            return Ext.String.format("filter:{0};-ms-filter:{0};top:{1}px;left:{2}px;", o, m + j, e + g.handLeft);
        };
    }(),
    constructor: function() {
        var a = Ext.isIE && Ext.isIE8m;
        this.callParent([ '<div class="sch2-clockwrap ' + (a ? "" : "sch2-supports-border-radius") + ' sch2-clock-{[this.mode]}"><div class="sch2-clock"><div class="sch2-hourIndicator" style="{[this.getHourStyle((values.date.getHours() % 12) * 30,' + this.hourTop + ", + " + this.hourHeight + ')]}">{[Ext.Date.monthNames[values.date.getMonth()].substr(0,3)]}</div><div class="sch2-minuteIndicator" style="{[this.getMinuteStyle(values.date.getMinutes() * 6,' + this.minuteTop + ", + " + this.minuteHeight + ')]}">{[values.date.getDate()]}</div>' + (a ? "" : '<div class="sch2-clock-dot"></div>') + '</div><span class="sch2-clock-text">{text}</span></div>', {
            getMinuteStyle: a ? this.getRotateStyleIE : this.getRotateStyle,
            getHourStyle: a ? this.getRotateStyleIE : this.getRotateStyle
        } ]);
    }
});

Ext.define("Ext.ux.Scheduler2.tooltip.Tooltip", {
    extend: Ext.tip.ToolTip,
    autoHide: false,
    anchor: "b",
    padding: "0 3 0 0",
    showDelay: 0,
    hideDelay: 0,
    quickShowInterval: 0,
    dismissDelay: 0,
    trackMouse: false,
    anchorOffset: 5,
    shadow: false,
    frame: false,
    schedulerView: null,
    message: null,
    startDate: null,
    endDate: null,
    template: null,
    valid: true,
    mode: null,
    offsetAdjust: [ 18, 5 ],
    constructor: function(b) {
        var a = new Ext.ux.Scheduler2.tooltip.ClockTemplate();
        this.startDate = this.endDate = new Date();
        if (!this.template) {
            this.template = Ext.create("Ext.XTemplate", '<div class="sch2-tip-{[values.valid ? "ok" : "notok"]}">{[this.renderClock(values.startDate, values.startText, "sch2-tooltip-startdate")]}{[this.renderClock(values.endDate, values.endText, "sch2-tooltip-enddate")]}<div class="sch2-tip-message">{message}</div></div>', {
                disableFormats: true,
                renderClock: function(d, e, c) {
                    return a.apply({
                        date: d,
                        text: e,
                        cls: c
                    });
                }
            });
        }
        this.callParent(arguments);
    },
    update: function(a, g, f, e) {
        if (this.startDate - a !== 0 || this.endDate - g !== 0 || this.valid !== f || this.message !== e) {
            var d = this.message && !e || !this.message && e;
            this.startDate = a;
            this.endDate = g;
            this.valid = f;
            this.message = e;
            var c = this.schedulerView.getFormattedDate(a), b = this.schedulerView.getFormattedEndDate(g, a);
            if (this.mode === "calendar" && g.getHours() === 0 && g.getMinutes() === 0 && !(g.getYear() === a.getYear() && g.getMonth() === a.getMonth() && g.getDate() === a.getDate())) {
                g = Ext.ux.Scheduler2.util.Date.add(g, Ext.ux.Scheduler2.util.Date.DAY, -1);
            }
            this.callParent([ this.template.apply({
                valid: f,
                startDate: a,
                endDate: g,
                startText: c,
                endText: b,
                message: e
            }) ]);
            if (d) {
                this.realign();
            }
        }
    },
    show: function(b, a) {
        if (!b || Ext.isArray(b)) {
            return;
        }
        if (this.rendered === true) {
            this.setPosition(0, 0);
        }
        if (Ext.ux.Scheduler2.util.Date.compareUnits(this.schedulerView.getTimeResolution().unit, Ext.ux.Scheduler2.util.Date.DAY) >= 0) {
            this.mode = "calendar";
            this.addCls("sch2-day-resolution");
            this.removeCls("sch2-hour-resolution");
        } else {
            this.mode = "clock";
            this.removeCls("sch2-day-resolution");
            this.addCls("sch2-hour-resolution");
        }
        a = arguments.length > 1 ? a : this.offsetAdjust[0];
        this.mouseOffsets = [ a - this.offsetAdjust[0], -this.offsetAdjust[1] ];
        this.setTarget(b);
        this.callParent();
        this.realign();
    },
    realign: function() {
        this.el.alignTo(this.target, "bl-tl", this.mouseOffsets);
    },
    afterRender: function() {
        this.callParent(arguments);
        this.el.on("mouseenter", this.realign, this);
    }
});

Ext.define("Ext.ux.Scheduler2.tooltip.HoverTip", {
    extend: Ext.tip.ToolTip,
    alias: "widget.scheduler_hovertip",
    trackMouse: true,
    bodyCls: "sch2-hovertip",
    messageTpl: '<div class="sch2-hovertip-msg">{message}</div>',
    autoHide: false,
    dismissDelay: 1e3,
    showDelay: 0,
    schedulerView: null,
    clockTpl: null,
    lastTime: null,
    lastResource: null,
    initComponent: function() {
        var b = this;
        var a = b.schedulerView;
        b.clockTpl = new Ext.ux.Scheduler2.tooltip.ClockTemplate();
        b.messageTpl = new Ext.XTemplate(b.messageTpl);
        b.lastTime = null;
        b.lastResource = null;
        b.callParent(arguments);
        b.on("beforeshow", b.tipOnBeforeShow, b);
        a.mon(a.el, {
            mouseleave: function() {
                b.hide();
            },
            mousemove: b.handleMouseMove,
            scope: b
        });
        a.mon(a.el, {
            click: b.onBodyMouseDown,
            scope: b,
            delay: 1
        });
    },
    onBodyMouseDown: function() {
        this.hide();
    },
    handleMouseMove: function(f) {
        var c = this;
        var a = c.schedulerView;
        if (c.disabled) {
            return;
        }
        if (f.getTarget("." + a.itemCls, 5) && !f.getTarget(a.eventSelector)) {
            var d = a.getDateFromDomEvent(f, "floor");
            if (d) {
                var b = a.resolveResource(f.getTarget());
                if (d - c.lastTime !== 0 || b !== c.lastResource) {
                    c.lastResource = b;
                    if (c.hidden) {
                        if (Ext.ux.Scheduler2.util.Date.compareUnits(this.schedulerView.getTimeResolution().unit, Ext.ux.Scheduler2.util.Date.DAY) >= 0) {
                            c.clockTpl.mode = "day";
                        } else {
                            c.clockTpl.mode = "hour";
                        }
                        c.show();
                    }
                    c.updateHoverTip(d, f);
                }
            } else {
                c.hide();
                c.lastTime = null;
                c.lastResource = null;
            }
        } else {
            c.hide();
            c.lastTime = null;
            c.lastResource = null;
        }
    },
    getText: function() {},
    updateHoverTip: function(c, d) {
        if (c) {
            var b = this.clockTpl.apply({
                date: c,
                text: this.schedulerView.getFormattedDate(c)
            });
            var a = this.messageTpl.apply({
                message: this.getText(c, d)
            });
            this.update(b + a);
            this.lastTime = c;
        }
    },
    tipOnBeforeShow: function(a) {
        return !this.disabled && this.lastTime !== null;
    }
});

Ext.define("Ext.ux.Scheduler2.feature.DragCreator", {
    disabled: false,
    showHoverTip: true,
    showDragTip: true,
    dragTip: null,
    dragTolerance: 2,
    hoverTip: null,
    validatorFn: Ext.emptyFn,
    validatorFnScope: null,
    trackerConfig: null,
    schedulerView: null,
    template: '<div class="sch2-dragcreator-proxy"><div class="sch2-event-inner">&#160;</div></div>',
    constructor: function(a) {
        Ext.apply(this, a || {});
        this.lastTime = new Date();
        if (!(this.template instanceof Ext.Template)) {
            this.template = new Ext.Template(this.template);
        }
        this.schedulerView.on("destroy", this.onSchedulerDestroy, this);
        if (Ext.supports.Touch) {
            this.schedulerView.on("boxready", this.initDragTracker, this);
        } else {
            this.schedulerView.el.on("mousemove", this.initDragTracker, this, {
                single: true
            });
        }
        this.callParent([ a ]);
    },
    setDisabled: function(a) {
        this.disabled = a;
        if (this.hoverTip) {
            this.hoverTip.setDisabled(a);
        }
        if (this.dragTip) {
            this.dragTip.setDisabled(a);
        }
    },
    getProxy: function() {
        if (!this.proxy) {
            this.proxy = this.template.append(this.schedulerView.getSecondaryCanvasEl(), {}, true);
            var a = this.schedulerView.rtl;
            this.proxy.hide = function() {
                if (a) {
                    this.setStyle({
                        right: "-10000px",
                        top: "-10000px"
                    });
                } else {
                    this.setStyle({
                        left: "-10000px",
                        top: "-10000px"
                    });
                }
            };
        }
        return this.proxy;
    },
    onBeforeDragStart: function(d, g) {
        var b = this.schedulerView, a = g.getTarget("." + b.timeCellCls, 5);
        if (a && this.isCreateAllowed(g) && (!g.event.touches || g.event.touches.length === 1)) {
            var c = b.resolveResource(a);
            var f = b.getDateFromDomEvent(g);
            if (!this.disabled && a && b.fireEvent("beforedragcreate", b, c, f, g) !== false) {
                this.resourceRecord = c;
                this.originalStart = f;
                this.resourceRegion = b.getScheduleRegion(this.resourceRecord, this.originalStart);
                this.dateConstraints = b.getDateConstraints(this.resourceRecord, this.originalStart);
                return true;
            }
        }
        return false;
    },
    isCreateAllowed: function(a) {
        return !a.getTarget(this.schedulerView.eventSelector);
    },
    onDragStart: function() {
        var d = this, b = d.schedulerView, a = d.tracker.getRegion(), c = d.getProxy();
        this.dragging = true;
        if (this.hoverTip) {
            this.hoverTip.disable();
        }
        d.start = d.originalStart;
        d.end = d.start;
        d.originalScroll = b.getScroll();
        if (b.getMode() === "horizontal") {
            d.rowBoundaries = {
                top: d.resourceRegion.top,
                bottom: d.resourceRegion.bottom
            };
        } else {
            d.rowBoundaries = {
                left: d.resourceRegion.left,
                right: d.resourceRegion.right
            };
        }
        Ext.apply(a, d.rowBoundaries);
        if (b.rtl) {
            c.setStyle({
                right: "auto"
            });
        }
        c.setBox(a);
        c.show();
        b.fireEvent("dragcreatestart", b, c);
        if (d.showDragTip) {
            d.dragTip.enable();
            d.dragTip.update(d.start, d.end, true);
            d.dragTip.show(c);
            d.dragTip.setStyle("visibility", "visible");
        }
        Ext.ux.Scheduler2.util.ScrollManager.activate(b, b.getMode() === "horizontal" ? "horizontal" : "vertical");
    },
    onDrag: function(h, b) {
        var d = this, f = d.schedulerView, i = d.tracker.getRegion(), a = f.getStartEndDatesFromRegion(i, "round"), k = "";
        if (!a) {
            return;
        }
        d.start = a.start || d.start;
        d.end = a.end || d.end;
        var j = d.dateConstraints;
        if (j) {
            d.end = Ext.ux.Scheduler2.util.Date.constrain(d.end, j.start, j.end);
            d.start = Ext.ux.Scheduler2.util.Date.constrain(d.start, j.start, j.end);
        }
        d.valid = this.validatorFn.call(d.validatorFnScope || d, d.resourceRecord, d.start, d.end);
        if (d.valid && typeof d.valid !== "boolean") {
            k = d.valid.message;
            d.valid = d.valid.valid;
        }
        d.valid = d.valid !== false;
        if (d.showDragTip) {
            d.dragTip.update(d.start, d.end, d.valid, k);
        }
        Ext.apply(i, d.rowBoundaries);
        var g = f.getScroll();
        var c = this.getProxy();
        c.setBox(i);
        if (f.isHorizontal()) {
            c.setY(d.resourceRegion.top + d.originalScroll.top - g.top);
        }
    },
    eventSwallower: function(a) {
        a.stopPropagation();
        a.preventDefault();
    },
    onDragEnd: function(g, h) {
        var f = this, c = f.schedulerView, d = true, a = h.getTarget(), b = Ext.get(a);
        b.on("click", this.eventSwallower);
        setTimeout(function() {
            b.un("click", f.eventSwallower);
        }, 100);
        f.dragging = false;
        if (f.showDragTip) {
            f.dragTip.disable();
        }
        if (!f.start || !f.end || f.end - f.start <= 0) {
            f.valid = false;
        }
        f.createContext = {
            start: f.start,
            end: f.end,
            resourceRecord: f.resourceRecord,
            e: h,
            finalize: function() {
                f.finalize.apply(f, arguments);
            }
        };
        if (f.valid) {
            d = c.fireEvent("beforedragcreatefinalize", f, f.createContext, h, this.getProxy()) !== false;
        }
        if (d) {
            f.finalize(f.valid);
        }
        Ext.ux.Scheduler2.util.ScrollManager.deactivate();
    },
    finalize: function(a) {
        var b = this.createContext;
        var d = this.schedulerView;
        if (a) {
            var c = Ext.create(d.getEventStore().getModel());
            if (c.setCalendar) {
                c.setCalendar(d.getEventStore().getCalendar());
            }
            c.setStartEndDate(b.start, b.end);
            if (c.setCalendar) {
                c.setCalendar(null);
            }
            d.fireEvent("dragcreateend", d, c, b.resourceRecord, b.e, this.getProxy());
        } else {
            this.proxy.hide();
        }
        this.schedulerView.fireEvent("afterdragcreate", d, this.getProxy());
        if (this.hoverTip) {
            this.hoverTip.enable();
        }
    },
    dragging: false,
    initDragTracker: function() {
        var d = this, b = Ext.supports.Touch, a = d.schedulerView;
        var c = Ext.apply({
            el: a.el,
            rtl: a.rtl,
            deferredActivation: b ? 1e3 : false,
            tolerance: d.dragTolerance,
            listeners: {
                mousedown: d.verifyLeftButtonPressed,
                beforedragstart: d.onBeforeDragStart,
                dragstart: d.onDragStart,
                drag: d.onDrag,
                dragend: d.onDragEnd,
                scope: d
            }
        }, this.trackerConfig);
        this.bindRightClickPreventer();
        if (b) {
            this.showDragTip = false;
            this.showHoverTip = false;
            this.dragTip = null;
            this.hoverTip = null;
        } else {
            this.setupTooltips();
        }
        d.tracker = new Ext.ux.Scheduler2.util.DragTracker(c);
    },
    bindRightClickPreventer: function() {
        var a;
        if (Ext.isIE9m) {
            a = "mousedown";
        } else {
            a = "contextmenu";
        }
        this.schedulerView.el.on(a, this.stopDragCreateOnRightClick, this, {
            priority: 999
        });
    },
    stopDragCreateOnRightClick: function(a) {
        if (a.button !== 0 && this.dragging) {
            this.tracker.onMouseUp(a);
        }
    },
    setupTooltips: function() {
        var c = this, a = c.schedulerView;
        if (this.showDragTip) {
            var b = this.dragTip;
            if (b instanceof Ext.tip.ToolTip) {
                b.schedulerView = a;
                b.on("beforeshow", function() {
                    return c.dragging;
                });
            } else {
                this.dragTip = new Ext.ux.Scheduler2.tooltip.Tooltip(Ext.apply({
                    cls: "sch2-dragcreate-tip",
                    schedulerView: a,
                    listeners: {
                        beforeshow: function() {
                            return c.dragging;
                        }
                    }
                }, b));
            }
        }
        if (c.showHoverTip) {
            var d = c.hoverTip;
            if (d instanceof Ext.tip.ToolTip) {
                d.schedulerView = a;
            } else {
                c.hoverTip = Ext.ComponentManager.create(Ext.applyIf({
                    renderTo: Ext.getBody(),
                    target: a.el,
                    schedulerView: a
                }, d), "scheduler_hovertip");
            }
        }
    },
    verifyLeftButtonPressed: function(a, b) {
        return b.button === 0;
    },
    onSchedulerDestroy: function() {
        if (this.hoverTip) {
            this.hoverTip.destroy();
        }
        if (this.dragTip) {
            this.dragTip.destroy();
        }
        if (this.tracker) {
            this.tracker.destroy();
        }
        if (this.proxy) {
            Ext.destroy(this.proxy);
            this.proxy = null;
        }
    }
});

Ext.define("Ext.ux.Scheduler2.feature.SchedulerDragZone", {
    extend: Ext.dd.DragZone,
    repairHighlight: false,
    repairHighlightColor: "transparent",
    containerScroll: false,
    showTooltip: true,
    tip: null,
    tipIsProcessed: false,
    deltaSetXY: null,
    schedulerView: null,
    lastXY: null,
    showExactDropPosition: false,
    enableCopy: false,
    enableCopyKey: "SHIFT",
    validatorFn: function(b, a, c, f, d) {
        return true;
    },
    validatorFnScope: null,
    copyKeyPressed: false,
    dragDropProxyCls: "sch2-dd-ref",
    constructor: function(c, a) {
        if (Ext.isIE8m && window.top !== window) {
            Ext.dd.DragDropManager.notifyOccluded = true;
        }
        var b = this.proxy = this.proxy || new Ext.dd.StatusProxy({
            shadow: false,
            dropAllowed: this.dropAllowed,
            dropNotAllowed: this.dropNotAllowed,
            ensureAttachedToBody: Ext.emptyFn
        });
        this.callParent(arguments);
        this.isTarget = true;
        this.scroll = false;
        this.ignoreSelf = false;
        var d = this.schedulerView;
        if (d.touchScroll) {
            this.showTooltip = false;
        }
        d.el.appendChild(b.el);
        this.bindRightClickPreventer();
        b.addCls("sch2-dragproxy");
        d.on({
            eventdragstart: function() {
                Ext.ux.Scheduler2.util.ScrollManager.activate(d, d.constrainDragToResource && d.getMode());
            },
            aftereventdrop: function() {
                Ext.ux.Scheduler2.util.ScrollManager.deactivate();
            },
            scope: this
        });
    },
    bindRightClickPreventer: function() {
        var a;
        if (Ext.isIE10) {
            a = "contextmenu";
        } else {
            a = "mousedown";
        }
        this.schedulerView.el.on(a, this.preventRightClick, this, {
            priority: 999
        });
    },
    destroy: function() {
        this.callParent(arguments);
        Ext.destroyMembers(this, "tip");
    },
    preventRightClick: function(a) {
        if (this.dragging && a.button !== 0) {
            a.stopEvent();
            return false;
        }
    },
    autoOffset: function() {
        this.setDelta(0, 0);
    },
    setupConstraints: function(k, d, g, e, i, f, c) {
        this.clearTicks();
        var a = i && !this.showExactDropPosition && f > 1 ? f : 0;
        var h = !i && !this.showExactDropPosition && f > 1 ? f : 0;
        this.resetConstraints();
        this.initPageX = k.left + g;
        this.initPageY = k.top + e;
        var b = d.right - d.left;
        var j = d.bottom - d.top;
        if (i) {
            if (c) {
                this.setXConstraint(k.left + g, k.right - b + g, a);
            } else {
                this.setXConstraint(k.left, k.right, a);
            }
            this.setYConstraint(k.top + e, k.bottom - j + e, h);
        } else {
            this.setXConstraint(k.left + g, k.right - b + g, a);
            if (c) {
                this.setYConstraint(k.top + e, k.bottom - j + e, h);
            } else {
                this.setYConstraint(k.top, k.bottom, h);
            }
        }
    },
    setXConstraint: function(c, b, a) {
        this.leftConstraint = c;
        this.rightConstraint = b;
        this.minX = c;
        this.maxX = b;
        if (a) {
            this.setXTicks(this.initPageX, a);
        }
        this.constrainX = true;
    },
    setYConstraint: function(a, c, b) {
        this.topConstraint = a;
        this.bottomConstraint = c;
        this.minY = a;
        this.maxY = c;
        if (b) {
            this.setYTicks(this.initPageY, b);
        }
        this.constrainY = true;
    },
    onDragEnter: Ext.emptyFn,
    onDragOut: Ext.emptyFn,
    setVisibilityForSourceEvents: function(a) {
        Ext.Array.each(this.dragData.getEventBarElements(), function(b) {
            b[a ? "show" : "hide"]();
        });
    },
    onDragOver: function(g) {
        if (g && g.event.touches && g.event.touches.length > 1) {
            Ext.dd.DragDropManager.handleMouseUp(g);
            return;
        }
        var l = g ? g.getXY() : this.lastXY;
        this.checkShiftChange();
        var k = this.dragData;
        if (!k.originalHidden) {
            this.setVisibilityForSourceEvents(false);
            k.originalHidden = true;
        }
        var b = k.startDate;
        var d = k.newResource;
        var h = this.schedulerView;
        this.updateDragContext(g);
        if (this.showExactDropPosition) {
            var i = h.isHorizontal();
            var a = h.getDateFromCoordinate(i ? l[0] : l[1]) - k.sourceDate;
            var j = new Date(k.origStart - 0 + a);
            var f = h.timeAxisViewModel.getDistanceBetweenDates(j, k.startDate);
            if (k.startDate > h.timeAxis.getStart()) {
                var c = this.proxy.el;
                if (f) {
                    if (h.isHorizontal()) {
                        c.setX(l[0] + (this.schedulerView.rtl ? -f : f));
                    } else {
                        c.setY(l[1] + f);
                    }
                }
            }
        }
        if (k.startDate - b !== 0 || d !== k.newResource) {
            this.schedulerView.fireEvent("eventdrag", this.schedulerView, k.draggedRecords, k.startDate, k.newResource, k);
        }
        if (this.showTooltip) {
            this.tip.realign();
            this.tip.update(k.startDate, k.endDate, k.valid, k.message);
        }
        if (g) {
            this.lastXY = g.getXY();
        }
    },
    getCoordinate: function(a) {
        switch (this.schedulerView.getMode()) {
          case "horizontal":
            return a[0];

          case "vertical":
            return a[1];

          case "calendar":
            return a;
        }
    },
    getDragData: function(q) {
        var p = this.schedulerView, o = q.getTarget(p.eventSelector);
        if (!o || q.event.touches && q.event.touches.length > 1) {
            return;
        }
        var j = p.resolveEventRecord(o), m = p.resolveResource(o), f = p.resolveAssignmentRecord(o);
        if (!j || j.isDraggable() === false || p.fireEvent("beforeeventdrag", p, j, q) === false) {
            return null;
        }
        var h = q.getXY(), a = Ext.get(o), u = a.getXY(), i = [ h[0] - u[0], h[1] - u[1] ], l = a.getRegion();
        var k = p.getMode() === "horizontal";
        p.constrainDragToResource && !m && Ext.Error.raise("Resource could not be resolved for event: " + j.getId());
        var r = p.getDateConstraints(p.constrainDragToResource ? m : null, j);
        this.setupConstraints(p.getScheduleRegion(p.constrainDragToResource ? m : null, j), l, i[0], i[1], k, p.getSnapPixelAmount(), Boolean(r));
        var b = j.getStartDate(), n = j.getEndDate(), c = p.timeAxis, g = this.getRelatedRecords(f || j) || [], v = p.getElementsFromEventRecord(j, p.getMode() === "calendar" ? null : m);
        Ext.Array.each(g, function(e) {
            if (e instanceof Ext.ux.Scheduler2.model.Assignment) {
                v = v.concat(p.getElementsFromEventRecord(e.getEvent(), e.getResource()));
            } else {
                v = v.concat(p.getElementsFromEventRecord(e));
            }
        });
        v = Ext.Array.unique(v);
        var d = {
            offsets: i,
            repairXY: u,
            prevScroll: p.getScroll(),
            dateConstraints: r,
            eventBarEls: v,
            getEventBarElements: function() {
                return d.eventBarEls = Ext.Array.map(d.eventBarEls, function(e) {
                    return e.dom && e || Ext.get(e.id);
                });
            },
            draggedRecords: [ f || j ].concat(g),
            resourceRecord: m,
            sourceDate: p.getDateFromCoordinate(this.getCoordinate(h)),
            origStart: b,
            origEnd: n,
            startDate: b,
            endDate: n,
            timeDiff: 0,
            startsOutsideView: b < c.getStart(),
            endsOutsideView: n > c.getEnd(),
            duration: n - b,
            bodyScroll: Ext.getBody().getScroll(),
            eventObj: q
        };
        d.ddel = this.getDragElement(a, d);
        return d;
    },
    onStartDrag: function() {
        var b = this.schedulerView, a = this.dragData;
        Ext.Array.each(a.getEventBarElements(), function(c) {
            c.removeCls("sch2-event-hover");
        });
        b.fireEvent("eventdragstart", b, a.draggedRecords);
        b.getScrollable().on("scroll", this.onViewScroll, this);
    },
    alignElWithMouse: function(b, e, d) {
        this.callParent(arguments);
        var c = this.getTargetCoord(e, d), a = b.dom ? b : Ext.fly(b, "_dd");
        this.setLocalXY(a, c.x + this.deltaSetXY[0], c.y + this.deltaSetXY[1]);
    },
    onViewScroll: function(f, b, e) {
        var d = this.proxy, i = this.schedulerView, g = this.dragData;
        this.setVisibilityForSourceEvents(false);
        var h = d.getXY();
        var c;
        if (i.rtl) {
            c = [ h[0] - b + g.prevScroll.left, h[1] + e - g.prevScroll.top ];
        } else {
            c = [ h[0] + b - g.prevScroll.left, h[1] + e - g.prevScroll.top ];
        }
        var a = this.deltaSetXY;
        if (i.rtl) {
            this.deltaSetXY = [ a[0] - b + g.prevScroll.left, a[1] + e - g.prevScroll.top ];
        } else {
            this.deltaSetXY = [ a[0] + b - g.prevScroll.left, a[1] + e - g.prevScroll.top ];
        }
        g.prevScroll = {
            left: b,
            top: e
        };
        d.setXY(c);
        this.onDragOver();
    },
    getCopyKeyPressed: function() {
        return Boolean(this.enableCopy && this.dragData.eventObj[this.enableCopyKey.toLowerCase() + "Key"]);
    },
    checkShiftChange: function() {
        var b = this.getCopyKeyPressed(), a = this.dragData;
        if (b !== this.copyKeyPressed) {
            this.copyKeyPressed = b;
            if (b) {
                a.refElements.addCls("sch2-event-copy");
                this.setVisibilityForSourceEvents(true);
            } else {
                a.refElements.removeCls("sch2-event-copy");
                this.setVisibilityForSourceEvents(false);
            }
        }
    },
    onKey: function(a) {
        if (this.enableCopy && a.getKey() === a[this.enableCopyKey]) {
            this.checkShiftChange();
        }
        if (a.getKey() === a.ESC) {
            this.dragData.ddCallbackArgs = [ a.getTarget(), a, this.id ];
            this.finalize(false);
            Ext.dd.DragDropManager.stopDrag(a);
            Ext.dd.DragDropManager.stopEvent(a);
        }
    },
    startDrag: function() {
        Ext.getDoc().on({
            keydown: this.onKey,
            keyup: this.onKey,
            useCapture: true,
            scope: this
        });
        var e = this.callParent(arguments);
        var d = this.dragData;
        d.refElement = this.proxy.el.down("." + this.dragDropProxyCls);
        d.refElements = this.proxy.el.select(".sch2-event");
        d.refElement.removeCls("sch2-event-hover");
        if (this.showTooltip) {
            var a = this.schedulerView, c = a.up("[lockable=true]").el;
            if (!this.tipIsProcessed) {
                this.tipIsProcessed = true;
                var b = this.tip;
                if (b instanceof Ext.tip.ToolTip) {
                    b.schedulerView = a;
                } else {
                    this.tip = new Ext.ux.Scheduler2.tooltip.Tooltip(Ext.apply({
                        schedulerView: a,
                        cls: "sch2-dragdrop-tip",
                        constrainTo: c
                    }, b));
                }
            }
            this.tip.update(d.origStart, d.origEnd, true);
            this.tip.setStyle("visibility");
            this.tip.show(d.refElement, d.offsets[0]);
        }
        this.copyKeyPressed = this.getCopyKeyPressed();
        if (this.copyKeyPressed) {
            d.refElements.addCls("sch2-event-copy");
            d.originalHidden = true;
        }
        return e;
    },
    endDrag: function() {
        this.schedulerView.getScrollable().un("scroll", this.onViewScroll, this);
        Ext.getDoc().un({
            keydown: this.onKey,
            keyup: this.onKey,
            useCapture: true,
            scope: this
        });
        this.callParent(arguments);
    },
    onMouseUp: function() {
        if (!this.dragging) {
            this.afterDragFinalized();
        }
    },
    afterDragFinalized: function() {
        this.proxy.el.setStyle({
            left: 0,
            top: 0
        });
    },
    updateRecords: function(c) {
        var k = this, l = k.schedulerView, f = l.getEventStore(), n = l.getResourceStore(), i = f.getAssignmentStore(), g = c.newResource, h = c.draggedRecords[0], b = c.draggedRecords.slice(1), j = c.resourceRecord, m = k.getCopyKeyPressed(), d = c.startDate, a = c.timeDiff, e = l.getMode();
        if (i && f instanceof Ext.ux.Scheduler2.data.EventStore) {
            k.updateRecordsMultipleAssignmentMode(d, a, h, b, j, g, f, n, i, m, e);
        } else {
            if (i) {
                k.updateRecordsSingleAssignmentMode(d, a, h.getEvent(), Ext.Array.map(b, function(o) {
                    return o.getEvent();
                }), j, g, f, n, m, e);
            } else {
                k.updateRecordsSingleAssignmentMode(d, a, h, b, j, g, f, n, m, e);
            }
        }
        l.fireEvent("eventdrop", l, c.draggedRecords, m);
    },
    updateRecordsSingleAssignmentMode: function(c, b, l, i, e, j, f, k, a, d) {
        var h = this, m = [];
        if (a) {
            l = l.fullCopy(null);
            m.push(l);
        }
        l.beginEdit();
        if (!a && j !== e && e instanceof Ext.ux.Scheduler2.model.Resource && j instanceof Ext.ux.Scheduler2.model.Resource) {
            l.reassign(e, j);
        } else {
            if (j !== e && e instanceof Ext.ux.Scheduler2.model.Resource && j instanceof Ext.ux.Scheduler2.model.Resource) {
                l.assign(j);
            }
        }
        l.setStartDate(c, true, f.skipWeekendsDuringDragDrop);
        l.endEdit();
        if (d !== "calendar") {
            var g = k.indexOf(e) - k.indexOf(j);
            Ext.Array.each(i, function(o) {
                var n = o.getResources();
                if (a) {
                    o = o.fullCopy(null);
                    m.push(o);
                }
                o.beginEdit();
                o.setStartDate(h.adjustStartDate(o.getStartDate(), b), true, f.skipWeekendsDuringDragDrop);
                g !== 0 && n.length && Ext.Array.each(n, function(s) {
                    var q = k.indexOf(s) - g, p;
                    if (q < 0) {
                        q = 0;
                    } else {
                        if (q >= k.getCount()) {
                            q = k.getCount() - 1;
                        }
                    }
                    p = k.getAt(q);
                    o.reassign(s, p);
                });
                o.endEdit();
            });
        }
        if (m.length) {
            f.append(m);
        }
    },
    updateRecordsMultipleAssignmentMode: function(c, b, h, l, e, j, f, k, g, a, d) {
        var i = this;
        Ext.Array.each([].concat(h, l), function(n) {
            var m = n.getEvent();
            m.setStartDate(i.adjustStartDate(m.getStartDate(), b), true, f.skipWeekendsDuringDragDrop);
            if (d != "calendar" && e !== j) {
                if (a) {
                    m.assign(j);
                } else {
                    if (!m.isAssignedTo(j)) {
                        m.reassign(n.getResource(), j);
                    } else {
                        m.unassign(n.getResource());
                    }
                }
            }
        });
    },
    isValidDrop: function(a, b, c) {
        if (a !== b) {
            if (c instanceof Ext.ux.Scheduler2.model.Assignment) {
                return !c.getEvent().isAssignedTo(b);
            } else {
                return !c.isAssignedTo(b);
            }
        }
        return true;
    },
    resolveResource: function(e) {
        var c = this.proxy.el.dom;
        var f = this.dragData.bodyScroll;
        c.style.display = "none";
        var d = document.elementFromPoint(e[0] - f.left, e[1] - f.top);
        if (Ext.isIE8 && window.top.Siesta) {
            d = document.elementFromPoint(e[0] - f.left, e[1] - f.top);
        }
        c.style.display = "block";
        if (!d) {
            return null;
        }
        var a = this.schedulerView;
        if (d.className.match(Ext.baseCSSPrefix + "grid-item")) {
            return this.resolveResource([ e[0], e[1] + 3 ]);
        }
        if (!d.className.match(a.timeCellCls)) {
            var b = Ext.fly(d).up("." + a.timeCellCls);
            if (b) {
                d = b.dom;
            } else {
                return null;
            }
        }
        return a.resolveResource(d);
    },
    adjustStartDate: function(a, c) {
        var b = this.schedulerView;
        return b.timeAxis.roundDate(new Date(a - 0 + c), b.snapRelativeToEventStartDate ? a : false);
    },
    updateDragContext: function(h) {
        var b = this.dragData, g = h ? h.getXY() : this.lastXY;
        if (!b.refElement) {
            return;
        }
        var f = this.schedulerView, i = b.refElement.getRegion();
        if (f.timeAxis.isContinuous()) {
            if (f.isHorizontal() && this.minX < g[0] && g[0] < this.maxX || f.isVertical() && this.minY < g[1] && g[1] < this.maxY) {
                var c = f.getDateFromCoordinate(this.getCoordinate(g));
                b.timeDiff = c - b.sourceDate;
                b.startDate = this.adjustStartDate(b.origStart, b.timeDiff);
                b.endDate = new Date(b.startDate - 0 + b.duration);
            }
        } else {
            var d = this.resolveStartEndDates(i);
            b.startDate = d.startDate;
            b.endDate = d.endDate;
            b.timeDiff = b.startDate - b.origStart;
        }
        b.newResource = f.constrainDragToResource ? b.resourceRecord : this.resolveResource([ i.left + b.offsets[0], i.top + b.offsets[1] ]);
        if (b.newResource) {
            var a = !h || this.validatorFn.call(this.validatorFnScope || this, b.draggedRecords, b.newResource, b.startDate, b.duration, h);
            if (!a || typeof a === "boolean") {
                b.valid = a !== false;
                b.message = "";
            } else {
                b.valid = a.valid !== false;
                b.message = a.message;
            }
        } else {
            b.valid = false;
        }
    },
    getRelatedRecords: function(c) {
        var b = this.schedulerView, d = b.getEventSelectionModel(), a = d.getDraggableSelections();
        return Ext.Array.filter(a, function(e) {
            return c !== e;
        });
    },
    getDragElement: function(b, e) {
        var h = e.getEventBarElements();
        var g;
        var d;
        var a = e.offsets[0];
        var f = e.offsets[1];
        if (h.length > 1) {
            var c = Ext.core.DomHelper.createDom({
                tag: "div",
                cls: "sch2-dd-wrap",
                style: {
                    overflow: "visible"
                }
            });
            Ext.Array.each(h, function(j) {
                g = j.dom.cloneNode(true);
                g.id = Ext.id();
                if (j.dom === b.dom) {
                    g.className += " " + this.dragDropProxyCls;
                    if (Ext.isIE8) {
                        Ext.fly(g).addCls(this.dragDropProxyCls);
                    }
                }
                c.appendChild(g);
                var i = j.getOffsetsTo(b);
                Ext.fly(g).setStyle({
                    left: i[0] - a + "px",
                    top: i[1] - f + "px"
                });
            }, this);
            d = c;
        } else {
            g = b.dom.cloneNode(true);
            g.id = Ext.id();
            g.style.left = -a + "px";
            g.style.top = -f + "px";
            g.className += " " + this.dragDropProxyCls;
            if (Ext.isIE8) {
                Ext.fly(g).addCls(this.dragDropProxyCls);
            }
            d = g;
        }
        if (!b.dom.style.height) {
            Ext.fly(d).setHeight(b.getHeight());
        }
        return d;
    },
    onDragDrop: function(h, i) {
        this.updateDragContext(h);
        var d = this, b = d.schedulerView, g = d.cachedTarget || Ext.dd.DragDropMgr.getDDById(i), f = d.dragData, a = false, c = true;
        f.ddCallbackArgs = [ g, h, i ];
        if (f.valid && f.startDate && f.endDate) {
            f.finalize = function() {
                d.finalize.apply(d, arguments);
            };
            c = b.fireEvent("beforeeventdropfinalize", d, f, h) !== false;
            if (c && d.isValidDrop(f.resourceRecord, f.newResource, f.draggedRecords[0])) {
                a = f.startDate - f.origStart !== 0 || f.newResource !== f.resourceRecord;
            }
        }
        if (c) {
            d.finalize(f.valid && a);
        } else {
            d.proxy.el.addCls("sch2-before-drag-finalized");
        }
    },
    finalize: function(c) {
        var f = this, b = f.schedulerView, d = b.getEventStore(), g = f.dragData;
        f.proxy.el.removeCls("sch2-before-drag-finalized");
        if (f.tip) {
            f.tip.hide();
        }
        if (c) {
            var a, e = function() {
                a = true;
            };
            d.on("update", e, null, {
                single: true
            });
            f.updateRecords(g);
            d.un("update", e, null, {
                single: true
            });
            if (!a) {
                f.onInvalidDrop.apply(f, g.ddCallbackArgs);
            } else {
                if (Ext.isIE9) {
                    f.proxy.el.setStyle("visibility", "hidden");
                    Ext.Function.defer(f.onValidDrop, 10, f, g.ddCallbackArgs);
                } else {
                    f.onValidDrop.apply(f, g.ddCallbackArgs);
                }
                b.fireEvent("aftereventdrop", b, g.draggedRecords);
            }
            f.afterDragFinalized();
        } else {
            f.onInvalidDrop.apply(f, g.ddCallbackArgs);
        }
    },
    onInvalidDrop: function(d, c, f) {
        if (Ext.isIE && !c) {
            c = d;
            d = c.getTarget() || document.body;
        }
        if (this.tip) {
            this.tip.hide();
        }
        this.setVisibilityForSourceEvents(true);
        var a = this.schedulerView, b = this.callParent([ d, c, f ]);
        a.fireEvent("aftereventdrop", a, this.dragData.draggedRecords);
        this.afterDragFinalized();
        return b;
    },
    resolveStartEndDates: function(f) {
        var a = this.dragData, c, e = a.origStart, b = a.origEnd;
        var d = Ext.ux.Scheduler2.util.Date;
        if (!a.startsOutsideView) {
            c = this.schedulerView.getStartEndDatesFromRegion(f, "round");
            if (c) {
                e = c.start || a.startDate;
                b = d.add(e, d.MILLI, a.duration);
            }
        } else {
            if (!a.endsOutsideView) {
                c = this.schedulerView.getStartEndDatesFromRegion(f, "round");
                if (c) {
                    b = c.end || a.endDate;
                    e = d.add(b, d.MILLI, -a.duration);
                }
            }
        }
        return {
            startDate: e,
            endDate: b
        };
    }
});

Ext.define("Ext.ux.Scheduler2.feature.DragDrop", {
    validatorFn: function(b, a, c, f, d) {
        return true;
    },
    validatorFnScope: null,
    dragConfig: null,
    constructor: function(b, a) {
        Ext.apply(this, a);
        this.schedulerView = b;
        b.eventDragZone = new Ext.ux.Scheduler2.feature.SchedulerDragZone(b.ownerCt.el, Ext.apply({
            ddGroup: b.id,
            schedulerView: b,
            validatorFn: this.validatorFn,
            validatorFnScope: this.validatorFnScope
        }, this.dragConfig));
        this.schedulerView.on("destroy", this.cleanUp, this);
        this.callParent([ a ]);
    },
    cleanUp: function() {
        var a = this.schedulerView;
        if (a.eventDragZone) {
            a.eventDragZone.destroy();
        }
    }
});

Ext.define("Ext.ux.Scheduler2.feature.Grouping", {
    extend: Ext.grid.feature.Grouping,
    alias: "feature.scheduler_grouping",
    headerRenderer: Ext.emptyFn,
    eventStoreDetacher: null,
    assignmentStoreDetacher: null,
    resourceStoreDetacher: null,
    schedulerGroupHeaderTpl: "{[this.renderCells(values)]}",
    headerCellTpl: '<tpl for="."><div class="sch2-grid-group-hd-cell {cellCls}" style="{cellStyle}; width: {width}px;"><span>{value}</span></div></tpl>',
    renderCells: function(d) {
        var b = this.view.getTimeAxisViewModel();
        var c = b.columnConfig[b.columnLinesFor];
        var a = Ext.Array.map(c, function(e) {
            var f = {};
            f.value = this.headerRenderer(e.start, e.end, d.children, f);
            f.width = b.getPositionFromDate(e.end) - b.getPositionFromDate(e.start);
            return f;
        }, this);
        return this.headerCellTpl.apply(a);
    },
    disable: function() {
        this.unbindStoreListeners();
        this.callParent(arguments);
    },
    enable: function() {
        this.bindStoreListeners();
        this.callParent(arguments);
    },
    init: function() {
        var a = this.view;
        var b = this;
        this.callParent(arguments);
        if (typeof this.headerCellTpl === "string") {
            this.headerCellTpl = new Ext.XTemplate(this.headerCellTpl);
        }
        if (a.getResourceStore) {
            this.bindStoreListeners();
            this.groupHeaderTpl = new Ext.XTemplate(this.schedulerGroupHeaderTpl, {
                renderCells: Ext.Function.bind(b.renderCells, b)
            });
            a.on({
                resourcestorechange: this.bindStoreListeners,
                eventstorechange: this.bindStoreListeners,
                assignmentstorechange: this.bindStoreListeners,
                scope: this
            });
        }
        Ext.apply(a, {
            getRowNode: function(c) {
                return this.retrieveNode(this.getRowId(c), true);
            }
        });
    },
    bindStoreListeners: function() {
        var a = this.view;
        if (!a.isLockedView) {
            var b = a.getEventStore();
            var c = this.getStoreListeners();
            this.unbindStoreListeners();
            if (b) {
                this.eventStoreDetacher = a.mon(b, c.eventStore);
            }
            if (b && b.getAssignmentStore()) {
                this.assignmentStoreDetacher = a.mon(b.getAssignmentStore(), c.assignmentStore);
            }
            if (a.getResourceStore()) {
                this.resourceStoreDetacher = a.mon(a.getResourceStore(), c.resourceStore);
            }
        }
    },
    unbindStoreListeners: function() {
        if (!this.view.isLockedView) {
            Ext.destroyMembers(this, "eventStoreDetacher", "resourceStoreDetacher", "assignmentStoreDetacher");
        }
    },
    getStoreListeners: function() {
        var a = this.view, b = {
            resourceStore: {
                add: this.onResourceAdd,
                destroyable: true,
                scope: this
            }
        };
        if (a.getEventStore) {
            b.eventStore = {
                add: this.onEventAddOrRemove,
                remove: this.onEventAddOrRemove,
                update: this.onEventUpdate,
                destroyable: true,
                scope: this
            };
            if (a.getEventStore().getAssignmentStore()) {
                b.assignmentStore = {
                    add: this.onAssignmentAddOrRemove,
                    remove: this.onAssignmentAddOrRemove,
                    destroyable: true,
                    scope: this
                };
            }
        }
        return b;
    },
    refreshGrouping: function(b) {
        var c = this;
        var a = {};
        Ext.Array.each(b, function(e) {
            if (e) {
                var f = c.getRecordGroup(e).first();
                var d = f.getId();
                if (!a[d]) {
                    a[d] = f;
                    c.refreshGroupHeader(f, true);
                }
            }
        });
    },
    onAssignmentAddOrRemove: function(b, a) {
        if (!this.view.getStore().isGrouped()) {
            return;
        }
        var c = this.view.getResourceStore();
        this.refreshGrouping(Ext.Array.map(a, function(d) {
            return d.getResource(c);
        }));
    },
    onEventUpdate: function(f, d) {
        if (!this.view.getStore().isGrouped()) {
            return;
        }
        var g = this;
        var h = f.getAssignmentStore();
        if (h) {
            g.refreshGrouping(d.getResources());
        } else {
            var c = f.getResourceStore().getGroupField();
            var a = d.previous && d.resourceIdField in d.previous;
            var e = d.getResource();
            if (a) {
                var b = f.getResourceStore().getById(d.previous[d.resourceIdField]);
                if (b && (!e || b.get(c) !== e.get(c))) {
                    g.refreshGroupHeader(b);
                }
            }
            if (e) {
                g.refreshGroupHeader(e);
            }
        }
    },
    onEventAddOrRemove: function(c, b) {
        if (!this.view.getStore().isGrouped()) {
            return;
        }
        var d = this;
        var a = d.view;
        this.refreshGrouping(Ext.Array.map(b, function(e) {
            return e.getResource(null, a.getEventStore());
        }));
    },
    onResourceAdd: function(b, a) {
        if (!this.view.getStore().isGrouped()) {
            return;
        }
        this.refreshGrouping(a);
    },
    refreshGroupHeader: function(d, c) {
        var b = this, a = b.view;
        if (b.disabled || !b.view.getResourceStore().isGrouped()) {
            return;
        }
        a.refreshNode(c ? d : b.getRecordGroup(d).first());
    }
});

Ext.define("Ext.ux.Scheduler2.feature.ResizeZone", {
    extend: Ext.util.Observable,
    showTooltip: true,
    showExactResizePosition: false,
    validatorFn: Ext.emptyFn,
    validatorFnScope: null,
    schedulerView: null,
    origEl: null,
    handlePos: null,
    eventRec: null,
    tip: null,
    tipInstance: null,
    startScroll: null,
    constructor: function(a) {
        Ext.apply(this, a);
        var b = this.schedulerView;
        b.on({
            destroy: this.cleanUp,
            scope: this
        });
        b.el.on({
            mousedown: this.onMouseDown,
            mouseup: this.onMouseUp,
            scope: this,
            delegate: ".sch2-resizable-handle"
        });
        this.bindRightClickPreventer();
        this.callParent(arguments);
    },
    bindRightClickPreventer: function() {
        var a;
        if (Ext.isIE9m) {
            a = "mousedown";
        } else {
            a = "contextmenu";
        }
        var b = {
            scope: this,
            priority: 999
        };
        b[a] = this.preventRightClick;
        this.schedulerView.el.on(b);
    },
    preventRightClick: function(a) {
        if (a.button !== 0 && this.resizer) {
            a.stopEvent();
            return false;
        }
    },
    onMouseDown: function(f, a) {
        var b = this.schedulerView;
        var d = this.eventRec = b.resolveEventRecord(a);
        var c = d.isResizable();
        if (f.button !== 0 || (c === false || typeof c === "string" && !a.className.match(c))) {
            return;
        }
        this.eventRec = d;
        this.handlePos = this.getHandlePosition(a);
        this.origEl = Ext.get(f.getTarget(".sch2-event"));
        b.el.on({
            mousemove: this.onMouseMove,
            scope: this,
            single: true
        });
    },
    onMouseUp: function(c, a) {
        var b = this.schedulerView;
        b.el.un({
            mousemove: this.onMouseMove,
            scope: this,
            single: true
        });
    },
    getTipInstance: function() {
        if (this.tipInstance) {
            return this.tipInstance;
        }
        var a = this.schedulerView;
        var c = this.tip;
        var b = a.up("[lockable=true]").el;
        if (c instanceof Ext.tip.ToolTip) {
            c.schedulerView = a;
        } else {
            c = new Ext.ux.Scheduler2.tooltip.Tooltip(Ext.apply({
                rtl: this.rtl,
                schedulerView: a,
                constrainTo: b,
                cls: "sch2-resize-tip"
            }, c));
        }
        return this.tipInstance = c;
    },
    onMouseMove: function(h, a) {
        var b = this.schedulerView, g = this.eventRec, d = this.handlePos;
        if (!g || b.fireEvent("beforeeventresize", b, g, h) === false) {
            return;
        }
        delete this.eventRec;
        h.stopEvent();
        this.origEl.addCls("sch2-event-resizing");
        this.resizer = this.createResizer(this.origEl, g, d);
        var c = this.resizer.resizeTracker;
        if (this.showTooltip) {
            var f = this.getTipInstance();
            f.setTarget(this.origEl);
            f.update(g.getStartDate(), g.getEndDate(), true);
            f.show(this.origEl, h.getX() - this.origEl.getX());
        }
        c.onMouseDown(h, this.resizer[d].dom);
        c.onMouseMove(h, this.resizer[d].dom);
        b.fireEvent("eventresizestart", b, g);
        b.getScrollable().on("scroll", this.onViewScroll, this);
    },
    getHandlePosition: function(b) {
        var a = b.className.match("start");
        if (this.schedulerView.getMode() === "horizontal") {
            if (this.schedulerView.rtl) {
                return a ? "east" : "west";
            }
            return a ? "west" : "east";
        } else {
            return a ? "north" : "south";
        }
    },
    createResizer: function(d, i, c) {
        var p = this.schedulerView, h = this, g = p.resolveResource(d), l = p.getSnapPixelAmount(), o = p.getScheduleRegion(g, i), b = p.getDateConstraints(g, i), n = d.getHeight(), a = p.rtl && c[0] === "e" || !p.rtl && c[0] === "w" || c[0] === "n", j = p.getMode() !== "horizontal", f = {
            otherEdgeX: a ? d.getRight() : d.getLeft(),
            otherEdgeY: a ? d.getBottom() : d.getTop(),
            target: d,
            isStart: a,
            startYOffset: d.getY() - d.parent().getY(),
            startXOffset: d.getX() - d.parent().getX(),
            dateConstraints: b,
            resourceRecord: g,
            eventRecord: i,
            handles: c[0],
            minHeight: n,
            constrainTo: o,
            listeners: {
                resizedrag: this.partialResize,
                resize: this.afterResize,
                scope: this
            }
        };
        if (j) {
            if (l > 0) {
                var k = d.getWidth();
                Ext.apply(f, {
                    minHeight: l,
                    minWidth: k,
                    maxWidth: k,
                    heightIncrement: l
                });
            }
        } else {
            if (l > 0) {
                Ext.apply(f, {
                    minWidth: l,
                    maxHeight: n,
                    widthIncrement: l
                });
            }
        }
        var m = new Ext.resizer.Resizer(f);
        if (m.resizeTracker) {
            m.resizeTracker.tolerance = -1;
            var e = m.resizeTracker.updateDimensions;
            m.resizeTracker.updateDimensions = function(r) {
                if (!Ext.isWebKit || !r.getTarget || r.getTarget(".sch2-timelineview")) {
                    var q;
                    if (j) {
                        q = p.getScrollY() - h.startScroll.top;
                        m.resizeTracker.minHeight = f.minHeight - Math.abs(q);
                    } else {
                        q = p.getScrollX() - h.startScroll.left;
                        m.resizeTracker.minWidth = f.minWidth - Math.abs(q);
                    }
                    e.apply(this, arguments);
                }
            };
            m.resizeTracker.resize = function(q) {
                var r;
                if (j) {
                    r = p.getScrollY() - h.startScroll.top;
                    if (c[0] === "s") {
                        q.y -= r;
                    }
                    q.height += Math.abs(r);
                } else {
                    r = p.getScrollX() - h.startScroll.left;
                    if (c[0] === "e") {
                        q.x -= r;
                    }
                    q.width += Math.abs(r);
                }
                Ext.resizer.ResizeTracker.prototype.resize.apply(this, arguments);
            };
        }
        d.setStyle("z-index", parseInt(d.getStyle("z-index"), 10) + 1);
        Ext.ux.Scheduler2.util.ScrollManager.activate(p, p.getMode() === "horizontal" ? "horizontal" : "vertical");
        this.startScroll = p.getScroll();
        return m;
    },
    getStartEndDates: function() {
        var e = this.resizer, c = e.el, d = this.schedulerView, b = e.isStart, g, a, f;
        if (b) {
            if (d.getMode() === "horizontal") {
                f = [ d.rtl ? c.getRight() : c.getLeft() + 1, c.getTop() ];
            } else {
                f = [ (c.getRight() + c.getLeft()) / 2, c.getTop() ];
            }
            a = e.eventRecord.getEndDate();
            if (d.snapRelativeToEventStartDate) {
                g = d.getDateFromXY(f);
                g = d.timeAxis.roundDate(g, e.eventRecord.getStartDate());
            } else {
                g = d.getDateFromXY(f, "round");
            }
        } else {
            if (d.getMode() === "horizontal") {
                f = [ d.rtl ? c.getLeft() : c.getRight(), c.getBottom() ];
            } else {
                f = [ (c.getRight() + c.getLeft()) / 2, c.getBottom() ];
            }
            g = e.eventRecord.getStartDate();
            if (d.snapRelativeToEventStartDate) {
                a = d.getDateFromXY(f);
                a = d.timeAxis.roundDate(a, e.eventRecord.getEndDate());
            } else {
                a = d.getDateFromXY(f, "round");
            }
        }
        g = g || e.start;
        a = a || e.end;
        if (e.dateConstraints) {
            g = Ext.ux.Scheduler2.util.Date.constrain(g, e.dateConstraints.start, e.dateConstraints.end);
            a = Ext.ux.Scheduler2.util.Date.constrain(a, e.dateConstraints.start, e.dateConstraints.end);
        }
        return {
            start: g,
            end: a
        };
    },
    partialResize: function(n, q, o, t) {
        var l = this.schedulerView, f = t ? t.getXY() : this.resizer.resizeTracker.lastXY, m = this.getStartEndDates(f), d = m.start, c = m.end, b = n.eventRecord, i = l.isHorizontal();
        if (i) {
            n.target.el.setY(n.target.parent().getY() + n.startYOffset);
        } else {
            n.target.el.setX(n.target.parent().getX() + n.startXOffset);
        }
        if (this.showTooltip) {
            var p = this.validatorFn.call(this.validatorFnScope || this, n.resourceRecord, b, d, c);
            var k = "";
            if (p && typeof p !== "boolean") {
                k = p.message;
                p = p.valid;
            }
            this.getTipInstance().update(d, c, p !== false, k);
        }
        if (this.showExactResizePosition) {
            var u = n.target.el, h, j, g;
            if (n.isStart) {
                if (l.getMode() === "calendar") {
                    var a = l.calendar.getEventColumns(b)[0];
                    h = l.timeAxisViewModel.getDistanceBetweenDates(d, a.end);
                } else {
                    h = l.timeAxisViewModel.getDistanceBetweenDates(d, b.getEndDate());
                }
                if (i) {
                    j = l.getDateFromCoordinate(n.otherEdgeX - Math.min(q, n.maxWidth)) || d;
                    g = l.timeAxisViewModel.getDistanceBetweenDates(j, d);
                    u.setWidth(h);
                    u.setX(u.getX() + g);
                } else {
                    j = l.getDateFromCoordinate(n.otherEdgeY - Math.min(q, n.maxHeight)) || d;
                    g = l.timeAxisViewModel.getDistanceBetweenDates(j, d);
                    u.setHeight(h);
                    u.setY(u.getY() + g);
                }
            } else {
                h = l.timeAxisViewModel.getDistanceBetweenDates(b.getStartDate(), c);
                if (i) {
                    u.setWidth(h);
                } else {
                    u.setHeight(h);
                }
            }
        } else {
            if (!d || !c || n.start - d === 0 && n.end - c === 0) {
                return;
            }
        }
        n.end = c;
        n.start = d;
        l.fireEvent("eventpartialresize", l, b, d, c, n.el);
    },
    onViewScroll: function(b, a) {
        this.resizer.resizeTracker.onDrag({});
        this.partialResize(this.resizer, 0, 0);
    },
    afterResize: function(b, n, g, i) {
        var k = this, j = b.resourceRecord, l = b.eventRecord, f = l.getStartDate(), q = l.getEndDate(), c = b.start || f, d = b.end || q, p = k.schedulerView, o = false, m = true, a = k.validatorFn.call(k.validatorFnScope || k, j, l, c, d, i);
        Ext.ux.Scheduler2.util.ScrollManager.deactivate();
        p.getScrollable().un("scroll", this.onViewScroll, this);
        if (this.showTooltip) {
            this.getTipInstance().hide();
        }
        p.el.select("[id^=calendar-resizer-placeholder]").remove();
        k.resizeContext = {
            resourceRecord: b.resourceRecord,
            eventRecord: l,
            start: c,
            end: d,
            finalize: function() {
                k.finalize.apply(k, arguments);
            }
        };
        if (a && typeof a !== "boolean") {
            a = a.valid;
        }
        if (c && d && d - c > 0 && (c - f !== 0 || d - q !== 0) && a !== false) {
            m = p.fireEvent("beforeeventresizefinalize", k, k.resizeContext, i) !== false;
            o = true;
        } else {
            p.repaintEventsForResource(j);
        }
        if (m) {
            k.finalize(o);
        }
    },
    finalize: function(a) {
        var b = this.schedulerView;
        var e = this.resizeContext;
        var d = false;
        var c = function() {
            d = true;
        };
        b.getEventStore().on("update", c);
        this.resizer.target.destroy();
        if (Ext.isIE) {
            document.body.focus();
        }
        if (a) {
            if (this.resizer.isStart) {
                e.eventRecord.setStartDate(e.start, false, b.getEventStore().skipWeekendsDuringDragDrop);
            } else {
                e.eventRecord.setEndDate(e.end, false, b.getEventStore().skipWeekendsDuringDragDrop);
            }
            if (!d) {
                b.repaintEventsForResource(e.resourceRecord);
            }
        } else {
            b.repaintEventsForResource(e.resourceRecord);
        }
        this.resizer.destroy();
        delete this.resizer;
        b.getEventStore().un("update", c);
        b.fireEvent("eventresizeend", b, e.eventRecord);
        this.resizeContext = null;
    },
    cleanUp: function() {
        if (this.tipInstance) {
            this.tipInstance.destroy();
        }
    }
});

Ext.define("Ext.ux.Scheduler2.field.CellEditor", {
    extend: Ext.form.field.Text,
    alias: "widget.celleditorfield",
    hidden: true,
    enableKeyEvents: true,
    divider: "-",
    dateFormat: "H",
    getErrors: function(c) {
        var b = this, a = b.callParent(arguments);
        if (c == null || c === "") {
            return a;
        }
        var d = this.getDates(c);
        if (!d[0]) {
            a.push("Start date is incorrect");
        }
        if (!d[1]) {
            a.push("End date is incorrect");
        }
        if (d[1] - d[0] < 0) {
            a.push("Start date is less then end date");
        }
        return a;
    },
    getDates: function(e) {
        var d = this;
        var b = e.split(d.divider);
        var f, a;
        if (Ext.isArray(d.dateFormat)) {
            for (var c = 0; c < d.dateFormat.length; c++) {
                f = f || Ext.Date.parse(b[0], d.dateFormat[c]);
                a = a || Ext.Date.parse(b[1], d.dateFormat[c]);
            }
        } else {
            f = Ext.Date.parse(b[0], d.dateFormat);
            a = Ext.Date.parse(b[1], d.dateFormat);
        }
        if (!f || !a) {
            return [];
        }
        if (d.record) {
            f = Ext.ux.Scheduler2.util.Date.mergeDates(d.record.getStartDate(), f, d.bottomUnit);
            a = Ext.ux.Scheduler2.util.Date.mergeDates(d.record.getEndDate(), a, d.bottomUnit);
        } else {
            f = Ext.ux.Scheduler2.util.Date.mergeDates(d.startDate, f, d.bottomUnit);
            a = Ext.ux.Scheduler2.util.Date.mergeDates(d.startDate, a, d.bottomUnit);
        }
        return [ f, a ];
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.Zones", {
    extend: Ext.ux.Scheduler2.feature.AbstractTimeSpan,
    alias: "plugin.scheduler_zones",
    innerTpl: null,
    cls: "sch2-zone",
    side: null,
    init: function(a) {
        if (Ext.isString(this.innerTpl)) {
            this.innerTpl = new Ext.XTemplate(this.innerTpl);
        }
        this.side = a.rtl ? "right" : "left";
        var b = this.innerTpl;
        if (!this.template) {
            this.template = new Ext.XTemplate('<tpl for="."><div id="{id}" class="{$cls}" style="' + this.side + ':{left}px;top:{top}px;height:{height}px;width:{width}px;{style}">' + (b ? "{[this.renderInner(values)]}" : "") + "</div></tpl>", {
                renderInner: function(c) {
                    return b.apply(c);
                }
            });
        }
        if (Ext.isString(this.innerHeaderTpl)) {
            this.innerHeaderTpl = new Ext.XTemplate(this.innerHeaderTpl);
        }
        this.callParent(arguments);
    },
    getElementData: function(h, d, r, f) {
        var g = this.schedulerView, t = [];
        var c = g.getTimeSpanRegion(h, d, this.expandToFitView);
        var b, k, a, j, n, e;
        r = r || this.store.getRange();
        for (var q = 0, p = r.length; q < p; q++) {
            b = r[q];
            k = b.getStartDate();
            a = b.getEndDate();
            e = this.getTemplateData(b);
            if (k && a && Ext.ux.Scheduler2.util.Date.intersectSpans(k, a, h, d)) {
                j = Ext.apply({}, e);
                j.id = this.getElementId(b);
                j.$cls = this.getElementCls(b, e);
                var m = g.getMode();
                if (m === "calendar") {
                    var s = g.getTimeSpanRegion(k, a);
                    j.left = s.left;
                    j.top = s.top;
                    j.height = s.bottom - s.top;
                    j.width = s.right - s.left;
                } else {
                    var u = g.getCoordinateFromDate(Ext.ux.Scheduler2.util.Date.max(k, h));
                    var o = g.getCoordinateFromDate(Ext.ux.Scheduler2.util.Date.min(a, d));
                    if (m === "horizontal") {
                        j.left = u;
                        j.top = c.top;
                        j.width = f ? 0 : o - u;
                        j.height = c.bottom - c.top;
                        j.style = f ? "border-left-width:" + (o - u) + "px" : "";
                    } else {
                        j.left = c.left;
                        j.top = u;
                        j.height = f ? 0 : o - u;
                        j.width = c.right - c.left;
                        j.style = f ? "border-top-width:" + (o - u) + "px" : "";
                    }
                }
                t.push(j);
            }
        }
        return t;
    },
    getHeaderElementId: function(b, a) {
        return this.callParent([ b ]) + (a ? "-start" : "-end");
    },
    getHeaderElementCls: function(b, d, a) {
        var c = b.clsField || this.clsField;
        if (!d) {
            d = this.getTemplateData(b);
        }
        return "sch2-header-indicator sch2-header-indicator-" + (a ? "start " : "end ") + this.uniqueCls + " " + (d[c] || "");
    },
    getZoneHeaderElementData: function(b, h, f, a) {
        var c = a ? f.getStartDate() : f.getEndDate(), e = null, g, i, d;
        if (c && Ext.ux.Scheduler2.util.Date.betweenLesser(c, b, h)) {
            g = this.getHeaderElementPosition(c);
            i = this.schedulerView.isHorizontal();
            d = this.getTemplateData(f);
            e = Ext.apply({
                id: this.getHeaderElementId(f, a),
                cls: this.getHeaderElementCls(f, d, a),
                isStart: a,
                side: i ? this.side : "top",
                position: g
            }, d);
        }
        return e;
    },
    getHeaderElementData: function(b) {
        var a = this.timeAxis.getStart(), h = this.timeAxis.getEnd(), e = [], g, d, j;
        b = b || this.store.getRange();
        for (var f = 0, c = b.length; f < c; f++) {
            g = b[f];
            d = this.getZoneHeaderElementData(a, h, g, true);
            if (d) {
                e.push(d);
            }
            j = this.getZoneHeaderElementData(a, h, g, false);
            if (j) {
                e.push(j);
            }
        }
        return e;
    },
    updateZoneHeaderElement: function(a, b) {
        a.dom.className = b.cls;
        if (this.schedulerView.isHorizontal()) {
            this.setElementX(a, b.position);
        } else {
            a.setTop(b.position);
        }
    },
    updateHeaderElement: function(c) {
        var a = this.timeAxis.getStart(), g = this.timeAxis.getEnd(), f = Ext.get(this.getHeaderElementId(c, true)), e = Ext.get(this.getHeaderElementId(c, false)), d = this.getZoneHeaderElementData(a, g, c, true), b = this.getZoneHeaderElementData(a, g, c, false);
        if (!(f && b) || !(e && b)) {
            Ext.destroy(f, e);
            this.renderHeaderElementsInternal([ c ]);
        } else {
            if (f) {
                if (!d) {
                    Ext.destroy(f);
                } else {
                    this.updateZoneHeaderElement(f, d);
                }
            }
            if (e) {
                if (!b) {
                    Ext.destroy(e);
                } else {
                    this.updateZoneHeaderElement(e, b);
                }
            }
        }
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.ResourceZones", {
    extend: Ext.ux.Scheduler2.plugin.Zones,
    alias: "plugin.scheduler_resourcezones",
    innerTpl: null,
    store: null,
    cls: "sch2-resourcezone",
    init: function(a) {
        this.store = Ext.StoreManager.lookup(this.store);
        this.uniqueCls = this.uniqueCls || "sch2-timespangroup-" + Ext.id();
        this.scheduler = a;
        a.registerRenderer(this.renderer, this);
        if (Ext.isString(this.innerTpl)) {
            this.innerTpl = new Ext.XTemplate(this.innerTpl);
        }
        var b = this.innerTpl;
        if (!this.template) {
            this.template = new Ext.XTemplate('<tpl for="."><div id="' + this.uniqueCls + '-{id}" class="' + this.cls + " " + this.uniqueCls + ' {Cls}" style="' + (a.rtl ? "right" : "left") + ':{start}px;width:{width}px;top:{start}px;height:{width}px;{style}">' + (b ? "{[this.renderInner(values)]}" : "{" + this.store.getModel().prototype.nameField + "}") + "</div></tpl>", {
                renderInner: function(c) {
                    return b.apply(c);
                }
            });
        }
        this.storeListeners = {
            load: this.fullRefresh,
            datachanged: this.fullRefresh,
            clear: this.fullRefresh,
            add: this.fullRefresh,
            remove: this.fullRefresh,
            update: this.refreshSingle,
            addrecords: this.fullRefresh,
            removerecords: this.fullRefresh,
            updaterecord: this.refreshSingle,
            scope: this
        };
        this.store.on(this.storeListeners);
    },
    destroy: function() {
        this.store.un(this.storeListeners);
        this.callParent(arguments);
    },
    fullRefresh: function() {
        this.scheduler.getSchedulingView().refreshView();
    },
    renderer: function(c, b, a, d) {
        if (this.scheduler.getOrientation() === "horizontal" || d === 0) {
            return this.renderZones(a);
        }
        return "";
    },
    renderZones: function(e) {
        var c = this.store, h = this.scheduler, k = h.timeAxis.getStart(), o = h.timeAxis.getEnd(), g = [], m = e.getEvents(c), p, d;
        for (var f = 0, l = m.length; f < l; f++) {
            var j = m[f];
            p = j.getStartDate();
            d = j.getEndDate();
            if (p && d && Ext.ux.Scheduler2.util.Date.intersectSpans(p, d, k, o)) {
                var n = h.getSchedulingView()[h.getOrientation()].getEventRenderData(j);
                var b, a;
                if (h.getMode() === "horizontal") {
                    b = h.rtl ? n.right : n.left;
                    a = n.width;
                } else {
                    b = n.top;
                    a = n.height;
                }
                g[g.length] = Ext.apply({
                    id: j.internalId,
                    start: b,
                    width: a,
                    Cls: j.getCls()
                }, j.data);
            }
        }
        return this.template.apply(g);
    },
    refreshSingle: function(i, g) {
        var c = Ext.get(this.uniqueCls + "-" + g.internalId);
        if (c) {
            var e = this.scheduler, f = e.timeAxis.getStart(), j = e.timeAxis.getEnd();
            var b = Ext.ux.Scheduler2.util.Date.max(f, g.getStartDate()), d = Ext.ux.Scheduler2.util.Date.min(j, g.getEndDate()), k = g.getCls();
            var h = e.getSchedulingView().getCoordinateFromDate(b);
            var a = e.getSchedulingView().getCoordinateFromDate(d) - h;
            c.dom.className = this.cls + " " + this.uniqueCls + " " + (k || "");
            c.setStyle({
                left: h + "px",
                top: h + "px",
                height: a + "px",
                width: a + "px"
            });
        }
    }
});

Ext.define("Ext.ux.Scheduler2.mixin.AbstractSchedulerPanel", {
    eventBarIconClsField: "",
    enableEventDragDrop: true,
    resourceColumnClass: "Ext.ux.Scheduler2.column.Resource",
    resourceColumnWidth: null,
    calendarColumnWidth: null,
    allowOverlap: true,
    startParamName: "startDate",
    endParamName: "endDate",
    passStartEndParameters: false,
    eventRenderer: null,
    eventRendererScope: null,
    eventStore: null,
    resourceStore: null,
    onEventCreated: function(a) {},
    resourceZones: null,
    resourceZonesConfig: null,
    initStores: function() {
        var a = this.resourceStore || this.store;
        if (this.crudManager && !(this.crudManager instanceof Ext.ux.Scheduler2.data.CrudManager)) {
            this.crudManager = new Ext.ux.Scheduler2.data.CrudManager(this.crudManager);
        }
        if (!a) {
            if (this.crudManager) {
                a = this.resourceStore = this.crudManager.getResourceStore();
            }
            a = a || new Ext.ux.Scheduler2.data.ResourceStore();
        }
        if (!this.eventStore) {
            if (this.crudManager) {
                this.eventStore = this.crudManager.getEventStore();
            }
            this.eventStore = this.eventStore || new Ext.ux.Scheduler2.data.EventStore();
        }
        this.store = Ext.StoreManager.lookup(a);
        this.resourceStore = this.store;
        this.setEventStore(this.eventStore);
        if (!this.eventStore || !this.eventStore.isEventStore) {
            Ext.Error.raise("Your eventStore should be a subclass of Ext.ux.Scheduler2.data.EventStore (or consume the EventStore mixin)");
        }
        this.resourceStore.eventStore = this.getEventStore();
    },
    _initializeSchedulerPanel: function() {
        this.initStores();
        if (this.eventBodyTemplate && Ext.isString(this.eventBodyTemplate)) {
            this.eventBodyTemplate = new Ext.XTemplate(this.eventBodyTemplate);
        }
        this.on("destroy", function() {
            this.setResourceStore(null);
            this.setEventStore(null);
        });
    },
    getResourceStore: function() {
        return this.resourceStore;
    },
    setResourceStore: function(b) {
        var e = this.getResourceStore();
        var c = e === this.store;
        b = b && Ext.StoreManager.lookup(b);
        var d = this.getEventStore();
        var f = this.getAssignmentStore();
        this.resourceStore = b;
        if (d) {
            d.setResourceStore(b);
        }
        if (this.getCrudManager()) {
            this.getCrudManager().setResourceStore(b);
        }
        var a = this.getSchedulingView();
        a && a.setResourceStore(b);
        if (b) {
            this.fireEvent("resourcestorechange", this, b, e);
            if (c) {
                this.reconfigure(this.resourceStore);
            } else {
                this.rendered && this.getView().relayFn("refreshView");
            }
        }
    },
    getEventStore: function() {
        return this.eventStore;
    },
    setEventStore: function(a) {
        var d = this.getEventStore();
        a = a && Ext.StoreManager.lookup(a);
        if (this.getEventStore()) {
            this.mun(this.getEventStore(), "beforeload", this.applyStartEndParameters, this);
        }
        var c = this.getResourceStore();
        var e = this.getAssignmentStore();
        this.eventStore = a;
        if (c) {
            c.setEventStore(a);
        }
        if (this.getCrudManager()) {
            this.getCrudManager().setEventStore(a);
        }
        if (e && a && !a.getAssignmentStore()) {
            a.setAssignmentStore(e);
        }
        var b = this.getSchedulingView();
        b && b.setEventStore(a);
        if (a) {
            this.fireEvent("eventstorechange", this, a, d);
            if (this.passStartEndParameters) {
                this.mon(a, "beforeload", this.applyStartEndParameters, this);
            }
            this.rendered && this.getView().relayFn("refreshView");
        }
    },
    applyStartEndParameters: function(c, a) {
        var b = c.getProxy();
        b.setExtraParam(this.startParamName, this.getStart());
        b.setExtraParam(this.endParamName, this.getEnd());
    },
    getAssignmentStore: function() {
        var a = this.getEventStore();
        return a && a.isStore && a.getAssignmentStore();
    },
    setAssignmentStore: function(a) {
        var b = this.getAssignmentStore();
        if (this.getCrudManager()) {
            this.getCrudManager().setAssignmentStore(a);
        }
        this.getEventStore().setAssignmentStore(a);
        if (a) {
            this.fireEvent("assignmentstorechange", this, a, b);
            this.rendered && this.getView().relayFn("refreshView");
        }
    },
    createResourceColumns: function(a) {
        return Ext.Array.map(this.resourceStore.getRange(), function(b) {
            return {
                xclass: this.resourceColumnClass,
                renderer: this.mainRenderer,
                scope: this,
                width: a || 100,
                text: b.getName(),
                model: b
            };
        }, this);
    }
});

Ext.define("Ext.ux.Scheduler2.template.Event", {
    extend: Ext.XTemplate,
    eventPrefix: null,
    resizeHandles: null,
    resizeTpl: '<div class="sch2-resizable-handle sch2-resizable-handle-{0}"></div>',
    constructor: function(b) {
        Ext.apply(this, b);
        var a = this.resizeHandles === "start" || this.resizeHandles === "both" ? '<div class="sch2-resizable-handle sch2-resizable-handle-start"></div>' : "";
        var c = this.resizeHandles === "end" || this.resizeHandles === "both" ? '<div class="sch2-resizable-handle sch2-resizable-handle-end"></div>' : "";
        this.callParent([ '<tpl for="."><div unselectable="on" tabindex="-1" id="' + this.eventPrefix + '{id}" style="right:{right}px;left:{left}px;top:{top}px;height:{height}px;width:{width}px;{style}" class="sch2-event ' + Ext.baseCSSPrefix + 'unselectable {internalCls} {cls}">' + a + '<div unselectable="on" class="sch2-event-inner {iconCls}">{body}</div>' + c + "</div></tpl>" ]);
    }
});

Ext.define("Ext.ux.Scheduler2.view.Vertical", {
    view: null,
    constructor: function(a) {
        Ext.apply(this, a);
    },
    translateToScheduleCoordinate: function(b) {
        var a = this.view;
        return b - a.getEl().getY() + a.getScroll().top;
    },
    translateToPageCoordinate: function(d) {
        var b = this.view;
        var c = b.getEl(), a = b.getScroll();
        return d + c.getY() - a.top;
    },
    getDateFromXY: function(c, b, a) {
        var d = c[1];
        if (!a) {
            d = this.translateToScheduleCoordinate(d);
        }
        return this.view.timeAxisViewModel.getDateFromPosition(d, b);
    },
    getEventRenderData: function(a, b, h) {
        var i = a.getStartDate(), g = a.getEndDate(), k = this.view, f = k.timeAxis.getStart(), l = k.timeAxis.getEnd(), j = Math, e = j.floor(k.getCoordinateFromDate(Ext.ux.Scheduler2.util.Date.max(i, f))), m = j.floor(k.getCoordinateFromDate(Ext.ux.Scheduler2.util.Date.min(g, l))), d = this.getResourceColumnWidth(b), c;
        c = {
            top: j.max(0, j.min(e, m) - k.eventBorderWidth),
            height: j.max(1, j.abs(e - m))
        };
        c.start = i;
        c.end = g;
        c.startsOutsideView = i < f;
        c.endsOutsideView = g > l;
        return c;
    },
    getScheduleRegion: function(d, f) {
        var h = this.view, g = d ? Ext.fly(h.getScheduleCell(0, h.getResourceStore().indexOf(d))).getRegion() : h.getTableRegion(), e = h.timeAxis.getStart(), k = h.timeAxis.getEnd(), a = h.getDateConstraints(d, f) || {
            start: e,
            end: k
        }, c = this.translateToPageCoordinate(h.getCoordinateFromDate(Ext.ux.Scheduler2.util.Date.max(e, a.start))), j = this.translateToPageCoordinate(h.getCoordinateFromDate(Ext.ux.Scheduler2.util.Date.min(k, a.end))), b = g.left + h.barMargin, i = (d ? g.left + this.getResourceColumnWidth(d) : g.right) - h.barMargin;
        return new Ext.util.Region(Math.min(c, j), i, Math.max(c, j), b);
    },
    getResourceColumnWidth: function(a) {
        return this.view.timeAxisViewModel.resourceColumnWidth;
    },
    getResourceRegion: function(h, b, g) {
        var j = this.view, e = j.getResourceStore().indexOf(h) * this.getResourceColumnWidth(h), i = j.timeAxis.getStart(), m = j.timeAxis.getEnd(), a = b ? Ext.ux.Scheduler2.util.Date.max(i, b) : i, d = g ? Ext.ux.Scheduler2.util.Date.min(m, g) : m, f = Math.max(0, j.getCoordinateFromDate(a) - j.cellTopBorderWidth), l = j.getCoordinateFromDate(d) - j.cellTopBorderWidth, c = e + j.cellBorderWidth, k = e + this.getResourceColumnWidth(h) - j.cellBorderWidth;
        return new Ext.util.Region(Math.min(f, l), k, Math.max(f, l), c);
    },
    columnRenderer: function(f, r, m, o, q) {
        var p = this.view;
        var e = "";
        if (o === 0) {
            var a = Ext.ux.Scheduler2.util.Date, k = p.timeAxis, n, c, j, g;
            n = [];
            c = p.getEventStore().getEventsForResource(m);
            for (j = 0, g = c.length; j < g; j++) {
                var b = c[j], d = b.getStartDate(), h = b.getEndDate();
                if (d && h && k.timeSpanInAxis(d, h)) {
                    n.push(p.generateTplData(b, m, q));
                }
            }
            p.eventLayout.vertical.applyLayout(n, this.getResourceColumnWidth(m) - 2 * p.barMargin - p.cellBorderWidth);
            e = "&#160;" + p.eventTpl.apply(n);
        }
        if (q % 2 === 1) {
            r.tdCls = (r.tdCls || "") + " " + p.altColCls;
            r.cellCls = (r.cellCls || "") + " " + p.altColCls;
        }
        return e;
    },
    resolveResource: function(f) {
        var e = this, b = e.view, d, c, a;
        d = Ext.fly(f).is(b.eventSelector) && f || Ext.fly(f).up(b.eventSelector, null, true);
        if (d) {
            a = b.getResourceRecordFromDomId(d.id);
        } else {
            f = Ext.fly(f).is(b.timeCellSelector) ? f : Ext.fly(f).up(b.timeCellSelector, null, true);
            c = -1;
            if (f && Ext.isIE8m) {
                f = f.previousSibling;
                while (f) {
                    if (f.nodeType === 1) {
                        c++;
                    }
                    f = f.previousSibling;
                }
            } else {
                if (f) {
                    c = Ext.Array.indexOf(Array.prototype.slice.call(f.parentNode.children), f);
                }
            }
            a = c >= 0 && b.getResourceStore().getAt(c) || null;
        }
        return a;
    },
    onEventUpdate: function(l, a) {
        var i = this;
        var g = a.previous || {};
        var j = i.view;
        var f = j.timeAxis;
        var b = a.getStartDate();
        var h = a.getEndDate();
        var c = g.StartDate || b;
        var e = g.EndDate || h;
        var k = c && e && f.timeSpanInAxis(c, e);
        var d;
        if (a.resourceIdField in g && k) {
            d = l.getResourceStore().getById(g[a.resourceIdField]);
            d && i.relayoutRenderedEvents(d);
        }
        if (b && h && f.timeSpanInAxis(b, h) || k) {
            i.renderSingle(a);
            Ext.Array.each(a.getResources(), function(m) {
                i.relayoutRenderedEvents(m);
                j.getEventSelectionModel().isSelected(a) && j.onEventBarSelect(a, true);
            });
        }
    },
    onEventAdd: function(c, f) {
        var e = this, b = e.view, d, a, g;
        if (f.length === 1) {
            d = f[0];
            a = d.getStartDate();
            g = d.getEndDate();
            if (a && g && b.timeAxis.timeSpanInAxis(a, g)) {
                e.renderSingle(d);
                Ext.Array.each(c.getResourcesForEvent(d), function(h) {
                    e.relayoutRenderedEvents(h);
                });
            }
        } else {
            b.repaintAllEvents();
        }
    },
    onEventRemove: function(k, j) {
        var g = this, h = g.view, a, c, e, d, f, b;
        for (b = false, d = 0, f = j.length; !b && d < f; d++) {
            a = j[d];
            c = a.getStartDate();
            e = a.getEndDate();
            b = c && e && h.timeAxis.timeSpanInAxis(c, e);
            b && h.repaintAllEvents();
        }
    },
    relayoutRenderedEvents: function(d) {
        var c = [], a = this.view, b = a.getEventStore().getEventsForResource(d);
        Ext.Array.each(b, function(f) {
            var e = a.getElementsFromEventRecord(f, d);
            e.length && c.push({
                start: f.getStartDate(),
                end: f.getEndDate(),
                event: f,
                node: e[0]
            });
        });
        a.eventLayout.vertical.applyLayout(c, this.getResourceColumnWidth(d) - 2 * a.barMargin - a.cellBorderWidth);
        Ext.Array.each(c, function(e) {
            e.node.setStyle({
                left: e.left + "px",
                width: e.width + "px"
            });
            a.fireEvent("eventrepaint", a, e.event, e.node);
        });
    },
    renderSingle: function(d) {
        var c = this, b = c.view, a = d.getStartDate(), f = d.getEndDate(), e;
        Ext.Array.each(b.getElementsFromEventRecord(d), function(g) {
            g.destroy();
        });
        if (a && f && b.timeAxis.timeSpanInAxis(a, f)) {
            Ext.Array.each(d.getResources(), function(j) {
                var i = b.getResourceStore().indexOf(j), g = Ext.fly(b.getScheduleCell(0, i)), h;
                if (g) {
                    h = b.generateTplData(d, j, i);
                    b.eventTpl.append(g.first(), [ h ]);
                }
            });
        }
    },
    getTimeSpanRegion: function(b, g) {
        var d = this.view, a = d.getCoordinateFromDate(b), f = g ? d.getCoordinateFromDate(g) : a, c = d.getTableRegion(), e = c ? c.right - c.left : d.getEl().dom.clientWidth;
        return new Ext.util.Region(Math.min(a, f), e, Math.max(a, f), 0);
    },
    getStartEndDatesFromRegion: function(d, c, b) {
        var a = this.view.getDateFromCoordinate(d.top, c), e = this.view.getDateFromCoordinate(d.bottom, c);
        if (a && e) {
            return {
                start: Ext.ux.Scheduler2.util.Date.min(a, e),
                end: Ext.ux.Scheduler2.util.Date.max(a, e)
            };
        } else {
            return null;
        }
    },
    setColumnWidth: function(c, b) {
        var a = this.view;
        a.resourceColumnWidth = c;
        a.getTimeAxisViewModel().setViewColumnWidth(c, b);
    },
    getVisibleDateRange: function() {
        var e = this.view;
        if (!e.rendered) {
            return null;
        }
        var c = e.getScroll(), b = e.getHeight(), d = e.getTableRegion(), f = e.timeAxis.getEnd();
        if (d.bottom - d.top < b) {
            var a = e.timeAxis.getStart();
            return {
                startDate: a,
                endDate: f
            };
        }
        return {
            startDate: e.getDateFromCoordinate(c.top, null, true),
            endDate: e.getDateFromCoordinate(c.top + b, null, true) || f
        };
    }
});

Ext.define("Ext.ux.Scheduler2.mixin.AbstractSchedulerView", {
    _cmpCls: "sch2-schedulerview",
    scheduledEventName: "event",
    eventTemplateClass: "Ext.ux.Scheduler2.template.Event",
    eventTpl: null,
    barMargin: 0,
    constrainDragToResource: false,
    allowOverlap: null,
    readOnly: null,
    altColCls: "sch2-col-alt",
    dynamicRowHeight: true,
    managedEventSizing: true,
    eventAnimations: true,
    horizontalLayoutCls: "Ext.ux.Scheduler2.eventlayout.Horizontal",
    horizontalEventSorterFn: null,
    verticalLayoutCls: "Ext.ux.Scheduler2.eventlayout.Vertical",
    verticalEventSorterFn: null,
    eventCls: "sch2-event",
    verticalViewClass: "Ext.ux.Scheduler2.view.Vertical",
    eventStore: null,
    resourceStore: null,
    eventLayout: null,
    _initializeSchedulerView: function() {
        var a = Ext.ClassManager.get(this.horizontalLayoutCls);
        var b = Ext.ClassManager.get(this.verticalLayoutCls);
        this.eventSelector = "." + this.eventCls;
        this.eventLayout = {};
        this.eventTpl = this.eventTpl || Ext.create(this.eventTemplateClass, {
            eventPrefix: this.eventPrefix,
            resizeHandles: this.eventResizeHandles
        });
        if (a) {
            this.eventLayout.horizontal = new a(Ext.apply({
                timeAxisViewModel: this.timeAxisViewModel
            }, {
                bandIndexToPxConvertFn: this.horizontal.layoutEventVertically,
                bandIndexToPxConvertScope: this.horizontal
            }, this.horizontalEventSorterFn ? {
                sortEvents: this.horizontalEventSorterFn
            } : {}));
        }
        if (b) {
            this.eventLayout.vertical = new b(Ext.apply({}, {
                view: this
            }, this.verticalEventSorterFn ? {
                sortEvents: this.verticalEventSorterFn
            } : {}));
        }
        this.store = this.store || this.resourceStore;
        this.resourceStore = this.resourceStore || this.store;
    },
    generateTplData: function(e, d, c) {
        var g = this[this.mode].getEventRenderData(e, d, c), h = e.getStartDate(), b = e.getEndDate(), a = e.getCls() || "";
        a += " sch2-event-resizable-" + e.getResizable();
        if (e.dirty) {
            a += " sch2-dirty ";
        }
        if (g.endsOutsideView) {
            a += " sch2-event-endsoutside ";
        }
        if (g.startsOutsideView) {
            a += " sch2-event-startsoutside ";
        }
        if (this.eventBarIconClsField) {
            a += " sch2-event-withicon ";
        }
        if (e.isDraggable() === false) {
            a += " sch2-event-fixed ";
        }
        if (b - h === 0) {
            a += " sch2-event-milestone ";
        }
        if (this.getEventSelectionModel().isSelected(e)) {
            a += " " + this.selectedEventCls + " ";
        }
        g.id = e.internalId + "-" + d.internalId + (this.getMode() === "calendar" ? "-" + c : "-x");
        g.internalCls = a;
        g.start = h;
        g.end = b;
        g.iconCls = e.data[this.eventBarIconClsField] || "";
        g.event = e;
        if (this.eventRenderer) {
            var f = this.eventRenderer.call(this.eventRendererScope || this, e, d, g, c);
            if (this.eventBodyTemplate) {
                g.body = this.eventBodyTemplate.apply(f);
            } else {
                g.body = f;
            }
        } else {
            if (this.eventBodyTemplate) {
                g.body = this.eventBodyTemplate.apply(e.data);
            } else {
                if (this.eventBarTextField) {
                    g.body = e.data[this.eventBarTextField] || "";
                }
            }
        }
        return g;
    },
    resolveResource: function(b) {
        var a = this;
        return a[a.mode].resolveResource(b);
    },
    getResourceRegion: function(b, a, c) {
        return this[this.mode].getResourceRegion(b, a, c);
    },
    resolveEventRecord: function(a) {
        a = a.dom ? a.dom : a;
        if (!Ext.fly(a).is(this.eventSelector)) {
            a = Ext.fly(a).up(this.eventSelector);
        }
        return a && this.getEventRecordFromDomId(a.id);
    },
    resolveEventRecordFromResourceRow: function(a) {
        var c = this, e = c.getEventSelectionModel(), d, b;
        a = a.dom ? a.dom : a;
        d = c.getRecord(a);
        return e.getFirstSelectedEventForResource(d);
    },
    resolveAssignmentRecord: function(a) {
        var c = this, e = c.getEventStore().getAssignmentStore(), f = null, b, d;
        if (e) {
            b = c.getEventRecordFromDomId(a.id);
            d = c.getResourceRecordFromDomId(a.id);
            if (b && d) {
                f = e.getAssignmentForEventAndResource(b, d);
            }
        }
        return f;
    },
    getEventRecordFromDomId: function(a) {
        a = this.getEventIdFromDomNodeId(a);
        return this.getEventStore().getModelByInternalId(a);
    },
    getResourceRecordFromDomId: function(a) {
        a = this.getResourceIdFromDomNodeId(a);
        return this.getResourceStore().getByInternalId(a);
    },
    isDateRangeAvailable: function(d, a, b, c) {
        return this.getEventStore().isDateRangeAvailable(d, a, b, c);
    },
    getEventsInView: function() {
        var b = this.timeAxis.getStart(), a = this.timeAxis.getEnd();
        return this.getEventStore().getEventsInTimeSpan(b, a);
    },
    getEventNodes: function() {
        return this.getEl().select(this.eventSelector);
    },
    highlightEvents: function(a) {
        var b = this;
        var c = [];
        Ext.Array.each([].concat(a), function(d) {
            c.push.apply(c, b.getElementsFromEventRecord(d, null, null, true));
        });
        Ext.Array.each([].concat(c), function(d) {
            Ext.fly(d).addCls("sch2-event-highlighted");
        });
    },
    highlightEventsBy: function(c, b) {
        var a = this.getEventsInView();
        this.highlightEvents(a.filterBy(c, b).getRange());
    },
    clearHighlightedEvents: function(b, a) {
        this.getEl().select(".sch2-event-highlighted").removeCls("sch2-event-highlighted");
    },
    onEventCreated: function(a) {},
    getEventStore: function() {
        return this.eventStore;
    },
    registerEventEditor: function(a) {
        this.eventEditor = a;
    },
    getEventEditor: function() {
        return this.eventEditor;
    },
    onEventUpdate: function(b, c, a) {
        this[this.mode].onEventUpdate(b, c, a);
    },
    onEventAdd: function(a, b) {
        if (!Ext.isArray(b)) {
            b = [ b ];
        }
        this[this.mode].onEventAdd(a, b);
    },
    onAssignmentAdd: function(b, a) {
        var c = this;
        Ext.Array.each(a, function(e) {
            var d = e.getResource();
            d && c.repaintEventsForResource(d);
        });
    },
    onAssignmentUpdate: function(d, g) {
        var f = this, a = g.previous && g.previous[g.resourceIdField], e = g.getResourceId(), b, c;
        if (a) {
            b = f.getResourceStore().getModelById(a);
            f.repaintEventsForResource(b);
        }
        if (e) {
            c = f.getResourceStore().getModelById(e);
            f.repaintEventsForResource(c);
        }
    },
    onAssignmentRemove: function(b, a) {
        var c = this;
        Ext.Array.each(a, function(e) {
            var f = e.getResourceId();
            var d = f && c.getResourceStore().getModelById(f);
            d && c.repaintEventsForResource(d);
        });
    },
    onEventRemove: function(a, b) {
        this[this.mode].onEventRemove(a, b);
    },
    setEventStore: function(d, b) {
        var f = this;
        var h = f.getEventStore();
        var a = {
            scope: f,
            refresh: f.onEventDataRefresh,
            addrecords: f.onEventAdd,
            updaterecord: f.onEventUpdate,
            removerecords: f.onEventRemove,
            add: f.onEventAdd,
            update: f.onEventUpdate,
            remove: f.onEventRemove,
            nodeinsert: f.onEventAdd,
            nodeappend: f.onEventAdd
        };
        var c = {
            scope: f,
            refresh: f.onEventDataRefresh,
            load: f.onEventDataRefresh,
            update: f.onAssignmentUpdate,
            add: f.onAssignmentAdd,
            remove: f.onAssignmentRemove
        };
        if (!Ext.versions.touch) {
            a.clear = f.onEventDataRefresh;
        }
        if (!b && f.eventStore) {
            f.eventStore.setResourceStore(null);
            if (d !== f.eventStore && f.eventStore.autoDestroy) {
                f.eventStore.destroy();
            } else {
                if (f.mun) {
                    f.mun(f.eventStore, a);
                    var e = f.eventStore.getAssignmentStore();
                    if (e) {
                        f.mun(e, c);
                    }
                } else {
                    f.eventStore.un(a);
                }
            }
            if (!d) {
                f.eventStore = null;
            }
        }
        if (d) {
            d = Ext.data.StoreManager.lookup(d);
            if (f.mon) {
                f.mon(d, a);
            } else {
                d.on(a);
            }
            f.eventStore = d;
            d.setResourceStore(f.getResourceStore());
            var g = d.getAssignmentStore();
            if (g) {
                f.mon(g, c);
            }
        }
        if (d && !b) {
            this.getTimeAxisViewModel().setEventStore(d);
            this.getEventSelectionModel().bindStore(d);
            this.fireEvent("eventstorechange", this, d, h);
            f.refresh();
        }
    },
    onEventDataRefresh: function() {
        this.refreshKeepingScroll();
    },
    onEventBarSelect: function(a) {
        var c = this, b, d;
        if (a instanceof Ext.ux.Scheduler2.model.Assignment) {
            b = a.getEvent();
            d = a.getResource();
        } else {
            b = a;
            d = null;
        }
        Ext.Array.each(c.getElementsFromEventRecord(b, d), function(e) {
            e.addCls(c.selectedEventCls);
        });
    },
    onEventBarDeselect: function(a) {
        var c = this, b, d;
        if (a instanceof Ext.ux.Scheduler2.model.Assignment) {
            b = a.getEvent();
            d = a.getResource();
        } else {
            b = a;
            d = null;
        }
        b && Ext.Array.each(c.getElementsFromEventRecord(b, d), function(e) {
            e.removeCls(c.selectedEventCls);
        });
    },
    refresh: function() {
        throw "Abstract method call";
    },
    repaintEventsForResource: function(a) {
        throw "Abstract method call";
    },
    repaintAllEvents: function() {
        this.refreshKeepingScroll();
    },
    scrollEventIntoView: function(f, b, a, g, c) {
        var d = this, e = f.getResources();
        e.length && d.scrollResourceEventIntoView(e[0], f, null, b, a, g, c);
    },
    getResourceStore: function() {
        return this.resourceStore;
    },
    setResourceStore: function(a) {
        var b = this.resourceStore;
        this.resourceStore = a;
        if (a) {
            this.fireEvent("resourcestorechange", this, a, b);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.preset.ViewPreset", {
    name: null,
    rowHeight: null,
    timeColumnWidth: 50,
    timeRowHeight: null,
    timeAxisColumnWidth: null,
    displayDateFormat: "G:i",
    shiftUnit: "HOUR",
    shiftIncrement: 1,
    defaultSpan: 12,
    timeResolution: null,
    headerConfig: null,
    columnLinesFor: "middle",
    headers: null,
    mainHeader: 0,
    constructor: function(a) {
        Ext.apply(this, a);
    },
    getHeaders: function() {
        if (this.headers) {
            return this.headers;
        }
        var a = this.headerConfig;
        this.mainHeader = a.top ? 1 : 0;
        return this.headers = [].concat(a.top || [], a.middle || [], a.bottom || []);
    },
    getMainHeader: function() {
        return this.getHeaders()[this.mainHeader];
    },
    getBottomHeader: function() {
        var a = this.getHeaders();
        return a[a.length - 1];
    },
    clone: function() {
        var a = {};
        var b = this;
        Ext.Array.each([ "rowHeight", "timeColumnWidth", "timeRowHeight", "timeAxisColumnWidth", "displayDateFormat", "shiftUnit", "shiftIncrement", "defaultSpan", "timeResolution", "headerConfig" ], function(c) {
            a[c] = b[c];
        });
        return new this.self(Ext.clone(a));
    }
});

Ext.define("Ext.ux.Scheduler2.preset.Manager", {
    extend: Ext.util.MixedCollection,
    mixins: [ Ext.ux.Scheduler2.mixin.Localizable ],
    singleton: true,
    defaultPresets: {
        secondAndMinute: {
            timeColumnWidth: 30,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "G:i:s",
            shiftIncrement: 10,
            shiftUnit: "MINUTE",
            defaultSpan: 24,
            timeResolution: {
                unit: "SECOND",
                increment: 5
            },
            headerConfig: {
                middle: {
                    unit: "SECOND",
                    increment: 10,
                    align: "center",
                    dateFormat: "s"
                },
                top: {
                    unit: "MINUTE",
                    align: "center",
                    dateFormat: "D, d g:iA"
                }
            }
        },
        minuteAndHour: {
            timeColumnWidth: 100,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "G:i",
            shiftIncrement: 1,
            shiftUnit: "HOUR",
            defaultSpan: 24,
            timeResolution: {
                unit: "MINUTE",
                increment: 30
            },
            headerConfig: {
                middle: {
                    unit: "MINUTE",
                    increment: "30",
                    align: "center",
                    dateFormat: "i"
                },
                top: {
                    unit: "HOUR",
                    align: "center",
                    dateFormat: "D, gA/d"
                }
            }
        },
        hourAndDay: {
            timeColumnWidth: 60,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "G:i",
            shiftIncrement: 1,
            shiftUnit: "DAY",
            defaultSpan: 24,
            timeResolution: {
                unit: "MINUTE",
                increment: 30
            },
            headerConfig: {
                middle: {
                    unit: "HOUR",
                    align: "center",
                    dateFormat: "G:i"
                },
                top: {
                    unit: "DAY",
                    align: "center",
                    dateFormat: "D d/m"
                }
            }
        },
        dayAndWeek: {
            timeColumnWidth: 100,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d G:i",
            shiftUnit: "DAY",
            shiftIncrement: 1,
            defaultSpan: 5,
            timeResolution: {
                unit: "HOUR",
                increment: 1
            },
            headerConfig: {
                middle: {
                    unit: "DAY",
                    align: "center",
                    dateFormat: "D d M"
                },
                top: {
                    unit: "WEEK",
                    align: "center",
                    renderer: function(c, b, a) {
                        return Ext.ux.Scheduler2.util.Date.getShortNameOfUnit("WEEK") + "." + Ext.Date.format(c, "W M Y");
                    }
                }
            }
        },
        weekAndDay: {
            timeColumnWidth: 100,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d",
            shiftUnit: "WEEK",
            shiftIncrement: 1,
            defaultSpan: 1,
            timeResolution: {
                unit: "DAY",
                increment: 1
            },
            headerConfig: {
                bottom: {
                    unit: "DAY",
                    align: "center",
                    increment: 1,
                    dateFormat: "d/m"
                },
                middle: {
                    unit: "WEEK",
                    dateFormat: "D d M"
                }
            }
        },
        weekAndMonth: {
            timeColumnWidth: 100,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d",
            shiftUnit: "WEEK",
            shiftIncrement: 5,
            defaultSpan: 6,
            timeResolution: {
                unit: "DAY",
                increment: 1
            },
            headerConfig: {
                middle: {
                    unit: "WEEK",
                    align: "center",
                    renderer: function(c, b, a) {
                        return Ext.Date.format(c, "d M");
                    }
                },
                top: {
                    unit: "MONTH",
                    align: "center",
                    dateFormat: "M Y"
                }
            }
        },
        monthAndYear: {
            timeColumnWidth: 110,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d",
            shiftIncrement: 3,
            shiftUnit: "MONTH",
            defaultSpan: 12,
            timeResolution: {
                unit: "DAY",
                increment: 1
            },
            headerConfig: {
                middle: {
                    unit: "MONTH",
                    align: "center",
                    dateFormat: "M Y"
                },
                top: {
                    unit: "YEAR",
                    align: "center",
                    dateFormat: "Y"
                }
            }
        },
        year: {
            timeColumnWidth: 100,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d",
            shiftUnit: "YEAR",
            shiftIncrement: 1,
            defaultSpan: 1,
            timeResolution: {
                unit: "MONTH",
                increment: 1
            },
            headerConfig: {
                middle: {
                    unit: "QUARTER",
                    align: "center",
                    renderer: function(c, b, a) {
                        return Ext.String.format(Ext.ux.Scheduler2.util.Date.getShortNameOfUnit("QUARTER").toUpperCase() + "{0}", Math.floor(c.getMonth() / 3) + 1);
                    }
                },
                top: {
                    unit: "YEAR",
                    align: "center",
                    dateFormat: "Y"
                }
            }
        },
        manyYears: {
            timeColumnWidth: 50,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d",
            shiftUnit: "YEAR",
            shiftIncrement: 1,
            defaultSpan: 1,
            timeResolution: {
                unit: "YEAR",
                increment: 1
            },
            headerConfig: {
                middle: {
                    unit: "YEAR",
                    align: "center",
                    dateFormat: "Y",
                    increment: 5
                },
                bottom: {
                    unit: "YEAR",
                    align: "center",
                    dateFormat: "y",
                    increment: 1
                }
            }
        },
        weekAndDayLetter: {
            timeColumnWidth: 20,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d",
            shiftUnit: "WEEK",
            shiftIncrement: 1,
            defaultSpan: 10,
            timeResolution: {
                unit: "DAY",
                increment: 1
            },
            headerConfig: {
                bottom: {
                    unit: "DAY",
                    align: "center",
                    renderer: function(a) {
                        return Ext.Date.dayNames[a.getDay()].substring(0, 1);
                    }
                },
                middle: {
                    unit: "WEEK",
                    dateFormat: "D d M Y"
                }
            }
        },
        weekDateAndMonth: {
            timeColumnWidth: 30,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d",
            shiftUnit: "WEEK",
            shiftIncrement: 1,
            defaultSpan: 10,
            timeResolution: {
                unit: "DAY",
                increment: 1
            },
            headerConfig: {
                middle: {
                    unit: "WEEK",
                    align: "center",
                    dateFormat: "d"
                },
                top: {
                    unit: "MONTH",
                    dateFormat: "Y F"
                }
            }
        },
        day: {
            timeRowHeight: 40,
            calendarColumnWidth: 200,
            displayDateFormat: "G:i",
            shiftIncrement: 1,
            shiftUnit: "DAY",
            defaultSpan: 24,
            timeResolution: {
                unit: "MINUTE",
                increment: 30
            },
            headerConfig: {
                bottom: {
                    unit: "HOUR",
                    align: "center",
                    renderer: function(a) {
                        return Ext.String.format('<div class="sch2-calendarcolumn-ct"><span class="sch2-calendarcolumn-hours">{0}</span><span class="sch2-calendarcolumn-minutes">{1}</span></div>', Ext.Date.format(a, "H"), Ext.Date.format(a, "i"));
                    }
                },
                middle: {
                    unit: "DAY",
                    align: "center",
                    dateFormat: "D d/m",
                    splitUnit: "DAY"
                }
            }
        },
        week: {
            timeRowHeight: 40,
            calendarColumnWidth: 164,
            displayDateFormat: "G:i",
            shiftIncrement: 1,
            shiftUnit: "WEEK",
            defaultSpan: 24,
            timeResolution: {
                unit: "MINUTE",
                increment: 30
            },
            headerConfig: {
                bottom: {
                    unit: "HOUR",
                    align: "center",
                    dateFormat: "H:i",
                    renderer: function(a) {
                        return Ext.String.format('<div class="sch2-calendarcolumn-ct"><span class="sch2-calendarcolumn-hours">{0}</span><span class="sch2-calendarcolumn-minutes">{1}</span></div>', Ext.Date.format(a, "H"), Ext.Date.format(a, "i"));
                    }
                },
                middle: {
                    unit: "WEEK",
                    align: "center",
                    dateFormat: "D d",
                    splitUnit: "DAY"
                }
            }
        },
        month: {
            timeColumnWidth: 60,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "G:i",
            shiftIncrement: 1,
            shiftUnit: "MONTH",
            defaultSpan: 4,
            timeResolution: {
                unit: "HOUR",
                increment: 12
            },
            headerConfig: {
                bottom: {
                    unit: "DAY",
                    align: "center",
                    dateFormat: "D",
                    splitUnit: "WEEK"
                },
                middle: {
                    unit: "WEEK",
                    align: "center",
                    dateFormat: "D d/m"
                },
                top: {
                    unit: "MONTH",
                    align: "center",
                    renderer: function(c, b, a) {
                        return Ext.Date.format(c, "d/m") + " - " + Ext.Date.format(b, "d/m, Y");
                    },
                    splitUnit: "WEEK"
                }
            }
        }
    },
    constructor: function() {
        this.callParent(arguments);
        this.registerDefaults();
    },
    onLocalized: function() {
        var a = this;
        this.eachKey(function(c, d) {
            if (a.l10n[c]) {
                var b = a.L(c);
                b.displayDateFormat && (d.displayDateFormat = b.displayDateFormat);
                b.middleDateFormat && (d.headerConfig.middle.dateFormat = b.middleDateFormat);
                b.topDateFormat && (d.headerConfig.top.dateFormat = b.topDateFormat);
                b.bottomDateFormat && (d.headerConfig.bottom.dateFormat = b.bottomDateFormat);
            }
        });
    },
    registerPreset: function(b, a) {
        if (a) {
            var c = a.headerConfig;
            var f = Ext.ux.Scheduler2.util.Date;
            for (var g in c) {
                if (c.hasOwnProperty(g)) {
                    if (f[c[g].unit]) {
                        c[g].unit = f[c[g].unit.toUpperCase()];
                    }
                    if (f[c[g].splitUnit]) {
                        c[g].splitUnit = f[c[g].splitUnit.toUpperCase()];
                    }
                }
            }
            if (!a.timeColumnWidth) {
                a.timeColumnWidth = 50;
            }
            if (!a.rowHeight) {
                a.rowHeight = 24;
            }
            var d = a.timeResolution;
            if (d && f[d.unit]) {
                d.unit = f[d.unit.toUpperCase()];
            }
            var e = a.shiftUnit;
            if (e && f[e]) {
                a.shiftUnit = f[e.toUpperCase()];
            }
        }
        if (this.isValidPreset(a)) {
            if (this.containsKey(b)) {
                this.removeAtKey(b);
            }
            a.name = b;
            this.add(b, new Ext.ux.Scheduler2.preset.ViewPreset(a));
        } else {
            throw "Invalid preset, please check your configuration";
        }
    },
    isValidPreset: function(a) {
        var e = Ext.ux.Scheduler2.util.Date, c = true, d = Ext.ux.Scheduler2.util.Date.units, b = {};
        for (var f in a.headerConfig) {
            if (a.headerConfig.hasOwnProperty(f)) {
                b[f] = true;
                c = c && Ext.Array.indexOf(d, a.headerConfig[f].unit) >= 0;
            }
        }
        if (!(a.columnLinesFor in b)) {
            a.columnLinesFor = "middle";
        }
        if (a.timeResolution) {
            c = c && Ext.Array.indexOf(d, a.timeResolution.unit) >= 0;
        }
        if (a.shiftUnit) {
            c = c && Ext.Array.indexOf(d, a.shiftUnit) >= 0;
        }
        return c;
    },
    getPreset: function(a) {
        return this.get(a);
    },
    deletePreset: function(a) {
        this.removeAtKey(a);
    },
    registerDefaults: function() {
        var b = this, a = this.defaultPresets;
        for (var c in a) {
            b.registerPreset(c, a[c]);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.view.model.TimeAxis", {
    extend: Ext.util.Observable,
    timeAxis: null,
    availableWidth: 0,
    tickWidth: 100,
    snapToIncrement: false,
    forceFit: false,
    headerConfig: null,
    headers: null,
    mainHeader: 0,
    timeAxisColumnWidth: null,
    resourceColumnWidth: null,
    calendarColumnWidth: null,
    timeColumnWidth: null,
    rowHeightHorizontal: null,
    rowHeightVertical: null,
    mode: "horizontal",
    suppressFit: false,
    refCount: 0,
    columnConfig: {},
    viewPreset: null,
    columnLinesFor: "middle",
    eventStore: null,
    originalTickWidth: null,
    constructor: function(a) {
        var c = this;
        Ext.apply(this, a);
        if (this.viewPreset) {
            if (this.viewPreset instanceof Ext.ux.Scheduler2.preset.ViewPreset) {
                this.consumeViewPreset(this.viewPreset);
            } else {
                var b = Ext.ux.Scheduler2.preset.Manager.getPreset(this.viewPreset);
                b && this.consumeViewPreset(b);
            }
        }
        c.timeAxis.on("reconfigure", c.onTimeAxisReconfigure, c);
        this.callParent(arguments);
    },
    destroy: function() {
        this.timeAxis.un("reconfigure", this.onTimeAxisReconfigure, this);
    },
    onTimeAxisReconfigure: function(a, b) {
        if (!b) {
            this.update();
        }
    },
    reconfigure: function(a) {
        this.headers = null;
        Ext.apply(this, a);
        switch (this.mode) {
          case "horizontal":
            this.setTickWidth(this.timeColumnWidth);
            break;

          case "vertical":
            this.setTickWidth(this.rowHeightVertical);
            break;

          case "calendar":
            this.setTickWidth(this.rowHeightVertical);
            break;
        }
        this.fireEvent("reconfigure", this);
    },
    getColumnConfig: function() {
        return this.columnConfig;
    },
    update: function(d, b) {
        var e = this.timeAxis, c = this.headerConfig;
        this.availableWidth = Math.max(d || this.availableWidth, 0);
        if (!Ext.isNumber(this.availableWidth)) {
            throw "Invalid available width provided to Ext.ux.Scheduler2.view.model.TimeAxis";
        }
        if (this.forceFit && this.availableWidth <= 0) {
            return;
        }
        this.columnConfig = {};
        for (var f in c) {
            if (c[f].cellGenerator) {
                this.columnConfig[f] = c[f].cellGenerator.call(this, e.getStart(), e.getEnd());
            } else {
                this.columnConfig[f] = this.createHeaderRow(f, c[f]);
            }
        }
        var a = this.calculateTickWidth(this.originalTickWidth);
        if (!Ext.isNumber(a) || a <= 0) {
            throw "Invalid column width calculated in Ext.ux.Scheduler2.view.model.TimeAxis";
        }
        this.updateTickWidth(a);
        if (!b) {
            this.fireEvent("update", this);
        }
    },
    createHeaderRow: function(a, d) {
        var c = [], e = this, f = d.align, b = Ext.Date.clearTime(new Date());
        e.forEachInterval(a, function(k, g, h) {
            var j = {
                align: f,
                start: k,
                end: g,
                headerCls: ""
            };
            if (d.renderer) {
                j.header = d.renderer.call(d.scope || e, k, g, j, h, e.eventStore);
            } else {
                j.header = Ext.Date.format(k, d.dateFormat);
            }
            if (d.unit === Ext.ux.Scheduler2.util.Date.DAY && (!d.increment || d.increment === 1)) {
                j.headerCls += " sch2-dayheadercell-" + k.getDay();
                if (Ext.Date.clearTime(k, true) - b === 0) {
                    j.headerCls += " sch2-dayheadercell-today";
                }
            }
            c.push(j);
        });
        return c;
    },
    getDistanceBetweenDates: function(b, a) {
        return Math.round(this.getPositionFromDate(a, true) - this.getPositionFromDate(b));
    },
    getPositionFromDate: function(e, d) {
        if (this.mode === "calendar") {
            var a = this.rowHeightCalendar || this.rowHeightVertical;
            var c = this.getHeaders();
            var b = this.timeAxis.getStart();
            var g = Ext.ux.Scheduler2.util.Date;
            var i = g.mergeDates(b, e, c[1].unit);
            var j = g.getDurationInUnit(b, i, c[1].unit, true) * a;
            var k = Math.round(j);
            if (k === 0 && d) {
                return this.calendarRowsAmount * a;
            }
            return k;
        } else {
            var h = -1, f = this.timeAxis.getTickFromDate(e);
            if (f >= 0) {
                h = Math.round(this.tickWidth * (f - this.timeAxis.visibleTickStart));
            }
            return h;
        }
    },
    getDateFromPosition: function(i, l) {
        if (this.mode === "calendar") {
            var b = this.rowHeightCalendar || this.rowHeightVertical;
            var h = Ext.ux.Scheduler2.util.Date;
            var c = this.timeAxis.getStart();
            var d = this.getHeaders();
            var j = h.add(c, d[0].splitUnit, Math.floor(i[0] / this.calendarColumnWidth));
            var g = this.timeAxis.first();
            var e = (g.get("end") - g.get("start")) / b;
            var k = h.add(j, h.MILLI, Math.round(i[1] * e));
            if (l) {
                k = this.timeAxis[l + "Date"](k);
            }
            return k;
        } else {
            var f = i / this.getTickWidth() + this.timeAxis.visibleTickStart, a = this.timeAxis.getCount();
            if (f < 0 || f > a) {
                return null;
            }
            return this.timeAxis.getDateFromTick(f, l);
        }
    },
    getSingleUnitInPixels: function(a) {
        return Ext.ux.Scheduler2.util.Date.getUnitToBaseUnitRatio(this.timeAxis.getUnit(), a) * this.tickWidth / this.timeAxis.increment;
    },
    getSnapPixelAmount: function() {
        if (this.snapToIncrement) {
            var a = this.timeAxis.getResolution();
            return (a.increment || 1) * this.getSingleUnitInPixels(a.unit);
        } else {
            return 1;
        }
    },
    getTickWidth: function() {
        return this.tickWidth;
    },
    setTickWidth: function(b, a) {
        this.originalTickWidth = b;
        this.updateTickWidth(b);
        this.update(null, a);
    },
    updateTickWidth: function(a) {
        this.tickWidth = a;
        switch (this.mode) {
          case "horizontal":
            this.timeColumnWidth = a;
            break;

          case "vertical":
            this.rowHeightVertical = a;
            break;

          case "calendar":
            this.rowHeightVertical = a;
            break;
        }
    },
    getTotalWidth: function() {
        return Math.round(this.tickWidth * this.timeAxis.getVisibleTickTimeSpan());
    },
    calculateTickWidth: function(e) {
        var k = this.forceFit;
        var h = this.timeAxis;
        var c = 0, g = h.getUnit(), j = Number.MAX_VALUE, d = Ext.ux.Scheduler2.util.Date;
        if (this.snapToIncrement) {
            var f = h.getResolution();
            j = d.getUnitToBaseUnitRatio(g, f.unit) * f.increment;
        } else {
            var i = d.getMeasuringUnit(g);
            j = Math.min(j, d.getUnitToBaseUnitRatio(g, i));
        }
        if (!this.suppressFit) {
            var b = Math[k ? "floor" : "round"](this.getAvailableWidth() / h.getVisibleTickTimeSpan());
            c = k || e < b ? b : e;
            if (j > 0 && (!k || j < 1)) {
                var a = Ext.versions.touch && k ? "ceil" : k ? "floor" : "round";
                c = Math.round(Math.max(1, Math[a](j * c)) / j);
            }
        } else {
            c = e;
        }
        return c;
    },
    getAvailableWidth: function() {
        return this.availableWidth;
    },
    setAvailableWidth: function(a) {
        this.availableWidth = Math.max(0, a);
        var b = this.calculateTickWidth(this.originalTickWidth);
        if (b !== this.tickWidth) {
            this.update();
        }
    },
    fitToAvailableWidth: function(a) {
        var b = Math.floor(this.availableWidth / this.timeAxis.getVisibleTickTimeSpan());
        this.setTickWidth(b, a);
    },
    setForceFit: function(a) {
        if (a !== this.forceFit) {
            this.forceFit = a;
            this.update();
        }
    },
    setSnapToIncrement: function(a) {
        if (a !== this.snapToIncrement) {
            this.snapToIncrement = a;
            this.update();
        }
    },
    getViewRowHeight: function() {
        var a = this.mode == "horizontal" ? this.rowHeightHorizontal : this.rowHeightVertical;
        if (!a) {
            throw "rowHeight info not available";
        }
        return a;
    },
    setViewRowHeight: function(c, a) {
        var d = this.mode === "horizontal";
        var b = "rowHeight" + Ext.String.capitalize(this.mode);
        if (this[b] != c) {
            this[b] = c;
            if (d) {
                if (!a) {
                    this.fireEvent("update", this);
                }
            } else {
                this.setTickWidth(c, a);
            }
        }
    },
    setViewColumnWidth: function(b, a) {
        switch (this.mode) {
          case "horizontal":
            this.setTickWidth(b, a);
            break;

          case "vertical":
            this.resourceColumnWidth = b;
            break;

          case "calendar":
            this.calendarColumnWidth = b;
            break;
        }
        if (!a) {
            this.fireEvent("columnwidthchange", this, b);
        }
    },
    getHeaders: function() {
        if (this.headers) {
            return this.headers;
        }
        var a = this.headerConfig;
        this.mainHeader = a.top ? 1 : 0;
        return this.headers = [].concat(a.top || [], a.middle || [], a.bottom || []);
    },
    getMainHeader: function() {
        return this.getHeaders()[this.mainHeader];
    },
    getBottomHeader: function() {
        var a = this.getHeaders();
        return a[a.length - 1];
    },
    forEachInterval: function(b, a, d) {
        d = d || this;
        var c = this.headerConfig;
        if (!c) {
            return;
        }
        if (b === "top" || b === "middle" && c.bottom) {
            var e = c[b];
            this.timeAxis.forEachAuxInterval(e.unit, e.increment, a, d);
        } else {
            this.timeAxis.each(function(g, f) {
                return a.call(d, g.data.start, g.data.end, f);
            });
        }
    },
    forEachMainInterval: function(a, b) {
        this.forEachInterval("middle", a, b);
    },
    getLowestHeader: function() {
        return "bottom" in this.headerConfig ? "bottom" : "middle";
    },
    consumeViewPreset: function(a) {
        this.headers = null;
        var b = this.mode == "horizontal";
        Ext.apply(this, {
            headerConfig: a.headerConfig,
            columnLinesFor: a.columnLinesFor || "middle",
            rowHeightHorizontal: a.rowHeight,
            tickWidth: b ? a.timeColumnWidth : a.timeRowHeight || a.timeColumnWidth || 60,
            timeColumnWidth: a.timeColumnWidth,
            rowHeightVertical: a.timeRowHeight || a.timeColumnWidth || 60,
            timeAxisColumnWidth: a.timeAxisColumnWidth,
            resourceColumnWidth: a.resourceColumnWidth || 100
        });
        this.originalTickWidth = this.tickWidth;
    },
    setEventStore: function(a) {
        this.eventStore = a;
    }
});

Ext.define("Ext.ux.Scheduler2.mixin.Zoomable", {
    zoomLevels: [ {
        width: 40,
        increment: 1,
        resolution: 1,
        preset: "manyYears",
        resolutionUnit: "YEAR"
    }, {
        width: 80,
        increment: 1,
        resolution: 1,
        preset: "manyYears",
        resolutionUnit: "YEAR"
    }, {
        width: 30,
        increment: 1,
        resolution: 1,
        preset: "year",
        resolutionUnit: "MONTH"
    }, {
        width: 50,
        increment: 1,
        resolution: 1,
        preset: "year",
        resolutionUnit: "MONTH"
    }, {
        width: 100,
        increment: 1,
        resolution: 1,
        preset: "year",
        resolutionUnit: "MONTH"
    }, {
        width: 200,
        increment: 1,
        resolution: 1,
        preset: "year",
        resolutionUnit: "MONTH"
    }, {
        width: 100,
        increment: 1,
        resolution: 7,
        preset: "monthAndYear",
        resolutionUnit: "DAY"
    }, {
        width: 30,
        increment: 1,
        resolution: 1,
        preset: "weekDateAndMonth",
        resolutionUnit: "DAY"
    }, {
        width: 35,
        increment: 1,
        resolution: 1,
        preset: "weekAndMonth",
        resolutionUnit: "DAY"
    }, {
        width: 50,
        increment: 1,
        resolution: 1,
        preset: "weekAndMonth",
        resolutionUnit: "DAY"
    }, {
        width: 20,
        increment: 1,
        resolution: 1,
        preset: "weekAndDayLetter"
    }, {
        width: 50,
        increment: 1,
        resolution: 1,
        preset: "weekAndDay",
        resolutionUnit: "HOUR"
    }, {
        width: 100,
        increment: 1,
        resolution: 1,
        preset: "weekAndDay",
        resolutionUnit: "HOUR"
    }, {
        width: 50,
        increment: 6,
        resolution: 30,
        preset: "hourAndDay",
        resolutionUnit: "MINUTE"
    }, {
        width: 100,
        increment: 6,
        resolution: 30,
        preset: "hourAndDay",
        resolutionUnit: "MINUTE"
    }, {
        width: 60,
        increment: 2,
        resolution: 30,
        preset: "hourAndDay",
        resolutionUnit: "MINUTE"
    }, {
        width: 60,
        increment: 1,
        resolution: 30,
        preset: "hourAndDay",
        resolutionUnit: "MINUTE"
    }, {
        width: 30,
        increment: 15,
        resolution: 5,
        preset: "minuteAndHour"
    }, {
        width: 60,
        increment: 15,
        resolution: 5,
        preset: "minuteAndHour"
    }, {
        width: 130,
        increment: 15,
        resolution: 5,
        preset: "minuteAndHour"
    }, {
        width: 60,
        increment: 5,
        resolution: 5,
        preset: "minuteAndHour"
    }, {
        width: 100,
        increment: 5,
        resolution: 5,
        preset: "minuteAndHour"
    }, {
        width: 50,
        increment: 2,
        resolution: 1,
        preset: "minuteAndHour"
    }, {
        width: 30,
        increment: 10,
        resolution: 5,
        preset: "secondAndMinute"
    }, {
        width: 60,
        increment: 10,
        resolution: 5,
        preset: "secondAndMinute"
    }, {
        width: 130,
        increment: 5,
        resolution: 5,
        preset: "secondAndMinute"
    } ],
    minZoomLevel: null,
    maxZoomLevel: null,
    visibleZoomFactor: 5,
    zoomKeepsOriginalTimespan: false,
    cachedCenterDate: null,
    initializeZooming: function() {
        this.zoomLevels = this.zoomLevels.slice();
        this.setMinZoomLevel(this.minZoomLevel || 0);
        this.setMaxZoomLevel(this.maxZoomLevel !== null ? this.maxZoomLevel : this.zoomLevels.length - 1);
        this.on("viewchange", this.clearCenterDateCache, this);
    },
    getZoomLevelUnit: function(a) {
        return Ext.ux.Scheduler2.preset.Manager.getPreset(a.preset).getBottomHeader().unit;
    },
    getMilliSecondsPerPixelForZoomLevel: function(c, a) {
        var b = Ext.ux.Scheduler2.util.Date;
        return Math.round((b.add(new Date(1, 0, 1), this.getZoomLevelUnit(c), c.increment) - new Date(1, 0, 1)) / (a ? c.width : c.actualWidth || c.width));
    },
    presetToZoomLevel: function(b) {
        var a = Ext.ux.Scheduler2.preset.Manager.getPreset(b);
        return {
            preset: b,
            increment: a.getBottomHeader().increment || 1,
            resolution: a.timeResolution.increment,
            resolutionUnit: a.timeResolution.unit,
            width: a.timeColumnWidth
        };
    },
    zoomLevelToPreset: function(c) {
        var b = Ext.ux.Scheduler2.preset.Manager.getPreset(c.preset).clone();
        var a = b.getBottomHeader();
        a.increment = c.increment;
        b.timeColumnWidth = c.width;
        if (c.resolutionUnit || c.resolution) {
            b.timeResolution = {
                unit: c.resolutionUnit || b.timeResolution.unit || a.unit,
                increment: c.resolution || b.timeResolution.increment || 1
            };
        }
        return b;
    },
    calculateCurrentZoomLevel: function() {
        var g = this.presetToZoomLevel(this.viewPreset), d = Number.MAX_VALUE, b = this.timeAxisViewModel, f = b.timeColumnWidth;
        g.width = f;
        g.increment = b.getBottomHeader().increment || 1;
        for (var c = 0, a = this.zoomLevels.length; c < a; c++) {
            var e = this.zoomLevels[c];
            if (e.preset !== g.preset) {
                continue;
            }
            var h = Math.abs(e.width - f);
            if (h < d) {
                d = h;
                g.actualWidth = e.actualWidth;
                g.width = e.width;
            }
        }
        return g;
    },
    getCurrentZoomLevelIndex: function() {
        var f = this.calculateCurrentZoomLevel();
        var b = this.getMilliSecondsPerPixelForZoomLevel(f);
        var e = this.zoomLevels;
        for (var c = 0; c < e.length; c++) {
            var d = this.getMilliSecondsPerPixelForZoomLevel(e[c]);
            if (d == b) {
                return c;
            }
            if (c === 0 && b > d) {
                return -.5;
            }
            if (c == e.length - 1 && b < d) {
                return e.length - 1 + .5;
            }
            var a = this.getMilliSecondsPerPixelForZoomLevel(e[c + 1]);
            if (d > b && b > a) {
                return c + .5;
            }
        }
        throw "Can't find current zoom level index";
    },
    setMaxZoomLevel: function(a) {
        if (a < 0 || a >= this.zoomLevels.length) {
            throw new Error("Invalid range for `setMinZoomLevel`");
        }
        this.maxZoomLevel = a;
    },
    setMinZoomLevel: function(a) {
        if (a < 0 || a >= this.zoomLevels.length) {
            throw new Error("Invalid range for `setMinZoomLevel`");
        }
        this.minZoomLevel = a;
    },
    getViewportCenterDateCached: function() {
        if (this.cachedCenterDate) {
            return this.cachedCenterDate;
        }
        return this.cachedCenterDate = this.getViewportCenterDate();
    },
    clearCenterDateCache: function() {
        this.cachedCenterDate = null;
    },
    zoomToLevel: function(b, r, e) {
        b = Ext.Number.constrain(b, this.minZoomLevel, this.maxZoomLevel);
        e = e || {};
        var q = this.calculateCurrentZoomLevel();
        var c = this.getMilliSecondsPerPixelForZoomLevel(q);
        var l = this.zoomLevels[b];
        var a = this.getMilliSecondsPerPixelForZoomLevel(l);
        if (c == a && !r) {
            return null;
        }
        var s = this;
        s.fireEvent("beforezoomchange", s, b);
        var m = this.getSchedulingView();
        var h = m.getOuterEl();
        var i = this.mode == "vertical";
        var g = r ? new Date((r.start.getTime() + r.end.getTime()) / 2) : this.getViewportCenterDateCached();
        var n = i ? h.getHeight() : h.getWidth();
        var o = Ext.ux.Scheduler2.preset.Manager.getPreset(l.preset).clone();
        var p = o.getBottomHeader();
        var f = Boolean(r);
        r = this.calculateOptimalDateRange(g, n, l, r);
        o[i ? "timeRowHeight" : "timeColumnWidth"] = e.customWidth || l.width;
        p.increment = l.increment;
        this.isZooming = true;
        this.viewPreset = l.preset;
        var d = this.timeAxis;
        o.increment = l.increment;
        o.timeResolution.unit = Ext.ux.Scheduler2.util.Date.getUnitByName(l.resolutionUnit || o.timeResolution.unit || p.unit);
        o.timeResolution.increment = l.resolution;
        this.setViewPreset(o, r.start || this.getStart(), r.end || this.getEnd(), false, true);
        l.actualWidth = this.timeAxisViewModel.getTickWidth();
        if (f) {
            g = e.centerDate || new Date((d.getStart().getTime() + d.getEnd().getTime()) / 2);
        }
        var k = null, j = null;
        if (i) {
            j = m.getYFromDate(g, true) - n / 2;
            s.cachedCenterDate = g;
            m.scrollTo(null, j);
        } else {
            k = m.getXFromDate(g, true) - n / 2;
            s.cachedCenterDate = g;
            m.headerCt.scrollTo(k);
            m.scrollTo(k);
        }
        s.isZooming = false;
        s.fireEvent("zoomchange", s, b, k, j);
        return b;
    },
    setZoomLevel: function() {
        this.zoomToLevel.apply(this, arguments);
    },
    zoomToSpan: function(p, s) {
        s = s || {};
        if (s.leftMargin || s.rightMargin) {
            s.adjustStart = 0;
            s.adjustEnd = 0;
        }
        Ext.applyIf(s, {
            leftMargin: 0,
            rightMargin: 0
        });
        if (p.start && p.end) {
            var g = p.start, d = p.end, e = s.adjustStart >= 0 && s.adjustEnd >= 0;
            if (e) {
                g = Ext.ux.Scheduler2.util.Date.add(g, this.timeAxis.mainUnit, -s.adjustStart);
                d = Ext.ux.Scheduler2.util.Date.add(d, this.timeAxis.mainUnit, s.adjustEnd);
            }
            if (g <= d) {
                var a = this.getSchedulingView().getTimeAxisViewModel().getAvailableWidth();
                var m = Math.floor(this.getCurrentZoomLevelIndex());
                if (m == -1) {
                    m = 0;
                }
                var t = this.zoomLevels;
                var b = d - g || 1, j = this.getMilliSecondsPerPixelForZoomLevel(t[m], true), l = b / j + s.leftMargin + s.rightMargin > a ? -1 : 1, f = m + l;
                var o, h = null;
                while (f >= 0 && f <= t.length - 1) {
                    o = t[f];
                    j = this.getMilliSecondsPerPixelForZoomLevel(o, true);
                    var q = b / j + s.leftMargin + s.rightMargin;
                    if (l == -1) {
                        if (q <= a) {
                            h = f;
                            break;
                        }
                    } else {
                        if (q <= a) {
                            if (m !== f - l) {
                                h = f;
                            }
                        } else {
                            break;
                        }
                    }
                    f += l;
                }
                h = h !== null ? h : f - l;
                o = t[h];
                var c = Ext.ux.Scheduler2.preset.Manager.getPreset(o.preset).getBottomHeader().unit;
                if (s.leftMargin || s.rightMargin) {
                    g = new Date(g.getTime() - j * s.leftMargin);
                    d = new Date(d.getTime() + j * s.rightMargin);
                }
                var r = Ext.ux.Scheduler2.util.Date.getDurationInUnit(g, d, c, true) / o.increment;
                if (r === 0) {
                    return;
                }
                var i = Math.floor(a / r);
                var k = new Date((g.getTime() + d.getTime()) / 2);
                var n;
                if (e) {
                    n = {
                        start: g,
                        end: d
                    };
                } else {
                    n = this.calculateOptimalDateRange(k, a, o);
                }
                return this.zoomToLevel(h, n, {
                    customWidth: i,
                    centerDate: k
                });
            }
        }
        return null;
    },
    zoomIn: function(a) {
        a = a || 1;
        var b = this.getCurrentZoomLevelIndex();
        if (b >= this.zoomLevels.length - 1) {
            return null;
        }
        return this.zoomToLevel(Math.floor(b) + a);
    },
    zoomOut: function(a) {
        a = a || 1;
        var b = this.getCurrentZoomLevelIndex();
        if (b <= 0) {
            return null;
        }
        return this.zoomToLevel(Math.ceil(b) - a);
    },
    zoomInFull: function() {
        return this.zoomToLevel(this.maxZoomLevel);
    },
    zoomOutFull: function() {
        return this.zoomToLevel(this.minZoomLevel);
    },
    calculateOptimalDateRange: function(c, h, e, j) {
        if (j) {
            return j;
        }
        var g = this.timeAxis;
        if (this.zoomKeepsOriginalTimespan) {
            return {
                start: g.getStart(),
                end: g.getEnd()
            };
        }
        var b = Ext.ux.Scheduler2.util.Date;
        var i = this.getZoomLevelUnit(e);
        var d = Math.ceil(h / e.width * e.increment * this.visibleZoomFactor / 2);
        var a = b.add(c, i, -d);
        var f = b.add(c, i, d);
        return {
            start: g.floorDate(a, false, i, e.increment),
            end: g.ceilDate(f, false, i, e.increment)
        };
    }
});

Ext.define("Ext.ux.Scheduler2.mixin.AbstractTimelinePanel", {
    mixins: [ Ext.ux.Scheduler2.mixin.Zoomable ],
    orientation: "horizontal",
    snapToIncrement: false,
    readOnly: false,
    forceFit: false,
    eventResizeHandles: "both",
    timeAxis: null,
    autoAdjustTimeAxis: true,
    timeAxisViewModel: null,
    crudManager: null,
    viewPreset: "weekAndDay",
    calendarViewPreset: "week",
    trackHeaderOver: true,
    startDate: null,
    endDate: null,
    startTime: 0,
    endTime: 24,
    columnLines: true,
    getDateConstraints: Ext.emptyFn,
    snapRelativeToEventStartDate: false,
    trackMouseOver: false,
    readRowHeightFromPreset: true,
    eventBorderWidth: 1,
    getOrientation: function() {
        return this.getMode.apply(this, arguments);
    },
    getMode: function() {
        return this.mode;
    },
    isHorizontal: function() {
        return this.getMode() === "horizontal";
    },
    isVertical: function() {
        return !this.isHorizontal();
    },
    cellBorderWidth: 1,
    cellTopBorderWidth: 1,
    cellBottomBorderWidth: 1,
    renderers: null,
    _initializeTimelinePanel: function() {
        this.mode = this.mode || this.orientation || "horizontal";
        if (this.mode === "calendar") {
            this.oldViewPreset = this.viewPreset;
            this.viewPreset = this.calendarViewPreset;
        }
        var c = this.viewPreset && Ext.ux.Scheduler2.preset.Manager.getPreset(this.viewPreset);
        if (!c) {
            throw "You must define a valid view preset object. See Ext.ux.Scheduler2.preset.Manager class for reference";
        }
        this.initializeZooming();
        this.renderers = [];
        if (this.readRowHeightFromPreset) {
            this.readRowHeightFromPreset = !this.rowHeight;
        }
        if (!this.timeAxis) {
            this.timeAxis = new Ext.ux.Scheduler2.data.TimeAxis({
                autoAdjust: this.autoAdjustTimeAxis,
                mode: this.mode === "calendar" ? "calendar" : "plain"
            });
        }
        if (!this.timeAxisViewModel || !(this.timeAxisViewModel instanceof Ext.ux.Scheduler2.view.model.TimeAxis)) {
            var a = Ext.apply({
                mode: this.mode,
                snapToIncrement: this.snapToIncrement,
                forceFit: this.forceFit,
                timeAxis: this.timeAxis,
                eventStore: this.getEventStore(),
                viewPreset: this.viewPreset
            }, this.timeAxisViewModel || {});
            this.timeAxisViewModel = new Ext.ux.Scheduler2.view.model.TimeAxis(a);
        }
        this.timeAxisViewModel.on("update", this.onTimeAxisViewModelUpdate, this);
        this.timeAxisViewModel.refCount++;
        this.on("destroy", this.onPanelDestroyed, this);
        var b;
        switch (this.mode) {
          case "horizontal":
            b = [ "sch2-horizontal" ];
            break;

          case "vertical":
            b = [ "sch2-vertical", "sch2-vertical-resource" ];
            break;

          case "calendar":
            b = [ "sch2-vertical", "sch2-calendar" ];
            break;
        }
        this.addCls([].concat.apply([ "sch2-timelinepanel" ], b));
    },
    onTimeAxisViewModelUpdate: function() {
        var a = this.getSchedulingView();
        if (a && a.viewReady) {
            a.refreshKeepingScroll();
            this.fireEvent("viewchange", this);
        }
    },
    onPanelDestroyed: function() {
        var a = this.timeAxisViewModel;
        a.un("update", this.onTimeAxisViewModelUpdate, this);
        a.refCount--;
        if (a.refCount <= 0) {
            a.destroy();
        }
    },
    getSchedulingView: function() {
        throw "Abstract method call";
    },
    setReadOnly: function(a) {
        this.getSchedulingView().setReadOnly(a);
    },
    isReadOnly: function() {
        return this.getSchedulingView().isReadOnly();
    },
    switchViewPreset: function() {
        this.setViewPreset.apply(this, arguments);
    },
    setViewPreset: function(i, a, d, f, b) {
        var e = this.timeAxis;
        if (this.fireEvent("beforeviewchange", this, i, a, d) !== false) {
            var h = this.getMode() === "horizontal";
            if (Ext.isString(i)) {
                this.viewPreset = i;
                i = Ext.ux.Scheduler2.preset.Manager.getPreset(i);
            }
            if (!i) {
                throw "View preset not found";
            }
            if (!(f && e.isConfigured)) {
                var c = {
                    weekStartDay: this.weekStartDay !== undefined ? this.weekStartDay : this.L ? this.L("weekStartDay") : 1,
                    startTime: this.startTime,
                    endTime: this.endTime
                };
                if (f) {
                    if (e.getCount() === 0 || a) {
                        c.start = a || new Date();
                    }
                } else {
                    c.start = a || e.getStart();
                }
                c.end = d;
                e.consumeViewPreset(i);
                e.reconfigure(c, true);
                this.timeAxisViewModel.reconfigure({
                    headerConfig: i.headerConfig,
                    columnLinesFor: i.columnLinesFor || "middle",
                    rowHeightHorizontal: this.readRowHeightFromPreset ? i.rowHeight : this.rowHeight || this.timeAxisViewModel.getViewRowHeight(),
                    tickWidth: h ? i.timeColumnWidth : i.timeRowHeight || i.timeColumnWidth || 60,
                    timeColumnWidth: i.timeColumnWidth,
                    rowHeightVertical: i.timeRowHeight || i.timeColumnWidth || 60,
                    timeAxisColumnWidth: i.timeAxisColumnWidth,
                    resourceColumnWidth: this.resourceColumnWidth || i.resourceColumnWidth || 100
                });
            }
            var g = this.getSchedulingView();
            g.setDisplayDateFormat(i.displayDateFormat);
            if (this.getMode() === "vertical") {
                g.setColumnWidth(this.resourceColumnWidth || i.resourceColumnWidth || 100, true);
            }
            if (!b) {
                if (h) {
                    g.scrollHorizontallyTo(0);
                } else {
                    g.scrollVerticallyTo(0);
                }
            }
        }
    },
    getViewPreset: function() {
        return this.viewPreset;
    },
    getStart: function() {
        return this.getStartDate();
    },
    getStartDate: function() {
        return this.timeAxis.getStart();
    },
    getEnd: function() {
        return this.getEndDate();
    },
    getEndDate: function() {
        return this.timeAxis.getEnd();
    },
    setTimeColumnWidth: function(b, a) {
        this.timeAxisViewModel.setTickWidth(b, a);
    },
    getTimeColumnWidth: function() {
        return this.timeAxisViewModel.getTickWidth();
    },
    getRowHeight: function() {
        return this.timeAxisViewModel.getViewRowHeight();
    },
    shiftNext: function(a) {
        this.suspendLayouts && this.suspendLayouts();
        this.timeAxis.shiftNext(a);
        this.suspendLayouts && this.resumeLayouts(true);
    },
    shiftPrevious: function(a) {
        this.suspendLayouts && this.suspendLayouts();
        this.timeAxis.shiftPrevious(a);
        this.suspendLayouts && this.resumeLayouts(true);
    },
    goToNow: function() {
        this.setTimeSpan(new Date());
    },
    setTimeSpan: function(b, a) {
        if (this.timeAxis) {
            this.timeAxis.setTimeSpan(b, a);
        }
    },
    setStart: function(a) {
        this.setStartDate(a);
    },
    setEnd: function(a) {
        this.setEndDate(a);
    },
    setStartDate: function(a) {
        this.setTimeSpan(a);
    },
    setEndDate: function(a) {
        this.setTimeSpan(null, a);
    },
    getTimeAxis: function() {
        return this.timeAxis;
    },
    scrollToDate: function(c, b) {
        var a = this.getSchedulingView();
        var d = a.getCoordinateFromDate(c, true);
        this.scrollToCoordinate(d, c, b, false);
    },
    scrollToDateCentered: function(c, b) {
        var a = this.getSchedulingView();
        var e = 0;
        if (this.mode === "horizontal") {
            e = a.getBox().width / 2;
        } else {
            e = a.getBox().height / 2;
        }
        var d = Math.round(a.getCoordinateFromDate(c, true) - e);
        this.scrollToCoordinate(d, c, b, true);
    },
    scrollToCoordinate: function(g, e, d, c) {
        var b = this.getSchedulingView();
        var f = this;
        if (g < 0) {
            if (this.infiniteScroll) {
                b.shiftToDate(e, c);
            } else {
                var a = (this.timeAxis.getEnd() - this.timeAxis.getStart()) / 2;
                this.setTimeSpan(new Date(e.getTime() - a), new Date(e.getTime() + a));
                if (c) {
                    f.scrollToDateCentered(e, d);
                } else {
                    f.scrollToDate(e, d);
                }
            }
            return;
        }
        if (this.mode === "horizontal") {
            b.scrollHorizontallyTo(g, d);
        } else {
            b.scrollVerticallyTo(g, d);
        }
    },
    getViewportCenterDate: function() {
        return this.getSchedulingView().getViewportCenterDate();
    },
    addCls: function() {
        throw "Abstract method call";
    },
    removeCls: function() {
        throw "Abstract method call";
    },
    registerRenderer: function(b, a) {
        this.renderers.push({
            fn: b,
            scope: a
        });
    },
    deregisterRenderer: function(b, a) {
        Ext.each(this.renderers, function(c, d) {
            if (b === c) {
                Ext.Array.removeAt(this.renderers, d);
                return false;
            }
        });
    },
    getCrudManager: function() {
        return this.crudManager;
    },
    setCrudManager: function(a) {
        this.crudManager = a;
    }
});

Ext.define("Ext.ux.Scheduler2.view.Horizontal", {
    view: null,
    constructor: function(a) {
        Ext.apply(this, a);
    },
    translateToScheduleCoordinate: function(a) {
        var b = this.view;
        if (b.rtl) {
            return b.getHorizontalTimeAxisColumn().getEl().getRight() - a;
        }
        return a - b.getEl().getX() + b.getScroll().left;
    },
    translateToPageCoordinate: function(a) {
        var b = this.view;
        return a + b.getEl().getX() - b.getScroll().left;
    },
    getDateFromXY: function(c, b, a) {
        var d = c[0];
        if (!a) {
            d = this.translateToScheduleCoordinate(d);
        }
        return this.view.timeAxisViewModel.getDateFromPosition(d, b);
    },
    getEventRenderData: function(a) {
        var f = a.getStartDate(), e = a.getEndDate() || f, h = this.view, c = h.timeAxis.getStart(), i = h.timeAxis.getEnd(), g = Math, d = h.getXFromDate(Ext.ux.Scheduler2.util.Date.max(f, c)), j = h.getXFromDate(Ext.ux.Scheduler2.util.Date.min(e, i)), b = {};
        if (this.view.rtl) {
            b.right = g.min(d, j);
        } else {
            b.left = g.min(d, j);
        }
        b.width = g.max(1, g.abs(j - d)) - h.eventBorderWidth;
        if (h.managedEventSizing) {
            b.top = g.max(0, h.barMargin - (Ext.isIE && !Ext.isStrict ? 0 : h.eventBorderWidth - h.cellTopBorderWidth));
            b.height = h.timeAxisViewModel.rowHeightHorizontal - 2 * h.barMargin - h.eventBorderWidth;
        }
        b.start = f;
        b.end = e;
        b.startsOutsideView = f < c;
        b.endsOutsideView = e > i;
        return b;
    },
    getScheduleRegion: function(d, f) {
        var i = this.view, h = d ? Ext.fly(i.getRowNode(d)).getRegion() : i.getTableRegion(), e = i.timeAxis.getStart(), k = i.timeAxis.getEnd(), b = i.getDateConstraints(d, f) || {
            start: e,
            end: k
        }, c = this.translateToPageCoordinate(i.getXFromDate(Ext.ux.Scheduler2.util.Date.max(e, b.start))), j = this.translateToPageCoordinate(i.getXFromDate(Ext.ux.Scheduler2.util.Date.min(k, b.end))), g = h.top + i.barMargin, a = h.bottom - i.barMargin - i.eventBorderWidth;
        return new Ext.util.Region(g, Math.max(c, j), a, Math.min(c, j));
    },
    getResourceRegion: function(j, e, i) {
        var m = this.view, d = m.getRowNode(j), f = Ext.fly(d).getOffsetsTo(m.getEl()), k = m.timeAxis.getStart(), o = m.timeAxis.getEnd(), c = e ? Ext.ux.Scheduler2.util.Date.max(k, e) : k, g = i ? Ext.ux.Scheduler2.util.Date.min(o, i) : o, h = m.getXFromDate(c), n = m.getXFromDate(g), l = f[1] + m.cellTopBorderWidth, a = f[1] + Ext.fly(d).getHeight() - m.cellBottomBorderWidth;
        if (!Ext.versions.touch) {
            var b = m.getScroll();
            l += b.top;
            a += b.top;
        }
        return new Ext.util.Region(l, Math.max(h, n), a, Math.min(h, n));
    },
    columnRenderer: function(c, k, f, g, j) {
        var i = this.view;
        var b = i.getEventStore().filterEventsForResource(f, function(l) {
            return i.timeAxis.isRangeInAxis(l);
        });
        if (b.length === 0) {
            return;
        }
        var h = Ext.Array.map(b, function(l) {
            return i.generateTplData(l, f, g);
        });
        if (i.dynamicRowHeight) {
            var e = i.eventLayout.horizontal;
            var d = e.applyLayout(h, f, this.layoutEventVertically, this);
            var a = d * i.timeAxisViewModel.rowHeightHorizontal - (d - 1) * i.barMargin;
            k.rowHeight = a;
        }
        return i.eventTpl.apply(h);
    },
    layoutEventVertically: function(d, b) {
        var a = this.view;
        var c = d === 0 ? a.barMargin : d * a.timeAxisViewModel.rowHeightHorizontal - (d - 1) * a.barMargin;
        if (c >= a.cellBottomBorderWidth) {
            c -= a.cellBottomBorderWidth;
        }
        return c;
    },
    resolveResource: function(e) {
        var d = this, b = d.view, c, a;
        c = Ext.fly(e).is(b.eventSelector) && e || Ext.fly(e).up(b.eventSelector, null, true);
        if (c) {
            a = b.getResourceRecordFromDomId(c.id);
        } else {
            e = b.findRowByChild(e);
            a = e && b.getRecordForRowNode(e) || null;
        }
        return a;
    },
    getTimeSpanRegion: function(b, h, g) {
        var d = this.view, c = d.getXFromDate(b), e = h ? d.getXFromDate(h) : c, a, f;
        f = d.getTableRegion();
        if (g) {
            a = Math.max(f ? f.bottom - f.top : 0, d.getEl().dom.clientHeight);
        } else {
            a = f ? f.bottom - f.top : 0;
        }
        return new Ext.util.Region(0, Math.max(c, e), a, Math.min(c, e));
    },
    getStartEndDatesFromRegion: function(g, d, c) {
        var b = this.view;
        var f = b.rtl;
        var a = b.getDateFromCoordinate(f ? g.right : g.left, d), e = b.getDateFromCoordinate(f ? g.left : g.right, d);
        if (a && e || c && (a || e)) {
            return {
                start: a,
                end: e
            };
        }
        return null;
    },
    onEventAdd: function(q, p) {
        var o = this.view, h = {}, a, b, n, c, e, m, d, g, f;
        for (m = 0, d = p.length; m < d; m++) {
            a = p[m];
            b = a.getStartDate();
            n = a.getEndDate();
            if (b && n && o.timeAxis.timeSpanInAxis(b, n)) {
                c = p[m].getResources(o.getEventStore());
                for (g = 0, f = c.length; g < f; g++) {
                    e = c[g];
                    h[e.getId()] = e;
                }
            }
        }
        Ext.Object.each(h, function(j, i) {
            o.repaintEventsForResource(i);
        });
    },
    onEventRemove: function(e, b) {
        var f = this, a = f.view, d = a.getEventStore(), g, c;
        g = Ext.Array.unique(Ext.Array.flatten(Ext.Array.map(b, function(h) {
            return d.getResourcesForEvent(h);
        })));
        c = Ext.Array.flatten(Ext.Array.map(b, function(h) {
            return a.getElementsFromEventRecord(h, null, null, true);
        }));
        c = new Ext.CompositeElementLite(c);
        c.fadeOut({
            callback: function(h) {
                Ext.Array.forEach(g, function(i) {
                    a.store.indexOf(i) >= 0 && a.repaintEventsForResource(i);
                });
            }
        });
    },
    onEventUpdate: function(d, e) {
        var h = e.previous || {};
        var j = this.view;
        var g = j.timeAxis;
        var a = e.getStartDate();
        var i = e.getEndDate();
        var b = h.StartDate || a;
        var f = h.EndDate || i;
        var k = b && f && g.timeSpanInAxis(b, f);
        var c;
        if (e.resourceIdField in h && k) {
            c = d.getResourceStore().getById(h[e.resourceIdField]);
            c && j.repaintEventsForResource(c, true);
        }
        if (a && i && g.timeSpanInAxis(a, i) || k) {
            Ext.Array.each(e.getResources(), function(l) {
                j.repaintEventsForResource(l, true);
            });
        }
    },
    setColumnWidth: function(c, b) {
        var a = this.view;
        a.getTimeAxisViewModel().setViewColumnWidth(c, b);
    },
    getVisibleDateRange: function() {
        var e = this.view;
        if (!e.getEl()) {
            return null;
        }
        var d = e.getTableRegion(), c = e.timeAxis.getStart(), g = e.timeAxis.getEnd(), f = e.getWidth();
        if (d.right - d.left < f) {
            return {
                startDate: c,
                endDate: g
            };
        }
        var b = e.getScroll();
        var a = {
            startDate: e.getDateFromCoordinate(b.left, null, true),
            endDate: e.getDateFromCoordinate(b.left + f, null, true)
        };
        if (!a.endDate) {
            a.endDate = e.timeAxis.getEnd();
        }
        return a;
    }
});

Ext.define("Ext.ux.Scheduler2.mixin.AbstractTimelineView", {
    selectedEventCls: "sch2-event-selected",
    readOnly: false,
    horizontalViewClass: "Ext.ux.Scheduler2.view.Horizontal",
    timeCellCls: "sch2-timetd",
    timeCellSelector: ".sch2-timetd",
    eventBorderWidth: 1,
    timeAxis: null,
    timeAxisViewModel: null,
    eventPrefix: null,
    rowHeight: null,
    orientation: "horizontal",
    mode: "horizontal",
    horizontal: null,
    vertical: null,
    secondaryCanvasEl: null,
    panel: null,
    displayDateFormat: null,
    el: null,
    constructor: function(a) {
        if (a && a.orientation) {
            a.mode = this.mode = a.orientation;
        }
        this.callParent([ a ]);
    },
    _initializeTimelineView: function() {
        if (this.horizontalViewClass) {
            this.horizontal = Ext.create(this.horizontalViewClass, {
                view: this
            });
        }
        if (this.verticalViewClass) {
            this.vertical = Ext.create(this.verticalViewClass, {
                view: this
            });
        }
        if (this.calendarViewClass) {
            this.calendar = Ext.create(this.calendarViewClass, {
                view: this
            });
        }
        this.eventPrefix = (this.eventPrefix || this.getId()) + "-";
    },
    getTimeAxisViewModel: function() {
        return this.timeAxisViewModel;
    },
    getFormattedDate: function(a) {
        return Ext.Date.format(a, this.getDisplayDateFormat());
    },
    getFormattedEndDate: function(c, a) {
        var b = this.getDisplayDateFormat();
        if (c.getHours() === 0 && c.getMinutes() === 0 && (!a || !(c.getYear() === a.getYear() && c.getMonth() === a.getMonth() && c.getDate() === a.getDate())) && !Ext.ux.Scheduler2.util.Date.hourInfoRe.test(b.replace(Ext.ux.Scheduler2.util.Date.stripEscapeRe, ""))) {
            c = Ext.ux.Scheduler2.util.Date.add(c, Ext.ux.Scheduler2.util.Date.DAY, -1);
        }
        return Ext.Date.format(c, b);
    },
    getDisplayDateFormat: function() {
        return this.displayDateFormat;
    },
    setDisplayDateFormat: function(a) {
        this.displayDateFormat = a;
    },
    fitColumns: function(b) {
        if (this.mode === "horizontal") {
            this.getTimeAxisViewModel().fitToAvailableWidth(b);
        } else {
            var a = Math.floor((this.panel.getWidth() - Ext.getScrollbarSize().width - 1) / this.headerCt.getColumnCount());
            this.setColumnWidth(a, b);
        }
    },
    getElementFromEventRecord: function(b, d) {
        var c = this, a;
        a = c.getElementsFromEventRecord(b, d);
        if (a.length === 0) {
            a = null;
        } else {
            if (a.length == 1) {
                a = a[0];
            } else {
                if (c.mode == "calendar") {
                    a = a[0];
                } else {
                    Ext.Error.raise("The method getElementFromEventRecord() is deprecated, it can't handle the situation when several DOM elements correspond to a single event record, please use getElementsFromEventRecord() method instead!");
                }
            }
        }
        return a;
    },
    getElementsFromEventRecord: function(a, e, c, b) {
        var d = this, f;
        b = b || false;
        if (e && (c !== null && c !== undefined)) {
            f = "[id^=" + d.eventPrefix + a.internalId + "-" + e.internalId + "-" + c + "]";
        } else {
            if (e) {
                f = "[id^=" + d.eventPrefix + a.internalId + "-" + e.internalId + "-]";
            } else {
                f = "[id^=" + d.eventPrefix + a.internalId + "-]";
            }
        }
        return d.getEl().query(f, b);
    },
    getStartEndDatesFromRegion: function(c, b, a) {
        return this[this.mode].getStartEndDatesFromRegion(c, b, a);
    },
    getTimeResolution: function() {
        return this.timeAxis.getResolution();
    },
    setTimeResolution: function(b, a) {
        this.timeAxis.setResolution(b, a);
        if (this.getTimeAxisViewModel().snapToIncrement) {
            this.refreshKeepingScroll();
        }
    },
    getEventIdFromDomNodeId: function(a) {
        return a.substring(this.eventPrefix.length).split("-")[0];
    },
    getResourceIdFromDomNodeId: function(a) {
        return a.substring(this.eventPrefix.length).split("-")[1];
    },
    getDateFromDomEvent: function(b, a) {
        return this.getDateFromXY(b.getXY(), a);
    },
    getSnapPixelAmount: function() {
        return this.getTimeAxisViewModel().getSnapPixelAmount();
    },
    setSnapEnabled: function(a) {
        this.getTimeAxisViewModel().setSnapToIncrement(a);
    },
    setReadOnly: function(a) {
        this.readOnly = a;
        this[a ? "addCls" : "removeCls"](this._cmpCls + "-readonly");
    },
    isReadOnly: function() {
        return this.readOnly;
    },
    setOrientation: function() {
        this.setMode.apply(this, arguments);
    },
    setMode: function(a) {
        this.mode = a;
        this.timeAxisViewModel.mode = a;
    },
    getOrientation: function() {
        return this.getMode.apply(this, arguments);
    },
    getMode: function() {
        return this.mode;
    },
    isHorizontal: function() {
        return this.getMode() === "horizontal";
    },
    isVertical: function() {
        return !this.isHorizontal();
    },
    getDateFromXY: function(c, b, a) {
        return this[this.mode].getDateFromXY(c, b, a);
    },
    getDateFromCoordinate: function(c, b, a) {
        if (!a) {
            c = this[this.mode].translateToScheduleCoordinate(c);
        }
        return this.timeAxisViewModel.getDateFromPosition(c, b);
    },
    getDateFromX: function(a, b) {
        return this.getDateFromCoordinate(a, b);
    },
    getDateFromY: function(b, a) {
        return this.getDateFromCoordinate(b, a);
    },
    getCoordinateFromDate: function(a, b) {
        var c = this.timeAxisViewModel.getPositionFromDate(a);
        if (b === false) {
            c = this[this.mode].translateToPageCoordinate(c);
        }
        return Math.round(c);
    },
    getXFromDate: function(a, b) {
        return this.getCoordinateFromDate(a, b);
    },
    getYFromDate: function(a, b) {
        return this.getCoordinateFromDate(a, b);
    },
    getTimeSpanDistance: function(a, b) {
        return this.timeAxisViewModel.getDistanceBetweenDates(a, b);
    },
    getTimeSpanRegion: function(a, b) {
        return this[this.mode].getTimeSpanRegion(a, b);
    },
    getScheduleRegion: function(b, a) {
        return this[this.mode].getScheduleRegion(b, a);
    },
    getTableRegion: function() {
        throw "Abstract method call";
    },
    getRowNode: function(a) {
        throw "Abstract method call";
    },
    getRecordForRowNode: function(a) {
        throw "Abstract method call";
    },
    getVisibleDateRange: function() {
        return this[this.mode].getVisibleDateRange();
    },
    setColumnWidth: function(b, a) {
        this[this.mode].setColumnWidth(b, a);
    },
    findRowByChild: function(a) {
        throw "Abstract method call";
    },
    setBarMargin: function(b, a) {
        this.barMargin = b;
        if (!a) {
            this.refreshKeepingScroll();
        }
    },
    getRowHeight: function() {
        return this.timeAxisViewModel.getViewRowHeight();
    },
    setRowHeight: function(a, b) {
        this.timeAxisViewModel.setViewRowHeight(a, b);
    },
    refreshKeepingScroll: function() {
        throw "Abstract method call";
    },
    scrollVerticallyTo: function(b, a) {
        throw "Abstract method call";
    },
    scrollHorizontallyTo: function(a, b) {
        throw "Abstract method call";
    },
    getVerticalScroll: function() {
        throw "Abstract method call";
    },
    getHorizontalScroll: function() {
        throw "Abstract method call";
    },
    getEl: Ext.emptyFn,
    getSecondaryCanvasEl: function() {
        if (!this.rendered) {
            throw "Calling this method too early";
        }
        if (!this.secondaryCanvasEl) {
            this.secondaryCanvasEl = (this.scrollerEl || this.getEl()).createChild({
                cls: "sch2-secondary-canvas"
            });
        }
        return this.secondaryCanvasEl;
    },
    getScroll: function() {
        throw "Abstract method call";
    },
    getOuterEl: function() {
        return this.getEl();
    },
    getRowContainerEl: function() {
        return this.getEl();
    },
    getScheduleCell: function(b, a) {
        return this.getCellByPosition({
            row: b,
            column: a
        });
    },
    getScrollEventSource: function() {
        return this.getEl();
    },
    getViewportHeight: function() {
        return this.getEl().getHeight();
    },
    getViewportWidth: function() {
        return this.getEl().getWidth();
    },
    getViewportCenterDate: function() {
        var a = this.getScroll(), b;
        if (this.getMode() === "vertical") {
            b = [ 0, a.top + this.getViewportHeight() / 2 ];
        } else {
            b = [ a.left + this.getViewportWidth() / 2, 0 ];
        }
        return this.getDateFromXY(b, null, true);
    },
    getDateConstraints: Ext.emptyFn
});

Ext.apply(Ext.ux.Scheduler2, {
    VERSION: "4.1.0"
});

Ext.define("Ext.ux.Scheduler2.mixin.FilterableTreeView", {
    prevBlockRefresh: null,
    initTreeFiltering: function() {
        var a = function() {
            var b = this.store;
            this.mon(b, "nodestore-datachange-start", this.onFilterChangeStart, this);
            this.mon(b, "nodestore-datachange-end", this.onFilterChangeEnd, this);
            if (!b.allowExpandCollapseWhileFiltered) {
                this.mon(b, "filter-clear", this.onFilterCleared, this);
                this.mon(b, "filter-set", this.onFilterSet, this);
            }
        };
        if (this.rendered) {
            a.call(this);
        } else {
            this.on("beforerender", a, this, {
                single: true
            });
        }
    },
    onFilterChangeStart: function() {
        this.prevBlockRefresh = this.blockRefresh;
        this.blockRefresh = true;
        Ext.suspendLayouts();
    },
    onFilterChangeEnd: function() {
        Ext.resumeLayouts(true);
        this.blockRefresh = this.prevBlockRefresh;
    },
    onFilterCleared: function() {
        delete this.toggle;
        var a = this.getEl();
        if (a) {
            a.removeCls("sch2-tree-filtered");
        }
    },
    onFilterSet: function() {
        this.toggle = function() {};
        var a = this.getEl();
        if (a) {
            a.addCls("sch2-tree-filtered");
        }
    }
});

Ext.define("Ext.ux.Scheduler2.mixin.PartnerTimelinePanel", {
    extend: Ext.Mixin,
    setupPartnerTimelinePanel: function(b) {
        var e = this.partnerTimelinePanel;
        var a = e.lockedGrid;
        var d = this.lockedGrid;
        a.mon(d, "resize", this.onLockedGridResize, a);
        d.mon(a, "resize", this.onLockedGridResize, d);
        var c = e.isVisible() ? e.lockedGrid.getWidth() : e.lockedGrid.width;
        if (a.getCollapsed()) {
            this.mon(a, "viewready", function(f) {
                d.setWidth(f.getWidth());
            });
        } else {
            d.setWidth(c);
        }
        this.on("afterlayout", function() {
            if (a.getCollapsed()) {
                d.collapse();
            } else {
                d.expand();
                d.setWidth(c);
            }
        }, this, {
            single: true
        });
        a.on({
            collapse: this.onPartnerCollapseExpand,
            expand: this.onPartnerCollapseExpand,
            scope: this
        });
        d.on({
            collapse: this.onPartnerCollapseExpand,
            expand: this.onPartnerCollapseExpand,
            scope: e
        });
        this.setupScrollSync();
        e.mon(this, "beforezoomchange", this.onBeforeZoomChange, this);
        e.mon(this, "viewchange", this.onViewChange, this);
        this.mon(e, "beforezoomchange", this.onBeforeZoomChange, this);
        this.mon(e, "viewchange", this.onViewChange, this);
    },
    onLockedGridResize: function(b, a) {
        this.setWidth(a);
    },
    onPartnerCollapseExpand: function(a) {
        if (a.getCollapsed()) {
            this.lockedGrid.collapse();
        } else {
            this.lockedGrid.expand();
        }
    },
    setupScrollSync: function() {
        var g = this.partnerTimelinePanel.getSchedulingView(), b = g.getScrollable(), e = this.getSchedulingView(), a = e.getScrollable(), d, f = Ext.Function.createBuffered(function() {
            d = null;
        }, 300);
        var c = function(i, k) {
            var h = i === a ? a : b;
            var j = i === a ? b : a;
            if (!d) {
                d = h;
            }
            f();
            if (j !== d) {
                j.scrollTo(k);
            }
        };
        g.mon(a, "scroll", c);
        e.mon(b, "scroll", c);
    },
    onViewChange: function() {
        this.partnerTimelinePanel.viewPreset = this.viewPreset;
    },
    onBeforeZoomChange: function() {
        var c = this.partnerTimelinePanel;
        var d = c.getSchedulingView(), b = d.getScrollable(), a = b.suspendPartnerSync;
        b.suspendPartnerSync = Ext.emptyFn;
        b.on("scrollend", function() {
            b.suspendPartnerSync = a;
        }, d, {
            single: true
        });
    }
});

Ext.define("Ext.ux.Scheduler2.patches.CellContext", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.grid.CellContext",
    minVersion: "6.0.1",
    overrides: {
        setPosition: function(b, a) {
            b = b || 0;
            a = a || 0;
            return this.callParent(arguments);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.TablePanel", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.panel.Table",
    minVersion: "6.0.1",
    overrides: {
        ensureVisible: function(a, b) {
            if (b && b.column && this.getVisibleColumns().indexOf(b.column) === -1) {
                return;
            }
            this.callParent(arguments);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.Collection", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.util.Collection",
    minVersion: "5.1.0",
    overrides: {
        updateKey: function(b, e) {
            var a = this, d = a.map, g = a.indices, c = a.getSource(), f;
            if (c && !c.updating) {
                c.updateKey(b, e);
            } else {
                if (d[e] && (f = a.getKey(b)) !== e) {
                    if (e in d || d[f] !== b) {
                        if (e in d) {
                            if (d[e] !== b) {
                                Ext.Error.raise('Incorrect oldKey "' + e + '" for item with newKey "' + f + '"');
                            }
                            delete d[e];
                        }
                        a.updating++;
                        a.generation++;
                        d[f] = b;
                        if (g) {
                            g[f] = g[e];
                            delete g[e];
                        }
                        a.notify("updatekey", [ {
                            item: b,
                            newKey: f,
                            oldKey: e
                        } ]);
                        a.updating--;
                    }
                }
            }
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.TouchScroll", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.scroll.TouchScroller",
    minVersion: "5.1.0",
    overrides: {
        privates: {
            onEvent: function(b) {
                var a = this;
                if (!a[a.listenerMap[b.type]]) {
                    return;
                }
                return this.callParent(arguments);
            }
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.PartnerScroll", {
    extend: Ext.ux.Scheduler2.util.Patch,
    minVersion: "5.1.0",
    maxVersion: "5.1.1",
    applyFn: function() {
        if (Ext.isMac || Ext.isGecko) {
            Ext.ClassManager.get("Ext.scroll.Scroller").override({
                constructor: function(a) {
                    var b = this;
                    b.callParent([ a ]);
                    this.doNotCall = {};
                },
                privates: {
                    onPartnerScrollEnd: function() {
                        this.doNotCall = {};
                    },
                    invokePartners: function(f, a, e) {
                        var c = this._partners, b, d;
                        if (!this.suspendSync) {
                            for (d in c) {
                                b = c[d];
                                if (!b.suspendSync && !this.doNotCall[b.scroller.id]) {
                                    b.scroller[f](this, a, e);
                                } else {
                                    if (!b.scroller.component.isTableView) {
                                        delete this.doNotCall[b.scroller.id];
                                    }
                                }
                            }
                        }
                    },
                    onPartnerScroll: function(c, a, d) {
                        var b = c._partners[this.getId()].axis;
                        if (b) {
                            if (b === "x") {
                                d = null;
                            } else {
                                if (b === "y") {
                                    a = null;
                                }
                            }
                        }
                        this.doNotCall[c.id] = true;
                        this.doScrollTo(a, d, null, false);
                    }
                }
            });
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.View", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.view.View",
    minVersion: "5.1.0",
    overrides: {
        handleEvent: function(f) {
            var d = this, c = d.keyEventRe.test(f.type), a = d.getNavigationModel();
            f.view = d;
            if (c) {
                f.item = f.getTarget(d.itemSelector);
                f.record = a.getRecord(f.item);
            }
            if (!f.item) {
                var b = d.editingPlugin && d.editingPlugin.getActiveEditor && d.editingPlugin.getActiveEditor();
                if (!(b && b.getEl().contains(f.getTarget()))) {
                    f.item = f.getTarget(d.itemSelector);
                }
            }
            if (f.item && !f.record) {
                f.record = d.getRecord(f.item);
            }
            if (d.processUIEvent(f) !== false) {
                d.processSpecialEvent(f);
            }
            if (c && !Ext.fly(f.target).isInputField()) {
                if (f.getKey() === f.SPACE || f.isNavKeyPress(true)) {
                    f.preventDefault();
                }
            }
            f.view = null;
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.ToolTip", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.tip.ToolTip",
    minVersion: "5.1.0",
    overrides: {
        setTarget: function(d) {
            var b = this, a = Ext.get(d), c;
            if (b.target) {
                c = Ext.get(b.target);
                b.mun(c, {
                    mouseover: b.onTargetOver,
                    tap: b.onTargetOver,
                    mouseout: b.onTargetOut,
                    mousemove: b.onMouseMove,
                    scope: b
                });
            }
            b.target = a;
            if (a) {
                b.mon(a, {
                    mouseover: b.onTargetOver,
                    tap: b.onTargetOver,
                    mouseout: b.onTargetOut,
                    mousemove: b.onMouseMove,
                    scope: b
                });
            }
            if (b.anchor) {
                b.anchorTarget = b.target;
            }
        }
    }
});

Ext.define("Ext.ux.Scheduler2.mixin.TimelineView", {
    extend: Ext.ux.Scheduler2.mixin.AbstractTimelineView,
    tip: null,
    overScheduledEventClass: "sch2-event-hover",
    ScheduleBarEvents: [ "mousedown", "mouseup", "click", "dblclick", "longpress", "contextmenu" ],
    ResourceRowEvents: [ "keydown", "keyup" ],
    preventOverCls: false,
    hoveredEventNode: null,
    _initializeTimelineView: function() {
        this.callParent(arguments);
        this.on("destroy", this._onDestroy, this);
        this.on("afterrender", this._onAfterRender, this);
        this.panel.on("viewready", this._onViewReady, this);
        this.setMode(this.mode);
        this.enableBubble("columnwidthchange");
        this.addCls("sch2-timelineview");
        if (this.readOnly) {
            this.addCls(this._cmpCls + "-readonly");
        }
        this.addCls(this._cmpCls);
        if (this.eventAnimations) {
            this.addCls("sch2-animations-enabled");
        }
    },
    handleScheduleBarEvent: function(b, a) {
        this.fireEvent(this.scheduledEventName + b.type, this, this.resolveEventRecord(a), b);
    },
    handleResourceRowEvent: function(a, b) {
        this.fireEvent(this.scheduledEventName + a.type, this, this.resolveEventRecordFromResourceRow(b), a);
    },
    _onDestroy: function() {
        if (this.tip) {
            this.tip.destroy();
        }
    },
    _onViewReady: function() {
        if (this.touchScroll) {
            this.getSecondaryCanvasEl().insertBefore(this.getNodeContainer());
        }
    },
    _onAfterRender: function() {
        if (this.overScheduledEventClass) {
            this.setMouseOverEnabled(true);
        }
        if (this.tooltipTpl) {
            if (typeof this.tooltipTpl === "string") {
                this.tooltipTpl = new Ext.XTemplate(this.tooltipTpl);
            }
            this.el.on("mousemove", this.setupTooltip, this, {
                single: true
            });
        }
        var e = this.bufferedRenderer;
        if (e) {
            this.patchBufferedRenderingPlugin(e);
            this.patchBufferedRenderingPlugin(this.lockingPartner.bufferedRenderer);
        }
        this.on("bufferedrefresh", this.onBufferedRefresh, this, {
            buffer: 10
        });
        this.setupTimeCellEvents();
        var d = this.getSecondaryCanvasEl();
        if (d.getStyle("position").toLowerCase() !== "absolute") {
            var c = Ext.Msg || window;
            c.alert("ERROR: The CSS file for the Bryntum component has not been loaded.");
        }
        var b = {
            delegate: this.eventSelector,
            scope: this
        };
        var a = {
            delegate: this.rowSelector,
            scope: this
        };
        Ext.Array.each(this.ScheduleBarEvents, function(f) {
            b[f] = this.handleScheduleBarEvent;
        }, this);
        Ext.Array.each(this.ResourceRowEvents, function(f) {
            a[f] = this.handleResourceRowEvent;
        }, this);
        this.el.on(b);
        this.el.on(a);
    },
    patchBufferedRenderingPlugin: function(c) {
        var b = this;
        var a = c.setBodyTop;
        c.setBodyTop = function(d, e) {
            var f = a.apply(this, arguments);
            b.fireEvent("bufferedrefresh", this);
            return f;
        };
    },
    onBufferedRefresh: function() {
        var d = this.body.dom;
        if (!d) {
            return;
        }
        var c = d.style;
        if (Ext.isIE9m) {
            this.getSecondaryCanvasEl().dom.style.top = this.body.dom.style.top;
        } else {
            var b = c.transform || c.msTransform || c.webkitTransform;
            var a;
            if (b) {
                a = /\(-?\d+px,\s*(-?\d+px),\s*(-?\d+)px\)/.exec(b);
            }
            if (a) {
                this.getSecondaryCanvasEl().dom.style.top = b ? a[1] : d.style.top;
            }
        }
    },
    setMouseOverEnabled: function(a) {
        this[a ? "mon" : "mun"](this.el, {
            mouseover: this.onEventMouseOver,
            mouseout: this.onEventMouseOut,
            delegate: this.eventSelector,
            scope: this
        });
    },
    onEventMouseOver: function(c, a) {
        if (a !== this.hoveredEventNode && !this.preventOverCls) {
            this.hoveredEventNode = a;
            Ext.fly(a).addCls(this.overScheduledEventClass);
            var b = this.resolveEventRecord(a);
            if (b) {
                this.fireEvent("eventmouseenter", this, b, c);
            }
        }
    },
    onEventMouseOut: function(b, a) {
        if (this.hoveredEventNode) {
            if (!b.within(this.hoveredEventNode, true, true)) {
                Ext.fly(this.hoveredEventNode).removeCls(this.overScheduledEventClass);
                this.fireEvent("eventmouseleave", this, this.resolveEventRecord(this.hoveredEventNode), b);
                this.hoveredEventNode = null;
            }
        }
    },
    highlightItem: function(b) {
        if (b) {
            var a = this;
            a.clearHighlight();
            a.highlightedItem = b;
            Ext.fly(b).addCls(a.overItemCls);
        }
    },
    setupTooltip: function() {
        var b = this, a = Ext.apply({
            delegate: b.eventSelector,
            target: b.el,
            anchor: "b",
            rtl: b.rtl,
            show: function() {
                Ext.ToolTip.prototype.show.apply(this, arguments);
                if (this.triggerElement && b.getMode() === "horizontal") {
                    var f = Ext.fly(this.triggerElement).getBox();
                    var d = Ext.dom.Element.getViewportWidth();
                    var c = Math.min(Math.max(this.targetXY[0] - 10, 0), d - this.getWidth() - 10);
                    var e = f.top - this.getHeight() - 10;
                    this.setY(e < 0 ? f.bottom + 10 : e);
                    this.setX(c);
                }
            }
        }, b.tipCfg);
        b.tip = new Ext.ToolTip(a);
        b.tip.on({
            beforeshow: function(e) {
                if (!e.triggerElement || !e.triggerElement.id || Ext.ComponentQuery.query("window[modal=true]{isVisible()}").length > 0) {
                    return false;
                }
                var c = this.resolveEventRecord(e.triggerElement);
                if (!c || this.fireEvent("beforetooltipshow", this, c) === false) {
                    return false;
                }
                var f = this.getDataForTooltipTpl(c, e.triggerElement), d;
                if (!f) {
                    return false;
                }
                d = this.tooltipTpl.apply(f);
                if (!d) {
                    return false;
                }
                e.update(d);
            },
            scope: this
        });
        if (Ext.supports.Touch) {
            b.el.un({
                touchmove: b.setupTooltip,
                mousemove: b.setupTooltip,
                scope: b
            });
        }
    },
    getHorizontalTimeAxisColumn: function() {
        if (!this.timeAxisColumn) {
            this.timeAxisColumn = this.headerCt.down("timeaxiscolumn");
            if (this.timeAxisColumn) {
                this.timeAxisColumn.on("destroy", function() {
                    this.timeAxisColumn = null;
                }, this);
            }
        }
        return this.timeAxisColumn;
    },
    getDataForTooltipTpl: function(a, b) {
        return Ext.apply({
            _record: a
        }, a.data);
    },
    refreshKeepingScroll: function() {
        Ext.suspendLayouts();
        this.saveScrollState();
        this.refreshView();
        Ext.resumeLayouts(true);
        if (this.scrollState.left !== 0 || this.scrollState.top !== 0 || this.infiniteScroll) {
            this.restoreScrollState();
        }
    },
    setupTimeCellEvents: function() {
        this.mon(this.el, {
            click: this.handleScheduleEvent,
            dblclick: this.handleScheduleEvent,
            contextmenu: this.handleScheduleEvent,
            pinch: this.handleScheduleEvent,
            pinchstart: this.handleScheduleEvent,
            pinchend: this.handleScheduleEvent,
            scope: this
        });
    },
    getTableRegion: function() {
        var a = this.el.down("." + Ext.baseCSSPrefix + "grid-item-container");
        return (a || this.el).getRegion();
    },
    getRowNode: function(a) {
        return this.getNodeByRecord(a);
    },
    findRowByChild: function(a) {
        return this.findItemByChild(a);
    },
    getRecordForRowNode: function(a) {
        return this.getRecord(a);
    },
    refreshKeepingResourceScroll: function() {
        var a = this.getScroll();
        this.refreshView();
        if (this.getMode() === "horizontal") {
            this.scrollVerticallyTo(a.top);
        } else {
            this.scrollHorizontallyTo(a.left);
        }
    },
    scrollHorizontallyTo: function(a, b) {
        this.scrollTo(a, null, b);
    },
    scrollVerticallyTo: function(b, a) {
        this.scrollTo(null, b, a);
    },
    getVerticalScroll: function() {
        return this.getScrollY();
    },
    getHorizontalScroll: function() {
        return this.getScrollX();
    },
    getScroll: function() {
        var a = this;
        return {
            top: a.getScrollY(),
            left: a.getScrollX()
        };
    },
    handleScheduleEvent: function() {},
    scrollElementIntoView: function(d, t, h, f, a, g, c) {
        var w = this, s = d.dom, m = Ext.getDom(w.getEl()), j = d.getOffsetsTo(m), b = w.getScroll(), e = j[0] + b.left, n = j[1] + b.top, k = n + s.offsetHeight, u = e + s.offsetWidth, o = m.clientHeight, i = parseInt(b.top, 10), v = parseInt(b.left, 10), p = i + o, l = v + m.clientWidth, r, q;
        a = a === null || a === undefined ? 20 : a;
        if (s.offsetHeight > o || n < i) {
            q = n - a;
        } else {
            if (k > p) {
                q = k - o + a;
            }
        }
        if (t !== false && s.offsetWidth > m.clientWidth || e < v) {
            r = e - a;
        } else {
            if (t !== false && u > l) {
                r = u - m.clientWidth + a;
            }
        }
        h = h === true && {} || h;
        f = f === true && {} || f;
        c = c || w;
        if (h && f) {
            h.listeners = Ext.apply(h.listeners || {}, {
                afteranimate: function() {
                    f.listeners = Ext.apply(f.listeners || {}, {
                        afteranimate: function() {
                            g && g.call(c);
                            g = null;
                        }
                    });
                    Ext.fly(s).highlight(null, f);
                }
            });
        } else {
            if (h) {
                h.listeners = Ext.apply(h.listeners, {
                    afteranimate: function() {
                        g && g.call(c);
                        g = null;
                    }
                });
            } else {
                if (f) {
                    f.listeners = Ext.apply(f.listeners || {}, {
                        afteranimate: function() {
                            g && g.call(c);
                            g = null;
                        }
                    });
                }
            }
        }
        q !== undefined && w.setScrollY(q, h);
        r !== undefined && w.setScrollX(r, h);
        !h && f && Ext.fly(s).highlight(null, f);
        !h && !f && g && g.call(c);
    },
    disableViewScroller: function(b) {
        var a = this.getScrollable();
        if (a) {
            a.setDisabled(b);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.view.TimelineGridView", {
    extend: Ext.grid.View,
    mixins: [ Ext.ux.Scheduler2.mixin.TimelineView ],
    infiniteScroll: false,
    bufferCoef: 5,
    bufferThreshold: .2,
    cachedScrollLeftDate: null,
    boxIsReady: false,
    ignoreNextHorizontalScroll: false,
    constructor: function(a) {
        this.callParent(arguments);
        if (this.infiniteScroll) {
            this.on("boxready", this.setupInfiniteScroll, this);
        }
        if (this.timeAxisViewModel) {
            this.relayEvents(this.timeAxisViewModel, [ "columnwidthchange" ]);
        }
    },
    setupInfiniteScroll: function() {
        var f = this.panel.ownerCt;
        this.cachedScrollLeftDate = f.startDate || this.timeAxis.getStart();
        if (Ext.supports.Touch && Ext.os.is.Windows) {
            var a = this.panel.headerCt.scrollable;
            var b = this.scrollable;
            try {
                Ext.GlobalEvents.un("idle", a.onIdle, a);
                Ext.GlobalEvents.un("idle", b.onIdle, b);
            } catch (d) {
                Ext.log("Cannot unsubscribe required listener, zooming may be broken");
            }
        }
        var c = this;
        f.calculateOptimalDateRange = function(g, e, j, h) {
            if (h) {
                return h;
            }
            var i = Ext.ux.Scheduler2.preset.Manager.getPreset(j.preset);
            return c.calculateInfiniteScrollingDateRange(g, i.getBottomHeader().unit, j.increment, j.width);
        };
        this.bindInfiniteScrollListeners();
    },
    bindInfiniteScrollListeners: function() {
        this.getScrollable().on("scroll", this.onHorizontalScroll, this);
        this.ownerCt.on("afterlayout", function() {
            this.on("resize", this.onSelfResize, this);
        }, this, {
            single: true
        });
    },
    unbindInfiniteScrollListeners: function() {
        this.getScrollable().un("scroll", this.onHorizontalScroll, this);
        this.un("resize", this.onSelfResize, this);
    },
    onHorizontalScroll: function(e, g, f) {
        if (this.ignoreNextHorizontalScroll || this.cachedScrollLeftDate) {
            this.ignoreNextHorizontalScroll = false;
            return;
        }
        var d = Ext.getScrollbarSize(), c = this.getWidth(), b = this.getScrollable().getMaxPosition().x + c - d.width, a = c * this.bufferThreshold * this.bufferCoef;
        if (b - g - c < a || g < a) {
            this.shiftToDate(this.getDateFromCoordinate(g, null, true));
            this.el.stopAnimation();
        }
    },
    refresh: function() {
        this.callParent(arguments);
        if (this.infiniteScroll && !this.scrollStateSaved && this.boxIsReady) {
            this.restoreScrollLeftDate();
        }
    },
    onSelfResize: function(c, d, a, b, e) {
        this.boxIsReady = true;
        if (d !== b) {
            this.shiftToDate(this.cachedScrollLeftDate || this.getVisibleDateRange().startDate, this.cachedScrollCentered);
        }
    },
    restoreScrollLeftDate: function() {
        if (this.cachedScrollLeftDate && this.boxIsReady) {
            this.ignoreNextHorizontalScroll = true;
            this.scrollToDate(this.cachedScrollLeftDate);
            this.cachedScrollLeftDate = null;
        }
    },
    scrollToDate: function(a) {
        this.cachedScrollLeftDate = a;
        if (this.cachedScrollCentered) {
            this.panel.ownerCt.scrollToDateCentered(a);
        } else {
            this.panel.ownerCt.scrollToDate(a);
        }
        var b = this.getScrollX();
        this.panel.scrollLeftPos = b;
        this.headerCt.setScrollX(b);
    },
    saveScrollState: function() {
        this.scrollStateSaved = this.boxIsReady;
        this.callParent(arguments);
    },
    restoreScrollState: function() {
        this.scrollStateSaved = false;
        if (this.infiniteScroll && this.cachedScrollLeftDate) {
            this.restoreScrollLeftDate();
            this.setScrollY(this.scrollState.top);
            return;
        }
        this.callParent(arguments);
    },
    calculateInfiniteScrollingDateRange: function(h, e, b, a) {
        var f = this.timeAxis;
        var d = this.getWidth();
        a = a || this.timeAxisViewModel.getTickWidth();
        b = b || f.increment || 1;
        e = e || f.unit;
        var g = Ext.ux.Scheduler2.util.Date;
        var c = Math.ceil(d * this.bufferCoef / a);
        return {
            start: f.floorDate(g.add(h, e, -c * b), false, e, b),
            end: f.ceilDate(g.add(h, e, Math.ceil((d / a + c) * b)), false, e, b)
        };
    },
    shiftToDate: function(c, b) {
        var a = this.calculateInfiniteScrollingDateRange(c);
        this.cachedScrollLeftDate = c;
        this.cachedScrollCentered = b;
        this.timeAxis.setTimeSpan(a.start, a.end);
    },
    destroy: function() {
        if (this.infiniteScroll && this.rendered) {
            this.unbindInfiniteScrollListeners();
        }
        this.callParent(arguments);
    }
});

Ext.define("Ext.ux.Scheduler2.patches.DragDropManager", {
    extend: Ext.ux.Scheduler2.util.Patch,
    minVersion: "6.0.0",
    applyFn: function() {
        Ext.override(Ext.dd.DragDropManager, {
            fireEvents: function(z, p) {
                var B = this, q = Ext.supports.Touch, k = B.dragCurrent, x = B.currentPoint, t = x.x, s = x.y, r = [], l = [], n = [], d = [], A = [], y = [], c = q ? document.documentElement.clientWidth / window.innerWidth : 1, h, j, o, f, v, w, u, m;
                if (!k || k.isLocked()) {
                    return;
                }
                m = !(k.deltaX < 0 || k.deltaY < 0);
                if (q || !B.notifyOccluded && (!Ext.supports.CSSPointerEvents || Ext.isIE10m || Ext.isOpera) && m) {
                    h = k.getDragEl();
                    if (m) {
                        h.style.visibility = "hidden";
                    }
                    var g = Ext.getBody().getScroll();
                    z.target = document.elementFromPoint(t - g.left / c, s - g.top / c);
                    if (m) {
                        h.style.visibility = "visible";
                    }
                }
                for (v in B.dragOvers) {
                    j = B.dragOvers[v];
                    delete B.dragOvers[v];
                    if (!B.isTypeOfDD(j) || j.destroyed) {
                        continue;
                    }
                    if (B.notifyOccluded) {
                        if (!this.isOverTarget(x, j, B.mode)) {
                            n.push(j);
                        }
                    } else {
                        if (!z.within(j.getEl())) {
                            n.push(j);
                        }
                    }
                    l[v] = true;
                }
                for (u in k.groups) {
                    if ("string" !== typeof u) {
                        continue;
                    }
                    for (v in B.ids[u]) {
                        j = B.ids[u][v];
                        if (B.isTypeOfDD(j) && (o = j.getEl()) && j.isTarget && !j.isLocked() && Ext.fly(o).isVisible(true) && (j !== k || k.ignoreSelf === false)) {
                            if (B.notifyOccluded) {
                                if ((j.zIndex = B.getZIndex(o)) !== -1) {
                                    f = true;
                                }
                                r.push(j);
                            } else {
                                if (z.within(j.getEl())) {
                                    r.push(j);
                                    break;
                                }
                            }
                        }
                    }
                }
                if (f) {
                    Ext.Array.sort(r, B.byZIndex);
                }
                for (v = 0, w = r.length; v < w; v++) {
                    j = r[v];
                    if (B.isOverTarget(x, j, B.mode)) {
                        if (p) {
                            A.push(j);
                        } else {
                            if (!l[j.id]) {
                                y.push(j);
                            } else {
                                d.push(j);
                            }
                            B.dragOvers[j.id] = j;
                        }
                        if (!B.notifyOccluded) {
                            break;
                        }
                    }
                }
                if (B.mode) {
                    if (n.length) {
                        k.b4DragOut(z, n);
                        k.onDragOut(z, n);
                    }
                    if (y.length) {
                        k.onDragEnter(z, y);
                    }
                    if (d.length) {
                        k.b4DragOver(z, d);
                        k.onDragOver(z, d);
                    }
                    if (A.length) {
                        k.b4DragDrop(z, A);
                        k.onDragDrop(z, A);
                    }
                } else {
                    for (v = 0, w = n.length; v < w; ++v) {
                        k.b4DragOut(z, n[v].id);
                        k.onDragOut(z, n[v].id);
                    }
                    for (v = 0, w = y.length; v < w; ++v) {
                        k.onDragEnter(z, y[v].id);
                    }
                    for (v = 0, w = d.length; v < w; ++v) {
                        k.b4DragOver(z, d[v].id);
                        k.onDragOver(z, d[v].id);
                    }
                    for (v = 0, w = A.length; v < w; ++v) {
                        k.b4DragDrop(z, A[v].id);
                        k.onDragDrop(z, A[v].id);
                    }
                }
                if (p && !A.length) {
                    k.onInvalidDrop(z);
                }
            }
        });
        var b = Ext.dd.ScrollManager;
        var a = Ext.dd.DragDropManager;
        a.fireEvents = Ext.Function.createSequence(a.fireEvents, b.onFire, b);
        a.stopDrag = Ext.Function.createSequence(a.stopDrag, b.onStop, b);
    }
});

Ext.define("Ext.ux.Scheduler2.patches.NavigationModel", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.grid.NavigationModel",
    minVersion: "6.0.0",
    ieOnly: true,
    overrides: {
        setPosition: function(b, d, e, a, f) {
            if (e && (e.getKey() === e.PAGE_DOWN || e.getKey() === e.PAGE_UP)) {
                var c = this.lastFocused;
                if (e.view.isLockedView && c && e.view.getVisibleColumnManager().indexOf(c.column) === -1) {
                    e.view = e.view.lockingPartner;
                }
            }
            return this.callParent(arguments);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.view.Calendar", {
    view: null,
    constructor: function(a) {
        Ext.apply(this, a);
    },
    getColumnsBy: function(b, e) {
        var d = this.view.panel.headerCt.getGridColumns();
        var a = [];
        for (var c = 0; c < d.length; c++) {
            if (b.call(this, d[c])) {
                if (e !== true) {
                    a.push(d[c]);
                } else {
                    a.push({
                        column: d[c],
                        index: c
                    });
                }
            }
        }
        return a;
    },
    getColumnsForDateRange: function(a, b) {
        return this.getColumnsBy(function(c) {
            return !(a.getEndDate() <= c.start || a.getStartDate() >= c.end);
        }, b);
    },
    getColumnEvents: function(b) {
        var a = [];
        this.view.getEventStore().each(function(c) {
            if (!(c.getEndDate() <= b.start || c.getStartDate() >= b.end)) {
                a.push(c);
            }
        });
        return a;
    },
    getColumnsByResource: function(b, a) {
        return this.getColumnsBy(function(c) {
            return c.start == b.start;
        }, a)[0];
    },
    translateToScheduleCoordinate: function(b) {
        var a = this.view;
        if (Ext.isArray(b)) {
            return [ b[0] - a.getEl().getX() + a.getScroll().left, b[1] - a.getEl().getY() + a.getScroll().top ];
        } else {
            return b - a.getEl().getY() + a.getScroll().top;
        }
    },
    translateToPageCoordinate: function(d) {
        var b = this.view;
        var c = b.getEl(), a = b.getScroll();
        if (Ext.isArray(d)) {
            return [ d[0] + c.getX() - a.left, d[1] + c.getY() - a.top ];
        } else {
            return d + c.getY() - a.top;
        }
    },
    getDateFromXY: function(c, b, a) {
        var d = c;
        if (!a) {
            d = this.translateToScheduleCoordinate(d);
        }
        return this.view.timeAxisViewModel.getDateFromPosition(d, b);
    },
    getEventRenderData: function(a, b, i) {
        var j = a.getStartDate(), h = a.getEndDate(), l = this.view, c = l.panel.headerCt.getGridColumns(), g = c[i].start, m = c[i].end, k = Math;
        var f = Math.floor(l.getCoordinateFromDate(Ext.ux.Scheduler2.util.Date.max(j, g)));
        var n = Math.floor(l.timeAxisViewModel.getPositionFromDate(Ext.ux.Scheduler2.util.Date.min(h, m), true));
        var e = this.getCalendarColumnWidth();
        var d;
        if (n === 0) {
            n = l.getStore().getCount() * l.getRowHeight();
        }
        d = {
            top: k.max(0, k.min(f, n) - l.eventBorderWidth),
            height: k.max(1, k.abs(f - n))
        };
        d.start = j;
        d.end = h;
        d.startsOutsideView = j < g;
        d.endsOutsideView = h > m;
        return d;
    },
    getScheduleRegion: function(f, c) {
        var b = this.view, h = f ? this.getColumnsByResource(f).getRegion() : b.getTableRegion(), a = this.translateToPageCoordinate(0), e = this.translateToPageCoordinate(b.getStore().getCount() * b.getRowHeight()), g = h.left + b.barMargin, d = h.right - b.barMargin;
        return new Ext.util.Region(Math.min(a, e), d, Math.max(a, e), g);
    },
    getCalendarColumnWidth: function(a) {
        return this.view.timeAxisViewModel.calendarColumnWidth;
    },
    getResourceRegion: function(h, b, g) {
        var j = this.view, e = j.getResourceStore().indexOf(h) * this.getCalendarColumnWidth(), i = j.timeAxis.getStart(), m = j.timeAxis.getEnd(), a = b ? Ext.ux.Scheduler2.util.Date.max(i, b) : i, d = g ? Ext.ux.Scheduler2.util.Date.min(m, g) : m, f = Math.max(0, j.getCoordinateFromDate(a) - j.cellTopBorderWidth), l = j.getCoordinateFromDate(d) - j.cellTopBorderWidth, c = e + j.cellBorderWidth, k = e + this.getCalendarColumnWidth() - j.cellBorderWidth;
        return new Ext.util.Region(Math.min(f, l), k, Math.max(f, l), c);
    },
    columnRenderer: function(d, n, g, h, m) {
        var j = this.view;
        var c = "";
        if (h === 0) {
            var k, b, f, e;
            k = [];
            b = this.getColumnEvents(n.column);
            for (f = 0, e = b.length; f < e; f++) {
                var a = b[f];
                k.push(j.generateTplData(a, a.getResources()[0] || g, m));
            }
            if (n.column.rendered && this.getCalendarColumnWidth() !== n.column.getWidth()) {
                this.setColumnWidth(n.column.getWidth(), true);
            }
            j.eventLayout.vertical.applyLayout(k, this.getCalendarColumnWidth() - 2 * j.barMargin - j.cellBorderWidth);
            c = "&#160;" + j.eventTpl.apply(k);
        }
        if (m % 2 === 1) {
            n.tdCls = (n.tdCls || "") + " " + j.altColCls;
            n.cellCls = (n.cellCls || "") + " " + j.altColCls;
        }
        return c;
    },
    resolveResource: function(d) {
        var a = this.view;
        d = Ext.fly(d).is(a.timeCellSelector) ? d : Ext.fly(d).up(a.timeCellSelector);
        if (d) {
            var e = d.dom ? d.dom : d;
            var b = 0;
            if (Ext.isIE8m) {
                e = e.previousSibling;
                while (e) {
                    if (e.nodeType === 1) {
                        b++;
                    }
                    e = e.previousSibling;
                }
            } else {
                b = Ext.Array.indexOf(Array.prototype.slice.call(e.parentNode.children), e);
            }
            if (b >= 0) {
                var c = a.panel.headerCt.getGridColumns()[b];
                return {
                    start: c.start,
                    end: c.end
                };
            }
        }
    },
    onEventUpdate: function(b, c) {
        this.renderSingle(c);
        var a = this.view;
        var d = a.getEventSelectionModel();
        d.forEachEventRelatedSelection(c, function(e) {
            a.onEventBarSelect(e);
        });
    },
    onEventAdd: function(b, c) {
        var a = this.view;
        if (c.length === 1) {
            this.renderSingle(c[0]);
        } else {
            a.repaintAllEvents();
        }
    },
    onEventRemove: function(b, c) {
        var a = this.view;
        if (c.length === 1) {
            Ext.Array.each(a.getElementsFromEventRecord(c[0]), function(d) {
                Ext.fly(d).destroy();
            });
            this.relayoutRenderedEvents(c[0]);
        } else {
            a.repaintAllEvents();
        }
    },
    relayoutRenderedEvents: function(b) {
        var c = this, a = c.getColumnsForDateRange(b, true);
        Ext.Array.each(a, function(d) {
            c.repaintEventsForColumn(d.column, d.index);
        });
    },
    renderSingle: function(e) {
        var a = this.view;
        Ext.Array.each(a.getElementsFromEventRecord(e), function(h) {
            Ext.fly(h).destroy();
        });
        var g = e.getResources()[0] || a.getResourceStore().first();
        var d = e.previous || {};
        var b = Ext.ux.Scheduler2.util.Date;
        var f = new Ext.ux.Scheduler2.model.Range({
            StartDate: b.min(d.StartDate || e.getStartDate(), e.getStartDate()),
            EndDate: b.max(d.EndDate || e.getEndDate(), e.getEndDate())
        });
        var c = this.getColumnsForDateRange(f);
        Ext.Array.each(c, function(j) {
            var i = j.getIndex();
            var h = this.getColumnEvents(j);
            var k = Ext.Array.map(h, function(l) {
                if (l === e) {
                    return a.generateTplData(e, g, i);
                } else {
                    return {
                        start: l.getStartDate() < j.start ? j.start : l.getStartDate(),
                        end: l.getEndDate() > j.end ? j.end : l.getEndDate(),
                        event: l
                    };
                }
            });
            a.eventLayout.vertical.applyLayout(k, j.getWidth() - 2 * a.barMargin - a.cellBorderWidth);
            Ext.Array.each(k, function(n) {
                if (n.event === e) {
                    var m = Ext.get(a.getScheduleCell(0, i));
                    if (m) {
                        if (!Ext.versions.touch) {
                            m = m.first();
                        }
                        a.eventTpl.append(m, [ n ]);
                    }
                } else {
                    var l = a.getElementsFromEventRecord(n.event, n.event.getResource(), i)[0];
                    l.setStyle({
                        left: n.left + "px",
                        width: Math.max(n.width, 0) + "px"
                    });
                }
            });
        }, this);
    },
    repaintEventsForColumn: function(e, n) {
        var o = this;
        var q = o.getColumnEvents(e);
        var p = o.view;
        var j = [], k, f, a, d, c, h;
        for (k = 0, f = q.length; k < f; k++) {
            a = q[k];
            d = p.getElementsFromEventRecord(a)[0];
            if (!d) {
                return;
            }
            var m = d.id.split("-");
            m.pop();
            c = a.getStartDate();
            h = a.getEndDate();
            j.push({
                start: c < e.start ? e.start : c,
                end: h > e.end ? e.end : h,
                event: a,
                id: m.join("-")
            });
        }
        p.eventLayout.vertical.applyLayout(j, e.getWidth() - 2 * p.barMargin - p.cellBorderWidth);
        var b = p.getNode(0);
        Ext.DomQuery.selectNode("tr:nth-child(1)", p.el.dom);
        for (k = 0; k < j.length; k++) {
            a = j[k];
            var g = Ext.get(Ext.DomQuery.selectNode("td:nth-child(" + (n + 1) + ") [id^=" + a.id + "-]", b));
            g && g.setStyle({
                left: a.left + "px",
                width: Math.max(a.width, 0) + "px"
            });
        }
    },
    getTimeSpanRegion: function(a, d) {
        var f = this.view, c = f.getCoordinateFromDate(a), g = d ? f.getCoordinateFromDate(d, true, true) : c;
        var b = this.getColumnsBy(function(j) {
            return j.start <= a && j.end > a;
        })[0];
        var e = this.getColumnsBy(function(j) {
            return j.start < d && j.end >= d;
        })[0];
        var i = this.translateToScheduleCoordinate([ b.getX(), 0 ]);
        var h = this.translateToScheduleCoordinate([ e ? e.getRegion().right : b.getWidth() + i[0], 0 ]);
        return new Ext.util.Region(Math.min(c, g), h[0], Math.max(c, g), i[0]);
    },
    getStartEndDatesFromRegion: function(d, c, b) {
        var a = this.view.getDateFromCoordinate([ d.left, d.top ], c), e = this.view.getDateFromCoordinate([ d.left, d.bottom ], c);
        if (a && e) {
            return {
                start: Ext.ux.Scheduler2.util.Date.min(a, e),
                end: Ext.ux.Scheduler2.util.Date.max(a, e)
            };
        } else {
            return null;
        }
    },
    setColumnWidth: function(c, b) {
        var a = this.view;
        a.calendarColumnWidth = c;
        a.getTimeAxisViewModel().setViewColumnWidth(c, b);
    },
    getVisibleDateRange: function() {
        var e = this.view;
        if (!e.rendered) {
            return null;
        }
        var c = e.getScroll(), b = e.getHeight(), d = e.getTableRegion(), f = e.timeAxis.getEnd();
        if (d.bottom - d.top < b) {
            var a = e.timeAxis.getStart();
            return {
                startDate: a,
                endDate: f
            };
        }
        return {
            startDate: e.getDateFromCoordinate(c.top, null, true),
            endDate: e.getDateFromCoordinate(c.top + b, null, true) || f
        };
    }
});

Ext.define("Ext.ux.Scheduler2.mixin.SchedulerView", {
    extend: Ext.ux.Scheduler2.mixin.AbstractSchedulerView,
    mixins: [ Ext.ux.Scheduler2.mixin.Localizable ],
    eventResizeHandles: "end",
    dndValidatorFn: Ext.emptyFn,
    resizeValidatorFn: Ext.emptyFn,
    createValidatorFn: Ext.emptyFn,
    calendarViewClass: "Ext.ux.Scheduler2.view.Calendar",
    lockedGridDependsOnSchedule: null,
    _initializeSchedulerView: function() {
        this.callParent(arguments);
        this.on({
            destroy: this._destroy,
            afterrender: this._afterRender,
            itemupdate: this.onRowUpdated,
            scope: this
        });
        if (Ext.getVersion().isGreaterThan("5.1.1")) {
            this.on("itemadd", function(b) {
                var c = this.all.item(this.all.endIndex - b.length);
                if (c) {
                    c.dom.style.height = "";
                }
            });
        }
        var a = this;
        if (!this.eventPrefix) {
            throw "eventPrefix missing";
        }
        this.on({
            resourcestorechange: this.clearRowHeightCache,
            assignmentstorechange: this.clearRowHeightCache,
            eventstorechange: this.clearRowHeightCache,
            scope: this
        });
    },
    inheritables: function() {
        return {
            loadingText: this.L("loadingText"),
            overItemCls: "",
            trackOver: false,
            selectedItemCls: "",
            setReadOnly: function(a) {
                if (this.dragCreator) {
                    this.dragCreator.setDisabled(a);
                }
                this.callParent(arguments);
            },
            repaintEventsForResource: function(e, c) {
                var d = this, g = d.getMode(), f = g === "horizontal", a = f ? d.indexOf(e) : 0;
                if (f) {
                    d.eventLayout.horizontal.clearCache(e);
                }
                if (a >= 0) {
                    Ext.suspendLayouts();
                    if (f) {
                        d.refreshNode(e);
                        if (d.lockedGridDependsOnSchedule) {
                            d.lockingPartner.refreshNode(e);
                        }
                    } else {
                        d.refreshNode(a);
                        d.lockingPartner.refreshNode(a);
                    }
                    Ext.resumeLayouts();
                    if (c) {
                        var h = d.getEventSelectionModel();
                        var b = d.getEventStore().getEventsForResource(e);
                        Ext.Array.each(b, function(i) {
                            h.forEachEventRelatedSelection(i, function(j) {
                                d.onEventBarSelect(j, true);
                            });
                        });
                    }
                }
            },
            repaintAllEvents: function() {
                if (this.mode === "horizontal") {
                    this.refreshView();
                } else {
                    this.refreshNode(0);
                }
            },
            handleScheduleEvent: function(g) {
                var a = g.getTarget("." + this.eventCls, 3), j = !a && g.getTarget("." + this.timeCellCls, 3);
                if (j) {
                    var k = this.getDateFromDomEvent(g, "floor");
                    var i = this.findRowByChild(j);
                    var f = this.indexOf(i);
                    var b;
                    if (this.mode == "horizontal") {
                        b = this.getRecordForRowNode(i);
                    } else {
                        var c = g.getTarget(this.timeCellSelector, 5);
                        if (c) {
                            var h = typeof c.cellIndex == "number" ? c.cellIndex : c.getAttribute("data-cellIndex");
                            var d = this.headerCt.getGridColumns()[h];
                            b = d && d.model;
                        }
                    }
                    if (g.type.indexOf("pinch") >= 0) {
                        this.fireEvent("schedule" + g.type, this, g);
                    } else {
                        this.fireEvent("schedule" + g.type, this, k, f, b, g);
                    }
                }
            },
            onEventDataRefresh: function() {
                this.clearRowHeightCache();
                this.callParent(arguments);
            },
            onUnbindStore: function(a) {
                a.un({
                    refresh: this.clearRowHeightCache,
                    clear: this.clearRowHeightCache,
                    load: this.clearRowHeightCache,
                    scope: this
                });
                this.callParent(arguments);
            },
            bindStore: function(a) {
                a && a.on({
                    refresh: this.clearRowHeightCache,
                    clear: this.clearRowHeightCache,
                    load: this.clearRowHeightCache,
                    scope: this
                });
                this.callParent(arguments);
            },
            refreshKeepingScroll: function() {
                this.lockingPartner.saveScrollState();
                this.lockingPartner.refreshView();
                this.callParent(arguments);
                this.lockingPartner.restoreScrollState();
            }
        };
    },
    getEventSelectionModel: function() {
        var b = this, c = b.eventSelModel, a = b.eventSelModelType, d;
        if (c && c.events) {
            return c;
        }
        if (!c) {
            c = {};
        }
        if (!a && b.getEventStore().getAssignmentStore()) {
            a = "assignmentmodel";
        } else {
            if (!a) {
                a = "eventmodel";
            }
        }
        d = "SINGLE";
        if (b.simpleSelect) {
            d = "SIMPLE";
        } else {
            if (b.multiSelect) {
                d = "MULTI";
            }
        }
        Ext.applyIf(c, {
            allowDeselect: b.allowDeselect,
            mode: d
        });
        if (!c.events) {
            c = b.eventSelModel = Ext.create("selection." + a, c);
        }
        if (b.disableSelection) {
            c.locked = true;
        }
        return c;
    },
    _afterRender: function() {
        this.setEventStore(this.eventStore, true);
        this.getEventSelectionModel().bindToView(this);
        this.setupEventListeners();
        this.configureFunctionality();
        var a = this.headerCt.resizer;
        if (a) {
            a.doResize = Ext.Function.createSequence(a.doResize, this.afterHeaderResized, this);
        }
        this.on("itemupdate", function() {
            this.hoveredEventNode = null;
        });
    },
    _destroy: function() {
        this.setEventStore(null);
    },
    clearRowHeightCache: function() {
        if (this.mode === "horizontal") {
            this.eventLayout.horizontal.clearCache();
        }
    },
    configureFunctionality: function() {
        var a = this.validatorFnScope || this;
        if (this.eventResizeHandles !== "none" && Ext.ux.Scheduler2.feature.ResizeZone) {
            this.resizePlug = new Ext.ux.Scheduler2.feature.ResizeZone(Ext.applyIf({
                schedulerView: this,
                validatorFn: function(d, c, b, e) {
                    return (this.allowOverlap || this.isDateRangeAvailable(b, e, c, d)) && this.resizeValidatorFn.apply(a, arguments);
                },
                validatorFnScope: this
            }, this.resizeConfig || {}));
        }
        if (this.enableEventDragDrop !== false && Ext.ux.Scheduler2.feature.DragDrop) {
            this.dragdropPlug = new Ext.ux.Scheduler2.feature.DragDrop(this, {
                validatorFn: function(c, b, d, e) {
                    return (this.allowOverlap || this.isDateRangeAvailable(d, Ext.ux.Scheduler2.util.Date.add(d, Ext.ux.Scheduler2.util.Date.MILLI, e), c[0], b)) && this.dndValidatorFn.apply(a, arguments);
                },
                validatorFnScope: this,
                dragConfig: this.dragConfig || {}
            });
        }
        if (this.enableDragCreation !== false && Ext.ux.Scheduler2.feature.DragCreator) {
            this.dragCreator = new Ext.ux.Scheduler2.feature.DragCreator(Ext.applyIf({
                schedulerView: this,
                disabled: this.readOnly,
                validatorFn: function(c, b, d) {
                    return (this.allowOverlap || this.isDateRangeAvailable(b, d, null, c)) && this.createValidatorFn.apply(a, arguments);
                },
                validatorFnScope: this
            }, this.createConfig || {}));
        }
    },
    onBeforeDragDrop: function(a, c, b) {
        return !this.readOnly && !b.getTarget().className.match("sch2-resizable-handle");
    },
    onDragDropStart: function() {
        if (this.dragCreator) {
            this.dragCreator.setDisabled(true);
        }
        if (this.tip) {
            this.tip.hide();
            this.tip.disable();
        }
        if (this.overScheduledEventClass) {
            this.setMouseOverEnabled(false);
        }
        this.hoveredEventNode = null;
    },
    onDragDropEnd: function() {
        if (this.dragCreator) {
            this.dragCreator.setDisabled(false);
        }
        if (this.tip) {
            this.tip.enable();
        }
        if (this.overScheduledEventClass) {
            this.setMouseOverEnabled(true);
        }
    },
    onBeforeDragCreate: function(b, c, a, d) {
        return !this.readOnly && !d.ctrlKey;
    },
    onDragCreateStart: function() {
        if (this.overScheduledEventClass) {
            this.setMouseOverEnabled(false);
        }
        if (this.tip) {
            this.tip.hide();
            this.tip.disable();
        }
        this.disableViewScroller(true);
    },
    onDragCreateEnd: function(b, a, c) {
        if (!this.getEventEditor()) {
            var d = c ? [ c ] : [];
            if (this.fireEvent("beforeeventadd", this, a, d) !== false) {
                this.onEventCreated(a);
                this.getEventStore().append(a);
                a.assign(c);
            }
            this.dragCreator.getProxy().hide();
        }
        if (this.overScheduledEventClass) {
            this.setMouseOverEnabled(true);
        }
    },
    onEventCreated: function(a) {},
    onAfterDragCreate: function() {
        if (this.overScheduledEventClass) {
            this.setMouseOverEnabled(true);
        }
        if (this.tip) {
            this.tip.enable();
        }
        this.disableViewScroller(false);
    },
    onBeforeResize: function() {
        return !this.readOnly;
    },
    onResizeStart: function() {
        if (this.tip) {
            this.tip.hide();
            this.tip.disable();
        }
        if (this.dragCreator) {
            this.dragCreator.setDisabled(true);
        }
        this.disableViewScroller(true);
    },
    onResizeEnd: function() {
        if (this.tip) {
            this.tip.enable();
        }
        if (this.dragCreator) {
            this.dragCreator.setDisabled(false);
        }
        this.disableViewScroller(false);
    },
    setupEventListeners: function() {
        this.on({
            beforeeventdrag: this.onBeforeDragDrop,
            eventdragstart: this.onDragDropStart,
            aftereventdrop: this.onDragDropEnd,
            beforedragcreate: this.onBeforeDragCreate,
            dragcreatestart: this.onDragCreateStart,
            dragcreateend: this.onDragCreateEnd,
            afterdragcreate: this.onAfterDragCreate,
            beforeeventresize: this.onBeforeResize,
            eventresizestart: this.onResizeStart,
            eventresizeend: this.onResizeEnd,
            scope: this
        });
    },
    afterHeaderResized: function() {
        var b = this.headerCt.resizer;
        if (b && this.getMode() !== "horizontal") {
            if (this.panel.forceFit) {
                this.setColumnWidth(b.origWidth);
            } else {
                var a = b.dragHd.getWidth();
                this.setColumnWidth(a);
            }
        }
    },
    columnRenderer: function(e, c, a, d, b) {
        return this[this.mode].columnRenderer(e, c, a, d, b);
    },
    onRowUpdated: function(c) {
        var b = this, a;
        if (b.getMode() === "horizontal" && b.hasListener("eventrepaint")) {
            Ext.Array.each(c.getEvents(), function(d) {
                a = b.getElementsFromEventRecord(d, c, null, true);
                Ext.Array.each(a, function(e) {
                    b.fireEvent("eventrepaint", b, d, e);
                });
            });
        }
    },
    scrollResourceEventIntoView: function(f, h, i, d, a, l, m) {
        var k = this, j = h.getStartDate(), g = h.getEndDate(), c, b;
        var e = function() {
            b = k.getElementsFromEventRecord(h, f, i);
            b = b.length && b[0] || null;
            k.scrollElementIntoView(b, true, a, d, null, l, m);
        };
        if (k.getResourceStore().isTreeStore) {
            f.bubble(function(n) {
                n.expand();
            });
        }
        if (!k.timeAxis.dateInAxis(j) || !k.timeAxis.dateInAxis(g)) {
            c = k.timeAxis.getEnd() - k.timeAxis.getStart();
            k.timeAxis.setTimeSpan(new Date(j.valueOf() - c / 2), new Date(g.getTime() + c / 2));
            k.up("panel").scrollTask.cancel();
        }
        if (this.getOrientation() === "horizontal") {
            k.up("timelinegrid,timelinetree").ensureVisible(f, {
                callback: function() {
                    if (this.isLocked === false) {
                        e();
                    }
                }
            });
        } else {
            e();
        }
    }
});

Ext.define("Ext.ux.Scheduler2.view.SchedulerGridView", {
    extend: Ext.ux.Scheduler2.view.TimelineGridView,
    mixins: [ Ext.ux.Scheduler2.mixin.SchedulerView, Ext.ux.Scheduler2.mixin.Localizable ],
    alias: "widget.schedulergridview"
}, function() {
    this.override(Ext.ux.Scheduler2.mixin.SchedulerView.prototype.inheritables() || {});
});

Ext.define("Ext.ux.Scheduler2.selection.EventModel", {
    extend: Ext.selection.Model,
    alias: "selection.eventmodel",
    deselectOnContainerClick: true,
    selectedOnMouseDown: null,
    bindToView: function(a) {
        var b = this;
        b.view = a;
        b.bindStore(a.getEventStore());
        a.on({
            eventclick: b.onEventClick,
            eventmousedown: b.onEventMouseDown,
            itemmousedown: b.onItemMouseDown,
            refresh: function() {
                b.refresh();
            },
            destroy: function() {
                b.bindStore(null);
            },
            scope: b
        });
    },
    bindStore: function(a) {
        if (this.getStore()) {
            this.mun(this.getStore(), "load", this.onEventStoreLoad, this);
        }
        if (a) {
            this.mon(a, "load", this.onEventStoreLoad, this);
        }
        this.callParent(arguments);
    },
    onEventStoreLoad: function() {
        this.deselectAll();
    },
    onEventMouseDown: function(b, a, c) {
        this.selectedOnMouseDown = null;
        if (!this.isSelected(a)) {
            this.selectedOnMouseDown = a;
            this.selectWithEvent(a, c);
        }
    },
    onEventClick: function(b, a, c) {
        if (!this.selectedOnMouseDown) {
            this.selectWithEvent(a, c);
        }
    },
    onItemMouseDown: function(f, e, i, h, g) {
        if (this.deselectOnContainerClick && !g.getTarget(this.view.eventSelector)) {
            this.deselectAll();
        }
    },
    onSelectChange: function(d, b, j, a) {
        var f = this, g = f.view, h = f.store, e = b ? "select" : "deselect", c = 0;
        if ((j || f.fireEvent("before" + e, f, d)) !== false && a() !== false) {
            if (b) {
                g.onEventBarSelect(d, j);
            } else {
                g.onEventBarDeselect(d, j);
            }
            if (!j) {
                f.fireEvent(e, f, d);
            }
        }
    },
    selectRange: Ext.emptyFn,
    selectNode: function(c, d, a) {
        var b = this.view.resolveEventRecord(c);
        if (b) {
            this.select(b, d, a);
        }
    },
    deselectNode: function(c, d, a) {
        var b = this.view.resolveEventRecord(c);
        if (b) {
            this.deselect(b, a);
        }
    },
    getFirstSelectedEventForResource: function(f) {
        var c = this.getSelection(), e = null, b, a, d;
        for (b = 0, a = c.length; !e && b < a; ++b) {
            d = c[b];
            if (d.isAssignedTo(f)) {
                e = d;
            }
        }
        return e;
    },
    getDraggableSelections: function() {
        return Ext.Array.filter(this.getSelection(), function(a) {
            return a.isDraggable();
        });
    },
    forEachEventRelatedSelection: function(a, b) {
        this.isSelected(a) && b(a);
    }
});

Ext.define("Ext.ux.Scheduler2.selection.AssignmentModel", {
    extend: Ext.ux.Scheduler2.selection.EventModel,
    alias: "selection.assignmentmodel",
    assignmentStoreDetacher: null,
    destroy: function() {
        var a = this;
        Ext.destroyMembers(a, "assignmentStoreDetacher");
        a.callParent();
    },
    onBindStore: function(a) {
        this.callParent(arguments);
        var c = a.getAssignmentStore();
        if (c) {
            var b = this;
            b.assignmentStoreDetacher && b.assignmentStoreDetacher.destroy();
            b.assignmentStoreDetacher = c.on({
                remove: b.onAssignmentStoreRemove,
                clear: b.onAssignmentStoreClear,
                refresh: b.onAssignmentStoreRefresh,
                scope: b,
                destroyable: true
            });
        }
    },
    selectWithEvent: function(b, h) {
        var f = this, a = f.view, d = a.resolveResource(h.getTarget()), g, c;
        if (d) {
            g = a.getEventStore().getAssignmentStore();
            c = g.getAssignmentForEventAndResource(b, d);
            if (c) {
                f.callParent([ c, h ]);
            }
        }
    },
    getFirstSelectedEventForResource: function(f) {
        var c = this.getSelection(), e = null, b, a, d;
        for (b = 0, a = c.length; !e && b < a; ++b) {
            d = c[b];
            if (d.getEvent().isAssignedTo(f)) {
                e = d;
                break;
            }
        }
        return e;
    },
    getDraggableSelections: function() {
        return Ext.Array.filter(this.getSelection(), function(a) {
            return a.getEvent().isDraggable();
        });
    },
    forEachEventRelatedSelection: function(a, b) {
        Ext.Array.each(this.getSelection(), function(c) {
            c.getEvent() === a && b(c);
        });
    },
    onAssignmentStoreRemove: function(b, a) {
        this.deselect(a, true);
    },
    onAssignmentStoreClear: function(a) {
        this.clearSelections();
    },
    onAssignmentStoreRefresh: function(a) {
        this.clearSelections();
    }
});

Ext.define("Ext.ux.Scheduler2.mixin.SchedulerPanel", {
    extend: Ext.ux.Scheduler2.mixin.AbstractSchedulerPanel,
    eventSelModelType: null,
    eventSelModel: null,
    enableEventDragDrop: true,
    enableDragCreation: true,
    dragConfig: null,
    componentCls: "sch2-schedulerpanel",
    lockedGridDependsOnSchedule: true,
    verticalListeners: null,
    horizontalLockedWidth: null,
    inheritables: function() {
        return {
            variableRowHeight: true,
            initComponent: function() {
                var b = this.normalViewConfig = this.normalViewConfig || {};
                this._initializeSchedulerPanel();
                this.verticalListeners = {
                    clear: this.refreshResourceColumns,
                    datachanged: this.refreshResourceColumns,
                    update: this.refreshResourceColumns,
                    load: this.refreshResourceColumns,
                    scope: this
                };
                this.calendarListeners = {
                    reconfigure: this.refreshCalendarColumns,
                    priority: 1,
                    scope: this
                };
                this.normalGridListeners = {
                    resize: this.onScheduleResize,
                    scope: this
                };
                Ext.apply(b, {
                    eventStore: this.eventStore,
                    resourceStore: this.resourceStore,
                    eventBarTextField: this.eventBarTextField || this.getEventStore().getModel().prototype.nameField
                });
                Ext.Array.each([ "barMargin", "eventBodyTemplate", "eventTpl", "allowOverlap", "dragConfig", "eventBarIconClsField", "onEventCreated", "constrainDragToResource", "snapRelativeToEventStartDate", "eventSelModelType", "simpleSelect", "multiSelect", "allowDeselect", "lockedGridDependsOnSchedule" ], function(e) {
                    if (e in this) {
                        b[e] = this[e];
                    }
                }, this);
                this.callParent(arguments);
                if (this.mode === "vertical") {
                    this.mon(this.resourceStore, this.verticalListeners);
                }
                var d = this.lockedGrid.getView();
                var c = this.getSchedulingView();
                this.registerRenderer(c.columnRenderer, c);
                if (this.resourceZones) {
                    var a = Ext.StoreManager.lookup(this.resourceZones);
                    a.setResourceStore(this.resourceStore);
                    this.resourceZonesPlug = new Ext.ux.Scheduler2.plugin.ResourceZones(Ext.apply({
                        store: a
                    }, this.resourceZonesConfig));
                    this.resourceZonesPlug.init(this);
                }
                c.on("columnwidthchange", this.onColWidthChange, this);
                this.relayEvents(c, [ "eventclick", "eventlongpress", "eventmousedown", "eventmouseup", "eventdblclick", "eventcontextmenu", "eventmouseenter", "eventmouseleave", "eventkeydown", "eventkeyup", "beforeeventresize", "eventresizestart", "eventpartialresize", "beforeeventresizefinalize", "eventresizeend", "beforeeventdrag", "eventdragstart", "eventdrag", "beforeeventdropfinalize", "eventdrop", "aftereventdrop", "beforedragcreate", "dragcreatestart", "beforedragcreatefinalize", "dragcreateend", "afterdragcreate", "beforeeventadd" ]);
                if (!this.syncRowHeight) {
                    this.enableRowHeightInjection(d, c);
                }
            },
            applyViewSettings: function(c, b) {
                this.callParent(arguments);
                var d = this.getSchedulingView(), a;
                b = b || !this.rendered;
                if (this.orientation === "vertical") {
                    a = c.timeColumnWidth || 60;
                    d.setColumnWidth(c.resourceColumnWidth || 100, true);
                    d.setRowHeight(a, true);
                }
            },
            afterRender: function() {
                this.callParent(arguments);
                if (this.mode === "calendar") {
                    this.mon(this.timeAxis, this.calendarListeners);
                    this.normalGrid.on(this.normalGridListeners);
                }
                this.getSchedulingView().on({
                    eventdragstart: this.doSuspendLayouts,
                    aftereventdrop: this.doResumeLayouts,
                    eventresizestart: this.doSuspendLayouts,
                    eventresizeend: this.doResumeLayouts,
                    scope: this
                });
                if (this.lockedGridDependsOnSchedule) {
                    this.normalGrid.getView().on("itemupdate", this.onNormalViewItemUpdate, this);
                }
                this.relayEvents(this.getEventSelectionModel(), [ "selectionchange", "deselect", "select" ], "event");
            },
            getTimeSpanDefiningStore: function() {
                return this.eventStore;
            },
            destroy: function() {
                if (this.destroyStores) {
                    this.eventStore && this.eventStore.destroy();
                    this.eventStore = null;
                    this.resourceStore && this.resourceStore.destroy();
                    this.resourceStore = null;
                    this.assignmentStore && this.assignmentStore.destroy();
                    this.assignmentStore = null;
                }
                this.callParent(arguments);
            }
        };
    },
    doSuspendLayouts: function() {
        var a = this.getSchedulingView();
        a.infiniteScroll && a.timeAxis.on({
            beginreconfigure: this.onBeginReconfigure,
            endreconfigure: this.onEndReconfigure,
            scope: this
        });
        this.lockedGrid.suspendLayouts();
        this.normalGrid.suspendLayouts();
    },
    doResumeLayouts: function() {
        var a = this.getSchedulingView();
        a.infiniteScroll && a.timeAxis.un({
            beginreconfigure: this.onBeginReconfigure,
            endreconfigure: this.onEndReconfigure,
            scope: this
        });
        this.lockedGrid.resumeLayouts();
        this.normalGrid.resumeLayouts();
    },
    onBeginReconfigure: function() {
        this.normalGrid.resumeLayouts();
    },
    onEndReconfigure: function() {
        this.normalGrid.suspendLayouts();
    },
    onColWidthChange: function(b, a) {
        switch (this.getMode()) {
          case "vertical":
            this.resourceColumnWidth = a;
            this.refreshResourceColumns();
            break;

          case "calendar":
            this.calendarColumnWidth = a;
            this.refreshCalendarColumns();
            break;
        }
    },
    enableRowHeightInjection: function(c, e) {
        var b = this;
        var d = new Ext.XTemplate("{%", "this.processCellValues(values);", "this.nextTpl.applyOut(values, out, parent);", "%}", {
            priority: 1,
            processCellValues: function(f) {
                if (e.mode === "horizontal") {
                    var g = 1;
                    if (e.dynamicRowHeight) {
                        var j = f.record;
                        var i = e.eventLayout.horizontal;
                        g = i.getNumberOfBands(j, function() {
                            return e.getEventStore().filterEventsForResource(j, e.timeAxis.isRangeInAxis, e.timeAxis);
                        });
                    }
                    var h = g * b.getRowHeight() - (g - 1) * e.barMargin - e.cellTopBorderWidth - e.cellBottomBorderWidth;
                    f.style = (f.style || "") + ";height:" + h + "px;";
                }
            }
        });
        c.addCellTpl(d);
        Ext.Array.each(c.getColumnManager().getColumns(), function(f) {
            f.hasCustomRenderer = true;
        });
        var a = this.getView().getStoreListeners();
        a = Ext.apply({}, a);
        a.scope = this.getView();
        this.store.un(a);
        this.store.on(a);
    },
    getEventSelectionModel: function() {
        return this.getSchedulingView().getEventSelectionModel();
    },
    refreshResourceColumns: function() {
        var a = this.resourceColumnWidth || this.timeAxisViewModel.resourceColumnWidth;
        this.normalGrid.reconfigure(null, this.createResourceColumns(a));
    },
    onScheduleResize: function() {
        var a = this.normalGrid.down("gridcolumn").getWidth();
        this.timeAxisViewModel.setViewColumnWidth(a, true);
        this.getSchedulingView().refresh();
    },
    refreshCalendarColumns: function() {
        var b = this.createCalendarRows();
        var a = this.createCalendarColumns();
        this.reconfigure(b, this.calendarColumns.concat(a));
    },
    setOrientation: function() {
        this.setMode.apply(this, arguments);
    },
    setMode: function(d, a) {
        if (!this.normalGrid) {
            this.on("afterrender", function() {
                this.setMode(d, true);
            });
            return;
        }
        if (d === this.mode && !a) {
            return;
        }
        switch (d) {
          case "horizontal":
            this.addCls("sch2-horizontal");
            this.removeCls([ "sch2-vertical", "sch2-calendar", "sch2-vertical-resource" ]);
            break;

          case "vertical":
            this.addCls([ "sch2-vertical-resource", "sch2-vertical" ]);
            this.removeCls([ "sch2-calendar", "sch2-horizontal" ]);
            break;

          case "calendar":
            this.addCls([ "sch2-calendar", "sch2-vertical" ]);
            this.removeCls([ "sch2-vertical-resource", "sch2-horizontal" ]);
            break;
        }
        this.mode = d;
        var h = this, e = function() {
            return false;
        }, g = h.normalGrid, i = h.lockedGrid.getView(), f = h.getSchedulingView(), c = g.headerCt;
        i.on("beforerefresh", e);
        f.on("beforerefresh", e);
        f.blockRefresh = i.blockRefresh = true;
        f.setMode(d);
        Ext.suspendLayouts();
        c.removeAll(true);
        Ext.resumeLayouts();
        if (d !== "calendar") {
            h.timeAxis.setMode("plain");
            h.mun(h.timeAxis, h.calendarListeners);
            if (h._oldViewPreset) {
                h.setViewPreset.apply(h, h._oldViewPreset);
                delete h._oldViewPreset;
            }
        } else {
            h._oldViewPreset = [ h.viewPreset, h.timeAxis.getStart(), h.timeAxis.getEnd() ];
            h.timeAxis.setMode("calendar");
            h.setViewPreset(h.calendarViewPreset);
            h.mon(h.timeAxis, h.calendarListeners);
        }
        if (d === "horizontal") {
            h.mun(h.resourceStore, h.verticalListeners);
            h.normalGrid.un(h.normalGridListeners);
            f.setRowHeight(h.rowHeight || h.timeAxisViewModel.rowHeightHorizontal, true);
            h.reconfigure(h.resourceStore, h.horizontalColumns);
            if (this.horizontalLockedWidth !== null) {
                this.lockedGrid.setWidth(this.horizontalLockedWidth);
            }
        } else {
            if (d === "calendar") {
                h.mun(h.resourceStore, h.verticalListeners);
                h.normalGrid.on(h.normalGridListeners);
                h.refreshCalendarColumns();
                f.setRowHeight(h.rowHeight || h.timeAxisViewModel.rowHeightVertical, true);
                f.setColumnWidth(h.timeAxisViewModel.calendarColumnWidth || 100, true);
            } else {
                h.normalGrid.un(h.normalGridListeners);
                var b = 0;
                this.horizontalLockedWidth = this.lockedGrid.getWidth();
                h.mon(h.resourceStore, h.verticalListeners);
                h.reconfigure(h.timeAxis, h.verticalColumns.concat(h.createResourceColumns(h.resourceColumnWidth || h.timeAxisViewModel.resourceColumnWidth)));
                Ext.Array.each(h.lockedGrid.query("gridcolumn"), function(j) {
                    b += j.rendered ? j.getWidth() : j.width || 100;
                });
                f.setColumnWidth(h.timeAxisViewModel.resourceColumnWidth || 100, true);
                h.lockedGrid.setWidth(b);
            }
        }
        i.un("beforerefresh", e);
        f.un("beforerefresh", e);
        f.blockRefresh = i.blockRefresh = false;
        h.getView().refresh();
        this.fireEvent("modechange", this, d);
        this.fireEvent("orientationchange", this, d);
    },
    createCalendarRows: function() {
        var a = this;
        var b = a.timeAxis.getRowTicks();
        a.timeAxisViewModel.calendarRowsAmount = b.length;
        return new Ext.data.Store({
            model: "Ext.ux.Scheduler2.model.TimeAxisTick",
            data: b
        });
    },
    createCalendarColumns: function() {
        var b = this;
        var c = b.timeAxis.headerConfig.middle;
        var a = [];
        b.timeAxis.forEachAuxInterval(c.splitUnit, null, function(g, d, e) {
            g.setHours(this.startTime);
            d = new Date(g);
            d.setHours(this.endTime);
            var f = {
                xtype: "weekview-day",
                renderer: b.mainRenderer,
                scope: b,
                start: g,
                end: d
            };
            if (c.renderer) {
                f.text = c.renderer.call(c.scope || b, g, d, f, e, b.getEventStore());
            } else {
                f.text = Ext.Date.format(g, c.dateFormat);
            }
            a.push(f);
        });
        return a;
    },
    setRowHeight: function(a, b) {
        b = b || !this.lockedGrid;
        this.timeAxisViewModel.setViewRowHeight(a, b);
    },
    onNormalViewItemUpdate: function(a, b, d) {
        if (this.lockedGridDependsOnSchedule) {
            var c = this.lockedGrid.getView();
            c.suspendEvents();
            c.refreshNode(c.indexOf(a));
            if (this.syncRowHeight) {
                this.syncRowHeights();
            }
            c.resumeEvents();
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.NodeCache", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.view.NodeCache",
    minVersion: "5.1.0",
    overrides: {
        scroll: function(d, c, b) {
            var a;
            if (d.length === 0) {
                a = [];
            } else {
                a = this.callParent(arguments);
            }
            return a;
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.BufferedRenderer", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.grid.plugin.BufferedRenderer",
    overrides: {
        onRangeFetched: function() {
            this.tableTopBorderWidth = this.tableTopBorderWidth || 0;
            return this.callParent(arguments);
        },
        refreshSize: function(d, b) {
            var c = this, a = c.view;
            if (a && a.body.dom) {
                this.callParent(arguments);
            }
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.RowSynchronizer", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.grid.locking.RowSynchronizer",
    minVersion: "5.1.0",
    overrides: Ext.versions.extjs.isGreaterThan("5.1.0") ? {
        finish: function(a) {
            if (!a) {
                return;
            }
            return this.callParent(arguments);
        }
    } : {}
});

Ext.define("Ext.ux.Scheduler2.patches.Chrome", {
    extend: Ext.ux.Scheduler2.util.Patch,
    minVersion: "5.1.0",
    applyFn: function() {
        if (Ext.isChrome && Ext.browser.version.isGreaterThanOrEqual("43")) {
            Ext.util.CSS.createStyleSheet(".sch2-timelinepanel ." + Ext.baseCSSPrefix + "form-text { display: inherit; }");
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.Explorer", {
    extend: Ext.ux.Scheduler2.util.Patch,
    minVersion: "6.0.0",
    applyFn: function() {
        if (Ext.isIE9m) {
            Ext.util.CSS.createStyleSheet("." + Ext.baseCSSPrefix + "column-header-trigger { z-index: 10; }");
        }
    }
});

Ext.define("Ext.ux.Scheduler2.mixin.TimelinePanel", {
    extend: Ext.ux.Scheduler2.mixin.AbstractTimelinePanel,
    mixins: [ Ext.ux.Scheduler2.mixin.Zoomable, Ext.ux.Scheduler2.mixin.PartnerTimelinePanel ],
    destroyStores: false,
    bufferCoef: 5,
    bufferThreshold: .2,
    infiniteScroll: false,
    showCrudManagerMask: true,
    waitingForAutoTimeSpan: false,
    columnLinesFeature: null,
    renderWaitListener: null,
    schedulePinchThreshold: 30,
    pinchStartDistanceX: null,
    pinchStartDistanceY: null,
    pinchDistanceX: null,
    pinchDistanceY: null,
    horizontalColumns: null,
    verticalColumns: null,
    calendarColumns: null,
    forceDefineTimeSpanByStore: false,
    split: true,
    viewRefreshRequested: null,
    tipCfg: {
        cls: "sch2-tip",
        showDelay: 400,
        hideDelay: 0,
        autoHide: true,
        anchor: "b"
    },
    inheritables: function() {
        return {
            columnLines: true,
            enableLocking: true,
            lockable: true,
            stateEvents: [ "viewchange" ],
            syncRowHeight: false,
            cellTopBorderWidth: 0,
            initComponent: function() {
                if (this.partnerTimelinePanel) {
                    if (typeof this.partnerTimelinePanel === "string") {
                        this.partnerTimelinePanel = Ext.getCmp(this.partnerTimelinePanel);
                    }
                    this.timeAxisViewModel = this.partnerTimelinePanel.timeAxisViewModel;
                    this.timeAxis = this.partnerTimelinePanel.getTimeAxis();
                    this.startDate = this.timeAxis.getStart();
                    this.endDate = this.timeAxis.getEnd();
                }
                this._initializeTimelinePanel();
                this.configureChildGrids();
                this.forceFit = false;
                this.configureColumns();
                var c = this.normalViewConfig = this.normalViewConfig || {};
                var d = this.getId();
                Ext.apply(this.normalViewConfig, {
                    id: d + "-timelineview",
                    eventPrefix: this.autoGenId ? null : d,
                    timeAxisViewModel: this.timeAxisViewModel,
                    eventBorderWidth: this.eventBorderWidth,
                    timeAxis: this.timeAxis,
                    readOnly: this.readOnly,
                    mode: this.mode,
                    rtl: this.rtl,
                    cellBorderWidth: this.cellBorderWidth,
                    cellTopBorderWidth: this.cellTopBorderWidth,
                    cellBottomBorderWidth: this.cellBottomBorderWidth,
                    infiniteScroll: this.infiniteScroll,
                    bufferCoef: this.bufferCoef,
                    bufferThreshold: this.bufferThreshold
                });
                Ext.Array.each([ "eventRendererScope", "eventRenderer", "dndValidatorFn", "resizeValidatorFn", "createValidatorFn", "tooltipTpl", "validatorFnScope", "eventResizeHandles", "enableEventDragDrop", "enableDragCreation", "resizeConfig", "createConfig", "tipCfg", "getDateConstraints" ], function(e) {
                    if (e in this) {
                        c[e] = this[e];
                    }
                }, this);
                this.callParent(arguments);
                if (this.rtl) {
                    this.lockedGrid.view.addCls("sch2-locked-column-fixer");
                    this.addCls("sch2-rtl");
                } else {
                    this.addCls("sch2-ltr");
                }
                this.patchNavigationModel(this);
                this.setViewPreset(this.viewPreset, this.startDate || this.timeAxis.getStart(), this.endDate || this.timeAxis.getEnd(), true);
                if (!this.startDate) {
                    var a = this.getTimeSpanDefiningStore();
                    if (a.isTreeStore ? a.getRoot().childNodes.length : a.getCount()) {
                        this.applyStartEndDatesFromStore();
                    } else {
                        if (a.isLoading() || this.forceDefineTimeSpanByStore) {
                            this.bindAutoTimeSpanListeners();
                        }
                    }
                }
                var b = this.columnLines;
                if (b) {
                    this.columnLinesFeature = new Ext.ux.Scheduler2.feature.ColumnLines(Ext.isObject(b) ? b : undefined);
                    this.columnLinesFeature.init(this);
                    this.columnLines = true;
                }
                this.relayEvents(this.getSchedulingView(), [ "beforetooltipshow", "scheduleclick", "scheduledblclick", "schedulecontextmenu", "schedulepinch", "schedulepinchstart", "schedulepinchend" ]);
                this.on("zoomchange", function() {
                    this.normalGrid.scrollTask.cancel();
                });
                if (this.crudManager) {
                    if (!this.crudManager.autoSync && this.showCrudManagerMask) {
                        this.mon(this.crudManager, {
                            beforesend: this.beforeCrudOperationStart,
                            synccanceled: this.onCrudOperationComplete,
                            loadcanceled: this.onCrudOperationComplete,
                            load: this.onCrudOperationComplete,
                            sync: this.onCrudOperationComplete,
                            requestfail: this.onCrudOperationComplete,
                            scope: this
                        });
                        if (this.crudManager.isLoading()) {
                            this.beforeCrudOperationStart(this.crudManager, null, "load");
                        }
                    }
                    this.mon(this.crudManager, {
                        beforeloadapply: this.onCrudBeforeLoad,
                        load: this.onCrudLoad,
                        scope: this
                    });
                }
                this.afterInitComponent();
            },
            getState: function() {
                var a = this, b = a.callParent(arguments);
                Ext.apply(b, {
                    viewPreset: a.viewPreset,
                    startDate: a.getStart(),
                    endDate: a.getEnd(),
                    zoomMinLevel: a.zoomMinLevel,
                    zoomMaxLevel: a.zoomMaxLevel,
                    currentZoomLevel: a.currentZoomLevel
                });
                return b;
            },
            applyState: function(b) {
                var a = this;
                a.callParent(arguments);
                if (b && b.viewPreset) {
                    a.setViewPreset(b.viewPreset, b.startDate, b.endDate);
                }
                if (b && b.currentZoomLevel) {
                    a.zoomToLevel(b.currentZoomLevel);
                }
            },
            setTimeSpan: function() {
                this.callParent(arguments);
                if (this.waitingForAutoTimeSpan) {
                    this.unbindAutoTimeSpanListeners(false);
                    this.getView().refresh();
                }
                if (!this.normalGrid.getView().viewReady) {
                    this.getView().refresh();
                }
            },
            onBoxReady: function() {
                var a = this;
                a.callParent(arguments);
                if (a.partnerTimelinePanel) {
                    if (a.partnerTimelinePanel.rendered) {
                        a.setupPartnerTimelinePanel(a.partnerTimelinePanel);
                    } else {
                        a.partnerTimelinePanel.on("boxready", a.setupPartnerTimelinePanel, a);
                    }
                }
                a.normalGrid.on({
                    collapse: a.onNormalGridCollapse,
                    expand: a.onNormalGridExpand,
                    scope: a
                });
                a.lockedGrid.on({
                    itemdblclick: a.onLockedGridItemDblClick,
                    scope: a
                });
                if (Ext.supports.Touch) {
                    this.getSchedulingView().on({
                        schedulepinchstart: this.onSchedulePinchStart,
                        schedulepinch: this.onSchedulePinch,
                        schedulepinchend: this.onSchedulePinchEnd,
                        scope: this
                    });
                }
            }
        };
    },
    bindAutoTimeSpanListeners: function() {
        var a = this.getTimeSpanDefiningStore();
        this.waitingForAutoTimeSpan = true;
        this.suspendViewsRefresh();
        this.mon(a, "load", this.applyStartEndDatesFromStore, this);
        if (a.isTreeStore) {
            this.mon(a, "rootchange", this.applyStartEndDatesFromStore, this);
            this.mon(a, "nodeappend", this.applyStartEndDatesAfterTreeAppend, this);
        } else {
            this.mon(a, "add", this.applyStartEndDatesFromStore, this);
        }
    },
    refreshStopper: function(a) {
        this.viewRefreshRequested = this.viewRefreshRequested || {};
        this.viewRefreshRequested[a.isLockedView ? "locked" : "normal"] = true;
        return false;
    },
    suspendViewsRefresh: function() {
        var a = this.normalGrid.view;
        var b = this.lockedGrid.view;
        a.on("beforerefresh", this.refreshStopper, this);
        b.on("beforerefresh", this.refreshStopper, this);
        a.blockRefresh = true;
        b.blockRefresh = true;
    },
    resumeViewsRefresh: function(b) {
        b = b !== false;
        var c = this.normalGrid.view;
        var d = this.lockedGrid.view;
        c.un("beforerefresh", this.refreshStopper, this);
        d.un("beforerefresh", this.refreshStopper, this);
        c.blockRefresh = false;
        d.blockRefresh = false;
        var a = this.viewRefreshRequested || {};
        a.locked = a.locked || d.refreshNeeded;
        a.normal = a.normal || c.refreshNeeded;
        if (b) {
            if (a.locked && a.normal) {
                Ext.suspendLayouts();
                this.getView().relayFn("refreshView");
                Ext.resumeLayouts(true);
            } else {
                if (a.locked) {
                    d.refreshView();
                } else {
                    if (a.normal) {
                        c.refreshView();
                    }
                }
            }
        }
        this.viewRefreshRequested = null;
    },
    getTimeSpanDefiningStore: function() {
        throw "Abstract method called";
    },
    unbindAutoTimeSpanListeners: function(b) {
        this.waitingForAutoTimeSpan = false;
        var a = this.getTimeSpanDefiningStore();
        this.resumeViewsRefresh(b);
        a.un("load", this.applyStartEndDatesFromStore, this);
        if (a.isTreeStore) {
            a.un("rootchange", this.applyStartEndDatesFromStore, this);
            a.un("nodeappend", this.applyStartEndDatesAfterTreeAppend, this);
        } else {
            a.un("add", this.applyStartEndDatesFromStore, this);
        }
    },
    applyStartEndDatesAfterTreeAppend: function() {
        var a = this.getTimeSpanDefiningStore();
        if (!a.isSettingRoot && !a.__loading) {
            this.applyStartEndDatesFromStore();
        }
    },
    applyStartEndDatesFromStore: function() {
        var a = this.getTimeSpanDefiningStore();
        var b = a.getTotalTimeSpan();
        if (b.end && b.start && b.end - b.start === 0) {
            b.start = Ext.ux.Scheduler2.util.Date.add(b.start, this.timeAxis.mainUnit, -1);
            b.end = Ext.ux.Scheduler2.util.Date.add(b.end, this.timeAxis.mainUnit, 1);
        }
        this.setTimeSpan(b.start || new Date(), b.end);
    },
    onLockedGridItemDblClick: function(b, a, c, e, d) {
        if (this.mode === "vertical" && a) {
            this.fireEvent("timeheaderdblclick", this, a.get("start"), a.get("end"), e, d);
        }
    },
    getSchedulingView: function() {
        return this.normalGrid && this.normalGrid.view;
    },
    getHorizontalTimeAxisColumn: function() {
        return this.getSchedulingView().getHorizontalTimeAxisColumn();
    },
    configureColumns: function() {
        var a = this.columns || [];
        if (a.items) {
            a = a.items;
        } else {
            a = this.columns = a.slice();
        }
        var c = [];
        var b = [];
        Ext.Array.each(a, function(d) {
            if (d.position === "right") {
                if (!Ext.isNumber(d.width)) {
                    Ext.Error.raise('"Right" columns must have a fixed width');
                }
                d.locked = false;
                b.push(d);
            } else {
                d.locked = true;
                c.push(d);
            }
            d.lockable = false;
        });
        if (a.length === 0) {
            this.split = false;
        }
        Ext.Array.erase(a, 0, a.length);
        Ext.Array.insert(a, 0, c.concat({
            xtype: "timeaxiscolumn",
            timeAxisViewModel: this.timeAxisViewModel,
            trackHeaderOver: this.trackHeaderOver,
            renderer: this.mainRenderer,
            variableRowHeight: this.variableRowHeight,
            scope: this
        }).concat(b));
        this.horizontalColumns = Ext.Array.clone(a);
        this.verticalColumns = [ Ext.apply({
            xtype: "verticaltimeaxis",
            width: 100,
            timeAxis: this.timeAxis,
            timeAxisViewModel: this.timeAxisViewModel,
            cellTopBorderWidth: this.cellTopBorderWidth,
            cellBottomBorderWidth: this.cellBottomBorderWidth
        }, this.timeAxisColumnCfg || {}) ];
        this.calendarColumns = [ Ext.apply({
            xtype: "verticaltimeaxis",
            width: 60,
            timeAxis: this.timeAxis,
            timeAxisViewModel: this.timeAxisViewModel,
            cellTopBorderWidth: this.cellTopBorderWidth,
            cellBottomBorderWidth: this.cellBottomBorderWidth
        }, this.calendarTimeAxisCfg || {}) ];
        if (this.mode === "vertical") {
            this.columns = this.verticalColumns.concat(this.createResourceColumns(this.resourceColumnWidth || this.timeAxisViewModel.resourceColumnWidth));
            this.store = this.timeAxis;
        } else {
            if (this.mode === "calendar") {
                this.columns = [];
                this.store = null;
                this.on("afterrender", this.refreshCalendarColumns, this);
            }
        }
    },
    mainRenderer: function(b, l, g, j, k) {
        var c = this.renderers, d = this.mode === "horizontal" || this.mode === "calendar" ? g : this.getResourceStore().getAt(k), a = "&nbsp;";
        l.rowHeight = null;
        for (var e = 0; e < c.length; e++) {
            a += c[e].fn.call(c[e].scope || this, b, l, d, j, k) || "";
        }
        if (this.variableRowHeight) {
            var h = this.getSchedulingView();
            var f = this.getRowHeight();
            l.style = "height:" + ((l.rowHeight || f) - h.cellTopBorderWidth - h.cellBottomBorderWidth) + "px";
        }
        return a;
    },
    onNormalGridCollapse: function() {
        var a = this;
        if (!a.normalGrid.reExpander) {
            a.normalGrid.reExpander = a.normalGrid.placeholder;
        }
        if (!a.lockedGrid.rendered) {
            a.lockedGrid.on("render", a.onNormalGridCollapse, a, {
                delay: 1
            });
        } else {
            a.lockedGrid.flex = 1;
            a.lockedGrid.updateLayout();
            if (a.lockedGrid.collapsed) {
                a.lockedGrid.expand();
            }
            a.addCls("sch2-normalgrid-collapsed");
        }
    },
    onNormalGridExpand: function() {
        this.removeCls("sch2-normalgrid-collapsed");
        delete this.lockedGrid.flex;
        this.lockedGrid.updateLayout();
    },
    beforeCrudOperationStart: function(a, c, b) {
        if (this.rendered) {
            this.setLoading({
                msg: b === "load" ? this.L("loadingText") : this.L("savingText")
            });
        } else {
            Ext.destroy(this.renderWaitListener);
            this.renderWaitListener = this.on("render", Ext.Function.bind(this.beforeCrudOperationStart, this, Array.prototype.slice.apply(arguments)), this, {
                delay: 1,
                destroyable: true
            });
        }
    },
    onCrudBeforeLoad: function() {
        this.suspendViewsRefresh();
    },
    onCrudLoad: function() {
        this.resumeViewsRefresh();
    },
    onCrudOperationComplete: function() {
        Ext.destroy(this.renderWaitListener);
        this.setLoading(false);
    },
    onSchedulePinchStart: function(a, b) {
        this.pinchStartDistanceX = Math.abs(b.touches[0].pageX - b.touches[1].pageX);
        this.pinchStartDistanceY = Math.abs(b.touches[0].pageY - b.touches[1].pageY);
    },
    onSchedulePinch: function(a, b) {
        this.pinchDistanceX = Math.abs(b.touches[0].pageX - b.touches[1].pageX);
        this.pinchDistanceY = Math.abs(b.touches[0].pageY - b.touches[1].pageY);
    },
    onSchedulePinchEnd: function(a, g) {
        var f = this.pinchDistanceX;
        var d = this.pinchDistanceY;
        var h = this.getMode()[0] === "h";
        if (Math.abs(f - this.pinchStartDistanceX) > this.schedulePinchThreshold) {
            var c = Math.abs(f / this.pinchStartDistanceX);
            if (h) {
                c > 1 ? this.zoomIn() : this.zoomOut();
            } else {
                this.timeAxisViewModel.setViewColumnWidth(c * this.timeAxisViewModel.resourceColumnWidth);
            }
        }
        if (Math.abs(d - this.pinchStartDistanceY) > this.schedulePinchThreshold) {
            var b = Math.abs(d / this.pinchStartDistanceY);
            a.setRowHeight(a.getRowHeight() * b);
        }
        this.pinchStartDistanceX = this.pinchStartDistanceY = this.pinchDistanceX = this.pinchDistanceY = null;
    },
    patchNavigationModel: function(c) {
        c.getView().getNavigationModel().focusItem = function(d) {
            d.addCls(this.focusCls);
            if (Ext.isIE && !d.hasCls("sch2-timetd") || !Ext.isIE && c.getOrientation() === "horizontal") {
                d.focus();
            }
        };
        var b = c.lockedGrid.getView();
        var a = c.normalGrid.getView();
        b.on("rowclick", function(e, d, f, g) {
            if (a.lastFocused) {
                a.lastFocused.rowIdx = g;
                a.lastFocused.record = d;
            } else {
                if (Ext.isIE) {
                    a.lastFocused = this.lastFocused;
                }
            }
        });
        a.on("rowclick", function(e, d, f, g) {
            if (b.lastFocused) {
                b.lastFocused.rowIdx = g;
                b.lastFocused.record = d;
            } else {
                if (Ext.isIE) {
                    b.lastFocused = this.lastFocused;
                }
            }
        });
    },
    configureChildGrids: function() {
        var a = this;
        a.lockedGridConfig = Ext.apply({}, a.lockedGridConfig || {});
        a.normalGridConfig = Ext.apply({}, a.schedulerConfig || a.normalGridConfig || {});
        var c = a.lockedGridConfig, b = a.normalGridConfig;
        if (a.lockedXType) {
            c.xtype = a.lockedXType;
        }
        if (a.normalXType) {
            b.xtype = a.normalXType;
        }
        Ext.applyIf(c, {
            useArrows: true,
            animCollapse: false,
            collapseDirection: "left",
            trackMouseOver: false
        });
        Ext.applyIf(b, {
            viewType: a.viewType,
            enableColumnMove: false,
            enableColumnResize: false,
            enableColumnHide: false,
            trackMouseOver: false,
            collapseDirection: "right",
            collapseMode: "placeholder",
            animCollapse: false
        });
        if (a.mode === "vertical") {
            c.store = b.store = a.timeAxis;
        }
        if (c.width) {
            a.syncLockedWidth = Ext.emptyFn;
            c.scroll = Ext.supports.Touch ? "both" : "horizontal";
            c.scrollerOwner = true;
        }
    },
    afterInitComponent: function() {
        var d = this;
        var c = d.lockedGrid.getView();
        var b = d.normalGrid.getView();
        var a = Ext.data.TreeStore && d.store instanceof Ext.data.TreeStore;
        if (d.normalGrid.collapsed) {
            d.normalGrid.collapsed = false;
            b.on("boxready", function() {
                d.normalGrid.collapse();
            }, d, {
                delay: 10
            });
        }
        if (d.lockedGrid.collapsed) {
            d.lockedGrid.collapsed = false;
            c.on("boxready", function() {
                d.lockedGrid.collapse();
            }, d, {
                delay: 10
            });
            if (c.bufferedRenderer) {
                c.bufferedRenderer.disabled = true;
            }
        }
        if (Ext.getScrollbarSize().width === 0) {
            c.addCls("sch2-ganttpanel-force-locked-scroll");
        }
        if (a) {
            this.setupLockableFilterableTree();
        }
        this.on("afterrender", function() {
            var f = this.lockedGrid.headerCt.showMenuBy;
            this.lockedGrid.headerCt.showMenuBy = function() {
                f.apply(this, arguments);
                d.showMenuBy.apply(this, arguments);
            };
        });
        var e = this.child("splitter");
        if (e) {
            e.addCls("sch2-timelinepanel-splitter");
        }
    },
    setupLockableFilterableTree: function() {
        var c = this;
        var b = c.lockedGrid.getView();
        var a = Ext.ux.Scheduler2.mixin.FilterableTreeView.prototype;
        b.initTreeFiltering = a.initTreeFiltering;
        b.onFilterChangeStart = a.onFilterChangeStart;
        b.onFilterChangeEnd = a.onFilterChangeEnd;
        b.onFilterCleared = a.onFilterCleared;
        b.onFilterSet = a.onFilterSet;
        b.initTreeFiltering();
    },
    showMenuBy: function(b, f) {
        var e = this.getMenu(), c = e.down("#unlockItem"), d = e.down("#lockItem"), a = c.prev();
        a.hide();
        c.hide();
        d.hide();
    },
    zoomToFit: function(a) {
        a = Ext.apply({
            adjustStart: 1,
            adjustEnd: 1
        }, a);
        var b = this.getEventStore();
        var c = this.getEventStore().getTotalTimeSpan();
        if (this.zoomToSpan(c, a) === null) {
            this.getSchedulingView().fitColumns();
        }
    }
}, function() {
    var a = "6.0.0";
    Ext.apply(Ext.ux.Scheduler2, {
        VERSION: "4.1.0"
    });
    if (Ext.versions.extjs.isLessThan(a)) {
        var b = console;
        b && b.log("The Ext JS version you are using needs to be updated to at least " + a);
    }
});

Ext.define("Ext.ux.Scheduler2.panel.TimelineGridPanel", {
    extend: Ext.grid.Panel,
    mixins: [ Ext.ux.Scheduler2.mixin.Localizable, Ext.ux.Scheduler2.mixin.TimelinePanel ],
    alias: [ "widget.timelinegrid" ],
    subGridXType: "gridpanel",
    isTimelineGridPanel: true,
    initComponent: function() {
        this.callParent(arguments);
        this.getSchedulingView()._initializeTimelineView();
    }
}, function() {
    this.override(Ext.ux.Scheduler2.mixin.TimelinePanel.prototype.inheritables() || {});
});

Ext.define("Ext.ux.Scheduler2.patches.NodeCollapse", {
    onClassMixedIn: function(a) {
        if (Ext.versions.extjs.isLessThan("6.0.1")) {
            a.override(this.prototype.overridables);
        }
    },
    overridables: {
        initComponent: function() {
            this.callParent(arguments);
            var a = this.lockedGrid.getView();
            this.mon(this.resourceStore, {
                nodecollapse: function() {
                    a._doNotStoreScrollPosition = true;
                }
            });
            a.syncRowHeightBegin = Ext.Function.createInterceptor(a.syncRowHeightBegin, function() {
                if (!a._doNotStoreScrollPosition) {
                    var b = {
                        x: a.getScrollX(),
                        y: a.getScrollY()
                    };
                    this.lockedGrid.on("afterlayout", function() {
                        a.scrollTo(b.x, b.y);
                        delete a._doNotStoreScrollPosition;
                    }, this, {
                        single: true
                    });
                }
            }, this);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.panel.SchedulerGrid", {
    extend: Ext.ux.Scheduler2.panel.TimelineGridPanel,
    mixins: [ Ext.ux.Scheduler2.mixin.SchedulerPanel, Ext.ux.Scheduler2.patches.NodeCollapse ],
    alias: [ "widget.schedulergrid", "widget.schedulerpanel" ],
    alternateClassName: "Ext.ux.Scheduler2.SchedulerPanel",
    viewType: "schedulergridview",
    initComponent: function() {
        this.callParent(arguments);
        this.getSchedulingView()._initializeSchedulerView();
    }
}, function() {
    this.override(Ext.ux.Scheduler2.mixin.SchedulerPanel.prototype.inheritables() || {});
});

Ext.define("Ext.ux.Scheduler2.patches.TableView", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.view.Table",
    minVersion: "6.0.1",
    maxVersion: "6.0.1.9999",
    overrides: {
        suspendCellEditing: function(a) {
            var c = a, b = c.activeEditor;
            if (b && b.editing) {
                c.suspendedEditor = b;
                c.suspendEvents();
                b.suspendEvents();
                b.cancelEdit(true);
                b.resumeEvents();
                c.resumeEvents();
            }
        },
        resumeCellEditing: function(c, b) {
            var e = c, d = e.activeEditor = e.suspendedEditor, a;
            if (d) {
                e.suspendEvents();
                d.suspendEvents();
                a = e.activateCell(b, true, true);
                d.resumeEvents();
                e.resumeEvents();
            }
            return a;
        },
        suspendActionableMode: function() {
            var e = this, b = e.grid.actionables, a = b.length, d;
            for (d = 0; d < a; d++) {
                var c = b[d];
                if (Ext.grid.plugin.CellEditing && c instanceof Ext.grid.plugin.CellEditing) {
                    e.suspendCellEditing(c);
                }
            }
        },
        resumeActionableMode: function(c) {
            var g = this, d = g.grid.actionables, b = d.length, f, a;
            g.toggleChildrenTabbability(false);
            for (f = 0; f < b; f++) {
                var e = d[f];
                if (!a && Ext.grid.plugin.CellEditing && e instanceof Ext.grid.plugin.CellEditing) {
                    a = g.resumeCellEditing(e, c);
                }
            }
            if (!a) {
                g.activateCell(c);
            }
        },
        saveFocusState: function() {
            var f = this, g = f.dataSource, a = f.actionableMode, c = f.getNavigationModel(), d = a ? f.actionPosition : c.getPosition(true), b = Ext.Element.getActiveElement(true), i = d && d.view === f && d.getCell(), e, h;
            if (i && i.contains(b)) {
                d = d.clone();
                b.suspendFocusEvents();
                if (a) {
                    f.suspendActionableMode();
                } else {
                    c.setPosition();
                }
                b.resumeFocusEvents();
                return function() {
                    if (g.getCount()) {
                        e = Math.min(d.rowIdx, f.all.getCount() - 1);
                        h = Math.min(d.colIdx, f.getVisibleColumnManager().getColumns().length - 1);
                        d = new Ext.grid.CellContext(f).setPosition(g.contains(d.record) ? d.record : e, h);
                        if (a) {
                            f.resumeActionableMode(d);
                        } else {
                            c.setPosition(d, null, null, null, true);
                        }
                    } else {
                        d.column.focus();
                    }
                };
            }
            return Ext.emptyFn;
        },
        activateCell: function() {
            return true;
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.ColumnResizeTree", {
    override: "Ext.ux.Scheduler2.panel.TimelineTreePanel",
    afterRender: function() {
        this.callParent(arguments);
        var a = this.lockedGrid.headerCt.findPlugin("gridheaderresizer");
        if (a) {
            a.getConstrainRegion = function() {
                var d = this, b = d.dragHd.el, c;
                if (d.headerCt.forceFit) {
                    c = d.dragHd.nextNode("gridcolumn:not([hidden]):not([isGroupHeader])");
                    if (!d.headerInSameGrid(c)) {
                        c = null;
                    }
                }
                return d.adjustConstrainRegion(Ext.util.Region.getRegion(b), 0, d.headerCt.forceFit ? c ? c.getWidth() - d.minColWidth : 0 : d.maxColWidth - b.getWidth(), 0, d.minColWidth);
            };
        }
    }
});

Ext.define("Ext.ux.Scheduler2.patches.TreeNavigationModel", {
    extend: Ext.ux.Scheduler2.util.Patch,
    target: "Ext.tree.NavigationModel",
    overrides: {
        onAsterisk: function() {
            if (!this.view.ownerCt.expandAll) {
                this.view.lockingPartner.ownerCt.expandAll();
                return;
            }
            this.callParent(arguments);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.panel.TimelineTreePanel", {
    extend: Ext.tree.Panel,
    mixins: [ Ext.ux.Scheduler2.mixin.Localizable, Ext.ux.Scheduler2.mixin.TimelinePanel ],
    alias: [ "widget.timelinetree" ],
    useArrows: true,
    rootVisible: false,
    lockedXType: "treepanel",
    isTimelineTreePanel: true,
    initComponent: function() {
        this.callParent(arguments);
        this.getSchedulingView()._initializeTimelineView();
    }
}, function() {
    this.override(Ext.ux.Scheduler2.mixin.TimelinePanel.prototype.inheritables() || {});
});

Ext.define("Ext.ux.Scheduler2.panel.SchedulerTree", {
    extend: Ext.ux.Scheduler2.panel.TimelineTreePanel,
    mixins: [ Ext.ux.Scheduler2.mixin.SchedulerPanel, Ext.ux.Scheduler2.patches.NodeCollapse ],
    alias: [ "widget.schedulertree" ],
    viewType: "schedulergridview",
    setOrientation: function() {
        return this.setMode.apply(this, arguments);
    },
    setMode: function(a) {
        if (a !== "horizontal") {
            Ext.Error.raise("Ext.ux.Scheduler2.panel.SchedulerTree only support horizontal mode");
        }
    },
    initComponent: function() {
        this.callParent(arguments);
        this.getSchedulingView()._initializeSchedulerView();
    }
}, function() {
    this.override(Ext.ux.Scheduler2.mixin.SchedulerPanel.prototype.inheritables() || {});
});

if (!Ext.ClassManager.get("Ext.ux.Scheduler2.patches.Element")) {
    Ext.define("Ext.ux.Scheduler2.patches.Element", {
        extend: Ext.ux.Scheduler2.util.Patch,
        applyFn: function() {
            Ext.override(Ext.dom.Element, {
                pxRe: /^-?\d+(?:\.\d*)?px$/i,
                getLocalX: function() {
                    var c = this, b, a = c.getStyle("left");
                    if (!a || a === "auto") {
                        a = 0;
                    } else {
                        if (this.pxRe.test(a)) {
                            a = parseFloat(a);
                        } else {
                            a = c.getX();
                            b = c.dom.offsetParent;
                            if (b) {
                                a -= Ext.fly(b).getX();
                            }
                        }
                    }
                    return a;
                }
            });
        }
    });
}

Ext.define("Ext.ux.Scheduler2.plugin.CellPlugin", {
    extend: Ext.AbstractPlugin,
    alias: "plugin.scheduler_cellplugin",
    mixins: {
        observable: Ext.util.Observable
    },
    frameCls: "sch2-cellplugin-highlighter",
    frameTemplate: new Ext.Template([ '<div class="{cls} active" style="width: {width}px; height: {height}px;">', '<div class="sch2-cellplugin-border sch2-cellplugin-border-horizontal sch2-cellplugin-border-top"></div>', '<div class="sch2-cellplugin-border sch2-cellplugin-border-horizontal sch2-cellplugin-border-bottom"></div>', '<div class="sch2-cellplugin-border sch2-cellplugin-border-vertical sch2-cellplugin-border-left"></div>', '<div class="sch2-cellplugin-border sch2-cellplugin-border-vertical sch2-cellplugin-border-right"></div>', "</div>" ]),
    editor: "Ext.ux.Scheduler2.field.CellEditor",
    singleClickEditing: true,
    dblClickTimeout: 100,
    editing: false,
    context: {},
    selContext: [],
    constructor: function(a) {
        Ext.apply(this, a || {}, {
            context: {},
            editing: false,
            tickIndex: null,
            resource: null,
            startDate: null,
            eventIndexInCell: -1,
            eventRecord: null
        });
        this.mixins.observable.constructor.call(this);
        this.callParent(arguments);
    },
    init: function(a) {
        var b = this;
        b.view = a.getSchedulingView();
        b.lockedView = a.lockedGrid.getView();
        a.getNavigationModel().disable();
        b.timeAxisViewModel = a.timeAxisViewModel;
        b.tickCount = a.getTimeAxis().getCount();
        b.rowsCount = a.getResourceStore().getCount();
        b.keyNav = new Ext.util.KeyNav({
            target: a.lockedGrid.view,
            eventName: "itemkeydown",
            processEvent: function(d, c, g, e, f) {
                return f;
            },
            ignoreInputFields: true,
            up: b.onKeyUp,
            down: b.onKeyDown,
            right: b.onKeyRight,
            left: b.onKeyLeft,
            tab: b.onKeyTab,
            enter: b.onKeyEnter,
            esc: b.onKeyEsc,
            scope: b
        });
        if (b.view.bufferedRenderer) {
            b.view.on("afterrender", function() {
                b.view.getScrollable().on("scroll", b.onViewScroll, b);
            }, b, {
                single: true
            });
            b.mon(b.view, "itemadd", b.onItemAdd, b);
        }
        b.handleSingleClickTask = new Ext.util.DelayedTask(b.handleCellClick, b);
        b.mon(a, {
            headerclick: b.onContainerClick,
            zoomchange: b.destroyHighlighter,
            scope: b
        });
        b.mon(b.view, {
            containerclick: b.onContainerClick,
            scheduleclick: b.onCellClick,
            scheduledblclick: b.onCellDblClick,
            eventclick: b.onEventClick,
            eventdblclick: b.onEventDblClick,
            containerkeydown: b.onEditorKeyDown,
            groupcollapse: b.onGroupCollapse,
            groupexpand: b.onGroupExpand,
            scope: b
        });
        b.mon(b.timeAxisViewModel, {
            update: b.onViewModelUpdate,
            scope: b
        });
        b.mon(a.getTimeAxis(), {
            beforereconfigure: b.onBeforeReconfigure,
            scope: b
        });
        b.bindResourceStore(a.getResourceStore());
        b.bindEventStore(a.getEventStore());
        b.mon(b.lockedView, {
            cellclick: b.onLockedCellClick,
            beforeitemkeydown: b.onBeforeItemKeyDown,
            scope: b
        });
        a.on("eventstorechange", function(c, d, e) {
            b.bindEventStore(e, true);
            b.bindEventStore(d);
        });
        a.on("resourcestorechange", function(c, d, e) {
            b.bindResourceStore(e, true);
            b.bindResourceStore(d);
        });
    },
    onEditorKeyDown: function(a, b) {
        switch (b.getKey()) {
          case b.TAB:
            b.preventDefault();
            if (b.shiftKey) {
                this.moveLeft(b);
            } else {
                this.moveRight(b);
            }
            break;

          case b.ENTER:
            this.onEditorKeyEnter();
            break;

          case b.ESC:
            this.cancelEdit(b);
            break;

          default:
            break;
        }
    },
    onEditorKeyEnter: function() {
        if (this.completeEdit()) {
            this.beginEditBelow();
        } else {
            this.showEditorInCell(this.getEventOrCell(this.context, true));
        }
    },
    destroy: function() {
        this.keyNav.destroy();
        this.editor && this.editor.destroy && this.editor.destroy();
        this.callParent(arguments);
    },
    destroyHighlighter: function() {
        var a = this;
        a.clearSelection();
        a.containerEl && a.containerEl.destroy();
        delete a.containerEl;
        delete a.startDate;
        delete a.resource;
        delete a.resourceIndex;
        delete a.eventRecord;
        delete a.tickIndex;
    },
    onGroupCollapse: function() {
        var a = this;
        a.rowsCount = a.view.getNodes().length;
        if (a.getResourceIndex() === -1) {
            a.destroyHighlighter();
        } else {
            a.refreshCell();
        }
    },
    onGroupExpand: function() {
        var a = this;
        a.rowsCount = a.view.getNodes().length;
        a.refreshCell();
    },
    onViewScroll: function() {
        var b = this;
        if (b.containerEl) {
            var a = b.view.getNodeByRecord(b.resource);
            if (a) {
                b.containerEl.setY(Ext.fly(a).getY() - 1);
            }
        }
    },
    onItemAdd: function() {
        var b = this;
        if (!b.resource) {
            return;
        }
        var a = b.view.getNodeByRecord(b.resource);
        if (a) {
            b.containerEl.show();
        } else {
            b.containerEl.hide();
        }
    },
    getResourceIndex: function(b) {
        var a = this;
        b = b || a.resource;
        return a.view.dataSource.data.indexOf(b);
    },
    getResource: function(a) {
        return this.view.dataSource.getAt(a);
    },
    onResourceLoad: function(b, a, c) {
        if (c) {
            this.rowsCount = a.length;
        }
    },
    onResourceAdd: function(b, a) {
        this.rowsCount += a.length;
        this.refreshCell();
    },
    onResourceRemove: function(b, a) {
        var c = this;
        c.rowsCount = b.getCount();
        if (c.rowsCount === 0) {
            c.destroyHighlighter();
        }
        if (Ext.Array.indexOf(a, c.resource) !== -1) {
            c.destroyHighlighter();
        }
        c.refreshCell();
    },
    onBeforeReconfigure: function(a) {
        if (!this.startDate && Ext.isNumber(this.tickIndex)) {
            this.startDate = a.getAt(this.tickIndex).getStartDate();
        }
    },
    onLockedCellClick: function(c, h, b, a, d, g, f) {
        this.showEditorInCell({
            tickIndex: this.tickIndex || 0,
            resourceIndex: g,
            eventIndexInCell: 0
        }, f);
    },
    onBeforeItemKeyDown: function(d, a, c, b, f) {
        if (!f.isSpecialKey()) {
            this.beginEdit();
        }
    },
    onViewModelUpdate: function(d) {
        var b = this, c = d.timeAxis;
        b.tickCount = c.getCount();
        if (b.startDate) {
            var a = c.getTickFromDate(b.startDate);
            if (a >= 0) {
                delete b.startDate;
                b.tickIndex = a;
                if (!b.containerEl) {
                    b.renderElement();
                }
                b.refreshCell();
            } else {
                b.containerEl.destroy();
                delete b.containerEl;
                b.clearSelection();
            }
        } else {
            b.refreshCell();
        }
    },
    refreshCell: function() {
        var b = this;
        var a = b.timeAxisViewModel.getTickWidth();
        if (b.containerEl) {
            b.containerEl.setWidth(a);
            b.containerEl.setLeft(a);
            b.showEditorInCell({
                tickIndex: b.tickIndex,
                resourceIndex: b.getResourceIndex()
            });
        }
        if (b.editor instanceof Ext.form.field.Base) {
            b.editor.setMaxWidth(a);
        }
    },
    clearSelection: function() {
        var a = this;
        a.view.getSecondaryCanvasEl().select("." + a.frameCls + ".clone").remove();
        a.selContext = [];
    },
    addSelection: function() {
        var a = this;
        var b = a.frameTemplate.apply({
            cls: a.frameCls,
            width: a.containerEl.getWidth(),
            height: a.containerEl.getHeight()
        });
        b = Ext.get(Ext.DomHelper.append(a.containerEl.parent(), b));
        b.setStyle("top", a.containerEl.getStyle("top"));
        b.setStyle("left", a.containerEl.getStyle("left"));
        b.removeCls("active");
        b.addCls("clone");
        a.selContext.push(Ext.apply({}, a.context));
    },
    applyVisibilityMode: function(a) {
        a.setVisibilityMode(Ext.dom.Element.OFFSETS);
    },
    renderElement: function() {
        var e = this;
        var d = e.timeAxisViewModel.getTickWidth();
        var a = e.timeAxisViewModel.getViewRowHeight();
        var c = e.frameTemplate.apply({
            cls: e.frameCls,
            width: d,
            height: a
        });
        e.containerEl = Ext.get(Ext.DomHelper.append(e.view.getSecondaryCanvasEl(), c));
        e.applyVisibilityMode(e.containerEl);
        var b = {
            height: a,
            maxHeight: a,
            width: d,
            maxWidth: d,
            listeners: {
                render: function(f) {
                    e.applyVisibilityMode(f.el);
                }
            },
            renderTo: e.containerEl
        };
        if (Ext.isObject(e.editor) && !(e.editor instanceof Ext.Base)) {
            e.editor = Ext.create(Ext.apply(b, e.editor, {
                xclass: "Ext.ux.Scheduler2.field.CellEditor"
            }));
        } else {
            if (Ext.isString(e.editor)) {
                e.editor = Ext.create(e.editor, b);
            } else {
                e.containerEl.appendChild(e.editor.el);
                e.applyVisibilityMode(e.editor.el);
            }
        }
        e.editor.inputEl.setHeight(a - 3);
    },
    onContainerClick: function() {
        var a = this;
        if (a.lockedView.getSelectionModel().getSelection().length > 0) {
            if (a.editor.isVisible && a.editor.isVisible()) {
                a.lockedView.getFocusEl().focus();
            }
        }
    },
    onCellClick: function() {
        this.handleSingleClickTask.delay(this.dblClickTimeout, null, null, arguments);
    },
    handleCellClick: function(a, c, h, f, g) {
        var d = this;
        var b = Math.floor(d.view.timeAxis.getTickFromDate(c));
        if (d.fireEvent("cellclick", d, b, h) !== false) {
            d.showEditorInCell({
                tickIndex: b,
                resourceIndex: h
            }, g);
            if (d.singleClickEditing) {
                d.beginEdit();
            }
        }
    },
    onCellDblClick: function(a, b, f, c, d) {
        this.handleSingleClickTask.cancel();
        this.handleCellDblClick(a, b, f, c, d);
    },
    handleCellDblClick: function(a, c, h, f, g) {
        var d = this;
        var b = Math.floor(d.view.timeAxis.getTickFromDate(c));
        if (d.fireEvent("celldblclick", d, b, h) !== false) {
            d.showEditorInCell({
                tickIndex: b,
                resourceIndex: h
            }, g);
            d.beginEdit();
        }
    },
    onEventClick: function(b, a, g) {
        var f = this;
        var d = f.view.getDateFromDomEvent(g);
        var c = Math.floor(f.view.timeAxis.getTickFromDate(d));
        var h = f.view.dataSource.data.indexOf(a.getResource());
        f.showEditorInCell({
            tickIndex: c,
            resourceIndex: h,
            eventRecord: a
        }, g);
    },
    onEventDblClick: function(b, a, g) {
        var f = this;
        var d = f.view.getDateFromDomEvent(g);
        var c = Math.floor(f.view.timeAxis.getTickFromDate(d));
        var h = f.view.dataSource.data.indexOf(a.getResource());
        f.showEditorInCell({
            tickIndex: c,
            resourceIndex: h,
            eventRecord: a
        }, g);
        f.beginEdit();
    },
    showEditorInCell: function(d, h) {
        var i = this;
        var b = "tickIndex" in d ? d.tickIndex : i.tickIndex;
        var j = "resourceIndex" in d ? d.resourceIndex : i.resourceIndex;
        if (b === -1 || j === -1) {
            return;
        }
        var f = i.view.timeAxis.getAt(b);
        var a = f.getStartDate();
        var g = f.getEndDate();
        var c = i.view.dataSource.getAt(j);
        if (h && h.type === "click" && !d.eventRecord) {
            d.eventRecord = i.getCellEvents({
                startDate: a,
                endDate: g,
                resource: c
            }).getAt(0);
        }
        if (i.fireEvent("beforeselect", i, c, a, g, d.eventRecord) === false) {
            return;
        }
        i.onBeforeSelect(h);
        if (!i.containerEl) {
            i.renderElement();
        } else {
            if (h && h.ctrlKey) {
                i.addSelection();
            } else {
                i.clearSelection();
            }
        }
        Ext.apply(i.context, {
            startDate: a,
            endDate: g,
            resource: c
        });
        if (d.eventRecord) {
            i.context.eventRecord = d.eventRecord;
        } else {
            delete i.context.eventRecord;
        }
        i.tickIndex = b;
        i.resource = c;
        i.resourceIndex = j;
        i.eventIndexInCell = d.eventIndexInCell;
        if (d.eventRecord) {
            i.alignEditorWithRecord(d.eventRecord, d.resource);
        } else {
            i.alignEditorWithCell();
        }
        i.onAfterSelect(h);
        i.fireEvent("select", i, c, a, g);
        i.fireEvent("selectionchange", i, i.getSelection());
    },
    alignEditorWithRecord: function(a, e) {
        var d = this;
        var b = d.view.getElementsFromEventRecord(a, e), c = b[0].getBox();
        c.y--;
        c.x--;
        d.alignEditor(c);
    },
    alignEditorWithCell: function() {
        var b = this;
        var a = Ext.get(b.view.getRowByRecord(b.resource));
        a && b.alignEditor({
            left: b.timeAxisViewModel.getTickWidth() * b.tickIndex,
            y: a.getTop() - 1,
            height: a.getHeight(),
            width: b.timeAxisViewModel.getTickWidth()
        });
    },
    alignEditor: function(b) {
        var a = this;
        a.containerEl.setY(b.y);
        if ("x" in b) {
            a.containerEl.setX(b.x);
        } else {
            a.containerEl.setLeft(b.left);
        }
        a.containerEl.setWidth(b.width);
        a.containerEl.setHeight(b.height);
        if (Ext.isIE9m) {
            a.containerEl.setHeight(b.height + 1);
            a.containerEl.setStyle("padding-top", 1);
            a.containerEl.select(".sch2-cellplugin-border-top").setStyle("top", 1);
            a.containerEl.select(".sch2-cellplugin-border-vertical").setHeight(b.height);
            a.containerEl.select(".sch2-cellplugin-border-horizontal").setWidth(b.width);
        } else {
            if (Ext.isChrome) {
                a.containerEl.select(".sch2-cellplugin-border-vertical").setHeight(b.height);
            }
        }
        a.containerEl.show();
    },
    getSelection: function() {
        return this.selContext.concat(this.context);
    },
    getEventRecord: function(a) {
        return a.eventRecord;
    },
    getResourceRecord: function(a) {
        return a.resource;
    },
    onKeyUp: function(a) {
        this.moveUp(a);
    },
    onKeyDown: function(a) {
        this.moveDown(a);
    },
    onKeyLeft: function(a) {
        this.moveLeft(a);
    },
    onKeyRight: function(a) {
        this.moveRight(a);
    },
    onKeyTab: function(a) {
        if (a.shiftKey) {
            this.moveLeft(a);
        } else {
            this.moveRight(a);
        }
    },
    onKeyEnter: function() {
        this.beginEdit();
    },
    onKeyEsc: function() {
        this.destroyHighlighter();
    },
    findPreviousIndex: function() {
        var b = this;
        var a = b.view.walkRecs(b.resource, -1);
        if (a !== b.resource) {
            return b.getResourceIndex(a);
        } else {
            return -1;
        }
    },
    findNextIndex: function() {
        var b = this;
        var a = b.view.walkRecs(b.resource, 1);
        if (a !== b.resource) {
            return b.getResourceIndex(a);
        } else {
            return -1;
        }
    },
    getCellEvents: function(b) {
        var c = this;
        b = b || c.context;
        if (b.resourceIndex === -1 || b.tickIndex === -1) {
            return new Ext.util.MixedCollection();
        }
        var a = c.view.getEventStore().queryBy(function(d) {
            return d.getResourceId() === b.resource.getId() && d.getStartDate() >= b.startDate && d.getStartDate() < b.endDate;
        });
        a.sortBy(function(f, e) {
            var g = c.view.getElementsFromEventRecord(f, b.resource)[0], d = c.view.getElementsFromEventRecord(e, b.resource)[0];
            return g.getY() < d.getY() ? -1 : 1;
        });
        return a;
    },
    getAbove: function(c) {
        var d = this, a;
        c = c || d.context;
        if (c.eventRecord && d.eventIndexInCell == null) {
            d.eventIndexInCell = d.getCellEvents(c).indexOf(c.eventRecord);
        }
        if (d.eventIndexInCell > 0) {
            a = d.eventIndexInCell - 1;
            return {
                eventIndexInCell: a,
                eventRecord: d.getCellEvents(c).getAt(a)
            };
        }
        var b = d.findPreviousIndex();
        if (b === -1) {
            return {
                resourceIndex: -1
            };
        }
        return d.getEventOrCell(Ext.applyIf({
            resourceIndex: b
        }, c), true);
    },
    getBelow: function(d) {
        var e = this;
        d = d || e.context;
        if (d.eventRecord && e.eventIndexInCell == null) {
            e.eventIndexInCell = e.getCellEvents(d).indexOf(d.eventRecord);
        }
        if (e.eventIndexInCell >= 0) {
            var c = e.getCellEvents(d);
            var a = e.eventIndexInCell + 1;
            if (c.getCount() > a) {
                return {
                    eventIndexInCell: a,
                    eventRecord: c.getAt(a)
                };
            }
        }
        var b = e.findNextIndex();
        if (b === -1) {
            return {
                resourceIndex: -1
            };
        }
        return e.getEventOrCell(Ext.applyIf({
            resourceIndex: b
        }, d));
    },
    getEventOrCell: function(c, a) {
        var g = this, f = -1, h = null, b = g.tickIndex, e = g.resourceIndex;
        if ("tickIndex" in c) {
            b = c.tickIndex;
            var d = g.view.timeAxis.getAt(b);
            c.startDate = d.getStartDate();
            c.endDate = d.getEndDate();
        }
        if ("resourceIndex" in c) {
            e = c.resourceIndex;
            c.resource = g.view.dataSource.getAt(e);
        }
        var i = g.getCellEvents(c);
        if (i.getCount()) {
            if (a === true) {
                f = i.getCount() - 1;
                h = i.getAt(f);
            } else {
                f = 0;
                h = i.getAt(0);
            }
        }
        return {
            tickIndex: b,
            resourceIndex: e,
            eventIndexInCell: f,
            eventRecord: h
        };
    },
    getPrevious: function(a) {
        var b = this;
        a = a || b.context;
        if (b.tickIndex > 0) {
            return b.getEventOrCell(Ext.applyIf({
                tickIndex: b.tickIndex - 1
            }, a));
        } else {
            return b.getEventOrCell(Ext.applyIf({
                tickIndex: b.tickCount - 1,
                resourceIndex: b.findPreviousIndex()
            }, a));
        }
    },
    getNext: function(a) {
        var b = this;
        a = a || b.context;
        if (b.tickIndex < b.tickCount - 1) {
            return b.getEventOrCell(Ext.applyIf({
                tickIndex: ++b.tickIndex,
                resourceIndex: b.getResourceIndex()
            }, a));
        } else {
            return b.getEventOrCell(Ext.applyIf({
                tickIndex: 0,
                resourceIndex: b.findNextIndex()
            }, a));
        }
    },
    moveUp: function(b) {
        var a = this;
        if (!a.containerEl) {
            return;
        }
        a.showEditorInCell(a.getAbove(), b);
    },
    moveDown: function(b) {
        var a = this;
        if (!a.containerEl) {
            return;
        }
        a.showEditorInCell(a.getBelow(), b);
    },
    moveLeft: function(b) {
        var a = this;
        if (!a.containerEl) {
            return;
        }
        a.showEditorInCell(a.getPrevious(), b);
    },
    moveRight: function(b) {
        var a = this;
        if (!a.containerEl) {
            return;
        }
        a.showEditorInCell(a.getNext(), b);
    },
    expandResourceRow: function(d, c, a) {
        var b = this;
        d.setHeight(c.height + a);
        Ext.get(b.lockedView.getNodeByRecord(b.context.resource)).setHeight(c.height + a);
        b.__oldHeight = c.height;
    },
    getNewBottomEditorCoordinate: function(a) {
        var e = this;
        var f = Ext.get(e.view.getNodeByRecord(e.context.resource));
        var d = f.getBox();
        var b = e.getCellEvents().last();
        if (b) {
            var c = e.view.getElementsFromEventRecord(b, e.context.resource)[0].getBox();
            if (Math.abs(c.bottom - d.bottom) < a - 1) {
                e.expandResourceRow(f, d, a);
                return d.bottom;
            } else {
                return c.bottom;
            }
        }
    },
    collapseResourceRow: function() {
        var a = this;
        if (a.__oldHeight) {
            Ext.fly(a.view.getNodeByRecord(a.context.resource)).setHeight(a.__oldHeight);
            Ext.fly(a.lockedView.getNodeByRecord(a.context.resource)).setHeight(a.__oldHeight);
            delete a.__oldHeight;
        }
    },
    beginEditBelow: function() {
        var c = this;
        if (!c.containerEl) {
            return;
        }
        delete c.context.eventRecord;
        c.beginEdit();
        var a = c.timeAxisViewModel.getViewRowHeight();
        var b = c.getNewBottomEditorCoordinate(a);
        c.alignEditor({
            left: c.timeAxisViewModel.getTickWidth() * c.tickIndex,
            y: b,
            width: c.timeAxisViewModel.getTickWidth(),
            height: a
        });
    },
    beginEdit: function() {
        var d = this;
        if (!d.containerEl) {
            return;
        }
        if (d.fireEvent("beforecelledit", d, d.getSelection()) === false) {
            return;
        }
        d.editing = true;
        d.editor.startDate = d.context.startDate;
        d.editor.bottomUnit = Ext.ux.Scheduler2.util.Date.getSubUnit(d.timeAxisViewModel.getBottomHeader().unit);
        d.containerEl.select(".sch2-cellplugin-border").hide();
        d.containerEl.setStyle("z-index", 1);
        var c = d.getEventRecord(d.context), e = d.getResourceRecord(d.context);
        if (c) {
            var b = Ext.Date;
            var g = Ext.isArray(d.editor.dateFormat) ? d.editor.dateFormat[0] : d.editor.dateFormat;
            var a = b.format(c.getStartDate(), g);
            var f = b.format(c.getEndDate(), g);
            d.editor.record = c;
            d.editor.setValue([ a, f ].join(d.editor.divider));
            d.editor.recordNode = d.view.getElementsFromEventRecord(c, e)[0];
            Ext.fly(d.editor.recordNode).hide();
        }
        d.editor.show();
        d.editor.setWidth(d.editor.getMaxWidth());
        d.editor.focus();
        d.fireEvent("begincelledit", d, d.getSelection());
    },
    cancelEdit: function() {
        var b = this;
        var c = b.editor.getValue();
        var a = b.getSelection();
        if (b.fireEvent("beforecancelcelledit", b, c, a) === false) {
            return;
        }
        b.stopEditing();
        b.fireEvent("cancelcelledit", b, c, a);
    },
    completeEdit: function() {
        var g = this, c = false;
        if (!g.editing || !g.containerEl) {
            return;
        }
        var h = g.editor.getValue();
        var i = g.getSelection();
        if (g.fireEvent("beforecompletecelledit", g, h, i) === false) {
            return;
        }
        if (h && g.editor.isValid()) {
            var d = g.editor.record;
            var a = g.editor.getDates(h);
            var b = a[0];
            var e = a[1];
            if (d) {
                d.setStartEndDate(b, e);
                delete g.editor.record;
            } else {
                var f = Ext.create(g.view.getEventStore().getModel(), {
                    StartDate: b,
                    EndDate: e,
                    ResourceId: g.context.resource.getId()
                });
                g.view.onEventCreated(f);
                g.view.getEventStore().add(f);
            }
            c = true;
        }
        g.stopEditing();
        g.fireEvent("completecelledit", g, h, i);
        return c;
    },
    stopEditing: function() {
        var b = this;
        if (b.editor.recordNode) {
            Ext.fly(b.editor.recordNode).show();
            delete b.editor.recordNode;
        }
        b.collapseResourceRow();
        b.editor.setValue("");
        b.editing = false;
        b.clearSelection();
        b.containerEl.select(".sch2-cellplugin-border").show();
        b.containerEl.setStyle("z-index", "auto");
        b.editor.hide();
        var a = b.lockedView.getRow(b.resource);
        a && Ext.fly(a).down(b.lockedView.getCellSelector()).focus();
    },
    onBeforeSelect: function(b) {
        var a = this;
        b && b.isNavKeyPress && b.isNavKeyPress() && a.clearSelection();
        a.restoreEditing = a.editing;
        a.editing && a.completeEdit();
    },
    onAfterSelect: function(b) {
        var a = this;
        a.lockedView.getSelectionModel().select(a.resource);
        Ext.fly(a.lockedView.getRow(a.resource)).down(a.lockedView.getCellSelector()).focus();
        a.editor.setValue("");
        if (a.restoreEditing && (b === true || b && b.isNavKeyPress())) {
            a.beginEdit();
        }
        a.restoreEditing = false;
        a.containerEl.scrollIntoView(a.view.getEl());
    },
    bindResourceStore: function(b, a) {
        if (b) {
            var c = this;
            c[a ? "mun" : "mon"](b, {
                load: c.onResourceLoad,
                add: c.onResourceAdd,
                remove: c.onResourceRemove,
                clear: c.destroyHighlighter,
                scope: c
            });
        }
    },
    bindEventStore: function(b, a) {
        if (b) {
            var c = this;
            c[a ? "mun" : "mon"](b, {
                load: c.destroyHighlighter,
                scope: c
            });
        }
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.CurrentTimeLine", {
    extend: Ext.ux.Scheduler2.plugin.Lines,
    alias: "plugin.scheduler_currenttimeline",
    mixins: [ Ext.ux.Scheduler2.mixin.Localizable ],
    updateInterval: 6e4,
    showHeaderElements: true,
    autoUpdate: true,
    expandToFitView: true,
    timer: null,
    init: function(c) {
        if (Ext.getVersion("touch")) {
            this.showHeaderElements = false;
        }
        var b = new Ext.data.JsonStore({
            fields: [ "Date", "Cls", "Text" ],
            data: [ {
                Date: new Date(),
                Cls: "sch2-todayLine",
                Text: this.L("tooltipText")
            } ]
        });
        var a = b.first();
        if (this.autoUpdate) {
            this.timer = setInterval(function() {
                a.set("Date", new Date());
            }, this.updateInterval);
        }
        this.store = b;
        this.callParent(arguments);
    },
    destroy: function() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (this.store.autoDestroy) {
            this.store.destroy();
        }
        this.callParent(arguments);
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.DragSelector", {
    extend: Ext.ux.Scheduler2.util.DragTracker,
    alias: "plugin.scheduler_dragselector",
    mixins: [ Ext.AbstractPlugin ],
    lockableScope: "top",
    schedulerView: null,
    eventData: null,
    sm: null,
    proxy: null,
    bodyRegion: null,
    constructor: function(a) {
        a = a || {};
        Ext.applyIf(a, {
            onBeforeStart: this.onBeforeStart,
            onStart: this.onStart,
            onDrag: this.onDrag,
            onEnd: this.onEnd
        });
        this.callParent(arguments);
    },
    init: function(b) {
        var a = this.schedulerView = b.getSchedulingView();
        a.on({
            afterrender: this.onSchedulingViewRender,
            scope: this
        });
    },
    onBeforeStart: function(a) {
        return !a.getTarget(".sch2-event") && a.ctrlKey;
    },
    onStart: function(c) {
        var f = this.schedulerView;
        this.proxy.show();
        this.bodyRegion = f.getScheduleRegion();
        var b = f.getScrollY();
        var d = f.getScrollX();
        var a = [];
        f.getEventNodes().each(function(e) {
            var g = e.getRegion();
            g.top += b;
            g.bottom += b;
            g.left += d;
            g.right += d;
            a[a.length] = {
                region: g,
                node: e.dom
            };
        });
        this.eventData = a;
        this.sm.deselectAll();
        Ext.ux.Scheduler2.util.ScrollManager.activate(f);
        this.mon(f.getScrollable(), "scroll", this.updateSelection, this);
    },
    onDrag: function() {
        var a = this.getRegion().constrainTo(this.bodyRegion);
        this.proxy.setBox(a);
        this.updateSelection();
    },
    updateSelection: function() {
        var a = this.sm, h = this.eventData, g = this.getRegion().constrainTo(this.bodyRegion), b, f, d, e;
        var j = this.schedulerView.getScrollY();
        var c = this.schedulerView.getScrollX();
        for (b = 0, d = h.length; b < d; b++) {
            f = h[b];
            g.top += j;
            g.bottom += j;
            g.left += c;
            g.right += c;
            e = g.intersect(f.region);
            if (e && !f.selected) {
                f.selected = true;
                a.selectNode(f.node, true);
            } else {
                if (!e && f.selected) {
                    f.selected = false;
                    a.deselectNode(f.node);
                }
            }
        }
    },
    onEnd: function(a) {
        if (this.proxy) {
            this.proxy.setDisplayed(false);
        }
        this.mun(this.schedulerView.getScrollable(), "scroll", this.updateSelection, this);
        Ext.ux.Scheduler2.util.ScrollManager.deactivate();
    },
    onSchedulingViewRender: function(a) {
        this.sm = a.getEventSelectionModel();
        this.initEl(this.schedulerView.el);
        this.proxy = a.el.createChild({
            cls: "sch2-drag-selector"
        });
    },
    destroy: function() {
        if (this.proxy) {
            Ext.destroy(this.proxy);
        }
        this.callParent(arguments);
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.EventEditor", {
    extend: Ext.form.Panel,
    mixins: [ Ext.AbstractPlugin, Ext.ux.Scheduler2.mixin.Localizable ],
    alias: [ "widget.eventeditor", "plugin.scheduler_eventeditor" ],
    lockableScope: "normal",
    hideOnBlur: true,
    saveAndCloseOnEnter: true,
    startDateField: null,
    startTimeField: null,
    durationField: null,
    timeConfig: null,
    dateConfig: null,
    durationConfig: null,
    durationUnit: null,
    durationText: null,
    triggerEvent: "eventdblclick",
    fieldsPanelConfig: null,
    dateFormat: "Y-m-d",
    timeFormat: "H:i",
    cls: "sch2-eventeditor",
    border: false,
    shadow: false,
    dynamicForm: true,
    eventRecord: null,
    hidden: true,
    collapsed: true,
    currentForm: null,
    schedulerView: null,
    resourceRecord: null,
    preventHeader: true,
    floating: true,
    hideMode: "offsets",
    ignoreCls: "sch2-event-editor-ignore-click",
    readOnly: false,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    dragProxyEl: null,
    constrain: false,
    constructor: function(a) {
        a = a || {};
        Ext.apply(this, a);
        this.durationUnit = this.durationUnit || Ext.ux.Scheduler2.util.Date.HOUR;
        this.callParent(arguments);
    },
    init: function(a) {
        this.ownerCt = a;
        this.schedulerView = a.getView();
        this.schedulerView.on({
            afterrender: this.onSchedulerRender,
            dragcreateend: this.onDragCreateEnd,
            scope: this
        });
        this.schedulerView.on("eventrepaint", this.onEventRepaint, this);
        if (this.triggerEvent) {
            this.schedulerView.on(this.triggerEvent, this.onActivateEditor, this);
        }
        this.schedulerView.registerEventEditor(this);
    },
    initComponent: function() {
        if (!this.fieldsPanelConfig) {
            throw "Must define a fieldsPanelConfig property";
        }
        Ext.apply(this, {
            fbar: this.buttons || this.buildButtons(),
            items: [ {
                xtype: "container",
                layout: "hbox",
                cls: "sch2-eventeditor-timefields",
                items: this.buildDurationFields()
            }, Ext.applyIf(this.fieldsPanelConfig, {
                flex: 1,
                activeItem: 0
            }) ]
        });
        this.callParent(arguments);
    },
    afterRender: function() {
        this.callParent(arguments);
        if (this.saveAndCloseOnEnter) {
            this.el.on({
                keyup: function(b, a) {
                    if (b.getKey() === b.ENTER && a.tagName.toLowerCase() === "input") {
                        this.saveAndClose();
                    }
                },
                scope: this
            });
        }
    },
    onSchedulerRender: function() {
        this.render(Ext.getBody());
        if (this.hideOnBlur) {
            this.mon(Ext.getDoc(), "mousedown", this.onMouseDown, this);
        }
    },
    show: function(g, i) {
        var h = this.schedulerView.isReadOnly();
        if (h !== this.readOnly) {
            Ext.Array.each(this.query("field"), function(j) {
                j.setReadOnly(h);
            });
            this.saveButton.setVisible(!h);
            this.deleteButton.setVisible(!h);
            this.readOnly = h;
        }
        if (this.deleteButton) {
            this.deleteButton.setVisible(!h && this.getEventStore().indexOf(g) >= 0);
        }
        this.eventRecord = g;
        this.durationField.setValue(Ext.ux.Scheduler2.util.Date.getDurationInUnit(g.getStartDate(), g.getEndDate(), this.durationUnit, true));
        var e = g.getStartDate();
        this.startDateField.setValue(e);
        this.startTimeField.setValue(e);
        var f = this.schedulerView.up("[floating=true]");
        if (f) {
            this.getEl().setZIndex(f.getEl().getZIndex() + 1);
            f.addCls(this.ignoreCls);
        }
        this.callParent();
        i = i || this.schedulerView.getElementsFromEventRecord(g)[0];
        this.alignTo(i, this.schedulerView.getMode() == "horizontal" ? "bl" : "tl-tr", this.getConstrainOffsets(i));
        this.expand(!this.constrain);
        if (this.constrain) {
            this.doConstrain(Ext.util.Region.getRegion(Ext.getBody()));
        }
        var c, d = g.get("EventType");
        if (d && this.dynamicForm) {
            var b = this.items.getAt(1), a = b.query("> component[EventType=" + d + "]");
            if (!a.length) {
                throw "Can't find form for EventType=" + d;
            }
            if (!b.getLayout().setActiveItem) {
                throw "Can't switch active component in the 'fieldsPanel'";
            }
            c = a[0];
            if (!(c instanceof Ext.form.Panel)) {
                throw "Each child component of 'fieldsPanel' should be a 'form'";
            }
            b.getLayout().setActiveItem(c);
        } else {
            c = this;
        }
        this.currentForm = c;
        c.getForm().loadRecord(g);
    },
    getEventStore: function() {
        return this.schedulerView.getEventStore();
    },
    getConstrainOffsets: function(a) {
        return [ 0, 0 ];
    },
    onSaveClick: function() {
        this.saveAndClose();
    },
    saveAndClose: function() {
        var i = this, g = i.eventRecord, a = i.currentForm.getForm();
        if (a.isValid() && i.fireEvent("beforeeventsave", i, g) !== false) {
            var c = i.startDateField.getValue(), h, b = i.startTimeField.getValue(), e = i.durationField.getValue();
            if (c && e >= 0) {
                if (b) {
                    Ext.ux.Scheduler2.util.Date.copyTimeValues(c, b);
                }
                h = Ext.ux.Scheduler2.util.Date.add(c, i.durationUnit, e);
            } else {
                return;
            }
            if (!i.schedulerView.allowOverlap) {
                var d = g.getResources(i.getEventStore());
                var f = false;
                d = d.length > 0 ? d : [ i.resourceRecord ];
                Ext.each(d, function(j) {
                    return f = !i.schedulerView.isDateRangeAvailable(c, h, g, j);
                });
                if (f) {
                    return;
                }
            }
            i.schedulerView.un("eventrepaint", i.onEventRepaint, i);
            i.onBeforeSave(g);
            g.beginEdit();
            a.updateRecord(g);
            g.setStartEndDate(c, h);
            g.endEdit();
            if (i.getEventStore().indexOf(g) < 0) {
                if (i.schedulerView.fireEvent("beforeeventadd", i.schedulerView, g, [ i.resourceRecord ]) !== false) {
                    if (i.getEventStore().isTreeStore) {
                        g.set("leaf", true);
                    }
                    i.getEventStore().append(g);
                    g.assign(i.resourceRecord);
                }
            }
            i.onAfterSave(g);
            i.collapse(null, true);
            i.schedulerView.on("eventrepaint", i.onEventRepaint, i);
        }
    },
    onBeforeSave: function(a) {},
    onAfterSave: function(a) {},
    onDeleteClick: function() {
        if (this.fireEvent("beforeeventdelete", this, this.eventRecord) !== false) {
            this.getEventStore().remove(this.eventRecord);
        }
        this.collapse(null, true);
    },
    onCancelClick: function() {
        this.collapse(null, true);
    },
    buildButtons: function() {
        this.saveButton = new Ext.Button({
            text: this.L("saveText"),
            scope: this,
            handler: this.onSaveClick
        });
        this.deleteButton = new Ext.Button({
            text: this.L("deleteText"),
            scope: this,
            handler: this.onDeleteClick
        });
        this.cancelButton = new Ext.Button({
            text: this.L("cancelText"),
            scope: this,
            handler: this.onCancelClick
        });
        return [ this.saveButton, this.deleteButton, this.cancelButton ];
    },
    buildDurationFields: function() {
        this.startDateField = new Ext.form.field.Date(Ext.apply({
            width: 140,
            allowBlank: false,
            format: this.dateFormat
        }, this.dateConfig || {}));
        this.startDateField.getPicker().addCls(this.ignoreCls);
        this.startTimeField = new Ext.form.field.Time(Ext.apply({
            width: 90,
            allowBlank: false,
            format: this.timeFormat
        }, this.timeConfig || {}));
        this.startTimeField.getPicker().addCls(this.ignoreCls);
        this.durationField = new Ext.form.field.Number(Ext.apply({
            cls: "sch2-event-editor-durationfield",
            width: 60,
            value: 0,
            minValue: 0,
            allowNegative: false
        }, this.durationConfig || {}));
        this.durationLabel = new Ext.form.Label({
            width: 30,
            cls: "sch2-event-editor-durationlabel",
            text: this.getDurationText()
        });
        return [ this.startDateField, this.startTimeField, this.durationField, this.durationLabel ];
    },
    onActivateEditor: function(b, a) {
        this.show(a);
    },
    onMouseDown: function(a) {
        if (this.collapsed || a.within(this.getEl()) || a.getTarget("." + this.ignoreCls, 9) || a.getTarget(this.schedulerView.eventSelector)) {
            return;
        }
        this.collapse();
    },
    onDragCreateEnd: function(c, b, d, f, a) {
        this.dragProxyEl = a;
        this.resourceRecord = d;
        this.schedulerView.onEventCreated(b);
        this.show(b, this.dragProxyEl);
    },
    hide: function() {
        this.callParent(arguments);
        var a = this.dragProxyEl;
        if (a) {
            a.hide();
        }
    },
    afterCollapse: function() {
        this.hide();
        this.callParent(arguments);
    },
    getDurationText: function() {
        if (this.durationText) {
            return this.durationText;
        }
        return Ext.ux.Scheduler2.util.Date.getShortNameOfUnit(Ext.ux.Scheduler2.util.Date.getNameOfUnit(this.durationUnit));
    },
    onEventRepaint: function(b, a) {
        if (!this.getCollapsed() && a === this.eventRecord) {
            this.show(a);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.EventTools", {
    extend: Ext.Container,
    mixins: [ Ext.AbstractPlugin ],
    lockableScope: "top",
    alias: "plugin.scheduler_eventtools",
    hideDelay: 500,
    align: "right",
    defaults: {
        xtype: "tool",
        baseCls: "sch2-tool",
        overCls: "sch2-tool-over",
        width: 20,
        height: 20,
        visibleFn: Ext.emptyFn
    },
    hideTimer: null,
    lastPosition: null,
    cachedSize: null,
    offset: {
        x: 0,
        y: 1
    },
    layout: "hbox",
    autoRender: true,
    floating: true,
    hideMode: "offsets",
    hidden: true,
    record: null,
    getRecord: function() {
        return this.record;
    },
    init: function(a) {
        if (!this.items) {
            throw "Must define an items property for this plugin to function correctly";
        }
        this.addCls("sch2-event-tools");
        this.scheduler = a;
        a.on({
            eventresizestart: this.onOperationStart,
            eventresizeend: this.onOperationEnd,
            eventdragstart: this.onOperationStart,
            eventdrop: this.onOperationEnd,
            eventmouseenter: this.onEventMouseEnter,
            eventmouseleave: this.onContainerMouseLeave,
            scope: this
        });
    },
    onRender: function() {
        this.callParent(arguments);
        this.scheduler.mon(this.el, {
            mouseenter: this.onContainerMouseEnter,
            mouseleave: this.onContainerMouseLeave,
            scope: this
        });
    },
    onEventMouseEnter: function(g, a, f) {
        var c = false;
        var h;
        this.record = a;
        this.items.each(function(i) {
            h = i.visibleFn(a) !== false;
            i.setVisible(h);
            if (h) {
                c = true;
            }
        }, this);
        if (!c) {
            return;
        }
        if (!this.rendered) {
            this.doAutoRender();
        }
        var e = f.getTarget(g.eventSelector);
        var d = Ext.fly(e).getBox();
        var b = this.getSize();
        this.lastPosition = [ f.getXY()[0] - b.width / 2, d.y - b.height - this.offset.y ];
        this.onContainerMouseEnter();
    },
    onContainerMouseEnter: function() {
        window.clearTimeout(this.hideTimer);
        this.setPosition.apply(this, this.lastPosition);
        this.show();
    },
    onContainerMouseLeave: function() {
        window.clearTimeout(this.hideTimer);
        this.hideTimer = Ext.defer(this.hide, this.hideDelay, this);
    },
    onOperationStart: function() {
        this.scheduler.un("eventmouseenter", this.onEventMouseEnter, this);
        window.clearTimeout(this.hideTimer);
        this.hide();
    },
    onOperationEnd: function() {
        this.scheduler.on("eventmouseenter", this.onEventMouseEnter, this);
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.exporter.AbstractExporter", {
    extend: Ext.util.Observable,
    mixins: [ Ext.ux.Scheduler2.mixin.Localizable ],
    pageHeaderHeight: 41,
    pageFooterHeight: 0,
    bufferedHeightMargin: 25,
    paperWidth: 0,
    paperHeight: 0,
    printHeight: 0,
    lockedRowsHeight: 0,
    normalRowsHeight: 0,
    iterateTimeout: 10,
    tableSelector: undefined,
    currentPage: undefined,
    headerTplDataFn: null,
    footerTplDataFn: null,
    headerTplDataFnScope: null,
    footerTplDataFnScope: null,
    config: {
        exporterId: "abstractexporter",
        name: "",
        translateURLsToAbsolute: true,
        expandAllBeforeExport: false,
        headerTpl: '<div class="sch2-export-header" style="height:{height}px; width:{width}px"><h2>{pageNo}/{totalPages}</h2></div>',
        tpl: '<!DOCTYPE html><html class="' + Ext.baseCSSPrefix + 'border-box {htmlClasses}"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type" /><title>{title}</title>{styles}</head><body class="' + Ext.baseCSSPrefix + 'webkit sch2-export {bodyClasses}">{header}<div class="{componentClasses}" style="height:{bodyHeight}px; width:{totalWidth}px; position: relative !important">{HTML}</div>{footer}</body></html>',
        footerTpl: ""
    },
    callbacks: undefined,
    error: undefined,
    extractedPages: undefined,
    numberOfPages: 0,
    constructor: function(a) {
        var b = this;
        a = a || {};
        b.callParent(arguments);
        delete a.getUserHeaderTplData;
        delete a.getUserFooterTplData;
        b.initConfig(a);
        if (!a.tableSelector) {
            b.tableSelector = "." + Ext.baseCSSPrefix + "grid-item-container";
        }
        if (!a.name) {
            b.setName(b.L("name"));
        }
    },
    setHeaderTpl: function(a) {
        this.headerTpl = this.getTplInstance(a);
    },
    getHeaderTpl: function() {
        return this.headerTpl;
    },
    setTpl: function(a) {
        this.tpl = this.getTplInstance(a);
    },
    getTpl: function() {
        return this.tpl;
    },
    setFooterTpl: function(a) {
        this.footerTpl = this.getTplInstance(a);
    },
    getFooterTpl: function() {
        return this.footerTpl;
    },
    getTplInstance: function(a) {
        return a && !a.isTemplate ? new Ext.XTemplate(a, {
            disableFormats: true
        }) : a;
    },
    getBodyClasses: function() {
        var b = new RegExp(Ext.baseCSSPrefix + "ie\\d?|" + Ext.baseCSSPrefix + "gecko", "g"), a = Ext.getBody().dom.className.replace(b, "");
        if (Ext.isIE) {
            a += " sch2-ie-export";
        }
        return a;
    },
    getComponentClasses: function() {
        return this.getComponent().el.dom.className;
    },
    setComponent: function(a) {
        var b = this;
        b.component = a;
        b.view = a.getSchedulingView();
        b.normalGrid = a.normalGrid;
        b.lockedGrid = a.lockedGrid;
        b.normalView = a.normalGrid.view;
        b.lockedView = a.lockedGrid.view;
        b.lockedBodySelector = "#" + b.lockedView.getId();
        b.normalBodySelector = "#" + b.normalView.getId();
        b.lockedHeader = b.lockedGrid.headerCt;
        b.normalHeader = b.normalGrid.headerCt;
        b.headerHeight = b.normalHeader.getHeight();
        b.printHeight = Math.floor(b.paperHeight) - b.headerHeight - (b.exportConfig.showHeader ? b.pageHeaderHeight : 0) - (b.exportConfig.showFooter ? b.pageFooterHeight : 0);
        b.saveComponentState(a);
    },
    getComponent: function() {
        return this.component;
    },
    setPaperSize: function(a, b) {
        var c = this;
        if (b === "landscape") {
            c.paperWidth = a.height;
            c.paperHeight = a.width;
        } else {
            c.paperWidth = a.width;
            c.paperHeight = a.height;
        }
    },
    getPaperFormat: function() {
        return this.exportConfig.format;
    },
    isBuffered: function() {
        return !!this.getBufferedRenderer();
    },
    getBufferedRenderer: function() {
        return this.view.bufferedRenderer;
    },
    setComponentRange: function(d) {
        var f = this, c = f.getComponent(), b = f.view, a, e;
        if (d.range !== "complete") {
            switch (d.range) {
              case "date":
                a = new Date(d.dateFrom);
                e = new Date(d.dateTo);
                if (Ext.ux.Scheduler2.util.Date.getDurationInDays(a, e) < 1) {
                    e = Ext.ux.Scheduler2.util.Date.add(e, Ext.ux.Scheduler2.util.Date.DAY, 1);
                }
                a = Ext.ux.Scheduler2.util.Date.constrain(a, c.getStart(), c.getEnd());
                e = Ext.ux.Scheduler2.util.Date.constrain(e, c.getStart(), c.getEnd());
                break;

              case "current":
                var g = b.getVisibleDateRange();
                a = g.startDate;
                e = g.endDate || b.timeAxis.getEnd();
                if (d.cellSize) {
                    var h = d.cellSize;
                    f.timeColumnWidth = h[0];
                    if (f.timeColumnWidth) {
                        c.setTimeColumnWidth(f.timeColumnWidth);
                    }
                    if (h.length > 1) {
                        f.view.setRowHeight(h[1]);
                    }
                }
                break;
            }
            c.setTimeSpan(a, e);
        }
        f.ticks = c.timeAxis.getTicks();
    },
    getStylesheets: function() {
        var c = this.getTranslateURLsToAbsolute(), b = Ext.getDoc().select('link[rel="stylesheet"]'), a = "";
        b.each(function(d) {
            var e = d.dom.cloneNode(true);
            c && e.setAttribute("href", d.dom.href);
            a += e.outerHTML;
        });
        return a;
    },
    forEachTimeSpanPlugin: function(c, f, e) {
        if (Ext.ux.Scheduler2.feature && Ext.ux.Scheduler2.feature.AbstractTimeSpan) {
            var h = this;
            var b = (c.plugins || []).concat(c.normalGrid.plugins || []).concat(c.columnLinesFeature || []);
            for (var d = 0, a = b.length; d < a; d++) {
                var g = b[d];
                if (g instanceof Ext.ux.Scheduler2.feature.AbstractTimeSpan) {
                    f.call(e || h, g);
                }
            }
        }
    },
    prepareComponent: function(c, b) {
        var d = this, a = d.view;
        c = c || d.getComponent();
        d.suspendInfiniteScroll(c);
        d.forEachTimeSpanPlugin(c, function(e) {
            e._renderDelay = e.renderDelay;
            e.renderDelay = 0;
        });
        c.getSchedulingView().timeAxisViewModel.suppressFit = true;
        c.timeAxis.autoAdjust = false;
        c.normalGrid.expand();
        c.lockedGrid.expand();
        d.setComponentRange(b);
        b.beforeExport && b.beforeExport(c, d.ticks);
        d.prepareColumns(b.columns);
        if (d.expandAllBeforeExport && c.expandAll) {
            c.expandAll();
        }
        d.fitComponentIntoPage();
        d.view.timeAxisViewModel.setTickWidth(d.view.timeAxisViewModel.getTickWidth());
        d.view.timeAxisViewModel.setTickWidth(d.view.timeAxisViewModel.getTickWidth());
        if (d.isBuffered() && Ext.isIE8) {
            d.normalView.bufferedRenderer.variableRowHeight = false;
            d.lockedView.bufferedRenderer.variableRowHeight = false;
        }
    },
    prepareColumns: function(a) {
        var b = this;
        if (a) {
            b.lockedGrid.headerCt.items.each(function(c) {
                if (Ext.Array.contains(a, c)) {
                    c.show();
                } else {
                    c.hide();
                }
            });
        }
    },
    restoreComponent: function(a) {
        var b = this;
        a = a || b.getComponent();
        b.forEachTimeSpanPlugin(a, function(c) {
            c.renderDelay = c._renderDelay;
            delete c._renderDelay;
        });
        b.restoreComponentState(a);
        b.restoreInfiniteScroll(a);
        b.exportConfig.afterExport && b.exportConfig.afterExport(a);
    },
    saveComponentState: function(b) {
        b = b || this.getComponent();
        var d = this, a = b.getSchedulingView(), e = b.normalGrid, f = b.lockedGrid;
        var c = [];
        f.headerCt.items.each(function(g) {
            c.push({
                column: g,
                visible: !g.isHidden()
            });
        });
        d.restoreSettings = {
            width: b.getWidth(),
            height: b.getHeight(),
            rowHeight: a.timeAxisViewModel.getViewRowHeight(),
            columnWidth: a.timeAxisViewModel.getTickWidth(),
            startDate: b.getStart(),
            endDate: b.getEnd(),
            normalWidth: e.getWidth(),
            normalLeft: e.getEl().getStyle("left"),
            lockedWidth: f.getWidth(),
            lockedCollapse: f.collapsed,
            normalCollapse: e.collapsed,
            columns: c,
            autoAdjust: b.timeAxis.autoAdjust,
            suppressFit: a.timeAxisViewModel.suppressFit,
            startIndex: a.all ? a.all.startIndex : 0
        };
    },
    restoreComponentState: function(c) {
        var d = this;
        c = c || d.getComponent();
        var b = d.restoreSettings, a = c.getSchedulingView();
        c.timeAxis.autoAdjust = b.autoAdjust;
        c.normalGrid.show();
        c.setWidth(b.width);
        c.setHeight(b.height);
        c.setTimeSpan(b.startDate, b.endDate);
        c.setTimeColumnWidth(b.columnWidth, true);
        a.setRowHeight(b.rowHeight);
        c.lockedGrid.show();
        Ext.Array.each(b.columns, function(e) {
            e.column.setVisible(e.visible);
        });
        c.normalGrid.setWidth(b.normalWidth);
        c.normalGrid.getEl().setStyle("left", b.normalLeft);
        c.lockedGrid.setWidth(b.lockedWidth);
        a.timeAxisViewModel.suppressFit = b.suppressFit;
        a.timeAxisViewModel.setTickWidth(b.columnWidth);
        if (b.lockedCollapse) {
            c.lockedGrid.collapse();
        }
        if (b.normalCollapse) {
            c.normalGrid.collapse();
        }
        if (d.getBufferedRenderer()) {
            d.scrollTo(b.startIndex);
            if (Ext.isIE8) {
                d.normalView.bufferedRenderer.variableRowHeight = true;
                d.lockedView.bufferedRenderer.variableRowHeight = true;
            }
        }
    },
    extractPages: function(b, a, e, c) {
        var d = this;
        d.exportConfig = a;
        d.normalRows = [];
        d.lockedRows = [];
        d.extractedPages = [];
        d.numberOfPages = 0;
        d.lockedRowsHeight = 0;
        d.normalRowsHeight = 0;
        d.setPaperSize(a.pageSize, a.orientation);
        d.setComponent(b, a);
        d.prepareComponent(b, a);
        d.callbacks = {
            success: e || Ext.emptyFn,
            scope: c || d
        };
        setTimeout(function() {
            d.collectRows(d.onRowsCollected, d);
        }, 1);
    },
    onPagesExtracted: function(a) {
        var b = this;
        b.restoreComponent();
        b.submitPages(a);
    },
    submitPages: function(a) {
        var c = this, b = c.callbacks;
        b.success.call(b.scope, c.renderPages(a));
    },
    getCurrentPage: function() {
        return this.currentPage;
    },
    setCurrentPage: function(a) {
        this.currentPage = a;
    },
    getExpectedNumberOfPages: Ext.emptyFn,
    commitPage: function(a) {
        var b = this;
        b.numberOfPages++;
        var d = b.preparePageToCommit(a);
        b.fireEvent("beforecommitpage", b, d, b.numberOfPages, b.getExpectedNumberOfPages());
        var c = Ext.apply({
            html: d.dom.innerHTML,
            number: b.numberOfPages
        }, a);
        b.extractedPages.push(c);
        b.fireEvent("commitpage", b, c, b.numberOfPages, b.getExpectedNumberOfPages());
    },
    collectLockedRow: function(d, c) {
        var b = Ext.fly(d).getHeight();
        this.lockedRowsHeight += b;
        var a = {
            height: b,
            row: d.cloneNode(true),
            record: this.lockedView.getRecord(c)
        };
        this.lockedRows.push(a);
        return a;
    },
    collectNormalRow: function(d, c) {
        var b = Ext.fly(d).getHeight();
        this.normalRowsHeight += b;
        var a = {
            height: Ext.fly(d).getHeight(),
            row: d.cloneNode(true),
            record: this.normalView.getRecord(c)
        };
        this.normalRows.push(a);
        return a;
    },
    onRowsCollected: function() {
        throw "Ext.ux.Scheduler2.plugin.exporter.AbstractExporter: [onRowsCollected] Abstract method called.";
    },
    iterateAsync: function(c, b) {
        var d = this;
        b = b || d;
        var a = function() {
            var f = arguments;
            var e = setInterval(function() {
                clearInterval(e);
                c.apply(b, [].concat.apply([ a ], f));
            }, d.iterateTimeout);
        };
        a.apply(d, Ext.Array.slice(arguments, 2));
    },
    callAsync: function(c, b) {
        b = b || this;
        var a = setInterval(function() {
            clearInterval(a);
            c.apply(b, Ext.Array.slice(arguments, 2));
        }, this.iterateTimeout);
    },
    collectRows: function(c, a) {
        var b = this;
        if (b.isBuffered()) {
            setTimeout(function() {
                b.scrollTo(0, function() {
                    b.iterateAsync(b.collectRowsStep, b, 0, c, a);
                });
            }, 1);
        } else {
            setTimeout(function() {
                b.collectRowsStep(null, 0, c, a);
            }, 1);
        }
    },
    collectRowsStep: function(d, h, j, k) {
        var g = this, c = g.normalView.all.endIndex, e = g.component.store.getCount(), f = g.normalView.all.slice(h), a = g.lockedView.all.slice(h);
        for (var b = 0; b < a.length; b++) {
            g.collectLockedRow(a[b], h + b);
        }
        for (b = 0; b < f.length; b++) {
            g.collectNormalRow(f[b], h + b);
        }
        g.fireEvent("collectrows", g, h, c, e);
        if (g.isBuffered()) {
            if (c + 1 < e) {
                g.callAsync(function() {
                    g.scrollTo(c + 1, function() {
                        d(c + 1, j, k);
                    });
                });
            } else {
                g.callAsync(function() {
                    g.scrollTo(0, function() {
                        j.call(k || g, g.lockedRows, g.normalRows);
                    });
                });
            }
        } else {
            j.call(k || g, g.lockedRows, g.normalRows);
        }
    },
    renderPages: function(a) {
        var d = this;
        a = a || d.extractedPages;
        for (var c = 0, b = a.length; c < b; c++) {
            var e = a[c];
            e.html = d.applyPageTpl(e);
        }
        return a;
    },
    applyPageTpl: function(a) {
        var b = this;
        return b.getTpl().apply(b.getPageTplData(a));
    },
    applyHeaderTpl: function(b) {
        var c = this, e = c.getHeaderTpl();
        if (c.exportConfig.showHeader && e) {
            var a = c.headerTplDataFn;
            var d = a && a.call(c.headerTplDataFnScope || c, b);
            return e.apply(Ext.apply(c.getHeaderTplData(b), d));
        }
        return "";
    },
    applyFooterTpl: function(b) {
        var c = this, e = c.getFooterTpl();
        if (c.exportConfig.showFooter && e) {
            var a = c.footerTplDataFn;
            var d = a && a.call(c.footerTplDataFnScope || c, b);
            return e.apply(Ext.apply(c.getFooterTplData(b), d));
        }
        return "";
    },
    getHeaderTplData: function(a) {
        var b = this;
        return {
            width: b.paperWidth,
            height: b.pageHeaderHeight,
            totalPages: b.numberOfPages,
            pageNo: a.number
        };
    },
    getFooterTplData: function(a) {
        var b = this;
        return {
            width: b.paperWidth,
            height: b.pageFooterHeight,
            totalPages: b.numberOfPages,
            pageNo: a.number
        };
    },
    getPageTplData: function(a) {
        var b = this;
        return {
            bodyClasses: b.getBodyClasses(),
            bodyHeight: b.printHeight + b.headerHeight,
            componentClasses: b.getComponentClasses(),
            styles: b.getStylesheets(),
            showHeader: b.exportConfig.showHeader,
            showFooter: b.exportConfig.showFooter,
            header: b.applyHeaderTpl(a),
            HTML: a.html,
            footer: b.applyFooterTpl(a),
            totalWidth: b.paperWidth,
            title: a.number + " of " + b.numberOfPages
        };
    },
    fitComponentIntoPage: Ext.emptyFn,
    getLockedGridBody: function(a) {
        a = a || this.getCurrentPage();
        return a.down(this.lockedBodySelector + " " + this.tableSelector, true);
    },
    getNormalGridBody: function(a) {
        a = a || this.getCurrentPage();
        return a.down(this.normalBodySelector + " " + this.tableSelector, true);
    },
    emptyLockedGrid: function(a) {
        Ext.fly(this.getLockedGridBody(a)).select(this.lockedView.getItemSelector()).remove();
    },
    fillGrids: function(c, b, e, a) {
        var d = this;
        d.fillLockedGrid(c, e, a);
        d.fillNormalGrid(b, e, a);
    },
    fillLockedGrid: function(c, d, a) {
        var b = this;
        if (!a) {
            b.emptyLockedGrid();
        }
        b.appendRows(b.getLockedGridBody(), c || b.lockedRows, d);
    },
    fillNormalGrid: function(c, d, a) {
        var b = this;
        if (!a) {
            b.emptyNormalGrid();
        }
        b.appendRows(b.getNormalGridBody(), c || b.normalRows, d);
    },
    appendRows: function(d, c, e) {
        for (var b = 0, a = c.length; b < a; b++) {
            d.appendChild(e ? c[b].row.cloneNode(true) : c[b].row);
        }
    },
    emptyNormalGrid: function(a) {
        Ext.fly(this.getNormalGridBody(a)).select(this.normalView.getItemSelector()).remove();
    },
    getRowHeight: function() {
        return this.view.timeAxisViewModel.getViewRowHeight();
    },
    getTotalSize: function() {
        return {
            width: this.getTotalWidth(),
            height: this.getTotalHeight()
        };
    },
    getTotalHeight: function() {
        var b = this, a;
        if (b.isBuffered()) {
            a = b.bufferedHeightMargin + b.normalRowsHeight;
        } else {
            a = b.lockedView.getEl().down(b.tableSelector).getHeight();
        }
        return b.headerHeight + a;
    },
    getTotalWidth: function() {
        return this.getLockedGridWidth() + this.normalGrid.body.down(this.tableSelector).getWidth();
    },
    getLockedGridWidth: function() {
        return this.lockedHeader.getEl().first().getWidth();
    },
    getNormalGridWidth: function() {
        return this.normalHeader.getEl().first().getWidth();
    },
    preparePageToCommit: function() {
        var j = this.getCurrentPage(), h = this.component, d = h.lockedGrid, g = h.normalGrid;
        j.select(".sch2-remove").remove();
        var c = function(l) {
            return j.down("#" + l, true);
        }, k = function(l) {
            if (l) {
                l.style.width = "100%";
            }
        }, f = function(l) {
            if (l) {
                l.style.height = "100%";
            }
        };
        var a = j.down(this.normalBodySelector, true);
        a.style.top = "0px";
        var i = j.down(this.lockedBodySelector, true);
        i.style.top = "0px";
        var e = [ c(h.id + "-targetEl"), c(h.id + "-innerCt"), c(d.id), c(d.body.id), c(d.view.el.id) ];
        Ext.Array.each(e, f);
        k(e[0]);
        k(e[1]);
        if (!Ext.isIE) {
            k(c(g.headerCt.id));
        } else {
            var b = c(g.headerCt.id);
            if (b) {
                b.style.width = "";
            }
        }
        Ext.Array.each([ c(g.id), c(g.body.id), c(g.getView().id) ], function(l) {
            if (l) {
                l.style.height = l.style.width = "100%";
            }
        });
        return j;
    },
    startPage: function(b) {
        var a = this;
        var c = (b || a.getComponent().body).dom.cloneNode(true);
        c.id = "";
        a.setCurrentPage(Ext.get(c));
    },
    scrollTo: function(a, d) {
        var c = this;
        if (c.component.ensureVisible) {
            var b = c.component.store.getAt(a);
            c.component.ensureVisible(b, {
                callback: function() {
                    if (d && this.isLocked === false) {
                        d.apply(c);
                    }
                },
                select: false,
                focus: false,
                animate: false
            });
        } else {
            c.lockedView.bufferedRenderer.scrollTo(a, false, function() {
                c.normalView.bufferedRenderer.scrollTo(a, false, d);
            });
        }
    },
    removeNode: function(b) {
        if (b && b.parentNode) {
            b.parentNode.removeChild(b);
        } else {
            if (b.elements) {
                for (var a = 0; a < b.elements.length; a++) {
                    var c = b.elements[a];
                    c.parentNode.removeChild(c);
                }
            }
        }
    },
    restoreInfiniteScroll: function(b) {
        var a = b.getSchedulingView();
        if (b.infiniteScroll && a.rendered) {
            b.timeAxis.setTimeSpan(this._oldStart, this._oldEnd);
            a.setScrollX(this._oldScrollX);
            a.bindInfiniteScrollListeners();
        }
    },
    suspendInfiniteScroll: function(b) {
        var a = b.getSchedulingView();
        if (b.infiniteScroll && a.rendered) {
            a.unbindInfiniteScrollListeners();
            this._oldStart = b.timeAxis.getStart();
            this._oldEnd = b.timeAxis.getEnd();
            this._oldScrollX = a.getScrollX();
            var c = b.getEventStore().getTotalTimeSpan();
            b.setTimeSpan(c.start, c.end);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.exporter.SinglePage", {
    extend: Ext.ux.Scheduler2.plugin.exporter.AbstractExporter,
    config: {
        exporterId: "singlepage",
        headerTpl: '<div class="sch2-export-header" style="height:{height}px; width:{width}px"></div>'
    },
    getExpectedNumberOfPages: function() {
        return 1;
    },
    getPaperFormat: function() {
        var e = this, c = e.getTotalSize(), b = e.exportConfig.DPI, d = Ext.Number.toFixed(c.width / b, 1), a = Ext.Number.toFixed(c.height / b, 1);
        return d + "in*" + a + "in";
    },
    onRowsCollected: function() {
        var a = this;
        a.startPage();
        a.fillGrids();
        a.commitPage();
        a.onPagesExtracted();
    },
    getPageTplData: function() {
        var b = this, a = b.getTotalSize();
        return Ext.apply(b.callParent(arguments), {
            bodyHeight: a.height,
            showHeader: false,
            totalWidth: a.width
        });
    },
    getHeaderTplData: function(a) {
        var b = this;
        return {
            width: b.getTotalWidth(),
            height: b.pageHeaderHeight
        };
    },
    fitComponentIntoPage: function() {
        var a = this, b = a.lockedGrid;
        b.setWidth(b.headerCt.getEl().first().getWidth());
    },
    preparePageToCommit: function() {
        var e = this, f = e.callParent(arguments), d = f.select(".sch2-secondary-canvas").first(), c = d.select(".sch2-zone"), b = d.select(".sch2-column-line");
        var a = e.getTotalHeight();
        d.setTop(0);
        c.setHeight(a);
        b.setHeight(a);
        return f;
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.exporter.MultiPage", {
    extend: Ext.ux.Scheduler2.plugin.exporter.AbstractExporter,
    config: {
        exporterId: "multipage"
    },
    rowPageIndex: 0,
    columnPageIndex: 0,
    pagesPerColumn: 0,
    extractPages: function() {
        this.enableGarbageCollector = Ext.enableGarbageCollector;
        Ext.enableGarbageCollector = false;
        Ext.dom.GarbageCollector.pause();
        return this.callParent(arguments);
    },
    onRowsCollected: function(b, a) {
        var c = this;
        c.rowPageIndex = 0;
        c.columnPageIndex = 0;
        c.pagesPerColumn = 0;
        c.buildPageFrames(function() {
            c.buildPages(function() {
                c.onPagesExtracted.apply(c, arguments);
                Ext.enableGarbageCollector = c.enableGarbageCollector;
                Ext.dom.GarbageCollector.resume();
            }, c, b, a);
        });
    },
    buildPages: function(f, c, b, a) {
        var d = this, e = d.pageFrames[0];
        d.startPage(e, true);
        this.iterateAsync(d.rowIteratorStep, d, {
            rowIndex: 0,
            pageFrame: e,
            rowsHeight: 0,
            leftHeight: this.printHeight,
            lockeds: [],
            normals: [],
            lockedRows: b,
            normalRows: a,
            callback: f,
            scope: c || d
        });
    },
    rowIteratorStep: function(g, a) {
        var j = this, k = a.rowIndex, b = a.lockedRows, h = a.normalRows, i = a.leftHeight, d = a.lockeds, l = a.normals, c = true;
        if (k < b.length) {
            var f = b[k], e = h[k];
            if (f.height <= i) {
                d.push(f);
                l.push(e);
                a.leftHeight -= f.height;
                a.rowsHeight += f.height;
                c = false;
            } else {
                j.fillGrids(d, l, a.pageFrame);
                j.commitPage({
                    rowsHeight: a.rowsHeight
                });
                j.startPage(a.pageFrame);
                a.lockeds = [ f ];
                a.normals = [ e ];
                a.leftHeight = j.printHeight - f.height;
                a.rowsHeight = f.height;
            }
            a.rowIndex++;
        } else {
            if (j.columnPageIndex < j.pageFrames.length) {
                j.fillGrids(d, l, a.pageFrame);
                j.commitPage({
                    rowsHeight: a.rowsHeight
                });
                a.pageFrame = j.pageFrames[j.columnPageIndex];
                j.startPage(a.pageFrame, true);
                a.leftHeight = j.printHeight;
                a.rowsHeight = 0;
                a.lockeds = [];
                a.normals = [];
                a.rowIndex = 0;
            } else {
                j.fillGrids(d, l, a.pageFrame);
                j.commitPage({
                    rowsHeight: a.rowsHeight
                });
                a.callback.call(a.scope);
                return;
            }
        }
        if (c) {
            g(a);
        } else {
            j.rowIteratorStep(g, a);
        }
    },
    fillGrids: function(e, d, f) {
        var c = this, b = c.lockedColumnPages[c.columnPageIndex - 1], a = !b || b && b.leftWidth;
        if (b) {
            c.fillLockedGrid(e, true);
            c.removeHiddenLockedColumns(b);
        }
        if (a) {
            c.fillNormalGrid(d, true);
            c.removeInvisibleEvents(-f.normalGridOffset, -f.normalGridOffset + f.normalGridWidth);
        }
    },
    buildPageFrame: function(h, b) {
        var f = this, j = f.lockedColumnPages[h];
        if (j) {
            f.lockedGrid.setWidth(f.showLockedColumns(j.start, j.end) + (j.startOffset || 0));
            if (j.leftWidth) {
                f.normalGrid.show();
            } else {
                f.normalGrid.hide();
            }
        } else {
            f.lockedGrid.setWidth(0);
            f.lockedGrid.hide();
            f.normalGrid.show();
        }
        var a = f.getComponent().body.dom.cloneNode(true);
        a.id = "";
        a = Ext.get(a);
        a.normalGridOffset = b;
        a.lockedGridOffset = j && j.startOffset || 0;
        a.normalGridWidth = f.normalGrid.getWidth();
        a.lockedGridWidth = f.lockedGrid.getWidth();
        a.down(f.lockedBodySelector, true).style.position = "";
        a.down("#" + f.lockedView.id, true).style.overflow = "visible";
        if (!f.normalGrid.hidden) {
            var i = a.select(f.normalBodySelector).first();
            i.dom.style.position = "";
            i.dom.style.top = "0px";
            var d = f.getNormalGridBody(a);
            var c = a.down("#" + f.normalView.headerCt.id, true);
            var e = a.down(".sch2-secondary-canvas", true);
            var g = a.down("#" + f.normalView.id, true);
            d.style.left = b + "px";
            c.style.left = b + "px";
            c.style.overflow = "visible";
            e.style.left = b + "px";
            g.style.overflow = "visible";
        }
        return a;
    },
    buildPageFrames: function(e, c) {
        var d = this;
        c = c || d;
        d.lockedColumnPages = d.calculateLockedColumnPages();
        var a = Math.ceil(d.getTotalWidth() / d.paperWidth), b = d.pageFrames = [];
        d.iterateAsync(function(h, g, i) {
            if (g >= a) {
                e.call(c, b);
                return;
            }
            b.push(d.buildPageFrame(g, i));
            var f = d.lockedColumnPages[g];
            if (f) {
                i -= f.leftWidth || 0;
            } else {
                i -= d.paperWidth;
            }
            h(g + 1, i);
        }, d, 0, 0);
    },
    startPage: function(c, a) {
        var b = this;
        if (a) {
            if (b.columnPageIndex == 1) {
                b.pagesPerColumn = b.extractedPages.length;
            }
            b.rowPageIndex = 0;
            b.columnPageIndex++;
        }
        b.rowPageIndex++;
        b.callParent(arguments);
        b.emptyNormalGrid();
        b.emptyLockedGrid();
    },
    commitPage: function(a) {
        var b = this;
        b.callParent([ Ext.apply({
            row: b.rowPageIndex,
            column: b.columnPageIndex
        }, a) ]);
    },
    getExpectedPagesPerColumn: function() {
        return this.pagesPerColumn || Math.ceil((this.lockedRowsHeight || this.component.store.count() * this.component.getRowHeight()) / this.printHeight);
    },
    getExpectedColumnsNumber: function() {
        return this.pageFrames ? this.pageFrames.length : Math.ceil((this.lockedGrid.getWidth() + this.ticks.length * this.view.timeAxisViewModel.getTickWidth()) / this.paperWidth);
    },
    getExpectedNumberOfPages: function() {
        return this.getExpectedColumnsNumber() * this.getExpectedPagesPerColumn();
    },
    calculateLockedColumnPages: function() {
        var h = this, j = [], c = h.lockedColumns, e = h.paperWidth, g;
        for (var f = 0, d = c.length; f < d; f++) {
            var b = c[f], a = b.width;
            g = g || {
                start: f,
                end: f
            };
            e -= a;
            if (e < 0) {
                j.push(g);
                if (e) {
                    g = {
                        start: f,
                        end: f
                    };
                }
                e = h.paperWidth - a + e;
            } else {
                g.end = f;
            }
        }
        if (g) {
            g.leftWidth = e;
            j.push(g);
        }
        return j;
    },
    getPageTplData: function(a) {
        return Ext.apply(this.callParent(arguments), {
            title: a.number + " of " + this.numberOfPages + " (column: " + a.column + ", row: " + a.row + ")"
        });
    },
    showLockedColumns: function(e, g) {
        var f = this, b = f.lockedColumns, d = 0;
        e = e || 0;
        g = g || b.length - 1;
        for (var a = 0; a < b.length; a++) {
            var c = b[a];
            if (a >= e && a <= g) {
                c.column.show();
                d += c.width;
            } else {
                c.column.hide();
            }
        }
        return d;
    },
    removeInvisibleEvents: function(a, b) {
        var e = this, c = e.getNormalGridBody(), d = e.normalView.eventSelector;
        Ext.Array.each(Ext.fly(c).select(d).elements, function(g) {
            var h = parseInt(g.style.left, 10), f = h + parseInt(g.style.width, 10);
            if (f < a || h > b) {
                e.removeNode(g);
            }
        });
    },
    removeHiddenLockedColumns: function(b) {
        var j = this, h = j.getCurrentPage(), a = j.getLockedGridBody();
        for (var f = 0; f < j.lockedColumns.length; f++) {
            var c = j.lockedColumns[f].column;
            if (f < b.start || f > b.end) {
                var d = "#" + c.getId();
                var g = h.select(d);
                j.removeNode(g);
                var e = c.getCellSelector();
                var k = Ext.fly(a).select(e);
                j.removeNode(k);
            }
        }
    },
    fitComponentIntoPage: function() {
        var b = this, a = b.getComponent();
        a.setWidth(b.paperWidth);
    },
    prepareComponent: function(b, a) {
        var d = this, c = d.lockedColumns = [];
        d.callParent(arguments);
        d.lockedGrid.headerCt.items.each(function(e) {
            if (!e.hidden) {
                c.push({
                    column: e,
                    width: e.getWidth()
                });
            }
        });
    },
    restoreComponentState: function() {
        this.callParent(arguments);
        this.showLockedColumns();
    },
    preparePageToCommit: function() {
        var b = this, d = b.callParent(arguments), c = d.down("." + Ext.baseCSSPrefix + "splitter", true), a = b.pageFrames[b.columnPageIndex - 1];
        if (c) {
            if (a.lockedHidden) {
                c.style.display = "none";
                d.down("." + Ext.baseCSSPrefix + "grid-inner-normal", true).style.left = 0;
            } else {
                Ext.fly(c).setHeight("100%");
            }
        }
        return d;
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.exporter.MultiPageVertical", {
    extend: Ext.ux.Scheduler2.plugin.exporter.AbstractExporter,
    config: {
        exporterId: "multipagevertical"
    },
    minRowHeight: 20,
    visibleColumns: null,
    visibleColumnsWidth: 0,
    onRowsCollected: function(b, a) {
        var c = this;
        c.iterateAsync(function(g, j) {
            if (j === b.length) {
                c.onPagesExtracted();
                return;
            }
            var h = j, f = c.printHeight, l = 0, e = [], k = [], i, d = false;
            c.startPage();
            while (!d && h < b.length) {
                i = a[h];
                f -= i.height;
                if (f > 0) {
                    l += i.height;
                    e.push(b[h]);
                    k.push(i);
                    h++;
                } else {
                    d = true;
                }
            }
            c.fillGrids(e, k);
            c.commitPage({
                rowIndex: h,
                rowsHeight: l
            });
            g(h);
        }, c, 0);
    },
    startPage: function() {
        var b = this;
        b.callParent(arguments);
        var a = b.getCurrentPage().select("#" + b.lockedView.id).first();
        a.dom.style.overflow = "visible";
    },
    getExpectedNumberOfPages: function() {
        return Math.ceil(this.lockedRowsHeight / this.printHeight);
    },
    prepareComponent: function(c, b) {
        var d = this, a = d.visibleColumns = [];
        d.visibleColumnsWidth = 0;
        d.lockedGrid.headerCt.items.each(function(e) {
            if (!e.hidden) {
                a.push({
                    column: e,
                    width: e.getWidth()
                });
                d.visibleColumnsWidth += e.getWidth();
            }
        });
        d.callParent(arguments);
    },
    fitComponentIntoPage: function() {
        var i = this, j = i.getComponent(), h = j.normalGrid, c = j.lockedGrid, f = i.getTotalWidth(), k = i.ticks, e = i.timeColumnWidth || i.restoreSettings.columnWidth;
        var d = Math.floor(i.visibleColumnsWidth / f * i.paperWidth);
        var b = Math.floor(k.length * e / f * i.paperWidth);
        var g = Math.floor(b / k.length);
        var a = g / e * i.getRowHeight();
        i.view.setRowHeight(a < i.minRowHeight ? i.minRowHeight : a);
        j.setWidth(i.paperWidth);
        h.setWidth(b);
        c.setWidth(d);
        i.fitLockedColumnWidth(d);
        j.setTimeColumnWidth(g);
    },
    fitLockedColumnWidth: function(a) {
        var b = this.visibleColumns;
        if (b.length) {
            var d = a / b.length;
            for (var c = 0; c < b.length; c++) {
                b[c].column.setWidth(d);
            }
            this._restoreColumnWidth = true;
        }
    },
    restoreComponentState: function() {
        this.callParent(arguments);
        if (this._restoreColumnWidth) {
            var b = this.visibleColumns;
            for (var c = 0; c < b.length; c++) {
                var a = b[c];
                a.column.setWidth(a.width);
            }
        }
    }
});

Ext.define("Ext.ux.Scheduler2.widget.ResizePicker", {
    extend: Ext.Panel,
    alias: "widget.dualrangepicker",
    width: 200,
    height: 200,
    border: true,
    collapsible: false,
    bodyStyle: "position:absolute; margin:5px",
    verticalCfg: {
        height: 120,
        value: 24,
        increment: 2,
        minValue: 20,
        maxValue: 80,
        reverse: true,
        disabled: true
    },
    horizontalCfg: {
        width: 120,
        value: 100,
        minValue: 25,
        increment: 5,
        maxValue: 200,
        disable: true
    },
    initComponent: function() {
        var a = this;
        a.horizontalCfg.value = a.dialogConfig.columnWidth;
        a.verticalCfg.value = a.dialogConfig.rowHeight;
        a.verticalCfg.disabled = a.dialogConfig.scrollerDisabled || false;
        a.dockedItems = [ a.vertical = new Ext.slider.Single(Ext.apply({
            dock: "left",
            style: "margin-top:10px",
            vertical: true,
            listeners: {
                change: a.onSliderChange,
                changecomplete: a.onSliderChangeComplete,
                scope: a
            }
        }, a.verticalCfg)), a.horizontal = new Ext.slider.Single(Ext.apply({
            dock: "top",
            style: "margin-left:28px",
            listeners: {
                change: a.onSliderChange,
                changecomplete: a.onSliderChangeComplete,
                scope: a
            }
        }, a.horizontalCfg)) ];
        a.callParent(arguments);
    },
    afterRender: function() {
        var b = this;
        b.addCls("sch2-ux-range-picker");
        b.valueHandle = this.body.createChild({
            cls: "sch2-ux-range-value",
            cn: {
                tag: "span"
            }
        });
        b.valueSpan = this.valueHandle.down("span");
        var a = new Ext.dd.DD(this.valueHandle);
        Ext.apply(a, {
            startDrag: function() {
                b.dragging = true;
                this.constrainTo(b.body);
            },
            onDrag: function() {
                b.onHandleDrag.apply(b, arguments);
            },
            endDrag: function() {
                b.onHandleEndDrag.apply(b, arguments);
                b.dragging = false;
            },
            scope: this
        });
        this.setValues(this.getValues());
        this.callParent(arguments);
        this.body.on("click", this.onBodyClick, this);
    },
    onBodyClick: function(c, a) {
        var b = [ c.getXY()[0] - 8 - this.body.getX(), c.getXY()[1] - 8 - this.body.getY() ];
        this.valueHandle.setLeft(Ext.Number.constrain(b[0], 0, this.getAvailableWidth()));
        this.valueHandle.setTop(Ext.Number.constrain(b[1], 0, this.getAvailableHeight()));
        this.setValues(this.getValuesFromXY([ this.valueHandle.getLeft(true), this.valueHandle.getTop(true) ]));
        this.onSliderChangeComplete();
    },
    getAvailableWidth: function() {
        return this.body.getWidth() - 18;
    },
    getAvailableHeight: function() {
        return this.body.getHeight() - 18;
    },
    onHandleDrag: function() {
        this.setValues(this.getValuesFromXY([ this.valueHandle.getLeft(true), this.valueHandle.getTop(true) ]));
    },
    onHandleEndDrag: function() {
        this.setValues(this.getValuesFromXY([ this.valueHandle.getLeft(true), this.valueHandle.getTop(true) ]));
    },
    getValuesFromXY: function(d) {
        var c = d[0] / this.getAvailableWidth();
        var a = d[1] / this.getAvailableHeight();
        var e = Math.round((this.horizontalCfg.maxValue - this.horizontalCfg.minValue) * c);
        var b = Math.round((this.verticalCfg.maxValue - this.verticalCfg.minValue) * a) + this.verticalCfg.minValue;
        return [ e + this.horizontalCfg.minValue, b ];
    },
    getXYFromValues: function(d) {
        var b = this.horizontalCfg.maxValue - this.horizontalCfg.minValue;
        var f = this.verticalCfg.maxValue - this.verticalCfg.minValue;
        var a = Math.round((d[0] - this.horizontalCfg.minValue) * this.getAvailableWidth() / b);
        var c = d[1] - this.verticalCfg.minValue;
        var e = Math.round(c * this.getAvailableHeight() / f);
        return [ a, e ];
    },
    updatePosition: function() {
        var a = this.getValues();
        var b = this.getXYFromValues(a);
        this.valueHandle.setLeft(Ext.Number.constrain(b[0], 0, this.getAvailableWidth()));
        if (this.verticalCfg.disabled) {
            this.valueHandle.setTop(this.dialogConfig.rowHeight);
        } else {
            this.valueHandle.setTop(Ext.Number.constrain(b[1], 0, this.getAvailableHeight()));
        }
        this.positionValueText();
        this.setValueText(a);
    },
    positionValueText: function() {
        var a = this.valueHandle.getTop(true);
        var b = this.valueHandle.getLeft(true);
        this.valueSpan.setLeft(b > 30 ? -30 : 10);
        this.valueSpan.setTop(a > 10 ? -20 : 20);
    },
    setValueText: function(a) {
        if (this.verticalCfg.disabled) {
            a[1] = this.dialogConfig.rowHeight;
        }
        this.valueSpan.update("[" + a.toString() + "]");
    },
    setValues: function(a) {
        this.horizontal.setValue(a[0]);
        if (this.verticalCfg.reverse) {
            if (!this.verticalCfg.disabled) {
                this.vertical.setValue(this.verticalCfg.maxValue + this.verticalCfg.minValue - a[1]);
            }
        } else {
            if (!this.verticalCfg.disabled) {
                this.vertical.setValue(a[1]);
            }
        }
        if (!this.dragging) {
            this.updatePosition();
        }
        this.positionValueText();
        this.setValueText(a);
    },
    getValues: function() {
        if (!this.verticalCfg.disabled) {
            var a = this.vertical.getValue();
            if (this.verticalCfg.reverse) {
                a = this.verticalCfg.maxValue - a + this.verticalCfg.minValue;
            }
            return [ this.horizontal.getValue(), a ];
        }
        return [ this.horizontal.getValue() ];
    },
    onSliderChange: function() {
        this.fireEvent("change", this, this.getValues());
        if (!this.dragging) {
            this.updatePosition();
        }
    },
    onSliderChangeComplete: function() {
        this.fireEvent("changecomplete", this, this.getValues());
    },
    afterLayout: function() {
        this.callParent(arguments);
        this.updatePosition();
    }
});

Ext.define("Ext.ux.Scheduler2.widget.ColumnPicker", {
    extend: Ext.form.field.ComboBox,
    multiSelect: true,
    valueField: "id",
    displayField: "name",
    forceSelection: true,
    editable: false,
    listConfig: {
        cls: "sch2-columnpicker-list"
    },
    columns: null,
    store: {
        proxy: "memory",
        fields: [ "id", "name", "column" ]
    },
    initComponent: function() {
        var a = this;
        Ext.applyIf(a.store, {
            data: this.processColumns(this.columns)
        });
        this.callParent(arguments);
    },
    processColumns: function(a) {
        var c = [], b = [];
        Ext.Array.each(a, function(d) {
            c.push({
                id: d.id,
                name: d.text,
                column: d
            });
            if (!d.isHidden()) {
                b.push(d.id);
            }
        });
        this.value = this.value || b;
        return c;
    },
    getSelectedColumns: function() {
        var a = this, b = a.getValue();
        b = Ext.isArray(b) ? b : [ b ];
        return Ext.Array.map(b, function(c) {
            return a.store.getById(c).get("column");
        });
    }
});

Ext.define("Ext.ux.Scheduler2.widget.ExportDialogForm", {
    extend: Ext.form.Panel,
    border: false,
    bodyPadding: "10 10 0 10",
    autoHeight: true,
    initComponent: function() {
        var a = this;
        a.fieldDefaults = Ext.applyIf(a.fieldDefaults || {}, {
            labelAlign: "left",
            labelWidth: 120,
            anchor: "99%"
        });
        a.items = a.createFields();
        a.items.push(a.progressBar || a.createProgressBar());
        a.callParent(arguments);
        a.onRangeChange(null, a.dialogConfig.exportConfig.range);
        a.onExporterChange(a.exportersField, a.exportersField.getValue());
        a.on({
            hideprogressbar: a.hideProgressBar,
            showprogressbar: a.showProgressBar,
            updateprogressbar: a.updateProgressBar,
            scope: a
        });
    },
    isValid: function() {
        var a = this;
        if (a.rangeField.getValue() === "date") {
            return a.dateFromField.isValid() && a.dateToField.isValid();
        }
        return true;
    },
    getValues: function(e, c, d, b) {
        var a = this.callParent(arguments);
        a.showHeader = !!a.showHeader;
        a.showFooter = !!a.showFooter;
        var f = this.resizePicker.getValues();
        if (!e) {
            a.cellSize = f;
        } else {
            a += "&cellSize[0]=" + f[0] + "&cellSize[1]=" + f[1];
        }
        if (this.dialogConfig.showColumnPicker) {
            a.columns = this.columnPicker.getSelectedColumns();
        }
        return a;
    },
    createFields: function() {
        var e = this, a = e.dialogConfig, g = '<table class="sch2-fieldcontainer-label-wrap"><td width="1" class="sch2-fieldcontainer-label">', f = '<td><div class="sch2-fieldcontainer-separator"></div></table>', b = [];
        e.rangeField = new Ext.form.field.ComboBox({
            value: a.exportConfig.range,
            triggerAction: "all",
            cls: "sch2-export-dialog-range",
            forceSelection: true,
            editable: false,
            fieldLabel: a.rangeFieldLabel,
            name: "range",
            queryMode: "local",
            displayField: "name",
            valueField: "value",
            store: new Ext.data.Store({
                fields: [ "name", "value" ],
                data: [ {
                    name: a.completeViewText,
                    value: "complete"
                }, {
                    name: a.dateRangeText,
                    value: "date"
                }, {
                    name: a.currentViewText,
                    value: "current"
                } ]
            }),
            listeners: {
                change: e.onRangeChange,
                scope: e
            }
        });
        e.resizePicker = new Ext.ux.Scheduler2.widget.ResizePicker({
            dialogConfig: a,
            margin: "10 20"
        });
        e.resizerHolder = new Ext.form.FieldContainer({
            fieldLabel: a.scrollerDisabled ? a.adjustCols : a.adjustColsAndRows,
            labelAlign: "top",
            hidden: true,
            labelSeparator: "",
            beforeLabelTextTpl: g,
            afterLabelTextTpl: f,
            layout: "vbox",
            defaults: {
                flex: 1,
                allowBlank: false
            },
            items: [ e.resizePicker ]
        });
        e.dateFromField = new Ext.form.field.Date({
            fieldLabel: a.dateRangeFromText,
            baseBodyCls: "sch2-exportdialogform-date",
            name: "dateFrom",
            format: a.dateRangeFormat || Ext.Date.defaultFormat,
            allowBlank: false,
            maxValue: a.endDate,
            minValue: a.startDate,
            value: a.startDate
        });
        e.dateToField = new Ext.form.field.Date({
            fieldLabel: a.dateRangeToText,
            name: "dateTo",
            format: a.dateRangeFormat || Ext.Date.defaultFormat,
            baseBodyCls: "sch2-exportdialogform-date",
            allowBlank: false,
            maxValue: a.endDate,
            minValue: a.startDate,
            value: a.endDate
        });
        e.datesHolder = new Ext.form.FieldContainer({
            fieldLabel: a.specifyDateRange,
            labelAlign: "top",
            hidden: true,
            labelSeparator: "",
            beforeLabelTextTpl: g,
            afterLabelTextTpl: f,
            layout: "vbox",
            defaults: {
                flex: 1,
                allowBlank: false
            },
            items: [ e.dateFromField, e.dateToField ]
        });
        if (a.showColumnPicker) {
            e.columnPicker = new Ext.ux.Scheduler2.widget.ColumnPicker(Ext.apply({
                fieldLabel: a.columnPickerLabel,
                cls: "sch2-export-dialog-columns",
                columns: a.scheduler.lockedGrid.query("gridcolumn")
            }, a.columnPickerConfig));
        }
        if (a.showDPIField) {
            e.dpiField = new Ext.form.field.Number(Ext.apply({
                fieldLabel: a.dpiFieldLabel,
                cls: "sch2-export-dialog-dpi",
                minValue: 65,
                name: "DPI",
                value: a.exportConfig.DPI,
                maxValue: 200
            }, a.dpiFieldConfig));
        }
        if (a.showHeaderField) {
            e.showHeaderField = new Ext.form.field.Checkbox({
                fieldLabel: e.dialogConfig.showHeaderLabel,
                cls: "sch2-export-dialog-header",
                name: "showHeader",
                checked: !!a.exportConfig.showHeader,
                checkedValue: true,
                uncheckedValue: false
            });
        }
        if (a.showFooterField) {
            e.showFooterField = new Ext.form.field.Checkbox({
                fieldLabel: e.dialogConfig.showFooterLabel,
                cls: "sch2-export-dialog-footer",
                name: "showFooter",
                checked: !!a.exportConfig.showFooter,
                checkedValue: true,
                uncheckedValue: false
            });
        }
        e.exportersField = new Ext.form.field.ComboBox({
            value: a.defaultExporter,
            triggerAction: "all",
            cls: "sch2-export-dialog-exporter",
            forceSelection: true,
            editable: false,
            fieldLabel: a.exportersFieldLabel,
            name: "exporterId",
            queryMode: "local",
            displayField: "name",
            valueField: "value",
            store: {
                fields: [ "name", "value" ],
                data: Ext.Array.map(a.exporters, function(h) {
                    return {
                        name: h.getName(),
                        value: h.getExporterId()
                    };
                })
            },
            listeners: {
                change: e.onExporterChange,
                scope: e
            }
        });
        e.formatField = new Ext.form.field.ComboBox({
            value: a.exportConfig.format,
            triggerAction: "all",
            forceSelection: true,
            editable: false,
            fieldLabel: a.formatFieldLabel,
            name: "format",
            queryMode: "local",
            store: a.pageFormats || [ "A5", "A4", "A3", "Letter", "Legal" ]
        });
        var d = a.exportConfig.orientation === "portrait" ? 'class="sch2-none"' : "", c = a.exportConfig.orientation === "landscape" ? 'class="sch2-none"' : "";
        e.orientationField = new Ext.form.field.ComboBox({
            value: a.exportConfig.orientation,
            triggerAction: "all",
            componentCls: "sch2-exportdialogform-orientation",
            forceSelection: true,
            editable: false,
            fieldLabel: e.dialogConfig.orientationFieldLabel,
            afterSubTpl: new Ext.XTemplate('<span id="sch2-exportdialog-imagePortrait" ' + c + '></span><span id="sch2-exportdialog-imageLandscape" ' + d + "></span>"),
            name: "orientation",
            displayField: "name",
            valueField: "value",
            queryMode: "local",
            store: new Ext.data.Store({
                fields: [ "name", "value" ],
                data: [ {
                    name: a.orientationPortraitText,
                    value: "portrait"
                }, {
                    name: a.orientationLandscapeText,
                    value: "landscape"
                } ]
            }),
            listeners: {
                change: function(i, h) {
                    switch (h) {
                      case "landscape":
                        Ext.fly("sch2-exportdialog-imagePortrait").toggleCls("sch2-none");
                        Ext.fly("sch2-exportdialog-imageLandscape").toggleCls("sch2-none");
                        break;

                      case "portrait":
                        Ext.fly("sch2-exportdialog-imagePortrait").toggleCls("sch2-none");
                        Ext.fly("sch2-exportdialog-imageLandscape").toggleCls("sch2-none");
                        break;
                    }
                }
            }
        });
        b.push(e.rangeField);
        b.push(e.resizerHolder);
        b.push(e.datesHolder);
        b.push(e.exportersField);
        b.push(e.formatField);
        b.push(e.orientationField);
        if (a.showColumnPicker) {
            b.push(e.columnPicker);
        }
        if (a.showDPIField) {
            b.push(e.dpiField);
        }
        if (a.showHeaderField) {
            b.push(e.showHeaderField);
        }
        if (a.showFooterField) {
            b.push(e.showFooterField);
        }
        return b;
    },
    createProgressBar: function() {
        return this.progressBar = new Ext.ProgressBar({
            text: this.config.progressBarText,
            animate: true,
            hidden: true,
            margin: "4px 0 10px 0"
        });
    },
    onRangeChange: function(b, a) {
        switch (a) {
          case "complete":
            this.datesHolder.hide();
            this.resizerHolder.hide();
            break;

          case "date":
            this.datesHolder.show();
            this.resizerHolder.hide();
            break;

          case "current":
            this.datesHolder.hide();
            this.resizerHolder.show();
            this.resizePicker.expand(true);
            break;
        }
    },
    onExporterChange: function(b, a) {
        switch (a) {
          case "singlepage":
            this.disableFields(true);
            break;

          default:
            this.disableFields(false);
        }
    },
    disableFields: function(b) {
        var a = this;
        if (a.showHeaderField) {
            a.showHeaderField.setDisabled(b);
        }
        a.formatField.setDisabled(b);
        a.orientationField.setDisabled(b);
    },
    showProgressBar: function() {
        if (this.progressBar) {
            this.progressBar.show();
        }
    },
    hideProgressBar: function() {
        if (this.progressBar) {
            this.progressBar.hide();
        }
    },
    updateProgressBar: function(a, b) {
        if (this.progressBar) {
            this.progressBar.updateProgress(a);
            if (b) {
                this.progressBar.updateText(b);
            }
        }
    }
});

Ext.define("Ext.ux.Scheduler2.widget.ExportDialog", {
    alternateClassName: "Ext.ux.Scheduler2.widget.PdfExportDialog",
    extend: Ext.window.Window,
    mixins: [ Ext.ux.Scheduler2.mixin.Localizable ],
    alias: "widget.exportdialog",
    modal: false,
    width: 350,
    cls: "sch2-exportdialog",
    frame: false,
    layout: "fit",
    draggable: true,
    padding: 0,
    myConfig: null,
    plugin: null,
    pluginListeners: null,
    buttonsPanel: null,
    buttonsPanelScope: null,
    progressBar: null,
    dateRangeFormat: "",
    showHeaderField: true,
    showFooterField: false,
    showColumnPicker: false,
    columnPickerConfig: null,
    showDPIField: false,
    dpiFieldConfig: null,
    constructor: function(a) {
        Ext.apply(this, a.exportDialogConfig);
        this.plugin = a.plugin;
        this.title = this.title || this.L("title");
        this.myConfig = Ext.apply({
            progressBarText: this.L("progressBarText"),
            dateRangeToText: this.L("dateRangeToText"),
            pickerText: this.L("pickerText"),
            dateRangeFromText: this.L("dateRangeFromText"),
            dateRangeText: this.L("dateRangeText"),
            currentViewText: this.L("currentViewText"),
            formatFieldLabel: this.L("formatFieldLabel"),
            orientationFieldLabel: this.L("orientationFieldLabel"),
            rangeFieldLabel: this.L("rangeFieldLabel"),
            showHeaderLabel: this.L("showHeaderLabel"),
            showFooterLabel: this.L("showFooterLabel"),
            exportersFieldLabel: this.L("exportersFieldLabel"),
            orientationPortraitText: this.L("orientationPortraitText"),
            orientationLandscapeText: this.L("orientationLandscapeText"),
            completeViewText: this.L("completeViewText"),
            adjustCols: this.L("adjustCols"),
            adjustColsAndRows: this.L("adjustColsAndRows"),
            specifyDateRange: this.L("specifyDateRange"),
            columnPickerLabel: this.L("columnPickerLabel"),
            dpiFieldLabel: this.L("dpiFieldLabel"),
            dateRangeFormat: this.dateRangeFormat,
            exportConfig: this.exportConfig,
            showColumnPicker: this.showColumnPicker,
            columnPickerConfig: this.columnPickerConfig,
            showHeaderField: this.showHeaderField,
            showFooterField: this.showFooterField,
            pageFormats: this.getPageFormats(),
            scheduler: this.plugin && this.plugin.scheduler
        }, a.exportDialogConfig);
        this.callParent(arguments);
    },
    getPageFormats: function() {
        var a = this.plugin.pageSizes, b = [];
        Ext.Object.each(a, function(c, d) {
            b.push({
                width: d.width,
                height: d.height,
                name: c
            });
        });
        return Ext.Array.map(b.sort(function(d, c) {
            return d.width - c.width;
        }), function(c) {
            return c.name;
        });
    },
    initComponent: function() {
        var b = this, a = {
            hidedialogwindow: b.destroy,
            showdialogerror: b.showError,
            exportstart: b.onExportStart,
            afterexport: b.onExportEnd,
            updateprogressbar: function(c, d) {
                if (arguments.length == 2) {
                    b.fireEvent("updateprogressbar", c, undefined);
                } else {
                    b.fireEvent("updateprogressbar", c, d);
                }
            },
            destroyable: true,
            scope: b
        };
        b.form = b.buildForm(b.myConfig);
        Ext.apply(this, {
            items: b.form,
            fbar: b.buildButtons(b.buttonsPanelScope || b)
        });
        b.callParent(arguments);
        b.pluginListeners = b.plugin.on(a);
    },
    afterRender: function() {
        var a = this;
        a.relayEvents(a.form.resizePicker, [ "change", "changecomplete", "select" ]);
        a.form.relayEvents(a, [ "updateprogressbar", "hideprogressbar", "showprogressbar" ]);
        a.callParent(arguments);
    },
    buildButtons: function(b) {
        var a = this;
        return [ {
            xtype: "button",
            scale: "medium",
            itemId: "export",
            text: this.L("exportButtonText"),
            handler: function() {
                if (this.form.isValid()) {
                    this.fireEvent("showprogressbar");
                    var d = this.form.getValues();
                    d.exporterId = d.exporterId;
                    var c = this.dateRangeFormat || Ext.Date.defaultFormat;
                    if (d.dateFrom && !Ext.isDate(d.dateFrom)) {
                        d.dateFrom = Ext.Date.parse(d.dateFrom, c);
                    }
                    if (d.dateTo && !Ext.isDate(d.dateTo)) {
                        d.dateTo = Ext.Date.parse(d.dateTo, c);
                    }
                    this.plugin.doExport(d);
                }
            },
            scope: b
        }, {
            xtype: "button",
            scale: "medium",
            itemId: "cancel",
            text: this.L("cancelButtonText"),
            handler: function() {
                this.destroy();
            },
            scope: b
        } ];
    },
    buildForm: function(a) {
        return new Ext.ux.Scheduler2.widget.ExportDialogForm({
            progressBar: this.progressBar,
            dialogConfig: a
        });
    },
    showError: function(b, a) {
        var c = b, d = a || c.L("generalError");
        c.fireEvent("hideprogressbar");
        Ext.Msg.alert("", d);
    },
    onExportStart: function() {
        var a = this.down("#export");
        a && a.disable();
    },
    onExportEnd: function() {
        var a = this.down("#export");
        a && a.enable();
    },
    destroy: function() {
        this.pluginListeners.destroy();
        this.callParent(arguments);
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.Export", {
    extend: Ext.util.Observable,
    alternateClassName: "Ext.ux.Scheduler2.plugin.PdfExport",
    alias: "plugin.scheduler_export",
    mixins: [ Ext.AbstractPlugin, Ext.ux.Scheduler2.mixin.Localizable ],
    lockableScope: "top",
    pageSizes: {
        A5: {
            width: 5.8,
            height: 8.3
        },
        A4: {
            width: 8.3,
            height: 11.7
        },
        A3: {
            width: 11.7,
            height: 16.5
        },
        Letter: {
            width: 8.5,
            height: 11
        },
        Legal: {
            width: 8.5,
            height: 14
        }
    },
    DPI: 72,
    printServer: undefined,
    timeout: 6e4,
    headerTpl: null,
    headerTplDataFn: null,
    headerTplDataFnScope: null,
    tpl: null,
    footerTpl: null,
    footerTplDataFn: null,
    footerTplDataFnScope: null,
    exportDialogClassName: "Ext.ux.Scheduler2.widget.ExportDialog",
    exportDialogConfig: {},
    exporterConfig: null,
    exportConfig: {
        format: "A4",
        orientation: "portrait",
        range: "complete",
        showHeader: true,
        showFooter: false
    },
    expandAllBeforeExport: false,
    translateURLsToAbsolute: true,
    openAfterExport: true,
    beforeExport: Ext.emptyFn,
    afterExport: Ext.emptyFn,
    fileFormat: "pdf",
    defaultExporter: "multipage",
    exporters: undefined,
    callbacks: undefined,
    currentAjaxRequest: undefined,
    constructor: function(a) {
        var b = this;
        a = a || {};
        b.exportersIndex = {};
        if (a.exportDialogConfig) {
            Ext.Object.each(this.exportConfig, function(d, c, f) {
                var e = a.exportDialogConfig[d];
                if (e) {
                    f[d] = e;
                }
            });
        }
        b.callParent([ a ]);
        b.setFileFormat(b.fileFormat);
        if (!b.exporters) {
            b.exporters = b.buildExporters();
        }
        b.initExporters();
        b.bindExporters();
    },
    init: function(a) {
        var b = this;
        a.showExportDialog = Ext.Function.bind(b.showExportDialog, b);
        a.doExport = Ext.Function.bind(b.doExport, b);
        b.scheduler = a;
    },
    initExporters: function() {
        var c = this, b = c.exporters;
        for (var a = 0; a < b.length; a++) {
            if (!(b[a] instanceof Ext.ux.Scheduler2.plugin.exporter.AbstractExporter)) {
                b[a] = c.createExporter(b[a]);
            }
        }
    },
    bindExporters: function() {
        var b = this.exporters;
        for (var a = 0; a < b.length; a++) {
            this.bindExporter(b[a]);
        }
    },
    bindExporter: function(b) {
        var a = this;
        a.mon(b, {
            commitpage: a.onPageCommit,
            collectrows: a.onRowCollected,
            scope: a
        });
    },
    unbindExporter: function(b) {
        var a = this;
        a.mun(b, {
            commitpage: a.onPageCommit,
            collectrows: a.onRowCollected,
            scope: a
        });
    },
    buildExporters: function() {
        return [ "Ext.ux.Scheduler2.plugin.exporter.SinglePage", "Ext.ux.Scheduler2.plugin.exporter.MultiPage", "Ext.ux.Scheduler2.plugin.exporter.MultiPageVertical" ];
    },
    getExporterConfig: function(c, b) {
        var d = this;
        var a = Ext.apply({
            translateURLsToAbsolute: d.translateURLsToAbsolute,
            expandAllBeforeExport: d.expandAllBeforeExport,
            DPI: d.DPI
        }, d.exporterConfig);
        if (d.headerTpl) {
            a.headerTpl = d.headerTpl;
        }
        if (d.headerTplDataFn) {
            a.headerTplDataFn = d.headerTplDataFn;
            a.headerTplDataFnScope = d.headerTplDataFnScope;
        }
        if (d.tpl) {
            a.tpl = d.tpl;
        }
        if (d.footerTpl) {
            a.footerTpl = d.footerTpl;
        }
        if (d.footerTplDataFn) {
            a.footerTplDataFn = d.footerTplDataFn;
            a.footerTplDataFnScope = d.footerTplDataFnScope;
        }
        return a;
    },
    createExporter: function(b, a) {
        var c = this, d = c.getExporterConfig(b, a);
        if (Ext.isObject(b)) {
            return Ext.create(Ext.apply(d, b));
        } else {
            return Ext.create(b, Ext.apply(d, a));
        }
    },
    registerExporter: function(b, a) {
        if (!(b instanceof Ext.ux.Scheduler2.plugin.exporter.AbstractExporter)) {
            b = this.createExporter.apply(this, arguments);
        }
        this.exporters.push(b);
        this.bindExporter(b);
    },
    getExporter: function(b) {
        if (!b) {
            return;
        }
        var a = this.exportersIndex[b];
        if (a) {
            return a;
        }
        a = this.exportersIndex[b] = Ext.Array.findBy(this.exporters, function(c) {
            return c.getExporterId() == b;
        });
        return a;
    },
    getExporters: function() {
        return this.exporters;
    },
    setFileFormat: function(a) {
        if (typeof a !== "string") {
            this.fileFormat = "pdf";
        } else {
            a = a.toLowerCase();
            if (a === "png") {
                this.fileFormat = a;
            } else {
                this.fileFormat = "pdf";
            }
        }
    },
    showExportDialog: function() {
        var b = this, a = b.scheduler.getSchedulingView();
        if (b.win) {
            b.win.destroy();
        }
        b.win = Ext.create(b.exportDialogClassName, {
            plugin: b,
            exportDialogConfig: Ext.apply({
                startDate: b.scheduler.getStart(),
                endDate: b.scheduler.getEnd(),
                rowHeight: a.timeAxisViewModel.getViewRowHeight(),
                columnWidth: a.timeAxisViewModel.getTickWidth(),
                defaultExporter: b.defaultExporter,
                exporters: b.exporters,
                exportConfig: Ext.apply(b.exportConfig, {
                    DPI: b.DPI
                })
            }, b.exportDialogConfig),
            listeners: {
                destroy: this.cancelExport,
                scope: this
            }
        });
        b.win.show();
    },
    getExportConfig: function(b) {
        var c = this;
        var a = Ext.apply({
            fileFormat: c.fileFormat,
            exporterId: c.defaultExporter,
            beforeExport: Ext.Function.bind(c.beforeExport, c),
            afterExport: Ext.Function.bind(c.afterExport, c)
        }, b, c.exportConfig);
        a.DPI = a.DPI || c.DPI;
        a.pageSize = Ext.apply({}, c.pageSizes[a.format]);
        a.pageSize.width *= a.DPI;
        a.pageSize.height *= a.DPI;
        return a;
    },
    doExport: function(d, h, a, e) {
        var f = this, c = f.scheduler, b = f.getExportConfig(d);
        f.callbacks = {
            success: h || Ext.emptyFn,
            failure: a || Ext.emptyFn,
            scope: e || f
        };
        var g = f.exporter = f.getExporter(b.exporterId);
        if (!g) {
            throw "No exporter found with id " + b.exporterId;
        }
        if (f.fireEvent("beforeexport", c, g, b) !== false) {
            f.myBeforeExport();
            f.exporter.extractPages(c, b, function(i) {
                f.onPagesExtracted(i, c, g, b);
            });
        }
    },
    cancelExport: function() {
        if (this.currentAjaxRequest) {
            Ext.Ajax.abort(this.currentAjaxRequest);
            this.currentAjaxRequest = null;
        }
        Ext.getBody().unmask();
    },
    onPagesExtracted: function(a, c, d, b) {
        this.fireEvent("updateprogressbar", .8, this.L("requestingPrintServer"));
        this.doRequest(a, b);
    },
    onRowCollected: function(c, d, b, a) {
        this.fireEvent("updateprogressbar", .2 * (b + 1) / a, Ext.String.format(this.L("fetchingRows"), b + 1, a));
    },
    onPageCommit: function(d, c, b, a) {
        a = Math.max(b, a);
        this.fireEvent("updateprogressbar", .2 + .6 * b / a, Ext.String.format(this.L("builtPage"), b, a));
    },
    onExportSuccess: function(a) {
        var e = this, f = e.getWin(), d = e.callbacks, c = d && d.success, b = d && d.scope || e;
        e.fireEvent("updateprogressbar", 1);
        e.myAfterExport();
        c && c.apply(b, arguments);
        setTimeout(function() {
            e.fireEvent("hidedialogwindow", a);
            if (e.openAfterExport) {
                window.open(a.url, "ExportedPanel");
            }
        }, f ? f.hideTime : 3e3);
    },
    onExportFailure: function(f, a) {
        var e = this, g = this.getWin(), d = e.callbacks, c = d && d.failure, b = d && d.scope || e;
        c && c.call(b, f);
        e.fireEvent("showdialogerror", g, f, a);
        e.myAfterExport();
    },
    doRequest: function(a, b) {
        var f = this, g = f.scheduler;
        if (!f.test && !f.debug) {
            if (f.printServer) {
                var j = {
                    method: "POST",
                    url: f.printServer,
                    timeout: f.timeout,
                    params: Ext.apply({
                        html: {
                            array: Ext.JSON.encode(a)
                        },
                        startDate: g.getStartDate(),
                        endDate: g.getEndDate(),
                        format: f.exporter.getPaperFormat(),
                        orientation: b.orientation,
                        range: b.range,
                        fileFormat: f.fileFormat
                    }, this.getParameters()),
                    success: f.onRequestSuccess,
                    failure: f.onRequestFailure,
                    scope: f
                };
                Ext.apply(j, this.getAjaxConfig(j));
                this.currentAjaxRequest = Ext.Ajax.request(j);
            } else {
                f.onExportFailure("Print server URL is not defined, please specify printServer config");
            }
        } else {
            if (f.debug) {
                var c = a || [];
                for (var e = 0, d = c.length; e < d; e++) {
                    var h = window.open();
                    h.document.write(c[e].html);
                    h.document.close();
                }
            }
            f.onExportSuccess(f.testResponse || {
                success: true,
                url: "foo",
                htmlArray: a
            });
        }
    },
    onRequestSuccess: function(b) {
        this.currentAjaxRequest = null;
        var c = this, a;
        try {
            a = Ext.JSON.decode(b.responseText);
        } catch (d) {
            c.onExportFailure("Wrong server response received");
            return;
        }
        if (a.success) {
            c.onExportSuccess(a);
        } else {
            c.onExportFailure(a.msg, a);
        }
    },
    onRequestFailure: function(a) {
        this.currentAjaxRequest = null;
        var b = this, c = a.status === 200 ? a.responseText : a.statusText;
        b.onExportFailure(c, a);
    },
    getParameters: function() {
        return {};
    },
    getAjaxConfig: function(a) {
        return {};
    },
    getWin: function() {
        return this.win || null;
    },
    myBeforeExport: function() {
        this.fireEvent("exportstart", this);
        var a = Ext.getBody().mask();
        a.addCls("sch2-export-mask");
    },
    myAfterExport: function() {
        this.fireEvent("afterexport", this);
        Ext.getBody().unmask();
    },
    destroy: function() {
        this.callParent(arguments);
        if (this.win) {
            this.win.destroy();
        }
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.HeaderZoom", {
    extend: Ext.ux.Scheduler2.util.DragTracker,
    mixins: [ Ext.AbstractPlugin ],
    alias: "plugin.scheduler_headerzoom",
    lockableScope: "top",
    scheduler: null,
    proxy: null,
    headerRegion: null,
    init: function(a) {
        this.scheduler = a;
        this.onModeChange();
        a.on("modechange", this.onModeChange, this);
    },
    onOrientationChange: function() {
        return this.onModeChange.apply(this, arguments);
    },
    onModeChange: function() {
        var a = this.scheduler.down("timeaxiscolumn");
        if (a) {
            if (a.rendered) {
                this.onTimeAxisColumnRender(a);
            } else {
                a.on({
                    afterrender: this.onTimeAxisColumnRender,
                    scope: this
                });
            }
        }
    },
    onTimeAxisColumnRender: function(a) {
        this.proxy = a.el.createChild({
            cls: "sch2-drag-selector"
        });
        this.initEl(a.el);
    },
    onStart: function(a) {
        this.proxy.show();
        this.headerRegion = this.scheduler.normalGrid.headerCt.getRegion();
    },
    onDrag: function(b) {
        var c = this.headerRegion;
        var a = this.getRegion().constrainTo(c);
        a.top = c.top;
        a.bottom = c.bottom;
        this.proxy.setBox(a);
    },
    onEnd: function(h) {
        if (this.proxy) {
            this.proxy.setDisplayed(false);
            var c = this.scheduler;
            var g = this.getRegion();
            var b = c.getSchedulingView().getStartEndDatesFromRegion(g);
            if (b) {
                var f = c.timeAxis;
                var d = c.getSchedulingView().timeAxisViewModel.getBottomHeader().unit;
                var i = f.floorDate(b.start, false, d, 1);
                var a = f.ceilDate(b.end, false, d, 1);
                if (this.fireEvent("beforeheaderzoom", this, c, i, a) !== false) {
                    c.zoomToSpan({
                        start: i,
                        end: a
                    });
                }
            }
        }
    },
    destroy: function() {
        if (this.proxy) {
            Ext.destroy(this.proxy);
            this.proxy = null;
        }
        this.callParent(arguments);
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.Pan", {
    extend: Ext.AbstractPlugin,
    alias: "plugin.scheduler_pan",
    lockableScope: "top",
    enableVerticalPan: true,
    statics: {
        KEY_SHIFT: 1,
        KEY_CTRL: 2,
        KEY_ALT: 4,
        KEY_ALL: 7
    },
    disableOnKey: 0,
    constructor: function(a) {
        Ext.apply(this, a);
    },
    init: function(a) {
        if (Ext.supports.Touch) {
            return;
        }
        this.view = a.getSchedulingView();
        this.view.on("afterrender", this.onRender, this);
    },
    onRender: function(a) {
        this.view.el.on("mousedown", this.onMouseDown, this);
    },
    onMouseDown: function(d, c) {
        var b = this.self, a = this.disableOnKey;
        if (d.shiftKey && a & b.KEY_SHIFT || d.ctrlKey && a & b.KEY_CTRL || d.altKey && a & b.KEY_ALT) {
            return;
        }
        if (d.getTarget(this.view.timeCellSelector, 10) && !d.getTarget(this.view.timeCellSelector + " > div > *")) {
            this.mouseX = d.getX();
            this.mouseY = d.getY();
            Ext.getBody().on("mousemove", this.onMouseMove, this);
            Ext.getDoc().on("mouseup", this.onMouseUp, this);
            if (Ext.isIE || Ext.isGecko) {
                Ext.getBody().on("mouseenter", this.onMouseUp, this);
            }
            d.stopEvent();
        }
    },
    onMouseMove: function(d) {
        if (this.disabled) {
            return;
        }
        d.stopEvent();
        var a = d.getX();
        var f = d.getY();
        var b = 0, c = this.mouseX - a;
        if (this.enableVerticalPan) {
            b = this.mouseY - f;
        }
        this.mouseX = a;
        this.mouseY = f;
        this.view.scrollBy(c, b, false);
        this.view.headerCt.getScrollable().scrollBy(c, b, false);
    },
    onMouseUp: function(a) {
        Ext.getBody().un("mousemove", this.onMouseMove, this);
        Ext.getDoc().un("mouseup", this.onMouseUp, this);
        if (Ext.isIE || Ext.isGecko) {
            Ext.getBody().un("mouseenter", this.onMouseUp, this);
        }
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.Printable", {
    extend: Ext.ux.Scheduler2.plugin.Export,
    alternateClassName: [ "Ext.ux.Scheduler2.plugin.Print" ],
    alias: [ "plugin.scheduler_printable", "plugin.scheduler_print" ],
    docType: "<!DOCTYPE HTML>",
    beforePrint: Ext.emptyFn,
    afterPrint: Ext.emptyFn,
    exportDialogConfig: {
        showDPIField: true
    },
    removeSecondaryCanvas: false,
    wrapHeaders: false,
    autoPrintAndClose: true,
    mainTpl: null,
    pageTpl: '{header}<div class="{componentClasses}" style="height:{bodyHeight}px; width:{totalWidth}px; position: relative !important">{HTML}</div>{footer}<div style="page-break-after:always;"></div>',
    openAfterExport: false,
    DPI: 72,
    fakeBackgroundColor: false,
    constructor: function(a) {
        Ext.apply(this, a);
        this.exportDialogConfig = Ext.apply({
            title: this.L("dialogTitle")
        }, this.exportDialogConfig);
        this.exportDialogConfig.l10n = Ext.apply({
            rangeFieldLabel: this.L("rangeFieldLabel"),
            exportersFieldLabel: this.L("exportersFieldLabel"),
            exportButtonText: this.L("exportButtonText")
        }, this.exportDialogConfig.l10n);
        if (!this.mainTpl) {
            this.mainTpl = new Ext.XTemplate('{docType}<html class="' + Ext.baseCSSPrefix + 'border-box {htmlClasses}"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type" /><title>{title}</title>{styles}</head><body class="sch2-print-body {bodyClasses}"><div class="sch2-print-ct" style="width:{totalWidth}px"><tpl for="pages">{html}</tpl></div><script type="text/javascript">{setupScript}</script></body></html>');
        }
        this.callParent(arguments);
    },
    init: function(a) {
        this.callParent(arguments);
        a.print = Ext.Function.bind(this.print, this);
    },
    getExporterConfig: function(c, b) {
        var d = this, a = d.callParent(arguments);
        return Ext.apply(a, {
            tpl: d.pageTpl
        });
    },
    getExportConfig: function(b) {
        var c = this, a = c.callParent(arguments);
        return Ext.apply(a, {
            beforeExport: Ext.Function.bind(c.beforePrint, c),
            afterExport: Ext.Function.bind(c.afterPrint, c)
        });
    },
    buildExporters: function() {
        return [ "Ext.ux.Scheduler2.plugin.exporter.MultiPage", "Ext.ux.Scheduler2.plugin.exporter.MultiPageVertical" ];
    },
    doRequest: Ext.emptyFn,
    onPagesExtracted: function(a, c, d, b) {
        this.fireEvent("updateprogressbar", .8, this.L("requestingPrintServer"));
        this.printPages(a, c, d, b);
    },
    print: function() {
        this.showExportDialog();
    },
    onBeforePageCommit: function(c, d, j, k) {
        var h = this.scheduler, f = h.lockedGrid, g = h.normalGrid, e = function(n) {
            return d.select("#" + n).first();
        };
        var a = d.select(c.normalBodySelector).first(), m = e(g.headerCt.id), i = d.select(c.lockedBodySelector).first(), b = e(f.headerCt.id);
        a.addCls([ "sch2-print-normal-rows-ct", this.fakeBackgroundColor ? " sch2-print-fake-background" : "" ]);
        i.addCls("sch2-print-locked-rows-ct");
        if (this.removeSecondaryCanvas) {
            d.select(".sch2-secondary-canvas").remove();
        }
        if (this.fakeBackgroundColor) {
            var l = a.select(".sch2-event");
            l.each(function(n) {
                n.setStyle("border-right-width", n.dom.style.width);
            });
        }
        m.addCls("sch2-print-normalheader");
        b.addCls("sch2-print-lockedheader");
        if (this.wrapHeaders) {
            m.wrap('<div class="sch2-print-header-wrap"></div>');
            b.wrap('<div class="sch2-print-header-wrap"></div>');
        }
    },
    prepareMainTplData: function(a) {
        return a;
    },
    printPages: function(b, d, g, c) {
        if (!this.mainTpl || !this.mainTpl.isTemplate) {
            this.mainTpl = new Ext.XTemplate(this.mainTpl, {
                compiled: true,
                disableFormats: true
            });
        }
        var f = g.getStylesheets(), a = Ext.getBody();
        var e = this.mainTpl.apply(this.prepareMainTplData({
            docType: this.docType,
            htmlClasses: a.parent().dom.className,
            bodyClasses: a.dom.className,
            title: d.title || "",
            styles: f,
            totalWidth: g.paperWidth,
            setupScript: "window.onload = function(){ (" + this.setupScript.toString() + ")(" + [ !!this.autoPrintAndClose, !!Ext.isChrome ] + "); };",
            pages: b
        }));
        var h = window.open("", "printgrid");
        if (!h || !h.document) {
            return false;
        }
        this.printWindow = h;
        h.document.write(e);
        h.document.close();
        this.onExportSuccess({
            success: true,
            url: "foo",
            htmlArray: [ e ]
        });
    },
    bindExporter: function(b) {
        var a = this;
        a.callParent(arguments);
        a.mon(b, {
            beforecommitpage: a.onBeforePageCommit,
            scope: a
        });
    },
    unbindExporter: function(b) {
        var a = this;
        a.callParent(arguments);
        a.mun(b, {
            beforecommitpage: a.onBeforePageCommit,
            scope: a
        });
    },
    setupScript: function(a, b) {
        document._loaded = true;
        if (a) {
            window.print();
            if (!b) {
                window.close();
            }
        }
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.SimpleEditor", {
    extend: Ext.Editor,
    alias: "plugin.scheduler_simpleeditor",
    mixins: [ Ext.AbstractPlugin, Ext.ux.Scheduler2.mixin.Localizable ],
    lockableScope: "top",
    cls: "sch2-simpleeditor",
    allowBlur: false,
    delegate: ".sch2-event-inner",
    dataIndex: null,
    completeOnEnter: true,
    cancelOnEsc: true,
    ignoreNoChange: true,
    height: 19,
    dragProxyEl: null,
    resourceRecord: null,
    newEventText: null,
    autoSize: {
        width: "boundEl"
    },
    initComponent: function() {
        this.field = this.field || {
            xtype: "textfield",
            selectOnFocus: true
        };
        this.callParent(arguments);
    },
    init: function(a) {
        this.scheduler = a.getSchedulingView();
        a.on("afterrender", this.onSchedulerRender, this);
        this.scheduler.registerEventEditor(this);
        this.dataIndex = this.dataIndex || this.scheduler.getEventStore().model.prototype.nameField;
    },
    edit: function(a, b) {
        b = b || this.scheduler.getElementsFromEventRecord(a)[0];
        this.startEdit(b.child(this.delegate));
        this.realign();
        this.record = a;
        this.setValue(this.record.get(this.dataIndex));
    },
    onSchedulerRender: function(a) {
        this.on({
            startedit: this.onStartEdit,
            complete: function(e, f, d) {
                var b = this.record;
                var c = this.scheduler.getEventStore();
                b.set(this.dataIndex, f);
                if (c.indexOf(b) < 0) {
                    if (this.scheduler.fireEvent("beforeeventadd", this.scheduler, b, [ this.resourceRecord ]) !== false) {
                        c.append(b);
                        b.assign(this.resourceRecord);
                        this.resourceRecord = null;
                    }
                }
                this.onAfterEdit();
            },
            canceledit: this.onAfterEdit,
            hide: function() {
                if (this.dragProxyEl) {
                    this.dragProxyEl.hide();
                }
            },
            scope: this
        });
        a.on({
            eventdblclick: function(b, c, d) {
                if (!a.isReadOnly()) {
                    this.edit(c);
                }
            },
            dragcreateend: this.onDragCreateEnd,
            scope: this
        });
    },
    onStartEdit: function() {
        if (!this.allowBlur) {
            Ext.getBody().on("mousedown", this.onMouseDown, this);
            this.scheduler.on("eventmousedown", function() {
                this.cancelEdit();
            }, this);
        }
    },
    onAfterEdit: function() {
        if (!this.allowBlur) {
            Ext.getBody().un("mousedown", this.onMouseDown, this);
            this.scheduler.un("eventmousedown", function() {
                this.cancelEdit();
            }, this);
        }
    },
    onMouseDown: function(b, a) {
        if (this.editing && this.el && !b.within(this.el)) {
            this.cancelEdit();
        }
    },
    onDragCreateEnd: function(c, b, d, f, a) {
        this.dragProxyEl = a;
        this.resourceRecord = d;
        this.scheduler.onEventCreated(b);
        if (b.get(this.dataIndex) === "") {
            b.set(this.dataIndex, this.newEventText || this.L("newEventText"));
        }
        this.edit(b, this.dragProxyEl);
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.TimeGap", {
    extend: Ext.ux.Scheduler2.plugin.Zones,
    alias: "plugin.scheduler_timegap",
    getZoneCls: Ext.emptyFn,
    eventStoreListeners: null,
    init: function(a) {
        this.store = new Ext.data.JsonStore({
            model: "Ext.ux.Scheduler2.model.Range"
        });
        this.scheduler = a;
        this.setEventStore(a.getEventStore());
        a.on({
            afterrender: this.populateStore,
            eventstorechange: function(b, c) {
                this.setEventStore(c);
                this.populateStore();
            },
            scope: this
        });
        this.schedulerView = a.getSchedulingView();
        this.callParent(arguments);
    },
    setEventStore: function(a) {
        this.eventStoreListeners && this.eventStoreListeners.destroy();
        this.eventStoreListeners = this.mon(a, {
            load: this.populateStore,
            update: this.populateStore,
            remove: this.populateStore,
            add: this.populateStore,
            datachanged: this.populateStore,
            destroyable: true,
            scope: this
        });
    },
    populateStore: function(c) {
        var b = this.schedulerView.getEventsInView(), f = [], e = this.scheduler.getStart(), i = this.scheduler.getEnd(), d = b.getCount(), j = e, g = 0, h, a;
        b.sortBy(function(l, k) {
            return l.getStartDate() - k.getStartDate();
        });
        a = b.getAt(0);
        while (j < i && g < d) {
            h = a.getStartDate();
            if (!Ext.ux.Scheduler2.util.Date.betweenLesser(j, h, a.getEndDate()) && j < h) {
                f.push(new this.store.model({
                    StartDate: j,
                    EndDate: h,
                    Cls: this.getZoneCls(j, h) || ""
                }));
            }
            j = Ext.ux.Scheduler2.util.Date.max(a.getEndDate(), j);
            g++;
            a = b.getAt(g);
        }
        if (j < i) {
            f.push({
                StartDate: j,
                EndDate: i,
                Cls: this.getZoneCls(j, i) || ""
            });
        }
        this.store.removeAll(f.length > 0);
        this.store.add(f);
    }
});

Ext.define("Ext.ux.Scheduler2.plugin.TreeCellEditing", {
    extend: Ext.grid.plugin.CellEditing,
    alias: "plugin.scheduler_treecellediting",
    lockableScope: "locked",
    editorsStarted: 0,
    init: function() {
        this.on("beforeedit", this.onMyBeforeEdit, this);
        this.callParent(arguments);
    },
    activateCell: function(a) {
        var b = this.callParent(arguments);
        if (b) {
            var c = this.getEditor(a.record, a.column);
            if (c && !c._cancelEdit) {
                c._cancelEdit = c.cancelEdit;
                c.cancelEdit = this.myCancelEdit;
            }
            this.fireEvent("editingstart", this, c);
        }
        return b;
    },
    checkReadOnly: function() {
        var a = this.getCmp();
        if (a) {
            if (!a.isTimelineTreePanel && !a.isTimelineGridPanel) {
                a = a.up("tablepanel");
            }
            return !a.isReadOnly();
        }
    },
    onEditComplete: function(b, d, a) {
        var c = this;
        if (b.field.applyChanges) {
            b.field.applyChanges(b.field.task || c.context.record);
            return c.callParent([ b, d, d ]);
        } else {
            return c.callParent([ b, d, a ]);
        }
    },
    myCancelEdit: function() {
        var b = this, d = b.field;
        if (d && d.applyChanges) {
            var c = d.instantUpdate;
            d.instantUpdate = true;
            var a = b._cancelEdit.apply(this, arguments);
            d.instantUpdate = c;
            return a;
        } else {
            return b._cancelEdit.apply(this, arguments);
        }
    },
    onMyBeforeEdit: function(b, a) {
        var c = a.column.getEditor();
        if (c && c.setTask) {
            c.setTask(a.record);
            a.value = a.originalValue = c.getValue();
        }
        return this.checkReadOnly();
    }
});

Ext.define("Ext.ux.Scheduler2.preset.ViewPresetHeaderRow", {});

Ext.define("Ext.ux.Scheduler2.util.Debug", {
    singleton: true,
    runDiagnostics: function() {
        var d;
        var k = this;
        var b = window.console;
        if (b && b.log) {
            d = function() {
                b.log.apply(b, arguments);
            };
        } else {
            if (!k.schedulerDebugWin) {
                k.schedulerDebugWin = new Ext.Window({
                    height: 400,
                    width: 500,
                    bodyStyle: "padding:10px",
                    closeAction: "hide",
                    autoScroll: true
                });
            }
            k.schedulerDebugWin.show();
            k.schedulerDebugWin.update("");
            d = function(i) {
                k.schedulerDebugWin.update((k.schedulerDebugWin.body.dom.innerHTML || "") + i + "<br/>");
            };
        }
        var e = Ext.select(".sch2-schedulerpanel");
        if (e.getCount() === 0) {
            d("No scheduler component found");
        }
        var p = Ext.getCmp(e.elements[0].id), n = p.getResourceStore(), c = p.getEventStore();
        if (!c.isEventStore) {
            d("Your event store must be or extend Ext.ux.Scheduler2.data.EventStore");
        }
        d("Scheduler view start: " + p.getStart() + ", end: " + p.getEnd());
        if (!n) {
            d("No store configured");
            return;
        }
        if (!c) {
            d("No event store configured");
            return;
        }
        var g = new Ext.util.MixedCollection(), j = new Ext.util.MixedCollection();
        for (var f = 0; f < c.model.prototype.fields.length; f++) {
            g.add(c.model.prototype.fields[f].name, c.model.prototype.fields[f]);
        }
        for (f = 0; f < n.model.prototype.fields.length; f++) {
            j.add(n.model.prototype.fields[f].name, n.model.prototype.fields[f]);
        }
        d(n.getCount() + " records in the resource store");
        d(c.getCount() + " records in the eventStore");
        var o = c.model.prototype.idProperty;
        var a = n.model.prototype.idProperty;
        var m = g.getByKey(o);
        var h = j.getByKey(a);
        if (!(new c.model() instanceof Ext.ux.Scheduler2.model.Event)) {
            d("Your event model must extend Ext.ux.Scheduler2.model.Event");
        }
        if (!(new n.model() instanceof Ext.ux.Scheduler2.model.Resource)) {
            d("Your resource model must extend Ext.ux.Scheduler2.model.Resource");
        }
        if (!m) {
            d("idProperty on the event model is incorrectly setup, value: " + o);
        }
        if (!h) {
            d("idProperty on the resource model is incorrectly setup, value: " + a);
        }
        var l = p.getSchedulingView();
        d(l.el.select(l.eventSelector).getCount() + " events present in the DOM");
        if (c.getCount() > 0) {
            if (!c.first().getStartDate() || !(c.first().getStartDate() instanceof Date)) {
                d("The eventStore reader is misconfigured - The StartDate field is not setup correctly, please investigate");
                d("StartDate is configured with dateFormat: " + g.getByKey(c.model.prototype.startDateField).dateFormat);
                d("See Ext JS docs for information about different date formats: http://docs.sencha.com/extjs/#!/api/Ext.Date");
            }
            if (!c.first().getEndDate() || !(c.first().getEndDate() instanceof Date)) {
                d("The eventStore reader is misconfigured - The EndDate field is not setup correctly, please investigate");
                d("EndDate is configured with dateFormat: " + g.getByKey(c.model.prototype.endDateField).dateFormat);
                d("See Ext JS docs for information about different date formats: http://docs.sencha.com/extjs/#!/api/Ext.Date");
            }
            if (c.proxy && c.proxy.reader && c.proxy.reader.jsonData) {
                d("Dumping jsonData to console");
                console && console.dir && console.dir(c.proxy.reader.rawData);
            }
            d("Records in the event store:");
            c.each(function(s, q) {
                d(q + 1 + ". " + s.startDateField + ":" + s.getStartDate() + ", " + s.endDateField + ":" + s.getEndDate() + ", " + s.resourceIdField + ":" + s.getResourceId());
                if (!s.getStartDate()) {
                    d(s.getStartDate());
                }
            });
        } else {
            d("Event store has no data. Has it been loaded properly?");
        }
        if (Ext.data.TreeStore && n instanceof Ext.data.TreeStore) {
            n = n.nodeStore;
        }
        if (n.getCount() > 0) {
            d("Records in the resource store:");
            n.each(function(s, q) {
                d(q + 1 + ". " + s.idProperty + ":" + s.getId());
                return;
            });
        } else {
            d("Resource store has no data.");
            return;
        }
        d("Everything seems to be setup ok!");
    }
});

Ext.define("Ext.ux.Scheduler2.widget.PagingToolbar", {
    extend: Ext.toolbar.Paging,
    alias: "widget.sch_pagingtoolbar",
    getStoreId: function() {
        if (this.storeId) {
            return this.storeId;
        }
        var a = this.store.storeId;
        if (!a) {
            var c = this.store.crudManager;
            var b = c && c.getStore(this.store);
            a = b && b.storeId;
        }
        this.storeId = a;
        return a;
    },
    loadPage: function(c) {
        var b = this;
        if (b.store.crudManager) {
            var a = b.getStoreId();
            if (a) {
                var d = {};
                d[a] = {
                    pageSize: b.store.pageSize,
                    page: c
                };
                b.store.crudManager.load(d);
            }
        } else {
            b.store.loadPage(c);
        }
    },
    onPagingKeyDown: function(h, g) {
        var d = this, b = g.getKey(), c = d.getPageData(), a = g.shiftKey ? 10 : 1, f;
        if (b == g.RETURN) {
            g.stopEvent();
            f = d.readPageFromInput(c);
            if (f !== false) {
                f = Math.min(Math.max(1, f), c.pageCount);
                if (d.fireEvent("beforechange", d, f) !== false) {
                    d.loadPage(f);
                }
            }
        } else {
            if (b == g.HOME || b == g.END) {
                g.stopEvent();
                f = b == g.HOME ? 1 : c.pageCount;
                h.setValue(f);
            } else {
                if (b == g.UP || b == g.PAGE_UP || b == g.DOWN || b == g.PAGE_DOWN) {
                    g.stopEvent();
                    f = d.readPageFromInput(c);
                    if (f) {
                        if (b == g.DOWN || b == g.PAGE_DOWN) {
                            a *= -1;
                        }
                        f += a;
                        if (f >= 1 && f <= c.pageCount) {
                            h.setValue(f);
                        }
                    }
                }
            }
        }
    },
    moveFirst: function() {
        if (this.fireEvent("beforechange", this, 1) !== false) {
            this.loadPage(1);
        }
    },
    movePrevious: function() {
        var b = this, a = b.store.currentPage - 1;
        if (a > 0) {
            if (b.fireEvent("beforechange", b, a) !== false) {
                b.loadPage(a);
            }
        }
    },
    moveNext: function() {
        var c = this, b = c.getPageData().pageCount, a = c.store.currentPage + 1;
        if (a <= b) {
            if (c.fireEvent("beforechange", c, a) !== false) {
                c.loadPage(a);
            }
        }
    },
    moveLast: function() {
        var b = this, a = b.getPageData().pageCount;
        if (b.fireEvent("beforechange", b, a) !== false) {
            b.loadPage(a);
        }
    },
    doRefresh: function() {
        var a = this, b = a.store.currentPage;
        if (a.fireEvent("beforechange", a, b) !== false) {
            a.loadPage(b);
        }
    }
});

Ext.data.Connection.override({
    parseStatus: function(b) {
        var a = this.callOverridden(arguments);
        if (b === 0) {
            a.success = true;
        }
        return a;
    }
});
