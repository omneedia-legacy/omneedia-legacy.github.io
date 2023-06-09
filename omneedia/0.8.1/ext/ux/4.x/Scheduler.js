Ext.define("Ext.ux.Scheduler.locale.Locale", {
  l10n: null,
  legacyMode: true,
  localeName: null,
  namespaceId: null,
  constructor: function() {
    if (!Ext.ux.Scheduler.locale.Active) {
      Ext.ux.Scheduler.locale.Active = {};
      this.bindRequire()
    }
    var b = this.self.getName().split(".");
    var a = this.localeName = b.pop();
    this.namespaceId = b.join(".");
    var c = Ext.ux.Scheduler.locale.Active[this.namespaceId];
    if (!(a == "En" && c && c.localeName != "En")) {
      this.apply()
    }
  },
  bindRequire: function() {
    var a = Ext.ClassManager.triggerCreated;
    Ext.ClassManager.triggerCreated = function(d) {
      a.apply(this, arguments);
      var c = Ext.ClassManager.get(d);
      for (var b in Ext.ux.Scheduler.locale.Active) {
        Ext.ux.Scheduler.locale.Active[b].apply(c)
      }
    }
  },
  apply: function(a) {
    if (this.l10n) {
      var h = this,
        f, e;
      var g = this.self.getName();
      var d = function(l, k) {
        k = k || Ext.ClassManager.get(l);
        if (k && (k.activeLocaleId !== g)) {
          var i = h.l10n[l];
          if (typeof i === "function") {
            i(l)
          } else {
            if (k.singleton) {
              k.l10n = Ext.apply(k.l10n || {}, i)
            } else {
              Ext.override(k, {
                l10n: i
              })
            }
          }
          if (h.legacyMode) {
            var n;
            if (k.prototype) {
              n = k.prototype
            } else {
              if (k.singleton) {
                n = k
              }
            }
            if (n) {
              if (n.legacyHolderProp) {
                if (!n[n.legacyHolderProp]) {
                  n[n.legacyHolderProp] = {}
                }
                n = n[n.legacyHolderProp]
              }
              for (var m in i) {
                if (typeof n[m] !== "function") {
                  n[m] = i[m]
                }
              }
            }
          }
          k.activeLocaleId = g;
          if (k.onLocalized) {
            k.onLocalized()
          }
        }
      };
      if (a) {
        if (!Ext.isArray(a)) {
          a = [a]
        }
        var b, j;
        for (f = 0, e = a.length; f < e; f++) {
          if (Ext.isObject(a[f])) {
            if (a[f].singleton) {
              j = a[f];
              b = Ext.getClassName(Ext.getClass(j))
            } else {
              j = Ext.getClass(a[f]);
              b = Ext.getClassName(j)
            }
          } else {
            j = null;
            b = "string" === typeof a[f] ? a[f] : Ext.getClassName(a[f])
          }
          if (b && b in this.l10n) {
            d(b, j)
          }
        }
      } else {
        Ext.ux.Scheduler.locale.Active[this.namespaceId] = this;
        for (var c in this.l10n) {
          d(c)
        }
      }
    }
  }
});
Ext.define("Ext.ux.Scheduler.locale.En", {
  extend: "Ext.ux.Scheduler.locale.Locale",
  singleton: true,
  l10n: {
    "Ext.ux.Scheduler.util.Date": {
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
          abbrev: "s"
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
    "Ext.ux.Scheduler.view.SchedulerGridView": {
      loadingText: "Loading events..."
    },
    "Ext.ux.Scheduler.plugin.CurrentTimeLine": {
      tooltipText: "Current time"
    },
    "Ext.ux.Scheduler.plugin.EventEditor": {
      saveText: "Save",
      deleteText: "Delete",
      cancelText: "Cancel"
    },
    "Ext.ux.Scheduler.plugin.SimpleEditor": {
      newEventText: "New booking..."
    },
    "Ext.ux.Scheduler.widget.ExportDialog": {
      generalError: "An error occured, try again.",
      title: "Export Settings",
      formatFieldLabel: "Paper format",
      orientationFieldLabel: "Orientation",
      rangeFieldLabel: "Export range",
      showHeaderLabel: "Add page number",
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
      exportToSingleLabel: "Export as single page",
      adjustCols: "Adjust column width",
      adjustColsAndRows: "Adjust column width and row height",
      specifyDateRange: "Specify date range"
    },
    "Ext.ux.Scheduler.preset.Manager": function() {
      var b = Ext.ux.Scheduler.preset.Manager,
        a = b.getPreset("hourAndDay");
      if (a) {
        a.displayDateFormat = "G:i";
        a.headerConfig.middle.dateFormat = "G:i";
        a.headerConfig.top.dateFormat = "D d/m"
      }
      a = b.getPreset("secondAndMinute");
      if (a) {
        a.displayDateFormat = "g:i:s";
        a.headerConfig.top.dateFormat = "D, d g:iA"
      }
      a = b.getPreset("dayAndWeek");
      if (a) {
        a.displayDateFormat = "m/d h:i A";
        a.headerConfig.middle.dateFormat = "D d M"
      }
      a = b.getPreset("weekAndDay");
      if (a) {
        a.displayDateFormat = "m/d";
        a.headerConfig.bottom.dateFormat = "d M";
        a.headerConfig.middle.dateFormat = "Y F d"
      }
      a = b.getPreset("weekAndMonth");
      if (a) {
        a.displayDateFormat = "m/d/Y";
        a.headerConfig.middle.dateFormat = "m/d";
        a.headerConfig.top.dateFormat = "m/d/Y"
      }
      a = b.getPreset("weekAndDayLetter");
      if (a) {
        a.displayDateFormat = "m/d/Y";
        a.headerConfig.middle.dateFormat = "D d M Y"
      }
      a = b.getPreset("weekDateAndMonth");
      if (a) {
        a.displayDateFormat = "m/d/Y";
        a.headerConfig.middle.dateFormat = "d";
        a.headerConfig.top.dateFormat = "Y F"
      }
      a = b.getPreset("monthAndYear");
      if (a) {
        a.displayDateFormat = "m/d/Y";
        a.headerConfig.middle.dateFormat = "M Y";
        a.headerConfig.top.dateFormat = "Y"
      }
      a = b.getPreset("year");
      if (a) {
        a.displayDateFormat = "m/d/Y";
        a.headerConfig.middle.dateFormat = "Y"
      }
      a = b.getPreset("manyYears");
      if (a) {
        a.displayDateFormat = "m/d/Y";
        a.headerConfig.middle.dateFormat = "Y"
      }
    }
  }
});
Ext.define("Ext.ux.Scheduler.util.Patch", {
  target: null,
  minVersion: null,
  maxVersion: null,
  reportUrl: null,
  description: null,
  applyFn: null,
  ieOnly: false,
  overrides: null,
  onClassExtended: function(a, b) {
    if (Ext.ux.Scheduler.disableOverrides) {
      return
    }
    if (b.ieOnly && !Ext.isIE) {
      return
    }
    if ((!b.minVersion || Ext.versions.extjs.equals(b.minVersion) || Ext.versions.extjs.isGreaterThan(b.minVersion)) && (!b.maxVersion || Ext.versions.extjs.equals(b.maxVersion) || Ext.versions.extjs.isLessThan(b.maxVersion))) {
      if (b.applyFn) {
        b.applyFn()
      } else {
        Ext.ClassManager.get(b.target).override(b.overrides)
      }
    }
  }
});
Ext.define("Ext.ux.Scheduler.patches.ColumnResize", {
  override: "Ext.ux.Scheduler.panel.TimelineGridPanel",
  afterRender: function() {
    this.callParent(arguments);
    var a = this.lockedGrid.headerCt.findPlugin("gridheaderresizer");
    if (a) {
      a.getConstrainRegion = function() {
        var d = this,
          b = d.dragHd.el,
          c;
        if (d.headerCt.forceFit) {
          c = d.dragHd.nextNode("gridcolumn:not([hidden]):not([isGroupHeader])");
          if (!d.headerInSameGrid(c)) {
            c = null
          }
        }
        return d.adjustConstrainRegion(Ext.util.Region.getRegion(b), 0, d.headerCt.forceFit ? (c ? c.getWidth() - d.minColWidth : 0) : d.maxColWidth - b.getWidth(), 0, d.minColWidth)
      }
    }
  }
});
Ext.define("Ext.ux.Scheduler.patches.ColumnResizeTree", {
  override: "Ext.ux.Scheduler.panel.TimelineTreePanel",
  afterRender: function() {
    this.callParent(arguments);
    var a = this.lockedGrid.headerCt.findPlugin("gridheaderresizer");
    if (a) {
      a.getConstrainRegion = function() {
        var d = this,
          b = d.dragHd.el,
          c;
        if (d.headerCt.forceFit) {
          c = d.dragHd.nextNode("gridcolumn:not([hidden]):not([isGroupHeader])");
          if (!d.headerInSameGrid(c)) {
            c = null
          }
        }
        return d.adjustConstrainRegion(Ext.util.Region.getRegion(b), 0, d.headerCt.forceFit ? (c ? c.getWidth() - d.minColWidth : 0) : d.maxColWidth - b.getWidth(), 0, d.minColWidth)
      }
    }
  }
});
if (!Ext.ClassManager.get("Ext.ux.Scheduler.patches.ElementScroll")) {
  Ext.define("Ext.ux.Scheduler.patches.ElementScroll", {
    override: "Ext.ux.Scheduler.mixin.TimelineView",
    _onAfterRender: function() {
      this.callParent(arguments);
      if (Ext.versions.extjs.isLessThan("4.2.1") || Ext.versions.extjs.isGreaterThan("4.2.2")) {
        return
      }
      this.el.scroll = function(i, a, c) {
        if (!this.isScrollable()) {
          return false
        }
        i = i.substr(0, 1);
        var h = this,
          e = h.dom,
          g = i === "r" || i === "l" ? "left" : "top",
          b = false,
          d, f;
        if (i === "r" || i === "t" || i === "u") {
          a = -a
        }
        if (g === "left") {
          d = e.scrollLeft;
          f = h.constrainScrollLeft(d + a)
        } else {
          d = e.scrollTop;
          f = h.constrainScrollTop(d + a)
        }
        if (f !== d) {
          this.scrollTo(g, f, c);
          b = true
        }
        return b
      }
    }
  })
}
Ext.define("Ext.ux.Scheduler.mixin.Localizable", {
  requires: ["Ext.ux.Scheduler.locale.En"],
  legacyMode: true,
  activeLocaleId: "",
  l10n: null,
  isLocaleApplied: function() {
    var b = (this.singleton && this.activeLocaleId) || this.self.activeLocaleId;
    if (!b) {
      return false
    }
    for (var a in Ext.ux.Scheduler.locale.Active) {
      if (b === Ext.ux.Scheduler.locale.Active[a].self.getName()) {
        return true
      }
    }
    return false
  },
  applyLocale: function() {
    for (var a in Ext.ux.Scheduler.locale.Active) {
      Ext.ux.Scheduler.locale.Active[a].apply(this.singleton ? this : this.self.getName())
    }
  },
  L: function() {
    return this.localize.apply(this, arguments)
  },
  localize: function(b, d, g) {
    if (!this.isLocaleApplied() && !g) {
      this.applyLocale()
    }
    if (this.hasOwnProperty("l10n") && this.l10n.hasOwnProperty(b) && "function" != typeof this.l10n[b]) {
      return this.l10n[b]
    }
    var c = this.self && this.self.prototype;
    if (this.legacyMode) {
      var a = d || this.legacyHolderProp;
      var h = a ? this[a] : this;
      if (h && h.hasOwnProperty(b) && "function" != typeof h[b]) {
        return h[b]
      }
      if (c) {
        var e = a ? c[a] : c;
        if (e && e.hasOwnProperty(b) && "function" != typeof e[b]) {
          return e[b]
        }
      }
    }
    var i = c.l10n[b];
    if (i === null || i === undefined) {
      var f = c && c.superclass;
      if (f && f.localize) {
        i = f.localize(b, d, g)
      }
      if (i === null || i === undefined) {
        throw "Cannot find locale: " + b + " [" + this.self.getName() + "]"
      }
    }
    return i
  }
});
Ext.define("Ext.ux.Scheduler.tooltip.ClockTemplate", {
  extend: "Ext.XTemplate",
  constructor: function() {
    var i = Math.PI / 180,
      l = Math.cos,
      j = Math.sin,
      m = 7,
      c = 2,
      d = 10,
      k = 6,
      f = 3,
      a = 10,
      e = Ext.isIE && (Ext.isIE8m || Ext.isIEQuirks);

    function b(n) {
      var q = n * i,
        o = l(q),
        t = j(q),
        r = k * j((90 - n) * i),
        s = k * l((90 - n) * i),
        u = Math.min(k, k - r),
        p = n > 180 ? s : 0,
        v = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11 = " + o + ", M12 = " + (-t) + ", M21 = " + t + ", M22 = " + o + ")";
      return Ext.String.format("filter:{0};-ms-filter:{0};top:{1}px;left:{2}px;", v, u + f, p + a)
    }

    function h(n) {
      var q = n * i,
        o = l(q),
        t = j(q),
        r = m * j((90 - n) * i),
        s = m * l((90 - n) * i),
        u = Math.min(m, m - r),
        p = n > 180 ? s : 0,
        v = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11 = " + o + ", M12 = " + (-t) + ", M21 = " + t + ", M22 = " + o + ")";
      return Ext.String.format("filter:{0};-ms-filter:{0};top:{1}px;left:{2}px;", v, u + c, p + d)
    }

    function g(n) {
      return Ext.String.format("transform:rotate({0}deg);-ms-transform:rotate({0}deg);-moz-transform: rotate({0}deg);-webkit-transform: rotate({0}deg);-o-transform:rotate({0}deg);", n)
    }
    this.callParent(['<div class="sch-clockwrap {cls}"><div class="sch-clock"><div class="sch-hourIndicator" style="{[this.getHourStyle((values.date.getHours()%12) * 30)]}">{[Ext.Date.monthNames[values.date.getMonth()].substr(0,3)]}</div><div class="sch-minuteIndicator" style="{[this.getMinuteStyle(values.date.getMinutes() * 6)]}">{[values.date.getDate()]}</div></div><span class="sch-clock-text">{text}</span></div>', {
      compiled: true,
      disableFormats: true,
      getMinuteStyle: e ? h : g,
      getHourStyle: e ? b : g
    }])
  }
});
Ext.define("Ext.ux.Scheduler.tooltip.Tooltip", {
  extend: "Ext.tip.ToolTip",
  requires: ["Ext.ux.Scheduler.tooltip.ClockTemplate"],
  autoHide: false,
  anchor: "b",
  padding: "0 3 0 0",
  showDelay: 0,
  hideDelay: 0,
  quickShowInterval: 0,
  dismissDelay: 0,
  trackMouse: false,
  valid: true,
  anchorOffset: 5,
  shadow: false,
  frame: false,
  constructor: function(b) {
    var a = new Ext.ux.Scheduler.tooltip.ClockTemplate();
    this.renderTo = document.body;
    this.startDate = this.endDate = new Date();
    if (!this.template) {
      this.template = Ext.create("Ext.XTemplate", '<div class="{[values.valid ? "sch-tip-ok" : "sch-tip-notok"]}">', '{[this.renderClock(values.startDate, values.startText, "sch-tooltip-startdate")]}', '{[this.renderClock(values.endDate, values.endText, "sch-tooltip-enddate")]}', "</div>", {
        compiled: true,
        disableFormats: true,
        renderClock: function(d, e, c) {
          return a.apply({
            date: d,
            text: e,
            cls: c
          })
        }
      })
    }
    this.callParent(arguments)
  },
  update: function(a, e, d, f) {
    if (this.startDate - a !== 0 || this.endDate - e !== 0 || this.valid !== d || f) {
      this.startDate = a;
      this.endDate = e;
      this.valid = d;
      var c = this.schedulerView.getFormattedDate(a),
        b = this.schedulerView.getFormattedEndDate(e, a);
      if (this.mode === "calendar" && e.getHours() === 0 && e.getMinutes() === 0 && !(e.getYear() === a.getYear() && e.getMonth() === a.getMonth() && e.getDate() === a.getDate())) {
        e = Ext.ux.Scheduler.util.Date.add(e, Ext.ux.Scheduler.util.Date.DAY, -1)
      }
      this.callParent([this.template.apply({
        valid: d,
        startDate: a,
        endDate: e,
        startText: c,
        endText: b
      })])
    }
  },
  show: function(b, a) {
    if (!b) {
      return
    }
    a = a || 18;
    if (Ext.ux.Scheduler.util.Date.compareUnits(this.schedulerView.getTimeResolution().unit, Ext.ux.Scheduler.util.Date.DAY) >= 0) {
      this.mode = "calendar";
      this.addCls("sch-day-resolution")
    } else {
      this.mode = "clock";
      this.removeCls("sch-day-resolution")
    }
    this.mouseOffsets = [a - 18, -7];
    this.setTarget(b);
    this.callParent();
    this.alignTo(b, "bl-tl", this.mouseOffsets);
    this.mon(Ext.getDoc(), "mousemove", this.onMyMouseMove, this);
    this.mon(Ext.getDoc(), "mouseup", this.onMyMouseUp, this, {
      single: true
    })
  },
  onMyMouseMove: function() {
    this.el.alignTo(this.target, "bl-tl", this.mouseOffsets)
  },
  onMyMouseUp: function() {
    this.mun(Ext.getDoc(), "mousemove", this.onMyMouseMove, this)
  },
  afterRender: function() {
    this.callParent(arguments);
    this.el.on("mouseenter", this.onElMouseEnter, this)
  },
  onElMouseEnter: function() {
    this.alignTo(this.target, "bl-tl", this.mouseOffsets)
  }
});
Ext.define("Ext.ux.Scheduler.util.Date", {
  requires: "Ext.Date",
  mixins: ["Ext.ux.Scheduler.mixin.Localizable"],
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
    this.units = [b.MILLI, b.SECOND, b.MINUTE, b.HOUR, b.DAY, b.WEEK, b.MONTH, b.QUARTER, b.YEAR]
  },
  onLocalized: function() {
    this.setUnitNames(this.L("unitNames"))
  },
  setUnitNames: function(f, b) {
    var e = this.unitsByName = {};
    this.l10n.unitNames = f;
    this._unitNames = Ext.apply({}, f);
    var c = this.unitHash;
    for (var a in c) {
      if (c.hasOwnProperty(a)) {
        var d = c[a];
        this._unitNames[d] = this._unitNames[a];
        e[a] = d;
        e[d] = d
      }
    }
  },
  betweenLesser: function(b, d, a) {
    var c = b.getTime();
    return d.getTime() <= c && c < a.getTime()
  },
  constrain: function(b, c, a) {
    return this.min(this.max(b, c), a)
  },
  compareUnits: function(c, b) {
    var a = Ext.Array.indexOf(this.units, c),
      d = Ext.Array.indexOf(this.units, b);
    return a > d ? 1 : (a < d ? -1 : 0)
  },
  isUnitGreater: function(b, a) {
    return this.compareUnits(b, a) > 0
  },
  copyTimeValues: function(b, a) {
    b.setHours(a.getHours());
    b.setMinutes(a.getMinutes());
    b.setSeconds(a.getSeconds());
    b.setMilliseconds(a.getMilliseconds())
  },
  add: function(b, c, e) {
    var f = Ext.Date.clone(b);
    if (!c || e === 0) {
      return f
    }
    switch (c.toLowerCase()) {
      case this.MILLI:
        f = new Date(b.getTime() + e);
        break;
      case this.SECOND:
        f = new Date(b.getTime() + (e * 1000));
        break;
      case this.MINUTE:
        f = new Date(b.getTime() + (e * 60000));
        break;
      case this.HOUR:
        f = new Date(b.getTime() + (e * 3600000));
        break;
      case this.DAY:
        f.setDate(b.getDate() + e);
        break;
      case this.WEEK:
        f.setDate(b.getDate() + e * 7);
        break;
      case this.MONTH:
        var a = b.getDate();
        if (a > 28) {
          a = Math.min(a, Ext.Date.getLastDateOfMonth(this.add(Ext.Date.getFirstDateOfMonth(b), this.MONTH, e)).getDate())
        }
        f.setDate(a);
        f.setMonth(f.getMonth() + e);
        break;
      case this.QUARTER:
        f = this.add(b, this.MONTH, e * 3);
        break;
      case this.YEAR:
        f.setFullYear(b.getFullYear() + e);
        break
    }
    return f
  },
  getUnitDurationInMs: function(a) {
    return this.add(new Date(1, 0, 1), a, 1) - new Date(1, 0, 1)
  },
  getMeasuringUnit: function(a) {
    if (a === this.WEEK) {
      return this.DAY
    }
    return a
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
        break
    }
    return d ? b : Math.round(b)
  },
  getUnitToBaseUnitRatio: function(b, a) {
    if (b === a) {
      return 1
    }
    switch (b) {
      case this.YEAR:
        switch (a) {
          case this.QUARTER:
            return 1 / 4;
          case this.MONTH:
            return 1 / 12
        }
        break;
      case this.QUARTER:
        switch (a) {
          case this.YEAR:
            return 4;
          case this.MONTH:
            return 1 / 3
        }
        break;
      case this.MONTH:
        switch (a) {
          case this.YEAR:
            return 12;
          case this.QUARTER:
            return 3
        }
        break;
      case this.WEEK:
        switch (a) {
          case this.DAY:
            return 1 / 7;
          case this.HOUR:
            return 1 / 168
        }
        break;
      case this.DAY:
        switch (a) {
          case this.WEEK:
            return 7;
          case this.HOUR:
            return 1 / 24;
          case this.MINUTE:
            return 1 / 1440
        }
        break;
      case this.HOUR:
        switch (a) {
          case this.DAY:
            return 24;
          case this.MINUTE:
            return 1 / 60
        }
        break;
      case this.MINUTE:
        switch (a) {
          case this.HOUR:
            return 60;
          case this.SECOND:
            return 1 / 60;
          case this.MILLI:
            return 1 / 60000
        }
        break;
      case this.SECOND:
        switch (a) {
          case this.MILLI:
            return 1 / 1000
        }
        break;
      case this.MILLI:
        switch (a) {
          case this.SECOND:
            return 1000
        }
        break
    }
    return -1
  },
  getDurationInMilliseconds: function(b, a) {
    return (a - b)
  },
  getDurationInSeconds: function(b, a) {
    return (a - b) / 1000
  },
  getDurationInMinutes: function(b, a) {
    return (a - b) / 60000
  },
  getDurationInHours: function(b, a) {
    return (a - b) / 3600000
  },
  getDurationInDays: function(c, b) {
    var a = c.getTimezoneOffset() - b.getTimezoneOffset();
    return (b - c + a * 60 * 1000) / 86400000
  },
  getDurationInBusinessDays: function(g, b) {
    var c = Math.round((b - g) / 86400000),
      a = 0,
      f;
    for (var e = 0; e < c; e++) {
      f = this.add(g, this.DAY, e).getDay();
      if (f !== 6 && f !== 0) {
        a++
      }
    }
    return a
  },
  getDurationInMonths: function(b, a) {
    return ((a.getFullYear() - b.getFullYear()) * 12) + (a.getMonth() - b.getMonth())
  },
  getDurationInYears: function(b, a) {
    return this.getDurationInMonths(b, a) / 12
  },
  min: function(b, a) {
    return b < a ? b : a
  },
  max: function(b, a) {
    return b > a ? b : a
  },
  intersectSpans: function(c, d, b, a) {
    return this.betweenLesser(c, b, a) || this.betweenLesser(b, c, d)
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
        return "MILLI"
    }
    throw "Incorrect UnitName"
  },
  getReadableNameOfUnit: function(b, a) {
    if (!this.isLocaleApplied()) {
      this.applyLocale()
    }
    return this._unitNames[b][a ? "plural" : "single"]
  },
  getShortNameOfUnit: function(a) {
    if (!this.isLocaleApplied()) {
      this.applyLocale()
    }
    return this._unitNames[a].abbrev
  },
  getUnitByName: function(a) {
    if (!this.isLocaleApplied()) {
      this.applyLocale()
    }
    if (!this.unitsByName[a]) {
      Ext.Error.raise("Unknown unit name: " + a)
    }
    return this.unitsByName[a]
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
          e.setMilliseconds(0)
        }
        break;
      case this.MINUTE:
        e = this.add(c, g, a);
        if (e.getSeconds() > 0) {
          e.setSeconds(0)
        }
        if (e.getMilliseconds() > 0) {
          e.setMilliseconds(0)
        }
        break;
      case this.HOUR:
        e = this.add(c, g, a);
        if (e.getMinutes() > 0) {
          e.setMinutes(0)
        }
        if (e.getSeconds() > 0) {
          e.setSeconds(0)
        }
        if (e.getMilliseconds() > 0) {
          e.setMilliseconds(0)
        }
        break;
      case this.DAY:
        var d = c.getHours() === 23 && this.add(e, this.HOUR, 1).getHours() === 1;
        if (d) {
          e = this.add(e, this.DAY, 2);
          Ext.Date.clearTime(e);
          return e
        }
        Ext.Date.clearTime(e);
        e = this.add(e, this.DAY, a);
        break;
      case this.WEEK:
        Ext.Date.clearTime(e);
        var b = e.getDay();
        e = this.add(e, this.DAY, f - b + 7 * (a - (f <= b ? 0 : 1)));
        if (e.getDay() !== f) {
          e = this.add(e, this.HOUR, 1)
        } else {
          Ext.Date.clearTime(e)
        }
        break;
      case this.MONTH:
        e = this.add(e, this.MONTH, a);
        e.setDate(1);
        Ext.Date.clearTime(e);
        break;
      case this.QUARTER:
        e = this.add(e, this.MONTH, ((a - 1) * 3) + (3 - (e.getMonth() % 3)));
        Ext.Date.clearTime(e);
        e.setDate(1);
        break;
      case this.YEAR:
        e = new Date(e.getFullYear() + a, 0, 1);
        break;
      default:
        throw "Invalid date unit"
    }
    return e
  },
  getNumberOfMsFromTheStartOfDay: function(a) {
    return a - Ext.Date.clearTime(a, true) || 86400000
  },
  getNumberOfMsTillTheEndOfDay: function(a) {
    return this.getStartOfNextDay(a, true) - a
  },
  getStartOfNextDay: function(b, f, e) {
    var d = this.add(e ? b : Ext.Date.clearTime(b, f), this.DAY, 1);
    if (d.getDate() == b.getDate()) {
      var c = this.add(Ext.Date.clearTime(b, f), this.DAY, 2).getTimezoneOffset();
      var a = b.getTimezoneOffset();
      d = this.add(d, this.MINUTE, a - c)
    }
    return d
  },
  getEndOfPreviousDay: function(b, c) {
    var a = c ? b : Ext.Date.clearTime(b, true);
    if (a - b) {
      return a
    } else {
      return this.add(a, this.DAY, -1)
    }
  },
  timeSpanContains: function(c, b, d, a) {
    return (d - c) >= 0 && (b - a) >= 0
  }
});
Ext.define("Ext.ux.Scheduler.util.Debug", {
  singleton: true,
  runDiagnostics: function() {
    var d;
    var g = this;
    var b = window.console;
    if (b && b.log) {
      d = function(m) {
        b.log(m)
      }
    } else {
      if (!g.schedulerDebugWin) {
        g.schedulerDebugWin = new Ext.Window({
          height: 400,
          width: 500,
          bodyStyle: "padding:10px",
          closeAction: "hide",
          autoScroll: true
        })
      }
      g.schedulerDebugWin.show();
      g.schedulerDebugWin.update("");
      d = function(m) {
        g.schedulerDebugWin.update((g.schedulerDebugWin.body.dom.innerHTML || "") + m + "<br/>")
      }
    }
    var e = Ext.select(".sch-schedulerpanel");
    if (e.getCount() === 0) {
      d("No scheduler component found")
    }
    var l = Ext.getCmp(e.elements[0].id),
      j = l.getResourceStore(),
      c = l.getEventStore();
    if (!c.isEventStore) {
      d("Your event store must be or extend Ext.ux.Scheduler.data.EventStore")
    }
    d("Scheduler view start: " + l.getStart() + ", end: " + l.getEnd());
    if (!j) {
      d("No store configured");
      return
    }
    if (!c) {
      d("No event store configured");
      return
    }
    d(j.getCount() + " records in the resource store");
    d(c.getCount() + " records in the eventStore");
    var k = c.model.prototype.idProperty;
    var a = j.model.prototype.idProperty;
    var i = c.model.prototype.fields.getByKey(k);
    var f = j.model.prototype.fields.getByKey(a);
    if (!(c.model.prototype instanceof Ext.ux.Scheduler.model.Event)) {
      d("Your event model must extend Ext.ux.Scheduler.model.Event")
    }
    if (!(j.model.prototype instanceof Ext.ux.Scheduler.model.Resource)) {
      d("Your resource model must extend Ext.ux.Scheduler.model.Resource")
    }
    if (!i) {
      d("idProperty on the event model is incorrectly setup, value: " + k)
    }
    if (!f) {
      d("idProperty on the resource model is incorrectly setup, value: " + a)
    }
    var h = l.getSchedulingView();
    d(h.el.select(h.eventSelector).getCount() + " events present in the DOM");
    if (c.getCount() > 0) {
      if (!c.first().getStartDate() || !(c.first().getStartDate() instanceof Date)) {
        d("The eventStore reader is misconfigured - The StartDate field is not setup correctly, please investigate");
        d("StartDate is configured with dateFormat: " + c.model.prototype.fields.getByKey("StartDate").dateFormat);
        d("See Ext JS docs for information about different date formats: http://docs.sencha.com/ext-js/4-0/#!/api/Ext.Date")
      }
      if (!c.first().getEndDate() || !(c.first().getEndDate() instanceof Date)) {
        d("The eventStore reader is misconfigured - The EndDate field is not setup correctly, please investigate");
        d("EndDate is configured with dateFormat: " + c.model.prototype.fields.getByKey("EndDate").dateFormat);
        d("See Ext JS docs for information about different date formats: http://docs.sencha.com/ext-js/4-0/#!/api/Ext.Date")
      }
      if (c.proxy && c.proxy.reader && c.proxy.reader.jsonData) {
        d("Dumping jsonData to console");
        console && console.dir && console.dir(c.proxy.reader.jsonData)
      }
      d("Records in the event store:");
      c.each(function(n, m) {
        d((m + 1) + ". " + n.startDateField + ":" + n.getStartDate() + ", " + n.endDateField + ":" + n.getEndDate() + ", " + n.resourceIdField + ":" + n.getResourceId());
        if (!n.getStartDate()) {
          d(n.getStartDate())
        }
      })
    } else {
      d("Event store has no data. Has it been loaded properly?")
    }
    if (j instanceof Ext.data.TreeStore) {
      j = j.nodeStore
    }
    if (j.getCount() > 0) {
      d("Records in the resource store:");
      j.each(function(n, m) {
        d((m + 1) + ". " + n.idProperty + ":" + n.getId());
        return
      })
    } else {
      d("Resource store has no data.");
      return
    }
    d("Everything seems to be setup ok!")
  }
});
Ext.define("Ext.ux.Scheduler.util.DragTracker", {
  extend: "Ext.dd.DragTracker",
  xStep: 1,
  yStep: 1,
  constructor: function() {
    this.callParent(arguments);
    this.on("dragstart", function() {
      var a = this.el;
      a.on("scroll", this.onMouseMove, this);
      this.on("dragend", function() {
        a.un("scroll", this.onMouseMove, this)
      }, this, {
        single: true
      })
    })
  },
  setXStep: function(a) {
    this.xStep = a
  },
  startScroll: null,
  setYStep: function(a) {
    this.yStep = a
  },
  getRegion: function() {
    var j = this.startXY,
      f = this.el.getScroll(),
      l = this.getXY(),
      c = l[0],
      b = l[1],
      h = f.left - this.startScroll.left,
      m = f.top - this.startScroll.top,
      i = j[0] - h,
      g = j[1] - m,
      e = Math.min(i, c),
      d = Math.min(g, b),
      a = Math.abs(i - c),
      k = Math.abs(g - b);
    return new Ext.util.Region(d, e + a, d + k, e)
  },
  onMouseDown: function(b, a) {
    this.callParent(arguments);
    this.lastXY = this.startXY;
    this.startScroll = this.el.getScroll()
  },
  onMouseMove: function(g, f) {
    if (this.active && g.type === "mousemove" && Ext.isIE9m && !g.browserEvent.button) {
      g.preventDefault();
      this.onMouseUp(g);
      return
    }
    g.preventDefault();
    var d = g.type === "scroll" ? this.lastXY : g.getXY(),
      b = this.startXY;
    if (!this.active) {
      if (Math.max(Math.abs(b[0] - d[0]), Math.abs(b[1] - d[1])) > this.tolerance) {
        this.triggerStart(g)
      } else {
        return
      }
    }
    var a = d[0],
      h = d[1];
    if (this.xStep > 1) {
      a -= this.startXY[0];
      a = Math.round(a / this.xStep) * this.xStep;
      a += this.startXY[0]
    }
    if (this.yStep > 1) {
      h -= this.startXY[1];
      h = Math.round(h / this.yStep) * this.yStep;
      h += this.startXY[1]
    }
    var c = this.xStep > 1 || this.yStep > 1;
    if (!c || a !== d[0] || h !== d[1]) {
      this.lastXY = [a, h];
      if (this.fireEvent("mousemove", this, g) === false) {
        this.onMouseUp(g)
      } else {
        this.onDrag(g);
        this.fireEvent("drag", this, g)
      }
    }
  }
});
Ext.define("Ext.ux.Scheduler.util.ScrollManager", {
  singleton: true,
  vthresh: 25,
  hthresh: 25,
  increment: 100,
  frequency: 500,
  animate: true,
  animDuration: 200,
  activeEl: null,
  scrollElRegion: null,
  scrollProcess: {},
  pt: null,
  scrollWidth: null,
  scrollHeight: null,
  direction: "both",
  constructor: function() {
    this.doScroll = Ext.Function.bind(this.doScroll, this)
  },
  triggerRefresh: function() {
    if (this.activeEl) {
      this.refreshElRegion();
      this.clearScrollInterval();
      this.onMouseMove()
    }
  },
  doScroll: function() {
    var c = this.scrollProcess,
      d = c.el,
      b = c.dir[0],
      a = this.increment;
    if (b === "r") {
      a = Math.min(a, this.scrollWidth - this.activeEl.dom.scrollLeft - this.activeEl.dom.clientWidth)
    } else {
      if (b === "d") {
        a = Math.min(a, this.scrollHeight - this.activeEl.dom.scrollTop - this.activeEl.dom.clientHeight)
      }
    }
    d.scroll(b, Math.max(a, 0), {
      duration: this.animDuration,
      callback: this.triggerRefresh,
      scope: this
    })
  },
  clearScrollInterval: function() {
    var a = this.scrollProcess;
    if (a.id) {
      clearTimeout(a.id)
    }
    a.id = 0;
    a.el = null;
    a.dir = ""
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
        throw "Invalid direction: " + this.direction
    }
  },
  startScrollInterval: function(b, a) {
    if (!this.isScrollAllowed(a)) {
      return
    }
    if (Ext.versions.extjs.isLessThan("4.2.2")) {
      if (a[0] === "r") {
        a = "left"
      } else {
        if (a[0] === "l") {
          a = "right"
        }
      }
    }
    this.clearScrollInterval();
    this.scrollProcess.el = b;
    this.scrollProcess.dir = a;
    this.scrollProcess.id = setTimeout(this.doScroll, this.frequency)
  },
  onMouseMove: function(d) {
    var k = d ? d.getPoint() : this.pt,
      j = k.x,
      h = k.y,
      f = this.scrollProcess,
      a, b = this.activeEl,
      i = this.scrollElRegion,
      c = b.dom,
      g = this;
    this.pt = k;
    if (i && i.contains(k) && b.isScrollable()) {
      if (i.bottom - h <= g.vthresh && (this.scrollHeight - c.scrollTop - c.clientHeight > 0)) {
        if (f.el != b) {
          this.startScrollInterval(b, "down")
        }
        return
      } else {
        if (i.right - j <= g.hthresh && (this.scrollWidth - c.scrollLeft - c.clientWidth > 0)) {
          if (f.el != b) {
            this.startScrollInterval(b, "right")
          }
          return
        } else {
          if (h - i.top <= g.vthresh && b.dom.scrollTop > 0) {
            if (f.el != b) {
              this.startScrollInterval(b, "up")
            }
            return
          } else {
            if (j - i.left <= g.hthresh && b.dom.scrollLeft > 0) {
              if (f.el != b) {
                this.startScrollInterval(b, "left")
              }
              return
            }
          }
        }
      }
    }
    this.clearScrollInterval()
  },
  refreshElRegion: function() {
    this.scrollElRegion = this.activeEl.getRegion()
  },
  activate: function(a, b) {
    this.direction = b || "both";
    this.activeEl = Ext.get(a);
    this.scrollWidth = this.activeEl.dom.scrollWidth;
    this.scrollHeight = this.activeEl.dom.scrollHeight;
    this.refreshElRegion();
    this.activeEl.on("mousemove", this.onMouseMove, this)
  },
  deactivate: function() {
    this.clearScrollInterval();
    this.activeEl.un("mousemove", this.onMouseMove, this);
    this.activeEl = this.scrollElRegion = this.scrollWidth = this.scrollHeight = null;
    this.direction = "both"
  }
});
Ext.define("Ext.ux.Scheduler.preset.ViewPreset", {
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
    Ext.apply(this, a)
  },
  getHeaders: function() {
    if (this.headers) {
      return this.headers
    }
    var a = this.headerConfig;
    this.mainHeader = a.top ? 1 : 0;
    return this.headers = [].concat(a.top || [], a.middle || [], a.bottom || [])
  },
  getMainHeader: function() {
    return this.getHeaders()[this.mainHeader]
  },
  getBottomHeader: function() {
    var a = this.getHeaders();
    return a[a.length - 1]
  },
  clone: function() {
    var a = {};
    var b = this;
    Ext.each(["rowHeight", "timeColumnWidth", "timeRowHeight", "timeAxisColumnWidth", "displayDateFormat", "shiftUnit", "shiftIncrement", "defaultSpan", "timeResolution", "headerConfig"], function(c) {
      a[c] = b[c]
    });
    return new this.self(Ext.clone(a))
  }
});
Ext.define("Ext.ux.Scheduler.preset.Manager", {
  extend: "Ext.util.MixedCollection",
  requires: ["Ext.ux.Scheduler.util.Date", "Ext.ux.Scheduler.preset.ViewPreset"],
  mixins: ["Ext.ux.Scheduler.mixin.Localizable"],
  singleton: true,
  constructor: function() {
    this.callParent(arguments);
    this.registerDefaults()
  },
  registerPreset: function(b, a) {
    if (a) {
      var c = a.headerConfig;
      var f = Ext.ux.Scheduler.util.Date;
      for (var g in c) {
        if (c.hasOwnProperty(g)) {
          if (f[c[g].unit]) {
            c[g].unit = f[c[g].unit.toUpperCase()]
          }
        }
      }
      if (!a.timeColumnWidth) {
        a.timeColumnWidth = 50
      }
      if (!a.rowHeight) {
        a.rowHeight = 24
      }
      var d = a.timeResolution;
      if (d && f[d.unit]) {
        d.unit = f[d.unit.toUpperCase()]
      }
      var e = a.shiftUnit;
      if (e && f[e]) {
        a.shiftUnit = f[e.toUpperCase()]
      }
    }
    if (this.isValidPreset(a)) {
      if (this.containsKey(b)) {
        this.removeAtKey(b)
      }
      a.name = b;
      this.add(b, new Ext.ux.Scheduler.preset.ViewPreset(a))
    } else {
      throw "Invalid preset, please check your configuration"
    }
  },
  isValidPreset: function(a) {
    var e = Ext.ux.Scheduler.util.Date,
      c = true,
      d = Ext.ux.Scheduler.util.Date.units,
      b = {};
    for (var f in a.headerConfig) {
      if (a.headerConfig.hasOwnProperty(f)) {
        b[f] = true;
        c = c && Ext.Array.indexOf(d, a.headerConfig[f].unit) >= 0
      }
    }
    if (!(a.columnLinesFor in b)) {
      a.columnLinesFor = "middle"
    }
    if (a.timeResolution) {
      c = c && Ext.Array.indexOf(d, a.timeResolution.unit) >= 0
    }
    if (a.shiftUnit) {
      c = c && Ext.Array.indexOf(d, a.shiftUnit) >= 0
    }
    return c
  },
  getPreset: function(a) {
    return this.get(a)
  },
  deletePreset: function(a) {
    this.removeAtKey(a)
  },
  registerDefaults: function() {
    var b = this,
      a = this.defaultPresets;
    for (var c in a) {
      b.registerPreset(c, a[c])
    }
  },
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
            return Ext.ux.Scheduler.util.Date.getShortNameOfUnit("WEEK") + "." + Ext.Date.format(c, "W M Y")
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
          renderer: function(c, b, a) {
            return Ext.Date.format(c, "d M")
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
            return Ext.String.format(Ext.ux.Scheduler.util.Date.getShortNameOfUnit("QUARTER").toUpperCase() + "{0}", Math.floor(c.getMonth() / 3) + 1)
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
          dateFormat: "Y"
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
            return Ext.Date.dayNames[a.getDay()].substring(0, 1)
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
    }
  }
});
if (!Ext.ClassManager.get("Ext.ux.Scheduler.feature.AbstractTimeSpan")) {
  Ext.define("Ext.ux.Scheduler.feature.AbstractTimeSpan", {
    extend: "Ext.AbstractPlugin",
    mixins: {
      observable: "Ext.util.Observable"
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
    headerContainerCls: "sch-header-secondary-canvas",
    headerContainerEl: null,
    renderingDoneEvent: null,
    constructor: function(a) {
      this.uniqueCls = this.uniqueCls || ("sch-timespangroup-" + Ext.id());
      Ext.apply(this, a);
      this.mixins.observable.constructor.call(this);
      this.callParent(arguments)
    },
    setDisabled: function(a) {
      if (a) {
        this.removeElements()
      }
      this.disabled = a
    },
    removeElements: function() {
      this.removeBodyElements();
      if (this.showHeaderElements) {
        this.removeHeaderElements()
      }
    },
    getBodyElements: function() {
      if (this.containerEl) {
        return this.containerEl.select("." + this.uniqueCls)
      }
      return null
    },
    getHeaderContainerEl: function() {
      var c = this.headerContainerEl,
        b = Ext.baseCSSPrefix,
        a;
      if (!c || !c.dom) {
        if (this.schedulerView.isHorizontal()) {
          a = this.panel.getTimeAxisColumn().headerView.containerEl
        } else {
          a = this.panel.el.down("." + b + "grid-inner-locked ." + b + "panel-body ." + b + "grid-view")
        }
        if (a) {
          c = a.down("." + this.headerContainerCls);
          if (!c) {
            c = a.appendChild({
              cls: this.headerContainerCls
            })
          }
          this.headerContainerEl = c
        }
      }
      return c
    },
    getHeaderElements: function() {
      var a = this.getHeaderContainerEl();
      if (a) {
        return a.select("." + this.uniqueCls)
      }
      return null
    },
    removeBodyElements: function() {
      var a = this.getBodyElements();
      if (a) {
        a.each(function(b) {
          b.destroy()
        })
      }
    },
    removeHeaderElements: function() {
      var a = this.getHeaderElements();
      if (a) {
        a.each(function(b) {
          b.destroy()
        })
      }
    },
    getElementId: function(a) {
      return this.uniqueCls + "-" + a.internalId
    },
    getHeaderElementId: function(a) {
      return this.uniqueCls + "-header-" + a.internalId
    },
    getTemplateData: function(a) {
      return this.prepareTemplateData ? this.prepareTemplateData(a) : a.data
    },
    getElementCls: function(a, c) {
      var b = a.clsField || this.clsField;
      if (!c) {
        c = this.getTemplateData(a)
      }
      return this.cls + " " + this.uniqueCls + " " + (c[b] || "")
    },
    getHeaderElementCls: function(a, c) {
      var b = a.clsField || this.clsField;
      if (!c) {
        c = this.getTemplateData(a)
      }
      return "sch-header-indicator " + this.uniqueCls + " " + (c[b] || "")
    },
    init: function(a) {
      if (Ext.versions.touch && !a.isReady()) {
        a.on("viewready", function() {
          this.init(a)
        }, this);
        return
      }
      if (Ext.isString(this.innerHeaderTpl)) {
        this.innerHeaderTpl = new Ext.XTemplate(this.innerHeaderTpl)
      }
      var b = this.innerHeaderTpl;
      if (!this.headerTemplate) {
        this.headerTemplate = new Ext.XTemplate('<tpl for=".">', '<div id="{id}" class="{cls}" style="{side}:{position}px;">' + (b ? "{[this.renderInner(values)]}" : "") + "</div>", "</tpl>", {
          renderInner: function(c) {
            return b.apply(c)
          }
        })
      }
      this.schedulerView = a.getSchedulingView();
      this.panel = a;
      this.timeAxis = a.getTimeAxis();
      this.store = Ext.StoreManager.lookup(this.store);
      if (!this.store) {
        Ext.Error.raise("Error: You must define a store for this plugin")
      }
      if (!this.schedulerView.getEl()) {
        this.schedulerView.on({
          afterrender: this.onAfterRender,
          scope: this
        })
      } else {
        this.onAfterRender()
      }
      this.schedulerView.on({
        destroy: this.onDestroy,
        scope: this
      })
    },
    onAfterRender: function(c) {
      var a = this.schedulerView;
      this.containerEl = a.getSecondaryCanvasEl();
      this.storeListeners = {
        load: this.renderElements,
        datachanged: this.renderElements,
        clear: this.renderElements,
        add: this.refreshSingle,
        remove: this.renderElements,
        update: this.refreshSingle,
        addrecords: this.refreshSingle,
        removerecords: this.renderElements,
        updaterecord: this.refreshSingle,
        scope: this
      };
      this.store.on(this.storeListeners);
      if (Ext.data.NodeStore && a.store instanceof Ext.data.NodeStore) {
        if (a.animate) {} else {
          a.mon(a.store, {
            expand: this.renderElements,
            collapse: this.renderElements,
            scope: this
          })
        }
      }
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
        })
      }
      this.panel.on({
        viewchange: this.renderElements,
        show: this.refreshSizes,
        orientationchange: this.forceNewRenderingTimeout,
        scope: this
      });
      var b = a.getRowContainerEl();
      if (b && b.down(".sch-timetd")) {
        this.renderElements()
      }
    },
    forceNewRenderingTimeout: function() {
      this.renderElementsBuffered = false;
      clearTimeout(this._renderTimer);
      clearTimeout(this._resizeTimer);
      this.renderElements()
    },
    refreshSizesInternal: function() {
      if (!this.schedulerView.isDestroyed && this.schedulerView.isHorizontal()) {
        var a = this.schedulerView.getTimeSpanRegion(new Date(), null, this.expandToFitView);
        this.getBodyElements().setHeight(a.bottom - a.top)
      }
    },
    refreshSizes: function() {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = Ext.Function.defer(this.refreshSizesInternal, this.renderDelay, this)
    },
    renderElements: function() {
      if (this.renderElementsBuffered || this.disabled) {
        return
      }
      this.renderElementsBuffered = true;
      clearTimeout(this._renderTimer);
      this._renderTimer = Ext.Function.defer(this.renderElementsInternal, this.renderDelay, this)
    },
    setElementX: function(b, a) {
      if (this.panel.rtl) {
        b.setRight(a)
      } else {
        b.setLeft(a)
      }
    },
    getHeaderElementPosition: function(b) {
      var a = this.schedulerView.getTimeAxisViewModel();
      return Math.round(a.getPositionFromDate(b))
    },
    renderBodyElementsInternal: function(a) {
      Ext.DomHelper.append(this.containerEl, this.generateMarkup(false, a))
    },
    getHeaderElementData: function(a, b) {
      throw "Abstract method call"
    },
    renderHeaderElementsInternal: function(a) {
      var b = this.getHeaderContainerEl();
      if (b) {
        Ext.DomHelper.append(b, this.generateHeaderMarkup(false, a))
      }
    },
    renderElementsInternal: function() {
      this.renderElementsBuffered = false;
      if (this.disabled || this.schedulerView.isDestroyed) {
        return
      }
      if (Ext.versions.extjs && !this.schedulerView.el.down("table")) {
        return
      }
      this.removeElements();
      this.renderBodyElementsInternal();
      if (this.showHeaderElements) {
        this.headerContainerEl = null;
        this.renderHeaderElementsInternal()
      }
      if (this.renderingDoneEvent) {
        this.fireEvent(this.renderingDoneEvent, this)
      }
    },
    generateMarkup: function(c, b) {
      var e = this.timeAxis.getStart(),
        a = this.timeAxis.getEnd(),
        d = this.getElementData(e, a, b, c);
      return this.template.apply(d)
    },
    generateHeaderMarkup: function(b, a) {
      var c = this.getHeaderElementData(a, b);
      return this.headerTemplate.apply(c)
    },
    getElementData: function(d, c, a, b) {
      throw "Abstract method call"
    },
    updateBodyElement: function(b) {
      var c = Ext.get(this.getElementId(b));
      if (c) {
        var e = this.timeAxis.getStart(),
          a = this.timeAxis.getEnd(),
          d = this.getElementData(e, a, [b])[0];
        if (d) {
          c.dom.className = d.$cls;
          c.setTop(d.top);
          this.setElementX(c, d.left);
          c.setSize(d.width, d.height)
        } else {
          Ext.destroy(c)
        }
      } else {
        this.renderBodyElementsInternal([b])
      }
    },
    updateHeaderElement: function(a) {
      var b = Ext.get(this.getHeaderElementId(a));
      if (b) {
        var c = this.getHeaderElementData([a])[0];
        if (c) {
          b.dom.className = c.cls;
          if (this.schedulerView.isHorizontal()) {
            this.setElementX(b, c.position);
            b.setWidth(c.size)
          } else {
            b.setTop(c.position);
            b.setHeight(c.size)
          }
        } else {
          Ext.destroy(b)
        }
      } else {
        this.renderHeaderElementsInternal([a])
      }
    },
    onDestroy: function() {
      clearTimeout(this._renderTimer);
      clearTimeout(this._resizeTimer);
      if (this.store.autoDestroy) {
        this.store.destroy()
      }
      this.store.un(this.storeListeners)
    },
    refreshSingle: function(b, a) {
      Ext.each(a, this.updateBodyElement, this);
      if (this.showHeaderElements) {
        Ext.each(a, this.updateHeaderElement, this)
      }
    }
  })
}
Ext.define("Ext.ux.Scheduler.feature.DragCreator", {
  requires: ["Ext.XTemplate", "Ext.ux.Scheduler.util.Date", "Ext.ux.Scheduler.util.ScrollManager", "Ext.ux.Scheduler.util.DragTracker", "Ext.ux.Scheduler.tooltip.Tooltip", "Ext.ux.Scheduler.tooltip.ClockTemplate"],
  disabled: false,
  showHoverTip: true,
  showDragTip: true,
  dragTolerance: 2,
  validatorFn: Ext.emptyFn,
  validatorFnScope: null,
  hoverTipTemplate: null,
  constructor: function(a) {
    Ext.apply(this, a || {});
    this.lastTime = new Date();
    this.template = this.template || new Ext.Template('<div class="sch-dragcreator-proxy"><div class="sch-event-inner">&#160;</div></div>', {
      compiled: true,
      disableFormats: true
    });
    this.schedulerView.on("destroy", this.onSchedulerDestroy, this);
    this.schedulerView.el.on("mousemove", this.setupTooltips, this, {
      single: true
    });
    this.callParent([a])
  },
  setDisabled: function(a) {
    this.disabled = a;
    if (this.hoverTip) {
      this.hoverTip.setDisabled(a)
    }
    if (this.dragTip) {
      this.dragTip.setDisabled(a)
    }
  },
  getProxy: function() {
    if (!this.proxy) {
      this.proxy = this.template.append(this.schedulerView.getSecondaryCanvasEl(), {}, true);
      this.proxy.hide = function() {
        this.setTop(-10000)
      }
    }
    return this.proxy
  },
  onMouseMove: function(c) {
    var a = this.hoverTip;
    if (a.disabled || this.dragging) {
      return
    }
    if (c.getTarget("." + this.schedulerView.timeCellCls, 5) && !c.getTarget(this.schedulerView.eventSelector)) {
      var b = this.schedulerView.getDateFromDomEvent(c, "floor");
      if (b) {
        if (b - this.lastTime !== 0) {
          this.updateHoverTip(b);
          if (a.hidden) {
            a[Ext.ux.Scheduler.util.Date.compareUnits(this.schedulerView.getTimeResolution().unit, Ext.ux.Scheduler.util.Date.DAY) >= 0 ? "addCls" : "removeCls"]("sch-day-resolution");
            a.show()
          }
        }
      } else {
        a.hide();
        this.lastTime = null
      }
    } else {
      a.hide();
      this.lastTime = null
    }
  },
  updateHoverTip: function(a) {
    if (a) {
      var b = this.schedulerView.getFormattedDate(a);
      this.hoverTip.update(this.hoverTipTemplate.apply({
        date: a,
        text: b
      }));
      this.lastTime = a
    }
  },
  onBeforeDragStart: function(d, g) {
    var b = this.schedulerView,
      a = g.getTarget("." + b.timeCellCls, 5);
    if (a && !g.getTarget(b.eventSelector)) {
      var c = b.resolveResource(a);
      var f = b.getDateFromDomEvent(g);
      if (!this.disabled && a && b.fireEvent("beforedragcreate", b, c, f, g) !== false) {
        this.resourceRecord = c;
        this.originalStart = f;
        this.resourceRegion = b.getScheduleRegion(this.resourceRecord, this.originalStart);
        this.dateConstraints = b.getDateConstraints(this.resourceRecord, this.originalStart);
        return true
      }
    }
    return false
  },
  onDragStart: function() {
    var c = this,
      a = c.schedulerView,
      b = c.getProxy();
    this.dragging = true;
    if (this.hoverTip) {
      this.hoverTip.disable()
    }
    c.start = c.originalStart;
    c.end = c.start;
    c.originalScroll = a.getScroll();
    if (a.getOrientation() === "horizontal") {
      c.rowBoundaries = {
        top: c.resourceRegion.top,
        bottom: c.resourceRegion.bottom
      };
      b.setRegion({
        top: c.rowBoundaries.top,
        right: c.tracker.startXY[0],
        bottom: c.rowBoundaries.bottom,
        left: c.tracker.startXY[0]
      })
    } else {
      c.rowBoundaries = {
        left: c.resourceRegion.left,
        right: c.resourceRegion.right
      };
      b.setRegion({
        top: c.tracker.startXY[1],
        right: c.resourceRegion.right,
        bottom: c.tracker.startXY[1],
        left: c.resourceRegion.left
      })
    }
    b.show();
    a.fireEvent("dragcreatestart", a);
    if (c.showDragTip) {
      c.dragTip.enable();
      c.dragTip.update(c.start, c.end, true);
      c.dragTip.show(b);
      c.dragTip.el.setStyle("visibility", "visible")
    }
    Ext.ux.Scheduler.util.ScrollManager.activate(a.el, a.getOrientation())
  },
  onDrag: function(h, b) {
    var d = this,
      f = d.schedulerView,
      i = d.tracker.getRegion(),
      a = f.getStartEndDatesFromRegion(i, "round");
    if (!a) {
      return
    }
    d.start = a.start || d.start;
    d.end = a.end || d.end;
    var j = d.dateConstraints;
    if (j) {
      d.end = Ext.ux.Scheduler.util.Date.constrain(d.end, j.start, j.end);
      d.start = Ext.ux.Scheduler.util.Date.constrain(d.start, j.start, j.end)
    }
    d.valid = this.validatorFn.call(d.validatorFnScope || d, d.resourceRecord, d.start, d.end) !== false;
    if (d.showDragTip) {
      d.dragTip.update(d.start, d.end, d.valid)
    }
    Ext.apply(i, d.rowBoundaries);
    var g = f.getScroll();
    var c = this.getProxy();
    c.setRegion(i);
    if (f.isHorizontal()) {
      c.setY(d.resourceRegion.top + d.originalScroll.top - g.top)
    }
  },
  eventSwallower: function(a) {
    a.stopPropagation();
    a.preventDefault()
  },
  onDragEnd: function(g, h) {
    var f = this,
      c = f.schedulerView,
      d = true,
      a = h.getTarget(),
      b = Ext.get(a);
    b.on("click", this.eventSwallower);
    setTimeout(function() {
      b.un("click", this.eventSwallower)
    }, 100);
    f.dragging = false;
    if (f.showDragTip) {
      f.dragTip.disable()
    }
    if (!f.start || !f.end || (f.end - f.start <= 0)) {
      f.valid = false
    }
    f.createContext = {
      start: f.start,
      end: f.end,
      resourceRecord: f.resourceRecord,
      e: h,
      finalize: function() {
        f.finalize.apply(f, arguments)
      }
    };
    if (f.valid) {
      d = c.fireEvent("beforedragcreatefinalize", f, f.createContext, h) !== false
    }
    if (d) {
      f.finalize(f.valid)
    }
    Ext.ux.Scheduler.util.ScrollManager.deactivate()
  },
  finalize: function(a) {
    var b = this.createContext;
    var d = this.schedulerView;
    if (a) {
      var c = Ext.create(d.eventStore.model);
      if (Ext.data.TreeStore && d.eventStore instanceof Ext.data.TreeStore) {
        c.set("leaf", true);
        d.eventStore.append(c)
      }
      c.assign(b.resourceRecord);
      c.setStartEndDate(b.start, b.end);
      d.fireEvent("dragcreateend", d, c, b.resourceRecord, b.e)
    } else {
      this.proxy.hide()
    }
    this.schedulerView.fireEvent("afterdragcreate", d);
    if (this.hoverTip) {
      this.hoverTip.enable()
    }
  },
  tipCfg: {
    trackMouse: true,
    bodyCssClass: "sch-hovertip",
    autoHide: false,
    dismissDelay: 1000,
    showDelay: 300
  },
  dragging: false,
  setupTooltips: function() {
    var b = this,
      a = b.schedulerView,
      c = a.up("[lockable=true]").el;
    b.tracker = new Ext.ux.Scheduler.util.DragTracker({
      el: a.el,
      tolerance: b.dragTolerance,
      listeners: {
        mousedown: b.verifyLeftButtonPressed,
        beforedragstart: b.onBeforeDragStart,
        dragstart: b.onDragStart,
        drag: b.onDrag,
        dragend: b.onDragEnd,
        scope: b
      }
    });
    if (this.showDragTip) {
      this.dragTip = new Ext.ux.Scheduler.tooltip.Tooltip({
        cls: "sch-dragcreate-tip",
        renderTo: c,
        schedulerView: a,
        listeners: {
          beforeshow: function() {
            return b.dragging
          }
        }
      })
    }
    if (b.showHoverTip) {
      var d = a.el;
      b.hoverTipTemplate = b.hoverTipTemplate || new Ext.ux.Scheduler.tooltip.ClockTemplate();
      b.hoverTip = new Ext.ToolTip(Ext.applyIf({
        renderTo: document.body,
        target: d,
        disabled: b.disabled
      }, b.tipCfg));
      b.hoverTip.on("beforeshow", b.tipOnBeforeShow, b);
      a.mon(d, {
        mouseleave: function() {
          b.hoverTip.hide()
        },
        mousemove: b.onMouseMove,
        scope: b
      })
    }
  },
  verifyLeftButtonPressed: function(a, b) {
    return b.button === 0
  },
  onSchedulerDestroy: function() {
    if (this.hoverTip) {
      this.hoverTip.destroy()
    }
    if (this.dragTip) {
      this.dragTip.destroy()
    }
    if (this.tracker) {
      this.tracker.destroy()
    }
    if (this.proxy) {
      Ext.destroy(this.proxy);
      this.proxy = null
    }
  },
  tipOnBeforeShow: function(a) {
    return !this.disabled && !this.dragging && this.lastTime !== null
  }
});
Ext.define("Ext.ux.Scheduler.feature.SchedulerDragZone", {
  extend: "Ext.dd.DragZone",
  requires: ["Ext.ux.Scheduler.tooltip.Tooltip", "Ext.dd.StatusProxy", "Ext.util.Point"],
  repairHighlight: false,
  repairHighlightColor: "transparent",
  containerScroll: false,
  dropAllowed: "sch-dragproxy",
  dropNotAllowed: "sch-dragproxy",
  showTooltip: true,
  tip: null,
  schedulerView: null,
  lastXY: null,
  showExactDropPosition: false,
  enableCopy: false,
  enableCopyKey: "SHIFT",
  validatorFn: function(b, a, c, f, d) {
    return true
  },
  validatorFnScope: null,
  copyKeyPressed: false,
  constructor: function(c, a) {
    if (Ext.isIE8m && window.top !== window) {
      Ext.dd.DragDropManager.notifyOccluded = true
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
    d.el.appendChild(b.el);
    if (d.rtl) {
      b.addCls("sch-rtl")
    }
    d.on({
      eventdragstart: function() {
        Ext.ux.Scheduler.util.ScrollManager.activate(d.el, d.constrainDragToResource && d.getOrientation())
      },
      aftereventdrop: function() {
        Ext.ux.Scheduler.util.ScrollManager.deactivate()
      },
      scope: this
    })
  },
  destroy: function() {
    this.callParent(arguments);
    if (this.tip) {
      this.tip.destroy()
    }
  },
  autoOffset: function(a, b) {
    this.setDelta(0, 0)
  },
  setupConstraints: function(k, d, g, e, i, f, c) {
    this.clearTicks();
    var a = i && f > 1 ? f : 0;
    var h = !i && f > 1 ? f : 0;
    this.resetConstraints();
    this.initPageX = k.left + g;
    this.initPageY = k.top + e;
    var b = d.right - d.left;
    var j = d.bottom - d.top;
    if (i) {
      if (c) {
        this.setXConstraint(k.left + g, k.right - b + g, a)
      } else {
        this.setXConstraint(k.left, k.right, a)
      }
      this.setYConstraint(k.top + e, k.bottom - j + e, h)
    } else {
      this.setXConstraint(k.left + g, k.right - b + g, a);
      if (c) {
        this.setYConstraint(k.top + e, k.bottom - j + e, h)
      } else {
        this.setYConstraint(k.top, k.bottom, h)
      }
    }
  },
  setXConstraint: function(c, b, a) {
    this.leftConstraint = c;
    this.rightConstraint = b;
    this.minX = c;
    this.maxX = b;
    if (a) {
      this.setXTicks(this.initPageX, a)
    }
    this.constrainX = true
  },
  setYConstraint: function(a, c, b) {
    this.topConstraint = a;
    this.bottomConstraint = c;
    this.minY = a;
    this.maxY = c;
    if (b) {
      this.setYTicks(this.initPageY, b)
    }
    this.constrainY = true
  },
  onDragEnter: Ext.emptyFn,
  onDragOut: Ext.emptyFn,
  setVisibilityForSourceEvents: function(a) {
    Ext.each(this.dragData.eventEls, function(b) {
      b[a ? "show" : "hide"]()
    })
  },
  onDragOver: function(g) {
    var k = g.type === "scroll" ? this.lastXY : g.getXY();
    this.checkShiftChange();
    var j = this.dragData;
    if (!j.originalHidden) {
      this.setVisibilityForSourceEvents(false);
      j.originalHidden = true
    }
    var b = j.startDate;
    var d = j.newResource;
    var h = this.schedulerView;
    this.updateDragContext(g);
    if (this.showExactDropPosition) {
      var a = h.getDateFromCoordinate(k[0]) - j.sourceDate;
      var i = new Date(j.origStart - 0 + a);
      var f = h.timeAxisViewModel.getDistanceBetweenDates(i, j.startDate);
      if (j.startDate > h.timeAxis.getStart()) {
        var c = this.proxy.el;
        if (f) {
          c.setX(c.getX() + (this.schedulerView.rtl ? -f : f))
        }
      }
    }
    if (j.startDate - b !== 0 || d !== j.newResource) {
      this.schedulerView.fireEvent("eventdrag", this.schedulerView, j.eventRecords, j.startDate, j.newResource, j)
    }
    if (this.showTooltip) {
      this.tip.update(j.startDate, j.endDate, j.valid)
    }
    if (g.type !== "scroll") {
      this.lastXY = g.getXY()
    }
  },
  getDragData: function(q) {
    var o = this.schedulerView,
      n = q.getTarget(o.eventSelector);
    if (!n) {
      return
    }
    var j = o.resolveEventRecord(n);
    if (!j || j.isDraggable() === false || o.fireEvent("beforeeventdrag", o, j, q) === false) {
      return null
    }
    var h = q.getXY(),
      a = Ext.get(n),
      u = a.getXY(),
      i = [h[0] - u[0], h[1] - u[1]],
      l = a.getRegion();
    var k = o.getOrientation() == "horizontal";
    var b = o.resolveResource(n);
    if (o.constrainDragToResource && !b) {
      throw "Resource could not be resolved for event: " + j.getId()
    }
    var r = o.getDateConstraints(o.constrainDragToResource ? b : null, j);
    this.setupConstraints(o.getScheduleRegion(o.constrainDragToResource ? b : null, j), l, i[0], i[1], k, o.getSnapPixelAmount(), Boolean(r));
    var c = j.getStartDate(),
      m = j.getEndDate(),
      d = o.timeAxis,
      g = this.getRelatedRecords(j),
      p = [a];
    Ext.Array.each(g, function(s) {
      var e = o.getElementFromEventRecord(s);
      if (e) {
        p.push(e)
      }
    });
    var f = {
      offsets: i,
      repairXY: u,
      prevScroll: o.getScroll(),
      dateConstraints: r,
      eventEls: p,
      eventRecords: [j].concat(g),
      relatedEventRecords: g,
      resourceRecord: b,
      sourceDate: o.getDateFromCoordinate(h[k ? 0 : 1]),
      origStart: c,
      origEnd: m,
      startDate: c,
      endDate: m,
      timeDiff: 0,
      startsOutsideView: c < d.getStart(),
      endsOutsideView: m > d.getEnd(),
      duration: m - c,
      bodyScroll: Ext.getBody().getScroll(),
      eventObj: q
    };
    f.ddel = this.getDragElement(a, f);
    return f
  },
  onStartDrag: function(b, d) {
    var c = this.schedulerView,
      a = this.dragData;
    a.eventEls[0].removeCls("sch-event-hover");
    c.fireEvent("eventdragstart", c, a.eventRecords);
    c.el.on("scroll", this.onViewElScroll, this)
  },
  alignElWithMouse: function(b, e, d) {
    this.callParent(arguments);
    var c = this.getTargetCoord(e, d),
      a = b.dom ? b : Ext.fly(b, "_dd");
    this.setLocalXY(a, c.x + this.deltaSetXY[0], c.y + this.deltaSetXY[1])
  },
  onViewElScroll: function(a, d) {
    var e = this.proxy,
      i = this.schedulerView,
      g = this.dragData;
    this.setVisibilityForSourceEvents(false);
    var h = e.getXY();
    var f = i.getScroll();
    var c = [h[0] + f.left - g.prevScroll.left, h[1] + f.top - g.prevScroll.top];
    var b = this.deltaSetXY;
    this.deltaSetXY = [b[0] + f.left - g.prevScroll.left, b[1] + f.top - g.prevScroll.top];
    g.prevScroll = f;
    e.setXY(c);
    this.onDragOver(a)
  },
  getCopyKeyPressed: function() {
    return Boolean(this.enableCopy && this.dragData.eventObj[this.enableCopyKey.toLowerCase() + "Key"])
  },
  checkShiftChange: function() {
    var b = this.getCopyKeyPressed(),
      a = this.dragData;
    if (b !== this.copyKeyPressed) {
      this.copyKeyPressed = b;
      if (b) {
        a.refElements.addCls("sch-event-copy");
        this.setVisibilityForSourceEvents(true)
      } else {
        a.refElements.removeCls("sch-event-copy");
        this.setVisibilityForSourceEvents(false)
      }
    }
  },
  onKey: function(a) {
    if (a.getKey() === a[this.enableCopyKey]) {
      this.checkShiftChange()
    }
  },
  startDrag: function() {
    if (this.enableCopy) {
      Ext.EventManager.on(document, "keydown", this.onKey, this);
      Ext.EventManager.on(document, "keyup", this.onKey, this)
    }
    var c = this.callParent(arguments);
    var b = this.dragData;
    b.refElement = this.proxy.el.down(".sch-dd-ref");
    b.refElements = this.proxy.el.select(".sch-event");
    b.refElement.removeCls("sch-event-hover");
    if (this.showTooltip) {
      var a = this.schedulerView;
      if (!this.tip) {
        this.tip = new Ext.ux.Scheduler.tooltip.Tooltip({
          schedulerView: a,
          cls: "sch-dragdrop-tip",
          renderTo: document.body
        })
      }
      this.tip.update(b.origStart, b.origEnd, true);
      this.tip.el.setStyle("visibility");
      this.tip.show(b.refElement, b.offsets[0])
    }
    this.copyKeyPressed = this.getCopyKeyPressed();
    if (this.copyKeyPressed) {
      b.refElements.addCls("sch-event-copy");
      b.originalHidden = true
    }
    return c
  },
  endDrag: function() {
    this.schedulerView.el.un("scroll", this.onViewElScroll, this);
    if (this.enableCopy) {
      Ext.EventManager.un(document, "keydown", this.onKey, this);
      Ext.EventManager.un(document, "keyup", this.onKey, this)
    }
    this.callParent(arguments)
  },
  updateRecords: function(b) {
    var g = this,
      i = g.schedulerView,
      k = i.resourceStore,
      d = b.newResource,
      l = b.eventRecords[0],
      m = [],
      j = this.getCopyKeyPressed(),
      c = i.eventStore;
    if (j) {
      l = l.copy();
      m.push(l)
    }
    var f = b.resourceRecord;
    l.beginEdit();
    if (d !== f) {
      l.unassign(f);
      l.assign(d)
    }
    l.setStartDate(b.startDate, true, c.skipWeekendsDuringDragDrop);
    l.endEdit();
    var a = b.timeDiff,
      n = Ext.data.TreeStore && k instanceof Ext.data.TreeStore;
    var h = n ? i.store : k;
    var e = h.indexOf(f) - h.indexOf(d);
    Ext.each(b.relatedEventRecords, function(p) {
      var q = p.getResource(null, c);
      if (j) {
        p = p.copy();
        m.push(p)
      }
      p.beginEdit();
      p.setStartDate(g.adjustStartDate(p.getStartDate(), a), true, c.skipWeekendsDuringDragDrop);
      var o = h.indexOf(q) - e;
      if (o < 0) {
        o = 0
      }
      if (o >= h.getCount()) {
        o = h.getCount() - 1
      }
      p.setResource(h.getAt(o));
      p.endEdit()
    });
    if (m.length) {
      c.add(m)
    }
    i.fireEvent("eventdrop", i, b.eventRecords, j)
  },
  isValidDrop: function(a, b, c) {
    if (a !== b && c.isAssignedTo(b)) {
      return false
    }
    return true
  },
  resolveResource: function(g, f) {
    var c = this.proxy.el.dom;
    var h = this.dragData.bodyScroll;
    c.style.display = "none";
    var d = document.elementFromPoint(g[0] - h.left, g[1] - h.top);
    if (Ext.isIE8 && f && f.browserEvent.synthetic) {
      d = document.elementFromPoint(g[0] - h.left, g[1] - h.top)
    }
    c.style.display = "block";
    if (!d) {
      return null
    }
    var a = this.schedulerView;
    if (!d.className.match(a.timeCellCls)) {
      var b = Ext.fly(d).up("." + a.timeCellCls);
      if (b) {
        d = b.dom
      } else {
        return null
      }
    }
    return a.resolveResource(d)
  },
  adjustStartDate: function(a, c) {
    var b = this.schedulerView;
    return b.timeAxis.roundDate(new Date(a - 0 + c), b.snapRelativeToEventStartDate ? a : false)
  },
  updateDragContext: function(g) {
    var a = this.dragData,
      f = g.type === "scroll" ? this.lastXY : g.getXY();
    if (!a.refElement) {
      return
    }
    var d = this.schedulerView,
      h = a.refElement.getRegion();
    if (d.timeAxis.isContinuous()) {
      if ((d.isHorizontal() && this.minX < f[0] && f[0] < this.maxX) || (d.isVertical() && this.minY < f[1] && f[1] < this.maxY)) {
        var b = d.getDateFromCoordinate(f[d.getOrientation() == "horizontal" ? 0 : 1]);
        a.timeDiff = b - a.sourceDate;
        a.startDate = this.adjustStartDate(a.origStart, a.timeDiff);
        a.endDate = new Date(a.startDate - 0 + a.duration)
      }
    } else {
      var c = this.resolveStartEndDates(h);
      a.startDate = c.startDate;
      a.endDate = c.endDate;
      a.timeDiff = a.startDate - a.origStart
    }
    a.newResource = d.constrainDragToResource ? a.resourceRecord : this.resolveResource([h.left + a.offsets[0], h.top + a.offsets[1]], g);
    if (a.newResource) {
      a.valid = this.validatorFn.call(this.validatorFnScope || this, a.eventRecords, a.newResource, a.startDate, a.duration, g)
    } else {
      a.valid = false
    }
  },
  getRelatedRecords: function(c) {
    var b = this.schedulerView;
    var d = b.selModel;
    var a = [];
    if (d.selected.getCount() > 1) {
      d.selected.each(function(e) {
        if (e !== c && e.isDraggable() !== false) {
          a.push(e)
        }
      })
    }
    return a
  },
  getDragElement: function(b, e) {
    var c = e.eventEls;
    var g;
    var a = e.offsets[0];
    var f = e.offsets[1];
    if (c.length > 1) {
      var d = Ext.core.DomHelper.createDom({
        tag: "div",
        cls: "sch-dd-wrap",
        style: {
          overflow: "visible"
        }
      });
      Ext.Array.each(c, function(i) {
        g = i.dom.cloneNode(true);
        g.id = Ext.id();
        if (i.dom === b.dom) {
          Ext.fly(g).addCls("sch-dd-ref")
        }
        d.appendChild(g);
        var h = i.getOffsetsTo(b);
        Ext.fly(g).setStyle({
          left: h[0] - a + "px",
          top: h[1] - f + "px"
        })
      });
      return d
    } else {
      g = b.dom.cloneNode(true);
      g.id = Ext.id();
      g.style.left = -a + "px";
      g.style.top = -f + "px";
      Ext.fly(g).addCls("sch-dd-ref");
      return g
    }
  },
  onDragDrop: function(h, i) {
    this.updateDragContext(h);
    var d = this,
      b = d.schedulerView,
      g = d.cachedTarget || Ext.dd.DragDropMgr.getDDById(i),
      f = d.dragData,
      a = false,
      c = true;
    f.ddCallbackArgs = [g, h, i];
    if (this.tip) {
      this.tip.onMyMouseUp()
    }
    if (f.valid && f.startDate && f.endDate) {
      f.finalize = function() {
        d.finalize.apply(d, arguments)
      };
      c = b.fireEvent("beforeeventdropfinalize", d, f, h) !== false;
      if (c && d.isValidDrop(f.resourceRecord, f.newResource, f.eventRecords[0])) {
        a = (f.startDate - f.origStart) !== 0 || f.newResource !== f.resourceRecord
      }
    }
    if (c) {
      d.finalize(f.valid && a)
    }
    b.el.un("scroll", d.onViewElScroll, d)
  },
  finalize: function(c) {
    var f = this,
      b = f.schedulerView,
      d = b.eventStore,
      g = f.dragData;
    if (f.tip) {
      f.tip.hide()
    }
    if (c) {
      var a, e = function() {
        a = true
      };
      d.on("update", e, null, {
        single: true
      });
      f.updateRecords(g);
      d.un("update", e, null, {
        single: true
      });
      if (!a) {
        f.onInvalidDrop.apply(f, g.ddCallbackArgs)
      } else {
        if (Ext.isIE9) {
          f.proxy.el.setStyle("visibility", "hidden");
          Ext.Function.defer(f.onValidDrop, 10, f, g.ddCallbackArgs)
        } else {
          f.onValidDrop.apply(f, g.ddCallbackArgs)
        }
        b.fireEvent("aftereventdrop", b, g.eventRecords)
      }
    } else {
      f.onInvalidDrop.apply(f, g.ddCallbackArgs)
    }
  },
  onInvalidDrop: function(d, c, f) {
    if (Ext.isIE && !c) {
      c = d;
      d = d.getTarget() || document.body
    }
    if (this.tip) {
      this.tip.hide()
    }
    this.setVisibilityForSourceEvents(true);
    var a = this.schedulerView,
      b = this.callParent([d, c, f]);
    a.fireEvent("aftereventdrop", a, this.dragData.eventRecords);
    return b
  },
  resolveStartEndDates: function(f) {
    var a = this.dragData,
      c, e = a.origStart,
      b = a.origEnd;
    var d = Ext.ux.Scheduler.util.Date;
    if (!a.startsOutsideView) {
      c = this.schedulerView.getStartEndDatesFromRegion(f, "round");
      if (c) {
        e = c.start || a.startDate;
        b = d.add(e, d.MILLI, a.duration)
      }
    } else {
      if (!a.endsOutsideView) {
        c = this.schedulerView.getStartEndDatesFromRegion(f, "round");
        if (c) {
          b = c.end || a.endDate;
          e = d.add(b, d.MILLI, -a.duration)
        }
      }
    }
    return {
      startDate: e,
      endDate: b
    }
  }
});
Ext.define("Ext.ux.Scheduler.feature.DragDrop", {
  requires: ["Ext.XTemplate", "Ext.ux.Scheduler.feature.SchedulerDragZone"],
  validatorFn: function(b, a, c, f, d) {
    return true
  },
  validatorFnScope: null,
  dragConfig: null,
  eventDragZone: null,
  constructor: function(d, a) {
    Ext.apply(this, a);
    this.schedulerView = d;
    var b = !!document.elementFromPoint;
    if (b) {
      this.initProxyLessDD()
    } else {
      if (typeof console !== "undefined") {
        var e = console;
        e.log("WARNING: Your browser does not support document.elementFromPoint required for the Drag drop feature")
      }
    }
    this.schedulerView.on("destroy", this.cleanUp, this);
    this.callParent([a])
  },
  cleanUp: function() {
    var a = this.schedulerView;
    if (a.eventDragZone) {
      a.eventDragZone.destroy()
    }
    if (a.dropZone) {
      a.dropZone.destroy()
    }
  },
  initProxyLessDD: function() {
    var a = this.schedulerView;
    a.eventDragZone = new Ext.ux.Scheduler.feature.SchedulerDragZone(a.ownerCt.el, Ext.apply({
      ddGroup: a.id,
      schedulerView: a,
      validatorFn: this.validatorFn,
      validatorFnScope: this.validatorFnScope
    }, this.dragConfig))
  }
});
Ext.define("Ext.ux.Scheduler.feature.ResizeZone", {
  extend: "Ext.util.Observable",
  requires: ["Ext.resizer.Resizer", "Ext.ux.Scheduler.tooltip.Tooltip", "Ext.ux.Scheduler.util.ScrollManager"],
  showTooltip: true,
  showExactResizePosition: false,
  validatorFn: Ext.emptyFn,
  validatorFnScope: null,
  schedulerView: null,
  origEl: null,
  handlePos: null,
  eventRec: null,
  tip: null,
  startScroll: null,
  constructor: function(a) {
    Ext.apply(this, a);
    var b = this.schedulerView;
    b.on({
      destroy: this.cleanUp,
      scope: this
    });
    b.mon(b.el, {
      mousedown: this.onMouseDown,
      mouseup: this.onMouseUp,
      scope: this,
      delegate: ".sch-resizable-handle"
    });
    this.callParent(arguments)
  },
  onMouseDown: function(f, a) {
    var b = this.schedulerView;
    var d = this.eventRec = b.resolveEventRecord(a);
    var c = d.isResizable();
    if (f.button !== 0 || (c === false || typeof c === "string" && !a.className.match(c))) {
      return
    }
    this.eventRec = d;
    this.handlePos = this.getHandlePosition(a);
    this.origEl = Ext.get(f.getTarget(".sch-event"));
    b.el.on({
      mousemove: this.onMouseMove,
      scope: this,
      single: true
    })
  },
  onMouseUp: function(c, a) {
    var b = this.schedulerView;
    b.el.un({
      mousemove: this.onMouseMove,
      scope: this,
      single: true
    })
  },
  onMouseMove: function(g, a) {
    var b = this.schedulerView;
    var f = this.eventRec;
    var d = this.handlePos;
    if (!f || b.fireEvent("beforeeventresize", b, f, g) === false) {
      return
    }
    delete this.eventRec;
    g.stopEvent();
    this.resizer = this.createResizer(this.origEl, f, d, g, a);
    var c = this.resizer.resizeTracker;
    if (this.showTooltip) {
      if (!this.tip) {
        this.tip = Ext.create("Ext.ux.Scheduler.tooltip.Tooltip", {
          rtl: this.rtl,
          schedulerView: b,
          renderTo: b.up("[lockable=true]").el,
          cls: "sch-resize-tip"
        })
      }
      this.tip.update(f.getStartDate(), f.getEndDate(), true);
      this.tip.show(this.origEl)
    }
    c.onMouseDown(g, this.resizer[d].dom);
    c.onMouseMove(g, this.resizer[d].dom);
    b.fireEvent("eventresizestart", b, f);
    b.el.on("scroll", this.onViewElScroll, this)
  },
  getHandlePosition: function(b) {
    var a = b.className.match("start");
    if (this.schedulerView.getOrientation() === "horizontal") {
      if (this.schedulerView.rtl) {
        return a ? "east" : "west"
      }
      return a ? "west" : "east"
    } else {
      return a ? "north" : "south"
    }
  },
  createResizer: function(c, f, p) {
    var m = this.schedulerView,
      t = this,
      b = m.getElementFromEventRecord(f),
      g = m.resolveResource(c),
      r = m.getSnapPixelAmount(),
      o = m.getScheduleRegion(g, f),
      q = m.getDateConstraints(g, f),
      n = c.getHeight,
      h = (m.rtl && p[0] === "e") || (!m.rtl && p[0] === "w") || p[0] === "n",
      i = m.getOrientation() === "vertical",
      e = {
        otherEdgeX: h ? b.getRight() : b.getLeft(),
        target: b,
        isStart: h,
        startYOffset: b.getY() - b.parent().getY(),
        dateConstraints: q,
        resourceRecord: g,
        eventRecord: f,
        handles: p[0],
        minHeight: n,
        constrainTo: o,
        listeners: {
          resizedrag: this.partialResize,
          resize: this.afterResize,
          scope: this
        }
      };
    var d = c.id;
    var k = "_" + d;
    c.id = c.dom.id = k;
    Ext.cache[k] = Ext.cache[d];
    if (i) {
      if (r > 0) {
        var j = c.getWidth();
        Ext.apply(e, {
          minHeight: r,
          minWidth: j,
          maxWidth: j,
          heightIncrement: r
        })
      }
    } else {
      if (r > 0) {
        Ext.apply(e, {
          minWidth: r,
          maxHeight: n,
          widthIncrement: r
        })
      }
    }
    var l = new Ext.resizer.Resizer(e);
    if (l.resizeTracker) {
      l.resizeTracker.tolerance = -1;
      var a = l.resizeTracker.updateDimensions;
      l.resizeTracker.updateDimensions = function(u) {
        if (!Ext.isWebKit || u.getTarget(".sch-timelineview")) {
          var s;
          if (i) {
            s = m.el.getScroll().top - t.startScroll.top;
            l.resizeTracker.minHeight = e.minHeight - Math.abs(s)
          } else {
            s = m.el.getScroll().left - t.startScroll.left;
            l.resizeTracker.minWidth = e.minWidth - Math.abs(s)
          }
          a.apply(this, arguments)
        }
      };
      l.resizeTracker.resize = function(s) {
        var u;
        if (i) {
          u = m.el.getScroll().top - t.startScroll.top;
          if (p[0] === "s") {
            s.y -= u
          }
          s.height += Math.abs(u)
        } else {
          u = m.el.getScroll().left - t.startScroll.left;
          if (p[0] === "e") {
            s.x -= u
          }
          s.width += Math.abs(u)
        }
        Ext.resizer.ResizeTracker.prototype.resize.apply(this, arguments)
      }
    }
    c.setStyle("z-index", parseInt(c.getStyle("z-index"), 10) + 1);
    Ext.ux.Scheduler.util.ScrollManager.activate(m.el, m.getOrientation());
    this.startScroll = m.el.getScroll();
    return l
  },
  getStartEndDates: function() {
    var e = this.resizer,
      c = e.el,
      d = this.schedulerView,
      b = e.isStart,
      g, a, f;
    if (b) {
      f = [d.rtl ? c.getRight() : c.getLeft() + 1, c.getTop()];
      a = e.eventRecord.getEndDate();
      if (d.snapRelativeToEventStartDate) {
        g = d.getDateFromXY(f);
        g = d.timeAxis.roundDate(g, e.eventRecord.getStartDate())
      } else {
        g = d.getDateFromXY(f, "round")
      }
    } else {
      f = [d.rtl ? c.getLeft() : c.getRight(), c.getBottom()];
      g = e.eventRecord.getStartDate();
      if (d.snapRelativeToEventStartDate) {
        a = d.getDateFromXY(f);
        a = d.timeAxis.roundDate(a, e.eventRecord.getEndDate())
      } else {
        a = d.getDateFromXY(f, "round")
      }
    }
    g = g || e.start;
    a = a || e.end;
    if (e.dateConstraints) {
      g = Ext.ux.Scheduler.util.Date.constrain(g, e.dateConstraints.start, e.dateConstraints.end);
      a = Ext.ux.Scheduler.util.Date.constrain(a, e.dateConstraints.start, e.dateConstraints.end)
    }
    return {
      start: g,
      end: a
    }
  },
  partialResize: function(b, g, m, l) {
    var p = this.schedulerView,
      o = l.type === "scroll" ? this.resizer.resizeTracker.lastXY : l.getXY(),
      n = this.getStartEndDates(o),
      f = n.start,
      h = n.end,
      j = b.eventRecord;
    if (p.isHorizontal()) {
      b.target.el.setY(b.target.parent().getY() + b.startYOffset)
    }
    if (this.showTooltip) {
      var a = this.validatorFn.call(this.validatorFnScope || this, b.resourceRecord, j, f, h) !== false;
      this.tip.update(f, h, a)
    }
    if (this.showExactResizePosition) {
      var k = b.target.el,
        d;
      if (b.isStart) {
        d = p.timeAxisViewModel.getDistanceBetweenDates(f, j.getEndDate());
        k.setWidth(d);
        var c = p.getDateFromCoordinate(b.otherEdgeX - Math.min(g, b.maxWidth)) || f;
        var i = p.timeAxisViewModel.getDistanceBetweenDates(c, f);
        k.setX(k.getX() + i)
      } else {
        d = p.timeAxisViewModel.getDistanceBetweenDates(j.getStartDate(), h);
        k.setWidth(d)
      }
    } else {
      if (!f || !h || ((b.start - f === 0) && (b.end - h === 0))) {
        return
      }
    }
    b.end = h;
    b.start = f;
    p.fireEvent("eventpartialresize", p, j, f, h, b.el)
  },
  onViewElScroll: function(b, a) {
    this.resizer.resizeTracker.onDrag.apply(this.resizer.resizeTracker, arguments);
    this.partialResize(this.resizer, 0, 0, b)
  },
  afterResize: function(a, m, f, g) {
    var j = this,
      i = a.resourceRecord,
      k = a.eventRecord,
      d = k.getStartDate(),
      p = k.getEndDate(),
      b = a.start || d,
      c = a.end || p,
      o = j.schedulerView,
      n = false,
      l = true;
    Ext.ux.Scheduler.util.ScrollManager.deactivate();
    o.el.un("scroll", this.onViewElScroll, this);
    if (this.showTooltip) {
      this.tip.hide()
    }
    delete Ext.cache[a.el.id];
    a.el.id = a.el.dom.id = a.el.id.substr(1);
    j.resizeContext = {
      resourceRecord: a.resourceRecord,
      eventRecord: k,
      start: b,
      end: c,
      finalize: function() {
        j.finalize.apply(j, arguments)
      }
    };
    if (b && c && (c - b > 0) && ((b - d !== 0) || (c - p !== 0)) && j.validatorFn.call(j.validatorFnScope || j, i, k, b, c, g) !== false) {
      l = o.fireEvent("beforeeventresizefinalize", j, j.resizeContext, g) !== false;
      n = true
    } else {
      o.repaintEventsForResource(i)
    }
    if (l) {
      j.finalize(n)
    }
  },
  finalize: function(a) {
    var b = this.schedulerView;
    var d = this.resizeContext;
    var c = false;
    d.eventRecord.store.on("update", function() {
      c = true
    }, null, {
      single: true
    });
    if (a) {
      if (this.resizer.isStart) {
        d.eventRecord.setStartDate(d.start, false, b.eventStore.skipWeekendsDuringDragDrop)
      } else {
        d.eventRecord.setEndDate(d.end, false, b.eventStore.skipWeekendsDuringDragDrop)
      }
      if (!c) {
        b.repaintEventsForResource(d.resourceRecord)
      }
    } else {
      b.repaintEventsForResource(d.resourceRecord)
    }
    this.resizer.destroy();
    b.fireEvent("eventresizeend", b, d.eventRecord);
    this.resizeContext = null
  },
  cleanUp: function() {
    if (this.tip) {
      this.tip.destroy()
    }
  }
});
Ext.define("Ext.ux.Scheduler.feature.Grouping", {
  extend: "Ext.grid.feature.Grouping",
  alias: "feature.scheduler_grouping",
  headerRenderer: Ext.emptyFn,
  timeAxisViewModel: null,
  headerCellTpl: '<tpl for="."><div class="sch-grid-group-hd-cell {cellCls}" style="{cellStyle}; width: {width}px;"><span>{value}</span></div></tpl>',
  renderCells: function(e) {
    var a = [];
    var c = this.timeAxisViewModel.columnConfig[this.timeAxisViewModel.columnLinesFor];
    for (var b = 0; b < c.length; b++) {
      var f = {};
      var d = this.headerRenderer(c[b].start, c[b].end, e.groupInfo.children, f);
      f.value = d;
      f.width = c[b].width;
      a.push(f)
    }
    return this.headerCellTpl.apply(a)
  },
  init: function() {
    this.callParent(arguments);
    if (typeof this.headerCellTpl === "string") {
      this.headerCellTpl = new Ext.XTemplate(this.headerCellTpl)
    }
    if (this.view.eventStore) {
      this.timeAxisViewModel = this.view.timeAxisViewModel;
      this.view.mon(this.view.eventStore, {
        add: this.refreshGroupHeader,
        remove: this.refreshGroupHeader,
        update: this.refreshGroupHeader,
        scope: this
      })
    }
  },
  destroy: function() {
    this.callParent(arguments)
  },
  getNodeIndex: function(b, a) {
    var c = b.resourceStore;
    var d = c.getGroups(c.getGroupString(a.getResource(null, b.eventStore)));
    return b.store.indexOf(d.children[0])
  },
  refreshGroupHeader: function(c, b) {
    var d = this,
      a = d.view;
    b = Ext.isArray(b) ? b : [b];
    Ext.Array.each(b, function(e) {
      a.refreshNode(d.getNodeIndex(a, e))
    })
  },
  groupTpl: ["{%", "var me = this.groupingFeature;", "if (me.disabled) {", "values.needsWrap = false;", "} else {", "me.setupRowData(values.record, values.recordIndex, values);", "values.needsWrap = !me.disabled && (values.isFirstRow || values.summaryRecord);", "}", "%}", '<tpl if="needsWrap">', '<tr data-boundView="{view.id}" data-recordId="{record.internalId}" data-recordIndex="{[values.isCollapsedGroup ? -1 : values.recordIndex]}"', 'class="{[values.itemClasses.join(" ")]} ' + Ext.baseCSSPrefix + 'grid-wrap-row<tpl if="!summaryRecord"> ' + Ext.baseCSSPrefix + 'grid-group-row</tpl>">', '<td class="' + Ext.baseCSSPrefix + 'group-hd-container" colspan="{columns.length}">', '<tpl if="isFirstRow">', "{%", 'var groupTitleStyle = (!values.view.lockingPartner || (values.view.ownerCt === values.view.ownerCt.ownerLockable.lockedGrid) || (values.view.lockingPartner.headerCt.getVisibleGridColumns().length === 0)) ? "" : "visibility:hidden";', "%}", '<tpl if="(values.view.ownerCt === values.view.ownerCt.ownerLockable.lockedGrid) || !this.groupingFeature.headerRenderer || this.groupingFeature.headerRenderer == Ext.emptyFn">', '<div id="{groupId}" class="', Ext.baseCSSPrefix, 'grid-group-hd {collapsibleCls}" tabIndex="0" hidefocus="on" {ariaCellInnerAttr}>', '<div class="', Ext.baseCSSPrefix, 'grid-group-title" style="{[groupTitleStyle]}" {ariaGroupTitleAttr}>', '{[values.groupHeaderTpl.apply(values.groupInfo, parent) || "&#160;"]}', "</div>", "</div>", "<tpl else>", '<div id="{groupId}" class="', Ext.baseCSSPrefix, 'grid-group-hd sch-grid-group-hd {collapsibleCls}" tabIndex="0" hidefocus="on" {ariaCellInnerAttr}>', "{[this.groupingFeature.renderCells(values)]}", "</div>", "</tpl>", "</tpl>", '<tpl if="summaryRecord || !isCollapsedGroup">', '<table class="', Ext.baseCSSPrefix, "{view.id}-table ", Ext.baseCSSPrefix, "grid-table", '<tpl if="summaryRecord"> ', Ext.baseCSSPrefix, 'grid-table-summary</tpl>"', 'border="0" cellspacing="0" cellpadding="0" style="width:100%">', "{[values.view.renderColumnSizer(out)]}", '<tpl if="!isCollapsedGroup">', "{%", "values.itemClasses.length = 0;", "this.nextTpl.applyOut(values, out, parent);", "%}", "</tpl>", '<tpl if="summaryRecord">', "{%me.outputSummaryRecord(values.summaryRecord, values, out);%}", "</tpl>", "</table>", "</tpl>", "</td>", "</tr>", "<tpl else>", "{%this.nextTpl.applyOut(values, out, parent);%}", "</tpl>", {
    priority: 200,
    syncRowHeights: function(d, i) {
      d = Ext.fly(d, "syncDest");
      i = Ext.fly(i, "sycSrc");
      var b = this.owner,
        e = d.down(b.eventSelector, true),
        f, g = d.down(b.summaryRowSelector, true),
        c, a, h;
      if (e && (f = i.down(b.eventSelector, true))) {
        e.style.height = f.style.height = "";
        if ((a = e.offsetHeight) > (h = f.offsetHeight)) {
          Ext.fly(f).setHeight(a)
        } else {
          if (h > a) {
            Ext.fly(e).setHeight(h)
          }
        }
      }
      if (g && (c = i.down(b.summaryRowSelector, true))) {
        g.style.height = c.style.height = "";
        if ((a = g.offsetHeight) > (h = c.offsetHeight)) {
          Ext.fly(c).setHeight(a)
        } else {
          if (h > a) {
            Ext.fly(g).setHeight(h)
          }
        }
      }
    },
    syncContent: function(b, g) {
      b = Ext.fly(b, "syncDest");
      g = Ext.fly(g, "sycSrc");
      var a = this.owner,
        d = b.down(a.eventSelector, true),
        c = g.down(a.eventSelector, true),
        f = b.down(a.summaryRowSelector, true),
        e = g.down(a.summaryRowSelector, true);
      if (d && c) {
        Ext.fly(d).syncContent(c)
      }
      if (f && e) {
        Ext.fly(f).syncContent(e)
      }
    }
  }]
});
Ext.define("Ext.ux.Scheduler.eventlayout.Horizontal", {
  timeAxisViewModel: null,
  view: null,
  nbrOfBandsByResource: null,
  constructor: function(a) {
    Ext.apply(this, a);
    this.nbrOfBandsByResource = {}
  },
  clearCache: function(a) {
    if (a) {
      delete this.nbrOfBandsByResource[a.internalId]
    } else {
      this.nbrOfBandsByResource = {}
    }
  },
  getNumberOfBands: function(b, c) {
    if (!this.view.dynamicRowHeight) {
      return 1
    }
    var a = this.nbrOfBandsByResource;
    if (a.hasOwnProperty(b.internalId)) {
      return a[b.internalId]
    }
    return this.calculateNumberOfBands(b, c)
  },
  getRowHeight: function(b, c) {
    var a = this.view;
    var d = this.getNumberOfBands(b, c);
    return (d * this.timeAxisViewModel.rowHeightHorizontal) - ((d - 1) * a.barMargin)
  },
  calculateNumberOfBands: function(e, g) {
    var f = [];
    g = g || this.view.eventStore.getEventsForResource(e);
    var d = this.view.timeAxis;
    for (var b = 0; b < g.length; b++) {
      var c = g[b];
      var h = c.getStartDate();
      var a = c.getEndDate();
      if (h && a && d.timeSpanInAxis(h, a)) {
        f[f.length] = {
          start: h,
          end: a
        }
      }
    }
    return this.applyLayout(f, e)
  },
  applyLayout: function(a, b) {
    var c = a.slice();
    c.sort(this.sortEvents);
    return this.nbrOfBandsByResource[b.internalId] = this.layoutEventsInBands(0, c)
  },
  sortEvents: function(e, d) {
    var c = (e.start - d.start === 0);
    if (c) {
      return e.end > d.end ? -1 : 1
    } else {
      return (e.start < d.start) ? -1 : 1
    }
  },
  layoutEventsInBands: function(e, b) {
    var a = this.view;
    do {
      var d = b[0],
        c = e === 0 ? a.barMargin : (e * this.timeAxisViewModel.rowHeightHorizontal - (e - 1) * a.barMargin);
      if (c >= a.cellBottomBorderWidth) {
        c -= a.cellBottomBorderWidth
      }
      while (d) {
        d.top = c;
        Ext.Array.remove(b, d);
        d = this.findClosestSuccessor(d, b)
      }
      e++
    } while (b.length > 0);
    return e
  },
  findClosestSuccessor: function(g, e) {
    var c = Infinity,
      f, a = g.end,
      h;
    for (var d = 0, b = e.length; d < b; d++) {
      h = e[d].start - a;
      if (h >= 0 && h < c) {
        f = e[d];
        c = h
      }
    }
    return f
  }
});
Ext.define("Ext.ux.Scheduler.eventlayout.Vertical", {
  requires: ["Ext.ux.Scheduler.util.Date"],
  constructor: function(a) {
    Ext.apply(this, a)
  },
  applyLayout: function(a, f) {
    if (a.length === 0) {
      return
    }
    a.sort(this.sortEvents);
    var d, c, k = this.view,
      m = Ext.ux.Scheduler.util.Date,
      o = 1,
      s, b, h = f - (2 * k.barMargin),
      e, r;
    for (var t = 0, q = a.length; t < q; t++) {
      e = a[t];
      d = e.start;
      c = e.end;
      b = this.findStartSlot(a, e);
      var u = this.getCluster(a, t);
      if (u.length > 1) {
        e.left = b.start;
        e.width = b.end - b.start;
        r = 1;
        while (r < (u.length - 1) && u[r + 1].start - e.start === 0) {
          r++
        }
        var p = this.findStartSlot(a, u[r]);
        if (p && p.start < 0.8) {
          u = u.slice(0, r)
        }
      }
      var g = u.length,
        n = (b.end - b.start) / g;
      for (r = 0; r < g; r++) {
        u[r].width = n;
        u[r].left = b.start + (r * n)
      }
      t += g - 1
    }
    for (t = 0, q = a.length; t < q; t++) {
      a[t].width = a[t].width * h;
      a[t].left = k.barMargin + (a[t].left * h)
    }
  },
  findStartSlot: function(c, d) {
    var a = this.getPriorOverlappingEvents(c, d),
      b;
    if (a.length === 0) {
      return {
        start: 0,
        end: 1
      }
    }
    for (b = 0; b < a.length; b++) {
      if (b === 0 && a[0].left > 0) {
        return {
          start: 0,
          end: a[0].left
        }
      } else {
        if (a[b].left + a[b].width < (b < a.length - 1 ? a[b + 1].left : 1)) {
          return {
            start: a[b].left + a[b].width,
            end: b < a.length - 1 ? a[b + 1].left : 1
          }
        }
      }
    }
    return false
  },
  getPriorOverlappingEvents: function(e, f) {
    var g = Ext.ux.Scheduler.util.Date,
      h = f.start,
      b = f.end,
      c = [];
    for (var d = 0, a = Ext.Array.indexOf(e, f); d < a; d++) {
      if (g.intersectSpans(h, b, e[d].start, e[d].end)) {
        c.push(e[d])
      }
    }
    c.sort(this.sortOverlappers);
    return c
  },
  sortOverlappers: function(b, a) {
    return b.left < a.left ? -1 : 1
  },
  getCluster: function(e, g) {
    if (g >= e.length - 1) {
      return [e[g]]
    }
    var c = [e[g]],
      h = e[g].start,
      b = e[g].end,
      a = e.length,
      f = Ext.ux.Scheduler.util.Date,
      d = g + 1;
    while (d < a && f.intersectSpans(h, b, e[d].start, e[d].end)) {
      c.push(e[d]);
      h = f.max(h, e[d].start);
      b = f.min(e[d].end, b);
      d++
    }
    return c
  },
  sortEvents: function(e, d) {
    var c = (e.start - d.start === 0);
    if (c) {
      return e.end > d.end ? -1 : 1
    } else {
      return (e.start < d.start) ? -1 : 1
    }
  }
});
Ext.define("Ext.ux.Scheduler.column.Summary", {
  extend: "Ext.grid.column.Column",
  alias: ["widget.summarycolumn", "plugin.scheduler_summarycolumn"],
  mixins: ["Ext.AbstractPlugin"],
  alternateClassName: "Ext.ux.Scheduler.plugin.SummaryColumn",
  init: Ext.emptyFn,
  lockableScope: "top",
  showPercent: false,
  nbrDecimals: 1,
  sortable: false,
  fixed: true,
  menuDisabled: true,
  width: 80,
  dataIndex: "_sch_not_used",
  timeAxis: null,
  eventStore: null,
  constructor: function(a) {
    this.scope = this;
    this.callParent(arguments)
  },
  beforeRender: function() {
    this.callParent(arguments);
    var a = this.up("tablepanel[lockable=true]");
    this.timeAxis = a.getTimeAxis();
    a.lockedGridDependsOnSchedule = true;
    this.eventStore = a.getEventStore()
  },
  renderer: function(j, a, g) {
    var h = this.timeAxis,
      e = this.eventStore,
      f = h.getStart(),
      i = h.getEnd(),
      c = 0,
      b = this.calculate(e.getEventsForResource(g), f, i);
    if (b <= 0) {
      return ""
    }
    if (this.showPercent) {
      var d = Ext.ux.Scheduler.util.Date.getDurationInMinutes(f, i);
      return (Math.round((b * 100) / d)) + " %"
    } else {
      if (b > 1440) {
        return (b / 1440).toFixed(this.nbrDecimals) + " " + Ext.ux.Scheduler.util.Date.getShortNameOfUnit("DAY")
      }
      if (b >= 30) {
        return (b / 60).toFixed(this.nbrDecimals) + " " + Ext.ux.Scheduler.util.Date.getShortNameOfUnit("HOUR")
      }
      return b + " " + Ext.ux.Scheduler.util.Date.getShortNameOfUnit("MINUTE")
    }
  },
  calculate: function(c, g, d) {
    var e = 0,
      b, a, f = Ext.ux.Scheduler.util.Date;
    Ext.each(c, function(h) {
      b = h.getStartDate();
      a = h.getEndDate();
      if (f.intersectSpans(g, d, b, a)) {
        e += f.getDurationInMinutes(f.max(b, g), f.min(a, d))
      }
    });
    return e
  }
});
Ext.define("Ext.ux.Scheduler.column.Resource", {
  extend: "Ext.grid.Column",
  alias: "widget.resourcecolumn",
  cls: "sch-resourcecolumn-header",
  align: "center",
  menuDisabled: true,
  hideable: false,
  sortable: false,
  locked: false,
  lockable: false,
  draggable: false,
  enableLocking: false,
  tdCls: "sch-timetd",
  model: null
});
if (!Ext.ClassManager.get("Ext.ux.Scheduler.view.model.TimeAxis")) {
  Ext.define("Ext.ux.Scheduler.view.model.TimeAxis", {
    extend: "Ext.util.Observable",
    requires: ["Ext.Date", "Ext.ux.Scheduler.util.Date", "Ext.ux.Scheduler.preset.Manager"],
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
    timeColumnWidth: null,
    rowHeightHorizontal: null,
    rowHeightVertical: null,
    orientation: "horizontal",
    suppressFit: false,
    refCount: 0,
    columnConfig: {},
    viewPreset: null,
    columnLinesFor: "middle",
    constructor: function(a) {
      var c = this;
      Ext.apply(this, a);
      if (this.viewPreset) {
        var b = Ext.ux.Scheduler.preset.Manager.getPreset(this.viewPreset);
        b && this.consumeViewPreset(b)
      }
      c.timeAxis.on("reconfigure", c.onTimeAxisReconfigure, c);
      this.callParent(arguments)
    },
    destroy: function() {
      this.timeAxis.un("reconfigure", this.onTimeAxisReconfigure, this)
    },
    onTimeAxisReconfigure: function(b, a, c) {
      if (!c) {
        this.update()
      }
    },
    reconfigure: function(a) {
      this.headers = null;
      Ext.apply(this, a);
      if (this.orientation == "horizontal") {
        this.setTickWidth(this.timeColumnWidth)
      } else {
        this.setTickWidth(this.rowHeightVertical)
      }
      this.fireEvent("reconfigure", this)
    },
    getColumnConfig: function() {
      return this.columnConfig
    },
    update: function(d, b) {
      var e = this.timeAxis,
        c = this.headerConfig;
      this.availableWidth = Math.max(d || this.availableWidth, 0);
      if (!Ext.isNumber(this.availableWidth)) {
        throw "Invalid available width provided to Ext.ux.Scheduler.view.model.TimeAxis"
      }
      if (this.forceFit && this.availableWidth <= 0) {
        return
      }
      this.columnConfig = {};
      for (var f in c) {
        if (c[f].cellGenerator) {
          this.columnConfig[f] = c[f].cellGenerator.call(this, e.getStart(), e.getEnd())
        } else {
          this.columnConfig[f] = this.createHeaderRow(f, c[f])
        }
      }
      var a = this.calculateTickWidth(this.getTickWidth());
      if (!Ext.isNumber(a) || a <= 0) {
        throw "Invalid column width calculated in Ext.ux.Scheduler.view.model.TimeAxis"
      }
      this.updateTickWidth(a);
      if (!b) {
        this.fireEvent("update", this)
      }
    },
    createHeaderRow: function(a, d) {
      var c = [],
        e = this,
        f = d.align,
        b = Ext.Date.clearTime(new Date());
      e.forEachInterval(a, function(k, g, h) {
        var j = {
          align: f,
          start: k,
          end: g,
          headerCls: ""
        };
        if (d.renderer) {
          j.header = d.renderer.call(d.scope || e, k, g, j, h)
        } else {
          j.header = Ext.Date.format(k, d.dateFormat)
        }
        if (d.unit === Ext.ux.Scheduler.util.Date.DAY && (!d.increment || d.increment === 1)) {
          j.headerCls += " sch-dayheadercell-" + k.getDay();
          if (Ext.Date.clearTime(k, true) - b === 0) {
            j.headerCls += " sch-dayheadercell-today"
          }
        }
        c.push(j)
      });
      return c
    },
    getDistanceBetweenDates: function(b, a) {
      return Math.round(this.getPositionFromDate(a) - this.getPositionFromDate(b))
    },
    getPositionFromDate: function(a) {
      var c = -1,
        b = this.timeAxis.getTickFromDate(a);
      if (b >= 0) {
        c = Math.round(this.tickWidth * (b - this.timeAxis.visibleTickStart))
      }
      return c
    },
    getDateFromPosition: function(a, d) {
      var c = a / this.getTickWidth() + this.timeAxis.visibleTickStart,
        b = this.timeAxis.getCount();
      if (c < 0 || c > b) {
        return null
      }
      return this.timeAxis.getDateFromTick(c, d)
    },
    getSingleUnitInPixels: function(a) {
      return Ext.ux.Scheduler.util.Date.getUnitToBaseUnitRatio(this.timeAxis.getUnit(), a) * this.tickWidth / this.timeAxis.increment
    },
    getSnapPixelAmount: function() {
      if (this.snapToIncrement) {
        var a = this.timeAxis.getResolution();
        return (a.increment || 1) * this.getSingleUnitInPixels(a.unit)
      } else {
        return 1
      }
    },
    getTickWidth: function() {
      return this.tickWidth
    },
    setTickWidth: function(b, a) {
      this.updateTickWidth(b);
      this.update(null, a)
    },
    updateTickWidth: function(a) {
      this.tickWidth = a;
      if (this.orientation == "horizontal") {
        this.timeColumnWidth = a
      } else {
        this.rowHeightVertical = a
      }
    },
    getTotalWidth: function() {
      return Math.round(this.tickWidth * this.timeAxis.getVisibleTickTimeSpan())
    },
    calculateTickWidth: function(d) {
      var j = this.forceFit;
      var g = this.timeAxis;
      var b = 0,
        f = g.getUnit(),
        i = Number.MAX_VALUE,
        c = Ext.ux.Scheduler.util.Date;
      if (this.snapToIncrement) {
        var e = g.getResolution();
        i = c.getUnitToBaseUnitRatio(f, e.unit) * e.increment
      } else {
        var h = c.getMeasuringUnit(f);
        i = Math.min(i, c.getUnitToBaseUnitRatio(f, h))
      }
      var a = Math[j ? "floor" : "round"](this.getAvailableWidth() / g.getVisibleTickTimeSpan());
      if (!this.suppressFit) {
        b = (j || d < a) ? a : d;
        if (i > 0 && (!j || i < 1)) {
          b = Math.round(Math.max(1, Math[j ? "floor" : "round"](i * b)) / i)
        }
      } else {
        b = d
      }
      return b
    },
    getAvailableWidth: function() {
      return this.availableWidth
    },
    setAvailableWidth: function(a) {
      this.availableWidth = Math.max(0, a);
      var b = this.calculateTickWidth(this.tickWidth);
      if (b !== this.tickWidth) {
        this.setTickWidth(b)
      }
    },
    fitToAvailableWidth: function(a) {
      var b = Math.floor(this.availableWidth / this.timeAxis.getVisibleTickTimeSpan());
      this.setTickWidth(b, a)
    },
    setForceFit: function(a) {
      if (a !== this.forceFit) {
        this.forceFit = a;
        this.update()
      }
    },
    setSnapToIncrement: function(a) {
      if (a !== this.snapToIncrement) {
        this.snapToIncrement = a;
        this.update()
      }
    },
    getViewRowHeight: function() {
      var a = this.orientation == "horizontal" ? this.rowHeightHorizontal : this.rowHeightVertical;
      if (!a) {
        throw "rowHeight info not available"
      }
      return a
    },
    setViewRowHeight: function(c, a) {
      var d = this.orientation === "horizontal";
      var b = "rowHeight" + Ext.String.capitalize(this.orientation);
      if (this[b] != c) {
        this[b] = c;
        if (d) {
          if (!a) {
            this.fireEvent("update", this)
          }
        } else {
          this.setTickWidth(c, a)
        }
      }
    },
    setViewColumnWidth: function(b, a) {
      if (this.orientation === "horizontal") {
        this.setTickWidth(b, a)
      } else {
        this.resourceColumnWidth = b
      }
    },
    getHeaders: function() {
      if (this.headers) {
        return this.headers
      }
      var a = this.headerConfig;
      this.mainHeader = a.top ? 1 : 0;
      return this.headers = [].concat(a.top || [], a.middle || [], a.bottom || [])
    },
    getMainHeader: function() {
      return this.getHeaders()[this.mainHeader]
    },
    getBottomHeader: function() {
      var a = this.getHeaders();
      return a[a.length - 1]
    },
    forEachInterval: function(b, a, d) {
      d = d || this;
      var c = this.headerConfig;
      if (!c) {
        return
      }
      if (b === "top" || (b === "middle" && c.bottom)) {
        var e = c[b];
        this.timeAxis.forEachAuxInterval(e.unit, e.increment, a, d)
      } else {
        this.timeAxis.each(function(g, f) {
          return a.call(d, g.data.start, g.data.end, f)
        })
      }
    },
    forEachMainInterval: function(a, b) {
      this.forEachInterval("middle", a, b)
    },
    consumeViewPreset: function(a) {
      this.headers = null;
      var b = this.orientation == "horizontal";
      Ext.apply(this, {
        headerConfig: a.headerConfig,
        columnLinesFor: a.columnLinesFor || "middle",
        rowHeightHorizontal: a.rowHeight,
        tickWidth: b ? a.timeColumnWidth : a.timeRowHeight || a.timeColumnWidth || 60,
        timeColumnWidth: a.timeColumnWidth,
        rowHeightVertical: a.timeRowHeight || a.timeColumnWidth || 60,
        timeAxisColumnWidth: a.timeAxisColumnWidth,
        resourceColumnWidth: a.resourceColumnWidth || 100
      })
    }
  })
}
Ext.define("Ext.ux.Scheduler.view.HorizontalTimeAxis", {
  extend: "Ext.util.Observable",
  requires: ["Ext.XTemplate"],
  trackHeaderOver: true,
  compactCellWidthThreshold: 15,
  baseCls: "sch-column-header",
  tableCls: "sch-header-row",
  headerHtmlRowTpl: '<table border="0" cellspacing="0" cellpadding="0" style="width: {totalWidth}px; {tstyle}" class="{{tableCls}} sch-header-row-{position} {cls}"><thead><tr><tpl for="cells"><td class="{{baseCls}} {headerCls}" style="position : static; text-align: {align}; width: {width}px; {style}" tabIndex="0"headerPosition="{parent.position}" headerIndex="{[xindex-1]}"><div class="sch-simple-timeheader">{header}</div></td></tpl></tr></thead></table>',
  model: null,
  hoverCls: "",
  containerEl: null,
  height: null,
  constructor: function(d) {
    var e = this;
    var b = !!Ext.versions.touch;
    var a = b ? "tap" : "click";
    Ext.apply(this, d);
    e.callParent(arguments);
    e.model.on("update", e.onModelUpdate, this, {
      priority: 5
    });
    e.containerEl = Ext.get(e.containerEl);
    if (!(e.headerHtmlRowTpl instanceof Ext.Template)) {
      e.headerHtmlRowTpl = e.headerHtmlRowTpl.replace("{{baseCls}}", this.baseCls).replace("{{tableCls}}", this.tableCls);
      e.headerHtmlRowTpl = new Ext.XTemplate(e.headerHtmlRowTpl)
    }
    if (e.trackHeaderOver && e.hoverCls) {
      e.containerEl.on({
        mousemove: e.highlightCell,
        delegate: ".sch-column-header",
        scope: e
      });
      e.containerEl.on({
        mouseleave: e.clearHighlight,
        scope: e
      })
    }
    var c = {
      scope: this,
      delegate: ".sch-column-header"
    };
    if (b) {
      c.tap = this.onElClick("tap");
      c.doubletap = this.onElClick("doubletap")
    } else {
      c.click = this.onElClick("click");
      c.dblclick = this.onElClick("dblclick");
      c.contextmenu = this.onElClick("contextmenu")
    }
    e._listenerCfg = c;
    if (e.containerEl) {
      e.containerEl.on(c)
    }
  },
  destroy: function() {
    var a = this;
    if (a.containerEl) {
      a.containerEl.un(a._listenerCfg);
      a.containerEl.un({
        mousemove: a.highlightCell,
        delegate: ".sch-simple-timeheader",
        scope: a
      });
      a.containerEl.un({
        mouseleave: a.clearHighlight,
        scope: a
      })
    }
    a.model.un({
      update: a.onModelUpdate,
      scope: a
    })
  },
  onModelUpdate: function() {
    this.render()
  },
  getHTML: function(e, h, d) {
    var i = this.model.getColumnConfig();
    var g = this.model.getTotalWidth();
    var c = Ext.Object.getKeys(i).length;
    var b = this.height ? this.height / c : 0;
    var f = "";
    var a;
    if (i.top) {
      this.embedCellWidths(i.top);
      f += this.headerHtmlRowTpl.apply({
        totalWidth: g,
        cells: i.top,
        position: "top",
        tstyle: "border-top : 0;" + (b ? "height:" + b + "px" : "")
      })
    }
    if (i.middle) {
      this.embedCellWidths(i.middle);
      f += this.headerHtmlRowTpl.apply({
        totalWidth: g,
        cells: i.middle,
        position: "middle",
        tstyle: (i.top ? "" : "border-top : 0;") + (b ? "height:" + b + "px" : ""),
        cls: !i.bottom && this.model.getTickWidth() <= this.compactCellWidthThreshold ? "sch-header-row-compact" : ""
      })
    }
    if (i.bottom) {
      this.embedCellWidths(i.bottom);
      f += this.headerHtmlRowTpl.apply({
        totalWidth: g,
        cells: i.bottom,
        position: "bottom",
        tstyle: (b ? "height:" + b + "px" : ""),
        cls: this.model.getTickWidth() <= this.compactCellWidthThreshold ? "sch-header-row-compact" : ""
      })
    }
    return f + '<div class="sch-header-secondary-canvas"></div>'
  },
  render: function() {
    if (!this.containerEl) {
      return
    }
    var e = this.containerEl,
      f = e.dom,
      d = f.style.display,
      a = this.model.getColumnConfig(),
      b = f.parentNode;
    f.style.display = "none";
    b.removeChild(f);
    var c = this.getHTML();
    f.innerHTML = c;
    if (!a.top && !a.middle) {
      this.containerEl.addCls("sch-header-single-row")
    } else {
      this.containerEl.removeCls("sch-header-single-row")
    }
    b && b.appendChild(f);
    f.style.display = d;
    this.fireEvent("refresh", this)
  },
  embedCellWidths: function(b) {
    var e = (Ext.isIE7 || Ext.isSafari) ? 1 : 0;
    for (var c = 0; c < b.length; c++) {
      var a = b[c];
      var d = this.model.getDistanceBetweenDates(a.start, a.end);
      if (d) {
        a.width = d - (c ? e : 0)
      } else {
        a.width = 0;
        a.style = "display: none"
      }
    }
  },
  onElClick: function(a) {
    return function(e, f) {
      f = e.delegatedTarget || f;
      var b = Ext.fly(f).getAttribute("headerPosition"),
        c = Ext.fly(f).getAttribute("headerIndex"),
        d = this.model.getColumnConfig()[b][c];
      this.fireEvent("timeheader" + a, this, d.start, d.end, e)
    }
  },
  highlightCell: function(c, a) {
    var b = this;
    if (a !== b.highlightedCell) {
      b.clearHighlight();
      b.highlightedCell = a;
      Ext.fly(a).addCls(b.hoverCls)
    }
  },
  clearHighlight: function() {
    var b = this,
      a = b.highlightedCell;
    if (a) {
      Ext.fly(a).removeCls(b.hoverCls);
      delete b.highlightedCell
    }
  }
});
Ext.define("Ext.ux.Scheduler.column.timeAxis.Horizontal", {
  extend: "Ext.grid.column.Column",
  alias: "widget.timeaxiscolumn",
  draggable: false,
  groupable: false,
  hideable: false,
  sortable: false,
  fixed: true,
  menuDisabled: true,
  cls: "sch-simple-timeaxis",
  tdCls: "sch-timetd",
  enableLocking: false,
  requires: ["Ext.ux.Scheduler.view.HorizontalTimeAxis"],
  timeAxisViewModel: null,
  headerView: null,
  hoverCls: "",
  ownHoverCls: "sch-column-header-over",
  trackHeaderOver: true,
  compactCellWidthThreshold: 20,
  initComponent: function() {
    this.callParent(arguments)
  },
  afterRender: function() {
    var a = this;
    a.headerView = new Ext.ux.Scheduler.view.HorizontalTimeAxis({
      model: a.timeAxisViewModel,
      containerEl: a.titleEl,
      hoverCls: a.ownHoverCls,
      trackHeaderOver: a.trackHeaderOver,
      compactCellWidthThreshold: a.compactCellWidthThreshold
    });
    a.headerView.on("refresh", a.onTimeAxisViewRefresh, a);
    a.ownerCt.on("afterlayout", function() {
      a.mon(a.ownerCt, "resize", a.onHeaderContainerResize, a);
      if (this.getWidth() > 0) {
        if (a.getAvailableWidthForSchedule() === a.timeAxisViewModel.getAvailableWidth()) {
          a.headerView.render()
        } else {
          a.timeAxisViewModel.update(a.getAvailableWidthForSchedule())
        }
        a.setWidth(a.timeAxisViewModel.getTotalWidth())
      }
    }, null, {
      single: true
    });
    this.enableBubble("timeheaderclick", "timeheaderdblclick", "timeheadercontextmenu");
    a.relayEvents(a.headerView, ["timeheaderclick", "timeheaderdblclick", "timeheadercontextmenu"]);
    a.callParent(arguments)
  },
  initRenderData: function() {
    var a = this;
    a.renderData.headerCls = a.renderData.headerCls || a.headerCls;
    return a.callParent(arguments)
  },
  destroy: function() {
    if (this.headerView) {
      this.headerView.destroy()
    }
    this.callParent(arguments)
  },
  onTimeAxisViewRefresh: function() {
    this.headerView.un("refresh", this.onTimeAxisViewRefresh, this);
    this.setWidth(this.timeAxisViewModel.getTotalWidth());
    this.headerView.on("refresh", this.onTimeAxisViewRefresh, this)
  },
  getAvailableWidthForSchedule: function() {
    var c = this.ownerCt.getWidth();
    var a = this.ownerCt.items;
    for (var b = 1; b < a.length; b++) {
      c -= a.get(b).getWidth()
    }
    return c - Ext.getScrollbarSize().width - 1
  },
  onResize: function() {
    this.callParent(arguments);
    this.timeAxisViewModel.setAvailableWidth(this.getAvailableWidthForSchedule())
  },
  onHeaderContainerResize: function() {
    this.timeAxisViewModel.setAvailableWidth(this.getAvailableWidthForSchedule());
    this.headerView.render()
  },
  refresh: function() {
    this.timeAxisViewModel.update(null, true);
    this.headerView.render()
  }
});
Ext.define("Ext.ux.Scheduler.column.timeAxis.Vertical", {
  extend: "Ext.grid.column.Column",
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
  initComponent: function() {
    this.callParent(arguments);
    this.tdCls = (this.tdCls || "") + " sch-verticaltimeaxis-cell";
    this.scope = this;
    this.totalBorderWidth = this.cellTopBorderWidth + this.cellBottomBorderWidth
  },
  afterRender: function() {
    this.callParent(arguments);
    var a = this.up("panel");
    a.getView().on("resize", this.onContainerResize, this)
  },
  onContainerResize: function(c, b, a) {
    this.timeAxisViewModel.update(a - 21)
  },
  renderer: function(d, b, a, e) {
    var c = this.timeAxisViewModel.getBottomHeader();
    b.style = "height:" + (this.timeAxisViewModel.getTickWidth() - this.totalBorderWidth) + "px";
    if (c.renderer) {
      return c.renderer.call(c.scope || this, a.data.start, a.data.end, b, e)
    } else {
      return Ext.Date.format(a.data.start, c.dateFormat)
    }
  }
});
Ext.define("Ext.ux.Scheduler.mixin.Lockable", {
  extend: "Ext.grid.locking.Lockable",
  useSpacer: true,
  syncRowHeight: false,
  horizontalScrollForced: false,
  injectLockable: function() {
    var j = this;
    var h = Ext.data.TreeStore && j.store instanceof Ext.data.TreeStore;
    var c = j.getEventSelectionModel ? j.getEventSelectionModel() : j.getSelectionModel();
    j.lockedGridConfig = Ext.apply({}, j.lockedGridConfig || {});
    j.normalGridConfig = Ext.apply({}, j.schedulerConfig || j.normalGridConfig || {});
    if (j.lockedXType) {
      j.lockedGridConfig.xtype = j.lockedXType
    }
    if (j.normalXType) {
      j.normalGridConfig.xtype = j.normalXType
    }
    var a = j.lockedGridConfig,
      i = j.normalGridConfig;
    Ext.applyIf(j.lockedGridConfig, {
      useArrows: true,
      trackMouseOver: false,
      split: true,
      animCollapse: false,
      collapseDirection: "left",
      region: "west"
    });
    Ext.applyIf(j.normalGridConfig, {
      viewType: j.viewType,
      layout: "fit",
      sortableColumns: false,
      enableColumnMove: false,
      enableColumnResize: false,
      enableColumnHide: false,
      getSchedulingView: function() {
        var m = typeof console !== "undefined" ? console : false;
        if (m && m.log) {
          m.log('getSchedulingView is deprecated on the inner grid panel. Instead use getView on the "normal" subgrid.')
        }
        return this.getView()
      },
      selModel: c,
      collapseDirection: "right",
      animCollapse: false,
      region: "center"
    });
    if (j.orientation === "vertical") {
      a.store = i.store = j.timeAxis
    }
    if (a.width) {
      j.syncLockedWidth = Ext.emptyFn;
      a.scroll = "horizontal";
      a.scrollerOwner = true
    }
    var e = j.lockedViewConfig = j.lockedViewConfig || {};
    var k = j.normalViewConfig = j.normalViewConfig || {};
    if (h) {
      var g = Ext.tree.View.prototype.onUpdate;
      e.onUpdate = function() {
        this.refreshSize = function() {
          var n = this,
            m = n.getBodySelector();
          if (m) {
            n.body.attach(n.el.child(m, true))
          }
        };
        Ext.suspendLayouts();
        g.apply(this, arguments);
        Ext.resumeLayouts();
        this.refreshSize = Ext.tree.View.prototype.refreshSize
      };
      if (Ext.versions.extjs.isLessThan("5.0")) {
        e.store = k.store = j.store.nodeStore
      }
    }
    var f = j.layout;
    var d = a.width;
    this.callParent(arguments);
    this.on("afterrender", function() {
      var m = this.lockedGrid.headerCt.showMenuBy;
      this.lockedGrid.headerCt.showMenuBy = function() {
        m.apply(this, arguments);
        j.showMenuBy.apply(this, arguments)
      }
    });
    var l = j.lockedGrid.getView();
    var b = j.normalGrid.getView();
    this.patchViews();
    if (d || f === "border") {
      if (d) {
        j.lockedGrid.setWidth(d)
      }
      b.addCls("sch-timeline-horizontal-scroll");
      l.addCls("sch-locked-horizontal-scroll");
      j.horizontalScrollForced = true
    }
    if (j.normalGrid.collapsed) {
      j.normalGrid.collapsed = false;
      b.on("boxready", function() {
        j.normalGrid.collapse()
      }, j, {
        delay: 10
      })
    }
    if (j.lockedGrid.collapsed) {
      if (l.bufferedRenderer) {
        l.bufferedRenderer.disabled = true
      }
    }
    if (Ext.getScrollbarSize().width === 0) {
      l.addCls("sch-ganttpanel-force-locked-scroll")
    }
    if (h) {
      this.setupLockableTree()
    }
    if (j.useSpacer) {
      b.on("refresh", j.updateSpacer, j);
      l.on("refresh", j.updateSpacer, j)
    }
    if (f !== "fit") {
      j.layout = f
    }
    if (b.bufferedRenderer) {
      this.lockedGrid.on("expand", function() {
        l.el.dom.scrollTop = b.el.dom.scrollTop
      });
      this.patchSubGrid(this.lockedGrid, true);
      this.patchSubGrid(this.normalGrid, false);
      this.patchBufferedRenderingPlugin(b.bufferedRenderer);
      this.patchBufferedRenderingPlugin(l.bufferedRenderer)
    }
    this.patchSyncHorizontalScroll(this.lockedGrid);
    this.patchSyncHorizontalScroll(this.normalGrid);
    this.delayReordererPlugin(this.lockedGrid);
    this.delayReordererPlugin(this.normalGrid);
    this.fixHeaderResizer(this.lockedGrid);
    this.fixHeaderResizer(this.normalGrid)
  },
  setupLockableTree: function() {
    var c = this;
    var b = c.lockedGrid.getView();
    var a = Ext.ux.Scheduler.mixin.FilterableTreeView.prototype;
    b.initTreeFiltering = a.initTreeFiltering;
    b.onFilterChangeStart = a.onFilterChangeStart;
    b.onFilterChangeEnd = a.onFilterChangeEnd;
    b.onFilterCleared = a.onFilterCleared;
    b.onFilterSet = a.onFilterSet;
    b.initTreeFiltering()
  },
  patchSyncHorizontalScroll: function(a) {
    a.scrollTask = new Ext.util.DelayedTask(function(d, b) {
      var c = this.getScrollTarget().el;
      if (c) {
        this.syncHorizontalScroll(c.dom.scrollLeft, b)
      }
    }, a)
  },
  delayReordererPlugin: function(b) {
    var c = b.headerCt;
    var a = c.reorderer;
    if (a) {
      c.un("render", a.onHeaderCtRender, a);
      c.on("render", function() {
        if (!c.isDestroyed) {
          a.onHeaderCtRender()
        }
      }, a, {
        single: true,
        delay: 10
      })
    }
  },
  fixHeaderResizer: function(a) {
    var c = a.headerCt;
    var d = c.resizer;
    if (d) {
      var b = d.onBeforeStart;
      d.onBeforeStart = function() {
        if (this.activeHd && this.activeHd.isDestroyed) {
          return false
        }
        return b.apply(this, arguments)
      }
    }
  },
  updateSpacer: function() {
    var g = this.lockedGrid.getView();
    var e = this.normalGrid.getView();
    if (g.rendered && e.rendered && g.el.child("table")) {
      var f = this,
        c = g.el,
        d = e.el.dom,
        b = c.dom.id + "-spacer",
        h = (d.offsetHeight - d.clientHeight) + "px";
      f.spacerEl = Ext.getDom(b);
      if (Ext.isIE6 || Ext.isIE7 || (Ext.isIEQuirks && Ext.isIE8) && f.spacerEl) {
        Ext.removeNode(f.spacerEl);
        f.spacerEl = null
      }
      if (f.spacerEl) {
        f.spacerEl.style.height = h
      } else {
        var a = c;
        Ext.core.DomHelper.append(a, {
          id: b,
          style: "height: " + h
        })
      }
    }
  },
  onLockedViewScroll: function() {
    this.callParent(arguments);
    var a = this.lockedGrid.getView().bufferedRenderer;
    if (a) {
      a.onViewScroll()
    }
  },
  onNormalViewScroll: function() {
    this.callParent(arguments);
    var a = this.normalGrid.getView().bufferedRenderer;
    if (a) {
      a.onViewScroll()
    }
  },
  patchSubGrid: function(f, h) {
    var d = f.getView();
    var g = d.bufferedRenderer;
    f.on({
      collapse: function() {
        g.disabled = true
      },
      expand: function() {
        g.disabled = false
      }
    });
    var e = d.collectData;
    d.collectData = function() {
      var j = e.apply(this, arguments);
      var i = j.tableStyle;
      if (i && i[i.length - 1] != "x") {
        j.tableStyle += "px"
      }
      return j
    };
    var c = Ext.data.TreeStore && this.store instanceof Ext.data.TreeStore;
    if (!h && c) {
      var b = d.onRemove;
      d.onRemove = function() {
        var i = this;
        if (i.rendered && i.bufferedRenderer) {
          i.refreshView()
        } else {
          b.apply(this, arguments)
        }
      }
    }
    var a = d.onAdd;
    d.onAdd = function() {
      var i = this;
      if (i.rendered && i.bufferedRenderer) {
        i.refreshView()
      } else {
        a.apply(this, arguments)
      }
    };
    d.bindStore(null);
    d.bindStore(c ? this.store.nodeStore : this.resourceStore)
  },
  afterLockedViewLayout: function() {
    if (!this.horizontalScrollForced) {
      return this.callParent(arguments)
    }
  },
  patchBufferedRenderingPlugin: function(c) {
    c.variableRowHeight = true;
    if (Ext.getVersion("extjs").isLessThan("4.2.1.883")) {
      c.view.on("afterrender", function() {
        c.view.el.un("scroll", c.onViewScroll, c)
      }, this, {
        single: true,
        delay: 1
      });
      var b = c.stretchView;
      c.stretchView = function(e, d) {
        var g = this,
          f = (g.store.buffered ? g.store.getTotalCount() : g.store.getCount());
        if (f && (g.view.all.endIndex === f - 1)) {
          d = g.bodyTop + e.body.dom.offsetHeight
        }
        b.apply(this, [e, d])
      }
    } else {
      var a = c.enable;
      c.enable = function() {
        if (c.grid.collapsed) {
          return
        }
        return a.apply(this, arguments)
      }
    }
  },
  showMenuBy: function(b, f) {
    var e = this.getMenu(),
      c = e.down("#unlockItem"),
      d = e.down("#lockItem"),
      a = c.prev();
    a.hide();
    c.hide();
    d.hide()
  },
  patchViews: function() {
    if (Ext.isIE) {
      var e = this.getSelectionModel();
      var h = this;
      var g = h.lockedGrid.view;
      var f = h.normalGrid.view;
      var a = e.processSelection;
      var d = Ext.getVersion("extjs").isLessThan("4.2.2.1144") ? "mousedown" : "click";
      var c = g.doFocus ? "doFocus" : "focus";
      e.processSelection = function(k, j, m, l, o) {
        var i, n;
        if (o.type == d) {
          i = g.scrollRowIntoView;
          n = g[c];
          g.scrollRowIntoView = f.scrollRowIntoView = Ext.emptyFn;
          g[c] = f[c] = Ext.emptyFn
        }
        a.apply(this, arguments);
        if (o.type == d) {
          g.scrollRowIntoView = f.scrollRowIntoView = i;
          g[c] = f[c] = n;
          g.el.focus()
        }
      };
      var b = f.onRowFocus;
      f.onRowFocus = function(j, i, k) {
        b.call(this, j, i, true)
      };
      if (Ext.tree && Ext.tree.plugin && Ext.tree.plugin.TreeViewDragDrop) {
        g.on("afterrender", function() {
          Ext.each(g.plugins, function(i) {
            if (i instanceof Ext.tree.plugin.TreeViewDragDrop) {
              var j = g[c];
              i.dragZone.view.un("itemmousedown", i.dragZone.onItemMouseDown, i.dragZone);
              i.dragZone.view.on("itemmousedown", function() {
                g[c] = Ext.emptyFn;
                if (g.editingPlugin) {
                  g.editingPlugin.completeEdit()
                }
                i.dragZone.onItemMouseDown.apply(i.dragZone, arguments);
                g[c] = j
              });
              return false
            }
          })
        }, null, {
          delay: 100
        })
      }
    }
  }
});
if (!Ext.ClassManager.get("Ext.ux.Scheduler.model.Customizable")) {
  Ext.define("Ext.ux.Scheduler.model.Customizable", {
    extend: "Ext.data.Model",
    idProperty: null,
    customizableFields: null,
    previous: null,
    constructor: function() {
      var a = this.callParent(arguments);
      this.modified = this.modified || {};
      return a
    },
    onClassExtended: function(b, d, a) {
      var c = a.onBeforeCreated;
      a.onBeforeCreated = function(o, k) {
        c.apply(this, arguments);
        var l = o.prototype;
        var n = Ext.versions.extjs && Ext.versions.extjs.isGreaterThanOrEqual("5.0");
        if (!l.customizableFields) {
          return
        }
        l.customizableFields = (o.superclass.customizableFields || []).concat(l.customizableFields);
        var g = l.customizableFields;
        var h = {};
        Ext.Array.each(g, function(i) {
          if (typeof i == "string") {
            i = {
              name: i
            }
          }
          h[i.name] = i
        });
        var m = l.fields;
        if (Ext.isArray(m)) {
          var e = new Ext.util.MixedCollection();
          for (var j = 0; j < m.length; j++) {
            e.add(m[j].name, m[j])
          }
          m = e
        }
        var f = [];
        m.each(function(i) {
          if (i.isCustomizableField) {
            f.push(i)
          }
        });
        m.removeAll(f);
        Ext.Object.each(h, function(i, r) {
          r.isCustomizableField = true;
          var s = r.name || r.getName();
          var x = s === "Id" ? "idProperty" : s.charAt(0).toLowerCase() + s.substr(1) + "Field";
          var t = l[x];
          var w = t || s;
          var v;
          if (m.containsKey(w)) {
            v = Ext.applyIf({
              name: s,
              isCustomizableField: true
            }, m.getByKey(w));
            m.getByKey(w).isCustomizableField = true;
            if (n) {
              v = Ext.create("data.field." + (v.type || "auto"), v)
            } else {
              v = new Ext.data.Field(v)
            }
            g.push(v)
          } else {
            v = Ext.applyIf({
              name: w,
              isCustomizableField: true
            }, r);
            if (n) {
              v = Ext.create("data.field." + (v.type || "auto"), v)
            } else {
              v = new Ext.data.Field(v)
            }
            m.add(w, v)
          }
          var q = Ext.String.capitalize(s);
          if (q != "Id") {
            var u = "get" + q;
            var p = "set" + q;
            if (!l[u] || l[u].__getterFor__ && l[u].__getterFor__ != w) {
              l[u] = function() {
                return this.data[w]
              };
              l[u].__getterFor__ = w
            }
            if (!l[p] || l[p].__setterFor__ && l[p].__setterFor__ != w) {
              l[p] = function(y) {
                return this.set(w, y)
              };
              l[p].__setterFor__ = w
            }
          }
        });
        if (n) {
          l.fields.splice(0, l.fields.length);
          l.fields.push.apply(l.fields, m.items)
        }
      }
    },
    set: function(d, b) {
      var a;
      this.previous = this.previous || {};
      if (arguments.length > 1) {
        a = this.get(d);
        if (a !== b) {
          this.previous[d] = a
        }
      } else {
        for (var c in d) {
          a = this.get(c);
          if (a !== d[c]) {
            this.previous[c] = a
          }
        }
      }
      this.callParent(arguments);
      if (!this.__editing) {
        delete this.previous
      }
    },
    beginEdit: function() {
      this.__editing = true;
      this.callParent(arguments)
    },
    cancelEdit: function() {
      this.callParent(arguments);
      this.__editing = false;
      delete this.previous
    },
    endEdit: function() {
      this.callParent(arguments);
      this.__editing = false;
      delete this.previous
    },
    reject: function() {
      var b = this,
        a = b.modified,
        c;
      b.previous = b.previous || {};
      for (c in a) {
        if (a.hasOwnProperty(c)) {
          if (typeof a[c] != "function") {
            b.previous[c] = b.get(c)
          }
        }
      }
      b.callParent(arguments);
      delete b.previous
    }
  })
}
Ext.define("Ext.ux.Scheduler.model.Range", {
  extend: "Ext.ux.Scheduler.model.Customizable",
  requires: ["Ext.ux.Scheduler.util.Date"],
  idProperty: "Id",
  config: Ext.versions.touch ? {
    idProperty: "Id"
  } : null,
  startDateField: "StartDate",
  endDateField: "EndDate",
  nameField: "Name",
  clsField: "Cls",
  customizableFields: [{
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
  }],
  setStartDate: function(a, d) {
    var c = this.getEndDate();
    var b = this.getStartDate();
    this.set(this.startDateField, a);
    if (d === true && c && b) {
      this.setEndDate(Ext.ux.Scheduler.util.Date.add(a, Ext.ux.Scheduler.util.Date.MILLI, c - b))
    }
  },
  setEndDate: function(b, d) {
    var a = this.getStartDate();
    var c = this.getEndDate();
    this.set(this.endDateField, b);
    if (d === true && a && c) {
      this.setStartDate(Ext.ux.Scheduler.util.Date.add(b, Ext.ux.Scheduler.util.Date.MILLI, -(c - a)))
    }
  },
  setStartEndDate: function(c, a) {
    var b = !this.editing;
    b && this.beginEdit();
    this.set(this.startDateField, c);
    this.set(this.endDateField, a);
    b && this.endEdit()
  },
  getDates: function() {
    var c = [],
      b = this.getEndDate();
    for (var a = Ext.Date.clearTime(this.getStartDate(), true); a < b; a = Ext.ux.Scheduler.util.Date.add(a, Ext.ux.Scheduler.util.Date.DAY, 1)) {
      c.push(a)
    }
    return c
  },
  forEachDate: function(b, a) {
    return Ext.each(this.getDates(), b, a)
  },
  isValid: function() {
    var b = this.callParent(arguments);
    if (b) {
      var c = this.getStartDate(),
        a = this.getEndDate();
      b = !c || !a || (a - c >= 0)
    }
    return b
  },
  shift: function(b, a) {
    this.setStartEndDate(Ext.ux.Scheduler.util.Date.add(this.getStartDate(), b, a), Ext.ux.Scheduler.util.Date.add(this.getEndDate(), b, a))
  }
});
Ext.define("Ext.ux.Scheduler.model.TimeAxisTick", {
  extend: "Ext.ux.Scheduler.model.Range",
  startDateField: "start",
  endDateField: "end"
});
Ext.define("Ext.ux.Scheduler.model.Event", {
  extend: "Ext.ux.Scheduler.model.Range",
  customizableFields: [{
    name: "Id"
  }, {
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
  }],
  resourceIdField: "ResourceId",
  draggableField: "Draggable",
  resizableField: "Resizable",
  getResource: function(c, b) {
    if (this.stores && this.stores.length > 0 || b) {
      var a = (b || this.stores[0]).resourceStore;
      c = c || this.get(this.resourceIdField);
      if (Ext.data.TreeStore && a instanceof Ext.data.TreeStore) {
        return a.getNodeById(c) || a.getRootNode().findChildBy(function(d) {
          return d.internalId === c
        })
      } else {
        return a.getById(c) || a.data.map[c]
      }
    }
    return null
  },
  setResource: function(a) {
    this.set(this.resourceIdField, (a instanceof Ext.data.Model) ? a.getId() || a.internalId : a)
  },
  assign: function(a) {
    this.setResource.apply(this, arguments)
  },
  unassign: function(a) {},
  isDraggable: function() {
    return this.getDraggable()
  },
  isAssignedTo: function(a) {
    return this.getResource() === a
  },
  isResizable: function() {
    return this.getResizable()
  },
  isPersistable: function() {
    var b = this.getResources();
    var a = true;
    Ext.each(b, function(c) {
      if (c.phantom) {
        a = false;
        return false
      }
    });
    return a
  },
  forEachResource: function(d, c) {
    var a = this.getResources();
    for (var b = 0; b < a.length; b++) {
      if (d.call(c || this, a[b]) === false) {
        return
      }
    }
  },
  getResources: function(a) {
    var b = this.getResource(null, a);
    return b ? [b] : []
  }
});
if (!Ext.ClassManager.get("Ext.ux.Scheduler.model.Resource")) {
  Ext.define("Ext.ux.Scheduler.model.Resource", {
    extend: "Ext.ux.Scheduler.model.Customizable",
    idProperty: "Id",
    config: Ext.versions.touch ? {
      idProperty: "Id"
    } : null,
    nameField: "Name",
    customizableFields: ["Id", {
      name: "Name",
      type: "string"
    }],
    getEventStore: function() {
      return this.stores[0] && this.stores[0].eventStore || this.parentNode && this.parentNode.getEventStore()
    },
    getEvents: function(d) {
      var c = [],
        e, f = this.getId() || this.internalId;
      d = d || this.getEventStore();
      for (var b = 0, a = d.getCount(); b < a; b++) {
        e = d.getAt(b);
        if (e.data[e.resourceIdField] === f) {
          c.push(e)
        }
      }
      return c
    }
  })
}
Ext.define("Ext.ux.Scheduler.data.mixin.EventStore", {
  model: "Ext.ux.Scheduler.model.Event",
  config: {
    model: "Ext.ux.Scheduler.model.Event"
  },
  requires: ["Ext.ux.Scheduler.util.Date"],
  isEventStore: true,
  setResourceStore: function(a) {
    if (this.resourceStore) {
      this.resourceStore.un({
        beforesync: this.onResourceStoreBeforeSync,
        write: this.onResourceStoreWrite,
        scope: this
      })
    }
    this.resourceStore = a;
    if (a) {
      a.on({
        beforesync: this.onResourceStoreBeforeSync,
        write: this.onResourceStoreWrite,
        scope: this
      })
    }
  },
  onResourceStoreBeforeSync: function(b, c) {
    var a = b.create;
    if (a) {
      for (var e, d = a.length - 1; d >= 0; d--) {
        e = a[d];
        e._phantomId = e.internalId
      }
    }
  },
  onResourceStoreWrite: function(c, b) {
    if (b.wasSuccessful()) {
      var d = this,
        a = b.getRecords();
      Ext.each(a, function(e) {
        if (e._phantomId && !e.phantom) {
          d.each(function(f) {
            if (f.getResourceId() === e._phantomId) {
              f.assign(e)
            }
          })
        }
      })
    }
  },
  isDateRangeAvailable: function(f, a, b, d) {
    var c = true,
      e = Ext.ux.Scheduler.util.Date;
    this.forEachScheduledEvent(function(h, g, i) {
      if (e.intersectSpans(f, a, g, i) && d === h.getResource() && (!b || b !== h)) {
        c = false;
        return false
      }
    });
    return c
  },
  getEventsInTimeSpan: function(d, b, a) {
    if (a !== false) {
      var c = Ext.ux.Scheduler.util.Date;
      return this.queryBy(function(g) {
        var f = g.getStartDate(),
          e = g.getEndDate();
        return f && e && c.intersectSpans(f, e, d, b)
      })
    } else {
      return this.queryBy(function(g) {
        var f = g.getStartDate(),
          e = g.getEndDate();
        return f && e && (f - d >= 0) && (b - e >= 0)
      })
    }
  },
  forEachScheduledEvent: function(b, a) {
    this.each(function(e) {
      var d = e.getStartDate(),
        c = e.getEndDate();
      if (d && c) {
        return b.call(a || this, e, d, c)
      }
    }, this)
  },
  getTotalTimeSpan: function() {
    var a = new Date(9999, 0, 1),
      b = new Date(0),
      c = Ext.ux.Scheduler.util.Date;
    this.each(function(d) {
      if (d.getStartDate()) {
        a = c.min(d.getStartDate(), a)
      }
      if (d.getEndDate()) {
        b = c.max(d.getEndDate(), b)
      }
    });
    a = a < new Date(9999, 0, 1) ? a : null;
    b = b > new Date(0) ? b : null;
    return {
      start: a || null,
      end: b || a || null
    }
  },
  getEventsForResource: function(e) {
    var c = [],
      d, f = e.getId() || e.internalId;
    for (var b = 0, a = this.getCount(); b < a; b++) {
      d = this.getAt(b);
      if (d.data[d.resourceIdField] == f) {
        c.push(d)
      }
    }
    return c
  },
  append: function(a) {
    throw "Must be implemented by consuming class"
  },
  getModel: function() {
    return this.model
  }
});
Ext.define("Ext.ux.Scheduler.data.EventStore", {
  extend: "Ext.data.Store",
  model: "Ext.ux.Scheduler.model.Event",
  config: {
    model: "Ext.ux.Scheduler.model.Event"
  },
  mixins: ["Ext.ux.Scheduler.data.mixin.EventStore"],
  constructor: function() {
    this.callParent(arguments);
    if (this.getModel() !== Ext.ux.Scheduler.model.Event && !(this.getModel().prototype instanceof Ext.ux.Scheduler.model.Event)) {
      throw "The model for the EventStore must subclass Ext.ux.Scheduler.model.Event"
    }
  },
  getByInternalId: function(a) {
    if (Ext.versions.extjs && Ext.versions.extjs.isLessThan("5.0")) {
      return this.data.getByKey(a)
    }
    return this.queryBy(function(b) {
      return b.internalId == a
    }).first()
  },
  append: function(a) {
    this.add(a)
  }
});
Ext.define("Ext.ux.Scheduler.data.mixin.ResourceStore", {
  getModel: function() {
    return this.model
  }
});
Ext.define("Ext.ux.Scheduler.data.FilterableNodeStore", {
  extend: "Ext.data.NodeStore",
  onNodeExpand: function(f, d, c) {
    var b = [];
    for (var e = 0; e < d.length; e++) {
      var a = d[e];
      if (!(a.isHidden && a.isHidden() || a.hidden || a.data.hidden)) {
        b[b.length] = a
      }
    }
    return this.callParent([f, b, c])
  },
  onNodeCollapse: function(e, c, b, h, d) {
    var f = this;
    var g = this.data;
    var a = g.contains;
    g.contains = function() {
      var m, l, o;
      var k = f.indexOf(e) + 1;
      var n = false;
      for (var j = 0; j < c.length; j++) {
        if (!c[j].hidden && a.call(this, c[j])) {
          m = e;
          while (m.parentNode) {
            l = m;
            do {
              l = l.nextSibling
            } while (l && l.hidden);
            if (l) {
              n = true;
              o = f.indexOf(l);
              break
            } else {
              m = m.parentNode
            }
          }
          if (!n) {
            o = f.getCount()
          }
          f.removeAt(k, o - k);
          break
        }
      }
      return false
    };
    this.callParent(arguments);
    g.contains = a
  },
  onNodeAppend: function(d, f, b) {
    var e = this,
      a, c;
    if (e.isVisible(f)) {
      if (b === 0) {
        a = d
      } else {
        c = f;
        do {
          c = c.previousSibling
        } while (c && c.hidden);
        if (!c) {
          a = d
        } else {
          while (c.isExpanded() && c.lastChild) {
            c = c.lastChild
          }
          a = c
        }
      }
      e.insert(e.indexOf(a) + 1, f);
      if (!f.isLeaf() && f.isExpanded()) {
        if (f.isLoaded()) {
          e.onNodeExpand(f, f.childNodes, true)
        } else {
          if (!e.treeStore.fillCount) {
            f.set("expanded", false);
            f.expand()
          }
        }
      }
    }
  }
});
Ext.define("Ext.ux.Scheduler.data.mixin.FilterableTreeStore", {
  requires: ["Ext.ux.Scheduler.data.FilterableNodeStore"],
  nodeStoreClassName: "Ext.ux.Scheduler.data.FilterableNodeStore",
  nodeStore: null,
  isFilteredFlag: false,
  lastTreeFilter: null,
  initTreeFiltering: function() {
    if (!this.nodeStore) {
      this.nodeStore = this.createNodeStore(this)
    }
  },
  createNodeStore: function(a) {
    return Ext.create(this.nodeStoreClassName, {
      treeStore: a,
      recursive: true,
      rootVisible: this.rootVisible
    })
  },
  clearTreeFilter: function() {
    if (!this.isTreeFiltered()) {
      return
    }
    this.refreshNodeStoreContent();
    this.isFilteredFlag = false;
    this.lastTreeFilter = null;
    this.fireEvent("filter-clear", this)
  },
  refreshNodeStoreContent: function(f) {
    var a = this.getRootNode(),
      d = [];
    var c = this.rootVisible;
    var b = function(i) {
      if (i.isHidden && i.isHidden() || i.hidden || i.data.hidden) {
        return
      }
      if (c || i != a) {
        d[d.length] = i
      }
      if (!i.data.leaf && i.isExpanded()) {
        var j = i.childNodes,
          h = j.length;
        for (var g = 0; g < h; g++) {
          b(j[g])
        }
      }
    };
    b(a);
    this.fireEvent("nodestore-datachange-start", this);
    var e = this.nodeStore;
    if (!this.loadDataInNodeStore || !this.loadDataInNodeStore(d)) {
      e.loadRecords(d)
    }
    if (!f) {
      e.fireEvent("clear", e)
    }
    this.fireEvent("nodestore-datachange-end", this)
  },
  getIndexInTotalDataset: function(b) {
    var a = this.getRootNode(),
      d = -1;
    var e = this.rootVisible;
    if (!e && b == a) {
      return -1
    }
    var c = function(h) {
      if (h.isHidden && h.isHidden() || h.hidden || h.data.hidden) {
        if (h == b) {
          return false
        }
      }
      if (e || h != a) {
        d++
      }
      if (h == b) {
        return false
      }
      if (!h.data.leaf && h.isExpanded()) {
        var i = h.childNodes,
          g = i.length;
        for (var f = 0; f < g; f++) {
          if (c(i[f]) === false) {
            return false
          }
        }
      }
    };
    c(a);
    return d
  },
  isTreeFiltered: function() {
    return this.isFilteredFlag
  },
  filterTreeBy: function(s, b) {
    var g;
    if (arguments.length == 1 && Ext.isObject(arguments[0])) {
      b = s.scope;
      g = s.filter
    } else {
      g = s;
      s = {
        filter: g
      }
    }
    this.fireEvent("nodestore-datachange-start", this);
    s = s || {};
    var j = s.shallow;
    var r = s.checkParents || j;
    var h = s.fullMathchingParents;
    var c = s.onlyParents || h;
    var e = this.rootVisible;
    if (c && r) {
      throw new Error("Can't combine `onlyParents` and `checkParents` options")
    }
    var o = {};
    var m = this.getRootNode(),
      d = [];
    var a = function(t) {
      var i = t.parentNode;
      while (i && !o[i.internalId]) {
        o[i.internalId] = true;
        i = i.parentNode
      }
    };
    var k = function(v) {
      if (v.isHidden && v.isHidden() || v.hidden || v.data.hidden) {
        return
      }
      var t, w, u, i;
      if (v.data.leaf) {
        if (g.call(b, v, o)) {
          d[d.length] = v;
          a(v)
        }
      } else {
        if (e || v != m) {
          d[d.length] = v
        }
        if (c) {
          t = g.call(b, v);
          w = v.childNodes;
          u = w.length;
          if (t) {
            o[v.internalId] = true;
            a(v);
            if (h) {
              v.cascadeBy(function(x) {
                if (x != v) {
                  d[d.length] = x;
                  if (!x.data.leaf) {
                    o[x.internalId] = true
                  }
                }
              });
              return
            }
          }
          for (i = 0; i < u; i++) {
            if (t && w[i].data.leaf) {
              d[d.length] = w[i]
            } else {
              if (!w[i].data.leaf) {
                k(w[i])
              }
            }
          }
        } else {
          if (r) {
            t = g.call(b, v, o);
            if (t) {
              o[v.internalId] = true;
              a(v)
            }
          }
          if (!r || !j || j && (t || v == m && !e)) {
            w = v.childNodes;
            u = w.length;
            for (i = 0; i < u; i++) {
              k(w[i])
            }
          }
        }
      }
    };
    k(m);
    var f = [];
    for (var p = 0, q = d.length; p < q; p++) {
      var l = d[p];
      if (l.data.leaf || o[l.internalId]) {
        f[f.length] = l
      }
    }
    var n = this.nodeStore;
    if (!this.loadDataInNodeStore || !this.loadDataInNodeStore(f)) {
      n.loadRecords(f, false);
      n.fireEvent("clear", n)
    }
    this.isFilteredFlag = true;
    this.lastTreeFilter = s;
    this.fireEvent("nodestore-datachange-end", this);
    this.fireEvent("filter-set", this)
  },
  hideNodesBy: function(b, a) {
    if (this.isFiltered()) {
      throw new Error("Can't hide nodes of the filtered tree store")
    }
    var c = this;
    a = a || this;
    this.getRootNode().cascadeBy(function(d) {
      d.hidden = b.call(a, d, c)
    });
    this.refreshNodeStoreContent()
  },
  showAllNodes: function() {
    this.getRootNode().cascadeBy(function(a) {
      a.hidden = a.data.hidden = false
    });
    this.refreshNodeStoreContent()
  },
  inheritables: function() {
    return {
      load: function() {
        var a = this.getRootNode();
        if (a) {
          var b = this.nodeStore;
          var c = a.removeAll;
          a.removeAll = function() {
            c.apply(this, arguments);
            b && b.fireEvent("clear", b);
            delete a.removeAll
          }
        }
        this.callParent(arguments);
        if (a) {
          delete a.removeAll
        }
      }
    }
  }
});
Ext.define("Ext.ux.Scheduler.data.ResourceStore", {
  extend: "Ext.data.Store",
  model: "Ext.ux.Scheduler.model.Resource",
  config: {
    model: "Ext.ux.Scheduler.model.Resource"
  },
  mixins: ["Ext.ux.Scheduler.data.mixin.ResourceStore"],
  constructor: function() {
    this.callParent(arguments);
    if (this.getModel() !== Ext.ux.Scheduler.model.Resource && !(this.getModel().prototype instanceof Ext.ux.Scheduler.model.Resource)) {
      throw "The model for the ResourceStore must subclass Ext.ux.Scheduler.model.Resource"
    }
  }
});
Ext.define("Ext.ux.Scheduler.data.ResourceTreeStore", {
  extend: "Ext.data.TreeStore",
  model: "Ext.ux.Scheduler.model.Resource",
  mixins: ["Ext.ux.Scheduler.data.mixin.ResourceStore", "Ext.ux.Scheduler.data.mixin.FilterableTreeStore"],
  constructor: function() {
    this.callParent(arguments);
    this.initTreeFiltering();
    if (this.getModel() !== Ext.ux.Scheduler.model.Resource && !(this.getModel().prototype instanceof Ext.ux.Scheduler.model.Resource)) {
      throw "The model for the ResourceTreeStore must subclass Ext.ux.Scheduler.model.Resource"
    }
  },
  setRootNode: function() {
    this.isSettingRoot = true;
    var a = this.callParent(arguments);
    this.isSettingRoot = false;
    return a
  }
}, function() {
  this.override(Ext.ux.Scheduler.data.mixin.FilterableTreeStore.prototype.inheritables() || {})
});
Ext.define("Ext.ux.Scheduler.data.TimeAxis", {
  extend: "Ext.data.JsonStore",
  requires: ["Ext.ux.Scheduler.util.Date", "Ext.ux.Scheduler.model.TimeAxisTick"],
  model: "Ext.ux.Scheduler.model.TimeAxisTick",
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
  constructor: function(a) {
    var b = this;
    if (b.setModel) {
      b.setModel(b.model)
    }
    b.originalContinuous = b.continuous;
    b.callParent(arguments);
    b.on(Ext.versions.touch ? "refresh" : "datachanged", function(c, d, e) {
      b.fireEvent("reconfigure", b, d, e)
    });
    if (a && b.start) {
      b.reconfigure(a)
    }
  },
  reconfigure: function(e, a) {
    this.isConfigured = true;
    Ext.apply(this, e);
    var m = this.getAdjustedDates(e.start, e.end, true);
    var l = this.getAdjustedDates(e.start, e.end);
    var b = l.start;
    var f = l.end;
    if (this.fireEvent("beforereconfigure", this, b, f) !== false) {
      this.fireEvent("beginreconfigure", this);
      var j = this.unit;
      var k = this.increment || 1;
      var i = this.generateTicks(b, f, j, k, this.mainUnit);
      var d = Ext.Object.getKeys(e).length;
      var g = (d === 1 && "start" in e) || (d === 2 && "start" in e && "end" in e);
      this.removeAll(true);
      this.suspendEvents();
      this.add(i);
      if (this.getCount() === 0) {
        Ext.Error.raise("Invalid time axis configuration or filter, please check your input data.")
      }
      this.resumeEvents();
      var c = Ext.ux.Scheduler.util.Date;
      var h = i.length;
      if (this.isContinuous()) {
        this.adjustedStart = m.start;
        this.adjustedEnd = this.getNext(h > 1 ? i[h - 1].start : m.start, j, k)
      } else {
        this.adjustedStart = this.getStart();
        this.adjustedEnd = this.getEnd()
      }
      do {
        this.visibleTickStart = (this.getStart() - this.adjustedStart) / (c.getUnitDurationInMs(j) * k);
        if (this.visibleTickStart >= 1) {
          this.adjustedStart = c.getNext(this.adjustedStart, j, 1)
        }
      } while (this.visibleTickStart >= 1);
      do {
        this.visibleTickEnd = h - (this.adjustedEnd - this.getEnd()) / (c.getUnitDurationInMs(j) * k);
        if (h - this.visibleTickEnd >= 1) {
          this.adjustedEnd = c.getNext(this.adjustedEnd, j, -1)
        }
      } while (h - this.visibleTickEnd >= 1);
      this.fireEvent("datachanged", this, !g, a);
      this.fireEvent("refresh", this, !g, a);
      this.fireEvent("endreconfigure", this)
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
      })
    }
  },
  filterBy: function(b, a) {
    this.continuous = false;
    a = a || this;
    this.clearFilter(true);
    this.suspendEvents(true);
    this.filter([{
      filterFn: function(d, c) {
        return b.call(a, d.data, c)
      }
    }]);
    if (this.getCount() === 0) {
      this.clearFilter();
      this.resumeEvents();
      Ext.Error.raise("Invalid time axis filter - no ticks passed through the filter. Please check your filter method.")
    }
    this.resumeEvents()
  },
  isContinuous: function() {
    return this.continuous && !this.isFiltered()
  },
  clearFilter: function() {
    this.continuous = this.originalContinuous;
    this.callParent(arguments)
  },
  generateTicks: function(a, d, g, i) {
    var h = [],
      f, b = Ext.ux.Scheduler.util.Date,
      e = 0;
    g = g || this.unit;
    i = i || this.increment;
    var j = this.getAdjustedDates(a, d);
    a = j.start;
    d = j.end;
    while (a < d) {
      f = this.getNext(a, g, i);
      if (!this.autoAdjust && f > d) {
        f = d
      }
      if (g === b.HOUR && i > 1 && h.length > 0 && e === 0) {
        var c = h[h.length - 1];
        e = ((c.start.getHours() + i) % 24) - c.end.getHours();
        if (e !== 0) {
          f = b.add(f, b.HOUR, e)
        }
      }
      h.push({
        start: a,
        end: f
      });
      a = f
    }
    return h
  },
  getVisibleTickTimeSpan: function() {
    return this.isContinuous() ? this.visibleTickEnd - this.visibleTickStart : this.getCount()
  },
  getAdjustedDates: function(c, b, a) {
    c = c || this.getStart();
    b = b || Ext.ux.Scheduler.util.Date.add(c, this.mainUnit, this.defaultSpan);
    return this.autoAdjust || a ? {
      start: this.floorDate(c, false, this.mainUnit, 1),
      end: this.ceilDate(b, false, this.mainUnit, 1)
    } : {
      start: c,
      end: b
    }
  },
  getTickFromDate: function(d) {
    var j = this.data.items;
    var h = j.length - 1;
    if (d < j[0].data.start || d > j[h].data.end) {
      return -1
    }
    var f, g, b;
    if (this.isContinuous()) {
      if (d - j[0].data.start === 0) {
        return this.visibleTickStart
      }
      if (d - j[h].data.end === 0) {
        return this.visibleTickEnd
      }
      var k = this.adjustedStart;
      var a = this.adjustedEnd;
      var c = Math.floor(j.length * (d - k) / (a - k));
      if (c > h) {
        c = h
      }
      g = c === 0 ? k : j[c].data.start;
      b = c == h ? a : j[c].data.end;
      f = c + (d - g) / (b - g);
      if (f < this.visibleTickStart || f > this.visibleTickEnd) {
        return -1
      }
      return f
    } else {
      for (var e = 0; e <= h; e++) {
        b = j[e].data.end;
        if (d <= b) {
          g = j[e].data.start;
          f = e + (d > g ? (d - g) / (b - g) : 0);
          return f
        }
      }
    }
    return -1
  },
  getDateFromTick: function(e, i) {
    if (e === this.visibleTickEnd) {
      return this.getEnd()
    }
    var b = Math.floor(e),
      g = e - b,
      h = this.getAt(b);
    if (!h) {
      return null
    }
    var f = h.data;
    var a = b === 0 ? this.adjustedStart : f.start;
    var d = (b == this.getCount() - 1) && this.isContinuous() ? this.adjustedEnd : f.end;
    var c = Ext.ux.Scheduler.util.Date.add(a, Ext.ux.Scheduler.util.Date.MILLI, g * (d - a));
    if (i) {
      c = this[i + "Date"](c)
    }
    return c
  },
  getTicks: function() {
    var a = [];
    this.each(function(b) {
      a.push(b.data)
    });
    return a
  },
  getStart: function() {
    var a = this.first();
    if (a) {
      return new Date(a.data.start)
    }
    return null
  },
  getEnd: function() {
    var a = this.last();
    if (a) {
      return new Date(a.data.end)
    }
    return null
  },
  floorDate: function(e, g, h, a) {
    g = g !== false;
    var c = Ext.Date.clone(e),
      d = g ? this.getStart() : null,
      l = a || this.resolutionIncrement,
      k;
    if (h) {
      k = h
    } else {
      k = g ? this.resolutionUnit : this.mainUnit
    }
    var b = Ext.ux.Scheduler.util.Date;
    var f = function(n, m) {
      return Math.floor(n / m) * m
    };
    switch (k) {
      case b.MILLI:
        if (g) {
          c = b.add(d, b.MILLI, f(b.getDurationInMilliseconds(d, c), l))
        }
        break;
      case b.SECOND:
        if (g) {
          c = b.add(d, b.MILLI, f(b.getDurationInSeconds(d, c), l) * 1000)
        } else {
          c.setMilliseconds(0);
          c.setSeconds(f(c.getSeconds(), l))
        }
        break;
      case b.MINUTE:
        if (g) {
          c = b.add(d, b.SECOND, f(b.getDurationInMinutes(d, c), l) * 60)
        } else {
          c.setMinutes(f(c.getMinutes(), l));
          c.setSeconds(0);
          c.setMilliseconds(0)
        }
        break;
      case b.HOUR:
        if (g) {
          c = b.add(d, b.MINUTE, f(b.getDurationInHours(this.getStart(), c), l) * 60)
        } else {
          c.setMinutes(0);
          c.setSeconds(0);
          c.setMilliseconds(0);
          c.setHours(f(c.getHours(), l))
        }
        break;
      case b.DAY:
        if (g) {
          c = b.add(d, b.DAY, f(b.getDurationInDays(d, c), l))
        } else {
          Ext.Date.clearTime(c);
          c.setDate(f(c.getDate() - 1, l) + 1)
        }
        break;
      case b.WEEK:
        var j = c.getDay() || 7;
        var i = this.weekStartDay || 7;
        Ext.Date.clearTime(c);
        c = b.add(c, b.DAY, j >= i ? i - j : -(7 - i + j));
        break;
      case b.MONTH:
        if (g) {
          c = b.add(d, b.MONTH, f(b.getDurationInMonths(d, c), l))
        } else {
          Ext.Date.clearTime(c);
          c.setDate(1);
          c.setMonth(f(c.getMonth(), l))
        }
        break;
      case b.QUARTER:
        Ext.Date.clearTime(c);
        c.setDate(1);
        c = b.add(c, b.MONTH, -(c.getMonth() % 3));
        break;
      case b.YEAR:
        if (g) {
          c = b.add(d, b.YEAR, f(b.getDurationInYears(d, c), l))
        } else {
          c = new Date(f(e.getFullYear() - 1, l) + 1, 0, 1)
        }
        break
    }
    return c
  },
  roundDate: function(r, b) {
    var l = Ext.Date.clone(r),
      s = this.resolutionIncrement;
    b = b || this.getStart();
    switch (this.resolutionUnit) {
      case Ext.ux.Scheduler.util.Date.MILLI:
        var e = Ext.ux.Scheduler.util.Date.getDurationInMilliseconds(b, l),
          d = Math.round(e / s) * s;
        l = Ext.ux.Scheduler.util.Date.add(b, Ext.ux.Scheduler.util.Date.MILLI, d);
        break;
      case Ext.ux.Scheduler.util.Date.SECOND:
        var i = Ext.ux.Scheduler.util.Date.getDurationInSeconds(b, l),
          q = Math.round(i / s) * s;
        l = Ext.ux.Scheduler.util.Date.add(b, Ext.ux.Scheduler.util.Date.MILLI, q * 1000);
        break;
      case Ext.ux.Scheduler.util.Date.MINUTE:
        var n = Ext.ux.Scheduler.util.Date.getDurationInMinutes(b, l),
          a = Math.round(n / s) * s;
        l = Ext.ux.Scheduler.util.Date.add(b, Ext.ux.Scheduler.util.Date.SECOND, a * 60);
        break;
      case Ext.ux.Scheduler.util.Date.HOUR:
        var m = Ext.ux.Scheduler.util.Date.getDurationInHours(b, l),
          j = Math.round(m / s) * s;
        l = Ext.ux.Scheduler.util.Date.add(b, Ext.ux.Scheduler.util.Date.MINUTE, j * 60);
        break;
      case Ext.ux.Scheduler.util.Date.DAY:
        var c = Ext.ux.Scheduler.util.Date.getDurationInDays(b, l),
          f = Math.round(c / s) * s;
        l = Ext.ux.Scheduler.util.Date.add(b, Ext.ux.Scheduler.util.Date.DAY, f);
        break;
      case Ext.ux.Scheduler.util.Date.WEEK:
        Ext.Date.clearTime(l);
        var o = l.getDay() - this.weekStartDay,
          t;
        if (o < 0) {
          o = 7 + o
        }
        if (Math.round(o / 7) === 1) {
          t = 7 - o
        } else {
          t = -o
        }
        l = Ext.ux.Scheduler.util.Date.add(l, Ext.ux.Scheduler.util.Date.DAY, t);
        break;
      case Ext.ux.Scheduler.util.Date.MONTH:
        var p = Ext.ux.Scheduler.util.Date.getDurationInMonths(b, l) + (l.getDate() / Ext.Date.getDaysInMonth(l)),
          h = Math.round(p / s) * s;
        l = Ext.ux.Scheduler.util.Date.add(b, Ext.ux.Scheduler.util.Date.MONTH, h);
        break;
      case Ext.ux.Scheduler.util.Date.QUARTER:
        Ext.Date.clearTime(l);
        l.setDate(1);
        l = Ext.ux.Scheduler.util.Date.add(l, Ext.ux.Scheduler.util.Date.MONTH, 3 - (l.getMonth() % 3));
        break;
      case Ext.ux.Scheduler.util.Date.YEAR:
        var k = Ext.ux.Scheduler.util.Date.getDurationInYears(b, l),
          g = Math.round(k / s) * s;
        l = Ext.ux.Scheduler.util.Date.add(b, Ext.ux.Scheduler.util.Date.YEAR, g);
        break
    }
    return l
  },
  ceilDate: function(c, b, f) {
    var e = Ext.Date.clone(c);
    b = b !== false;
    var a = b ? this.resolutionIncrement : 1,
      g = false,
      d;
    if (f) {
      d = f
    } else {
      d = b ? this.resolutionUnit : this.mainUnit
    }
    switch (d) {
      case Ext.ux.Scheduler.util.Date.HOUR:
        if (e.getMinutes() > 0 || e.getSeconds() > 0 || e.getMilliseconds() > 0) {
          g = true
        }
        break;
      case Ext.ux.Scheduler.util.Date.DAY:
        if (e.getHours() > 0 || e.getMinutes() > 0 || e.getSeconds() > 0 || e.getMilliseconds() > 0) {
          g = true
        }
        break;
      case Ext.ux.Scheduler.util.Date.WEEK:
        Ext.Date.clearTime(e);
        if (e.getDay() !== this.weekStartDay) {
          g = true
        }
        break;
      case Ext.ux.Scheduler.util.Date.MONTH:
        Ext.Date.clearTime(e);
        if (e.getDate() !== 1) {
          g = true
        }
        break;
      case Ext.ux.Scheduler.util.Date.QUARTER:
        Ext.Date.clearTime(e);
        if (e.getMonth() % 3 !== 0 || (e.getMonth() % 3 === 0 && e.getDate() !== 1)) {
          g = true
        }
        break;
      case Ext.ux.Scheduler.util.Date.YEAR:
        Ext.Date.clearTime(e);
        if (e.getMonth() !== 0 || e.getDate() !== 1) {
          g = true
        }
        break;
      default:
        break
    }
    if (g) {
      return this.getNext(e, d, a)
    } else {
      return e
    }
  },
  getNext: function(b, c, a) {
    return Ext.ux.Scheduler.util.Date.getNext(b, c, a, this.weekStartDay)
  },
  getResolution: function() {
    return {
      unit: this.resolutionUnit,
      increment: this.resolutionIncrement
    }
  },
  setResolution: function(b, a) {
    this.resolutionUnit = b;
    this.resolutionIncrement = a || 1
  },
  shift: function(a, b) {
    this.setTimeSpan(Ext.ux.Scheduler.util.Date.add(this.getStart(), b, a), Ext.ux.Scheduler.util.Date.add(this.getEnd(), b, a))
  },
  shiftNext: function(a) {
    a = a || this.getShiftIncrement();
    var b = this.getShiftUnit();
    this.setTimeSpan(Ext.ux.Scheduler.util.Date.add(this.getStart(), b, a), Ext.ux.Scheduler.util.Date.add(this.getEnd(), b, a))
  },
  shiftPrevious: function(a) {
    a = -(a || this.getShiftIncrement());
    var b = this.getShiftUnit();
    this.setTimeSpan(Ext.ux.Scheduler.util.Date.add(this.getStart(), b, a), Ext.ux.Scheduler.util.Date.add(this.getEnd(), b, a))
  },
  getShiftUnit: function() {
    return this.shiftUnit || this.mainUnit
  },
  getShiftIncrement: function() {
    return this.shiftIncrement || 1
  },
  getUnit: function() {
    return this.unit
  },
  getIncrement: function() {
    return this.increment
  },
  dateInAxis: function(a) {
    return Ext.ux.Scheduler.util.Date.betweenLesser(a, this.getStart(), this.getEnd())
  },
  timeSpanInAxis: function(b, a) {
    if (this.isContinuous()) {
      return Ext.ux.Scheduler.util.Date.intersectSpans(b, a, this.getStart(), this.getEnd())
    } else {
      return (b < this.getStart() && a > this.getEnd()) || this.getTickFromDate(b) !== this.getTickFromDate(a)
    }
  },
  forEachAuxInterval: function(h, b, a, f) {
    f = f || this;
    var c = this.getEnd(),
      g = this.getStart(),
      e = 0,
      d;
    if (g > c) {
      throw "Invalid time axis configuration"
    }
    while (g < c) {
      d = Ext.ux.Scheduler.util.Date.min(this.getNext(g, h, b || 1), c);
      a.call(f, g, d, e);
      g = d;
      e++
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
      defaultSpan: a.defaultSpan || 1
    })
  }
});
Ext.define("Ext.ux.Scheduler.view.Horizontal", {
  requires: ["Ext.util.Region", "Ext.Element", "Ext.ux.Scheduler.util.Date"],
  view: null,
  constructor: function(a) {
    Ext.apply(this, a)
  },
  translateToScheduleCoordinate: function(a) {
    var b = this.view;
    if (b.rtl) {
      return b.getTimeAxisColumn().getEl().getRight() - a
    }
    return a - b.getEl().getX() + b.getScroll().left
  },
  translateToPageCoordinate: function(a) {
    var b = this.view;
    return a + b.getEl().getX() - b.getScroll().left
  },
  getEventRenderData: function(a, b, c) {
    var h = b || a.getStartDate(),
      g = c || a.getEndDate() || h,
      j = this.view,
      f = j.timeAxis.getStart(),
      k = j.timeAxis.getEnd(),
      i = Math,
      e = j.getXFromDate(Ext.ux.Scheduler.util.Date.max(h, f)),
      l = j.getXFromDate(Ext.ux.Scheduler.util.Date.min(g, k)),
      d = {};
    if (this.view.rtl) {
      d.right = i.min(e, l)
    } else {
      d.left = i.min(e, l)
    }
    d.width = i.max(1, i.abs(l - e)) - j.eventBorderWidth;
    if (j.managedEventSizing) {
      d.top = i.max(0, (j.barMargin - ((Ext.isIE && !Ext.isStrict) ? 0 : j.eventBorderWidth - j.cellTopBorderWidth)));
      d.height = j.timeAxisViewModel.rowHeightHorizontal - (2 * j.barMargin) - j.eventBorderWidth
    }
    d.start = h;
    d.end = g;
    d.startsOutsideView = h < f;
    d.endsOutsideView = g > k;
    return d
  },
  getScheduleRegion: function(e, g) {
    var c = Ext.Element.prototype.getRegion ? "getRegion" : "getPageBox",
      j = this.view,
      i = e ? Ext.fly(j.getRowNode(e))[c]() : j.getTableRegion(),
      f = j.timeAxis.getStart(),
      l = j.timeAxis.getEnd(),
      b = j.getDateConstraints(e, g) || {
        start: f,
        end: l
      },
      d = this.translateToPageCoordinate(j.getXFromDate(Ext.ux.Scheduler.util.Date.max(f, b.start))),
      k = this.translateToPageCoordinate(j.getXFromDate(Ext.ux.Scheduler.util.Date.min(l, b.end))),
      h = i.top + j.barMargin,
      a = i.bottom - j.barMargin - j.eventBorderWidth;
    return new Ext.util.Region(h, Math.max(d, k), a, Math.min(d, k))
  },
  getResourceRegion: function(j, e, i) {
    var m = this.view,
      d = m.getRowNode(j),
      f = Ext.fly(d).getOffsetsTo(m.getEl()),
      k = m.timeAxis.getStart(),
      o = m.timeAxis.getEnd(),
      c = e ? Ext.ux.Scheduler.util.Date.max(k, e) : k,
      g = i ? Ext.ux.Scheduler.util.Date.min(o, i) : o,
      h = m.getXFromDate(c),
      n = m.getXFromDate(g),
      l = f[1] + m.cellTopBorderWidth,
      a = f[1] + Ext.fly(d).getHeight() - m.cellBottomBorderWidth;
    if (!Ext.versions.touch) {
      var b = m.getScroll();
      l += b.top;
      a += b.top
    }
    return new Ext.util.Region(l, Math.max(h, n), a, Math.min(h, n))
  },
  columnRenderer: function(d, q, k, n, p) {
    var o = this.view;
    var b = o.eventStore.getEventsForResource(k);
    if (b.length === 0) {
      return
    }
    var h = o.timeAxis,
      m = [],
      g, e;
    for (g = 0, e = b.length; g < e; g++) {
      var a = b[g],
        c = a.getStartDate(),
        f = a.getEndDate();
      if (c && f && h.timeSpanInAxis(c, f)) {
        m[m.length] = o.generateTplData(a, k, n)
      }
    }
    if (o.dynamicRowHeight) {
      var j = o.eventLayout.horizontal;
      j.applyLayout(m, k);
      q.rowHeight = j.getRowHeight(k, b)
    }
    return o.eventTpl.apply(m)
  },
  resolveResource: function(b) {
    var a = this.view;
    var c = a.findRowByChild(b);
    if (c) {
      return a.getRecordForRowNode(c)
    }
    return null
  },
  getTimeSpanRegion: function(b, h, g) {
    var d = this.view,
      c = d.getXFromDate(b),
      e = h ? d.getXFromDate(h) : c,
      a, f;
    f = d.getTableRegion();
    if (g) {
      a = Math.max(f ? f.bottom - f.top : 0, d.getEl().dom.clientHeight)
    } else {
      a = f ? f.bottom - f.top : 0
    }
    return new Ext.util.Region(0, Math.max(c, e), a, Math.min(c, e))
  },
  getStartEndDatesFromRegion: function(g, d, c) {
    var b = this.view;
    var f = b.rtl;
    var a = b.getDateFromCoordinate(f ? g.right : g.left, d),
      e = b.getDateFromCoordinate(f ? g.left : g.right, d);
    if (a && e || c && (a || e)) {
      return {
        start: a,
        end: e
      }
    }
    return null
  },
  onEventAdd: function(n, m) {
    var h = this.view;
    var e = {};
    for (var g = 0, c = m.length; g < c; g++) {
      var a = m[g].getResources(h.eventStore);
      for (var f = 0, d = a.length; f < d; f++) {
        var b = a[f];
        e[b.getId()] = b
      }
    }
    Ext.Object.each(e, function(j, i) {
      h.repaintEventsForResource(i)
    })
  },
  onEventRemove: function(k, e) {
    var h = this.view;
    var j = this.resourceStore;
    var f = Ext.tree && Ext.tree.View && h instanceof Ext.tree.View;
    if (!Ext.isArray(e)) {
      e = [e]
    }
    var g = function(i) {
      if (h.store.indexOf(i) >= 0) {
        h.repaintEventsForResource(i)
      }
    };
    for (var d = 0; d < e.length; d++) {
      var a = e[d].getResources(h.eventStore);
      if (a.length > 1) {
        Ext.each(a, g, this)
      } else {
        var b = h.getEventNodeByRecord(e[d]);
        if (b) {
          var c = h.resolveResource(b);
          if (Ext.Element.prototype.fadeOut) {
            Ext.get(b).fadeOut({
              callback: function() {
                g(c)
              }
            })
          } else {
            Ext.Anim.run(Ext.get(b), "fade", {
              out: true,
              duration: 500,
              after: function() {
                g(c)
              },
              autoClear: false
            })
          }
        }
      }
    }
  },
  onEventUpdate: function(c, d, b) {
    var e = d.previous;
    var a = this.view;
    if (e && e[d.resourceIdField]) {
      var f = d.getResource(e[d.resourceIdField], a.eventStore);
      if (f) {
        a.repaintEventsForResource(f, true)
      }
    }
    var g = d.getResources(a.eventStore);
    Ext.each(g, function(h) {
      a.repaintEventsForResource(h, true)
    })
  },
  setColumnWidth: function(c, b) {
    var a = this.view;
    a.getTimeAxisViewModel().setViewColumnWidth(c, b);
    a.fireEvent("columnwidthchange", a, c)
  },
  getVisibleDateRange: function() {
    var d = this.view;
    if (!d.getEl()) {
      return null
    }
    var c = d.getTableRegion(),
      b = d.timeAxis.getStart(),
      f = d.timeAxis.getEnd(),
      e = d.getWidth();
    if ((c.right - c.left) < e) {
      return {
        startDate: b,
        endDate: f
      }
    }
    var a = d.getScroll();
    return {
      startDate: d.getDateFromCoordinate(a.left, null, true),
      endDate: d.getDateFromCoordinate(a.left + e, null, true)
    }
  }
});
Ext.define("Ext.ux.Scheduler.view.Vertical", {
  view: null,
  constructor: function(a) {
    Ext.apply(this, a)
  },
  translateToScheduleCoordinate: function(b) {
    var a = this.view;
    return b - a.getEl().getY() + a.getScroll().top
  },
  translateToPageCoordinate: function(d) {
    var b = this.view;
    var c = b.getEl(),
      a = c.getScroll();
    return d + c.getY() - a.top
  },
  getEventRenderData: function(a) {
    var g = a.getStartDate(),
      f = a.getEndDate(),
      i = this.view,
      e = i.timeAxis.getStart(),
      j = i.timeAxis.getEnd(),
      h = Math,
      d = h.floor(i.getCoordinateFromDate(Ext.ux.Scheduler.util.Date.max(g, e))),
      k = h.floor(i.getCoordinateFromDate(Ext.ux.Scheduler.util.Date.min(f, j))),
      c = this.getResourceColumnWidth(a.getResource(), i.eventStore),
      b;
    b = {
      top: h.max(0, h.min(d, k) - i.eventBorderWidth),
      height: h.max(1, h.abs(d - k))
    };
    if (i.managedEventSizing) {
      b.left = i.barMargin;
      b.width = c - (2 * i.barMargin) - i.eventBorderWidth
    }
    b.start = g;
    b.end = f;
    b.startsOutsideView = g < e;
    b.endsOutsideView = f > j;
    return b
  },
  getScheduleRegion: function(d, f) {
    var h = this.view,
      g = d ? Ext.fly(h.getScheduleCell(0, h.resourceStore.indexOf(d))).getRegion() : h.getTableRegion(),
      e = h.timeAxis.getStart(),
      k = h.timeAxis.getEnd(),
      a = h.getDateConstraints(d, f) || {
        start: e,
        end: k
      },
      c = this.translateToPageCoordinate(h.getCoordinateFromDate(Ext.ux.Scheduler.util.Date.max(e, a.start))),
      j = this.translateToPageCoordinate(h.getCoordinateFromDate(Ext.ux.Scheduler.util.Date.min(k, a.end))),
      b = g.left + h.barMargin,
      i = (d ? (g.left + this.getResourceColumnWidth(d)) : g.right) - h.barMargin;
    return new Ext.util.Region(Math.min(c, j), i, Math.max(c, j), b)
  },
  getResourceColumnWidth: function(a) {
    return this.view.resourceColumnWidth
  },
  getResourceRegion: function(h, b, g) {
    var j = this.view,
      e = j.resourceStore.indexOf(h) * this.getResourceColumnWidth(h),
      i = j.timeAxis.getStart(),
      m = j.timeAxis.getEnd(),
      a = b ? Ext.ux.Scheduler.util.Date.max(i, b) : i,
      d = g ? Ext.ux.Scheduler.util.Date.min(m, g) : m,
      f = Math.max(0, j.getCoordinateFromDate(a) - j.cellTopBorderWidth),
      l = j.getCoordinateFromDate(d) - j.cellTopBorderWidth,
      c = e + j.cellBorderWidth,
      k = e + this.getResourceColumnWidth(h) - j.cellBorderWidth;
    return new Ext.util.Region(Math.min(f, l), k, Math.max(f, l), c)
  },
  columnRenderer: function(f, r, m, o, q) {
    var p = this.view;
    var e = "";
    if (o === 0) {
      var a = Ext.ux.Scheduler.util.Date,
        k = p.timeAxis,
        n, c, j, g;
      n = [];
      c = p.eventStore.getEventsForResource(m);
      for (j = 0, g = c.length; j < g; j++) {
        var b = c[j],
          d = b.getStartDate(),
          h = b.getEndDate();
        if (d && h && k.timeSpanInAxis(d, h)) {
          n.push(p.generateTplData(b, m, q))
        }
      }
      p.eventLayout.vertical.applyLayout(n, this.getResourceColumnWidth(m));
      e = "&#160;" + p.eventTpl.apply(n);
      if (Ext.isIE) {
        r.tdAttr = 'style="z-index:1000"'
      }
    }
    if (q % 2 === 1) {
      r.tdCls = (r.tdCls || "") + " " + p.altColCls;
      r.cellCls = (r.cellCls || "") + " " + p.altColCls
    }
    return e
  },
  resolveResource: function(c) {
    var a = this.view;
    c = Ext.fly(c).is(a.timeCellSelector) ? c : Ext.fly(c).up(a.timeCellSelector);
    if (c) {
      var d = c.dom ? c.dom : c;
      var b = 0;
      if (Ext.isIE8m) {
        while (d = d.previousSibling) {
          if (d.nodeType === 1) {
            b++
          }
        }
      } else {
        b = Ext.Array.indexOf(Array.prototype.slice.call(d.parentNode.children), d)
      }
      if (b >= 0) {
        return a.resourceStore.getAt(b)
      }
    }
    return null
  },
  onEventUpdate: function(b, d) {
    this.renderSingle.call(this, d);
    var a = this.view;
    var e = d.previous;
    if (e && e[d.resourceIdField]) {
      var f = d.getResource(e[d.resourceIdField], a.eventStore);
      if (f) {
        this.relayoutRenderedEvents(f)
      }
    }
    var c = d.getResource(null, a.eventStore);
    if (c) {
      this.relayoutRenderedEvents(c);
      if (a.getSelectionModel().isSelected(d)) {
        a.onEventSelect(d, true)
      }
    }
  },
  onEventAdd: function(b, c) {
    var a = this.view;
    if (c.length === 1) {
      this.renderSingle(c[0]);
      this.relayoutRenderedEvents(c[0].getResource(null, a.eventStore))
    } else {
      a.repaintAllEvents()
    }
  },
  onEventRemove: function(b, c) {
    var a = this.view;
    if (c.length === 1) {
      this.relayoutRenderedEvents(this.getResourceByEventRecord(c[0]))
    } else {
      a.repaintAllEvents()
    }
  },
  relayoutRenderedEvents: function(h) {
    var g = [],
      b = this.view,
      d, a, f, e, c = b.eventStore.getEventsForResource(h);
    if (c.length > 0) {
      for (d = 0, a = c.length; d < a; d++) {
        f = c[d];
        e = b.getEventNodeByRecord(f);
        if (e) {
          g.push({
            start: f.getStartDate(),
            end: f.getEndDate(),
            id: e.id
          })
        }
      }
      b.eventLayout.vertical.applyLayout(g, this.getResourceColumnWidth(h));
      for (d = 0; d < g.length; d++) {
        f = g[d];
        Ext.fly(f.id).setStyle({
          left: f.left + "px",
          width: f.width + "px"
        })
      }
    }
  },
  renderSingle: function(d) {
    var a = this.view;
    var g = d.getResource(null, a.eventStore);
    var c = a.getEventNodeByRecord(d);
    var f = a.resourceStore.indexOf(g);
    if (c) {
      Ext.fly(c).destroy()
    }
    var b = Ext.fly(a.getScheduleCell(0, f));
    if (!b) {
      return
    }
    var e = a.generateTplData(d, g, f);
    if (!Ext.versions.touch) {
      b = b.first()
    }
    a.eventTpl.append(b, [e])
  },
  getTimeSpanRegion: function(b, g) {
    var d = this.view,
      a = d.getCoordinateFromDate(b),
      f = g ? d.getCoordinateFromDate(g) : a,
      c = d.getTableRegion(),
      e = c ? c.right - c.left : d.getEl().dom.clientWidth;
    return new Ext.util.Region(Math.min(a, f), e, Math.max(a, f), 0)
  },
  getStartEndDatesFromRegion: function(d, c, b) {
    var a = this.view.getDateFromCoordinate(d.top, c),
      e = this.view.getDateFromCoordinate(d.bottom, c);
    if (a && e) {
      return {
        start: Ext.ux.Scheduler.util.Date.min(a, e),
        end: Ext.ux.Scheduler.util.Date.max(a, e)
      }
    } else {
      return null
    }
  },
  setColumnWidth: function(c, b) {
    var a = this.view;
    a.resourceColumnWidth = c;
    a.getTimeAxisViewModel().setViewColumnWidth(c, b);
    a.fireEvent("columnwidthchange", a, c)
  },
  getVisibleDateRange: function() {
    var e = this.view;
    if (!e.rendered) {
      return null
    }
    var c = e.getScroll(),
      b = e.getHeight(),
      d = e.getTableRegion(),
      f = e.timeAxis.getEnd();
    if (d.bottom - d.top < b) {
      var a = e.timeAxis.getStart();
      return {
        startDate: a,
        endDate: f
      }
    }
    return {
      startDate: e.getDateFromCoordinate(c.top, null, true),
      endDate: e.getDateFromCoordinate(c.top + b, null, true) || f
    }
  }
});
Ext.define("Ext.ux.Scheduler.selection.EventModel", {
  extend: "Ext.selection.Model",
  alias: "selection.eventmodel",
  requires: ["Ext.util.KeyNav"],
  deselectOnContainerClick: true,
  selectedOnMouseDown: false,
  onVetoUIEvent: Ext.emptyFn,
  bindComponent: function(a) {
    var b = this,
      c = {
        refresh: b.refresh,
        scope: b
      };
    b.view = a;
    b.bindStore(a.getEventStore());
    a.on({
      eventclick: b.onEventClick,
      eventmousedown: b.onEventMouseDown,
      itemmousedown: b.onItemMouseDown,
      scope: this
    });
    a.on(c)
  },
  onEventMouseDown: function(b, a, c) {
    this.selectedOnMouseDown = null;
    if (!this.isSelected(a)) {
      this.selectedOnMouseDown = a;
      this.selectWithEvent(a, c)
    }
  },
  onEventClick: function(b, a, c) {
    if (!this.selectedOnMouseDown) {
      this.selectWithEvent(a, c)
    }
  },
  onItemMouseDown: function() {
    if (this.deselectOnContainerClick) {
      this.deselectAll()
    }
  },
  onSelectChange: function(d, b, j, a) {
    var f = this,
      g = f.view,
      h = f.store,
      e = b ? "select" : "deselect",
      c = 0;
    if ((j || f.fireEvent("before" + e, f, d)) !== false && a() !== false) {
      if (b) {
        g.onEventSelect(d, j)
      } else {
        g.onEventDeselect(d, j)
      }
      if (!j) {
        f.fireEvent(e, f, d)
      }
    }
  },
  selectRange: Ext.emptyFn,
  selectNode: function(c, d, a) {
    var b = this.view.resolveEventRecord(c);
    if (b) {
      this.select(b, d, a)
    }
  },
  deselectNode: function(c, d, a) {
    var b = this.view.resolveEventRecord(c);
    if (b) {
      this.deselect(b, a)
    }
  },
  storeHasSelected: function(a) {
    var b = this.store;
    if (a.hasId() && b.getByInternalId(a.internalId)) {
      return true
    }
    return this.callParent(arguments)
  }
});
Ext.define("Ext.ux.Scheduler.plugin.Printable", {
  extend: "Ext.AbstractPlugin",
  alias: "plugin.scheduler_printable",
  requires: ["Ext.XTemplate"],
  lockableScope: "top",
  docType: "<!DOCTYPE HTML>",
  beforePrint: Ext.emptyFn,
  afterPrint: Ext.emptyFn,
  autoPrintAndClose: true,
  fakeBackgroundColor: true,
  scheduler: null,
  constructor: function(a) {
    Ext.apply(this, a)
  },
  init: function(a) {
    this.scheduler = a;
    a.print = Ext.Function.bind(this.print, this)
  },
  mainTpl: new Ext.XTemplate('{docType}<html class="' + Ext.baseCSSPrefix + 'border-box {htmlClasses}"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type" /><title>{title}</title>{styles}</head><body class="sch-print-body {bodyClasses}"><div class="sch-print-ct {componentClasses}" style="width:{totalWidth}px"><div class="sch-print-headerbg" style="border-left-width:{totalWidth}px;height:{headerHeight}px;"></div><div class="sch-print-header-wrap">{[this.printLockedHeader(values)]}{[this.printNormalHeader(values)]}</div>{[this.printLockedGrid(values)]}{[this.printNormalGrid(values)]}</div><script type="text/javascript">{setupScript}<\/script></body></html>', {
    printLockedHeader: function(a) {
      var b = "";
      if (a.lockedGrid) {
        b += '<div style="left:-' + a.lockedScroll + "px;margin-right:-" + a.lockedScroll + "px;width:" + (a.lockedWidth + a.lockedScroll) + 'px"';
        b += 'class="sch-print-lockedheader ' + a.lockedGrid.headerCt.el.dom.className + '">';
        b += a.lockedHeader;
        b += "</div>"
      }
      return b
    },
    printNormalHeader: function(a) {
      var b = "";
      if (a.normalGrid) {
        b += '<div style="left:' + (a.lockedGrid ? a.lockedWidth : "0") + "px;width:" + a.normalWidth + 'px;" class="sch-print-normalheader ' + a.normalGrid.headerCt.el.dom.className + '">';
        b += '<div style="margin-left:-' + a.normalScroll + 'px">' + a.normalHeader + "</div>";
        b += "</div>"
      }
      return b
    },
    printLockedGrid: function(a) {
      var b = "";
      if (a.lockedGrid) {
        b += '<div id="lockedRowsCt" style="left:-' + a.lockedScroll + "px;margin-right:-" + a.lockedScroll + "px;width:" + (a.lockedWidth + a.lockedScroll) + "px;top:" + a.headerHeight + 'px;" class="sch-print-locked-rows-ct ' + a.innerLockedClasses + " " + Ext.baseCSSPrefix + 'grid-inner-locked">';
        b += a.lockedRows;
        b += "</div>"
      }
      return b
    },
    printNormalGrid: function(a) {
      var b = "";
      if (a.normalGrid) {
        b += '<div id="normalRowsCt" style="left:' + (a.lockedGrid ? a.lockedWidth : "0") + "px;top:" + a.headerHeight + "px;width:" + a.normalWidth + 'px" class="sch-print-normal-rows-ct ' + a.innerNormalClasses + '">';
        b += '<div style="position:relative;overflow:visible;margin-left:-' + a.normalScroll + 'px">' + a.normalRows + "</div>";
        b += "</div>"
      }
      return b
    }
  }),
  getGridContent: function(n) {
    var m = n.normalGrid,
      e = n.lockedGrid,
      o = e.getView(),
      g = m.getView(),
      j, d, l, i, k, b, h;
    this.beforePrint(n);
    if (e.collapsed && !m.collapsed) {
      b = e.getWidth() + m.getWidth()
    } else {
      b = m.getWidth();
      h = e.getWidth()
    }
    var c = o.store.getRange();
    d = o.tpl.apply(o.collectData(c, 0));
    l = g.tpl.apply(g.collectData(c, 0));
    i = o.el.getScroll().left;
    k = g.el.getScroll().left;
    var a = document.createElement("div");
    a.innerHTML = d;
    a.firstChild.style.width = o.el.dom.style.width;
    if (Ext.versions.extjs.isLessThan("4.2.1")) {
      e.headerCt.items.each(function(q, p) {
        if (q.isHidden()) {
          Ext.fly(a).down("colgroup:nth-child(" + (p + 1) + ") col").setWidth(0)
        }
      })
    }
    d = a.innerHTML;
    if (Ext.ux.Scheduler.feature && Ext.ux.Scheduler.feature.AbstractTimeSpan) {
      var f = (n.plugins || []).concat(n.normalGrid.plugins || []).concat(n.columnLinesFeature || []);
      Ext.each(f, function(p) {
        if (p instanceof Ext.ux.Scheduler.feature.AbstractTimeSpan && p.generateMarkup) {
          l = p.generateMarkup(true) + l
        }
      })
    }
    this.afterPrint(n);
    return {
      normalHeader: m.headerCt.el.dom.innerHTML,
      lockedHeader: e.headerCt.el.dom.innerHTML,
      lockedGrid: e.collapsed ? false : e,
      normalGrid: m.collapsed ? false : m,
      lockedRows: d,
      normalRows: l,
      lockedScroll: i,
      normalScroll: k,
      lockedWidth: h - (Ext.isWebKit ? 1 : 0),
      normalWidth: b,
      headerHeight: m.headerCt.getHeight(),
      innerLockedClasses: e.view.el.dom.className,
      innerNormalClasses: m.view.el.dom.className + (this.fakeBackgroundColor ? " sch-print-fake-background" : ""),
      width: n.getWidth()
    }
  },
  getStylesheets: function() {
    return Ext.getDoc().select('link[rel="stylesheet"]')
  },
  print: function() {
    var g = this.scheduler;
    if (!(this.mainTpl instanceof Ext.Template)) {
      var a = 22;
      this.mainTpl = new Ext.XTemplate(this.mainTpl, {
        compiled: true,
        disableFormats: true
      })
    }
    var h = g.getView(),
      i = this.getStylesheets(),
      e = Ext.get(Ext.core.DomHelper.createDom({
        tag: "div"
      })),
      b;
    i.each(function(j) {
      e.appendChild(j.dom.cloneNode(true))
    });
    b = e.dom.innerHTML + "";
    var f = this.getGridContent(g),
      c = this.mainTpl.apply(Ext.apply({
        waitText: this.waitText,
        docType: this.docType,
        htmlClasses: Ext.getBody().parent().dom.className,
        bodyClasses: Ext.getBody().dom.className,
        componentClasses: g.el.dom.className,
        title: (g.title || ""),
        styles: b,
        totalWidth: g.getWidth(),
        setupScript: ("window.onload = function(){ (" + this.setupScript.toString() + ")(" + g.syncRowHeight + ", " + this.autoPrintAndClose + ", " + Ext.isChrome + ", " + Ext.isIE + "); };")
      }, f));
    var d = window.open("", "printgrid");
    if (!d || !d.document) {
      return false
    }
    this.printWindow = d;
    d.document.write(c);
    d.document.close()
  },
  setupScript: function(e, a, d, b) {
    var c = function() {
      if (e) {
        var f = document.getElementById("lockedRowsCt"),
          o = document.getElementById("normalRowsCt"),
          g = f && f.getElementsByTagName("tr"),
          m = o && o.getElementsByTagName("tr"),
          k = m && g ? m.length : 0;
        for (var j = 0; j < k; j++) {
          var h = m[j].clientHeight;
          var l = g[j].clientHeight;
          var n = Math.max(h, l) + "px";
          g[j].style.height = m[j].style.height = n
        }
      }
      document._loaded = true;
      if (a) {
        window.print();
        if (!d) {
          window.close()
        }
      }
    };
    if (b) {
      setTimeout(c, 0)
    } else {
      c()
    }
  }
});
Ext.define("Ext.ux.Scheduler.plugin.Export", {
  extend: "Ext.util.Observable",
  alternateClassName: "Ext.ux.Scheduler.plugin.PdfExport",
  alias: "plugin.scheduler_export",
  mixins: ["Ext.AbstractPlugin"],
  requires: ["Ext.XTemplate"],
  lockableScope: "top",
  printServer: undefined,
  tpl: null,
  exportDialogClassName: "Ext.ux.Scheduler.widget.ExportDialog",
  exportDialogConfig: {},
  defaultConfig: {
    format: "A4",
    orientation: "portrait",
    range: "complete",
    showHeader: true,
    singlePageExport: false
  },
  expandAllBeforeExport: false,
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
  openAfterExport: true,
  beforeExport: Ext.emptyFn,
  afterExport: Ext.emptyFn,
  fileFormat: "pdf",
  DPI: 72,
  constructor: function(a) {
    a = a || {};
    if (a.exportDialogConfig) {
      Ext.Object.each(this.defaultConfig, function(c, b, e) {
        var d = a.exportDialogConfig[c];
        if (d) {
          e[c] = d
        }
      })
    }
    this.callParent([a]);
    if (!this.tpl) {
      this.tpl = new Ext.XTemplate('<!DOCTYPE html><html class="' + Ext.baseCSSPrefix + 'border-box {htmlClasses}"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type" /><title>{column}/{row}</title>{styles}</head><body class="' + Ext.baseCSSPrefix + 'webkit sch-export {bodyClasses}"><tpl if="showHeader"><div class="sch-export-header" style="width:{totalWidth}px"><h2>{column}/{row}</h2></div></tpl><div class="{componentClasses}" style="height:{bodyHeight}px; width:{totalWidth}px; position: relative !important">{HTML}</div></body></html>', {
        disableFormats: true
      })
    }
    this.setFileFormat(this.fileFormat)
  },
  init: function(a) {
    this.scheduler = a;
    a.showExportDialog = Ext.Function.bind(this.showExportDialog, this);
    a.doExport = Ext.Function.bind(this.doExport, this)
  },
  setFileFormat: function(a) {
    if (typeof a !== "string") {
      this.fileFormat = "pdf"
    } else {
      a = a.toLowerCase();
      if (a === "png") {
        this.fileFormat = a
      } else {
        this.fileFormat = "pdf"
      }
    }
  },
  showExportDialog: function() {
    var b = this,
      a = b.scheduler.getSchedulingView();
    if (b.win) {
      b.win.destroy();
      b.win = null
    }
    b.win = Ext.create(b.exportDialogClassName, {
      plugin: b,
      exportDialogConfig: Ext.apply({
        startDate: b.scheduler.getStart(),
        endDate: b.scheduler.getEnd(),
        rowHeight: a.timeAxisViewModel.getViewRowHeight(),
        columnWidth: a.timeAxisViewModel.getTickWidth(),
        defaultConfig: b.defaultConfig
      }, b.exportDialogConfig)
    });
    b.saveRestoreData();
    b.win.show()
  },
  saveRestoreData: function() {
    var b = this.scheduler,
      a = b.getSchedulingView(),
      c = b.normalGrid,
      d = b.lockedGrid;
    this.restoreSettings = {
      width: b.getWidth(),
      height: b.getHeight(),
      rowHeight: a.timeAxisViewModel.getViewRowHeight(),
      columnWidth: a.timeAxisViewModel.getTickWidth(),
      startDate: b.getStart(),
      endDate: b.getEnd(),
      normalWidth: c.getWidth(),
      normalLeft: c.getEl().getStyle("left"),
      lockedWidth: d.getWidth(),
      lockedCollapse: d.collapsed,
      normalCollapse: c.collapsed
    }
  },
  getStylesheets: function() {
    var c = Ext.getDoc().select('link[rel="stylesheet"]'),
      a = Ext.get(Ext.core.DomHelper.createDom({
        tag: "div"
      })),
      b;
    c.each(function(d) {
      a.appendChild(d.dom.cloneNode(true))
    });
    b = a.dom.innerHTML + "";
    return b
  },
  doExport: function(n, j, q) {
    this.mask();
    var K = this,
      p = K.scheduler,
      r = p.getSchedulingView(),
      m = K.getStylesheets(),
      I = n || K.defaultConfig,
      s = p.normalGrid,
      F = p.lockedGrid,
      A = s.headerCt.getHeight();
    K.saveRestoreData();
    s.expand();
    F.expand();
    K.fireEvent("updateprogressbar", 0.1);
    if (this.expandAllBeforeExport && p.expandAll) {
      p.expandAll()
    }
    var J = p.timeAxis.getTicks(),
      t = r.timeAxisViewModel.getTickWidth(),
      D, e, g;
    if (!I.singlePageExport) {
      if (I.orientation === "landscape") {
        D = K.pageSizes[I.format].height * K.DPI;
        g = K.pageSizes[I.format].width * K.DPI
      } else {
        D = K.pageSizes[I.format].width * K.DPI;
        g = K.pageSizes[I.format].height * K.DPI
      }
      var H = 41;
      e = Math.floor(g) - A - (I.showHeader ? H : 0)
    }
    r.timeAxisViewModel.suppressFit = true;
    var E = 0;
    var k = 0;
    if (I.range !== "complete") {
      var d, b;
      switch (I.range) {
        case "date":
          d = new Date(I.dateFrom);
          b = new Date(I.dateTo);
          if (Ext.ux.Scheduler.util.Date.getDurationInDays(d, b) < 1) {
            b = Ext.ux.Scheduler.util.Date.add(b, Ext.ux.Scheduler.util.Date.DAY, 1)
          }
          d = Ext.ux.Scheduler.util.Date.constrain(d, p.getStart(), p.getEnd());
          b = Ext.ux.Scheduler.util.Date.constrain(b, p.getStart(), p.getEnd());
          break;
        case "current":
          var L = r.getVisibleDateRange();
          d = L.startDate;
          b = L.endDate || r.timeAxis.getEnd();
          if (I.cellSize) {
            t = I.cellSize[0];
            if (I.cellSize.length > 1) {
              r.setRowHeight(I.cellSize[1])
            }
          }
          break
      }
      p.setTimeSpan(d, b);
      var c = Math.floor(r.timeAxis.getTickFromDate(d));
      var x = Math.floor(r.timeAxis.getTickFromDate(b));
      J = p.timeAxis.getTicks();
      J = Ext.Array.filter(J, function(i, a) {
        if (a < c) {
          E++;
          return false
        } else {
          if (a > x) {
            k++;
            return false
          }
        }
        return true
      })
    }
    this.beforeExport(p, J);
    var C, z, h;
    if (!I.singlePageExport) {
      p.setWidth(D);
      p.setTimeColumnWidth(t);
      r.timeAxisViewModel.setTickWidth(t);
      h = K.calculatePages(I, J, t, D, e);
      z = K.getExportJsonHtml(h, {
        styles: m,
        config: I,
        ticks: J,
        skippedColsBefore: E,
        skippedColsAfter: k,
        printHeight: e,
        paperWidth: D,
        headerHeight: A
      });
      C = I.format
    } else {
      z = K.getExportJsonHtml(null, {
        styles: m,
        config: I,
        ticks: J,
        skippedColsBefore: E,
        skippedColsAfter: k,
        timeColumnWidth: t
      });
      var f = K.getRealSize(),
        v = Ext.Number.toFixed(f.width / K.DPI, 1),
        u = Ext.Number.toFixed(f.height / K.DPI, 1);
      C = v + "in*" + u + "in"
    }
    K.fireEvent("updateprogressbar", 0.4);
    if (K.printServer) {
      if (!K.debug && !K.test) {
        Ext.Ajax.request({
          type: "POST",
          url: K.printServer,
          timeout: 60000,
          params: Ext.apply({
            html: {
              array: z
            },
            startDate: p.getStartDate(),
            endDate: p.getEndDate(),
            format: C,
            orientation: I.orientation,
            range: I.range,
            fileFormat: K.fileFormat
          }, this.getParameters()),
          success: function(a) {
            K.onSuccess(a, j, q)
          },
          failure: function(a) {
            K.onFailure(a, q)
          },
          scope: K
        })
      } else {
        if (K.debug) {
          var o, G = Ext.JSON.decode(z);
          for (var B = 0, y = G.length; B < y; B++) {
            o = window.open();
            o.document.write(G[B].html);
            o.document.close()
          }
        }
      }
    } else {
      throw "Print server URL is not defined, please specify printServer config"
    }
    r.timeAxisViewModel.suppressFit = false;
    K.restorePanel();
    this.afterExport(p);
    if (K.test) {
      return {
        htmlArray: Ext.JSON.decode(z),
        calculatedPages: h
      }
    }
  },
  getParameters: function() {
    return {}
  },
  getRealSize: function() {
    var c = this.scheduler,
      b = c.normalGrid.headerCt.getHeight(),
      e = "." + Ext.baseCSSPrefix + (Ext.versions.extjs.isLessThan("5.0") ? "grid-table" : "grid-item-container"),
      a = (b + c.lockedGrid.getView().getEl().down(e).getHeight()),
      d = (c.lockedGrid.headerCt.getEl().first().getWidth() + c.normalGrid.body.down(e).getWidth());
    return {
      width: d,
      height: a
    }
  },
  calculatePages: function(r, s, j, p, b) {
    var t = this,
      i = t.scheduler,
      q = i.lockedGrid,
      c = i.getSchedulingView().timeAxisViewModel.getViewRowHeight(),
      u = q.headerCt,
      o = u.getEl().first().getWidth(),
      h = null,
      k = 0;
    if (o > q.getWidth()) {
      var g = 0,
        d = 0,
        m = 0,
        n = false,
        e;
      h = [];
      q.headerCt.items.each(function(y, w, v) {
        e = y.width;
        if (!m || m + e < p) {
          m += e;
          if (w === v - 1) {
            n = true;
            var x = p - m;
            k = Math.floor(x / j)
          }
        } else {
          n = true
        }
        if (n) {
          d = w;
          h.push({
            firstColumnIdx: g,
            lastColumnIdx: d,
            totalColumnsWidth: m || e
          });
          g = d + 1;
          m = 0
        }
      })
    } else {
      k = Math.floor((p - o) / j)
    }
    var l = Math.floor(p / j),
      a = Math.ceil((s.length - k) / l),
      f = Math.floor(b / c);
    if (!h || a === 0) {
      a += 1
    }
    return {
      columnsAmountLocked: k,
      columnsAmountNormal: l,
      lockedColumnPages: h,
      rowsAmount: f,
      rowPages: Math.ceil(i.getSchedulingView().store.getCount() / f),
      columnPages: a,
      timeColumnWidth: j,
      lockedGridWidth: o,
      rowHeight: c,
      panelHTML: {}
    }
  },
  getExportJsonHtml: function(f, E) {
    var H = this,
      n = H.scheduler,
      y = [],
      v = new RegExp(Ext.baseCSSPrefix + "ie\\d?|" + Ext.baseCSSPrefix + "gecko", "g"),
      B = Ext.getBody().dom.className.replace(v, ""),
      q = n.el.dom.className,
      m = E.styles,
      F = E.config,
      G = E.ticks,
      o, d, e, p, r;
    if (Ext.isIE) {
      B += " sch-ie-export"
    }
    n.timeAxis.autoAdjust = false;
    if (!F.singlePageExport) {
      var s = f.columnsAmountLocked,
        u = f.columnsAmountNormal,
        l = f.lockedColumnPages,
        h = f.rowsAmount,
        t = f.rowPages,
        a = f.columnPages,
        C = E.paperWidth,
        c = E.printHeight,
        z = E.headerHeight,
        j = null,
        b, g;
      r = f.timeColumnWidth;
      o = f.panelHTML;
      o.skippedColsBefore = E.skippedColsBefore;
      o.skippedColsAfter = E.skippedColsAfter;
      if (l) {
        g = l.length;
        a += g
      }
      for (var A = 0; A < a; A++) {
        if (l && A < g) {
          if (A === g - 1 && s !== 0) {
            n.normalGrid.show();
            j = Ext.Number.constrain((s - 1), 0, (G.length - 1));
            n.setTimeSpan(G[0].start, G[j].end)
          } else {
            n.normalGrid.hide()
          }
          var D = l[A];
          this.showLockedColumns();
          this.hideLockedColumns(D.firstColumnIdx, D.lastColumnIdx);
          n.lockedGrid.setWidth(D.totalColumnsWidth + 1)
        } else {
          if (A === 0) {
            this.showLockedColumns();
            if (s !== 0) {
              n.normalGrid.show()
            }
            j = Ext.Number.constrain(s - 1, 0, G.length - 1);
            n.setTimeSpan(G[0].start, G[j].end)
          } else {
            n.lockedGrid.hide();
            n.normalGrid.show();
            if (j === null) {
              j = -1
            }
            if (G[j + u]) {
              n.setTimeSpan(G[j + 1].start, G[j + u].end);
              j = j + u
            } else {
              n.setTimeSpan(G[j + 1].start, G[G.length - 1].end)
            }
          }
        }
        n.setTimeColumnWidth(r, true);
        n.getSchedulingView().timeAxisViewModel.setTickWidth(r);
        for (var x = 0; x < t; x += 1) {
          H.hideRows(h, x);
          o.dom = n.body.dom.innerHTML;
          o.k = x;
          o.i = A;
          d = H.resizePanelHTML(o);
          p = H.tpl.apply(Ext.apply({
            bodyClasses: B,
            bodyHeight: c + z,
            componentClasses: q,
            styles: m,
            showHeader: F.showHeader,
            HTML: d.dom.innerHTML,
            totalWidth: C,
            headerHeight: z,
            column: A + 1,
            row: x + 1
          }));
          e = {
            html: p
          };
          y.push(e);
          H.showRows()
        }
      }
    } else {
      r = E.timeColumnWidth;
      o = f ? f.panelHTML : {};
      n.setTimeSpan(G[0].start, G[G.length - 1].end);
      n.lockedGrid.setWidth(n.lockedGrid.headerCt.getEl().first().getWidth());
      n.setTimeColumnWidth(r);
      n.getSchedulingView().timeAxisViewModel.setTickWidth(r);
      var w = H.getRealSize();
      Ext.apply(o, {
        dom: n.body.dom.innerHTML,
        column: 1,
        row: 1,
        timeColumnWidth: E.timeColumnWidth,
        skippedColsBefore: E.skippedColsBefore,
        skippedColsAfter: E.skippedColsAfter
      });
      d = H.resizePanelHTML(o);
      p = H.tpl.apply(Ext.apply({
        bodyClasses: B,
        bodyHeight: w.height,
        componentClasses: q,
        styles: m,
        showHeader: false,
        HTML: d.dom.innerHTML,
        totalWidth: w.width
      }));
      e = {
        html: p
      };
      y.push(e)
    }
    n.timeAxis.autoAdjust = true;
    return Ext.JSON.encode(y)
  },
  resizePanelHTML: function(f) {
    var k = Ext.get(Ext.core.DomHelper.createDom({
        tag: "div",
        html: f.dom
      })),
      j = this.scheduler,
      d = j.lockedGrid,
      i = j.normalGrid,
      g, e, b;
    if (Ext.isIE6 || Ext.isIE7 || Ext.isIEQuirks) {
      var h = document.createDocumentFragment(),
        a, c;
      if (h.getElementById) {
        a = "getElementById";
        c = ""
      } else {
        a = "querySelector";
        c = "#"
      }
      h.appendChild(k.dom);
      g = d.view.el;
      e = [h[a](c + j.id + "-targetEl"), h[a](c + j.id + "-innerCt"), h[a](c + d.id), h[a](c + d.body.id), h[a](c + g.id)];
      b = [h[a](c + i.id), h[a](c + i.headerCt.id), h[a](c + i.body.id), h[a](c + i.getView().id)];
      Ext.Array.each(e, function(l) {
        if (l !== null) {
          l.style.height = "100%";
          l.style.width = "100%"
        }
      });
      Ext.Array.each(b, function(m, l) {
        if (m !== null) {
          if (l === 1) {
            m.style.width = "100%"
          } else {
            m.style.height = "100%";
            m.style.width = "100%"
          }
        }
      });
      k.dom.innerHTML = h.firstChild.innerHTML
    } else {
      g = d.view.el;
      e = [k.select("#" + j.id + "-targetEl").first(), k.select("#" + j.id + "-innerCt").first(), k.select("#" + d.id).first(), k.select("#" + d.body.id).first(), k.select("#" + g.id)];
      b = [k.select("#" + i.id).first(), k.select("#" + i.headerCt.id).first(), k.select("#" + i.body.id).first(), k.select("#" + i.getView().id).first()];
      Ext.Array.each(e, function(m, l) {
        if (m) {
          m.setHeight("100%");
          if (l !== 3 && l !== 2) {
            m.setWidth("100%")
          }
        }
      });
      Ext.Array.each(b, function(m, l) {
        if (l === 1) {
          m.setWidth("100%")
        } else {
          m.applyStyles({
            height: "100%",
            width: "100%"
          })
        }
      })
    }
    return k
  },
  getWin: function() {
    return this.win || null
  },
  hideDialogWindow: function(a) {
    var b = this;
    b.fireEvent("hidedialogwindow", a);
    b.unmask();
    if (b.openAfterExport) {
      window.open(a.url, "ExportedPanel")
    }
  },
  onSuccess: function(c, h, b) {
    var d = this,
      g = d.getWin(),
      a;
    try {
      a = Ext.JSON.decode(c.responseText)
    } catch (f) {
      this.onFailure(c, b);
      return
    }
    d.fireEvent("updateprogressbar", 1, a);
    if (a.success) {
      setTimeout(function() {
        d.hideDialogWindow(a)
      }, g ? g.hideTime : 3000)
    } else {
      d.fireEvent("showdialogerror", g, a.msg, a)
    }
    d.unmask();
    if (h) {
      h.call(this, c)
    }
  },
  onFailure: function(b, a) {
    var c = this.getWin(),
      d = b.status === 200 ? b.responseText : b.statusText;
    this.fireEvent("showdialogerror", c, d);
    this.unmask();
    if (a) {
      a.call(this, b)
    }
  },
  hideRows: function(e, g) {
    var d = this.scheduler.lockedGrid.view.getNodes(),
      a = this.scheduler.normalGrid.view.getNodes(),
      h = e * g,
      c = h + e;
    for (var f = 0, b = a.length; f < b; f++) {
      if (f < h || f >= c) {
        d[f].className += " sch-none";
        a[f].className += " sch-none"
      }
    }
  },
  showRows: function() {
    this.scheduler.getEl().select(this.scheduler.getSchedulingView().getItemSelector()).each(function(a) {
      a.removeCls("sch-none")
    })
  },
  hideLockedColumns: function(c, e) {
    var d = this.scheduler.lockedGrid.headerCt.items.items;
    for (var b = 0, a = d.length; b < a; b++) {
      if (b < c || b > e) {
        d[b].hide()
      }
    }
  },
  showLockedColumns: function() {
    this.scheduler.lockedGrid.headerCt.items.each(function(a) {
      a.show()
    })
  },
  mask: function() {
    var a = Ext.getBody().mask();
    a.addCls("sch-export-mask")
  },
  unmask: function() {
    Ext.getBody().unmask()
  },
  restorePanel: function() {
    var b = this.scheduler,
      a = this.restoreSettings;
    b.setWidth(a.width);
    b.setHeight(a.height);
    b.setTimeSpan(a.startDate, a.endDate);
    b.setTimeColumnWidth(a.columnWidth, true);
    b.getSchedulingView().setRowHeight(a.rowHeight);
    b.lockedGrid.show();
    b.normalGrid.setWidth(a.normalWidth);
    b.normalGrid.getEl().setStyle("left", a.normalLeft);
    b.lockedGrid.setWidth(a.lockedWidth);
    if (a.lockedCollapse) {
      b.lockedGrid.collapse()
    }
    if (a.normalCollapse) {
      b.normalGrid.collapse()
    }
    b.getSchedulingView().timeAxisViewModel.update()
  },
  destroy: function() {
    if (this.win) {
      this.win.destroy()
    }
  }
});
Ext.define("Ext.ux.Scheduler.plugin.Lines", {
  extend: "Ext.ux.Scheduler.feature.AbstractTimeSpan",
  alias: "plugin.scheduler_lines",
  cls: "sch-timeline",
  showTip: true,
  innerTpl: null,
  prepareTemplateData: null,
  side: null,
  init: function(a) {
    if (Ext.isString(this.innerTpl)) {
      this.innerTpl = new Ext.XTemplate(this.innerTpl)
    }
    this.side = a.rtl ? "right" : "left";
    var b = this.innerTpl;
    if (!this.template) {
      this.template = new Ext.XTemplate('<tpl for=".">', '<div id="{id}" ' + (this.showTip ? 'title="{[this.getTipText(values)]}" ' : "") + 'class="{$cls}" style="' + this.side + ':{left}px;top:{top}px;height:{height}px;width:{width}px">' + (b ? "{[this.renderInner(values)]}" : "") + "</div>", "</tpl>", {
        getTipText: function(c) {
          return a.getSchedulingView().getFormattedDate(c.Date) + " " + (c.Text || "")
        },
        renderInner: function(c) {
          return b.apply(c)
        }
      })
    }
    this.callParent(arguments)
  },
  getElementData: function(m, q, c) {
    var t = this.store,
      j = this.schedulerView,
      p = j.isHorizontal(),
      f = c || t.getRange(),
      h = [],
      r, a, o = j.getTimeSpanRegion(m, null, this.expandToFitView),
      k, b, e;
    if (Ext.versions.touch) {
      r = "100%"
    } else {
      r = p ? o.bottom - o.top : 1
    }
    a = p ? 1 : o.right - o.left;
    for (var g = 0, d = f.length; g < d; g++) {
      k = f[g];
      b = k.get("Date");
      if (b && Ext.ux.Scheduler.util.Date.betweenLesser(b, m, q)) {
        var n = j.getCoordinateFromDate(b);
        e = Ext.apply({}, this.getTemplateData(k));
        e.id = this.getElementId(k);
        e.$cls = this.getElementCls(k, e);
        e.width = a;
        e.height = r;
        if (p) {
          e.left = n
        } else {
          e.top = n
        }
        h.push(e)
      }
    }
    return h
  },
  getHeaderElementData: function(c) {
    var a = this.timeAxis.getStart(),
      k = this.timeAxis.getEnd(),
      m = this.schedulerView.isHorizontal(),
      g = [],
      h, b, j, e;
    c = c || this.store.getRange();
    for (var f = 0, d = c.length; f < d; f++) {
      h = c[f];
      b = h.get("Date");
      if (b && Ext.ux.Scheduler.util.Date.betweenLesser(b, a, k)) {
        j = this.getHeaderElementPosition(b);
        e = this.getTemplateData(h);
        g.push(Ext.apply({
          id: this.getHeaderElementId(h),
          side: m ? this.side : "top",
          cls: this.getHeaderElementCls(h, e),
          position: j
        }, e))
      }
    }
    return g
  }
});
Ext.define("Ext.ux.Scheduler.plugin.CurrentTimeLine", {
  extend: "Ext.ux.Scheduler.plugin.Lines",
  alias: "plugin.scheduler_currenttimeline",
  mixins: ["Ext.ux.Scheduler.mixin.Localizable"],
  requires: ["Ext.data.JsonStore"],
  updateInterval: 60000,
  showHeaderElements: true,
  autoUpdate: true,
  expandToFitView: true,
  timer: null,
  init: function(c) {
    if (Ext.getVersion("touch")) {
      this.showHeaderElements = false
    }
    var b = new Ext.data.JsonStore({
      fields: ["Date", "Cls", "Text"],
      data: [{
        Date: new Date(),
        Cls: "sch-todayLine",
        Text: this.L("tooltipText")
      }]
    });
    var a = b.first();
    if (this.autoUpdate) {
      this.timer = setInterval(function() {
        a.set("Date", new Date())
      }, this.updateInterval)
    }
    c.on("destroy", this.onHostDestroy, this);
    this.store = b;
    this.callParent(arguments)
  },
  onHostDestroy: function() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null
    }
    if (this.store.autoDestroy) {
      this.store.destroy()
    }
  }
});
Ext.define("Ext.ux.Scheduler.plugin.DragSelector", {
  extend: "Ext.ux.Scheduler.util.DragTracker",
  alias: "plugin.scheduler_dragselector",
  mixins: ["Ext.AbstractPlugin"],
  requires: ["Ext.ux.Scheduler.util.ScrollManager"],
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
    this.callParent(arguments)
  },
  init: function(b) {
    var a = this.schedulerView = b.getSchedulingView();
    a.on({
      afterrender: this.onSchedulingViewRender,
      destroy: this.onSchedulingViewDestroy,
      scope: this
    })
  },
  onBeforeStart: function(a) {
    return !a.getTarget(".sch-event") && a.ctrlKey
  },
  onStart: function(b) {
    var c = this.schedulerView;
    this.proxy.show();
    this.bodyRegion = c.getScheduleRegion();
    var a = [];
    c.getEventNodes().each(function(d) {
      a[a.length] = {
        region: d.getRegion(),
        node: d.dom
      }
    });
    this.eventData = a;
    this.sm.deselectAll();
    Ext.ux.Scheduler.util.ScrollManager.activate(c.el)
  },
  onDrag: function(h) {
    var j = this.sm,
      f = this.eventData,
      b = this.getRegion().constrainTo(this.bodyRegion),
      c, d, a, g;
    this.proxy.setRegion(b);
    for (c = 0, a = f.length; c < a; c++) {
      d = f[c];
      g = b.intersect(d.region);
      if (g && !d.selected) {
        d.selected = true;
        j.selectNode(d.node, true)
      } else {
        if (!g && d.selected) {
          d.selected = false;
          j.deselectNode(d.node)
        }
      }
    }
  },
  onEnd: function(a) {
    if (this.proxy) {
      this.proxy.setDisplayed(false)
    }
    Ext.ux.Scheduler.util.ScrollManager.deactivate()
  },
  onSchedulingViewRender: function(a) {
    this.sm = a.getSelectionModel();
    this.initEl(this.schedulerView.el);
    this.proxy = a.el.createChild({
      cls: "sch-drag-selector"
    })
  },
  onSchedulingViewDestroy: function() {
    if (this.proxy) {
      Ext.destroy(this.proxy)
    }
    this.destroy()
  }
});
Ext.define("Ext.ux.Scheduler.plugin.EventEditor", {
  extend: "Ext.form.Panel",
  mixins: ["Ext.AbstractPlugin", "Ext.ux.Scheduler.mixin.Localizable"],
  alias: ["widget.eventeditor", "plugin.scheduler_eventeditor"],
  lockableScope: "normal",
  requires: ["Ext.ux.Scheduler.util.Date", "Ext.form.Label"],
  hideOnBlur: true,
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
  cls: "sch-eventeditor",
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
  ignoreCls: "sch-event-editor-ignore-click",
  readOnly: false,
  layout: {
    type: "vbox",
    align: "stretch"
  },
  constrain: false,
  constructor: function(a) {
    a = a || {};
    Ext.apply(this, a);
    this.durationUnit = this.durationUnit || Ext.ux.Scheduler.util.Date.HOUR;
    this.callParent(arguments)
  },
  initComponent: function() {
    if (!this.fieldsPanelConfig) {
      throw "Must define a fieldsPanelConfig property"
    }
    Ext.apply(this, {
      fbar: this.buttons || this.buildButtons(),
      items: [{
        xtype: "container",
        layout: "hbox",
        height: 35,
        border: false,
        cls: "sch-eventeditor-timefields",
        items: this.buildDurationFields()
      }, Ext.applyIf(this.fieldsPanelConfig, {
        flex: 1,
        activeItem: 0
      })]
    });
    this.callParent(arguments)
  },
  init: function(a) {
    this.ownerCt = a;
    this.schedulerView = a.getView();
    this.eventStore = this.schedulerView.getEventStore();
    this.schedulerView.on({
      afterrender: this.onSchedulerRender,
      destroy: this.onSchedulerDestroy,
      dragcreateend: this.onDragCreateEnd,
      scope: this
    });
    if (this.triggerEvent) {
      this.schedulerView.on(this.triggerEvent, this.onActivateEditor, this)
    }
    this.schedulerView.registerEventEditor(this)
  },
  onSchedulerRender: function() {
    this.render(Ext.getBody());
    if (this.hideOnBlur) {
      this.mon(Ext.getDoc(), "mousedown", this.onMouseDown, this)
    }
  },
  show: function(g, i) {
    var h = this.schedulerView.isReadOnly();
    if (h !== this.readOnly) {
      Ext.Array.each(this.query("field"), function(j) {
        j.setReadOnly(h)
      });
      this.saveButton.setVisible(!h);
      this.deleteButton.setVisible(!h);
      this.readOnly = h
    }
    if (this.deleteButton) {
      this.deleteButton.setVisible(!h && this.eventStore.indexOf(g) >= 0)
    }
    this.eventRecord = g;
    this.durationField.setValue(Ext.ux.Scheduler.util.Date.getDurationInUnit(g.getStartDate(), g.getEndDate(), this.durationUnit));
    var e = g.getStartDate();
    this.startDateField.setValue(e);
    this.startTimeField.setValue(e);
    var f = this.schedulerView.up("[floating=true]");
    if (f) {
      this.getEl().setZIndex(f.getEl().getZIndex() + 1);
      f.addCls(this.ignoreCls)
    }
    this.callParent();
    i = i || this.schedulerView.getElementFromEventRecord(g);
    this.alignTo(i, this.schedulerView.getOrientation() == "horizontal" ? "bl" : "tl-tr", this.getConstrainOffsets(i));
    this.expand(!this.constrain);
    if (this.constrain) {
      this.doConstrain(Ext.util.Region.getRegion(Ext.getBody()))
    }
    var c, d = g.get("EventType");
    if (d && this.dynamicForm) {
      var b = this.items.getAt(1),
        a = b.query("> component[EventType=" + d + "]");
      if (!a.length) {
        throw "Can't find form for EventType=" + d
      }
      if (!b.getLayout().setActiveItem) {
        throw "Can't switch active component in the 'fieldsPanel'"
      }
      c = a[0];
      if (!(c instanceof Ext.form.Panel)) {
        throw "Each child component of 'fieldsPanel' should be a 'form'"
      }
      b.getLayout().setActiveItem(c)
    } else {
      c = this
    }
    this.currentForm = c;
    c.getForm().loadRecord(g)
  },
  getConstrainOffsets: function(a) {
    return [0, 0]
  },
  onSaveClick: function() {
    var e = this,
      h = e.eventRecord,
      a = this.currentForm.getForm();
    if (a.isValid() && this.fireEvent("beforeeventsave", this, h) !== false) {
      var c = e.startDateField.getValue(),
        i, b = e.startTimeField.getValue(),
        g = e.durationField.getValue();
      if (c && g >= 0) {
        if (b) {
          Ext.ux.Scheduler.util.Date.copyTimeValues(c, b)
        }
        i = Ext.ux.Scheduler.util.Date.add(c, this.durationUnit, g)
      } else {
        return
      }
      var d = h.getResources(this.eventStore);
      var f = (d.length > 0 && d[0]) || this.resourceRecord;
      if (!this.schedulerView.allowOverlap && !this.schedulerView.isDateRangeAvailable(c, i, h, f)) {
        return
      }
      h.beginEdit();
      var j = h.endEdit;
      h.endEdit = Ext.emptyFn;
      a.updateRecord(h);
      h.endEdit = j;
      h.setStartEndDate(c, i);
      h.endEdit();
      if (this.eventStore.indexOf(this.eventRecord) < 0) {
        if (this.schedulerView.fireEvent("beforeeventadd", this.schedulerView, h) !== false) {
          this.eventStore.append(h)
        }
      }
      e.collapse(null, true)
    }
  },
  onDeleteClick: function() {
    if (this.fireEvent("beforeeventdelete", this, this.eventRecord) !== false) {
      this.eventStore.remove(this.eventRecord)
    }
    this.collapse(null, true)
  },
  onCancelClick: function() {
    this.collapse(null, true)
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
    return [this.saveButton, this.deleteButton, this.cancelButton]
  },
  buildDurationFields: function() {
    this.startDateField = new Ext.form.field.Date(Ext.apply({
      width: 90,
      allowBlank: false,
      format: this.dateFormat
    }, this.dateConfig || {}));
    this.startDateField.getPicker().addCls(this.ignoreCls);
    this.startTimeField = new Ext.form.field.Time(Ext.apply({
      width: 70,
      allowBlank: false,
      format: this.timeFormat
    }, this.timeConfig || {}));
    this.startTimeField.getPicker().addCls(this.ignoreCls);
    this.durationField = new Ext.form.field.Number(Ext.apply({
      width: 45,
      value: 0,
      minValue: 0,
      allowNegative: false
    }, this.durationConfig || {}));
    this.durationLabel = new Ext.form.Label({
      text: this.getDurationText()
    });
    return [this.startDateField, this.startTimeField, this.durationField, this.durationLabel]
  },
  onActivateEditor: function(b, a) {
    this.show(a)
  },
  onMouseDown: function(a) {
    if (this.collapsed || a.within(this.getEl()) || a.getTarget("." + this.ignoreCls, 9) || a.getTarget(this.schedulerView.eventSelector)) {
      return
    }
    this.collapse()
  },
  onSchedulerDestroy: function() {
    this.destroy()
  },
  onDragCreateEnd: function(b, a, c) {
    if (!this.dragProxyEl && this.schedulerView.dragCreator) {
      this.dragProxyEl = this.schedulerView.dragCreator.getProxy()
    }
    this.resourceRecord = c;
    this.schedulerView.onEventCreated(a);
    this.show(a, this.dragProxyEl)
  },
  hide: function() {
    this.callParent(arguments);
    var a = this.dragProxyEl;
    if (a) {
      a.hide()
    }
  },
  afterCollapse: function() {
    this.hide();
    this.callParent(arguments)
  },
  getDurationText: function() {
    if (this.durationText) {
      return this.durationText
    }
    return Ext.ux.Scheduler.util.Date.getShortNameOfUnit(Ext.ux.Scheduler.util.Date.getNameOfUnit(this.durationUnit))
  }
});
Ext.define("Ext.ux.Scheduler.plugin.EventTools", {
  extend: "Ext.Container",
  mixins: ["Ext.AbstractPlugin"],
  lockableScope: "top",
  alias: "plugin.scheduler_eventtools",
  hideDelay: 500,
  align: "right",
  defaults: {
    xtype: "tool",
    baseCls: "sch-tool",
    overCls: "sch-tool-over",
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
  autoRender: true,
  floating: true,
  hideMode: "offsets",
  hidden: true,
  getRecord: function() {
    return this.record
  },
  init: function(a) {
    if (!this.items) {
      throw "Must define an items property for this plugin to function correctly"
    }
    this.addCls("sch-event-tools");
    this.scheduler = a;
    a.on({
      eventresizestart: this.onOperationStart,
      eventresizeend: this.onOperationEnd,
      eventdragstart: this.onOperationStart,
      eventdrop: this.onOperationEnd,
      eventmouseenter: this.onEventMouseEnter,
      eventmouseleave: this.onContainerMouseLeave,
      scope: this
    })
  },
  onRender: function() {
    this.callParent(arguments);
    this.scheduler.mon(this.el, {
      mouseenter: this.onContainerMouseEnter,
      mouseleave: this.onContainerMouseLeave,
      scope: this
    })
  },
  onEventMouseEnter: function(g, a, f) {
    var c = false;
    var h;
    this.record = a;
    this.items.each(function(i) {
      h = i.visibleFn(a) !== false;
      i.setVisible(h);
      if (h) {
        c = true
      }
    }, this);
    if (!c) {
      return
    }
    if (!this.rendered) {
      this.doAutoRender()
    }
    var e = f.getTarget(g.eventSelector);
    var d = Ext.fly(e).getBox();
    this.doLayout();
    var b = this.getSize();
    this.lastPosition = [f.getXY()[0] - (b.width / 2), d.y - b.height - this.offset.y];
    this.onContainerMouseEnter()
  },
  onContainerMouseEnter: function() {
    window.clearTimeout(this.hideTimer);
    this.setPosition.apply(this, this.lastPosition);
    this.show()
  },
  onContainerMouseLeave: function() {
    window.clearTimeout(this.hideTimer);
    this.hideTimer = Ext.defer(this.hide, this.hideDelay, this)
  },
  onOperationStart: function() {
    this.scheduler.un("eventmouseenter", this.onEventMouseEnter, this);
    window.clearTimeout(this.hideTimer);
    this.hide()
  },
  onOperationEnd: function() {
    this.scheduler.on("eventmouseenter", this.onEventMouseEnter, this)
  }
});
Ext.define("Ext.ux.Scheduler.plugin.Pan", {
  extend: "Ext.AbstractPlugin",
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
  panel: null,
  constructor: function(a) {
    Ext.apply(this, a)
  },
  init: function(a) {
    this.panel = a.normalGrid || a;
    this.view = a.getSchedulingView();
    this.view.on("afterrender", this.onRender, this)
  },
  onRender: function(a) {
    this.view.el.on("mousedown", this.onMouseDown, this)
  },
  onMouseDown: function(d, c) {
    var b = this.self,
      a = this.disableOnKey;
    if ((d.shiftKey && (a & b.KEY_SHIFT)) || (d.ctrlKey && (a & b.KEY_CTRL)) || (d.altKey && (a & b.KEY_ALT))) {
      return
    }
    if (d.getTarget("." + this.view.timeCellCls, 10) && !d.getTarget(this.view.eventSelector)) {
      this.mouseX = d.getPageX();
      this.mouseY = d.getPageY();
      Ext.getBody().on("mousemove", this.onMouseMove, this);
      Ext.getDoc().on("mouseup", this.onMouseUp, this);
      if (Ext.isIE || Ext.isGecko) {
        Ext.getBody().on("mouseenter", this.onMouseUp, this)
      }
      d.stopEvent()
    }
  },
  onMouseMove: function(d) {
    d.stopEvent();
    var a = d.getPageX(),
      f = d.getPageY(),
      c = a - this.mouseX,
      b = f - this.mouseY;
    this.panel.scrollByDeltaX(-c);
    this.mouseX = a;
    this.mouseY = f;
    if (this.enableVerticalPan) {
      this.panel.scrollByDeltaY(-b)
    }
  },
  onMouseUp: function(a) {
    Ext.getBody().un("mousemove", this.onMouseMove, this);
    Ext.getDoc().un("mouseup", this.onMouseUp, this);
    if (Ext.isIE || Ext.isGecko) {
      Ext.getBody().un("mouseenter", this.onMouseUp, this)
    }
  }
});
Ext.define("Ext.ux.Scheduler.plugin.SimpleEditor", {
  extend: "Ext.Editor",
  alias: "plugin.scheduler_simpleeditor",
  requires: ["Ext.form.TextField"],
  mixins: ["Ext.AbstractPlugin", "Ext.ux.Scheduler.mixin.Localizable"],
  lockableScope: "top",
  cls: "sch-simpleeditor",
  allowBlur: false,
  delegate: ".sch-event-inner",
  dataIndex: null,
  completeOnEnter: true,
  cancelOnEsc: true,
  ignoreNoChange: true,
  height: 19,
  autoSize: {
    width: "boundEl"
  },
  initComponent: function() {
    this.field = this.field || {
      xtype: "textfield",
      selectOnFocus: true
    };
    this.callParent(arguments)
  },
  init: function(a) {
    this.scheduler = a.getSchedulingView();
    a.on("afterrender", this.onSchedulerRender, this);
    this.scheduler.registerEventEditor(this);
    this.dataIndex = this.dataIndex || this.scheduler.getEventStore().model.prototype.nameField
  },
  edit: function(a, b) {
    b = b || this.scheduler.getElementFromEventRecord(a);
    this.startEdit(b.child(this.delegate));
    this.record = a;
    this.setValue(this.record.get(this.dataIndex))
  },
  onSchedulerRender: function(a) {
    this.on({
      startedit: this.onStartEdit,
      complete: function(e, f, d) {
        var b = this.record;
        var c = this.scheduler.eventStore;
        b.set(this.dataIndex, f);
        if (c.indexOf(b) < 0) {
          if (this.scheduler.fireEvent("beforeeventadd", this.scheduler, b) !== false) {
            c.append(b)
          }
        }
        this.onAfterEdit()
      },
      canceledit: this.onAfterEdit,
      hide: function() {
        if (this.dragProxyEl) {
          this.dragProxyEl.hide()
        }
      },
      scope: this
    });
    a.on({
      eventdblclick: function(b, c, d) {
        if (!a.isReadOnly()) {
          this.edit(c)
        }
      },
      dragcreateend: this.onDragCreateEnd,
      scope: this
    })
  },
  onStartEdit: function() {
    if (!this.allowBlur) {
      Ext.getBody().on("mousedown", this.onMouseDown, this);
      this.scheduler.on("eventmousedown", function() {
        this.cancelEdit()
      }, this)
    }
  },
  onAfterEdit: function() {
    if (!this.allowBlur) {
      Ext.getBody().un("mousedown", this.onMouseDown, this);
      this.scheduler.un("eventmousedown", function() {
        this.cancelEdit()
      }, this)
    }
  },
  onMouseDown: function(b, a) {
    if (this.editing && this.el && !b.within(this.el)) {
      this.cancelEdit()
    }
  },
  onDragCreateEnd: function(b, a) {
    if (!this.dragProxyEl && this.scheduler.dragCreator) {
      this.dragProxyEl = this.scheduler.dragCreator.getProxy()
    }
    this.scheduler.onEventCreated(a);
    if (a.get(this.dataIndex) === "") {
      a.set(this.dataIndex, this.L("newEventText"))
    }
    this.edit(a, this.dragProxyEl)
  }
});
Ext.define("Ext.ux.Scheduler.plugin.Zones", {
  extend: "Ext.ux.Scheduler.feature.AbstractTimeSpan",
  alias: "plugin.scheduler_zones",
  requires: ["Ext.ux.Scheduler.model.Range"],
  innerTpl: null,
  cls: "sch-zone",
  side: null,
  init: function(a) {
    if (Ext.isString(this.innerTpl)) {
      this.innerTpl = new Ext.XTemplate(this.innerTpl)
    }
    this.side = a.rtl ? "right" : "left";
    var b = this.innerTpl;
    if (!this.template) {
      this.template = new Ext.XTemplate('<tpl for="."><div id="{id}" class="{$cls}" style="' + this.side + ':{left}px;top:{top}px;height:{height}px;width:{width}px;{style}">' + (b ? "{[this.renderInner(values)]}" : "") + "</div></tpl>", {
        renderInner: function(c) {
          return b.apply(c)
        }
      })
    }
    if (Ext.isString(this.innerHeaderTpl)) {
      this.innerHeaderTpl = new Ext.XTemplate(this.innerHeaderTpl)
    }
    this.callParent(arguments)
  },
  getElementData: function(h, d, r, f) {
    var g = this.schedulerView,
      s = [],
      c = g.getTimeSpanRegion(h, d, this.expandToFitView),
      k = this.schedulerView.isHorizontal(),
      b, m, a, j, n, e;
    r = r || this.store.getRange();
	
    for (var q = 0, p = r.length; q < p; q++) {
      b = r[q];
	  
      m = b.getStartDate();
      a = b.getEndDate();
      e = this.getTemplateData(b);
      if (m && a && Ext.ux.Scheduler.util.Date.intersectSpans(m, a, h, d)) {
        var t = g.getCoordinateFromDate(Ext.ux.Scheduler.util.Date.max(m, h));
        var o = g.getCoordinateFromDate(Ext.ux.Scheduler.util.Date.min(a, d));
        j = Ext.apply({}, e);
        j.id = this.getElementId(b);
        j.$cls = this.getElementCls(b, e);
        if (k) {
          j.left = t;
          j.top = c.top;
          j.width = f ? 0 : o - t;
          j.height = c.bottom - c.top;
          j.style = f ? ("border-left-width:" + (o - t) + "px") : ""
        } else {
          j.left = c.left;
          j.top = t;
          j.height = f ? 0 : o - t;
          j.width = c.right - c.left;
          j.style = f ? ("border-top-width:" + (o - t) + "px") : ""
        }
        s.push(j)
      }
    }
    return s
  },
  getHeaderElementId: function(b, a) {
    return this.callParent([b]) + (a ? "-start" : "-end")
  },
  getHeaderElementCls: function(b, d, a) {
    var c = b.clsField || this.clsField;
    if (!d) {
      d = this.getTemplateData(b)
    }
    return "sch-header-indicator sch-header-indicator-" + (a ? "start " : "end ") + this.uniqueCls + " " + (d[c] || "")
  },
  getZoneHeaderElementData: function(b, h, f, a) {
    var c = a ? f.getStartDate() : f.getEndDate(),
      e = null,
      g, i, d;
    if (c && Ext.ux.Scheduler.util.Date.betweenLesser(c, b, h)) {
      g = this.getHeaderElementPosition(c);
      i = this.schedulerView.isHorizontal();
      d = this.getTemplateData(f);
      e = Ext.apply({
        id: this.getHeaderElementId(f, a),
        cls: this.getHeaderElementCls(f, d, a),
        isStart: a,
        side: i ? this.side : "top",
        position: g
      }, d)
    }
    return e
  },
  getHeaderElementData: function(b) {
    var a = this.timeAxis.getStart(),
      h = this.timeAxis.getEnd(),
      e = [],
      g, d, j;
    b = b || this.store.getRange();
    for (var f = 0, c = b.length; f < c; f++) {
      g = b[f];
      d = this.getZoneHeaderElementData(a, h, g, true);
      if (d) {
        e.push(d)
      }
      j = this.getZoneHeaderElementData(a, h, g, false);
      if (j) {
        e.push(j)
      }
    }
    return e
  },
  updateZoneHeaderElement: function(a, b) {
    a.dom.className = b.cls;
    if (this.schedulerView.isHorizontal()) {
      this.setElementX(a, b.position)
    } else {
      a.setTop(b.position)
    }
  },
  updateHeaderElement: function(c) {
    var a = this.timeAxis.getStart(),
      g = this.timeAxis.getEnd(),
      f = Ext.get(this.getHeaderElementId(c, true)),
      e = Ext.get(this.getHeaderElementId(c, false)),
      d = this.getZoneHeaderElementData(a, g, c, true),
      b = this.getZoneHeaderElementData(a, g, c, false);
    if (!(f && b) || !(e && b)) {
      Ext.destroy(f, e);
      this.renderHeaderElementsInternal([c])
    } else {
      if (f) {
        if (!d) {
          Ext.destroy(f)
        } else {
          this.updateZoneHeaderElement(f, d)
        }
      }
      if (e) {
        if (!b) {
          Ext.destroy(e)
        } else {
          this.updateZoneHeaderElement(e, b)
        }
      }
    }
  }
});
Ext.define("Ext.ux.Scheduler.plugin.TimeGap", {
  extend: "Ext.ux.Scheduler.plugin.Zones",
  alias: "plugin.scheduler_timegap",
  getZoneCls: Ext.emptyFn,
  init: function(a) {
    this.store = new Ext.data.JsonStore({
      model: "Ext.ux.Scheduler.model.Range"
    });
    this.scheduler = a;
    a.mon(a.eventStore, {
      load: this.populateStore,
      update: this.populateStore,
      remove: this.populateStore,
      add: this.populateStore,
      datachanged: this.populateStore,
      scope: this
    });
    a.on("viewchange", this.populateStore, this);
    this.schedulerView = a.getSchedulingView();
    this.callParent(arguments)
  },
  populateStore: function(c) {
    var b = this.schedulerView.getEventsInView(),
      f = [],
      e = this.scheduler.getStart(),
      i = this.scheduler.getEnd(),
      d = b.getCount(),
      j = e,
      h, g = 0,
      a;
    b.sortBy(function(l, k) {
      return l.getStartDate() - k.getStartDate()
    });
    a = b.getAt(0);
    while (j < i && g < d) {
      h = a.getStartDate();
      if (!Ext.ux.Scheduler.util.Date.betweenLesser(j, h, a.getEndDate()) && j < h) {
        f.push(new this.store.model({
          StartDate: j,
          EndDate: h,
          Cls: this.getZoneCls(j, h) || ""
        }))
      }
      j = Ext.ux.Scheduler.util.Date.max(a.getEndDate(), j);
      g++;
      a = b.getAt(g)
    }
    if (j < i) {
      f.push(new this.store.model({
        StartDate: j,
        EndDate: i,
        Cls: this.getZoneCls(j, i) || ""
      }))
    }
    this.store.removeAll(f.length > 0);
    this.store.add(f)
  }
});
Ext.define("Ext.ux.Scheduler.plugin.TreeCellEditing", {
  extend: "Ext.grid.plugin.CellEditing",
  alias: "plugin.scheduler_treecellediting",
  lockableScope: "locked",
  init: function(a) {
    this._grid = a;
    this.on("beforeedit", this.checkReadOnly, this);
    this.callParent(arguments)
  },
  bindPositionFixer: function() {
    Ext.on({
      afterlayout: this.fixEditorPosition,
      scope: this
    })
  },
  unbindPositionFixer: function() {
    Ext.un({
      afterlayout: this.fixEditorPosition,
      scope: this
    })
  },
  fixEditorPosition: function(a) {
    var b = this.getActiveEditor();
    if (b) {
      var d = this.getEditingContext(this.context.record, this.context.column);
      if (d) {
        this.context.row = d.row;
        this.context.rowIdx = d.rowIdx;
        b.boundEl = this.getCell(d.record, d.column);
        b.realign();
        var c = this._grid.getView();
        c.focusedRow = c.getNode(d.rowIdx)
      }
    }
  },
  checkReadOnly: function() {
    var a = this._grid;
    if (!(a instanceof Ext.ux.Scheduler.panel.TimelineTreePanel)) {
      a = a.up("tablepanel")
    }
    return !a.isReadOnly()
  },
  startEdit: function(a, c, b) {
    this._grid.suspendLayouts();
    var d = this.callParent(arguments);
    this._grid.resumeLayouts();
    return d
  },
  onEditComplete: function(c, f, b) {
    var e = this,
      a, d;
    if (c.field.applyChanges) {
      a = c.field.task || e.context.record;
      d = true;
      a.set = function() {
        delete a.set;
        d = false;
        c.field.applyChanges(a)
      }
    }
    this.callParent(arguments);
    if (d) {
      delete a.set
    }
    this.unbindPositionFixer()
  },
  showEditor: function(a, b, c) {
    var g = this.grid.getSelectionModel();
    var f = g.selectByPosition;
    if (Ext.getVersion("extjs").isLessThan("4.2.2.1144")) {
      g.selectByPosition = Ext.emptyFn
    }
    var e = a.field;
    if (e && e.setSuppressTaskUpdate) {
      e.setSuppressTaskUpdate(true)
    }
    var d = a.startEdit;
    a.startEdit = function() {
      a.startEdit = d;
      a.startEdit.apply(a, arguments);
      if (e && e.setSuppressTaskUpdate) {
        e.setSuppressTaskUpdate(false)
      }
    };
    if (e) {
      if (e.setTask) {
        e.setTask(b.record);
        c = b.value = b.originalValue = e.getValue()
      } else {
        if (!b.column.dataIndex && b.value === undefined) {
          c = b.value = e.getDisplayValue(b.record)
        }
      }
    }
    if (Ext.isIE8m && Ext.getVersion("extjs").toString() === "4.2.2.1144") {
      Ext.EventObject.type = "click"
    }
    this.callParent([a, b, c]);
    if (Ext.getVersion("extjs").isLessThan("4.2.2.1144")) {
      g.selectByPosition = f
    }
    this.bindPositionFixer()
  },
  cancelEdit: function() {
    this.callParent(arguments);
    this.unbindPositionFixer()
  }
});
Ext.define("Ext.ux.Scheduler.plugin.ResourceZones", {
  extend: "Ext.ux.Scheduler.plugin.Zones",
  alias: "plugin.scheduler_resourcezones",
  innerTpl: null,
  store: null,
  cls: "sch-resourcezone",
  init: function(a) {
    this.uniqueCls = this.uniqueCls || ("sch-timespangroup-" + Ext.id());
    this.scheduler = a;
    a.on("destroy", this.onSchedulerDestroy, this);
    a.registerRenderer(this.renderer, this);
    if (Ext.isString(this.innerTpl)) {
      this.innerTpl = new Ext.XTemplate(this.innerTpl)
    }
    var b = this.innerTpl;
    if (!this.template) {
      this.template = new Ext.XTemplate('<tpl for="."><div id="' + this.uniqueCls + '-{id}" class="' + this.cls + " " + this.uniqueCls + ' {Cls}" style="' + (a.rtl ? "right" : "left") + ':{start}px;width:{width}px;top:{start}px;height:{width}px;{style}">' + (b ? "{[this.renderInner(values)]}" : "") + "</div></tpl>", {
        renderInner: function(c) {
          return b.apply(c)
        }
      })
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
    this.store.on(this.storeListeners)
  },
  onSchedulerDestroy: function() {
    this.store.un(this.storeListeners)
  },
  fullRefresh: function() {
    this.scheduler.getSchedulingView().refresh()
  },
  renderer: function(c, b, a, d) {
    if (this.scheduler.getOrientation() === "horizontal" || d === 0) {
      return this.renderZones(a)
    }
    return ""
  },
  renderZones: function(f) {
    var a = this.store,
      c = this.scheduler,
      h = c.timeAxis.getStart(),
      b = c.timeAxis.getEnd(),
      e = [],
      d, g;
    a.each(function(i) {
      d = i.getStartDate();
      g = i.getEndDate();
      if (i.getResource(null, c.eventStore) === f && d && g && Ext.ux.Scheduler.util.Date.intersectSpans(d, g, h, b)) {
        var k = c.getSchedulingView()[c.getOrientation()].getEventRenderData(i);
        var l, j;
        if (c.getOrientation() === "horizontal") {
          l = c.rtl ? k.right : k.left;
          j = k.width
        } else {
          l = k.top;
          j = k.height
        }
        e[e.length] = Ext.apply({
          id: i.internalId,
          start: l,
          width: j,
          Cls: i.getCls()
        }, i.data)
      }
    });
    return this.template.apply(e)
  },
  refreshSingle: function(i, g) {
    var c = Ext.get(this.uniqueCls + "-" + g.internalId);
    if (c) {
      var e = this.scheduler,
        f = e.timeAxis.getStart(),
        j = e.timeAxis.getEnd();
      var b = Ext.ux.Scheduler.util.Date.max(f, g.getStartDate()),
        d = Ext.ux.Scheduler.util.Date.min(j, g.getEndDate()),
        k = g.getCls();
      var h = e.getSchedulingView().getCoordinateFromDate(b);
      var a = e.getSchedulingView().getCoordinateFromDate(d) - h;
      c.dom.className = this.cls + " " + this.uniqueCls + " " + (k || "");
      c.setStyle({
        left: h + "px",
        top: h + "px",
        height: a + "px",
        width: a + "px"
      })
    }
  }
});
Ext.define("Ext.ux.Scheduler.plugin.HeaderZoom", {
  extend: "Ext.ux.Scheduler.util.DragTracker",
  mixins: ["Ext.AbstractPlugin"],
  alias: "plugin.scheduler_headerzoom",
  lockableScope: "top",
  scheduler: null,
  proxy: null,
  headerRegion: null,
  init: function(a) {
    a.on({
      destroy: this.onSchedulerDestroy,
      scope: this
    });
    this.scheduler = a;
    this.onOrientationChange();
    a.on("orientationchange", this.onOrientationChange, this)
  },
  onOrientationChange: function() {
    var a = this.scheduler.down("timeaxiscolumn");
    if (a) {
      if (a.rendered) {
        this.onTimeAxisColumnRender(a)
      } else {
        a.on({
          afterrender: this.onTimeAxisColumnRender,
          scope: this
        })
      }
    }
  },
  onTimeAxisColumnRender: function(a) {
    this.proxy = a.el.createChild({
      cls: "sch-drag-selector"
    });
    this.initEl(a.el)
  },
  onStart: function(a) {
    this.proxy.show();
    this.headerRegion = this.scheduler.normalGrid.headerCt.getRegion()
  },
  onDrag: function(b) {
    var c = this.headerRegion;
    var a = this.getRegion().constrainTo(c);
    a.top = c.top;
    a.bottom = c.bottom;
    this.proxy.setRegion(a)
  },
  onEnd: function(g) {
    if (this.proxy) {
      this.proxy.setDisplayed(false);
      var b = this.scheduler;
      var d = b.timeAxis;
      var f = this.getRegion();
      var c = b.getSchedulingView().timeAxisViewModel.getBottomHeader().unit;
      var a = b.getSchedulingView().getStartEndDatesFromRegion(f);
      b.zoomToSpan({
        start: d.floorDate(a.start, false, c, 1),
        end: d.ceilDate(a.end, false, c, 1)
      })
    }
  },
  onSchedulerDestroy: function() {
    if (this.proxy) {
      Ext.destroy(this.proxy);
      this.proxy = null
    }
    this.destroy()
  }
});
Ext.define("Ext.ux.Scheduler.widget.ResizePicker", {
  extend: "Ext.Panel",
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
    a.dockedItems = [a.vertical = new Ext.slider.Single(Ext.apply({
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
    }, a.horizontalCfg))];
    a.callParent(arguments)
  },
  afterRender: function() {
    var b = this;
    b.addCls("sch-ux-range-picker");
    b.valueHandle = this.body.createChild({
      cls: "sch-ux-range-value",
      cn: {
        tag: "span"
      }
    });
    b.valueSpan = this.valueHandle.down("span");
    var a = new Ext.dd.DD(this.valueHandle);
    Ext.apply(a, {
      startDrag: function() {
        b.dragging = true;
        this.constrainTo(b.body)
      },
      onDrag: function() {
        b.onHandleDrag.apply(b, arguments)
      },
      endDrag: function() {
        b.onHandleEndDrag.apply(b, arguments);
        b.dragging = false
      },
      scope: this
    });
    this.setValues(this.getValues());
    this.callParent(arguments);
    this.body.on("click", this.onBodyClick, this)
  },
  onBodyClick: function(c, a) {
    var b = [c.getXY()[0] - 8 - this.body.getX(), c.getXY()[1] - 8 - this.body.getY()];
    this.valueHandle.setLeft(Ext.Number.constrain(b[0], 0, this.getAvailableWidth()));
    this.valueHandle.setTop(Ext.Number.constrain(b[1], 0, this.getAvailableHeight()));
    this.setValues(this.getValuesFromXY([this.valueHandle.getLeft(true), this.valueHandle.getTop(true)]));
    this.onSliderChangeComplete()
  },
  getAvailableWidth: function() {
    return this.body.getWidth() - 18
  },
  getAvailableHeight: function() {
    return this.body.getHeight() - 18
  },
  onHandleDrag: function() {
    this.setValues(this.getValuesFromXY([this.valueHandle.getLeft(true), this.valueHandle.getTop(true)]))
  },
  onHandleEndDrag: function() {
    this.setValues(this.getValuesFromXY([this.valueHandle.getLeft(true), this.valueHandle.getTop(true)]))
  },
  getValuesFromXY: function(d) {
    var c = d[0] / this.getAvailableWidth();
    var a = d[1] / this.getAvailableHeight();
    var e = Math.round((this.horizontalCfg.maxValue - this.horizontalCfg.minValue) * c);
    var b = Math.round((this.verticalCfg.maxValue - this.verticalCfg.minValue) * a) + this.verticalCfg.minValue;
    return [e + this.horizontalCfg.minValue, b]
  },
  getXYFromValues: function(d) {
    var b = this.horizontalCfg.maxValue - this.horizontalCfg.minValue;
    var f = this.verticalCfg.maxValue - this.verticalCfg.minValue;
    var a = Math.round((d[0] - this.horizontalCfg.minValue) * this.getAvailableWidth() / b);
    var c = d[1] - this.verticalCfg.minValue;
    var e = Math.round(c * this.getAvailableHeight() / f);
    return [a, e]
  },
  updatePosition: function() {
    var a = this.getValues();
    var b = this.getXYFromValues(a);
    this.valueHandle.setLeft(Ext.Number.constrain(b[0], 0, this.getAvailableWidth()));
    if (this.verticalCfg.disabled) {
      this.valueHandle.setTop(this.dialogConfig.rowHeight)
    } else {
      this.valueHandle.setTop(Ext.Number.constrain(b[1], 0, this.getAvailableHeight()))
    }
    this.positionValueText();
    this.setValueText(a)
  },
  positionValueText: function() {
    var a = this.valueHandle.getTop(true);
    var b = this.valueHandle.getLeft(true);
    this.valueSpan.setLeft(b > 30 ? -30 : 10);
    this.valueSpan.setTop(a > 10 ? -20 : 20)
  },
  setValueText: function(a) {
    if (this.verticalCfg.disabled) {
      a[1] = this.dialogConfig.rowHeight
    }
    this.valueSpan.update("[" + a.toString() + "]")
  },
  setValues: function(a) {
    this.horizontal.setValue(a[0]);
    if (this.verticalCfg.reverse) {
      if (!this.verticalCfg.disabled) {
        this.vertical.setValue(this.verticalCfg.maxValue + this.verticalCfg.minValue - a[1])
      }
    } else {
      if (!this.verticalCfg.disabled) {
        this.vertical.setValue(a[1])
      }
    }
    if (!this.dragging) {
      this.updatePosition()
    }
    this.positionValueText();
    this.setValueText(a)
  },
  getValues: function() {
    if (!this.verticalCfg.disabled) {
      var a = this.vertical.getValue();
      if (this.verticalCfg.reverse) {
        a = this.verticalCfg.maxValue - a + this.verticalCfg.minValue
      }
      return [this.horizontal.getValue(), a]
    }
    return [this.horizontal.getValue()]
  },
  onSliderChange: function() {
    this.fireEvent("change", this, this.getValues());
    if (!this.dragging) {
      this.updatePosition()
    }
  },
  onSliderChangeComplete: function() {
    this.fireEvent("changecomplete", this, this.getValues())
  },
  afterLayout: function() {
    this.callParent(arguments);
    this.updatePosition()
  }
});
Ext.define("Ext.ux.Scheduler.widget.ExportDialogForm", {
  extend: "Ext.form.Panel",
  requires: ["Ext.data.Store", "Ext.ProgressBar", "Ext.form.field.ComboBox", "Ext.form.field.Date", "Ext.form.FieldContainer", "Ext.form.field.Checkbox", "Ext.ux.Scheduler.widget.ResizePicker"],
  border: false,
  bodyPadding: "10 10 0 10",
  autoHeight: true,
  initComponent: function() {
    var a = this;
    if (Ext.getVersion("extjs").isLessThan("4.2.1")) {
      if (typeof Ext.tip !== "undefined" && Ext.tip.Tip && Ext.tip.Tip.prototype.minWidth != "auto") {
        Ext.tip.Tip.prototype.minWidth = "auto"
      }
    }
    a.createFields();
    Ext.apply(this, {
      fieldDefaults: {
        labelAlign: "left",
        labelWidth: 120,
        anchor: "99%"
      },
      items: [a.rangeField, a.resizerHolder, a.datesHolder, a.showHeaderField, a.exportToSingleField, a.formatField, a.orientationField, a.progressBar || a.createProgressBar()]
    });
    a.callParent(arguments);
    a.onRangeChange(null, a.dialogConfig.defaultConfig.range);
    a.on({
      hideprogressbar: a.hideProgressBar,
      showprogressbar: a.showProgressBar,
      updateprogressbar: a.updateProgressBar,
      scope: a
    })
  },
  isValid: function() {
    var a = this;
    if (a.rangeField.getValue() === "date") {
      return a.dateFromField.isValid() && a.dateToField.isValid()
    }
    return true
  },
  getValues: function(e, c, d, b) {
    var a = this.callParent(arguments);
    var f = this.resizePicker.getValues();
    if (!e) {
      a.cellSize = f
    } else {
      a += "&cellSize[0]=" + f[0] + "&cellSize[1]=" + f[1]
    }
    return a
  },
  createFields: function() {
    var d = this,
      a = d.dialogConfig,
      f = '<table class="sch-fieldcontainer-label-wrap"><td width="1" class="sch-fieldcontainer-label">',
      e = '<td><div class="sch-fieldcontainer-separator"></div></table>';
    d.rangeField = new Ext.form.field.ComboBox({
      value: a.defaultConfig.range,
      triggerAction: "all",
      cls: "sch-export-dialog-range",
      forceSelection: true,
      editable: false,
      fieldLabel: a.rangeFieldLabel,
      name: "range",
      queryMode: "local",
      displayField: "name",
      valueField: "value",
      store: new Ext.data.Store({
        fields: ["name", "value"],
        data: [{
          name: a.completeViewText,
          value: "complete"
        }, {
          name: a.dateRangeText,
          value: "date"
        }, {
          name: a.currentViewText,
          value: "current"
        }]
      }),
      listeners: {
        change: d.onRangeChange,
        scope: d
      }
    });
    d.resizePicker = new Ext.ux.Scheduler.widget.ResizePicker({
      dialogConfig: a,
      margin: "10 20"
    });
    d.resizerHolder = new Ext.form.FieldContainer({
      fieldLabel: a.scrollerDisabled ? a.adjustCols : a.adjustColsAndRows,
      labelAlign: "top",
      hidden: true,
      labelSeparator: "",
      beforeLabelTextTpl: f,
      afterLabelTextTpl: e,
      layout: "vbox",
      defaults: {
        flex: 1,
        allowBlank: false
      },
      items: [d.resizePicker]
    });
    d.dateFromField = new Ext.form.field.Date({
      fieldLabel: a.dateRangeFromText,
      baseBodyCls: "sch-exportdialogform-date",
      name: "dateFrom",
      format: a.dateRangeFormat || Ext.Date.defaultFormat,
      allowBlank: false,
      maxValue: a.endDate,
      minValue: a.startDate,
      value: a.startDate
    });
    d.dateToField = new Ext.form.field.Date({
      fieldLabel: a.dateRangeToText,
      name: "dateTo",
      format: a.dateRangeFormat || Ext.Date.defaultFormat,
      baseBodyCls: "sch-exportdialogform-date",
      allowBlank: false,
      maxValue: a.endDate,
      minValue: a.startDate,
      value: a.endDate
    });
    d.datesHolder = new Ext.form.FieldContainer({
      fieldLabel: a.specifyDateRange,
      labelAlign: "top",
      hidden: true,
      labelSeparator: "",
      beforeLabelTextTpl: f,
      afterLabelTextTpl: e,
      layout: "vbox",
      defaults: {
        flex: 1,
        allowBlank: false
      },
      items: [d.dateFromField, d.dateToField]
    });
    d.showHeaderField = new Ext.form.field.Checkbox({
      xtype: "checkboxfield",
      boxLabel: d.dialogConfig.showHeaderLabel,
      name: "showHeader",
      checked: !!a.defaultConfig.showHeaderLabel
    });
    d.exportToSingleField = new Ext.form.field.Checkbox({
      xtype: "checkboxfield",
      boxLabel: d.dialogConfig.exportToSingleLabel,
      name: "singlePageExport",
      checked: !!a.defaultConfig.singlePageExport
    });
    d.formatField = new Ext.form.field.ComboBox({
      value: a.defaultConfig.format,
      triggerAction: "all",
      forceSelection: true,
      editable: false,
      fieldLabel: a.formatFieldLabel,
      name: "format",
      queryMode: "local",
      store: ["A5", "A4", "A3", "Letter", "Legal"]
    });
    var c = a.defaultConfig.orientation === "portrait" ? 'class="sch-none"' : "",
      b = a.defaultConfig.orientation === "landscape" ? 'class="sch-none"' : "";
    d.orientationField = new Ext.form.field.ComboBox({
      value: a.defaultConfig.orientation,
      triggerAction: "all",
      baseBodyCls: "sch-exportdialogform-orientation",
      forceSelection: true,
      editable: false,
      fieldLabel: d.dialogConfig.orientationFieldLabel,
      afterSubTpl: new Ext.XTemplate('<span id="sch-exportdialog-imagePortrait" ' + b + '></span><span id="sch-exportdialog-imageLandscape" ' + c + "></span>"),
      name: "orientation",
      displayField: "name",
      valueField: "value",
      queryMode: "local",
      store: new Ext.data.Store({
        fields: ["name", "value"],
        data: [{
          name: a.orientationPortraitText,
          value: "portrait"
        }, {
          name: a.orientationLandscapeText,
          value: "landscape"
        }]
      }),
      listeners: {
        change: function(h, g) {
          switch (g) {
            case "landscape":
              Ext.fly("sch-exportdialog-imagePortrait").toggleCls("sch-none");
              Ext.fly("sch-exportdialog-imageLandscape").toggleCls("sch-none");
              break;
            case "portrait":
              Ext.fly("sch-exportdialog-imagePortrait").toggleCls("sch-none");
              Ext.fly("sch-exportdialog-imageLandscape").toggleCls("sch-none");
              break
          }
        }
      }
    })
  },
  createProgressBar: function() {
    return this.progressBar = new Ext.ProgressBar({
      text: this.config.progressBarText,
      animate: true,
      hidden: true,
      margin: "4px 0 10px 0"
    })
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
        break
    }
  },
  showProgressBar: function() {
    if (this.progressBar) {
      this.progressBar.show()
    }
  },
  hideProgressBar: function() {
    if (this.progressBar) {
      this.progressBar.hide()
    }
  },
  updateProgressBar: function(a) {
    if (this.progressBar) {
      this.progressBar.updateProgress(a)
    }
  }
});
Ext.define("Ext.ux.Scheduler.widget.ExportDialog", {
  alternateClassName: "Ext.ux.Scheduler.widget.PdfExportDialog",
  extend: "Ext.window.Window",
  requires: ["Ext.ux.Scheduler.widget.ExportDialogForm"],
  mixins: ["Ext.ux.Scheduler.mixin.Localizable"],
  alias: "widget.exportdialog",
  modal: false,
  width: 350,
  cls: "sch-exportdialog",
  frame: false,
  layout: "fit",
  draggable: true,
  padding: 0,
  plugin: null,
  buttonsPanel: null,
  buttonsPanelScope: null,
  progressBar: null,
  dateRangeFormat: "",
  constructor: function(a) {
    Ext.apply(this, a.exportDialogConfig);
    Ext.Array.forEach(["generalError", "title", "formatFieldLabel", "orientationFieldLabel", "rangeFieldLabel", "showHeaderLabel", "orientationPortraitText", "orientationLandscapeText", "completeViewText", "currentViewText", "dateRangeText", "dateRangeFromText", "pickerText", "dateRangeToText", "exportButtonText", "cancelButtonText", "progressBarText", "exportToSingleLabel"], function(b) {
      if (b in a) {
        this[b] = a[b]
      }
    }, this);
    this.title = this.L("title");
    this.config = Ext.apply({
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
      exportToSingleLabel: this.L("exportToSingleLabel"),
      orientationPortraitText: this.L("orientationPortraitText"),
      orientationLandscapeText: this.L("orientationLandscapeText"),
      completeViewText: this.L("completeViewText"),
      adjustCols: this.L("adjustCols"),
      adjustColsAndRows: this.L("adjustColsAndRows"),
      specifyDateRange: this.L("specifyDateRange"),
      dateRangeFormat: this.dateRangeFormat,
      defaultConfig: this.defaultConfig
    }, a.exportDialogConfig);
    this.callParent(arguments)
  },
  initComponent: function() {
    var b = this,
      a = {
        hidedialogwindow: b.destroy,
        showdialogerror: b.showError,
        updateprogressbar: function(c) {
          b.fireEvent("updateprogressbar", c)
        },
        scope: this
      };
    b.form = b.buildForm(b.config);
    Ext.apply(this, {
      items: b.form,
      fbar: b.buildButtons(b.buttonsPanelScope || b)
    });
    b.callParent(arguments);
    b.plugin.on(a)
  },
  afterRender: function() {
    var a = this;
    a.relayEvents(a.form.resizePicker, ["change", "changecomplete", "select"]);
    a.form.relayEvents(a, ["updateprogressbar", "hideprogressbar", "showprogressbar"]);
    a.callParent(arguments)
  },
  buildButtons: function(a) {
    return [{
      xtype: "button",
      scale: "medium",
      text: this.L("exportButtonText"),
      handler: function() {
        if (this.form.isValid()) {
          this.fireEvent("showprogressbar");
          this.plugin.doExport(this.form.getValues())
        }
      },
      scope: a
    }, {
      xtype: "button",
      scale: "medium",
      text: this.L("cancelButtonText"),
      handler: function() {
        this.destroy()
      },
      scope: a
    }]
  },
  buildForm: function(a) {
    return new Ext.ux.Scheduler.widget.ExportDialogForm({
      progressBar: this.progressBar,
      dialogConfig: a
    })
  },
  showError: function(b, a) {
    var c = b,
      d = a || c.L("generalError");
    c.fireEvent("hideprogressbar");
    Ext.Msg.alert("", d)
  }
});
Ext.define("Ext.ux.Scheduler.feature.ColumnLines", {
  extend: "Ext.ux.Scheduler.plugin.Lines",
  requires: ["Ext.data.JsonStore"],
  cls: "sch-column-line",
  showTip: false,
  timeAxisViewModel: null,
  renderingDoneEvent: "columnlinessynced",
  init: function(a) {
    this.timeAxis = a.getTimeAxis();
    this.timeAxisViewModel = a.timeAxisViewModel;
    this.panel = a;
    this.store = new Ext.data.JsonStore({
      fields: ["Date"]
    });
    this.store.loadData = this.store.loadData || this.store.setData;
    this.callParent(arguments);
    a.on({
      orientationchange: this.populate,
      destroy: this.onHostDestroy,
      scope: this
    });
    this.timeAxisViewModel.on("update", this.populate, this);
    this.populate()
  },
  onHostDestroy: function() {
    this.timeAxisViewModel.un("update", this.populate, this)
  },
  populate: function() {
    this.store.loadData(this.getData())
  },
  getElementData: function() {
    var a = this.schedulerView;
    if (a.isHorizontal() && a.store.getCount() > 0) {
      return this.callParent(arguments)
    }
    return []
  },
  getData: function() {
    var b = this.panel,
      g = [];
    if (b.isHorizontal()) {
      var h = this.timeAxisViewModel;
      var e = h.columnLinesFor;
      var f = !!(h.headerConfig && h.headerConfig[e].cellGenerator);
      if (f) {
        var c = h.getColumnConfig()[e];
        for (var d = 1, a = c.length; d < a; d++) {
          g.push({
            Date: c[d].start
          })
        }
      } else {
        h.forEachInterval(e, function(l, j, k) {
          if (k > 0) {
            g.push({
              Date: l
            })
          }
        })
      }
    }
    return g
  }
});
Ext.define("Ext.ux.Scheduler.mixin.AbstractTimelineView", {
  requires: ["Ext.ux.Scheduler.data.TimeAxis", "Ext.ux.Scheduler.view.Horizontal"],
  selectedEventCls: "sch-event-selected",
  readOnly: false,
  horizontalViewClass: "Ext.ux.Scheduler.view.Horizontal",
  timeCellCls: "sch-timetd",
  timeCellSelector: ".sch-timetd",
  eventBorderWidth: 1,
  timeAxis: null,
  timeAxisViewModel: null,
  eventPrefix: null,
  rowHeight: null,
  orientation: "horizontal",
  horizontal: null,
  vertical: null,
  secondaryCanvasEl: null,
  panel: null,
  displayDateFormat: null,
  el: null,
  _initializeTimelineView: function() {
    if (this.horizontalViewClass) {
      this.horizontal = Ext.create(this.horizontalViewClass, {
        view: this
      })
    }
    if (this.verticalViewClass) {
      this.vertical = Ext.create(this.verticalViewClass, {
        view: this
      })
    }
    this.eventPrefix = (this.eventPrefix || this.getId()) + "-"
  },
  getTimeAxisViewModel: function() {
    return this.timeAxisViewModel
  },
  getFormattedDate: function(a) {
    return Ext.Date.format(a, this.getDisplayDateFormat())
  },
  getFormattedEndDate: function(c, a) {
    var b = this.getDisplayDateFormat();
    if (c.getHours() === 0 && c.getMinutes() === 0 && !(c.getYear() === a.getYear() && c.getMonth() === a.getMonth() && c.getDate() === a.getDate()) && !Ext.ux.Scheduler.util.Date.hourInfoRe.test(b.replace(Ext.ux.Scheduler.util.Date.stripEscapeRe, ""))) {
      c = Ext.ux.Scheduler.util.Date.add(c, Ext.ux.Scheduler.util.Date.DAY, -1)
    }
    return Ext.Date.format(c, b)
  },
  getDisplayDateFormat: function() {
    return this.displayDateFormat
  },
  setDisplayDateFormat: function(a) {
    this.displayDateFormat = a
  },
  fitColumns: function(b) {
    if (this.orientation === "horizontal") {
      this.getTimeAxisViewModel().fitToAvailableWidth(b)
    } else {
      var a = Math.floor((this.panel.getWidth() - Ext.getScrollbarSize().width - 1) / this.headerCt.getColumnCount());
      this.setColumnWidth(a, b)
    }
  },
  getElementFromEventRecord: function(a) {
    return Ext.get(this.eventPrefix + a.internalId)
  },
  getEventNodeByRecord: function(a) {
    return document.getElementById(this.eventPrefix + a.internalId)
  },
  getEventNodesByRecord: function(a) {
    return this.el.select("[id=" + this.eventPrefix + a.internalId + "]")
  },
  getStartEndDatesFromRegion: function(c, b, a) {
    return this[this.orientation].getStartEndDatesFromRegion(c, b, a)
  },
  getTimeResolution: function() {
    return this.timeAxis.getResolution()
  },
  setTimeResolution: function(b, a) {
    this.timeAxis.setResolution(b, a);
    if (this.getTimeAxisViewModel().snapToIncrement) {
      this.refreshKeepingScroll()
    }
  },
  getEventIdFromDomNodeId: function(a) {
    return a.substring(this.eventPrefix.length)
  },
  getDateFromDomEvent: function(b, a) {
    return this.getDateFromXY(b.getXY(), a)
  },
  getSnapPixelAmount: function() {
    return this.getTimeAxisViewModel().getSnapPixelAmount()
  },
  getTimeColumnWidth: function() {
    return this.getTimeAxisViewModel().getTickWidth()
  },
  setSnapEnabled: function(a) {
    this.getTimeAxisViewModel().setSnapToIncrement(a)
  },
  setReadOnly: function(a) {
    this.readOnly = a;
    this[a ? "addCls" : "removeCls"](this._cmpCls + "-readonly")
  },
  isReadOnly: function() {
    return this.readOnly
  },
  setOrientation: function(a) {
    this.orientation = a;
    this.timeAxisViewModel.orientation = a
  },
  getOrientation: function() {
    return this.orientation
  },
  isHorizontal: function() {
    return this.getOrientation() === "horizontal"
  },
  isVertical: function() {
    return !this.isHorizontal()
  },
  getDateFromXY: function(c, b, a) {
    return this.getDateFromCoordinate(this.orientation === "horizontal" ? c[0] : c[1], b, a)
  },
  getDateFromCoordinate: function(c, b, a) {
    if (!a) {
      c = this[this.orientation].translateToScheduleCoordinate(c)
    }
    return this.timeAxisViewModel.getDateFromPosition(c, b)
  },
  getDateFromX: function(a, b) {
    return this.getDateFromCoordinate(a, b)
  },
  getDateFromY: function(b, a) {
    return this.getDateFromCoordinate(b, a)
  },
  getCoordinateFromDate: function(a, b) {
    var c = this.timeAxisViewModel.getPositionFromDate(a);
    if (b === false) {
      c = this[this.orientation].translateToPageCoordinate(c)
    }
    return Math.round(c)
  },
  getXFromDate: function(a, b) {
    return this.getCoordinateFromDate(a, b)
  },
  getYFromDate: function(a, b) {
    return this.getCoordinateFromDate(a, b)
  },
  getTimeSpanDistance: function(a, b) {
    return this.timeAxisViewModel.getDistanceBetweenDates(a, b)
  },
  getTimeSpanRegion: function(a, b) {
    return this[this.orientation].getTimeSpanRegion(a, b)
  },
  getScheduleRegion: function(b, a) {
    return this[this.orientation].getScheduleRegion(b, a)
  },
  getTableRegion: function() {
    throw "Abstract method call"
  },
  getRowNode: function(a) {
    throw "Abstract method call"
  },
  getRecordForRowNode: function(a) {
    throw "Abstract method call"
  },
  getVisibleDateRange: function() {
    return this[this.orientation].getVisibleDateRange()
  },
  setColumnWidth: function(b, a) {
    this[this.orientation].setColumnWidth(b, a)
  },
  findRowByChild: function(a) {
    throw "Abstract method call"
  },
  setBarMargin: function(b, a) {
    this.barMargin = b;
    if (!a) {
      this.refreshKeepingScroll()
    }
  },
  getRowHeight: function() {
    return this.timeAxisViewModel.getViewRowHeight()
  },
  setRowHeight: function(a, b) {
    this.timeAxisViewModel.setViewRowHeight(a, b)
  },
  refreshKeepingScroll: function() {
    throw "Abstract method call"
  },
  scrollVerticallyTo: function(b, a) {
    throw "Abstract method call"
  },
  scrollHorizontallyTo: function(a, b) {
    throw "Abstract method call"
  },
  getVerticalScroll: function() {
    throw "Abstract method call"
  },
  getHorizontalScroll: function() {
    throw "Abstract method call"
  },
  getEl: Ext.emptyFn,
  getSecondaryCanvasEl: function() {
    if (!this.rendered) {
      throw "Calling this method too early"
    }
    if (!this.secondaryCanvasEl) {
      this.secondaryCanvasEl = this.getEl().createChild({
        cls: "sch-secondary-canvas"
      })
    }
    return this.secondaryCanvasEl
  },
  getScroll: function() {
    throw "Abstract method call"
  },
  getOuterEl: function() {
    return this.getEl()
  },
  getRowContainerEl: function() {
    return this.getEl()
  },
  getScheduleCell: function(b, a) {
    return this.getCellByPosition({
      row: b,
      column: a
    })
  },
  getScrollEventSource: function() {
    return this.getEl()
  },
  getViewportHeight: function() {
    return this.getEl().getHeight()
  },
  getViewportWidth: function() {
    return this.getEl().getWidth()
  },
  getDateConstraints: Ext.emptyFn
});
Ext.apply(Ext.ux.Scheduler, {});
Ext.define("Ext.ux.Scheduler.mixin.TimelineView", {
  extend: "Ext.ux.Scheduler.mixin.AbstractTimelineView",
  requires: ["Ext.tip.ToolTip"],
  overScheduledEventClass: "sch-event-hover",
  ScheduleEventMap: {
    click: "Click",
    mousedown: "MouseDown",
    mouseup: "MouseUp",
    dblclick: "DblClick",
    contextmenu: "ContextMenu",
    keydown: "KeyDown",
    keyup: "KeyUp"
  },
  preventOverCls: false,
  _initializeTimelineView: function() {
    this.callParent(arguments);
    this.on("destroy", this._onDestroy, this);
    this.on("afterrender", this._onAfterRender, this);
    this.setOrientation(this.orientation);
    this.enableBubble("columnwidthchange");
    this.addCls("sch-timelineview");
    if (this.readOnly) {
      this.addCls(this._cmpCls + "-readonly")
    }
    this.addCls(this._cmpCls);
    if (this.eventAnimations) {
      this.addCls("sch-animations-enabled")
    }
  },
  inheritables: function() {
    return {
      processUIEvent: function(d) {
        var a = d.getTarget(this.eventSelector),
          c = this.ScheduleEventMap,
          b = d.type,
          f = false;
        if (a && b in c) {
          this.fireEvent(this.scheduledEventName + b, this, this.resolveEventRecord(a), d);
          f = !(this.getSelectionModel() instanceof Ext.selection.RowModel)
        }
        if (!f) {
          return this.callParent(arguments)
        }
      }
    }
  },
  _onDestroy: function() {
    if (this.tip) {
      this.tip.destroy()
    }
  },
  _onAfterRender: function() {
    if (this.overScheduledEventClass) {
      this.setMouseOverEnabled(true)
    }
    if (this.tooltipTpl) {
      this.el.on("mousemove", this.setupTooltip, this, {
        single: true
      })
    }
    var c = this.bufferedRenderer;
    if (c) {
      this.patchBufferedRenderingPlugin(c);
      this.patchBufferedRenderingPlugin(this.lockingPartner.bufferedRenderer)
    }
    this.on("bufferedrefresh", this.onBufferedRefresh, this, {
      buffer: 10
    });
    this.setupTimeCellEvents();
    var b = this.getSecondaryCanvasEl();
    if (b.getStyle("position").toLowerCase() !== "absolute") {
      var a = Ext.Msg || window;
      a.alert("ERROR: The CSS file for the Bryntum component has not been loaded.")
    }
  },
  patchBufferedRenderingPlugin: function(c) {
    var b = this;
    var a = c.setBodyTop;
    c.setBodyTop = function(d, e) {
      if (d < 0) {
        d = 0
      }
      var f = a.apply(this, arguments);
      b.fireEvent("bufferedrefresh", this);
      return f
    }
  },
  onBufferedRefresh: function() {
    this.getSecondaryCanvasEl().dom.style.top = this.body.dom.style.top
  },
  setMouseOverEnabled: function(a) {
    this[a ? "mon" : "mun"](this.el, {
      mouseover: this.onEventMouseOver,
      mouseout: this.onEventMouseOut,
      delegate: this.eventSelector,
      scope: this
    })
  },
  onEventMouseOver: function(c, a) {
    if (a !== this.lastItem && !this.preventOverCls) {
      this.lastItem = a;
      Ext.fly(a).addCls(this.overScheduledEventClass);
      var b = this.resolveEventRecord(a);
      if (b) {
        this.fireEvent("eventmouseenter", this, b, c)
      }
    }
  },
  onEventMouseOut: function(b, a) {
    if (this.lastItem) {
      if (!b.within(this.lastItem, true, true)) {
        Ext.fly(this.lastItem).removeCls(this.overScheduledEventClass);
        this.fireEvent("eventmouseleave", this, this.resolveEventRecord(this.lastItem), b);
        delete this.lastItem
      }
    }
  },
  highlightItem: function(b) {
    if (b) {
      var a = this;
      a.clearHighlight();
      a.highlightedItem = b;
      Ext.fly(b).addCls(a.overItemCls)
    }
  },
  setupTooltip: function() {
    var b = this,
      a = Ext.apply({
        renderTo: Ext.getBody(),
        delegate: b.eventSelector,
        target: b.el,
        anchor: "b",
        rtl: b.rtl,
        show: function() {
          Ext.ToolTip.prototype.show.apply(this, arguments);
          if (this.triggerElement && b.getOrientation() === "horizontal") {
            this.setX(this.targetXY[0] - 10);
            this.setY(Ext.fly(this.triggerElement).getY() - this.getHeight() - 10)
          }
        }
      }, b.tipCfg);
    b.tip = new Ext.ToolTip(a);
    b.tip.on({
      beforeshow: function(d) {
        if (!d.triggerElement || !d.triggerElement.id) {
          return false
        }
        var c = this.resolveEventRecord(d.triggerElement);
        if (!c || this.fireEvent("beforetooltipshow", this, c) === false) {
          return false
        }
        d.update(this.tooltipTpl.apply(this.getDataForTooltipTpl(c)))
      },
      scope: this
    })
  },
  getTimeAxisColumn: function() {
    if (!this.timeAxisColumn) {
      this.timeAxisColumn = this.headerCt.down("timeaxiscolumn")
    }
    return this.timeAxisColumn
  },
  getDataForTooltipTpl: function(a) {
    return Ext.apply({
      _record: a
    }, a.data)
  },
  refreshKeepingScroll: function() {
    Ext.suspendLayouts();
    this.saveScrollState();
    this.refresh();
    if (this.up("tablepanel[lockable=true]").lockedGridDependsOnSchedule) {
      this.lockingPartner.refresh()
    }
    Ext.resumeLayouts(true);
    if (this.scrollState.left !== 0 || this.scrollState.top !== 0 || this.infiniteScroll) {
      this.restoreScrollState()
    }
  },
  setupTimeCellEvents: function() {
    this.mon(this.el, {
      click: this.handleScheduleEvent,
      dblclick: this.handleScheduleEvent,
      contextmenu: this.handleScheduleEvent,
      scope: this
    })
  },
  getTableRegion: function() {
    var a = this.el.down("." + Ext.baseCSSPrefix + (Ext.versions.extjs.isLessThan("5.0") ? "grid-table" : "grid-item-container"));
    return (a || this.el).getRegion()
  },
  getRowNode: function(a) {
    return this.getNodeByRecord(a)
  },
  findRowByChild: function(a) {
    return this.findItemByChild(a)
  },
  getRecordForRowNode: function(a) {
    return this.getRecord(a)
  },
  refreshKeepingResourceScroll: function() {
    var a = this.getScroll();
    this.refresh();
    if (this.getOrientation() === "horizontal") {
      this.scrollVerticallyTo(a.top)
    } else {
      this.scrollHorizontallyTo(a.left)
    }
  },
  scrollHorizontallyTo: function(a, b) {
    var c = this.getEl();
    if (c) {
      c.scrollTo("left", Math.max(0, a), b)
    }
  },
  scrollVerticallyTo: function(c, a) {
    var b = this.getEl();
    if (b) {
      b.scrollTo("top", Math.max(0, c), a)
    }
  },
  getVerticalScroll: function() {
    var a = this.getEl();
    return a.getScroll().top
  },
  getHorizontalScroll: function() {
    var a = this.getEl();
    return a.getScroll().left
  },
  getScroll: function() {
    var a = this.getEl().getScroll();
    return {
      top: a.top,
      left: a.left
    }
  },
  getXYFromDate: function() {
    var a = this.getCoordinateFromDate.apply(this, arguments);
    return this.orientation === "horizontal" ? [a, 0] : [0, a]
  },
  handleScheduleEvent: function(a) {},
  scrollElementIntoView: function(b, k, p, f, e) {
    var a = 20,
      o = b.dom,
      h = b.getOffsetsTo(k = Ext.getDom(k) || Ext.getBody().dom),
      d = h[0] + k.scrollLeft,
      l = h[1] + k.scrollTop,
      i = l + o.offsetHeight,
      q = d + o.offsetWidth,
      m = k.clientHeight,
      g = parseInt(k.scrollTop, 10),
      r = parseInt(k.scrollLeft, 10),
      n = g + m,
      j = r + k.clientWidth,
      c;
    if (e) {
      if (f) {
        f = Ext.apply({
          listeners: {
            afteranimate: function() {
              Ext.fly(o).highlight()
            }
          }
        }, f)
      } else {
        Ext.fly(o).highlight()
      }
    }
    if (o.offsetHeight > m || l < g) {
      c = l - a
    } else {
      if (i > n) {
        c = i - m + a
      }
    }
    if (c != null) {
      Ext.fly(k).scrollTo("top", c, f)
    }
    if (p !== false) {
      c = null;
      if (o.offsetWidth > k.clientWidth || d < r) {
        c = d - a
      } else {
        if (q > j) {
          c = q - k.clientWidth + a
        }
      }
      if (c != null) {
        Ext.fly(k).scrollTo("left", c, f)
      }
    }
    return b
  }
});
Ext.define("Ext.ux.Scheduler.view.TimelineGridView", {
  extend: "Ext.grid.View",
  mixins: ["Ext.ux.Scheduler.mixin.TimelineView"],
  infiniteScroll: false,
  bufferCoef: 5,
  bufferThreshold: 0.2,
  cachedScrollLeftDate: null,
  boxIsReady: false,
  ignoreNextHorizontalScroll: false,
  constructor: function(a) {
    this.callParent(arguments);
    if (this.infiniteScroll) {
      this.on("afterrender", this.setupInfiniteScroll, this, {
        single: true
      })
    }
  },
  setupInfiniteScroll: function() {
    var b = this.panel.ownerCt;
    this.cachedScrollLeftDate = b.startDate || this.timeAxis.getStart();
    var a = this;
    b.calculateOptimalDateRange = function(d, c, g, e) {
      if (e) {
        return e
      }
      var f = Ext.ux.Scheduler.preset.Manager.getPreset(g.preset);
      return a.calculateInfiniteScrollingDateRange(d, f.getBottomHeader().unit, g.increment, g.width)
    };
    this.el.on("scroll", this.onHorizontalScroll, this);
    this.on("resize", this.onSelfResize, this)
  },
  onHorizontalScroll: function() {
    if (this.ignoreNextHorizontalScroll || this.cachedScrollLeftDate) {
      this.ignoreNextHorizontalScroll = false;
      return
    }
    var c = this.el.dom,
      b = this.getWidth(),
      a = b * this.bufferThreshold * this.bufferCoef;
    if ((c.scrollWidth - c.scrollLeft - b < a) || c.scrollLeft < a) {
      this.shiftToDate(this.getDateFromCoordinate(c.scrollLeft, null, true));
      this.el.stopAnimation()
    }
  },
  refresh: function() {
    this.callParent(arguments);
    if (this.infiniteScroll && !this.scrollStateSaved && this.boxIsReady) {
      this.restoreScrollLeftDate()
    }
  },
  onSelfResize: function(c, d, a, b, e) {
    this.boxIsReady = true;
    if (d != b) {
      this.shiftToDate(this.cachedScrollLeftDate || this.timeAxis.getStart(), this.cachedScrollCentered)
    }
  },
  restoreScrollLeftDate: function() {
    if (this.cachedScrollLeftDate && this.boxIsReady) {
      this.ignoreNextHorizontalScroll = true;
      this.scrollToDate(this.cachedScrollLeftDate);
      this.cachedScrollLeftDate = null
    }
  },
  scrollToDate: function(a) {
    this.cachedScrollLeftDate = a;
    if (this.cachedScrollCentered) {
      this.panel.ownerCt.scrollToDateCentered(a)
    } else {
      this.panel.ownerCt.scrollToDate(a)
    }
    var b = this.el.dom.scrollLeft;
    this.panel.scrollLeftPos = b;
    this.headerCt.el.dom.scrollLeft = b
  },
  saveScrollState: function() {
    this.scrollStateSaved = this.boxIsReady;
    this.callParent(arguments)
  },
  restoreScrollState: function() {
    this.scrollStateSaved = false;
    if (this.infiniteScroll && this.cachedScrollLeftDate) {
      this.restoreScrollLeftDate();
      this.el.dom.scrollTop = this.scrollState.top;
      return
    }
    this.callParent(arguments)
  },
  calculateInfiniteScrollingDateRange: function(e, f, b, a) {
    var g = this.timeAxis;
    var d = this.getWidth();
    a = a || this.timeAxisViewModel.getTickWidth();
    b = b || g.increment || 1;
    f = f || g.unit;
    var h = Ext.ux.Scheduler.util.Date;
    var c = Math.ceil(d * this.bufferCoef / a);
    return {
      start: g.floorDate(h.add(e, f, -c * b), false, f, b),
      end: g.ceilDate(h.add(e, f, Math.ceil((d / a + c) * b)), false, f, b)
    }
  },
  shiftToDate: function(b, c) {
    var a = this.calculateInfiniteScrollingDateRange(b);
    this.cachedScrollLeftDate = b;
    this.cachedScrollCentered = c;
    this.timeAxis.setTimeSpan(a.start, a.end)
  },
  destroy: function() {
    if (this.infiniteScroll && this.rendered) {
      this.el.un("scroll", this.onHorizontalScroll, this)
    }
    this.callParent(arguments)
  }
}, function() {
  this.override(Ext.ux.Scheduler.mixin.TimelineView.prototype.inheritables() || {})
});
Ext.define("Ext.ux.Scheduler.mixin.AbstractSchedulerView", {
  requires: ["Ext.ux.Scheduler.eventlayout.Horizontal", "Ext.ux.Scheduler.view.Vertical", "Ext.ux.Scheduler.eventlayout.Vertical"],
  _cmpCls: "sch-schedulerview",
  scheduledEventName: "event",
  barMargin: 1,
  constrainDragToResource: false,
  allowOverlap: null,
  readOnly: null,
  altColCls: "sch-col-alt",
  dynamicRowHeight: true,
  managedEventSizing: true,
  eventAnimations: true,
  horizontalLayoutCls: "Ext.ux.Scheduler.eventlayout.Horizontal",
  verticalLayoutCls: "Ext.ux.Scheduler.eventlayout.Vertical",
  eventCls: "sch-event",
  verticalViewClass: "Ext.ux.Scheduler.view.Vertical",
  eventTpl: ['<tpl for=".">', '<div unselectable="on" id="{{evt-prefix}}{id}" style="right:{right}px;left:{left}px;top:{top}px;height:{height}px;width:{width}px;{style}" class="sch-event ' + Ext.baseCSSPrefix + 'unselectable {internalCls} {cls}">', '<div unselectable="on" class="sch-event-inner {iconCls}">', "{body}", "</div>", "</div>", "</tpl>"],
  eventStore: null,
  resourceStore: null,
  eventLayout: null,
  _initializeSchedulerView: function() {
    var a = Ext.ClassManager.get(this.horizontalLayoutCls);
    var b = Ext.ClassManager.get(this.verticalLayoutCls);
    this.eventSelector = "." + this.eventCls;
    this.eventLayout = {};
    if (a) {
      this.eventLayout.horizontal = new a({
        view: this,
        timeAxisViewModel: this.timeAxisViewModel
      })
    }
    if (b) {
      this.eventLayout.vertical = new b({
        view: this,
        timeAxisViewModel: this.timeAxisViewModel
      })
    }
    this.store = this.store || this.resourceStore;
    this.resourceStore = this.resourceStore || this.store
  },
  generateTplData: function(d, c, g) {
    var f = this[this.orientation].getEventRenderData(d),
      h = d.getStartDate(),
      b = d.getEndDate(),
      a = d.getCls() || "";
    a += " sch-event-resizable-" + d.getResizable();
    if (d.dirty) {
      a += " sch-dirty "
    }
    if (f.endsOutsideView) {
      a += " sch-event-endsoutside "
    }
    if (f.startsOutsideView) {
      a += " sch-event-startsoutside "
    }
    if (this.eventBarIconClsField) {
      a += " sch-event-withicon "
    }
    if (d.isDraggable() === false) {
      a += " sch-event-fixed "
    }
    if (b - h === 0) {
      a += " sch-event-milestone "
    }
    f.id = d.internalId;
    f.internalCls = a;
    f.start = h;
    f.end = b;
    f.iconCls = d.data[this.eventBarIconClsField] || "";
    if (this.eventRenderer) {
      var e = this.eventRenderer.call(this.eventRendererScope || this, d, c, f, g);
      if (Ext.isObject(e) && this.eventBodyTemplate) {
        f.body = this.eventBodyTemplate.apply(e)
      } else {
        f.body = e
      }
    } else {
      if (this.eventBodyTemplate) {
        f.body = this.eventBodyTemplate.apply(d.data)
      } else {
        if (this.eventBarTextField) {
          f.body = d.data[this.eventBarTextField] || ""
        }
      }
    }
    return f
  },
  resolveResource: function(a) {
    return this[this.orientation].resolveResource(a)
  },
  getResourceRegion: function(b, a, c) {
    return this[this.orientation].getResourceRegion(b, a, c)
  },
  resolveEventRecord: function(a) {
    a = a.dom ? a.dom : a;
    if (!(Ext.fly(a).hasCls(this.eventCls))) {
      a = Ext.fly(a).up(this.eventSelector)
    }
    return this.getEventRecordFromDomId(a.id)
  },
  getResourceByEventRecord: function(a) {
    return a.getResource()
  },
  getEventRecordFromDomId: function(b) {
    var a = this.getEventIdFromDomNodeId(b);
    return this.eventStore.getByInternalId(a)
  },
  isDateRangeAvailable: function(d, a, b, c) {
    return this.eventStore.isDateRangeAvailable(d, a, b, c)
  },
  getEventsInView: function() {
    var b = this.timeAxis.getStart(),
      a = this.timeAxis.getEnd();
    return this.eventStore.getEventsInTimeSpan(b, a)
  },
  getEventNodes: function() {
    return this.getEl().select(this.eventSelector)
  },
  onEventCreated: function(a) {},
  getEventStore: function() {
    return this.eventStore
  },
  registerEventEditor: function(a) {
    this.eventEditor = a
  },
  getEventEditor: function() {
    return this.eventEditor
  },
  onEventUpdate: function(b, c, a) {
    this[this.orientation].onEventUpdate(b, c, a)
  },
  onEventAdd: function(a, b) {
    this[this.orientation].onEventAdd(a, b)
  },
  onEventRemove: function(a, b) {
    this[this.orientation].onEventRemove(a, b)
  },
  bindEventStore: function(c, b) {
    var d = this;
    var a = {
      scope: d,
      refresh: d.onEventDataRefresh,
      addrecords: d.onEventAdd,
      updaterecord: d.onEventUpdate,
      removerecords: d.onEventRemove,
      add: d.onEventAdd,
      update: d.onEventUpdate,
      remove: d.onEventRemove
    };
    if (!Ext.versions.touch) {
      a.clear = d.onEventDataRefresh
    }
    if (!b && d.eventStore) {
      d.eventStore.setResourceStore(null);
      if (c !== d.eventStore && d.eventStore.autoDestroy) {
        d.eventStore.destroy()
      } else {
        if (d.mun) {
          d.mun(d.eventStore, a)
        } else {
          d.eventStore.un(a)
        }
      }
      if (!c) {
        if (d.loadMask && d.loadMask.bindStore) {
          d.loadMask.bindStore(null)
        }
        d.eventStore = null
      }
    }
    if (c) {
      c = Ext.data.StoreManager.lookup(c);
      if (d.mon) {
        d.mon(c, a)
      } else {
        c.on(a)
      }
      if (d.loadMask && d.loadMask.bindStore) {
        d.loadMask.bindStore(c)
      }
      d.eventStore = c;
      c.setResourceStore(d.resourceStore)
    }
    if (c && !b) {
      d.refresh()
    }
  },
  onEventDataRefresh: function() {
    this.refreshKeepingScroll()
  },
  onEventSelect: function(a) {
    var b = this.getEventNodesByRecord(a);
    if (b) {
      b.addCls(this.selectedEventCls)
    }
  },
  onEventDeselect: function(a) {
    var b = this.getEventNodesByRecord(a);
    if (b) {
      b.removeCls(this.selectedEventCls)
    }
  },
  refresh: function() {
    throw "Abstract method call"
  },
  repaintEventsForResource: function(a) {
    throw "Abstract method call"
  },
  repaintAllEvents: function() {
    this.refreshKeepingScroll()
  },
  scrollEventIntoView: function(j, e, a, n, o) {
    o = o || this;
    var k = this;
    var l = function(p) {
      if (Ext.versions.extjs) {
        k.up("panel").scrollTask.cancel();
        k.scrollElementIntoView(p, k.el, true, a)
      } else {
        p.scrollIntoView(k.el, true, a)
      }
      if (e) {
        if (typeof e === "boolean") {
          p.highlight()
        } else {
          p.highlight(null, e)
        }
      }
      n && n.call(o)
    };
    if (Ext.data.TreeStore && this.resourceStore instanceof Ext.data.TreeStore) {
      var d = j.getResources(k.eventStore);
      if (d.length > 0 && !d[0].isVisible()) {
        d[0].bubble(function(p) {
          p.expand()
        })
      }
    }
    var i = this.timeAxis;
    var c = j.getStartDate();
    var h = j.getEndDate();
    if (!i.dateInAxis(c) || !i.dateInAxis(h)) {
      var g = i.getEnd() - i.getStart();
      i.setTimeSpan(new Date(c.getTime() - g / 2), new Date(h.getTime() + g / 2))
    }
    var b = this.getElementFromEventRecord(j);
    if (b) {
      l(b)
    } else {
      if (this.bufferedRenderer) {
        var m = this.resourceStore;
        var f = j.getResource(null, k.eventStore);
        Ext.Function.defer(function() {
          var p = m.getIndexInTotalDataset ? m.getIndexInTotalDataset(f) : m.indexOf(f);
          this.bufferedRenderer.scrollTo(p, false, function() {
            var q = k.getElementFromEventRecord(j);
            if (q) {
              l(q)
            }
          })
        }, 10, this)
      }
    }
  }
});
Ext.define("Ext.ux.Scheduler.mixin.SchedulerView", {
  extend: "Ext.ux.Scheduler.mixin.AbstractSchedulerView",
  requires: ["Ext.ux.Scheduler.tooltip.Tooltip", "Ext.ux.Scheduler.feature.DragCreator", "Ext.ux.Scheduler.feature.DragDrop", "Ext.ux.Scheduler.feature.ResizeZone", "Ext.ux.Scheduler.column.Resource", "Ext.XTemplate"],
  eventResizeHandles: "end",
  dndValidatorFn: Ext.emptyFn,
  resizeValidatorFn: Ext.emptyFn,
  createValidatorFn: Ext.emptyFn,
  _initializeSchedulerView: function() {
    this.callParent(arguments);
    this.on("destroy", this._destroy, this);
    this.on("afterrender", this._afterRender, this);
    this.trackOver = false;
    var c = this;
    if (!this.eventPrefix) {
      throw "eventPrefix missing"
    }
    if (Ext.isArray(c.eventTpl)) {
      var d = Ext.Array.clone(c.eventTpl),
        b = '<div class="sch-resizable-handle sch-resizable-handle-{0}"></div>';
      var a = this.eventResizeHandles;
      if (a === "start" || a === "both") {
        d.splice(2, 0, Ext.String.format(b, "start"))
      }
      if (a === "end" || a === "both") {
        d.splice(2, 0, Ext.String.format(b, "end"))
      }
      c.eventTpl = new Ext.XTemplate(d.join("").replace("{{evt-prefix}}", this.eventPrefix))
    }
  },
  inheritables: function() {
    return {
      loadingText: "Loading events...",
      overItemCls: "",
      setReadOnly: function(a) {
        if (this.dragCreator) {
          this.dragCreator.setDisabled(a)
        }
        this.callParent(arguments)
      },
      repaintEventsForResource: function(e, d) {
        var b = this.orientation === "horizontal" ? this.store.indexOf(e) : 0;
        if (this.orientation === "horizontal") {
          this.eventLayout.horizontal.clearCache(e)
        }
        if (b >= 0) {
          this.refreshNode(b);
          this.lockingPartner.refreshNode(b);
          if (d) {
            var a = this.getSelectionModel();
            var c = e.getEvents();
            Ext.each(c, function(f) {
              if (a.isSelected(f)) {
                this.onEventSelect(f, true)
              }
            }, this)
          }
        }
      },
      repaintAllEvents: function() {
        if (this.orientation === "horizontal") {
          this.refresh()
        } else {
          this.refreshNode(0)
        }
      },
      handleScheduleEvent: function(f) {
        var i = f.getTarget("." + this.timeCellCls, 2);
        if (i) {
          var j = this.getDateFromDomEvent(f, "floor");
          var g = this.findRowByChild(i);
          var d = this.indexOf(g);
          var a;
          if (this.orientation == "horizontal") {
            a = this.getRecordForRowNode(g)
          } else {
            var b = f.getTarget(this.timeCellSelector, 5);
            if (b) {
              var h = typeof b.cellIndex == "number" ? b.cellIndex : b.getAttribute("data-cellIndex");
              var c = this.headerCt.getGridColumns()[h];
              a = c && c.model
            }
          }
          this.fireEvent("schedule" + f.type, this, j, d, a, f)
        }
      },
      onEventDataRefresh: function() {
        this.clearRowHeightCache();
        this.callParent(arguments)
      },
      onUnbindStore: function(a) {
        a.un({
          refresh: this.clearRowHeightCache,
          clear: this.clearRowHeightCache,
          load: this.clearRowHeightCache,
          scope: this
        });
        this.callParent(arguments)
      },
      bindStore: function(a) {
        a && a.on({
          refresh: this.clearRowHeightCache,
          clear: this.clearRowHeightCache,
          load: this.clearRowHeightCache,
          scope: this
        });
        this.callParent(arguments)
      }
    }
  },
  _afterRender: function() {
    this.bindEventStore(this.eventStore, true);
    this.setupEventListeners();
    this.configureFunctionality();
    var a = this.headerCt.resizer;
    if (a) {
      a.doResize = Ext.Function.createSequence(a.doResize, this.afterHeaderResized, this)
    }
  },
  _destroy: function() {
    this.bindEventStore(null)
  },
  clearRowHeightCache: function() {
    if (this.orientation === "horizontal") {
      this.eventLayout.horizontal.clearCache()
    }
  },
  configureFunctionality: function() {
    var a = this.validatorFnScope || this;
    if (this.eventResizeHandles !== "none" && Ext.ux.Scheduler.feature.ResizeZone) {
      this.resizePlug = new Ext.ux.Scheduler.feature.ResizeZone(Ext.applyIf({
        schedulerView: this,
        validatorFn: function(d, c, b, e) {
          return (this.allowOverlap || this.isDateRangeAvailable(b, e, c, d)) && this.resizeValidatorFn.apply(a, arguments) !== false
        },
        validatorFnScope: this
      }, this.resizeConfig || {}))
    }
    if (this.enableEventDragDrop !== false && Ext.ux.Scheduler.feature.DragDrop) {
      this.dragdropPlug = new Ext.ux.Scheduler.feature.DragDrop(this, {
        validatorFn: function(c, b, d, e) {
          return (this.allowOverlap || this.isDateRangeAvailable(d, Ext.ux.Scheduler.util.Date.add(d, Ext.ux.Scheduler.util.Date.MILLI, e), c[0], b)) && this.dndValidatorFn.apply(a, arguments) !== false
        },
        validatorFnScope: this,
        dragConfig: this.dragConfig || {}
      })
    }
    if (this.enableDragCreation !== false && Ext.ux.Scheduler.feature.DragCreator) {
      this.dragCreator = new Ext.ux.Scheduler.feature.DragCreator(Ext.applyIf({
        schedulerView: this,
        disabled: this.readOnly,
        validatorFn: function(c, b, d) {
          return (this.allowOverlap || this.isDateRangeAvailable(b, d, null, c)) && this.createValidatorFn.apply(a, arguments) !== false
        },
        validatorFnScope: this
      }, this.createConfig || {}))
    }
  },
  onBeforeDragDrop: function(a, c, b) {
    return !this.readOnly && !b.getTarget().className.match("sch-resizable-handle")
  },
  onDragDropStart: function() {
    if (this.dragCreator) {
      this.dragCreator.setDisabled(true)
    }
    if (this.tip) {
      this.tip.hide();
      this.tip.disable()
    }
    if (this.overScheduledEventClass) {
      this.setMouseOverEnabled(false)
    }
  },
  onDragDropEnd: function() {
    if (this.dragCreator) {
      this.dragCreator.setDisabled(false)
    }
    if (this.tip) {
      this.tip.enable()
    }
    if (this.overScheduledEventClass) {
      this.setMouseOverEnabled(true)
    }
  },
  onBeforeDragCreate: function(b, c, a, d) {
    return !this.readOnly && !d.ctrlKey
  },
  onDragCreateStart: function() {
    if (this.overScheduledEventClass) {
      this.setMouseOverEnabled(false)
    }
    if (this.tip) {
      this.tip.hide();
      this.tip.disable()
    }
  },
  onDragCreateEnd: function(b, a) {
    if (!this.getEventEditor()) {
      if (this.fireEvent("beforeeventadd", this, a) !== false) {
        this.onEventCreated(a);
        this.eventStore.append(a)
      }
      this.dragCreator.getProxy().hide()
    }
    if (this.overScheduledEventClass) {
      this.setMouseOverEnabled(true)
    }
  },
  onEventCreated: function(a) {},
  onAfterDragCreate: function() {
    if (this.overScheduledEventClass) {
      this.setMouseOverEnabled(true)
    }
    if (this.tip) {
      this.tip.enable()
    }
  },
  onBeforeResize: function() {
    return !this.readOnly
  },
  onResizeStart: function() {
    if (this.tip) {
      this.tip.hide();
      this.tip.disable()
    }
    if (this.dragCreator) {
      this.dragCreator.setDisabled(true)
    }
  },
  onResizeEnd: function() {
    if (this.tip) {
      this.tip.enable()
    }
    if (this.dragCreator) {
      this.dragCreator.setDisabled(false)
    }
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
    })
  },
  afterHeaderResized: function() {
    var b = this.headerCt.resizer;
    if (b && b.dragHd instanceof Ext.ux.Scheduler.column.Resource) {
      var a = b.dragHd.getWidth();
      this.setColumnWidth(a)
    }
  },
  columnRenderer: function(e, c, a, d, b) {
    return this[this.orientation].columnRenderer(e, c, a, d, b)
  }
});
Ext.define("Ext.ux.Scheduler.view.SchedulerGridView", {
  extend: "Ext.ux.Scheduler.view.TimelineGridView",
  mixins: ["Ext.ux.Scheduler.mixin.SchedulerView", "Ext.ux.Scheduler.mixin.Localizable"],
  alias: "widget.schedulergridview"  
}, function() {
  this.override(Ext.ux.Scheduler.mixin.SchedulerView.prototype.inheritables() || {})
});
Ext.define("Ext.ux.Scheduler.mixin.Zoomable", {
  zoomLevels: [{
    width: 80,
    increment: 5,
    resolution: 1,
    preset: "manyYears",
    resolutionUnit: "YEAR"
  }, {
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
  }],
  minZoomLevel: null,
  maxZoomLevel: null,
  visibleZoomFactor: 5,
  zoomKeepsOriginalTimespan: false,
  cachedCenterDate: null,
  isFirstZoom: true,
  isZooming: false,
  initializeZooming: function() {
    this.zoomLevels = this.zoomLevels.slice();
    this.setMinZoomLevel(this.minZoomLevel || 0);
    this.setMaxZoomLevel(this.maxZoomLevel !== null ? this.maxZoomLevel : this.zoomLevels.length - 1);
    this.on("viewchange", this.clearCenterDateCache, this)
  },
  getZoomLevelUnit: function(a) {
    return Ext.ux.Scheduler.preset.Manager.getPreset(a.preset).getBottomHeader().unit
  },
  getMilliSecondsPerPixelForZoomLevel: function(c, a) {
    var b = Ext.ux.Scheduler.util.Date;
    return Math.round((b.add(new Date(1, 0, 1), this.getZoomLevelUnit(c), c.increment) - new Date(1, 0, 1)) / (a ? c.width : c.actualWidth || c.width))
  },
  presetToZoomLevel: function(b) {
    var a = Ext.ux.Scheduler.preset.Manager.getPreset(b);
    return {
      preset: b,
      increment: a.getBottomHeader().increment || 1,
      resolution: a.timeResolution.increment,
      resolutionUnit: a.timeResolution.unit,
      width: a.timeColumnWidth
    }
  },
  zoomLevelToPreset: function(c) {
    var b = Ext.ux.Scheduler.preset.Manager.getPreset(c.preset).clone();
    var a = b.getBottomHeader();
    a.increment = c.increment;
    b.timeColumnWidth = c.width;
    if (c.resolutionUnit || c.resolution) {
      b.timeResolution = {
        unit: c.resolutionUnit || b.timeResolution.unit || a.unit,
        increment: c.resolution || b.timeResolution.increment || 1
      }
    }
    return b
  },
  calculateCurrentZoomLevel: function() {
    var a = this.presetToZoomLevel(this.viewPreset);
    a.width = this.timeAxisViewModel.timeColumnWidth;
    a.increment = this.timeAxisViewModel.getBottomHeader().increment || 1;
    return a
  },
  getCurrentZoomLevelIndex: function() {
    var f = this.calculateCurrentZoomLevel();
    var b = this.getMilliSecondsPerPixelForZoomLevel(f);
    var e = this.zoomLevels;
    for (var c = 0; c < e.length; c++) {
      var d = this.getMilliSecondsPerPixelForZoomLevel(e[c]);
      if (d == b) {
        return c
      }
      if (c === 0 && b > d) {
        return -0.5
      }
      if (c == e.length - 1 && b < d) {
        return e.length - 1 + 0.5
      }
      var a = this.getMilliSecondsPerPixelForZoomLevel(e[c + 1]);
      if (d > b && b > a) {
        return c + 0.5
      }
    }
    throw "Can't find current zoom level index"
  },
  setMaxZoomLevel: function(a) {
    if (a < 0 || a >= this.zoomLevels.length) {
      throw new Error("Invalid range for `setMinZoomLevel`")
    }
    this.maxZoomLevel = a
  },
  setMinZoomLevel: function(a) {
    if (a < 0 || a >= this.zoomLevels.length) {
      throw new Error("Invalid range for `setMinZoomLevel`")
    }
    this.minZoomLevel = a
  },
  getViewportCenterDateCached: function() {
    if (this.cachedCenterDate) {
      return this.cachedCenterDate
    }
    return this.cachedCenterDate = this.getViewportCenterDate()
  },
  clearCenterDateCache: function() {
    this.cachedCenterDate = null
  },
  zoomToLevel: function(b, r, e) {
    b = Ext.Number.constrain(b, this.minZoomLevel, this.maxZoomLevel);
    e = e || {};
    var q = this.calculateCurrentZoomLevel();
    var d = this.getMilliSecondsPerPixelForZoomLevel(q);
    var l = this.zoomLevels[b];
    var a = this.getMilliSecondsPerPixelForZoomLevel(l);
    if (d == a && !r) {
      return null
    }
    var t = this;
    var m = this.getSchedulingView();
    var h = m.getOuterEl();
    var s = m.getScrollEventSource();
    if (this.isFirstZoom) {
      this.isFirstZoom = false;
      s.on("scroll", this.clearCenterDateCache, this)
    }
    var i = this.orientation == "vertical";
    var g = r ? new Date((r.start.getTime() + r.end.getTime()) / 2) : this.getViewportCenterDateCached();
    var n = i ? h.getHeight() : h.getWidth();
    var o = Ext.ux.Scheduler.preset.Manager.getPreset(l.preset).clone();
    var p = o.getBottomHeader();
    var f = Boolean(r);
    r = this.calculateOptimalDateRange(g, n, l, r);
    o[i ? "timeRowHeight" : "timeColumnWidth"] = e.customWidth || l.width;
    p.increment = l.increment;
    this.isZooming = true;
    this.viewPreset = l.preset;
    var c = this.timeAxis;
    o.increment = l.increment;
    o.resolutionUnit = Ext.ux.Scheduler.util.Date.getUnitByName(l.resolutionUnit || p.unit);
    o.resolutionIncrement = l.resolution;
    this.switchViewPreset(o, r.start || this.getStart(), r.end || this.getEnd(), false, true);
    l.actualWidth = this.timeAxisViewModel.getTickWidth();
    if (f) {
      g = e.centerDate || new Date((c.getStart().getTime() + c.getEnd().getTime()) / 2)
    }
    s.on("scroll", function() {
      t.cachedCenterDate = g
    }, this, {
      single: true
    });
    if (i) {
      var j = m.getYFromDate(g, true);
      m.scrollVerticallyTo(j - n / 2)
    } else {
      var k = m.getXFromDate(g, true);
      m.scrollHorizontallyTo(k - n / 2)
    }
    t.isZooming = false;
    this.fireEvent("zoomchange", this, b);
    return b
  },
  zoomToSpan: function(r, u) {
    if (r.start && r.end && r.start < r.end) {
      var g = r.start,
        d = r.end,
        e = u && u.adjustStart >= 0 && u.adjustEnd >= 0;
      if (e) {
        g = Ext.ux.Scheduler.util.Date.add(g, this.timeAxis.mainUnit, -u.adjustStart);
        d = Ext.ux.Scheduler.util.Date.add(d, this.timeAxis.mainUnit, u.adjustEnd)
      }
      var a = this.getSchedulingView().getTimeAxisViewModel().getAvailableWidth();
      var m = Math.floor(this.getCurrentZoomLevelIndex());
      if (m == -1) {
        m = 0
      }
      var v = this.zoomLevels;
      var o, b = d - g,
        j = this.getMilliSecondsPerPixelForZoomLevel(v[m], true),
        l = b / j > a ? -1 : 1,
        f = m + l;
      var p, q, h = null;
      while (f >= 0 && f <= v.length - 1) {
        p = v[f];
        var s = b / this.getMilliSecondsPerPixelForZoomLevel(p, true);
        if (l == -1) {
          if (s <= a) {
            h = f;
            break
          }
        } else {
          if (s <= a) {
            if (m !== f - l) {
              h = f
            }
          } else {
            break
          }
        }
        f += l
      }
      h = h !== null ? h : f - l;
      p = v[h];
      var c = Ext.ux.Scheduler.preset.Manager.getPreset(p.preset).getBottomHeader().unit;
      var t = Ext.ux.Scheduler.util.Date.getDurationInUnit(g, d, c) / p.increment;
      if (t === 0) {
        return
      }
      var i = Math.floor(a / t);
      var k = new Date((g.getTime() + d.getTime()) / 2);
      var n;
      if (e) {
        n = {
          start: g,
          end: d
        }
      } else {
        n = this.calculateOptimalDateRange(k, a, p)
      }
      return this.zoomToLevel(h, n, {
        customWidth: i,
        centerDate: k
      })
    }
    return null
  },
  zoomIn: function(a) {
    a = a || 1;
    var b = this.getCurrentZoomLevelIndex();
    if (b >= this.zoomLevels.length - 1) {
      return null
    }
    return this.zoomToLevel(Math.floor(b) + a)
  },
  zoomOut: function(a) {
    a = a || 1;
    var b = this.getCurrentZoomLevelIndex();
    if (b <= 0) {
      return null
    }
    return this.zoomToLevel(Math.ceil(b) - a)
  },
  zoomInFull: function() {
    return this.zoomToLevel(this.maxZoomLevel)
  },
  zoomOutFull: function() {
    return this.zoomToLevel(this.minZoomLevel)
  },
  calculateOptimalDateRange: function(c, i, e, l) {
    if (l) {
      return l
    }
    var h = this.timeAxis;
    if (this.zoomKeepsOriginalTimespan) {
      return {
        start: h.getStart(),
        end: h.getEnd()
      }
    }
    var b = Ext.ux.Scheduler.util.Date;
    var j = Ext.ux.Scheduler.preset.Manager.getPreset(e.preset).headerConfig;
    var f = j.top ? j.top.unit : j.middle.unit;
    var k = this.getZoomLevelUnit(e);
    var d = Math.ceil(i / e.width * e.increment * this.visibleZoomFactor / 2);
    var a = b.add(c, k, -d);
    var g = b.add(c, k, d);
    return {
      start: h.floorDate(a, false, k, e.increment),
      end: h.ceilDate(g, false, k, e.increment)
    }
  }
});
Ext.define("Ext.ux.Scheduler.mixin.AbstractTimelinePanel", {
  requires: ["Ext.ux.Scheduler.data.TimeAxis", "Ext.ux.Scheduler.view.model.TimeAxis", "Ext.ux.Scheduler.feature.ColumnLines", "Ext.ux.Scheduler.preset.Manager"],
  mixins: ["Ext.ux.Scheduler.mixin.Zoomable"],
  orientation: "horizontal",
  weekStartDay: 1,
  snapToIncrement: false,
  readOnly: false,
  forceFit: false,
  eventResizeHandles: "both",
  timeAxis: null,
  autoAdjustTimeAxis: true,
  timeAxisViewModel: null,
  viewPreset: "weekAndDay",
  trackHeaderOver: true,
  startDate: null,
  endDate: null,
  columnLines: true,
  getDateConstraints: Ext.emptyFn,
  snapRelativeToEventStartDate: false,
  trackMouseOver: false,
  readRowHeightFromPreset: true,
  eventBorderWidth: 1,
  getOrientation: function() {
    return this.orientation
  },
  isHorizontal: function() {
    return this.getOrientation() === "horizontal"
  },
  isVertical: function() {
    return !this.isHorizontal()
  },
  cellBorderWidth: 1,
  cellTopBorderWidth: 1,
  cellBottomBorderWidth: 1,
  renderers: null,
  _initializeTimelinePanel: function() {
    var b = this.viewPreset && Ext.ux.Scheduler.preset.Manager.getPreset(this.viewPreset);
    if (!b) {
      throw "You must define a valid view preset object. See Ext.ux.Scheduler.preset.Manager class for reference"
    }
    this.initializeZooming();
    this.renderers = [];
    this.readRowHeightFromPreset = !this.rowHeight;
    if (!this.timeAxis) {
      this.timeAxis = new Ext.ux.Scheduler.data.TimeAxis({
        autoAdjust: this.autoAdjustTimeAxis
      })
    }
    if (!this.timeAxisViewModel || !(this.timeAxisViewModel instanceof Ext.ux.Scheduler.view.model.TimeAxis)) {
      var a = Ext.apply({
        orientation: this.orientation,
        snapToIncrement: this.snapToIncrement,
        forceFit: this.forceFit,
        timeAxis: this.timeAxis
      }, this.timeAxisViewModel || {});
      this.timeAxisViewModel = new Ext.ux.Scheduler.view.model.TimeAxis(a)
    }
    this.timeAxisViewModel.on("update", this.onTimeAxisViewModelUpdate, this);
    this.timeAxisViewModel.refCount++;
    this.on("destroy", this.onPanelDestroyed, this);
    this.addCls(["sch-timelinepanel", "sch-" + this.orientation])
  },
  onTimeAxisViewModelUpdate: function() {
    var a = this.getSchedulingView();
    if (a && a.viewReady) {
      a.refreshKeepingScroll();
      this.fireEvent("viewchange", this)
    }
  },
  onPanelDestroyed: function() {
    var a = this.timeAxisViewModel;
    a.un("update", this.onTimeAxisViewModelUpdate, this);
    a.refCount--;
    if (a.refCount <= 0) {
      a.destroy()
    }
  },
  getSchedulingView: function() {
    throw "Abstract method call"
  },
  setReadOnly: function(a) {
    this.getSchedulingView().setReadOnly(a)
  },
  isReadOnly: function() {
    return this.getSchedulingView().isReadOnly()
  },
  switchViewPreset: function(i, a, d, f, b) {
    var e = this.timeAxis;
    if (this.fireEvent("beforeviewchange", this, i, a, d) !== false) {
      var h = this.getOrientation() === "horizontal";
      if (Ext.isString(i)) {
        this.viewPreset = i;
        i = Ext.ux.Scheduler.preset.Manager.getPreset(i)
      }
      if (!i) {
        throw "View preset not found"
      }
      if (!(f && e.isConfigured)) {
        var c = {
          weekStartDay: this.weekStartDay
        };
        if (f) {
          if (e.getCount() === 0 || a) {
            c.start = a || new Date()
          }
        } else {
          c.start = a || e.getStart()
        }
        c.end = d;
        e.consumeViewPreset(i);
        e.reconfigure(c, true);
        this.timeAxisViewModel.reconfigure({
          headerConfig: i.headerConfig,
          columnLinesFor: i.columnLinesFor || "middle",
          rowHeightHorizontal: this.readRowHeightFromPreset ? i.rowHeight : this.rowHeight,
          tickWidth: h ? i.timeColumnWidth : i.timeRowHeight || i.timeColumnWidth || 60,
          timeColumnWidth: i.timeColumnWidth,
          rowHeightVertical: i.timeRowHeight || i.timeColumnWidth || 60,
          timeAxisColumnWidth: i.timeAxisColumnWidth,
          resourceColumnWidth: this.resourceColumnWidth || i.resourceColumnWidth || 100
        })
      }
      var g = this.getSchedulingView();
      g.setDisplayDateFormat(i.displayDateFormat);
      if (!h) {
        g.setColumnWidth(this.resourceColumnWidth || i.resourceColumnWidth || 100, true)
      }
      if (!b) {
        if (h) {
          g.scrollHorizontallyTo(0)
        } else {
          g.scrollVerticallyTo(0)
        }
      }
    }
  },
  getStart: function() {
    return this.getStartDate()
  },
  getStartDate: function() {
    return this.timeAxis.getStart()
  },
  getEnd: function() {
    return this.getEndDate()
  },
  getEndDate: function() {
    return this.timeAxis.getEnd()
  },
  setTimeColumnWidth: function(b, a) {
    this.timeAxisViewModel.setTickWidth(b, a)
  },
  getTimeColumnWidth: function() {
    return this.timeAxisViewModel.getTickWidth()
  },
  getRowHeight: function() {
    return this.timeAxisViewModel.getViewRowHeight()
  },
  shiftNext: function(a) {
    this.suspendLayouts && this.suspendLayouts();
    this.timeAxis.shiftNext(a);
    this.suspendLayouts && this.resumeLayouts(true)
  },
  shiftPrevious: function(a) {
    this.suspendLayouts && this.suspendLayouts();
    this.timeAxis.shiftPrevious(a);
    this.suspendLayouts && this.resumeLayouts(true)
  },
  goToNow: function() {
    this.setTimeSpan(new Date())
  },
  setTimeSpan: function(b, a) {
    if (this.timeAxis) {
      this.timeAxis.setTimeSpan(b, a)
    }
  },
  setStart: function(a) {
    this.setTimeSpan(a)
  },
  setEnd: function(a) {
    this.setTimeSpan(null, a)
  },
  getTimeAxis: function() {
    return this.timeAxis
  },
  scrollToDate: function(c, b) {
    var a = this.getSchedulingView();
    var d = a.getCoordinateFromDate(c, true);
    this.scrollToCoordinate(d, c, b, false)
  },
  scrollToDateCentered: function(c, b) {
    var a = this.getSchedulingView();
    var e = 0;
    if (this.orientation === "horizontal") {
      e = a.getBox().width / 2
    } else {
      e = a.getBox().height / 2
    }
    var d = Math.round(a.getCoordinateFromDate(c, true) - e);
    this.scrollToCoordinate(d, c, b, true)
  },
  scrollToCoordinate: function(g, e, d, c) {
    var b = this.getSchedulingView();
    var f = this;
    if (g < 0) {
      if (this.infiniteScroll) {
        b.shiftToDate(e, c)
      } else {
        var a = (this.timeAxis.getEnd() - this.timeAxis.getStart()) / 2;
        this.setTimeSpan(new Date(e.getTime() - a), new Date(e.getTime() + a));
        if (c) {
          f.scrollToDateCentered(e, d)
        } else {
          f.scrollToDate(e, d)
        }
      }
      return
    }
    if (this.orientation === "horizontal") {
      b.scrollHorizontallyTo(g, d)
    } else {
      b.scrollVerticallyTo(g, d)
    }
    b.fireEvent("scroll", this, g)
  },
  getViewportCenterDate: function() {
    var b = this.getSchedulingView(),
      a = b.getScroll(),
      c;
    if (this.getOrientation() === "vertical") {
      c = [0, a.top + b.getViewportHeight() / 2]
    } else {
      c = [a.left + b.getViewportWidth() / 2, 0]
    }
    return b.getDateFromXY(c, null, true)
  },
  addCls: function() {
    throw "Abstract method call"
  },
  removeCls: function() {
    throw "Abstract method call"
  },
  registerRenderer: function(b, a) {
    this.renderers.push({
      fn: b,
      scope: a
    })
  },
  deregisterRenderer: function(b, a) {
    Ext.each(this.renderers, function(c, d) {
      if (b === c) {
        Ext.Array.removeAt(this.renderers, d);
        return false
      }
    })
  }
});
if (!Ext.ClassManager.get("Ext.ux.Scheduler.mixin.TimelinePanel")) {
  Ext.define("Ext.ux.Scheduler.mixin.TimelinePanel", {
    extend: "Ext.ux.Scheduler.mixin.AbstractTimelinePanel",
    requires: ["Ext.ux.Scheduler.util.Patch", "Ext.ux.Scheduler.patches.ElementScroll", "Ext.ux.Scheduler.column.timeAxis.Horizontal", "Ext.ux.Scheduler.preset.Manager"],
    mixins: ["Ext.ux.Scheduler.mixin.Zoomable", "Ext.ux.Scheduler.mixin.Lockable"],
    bufferCoef: 5,
    bufferThreshold: 0.2,
    infiniteScroll: false,
    waitingForAutoTimeSpan: false,
    columnLinesFeature: null,
    tipCfg: {
      cls: "sch-tip",
      showDelay: 1000,
      hideDelay: 0,
      autoHide: true,
      anchor: "b"
    },
    inheritables: function() {
      return {
        columnLines: true,
        enableLocking: true,
        lockable: true,
        initComponent: function() {
          if (this.partnerTimelinePanel) {
            this.timeAxisViewModel = this.partnerTimelinePanel.timeAxisViewModel;
            this.timeAxis = this.partnerTimelinePanel.getTimeAxis();
            this.startDate = this.timeAxis.getStart();
            this.endDate = this.timeAxis.getEnd()
          }
          if (this.viewConfig && this.viewConfig.forceFit) {
            this.forceFit = true
          }
          if (Ext.versions.extjs.isGreaterThanOrEqual("4.2.1")) {
            this.cellTopBorderWidth = 0
          }
          this._initializeTimelinePanel();
          this.configureColumns();
          var c = this.normalViewConfig = this.normalViewConfig || {};
          var e = this.getId();
          Ext.apply(this.normalViewConfig, {
            id: e + "-timelineview",
            eventPrefix: this.autoGenId ? null : e,
            timeAxisViewModel: this.timeAxisViewModel,
            eventBorderWidth: this.eventBorderWidth,
            timeAxis: this.timeAxis,
            readOnly: this.readOnly,
            orientation: this.orientation,
            rtl: this.rtl,
            cellBorderWidth: this.cellBorderWidth,
            cellTopBorderWidth: this.cellTopBorderWidth,
            cellBottomBorderWidth: this.cellBottomBorderWidth,
            infiniteScroll: this.infiniteScroll,
            bufferCoef: this.bufferCoef,
            bufferThreshold: this.bufferThreshold
          });
          Ext.Array.forEach(["eventRendererScope", "eventRenderer", "dndValidatorFn", "resizeValidatorFn", "createValidatorFn", "tooltipTpl", "validatorFnScope", "eventResizeHandles", "enableEventDragDrop", "enableDragCreation", "resizeConfig", "createConfig", "tipCfg", "getDateConstraints"], function(f) {
            if (f in this) {
              c[f] = this[f]
            }
          }, this);
          this.mon(this.timeAxis, "reconfigure", this.onMyTimeAxisReconfigure, this);
          this.callParent(arguments);
          this.switchViewPreset(this.viewPreset, this.startDate || this.timeAxis.getStart(), this.endDate || this.timeAxis.getEnd(), true);
          if (!this.startDate) {
            var a = this.getTimeSpanDefiningStore();
            if (Ext.data.TreeStore && a instanceof Ext.data.TreeStore ? a.getRootNode().childNodes.length : a.getCount()) {
              var d = a.getTotalTimeSpan();
              this.setTimeSpan(d.start || new Date(), d.end)
            } else {
              this.bindAutoTimeSpanListeners()
            }
          }
          var b = this.columnLines;
          if (b) {
            this.columnLinesFeature = new Ext.ux.Scheduler.feature.ColumnLines(Ext.isObject(b) ? b : undefined);
            this.columnLinesFeature.init(this);
            this.columnLines = true
          }
          this.relayEvents(this.getSchedulingView(), ["beforetooltipshow"]);
          this.on("afterrender", this.__onAfterRender, this);
          this.on("zoomchange", function() {
            this.normalGrid.scrollTask.cancel()
          })
        },
        getState: function() {
          var a = this,
            b = a.callParent(arguments);
          Ext.apply(b, {
            viewPreset: a.viewPreset,
            startDate: a.getStart(),
            endDate: a.getEnd(),
            zoomMinLevel: a.zoomMinLevel,
            zoomMaxLevel: a.zoomMaxLevel,
            currentZoomLevel: a.currentZoomLevel
          });
          return b
        },
        applyState: function(b) {
          var a = this;
          a.callParent(arguments);
          if (b && b.viewPreset) {
            a.switchViewPreset(b.viewPreset, b.startDate, b.endDate)
          }
          if (b && b.currentZoomLevel) {
            a.zoomToLevel(b.currentZoomLevel)
          }
        },
        setTimeSpan: function() {
          if (this.waitingForAutoTimeSpan) {
            this.unbindAutoTimeSpanListeners()
          }
          this.callParent(arguments);
          if (!this.normalGrid.getView().viewReady) {
            this.getView().refresh()
          }
        }
      }
    },
    bindAutoTimeSpanListeners: function() {
      var a = this.getTimeSpanDefiningStore();
      this.waitingForAutoTimeSpan = true;
      this.normalGrid.getView().on("beforerefresh", this.refreshStopper, this);
      this.lockedGrid.getView().on("beforerefresh", this.refreshStopper, this);
      this.mon(a, "load", this.applyStartEndDatesFromStore, this);
      if (Ext.data.TreeStore && a instanceof Ext.data.TreeStore) {
        this.mon(a, "rootchange", this.applyStartEndDatesFromStore, this);
        this.mon(a.tree, "append", this.applyStartEndDatesAfterTreeAppend, this)
      } else {
        this.mon(a, "add", this.applyStartEndDatesFromStore, this)
      }
    },
    refreshStopper: function(a) {
      return a.store.getCount() === 0
    },
    getTimeSpanDefiningStore: function() {
      throw "Abstract method called"
    },
    unbindAutoTimeSpanListeners: function() {
      this.waitingForAutoTimeSpan = false;
      var a = this.getTimeSpanDefiningStore();
      this.normalGrid.getView().un("beforerefresh", this.refreshStopper, this);
      this.lockedGrid.getView().un("beforerefresh", this.refreshStopper, this);
      a.un("load", this.applyStartEndDatesFromStore, this);
      if (Ext.data.TreeStore && a instanceof Ext.data.TreeStore) {
        a.un("rootchange", this.applyStartEndDatesFromStore, this);
        a.tree.un("append", this.applyStartEndDatesAfterTreeAppend, this)
      } else {
        a.un("add", this.applyStartEndDatesFromStore, this)
      }
    },
    applyStartEndDatesAfterTreeAppend: function() {
      var a = this.getTimeSpanDefiningStore();
      if (!a.isSettingRoot) {
        this.applyStartEndDatesFromStore()
      }
    },
    applyStartEndDatesFromStore: function() {
      var a = this.getTimeSpanDefiningStore();
      var b = a.getTotalTimeSpan();
      var c = this.lockedGridDependsOnSchedule;
      this.lockedGridDependsOnSchedule = true;
      this.setTimeSpan(b.start || new Date(), b.end);
      this.lockedGridDependsOnSchedule = c
    },
    onMyTimeAxisReconfigure: function(a) {
      if (this.stateful && this.rendered) {
        this.saveState()
      }
    },
    onLockedGridItemDblClick: function(b, a, c, e, d) {
      if (this.orientation === "vertical" && a) {
        this.fireEvent("timeheaderdblclick", this, a.get("start"), a.get("end"), e, d)
      }
    },
    getSchedulingView: function() {
      return this.normalGrid.getView()
    },
    getTimeAxisColumn: function() {
      if (!this.timeAxisColumn) {
        this.timeAxisColumn = this.down("timeaxiscolumn")
      }
      return this.timeAxisColumn
    },
    configureColumns: function() {
      var a = this.columns || [];
      if (a.items) {
        a = a.items
      } else {
        a = this.columns = a.slice()
      }
      var c = [];
      var b = [];
      Ext.Array.each(a, function(d) {
        if (d.position === "right") {
          if (!Ext.isNumber(d.width)) {
            Ext.Error.raise('"Right" columns must have a fixed width')
          }
          d.locked = false;
          b.push(d)
        } else {
          d.locked = true;
          c.push(d)
        }
        d.lockable = false
      });
      Ext.Array.erase(a, 0, a.length);
      Ext.Array.insert(a, 0, c.concat({
        xtype: "timeaxiscolumn",
        timeAxisViewModel: this.timeAxisViewModel,
        trackHeaderOver: this.trackHeaderOver,
        renderer: this.mainRenderer,
        scope: this
      }).concat(b));
      this.horizontalColumns = Ext.Array.clone(a);
      this.verticalColumns = [Ext.apply({
        xtype: "verticaltimeaxis",
        width: 100,
        timeAxis: this.timeAxis,
        timeAxisViewModel: this.timeAxisViewModel,
        cellTopBorderWidth: this.cellTopBorderWidth,
        cellBottomBorderWidth: this.cellBottomBorderWidth
      }, this.timeAxisColumnCfg || {})];
      if (this.orientation === "vertical") {
        this.columns = this.verticalColumns;
        this.store = this.timeAxis;
        this.on("beforerender", this.refreshResourceColumns, this)
      }
    },
    mainRenderer: function(b, m, g, j, l) {
      var c = this.renderers,
        k = this.orientation === "horizontal",
        d = k ? g : this.resourceStore.getAt(l),
        a = "&nbsp;";
      m.rowHeight = null;
      for (var e = 0; e < c.length; e++) {
        a += c[e].fn.call(c[e].scope || this, b, m, d, j, l) || ""
      }
      if (this.variableRowHeight) {
        var h = this.getSchedulingView();
        var f = this.timeAxisViewModel.getViewRowHeight();
        m.style = "height:" + ((m.rowHeight || f) - h.cellTopBorderWidth - h.cellBottomBorderWidth) + "px"
      }
      return a
    },
    __onAfterRender: function() {
      var a = this;
      a.normalGrid.on({
        collapse: a.onNormalGridCollapse,
        expand: a.onNormalGridExpand,
        scope: a
      });
      a.lockedGrid.on({
        collapse: a.onLockedGridCollapse,
        itemdblclick: a.onLockedGridItemDblClick,
        scope: a
      });
      if (a.lockedGridDependsOnSchedule) {
        a.normalGrid.getView().on("itemupdate", a.onNormalViewItemUpdate, a)
      }
      if (this.partnerTimelinePanel) {
        if (this.partnerTimelinePanel.rendered) {
          this.setupPartnerTimelinePanel()
        } else {
          this.partnerTimelinePanel.on("afterrender", this.setupPartnerTimelinePanel, this)
        }
      }
    },
    onLockedGridCollapse: function() {
      if (this.normalGrid.collapsed) {
        this.normalGrid.expand()
      }
    },
    onNormalGridCollapse: function() {
      var a = this;
      if (!a.normalGrid.reExpander) {
        a.normalGrid.reExpander = a.normalGrid.placeholder
      }
      if (!a.lockedGrid.rendered) {
        a.lockedGrid.on("render", a.onNormalGridCollapse, a, {
          delay: 1
        })
      } else {
        a.lockedGrid.flex = 1;
        a.lockedGrid.doLayout();
        if (a.lockedGrid.collapsed) {
          a.lockedGrid.expand()
        }
        a.addCls("sch-normalgrid-collapsed")
      }
    },
    onNormalGridExpand: function() {
      this.removeCls("sch-normalgrid-collapsed");
      delete this.lockedGrid.flex;
      this.lockedGrid.doLayout()
    },
    onNormalViewItemUpdate: function(a, b, d) {
      if (this.lockedGridDependsOnSchedule) {
        var c = this.lockedGrid.getView();
        c.suspendEvents();
        c.refreshNode(b);
        c.resumeEvents()
      }
    },
    setupPartnerTimelinePanel: function() {
      var f = this.partnerTimelinePanel;
      var d = f.down("splitter");
      var c = this.down("splitter");
      if (d) {
        d.on("dragend", function() {
          this.lockedGrid.setWidth(f.lockedGrid.getWidth())
        }, this)
      }
      if (c) {
        c.on("dragend", function() {
          f.lockedGrid.setWidth(this.lockedGrid.getWidth())
        }, this)
      }
      var b = f.isVisible() ? f.lockedGrid.getWidth() : f.lockedGrid.width;
      this.lockedGrid.setWidth(b);
      var a = f.getSchedulingView().getEl(),
        e = this.getSchedulingView().getEl();
      f.mon(e, "scroll", function(h, g) {
        a.scrollTo("left", g.scrollLeft)
      });
      this.mon(a, "scroll", function(h, g) {
        e.scrollTo("left", g.scrollLeft)
      });
      this.on("viewchange", function() {
        f.viewPreset = this.viewPreset
      }, this);
      f.on("viewchange", function() {
        this.viewPreset = f.viewPreset
      }, this)
    }
  }, function() {
    var a = "4.2.1";
    Ext.apply(Ext.ux.Scheduler, {});
    if (Ext.versions.extjs.isLessThan(a)) {
      alert("The Ext JS version you are using needs to be updated to at least " + a)
    }
  })
}
Ext.define("Ext.ux.Scheduler.mixin.AbstractSchedulerPanel", {
  requires: ["Ext.ux.Scheduler.model.Event", "Ext.ux.Scheduler.model.Resource", "Ext.ux.Scheduler.data.EventStore", "Ext.ux.Scheduler.data.ResourceStore", "Ext.ux.Scheduler.util.Date"],
  eventBarIconClsField: "",
  enableEventDragDrop: true,
  resourceColumnClass: "Ext.ux.Scheduler.column.Resource",
  resourceColumnWidth: null,
  allowOverlap: true,
  startParamName: "startDate",
  endParamName: "endDate",
  passStartEndParameters: false,
  variableRowHeight: true,
  eventRenderer: null,
  eventRendererScope: null,
  eventStore: null,
  resourceStore: null,
  onEventCreated: function(a) {},
  isDateRangeAvailable : function(start, end, eventId, resourceId) {
		var available = true;
		this.eventStore.each(function(r) {
			if (Ext.ux.Scheduler.util.Date.intersectSpans(start, end, r.get('StartDate'), r.get('EndDate')) && (resourceId === r.get('ResourceId') && (!eventId || eventId !== r.id))){
				available = false;
				return false;
			}
		});
		return available;
  },  
  initStores: function() {
    var a = this.resourceStore || this.store;
    if (!a) {
      Ext.Error.raise("You must specify a resourceStore config")
    }
    if (!this.eventStore) {
      Ext.Error.raise("You must specify an eventStore config")
    }
    this.store = Ext.StoreManager.lookup(a);
    this.resourceStore = this.store;
    this.eventStore = Ext.StoreManager.lookup(this.eventStore);
    if (!this.eventStore.isEventStore) {
      Ext.Error.raise("Your eventStore should be a subclass of Ext.ux.Scheduler.data.EventStore (or consume the EventStore mixin)")
    }
    this.resourceStore.eventStore = this.eventStore;
    if (this.passStartEndParameters) {
      this.eventStore.on("beforeload", this.applyStartEndParameters, this)
    }
  },
  _initializeSchedulerPanel: function() {
    this.initStores();
    if (this.eventBodyTemplate && Ext.isString(this.eventBodyTemplate)) {
      this.eventBodyTemplate = new Ext.XTemplate(this.eventBodyTemplate)
    }
  },
  getResourceStore: function() {
    return this.resourceStore
  },
  getEventStore: function() {
    return this.eventStore
  },
  applyStartEndParameters: function(c, a) {
    var b = c.getProxy();
    b.setExtraParam(this.startParamName, this.getStart());
    b.setExtraParam(this.endParamName, this.getEnd())
  },
  createResourceColumns: function(b) {
    var a = [];
    var c = this;
    this.resourceStore.each(function(d) {
      a.push(Ext.create(c.resourceColumnClass, {
        renderer: c.mainRenderer,
        scope: c,
        width: b || 100,
        text: d.getName(),
        model: d
      }))
    });
    return a
  }
});
Ext.define("Ext.ux.Scheduler.mixin.SchedulerPanel", {
  extend: "Ext.ux.Scheduler.mixin.AbstractSchedulerPanel",
  requires: ["Ext.ux.Scheduler.view.SchedulerGridView", "Ext.ux.Scheduler.selection.EventModel", "Ext.ux.Scheduler.plugin.ResourceZones", "Ext.ux.Scheduler.column.timeAxis.Vertical"],
  eventSelModelType: "eventmodel",
  eventSelModel: null,
  enableEventDragDrop: true,
  enableDragCreation: true,
  dragConfig: null,
  resourceZones: null,
  resourceZonesConfig: null,
  componentCls: "sch-schedulerpanel",
  lockedGridDependsOnSchedule: true,
  verticalListeners: null,
  inheritables: function() {
    return {
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
        Ext.apply(b, {
          eventStore: this.eventStore,
          resourceStore: this.resourceStore,
          eventBarTextField: this.eventBarTextField || this.eventStore.model.prototype.nameField
        });
        Ext.Array.forEach(["barMargin", "eventBodyTemplate", "eventTpl", "allowOverlap", "dragConfig", "eventBarIconClsField", "onEventCreated", "constrainDragToResource", "snapRelativeToEventStartDate"], function(e) {
          if (e in this) {
            b[e] = this[e]
          }
        }, this);
        if (this.orientation === "vertical") {
          this.mon(this.resourceStore, this.verticalListeners)
        }
        this.callParent(arguments);
        var d = this.lockedGrid.getView();
        var c = this.getSchedulingView();
        this.registerRenderer(c.columnRenderer, c);
        if (this.resourceZones) {
          var a = Ext.StoreManager.lookup(this.resourceZones);
          a.setResourceStore(this.resourceStore);
          this.resourceZonesPlug = new Ext.ux.Scheduler.plugin.ResourceZones(Ext.apply({
            store: a
          }, this.resourceZonesConfig));
          this.resourceZonesPlug.init(this)
        }
        c.on("columnwidthchange", this.onColWidthChange, this);
        this.relayEvents(this.getSchedulingView(), ["eventclick", "eventmousedown", "eventmouseup", "eventdblclick", "eventcontextmenu", "eventmouseenter", "eventmouseleave", "beforeeventresize", "eventresizestart", "eventpartialresize", "beforeeventresizefinalize", "eventresizeend", "beforeeventdrag", "eventdragstart", "eventdrag", "beforeeventdropfinalize", "eventdrop", "aftereventdrop", "beforedragcreate", "dragcreatestart", "beforedragcreatefinalize", "dragcreateend", "afterdragcreate", "beforeeventadd", "scheduleclick", "scheduledblclick", "schedulecontextmenu"]);
        if (!this.syncRowHeight) {
          this.enableRowHeightInjection(d, c)
        }
      },
      afterRender: function() {
        this.callParent(arguments);
        this.getSchedulingView().on({
          itemmousedown: this.onScheduleRowMouseDown,
          eventmousedown: this.onScheduleEventBarMouseDown,
          eventdragstart: this.doSuspendLayouts,
          aftereventdrop: this.doResumeLayouts,
          eventresizestart: this.doSuspendLayouts,
          eventresizeend: this.doResumeLayouts,
          scope: this
        })
      },
      getTimeSpanDefiningStore: function() {
        return this.eventStore
      }
    }
  },
  doSuspendLayouts: function() {
    var a = this.getSchedulingView();
    a.infiniteScroll && a.timeAxis.on({
      beginreconfigure: this.onBeginReconfigure,
      endreconfigure: this.onEndReconfigure,
      scope: this
    });
    this.lockedGrid.suspendLayouts();
    this.normalGrid.suspendLayouts()
  },
  doResumeLayouts: function() {
    var a = this.getSchedulingView();
    a.infiniteScroll && a.timeAxis.un({
      beginreconfigure: this.onBeginReconfigure,
      endreconfigure: this.onEndReconfigure,
      scope: this
    });
    this.lockedGrid.resumeLayouts();
    this.normalGrid.resumeLayouts()
  },
  onBeginReconfigure: function() {
    this.normalGrid.resumeLayouts()
  },
  onEndReconfigure: function() {
    this.normalGrid.suspendLayouts()
  },
  onColWidthChange: function(a, b) {
    if (this.getOrientation() === "vertical") {
      this.resourceColumnWidth = b;
      this.refreshResourceColumns()
    }
  },
  enableRowHeightInjection: function(a, c) {
    var b = new Ext.XTemplate("{%", "this.processCellValues(values);", "this.nextTpl.applyOut(values, out, parent);", "%}", {
      priority: 1,
      processCellValues: function(e) {
        if (c.orientation === "horizontal") {
          var f = c.eventLayout.horizontal;
          var g = e.record;
          var d = f.getRowHeight(g) - c.cellTopBorderWidth - c.cellBottomBorderWidth;
          e.style = (e.style || "") + ";height:" + d + "px;"
        }
      }
    });
    a.addCellTpl(b);
    a.store.un("refresh", a.onDataRefresh, a);
    a.store.on("refresh", a.onDataRefresh, a)
  },
  getEventSelectionModel: function() {
    if (this.eventSelModel && this.eventSelModel.events) {
      return this.eventSelModel
    }
    if (!this.eventSelModel) {
      this.eventSelModel = {}
    }
    var a = this.eventSelModel;
    var b = "SINGLE";
    if (this.simpleSelect) {
      b = "SIMPLE"
    } else {
      if (this.multiSelect) {
        b = "MULTI"
      }
    }
    Ext.applyIf(a, {
      allowDeselect: this.allowDeselect,
      mode: b
    });
    if (!a.events) {
      a = this.eventSelModel = Ext.create("selection." + this.eventSelModelType, a)
    }
    if (!a.hasRelaySetup) {
      this.relayEvents(a, ["selectionchange", "deselect", "select"]);
      a.hasRelaySetup = true
    }
    if (this.disableSelection) {
      a.locked = true
    }
    return a
  },
  refreshResourceColumns: function() {
    var a = this.resourceColumnWidth || this.timeAxisViewModel.resourceColumnWidth;
    this.normalGrid.reconfigure(null, this.createResourceColumns(a))
  },
  setOrientation: function(c, b) {
    if (c === this.orientation && !b) {
      return
    }
    this.removeCls("sch-" + this.orientation);
    this.addCls("sch-" + c);
    this.orientation = c;
    var h = this,
      e = function() {
        return false
      },
      g = h.normalGrid,
      i = h.lockedGrid.getView(),
      f = h.getSchedulingView(),
      d = g.headerCt;
    var a = i.deferInitialRefresh;
    f.deferInitialRefresh = i.deferInitialRefresh = false;
    i.on("beforerefresh", e);
    f.on("beforerefresh", e);
    f.setOrientation(c);
    Ext.suspendLayouts();
    d.removeAll(true);
    Ext.resumeLayouts();
    if (c === "horizontal") {
      h.mun(h.resourceStore, h.verticalListeners);
      f.setRowHeight(h.rowHeight || h.timeAxisViewModel.rowHeight, true);
      h.reconfigure(h.resourceStore, h.horizontalColumns)
    } else {
      h.mon(h.resourceStore, h.verticalListeners);
      h.reconfigure(h.timeAxis, h.verticalColumns.concat(h.createResourceColumns(h.resourceColumnWidth || h.timeAxisViewModel.resourceColumnWidth)));
      f.setColumnWidth(h.timeAxisViewModel.resourceColumnWidth || 100, true)
    }
    f.deferInitialRefresh = i.deferInitialRefresh = a;
    i.un("beforerefresh", e);
    f.un("beforerefresh", e);
    h.getView().refresh();
    this.fireEvent("orientationchange", this, c)
  },
  onScheduleRowMouseDown: function(a, c) {
    var b = this.lockedGrid.getSelectionModel();
    if (this.getOrientation() === "horizontal" && Ext.selection.RowModel && b instanceof Ext.selection.RowModel) {
      b.select(c)
    }
  },
  onScheduleEventBarMouseDown: function(a, d, f) {
    var c = this.normalGrid.view;
    var b = c.getRecord(c.findRowByChild(f.getTarget()));
    this.onScheduleRowMouseDown(a, b)
  }
});
Ext.define("Ext.ux.Scheduler.mixin.FilterableTreeView", {
  prevBlockRefresh: null,
  initTreeFiltering: function() {
    var a = function() {
      var b = this.up("tablepanel").store;
      if (b instanceof Ext.data.NodeStore) {
        b = this.up("tablepanel[lockable=true]").store
      }
      this.mon(b, "nodestore-datachange-start", this.onFilterChangeStart, this);
      this.mon(b, "nodestore-datachange-end", this.onFilterChangeEnd, this);
      this.mon(b, "filter-clear", this.onFilterCleared, this);
      this.mon(b, "filter-set", this.onFilterSet, this)
    };
    if (this.rendered) {
      a.call(this)
    } else {
      this.on("beforerender", a, this, {
        single: true
      })
    }
  },
  onFilterChangeStart: function() {
    this.prevBlockRefresh = this.blockRefresh;
    this.blockRefresh = true;
    Ext.suspendLayouts()
  },
  onFilterChangeEnd: function() {
    Ext.resumeLayouts(true);
    this.blockRefresh = this.prevBlockRefresh
  },
  onFilterCleared: function() {
    delete this.toggle;
    var a = this.getEl();
    if (a) {
      a.removeCls("sch-tree-filtered")
    }
  },
  onFilterSet: function() {
    this.toggle = function() {};
    var a = this.getEl();
    if (a) {
      a.addCls("sch-tree-filtered")
    }
  }
});
Ext.define("Ext.ux.Scheduler.panel.TimelineGridPanel", {
  extend: "Ext.grid.Panel",
  mixins: ["Ext.ux.Scheduler.mixin.TimelinePanel"],
  subGridXType: "gridpanel",
  requires: ["Ext.ux.Scheduler.patches.ColumnResize"],
  initComponent: function() {
    this.callParent(arguments);
    this.getSchedulingView()._initializeTimelineView()
  }
}, function() {
  this.override(Ext.ux.Scheduler.mixin.TimelinePanel.prototype.inheritables() || {})
});
if (!Ext.ClassManager.get("Ext.ux.Scheduler.panel.TimelineTreePanel")) {
  Ext.define("Ext.ux.Scheduler.panel.TimelineTreePanel", {
    extend: "Ext.tree.Panel",
    requires: ["Ext.grid.Panel", "Ext.data.TreeStore", "Ext.ux.Scheduler.mixin.FilterableTreeView", "Ext.ux.Scheduler.patches.ColumnResizeTree"],
    mixins: ["Ext.ux.Scheduler.mixin.TimelinePanel"],
    useArrows: true,
    rootVisible: false,
    lockedXType: "treepanel",
    initComponent: function() {
      this.callParent(arguments);
      this.getSchedulingView()._initializeTimelineView()
    }
  }, function() {
    this.override(Ext.ux.Scheduler.mixin.TimelinePanel.prototype.inheritables() || {})
  })
}
Ext.define("Ext.ux.Scheduler.panel.SchedulerGrid", {
  extend: "Ext.ux.Scheduler.panel.TimelineGridPanel",
  mixins: ["Ext.ux.Scheduler.mixin.SchedulerPanel"],
  alias: ["widget.schedulergrid", "widget.schedulerpanel"],
  alternateClassName: "Ext.ux.Scheduler.SchedulerPanel",
  viewType: "schedulergridview",
  initComponent: function() {
    this.callParent(arguments);
    this.getSchedulingView()._initializeSchedulerView()
  }
}, function() {
  this.override(Ext.ux.Scheduler.mixin.SchedulerPanel.prototype.inheritables() || {})
});
Ext.define("Ext.ux.Scheduler.panel.SchedulerTree", {
  extend: "Ext.ux.Scheduler.panel.TimelineTreePanel",
  mixins: ["Ext.ux.Scheduler.mixin.SchedulerPanel"],
  alias: ["widget.schedulertree"],
  viewType: "schedulergridview",
  setOrientation: function(a) {
    if (a == "vertical") {
      Ext.Error.raise("Ext.ux.Scheduler.panel.SchedulerTree does not support vertical orientation")
    }
  },
  initComponent: function() {
    this.callParent(arguments);
    this.getSchedulingView()._initializeSchedulerView()
  }
}, function() {
  this.override(Ext.ux.Scheduler.mixin.SchedulerPanel.prototype.inheritables() || {})
});
Ext.data.Connection.override({
  parseStatus: function(b) {
    var a = this.callOverridden(arguments);
    if (b === 0) {
      a.success = true
    }
    return a
  }
});

