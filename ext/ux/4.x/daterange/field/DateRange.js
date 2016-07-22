/**
 * A date range field. This class is based on {@link Ext.picker.Date} and allows the user to select two dates.
 * This two dates (start date and end date) are describing one date range.
 *
 * With the configuration {@link #numberOfCalendars} you can define how many calendars are rendered next to each other,
 * so that the user can easier select a huge date range.
 *
 *     @example
 *     Ext.create('Ext.panel.Panel', {
 *         title: 'Choose a future date:',
 *         width: 200,
 *         bodyPadding: 10,
 *         renderTo: Ext.getBody(),
 *         items: [{
 *              xtype: 'daterangefield',
 *              weekDayStart: 1,
 *              weekDayEnd:5,
 *              numberOfCalendars: 4,
 *              datePickerConfig: {
 *                  minDate: new Date(2014,1,1),
 *                  startDay: 1
 *              }
 *			}]
 *     });
 */

Ext.define("Ext.ux.daterange.Date", {
	extend: 'Ext.picker.Date',
	xtype: 'daterangedate',

    /**
     * @cfg {Boolean} showPrevArrow
     * Show or hide navigation arrow for previous month. Default to true
     */
    showPrevArrow: true,

    /**
     * @cfg {Boolean} showNextArrow
     * Show or hide navigation arrow for next month. Default to false
     */
    showNextArrow: true,


    /**
     * @cfg {String} Css class for start date. Default x-datepicker-start
     */
    /**
     * @cfg {String} Css class for end date. Default x-datepicker-end
     */

	initComponent: function() {
		var me = this,
			days = new Array(me.numDays);

        //Apply additional render data for template
		me.renderData = {};
		me.renderData.showPrevArrow = me.showPrevArrow;
		me.renderData.showNextArrow = me.showNextArrow;
        me.callParent();
        me.initRefs();

        me.startCls = me.baseCls + '-start';
        me.endCls = me.baseCls + '-end';

	},


    /**
     * @private
     * Define references.
     */
    initRefs: function() {
        var me = this;

        if (me.initialConfig.daterange === undefined) {
            me.initialConfig.daterange = { numberOfCalendars: 1};
        }
        me.daterange = me.initialConfig.daterange;
        me.calendarIndex = me.initialConfig.calendarIndex;
    },

    childEls: [
        'innerEl', 'eventEl', 'prevEl', 'nextEl', 'middleBtnEl', 'footerEl'
    ],

    renderTpl: [
        '<div id="{id}-innerEl" data-ref="innerEl" role="grid">',
            '<div role="presentation" class="{baseCls}-header">',
                '<tpl if="showPrevArrow">',
                    '<a id="{id}-prevEl" data-ref="prevEl" class="{baseCls}-prev {baseCls}-arrow" role="button" title="{prevText}" hidefocus="on" ></a>',
                '</tpl>',

            '<div id="{id}-middleBtnEl" data-ref="middleBtnEl" class="{baseCls}-month">{%this.renderMonthBtn(values, out)%}</div>',
                '<tpl if="showNextArrow">',
                    '<a id="{id}-nextEl" data-ref="nextEl" class="{baseCls}-next {baseCls}-arrow" role="button" title="{nextText}" hidefocus="on" ></a>',
                '</tpl>',

            '</div>',
            '<table id="{id}-eventEl" data-ref="eventEl" class="{baseCls}-inner" cellspacing="0" role="grid">',
                '<thead role="presentation"><tr role="row">',
                    '<tpl for="dayNames">',
                        '<th role="columnheader" class="{parent.baseCls}-column-header" title="{.}">',
                            '<div class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
                        '</th>',
                    '</tpl>',
                '</tr></thead>',
            '<tbody role="presentation"><tr role="row">',
                '<tpl for="days">',
                '{#:this.isEndOfWeek}',
                    '<td role="gridcell" id="{[Ext.id()]}">',
                    // The '#' is needed for keyboard navigation
                        '<a href="#" role="button" hidefocus="on" class="{parent.baseCls}-date"></a>',
                    '</td>',
                '</tpl>',
            '</tr></tbody>',
            '</table>',
            '<tpl if="showToday">',
                '<div id="{id}-footerEl" data-ref="footerEl" role="presentation" class="{baseCls}-footer">{%this.renderTodayBtn(values, out)%}</div>',
            '</tpl>',
        '</div>',
        {
            firstInitial: function(value) {
                return Ext.picker.Date.prototype.getDayInitial(value);
            },
            isEndOfWeek: function(value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },
            renderTodayBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
            },
            renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            }
        }
    ],
	renderTplOld: [
		'<div id="{id}-innerEl" role="grid">',
            '<div role="presentation" class="{baseCls}-header">',
                 // the href attribute is required for the :hover selector to work in IE6/7/quirks
                '<tpl if="showPrevArrow">',
					'<a id="{id}-prevEl" class="{baseCls}-prev {baseCls}-arrow" href="#" role="button" title="{prevText}" hidefocus="on" ></a>',
				'</tpl>',
                '<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>',
                 // the href attribute is required for the :hover selector to work in IE6/7/quirks
                '<tpl if="showNextArrow">',
                    '<a id="{id}-nextEl" class="{baseCls}-next {baseCls}-arrow" href="#" role="button" title="{nextText}" hidefocus="on" ></a>',
                '</tpl>',
            '</div>',
        '<table id="{id}-eventEl" data-ref="eventEl" class="{baseCls}-inner" cellspacing="0" role="grid">',
                '<thead role="presentation"><tr role="row">',
                    '<tpl for="dayNames">',
                        '<th role="columnheader" class="{parent.baseCls}-column-header" title="{.}">',
                            '<div class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
                        '</th>',
                    '</tpl>',
                '</tr></thead>',
                '<tbody role="presentation"><tr role="row">',
                    '<tpl for="days">',
                        '{#:this.isEndOfWeek}',
                        '<td role="gridcell" id="{[Ext.id()]}">',
                            // the href attribute is required for the :hover selector to work in IE6/7/quirks
                            '<a role="button" hidefocus="on" class="{parent.baseCls}-date" href="#"></a>',
                        '</td>',
                    '</tpl>',
                '</tr></tbody>',
            '</table>',
            '<tpl if="showToday">',
                '<div id="{id}-footerEl" role="presentation" class="{baseCls}-footer">{%this.renderTodayBtn(values, out)%}</div>',
            '</tpl>',
        '</div>',

        {
            firstInitial: function(value) {
                return Ext.picker.Date.prototype.getDayInitial(value);
            },
            isEndOfWeek: function(value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },
            renderTodayBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
            },
            renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            }
        }
    ],

    /**
     * @private
     * @ineritdoc
     */
    initEvents: function(){
        var me = this,
            eDate = Ext.Date,
            day = eDate.DAY;

        //If the prev or next arrow is not rendered, we don't need to apply click handlers
        if(me.showPrevArrow) {
            me.prevRepeater = new Ext.util.ClickRepeater(me.prevEl, {
                handler: me.showPrevMonth,
                scope: me,
                preventDefault: true,
                stopDefault: true
            });
        }

        if(me.showNextArrow) {
            me.nextRepeater = new Ext.util.ClickRepeater(me.nextEl, {
                handler: me.showNextMonth,
                scope: me,
                preventDefault:true,
                stopDefault:true
            });
        }

        //todo
        if (me.showToday) {
            me.todayKeyListener = me.eventEl.addKeyListener(Ext.EventObject.SPACE, me.displayToday,  me);

            /* (Extjs5 code)  me.todayKeyListener = me.eventEl.addKeyListener(
                Ext.event.Event.prototype.SPACE, me.showToday,  me
            );*/
        }
        me.update(me.value);
    },

    /**
     * Show the previous month. Updates all calendars accordingly.
     * @param {Object} e
     * @return {Ext.picker.Date} this
     */
    showPrevMonth: function(e, forwardMonth){
        var me=this,
            j = 0,
            calendar;

        if(!Ext.isNumber(forwardMonth)) forwardMonth = 1;
        for(;j < me.daterange.calendars.length; j++) {
            calendar=me.daterange.calendars[j];
            calendar.setValue(Ext.Date.add(calendar.activeDate, Ext.Date.MONTH, -1 * forwardMonth));
        }
    },

    /**
     * Show the next month.  Updates all calendars accordingly.
     * @param {Object} e
     * @return {Ext.picker.Date} this
     */
    showNextMonth: function(e, forwardMonth){
        var me=this,
            j = 0,
            calendar;

        if(!Ext.isNumber(forwardMonth)) forwardMonth = 1;
        for(;j < me.daterange.calendars.length; j++) {
            calendar=me.daterange.calendars[j];
            calendar.setValue(Ext.Date.add(calendar.activeDate, Ext.Date.MONTH, 1 * forwardMonth));
        }
    },

    /**
     * Show the previous year.  Updates all calendars accordingly.
     * @param {Object} e
     * @return {Ext.picker.Date} this
     */
    showPrevYear: function(e){
        var me=this,
            j = 0,
            calendar;

        for(;j < me.daterange.calendars.length; j++) {
            calendar=me.daterange.calendars[j];
            calendar.setValue(Ext.Date.add(calendar.activeDate, Ext.Date.YEAR, -1));
        }
    },

    /**
     * Show the next month.  Updates all calendars accordingly.
     * @param {Object} e
     * @return {Ext.picker.Date} this
     */
    showNextYear: function(e){
        var me=this,
            j = 0,
            calendar;

        for(;j < me.daterange.calendars.length; j++) {
            calendar=me.daterange.calendars[j];
            calendar.setValue(Ext.Date.add(calendar.activeDate, Ext.Date.YEAR, 1));
        }
    },

    /**
     * Respond to an ok click on the month picker
     * @private
     */
    onOkClick: function(picker, value) {
        var me = this,
            month = value[0],
            year = value[1],
            date = new Date(year, month, me.getActive().getDate()),
            j = 0,
            startValue = 0,
            calendar;

        if (date.getMonth() !== month) {
            // 'fix' the JS rolling date conversion if needed
            date = Ext.Date.getLastDateOfMonth(new Date(year, month, 1));
        }

        me.daterange.displayDate(date, me.calendarIndex);
        me.hideMonthPicker();
    },

    /**
     * Respond to a date being clicked in the picker
     * @private
     * @param {Ext.EventObject} e
     * @param {HTMLElement} t
     */
    handleDateClick : function(e, t){
        var me = this,
            handler = me.handler;

        e.stopEvent();
        if(!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)){
            me.doCancelFocus = me.focusOnSelect === false;
            me.daterange.setValue(new Date(t.dateValue));
            delete me.doCancelFocus;
            me.fireEvent('select', me, me.daterange.value.startDate);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            // event handling is turned off on hide
            // when we are using the picker in a field
            // therefore onSelect comes AFTER the select
            // event.
            me.onSelect();
        }
    },

    /**
     * Show today in the current calendar
     * All other calendars will be updated accordingly.
     * This method does NOT set the value. It changes only the diplayed month.
     * @return {Ext.picker.Date} this
     */
    selectToday : function(){
        var me = this,
            btn = me.todayBtn,
            handler = me.handler;

        if(btn && !btn.disabled){
            me.daterange.displayDate(Ext.Date.clearTime(new Date()),me.calendarIndex);
        }

        return me;
    },


    /**
     * Update the contents of the picker for a new month
     * @private
     * @param {Date} date The new date
     */
    fullUpdate: function(date) {
        var me = this,
            cells = me.cells.elements,
            textNodes = me.textNodes,
            disabledCls = me.disabledCellCls,
            eDate = Ext.Date,
            i = 0,
            extraDays = 0,
            visible = me.isVisible(),
            newDate = +eDate.clearTime(date, true),
            newDateRange,
            today = +eDate.clearTime(new Date()),
            min = me.minDate ? eDate.clearTime(me.minDate, true) : Number.NEGATIVE_INFINITY,
            max = me.maxDate ? eDate.clearTime(me.maxDate, true) : Number.POSITIVE_INFINITY,
            ddMatch = me.disabledDatesRE,
            ddText = me.disabledDatesText,
            ddays = me.disabledDays ? me.disabledDays.join('') : false,
            ddaysText = me.disabledDaysText,
            format = me.format,
            days = eDate.getDaysInMonth(date),
            firstOfMonth = eDate.getFirstDateOfMonth(date),
            startingPos = firstOfMonth.getDay() - me.startDay,
            previousMonth = eDate.add(date, eDate.MONTH, -1),
            longDayFormat = me.longDayFormat,
            prevStart,
            current,
            disableToday,
            tempDate,
            setCellClass,
            html,
            cls,
            formatValue,
            value,
            hide;

        if (startingPos < 0) {
            startingPos += 7;
        }

        if(Ext.isEmpty(me.daterange)) {
            newDateRange = {startDate: null, endDate:null};
        } else {
            newDateRange =  {
                startDate: Ext.isEmpty(me.daterange.value) ? null : +eDate.clearTime(me.daterange.value.startDate),
                endDate: Ext.isEmpty(me.daterange.value) ?  null :
                    Ext.isEmpty(me.daterange.value.endDate) ? null : +eDate.clearTime(me.daterange.value.endDate)
            };
        }

        days += startingPos;
        prevStart = eDate.getDaysInMonth(previousMonth) - startingPos;
        current = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), prevStart, me.initHour);

        //First and last calendar don't have today button
        if (me.showToday) {
            tempDate = eDate.clearTime(new Date());
            disableToday = (tempDate < min || tempDate > max ||
                (ddMatch && format && ddMatch.test(eDate.dateFormat(tempDate, format))) ||
                (ddays && ddays.indexOf(tempDate.getDay()) != -1));

            if (!me.disabled) {
                me.todayBtn.setDisabled(disableToday);
                me.todayKeyListener.setDisabled(disableToday);

            }
        }

        setCellClass = function(cell, cls, hide){
            value = +eDate.clearTime(current, true);

            if(hide) {
                Ext.DomHelper.applyStyles(cell, "visibility:hidden;");
            } else {
                Ext.DomHelper.applyStyles(cell, "visibility:visible;");
            }

            cell.title = eDate.format(current, longDayFormat);
            // store dateValue number as an expando
            cell.firstChild.dateValue = value;
            if(value == today){
                cls += ' ' + me.todayCls;
                cell.title = me.todayText;

                // Extra element for ARIA purposes
                me.todayElSpan = Ext.DomHelper.append(cell.firstChild, {
                    tag:'span',
                    cls: Ext.baseCSSPrefix + 'hide-clip',
                    html:me.todayText
                }, true);
            }
            if(value > newDateRange.startDate && value < newDateRange.endDate) {
                cls += ' ' + me.selectedCls;
            }

            if(value == newDateRange.startDate) {
                cls += ' ' + me.startCls;
            }

            if(value == newDateRange.endDate) {
                if(newDateRange.endDate !== newDateRange.startDate)
                    cls += ' ' + me.endCls;
                me.fireEvent('highlightitem', me, cell);
                if (visible && me.floating) {
                    Ext.fly(cell.firstChild).focus(50);
                }
            }

            if (value < min) {
                cls += ' ' + disabledCls;
                cell.title = me.minText;
            }
            else if (value > max) {
                cls += ' ' + disabledCls;
                cell.title = me.maxText;
            }
            else if (ddays && ddays.indexOf(current.getDay()) !== -1){
                cell.title = ddaysText;
                cls += ' ' + disabledCls;
            }
            else if (ddMatch && format){
                formatValue = eDate.dateFormat(current, format);
                if(ddMatch.test(formatValue)){
                    cell.title = ddText.replace('%0', formatValue);
                    cls += ' ' + disabledCls;
                }
            }
            cell.className = cls + ' ' + me.cellCls;
        };

        for(; i < me.numDays; ++i) {
            if (i < startingPos) {
                html = (++prevStart);
                cls = me.prevCls;
                hide = me.calendarIndex !==0;
            } else if (i >= days) {
                html = (++extraDays);
                cls = me.nextCls;
                hide = me.calendarIndex !== (me.daterange.numberOfCalendars-1);
            } else {
                html = i - startingPos + 1;
                cls = me.activeCls;
                hide = false;
            }
            textNodes[i].innerHTML = html;
            current.setDate(current.getDate() + 1);
            setCellClass(cells[i], cls, hide);
        }

        me.monthBtn.setText(Ext.Date.format(date, me.monthYearFormat));
    },

    /**
     * Due a bug in the extjs5 beta version I am using, I have to override this function.
     * @returns {Array}
     */
    getRefItems: function() {
        var results = [];
        if (this.rendered) {
            this.monthBtn && results.push(this.monthBtn);
            this.todayBtn && results.push(this.todayBtn);
        }
        return results;
    }



});
 
