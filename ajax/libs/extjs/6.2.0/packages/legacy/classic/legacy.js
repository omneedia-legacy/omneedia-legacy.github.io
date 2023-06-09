Ext.define("Ext.data.proxy.Sql", { alias: "proxy.sql", extend: "Ext.data.proxy.Client", alternateClassName: "Ext.data.proxy.SQL", isSQLProxy: true, config: { reader: null, writer: null, table: null, database: "Sencha" }, _createOptions: { silent: true, dirty: false }, updateModel: function(c) { var g = this,
            b, a, e, d, f; if (c) { g.uniqueIdStrategy = c.identifier.isUnique; if (!g.getTable()) { b = c.entityName;
                g.setTable(b.slice(b.lastIndexOf(".") + 1)) }
            g.columns = d = g.getPersistedModelColumns(c);
            g.quotedColumns = f = []; for (e = 0, a = d.length; e < a; ++e) { f.push('"' + d[e] + '"') } }
        g.callParent([c]) }, setException: function(a, b) { a.setException(b) }, create: function(c) { var e = this,
            b = c.getRecords(),
            a, d;
        c.setStarted();
        e.executeTransaction(function(f) { e.insertRecords(b, f, function(h, g) { a = h;
                d = g }) }, function(f) { c.setException(f) }, function() { if (d) { c.setException(statementError) } else { c.process(a) } }) }, read: function(d) { var g = this,
            e = g.getModel(),
            b = d.getRecords(),
            f = b ? b[0] : null,
            i, h, a, c; if (f && !f.phantom) { a = f.getId() } else { a = d.getId() } if (a !== undefined) { c = { idOnly: true, id: a } } else { c = { page: d.getPage(), start: d.getStart(), limit: d.getLimit(), sorters: d.getSorters(), filters: d.getFilters() } }
        d.setStarted();
        g.executeTransaction(function(j) { g.selectRecords(j, c, function(l, k) { i = l;
                h = k }) }, function(j) { d.setException(j) }, function() { if (h) { d.setException(statementError) } else { d.process(i) } }) }, update: function(c) { var e = this,
            b = c.getRecords(),
            a, d;
        c.setStarted();
        e.executeTransaction(function(f) { e.updateRecords(f, b, function(h, g) { a = h;
                d = g }) }, function(f) { c.setException(f) }, function() { if (d) { c.setException(statementError) } else { c.process(a) } }) }, erase: function(c) { var e = this,
            b = c.getRecords(),
            a, d;
        c.setStarted();
        e.executeTransaction(function(f) { e.destroyRecords(f, b, function(h, g) { a = h;
                d = g }) }, function(f) { c.setException(f) }, function() { if (d) { c.setException(d) } else { c.process(a) } }) }, createTable: function(b) { var a = this; if (!b) { a.executeTransaction(function(c) { a.createTable(c) }); return }
        a.executeStatement(b, 'CREATE TABLE IF NOT EXISTS "' + a.getTable() + '" (' + a.getSchemaString() + ")", function() { a.tableExists = true }) }, insertRecords: function(k, l, d) { var q = this,
            a = q.columns,
            h = k.length,
            s = 0,
            p = q.uniqueIdStrategy,
            o = q._createOptions,
            n = k.length,
            j, c, e, m, r, b, f, g;
        g = function(i) {++s; if (s === h) { d.call(q, new Ext.data.ResultSet({ success: !f }), f) } };
        e = Ext.String.repeat("?", a.length, ",");
        m = 'INSERT INTO "' + q.getTable() + '" (' + q.quotedColumns.join(",") + ") VALUES (" + e + ")"; for (j = 0; j < n; ++j) { c = k[j];
            r = q.getRecordData(c);
            b = q.getColumnValues(a, r);
            (function(i) { q.executeStatement(l, m, b, function(u, t) { if (!p) { i.setId(t.insertId, o) }
                    g() }, function(u, t) { if (!f) { f = [] }
                    f.push(t);
                    g() }) })(c) } }, selectRecords: function(s, v, e, c) { var w = this,
            l = w.getModel(),
            j = l.idProperty,
            t = 'SELECT * FROM "' + w.getTable() + '"',
            a = " WHERE ",
            o = " ORDER BY ",
            d = [],
            b, k, f, r, u, n, m, q, g, h, p; if (v.idOnly) { t += a + '"' + j + '" = ?';
            d.push(v) } else { k = v.filters;
            u = k && k.length; if (u) { for (r = 0; r < u; r++) { m = k[r];
                    g = m.getProperty();
                    p = w.toSqlValue(m.getValue(), l.getField(g));
                    h = m.getOperator(); if (g !== null) { h = h || "=";
                        f = "?"; if (h === "like" || (h === "=" && m.getAnyMatch())) { h = "LIKE";
                            p = "%" + p + "%" } if (h === "in" || h === "notin") { if (h === "notin") { h = "not in" }
                            f = "(" + Ext.String.repeat("?", p.length, ",") + ")";
                            d = d.concat(p) } else { d.push(p) }
                        t += a + '"' + g + '" ' + h + " " + f;
                        a = " AND " } } }
            b = v.sorters;
            u = b && b.length; if (u) { for (r = 0; r < u; r++) { q = b[r];
                    g = q.getProperty(); if (g !== null) { t += o + '"' + g + '" ' + q.getDirection();
                        o = ", " } } } if (v.page !== undefined) { t += " LIMIT " + parseInt(v.start, 10) + ", " + parseInt(v.limit, 10) } }
        w.executeStatement(s, t, d, function(z, I) { var K = I.rows,
                G = K.length,
                A = [],
                E = l.fields,
                y = E.length,
                J, D, C, F, B, H, x; for (C = 0, F = G; C < F; ++C) { J = K.item(C);
                D = {}; for (B = 0; B < y; ++B) { H = E[B];
                    x = H.name;
                    D[x] = w.fromSqlValue(J[x], H) }
                A.push(new l(D)) }
            e.call(w, new Ext.data.ResultSet({ records: A, success: true, total: G, count: G })) }, function(x, i) { e.call(w, new Ext.data.ResultSet({ success: false, total: 0, count: 0 }), i) }) }, updateRecords: function(n, m, d) { var r = this,
            a = r.columns,
            j = r.quotedColumns,
            k = m.length,
            t = 0,
            g = [],
            q = r._createOptions,
            p, l, c, e, o, s, b, f, h;
        h = function(i) {++t; if (t === k) { d.call(r, new Ext.data.ResultSet({ success: !f }), f) } }; for (l = 0, p = j.length; l < p; l++) { g.push(j[l] + " = ?") }
        o = 'UPDATE "' + r.getTable() + '" SET ' + g.join(", ") + ' WHERE "' + r.getModel().idProperty + '" = ?'; for (l = 0, p = m.length; l < p; ++l) { c = m[l];
            s = r.getRecordData(c);
            b = r.getColumnValues(a, s);
            b.push(c.getId());
            (function(i) { r.executeStatement(n, o, b, function(v, u) { h() }, function(v, u) { if (!f) { f = [] }
                    f.push(u);
                    h() }) })(c) } }, destroyRecords: function(b, c, l) { var j = this,
            m = j.getTable(),
            n = j.getModel().idProperty,
            a = [],
            k = [],
            d = [],
            h = c.length,
            g = '"' + n + '" = ?',
            e, p, f, o; for (e = 0; e < h; e++) { a.push(g);
            k.push(c[e].getId()) }
        o = 'DELETE FROM "' + j.getTable() + '" WHERE ' + a.join(" OR ");
        j.executeStatement(b, o, k, function(q, i) { l.call(j, new Ext.data.ResultSet({ success: true })) }, function(q, i) { l.call(j, new Ext.data.ResultSet({ success: false }), i) }) }, getRecordData: function(e) { var j = this,
            g = e.fields,
            m = e.idProperty,
            f = j.uniqueIdStrategy,
            d = {},
            h = g.length,
            b = e.data,
            c, a, l, k; for (c = 0; c < h; ++c) { k = g[c]; if (k.persist !== false) { a = k.name; if (a === m && !f) { continue }
                d[a] = j.toSqlValue(b[a], k) } } return d }, getColumnValues: function(d, g) { var a = d.length,
            b = [],
            c, e, f; for (c = 0; c < a; c++) { e = d[c];
            f = g[e]; if (f !== undefined) { b.push(f) } } return b }, getSchemaString: function() { var j = this,
            b = [],
            d = j.getModel(),
            l = d.idProperty,
            f = d.fields,
            e = j.uniqueIdStrategy,
            g = f.length,
            c, k, h, a; for (c = 0; c < g; c++) { k = f[c];
            h = k.getType();
            a = k.name; if (a === l) { if (e) { h = j.convertToSqlType(h);
                    b.unshift('"' + l + '" ' + h) } else { b.unshift('"' + l + '" INTEGER PRIMARY KEY AUTOINCREMENT') } } else { h = j.convertToSqlType(h);
                b.push('"' + a + '" ' + h) } } return b.join(", ") }, convertToSqlType: function(a) { switch (a.toLowerCase()) {
            case "string":
            case "auto":
                return "TEXT";
            case "int":
            case "date":
                return "INTEGER";
            case "float":
                return "REAL";
            case "bool":
                return "NUMERIC" } }, dropTable: function() { var a = this;
        a.executeTransaction(function(b) { a.executeStatement(b, 'DROP TABLE "' + a.getTable() + '"', function() { a.tableExists = false }) }, null, null, false) }, getDatabaseObject: function() { return window.openDatabase(this.getDatabase(), "1.0", "Sencha Database", 5 * 1024 * 1024) }, privates: { executeStatement: function(f, e, a, d, b) { var c = this;
            f.executeSql(e, a, d ? function() { d.apply(c, arguments) } : null, b ? function() { b.apply(c, arguments) } : null) }, executeTransaction: function(c, a, e, d) { var b = this;
            d = d !== false;
            b.getDatabaseObject().transaction(c ? function(f) { if (d && !b.tableExists) { b.createTable(f) }
                c.apply(b, arguments) } : null, a ? function() { a.apply(b, arguments) } : null, e ? function() { e.apply(b, arguments) } : null) }, fromSqlValue: function(a, b) { if (b.isDateField) { a = a ? new Date(a) : null } else { if (b.isBooleanField) { a = a === 1 } } return a }, getPersistedModelColumns: function(d) { var f = d.fields,
                e = this.uniqueIdStrategy,
                j = d.idProperty,
                b = [],
                g = f.length,
                c, h, a; for (c = 0; c < g; ++c) { h = f[c];
                a = h.name; if (a === j && !e) { continue } if (h.persist !== false) { b.push(h.name) } } return b }, toSqlValue: function(a, b) { if (b.isDateField) { a = a ? a.getTime() : null } else { if (b.isBooleanField) { a = a ? 1 : 0 } } return a } } });