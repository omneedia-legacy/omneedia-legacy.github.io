/*

*/

i18n_framework['fr'] = function() 
{
	Date.dayNames = [
		'Dimanche',
		'Lundi',
		'Mardi',
		'Mercredi',
		'Jeudi',
		'Vendredi',
		'Samedi'
	];

	Date.monthNames = [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Aout',
		'Septembre',
		'Octobre',
		'Novembre',
		'Decembre'
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
			'dayText': 'Jour',
			'monthText': 'Mois',
			'yearText': 'Année',
			'slotOrder': ['day', 'month', 'year']    
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
		Ext.util.Format.defaultDateFormat = 'd/m/Y'; }

	if(Ext.MessageBox){
		Ext.MessageBox.OK.text = 'OK';
		Ext.MessageBox.CANCEL.text = 'Annuler';
		Ext.MessageBox.YES.text = 'Oui';
		Ext.MessageBox.NO.text = 'Non';
	}
	
	if (Ext.plugin.PullRefresh) {
		Ext.override(Ext.plugin.PullRefresh, {
			config: {
				pullText: 'Tirer pour mettre à jour...',			
				releaseText: 'Relâcher pour mettre à jour...',
				loadingText: 'Chargement...',
				loadedText: 'Chargé.',
				lastUpdatedText: 'Dernière mise à jour:&nbsp;'
			}
		});
	}
	
	if (Ext.plugin.ListPaging) {
		Ext.override(Ext.plugin.ListPaging, {
			config: {
				loadMoreText: "Enregistrements suivants...",
				noMoreRecordsText: 'Fin de la liste',
			}
		});
	};
};
