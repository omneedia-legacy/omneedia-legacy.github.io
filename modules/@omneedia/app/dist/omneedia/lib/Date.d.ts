export {  };
declare global  {
    interface Date {
        clearTime(): any;
        setTimeToNow(): any;
        today(): any;
        compare(d0: any, d1: any): any;
        clone(): any;
        compareTo(date: any): number;
        equals(date: any): boolean;
        between(start: any, end: any): boolean;
        isAfter(date: any): boolean;
        isBefore(date: any): boolean;
        isToday(date: any): boolean;
        isSameDay(date: any): boolean;
        addMilliseconds(value: any): any;
        addSeconds(value: any): any;
        addMinutes(value: any): any;
        addHours(value: any): any;
        addDays(value: any): any;
        addWeeks(value: any): any;
        addMonths(value: any): any;
        addYears(value: any): any;
        add(config: any): any;
        getWeek(): number;
        getISOWeek(): string;
        setWeek(n: number): any;
        toMySQL(): any;
    }
    interface DateConstructor {
        CultureInfo: any;
        today(): Date;
        compare(date1: any, date2: any): number;
        equals(date1: any, date2: any): boolean;
        getDayNumberFromName(name: any): number;
        getMonthNumberFromName(name: any): number;
        isLeapYear(year: any): boolean;
        getDaysInMonth(year: any, month: any): number;
        getTimezoneOffset(name: any): any;
        getTimezoneAbbreviation(offset: any): any;
        validateMillisecond(value: any): boolean;
        validateSecond(value: any): boolean;
        validateMinute(value: any): boolean;
        validateHour(value: any): boolean;
        validateDay(value: any, year: any, month: any): boolean;
        validateMonth(value: any): boolean;
        validateYear(value: any): boolean;
    }
}
export {};
