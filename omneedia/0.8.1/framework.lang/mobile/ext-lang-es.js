/*

*/

i18n_framework['es'] = function() 
{
	Date.dayNames = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

	Date.monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	Date.monthNumbers = {
		'Jan': 0,
		'Feb': 1,
		'Mar': 2,
		'Apr': 3,
		'May': 4,
		'Jun': 5,
		'Jul': 6,
		'Aug': 7,
		'Sep': 8,
		'Oct': 9,
		'Nov': 10,
		'Dec': 11
	};

	Date.getShortMonthName = function(month) {
		return Date.monthNames[month].substring(0, 3); };

	Date.getShortDayName = function(day) {
		return Date.dayNames[day].substring(0, 3); };

	Date.getMonthNumber = function(name) {
	  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()]; };

	try {
		Date.parseCodes.S.s = '(?:st|nd|rd|th)';
	}catch(e){
		
		
	}


	if(Ext.Picker){
		Ext.override(Ext.Picker, {
			doneText: 'Done'    
		});
	}

	if(Ext.DatePicker){
		Ext.override(Ext.DatePicker, {
			'dayText': 'Day',
			'monthText': 'Month',
			'yearText': 'Year',
			'slotOrder': ['month', 'day', 'year']    
		});
	}

	if(Ext.IndexBar){
		Ext.override(Ext.IndexBar, {
			'letters': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']    
		});
	}

	if(Ext.NestedList){
		Ext.override(Ext.NestedList, {
			config: {
				'backText': 'Retour',
				'loadingText': 'Chargement...',
				'emptyText': 'Aucun élément a afficher.'
			}
		});
	};

	if (Ext.navigation.View){
		Ext.override(Ext.navigation.View, {
			config: {
				'defaultBackButtonText': 'Retour'
			}
		});
	};

	if(Ext.util.Format){
		Ext.util.Format.defaultDateFormat = 'm/d/Y'; }

	if(Ext.MessageBox){
		Ext.MessageBox.OK.text = 'OK';
		Ext.MessageBox.CANCEL.text = 'Cancel';
		Ext.MessageBox.YES.text = 'Yes';
		Ext.MessageBox.NO.text = 'No';
	}
};
