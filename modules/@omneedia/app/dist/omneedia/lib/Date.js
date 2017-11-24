// implementation
import * as DATE_I18N from './Date.i18n';
var p = function (s, l) {
    if (l === void 0) { l = null; }
    if (!l) {
        l = 2;
    }
    return ("000" + s).slice(l * -1);
};
//declare var culture_date_i18n : {};
Date.CultureInfo = DATE_I18N.culture_date_i18n[navigator.language.toLowerCase()];
/**
 * Resets the time of this Date object to 12:00 AM (00:00), which is the start of the day.
 * @param {Boolean}  .clone() this date instance before clearing Time
 * @return {Date}    this
 */
Date.prototype.clearTime = function () {
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this;
};
/**
 * Convert a date object to MySQL string.
 * @return {String}    this
 */
Date.prototype.toMySQL = function () {
    function twoDigits(d) {
        if (0 <= d && d < 10)
            return "0" + d.toString();
        if (-10 < d && d < 0)
            return "-0" + (-1 * d).toString();
        return d.toString();
    }
    ;
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};
/**
 * Resets the time of this Date object to the current time ('now').
 * @return {Date}    this
 */
Date.prototype.setTimeToNow = function () {
    var n = new Date();
    this.setHours(n.getHours());
    this.setMinutes(n.getMinutes());
    this.setSeconds(n.getSeconds());
    this.setMilliseconds(n.getMilliseconds());
    return this;
};
/**
 * Gets a date that is set to the current date. The time is set to the start of the day (00:00 or 12:00 AM).
 * @return {Date}    The current date.
 */
Date.today = function () {
    return new Date().clearTime();
};
/**
 * Compares the first date to the second date and returns an number indication of their relative values.
 * @param {Date}     First Date object to compare [Required].
 * @param {Date}     Second Date object to compare to [Required].
 * @return {Number}  -1 = date1 is lessthan date2. 0 = values are equal. 1 = date1 is greaterthan date2.
 */
Date.compare = function (date1, date2) {
    if (isNaN(date1) || isNaN(date2)) {
        throw new Error(date1 + " - " + date2);
    }
    else if (date1 instanceof Date && date2 instanceof Date) {
        return (date1 < date2) ? -1 : (date1 > date2) ? 1 : 0;
    }
    else {
        throw new TypeError(date1 + " - " + date2);
    }
};
/**
 * Compares the first Date object to the second Date object and returns true if they are equal.
 * @param {Date}     First Date object to compare [Required]
 * @param {Date}     Second Date object to compare to [Required]
 * @return {Boolean} true if dates are equal. false if they are not equal.
 */
Date.equals = function (date1, date2) {
    return (date1.compareTo(date2) === 0);
};
/**
 * Gets the day number (0-6) if given a CultureInfo specific string which is a valid dayName, abbreviatedDayName or shortestDayName (two char).
 * @param {String}   The name of the day (eg. "Monday, "Mon", "tuesday", "tue", "We", "we").
 * @return {Number}  The day number
 */
Date.getDayNumberFromName = function (name) {
    var n = Date.CultureInfo.dayNames, m = Date.CultureInfo.abbreviatedDayNames, o = Date.CultureInfo.shortestDayNames, s = name.toLowerCase();
    for (var i = 0; i < n.length; i++) {
        if (n[i].toLowerCase() == s || m[i].toLowerCase() == s || o[i].toLowerCase() == s) {
            return i;
        }
    }
    return -1;
};
/**
 * Gets the month number (0-11) if given a Culture Info specific string which is a valid monthName or abbreviatedMonthName.
 * @param {String}   The name of the month (eg. "February, "Feb", "october", "oct").
 * @return {Number}  The day number
 */
Date.getMonthNumberFromName = function (name) {
    var n = Date.CultureInfo.monthNames, m = Date.CultureInfo.abbreviatedMonthNames, s = name.toLowerCase();
    for (var i = 0; i < n.length; i++) {
        if (n[i].toLowerCase() == s || m[i].toLowerCase() == s) {
            return i;
        }
    }
    return -1;
};
/**
 * Determines if the current date instance is within a LeapYear.
 * @param {Number}   The year.
 * @return {Boolean} true if date is within a LeapYear, otherwise false.
 */
Date.isLeapYear = function (year) {
    return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
};
/**
 * Gets the number of days in the month, given a year and month value. Automatically corrects for LeapYear.
 * @param {Number}   The year.
 * @param {Number}   The month (0-11).
 * @return {Number}  The number of days in the month.
 */
Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};
Date.getTimezoneAbbreviation = function (offset) {
    var z = Date.CultureInfo.timezones, p;
    for (var i = 0; i < z.length; i++) {
        if (z[i].offset === offset) {
            return z[i].name;
        }
    }
    return null;
};
Date.getTimezoneOffset = function (name) {
    var z = Date.CultureInfo.timezones, p;
    for (var i = 0; i < z.length; i++) {
        if (z[i].name === name.toUpperCase()) {
            return z[i].offset;
        }
    }
    return null;
};
/**
 * Returns a new Date object that is an exact date and time copy of the original instance.
 * @return {Date}    A new Date instance
 */