Ext.define('Ext.ux.daterange.util.Date', {

    singleton: true,

    diffDays: function(start, end) {
        var day = 1000 * 60 * 60 * 24,
            clear = Ext.Date.clearTime,
            diff = clear(end, true).getTime() - clear(start, true).getTime();

        return Math.ceil(diff / day);
    },

    /**
     * This method determines which human date range startDate and endDate is. (e.g. a week, a month,...)
     *
     * e.g.: 1. January - 31. March -> return object: { isDays: false,  isWeeks: false, isMonths: true, isYears: false, count:3 };
     *  isDays: If startDate and endDate are not a week or a month or a year, then isDay will return true. Count is the difference between startDate and endDate
     *  isWeeks: startDate is on weekDayStart and endDate is on weekDayEnd. 0-based (0...Sunday, 6...Saturday)
     *  isMonths: startDate (is first day of month) endDate (is last day of month)
     *  isYears: startDate (1.1.) endDate 31. December
     *  count: The number of days/weeks/months/years
     *
     *  IMPORTANT: It is always one value true (e.g. isYears=true, isMonth=false, ...)

     * @param {Date} startDate
     * @param {Date} endDate
     * @param {Number} weekDayStart Day index at which the week should begin, 0-based. 0 default (Sunday)
     * @param {Number} weekDayEnd Day index at which the week should end, 0-based. 6 default (Saturday)
     * @returns {{isDays: boolean, isWeeks: boolean, isMonths: boolean, isYears: boolean, count: number}}  
     *      Only one parameter is true. count how often the date range is between startDate and endDate
     */
    isDateRange: function(startDate, endDate, weekDayStart, weekDayEnd) {
        var dateRange = {  isDays: false,  isWeeks: false, isMonths: false, isYears: false, count:0 };
        var me = this,
            eDate = Ext.Date,
            diff,
            dayCount;

        //clone dates
        startDate =eDate.clone(startDate);
        endDate =eDate.clone(endDate);


        if (eDate.clearTime(startDate) === eDate.clearTime(endDate) ) {
            //Same day
            dateRange.isDay = true;
            return dateRange;
        }

        //is startDate and endDate on the first and last day of a month?
        if (endDate.getDate() === eDate.getDaysInMonth(endDate) && startDate.getDate() === 1) {

            //Look if it is a year or years
            if (startDate.getMonth() === 1 && endDate.getMonth() === 11) {
                dateRange.count = endDate.getFullYear() - startDate.getFullYear() + 1;
                dateRange.isYears = true;
                return dateRange;
            }

            dateRange.count = (((endDate.getFullYear() - startDate.getFullYear()) * 12 ) + endDate.getMonth() ) - startDate.getMonth();
            dateRange.count++; //e.g. 1. Oct - 31. Oct is one month --> expected result, count=1
            dateRange.isMonths = true;
            return dateRange;
        }

        //week or weeks?
        if( !Ext.isNumber((weekDayStart))) weekDayStart = 0;
        if( !Ext.isNumber((weekDayEnd))) weekDayEnd = 6;

        if (startDate.getDay() === weekDayStart && endDate.getDay() === weekDayEnd) {

            /*
            What is a week? From Sunday to Saturday or maybe a work week from monday to saturday?

            Examples:

            st ... weekDayStart
            end... weekDayEnd
            count... expected result
            0 ... Sunday, 6 ... Saturday

            st | end | count
            0  | 6   | 7
            1  | 0   | 7
            1  | 5   | 5
            5  | 0   | 3
             */

            dayCount = ((weekDayEnd - weekDayStart) + 7) % 7 + 1;
            diff = me.diffDays(startDate, endDate) + 1;
            //calculate the number of weeks. e.g. 21 days are 3 weeks
            dateRange.count = Math.floor( diff / dayCount);
            dateRange.isWeeks = true;
            return dateRange;

        }

        dateRange.count = me.diffDays(startDate, endDate) + 1;
        dateRange.isDays = true;

        return dateRange;
    }
});

