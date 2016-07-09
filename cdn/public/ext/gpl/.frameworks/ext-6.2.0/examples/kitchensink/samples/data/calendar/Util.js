Ext.define('KitchenSink.data.calendar.Util', {
    singleton: true,

    filter: function(data, start, end) {
        var R = Ext.calendar.date.Range,
            range = new R(start, end);

        return Ext.Array.filter(data, function(event) {
            return range.overlaps(R.fly(event.startDate, event.endDate));
        });
    },

    find: function(base, d, incr) {
        var D = Ext.Date;

        base = D.clone(base);

        while (base.getDay() !== d) {
            base = D.add(base, D.DAY, incr);
        }
        return base;
    },

    findNext: function(base, d) {
        return this.find(base, d, 1);
    },

    findPrevious: function(base, d) {
        return this.find(base, d, -1);
    },

    generateIds: function(data, start) {
        Ext.Array.forEach(data, function(item) {
            item.id = ++start;
        });
        return data;
    },

    generateOutput: function(data, calendarId, ctx) {
        var filtered = this.filter(data, ctx.params.startDate, ctx.params.endDate);
        return this.prepare(filtered, calendarId);
    },

    prepare: function(data, calendarId) {
        var D = Ext.Date;

        return Ext.Array.map(data, function(event) {
            event = Ext.apply({}, event);
            event.calendarId = calendarId;
            event.startDate = D.format(event.startDate, 'C');
            event.endDate = D.format(event.endDate, 'C');
            return event;
        });
    },

    setDate: function(base, d, h, m) {
        var ret = Ext.Date.clone(base);
        if (d !== undefined) {
            ret.setUTCDate(d);
        }

        if (h !== undefined) {
            ret.setUTCHours(h);
        }

        if (m !== undefined) {
            ret.setUTCMinutes(m);
        }
        return ret;
    },

    setHours: function(base, h, m) {
        return this.setDate(base, undefined, h, m);
    },

    utcNow: function() {
        var now = new Date();
        return Ext.Date.utc(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );
    }
});