Date.prototype.clone = function () {
    return new Date(this.getTime());
};
/**
 * Compares this instance to a Date object and returns an number indication of their relative values.
 * @param {Date}     Date object to compare [Required]
 * @return {Number}  -1 = this is lessthan date. 0 = values are equal. 1 = this is greaterthan date.
 */
Date.prototype.compareTo = function (date) {
    return Date.compare(this, date);
};
/**
 * Compares this instance to another Date object and returns true if they are equal.
 * @param {Date}     Date object to compare. If no date to compare, new Date() [now] is used.
 * @return {Boolean} true if dates are equal. false if they are not equal.
 */
Date.prototype.equals = function (date) {
    return Date.equals(this, date || new Date());
};
/**
 * Determines if this instance is between a range of two dates or equal to either the start or end dates.
 * @param {Date}     Start of range [Required]
 * @param {Date}     End of range [Required]
 * @return {Boolean} true is this is between or equal to the start and end dates, else false
 */
Date.prototype.between = function (start, end) {
    return this.getTime() >= start.getTime() && this.getTime() <= end.getTime();
};
/**
 * Determines if this date occurs after the date to compare to.
 * @param {Date}     Date object to compare. If no date to compare, new Date() ("now") is used.
 * @return {Boolean} true if this date instance is greater than the date to compare to (or "now"), otherwise false.
 */
Date.prototype.isAfter = function (date) {
    return this.compareTo(date || new Date()) === 1;
};
/**
 * Determines if this date occurs before the date to compare to.
 * @param {Date}     Date object to compare. If no date to compare, new Date() ("now") is used.
 * @return {Boolean} true if this date instance is less than the date to compare to (or "now").
 */
Date.prototype.isBefore = function (date) {
    return (this.compareTo(date || new Date()) === -1);
};
/**
 * Determines if the current Date instance occurs today.
 * @return {Boolean} true if this date instance is 'today', otherwise false.
 */
/**
 * Determines if the current Date instance occurs on the same Date as the supplied 'date'.
 * If no 'date' to compare to is provided, the current Date instance is compared to 'today'.
 * @param {date}     Date object to compare. If no date to compare, the current Date ("now") is used.
 * @return {Boolean} true if this Date instance occurs on the same Day as the supplied 'date'.
 */
Date.prototype.isToday = Date.prototype.isSameDay = function (date) {
    return this.clone().clearTime().equals((date || new Date()).clone().clearTime());
};
/**
 * Adds the specified number of milliseconds to this instance.
 * @param {Number}   The number of milliseconds to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addMilliseconds = function (value) {
    this.setMilliseconds(this.getMilliseconds() + value * 1);
    return this;
};
/**
 * Adds the specified number of seconds to this instance.
 * @param {Number}   The number of seconds to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addSeconds = function (value) {
    return this.addMilliseconds(value * 1000);
};
/**
 * Adds the specified number of seconds to this instance.
 * @param {Number}   The number of seconds to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addMinutes = function (value) {
    return this.addMilliseconds(value * 60000); /* 60*1000 */
};
/**
 * Adds the specified number of hours to this instance.
 * @param {Number}   The number of hours to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addHours = function (value) {
    return this.addMilliseconds(value * 3600000); /* 60*60*1000 */
};
/**
 * Adds the specified number of days to this instance.
 * @param {Number}   The number of days to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addDays = function (value) {
    this.setDate(this.getDate() + value * 1);
    return this;
};
/**
 * Adds the specified number of weeks to this instance.
 * @param {Number}   The number of weeks to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addWeeks = function (value) {
    return this.addDays(value * 7);
};
/**
 * Adds the specified number of months to this instance.
 * @param {Number}   The number of months to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value * 1);
    this.setDate(Math.min(n, Date.getDaysInMonth(this.getFullYear(), this.getMonth())));
    return this;
};
/**
 * Adds the specified number of years to this instance.
 * @param {Number}   The number of years to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addYears = function (value) {
    return this.addMonths(value * 12);
};
/**
 * Adds (or subtracts) to the value of the years, months, weeks, days, hours, minutes, seconds, milliseconds of the date instance using given configuration object. Positive and Negative values allowed.
 * Example
<pre><code>
Date.today().add( { days: 1, months: 1 } )

new Date().add( { years: -1 } )
</code></pre>
 * @param {Object}   Configuration object containing attributes (months, days, etc.)
 * @return {Date}    this
 */
Date.prototype.add = function (config) {
    if (typeof config == "number") {
        this._orient = config;
        return this;
    }
    var x = config;
    if (x.milliseconds) {
        this.addMilliseconds(x.milliseconds);
    }
    if (x.seconds) {
        this.addSeconds(x.seconds);
    }
    if (x.minutes) {
        this.addMinutes(x.minutes);
    }
    if (x.hours) {
        this.addHours(x.hours);
    }
    if (x.weeks) {
        this.addWeeks(x.weeks);
    }
    if (x.months) {
        this.addMonths(x.months);
    }
    if (x.years) {
        this.addYears(x.years);
    }
    if (x.days) {
        this.addDays(x.days);
    }
    return this;
};
var $y, $m, $d;
/**
 * Get the week number. Week one (1) is the week which contains the first Thursday of the year. Monday is considered the first day of the week.
 * This algorithm is a JavaScript port of the work presented by Claus Tøndering at http://www.tondering.dk/claus/cal/node8.html#SECTION00880000000000000000
 * .getWeek() Algorithm Copyright (c) 2008 Claus Tondering.
 * The .getWeek() function does NOT convert the date to UTC. The local datetime is used. Please use .getISOWeek() to get the week of the UTC converted date.
 * @return {Number}  1 to 53
 */