Ext.define("Ext.ux.daterange.picker.DateRange", {
    extend: 'Ext.container.Container',
    xtype: 'daterange',

    requires: [
        'Ext.ux.daterange.Date',
        'Ext.ux.daterange.util.Date'
    ],

    /**
     * @cfg {Number} numberOfCalendars - How many calendars ({@link Ext.picker.Date}) will be shown. Default to 3.
     */
    numberOfCalendars: 3,

    /**
     * @private
     * @cfg {Boolean} Defines if the next click or setVaule(date) will set the start or end date. Toggles automatically.
     */
    setStartDate: true,

    /**
     * @cfg {Number} weekDayStart - This config is only important in conjunction with {@link #selectNextDateRange}
     * or {@link #selectPreviousDateRange}
     */
    weekDayStart: 0,
    /**
     * @cfg {Number} weekDayEnd - This config is only important in conjunction with {@link #selectNextDateRange}
     * or {@link #selectPreviousDateRange}
     */
    weekDayEnd: 6,

    /**
     * @cfg {String} [baseCls='x-datepicker']
     * The base CSS class to apply to all calendars ( {@link Ext.ux.daterange.Date}).
     */
    baseDateCls: Ext.baseCSSPrefix + 'datepicker',

    /**
     * @cfg {String}
     * The base CSS class to apply to this components element.
     */
    baseCls: Ext.baseCSSPrefix + 'daterange',

    /**
     * @cfg {Object} Specifies optional extra configurations for each Ext.picker.Date. Must
     * conform to the config format recognized by the {@link Ext.picker.Date} constructor.
     *
     *  @example
     *  datePickerConfig: {
     *      minDate: new Date(2014,1,1),
     *      startDay: 1
     *  },
     */
    datePickerConfig: {},

    /**
     * @cfg {Object} keyNavConfig
     * Specifies optional custom key event handlers for the {@link Ext.util.KeyNav} attached to this date range field. Must
     * conform to the config format recognized by the {@link Ext.util.KeyNav} constructor. Handlers specified in this
     * object will replace default handlers of the same name.
     */
    /**
     * @cfg {String} overStartDateCls
     * The base CSS class for selecting the start date.
     */
     /**
     * @cfg {String} overEndDateCls
     * The base CSS class for selecting the end date.
     */

     initKeyNavArrows: false,
    /**
     * @private
     * How the calendars ({@link Ext.picker.Date}) get arranged
     */
    layout: 'hbox',

    /**
     * @private
     * @inheritdocs
     */
    initComponent: function() {
        var me = this,
            i= 0,
            items = [],
            monthAhead = -1,
            date,
            calWidth;

        if( !Ext.isEmpty(me.datePickerConfig.baseCls))
            me.baseDateCls = me.datePickerConfig.baseCls;
        
        //apply default value if necessary
        if( Ext.isEmpty(me.numberOfCalendars) || (!Ext.isNumber(me.numberOfCalendars)))
            me.numberOfCalendars = 3;

        me.overStartDateCls = me.baseDateCls + '-over-startdate';
        me.overEndDateCls   = me.baseDateCls + '-over-enddate';

        date = Ext.isEmpty(me.value) ? new Date() : me.value.startDate;
        for(i=0; i < me.numberOfCalendars; i++) {
            items.push(Ext.apply({
                xtype: 'daterangedate',
                daterange: me,  //Convenient way to access the parent
                calendarIndex: i,
                overCls: me.overStartDateCls,
                //First and last calendar have navigation arrows
                showPrevArrow: i === 0,
                showNextArrow: i === (me.numberOfCalendars-1),
                value: Ext.Date.add(date, Ext.Date.MONTH, monthAhead + i)
            }, me.datePickerConfig));
        }


        me.items = items;
        me.callParent();
        me.initRefs();

        //Start day is the same for all calendars
        me.startDay = me.calendars[0].startDay;

        me.setWidth(calWidth);

    },

    /**
     * @private
     */
    initRefs: function() {
        var me = this;

        me.calendars = me.query("> daterangedate");
    },

    /**
     * @private
     * @inheritdocs
     */
    initEvents: function() {
        if(this.initKeyNavArrows) {

            this.keyNav = new Ext.util.KeyNav(this.getEl(), Ext.applyIf( {
                scope: this,
                left : function(e){
                    if(e.ctrlKey){
                        this.moveToDateRange(-1,true);
                    } else {
                        this.selectPrevDateRange();
                    }
                },
                right : function(e){
                    if(e.ctrlKey) {
                        this.moveToDateRange(1,true);
                    } else {
                        this.selectNextDateRange();
                    }
                }
            }, this.keyNavConfig));

        }
    },

    /**
     * Gets the current selected value of the date range field
     * @return {Date} The selected date
     */
    getValue: function(value) {
        return this.value;
    },

    /**
     * Sets either the start date or the end date for the date range.
     * {@link #setStartDate} defines if the start or the end date is set.
     * You can clear the date range by calling setValue() or setValue(null).
     * @param value {Date|Object} date - {@link #setStartDate} defines if the start or the end date is set.
     *                            object - {startDate: date, endDate: date}: Start and end date are set.
     * @param silent - Don't fire events
     * @return {Object} The selected date range
     */
    setValue: function(value, silent) {
        var me = this,
            firstCal = me.calendars[0],
            lastCal = me.calendars[me.calendars.length-1],
            setBothDates = false,
            setStartDateOld = me.getSetStartDate(),
            valueOld = { startDate: null, endDate:null };

        //Init value if it is empty
        if(Ext.isEmpty(this.value)) {
            me.value = {};
            me.value.endDate = null;
            me.value.startDate = null;
        }

        valueOld.startDate = me.value.startDate;
        valueOld.endDate = me.value.endDate;

        //Reset date range if value is not a date. e.g.: setValue()
        if( ! Ext.isDate(value)) {

            //Maybe value is an object {startDate: date, endDate: date}
            //setValue( {startDate:xxxx, endDate: xxx} )
            if(value && value.startDate && value.endDate) {
                me.value.startDate = Ext.isDate(value.startDate) ?  value.startDate : null;
                me.value.endDate = Ext.isDate(value.endDate) ?  value.endDate : null;
                setBothDates = true;
            } else {
                //reset value and leave function
                me.value = null;
                me.setSetStartDate(true);
                return this.update();
            }

        } else {

            //setStartDate triggers if a start or end date is set
            if(me.setStartDate) {
                me.value.startDate = value;
                me.setSetStartDate(false);
            } else {
                me.value.endDate = value;
                me.setSetStartDate(true);
            }

            if( ! Ext.Date.between(value, Ext.Date.getFirstDateOfMonth(firstCal.getValue()), Ext.Date.getLastDateOfMonth(lastCal.getValue())) ) {
                if(value < firstCal.getValue())
                    firstCal.showPrevMonth(undefined, me.numberOfCalendars);
                else
                    lastCal.showNextMonth(undefined, me.numberOfCalendars);
            }
        }

        if(!me.validateDateRange(me.value.startDate, me.value.endDate, setStartDateOld)) {
            //not a valid date range... reset value and leave function
            me.value = valueOld;
            return me.value;
        }
        if(!silent)
            me.fireEvent('select', me, me.value, setBothDates ? 'both' : setStartDateOld ? 'start' : 'end');

        this.update();
        return me.value;
    },


    /**
     * What happens if the start date is bigger as the end date?? When should a date range be valid (e.g. maybe the
     * user has to select at minimum one week, ...)
     * Change code here, to change the behaviour.
     * @param startDate
     * @param endDate
     * @param setStartDate - true: User has set start date; false: User has set end date
     * @returns {boolean}
     */
    validateDateRange: function(startDate, endDate, setStartDate) {
        var me = this;

        //We can only validate the date range, if both dates are set!
        if(Ext.isEmpty(startDate) || Ext.isEmpty(endDate)) return true;

        /* Try which behaviour you like most */

        //Case 1: Swap dates.
        /*if(endDate !== null && (endDate < startDate)) {
            //smaller date is becoming startDate and the larger will be endDate
            var tmp = me.value.startDate;
            me.value.startDate = me.value.endDate;
            me.value.endDate = tmp;
            //We have made it valid, so we also must return true
        }*/

        //Case 2: Don't allow it
        /*if(startDate > endDate) return false;*/

        //Case 3: Set it to the same date
        if(startDate > endDate) {
            if(setStartDate) {
                endDate = startDate
            } else {
                startDate = endDate;
            }
            me.value.startDate = startDate;
            me.value.endDate = endDate;
        }

        return true;
    },

    /**
     * @private
     * Updates all calendars ({@link Ext.picker.Date}). This function must be called after the value of the date range
     * has been changed.
     * @returns {null|*}
     */
    update: function() {
        var me = this,
            calendar,
            i=0;

        /** Don't update DOM if we are not visible. */
        if( !me.isVisible() )
            return me.value;

        for (; i < me.calendars.length; i++) {
            calendar = me.calendars[i];
            calendar.fullUpdate(calendar.value, false); //ToDo also override selectedUpdate
        }

        if(me.pickerField === undefined)
            me.focus(false);
        return me.value;
    },

    setSetStartDate: function(setStartDate) {
        var me = this;

        me.setStartDate = setStartDate;
        if(setStartDate)
            me.setOverCls(me.overStartDateCls);
        else
            me.setOverCls(me.overEndDateCls);
    },

    getSetStartDate: function() {
        return this.setStartDate;
    },

    /**
     * Set the overCls name for each calendar ({@link Ext.picker.Date})
     * @param name
     */
    setOverCls: function (name) {
        var me = this,
            calendar,
            i;

        for (i=0; i < me.calendars.length; i++) {
            calendar = me.calendars[i];
            calendar.removeOverCls();
            Ext.apply(calendar, {overCls: name});
            calendar.addOverCls(name);
        }
    },

    /**
     * @private
     * Applies the necessary overrides to{@link Ext.picker.Date}
     */
    applyOverride: function() {
        var me = this,
            i=0;

        //Apply override for each instance of Ext.picker.Date (stored in this.calendars)
        for(;i < me.calendars.length; i++) {
            Ext.override(me.calendars[i], {});
        }
    },

    /**
     * @private
     * Move to next date range which is specified through direction.
     *
     * e.g.: date range: 1. May - 31. May; moveToDateRange(1) -> date range: 1. June - 30. June
     *
     * This method is looking for human date ranges (like month, year, week,...) and moves the date range therefore in the right direction.
     *
     * A week can be very special (e.g. from Sunday - Saturday or from Monday to Friday (workweek),...
     * To specify what is a week for you, you can set weekDayStart and weekDayEnd (0-based; 0 ... Sunday)
     *
     * @param direction - 1 or -1 (forward or backward)
     * @returns {*}
     */
    moveToDateRange: function(direction, fastForward) {
        var me = this,
            uDate = Ext.ux.daterange.util.Date,
            daterange,
            forward = 1,
            add = 0,
            diffDateRange,
            diffCalendar,
            firstCalendar = me.calendars[0],
            lastCalendar = me.calendars[me.calendars.length-1];

        if(!Ext.isNumber(direction)) direction = 1;
        if(!Ext.isBoolean(fastForward)) fastForward = false;

        if(Ext.isEmpty(me.value) || Ext.isEmpty(me.value.endDate)) return;

        daterange = uDate.isDateRange(me.value.startDate,me.value.endDate, me.weekDayStart, me.weekDayEnd);
        daterange.count *= direction;

        if(daterange.isDays) {
            add = daterange.count;
            if(fastForward) {
                if(Math.abs(daterange.count) < 7)
                    add = 7 * direction; //fastForward: e.g. Monday 5.5. is selected -> Fast forward: Monday 12.5. is selected
                else
                    add = daterange.count * 2;
            }
            me.value.startDate = Ext.Date.add(me.value.startDate,Ext.Date.DAY, add);
            me.value.endDate = Ext.Date.add(me.value.endDate,Ext.Date.DAY, add);
        }

        if( daterange.isWeeks) {
            if(fastForward) add = 4 * direction * 7; //jump one month forward
            me.value.startDate = Ext.Date.add(me.value.startDate,Ext.Date.DAY, add === 0 ? 7 * daterange.count : add);
            me.value.endDate = Ext.Date.add(me.value.endDate,Ext.Date.DAY, add === 0 ? 7 * daterange.count : add);
        }

        if(daterange.isMonths) {
            if(fastForward) add = 12 * direction;
            me.value.startDate = Ext.Date.add(me.value.startDate,Ext.Date.MONTH, add === 0 ? daterange.count : add);
            me.value.endDate = Ext.Date.add(me.value.endDate,Ext.Date.MONTH, add === 0 ?  daterange.count : add);
            me.value.endDate = Ext.Date.getLastDateOfMonth(me.value.endDate);
        }

        if(daterange.isYears) {
            if(fastForward) add = 10 * direction;
            me.value.startDate = Ext.Date.add(me.value.startDate,Ext.Date.YEAR, add === 0 ? daterange.count : add);
            me.value.endDate = Ext.Date.add(me.value.endDate,Ext.Date.YEAR, add === 0 ? daterange.count : add);
        }

        //Look if date range is smaller as the displayed date range (first date from first calendar to last date of last calendar)
        if(me.isVisible()) {
            diffDateRange = Ext.ux.daterange.util.Date.diffDays(me.value.startDate,me.value.endDate);
            diffCalendar = Ext.ux.daterange.util.Date.diffDays(
                Ext.Date.getFirstDateOfMonth(firstCalendar.getValue()),
                Ext.Date.getLastDateOfMonth(lastCalendar.getValue()));

            if( diffCalendar > diffDateRange) {
                //The whole date range can be displayed across all calendars

                if(direction >= 1) { //We are moving forward
                    if(me.value.startDate >= Ext.Date.getFirstDateOfMonth(lastCalendar.getValue()) )
                        lastCalendar.showNextMonth(undefined, Math.ceil(diffDateRange / 30));
                } else { //We are moving backwards
                    if(me.value.endDate <= Ext.Date.getLastDateOfMonth(firstCalendar.getValue()) )
                        firstCalendar.showPrevMonth(undefined, Math.ceil(diffDateRange / 30));
                }
                if(fastForward) {
                    me.displayDate(me.value.startDate, 0);
                }
            } else {
                if(direction >= 1) {
                    me.displayDate(me.value.startDate, 0);
                } else {
                    me.displayDate(me.value.endDate, me.numberOfCalendars -1);
                }
            }
        }

        me.fireEvent('select', me, me.value, me.setStartDate);

        return me.update();

    },

    /**
     * Moves the current selected date range forward.
     * This method recognize human date ranges (e.g. months, years, weeks, ...) and moves the date range according to this date range forward
     * E.g.: current selected date range:
     *      value: 1. feb - 28. feb;
     *      after selectNextDateRange():
     *      value: 1. mar - 31. mar
     *
     * What is week? Is it from sunday to saturday, or from monday to sunday? What is if the user want to select a workweek from monday to friday?)
     * To specify what is a week in your application, you can set {@link #weekDayStart) and {@link #weekDayEnd) (0-based; 0 ... Sunday)
     * This means if a week is selected and you call selectNextDateRange() the next week will be selected.
     *
     * e.g.: weekDayStart: 1 (monday) / weekDayEnd: 5 (friday)
     * value: Mo, 5. May - Fr, 9. May; -> expected result: Mo, 12. May - Fr, 16. May
     * value: Mo, 5. May - Fr, 16. May; -> expected result: Mo, 19. May - Fr, 30. May
     *
     * If no year, month or week is recognized, the difference of the days between start and end date will be moved forward.
     * weekDayStart: 0 (sunday) / weekDayEnd: 6 (saturday)
     * value: Mo, 5. May - Fr, 9. May; -> expected result: Sa, 10. May - We, 14. May
     * value: Mo, 5. May - Fr, 16. May; -> expected result: Sa, 17. May - We, 28. May
     *
     * With the default configuration you can move with the left and right arrow key the selected date range forward
     * and backwards.
     *
     * @returns {Object} - current date range
     */
    selectNextDateRange: function() {
        return this.moveToDateRange(1);
    },

    /**
     * Same as {@link selectNextDateRange} but only in the other direction.
     * @returns {*}
     */
    selectPrevDateRange: function() {
        return this.moveToDateRange(-1);
    },

    /**
     * Display the date in the specified calendar. This method does not set the value for the date range.
     * It only specifies the month and year which will be shown in the calendars (Ext.picker.Date)
     * @param date - The date which you want to show.
     * @param calendarIndex - 0-based.
     */
    displayDate: function(date, calendarIndex) {
        var me = this,
            startValue = 0,
            i=0;

        startValue -= calendarIndex;

        for(;i < me.calendars.length; i++) {
            calendar=me.calendars[i];
            calendar.setValue(Ext.Date.add(date, Ext.Date.MONTH, startValue + i ));
        }

        return true;

    },

    listeners: {
        afterlayout: function(daterange, eOpts) {
            var me = daterange;
            if(me.getWidth() !== me.totalWidth)
                me.setWidth(me.totalWidth);
        },

        afterrender: function(daterange, eOpts) {
            var me = daterange,
                totalWidth = 0,
                i=0;

            for(i=0; i < me.numberOfCalendars; i++) {
                totalWidth += me.calendars[i].getWidth();
            }

            me.totalWidth = totalWidth;
        }
    }

});

