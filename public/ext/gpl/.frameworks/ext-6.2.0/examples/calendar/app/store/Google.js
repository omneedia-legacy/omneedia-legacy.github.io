Ext.define('Calendar.store.Google', {
    extend: 'Ext.calendar.store.Calendars',
    alias: 'store.calendar-google',

    requires: [
        'Ext.data.google.CalendarsProxy'
    ],

    autoSync: true,

    proxy: {
        type: 'google-calendars'
    }
});