Date.prototype.getWeek = function () {
    var a, b, c, d, e, f, g, n, s, w;
    $y = (!$y) ? this.getFullYear() : $y;
    $m = (!$m) ? this.getMonth() + 1 : $m;
    $d = (!$d) ? this.getDate() : $d;
    if ($m <= 2) {
        a = $y - 1;
        b = (a / 4 | 0) - (a / 100 | 0) + (a / 400 | 0);
        c = ((a - 1) / 4 | 0) - ((a - 1) / 100 | 0) + ((a - 1) / 400 | 0);
        s = b - c;
        e = 0;
        f = $d - 1 + (31 * ($m - 1));
    }
    else {
        a = $y;
        b = (a / 4 | 0) - (a / 100 | 0) + (a / 400 | 0);
        c = ((a - 1) / 4 | 0) - ((a - 1) / 100 | 0) + ((a - 1) / 400 | 0);
        s = b - c;
        e = s + 1;
        f = $d + ((153 * ($m - 3) + 2) / 5) + 58 + s;
    }
    g = (a + b) % 7;
    d = (f + g - e) % 7;
    n = (f + 3 - d) | 0;
    if (n < 0) {
        w = 53 - ((g - s) / 5 | 0);
    }
    else if (n > 364 + s) {
        w = 1;
    }
    else {
        w = (n / 7 | 0) + 1;
    }
    $y = $m = $d = null;
    return w;
};
/**
 * Get the ISO 8601 week number. Week one ("01") is the week which contains the first Thursday of the year. Monday is considered the first day of the week.
 * The .getISOWeek() function does convert the date to it's UTC value. Please use .getWeek() to get the week of the local date.
 * @return {String}  "01" to "53"
 */
Date.prototype.getISOWeek = function () {
    $y = this.getUTCFullYear();
    $m = this.getUTCMonth() + 1;
    $d = this.getUTCDate();
    return p(this.getWeek());
};
/**
 * Moves the date to Monday of the week set. Week one (1) is the week which contains the first Thursday of the year.
 * @param {Number}   A Number (1 to 53) that represents the week of the year.
 * @return {Date}    this
 */
Date.prototype.setWeek = function (n) {
    return this.moveToDayOfWeek(1).addWeeks(n - this.getWeek());
};
// private
var validate = function (n, min, max, name) {
    if (typeof n == "undefined") {
        return false;
    }
    else if (typeof n != "number") {
        throw new TypeError(n + " is not a Number.");
    }
    else if (n < min || n > max) {
        throw new RangeError(n + " is not a valid value for " + name + ".");
    }
    return true;
};
/**
 * Validates the number is within an acceptable range for milliseconds [0-999].
 * @param {Number}   The number to check if within range.
 * @return {Boolean} true if within range, otherwise false.
 */
Date.validateMillisecond = function (value) {
    return validate(value, 0, 999, "millisecond");
};
/**
 * Validates the number is within an acceptable range for seconds [0-59].
 * @param {Number}   The number to check if within range.
 * @return {Boolean} true if within range, otherwise false.
 */
Date.validateSecond = function (value) {
    return validate(value, 0, 59, "second");
};
/**
 * Validates the number is within an acceptable range for minutes [0-59].
 * @param {Number}   The number to check if within range.
 * @return {Boolean} true if within range, otherwise false.
 */
Date.validateMinute = function (value) {
    return validate(value, 0, 59, "minute");
};
/**
 * Validates the number is within an acceptable range for hours [0-23].
 * @param {Number}   The number to check if within range.
 * @return {Boolean} true if within range, otherwise false.
 */
Date.validateHour = function (value) {
    return validate(value, 0, 23, "hour");
};
/**
 * Validates the number is within an acceptable range for the days in a month [0-MaxDaysInMonth].
 * @param {Number}   The number to check if within range.
 * @return {Boolean} true if within range, otherwise false.
 */
Date.validateDay = function (value, year, month) {
    return validate(value, 1, Date.getDaysInMonth(year, month), "day");
};
/**
 * Validates the number is within an acceptable range for months [0-11].
 * @param {Number}   The number to check if within range.
 * @return {Boolean} true if within range, otherwise false.
 */
Date.validateMonth = function (value) {
    return validate(value, 0, 11, "month");
};
/**
 * Validates the number is within an acceptable range for years.
 * @param {Number}   The number to check if within range.
 * @return {Boolean} true if within range, otherwise false.
 */
Date.validateYear = function (value) {
    return validate(value, 0, 9999, "year");
};
//# sourceMappingURL=Date.js.map