Ext.define('Ext.ux.daterange.field.DateRange', {
    extend:'Ext.form.field.Picker',
    xtype: 'daterangefield',
    requires: ['Ext.ux.daterange.picker.DateRange'],

    //<locale>
    /**
     * @cfg {String} format
     * The default date format string which can be overriden for localization support. The format must be valid
     * according to {@link Ext.Date#parse}.
     */
    format : "m/d/Y",
    //<locale>
    /**
     * @cfg {String} altFormats
     * Multiple date formats separated by "|" to try when parsing a user input value and it does not match the defined
     * format.
     */
    altFormats : "m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|j.n.|d.n.|j.m.|d.m.|m-d|md|mdy|mdY|j|d|Y-m-d|n-j|n/j|d.m.Y|d.m.y|j.n.y|j.n.Y|n.y|n.Y",
    //</locale>

    /**
     * @cfg {String} specialFormats - This are shortcuts, for selecting a date range only with one date!
     * E.g. 4/2014 or 4/14-> 1. april to 30. april
     * 2014 -> 1/1/2014 to 12/1/2014
     * 5/13/2014 -> 31. May 2014 is selected (Start date and end date are set to 5/13/2014)
     * CW 30 -> calendar week 30 will be selected. For localization the parameter can be overriden {@link #calendarWeekShortcut}
     *
     * The format must be valid according to {@link Ext.Date#parse}
     */
    specialFormats: 'n/Y|n/y|m/Y|m/y|Y|j|d|j.n.|d.n.|j.m.|d.m.|m.y|m.Y|n.y|n.Y|d.m.y|j.n.y|d.m.Y|j.n.Y|d.n.y|d.n.Y',

    /**
     * Prefix for selecting one calendar week.
     *
     * E.g. CW 30 -> calendar week 30 will be selected form {@link weekDayStart} to {@link weekDayEnd}.
     */
    calendarWeekShortcut: 'CW',

    /**
     * @cfg {String} startDateFormat -
     * You can override {@link #format} to give the start date a special format.
     * Default to **undefined** ({@link #format} is used)
     */
    startDateFormat: undefined,

    /**
     * @cfg {String} endDateFormat -
     * You can override {@link #format} to give the end date a special format.
     * Default to **undefined** ({@link #format} is used)
     */
    endDateFormat: undefined,

    /**
     * @cfg {String}
     * Delimiter between start and end date. Default to '-'.
     * E.g: 4/18/2012 - 4/23/2012
     */
    startEndDateDelimiter: '-',

    //</locale>
    // in the absence of a time value, a default value of 12 noon will be used
    // (note: 12 noon was chosen because it steers well clear of all DST timezone changes)
    initTime: '12', // 24 hour format

    initTimeFormat: 'H',

    //<locale>
    /**
     * @cfg {Number} [startDay=undefined]
     * Day index at which the week should begin, 0-based.
     *
     * Defaults to `0` (Sunday).
     */
    startDay: 0,
    //</locale>

    /**
     * @cfg {Number} weekDayStart - This config is only important in conjunction with {@link #selectNextDateRange}
     * or {@link #selectPreviousDateRange}
     */
    weekDayStart: 0,
    /**
     * @cfg {Number} weekDayEnd - This config is only important in conjunction with {@link #selectNextDateRange}
     * or {@link #selectPreviousDateRange}
     */
    weekDayEnd: 6,

    matchFieldWidth: false,

    /**
     * @cfg {string} How the picker gets aligned. Default to: t-b?
     */
    pickerAlign : 't-b?',

    initComponent : function() {
        var me = this;
        me.startDateFormat = Ext.isEmpty(me.startDateFormat) ? me.format : me.startDateFormat;
        me.endDateFormat = Ext.isEmpty(me.endDateFormat) ? me.format : me.endDateFormat;
        me.callParent();
    },

    initEvents: function() {
        var me = this;

        me.callParent();

        this.keyNav = new Ext.util.KeyNav(this.getEl(),Ext.applyIf( {
            scope: this,
            left : function(e){
                if(e.ctrlKey){
                    this.getPicker().moveToDateRange(-1,true);
                } else {
                    this.getPicker().selectPrevDateRange();
                }
            },
            right : function(e){
                if(e.ctrlKey) {
                    this.getPicker().moveToDateRange(1,true);
                } else {
                    this.getPicker().selectNextDateRange();
                }
            }
        }, this.keyNavConfig));

    },

    /**
     * @private
     * @override
     * @returns {Ext.ux.daterange.picker.DateRange}
     */
    createPicker: function() {
        var me = this,
            daterangeConfig;

        daterangeConfig = ({
            pickerField: me,
            floating: true,
            focusOnShow: true,
            weekDayStart: me.weekDayStart,
            weekDayEnd: me.weekDayEnd,
            value: me.value,
            listeners: {
                scope: me,
                select: me.onSelect
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }

         });
        if(me.numberOfCalendars !== undefined)
            daterangeConfig.numberOfCalendars = me.numberOfCalendars;
        if(me.datePickerConfig !== undefined)
            daterangeConfig.datePickerConfig = me.datePickerConfig;
        return new Ext.ux.daterange.picker.DateRange(daterangeConfig);
    },

    /**
     * @override
     * @param rawValue
     * @returns {*|null}
     */
    rawToValue: function(rawValue) {
        var value = this.parseDate(rawValue) || rawValue || null;

        return value;
    },

    /**
     * @private
     * @overridden
     * @param value
     * @returns {string}
     */
    valueToRaw: function(value) {
        return this.formatDate(this.parseDate(value));
    },

    /**
     * @private
     * Formats start and end date in the text field
     * @param value
     * @returns {string}
     */
    formatDate : function(value){
        var me = this,
            val = "";

        if (value && Ext.isDate(value.startDate)) {
            val = Ext.Date.dateFormat(value.startDate, me.startDateFormat) + " " + me.startEndDateDelimiter + " ";
        }
        if (value && Ext.isDate(value.endDate)) {
            val += Ext.Date.dateFormat(value.endDate, me.endDateFormat);
        }
        return val;
    },

    /**
     * @private
     */
    parseDate : function(value) {
        if(!value || (Ext.isDate(value.startDate) || Ext.isDate(value.endDate)) ){
            return value;
        }

        var me = this,
            dates,
            dateRange = {},
            altFormats = me.altFormats,
            specialFormats = me.specialFormats,
            specialDate,
            parseAltFormats;

        //if value is a string, we have to split the string and then try to parse each token into a valid date
        if(Ext.isString(value)) {
            dates = value.split(me.startEndDateDelimiter);
            dateRange.startDate = me.safeParse(dates[0].trim(), me.startDateFormat);
            dateRange.endDate = me.safeParse(dates[1] ? dates[1].trim() : " ", me.endDateFormat);
        }

        //function for trying alternative date formats
        parseAltFormats = function(formatArray, value) {
            var val,
                i= 0,
                altFormatArray = formatArray.split("|"),
                len = altFormatArray.length;

            for (; i < len && !val; ++i) {
                val = me.safeParse(value, altFormatArray[i]);
            }
            return {format: altFormatArray[i-1], value: val};
        };

        if (!dateRange.startDate && altFormats) {
            dateRange.startDate = parseAltFormats(altFormats, dates ? dates[0].trim() : null || value.startDate || " ").value;

            //Try to parse special dates
            if(dates.length === 1 && specialFormats) {
                specialDate = parseAltFormats(specialFormats, dates[0]);
                dateRange = me.getSpecialDate(specialDate.format, specialDate.value);
            }
        }
        if (dateRange && !dateRange.endDate && altFormats) {
            dateRange.endDate = parseAltFormats(altFormats,
                dates[1] ? dates[1].trim() : null ||
                value.endDate ? value.endDate : null || " ").value;
        }

        //Override toString function! This is important to compare values
        if(dateRange) dateRange.toString = function() {return (this.startDate?this.startDate: " ") +" "+ (this.endDate ? this.endDate : " ")};
        return dateRange;
    },

    /**
     * @private
     * @param date {Date}
     * @param format {String}
     * @returns {{startDate: Date, endDate: Date}}
     */
    getSpecialDate: function(format, date) {
        if(Ext.isEmpty(format) || !Ext.isDate(date)) return null;

        var me = this,
            hasYear = format.match("y|Y") ? true : false,
            hasMonth = format.match("m|n|M|F") ? true : false,
            hasDay = format.match("d|j") ? true : false,
            eDate = Ext.Date,
            daterange = {};

        if(hasDay) {
            daterange.startDate = daterange.endDate = date;
            return daterange;
        }

        if(hasMonth) {
            daterange.startDate = eDate.clone(date);
            daterange.startDate.setDate(1);
            daterange.endDate = eDate.clone(date);
            daterange.endDate.setDate(eDate.getDaysInMonth(date));
            return daterange;
        }

        if(hasYear) {
            daterange.startDate = eDate.clone(date);
            daterange.startDate.setDate(1);
            daterange.startDate.setMonth(0);
            daterange.endDate = eDate.clone(date);
            daterange.endDate.setMonth(11);
            daterange.endDate.setDate(31);
            return daterange;
        }

        return daterange
    },

    /**
     * Attempts to parse a given string value using a given {@link Ext.Date#parse date format}.
     * @param {String} value The value to attempt to parse
     * @param {String} format A valid date format (see {@link Ext.Date#parse})
     * @return {Date} The parsed Date object, or null if the value could not be successfully parsed.
     */
    safeParse : function(value, format) {
        var me = this,
            utilDate = Ext.Date,
            result = null,
            strict = me.useStrict,
            parsedDate;

        if (utilDate.formatContainsHourInfo(format)) {
            // if parse format contains hour information, no DST adjustment is necessary
            result = utilDate.parse(value, format, strict);
        } else {
            // set time to 12 noon, then clear the time
            parsedDate = utilDate.parse(value + ' ' + me.initTime, format + ' ' + me.initTimeFormat, strict);
            if (parsedDate) {
                result = utilDate.clearTime(parsedDate);
            }
        }
        return result;
    },

    /**
     * If a date inside a datepicker gets selected, we set the value and call the select event
     * @param picker
     * @param value
     * @param whichDateWasSet
     */
    onSelect: function(picker, value, whichDateWasSet) {
        var me = this;

        //Prevent circling around...
        //select event was fired from Ext.ux.daterange.picker.DateRange (setValue() )
        //If we wouldn't stop it, than our change-listner would set the value (this.getPicker().setValue(xxx) ) again

        me.suspendCheckChange = 1;
        me.setValue(value);
        me.suspendCheckChange = 0;
        me.fireEvent('select', me, value, whichDateWasSet);
    },

    /**
     * Value inside the text field has changed
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    onChange: function (newValue, oldValue, eOpts) {
        var me = this;
        //Tell the picker (Ext.ux.DateRange) that we have a new value!
        if(me.getPicker() !== undefined && (Ext.isObject(newValue) || Ext.isEmpty(newValue)))
            me.getPicker().setValue(newValue, true);
    },


    /**
     * @private
     * Sets the Date picker's value to match the current field value when expanding.
     */
    onExpand: function() {
        var me = this,
            val = me.getValue(),
            picker = me.getPicker(),
            firstCalendar = picker.calendars[0],
            firstCalDate =  Ext.Date.getFirstDateOfMonth(firstCalendar.getValue()),
            lastCalendar = picker.calendars[picker.calendars.length-1],
            lastCalDate = Ext.Date.getLastDateOfMonth(lastCalendar.getValue()),
            eDate = Ext.Date;

        //Update calendars
        me.getPicker().update(); //Updates the selection

        //Update which month is shown in the calendar
        if(  (Ext.isEmpty(val) || ( !(Ext.isDate(val.startDate) && Ext.isDate(val.endDate)) )) === false )
            if( ! (eDate.between(val.startDate,firstCalDate,lastCalDate) || eDate.between(val.endDate,firstCalDate,lastCalDate))) {
                me.getPicker().displayDate(val.startDate,0);
            }
    },

    /**
     * @private
     * Focuses the field when collapsing the Date picker.
     */
    onCollapse: function() {
        this.focus(false, 60);
    }
});

/**
 * An extension for Ext.ux.field.DateRange
 * This class provides a sidepanel with datepickers and a combo box where you can predefine special date ranges.
 */
Ext.define("Ext.ux.daterange.field.DateRangeSelection",{
    extend: "Ext.ux.daterange.field.DateRange",
    alias: "widget.daterangeselection",

    requires: [
        'Ext.ux.daterange.field.DateRange'
    ],

    startDateText: 'Start date',
    endDateText: 'End date',
    selectStartDateText: 'Select a start date',
    selectEndDateText: 'Select an end date',

    /**
     * @cfg {Function} handlerBtnApply
     * A function called when the apply button is clicked (can be used instead of click event).
     * @cfg {Ext.button.Button} handler.button This button.
     * @cfg {object} value - The current date range.
     * @cfg {Ext.EventObject} handler.e The click event.
     */
    /**
     * @cfg {Function} handlerBtnCancel
     * A function called when the cancel button is clicked (can be used instead of click event).
     * @cfg {Ext.button.Button} handler.button This button.
     * @cfg {Ext.EventObject} handler.e The click event.
     */

    /**
     * @overridden
     * @private
     */
    initComponent: function() {
        var me = this,
            picker;

        me.baseCls = Ext.baseCSSPrefix + 'daterange';
        //handle selection (user has selected a start or an end date)
        me.on("select", me.onDateRangeSelect, me);
        //create store for combo box
        me.dateRangesStore = Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'scope', 'selectDateRange'],
            data : me.dateRangeItems()
        });
        //datePickerConfig: showToday -> default to 'false' (hide today btn under the calendars).
        //-> we add 'today' btn at the side panel
        if(me.datePickerConfig === undefined) me.datePickerConfig = {};
        me.datePickerConfig = Ext.applyIf( { showToday: false }, me.datePickerConfig );
        me.callParent();

        /*  We are adding start, end date picker and 'Apply' button to the side */
        picker = me.getPicker();
        picker.add(me.dateRangeSelectionItemsConfig());

        //oldValue: If user change the daterange, and clicks the 'cancel' btn, we restore the value from 'oldValue'
        me.oldValue = me.value;

        me.initRefs();
    },

    /**
     * @private
     * Define and apply references
     */
    initRefs: function() {
        var me = this;

        me.sidebarTitle = me.picker.down('container[itemId=' + me.id + '-sidepanel-title]');
        me.startDateContainer = me.picker.down('fieldcontainer[itemId=' + me.id + '-startContainer]');
        me.endDateContainer = me.picker.down('fieldcontainer[itemId=' + me.id + '-endContainer]');
        me.startDate = me.startDateContainer.down('datefield');
        me.endDate = me.endDateContainer.down('datefield');
        me.nextButton = me.picker.down('button[itemId=' + me.id + '-next]');
        me.prevButton = me.picker.down('button[itemId=' + me.id + '-previous]');

    },

    /**
     * @private
     * Config for the extra items which are added to {@link Ext.ux.field.DateRange}
     */
    dateRangeSelectionItemsConfig: function() {
        var me = this;
        return {
            baseCls: me.baseCls + '-sidepanel',
            layout: {
                type: 'vbox',
                pack: 'top'
            },
            height: '100%',
            width: 222,

            items: [{
             //Header
                xtype: 'container',
                itemId: me.id + '-sidepanel-title',
                html: me.selectStartDateText,
                height:26,
                width: '100%',
                border: '0 0 1 0',
                cls: me.baseCls + '-sidepanel-title'
            },{
                xtype: 'container',
                flex:2,

                layout: {
                    type: 'hbox'
                },

                items: [{
                    xtype: 'button',
                    itemId: me.id + '-previous',
                    margin: '10 0 10 0',
                    height: '100%',
                    cls: me.baseCls + '-sidepanel-btn',
                    disabled: true,
                    listeners: {
                        scope: this,
                        click: function() {
                            this.getPicker().selectPrevDateRange();
                        }
                    },
                    text: '<'
                },
                    me.dateRangeSelectionInnerItemsConfig(),
                {
                    xtype: 'button',
                    itemId: me.id + '-next',
                    margin: '10 0 10 0',
                    height: '100%',
                    text: '>',
                    cls: me.baseCls + '-sidepanel-btn',

                    disabled: true,
                    listeners: {
                        scope: this,
                        click: function() {
                            this.getPicker().selectNextDateRange();
                        }
                    }
                }]
            }]
        };
    },

    /**
     * @private
     * Cofig for the extra items which are added to {@link Ext.ux.field.DateRange}
     * @returns {}
     */
    dateRangeSelectionInnerItemsConfig: function() {
        var me = this;
        return {
            xtype: 'container',
            height: '100%',
            width: 150,

            layout: {
                type: 'vbox',
                pack: 'top'
            },

            defaults: {
                layout: 'hbox'
            },
            items: [{ //start date selection
                xtype: 'fieldcontainer',
                itemId: me.id + '-startContainer' ,
                baseCls: me.baseCls + '-start',
                cls: me.baseCls + '-active ' + me.baseCls + '-sidepanel-item',
                width: '100%',
                listeners: {
                    scope: this,
                    render: function(c){
                        c.el.on('click', function(a,e) {
                            this.onDateRangeSelect(this, null, 'end');
                        }, this);
                    }},
                items: [{
                    xtype: 'container',
                    margin: '9 5 8 5',
                    width: 15,
                    height: '100%',
                    baseCls: me.baseCls + '-start-inner '
                },{
                    xtype: 'datefield',
                    itemId: me.id + '-startDate',
                    width: 110,
                    margin: '6 3 6 3',
                    format: me.format,
                    emptyText: me.startDateText,
                    hideOnSelect: true,
                    listeners: {
                        scope: me,
                        select: me.onDateSelect,
                        focus: me.onDateFocus
                    }
                }]
            },{ //end date selection
                xtype: 'fieldcontainer',
                itemId: me.id + '-endContainer',
                baseCls: me.baseCls + '-end',
                cls: me.baseCls + '-disabled ' + me.baseCls + '-sidepanel-item',
                width: '100%',
                listeners: {
                    scope: this,
                    render: function(c){
                        c.el.on('click', function(a,e) {
                            this.onDateRangeSelect(this, null, 'start');
                        }, this);
                    }},
                items: [{
                    xtype: 'container',
                    margin: '9 5 8 5',
                    width: 15,
                    height: '100%',
                    baseCls: me.baseCls + '-end-inner'
                },{
                    xtype: 'datefield',
                    itemId: me.id + '-endDate',
                    hideOnSelect: true,
                    width: 110,
                    margin: '6 5 6 3',
                    format: me.format,
                    emptyText: me.endDateText,
                    listeners: {
                        scope: me,
                        select: me.onDateSelect,
                        focus: me.onDateFocus
                    }
                }]
            },{
                xtype: 'combo',
                emptyText: 'Date range',
                height: 16,
                fieldStyle: 'min-height: 16px; height: 16px;',
                labelCls: me.baseCls + '-label',
                cls: me.baseCls + '-sidepanel-combo ' + me.baseCls + '-sidepanel-item',
                editable: false,
                width: '100%',
                listConfig: {
                    cls: me.baseCls + '-list-items'
                },
                store: me.dateRangesStore,
                displayField: 'name',
                listeners: {
                    scope: this,
                    select: function(combo, records, eOpts) {
                        var record = records.length >= 1 ? records[0] : null,
                            selectFct,
                            scope;

                        if(record === null) return;

                        //Execute function to select the desired date range
                        selectFct = record.get("selectDateRange");
                        scope = record.get("scope");

                        if(typeof selectFct === 'function')
                            selectFct.call(scope);
                    }
                }
            },{ //Buttons
                xtype: 'fieldcontainer',
                flex: 1,
                width: '100%',
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'bottom'
                },
                defaults: {
                    margin: '0 0 0 5'
                },
                margin: '0 0 9 0',
                style: {
                    backgroundColor: 'transparent'
                },
                items: [{
                    xtype: 'button',
                    text: 'Cancel',
                    cls: me.baseCls + '-sidepanel-btn-cancel',
                    handler: function(btn, eOpts) {
                        var me = this;
                        me.getPicker().setValue(me.oldValue);
                        me.handlerBtnCancel && this.handlerBtnCancel.call(me.scope || btn, me, eOpts);
                        me.collapse();
                    },
                    scope: this
                }, {
                    xtype: 'button',
                    scale: 'small',
                    cls: me.baseCls + '-btn-apply',
                    text: 'Apply',
                    handler: function(btn, eOpts) {
                        var me = this;
                        me.setOldValue();
                        me.handlerBtnApply && this.handlerBtnApply.call(me.scope || btn, me, me.value, eOpts);
                        me.collapse();
                    },
                    scope: this
                }]
            }]
        };
    },

    /**
     * Items which are shown inside the date range combo box.
     * You need to define a function (property: selectDateRange) which selects the date range.
     * @returns {*[]}
     */
    dateRangeItems:function() {
        return [
            {"id":"TD", "name":"Today", "scope": this, "selectDateRange": function() {
                var me = this,
                    eDate = Ext.Date,
                    today = new Date();

                today = eDate.clearTime(today);
                me.setStartAndEndDate( today, today);
            } },
            {"id":"LM", "name":"Last Month", "scope": this, "selectDateRange": function() {
                var me = this,
                    eDate = Ext.Date,
                    today = new Date();

                today = eDate.clearTime(today);
                me.setStartAndEndDate( eDate.getFirstDateOfMonth( eDate.add(today, eDate.MONTH, -1)),
                                       eDate.getLastDateOfMonth( eDate.add(today, eDate.MONTH, -1)) );
            } },
            {"id":"CM", "name":"Current Month", "scope": this, "selectDateRange": function() {
                var me = this,
                    eDate = Ext.Date,
                    today = new Date();

                today = eDate.clearTime(today);
                me.setStartAndEndDate( eDate.getFirstDateOfMonth(today),
                                       eDate.getLastDateOfMonth(today) );
            } },
            {"id":"NM", "name":"Next Month","scope": this, "selectDateRange": function() {
                var me = this,
                    eDate = Ext.Date,
                    today = new Date();

                today = eDate.clearTime(today);
                me.setStartAndEndDate( eDate.getFirstDateOfMonth( eDate.add(today, eDate.MONTH, 1)),
                    eDate.getLastDateOfMonth( eDate.add(today, eDate.MONTH, 1)) );
            } }
        ];
    },


    /**
     * Set the start and end date for this date range
     * @param startDate {Date}
     * @param endDate {Date}
     * @returns {{startDate: *, endDate: *}}
     */
    setStartAndEndDate: function(startDate, endDate) {
        var me = this,
            newValue = {startDate: startDate, endDate: endDate};

        if(! (Ext.isDate(startDate) && Ext.isDate(endDate)) ) return null;

        //Set value of the date pickers
        me.startDate.setValue(startDate);
        me.endDate.setValue(endDate);
        //Set value of the date range field
        me.getPicker().setValue(newValue);
        return newValue;
    },


    /**
     * User has clicked on a date from a Ext.picker.Date! (within the sidepanel)
     * @param datefield
     * @param value
     */
    onDateSelect: function(datefield, value) {
        var me = this;
        me.getPicker().setValue(value);
        if (datefield.hideOnSelect)
            datefield.collapse();
    },

    /**
     * Either start or end date picker has gained focus.
     * Apply necessary styles
     * @param datefield
     */
    onDateFocus: function(datefield) {
        var me = this;

        if(datefield.itemId.indexOf("-startDate") === -1) {
            me.onDateRangeSelect(this, null, 'start');
        } else {
            me.onDateRangeSelect(this, null, 'end');
        }
    },

    /**
     * A date from a calendar of the DateRange (Ext.ux.DateRange) has been selected.
     * We are changing the style of the startDateContainer and the endDateContainer and set the value
     * @param dr - Ext.ux.daterange.picker.DateRange
     * @param value - The new value
     * @param whichDateWasSet - 'start', 'end', 'both'
     * @returns {*}
     */
    onDateRangeSelect: function(dr, value, whichDateWasSet) {
        var me = this;

        // set value and flip style
        if(whichDateWasSet === 'start') {
            me.startDateContainer.removeCls(me.baseCls + "-active");
            me.startDateContainer.addCls(me.baseCls + "-disabled");

            me.endDateContainer.addCls(me.baseCls + "-active");
            me.endDateContainer.removeCls(me.baseCls + "-disabled");

            me.sidebarTitle.el.dom.innerText = me.selectEndDateText;
            !Ext.isEmpty(value) && me.startDate.setValue(value.startDate);
            me.getPicker().setSetStartDate(false);

        } else if(whichDateWasSet === 'end') {
            me.startDateContainer.addCls(me.baseCls + "-active");
            me.startDateContainer.removeCls(me.baseCls + "-disabled");

            me.endDateContainer.removeCls(me.baseCls + "-active");
            me.endDateContainer.addCls(me.baseCls + "-disabled");

            me.sidebarTitle.el.dom.innerText = me.selectStartDateText;
            !Ext.isEmpty(value) && me.endDate.setValue(value.endDate);
            me.getPicker().setSetStartDate(true);

        }

        if( !Ext.isEmpty(value)) {
            //update datepicker with the new values
            me.startDate.setValue(value.startDate);
            me.endDate.setValue(value.endDate);
        }

        //Enable / Disable next and previous button
        if(me.startDate.getValue() === null || me.endDate.getValue() === null) {
            me.nextButton.setDisabled(true);
            me.prevButton.setDisabled(true);
        } else {
            me.nextButton.setDisabled(false);
            me.prevButton.setDisabled(false);
        }

        return value;
    },

    /**
     * If the picker gets expanded, we update start and end date field.
     */
    onExpand: function() {
        var me = this,
            picker,
            pickerValue;
        me.callParent();

        //Apply value from Ext.ux.DateRange (our picker)
        picker = me.getPicker();
        pickerValue = picker.getValue();
        me.startDate.setValue(pickerValue ? pickerValue.startDate : undefined);
        me.endDate.setValue(pickerValue ? pickerValue.endDate : undefined);

        //Enable / Disable next and previous button
        if(me.startDate.getValue() === null || me.endDate.getValue() === null) {
            me.nextButton.setDisabled(true);
            me.prevButton.setDisabled(true);
        } else {
            me.nextButton.setDisabled(false);
            me.prevButton.setDisabled(false);
        }
    },

    /**
     * Copies the value over to oldValue, so that we can restore it, if needed!
     */
    setOldValue: function() {
        var me = this;
        me.oldValue = { startDate: me.value.startDate, endDate: me.value.endDate };
    }
});