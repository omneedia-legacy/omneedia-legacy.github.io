/*

Kanban TaskBoard 2.0.17
Copyright(c) 2009-2017 Bryntum AB
https://bryntum.com/contact
https://bryntum.com/license

*/

if (!Ext.ux.Scheduler) {
	alert('z');
	Ext.define('Ext.ux.Scheduler.util.Patch', {
		target: null
		, minVersion: null
		, maxVersion: null
		, reportUrl: null
		, obsoleteTestName: null
		, description: null
		, applyFn: null
		, ieOnly: false
		, macOnly: false
		, overrides: null
		, onClassExtended: function (_0xe517x1, _0xe517x2) {
			if (Ext.ux.Scheduler['disableOverrides']) {
				return
			};
			if (_0xe517x2['ieOnly'] && !Ext['isIE']) {
				return
			};
			if (_0xe517x2['macOnly'] && !Ext['isMac']) {
				return
			};
			if ((!_0xe517x2['minVersion'] || Ext['versions']['extjs']['equals'](_0xe517x2['minVersion']) || Ext['versions']['extjs']['isGreaterThan'](_0xe517x2['minVersion'])) && (!_0xe517x2['maxVersion'] || Ext['versions']['extjs']['equals'](_0xe517x2['maxVersion']) || Ext['versions']['extjs']['isLessThan'](_0xe517x2['maxVersion']))) {
				Ext['require'](_0xe517x2['target'], function () {
					if (_0xe517x2['applyFn']) {
						_0xe517x2['applyFn']()
					}
					else {
						if (_0xe517x2['overrides']) {
							Ext['ClassManager']['get'](_0xe517x2['target'])['override'](_0xe517x2['overrides'])
						}
					}
				})
			}
		}
	});
	Ext.define('Ext.ux.Scheduler.patches.EXTJS_23846', {
		extend: 'Ext.ux.Scheduler.util.Patch'
		, requires: ['Ext.dom.Element', 'Ext.event.publisher.Gesture']
		, target: ['Ext.dom.Element', 'Ext.event.publisher.Gesture']
		, maxVersion: '6.2.2'
		, applyFn: function () {
			if (Ext['firefoxVersion'] < 51) {
				return
			};
			Ext.define('EXTJS_23846.Element', {
				override: 'Ext.dom.Element'
			}, function (_0xe517x2) {
				var _0xe517x1 = Ext['supports']
					, _0xe517x3 = _0xe517x2['prototype']
					, _0xe517x4 = _0xe517x3['eventMap']
					, _0xe517x5 = _0xe517x3['additiveEvents'];
				if (Ext['os']['is']['Desktop'] && _0xe517x1['TouchEvents'] && !_0xe517x1['PointerEvents']) {
					_0xe517x4['touchstart'] = 'mousedown';
					_0xe517x4['touchmove'] = 'mousemove';
					_0xe517x4['touchend'] = 'mouseup';
					_0xe517x4['touchcancel'] = 'mouseup';
					_0xe517x5['mousedown'] = 'mousedown';
					_0xe517x5['mousemove'] = 'mousemove';
					_0xe517x5['mouseup'] = 'mouseup';
					_0xe517x5['touchstart'] = 'touchstart';
					_0xe517x5['touchmove'] = 'touchmove';
					_0xe517x5['touchend'] = 'touchend';
					_0xe517x5['touchcancel'] = 'touchcancel';
					_0xe517x5['pointerdown'] = 'mousedown';
					_0xe517x5['pointermove'] = 'mousemove';
					_0xe517x5['pointerup'] = 'mouseup';
					_0xe517x5['pointercancel'] = 'mouseup'
				}
			});
			Ext.define('EXTJS_23846.Gesture', {
				override: 'Ext.event.publisher.Gesture'
			}, function (_0xe517x1) {
				var _0xe517x2 = _0xe517x1['instance'];
				if (Ext['supports']['TouchEvents'] && !Ext['isWebKit'] && Ext['os']['is']['Desktop']) {
					_0xe517x2['handledDomEvents']['push']('mousedown', 'mousemove', 'mouseup');
					_0xe517x2['registerEvents']()
				}
			})
		}
	});
	Ext.define('Ext.ux.Scheduler.data.mixin.UniversalModelGetter', {
		onClassMixedIn: function (_0xe517x1) {
			var _0xe517x2 = {};
			if (_0xe517x1['prototype']['isTreeStore']) {
				_0xe517x2['getModelById'] = _0xe517x1['prototype']['getNodeById']
			}
			else {
				_0xe517x2['getModelById'] = _0xe517x1['prototype']['getById']
			};
			if (_0xe517x1['prototype']['isTreeStore']) {
				_0xe517x2['getModelByInternalId'] = function (_0xe517x5) {
					return this['byInternalIdMap'][_0xe517x5] || null
				}
			}
			else {
				_0xe517x2['getModelByInternalId'] = _0xe517x1['prototype']['getByInternalId']
			};
			Ext['override'](_0xe517x1, _0xe517x2)
		}
	});
	Ext.define('Ext.ux.Scheduler.data.mixin.CacheHintHelper', {
		extend: 'Ext.Mixin'
		, mixinConfig: {
			before: {
				loadRecords: 'loadRecords'
				, removeAll: 'removeAll'
			}
		}
		, loadRecords: function () {
			this['fireEvent']('cacheresethint', this)
		}
		, removeAll: function (_0xe517x1) {
			if (_0xe517x1) {
				this['fireEvent']('cacheresethint', this)
			}
		}
	});
	Ext.define('Ext.ux.Scheduler.data.mixin.ResourceStore', {
		eventStore: null
		, getEventStore: function () {
			return this['eventStore']
		}
		, setEventStore: function (_0xe517x1) {
			var _0xe517x2 = this
				, _0xe517x5;
			if (_0xe517x2['eventStore'] !== _0xe517x1) {
				_0xe517x5 = _0xe517x2['eventStore'];
				_0xe517x2['eventStore'] = _0xe517x1 && Ext['StoreMgr']['lookup'](_0xe517x1) || null;
				_0xe517x2['fireEvent']('eventstorechange', _0xe517x2, _0xe517x1, _0xe517x5)
			}
		}
		, getScheduledEventsInTimeSpan: function (_0xe517x4, _0xe517x1, _0xe517x5) {
			var _0xe517x2 = [];
			var _0xe517x3 = Ext.ux.Scheduler['util']['Date'];
			_0xe517x5 = _0xe517x5 || this['getEventStore']();
			Ext['Array']['each'](this['getRange'](), function (_0xe517x6) {
				Ext['Array']['each'](_0xe517x5['getEventsForResource'](_0xe517x6), function (_0xe517x7) {
					if (_0xe517x7['intersectsRange'](_0xe517x4, _0xe517x1)) {
						_0xe517x2['push'](_0xe517x7)
					}
				})
			});
			return _0xe517x2
		}
	});
};

try {
		var cpp=Robo;
} catch(e) {
	Ext.define('Robo.data.Store', {
		extend: 'Ext.Mixin'
		, requires: ['Ext.util.Observable']
		, undoRedoPostponed: null
		, inUndoRedoTransaction: false
		, undoRedoEventBus: null
		, mixinConfig: {
			before: {
				constructor: 'constructor'
				, destroy: 'destroy'
				, fireEventArgs: 'fireEventArgs'
				, setRoot: 'beforeSetRoot'
				, fillNode: 'beforeFillNode'
			}
			, after: {
				setRoot: 'afterSetRoot'
				, fillNode: 'afterFillNode'
			}
		}
		, constructor: function () {
			var _0xe517x1 = this;
			_0xe517x1['undoRedoEventBus'] = new Ext['util'].Observable()
		}
		, destroy: function () {
			Ext['destroy'](this['undoRedoEventBus'])
		}
		, fireEventArgs: function (_0xe517x1, _0xe517x2) {
			var _0xe517x5 = this;
			if (!_0xe517x2['hasOwnProperty']('$undoRedoEventBusFired')) {
				_0xe517x2['$undoRedoEventBusFired'] = {}
			};
			if (!_0xe517x2['$undoRedoEventBusFired'][_0xe517x1]) {
				_0xe517x2['$undoRedoEventBusFired'][_0xe517x1] = true;
				_0xe517x5['undoRedoEventBus']['hasListener'](_0xe517x1) && _0xe517x5['undoRedoEventBus']['fireEventArgs'](_0xe517x1, _0xe517x2)
			}
		}
		, isInUndoRedoTransaction: function () {
			return this['inUndoRedoTransaction']
		}
		, onUndoRedoTransactionStart: function (_0xe517x1, _0xe517x2) {
			this['inUndoRedoTransaction'] = true
		}
		, onUndoRedoTransactionEnd: function (_0xe517x1, _0xe517x2) {
			this['inUndoRedoTransaction'] = false
		}
		, isUndoingOrRedoing: function () {
			return !!this['undoRedoPostponed']
		}
		, beforeUndoRedo: function (_0xe517x1) {
			this['undoRedoPostponed'] = []
		}
		, afterUndoRedo: function (_0xe517x1) {
			var _0xe517x2 = this;
			Ext['Array']['forEach'](_0xe517x2['undoRedoPostponed'], function (_0xe517x5) {
				_0xe517x5()
			});
			_0xe517x2['undoRedoPostponed'] = null
		}
		, postponeAfterUndoRedo: function (_0xe517x1) {
			Ext['Assert'] && Ext['Assert']['isFunction'](_0xe517x1, 'Parameter must be a function');
			this['undoRedoPostponed']['push'](_0xe517x1)
		}
		, beforeSetRoot: function () {
			this['__isSettingRoot'] = true
		}
		, afterSetRoot: function () {
			this['__isSettingRoot'] = false;
			if (!this['getRoot']()) {
				this['fireEvent']('clear', this)
			}
		}
		, beforeFillNode: function (_0xe517x1) {
			if (_0xe517x1['isRoot']()) {
				this['beforeSetRoot']()
			}
		}
		, afterFillNode: function (_0xe517x1) {
			if (_0xe517x1['isRoot']()) {
				this['afterSetRoot']()
			}
		}
		, isRootSettingOrLoading: function () {
			return this['isLoading']() || (this['isTreeStore'] && this['__isSettingRoot'])
		}
	});
}

if (!Robo.data.Model) Ext.define('Robo.data.Model', {
	extend: 'Ext.Mixin'
	, modelName: null
	, editMementoFix: null
	, mixinConfig: {
		before: {
			endEdit: 'onBeforeEndEdit'
		}
		, after: {
			endEdit: 'onAfterEndEdit'
		}
	}
	, onBeforeEndEdit: function (_0xe517x2, _0xe517x5) {
		var _0xe517x1 = this['editMemento'];
		if (_0xe517x1) {
			this['editMementoFix'] = _0xe517x1;
			if (!_0xe517x5) {
				_0xe517x5 = this['getModifiedFieldNames'](_0xe517x1['data'])
			};
			if (!_0xe517x1['previousValues']) {
				_0xe517x1['previousValues'] = {}
			};
			Ext['Array']['each'](_0xe517x5, function (_0xe517x3) {
				_0xe517x1['previousValues'][_0xe517x3] = _0xe517x1['data'][_0xe517x3]
			})
		}
	}
	, onAfterEndEdit: function (_0xe517x1, _0xe517x2) {
		delete this['editMementoFix']
	}
	, getTitle: function () {
		return ''
	}
});

if (!Ext.ux.Scheduler.model) {

	Ext.define('Ext.ux.Scheduler.model.Customizable', function (_0xe517x1) {
		return {
			extend: 'Ext.data.Model'
			, mixins: {
				robo: 'Robo.data.Model'
			}
			, isCustomizableModel: true
			, customizableFields: null
			, previous: null
			, __editing: null
			, __editCounter: 0
			, constructor: function () {
				var _0xe517x2 = this['callParent'](arguments);
				return _0xe517x2
			}
			, storePreviousFlex: Ext['Function']['flexSetter'](function (_0xe517x4, _0xe517x3) {
				var _0xe517x5 = this
					, _0xe517x2 = _0xe517x5['get'](_0xe517x4);
				if (_0xe517x2 instanceof Date && !(_0xe517x3 instanceof Date)) {
					_0xe517x3 = _0xe517x5['getField'](_0xe517x4)['convert'](_0xe517x3, _0xe517x5)
				};
				if ((_0xe517x2 instanceof Date && (_0xe517x2 - _0xe517x3)) || !(_0xe517x2 instanceof Date) && _0xe517x2 !== _0xe517x3) {
					_0xe517x5['previous'][_0xe517x4] = _0xe517x2
				}
			})
			, deletePreviousFlex: Ext['Function']['flexSetter'](function (_0xe517x5, _0xe517x2) {
				delete this['previous'][_0xe517x5]
			})
			, set: function (_0xe517x6, _0xe517x4) {
				var _0xe517x3 = this
					, _0xe517x5 = false
					, _0xe517x2 = null;
				if (!_0xe517x3['previous']) {
					_0xe517x5 = true;
					_0xe517x3['previous'] = {}
				};
				_0xe517x3['storePreviousFlex'](_0xe517x6, _0xe517x4);
				_0xe517x2 = _0xe517x3['callParent'](arguments);
				if (!_0xe517x3['__editing']) {
					if (_0xe517x5) {
						delete _0xe517x3['previous']
					}
					else {
						_0xe517x3['deletePreviousFlex'](_0xe517x6, _0xe517x4)
					}
				};
				return _0xe517x2
			}
			, reject: function () {
				var _0xe517x5 = this
					, _0xe517x2 = _0xe517x5['modified'] || {}
					, _0xe517x3;
				_0xe517x5['__editing'] = true;
				_0xe517x5['previous'] = _0xe517x5['previous'] || {};
				for (_0xe517x3 in _0xe517x2) {
					if (_0xe517x2['hasOwnProperty'](_0xe517x3)) {
						if (typeof _0xe517x2[_0xe517x3] != 'function') {
							_0xe517x5['previous'][_0xe517x3] = _0xe517x5['get'](_0xe517x3)
						}
					}
				};
				_0xe517x5['callParent'](arguments);
				delete _0xe517x5['previous'];
				_0xe517x5['__editing'] = false
			}
			, beginEdit: function () {
				this['__editCounter']++;
				this['__editing'] = true;
				this['callParent'](arguments)
			}
			, cancelEdit: function () {
				this['__editCounter'] = 0;
				this['__editing'] = false;
				this['callParent'](arguments);
				delete this['previous']
			}
			, endEdit: function (_0xe517x5, _0xe517x3) {
				if (--this['__editCounter'] === 0) {
					if (!_0xe517x5 && this['getModifiedFieldNames']) {
						var _0xe517x2 = this['editMemento'];
						if (!_0xe517x3) {
							_0xe517x3 = this['getModifiedFieldNames'](_0xe517x2['data'])
						};
						if (_0xe517x3 && _0xe517x3['length'] === 0) {
							_0xe517x5 = true
						}
					};
					this['callParent']([_0xe517x5]['concat'](Array['prototype']['slice']['call'](arguments, 1)));
					this['__editing'] = false;
					delete this['previous']
				}
			}
		}
	}, function (_0xe517x1) {
		_0xe517x1['$onExtended']['unshift']({
			fn: function (_0xe517x2, _0xe517x5) {
				if (_0xe517x5) {
					if (Ext['isArray'](_0xe517x5)) {
						_0xe517x2['fieldsInitialValue'] = _0xe517x5['slice']()
					}
					else {
						if (_0xe517x5['fields']) {
							if (!Ext['isArray'](_0xe517x5['fields'])) {
								_0xe517x2['fieldsInitialValue'] = [_0xe517x5['fields']]
							}
							else {
								_0xe517x2['fieldsInitialValue'] = _0xe517x5['fields']['slice']()
							}
						}
					}
				}
			}
		});
		_0xe517x1['onExtended'](function (_0xe517x3, _0xe517x6, _0xe517x5) {
			var _0xe517x2 = Ext['ClassManager']
				, _0xe517x4 = _0xe517x2['triggerCreated'];
			_0xe517x2['triggerCreated'] = function (_0xe517x8) {
				var _0xe517x9 = _0xe517x3['prototype'];
				if (_0xe517x6['customizableFields']) {
					_0xe517x9['allCustomizableFields'] = (_0xe517x3['superclass']['allCustomizableFields'] || [])['concat'](_0xe517x6['customizableFields'])
				}
				else {
					_0xe517x9['allCustomizableFields'] = (_0xe517x3['superclass']['allCustomizableFields'] || [])
				};
				var _0xe517xa = {};
				Ext['Array']['each'](_0xe517x9['allCustomizableFields'], function (_0xe517xb) {
					if (typeof _0xe517xb == 'string') {
						_0xe517xb = {
							name: _0xe517xb
						}
					};
					_0xe517xa[_0xe517xb['name']] = _0xe517xb
				});
				var _0xe517x7 = _0xe517x9['fields'];
				var _0xe517xc = [];
				var _0xe517xd = [];
				Ext['Array']['each'](_0xe517x7, function (_0xe517xb) {
					if (_0xe517xb['isCustomizableField']) {
						_0xe517xd['push'](_0xe517xb['getName']())
					}
				});
				if (_0xe517x9['idProperty'] !== 'id' && _0xe517x9['getField']('id')) {
					if (!_0xe517x9['getField']('id')['hasOwnProperty']('name')) {
						_0xe517xd['push']('id')
					}
				};
				if (_0xe517x9['idProperty'] !== 'Id' && _0xe517x9['getField']('Id')) {
					if (!_0xe517x9['getField']('Id')['hasOwnProperty']('name')) {
						_0xe517xd['push']('Id')
					}
				};
				_0xe517x3['removeFields'](_0xe517xd);

				function _0xe517xe(_0xe517xf, _0xe517xb, _0xe517x10) {
					if (!_0xe517xb) {
						return
					};
					if (!Ext['isArray'](_0xe517xb)) {
						_0xe517xb = [_0xe517xb]
					};
					var _0xe517x11;
					for (var _0xe517x12 = _0xe517xb['length'] - 1; _0xe517x12 >= 0; _0xe517x12--) {
						if (_0xe517xb[_0xe517x12]['name'] == _0xe517x10) {
							_0xe517x11 = _0xe517xb[_0xe517x12];
							break
						}
					};
					Ext['applyIf'](_0xe517xf, _0xe517x11)
				}

				function _0xe517x13(_0xe517xf) {
					var _0xe517x14 = _0xe517x3
						, _0xe517x12 = _0xe517x14['prototype']
						, _0xe517x11 = _0xe517xf === 'Id' ? 'idProperty' : _0xe517xf['charAt'](0)['toLowerCase']() + _0xe517xf['substr'](1) + 'Field'
						, _0xe517xb = {
							name: _0xe517x12[_0xe517x11] || _0xe517xf
							, isCustomizableField: true
						}
						, _0xe517x10;
					while (_0xe517x12 && _0xe517x12['isCustomizableModel']) {
						_0xe517x10 = _0xe517x12[_0xe517x11] || _0xe517xf;
						_0xe517x12['hasOwnProperty']('customizableFields') && _0xe517xe(_0xe517xb, _0xe517x12['customizableFields'], _0xe517xf);
						_0xe517xe(_0xe517xb, _0xe517x14['fieldsInitialValue'], _0xe517x10);
						_0xe517x12 = _0xe517x14['superclass'];
						_0xe517x14 = _0xe517x12 && _0xe517x12['self']
					};
					return _0xe517xb
				}
				_0xe517xd = [];
				Ext['Object']['each'](_0xe517xa, function (_0xe517xb, _0xe517x11) {
					var _0xe517x10 = _0xe517x11['name'] || _0xe517x11['getName']();
					var _0xe517x15 = _0xe517x10 === 'Id' ? 'idProperty' : _0xe517x10['charAt'](0)['toLowerCase']() + _0xe517x10['substr'](1) + 'Field';
					var _0xe517x16 = _0xe517x9[_0xe517x15] || _0xe517x10;
					_0xe517x9['getField'](_0xe517x16) && _0xe517xd['push'](_0xe517x16);
					var _0xe517x17 = _0xe517x13(_0xe517x10);
					_0xe517xc['push'](Ext['create']('data.field.' + (_0xe517x17['type'] || 'auto'), _0xe517x17));
					var _0xe517x12 = Ext['String']['capitalize'](_0xe517x10);
					if (_0xe517x12 != 'Id') {
						var _0xe517x14 = 'get' + _0xe517x12;
						var _0xe517xf = 'set' + _0xe517x12;
						if (!_0xe517x9[_0xe517x14] || _0xe517x9[_0xe517x14]['__getterFor__'] && _0xe517x9[_0xe517x14]['__getterFor__'] != _0xe517x16) {
							_0xe517x9[_0xe517x14] = function () {
								return this['get'](this[_0xe517x15] || _0xe517x16)
							};
							_0xe517x9[_0xe517x14]['__getterFor__'] = _0xe517x16
						};
						if (!_0xe517x9[_0xe517xf] || _0xe517x9[_0xe517xf]['__setterFor__'] && _0xe517x9[_0xe517xf]['__setterFor__'] != _0xe517x16) {
							_0xe517x9[_0xe517xf] = function (_0xe517x18) {
								return this['set'](this[_0xe517x15] || _0xe517x16, _0xe517x18)
							};
							_0xe517x9[_0xe517xf]['__setterFor__'] = _0xe517x16
						}
					}
				});
				_0xe517x3['replaceFields'](_0xe517xc, _0xe517xd);
				_0xe517x4['apply'](this, arguments);
				_0xe517x2['triggerCreated'] = _0xe517x4
			}
		})
	});
	Ext.define('Ext.ux.Scheduler.model.Resource', {
		extend: 'Ext.ux.Scheduler.model.Customizable'
		, idProperty: 'Id'
		, config: Ext['versions']['touch'] ? {
			idProperty: 'Id'
		} : null
		, nameField: 'Name'
		, customizableFields: [{
			name: 'Name'
			, type: 'string'
		}]
		, getInternalId: function () {
			return this['internalId']
		}
		, getResourceStore: function () {
			return this['joined'] && this['joined'][0]
		}
		, getEventStore: function () {
			var _0xe517x1 = this['getResourceStore']();
			return _0xe517x1 && _0xe517x1['getEventStore']() || this['parentNode'] && this['parentNode']['getEventStore']()
		}
		, getAssignmentStore: function () {
			var _0xe517x1 = this['getEventStore']();
			return _0xe517x1 && _0xe517x1['getAssignmentStore']()
		}
		, getEvents: function (_0xe517x1) {
			var _0xe517x2 = this;
			_0xe517x1 = _0xe517x1 || _0xe517x2['getEventStore']();
			return _0xe517x1 && _0xe517x1['getEventsForResource'](_0xe517x2) || []
		}
		, getAssignments: function () {
			var _0xe517x2 = this
				, _0xe517x1 = _0xe517x2['getEventStore']();
			return _0xe517x1 && _0xe517x1['getAssignmentsForResource'](_0xe517x2)
		}
		, isPersistable: function () {
			var _0xe517x1 = this['parentNode'];
			return !_0xe517x1 || !_0xe517x1['phantom'] || (_0xe517x1['isRoot'] && _0xe517x1['isRoot']())
		}
		, isAbove: function (_0xe517x3) {
			var _0xe517x6 = this
				, _0xe517xc = _0xe517x6['getResourceStore']()
				, _0xe517xd = false
				, _0xe517x4, _0xe517x5, _0xe517x2, _0xe517x1, _0xe517x7;
			Ext['Assert'] && Ext['Assert']['truthy'](_0xe517xc, 'Resource must be added to a store to be able to check if it above of an other resource');
			if (_0xe517x6 == _0xe517x3) {
				_0xe517xd = false
			}
			else {
				if (_0xe517xc instanceof Ext['data']['TreeStore']) {
					_0xe517x4 = _0xe517x6;
					_0xe517x5 = [];
					while (_0xe517x4) {
						_0xe517x5['push'](_0xe517x4);
						_0xe517x4 = _0xe517x4['parentNode']
					};
					_0xe517x4 = _0xe517x3;
					_0xe517x2 = [];
					while (_0xe517x4) {
						_0xe517x2['push'](_0xe517x4);
						_0xe517x4 = _0xe517x4['parentNode']
					};
					_0xe517x1 = 0;
					while (_0xe517x1 < _0xe517x5['length'] - 1 && _0xe517x1 < _0xe517x2['length'] - 1 && _0xe517x5[_0xe517x1] == _0xe517x2[_0xe517x1]) {
						++_0xe517x1
					};
					_0xe517x7 = _0xe517x5[_0xe517x1];
					_0xe517x6 = _0xe517x5[_0xe517x1 + 1];
					_0xe517x3 = _0xe517x2[_0xe517x1 + 1];
					_0xe517xd = _0xe517x7['indexOf'](_0xe517x6) < _0xe517x7['indexOf'](_0xe517x3)
				}
				else {
					_0xe517xd = _0xe517xc['indexOf'](_0xe517x6) < _0xe517xc['indexOf'](_0xe517x3)
				}
			};
			return _0xe517xd
		}
	});
	Ext.define('Ext.ux.Scheduler.data.ResourceStore', {
		extend: 'Ext.data.Store'
		, model: 'Ext.ux.Scheduler.model.Resource'
		, config: {
			model: 'Ext.ux.Scheduler.model.Resource'
		}
		, alias: 'store.resourcestore'
		, mixins: ['Ext.ux.Scheduler.data.mixin.UniversalModelGetter', 'Ext.ux.Scheduler.data.mixin.CacheHintHelper', 'Ext.ux.Scheduler.data.mixin.ResourceStore', 'Robo.data.Store']
		, storeId: 'resources'
		, constructor: function () {
			this['callParent'](arguments);
			if (this['getModel']() !== Ext.ux.Scheduler['model']['Resource'] && !(this['getModel']()['prototype'] instanceof Ext.ux.Scheduler['model']['Resource'])) {
				throw 'The model for the ResourceStore must subclass Ext.ux.Scheduler.model.Resource'
			}
		}
	});


};

Ext.define('Ext.ux.Kanban.model.Resource', {
	extend: 'Ext.ux.Scheduler.model.Resource'
	, alias: 'model.kanban_resourcemodel'
	, customizableFields: [{
		name: 'ImageUrl'
	}]
	, imageUrlField: 'ImageUrl'
});
Ext.define('Ext.ux.Kanban.data.ResourceStore', {
	extend: 'Ext.ux.Scheduler.data.ResourceStore'
	, model: 'Ext.ux.Kanban.model.Resource'
	, sorters: 'Name'
	, proxy: undefined
	, alias: 'store.kanban_resourcestore'
});

if (!Ext.ux.Scheduler.locale) {
	Ext.define('Ext.ux.Scheduler.locale.Locale', {
		l10n: null
		, legacyMode: true
		, localeName: null
		, namespaceId: null
		, constructor: function () {
			if (!Ext.ux.Scheduler['locale']['Active']) {
				Ext.ux.Scheduler['locale']['Active'] = {};
				this['bindRequire']()
			};
			var _0xe517x2 = this['self']['getName']()['split']('.');
			var _0xe517x1 = this['localeName'] = _0xe517x2['pop']();
			this['namespaceId'] = _0xe517x2.join('.');
			var _0xe517x5 = Ext.ux.Scheduler['locale']['Active'][this['namespaceId']];
			if (!(_0xe517x1 == 'En' && _0xe517x5 && _0xe517x5['localeName'] != 'En')) {
				this['apply']()
			}
		}
		, bindRequire: function () {
			var _0xe517x1 = Ext['ClassManager']['triggerCreated'];
			Ext['ClassManager']['triggerCreated'] = function (_0xe517x3) {
				_0xe517x1['apply'](this, arguments);
				if (_0xe517x3) {
					var _0xe517x5 = Ext['ClassManager']['get'](_0xe517x3);
					for (var _0xe517x2 in Ext.ux.Scheduler['locale']['Active']) {
						Ext.ux.Scheduler['locale']['Active'][_0xe517x2]['apply'](_0xe517x5)
					}
				}
			}
		}
		, applyToClass: function (_0xe517x5, _0xe517x2) {
			var _0xe517x3 = this
				, _0xe517x7 = _0xe517x3['self']['getName']();
			_0xe517x2 = _0xe517x2 || Ext['ClassManager']['get'](_0xe517x5);
			if (_0xe517x2 && (_0xe517x2['activeLocaleId'] !== _0xe517x7)) {
				var _0xe517x1 = _0xe517x3['l10n'][_0xe517x5];
				if (typeof _0xe517x1 === 'function') {
					_0xe517x1(_0xe517x5)
				}
				else {
					if (_0xe517x2['singleton']) {
						_0xe517x2['l10n'] = Ext['apply']({}, _0xe517x1, _0xe517x2['prototype'] && _0xe517x2['prototype']['l10n'])
					}
					else {
						Ext['override'](_0xe517x2, {
							l10n: _0xe517x1
						})
					}
				};
				if (_0xe517x3['legacyMode']) {
					var _0xe517x6;
					if (_0xe517x2['prototype']) {
						_0xe517x6 = _0xe517x2['prototype']
					}
					else {
						if (_0xe517x2['singleton']) {
							_0xe517x6 = _0xe517x2
						}
					};
					if (_0xe517x6 && _0xe517x6['legacyMode']) {
						if (_0xe517x6['legacyHolderProp']) {
							if (!_0xe517x6[_0xe517x6['legacyHolderProp']]) {
								_0xe517x6[_0xe517x6['legacyHolderProp']] = {}
							};
							_0xe517x6 = _0xe517x6[_0xe517x6['legacyHolderProp']]
						};
						for (var _0xe517x4 in _0xe517x1) {
							if (typeof _0xe517x6[_0xe517x4] !== 'function') {
								_0xe517x6[_0xe517x4] = _0xe517x1[_0xe517x4]
							}
						}
					}
				};
				_0xe517x2['activeLocaleId'] = _0xe517x7;
				if (_0xe517x2['onLocalized']) {
					_0xe517x2['onLocalized']()
				}
			}
		}
		, apply: function (_0xe517x7) {
			if (this['l10n']) {
				var _0xe517x6 = this;
				if (_0xe517x7) {
					if (!Ext['isArray'](_0xe517x7)) {
						_0xe517x7 = [_0xe517x7]
					};
					var _0xe517x5, _0xe517x2;
					for (var _0xe517x3 = 0, _0xe517x1 = _0xe517x7['length']; _0xe517x3 < _0xe517x1; _0xe517x3++) {
						if (Ext['isObject'](_0xe517x7[_0xe517x3])) {
							if (_0xe517x7[_0xe517x3]['singleton']) {
								_0xe517x2 = _0xe517x7[_0xe517x3];
								_0xe517x5 = Ext['getClassName'](Ext['getClass'](_0xe517x2))
							}
							else {
								_0xe517x2 = Ext['getClass'](_0xe517x7[_0xe517x3]);
								_0xe517x5 = Ext['getClassName'](_0xe517x2)
							}
						}
						else {
							_0xe517x2 = null;
							_0xe517x5 = 'string' === typeof _0xe517x7[_0xe517x3] ? _0xe517x7[_0xe517x3] : Ext['getClassName'](_0xe517x7[_0xe517x3])
						};
						if (_0xe517x5) {
							if (_0xe517x5 in this['l10n']) {
								_0xe517x6['applyToClass'](_0xe517x5, _0xe517x2)
							}
						}
					}
				}
				else {
					Ext.ux.Scheduler['locale']['Active'][this['namespaceId']] = this;
					for (var _0xe517x4 in this['l10n']) {
						_0xe517x6['applyToClass'](_0xe517x4)
					}
				}
			}
		}
	});
	Ext.define('Ext.ux.Scheduler.locale.En', {
		extend: 'Ext.ux.Scheduler.locale.Locale'
		, singleton: true
		, l10n: {
			"Ext.ux.Scheduler.util.Date": {
				unitNames: {
					YEAR: {
						single: 'year'
						, plural: 'years'
						, abbrev: 'yr'
					}
					, QUARTER: {
						single: 'quarter'
						, plural: 'quarters'
						, abbrev: 'q'
					}
					, MONTH: {
						single: 'month'
						, plural: 'months'
						, abbrev: 'mon'
					}
					, WEEK: {
						single: 'week'
						, plural: 'weeks'
						, abbrev: 'w'
					}
					, DAY: {
						single: 'day'
						, plural: 'days'
						, abbrev: 'd'
					}
					, HOUR: {
						single: 'hour'
						, plural: 'hours'
						, abbrev: 'h'
					}
					, MINUTE: {
						single: 'minute'
						, plural: 'minutes'
						, abbrev: 'min'
					}
					, SECOND: {
						single: 'second'
						, plural: 'seconds'
						, abbrev: 's'
					}
					, MILLI: {
						single: 'ms'
						, plural: 'ms'
						, abbrev: 'ms'
					}
				}
			}
			, "Ext.ux.Scheduler.panel.TimelineGridPanel": {
				weekStartDay: 1
				, loadingText: 'Loading, please wait...'
				, savingText: 'Saving changes, please wait...'
			}
			, "Ext.ux.Scheduler.panel.TimelineTreePanel": {
				weekStartDay: 1
				, loadingText: 'Loading, please wait...'
				, savingText: 'Saving changes, please wait...'
			}
			, "Ext.ux.Scheduler.mixin.SchedulerView": {
				loadingText: 'Loading events...'
			}
			, "Ext.ux.Scheduler.plugin.CurrentTimeLine": {
				tooltipText: 'Current time'
			}
			, "Ext.ux.Scheduler.widget.EventEditor": {
				saveText: 'Save'
				, deleteText: 'Delete'
				, cancelText: 'Cancel'
				, nameText: 'Name'
				, startDateText: 'Start'
				, endDateText: 'End'
				, resourceText: 'Resource'
			}
			, "Ext.ux.Scheduler.plugin.SimpleEditor": {
				newEventText: 'New booking...'
			}
			, "Ext.ux.Scheduler.widget.ExportDialogForm": {
				formatFieldLabel: 'Paper format'
				, orientationFieldLabel: 'Orientation'
				, rangeFieldLabel: 'Schedule range'
				, showHeaderLabel: 'Show header'
				, showFooterLabel: 'Show footer'
				, orientationPortraitText: 'Portrait'
				, orientationLandscapeText: 'Landscape'
				, completeViewText: 'Complete schedule'
				, currentViewText: 'Visible schedule'
				, dateRangeText: 'Date range'
				, dateRangeFromText: 'Export from'
				, dateRangeToText: 'Export to'
				, exportersFieldLabel: 'Control pagination'
				, adjustCols: 'Adjust column width'
				, adjustColsAndRows: 'Adjust column width and row height'
				, specifyDateRange: 'Specify date range'
				, columnPickerLabel: 'Select columns'
				, completeDataText: 'Complete schedule (for all events)'
				, dpiFieldLabel: 'DPI (dots per inch)'
				, rowsRangeLabel: 'Rows range'
				, allRowsLabel: 'All rows'
				, visibleRowsLabel: 'Visible rows'
				, columnEmptyText: '[no title]'
			}
			, "Ext.ux.Scheduler.widget.ExportDialog": {
				title: 'Export Settings'
				, exportButtonText: 'Export'
				, cancelButtonText: 'Cancel'
				, progressBarText: 'Exporting...'
			}
			, "Ext.ux.Scheduler.plugin.Export": {
				generalError: 'An error occurred'
				, fetchingRows: 'Fetching row {0} of {1}'
				, builtPage: 'Built page {0} of {1}'
				, requestingPrintServer: 'Please wait...'
			}
			, "Ext.ux.Scheduler.plugin.Printable": {
				dialogTitle: 'Print settings'
				, exportButtonText: 'Print'
			}
			, "Ext.ux.Scheduler.plugin.exporter.AbstractExporter": {
				name: 'Exporter'
			}
			, "Ext.ux.Scheduler.plugin.exporter.SinglePage": {
				name: 'Single page'
			}
			, "Ext.ux.Scheduler.plugin.exporter.MultiPageVertical": {
				name: 'Multiple pages (vertically)'
			}
			, "Ext.ux.Scheduler.plugin.exporter.MultiPage": {
				name: 'Multiple pages'
			}
			, "Ext.ux.Scheduler.column.ResourceName": {
				name: 'Name'
			}
			, "Ext.ux.Scheduler.template.DependencyInfo": {
				fromText: 'From'
				, toText: 'To'
			}
			, "Ext.ux.Scheduler.preset.Manager": {
				hourAndDay: {
					displayDateFormat: 'G:i'
					, middleDateFormat: 'G:i'
					, topDateFormat: 'D d/m'
				}
				, secondAndMinute: {
					displayDateFormat: 'g:i:s'
					, topDateFormat: 'D, d g:iA'
				}
				, dayAndWeek: {
					displayDateFormat: 'm/d h:i A'
					, middleDateFormat: 'D d M'
				}
				, weekAndDay: {
					displayDateFormat: 'm/d'
					, bottomDateFormat: 'd M'
					, middleDateFormat: 'Y F d'
				}
				, weekAndMonth: {
					displayDateFormat: 'm/d/Y'
					, middleDateFormat: 'm/d'
					, topDateFormat: 'm/d/Y'
				}
				, weekAndDayLetter: {
					displayDateFormat: 'm/d/Y'
					, middleDateFormat: 'D d M Y'
				}
				, weekDateAndMonth: {
					displayDateFormat: 'm/d/Y'
					, middleDateFormat: 'd'
					, topDateFormat: 'Y F'
				}
				, monthAndYear: {
					displayDateFormat: 'm/d/Y'
					, middleDateFormat: 'M Y'
					, topDateFormat: 'Y'
				}
				, year: {
					displayDateFormat: 'm/d/Y'
					, middleDateFormat: 'Y'
				}
				, manyYears: {
					displayDateFormat: 'm/d/Y'
					, middleDateFormat: 'Y'
				}
			}
		}
	});
	Ext.define('Ext.ux.Scheduler.mixin.Localizable', {
		requires: ['Ext.ux.Scheduler.locale.En']
		, legacyMode: false
		, activeLocaleId: ''
		, l10n: null
		, isLocaleApplied: function () {
			var _0xe517x2 = (this['singleton'] && this['activeLocaleId']) || this['self']['activeLocaleId'];
			if (!_0xe517x2) {
				return false
			};
			for (var _0xe517x1 in Ext.ux.Scheduler['locale']['Active']) {
				if (_0xe517x2 === Ext.ux.Scheduler['locale']['Active'][_0xe517x1]['self']['getName']()) {
					return true
				}
			};
			return false
		}
		, applyLocale: function () {
			for (var _0xe517x1 in Ext.ux.Scheduler['locale']['Active']) {
				Ext.ux.Scheduler['locale']['Active'][_0xe517x1]['apply'](this['singleton'] ? this : this['self']['getName']())
			}
		}
		, L: function () {
			return this['localize']['apply'](this, arguments)
		}
		, localize: function (_0xe517x3, _0xe517x2, _0xe517x5) {
			var _0xe517x1 = this['getLocale'](_0xe517x3, _0xe517x2, _0xe517x5);
			if (_0xe517x1 === null || _0xe517x1 === undefined) {
				throw 'Cannot find locale: ' + _0xe517x3 + ' [' + this['self']['getName']() + ']'
			};
			return _0xe517x1
		}
		, getLocale: function (_0xe517x2, _0xe517x3, _0xe517x7) {
			if (!this['isLocaleApplied']() && !_0xe517x7) {
				this['applyLocale']()
			};
			if (this['hasOwnProperty']('l10n') && this['l10n']['hasOwnProperty'](_0xe517x2) && 'function' != typeof this['l10n'][_0xe517x2]) {
				return this['l10n'][_0xe517x2]
			};
			var _0xe517x5 = this['self'] && this['self']['prototype'];
			if (this['legacyMode']) {
				var _0xe517x1 = _0xe517x3 || this['legacyHolderProp'];
				var _0xe517xc = _0xe517x1 ? this[_0xe517x1] : this;
				if (_0xe517xc && _0xe517xc['hasOwnProperty'](_0xe517x2) && 'function' != typeof _0xe517xc[_0xe517x2]) {
					return _0xe517xc[_0xe517x2]
				};
				if (_0xe517x5) {
					var _0xe517x4 = _0xe517x1 ? _0xe517x5[_0xe517x1] : _0xe517x5;
					if (_0xe517x4 && _0xe517x4['hasOwnProperty'](_0xe517x2) && 'function' != typeof _0xe517x4[_0xe517x2]) {
						return _0xe517x4[_0xe517x2]
					}
				}
			};
			var _0xe517xd = _0xe517x5['l10n'] && _0xe517x5['l10n'][_0xe517x2];
			if (_0xe517xd === null || _0xe517xd === undefined) {
				var _0xe517x6 = _0xe517x5 && _0xe517x5['superclass'];
				if (_0xe517x6 && _0xe517x6['localize']) {
					_0xe517xd = _0xe517x6['localize'](_0xe517x2, _0xe517x3, _0xe517x7)
				}
			};
			return _0xe517xd
		}
	});
	Ext.define('Ext.ux.Scheduler.util.Date', {
		requires: 'Ext.Date'
		, mixins: ['Ext.ux.Scheduler.mixin.Localizable']
		, singleton: true
		, stripEscapeRe: /(\\.)/g
		, hourInfoRe: /([gGhHisucUOPZ]|MS)/
		, unitHash: null
		, unitsByName: {}
		, MIN_VALUE: new Date(-8640000000000000)
		, MAX_VALUE: new Date(8640000000000000)
		, constructor: function () {
			var _0xe517x1 = Ext['Date'];
			var _0xe517x5 = this['unitHash'] = {
				MILLI: _0xe517x1['MILLI']
				, SECOND: _0xe517x1['SECOND']
				, MINUTE: _0xe517x1['MINUTE']
				, HOUR: _0xe517x1['HOUR']
				, DAY: _0xe517x1['DAY']
				, WEEK: 'w'
				, MONTH: _0xe517x1['MONTH']
				, QUARTER: 'q'
				, YEAR: _0xe517x1['YEAR']
			};
			Ext['apply'](this, _0xe517x5);
			var _0xe517x2 = this;
			this['units'] = [_0xe517x2['MILLI'], _0xe517x2['SECOND'], _0xe517x2['MINUTE'], _0xe517x2['HOUR'], _0xe517x2['DAY'], _0xe517x2['WEEK'], _0xe517x2['MONTH'], _0xe517x2['QUARTER'], _0xe517x2['YEAR']]
		}
		, onLocalized: function () {
			this['setUnitNames'](this.L('unitNames'))
		}
		, setUnitNames: function (_0xe517x4) {
			var _0xe517x3 = this['unitsByName'] = {};
			this['l10n']['unitNames'] = _0xe517x4;
			this['_unitNames'] = Ext['apply']({}, _0xe517x4);
			var _0xe517x2 = this['unitHash'];
			for (var _0xe517x1 in _0xe517x2) {
				if (_0xe517x2['hasOwnProperty'](_0xe517x1)) {
					var _0xe517x5 = _0xe517x2[_0xe517x1];
					this['_unitNames'][_0xe517x5] = this['_unitNames'][_0xe517x1];
					_0xe517x3[_0xe517x1] = _0xe517x5;
					_0xe517x3[_0xe517x5] = _0xe517x5
				}
			}
		}
		, betweenLesser: function (_0xe517x2, _0xe517x5, _0xe517x1) {
			return _0xe517x5 <= _0xe517x2 && _0xe517x2 < _0xe517x1
		}
		, betweenLesserEqual: function (_0xe517x2, _0xe517x5, _0xe517x1) {
			return _0xe517x5 <= _0xe517x2 && _0xe517x2 <= _0xe517x1
		}
		, constrain: function (_0xe517x2, _0xe517x5, _0xe517x1) {
			return this['min'](this['max'](_0xe517x2, _0xe517x5), _0xe517x1)
		}
		, compareUnits: function (_0xe517x5, _0xe517x2) {
			var _0xe517x1 = Ext['Array']['indexOf'](this['units'], _0xe517x5)
				, _0xe517x3 = Ext['Array']['indexOf'](this['units'], _0xe517x2);
			return _0xe517x1 > _0xe517x3 ? 1 : (_0xe517x1 < _0xe517x3 ? -1 : 0)
		}
		, isUnitGreater: function (_0xe517x2, _0xe517x1) {
			return this['compareUnits'](_0xe517x2, _0xe517x1) > 0
		}
		, copyTimeValues: function (_0xe517x2, _0xe517x1) {
			_0xe517x2['setHours'](_0xe517x1['getHours']());
			_0xe517x2['setMinutes'](_0xe517x1['getMinutes']());
			_0xe517x2['setSeconds'](_0xe517x1['getSeconds']());
			_0xe517x2['setMilliseconds'](_0xe517x1['getMilliseconds']())
		}
		, add: function (_0xe517x2, _0xe517x5, _0xe517x4) {
			var _0xe517x6 = Ext['Date']['clone'](_0xe517x2);
			if (!_0xe517x5 || _0xe517x4 === 0) {
				return _0xe517x6
			};
			switch (_0xe517x5['toLowerCase']()) {
			case this['MILLI']:
				_0xe517x6 = new Date(_0xe517x2['getTime']() + _0xe517x4);
				break;
			case this['SECOND']:
				_0xe517x6 = new Date(_0xe517x2['getTime']() + (_0xe517x4 * 1000));
				break;
			case this['MINUTE']:
				_0xe517x6 = new Date(_0xe517x2['getTime']() + (_0xe517x4 * 60000));
				break;
			case this['HOUR']:
				_0xe517x6 = new Date(_0xe517x2['getTime']() + (_0xe517x4 * 3600000));
				break;
			case this['DAY']:
				_0xe517x6['setDate'](_0xe517x2['getDate']() + _0xe517x4);
				if (_0xe517x6['getHours']() === 23 && _0xe517x2['getHours']() === 0) {
					_0xe517x6 = Ext['Date']['add'](_0xe517x6, Ext['Date'].HOUR, 1)
				};
				break;
			case this['WEEK']:
				_0xe517x6['setDate'](_0xe517x2['getDate']() + _0xe517x4 * 7);
				break;
			case this['MONTH']:
				var _0xe517x1 = _0xe517x2['getDate']();
				if (_0xe517x1 > 28) {
					_0xe517x1 = Math['min'](_0xe517x1, Ext['Date']['getLastDateOfMonth'](this['add'](Ext['Date']['getFirstDateOfMonth'](_0xe517x2), this.MONTH, _0xe517x4))['getDate']())
				};
				_0xe517x6['setDate'](_0xe517x1);
				_0xe517x6['setMonth'](_0xe517x6['getMonth']() + _0xe517x4);
				break;
			case this['QUARTER']:
				_0xe517x6 = this['add'](_0xe517x2, this.MONTH, _0xe517x4 * 3);
				break;
			case this['YEAR']:
				_0xe517x6['setFullYear'](_0xe517x2['getFullYear']() + _0xe517x4);
				break
			};
			return _0xe517x6
		}
		, getUnitDurationInMs: function (_0xe517x1) {
			return this['add'](new Date(1, 0, 1), _0xe517x1, 1) - new Date(1, 0, 1)
		}
		, getMeasuringUnit: function (_0xe517x1) {
			if (_0xe517x1 === this['WEEK']) {
				return this['DAY']
			};
			return _0xe517x1
		}
		, getDurationInUnit: function (_0xe517x4, _0xe517x1, _0xe517x5, _0xe517x3) {
			var _0xe517x2;
			switch (_0xe517x5) {
			case this['YEAR']:
				_0xe517x2 = this['getDurationInYears'](_0xe517x4, _0xe517x1);
				break;
			case this['QUARTER']:
				_0xe517x2 = this['getDurationInMonths'](_0xe517x4, _0xe517x1) / 3;
				break;
			case this['MONTH']:
				_0xe517x2 = this['getDurationInMonths'](_0xe517x4, _0xe517x1);
				break;
			case this['WEEK']:
				_0xe517x2 = this['getDurationInDays'](_0xe517x4, _0xe517x1) / 7;
				break;
			case this['DAY']:
				_0xe517x2 = this['getDurationInDays'](_0xe517x4, _0xe517x1);
				break;
			case this['HOUR']:
				_0xe517x2 = this['getDurationInHours'](_0xe517x4, _0xe517x1);
				break;
			case this['MINUTE']:
				_0xe517x2 = this['getDurationInMinutes'](_0xe517x4, _0xe517x1);
				break;
			case this['SECOND']:
				_0xe517x2 = this['getDurationInSeconds'](_0xe517x4, _0xe517x1);
				break;
			case this['MILLI']:
				_0xe517x2 = this['getDurationInMilliseconds'](_0xe517x4, _0xe517x1);
				break
			};
			return _0xe517x3 ? _0xe517x2 : Math['round'](_0xe517x2)
		}
		, getUnitToBaseUnitRatio: function (_0xe517x2, _0xe517x1) {
			if (_0xe517x2 === _0xe517x1) {
				return 1
			};
			switch (_0xe517x2) {
			case this['YEAR']:
				switch (_0xe517x1) {
				case this['QUARTER']:
					return 1 / 4;
				case this['MONTH']:
					return 1 / 12
				};
				break;
			case this['QUARTER']:
				switch (_0xe517x1) {
				case this['YEAR']:
					return 4;
				case this['MONTH']:
					return 1 / 3
				};
				break;
			case this['MONTH']:
				switch (_0xe517x1) {
				case this['YEAR']:
					return 12;
				case this['QUARTER']:
					return 3
				};
				break;
			case this['WEEK']:
				switch (_0xe517x1) {
				case this['DAY']:
					return 1 / 7;
				case this['HOUR']:
					return 1 / 168
				};
				break;
			case this['DAY']:
				switch (_0xe517x1) {
				case this['WEEK']:
					return 7;
				case this['HOUR']:
					return 1 / 24;
				case this['MINUTE']:
					return 1 / 1440
				};
				break;
			case this['HOUR']:
				switch (_0xe517x1) {
				case this['DAY']:
					return 24;
				case this['MINUTE']:
					return 1 / 60
				};
				break;
			case this['MINUTE']:
				switch (_0xe517x1) {
				case this['HOUR']:
					return 60;
				case this['SECOND']:
					return 1 / 60;
				case this['MILLI']:
					return 1 / 60000
				};
				break;
			case this['SECOND']:
				switch (_0xe517x1) {
				case this['MILLI']:
					return 1 / 1000
				};
				break;
			case this['MILLI']:
				switch (_0xe517x1) {
				case this['SECOND']:
					return 1000
				};
				break
			};
			return -1
		}
		, isUnitDivisibleIntoSubunit: function (_0xe517x2, _0xe517x1) {
			var _0xe517x5 = _0xe517x2 === this['MONTH'] && _0xe517x1 === this['WEEK'];
			return !_0xe517x5
		}
		, getDurationInMilliseconds: function (_0xe517x2, _0xe517x1) {
			return (_0xe517x1 - _0xe517x2)
		}
		, getDurationInSeconds: function (_0xe517x2, _0xe517x1) {
			return (_0xe517x1 - _0xe517x2) / 1000
		}
		, getDurationInMinutes: function (_0xe517x2, _0xe517x1) {
			return (_0xe517x1 - _0xe517x2) / 60000
		}
		, getDurationInHours: function (_0xe517x2, _0xe517x1) {
			return (_0xe517x1 - _0xe517x2) / 3600000
		}
		, getDurationInDays: function (_0xe517x5, _0xe517x2) {
			var _0xe517x1 = _0xe517x5['getTimezoneOffset']() - _0xe517x2['getTimezoneOffset']();
			return (_0xe517x2 - _0xe517x5 + _0xe517x1 * 60 * 1000) / 86400000
		}
		, getDurationInMonths: function (_0xe517x2, _0xe517x1) {
			return ((_0xe517x1['getFullYear']() - _0xe517x2['getFullYear']()) * 12) + (_0xe517x1['getMonth']() - _0xe517x2['getMonth']())
		}
		, getDurationInYears: function (_0xe517x2, _0xe517x1) {
			return this['getDurationInMonths'](_0xe517x2, _0xe517x1) / 12
		}
		, min: function (_0xe517x2, _0xe517x1) {
			return (_0xe517x2 && _0xe517x2.valueOf() || _0xe517x2) < (_0xe517x1 && _0xe517x1.valueOf() || _0xe517x1) ? _0xe517x2 : _0xe517x1
		}
		, max: function (_0xe517x2, _0xe517x1) {
			return (_0xe517x2 && _0xe517x2.valueOf() || _0xe517x2) > (_0xe517x1 && _0xe517x1.valueOf() || _0xe517x1) ? _0xe517x2 : _0xe517x1
		}
		, intersectSpans: function (_0xe517x5, _0xe517x3, _0xe517x2, _0xe517x1) {
			return this['betweenLesser'](_0xe517x5, _0xe517x2, _0xe517x1) || this['betweenLesser'](_0xe517x2, _0xe517x5, _0xe517x3)
		}
		, getNameOfUnit: function (_0xe517x1) {
			_0xe517x1 = this['getUnitByName'](_0xe517x1);
			switch (_0xe517x1['toLowerCase']()) {
			case this['YEAR']:
				return 'YEAR';
			case this['QUARTER']:
				return 'QUARTER';
			case this['MONTH']:
				return 'MONTH';
			case this['WEEK']:
				return 'WEEK';
			case this['DAY']:
				return 'DAY';
			case this['HOUR']:
				return 'HOUR';
			case this['MINUTE']:
				return 'MINUTE';
			case this['SECOND']:
				return 'SECOND';
			case this['MILLI']:
				return 'MILLI'
			};
			throw 'Incorrect UnitName'
		}
		, getReadableNameOfUnit: function (_0xe517x2, _0xe517x1) {
			if (!this['isLocaleApplied']()) {
				this['applyLocale']()
			};
			return this['_unitNames'][_0xe517x2][_0xe517x1 ? 'plural' : 'single']
		}
		, getShortNameOfUnit: function (_0xe517x1) {
			if (!this['isLocaleApplied']()) {
				this['applyLocale']()
			};
			return this['_unitNames'][_0xe517x1]['abbrev']
		}
		, getUnitByName: function (_0xe517x1) {
			if (!this['isLocaleApplied']()) {
				this['applyLocale']()
			};
			if (!this['unitsByName'][_0xe517x1]) {
				Ext['Error']['raise']('Unknown unit name: ' + _0xe517x1)
			};
			return this['unitsByName'][_0xe517x1]
		}
		, getNext: function (_0xe517x5, _0xe517x7, _0xe517x1, _0xe517x6) {
			var _0xe517x4 = Ext['Date']['clone'](_0xe517x5);
			_0xe517x6 = arguments['length'] < 4 ? 1 : _0xe517x6;
			_0xe517x1 = _0xe517x1 == null ? 1 : _0xe517x1;
			switch (_0xe517x7) {
			case this['MILLI']:
				_0xe517x4 = this['add'](_0xe517x5, _0xe517x7, _0xe517x1);
				break;
			case this['SECOND']:
				_0xe517x4 = this['add'](_0xe517x5, _0xe517x7, _0xe517x1);
				if (_0xe517x4['getMilliseconds']() > 0) {
					_0xe517x4['setMilliseconds'](0)
				};
				break;
			case this['MINUTE']:
				_0xe517x4 = this['add'](_0xe517x5, _0xe517x7, _0xe517x1);
				if (_0xe517x4['getSeconds']() > 0) {
					_0xe517x4['setSeconds'](0)
				};
				if (_0xe517x4['getMilliseconds']() > 0) {
					_0xe517x4['setMilliseconds'](0)
				};
				break;
			case this['HOUR']:
				_0xe517x4 = this['add'](_0xe517x5, _0xe517x7, _0xe517x1);
				if (_0xe517x4['getMinutes']() > 0) {
					_0xe517x4['setMinutes'](0)
				};
				if (_0xe517x4['getSeconds']() > 0) {
					_0xe517x4['setSeconds'](0)
				};
				if (_0xe517x4['getMilliseconds']() > 0) {
					_0xe517x4['setMilliseconds'](0)
				};
				break;
			case this['DAY']:
				var _0xe517x3 = _0xe517x5['getHours']() === 23 && this['add'](_0xe517x4, this.HOUR, 1)['getHours']() === 1;
				if (_0xe517x3) {
					_0xe517x4 = this['add'](_0xe517x4, this.DAY, 2);
					this['clearTime'](_0xe517x4);
					return _0xe517x4
				};
				this['clearTime'](_0xe517x4);
				_0xe517x4 = this['add'](_0xe517x4, this.DAY, _0xe517x1);
				if (_0xe517x4['getHours']() === 1) {
					this['clearTime'](_0xe517x4)
				};
				break;
			case this['WEEK']:
				this['clearTime'](_0xe517x4);
				var _0xe517x2 = _0xe517x4['getDay']();
				_0xe517x4 = this['add'](_0xe517x4, this.DAY, _0xe517x6 - _0xe517x2 + 7 * (_0xe517x1 - (_0xe517x6 <= _0xe517x2 ? 0 : 1)));
				if (_0xe517x4['getDay']() !== _0xe517x6) {
					_0xe517x4 = this['add'](_0xe517x4, this.HOUR, 1)
				}
				else {
					this['clearTime'](_0xe517x4)
				};
				break;
			case this['MONTH']:
				_0xe517x4 = this['add'](_0xe517x4, this.MONTH, _0xe517x1);
				_0xe517x4['setDate'](1);
				this['clearTime'](_0xe517x4);
				break;
			case this['QUARTER']:
				_0xe517x4 = this['add'](_0xe517x4, this.MONTH, ((_0xe517x1 - 1) * 3) + (3 - (_0xe517x4['getMonth']() % 3)));
				this['clearTime'](_0xe517x4);
				_0xe517x4['setDate'](1);
				break;
			case this['YEAR']:
				_0xe517x4 = new Date(_0xe517x4['getFullYear']() + _0xe517x1, 0, 1);
				break;
			default:
				throw new Error('Invalid date unit' + _0xe517x7)
			};
			return _0xe517x4
		}
		, getNumberOfMsFromTheStartOfDay: function (_0xe517x1) {
			return _0xe517x1 - this['clearTime'](_0xe517x1, true) || 86400000
		}
		, getNumberOfMsTillTheEndOfDay: function (_0xe517x1) {
			return this['getStartOfNextDay'](_0xe517x1, true) - _0xe517x1
		}
		, getStartOfNextDay: function (_0xe517x2, _0xe517x6, _0xe517x4) {
			var _0xe517x3 = this['add'](_0xe517x4 ? _0xe517x2 : this['clearTime'](_0xe517x2, _0xe517x6), this.DAY, 1);
			if (_0xe517x3['getDate']() == _0xe517x2['getDate']()) {
				var _0xe517x5 = this['add'](this['clearTime'](_0xe517x2, _0xe517x6), this.DAY, 2)['getTimezoneOffset']();
				var _0xe517x1 = _0xe517x2['getTimezoneOffset']();
				_0xe517x3 = this['add'](_0xe517x3, this.MINUTE, _0xe517x1 - _0xe517x5)
			};
			return _0xe517x3
		}
		, getEndOfPreviousDay: function (_0xe517x2, _0xe517x5) {
			var _0xe517x1 = _0xe517x5 ? _0xe517x2 : this['clearTime'](_0xe517x2, true);
			if (_0xe517x1 - _0xe517x2) {
				return _0xe517x1
			}
			else {
				return this['add'](_0xe517x1, this.DAY, -1)
			}
		}
		, timeSpanContains: function (_0xe517x5, _0xe517x2, _0xe517x3, _0xe517x1) {
			return (_0xe517x3 - _0xe517x5) >= 0 && (_0xe517x2 - _0xe517x1) >= 0
		}
		, compareWithPrecision: function (_0xe517x4, _0xe517x5, _0xe517x6) {
			var _0xe517x3 = Ext.ux.Scheduler['util']['Date']
				, _0xe517x2 = Ext['Date']
				, _0xe517x1;
			switch (_0xe517x6) {
			case _0xe517x3['DAY']:
				_0xe517x4 = Number(_0xe517x2['format'](_0xe517x4, 'Ymd'));
				_0xe517x5 = Number(_0xe517x2['format'](_0xe517x5, 'Ymd'));
				break;
			case _0xe517x3['WEEK']:
				_0xe517x4 = Number(_0xe517x2['format'](_0xe517x4, 'YmW'));
				_0xe517x5 = Number(_0xe517x2['format'](_0xe517x5, 'YmW'));
				break;
			case _0xe517x3['MONTH']:
				_0xe517x4 = Number(_0xe517x2['format'](_0xe517x4, 'Ym'));
				_0xe517x5 = Number(_0xe517x2['format'](_0xe517x5, 'Ym'));
				break;
			case _0xe517x3['QUARTER']:
				_0xe517x4 = _0xe517x4['getFullYear']() * 4 + Math['floor'](_0xe517x4['getMonth']() / 3);
				_0xe517x5 = _0xe517x5['getFullYear']() * 4 + Math['floor'](_0xe517x5['getMonth']() / 3);
				break;
			case _0xe517x3['YEAR']:
				_0xe517x4 = _0xe517x4['getFullYear']();
				_0xe517x5 = _0xe517x5['getFullYear']();
				break;
			default:
				;
			case _0xe517x3['MILLI']:
				;
			case _0xe517x3['SECOND']:
				;
			case _0xe517x3['MINUTE']:
				;
			case _0xe517x3['HOUR']:
				_0xe517x6 = _0xe517x6 && this['getUnitDurationInMs'](_0xe517x6) || 1;
				_0xe517x4 = Math['floor'](_0xe517x4.valueOf() / _0xe517x6);
				_0xe517x5 = Math['floor'](_0xe517x5.valueOf() / _0xe517x6);
				break
			};
			((_0xe517x4 < _0xe517x5) && (_0xe517x1 = -1)) || ((_0xe517x4 > _0xe517x5) && (_0xe517x1 = +1)) || (_0xe517x1 = 0);
			return _0xe517x1
		}
		, getValueInUnits: function (_0xe517x1, _0xe517x2) {
			switch (_0xe517x2) {
			case this['YEAR']:
				return _0xe517x1['getFullYear']();
			case this['QUARTER']:
				return Math['floor'](_0xe517x1['getMonth']() / 3) + 1;
			case this['MONTH']:
				return _0xe517x1['getMonth']();
			case this['WEEK']:
				return Ext['Date']['getWeekOfYear'](_0xe517x1);
			case this['DAY']:
				return _0xe517x1['getDate']();
			case this['HOUR']:
				return _0xe517x1['getHours']();
			case this['MINUTE']:
				return _0xe517x1['getMinutes']();
			case this['SECOND']:
				return _0xe517x1['getSeconds']()
			}
		}
		, setValueInUnits: function (_0xe517x2, _0xe517x5, _0xe517x4) {
			var _0xe517x1 = Ext['Date']['clone'](_0xe517x2)
				, _0xe517x3;
			switch (_0xe517x5) {
			case this['YEAR']:
				_0xe517x3 = 'setFullYear';
				break;
			case this['MONTH']:
				_0xe517x3 = 'setMonth';
				break;
			case this['DAY']:
				_0xe517x3 = 'setDate';
				break;
			case this['HOUR']:
				_0xe517x3 = 'setHours';
				break;
			case this['MINUTE']:
				_0xe517x3 = 'setMinutes';
				break;
			case this['SECOND']:
				_0xe517x3 = 'setSeconds';
				break;
			case this['MILLI']:
				_0xe517x3 = 'setMilliseconds';
				break
			};
			_0xe517x1[_0xe517x3](_0xe517x4);
			return _0xe517x1
		}
		, getSubUnit: function (_0xe517x1) {
			switch (_0xe517x1) {
			case this['YEAR']:
				return this['MONTH'];
			case this['MONTH']:
				return this['DAY'];
			case this['DAY']:
				return this['HOUR'];
			case this['HOUR']:
				return this['MINUTE'];
			case this['MINUTE']:
				return this['SECOND'];
			case this['SECOND']:
				return this['MILLI']
			}
		}
		, setValueInSubUnits: function (_0xe517x1, _0xe517x2, _0xe517x5) {
			_0xe517x2 = this['getSubUnit'](_0xe517x2);
			return this['setValueInUnits'](_0xe517x1, _0xe517x2, _0xe517x5)
		}
		, mergeDates: function (_0xe517x5, _0xe517x2, _0xe517x1) {
			var _0xe517x3 = Ext['Date']['clone'](_0xe517x5);
			switch (_0xe517x1) {
			case this['YEAR']:
				_0xe517x3['setFullYear'](_0xe517x2['getFullYear']());
			case this['MONTH']:
				_0xe517x3['setMonth'](_0xe517x2['getMonth']());
			case this['WEEK']:
				;
			case this['DAY']:
				if (_0xe517x1 === this['WEEK']) {
					_0xe517x3 = this['add'](_0xe517x3, this.DAY, _0xe517x2['getDay']() - _0xe517x3['getDay']())
				}
				else {
					_0xe517x3['setDate'](_0xe517x2['getDate']())
				};
			case this['HOUR']:
				_0xe517x3['setHours'](_0xe517x2['getHours']());
			case this['MINUTE']:
				_0xe517x3['setMinutes'](_0xe517x2['getMinutes']());
			case this['SECOND']:
				_0xe517x3['setSeconds'](_0xe517x2['getSeconds']());
			case this['MILLI']:
				_0xe517x3['setMilliseconds'](_0xe517x2['getMilliseconds']())
			};
			return _0xe517x3
		}
		, splitToSubUnits: function (_0xe517x3, _0xe517x5, _0xe517x1, _0xe517x2) {
			_0xe517x1 = _0xe517x1 || 1;
			_0xe517x2 = arguments['length'] < 4 ? 1 : _0xe517x2;
			switch (_0xe517x5) {
			case this['MONTH']:
				return this['splitMonth'](_0xe517x3, _0xe517x1, _0xe517x2);
			case this['WEEK']:
				;
			case this['DAY']:
				return this['splitDay'](_0xe517x3, _0xe517x1);
			default:
				break
			}
		}
		, splitYear: function (_0xe517x4, _0xe517x5) {
			var _0xe517x2 = this['clearTime'](_0xe517x4, true);
			_0xe517x2['setMonth'](0);
			_0xe517x2['setDate'](1);
			var _0xe517x1 = [];
			for (var _0xe517x3 = 0; _0xe517x3 <= 12; _0xe517x3 = _0xe517x3 + _0xe517x5) {
				_0xe517x1['push'](this['add'](_0xe517x2, this.MONTH, _0xe517x3))
			};
			return _0xe517x1
		}
		, splitMonth: function (_0xe517xc, _0xe517x5, _0xe517x7) {
			var _0xe517x2 = this['clearTime'](_0xe517xc, true);
			_0xe517x2['setDate'](1);
			_0xe517x2 = this['add'](_0xe517x2, this.DAY, _0xe517x7 - _0xe517x2['getDay']());
			var _0xe517x3 = Ext['Date']['clone'](_0xe517x2);
			var _0xe517x6 = this['add'](_0xe517x2, this.MONTH, 1);
			var _0xe517x1 = [];
			for (var _0xe517x4 = 0; _0xe517x3['getTime']() < _0xe517x6['getTime'](); _0xe517x4 = _0xe517x4 + _0xe517x5) {
				_0xe517x3 = this['add'](_0xe517x2, this.WEEK, _0xe517x4);
				_0xe517x1['push'](_0xe517x3)
			};
			return _0xe517x1
		}
		, splitWeek: function (_0xe517x6, _0xe517x5, _0xe517x4) {
			var _0xe517x2 = this['add'](_0xe517x6, this.DAY, _0xe517x4 - _0xe517x6['getDay']());
			_0xe517x2 = this['clearTime'](_0xe517x2);
			var _0xe517x1 = [];
			for (var _0xe517x3 = 0; _0xe517x3 <= 7; _0xe517x3 = _0xe517x3 + _0xe517x5) {
				_0xe517x1['push'](this['add'](_0xe517x2, this.DAY, _0xe517x3))
			};
			return _0xe517x1
		}
		, splitDay: function (_0xe517x4, _0xe517x2) {
			var _0xe517x3 = this['clearTime'](_0xe517x4, true);
			var _0xe517x1 = [];
			for (var _0xe517x5 = 0; _0xe517x5 <= 24; _0xe517x5 = _0xe517x5 + _0xe517x2) {
				_0xe517x1['push'](this['add'](_0xe517x3, this.HOUR, _0xe517x5))
			};
			return _0xe517x1
		}
		, splitHour: function (_0xe517x4, _0xe517x2) {
			var _0xe517x3 = new Date(_0xe517x4['getTime']());
			_0xe517x3['setMinutes'](0);
			_0xe517x3['setSeconds'](0);
			_0xe517x3['setMilliseconds'](0);
			var _0xe517x1 = [];
			for (var _0xe517x5 = 0; _0xe517x5 <= 60; _0xe517x5 = _0xe517x5 + _0xe517x2) {
				_0xe517x1['push'](this['add'](_0xe517x3, this.MINUTE, _0xe517x5))
			};
			return _0xe517x1
		}
		, splitMinute: function (_0xe517x4, _0xe517x2) {
			var _0xe517x3 = Ext['Date']['clone'](_0xe517x4);
			_0xe517x3['setSeconds'](0);
			_0xe517x3['setMilliseconds'](0);
			var _0xe517x1 = [];
			for (var _0xe517x5 = 0; _0xe517x5 <= 60; _0xe517x5 = _0xe517x5 + _0xe517x2) {
				_0xe517x1['push'](this['add'](_0xe517x3, this.SECOND, _0xe517x5))
			};
			return _0xe517x1
		}
		, clearTime: function (_0xe517x1, _0xe517x2) {
			if (_0xe517x1['getHours']() > 0 || _0xe517x1['getMinutes']() > 0 || _0xe517x1['getSeconds']() > 0) {
				return Ext['Date']['clearTime'](_0xe517x1, _0xe517x2)
			};
			return _0xe517x2 ? Ext['Date']['clone'](_0xe517x1) : _0xe517x1
		}
		, getWeekNumber: function (_0xe517x1) {
			var _0xe517x2 = new Date(_0xe517x1.valueOf());
			var _0xe517x5 = (_0xe517x1['getDay']() + 6) % 7;
			_0xe517x2['setDate'](_0xe517x2['getDate']() - _0xe517x5 + 3);
			var _0xe517x3 = _0xe517x2.valueOf();
			_0xe517x2['setMonth'](0, 1);
			if (_0xe517x2['getDay']() != 4) {
				_0xe517x2['setMonth'](0, 1 + ((4 - _0xe517x2['getDay']()) + 7) % 7)
			};
			return 1 + Math['ceil']((_0xe517x3 - _0xe517x2) / 604800000)
		}
		, getWeekStartDate: function (_0xe517x1, _0xe517x5) {
			var _0xe517x2 = this['setDateToMidday'](_0xe517x1, true);
			_0xe517x5 = typeof _0xe517x5 !== 'number' ? 1 : _0xe517x5;
			while (_0xe517x2['getDay']() !== _0xe517x5) {
				_0xe517x2 = Ext.ux.Scheduler['util']['Date']['add'](_0xe517x2, Ext.ux.Scheduler['util']['Date'].DAY, -1)
			};
			return _0xe517x2
		}
		, getWeekEndDate: function (_0xe517x2, _0xe517x1) {
			var _0xe517x5 = this['setDateToMidday'](_0xe517x2, true);
			_0xe517x1 = typeof _0xe517x1 !== 'number' ? 0 : _0xe517x1;
			while (_0xe517x5['getDay']() !== _0xe517x1) {
				_0xe517x5 = Ext.ux.Scheduler['util']['Date']['add'](_0xe517x5, Ext.ux.Scheduler['util']['Date'].DAY, 1)
			};
			return _0xe517x5
		}
		, setDateToHours: function (_0xe517x2, _0xe517x5, _0xe517x1) {
			if (_0xe517x5) {
				return new Date(_0xe517x2['getFullYear'](), _0xe517x2['getMonth'](), _0xe517x2['getDate'](), _0xe517x1)
			};
			_0xe517x2['setHours'](_0xe517x1);
			_0xe517x2['setMinutes'](0);
			_0xe517x2['setSeconds'](0);
			_0xe517x2['setMilliseconds'](0);
			return _0xe517x2
		}
		, setDateToMidnight: function (_0xe517x1, _0xe517x2) {
			return this['setDateToHours'](_0xe517x1, _0xe517x2, 0)
		}
		, setDateToMidday: function (_0xe517x1, _0xe517x2) {
			return this['setDateToHours'](_0xe517x1, _0xe517x2, 12)
		}
		, isLaterDate: function (_0xe517x1, _0xe517x2) {
			return !this['isSameDate'](_0xe517x1, _0xe517x2) && _0xe517x1 > _0xe517x2
		}
		, isSameDate: function (_0xe517x1, _0xe517x2) {
			return _0xe517x1['getFullYear']() === _0xe517x2['getFullYear']() && _0xe517x1['getMonth']() === _0xe517x2['getMonth']() && _0xe517x1['getDate']() === _0xe517x2['getDate']()
		}
		, isEarlierDate: function (_0xe517x1, _0xe517x2) {
			return !this['isSameDate'](_0xe517x1, _0xe517x2) && _0xe517x1 < _0xe517x2
		}
	});
	Ext.define('Ext.ux.Scheduler.data.util.IdConsistencyManager', {
		config: {
			eventStore: null
			, resourceStore: null
			, assignmentStore: null
			, dependencyStore: null
		}
		, eventStoreDetacher: null
		, resourceStoreDetacher: null
		, constructor: function (_0xe517x1) {
			this['initConfig'](_0xe517x1)
		}
		, updateEventStore: function (_0xe517x1, _0xe517x5) {
			var _0xe517x2 = this;
			Ext['destroyMembers'](_0xe517x2, 'eventStoreDetacher');
			if (_0xe517x1) {
				_0xe517x2['eventStoreDetacher'] = _0xe517x1['on']({
					idchanged: _0xe517x2['onEventIdChanged']
					, scope: _0xe517x2
					, destroyable: true
					, priority: 200
				})
			}
		}
		, updateResourceStore: function (_0xe517x1, _0xe517x2) {
			var _0xe517x5 = this;
			Ext['destroyMembers'](_0xe517x5, 'resourceStoreDetacher');
			if (_0xe517x1) {
				_0xe517x5['resourceStoreDetacher'] = _0xe517x1['on']({
					idchanged: _0xe517x5['onResourceIdChanged']
					, scope: _0xe517x5
					, destroyable: true
					, priority: 200
				})
			}
		}
		, onEventIdChanged: function (_0xe517x6, _0xe517x1, _0xe517x3, _0xe517x4) {
			var _0xe517xd = this
				, _0xe517x7 = _0xe517xd['getAssignmentStore']()
				, _0xe517x5 = _0xe517xd['getDependencyStore']()
				, _0xe517x2, _0xe517xc;
			if (_0xe517x7) {
				_0xe517x2 = _0xe517xd['getUpdateAssignmentEventIdFieldFn'](_0xe517x7, _0xe517x3, _0xe517x4)
			};
			if (_0xe517x5) {
				_0xe517xc = _0xe517xd['getUpdateDependencySourceTargedIdFieldFn'](_0xe517x5, _0xe517x3, _0xe517x4)
			};
			if (_0xe517x2 || _0xe517xc) {
				_0xe517x6['on']('update', function () {
					_0xe517x2 && _0xe517x2();
					_0xe517xc && _0xe517xc()
				}, null, {
					single: true
					, priority: 200
				})
			}
		}
		, onResourceIdChanged: function (_0xe517xd, _0xe517x4, _0xe517x2, _0xe517x3) {
			var _0xe517xc = this
				, _0xe517x6 = _0xe517xc['getEventStore']()
				, _0xe517x7 = _0xe517xc['getAssignmentStore']()
				, _0xe517x5, _0xe517x1;
			if (_0xe517x6 && !_0xe517x7) {
				_0xe517x5 = _0xe517xc['getUpdateEventResourceIdFieldFn'](_0xe517x6, _0xe517x2, _0xe517x3)
			};
			if (_0xe517x7) {
				_0xe517x1 = _0xe517xc['getUpdateAssignmentResourceIdFieldFn'](_0xe517x7, _0xe517x2, _0xe517x3)
			};
			if (_0xe517x5 || _0xe517x7) {
				_0xe517xd['on']('update', function () {
					_0xe517x5 && _0xe517x5();
					_0xe517x1 && _0xe517x1()
				}, null, {
					single: true
					, priority: 200
				})
			}
		}
		, getUpdateEventResourceIdFieldFn: function (_0xe517x5, _0xe517x3, _0xe517x1) {
			var _0xe517x2 = _0xe517x5['getRange']();
			return function () {
				Ext['Array']['each'](_0xe517x2, function (_0xe517x4) {
					_0xe517x4['getResourceId']() == _0xe517x3 && _0xe517x4['setResourceId'](_0xe517x1)
				})
			}
		}
		, getUpdateAssignmentEventIdFieldFn: function (_0xe517x5, _0xe517x3, _0xe517x2) {
			var _0xe517x1 = _0xe517x5['getAssignmentsForEvent'](_0xe517x3);
			return function () {
				Ext['Array']['each'](_0xe517x1, function (_0xe517x4) {
					_0xe517x4['getEventId']() == _0xe517x3 && _0xe517x4['setEventId'](_0xe517x2)
				})
			}
		}
		, getUpdateAssignmentResourceIdFieldFn: function (_0xe517x5, _0xe517x3, _0xe517x2) {
			var _0xe517x1 = _0xe517x5['getAssignmentsForResource'](_0xe517x3);
			return function () {
				Ext['Array']['each'](_0xe517x1, function (_0xe517x4) {
					_0xe517x4['getResourceId']() == _0xe517x3 && _0xe517x4['setResourceId'](_0xe517x2)
				})
			}
		}
		, getUpdateDependencySourceTargedIdFieldFn: function (_0xe517x2, _0xe517x3, _0xe517x1) {
			var _0xe517x5 = _0xe517x2['getEventDependencies'](_0xe517x3);
			return function () {
				Ext['Array']['each'](_0xe517x5, function (_0xe517x4) {
					_0xe517x4['getSourceId']() == _0xe517x3 && _0xe517x4['setSourceId'](_0xe517x1);
					_0xe517x4['getTargetId']() == _0xe517x3 && _0xe517x4['setTargetId'](_0xe517x1)
				})
			}
		}
	});
	Ext.define('Ext.ux.Scheduler.data.util.ModelPersistencyManager', {
		config: {
			eventStore: null
			, resourceStore: null
			, assignmentStore: null
			, dependencyStore: null
		}
		, eventStoreDetacher: null
		, resourceStoreDetacher: null
		, assignmentStoreDetacher: null
		, dependencyStoreDetacher: null
		, constructor: function (_0xe517x1) {
			this['initConfig'](_0xe517x1)
		}
		, updateEventStore: function (_0xe517x1, _0xe517x5) {
			var _0xe517x2 = this;
			Ext['destroyMembers'](_0xe517x2, 'eventStoreDetacher');
			if (_0xe517x1 && _0xe517x1['autoSync']) {
				_0xe517x2['eventStoreDetacher'] = _0xe517x1['on']({
					beforesync: _0xe517x2['onEventStoreBeforeSync']
					, scope: _0xe517x2
					, destroyable: true
					, priority: 100
				})
			}
		}
		, updateResourceStore: function (_0xe517x1, _0xe517x2) {
			var _0xe517x5 = this;
			Ext['destroyMembers'](_0xe517x5, 'resourceStoreDetacher');
			if (_0xe517x1 && _0xe517x1['autoSync']) {
				_0xe517x5['resourceStoreDetacher'] = _0xe517x1['on']({
					beforesync: _0xe517x5['onResourceStoreBeforeSync']
					, scope: _0xe517x5
					, destroyable: true
					, priority: 100
				})
			}
		}
		, updateAssignmentStore: function (_0xe517x1, _0xe517x2) {
			var _0xe517x5 = this;
			Ext['destroyMembers'](_0xe517x5, 'assignmentStoreDetacher');
			if (_0xe517x1 && _0xe517x1['autoSync']) {
				_0xe517x5['assignmentStoreDetacher'] = _0xe517x1['on']({
					beforesync: _0xe517x5['onAssignmentStoreBeforeSync']
					, scope: _0xe517x5
					, destroyable: true
					, priority: 100
				})
			}
		}
		, updateDependencyStore: function (_0xe517x5, _0xe517x1) {
			var _0xe517x2 = this;
			Ext['destroyMembers'](_0xe517x2, 'dependencyStoreDetacher');
			if (_0xe517x5 && _0xe517x5['autoSync']) {
				_0xe517x2['dependencyStoreDetacher'] = _0xe517x5['on']({
					beforesync: _0xe517x2['onDependencyStoreBeforeSync']
					, scope: _0xe517x2
					, destroyable: true
					, priority: 100
				})
			}
		}
		, onEventStoreBeforeSync: function (_0xe517x1) {
			var _0xe517x2 = this;
			_0xe517x2['removeNonPersistableRecordsToCreate'](_0xe517x1);
			return _0xe517x2['shallContinueSync'](_0xe517x1)
		}
		, onResourceStoreBeforeSync: function (_0xe517x1) {
			var _0xe517x2 = this;
			_0xe517x2['removeNonPersistableRecordsToCreate'](_0xe517x1);
			return _0xe517x2['shallContinueSync'](_0xe517x1)
		}
		, onAssignmentStoreBeforeSync: function (_0xe517x1) {
			var _0xe517x2 = this;
			_0xe517x2['removeNonPersistableRecordsToCreate'](_0xe517x1);
			return _0xe517x2['shallContinueSync'](_0xe517x1)
		}
		, onDependencyStoreBeforeSync: function (_0xe517x1) {
			var _0xe517x2 = this;
			_0xe517x2['removeNonPersistableRecordsToCreate'](_0xe517x1);
			return _0xe517x2['shallContinueSync'](_0xe517x1)
		}
		, removeNonPersistableRecordsToCreate: function (_0xe517x2) {
			var _0xe517x1 = _0xe517x2['create'] || []
				, _0xe517x3, _0xe517x5;
			for (_0xe517x5 = _0xe517x1['length'] - 1; _0xe517x5 >= 0; --_0xe517x5) {
				_0xe517x3 = _0xe517x1[_0xe517x5];
				if (!_0xe517x3['isPersistable']()) {
					Ext['Array']['remove'](_0xe517x1, _0xe517x3)
				}
			};
			if (_0xe517x1['length'] === 0) {
				delete _0xe517x2['create']
			}
		}
		, shallContinueSync: function (_0xe517x1) {
			return Boolean((_0xe517x1['create'] && _0xe517x1['create']['length'] > 0) || (_0xe517x1['update'] && _0xe517x1['update']['length'] > 0) || (_0xe517x1['destroy'] && _0xe517x1['destroy']['length'] > 0))
		}
	});
	Ext.define('Ext.ux.Scheduler.util.Cache', {
		cache: null
		, constructor: function () {
			var _0xe517x1 = this;
			_0xe517x1['cache'] = {};
			_0xe517x1['self']['stats'][Ext['getClassName'](_0xe517x1)] = _0xe517x1['stats'] = {
				hit: 0
				, miss: 0
			}
		}
		, key: function (_0xe517x2) {
			var _0xe517x1;
			if (_0xe517x2 instanceof Ext['data']['Model']) {
				_0xe517x1 = _0xe517x2['getId']().toString()
			}
			else {
				if (_0xe517x2 === undefined || _0xe517x2 === null) {
					_0xe517x1 = '[ undefined / null ]'
				}
				else {
					_0xe517x1 = (_0xe517x2).toString()
				}
			};
			return _0xe517x1
		}
		, has: function (_0xe517x1) {
			var _0xe517x2 = this;
			_0xe517x1 = _0xe517x2['key'](_0xe517x1);
			return _0xe517x2['cache']['hasOwnProperty'](_0xe517x1)
		}
		, get: function (_0xe517x2, _0xe517x5) {
			var _0xe517x3 = this
				, _0xe517x1;
			_0xe517x2 = _0xe517x3['key'](_0xe517x2);
			_0xe517x1 = _0xe517x3['cache']['hasOwnProperty'](_0xe517x2) && _0xe517x3['cache'][_0xe517x2];
			!_0xe517x1 && _0xe517x5 ? (++_0xe517x3['stats']['miss']) : (++_0xe517x3['stats']['hit']);
			if (!_0xe517x1 && _0xe517x5) {
				_0xe517x1 = _0xe517x5()
			}
			else {
				if (!_0xe517x1) {
					_0xe517x1 = []
				}
			};
			_0xe517x3['cache'][_0xe517x2] = _0xe517x1;
			return _0xe517x1
		}
		, add: function (_0xe517x5, _0xe517x2) {
			var _0xe517x3 = this
				, _0xe517x1 = _0xe517x3['key'](_0xe517x5);
			if (!_0xe517x3['cache']['hasOwnProperty'](_0xe517x1)) {
				_0xe517x3['cache'][_0xe517x1] = _0xe517x3['get'](_0xe517x5)
			};
			arguments['length'] > 1 && Ext['Array']['include'](_0xe517x3['cache'][_0xe517x1], _0xe517x2);
			return _0xe517x3
		}
		, set: function (_0xe517x2, _0xe517x3) {
			var _0xe517x5 = this
				, _0xe517x1 = _0xe517x5['key'](_0xe517x2);
			_0xe517x5['cache'][_0xe517x1] = _0xe517x3;
			return _0xe517x5
		}
		, remove: function (_0xe517x2, _0xe517x1) {
			var _0xe517x5 = this;
			_0xe517x2 = _0xe517x5['key'](_0xe517x2);
			if (_0xe517x5['cache']['hasOwnProperty'](_0xe517x2)) {
				Ext['Array']['remove'](_0xe517x5['cache'][_0xe517x2], _0xe517x1)
			};
			return _0xe517x5
		}
		, move: function (_0xe517x5, _0xe517x3, _0xe517x1) {
			var _0xe517x2 = this;
			_0xe517x5 = _0xe517x2['key'](_0xe517x5);
			_0xe517x3 = _0xe517x2['key'](_0xe517x3);
			if (_0xe517x5 != _0xe517x3 && arguments['length'] >= 3) {
				_0xe517x2['remove'](_0xe517x5, _0xe517x1);
				_0xe517x2['add'](_0xe517x3, _0xe517x1)
			}
			else {
				if (_0xe517x5 != _0xe517x3 && _0xe517x2['cache']['hasOwnProperty'](_0xe517x5) && _0xe517x2['cache']['hasOwnProperty'](_0xe517x3)) {
					_0xe517x2['cache'][_0xe517x3] = Ext['Array']['union'](_0xe517x2['cache'][_0xe517x3], _0xe517x2['cache'][_0xe517x5]);
					_0xe517x2['cache'][_0xe517x5] = []
				}
				else {
					if (_0xe517x5 != _0xe517x3 && _0xe517x2['cache']['hasOwnProperty'](_0xe517x5)) {
						_0xe517x2['cache'][_0xe517x3] = _0xe517x2['cache'][_0xe517x5];
						_0xe517x2['cache'][_0xe517x5] = []
					}
				}
			};
			return _0xe517x2
		}
		, clear: function (_0xe517x1) {
			var _0xe517x2 = this;
			if (!arguments['length']) {
				_0xe517x2['cache'] = {}
			}
			else {
				_0xe517x1 = _0xe517x2['key'](_0xe517x1);
				if (_0xe517x2['cache']['hasOwnProperty'](_0xe517x1)) {
					delete _0xe517x2['cache'][_0xe517x1]
				}
			};
			return _0xe517x2
		}
		, uncache: function (_0xe517x2) {
			var _0xe517x5 = this
				, _0xe517x1;
			for (_0xe517x1 in _0xe517x5['cache']) {
				if (_0xe517x5['cache']['hasOwnProperty'](_0xe517x1)) {
					_0xe517x5['cache'][_0xe517x1] = Ext['Array']['remove'](_0xe517x5['cache'][_0xe517x1], _0xe517x2)
				}
			};
			return _0xe517x5
		}
		, inheritableStatics: {
			stats: {}
		}
	});
	Ext.define('Ext.ux.Scheduler.data.util.ResourceEventsCache', {
		extend: 'Ext.ux.Scheduler.util.Cache'
		, requires: ['Ext.data.Model']
		, eventStore: null
		, eventStoreDetacher: null
		, resourceStoreDetacher: null
		, constructor: function (_0xe517x5) {
			var _0xe517xd = this
				, _0xe517xa = _0xe517x5['getResourceStore']();
			_0xe517xd['callParent']();

			function _0xe517x13(_0xe517xe, _0xe517x9) {
				Ext['Array']['each'](_0xe517x9, function (_0xe517xb) {
					_0xe517xd['add'](_0xe517xb['getResourceId'](), _0xe517xb)
				})
			}

			function _0xe517x4(_0xe517xe, _0xe517x9) {
				Ext['Array']['each'](_0xe517x9, function (_0xe517xb) {
					_0xe517xd['remove'](_0xe517xb['getResourceId'](), _0xe517xb)
				})
			}

			function _0xe517x3(_0xe517xb, _0xe517x11, _0xe517xe, _0xe517x12) {
				var _0xe517x10 = _0xe517x11['resourceIdField']
					, _0xe517xf = _0xe517x11['previous'] && _0xe517x10 in _0xe517x11['previous']
					, _0xe517x9 = _0xe517xf && _0xe517x11['previous'][_0xe517x10];
				if (_0xe517xf) {
					_0xe517xd['move'](_0xe517x9, _0xe517x11['getResourceId'](), _0xe517x11)
				}
			}

			function _0xe517x7() {
				_0xe517xd['clear']()
			}

			function _0xe517x8(_0xe517xe, _0xe517x9, _0xe517xb) {
				_0xe517xd['clear']();
				_0xe517x1(_0xe517x9)
			}

			function _0xe517xc(_0xe517xe, _0xe517xb, _0xe517xf, _0xe517x9) {
				_0xe517xd['move'](_0xe517xf, _0xe517x9)
			}

			function _0xe517x6(_0xe517x9, _0xe517xe) {
				Ext['Array']['each'](_0xe517xe, function (_0xe517xb) {
					_0xe517xd['clear'](_0xe517xb)
				})
			}

			function _0xe517x2() {
				_0xe517xd['clear']()
			}

			function _0xe517x1(_0xe517x9) {
				Ext['destroy'](_0xe517xd['resourceStoreDetacher']);
				_0xe517xd['resourceStoreDetacher'] = _0xe517x9 && _0xe517x9['on']({
					idchanged: _0xe517xc
					, remove: _0xe517x6
					, clear: _0xe517x2
					, cacheresethint: _0xe517x2
					, rootchange: _0xe517x2
					, priority: 100
					, destroyable: true
				})
			}
			_0xe517xd['eventStoreDetacher'] = _0xe517x5['on']({
				add: _0xe517x13
				, remove: _0xe517x4
				, update: _0xe517x3
				, clear: _0xe517x7
				, cacheresethint: _0xe517x7
				, rootchange: _0xe517x7
				, resourcestorechange: _0xe517x8
				, priority: 100
				, destroyable: true
			});
			_0xe517xd['eventStoreFiltersDetacher'] = _0xe517x5['getFilters']()['on']('endupdate', _0xe517x7, this, {
				priority: 1002
				, destroyable: true
			});
			_0xe517x1(_0xe517xa);
			_0xe517xd['eventStore'] = _0xe517x5
		}
		, destroy: function () {
			var _0xe517x1 = this;
			Ext['destroyMembers'](_0xe517x1, 'eventStoreDetacher', 'eventStoreFiltersDetacher', 'resourceStoreDetacher');
			_0xe517x1['eventStore'] = null
		}
		, get: function (_0xe517x1, _0xe517x2) {
			var _0xe517x5 = this;
			_0xe517x1 = _0xe517x5['key'](_0xe517x1);
			_0xe517x2 = _0xe517x2 || function () {
				return Ext['Array']['filter'](_0xe517x5['eventStore']['getRange'](), function (_0xe517x3) {
					return _0xe517x3['getResourceId']() == _0xe517x1
				})
			};
			return _0xe517x5['callParent']([_0xe517x1, _0xe517x2])
		}
	});
	Ext.define('Ext.ux.Scheduler.data.mixin.EventStore', {
		extend: 'Ext.Mixin'
		, requires: ['Ext.ux.Scheduler.util.Date', 'Ext.ux.Scheduler.data.util.IdConsistencyManager', 'Ext.ux.Scheduler.data.util.ModelPersistencyManager', 'Ext.ux.Scheduler.data.util.ResourceEventsCache']
		, isEventStore: true
		, resourceStore: null
		, resourceStoreDetacher: null
		, assignmentStore: null
		, resourceEventsCache: null
		, idConsistencyManager: null
		, modelPersistencyManager: null
		, mixinConfig: {
			after: {
				constructor: 'constructor'
				, destroy: 'destroy'
			}
		}
		, constructor: function () {
			var _0xe517x1 = this;
			_0xe517x1['resourceEventsCache'] = _0xe517x1['createResourceEventsCache']();
			_0xe517x1['idConsistencyManager'] = _0xe517x1['createIdConsistencyManager']();
			_0xe517x1['modelPersistencyManager'] = _0xe517x1['createModelPersistencyManager']()
		}
		, destroy: function () {
			var _0xe517x1 = this;
			Ext['destroyMembers'](_0xe517x1, 'resourceEventsCache', 'idConsistencyManager', 'modelPersistencyManager')
		}
		, createResourceEventsCache: function () {
			return new Ext.ux.Scheduler['data']['util'].ResourceEventsCache(this)
		}
		, createIdConsistencyManager: function () {
			var _0xe517x1 = this;
			return new Ext.ux.Scheduler['data']['util'].IdConsistencyManager({
				eventStore: _0xe517x1
				, resourceStore: _0xe517x1['getResourceStore']()
				, assignmentStore: _0xe517x1['getAssignmentStore']()
				, dependencyStore: _0xe517x1['getDependencyStore']()
			})
		}
		, createModelPersistencyManager: function () {
			var _0xe517x1 = this;
			return new Ext.ux.Scheduler['data']['util'].ModelPersistencyManager({
				eventStore: _0xe517x1
				, resourceStore: _0xe517x1['getResourceStore']()
				, assignmentStore: _0xe517x1['getAssignmentStore']()
				, dependencyStore: _0xe517x1['getDependencyStore']()
			})
		}
		, getResourceStore: function () {
			return this['resourceStore']
		}
		, setResourceStore: function (_0xe517x2) {
			var _0xe517x1 = this
				, _0xe517x5 = _0xe517x1['resourceStore'];
			if (_0xe517x1['resourceStore']) {
				_0xe517x1['resourceStore']['setEventStore'](null);
				_0xe517x1['idConsistencyManager'] && _0xe517x1['idConsistencyManager']['setResourceStore'](null);
				_0xe517x1['modelPersistencyManager'] && _0xe517x1['modelPersistencyManager']['setResourceStore'](null)
			};
			_0xe517x1['resourceStore'] = _0xe517x2 && Ext['StoreMgr']['lookup'](_0xe517x2) || null;
			if (_0xe517x1['resourceStore']) {
				_0xe517x1['modelPersistencyManager'] && _0xe517x1['modelPersistencyManager']['setResourceStore'](_0xe517x1['resourceStore']);
				_0xe517x1['idConsistencyManager'] && _0xe517x1['idConsistencyManager']['setResourceStore'](_0xe517x1['resourceStore']);
				_0xe517x2['setEventStore'](_0xe517x1)
			};
			if ((_0xe517x5 || _0xe517x2) && _0xe517x5 !== _0xe517x2) {
				_0xe517x1['fireEvent']('resourcestorechange', _0xe517x1, _0xe517x2, _0xe517x5)
			}
		}
		, getAssignmentStore: function () {
			return this['assignmentStore']
		}
		, setAssignmentStore: function (_0xe517x2) {
			var _0xe517x1 = this
				, _0xe517x5 = _0xe517x1['assignmentStore'];
			if (_0xe517x1['assignmentStore']) {
				_0xe517x1['assignmentStore']['setEventStore'](null);
				_0xe517x1['idConsistencyManager'] && _0xe517x1['idConsistencyManager']['setAssignmentStore'](null);
				_0xe517x1['modelPersistencyManager'] && _0xe517x1['modelPersistencyManager']['setAssignmentStore'](null)
			};
			_0xe517x1['assignmentStore'] = _0xe517x2 && Ext['StoreMgr']['lookup'](_0xe517x2) || null;
			if (_0xe517x1['assignmentStore']) {
				_0xe517x1['modelPersistencyManager'] && _0xe517x1['modelPersistencyManager']['setAssignmentStore'](_0xe517x1['assignmentStore']);
				_0xe517x1['idConsistencyManager'] && _0xe517x1['idConsistencyManager']['setAssignmentStore'](_0xe517x1['assignmentStore']);
				_0xe517x1['assignmentStore']['setEventStore'](_0xe517x1);
				Ext['destroy'](_0xe517x1['resourceEventsCache'])
			}
			else {
				_0xe517x1['resourceEventsCache'] = _0xe517x1['createResourceEventsCache']()
			};
			if ((_0xe517x5 || _0xe517x2) && _0xe517x5 !== _0xe517x2) {
				_0xe517x1['fireEvent']('assignmentstorechange', _0xe517x1, _0xe517x2, _0xe517x5)
			}
		}
		, getDependencyStore: function () {
			return this['dependencyStore']
		}
		, setDependencyStore: function (_0xe517x1) {
			var _0xe517x2 = this
				, _0xe517x5 = _0xe517x2['DependencyStore'];
			if (_0xe517x2['dependencyStore']) {
				_0xe517x2['dependencyStore']['setEventStore'](null);
				_0xe517x2['idConsistencyManager'] && _0xe517x2['idConsistencyManager']['setDependencyStore'](null);
				_0xe517x2['modelPersistencyManager'] && _0xe517x2['modelPersistencyManager']['setDependencyStore'](null)
			};
			_0xe517x2['dependencyStore'] = _0xe517x1 && Ext['StoreMgr']['lookup'](_0xe517x1) || null;
			if (_0xe517x2['dependencyStore']) {
				_0xe517x2['modelPersistencyManager'] && _0xe517x2['modelPersistencyManager']['setDependencyStore'](_0xe517x2['dependencyStore']);
				_0xe517x2['idConsistencyManager'] && _0xe517x2['idConsistencyManager']['setDependencyStore'](_0xe517x2['dependencyStore']);
				_0xe517x2['dependencyStore']['setEventStore'](_0xe517x2)
			};
			if ((_0xe517x5 || _0xe517x1) && _0xe517x5 !== _0xe517x1) {
				_0xe517x2['fireEvent']('dependencystorechange', _0xe517x2, _0xe517x1, _0xe517x5)
			}
		}
		, isDateRangeAvailable: function (_0xe517x7, _0xe517x1, _0xe517x5, _0xe517x4) {
			var _0xe517x6 = Ext.ux.Scheduler['util']['Date']
				, _0xe517x2 = this['getEventsForResource'](_0xe517x4)
				, _0xe517x3 = true;
			Ext['each'](_0xe517x2, function (_0xe517xc) {
				_0xe517x3 = _0xe517x5 === _0xe517xc || !_0xe517x6['intersectSpans'](_0xe517x7, _0xe517x1, _0xe517xc['getStartDate'](), _0xe517xc['getEndDate']());
				return _0xe517x3
			});
			return _0xe517x3
		}
		, getEventsInTimeSpan: function (_0xe517x6, _0xe517x2, _0xe517x1) {
			var _0xe517x3 = new Ext['util'].MixedCollection();
			var _0xe517x5 = [];
			if (_0xe517x1 !== false) {
				var _0xe517x4 = Ext.ux.Scheduler['util']['Date'];
				this['forEachScheduledEvent'](function (_0xe517xd, _0xe517xc, _0xe517x7) {
					if (_0xe517x4['intersectSpans'](_0xe517xc, _0xe517x7, _0xe517x6, _0xe517x2)) {
						_0xe517x5['push'](_0xe517xd)
					}
				})
			}
			else {
				this['forEachScheduledEvent'](function (_0xe517xd, _0xe517xc, _0xe517x7) {
					if (_0xe517xc - _0xe517x6 >= 0 && _0xe517x2 - _0xe517x7 >= 0) {
						_0xe517x5['push'](_0xe517xd)
					}
				})
			};
			_0xe517x3['addAll'](_0xe517x5);
			return _0xe517x3
		}
		, getEventsByStartDate: function (_0xe517x5) {
			var _0xe517x2 = Ext.ux.Scheduler['util']['Date'];
			var _0xe517x1 = [];
			this['forEachScheduledEvent'](function (_0xe517x6, _0xe517x4, _0xe517x3) {
				if (_0xe517x2['compareWithPrecision'](_0xe517x4, _0xe517x5, _0xe517x2.DAY) === 0) {
					_0xe517x1['push'](_0xe517x6)
				}
			});
			return _0xe517x1
		}
		, forEachScheduledEvent: function (_0xe517x2, _0xe517x1) {
			this['each'](function (_0xe517x4) {
				var _0xe517x3 = _0xe517x4['getStartDate']()
					, _0xe517x5 = _0xe517x4['getEndDate']();
				if (_0xe517x3 && _0xe517x5) {
					return _0xe517x2['call'](_0xe517x1 || this, _0xe517x4, _0xe517x3, _0xe517x5)
				}
			}, this)
		}
		, getTotalTimeSpan: function () {
			var _0xe517x1 = Ext.ux.Scheduler['util']['Date']['MAX_VALUE']
				, _0xe517x2 = Ext.ux.Scheduler['util']['Date']['MIN_VALUE']
				, _0xe517x5 = Ext.ux.Scheduler['util']['Date'];
			this['each'](function (_0xe517x3) {
				if (_0xe517x3['getStartDate']()) {
					_0xe517x1 = _0xe517x5['min'](_0xe517x3['getStartDate'](), _0xe517x1)
				};
				if (_0xe517x3['getEndDate']()) {
					_0xe517x2 = _0xe517x5['max'](_0xe517x3['getEndDate'](), _0xe517x2)
				}
			});
			_0xe517x1 = _0xe517x1 < Ext.ux.Scheduler['util']['Date']['MAX_VALUE'] ? _0xe517x1 : null;
			_0xe517x2 = _0xe517x2 > Ext.ux.Scheduler['util']['Date']['MIN_VALUE'] ? _0xe517x2 : null;
			this['lastTotalTimeSpan'] = {
				start: _0xe517x1 || null
				, end: _0xe517x2 || _0xe517x1 || null
			};
			return this['lastTotalTimeSpan']
		}
		, filterEventsForResource: function (_0xe517x3, _0xe517x5, _0xe517x2) {
			var _0xe517x1 = _0xe517x3['getEvents'](this);
			return Ext['Array']['filter'](_0xe517x1, _0xe517x5, _0xe517x2 || this)
		}
		, append: function (_0xe517x1) {
			throw 'Must be implemented by consuming class'
		}
		, getResourcesForEvent: function (_0xe517x3) {
			var _0xe517x5 = this
				, _0xe517x4 = _0xe517x5['getAssignmentStore']()
				, _0xe517x2 = _0xe517x5['getResourceStore']()
				, _0xe517x1;
			if (_0xe517x4) {
				_0xe517x1 = _0xe517x4['getResourcesForEvent'](_0xe517x3)
			}
			else {
				if (_0xe517x2) {
					_0xe517x3 = _0xe517x3 instanceof Ext.ux.Scheduler['model']['Event'] && _0xe517x3 || _0xe517x5['getModelById'](_0xe517x3);
					_0xe517x1 = _0xe517x3 && _0xe517x2['getModelById'](_0xe517x3['getResourceId']());
					_0xe517x1 = _0xe517x1 && [_0xe517x1] || []
				}
				else {
					_0xe517x1 = []
				}
			};
			return _0xe517x1
		}
		, getEventsForResource: function (_0xe517x5) {
			var _0xe517x2 = this
				, _0xe517x3 = _0xe517x2['getAssignmentStore']()
				, _0xe517x1;
			if (_0xe517x3) {
				_0xe517x1 = _0xe517x3['getEventsForResource'](_0xe517x5)
			}
			else {
				if (_0xe517x2['resourceEventsCache']) {
					_0xe517x1 = _0xe517x2['resourceEventsCache']['get'](_0xe517x5)
				}
				else {
					_0xe517x1 = []
				}
			};
			return _0xe517x1
		}
		, getAssignmentsForEvent: function (_0xe517x2) {
			var _0xe517x1 = this
				, _0xe517x5 = _0xe517x1['getAssignmentStore']();
			return _0xe517x5 && _0xe517x5['getAssignmentsForEvent'](_0xe517x2) || []
		}
		, getAssignmentsForResource: function (_0xe517x2) {
			var _0xe517x1 = this
				, _0xe517x5 = _0xe517x1['getAssignmentStore']();
			return _0xe517x5 && _0xe517x5['getAssignmentsForResource'](_0xe517x2) || []
		}
		, assignEventToResource: function (_0xe517x2, _0xe517x5) {
			var _0xe517x1 = this
				, _0xe517x3 = _0xe517x1['getAssignmentStore']();
			if (_0xe517x3) {
				_0xe517x3['assignEventToResource'](_0xe517x2, _0xe517x5)
			}
			else {
				_0xe517x2 = _0xe517x2 instanceof Ext.ux.Scheduler['model']['Event'] && _0xe517x2 || _0xe517x1['getModelById'](_0xe517x2);
				_0xe517x5 = _0xe517x5 instanceof Ext.ux.Scheduler['model']['Resource'] ? _0xe517x5['getId']() : _0xe517x5;
				_0xe517x2 && _0xe517x2['setResourceId'](_0xe517x5)
			}
		}
		, unassignEventFromResource: function (_0xe517x2, _0xe517x5) {
			var _0xe517x1 = this
				, _0xe517x3 = _0xe517x1['getAssignmentStore']();
			if (_0xe517x3) {
				_0xe517x3['unassignEventFromResource'](_0xe517x2, _0xe517x5)
			}
			else {
				_0xe517x2 = _0xe517x2 instanceof Ext.ux.Scheduler['model']['Event'] && _0xe517x2 || _0xe517x1['getModelById'](_0xe517x2);
				_0xe517x5 = _0xe517x5 instanceof Ext.ux.Scheduler['model']['Resource'] ? _0xe517x5['getId']() : _0xe517x5;
				if (_0xe517x2 && _0xe517x2['getResourceId']() == _0xe517x5) {
					_0xe517x2['setResourceId'](null)
				}
			}
		}
		, reassignEventFromResourceToResource: function (_0xe517x6, _0xe517x2, _0xe517x5) {
			var _0xe517x4 = this
				, _0xe517x7 = _0xe517x4['getAssignmentStore']();
			var _0xe517x3 = _0xe517x5 instanceof Ext.ux.Scheduler['model']['Resource'] ? _0xe517x5['getId']() : _0xe517x5;
			var _0xe517x1 = _0xe517x2 instanceof Ext.ux.Scheduler['model']['Resource'] ? _0xe517x2['getId']() : _0xe517x2;
			if (_0xe517x7) {
				var _0xe517xc = _0xe517x7['getAssignmentForEventAndResource'](_0xe517x6, _0xe517x2);
				if (_0xe517xc) {
					_0xe517xc['setResourceId'](_0xe517x3)
				}
				else {
					_0xe517x7['assignEventToResource'](_0xe517x6, _0xe517x5)
				}
			}
			else {
				_0xe517x6 = _0xe517x6 instanceof Ext.ux.Scheduler['model']['Event'] && _0xe517x6 || _0xe517x4['getModelById'](_0xe517x6);
				if (_0xe517x6['getResourceId']() == _0xe517x1) {
					_0xe517x6['setResourceId'](_0xe517x3)
				}
			}
		}
		, isEventAssignedToResource: function (_0xe517x5, _0xe517x3) {
			var _0xe517x2 = this
				, _0xe517x4 = _0xe517x2['getAssignmentStore']()
				, _0xe517x1;
			if (_0xe517x4) {
				_0xe517x1 = _0xe517x4['isEventAssignedToResource'](_0xe517x5, _0xe517x3)
			}
			else {
				_0xe517x5 = _0xe517x5 instanceof Ext.ux.Scheduler['model']['Event'] && _0xe517x5 || _0xe517x2['getModelById'](_0xe517x5);
				_0xe517x3 = _0xe517x3 instanceof Ext.ux.Scheduler['model']['Resource'] ? _0xe517x3['getId']() : _0xe517x3;
				_0xe517x1 = _0xe517x5 && (_0xe517x5['getResourceId']() == _0xe517x3) || false
			};
			return _0xe517x1
		}
		, removeAssignmentsForEvent: function (_0xe517x2) {
			var _0xe517x1 = this
				, _0xe517x5 = _0xe517x1['getAssignmentStore']();
			if (_0xe517x5) {
				_0xe517x5['removeAssignmentsForEvent'](_0xe517x2)
			}
			else {
				_0xe517x2 = _0xe517x2 instanceof Ext.ux.Scheduler['model']['Event'] && _0xe517x2 || _0xe517x1['getModelById'](_0xe517x2);
				_0xe517x2 && _0xe517x2['setResourceId'](null)
			}
		}
		, removeAssignmentsForResource: function (_0xe517x5) {
			var _0xe517x2 = this
				, _0xe517x3 = _0xe517x2['getAssignmentStore']()
				, _0xe517x1 = _0xe517x2['getResourceStore']();
			if (_0xe517x3) {
				_0xe517x3['removeAssignmentsForResource'](_0xe517x5)
			}
			else {
				if (_0xe517x1) {
					_0xe517x5 = _0xe517x5 instanceof Ext.ux.Scheduler['model']['Resource'] && _0xe517x5 || _0xe517x1['getModelById'](_0xe517x5);
					_0xe517x5 && Ext['Array']['each'](_0xe517x2['resourceEventsCache']['get'](_0xe517x5), function (_0xe517x4) {
						_0xe517x4['setResourceId'](null)
					})
				}
				else {
					_0xe517x5 = _0xe517x5 instanceof Ext.ux.Scheduler['model']['Resource'] ? _0xe517x5['getId']() : _0xe517x5;
					Ext['Array']['each'](_0xe517x2['getRange'](), function (_0xe517x4) {
						_0xe517x4['getResourceId']() == _0xe517x5 && _0xe517x4['setResourceId'](null)
					})
				}
			}
		}
		, isEventPersistable: function (_0xe517x4) {
			var _0xe517x3 = this
				, _0xe517x7 = _0xe517x3['getAssignmentStore']()
				, _0xe517x6, _0xe517x5, _0xe517x2, _0xe517x1 = true;
			if (!_0xe517x7) {
				_0xe517x6 = _0xe517x4['getResources']();
				for (_0xe517x5 = 0, _0xe517x2 = _0xe517x6['length']; _0xe517x1 && _0xe517x5 < _0xe517x2; ++_0xe517x5) {
					_0xe517x1 = _0xe517x6[_0xe517x5]['phantom'] !== true
				}
			};
			return _0xe517x1
		}
	});
	Ext.define('Ext.ux.Scheduler.model.Range', {
		extend: 'Ext.ux.Scheduler.model.Customizable'
		, requires: ['Ext.ux.Scheduler.util.Date']
		, idProperty: 'Id'
		, startDateField: 'StartDate'
		, endDateField: 'EndDate'
		, nameField: 'Name'
		, clsField: 'Cls'
		, customizableFields: [{
			name: 'StartDate'
			, type: 'date'
			, dateFormat: 'c'
		}, {
			name: 'EndDate'
			, type: 'date'
			, dateFormat: 'c'
		}, {
			name: 'Cls'
			, type: 'string'
		}, {
			name: 'Name'
			, type: 'string'
		}]
		, setStartDate: function (_0xe517x1, _0xe517x3) {
			var _0xe517x5 = this['getEndDate']();
			var _0xe517x2 = this['getStartDate']();
			this['beginEdit']();
			this['set'](this['startDateField'], _0xe517x1);
			if (_0xe517x3 === true && _0xe517x5 && _0xe517x2) {
				this['setEndDate'](Ext.ux.Scheduler['util']['Date']['add'](_0xe517x1, Ext.ux.Scheduler['util']['Date'].MILLI, _0xe517x5 - _0xe517x2))
			};
			this['endEdit']()
		}
		, setEndDate: function (_0xe517x2, _0xe517x3) {
			var _0xe517x1 = this['getStartDate']();
			var _0xe517x5 = this['getEndDate']();
			this['beginEdit']();
			this['set'](this['endDateField'], _0xe517x2);
			if (_0xe517x3 === true && _0xe517x1 && _0xe517x5) {
				this['setStartDate'](Ext.ux.Scheduler['util']['Date']['add'](_0xe517x2, Ext.ux.Scheduler['util']['Date'].MILLI, -(_0xe517x5 - _0xe517x1)))
			};
			this['endEdit']()
		}
		, setStartEndDate: function (_0xe517x2, _0xe517x1) {
			this['beginEdit']();
			this['set'](this['startDateField'], _0xe517x2);
			this['set'](this['endDateField'], _0xe517x1);
			this['endEdit']()
		}
		, getDates: function () {
			var _0xe517x3 = []
				, _0xe517x5 = this['getEndDate']();
			if (this['isScheduled']()) {
				var _0xe517x2 = Ext['Date']['clearTime'](this['getStartDate'](), true);
				if (_0xe517x5 - this['getStartDate']() === 0) {
					_0xe517x3['push'](_0xe517x2)
				}
				else {
					for (var _0xe517x1 = _0xe517x2; _0xe517x1 < _0xe517x5; _0xe517x1 = Ext.ux.Scheduler['util']['Date']['add'](_0xe517x1, Ext.ux.Scheduler['util']['Date'].DAY, 1)) {
						_0xe517x3['push'](_0xe517x1)
					}
				}
			};
			return _0xe517x3
		}
		, forEachDate: function (_0xe517x2, _0xe517x1) {
			return Ext['Array']['each'](this['getDates'](), _0xe517x2, _0xe517x1)
		}
		, isScheduled: function () {
			var _0xe517x1 = this;
			return Boolean(_0xe517x1['getStartDate']() && _0xe517x1['getEndDate']() && _0xe517x1['areDatesValid']())
		}
		, isValid: function () {
			var _0xe517x5 = this
				, _0xe517x1 = _0xe517x5['callParent']()
				, _0xe517x3, _0xe517x2;
			if (_0xe517x1) {
				_0xe517x3 = _0xe517x5['getStartDate'](), _0xe517x2 = _0xe517x5['getEndDate']();
				_0xe517x1 = !_0xe517x3 || !_0xe517x2 || (_0xe517x2 - _0xe517x3 >= 0)
			};
			return _0xe517x1
		}
		, areDatesValid: function () {
			var _0xe517x2 = this
				, _0xe517x5 = _0xe517x2['getStartDate']()
				, _0xe517x1 = _0xe517x2['getEndDate']();
			return !_0xe517x5 || !_0xe517x1 || (_0xe517x1 - _0xe517x5 >= 0)
		}
		, shift: function (_0xe517x2, _0xe517x1) {
			this['setStartEndDate'](Ext.ux.Scheduler['util']['Date']['add'](this['getStartDate'](), _0xe517x2, _0xe517x1), Ext.ux.Scheduler['util']['Date']['add'](this['getEndDate'](), _0xe517x2, _0xe517x1))
		}
		, fullCopy: function () {
			return this['copy']['apply'](this, arguments)
		}
		, intersectsRange: function (_0xe517x3, _0xe517x1) {
			var _0xe517x5 = this['getStartDate']();
			var _0xe517x2 = this['getEndDate']();
			return _0xe517x5 && _0xe517x2 && Ext.ux.Scheduler['util']['Date']['intersectSpans'](_0xe517x5, _0xe517x2, _0xe517x3, _0xe517x1)
		}
	});
	Ext.define('Ext.ux.Scheduler.model.Event', {
		extend: 'Ext.ux.Scheduler.model.Range'
		, idProperty: 'Id'
		, customizableFields: [{
			name: 'IconCls'
		}, {
			name: 'ResourceId'
		}, {
			name: 'Draggable'
			, type: 'boolean'
			, persist: false
			, defaultValue: true
		}, {
			name: 'Resizable'
			, persist: false
			, defaultValue: true
		}]
		, resourceIdField: 'ResourceId'
		, draggableField: 'Draggable'
		, resizableField: 'Resizable'
		, iconClsField: 'IconCls'
		, getInternalId: function () {
			return this['internalId']
		}
		, isHighlighted: false
		, getEventStore: function () {
			var _0xe517x2 = this
				, _0xe517x1 = _0xe517x2['joined'] && _0xe517x2['joined'][0];
			if (_0xe517x1 && !_0xe517x1['isEventStore']) {
				Ext['Array']['sort'](_0xe517x2['joined'], function (_0xe517x3, _0xe517x5) {
					return (_0xe517x3['isEventStore'] || false) > (_0xe517x5['isEventStore'] || false) && -1 || 1
				});
				_0xe517x1 = _0xe517x2['joined'][0];
				_0xe517x1 = _0xe517x1['isEventStore'] ? _0xe517x1 : null
			};
			return _0xe517x1
		}
		, getResourceStore: function () {
			var _0xe517x1 = this['getEventStore']();
			return _0xe517x1 && _0xe517x1['getResourceStore']()
		}
		, getAssignmentStore: function () {
			var _0xe517x1 = this['getEventStore']();
			return _0xe517x1 && _0xe517x1['getAssignmentStore']()
		}
		, getResources: function () {
			var _0xe517x2 = this
				, _0xe517x1 = _0xe517x2['getEventStore']();
			return _0xe517x1 && _0xe517x1['getResourcesForEvent'](_0xe517x2) || []
		}
		, forEachResource: function (_0xe517x3, _0xe517x5) {
			var _0xe517x1 = this['getResources']();
			for (var _0xe517x2 = 0; _0xe517x2 < _0xe517x1['length']; _0xe517x2++) {
				if (_0xe517x3['call'](_0xe517x5 || this, _0xe517x1[_0xe517x2]) === false) {
					return
				}
			}
		}
		, getResource: function (_0xe517x4) {
			var _0xe517x3 = this
				, _0xe517x1 = null
				, _0xe517x2 = _0xe517x3['getEventStore']()
				, _0xe517x5 = _0xe517x2 && _0xe517x2['getResourceStore']();
			_0xe517x4 = _0xe517x4 == null ? _0xe517x3['getResourceId']() : _0xe517x4;
			if (_0xe517x2 && (_0xe517x4 === null || _0xe517x4 === undefined)) {
				_0xe517x1 = _0xe517x2['getResourcesForEvent'](_0xe517x3);
				if (_0xe517x1['length'] == 1) {
					_0xe517x1 = _0xe517x1[0]
				}
				else {
					if (_0xe517x1['length'] > 1) {
						Ext['Error']['raise']('Event::getResource() is not applicable for events with multiple assignments, please use Event::getResources() instead.')
					}
					else {
						_0xe517x1 = null
					}
				}
			}
			else {
				if (_0xe517x5) {
					_0xe517x1 = _0xe517x5['getModelById'](_0xe517x4)
				}
			};
			return _0xe517x1
		}
		, setResource: function (_0xe517x5) {
			var _0xe517x2 = this
				, _0xe517x1 = _0xe517x2['getEventStore']();
			_0xe517x1 && _0xe517x1['removeAssignmentsForEvent'](_0xe517x2);
			_0xe517x2['assign'](_0xe517x5)
		}
		, assign: function (_0xe517x5) {
			var _0xe517x2 = this
				, _0xe517x1 = _0xe517x2['getEventStore']();
			_0xe517x5 = _0xe517x5 instanceof Ext.ux.Scheduler['model']['Resource'] ? _0xe517x5['getId']() : _0xe517x5;
			if (_0xe517x1) {
				_0xe517x1['assignEventToResource'](_0xe517x2, _0xe517x5)
			}
			else {
				_0xe517x2['setResourceId'](_0xe517x5)
			}
		}
		, unassign: function (_0xe517x5) {
			var _0xe517x2 = this
				, _0xe517x1 = _0xe517x2['getEventStore']();
			_0xe517x5 = _0xe517x5 instanceof Ext.ux.Scheduler['model']['Resource'] ? _0xe517x5['getId']() : _0xe517x5;
			if (_0xe517x1) {
				_0xe517x1['unassignEventFromResource'](_0xe517x2, _0xe517x5)
			}
			else {
				if (_0xe517x2['getResourceId']() == _0xe517x5) {
					_0xe517x2['setResourceId'](null)
				}
			}
		}
		, reassign: function (_0xe517x1, _0xe517x3) {
			var _0xe517x5 = this
				, _0xe517x2 = _0xe517x5['getEventStore']();
			_0xe517x1 = _0xe517x1 instanceof Ext.ux.Scheduler['model']['Resource'] ? _0xe517x1['get'](_0xe517x1['idProperty']) : _0xe517x1;
			_0xe517x3 = _0xe517x3 instanceof Ext.ux.Scheduler['model']['Resource'] ? _0xe517x3['get'](_0xe517x3['idProperty']) : _0xe517x3;
			if (_0xe517x2) {
				_0xe517x2['reassignEventFromResourceToResource'](_0xe517x5, _0xe517x1, _0xe517x3)
			}
			else {
				_0xe517x5['setResourceId'](_0xe517x3)
			}
		}
		, isAssignedTo: function (_0xe517x3) {
			var _0xe517x5 = this
				, _0xe517x2 = _0xe517x5['getEventStore']()
				, _0xe517x1 = false;
			_0xe517x3 = _0xe517x3 instanceof Ext.ux.Scheduler['model']['Resource'] && _0xe517x3['getId']() || _0xe517x3;
			if (_0xe517x2) {
				_0xe517x1 = _0xe517x2['isEventAssignedToResource'](_0xe517x5, _0xe517x3)
			}
			else {
				_0xe517x1 = _0xe517x5['getResourceId']() == _0xe517x3
			};
			return _0xe517x1
		}
		, getAssignments: function () {
			var _0xe517x2 = this
				, _0xe517x1 = _0xe517x2['getEventStore']();
			return _0xe517x1 && _0xe517x1['getAssignmentsForEvent'](_0xe517x2)
		}
		, isDraggable: function () {
			return this['getDraggable']()
		}
		, isResizable: function () {
			return this['getResizable']()
		}
		, isPersistable: function () {
			var _0xe517x2 = this
				, _0xe517x1 = _0xe517x2['getEventStore']();
			return _0xe517x1 && _0xe517x1['isEventPersistable'](_0xe517x2)
		}
	});
	Ext.define('Ext.ux.Scheduler.data.EventStore', {
		extend: 'Ext.data.Store'
		, alias: 'store.eventstore'
		, mixins: ['Ext.ux.Scheduler.data.mixin.UniversalModelGetter', 'Ext.ux.Scheduler.data.mixin.CacheHintHelper', 'Ext.ux.Scheduler.data.mixin.EventStore', 'Robo.data.Store']
		, storeId: 'events'
		, model: 'Ext.ux.Scheduler.model.Event'
		, config: {
			model: 'Ext.ux.Scheduler.model.Event'
		}
		, constructor: function (_0xe517x1) {
			var _0xe517x2 = this;
			_0xe517x2['callParent']([_0xe517x1]);
			_0xe517x2['resourceStore'] && _0xe517x2['setResourceStore'](_0xe517x2['resourceStore']);
			_0xe517x2['assignmentStore'] && _0xe517x2['setAssignmentStore'](_0xe517x2['assignmentStore']);
			if (_0xe517x2['getModel']() !== Ext.ux.Scheduler['model']['Event'] && !(_0xe517x2['getModel']()['prototype'] instanceof Ext.ux.Scheduler['model']['Event'])) {
				throw 'The model for the EventStore must subclass Ext.ux.Scheduler.model.Event'
			}
		}
		, append: function (_0xe517x1) {
			this['add'](_0xe517x1)
		}
	});
};

Ext.define('Ext.ux.Kanban.model.Task', {
	extend: 'Ext.ux.Scheduler.model.Event'
	, alias: 'model.kanban_taskmodel'
	, resourceStore: null
	, states: ['NotStarted', 'InProgress', 'Test', 'Done']
	, customizableFields: [{
		name: 'State'
		, defaultValue: 'NotStarted'
	}, {
		name: 'Position'
		, type: 'int'
	}, {
		name: 'CreatedDate'
		, type: 'date'
	}, {
		name: 'ImageUrl'
	}]
	, constructor: function () {
		this['callParent'](arguments);
		if (this['phantom'] && !this['getCreatedDate']()) {
			this['setCreatedDate'](new Date())
		}
	}
	, stateField: 'State'
	, imageUrlField: 'ImageUrl'
	, createdDateField: 'CreatedDate'
	, positionField: 'Position'
	, getResourceStore: function () {
		if (!this['resourceStore']) {
			Ext['Array']['each'](this['joined'], function (_0xe517x1) {
				if (_0xe517x1['resourceStore']) {
					this['resourceStore'] = _0xe517x1['resourceStore'];
					return false
				}
			}, this)
		};
		return this['resourceStore']
	}
	, isValidTransition: function (_0xe517x1) {
		switch (this['getState']()) {
		case 'NotStarted':
			return _0xe517x1 == 'InProgress';
		case 'InProgress':
			return _0xe517x1 != 'Done';
		case 'Test':
			return _0xe517x1 != 'NotStarted';
		case 'Done':
			return _0xe517x1 == 'Test' || _0xe517x1 == 'InProgress';
		default:
			return true
		}
	}
});
Ext.define('Ext.ux.Kanban.data.TaskStore', {
	extend: 'Ext.ux.Scheduler.data.EventStore'
	, model: 'Ext.ux.Kanban.model.Task'
	, proxy: undefined
	, alias: 'store.kanban_taskstore'
	, resourceStore: null
	, setResourceStore: function (_0xe517x1) {
		this['resourceStore'] = Ext['data']['StoreManager']['lookup'](_0xe517x1)
	}
	, getResourceStore: function () {
		return this['resourceStore']
	}
	, constructor: function () {
		this['callParent'](arguments);
		var _0xe517x1 = this['getModel']();
		this['setSorters']([{
			property: _0xe517x1['prototype']['positionField']
			, direction: 'ASC'
		}, {
			property: _0xe517x1['prototype']['nameField']
			, direction: 'ASC'
		}])
	}
});
Ext.define('Ext.ux.Kanban.data.mixin.StoreView', {
	state: null
	, masterStore: null
	, bindToStore: function (_0xe517x1) {
		var _0xe517x2 = {
			add: this['onMasterAdd']
			, clear: this['onMasterClear']
			, remove: this['onMasterRemove']
			, update: this['onMasterUpdate']
			, refresh: this['onMasterDataChanged']
			, scope: this
		};
		if (this['masterStore']) {
			this['masterStore']['un'](_0xe517x2)
		};
		this['masterStore'] = _0xe517x1;
		if (_0xe517x1) {
			_0xe517x1['on'](_0xe517x2);
			this['copyStoreContent']()
		}
	}
	, onMasterAdd: function (_0xe517x2, _0xe517x1) {
		for (var _0xe517x5 = 0; _0xe517x5 < _0xe517x1['length']; _0xe517x5++) {
			if (_0xe517x1[_0xe517x5]['getState']() === this['state']) {
				this['add'](_0xe517x1[_0xe517x5])
			}
		}
	}
	, onMasterClear: function () {
		this['removeAll']()
	}
	, onMasterUpdate: function (_0xe517x5, _0xe517x1, _0xe517x2, _0xe517x3) {
		if (_0xe517x3 && Ext['Array']['indexOf'](_0xe517x3, _0xe517x5['model']['prototype']['stateField']) >= 0) {
			if (this['state'] === _0xe517x1['getState']()) {
				this['add'](_0xe517x1)
			};
			if (this['state'] === _0xe517x1['previous'][_0xe517x1['stateField']]) {
				this['remove'](_0xe517x1)
			}
		}
	}
	, onMasterRemove: function (_0xe517x2, _0xe517x1) {
		Ext['Array']['each'](_0xe517x1, function (_0xe517x5) {
			if (_0xe517x5['getState']() === this['state']) {
				this['remove'](_0xe517x5)
			}
		}, this)
	}
	, onMasterDataChanged: function (_0xe517x1) {
		this['copyStoreContent']()
	}
	, copyStoreContent: function () {
		var _0xe517x2 = this['state'];
		var _0xe517x1 = [];
		this['masterStore']['each'](function (_0xe517x5) {
			if (_0xe517x5['getState']() === _0xe517x2) {
				_0xe517x1[_0xe517x1['length']] = _0xe517x5
			}
		});
		this['suspendEvents']();
		this['sort'](this['masterStore']['getSorters']()['items']);
		this['sorters']['removeAll']();
		this['resumeEvents']();
		this['loadData'](_0xe517x1)
	}
});
Ext.define('Ext.ux.Kanban.data.ViewStore', {
	extend: 'Ext.data.Store'
	, mixins: ['Ext.ux.Kanban.data.mixin.StoreView']
	, proxy: 'memory'
	, masterStore: null
	, state: null
	, constructor: function (_0xe517x1) {
		Ext['apply'](this, _0xe517x1);
		if (this['state'] === null || this['state'] === undefined) {
			throw 'Must supply state'
		};
		if (this['masterStore']) {
			var _0xe517x2 = this['masterStore'] = Ext['StoreMgr']['lookup'](this['masterStore']);
			var _0xe517x5 = _0xe517x2['sorters'];
			this['model'] = _0xe517x2['model']
		}
		else {
			throw 'Must supply a master store'
		};
		this['callParent'](arguments);
		if (this['masterStore']) {
			this['bindToStore'](this['masterStore'])
		}
	}
	, getResourceStore: function () {
		return this['masterStore']['getResourceStore']()
	}
});
Ext.define('Ext.ux.Kanban.dd.DragZone', {
	extend: 'Ext.dd.DragZone'
	, mixins: {
		observable: 'Ext.util.Observable'
	}
	, requires: ['Ext.util.Point']
	, panel: null
	, repairHighlight: false
	, repairHighlightColor: 'transparent'
	, containerScroll: false
	, autoOffset: function (_0xe517x1, _0xe517x2) {
		this['setDelta'](this['dragData']['offsets'][0], this['dragData']['offsets'][1])
	}
	, setVisibilityForSourceEvents: function (_0xe517x1) {
		Ext['each'](this['dragData']['taskEls'], function (_0xe517x2) {
			_0xe517x2[_0xe517x1 ? 'removeCls' : 'addCls']('sch-hidden')
		})
	}
	, constructor: function (_0xe517x1) {
		if (Ext['isIE8m'] && window['top'] !== window) {
			Ext['dd']['DragDropManager']['notifyOccluded'] = true
		};
		this['mixins']['observable']['constructor']['call'](this, _0xe517x1);
		this['callParent'](arguments);
		this['proxy']['el']['child']('.x-dd-drag-ghost')['removeCls']('x-dd-drag-ghost');
		this['proxy']['addCls']('sch-task-dd')
	}
	, getPlaceholderElements: function (_0xe517x2, _0xe517x6) {
		var _0xe517x4 = _0xe517x6['taskEls'];
		var _0xe517xc;
		var _0xe517x1 = _0xe517x6['offsets'][0];
		var _0xe517x7 = _0xe517x6['offsets'][1];
		var _0xe517x3 = _0xe517x2['getHeight']();
		var _0xe517x5 = Ext['core']['DomHelper']['createDom']({
			tag: 'div'
			, cls: 'sch-dd-wrap-holder'
		});
		Ext['Array']['each'](_0xe517x4, function (_0xe517x13, _0xe517xa) {
			_0xe517xc = _0xe517x13['dom']['cloneNode'](true);
			_0xe517xc['innerHTML'] = '';
			_0xe517xc['id'] = Ext['id']();
			_0xe517xc['boundView'] = _0xe517x13['dom']['boundView'];
			var _0xe517x8 = Ext['fly'](_0xe517xc);
			_0xe517x8['removeCls']('sch-task-selected');
			_0xe517x8['addCls']('sch-task-placeholder');
			_0xe517x5['appendChild'](_0xe517xc);
			Ext['fly'](_0xe517xc)['setStyle']({
				width: _0xe517x13['getWidth']() + 'px'
				, height: _0xe517x13['getHeight']() + 'px'
			})
		});
		return _0xe517x5
	}
	, getDragData: function (_0xe517xd) {
		var _0xe517x1 = this['panel']
			, _0xe517xb = _0xe517xd['getTarget'](_0xe517x1['taskSelector']);
		if (!_0xe517xb || _0xe517x1['isReadOnly']()) {
			return
		};
		var _0xe517x5 = _0xe517x1['resolveRecordByNode'](_0xe517xb);
		if (!_0xe517x5 || _0xe517x5['isDraggable']() === false || this['fireEvent']('beforetaskdrag', this, _0xe517x5, _0xe517xd) === false) {
			return null
		};
		var _0xe517xf = _0xe517xd['getXY']()
			, _0xe517xa = Ext['get'](_0xe517xb)
			, _0xe517x9 = _0xe517xa['getXY']()
			, _0xe517x6 = [_0xe517xf[0] - _0xe517x9[0], _0xe517xf[1] - _0xe517x9[1]]
			, _0xe517x8 = Ext['getCmp'](_0xe517xa['up']('.sch-taskview')['id'])
			, _0xe517xe = _0xe517xa['getRegion']();
		if (!_0xe517x8['isSelected'](_0xe517xb) && !_0xe517xd['ctrlKey']) {
			this['fireEvent']('taskdragstarting', this, _0xe517x5, _0xe517xd)
		};
		var _0xe517xc = this['getDraggingRecords'](_0xe517x5)
			, _0xe517x3 = [];
		Ext['Array']['forEach'](_0xe517xc, function (_0xe517x12) {
			var _0xe517x4 = _0xe517x1['getElementForTask'](_0xe517x12);
			if (_0xe517x4) {
				_0xe517x3['push'](_0xe517x4)
			}
		});
		var _0xe517x7 = {
			view: _0xe517x8
			, sourceZoomLevel: _0xe517x8['up']('panel')['zoomLevel']
			, offsets: _0xe517x6
			, repairXY: [_0xe517xd['getX']() - _0xe517x6[0], _0xe517xd['getY']() - _0xe517x6[1]]
			, taskEls: _0xe517x3
			, bodyScroll: Ext['getBody']()['getScroll']()
			, taskRecords: _0xe517xc
		};
		var _0xe517x13 = _0xe517x8['getStore']();
		var _0xe517x2 = _0xe517x13['getAt'](_0xe517x13['indexOf'](_0xe517x5) + 1);
		if (_0xe517x2) {
			_0xe517x7['dropOptions'] = {
				task: _0xe517x2
				, type: 'before'
			}
		};
		_0xe517x7['ddel'] = this['getDragElement'](_0xe517xa, _0xe517x7);
		_0xe517x7['placeholder'] = this['getPlaceholderElements'](_0xe517xa, _0xe517x7);
		this['proxy']['el']['set']({
			size: this['panel']['getZoomLevel']()
		});
		return _0xe517x7
	}
	, onStartDrag: function (_0xe517x2, _0xe517x5) {
		var _0xe517x1 = this['dragData'];
		Ext['fly'](_0xe517x1['placeholder'])['insertBefore'](_0xe517x1['taskEls'][0]);
		Ext['Array']['forEach'](_0xe517x1['taskEls'], function (_0xe517x3) {
			_0xe517x3['addCls']('sch-hidden')
		});
		this['fireEvent']('taskdragstart', this, _0xe517x1['taskRecords'])
	}
	, getDraggingRecords: function (_0xe517x5) {
		var _0xe517x2 = this['getRelatedRecords'](_0xe517x5);
		var _0xe517x1 = _0xe517x5['store'];
		if (_0xe517x2[0] && _0xe517x2[0]['getState']() == _0xe517x5['getState']()) {
			_0xe517x2 = Ext['Array']['sort']([_0xe517x5]['concat'](_0xe517x2), this['positionSorter'])
		}
		else {
			_0xe517x2 = [_0xe517x5]['concat'](Ext['Array']['sort'](_0xe517x2, this['positionSorter']))
		};
		return _0xe517x2
	}
	, positionSorter: function (_0xe517x3, _0xe517x5) {
		var _0xe517x4 = _0xe517x3['store'];
		return _0xe517x4['indexOf'](_0xe517x3) > _0xe517x4['indexOf'](_0xe517x5) ? 1 : -1
	}
	, getRelatedRecords: function (_0xe517x3) {
		var _0xe517x2 = this['panel'];
		var _0xe517x5 = _0xe517x2['getSelectedRecords']();
		var _0xe517x1 = [];
		Ext['each'](_0xe517x5, function (_0xe517x4) {
			if (_0xe517x4['getId']() !== _0xe517x3['getId']()) {
				_0xe517x1['push'](_0xe517x4)
			}
		});
		return _0xe517x1
	}
	, getDragElement: function (_0xe517xa, _0xe517x6) {
		var _0xe517x3 = _0xe517x6['taskEls'];
		var _0xe517x2;
		var _0xe517x7 = _0xe517x6['offsets'][0];
		var _0xe517x4 = _0xe517x6['offsets'][1];
		var _0xe517x5 = this['panel']['getElementForTask'](_0xe517x6['taskRecords'][0])['getHeight']();
		if (_0xe517x3['length'] > 1) {
			var _0xe517xc = Ext['core']['DomHelper']['createDom']({
				tag: 'div'
				, cls: 'sch-dd-wrap'
				, style: {
					overflow: 'visible'
				}
			});
			Ext['Array']['forEach'](_0xe517x3, function (_0xe517x9, _0xe517x8) {
				_0xe517x2 = _0xe517x9['dom']['cloneNode'](true);
				_0xe517x2['id'] = '';
				_0xe517x2['className'] += _0xe517x8 === 0 ? ' sch-dd-source' : ' sch-dd-extra';
				var _0xe517x13 = _0xe517x9['up']('[size]');
				var _0xe517xe = Ext['core']['DomHelper']['createDom']({
					tag: 'div'
					, size: _0xe517x13['getAttribute']('size')
				})['cloneNode'](true);
				_0xe517xe['appendChild'](_0xe517x2);
				_0xe517xc['appendChild'](_0xe517xe);
				Ext['fly'](_0xe517x2)['setStyle']({
					left: (_0xe517x8 > 0 ? 10 : 0) + 'px'
					, top: (_0xe517x8 === 0 ? 0 : (_0xe517x5 - 30 + _0xe517x8 * 20)) + 'px'
					, width: _0xe517x9['getWidth']() + 'px'
					, height: _0xe517x9['getHeight']() + 'px'
					, position: 'absolute'
				})
			});
			return _0xe517xc
		}
		else {
			_0xe517x2 = _0xe517xa['dom']['cloneNode'](true);
			_0xe517x2['id'] = '';
			_0xe517x2['style']['width'] = _0xe517xa['getWidth']() + 'px';
			_0xe517x2['style']['height'] = _0xe517xa['getHeight']() + 'px';
			var _0xe517xd = _0xe517xa['up']('[size]');
			var _0xe517x1 = Ext['core']['DomHelper']['createDom']({
				tag: 'div'
				, size: _0xe517xd['getAttribute']('size')
			})['cloneNode'](true);
			_0xe517x1['appendChild'](_0xe517x2);
			return _0xe517x1
		}
	}
	, getRepairXY: function (_0xe517x2, _0xe517x1) {
		return _0xe517x1['repairXY']
	}
	, afterRepair: function () {
		this['dragging'] = false
	}
	, onInvalidDrop: function (_0xe517x5, _0xe517x2, _0xe517x3) {
		if (!_0xe517x2) {
			_0xe517x2 = _0xe517x5;
			_0xe517x5 = _0xe517x2['getTarget']() || document['body']
		};
		var _0xe517x1 = this['callParent']([_0xe517x5, _0xe517x2, _0xe517x3]);
		this['fireEvent']('aftertaskdrop', this, this['dragData']['taskRecords']);
		if (this['dragData']['placeholder']) {
			Ext['fly'](this['dragData']['placeholder'])['remove']()
		};
		this['setVisibilityForSourceEvents'](true);
		return _0xe517x1
	}
});
Ext.define('Ext.ux.Kanban.dd.DropZone', {
	extend: 'Ext.dd.DropZone'
	, mixins: {
		observable: 'Ext.util.Observable'
	}
	, constructor: function (_0xe517x1) {
		this['callParent'](arguments);
		this['mixins']['observable']['constructor']['call'](this, _0xe517x1)
	}
	, panel: null
	, dragData: null
	, getTargetFromEvent: function (_0xe517x1) {
		return _0xe517x1['getTarget']()
	}
	, validatorFn: Ext['emptyFn']
	, validatorFnScope: null
	, zoomLevels: ['large', 'medium', 'small', 'mini']
	, shouldDropBeforeNode: function (_0xe517x7, _0xe517x4, _0xe517x2) {
		var _0xe517xc = Ext['fly'](_0xe517x4)['getBox']();
		var _0xe517x5 = _0xe517x2['proxy']['getXY']();
		var _0xe517x3;
		if (this['dropMode'] == 'vertical') {
			_0xe517x3 = (_0xe517xc['bottom'] - _0xe517xc['top']) / 2;
			if (this['direction']['up']) {
				return _0xe517x5[1] - _0xe517xc['top'] < _0xe517x3
			}
			else {
				var _0xe517x1 = Ext['fly'](_0xe517x2['dragData']['placeholder']['children'][0])['getHeight']();
				return _0xe517x5[1] + _0xe517x1 - _0xe517xc['top'] < _0xe517x3
			}
		}
		else {
			_0xe517x3 = (_0xe517xc['right'] - _0xe517xc['left']) / 2;
			if (Ext['Array']['indexOf'](this['zoomLevels'], _0xe517x2['dragData']['currentZoomLevel']) > Ext['Array']['indexOf'](this['zoomLevels'], _0xe517x2['dragData']['sourceZoomLevel'])) {
				if (_0xe517x7[1] < _0xe517xc['top']) {
					return true
				}
				else {
					if (_0xe517x7[1] > _0xe517xc['bottom']) {
						return false
					}
				};
				return _0xe517x7[0] - _0xe517xc['left'] < (_0xe517xc['right'] - _0xe517xc['left']) / 2
			}
			else {
				if (_0xe517x7[1] < _0xe517xc['top']) {
					return true
				}
				else {
					if (_0xe517x7[1] > _0xe517xc['bottom']) {
						return false
					}
				};
				if (this['direction']['left']) {
					return (_0xe517x5[0] - _0xe517xc['left'] < _0xe517x3)
				}
				else {
					var _0xe517x6 = Ext['fly'](_0xe517x2['dragData']['placeholder']['children'][0])['getWidth']();
					return (_0xe517x5[0] + _0xe517x6 - _0xe517xc['left'] < _0xe517x3)
				}
			}
		}
	}
	, getDropMode: function (_0xe517x1) {
		var _0xe517x2 = Ext['DomQuery']['select'](_0xe517x1['getItemSelector']() + ':not(.sch-hidden)', _0xe517x1['el']['dom'])[0];
		if (!_0xe517x2) {
			return 'vertical'
		};
		if (Ext['fly'](_0xe517x2)['getWidth']() * 2 < _0xe517x1['getWidth']()) {
			return 'horizontal'
		};
		return 'vertical'
	}
	, updatePlaceholderElements: function (_0xe517x7, _0xe517x4) {
		var _0xe517x6;
		var _0xe517x3 = Ext['core']['DomHelper']['createDom']({
			tag: 'div'
			, cls: 'sch-dd-wrap-holder'
		});
		for (var _0xe517x2 = 0, _0xe517x1 = _0xe517x4['taskRecords']['length']; _0xe517x2 < _0xe517x1; _0xe517x2++) {
			_0xe517x6 = _0xe517x7['cloneNode'](true);
			_0xe517x6['innerHTML'] = '';
			_0xe517x6['boundView'] = _0xe517x7['boundView'];
			_0xe517x6['id'] = Ext['id']();
			var _0xe517x5 = Ext['fly'](_0xe517x6);
			_0xe517x5['removeCls']('sch-task-selected');
			_0xe517x5['addCls']('sch-task-placeholder');
			_0xe517x3['appendChild'](_0xe517x6);
			Ext['fly'](_0xe517x6)['setStyle']({
				width: _0xe517x7['offsetWidth'] + 'px'
				, height: _0xe517x7['offsetHeight'] + 'px'
			})
		};
		return _0xe517x3
	}
	, getSmallestTask: function (_0xe517x1) {
		var _0xe517x2 = Ext['DomQuery']['select'](_0xe517x1['getItemSelector']() + ':not(.sch-hidden)', _0xe517x1['el']['dom']);
		var _0xe517x3 = _0xe517x2[0];
		for (var _0xe517x5 = 0; _0xe517x5 < _0xe517x2['length']; _0xe517x5++) {
			_0xe517x3 = _0xe517x3['offsetHeight'] > _0xe517x2[_0xe517x5]['offsetHeight'] ? _0xe517x2[_0xe517x5] : _0xe517x3
		};
		return _0xe517x3
	}
	, getNodeByCoordinate: function (_0xe517x1, _0xe517x2) {
		return document['elementFromPoint'](_0xe517x1[0] - _0xe517x2['left'], _0xe517x1[1] - _0xe517x2['top'])
	}
	, getTargetView: function (_0xe517x6, _0xe517x3, _0xe517x5) {
		var _0xe517x2 = this['getNodeByCoordinate'](_0xe517x6, _0xe517x5['bodyScroll']);
		if (Ext['isIE8'] && _0xe517x3) {
			_0xe517x2 = this['getNodeByCoordinate'](_0xe517x6, _0xe517x5['bodyScroll'])
		};
		if (_0xe517x2) {
			if (!_0xe517x2['className']['match']('sch-taskview')) {
				var _0xe517x1 = Ext['fly'](_0xe517x2)['up']('.sch-taskview');
				if (_0xe517x1) {
					_0xe517x2 = _0xe517x1['dom']
				}
				else {
					_0xe517x2 = null
				}
			};
			if (_0xe517x2) {
				return Ext['getCmp'](_0xe517x2['id'])
			}
		};
		return null
	}
	, onNodeOver: function (_0xe517x10, _0xe517x11, _0xe517x12, _0xe517x14) {
		var _0xe517x6 = _0xe517x12['getXY']();
		this['direction'] = {
			left: false
			, up: false
		};
		var _0xe517x9 = this['prevXY'];
		if (_0xe517x9) {
			if (_0xe517x9[0] > _0xe517x6[0]) {
				this['direction']['left'] = true
			}
			else {};
			if (_0xe517x9[1] > _0xe517x6[1]) {
				this['direction']['up'] = true
			}
		};
		this['prevXY'] = _0xe517x6;
		var _0xe517xa = _0xe517x11['proxy']['el']['dom'];
		var _0xe517x5 = false;
		_0xe517xa['style']['display'] = 'none';
		var _0xe517xe = this['getTargetView'](_0xe517x6, _0xe517x12, _0xe517x14);
		_0xe517xa['style']['display'] = 'block';
		if (!_0xe517xe) {
			return this['dropNotAllowed']
		};
		if (_0xe517xe) {
			_0xe517x5 = _0xe517x14['taskRecords'][0]['isValidTransition'](_0xe517xe['state']);
			if (_0xe517x5) {
				if (_0xe517xe != _0xe517x14['view']) {
					var _0xe517x1 = this['getSmallestTask'](_0xe517xe);
					if (_0xe517x1) {
						Ext['fly'](_0xe517x14['placeholder'])['remove']();
						_0xe517x14['placeholder'] = this['updatePlaceholderElements'](_0xe517x1, _0xe517x14)
					}
				};
				if (_0xe517xe != _0xe517x14['view'] || !this['dropMode']) {
					this['dropMode'] = this['getDropMode'](_0xe517xe);
					_0xe517x14['currentZoomLevel'] = _0xe517xe['up']('panel')['zoomLevel']
				};
				_0xe517x14['view'] = _0xe517xe;
				var _0xe517xc = Ext['get'](_0xe517x14['placeholder']);
				var _0xe517xb = _0xe517xe['all']['elements']['slice']()
					, _0xe517x3 = 0
					, _0xe517x2 = _0xe517xb['length'] - 1
					, _0xe517x7, _0xe517xd, _0xe517x13;
				if (_0xe517xb['length']) {
					while (_0xe517x2 - _0xe517x3 > 1) {
						_0xe517xd = Math['floor']((_0xe517x3 + _0xe517x2) / 2);
						_0xe517x7 = _0xe517xb[_0xe517xd];
						if (Ext['fly'](_0xe517x7)['isVisible']()) {
							_0xe517x13 = this['shouldDropBeforeNode'](_0xe517x6, _0xe517x7, _0xe517x11);
							if (_0xe517x13) {
								_0xe517x2 = _0xe517xd
							}
							else {
								_0xe517x3 = _0xe517xd
							}
						}
						else {
							_0xe517xb['splice'](_0xe517xd, 1);
							_0xe517x2 = _0xe517x2 - 1
						}
					};
					var _0xe517xf = _0xe517xb[_0xe517x3]
						, _0xe517x8 = this['shouldDropBeforeNode'](_0xe517x6, _0xe517xf, _0xe517x11);
					if (_0xe517x8) {
						_0xe517x7 = _0xe517xf;
						_0xe517x13 = true
					}
					else {
						if (Ext['fly'](_0xe517xb[_0xe517x2])['isVisible']()) {
							_0xe517x7 = _0xe517xb[_0xe517x2];
							_0xe517x13 = this['shouldDropBeforeNode'](_0xe517x6, _0xe517x7, _0xe517x11)
						}
						else {
							_0xe517x7 = _0xe517xf;
							_0xe517x13 = false
						}
					}
				};
				if (_0xe517x7) {
					if (_0xe517x13) {
						_0xe517xc['insertBefore'](_0xe517x7);
						_0xe517x14['dropOptions'] = {
							task: _0xe517xe['getRecord'](_0xe517x7)
							, type: 'before'
						}
					}
					else {
						_0xe517xc['insertAfter'](_0xe517x7);
						_0xe517x14['dropOptions'] = {
							task: _0xe517xe['getRecord'](_0xe517x7)
							, type: 'after'
						}
					}
				}
				else {
					_0xe517xe['el']['appendChild'](_0xe517xc);
					_0xe517x14['dropOptions'] = null
				}
			}
		};
		return _0xe517x5 ? this['dropAllowed'] : this['dropNotAllowed']
	}
	, notifyDrop: function (_0xe517xd, _0xe517x3, _0xe517x5) {
		var _0xe517xa = _0xe517x3['getXY']();
		_0xe517xd['proxy']['el']['dom']['style']['display'] = 'none';
		var _0xe517xc = this['getTargetView'](_0xe517xa, _0xe517x3, _0xe517x5);
		_0xe517xd['proxy']['el']['dom']['style']['display'] = 'block';
		var _0xe517x6 = this
			, _0xe517x2 = _0xe517xc && _0xe517xc['state']
			, _0xe517x7 = true
			, _0xe517x1 = _0xe517x2 !== false && _0xe517x2 !== null;
		_0xe517x5['newState'] = _0xe517x2;
		_0xe517x5['view'] = _0xe517xc;
		_0xe517x5['proxy'] = _0xe517xd['proxy'];
		_0xe517x5['finalize'] = function () {
			_0xe517x6['finalize']['apply'](_0xe517x6, arguments)
		};
		_0xe517x1 = _0xe517x1 && _0xe517x6['validatorFn']['call'](_0xe517x6['validatorFnScope'] || this, _0xe517x5['taskRecords'], _0xe517x2) !== false;
		this['dragData'] = _0xe517x5;
		_0xe517x7 = _0xe517x6['fireEvent']('beforetaskdropfinalize', _0xe517x6, _0xe517x5, _0xe517x3) !== false;
		if (_0xe517x7) {
			return _0xe517x6['finalize'](_0xe517x1)
		};
		return true
	}
	, finalize: function (_0xe517xc) {
		var _0xe517x7 = this['dragData']
			, _0xe517x13 = _0xe517x7['proxy']
			, _0xe517x1 = [];
		Ext['fly'](this['getEl']())['select']('.sch-dd-wrap-holder')['remove']();
		Ext['Array']['forEach'](_0xe517x7['taskEls'], function (_0xe517xa) {
			_0xe517xa['removeCls']('sch-hidden')
		});
		if (_0xe517xc) {
			var _0xe517x5 = _0xe517x7['taskRecords']
				, _0xe517x9 = _0xe517x5[0]['positionField']
				, _0xe517x4 = _0xe517x7['newState']
				, _0xe517x2 = _0xe517x7['dropOptions']
				, _0xe517x6 = _0xe517x7['view']['getStore']()
				, _0xe517xd = _0xe517x6['masterStore'];
			Ext['Array']['each'](_0xe517x5, function (_0xe517xa) {
				if (_0xe517xa['isValidTransition'](_0xe517x4)) {
					_0xe517xa['setState'](_0xe517x4);
					_0xe517x1['push'](_0xe517xa)
				}
			});
			if (_0xe517x1['length'] > 0) {
				_0xe517x6['remove'](_0xe517x1);
				var _0xe517x8 = _0xe517x2 ? (_0xe517x6['indexOf'](_0xe517x2['task']) + (_0xe517x2['type'] == 'before' ? 0 : 1)) : _0xe517x6['getCount']();
				_0xe517x6['insert'](_0xe517x8, _0xe517x1);
				_0xe517xd['suspendAutoSync']();
				for (var _0xe517x3 = 0; _0xe517x3 < _0xe517x6['getCount'](); _0xe517x3++) {
					_0xe517x6['getAt'](_0xe517x3)['set'](_0xe517x9, _0xe517x3, {
						silent: true
					})
				};
				_0xe517xd['resumeAutoSync'](_0xe517xd['autoSync']);
				_0xe517x6['sort']()
			}
		};
		if (_0xe517x1['length'] === 0) {
			_0xe517x13['el']['dom']['style']['display'] = 'block';
			_0xe517x13['el']['animate']({
				duration: 500
				, easing: 'ease-out'
				, to: {
					x: _0xe517x7['repairXY'][0]
					, y: _0xe517x7['repairXY'][1]
				}
				, stopAnimation: true
			})
		}
		else {
			this['fireEvent']('taskdrop', this, _0xe517x7['taskRecords'])
		};
		delete this['dropMode'];
		this['fireEvent']('aftertaskdrop', this, _0xe517x7['taskRecords']);
		if (_0xe517x7['placeholder']) {
			Ext['fly'](_0xe517x7['placeholder'])['remove']()
		};
		return _0xe517x1['length'] > 0
	}
});
Ext.define('Ext.ux.Kanban.editor.Base', {
	triggerEvent: 'taskdblclick'
	, panel: null
	, selector: '.sch-task'
	, editRecord: function (_0xe517x1, _0xe517x5) {
		if (this['panel']['isReadOnly']()) {
			return
		};
		var _0xe517x2 = this['panel']['getElementForTask'](_0xe517x1);
		if (_0xe517x2) {
			this['triggerEdit'](_0xe517x1, _0xe517x5)
		}
	}
	, triggerEdit: function (_0xe517x1, _0xe517x2) {
		throw 'Abstract method call'
	}
	, init: function (_0xe517x1) {
		this['panel'] = _0xe517x1;
		if (this['triggerEvent']) {
			_0xe517x1['on'](this['triggerEvent'], function (_0xe517x5, _0xe517x2, _0xe517x3, _0xe517x6) {
				this['editRecord'](_0xe517x2, _0xe517x6)
			}, this);
			_0xe517x1['on']('taskkeydown', function (_0xe517x2, _0xe517x5, _0xe517x3, _0xe517x6) {
				if (_0xe517x6['getKey']() === _0xe517x6['ENTER'] && _0xe517x6['getTarget']()['nodeName']['toLowerCase']() !== 'input') {
					this['editRecord'](_0xe517x5, _0xe517x6)
				}
			}, this)
		}
	}
});
Ext.define('Ext.ux.Kanban.editor.SimpleEditor', {
	extend: 'Ext.Editor'
	, mixins: ['Ext.ux.Kanban.editor.Base']
	, alias: 'widget.kanban_simpleeditor'
	, alignment: 'tl'
	, autoSize: {
		width: 'boundEl'
	}
	, selector: '.sch-task-name'
	, dataIndex: 'Name'
	, field: {
		xtype: 'textfield'
		, minWidth: 100
		, allowEmpty: false
	}
	, initComponent: function () {
		var _0xe517x1 = this;
		_0xe517x1['on']('complete', _0xe517x1['onEditDone'], _0xe517x1);
		_0xe517x1['callParent']()
	}
	, triggerEdit: function (_0xe517x1) {
		var _0xe517x2 = this['panel']['getElementForTask'](_0xe517x1);
		if (_0xe517x2) {
			this['record'] = _0xe517x1;
			this['startEdit'](_0xe517x2['down'](this['selector']))
		}
	}
	, onEditDone: function () {
		this['record']['set'](this['dataIndex'], this['getValue']())
	}
});
Ext.define('Ext.ux.Kanban.field.AddNew', {
	extend: 'Ext.form.TextField'
	, alias: 'widget.addnewfield'
	, enableKeyEvents: true
	, emptyText: 'Add new task...'
	, store: null
	, defaults: null
	, initComponent: function () {
		this['on']('keyup', this['onMyKeyUp'], this);
		if (Ext['isString'](this['store'])) {
			this['store'] = Ext['getStore'](this['store'])
		};
		this['callParent'](arguments)
	}
	, onMyKeyUp: function (_0xe517x2, _0xe517x1) {
		if (_0xe517x1['getKey']() === _0xe517x1['ENTER']) {
			this['addTask']()
		}
	}
	, addTask: function () {
		var _0xe517x1 = {};
		_0xe517x1[this['store']['model']['prototype']['nameField']] = this['getValue']();
		this['store']['add'](Ext['apply'](_0xe517x1, this['defaults']));
		this['setValue']()
	}
});
Ext.define('Ext.ux.Kanban.field.ColumnFilter', {
	extend: 'Ext.form.ComboBox'
	, alias: 'widget.columnfilter'
	, requires: ['Ext.data.JsonStore']
	, multiSelect: true
	, valueField: 'id'
	, displayField: 'name'
	, panel: null
	, queryMode: 'local'
	, listConfig: {
		cls: 'sch-columnfilter-list'
	}
	, initComponent: function () {
		this['store'] = new Ext['data'].JsonStore({
			proxy: 'memory'
			, fields: ['id', 'name']
		});
		this['updateListItems'](true);
		this['callParent'](arguments);
		this['getPicker']()['on']({
			beforeshow: this['onMyBeforeExpand']
			, scope: this
		});
		this['getPicker']()['on']({
			show: function (_0xe517x1) {
				_0xe517x1['on']('selectionchange', this['onMySelect'], this)
			}
			, hide: function (_0xe517x1) {
				_0xe517x1['un']('selectionchange', this['onMySelect'], this)
			}
			, delay: 50
			, scope: this
		})
	}
	, updateListItems: function (_0xe517x2) {
		var _0xe517x1 = Ext.ux.Scheduler['locale']['Active']['Ext.ux.Kanban.locale'] || {}
			, _0xe517x3 = []
			, _0xe517x5 = [];
		Ext['each'](this['panel']['query']('taskcolumn'), function (_0xe517x4) {
			_0xe517x3['push']({
				id: _0xe517x4['state']
				, name: _0xe517x4['origTitle'] || _0xe517x1[_0xe517x4['state']] || _0xe517x4['state']
			});
			if (_0xe517x2 && !_0xe517x4['hidden']) {
				_0xe517x5['push'](_0xe517x4['state'])
			}
		});
		if (_0xe517x2) {
			this['value'] = this['value'] || _0xe517x5
		};
		this['store']['loadData'](_0xe517x3);
		if (!_0xe517x2) {
			this['onMyBeforeExpand']()
		}
	}
	, onMySelect: function (_0xe517x2, _0xe517x1) {
		this['store']['each'](function (_0xe517x5) {
			this['panel']['down']('[state=' + _0xe517x5['get']('id') + ']')[Ext['Array']['indexOf'](_0xe517x1, _0xe517x5) >= 0 ? 'show' : 'hide']()
		}, this)
	}
	, onMyBeforeExpand: function () {
		var _0xe517x1 = this['panel'];
		var _0xe517x2 = this;
		var _0xe517x5 = [];
		Ext['each'](_0xe517x1['query']('taskcolumn'), function (_0xe517x3) {
			if (_0xe517x3['isVisible']()) {
				_0xe517x5['push'](_0xe517x2['store']['getById'](_0xe517x3['state']))
			}
		});
		_0xe517x2['select'](_0xe517x5)
	}
});
Ext.define('Ext.ux.Kanban.field.TaskFilter', {
	extend: 'Ext.form.TextField'
	, alias: 'widget.filterfield'
	, requires: ['Ext.util.Filter']
	, enableKeyEvents: true
	, height: 26
	, minLength: 2
	, store: null
	, caseSensitive: false
	, initComponent: function () {
		this['on']('change', this['onMyChange'], this);
		this['store'] = Ext['data']['StoreManager']['lookup'](this['store']);
		this['field'] = this['field'] || this['store']['getModel']()['prototype']['nameField'];
		this['filter'] = this['filter'] || new Ext['util'].Filter({
			id: this['getId']() + '-filter'
			, property: this['field']
			, value: ''
			, caseSensitive: this['caseSensitive']
			, anyMatch: true
		});
		this['callParent'](arguments)
	}
	, onMyChange: function () {
		var _0xe517x1 = this['getValue']();
		if (_0xe517x1 && _0xe517x1['length'] >= this['minLength']) {
			this['filter']['setValue'](_0xe517x1);
			this['store']['addFilter'](this['filter'])
		}
		else {
			this['store']['removeFilter'](this['filter'])
		}
	}
});
Ext.define('Ext.ux.Kanban.field.TaskHighlight', {
	extend: 'Ext.form.TextField'
	, alias: 'widget.highlightfield'
	, mixins: ['Ext.AbstractPlugin']
	, enableKeyEvents: true
	, minLength: 2
	, preventMark: true
	, height: 26
	, panel: null
	, field: 'Name'
	, caseSensitive: false
	, initComponent: function () {
		this['on']('keyup', this['onMyKeyUp'], this);
		this['callParent'](arguments)
	}
	, onMyKeyUp: function (_0xe517x5, _0xe517x2) {
		var _0xe517x3 = this['getValue']();
		if (_0xe517x3 && _0xe517x3['length'] >= this['minLength']) {
			var _0xe517x1 = [];
			_0xe517x3 = this['caseSensitive'] ? _0xe517x3 : _0xe517x3['toLowerCase']();
			this['panel']['highlightTasksBy'](function (_0xe517x6) {
				var _0xe517x4 = this['caseSensitive'] ? _0xe517x6['data'][this['field']] : _0xe517x6['data'][this['field']]['toLowerCase']();
				return _0xe517x4 && _0xe517x4['indexOf'](_0xe517x3) >= 0
			}, this)
		}
		else {
			this['panel']['clearHighlight']()
		}
	}
});
Ext.define('Ext.ux.Kanban.locale.En', {
	extend: 'Ext.ux.Scheduler.locale.Locale'
	, singleton: true
	, constructor: function (_0xe517x1) {
		Ext['apply'](this, {
			l10n: {
				"Ext.ux.Kanban.menu.TaskMenuItems": {
					copy: 'Duplicate'
					, remove: 'Delete'
					, edit: 'Edit'
					, states: 'Status'
					, users: 'Assign to'
				}
			}
			, NotStarted: 'Not Started'
			, InProgress: 'In Progress'
			, Test: 'Test'
			, Done: 'Done'
		});
		this['callParent'](arguments)
	}
});
Ext.define('Ext.ux.Kanban.menu.UserMenu', {
	extend: 'Ext.menu.Menu'
	, alias: 'widget.kanban_usermenu'
	, cls: 'sch-usermenu'
	, plain: true
	, resourceStore: null
	, initComponent: function () {
		var _0xe517x1 = this;
		Ext['apply'](this, {
			renderTo: document['body']
			, listeners: {
				beforeshow: function () {
					var _0xe517x2 = this['task']['getResource']();
					if (_0xe517x2) {
						this['items']['each'](function (_0xe517x5) {
							if (_0xe517x2 == _0xe517x5['user']) {
								_0xe517x5['addCls']('sch-user-selected')
							}
							else {
								_0xe517x5['removeCls']('sch-user-selected')
							}
						})
					}
				}
			}
		});
		this['resourceStore'] = Ext['data']['StoreManager']['lookup'](this['resourceStore']);
		this['mon'](this['resourceStore'], {
			load: this['populate']
			, add: this['populate']
			, remove: this['populate']
			, update: this['populate']
			, scope: this
		});
		this['callParent'](arguments);
		this['populate']()
	}
	, showForTask: function (_0xe517x1, _0xe517x2) {
		this['task'] = _0xe517x1;
		this['showAt'](_0xe517x2)
	}
	, onUserSelected: function (_0xe517x1) {
		this['task']['assign'](_0xe517x1['user'])
	}
	, populate: function () {
		var _0xe517x2 = this;
		var _0xe517x1 = [];
		this['resourceStore']['each'](function (_0xe517x5) {
			_0xe517x1['push']({
				text: _0xe517x5['getName']()
				, user: _0xe517x5
				, handler: _0xe517x2['onUserSelected']
				, scope: _0xe517x2
			})
		});
		this['removeAll'](true);
		this['add'](_0xe517x1)
	}
});
Ext.define('Ext.ux.Kanban.menu.TaskMenuItems', {
	requires: ['Ext.ux.Kanban.editor.SimpleEditor', 'Ext.ux.Kanban.menu.UserMenu']
	, mixins: ['Ext.ux.Scheduler.mixin.Localizable']
	, taskBoard: null
	, mainMenu: null
	, defaultActions: null
	, editorClass: null
	, editor: null
	, userMenuClass: null
	, userMenu: null
	, constructor: function (_0xe517x1) {
		Ext['apply'](this, _0xe517x1);
		this['mainMenu']['on']('beforeshow', this['onBeforeShow'], this);
		this['items'] = this['items'] || [];
		if (this['defaultActions']) {
			this['initEditor']();
			this['initUserMenu']();
			this['initStateMenu']();
			this['items'] = this['items']['concat']([{
				action: 'edit'
				, text: this.L('edit')
				, handler: this['onEditClick']
				, scope: this
			}, {
				action: 'assign'
				, text: this.L('users')
				, menu: this['userMenu']
			}, {
				action: 'setState'
				, text: this.L('states')
				, menu: this['stateMenu']
			}, {
				action: 'copy'
				, text: this.L('copy')
				, handler: this['onCopyClick']
				, scope: this
			}, {
				action: 'remove'
				, text: this.L('remove')
				, handler: this['onRemoveClick']
				, scope: this
			}])
		};
		this['callParent'](arguments)
	}
	, onBeforeShow: function (_0xe517x2) {
		var _0xe517x1 = _0xe517x2['getTask']();
		if (this['userMenu']) {
			this['userMenu']['task'] = _0xe517x1
		};
		if (this['editor']) {
			this['editor']['task'] = _0xe517x1
		}
	}
	, getItems: function () {
		return this['items']
	}
	, initEditor: function () {
		if (!this['editor']) {
			if (this['taskBoard']['getTaskEditor']()) {
				this['editor'] = this['taskBoard']['getTaskEditor']()
			}
			else {
				this['editor'] = Ext['create'](this['editorClass'], {
					dataIndex: this['taskBoard']['taskStore']['model']['prototype']['nameField']
					, panel: this['taskBoard']
				})
			}
		}
	}
	, onEditClick: function (_0xe517x1, _0xe517x2) {
		this['editor']['editRecord'](this['mainMenu']['getTask'](), _0xe517x2)
	}
	, initUserMenu: function () {
		if (!this['userMenu']) {
			this['userMenu'] = Ext['create'](this['userMenuClass'], {
				resourceStore: this['taskBoard']['resourceStore']
				, onBodyClick: Ext['emptyFn']
			})
		}
	}
	, initStateMenu: function () {
		var _0xe517x7 = this
			, _0xe517x6 = this['taskBoard']['taskStore']['model']
			, _0xe517x2 = _0xe517x6['prototype']['stateField']
			, _0xe517x3 = _0xe517x6['prototype']['states'];
		var _0xe517x1 = Ext.ux.Scheduler['locale']['Active']['Ext.ux.Kanban.locale'] || {};
		var _0xe517x5 = Ext['Array']['map'](_0xe517x3, function (_0xe517xc) {
			return {
				text: _0xe517x1[_0xe517xc] || _0xe517xc
				, state: _0xe517xc
				, handler: _0xe517x7['onStateClick']
				, scope: _0xe517x7
			}
		});
		var _0xe517x4 = _0xe517x7['mainMenu'];
		this['stateMenu'] = new Ext['menu'].Menu({
			items: _0xe517x5
			, plain: true
			, listeners: {
				show: function () {
					var _0xe517xc = _0xe517x4['getTask']()['get'](_0xe517x2);
					this['items']['each'](function (_0xe517xd) {
						_0xe517xd['setDisabled'](_0xe517xd['state'] === _0xe517xc)
					})
				}
			}
		})
	}
	, onStateClick: function (_0xe517x1) {
		this['mainMenu']['task']['setState'](_0xe517x1['state'])
	}
	, onCopyClick: function (_0xe517x3) {
		var _0xe517x5 = this['taskBoard']['taskStore']
			, _0xe517x2 = this['mainMenu']['getTask']()
			, _0xe517x1 = _0xe517x2['copy'](null);
		_0xe517x1['setName'](_0xe517x1['getName']());
		_0xe517x5['add'](_0xe517x1)
	}
	, onRemoveClick: function (_0xe517x5) {
		var _0xe517x2 = this['taskBoard']['taskStore']
			, _0xe517x1 = this['mainMenu']['getTask']();
		_0xe517x2['remove'](_0xe517x1)
	}
});
Ext.define('Ext.ux.Kanban.menu.TaskMenu', {
	extend: 'Ext.menu.Menu'
	, requires: ['Ext.ux.Kanban.menu.TaskMenuItems']
	, isTaskMenu: true
	, alias: 'widget.kanban_taskmenu'
	, cls: 'sch-task-menu'
	, handleCls: 'sch-task-menu-handle'
	, taskBoard: null
	, config: {
		task: null
	}
	, hideHandleTimer: null
	, handleHideDelay: 500
	, currentHandle: null
	, editorClass: 'Ext.ux.Kanban.editor.SimpleEditor'
	, userMenuClass: 'Ext.ux.Kanban.menu.UserMenu'
	, defaultActions: true
	, itemFactoryClass: 'Ext.ux.Kanban.menu.TaskMenuItems'
	, initComponent: function () {
		this['on']('beforeshow', this['onBeforeShow'], this);
		if (this['defaultActions']) {
			this['items'] = Ext['create'](this['itemFactoryClass'], {
				editorClass: this['editorClass']
				, userMenuClass: this['userMenuClass']
				, defaultActions: this['defaultActions']
				, items: this['items'] || []
				, taskBoard: this['taskBoard']
				, mainMenu: this
			})['getItems']()
		};
		this['callParent'](arguments)
	}
	, registerListeners: function () {
		this['mon'](this['taskBoard']['el'], {
			click: this['onMenuHandleClick']
			, delegate: '.' + this['handleCls']
			, scope: this
		});
		this['mon'](this['taskBoard'], {
			taskmouseenter: this['onHandleMouseOver']
			, taskmouseleave: this['onHandleMouseLeave']
			, scope: this
		})
	}
	, showForTask: function (_0xe517x1, _0xe517x3, _0xe517x5) {
		var _0xe517x2 = _0xe517x3['getTarget']('.sch-task');
		this['setTask'](_0xe517x1);
		this['show']();
		this['alignTo'](_0xe517x2, 'tl-tr?')
	}
	, onMenuHandleClick: function (_0xe517x5, _0xe517x2) {
		var _0xe517x1 = this['taskBoard']['resolveRecordByNode'](_0xe517x2);
		_0xe517x5['stopEvent']();
		this['showForTask'](_0xe517x1, _0xe517x5, _0xe517x2)
	}
	, onHandleMouseOver: function (_0xe517x1, _0xe517x2, _0xe517x5, _0xe517x4, _0xe517x3) {
		window['clearTimeout'](this['hideHandleTimer']);
		this['hide']();
		this['currentHandle'] && this['currentHandle']['setVisible'](false);
		this['currentHandle'] = Ext['select']('.' + this['handleCls'], false, _0xe517x5)['setVisible'](true)
	}
	, onHandleMouseLeave: function (_0xe517x1, _0xe517x2, _0xe517x5, _0xe517x4, _0xe517x3) {
		this['hideHandleTimer'] = Ext['defer'](function () {
			this['currentHandle'] && this['currentHandle']['setVisible'](false)
		}, this['handleHideDelay'], this)
	}
	, shouldShowItem: function (_0xe517x2, _0xe517x1) {
		return true
	}
	, onBeforeShow: function (_0xe517x2) {
		var _0xe517x1 = this['getTask']();
		this['items']['each'](function (_0xe517x5) {
			_0xe517x5['task'] = _0xe517x1;
			_0xe517x5['setVisible'](this['shouldShowItem'](_0xe517x5, _0xe517x1))
		}, this)
	}
	, destroy: function () {
		clearTimeout(this['hideHandleTimer']);
		this['callParent'](arguments)
	}
});
Ext.define('Ext.ux.Kanban.menu.UserPicker', {
	extend: 'Ext.view.View'
	, alias: ['widget.userpicker', 'widget.kanban_userpicker']
	, cls: 'sch-userpicture-view'
	, autoScroll: true
	, showName: true
	, padding: '10 5 5 5'
	, itemSelector: '.sch-user'
	, overItemCls: 'sch-user-hover'
	, selectedItemCls: 'sch-user-selected'
	, initComponent: function () {
		var _0xe517x2 = this['store'] && this['store']['model'] && this['store']['model']['prototype'];
		var _0xe517x1 = _0xe517x2 && _0xe517x2['nameField'] || 'Name';
		var _0xe517x5 = _0xe517x2 && _0xe517x2['imageUrlField'] || 'ImageUrl';
		Ext['apply'](this, {
			itemTpl: '<tpl for="."><div class="sch-user"><img src="{' + _0xe517x5 + ':htmlEncode}" />' + (this['showName'] ? '<span>{' + _0xe517x1 + ':htmlEncode}</span>' : '') + '</div></tpl>'
		});
		this['callParent'](arguments)
	}
});
Ext.define('Ext.ux.Kanban.menu.UserPictureMenu', {
	extend: 'Ext.menu.Menu'
	, alias: ['widget.userpicturemenu', 'widget.kanban_userpicturemenu']
	, requires: ['Ext.ux.Kanban.menu.UserPicker']
	, cls: 'sch-userpicturemenu'
	, width: 290
	, height: 200
	, resourceStore: null
	, hideOnSelect: true
	, initComponent: function () {
		var _0xe517x2 = this
			, _0xe517x1 = Ext['apply']({}, _0xe517x2['initialConfig']);
		delete _0xe517x1['listeners'];
		Ext['apply'](_0xe517x2, {
			plain: true
			, showSeparator: false
			, bodyPadding: 0
			, items: Ext['applyIf']({
				margin: 0
				, store: this['resourceStore']
				, xtype: 'userpicker'
			}, _0xe517x1)
		});
		_0xe517x2['callParent'](arguments);
		_0xe517x2['picker'] = _0xe517x2['down']('userpicker');
		_0xe517x2['relayEvents'](_0xe517x2['picker'], ['select']);
		if (_0xe517x2['hideOnSelect']) {
			_0xe517x2['on']('select', _0xe517x2['onUserSelected'], _0xe517x2)
		};
		this['mon'](Ext['getBody'](), 'click', this['onBodyClick'], this)
	}
	, showForTask: function (_0xe517x2, _0xe517x5) {
		this['task'] = _0xe517x2;
		this['showAt'](_0xe517x5);
		var _0xe517x1 = _0xe517x2['getResource']();
		if (_0xe517x1) {
			this['picker']['select'](_0xe517x1, false, true)
		}
		else {
			this['picker']['getSelectionModel']()['deselectAll']()
		}
	}
	, onUserSelected: function (_0xe517x2, _0xe517x1) {
		this['hide']();
		this['task']['assign'](_0xe517x1)
	}
	, onBodyClick: function (_0xe517x2, _0xe517x1) {
		if (!_0xe517x2['within'](this['el'])) {
			this['hide']()
		}
	}
});
Ext.define('Ext.ux.Kanban.selection.TaskModel', {
	extend: 'Ext.mixin.Observable'
	, panel: null
	, selModels: null
	, constructor: function (_0xe517x1) {
		var _0xe517x2 = this;
		Ext['apply'](_0xe517x2, _0xe517x1);
		_0xe517x2['callParent'](arguments);
		_0xe517x2['selModels'] = Ext['Array']['map'](_0xe517x2['panel']['views'], function (_0xe517x5) {
			return _0xe517x5['getSelectionModel']()
		});
		_0xe517x2['forEachView'](function (_0xe517x5) {
			_0xe517x2['mon'](_0xe517x5, 'containerclick', _0xe517x2['onEmptyAreaClick'], _0xe517x2);
			_0xe517x2['relayEvents'](_0xe517x5, ['select', 'deselect'])
		})
	}
	, select: function (_0xe517x4, _0xe517x3, _0xe517x1) {
		_0xe517x4 = []['concat'](_0xe517x4);
		var _0xe517x5 = false;
		var _0xe517x2 = function () {
			_0xe517x5 = true
		};
		this['forEachSelModel'](function (_0xe517x7) {
			var _0xe517x6 = Ext['Array']['filter'](_0xe517x4, function (_0xe517xc) {
				return _0xe517x7['store']['indexOf'](_0xe517xc) >= 0
			});
			_0xe517x7['on']('selectionchange', _0xe517x2, null, {
				single: true
			});
			if (_0xe517x6['length'] > 0) {
				_0xe517x7['select'](_0xe517x6, _0xe517x3, _0xe517x1)
			}
			else {
				_0xe517x7['deselectAll']()
			};
			_0xe517x7['un']('selectionchange', _0xe517x2, null, {
				single: true
			})
		});
		if (_0xe517x5) {
			this['fireEvent']('selectionchange', this['getSelection']())
		}
	}
	, deselect: function (_0xe517x2, _0xe517x1) {
		_0xe517x2 = []['concat'](_0xe517x2);
		this['forEachSelModel'](function (_0xe517x3) {
			var _0xe517x5 = Ext['Array']['filter'](_0xe517x2, function (_0xe517x4) {
				return _0xe517x3['store']['indexOf'](_0xe517x4) >= 0
			});
			_0xe517x3['deselect'](_0xe517x5, _0xe517x1)
		});
		this['fireEvent']('selectionchange', this['getSelection']())
	}
	, selectAll: function () {
		this['relayMethod']('selectAll')
	}
	, deselectAll: function () {
		this['relayMethod']('deselectAll')
	}
	, getSelection: function () {
		return this['relayMethod']('getSelection')
	}
	, getCount: function () {
		return Ext['Array']['sum'](this['relayMethod']('getCount'))
	}
	, deselectAllInOtherSelectionModels: function (_0xe517x1) {
		this['forEachSelModel'](function (_0xe517x2) {
			_0xe517x2 !== _0xe517x1 && _0xe517x2['deselectAll']()
		})
	}
	, relayMethod: function (_0xe517x2, _0xe517x1) {
		return []['concat']['apply']([], Ext['Array']['map'](this['selModels'], function (_0xe517x5) {
			return _0xe517x5[_0xe517x2]['apply'](_0xe517x5, _0xe517x1 || [])
		}))
	}
	, forEachSelModel: function (_0xe517x2, _0xe517x1) {
		Ext['Array']['each'](this['selModels'], _0xe517x2, _0xe517x1 || this)
	}
	, onEmptyAreaClick: function () {
		this['deselectAll']()
	}
	, forEachView: function (_0xe517x2, _0xe517x1) {
		Ext['Array']['each'](this['panel']['views'], _0xe517x2, _0xe517x1 || this)
	}
	, destroy: function () {}
});
Ext.define('Ext.ux.Kanban.template.Task', {
	extend: 'Ext.XTemplate'
	, model: null
	, menuIconTpl: '<div class="sch-task-menu-handle x-fa fa-gear"></div>'
	, constructor: function (_0xe517x5) {
		var _0xe517x4 = this;
		Ext['apply'](_0xe517x4, _0xe517x5);
		var _0xe517x3 = _0xe517x4['model']['prototype'];
		var _0xe517x2 = _0xe517x3['idProperty'];
		var _0xe517x1 = _0xe517x3['nameField'];
		if (typeof _0xe517x4['taskBodyTpl'] !== 'string') {
			_0xe517x4['taskBodyTpl'] = '<tpl if="' + _0xe517x3['imageUrlField'] + '"><img class="sch-task-img" src="{taskImageUrl:htmlEncode}"/></tpl><span class="sch-task-id">{[ values.' + _0xe517x2 + ' ? "#" + values.' + _0xe517x2 + ' : "" ]}</span><span class="sch-task-name"> {' + _0xe517x1 + ':htmlEncode}</span>'
		};
		if (typeof _0xe517x4['resourceImgTpl'] !== 'string') {
			_0xe517x4['resourceImgTpl'] = '<img src="{resourceImageUrl:htmlEncode}" class="sch-user-avatar {resourceImageCls:htmlEncode}" />'
		};
		_0xe517x4['callParent'](['<tpl for=".">', '<div class="sch-task sch-task-state-{' + _0xe517x3['stateField'] + ':htmlEncode} {' + _0xe517x3['clsField'] + ':htmlEncode} {cls:htmlEncode} x-unselectable" unselectable="on" style="{style}"><div class="sch-task-inner">' + _0xe517x4['taskBodyTpl'] + _0xe517x4['resourceImgTpl'] + (_0xe517x4['taskToolTpl'] || '') + '</div>' + _0xe517x4['menuIconTpl'] + '</div></tpl>'])
	}
});

if (!Ext.ux.Scheduler.patches.View) Ext.define('Ext.ux.Scheduler.patches.View', {
	extend: 'Ext.ux.Scheduler.util.Patch'
	, target: 'Ext.view.View'
	, minVersion: '5.1.0'
	, overrides: {
		handleEvent: function (_0xe517x6) {
			var _0xe517x3 = this
				, _0xe517x5 = _0xe517x3['keyEventRe']['test'](_0xe517x6['type'])
				, _0xe517x1 = _0xe517x3['getNavigationModel']();
			_0xe517x6['view'] = _0xe517x3;
			if (_0xe517x5) {
				_0xe517x6['item'] = _0xe517x6['getTarget'](_0xe517x3['itemSelector']);
				_0xe517x6['record'] = _0xe517x1['getRecord'](_0xe517x6['item'])
			};
			if (!_0xe517x6['item']) {
				var _0xe517x2 = _0xe517x3['editingPlugin'] && _0xe517x3['editingPlugin']['getActiveEditor'] && _0xe517x3['editingPlugin']['getActiveEditor']();
				if (!(_0xe517x2 && _0xe517x2['getEl']()['contains'](_0xe517x6['getTarget']()))) {
					_0xe517x6['item'] = _0xe517x6['getTarget'](_0xe517x3['itemSelector'])
				}
			};
			if (_0xe517x6['item'] && !_0xe517x6['record']) {
				_0xe517x6['record'] = _0xe517x3['getRecord'](_0xe517x6['item'])
			};
			if (_0xe517x3['processUIEvent'](_0xe517x6) !== false) {
				_0xe517x3['processSpecialEvent'](_0xe517x6)
			};
			if (_0xe517x5 && !Ext['fly'](_0xe517x6['target'])['isInputField']()) {
				if (_0xe517x6['getKey']() === _0xe517x6['SPACE'] || _0xe517x6['isNavKeyPress'](true)) {
					_0xe517x6['preventDefault']()
				}
			};
			_0xe517x6['view'] = null
		}
	}
});

Ext.define('Ext.ux.Kanban.view.TaskView', {
	extend: 'Ext.view.View'
	, alias: 'widget.taskview'
	, requires: ['Ext.ux.Kanban.template.Task', 'Ext.ux.Kanban.data.ViewStore']
	, autoScroll: true
	, trackOver: true
	, overItemCls: 'sch-task-over'
	, selectedItemCls: 'sch-task-selected'
	, itemSelector: '.sch-task'
	, state: null
	, taskRenderer: function (_0xe517x1, _0xe517x2) {}
	, initComponent: function () {
		this['tpl'] = new Ext.ux.Kanban['template'].Task({
			model: this['store']['model']
			, resourceImgTpl: this['resourceImgTpl']
			, taskToolTpl: this['taskToolTpl']
			, taskBodyTpl: this['taskBodyTpl']
		});
		this['addCls']('sch-taskview sch-taskview-state-' + this['state']);
		this['callParent'](arguments)
	}
	, refresh: function () {
		var _0xe517x2 = this['getEl']();
		var _0xe517x1 = _0xe517x2['down']('.' + Ext['baseCSSPrefix'] + 'view-selector');
		if (_0xe517x1) {
			_0xe517x2['removeChild'](_0xe517x1)
		};
		this['callParent'](arguments);
		if (_0xe517x1) {
			_0xe517x2['appendChild'](_0xe517x1)
		}
	}
	, collectData: function (_0xe517x7) {
		var _0xe517x6 = this['callParent'](arguments)
			, _0xe517x1 = [];
		for (var _0xe517xc = 0; _0xe517xc < _0xe517x6['length']; _0xe517xc++) {
			var _0xe517x5 = Ext['apply']({}, _0xe517x6[_0xe517xc]);
			var _0xe517x4 = _0xe517x7[_0xe517xc];
			var _0xe517x3 = _0xe517x4['getResource']();
			var _0xe517x2 = _0xe517x3 && _0xe517x3['getImageUrl']();
			_0xe517x5['resourceImageCls'] = '';
			_0xe517x5['resourceImageUrl'] = _0xe517x2 || Ext['BLANK_IMAGE_URL'];
			_0xe517x5['taskImageUrl'] = _0xe517x4['getImageUrl']();
			_0xe517x5['task'] = _0xe517x4;
			_0xe517x5['name'] = _0xe517x4['getName']();
			if (!_0xe517x2) {
				_0xe517x5['resourceImageCls'] = 'sch-no-img'
			};
			this['taskRenderer'](_0xe517x4, _0xe517x5);
			if (_0xe517x4['phantom']) {
				_0xe517x5['cls'] = (_0xe517x5['cls'] || '') + ' sch-phantom-task'
			};
			_0xe517x1['push'](_0xe517x5)
		};
		return _0xe517x1
	}
});
Ext.define('Ext.ux.Kanban.view.TaskColumn', {
	extend: 'Ext.Panel'
	, alias: 'widget.taskcolumn'
	, requires: ['Ext.layout.container.Fit', 'Ext.ux.Kanban.view.TaskView']
	, flex: 1
	, layout: 'fit'
	, collapseDirection: 'right'
	, state: null
	, store: null
	, taskBodyTpl: null
	, taskToolTpl: null
	, resourceImgTpl: null
	, origTitle: null
	, view: null
	, zoomLevel: 'large'
	, viewConfig: null
	, initComponent: function () {
		var _0xe517x5 = this;
		if (_0xe517x5['state'] === null) {
			throw 'Must supply state'
		};
		var _0xe517x2 = Ext['apply']({
			store: _0xe517x5['store']
			, state: _0xe517x5['state']
		}, _0xe517x5['viewConfig'] || {});
		if (_0xe517x5['taskBodyTpl']) {
			_0xe517x2['taskBodyTpl'] = _0xe517x5['taskBodyTpl']
		};
		if (_0xe517x5['taskToolTpl']) {
			_0xe517x2['taskToolTpl'] = _0xe517x5['taskToolTpl']
		};
		if (_0xe517x5['resourceImgTpl']) {
			_0xe517x2['resourceImgTpl'] = _0xe517x5['resourceImgTpl']
		};
		_0xe517x5['items'] = _0xe517x5['view'] = new Ext.ux.Kanban['view'].TaskView(_0xe517x2);
		var _0xe517x1 = Ext.ux.Scheduler['locale']['Active']['Ext.ux.Kanban.locale'] || {};
		_0xe517x5['origTitle'] = _0xe517x5['title'] = (_0xe517x5['title'] || _0xe517x1[_0xe517x5['state']] || _0xe517x5['state']);
		_0xe517x5['callParent'](arguments);
		_0xe517x5['addCls']('sch-taskcolumn sch-taskcolumn-state-' + _0xe517x5['state']['replace'](/\s/g, '-'))
	}
	, onRender: function () {
		this['setZoomLevel'](this['zoomLevel']);
		if (this['header']) {
			this['header']['addCls']('sch-taskcolumnheader-state-' + this['state']['replace'](/\s/g, '-'))
		};
		this['callParent'](arguments)
	}
	, afterRender: function () {
		this['callParent'](arguments);
		this['refreshTitle']()
	}
	, refreshTitle: function () {
		var _0xe517x1 = this['state'];
		var _0xe517x2 = this['store']['query'](this['store']['getModel']()['prototype']['stateField'], _0xe517x1, false, false, true)['length'];
		this['setTitle'](this['origTitle'] + (_0xe517x2 ? ' (' + _0xe517x2 + ')' : ''))
	}
	, bindStore: function (_0xe517x1) {
		var _0xe517x2 = {
			load: this['refreshTitle']
			, datachanged: this['refreshTitle']
			, update: this['refreshTitle']
			, add: this['refreshTitle']
			, remove: this['refreshTitle']
			, buffer: 20
			, scope: this
		};
		if (this['store']) {
			this['mun'](this['store'], _0xe517x2)
		};
		if (_0xe517x1) {
			this['mon'](_0xe517x1, _0xe517x2);
			this['view']['bindStore'](_0xe517x1)
		};
		this['store'] = _0xe517x1
	}
	, getZoomLevel: function () {
		return this['zoomLevel']
	}
	, setZoomLevel: function (_0xe517x1) {
		this['zoomLevel'] = _0xe517x1 || 'large';
		this['el']['set']({
			size: _0xe517x1
		})
	}
});
Ext.define('Ext.ux.Kanban.view.TaskBoard', {
	extend: 'Ext.Panel'
	, alias: 'widget.taskboard'
	, requires: ['Ext.ux.Scheduler.patches.EXTJS_23846', 'Ext.ux.Scheduler.patches.View', 'Ext.ux.Kanban.locale.En', 'Ext.ux.Kanban.data.TaskStore', 'Ext.ux.Kanban.data.ResourceStore', 'Ext.ux.Kanban.view.TaskColumn', 'Ext.ux.Kanban.dd.DropZone', 'Ext.ux.Kanban.dd.DragZone', 'Ext.ux.Kanban.editor.SimpleEditor', 'Ext.ux.Kanban.field.AddNew', 'Ext.ux.Kanban.menu.UserMenu', 'Ext.ux.Kanban.menu.TaskMenu', 'Ext.ux.Kanban.selection.TaskModel']
	, border: false
	, layout: {
		type: 'hbox'
		, align: 'stretch'
	}
	, defaultType: 'taskcolumn'
	, taskStore: null
	, resourceStore: null
	, columnClass: 'Ext.ux.Kanban.view.TaskColumn'
	, columns: null
	, columnConfigs: null
	, editor: null
	, viewConfig: null
	, enableUserMenu: true
	, readOnly: false
	, userMenu: null
	, taskMenu: true
	, dndValidatorFn: Ext['emptyFn']
	, validatorFnScope: null
	, zoomLevel: 'large'
	, destroyStores: false
	, taskCls: 'sch-task'
	, taskSelector: '.sch-task'
	, isHighlighting: false
	, views: null
	, kanbanColumns: null
	, selModel: null
	, initComponent: function () {
		var _0xe517x1 = this;
		_0xe517x1['defaults'] = _0xe517x1['defaults'] || {};
		Ext['applyIf'](_0xe517x1['defaults'], {
			margin: 12
		});
		this['taskStore'] = Ext['data']['StoreManager']['lookup'](this['taskStore']);
		this['resourceStore'] = Ext['data']['StoreManager']['lookup'](this['resourceStore']);
		this['addCls']('sch-taskboard');
		this['addBodyCls']('sch-taskboard-body');
		this['on']({
			add: this['onColumnsAdded']
			, remove: this['onColumnsRemoved']
			, scope: this
		});
		if (!this['columns']) {
			this['columns'] = this['createColumns']()
		}
		else {
			this['initColumns'](this['columns'])
		};
		this['items'] = this['columns'];
		if (!this['taskStore']) {
			throw 'Must define a taskStore for the Panel'
		};
		if (!this['resourceStore']) {
			throw 'Must define a resourceStore for the Panel'
		};
		this['callParent'](arguments);
		this['bindResourceStore'](this['resourceStore'], true)
	}
	, createColumns: function () {
		var _0xe517x5 = this;
		var _0xe517x1 = _0xe517x5['taskStore']['model']['prototype']['states'];
		var _0xe517x2 = _0xe517x5['columnConfigs'] || {};
		return Ext['Array']['map'](_0xe517x1, function (_0xe517x4, _0xe517x3) {
			return Ext['create'](_0xe517x5['columnClass'], Ext['apply']({
				store: _0xe517x5['taskStore']
				, state: _0xe517x4
				, viewConfig: _0xe517x5['viewConfig']
				, zoomLevel: _0xe517x5['zoomLevel']
				, taskBoard: _0xe517x5
			}, Ext['apply'](_0xe517x2[_0xe517x4] || {}, _0xe517x2['all'])))
		})
	}
	, initColumns: function (_0xe517x1) {
		var _0xe517x2 = this;
		Ext['Array']['forEach'](_0xe517x1, function (_0xe517x5) {
			if (_0xe517x5['items']) {
				_0xe517x2['initColumns'](_0xe517x5['items'])
			}
			else {
				Ext['applyIf'](_0xe517x5, {
					store: _0xe517x2['taskStore']
					, viewConfig: _0xe517x2['viewConfig']
				})
			}
		}, this)
	}
	, onColumnsAdded: function (_0xe517x5, _0xe517x1) {
		var _0xe517x2 = _0xe517x1 instanceof Ext.ux.Kanban['view']['TaskColumn'] ? [_0xe517x1] : _0xe517x1['query']('taskcolumn');
		Ext['Array']['forEach'](_0xe517x2, function (_0xe517x3) {
			_0xe517x3['bindStore'](new Ext.ux.Kanban['data'].ViewStore({
				masterStore: this['taskStore']
				, state: _0xe517x3['state']
			}));
			this['bindViewListeners'](_0xe517x3['view']);
			this['kanbanColumns'] && this['kanbanColumns']['push'](_0xe517x3);
			this['views'] && this['views']['push'](_0xe517x3['view'])
		}, this)
	}
	, onColumnsRemoved: function (_0xe517x5, _0xe517x1) {
		var _0xe517x2 = _0xe517x1 instanceof Ext.ux.Kanban['view']['TaskColumn'] && _0xe517x1;
		Ext['Array']['remove'](this['kanbanColumns'], _0xe517x2);
		Ext['Array']['remove'](this['views'], _0xe517x2['view'])
	}
	, afterRender: function () {
		var _0xe517x1 = this;
		this['callParent'](arguments);
		if (!this['isReadOnly']()) {
			this['setupDragDrop']();
			this['initEditor']();
			this['initTaskMenu']();
			if (this['enableUserMenu'] && this['userMenu']) {
				this['initUserMenu']()
			}
		};
		this['views'] = this['query']('taskview');
		this['kanbanColumns'] = this['query']('taskcolumn');
		this['on']('taskclick', this['onTaskClick'], this)
	}
	, setReadOnly: function (_0xe517x1) {
		this['readOnly'] = _0xe517x1
	}
	, isReadOnly: function () {
		return this['readOnly']
	}
	, bindViewListeners: function (_0xe517x1) {
		_0xe517x1['on']({
			itemclick: this['getTaskListener']('taskclick')
			, itemcontextmenu: this['getTaskListener']('taskcontextmenu')
			, itemdblclick: this['getTaskListener']('taskdblclick')
			, itemmouseenter: this['getTaskListener']('taskmouseenter')
			, itemmouseleave: this['getTaskListener']('taskmouseleave')
			, itemkeydown: this['getTaskListener']('taskkeydown')
			, itemkeyup: this['getTaskListener']('taskkeyup')
			, scope: this
		})
	}
	, setupDragDrop: function () {
		var _0xe517x2 = this;
		var _0xe517x1 = 'kanban-dd-' + this['id'];
		this['dragZone'] = new Ext.ux.Kanban['dd'].DragZone(this['id'], {
			panel: this
			, ddGroup: _0xe517x1
		});
		this['dropZone'] = new Ext.ux.Kanban['dd'].DropZone(this['id'], {
			panel: this
			, validatorFn: this['dndValidatorFn']
			, validatorFnScope: this['validatorFnScope']
			, ddGroup: _0xe517x1
		});
		this['relayEvents'](this['dragZone'], ['beforetaskdrag', 'taskdragstart', 'aftertaskdrop']);
		this['relayEvents'](this['dropZone'], ['beforetaskdropfinalize', 'taskdrop', 'aftertaskdrop']);
		this['dropZone']['on']('aftertaskdrop', this['onAfterTaskDrop'], this);
		this['dragZone']['on']('taskdragstarting', this['onDragStarting'], this)
	}
	, resolveState: function (_0xe517x2) {
		if (Ext['isIE'] && !_0xe517x2) {
			_0xe517x2 = document['body']
		};
		if (!_0xe517x2['dom']) {
			var _0xe517x1 = Ext['fly'](_0xe517x2);
			if (!_0xe517x1['is']('.sch-taskview')) {
				_0xe517x1 = _0xe517x1['up']('.sch-taskview')
			};
			if (_0xe517x1 && _0xe517x1['component']) {
				return _0xe517x1['component']['state']
			}
		};
		return false
	}
	, setZoomLevel: function (_0xe517x1) {
		this['translateToColumns']('setZoomLevel', [_0xe517x1])
	}
	, getZoomLevel: function () {
		return this['down']('taskcolumn')['getZoomLevel']()
	}
	, initEditor: function () {
		if (this['editor']) {
			if (!this['editor']['isComponent']) {
				this['editor'] = Ext['widget'](this['editor'])
			};
			this['editor']['init'](this)
		}
	}
	, initUserMenu: function () {
		if (!(this['userMenu'] instanceof Ext['Component'])) {
			this['userMenu'] = Ext['ComponentManager']['create'](this['userMenu'])
		};
		this['el']['on']({
			click: this['onUserImgClick']
			, delegate: '.sch-user-avatar'
			, scope: this
		})
	}
	, initTaskMenu: function () {
		if (this['taskMenu']) {
			var _0xe517x1 = typeof this['taskMenu'] === 'boolean' ? {
				xtype: 'kanban_taskmenu'
			} : this['taskMenu'];
			if (Ext['isArray'](_0xe517x1)) {
				_0xe517x1 = {
					items: _0xe517x1
				}
			};
			_0xe517x1['taskBoard'] = this;
			if (!_0xe517x1['isTaskMenu']) {
				this['taskMenu'] = Ext['widget'](Ext['applyIf'](_0xe517x1, {
					xtype: 'kanban_taskmenu'
				}))
			};
			this['taskMenu']['registerListeners']();
			this['addCls']('sch-taskboard-with-menu')
		}
	}
	, onUserImgClick: function (_0xe517x2, _0xe517x1) {
		_0xe517x2['stopEvent']();
		if (!this['isReadOnly']()) {
			this['userMenu']['showForTask'](this['resolveRecordByNode'](_0xe517x1), _0xe517x2['getXY']())
		}
	}
	, resolveViewByNode: function (_0xe517x2) {
		var _0xe517x1 = Ext['fly'](_0xe517x2)['up']('.sch-taskview');
		return (_0xe517x1 && Ext['getCmp'](_0xe517x1['id'])) || null
	}
	, resolveRecordByNode: function (_0xe517x2) {
		var _0xe517x1 = this['resolveViewByNode'](_0xe517x2);
		return (_0xe517x1 && _0xe517x1['getRecord'](_0xe517x1['findItemByChild'](_0xe517x2))) || null
	}
	, onTaskClick: function (_0xe517x2, _0xe517x1, _0xe517x3, _0xe517x5) {
		if (!_0xe517x5['ctrlKey']) {
			this['deselectAllInOtherViews'](_0xe517x2)
		}
	}
	, deselectAllInOtherViews: function (_0xe517x1) {
		this['getSelectionModel']()['deselectAllInOtherSelectionModels'](_0xe517x1['getSelectionModel']())
	}
	, getElementForTask: function (_0xe517x1) {
		if (!(_0xe517x1 instanceof Ext['data']['Model'])) {
			_0xe517x1 = this['taskStore']['getById'](_0xe517x1)
		};
		var _0xe517x2 = _0xe517x1['getState']();
		if (_0xe517x2) {
			return Ext['get'](this['getViewForState'](_0xe517x2)['getNode'](_0xe517x1))
		}
	}
	, getViewForState: function (_0xe517x1) {
		return this['down']('taskview[state=' + [_0xe517x1] + ']')
	}
	, forEachColumn: function (_0xe517x2, _0xe517x1) {
		Ext['Array']['each'](this['query']('taskcolumn'), _0xe517x2, _0xe517x1 || this)
	}
	, translateToViews: function (_0xe517x2, _0xe517x1) {
		Ext['Array']['map'](this['views'], function (_0xe517x5) {
			return _0xe517x5[_0xe517x2]['apply'](_0xe517x5, _0xe517x1 || [])
		})
	}
	, translateToColumns: function (_0xe517x2, _0xe517x1) {
		Ext['Array']['map'](this['kanbanColumns'], function (_0xe517x5) {
			return _0xe517x5[_0xe517x2]['apply'](_0xe517x5, _0xe517x1 || [])
		})
	}
	, translateToSelectionModels: function (_0xe517x2, _0xe517x1) {
		Ext['Array']['map'](this['views'], function (_0xe517x5) {
			var _0xe517x3 = _0xe517x5['getSelectionModel']();
			_0xe517x3[_0xe517x2]['apply'](_0xe517x3, _0xe517x1 || [])
		})
	}
	, getSelectedRecords: function () {
		return []['concat']['apply']([], Ext['Array']['map'](this['views'], function (_0xe517x1) {
			return _0xe517x1['getSelectionModel']()['getSelection']()
		}))
	}
	, selectAll: function () {
		this['getSelectionModel']()['selectAll']()
	}
	, deselectAll: function () {
		this['getSelectionModel']()['deselectAll']()
	}
	, onDestroy: function () {
		Ext['destroy'](this['dragZone'], this['dropZone'], this['userMenu'], this['taskMenu']);
		if (this['destroyStores']) {
			this['taskStore']['destroy']();
			this['resourceStore']['destroy']()
		}
	}
	, getTaskListener: function (_0xe517x1) {
		return function (_0xe517x5, _0xe517x2, _0xe517x6, _0xe517x3, _0xe517x4) {
			this['fireEvent'](_0xe517x1, _0xe517x5, _0xe517x2, _0xe517x6, _0xe517x4)
		}
	}
	, highlightTasksBy: function (_0xe517x6, _0xe517x3) {
		if (!this['isHighlighting']) {
			this['el']['addCls']('sch-taskboard-filtered');
			this['isHighlighting'] = true
		};
		this['el']['select']('.sch-filter-match')['removeCls']('sch-filter-match');
		for (var _0xe517x2 = 0, _0xe517x1 = this['taskStore']['getCount'](); _0xe517x2 < _0xe517x1; _0xe517x2++) {
			var _0xe517x4 = this['taskStore']['getAt'](_0xe517x2);
			if (_0xe517x6['call'](_0xe517x3 || this, _0xe517x4)) {
				var _0xe517x5 = this['getElementForTask'](_0xe517x4);
				if (_0xe517x5) {
					_0xe517x5['addCls']('sch-filter-match')
				}
			}
		}
	}
	, clearHighlight: function () {
		this['isHighlighting'] = false;
		this['el']['removeCls']('sch-taskboard-filtered');
		this['el']['select']('.sch-filter-match')['removeCls']('sch-filter-match')
	}
	, refresh: function () {
		this['translateToViews']('refresh');
		this['fireEvent']('refresh', this)
	}
	, refreshTaskNode: function (_0xe517x2) {
		var _0xe517x5 = this['getElementForTask'](_0xe517x2);
		if (_0xe517x5) {
			var _0xe517x1 = this['resolveViewByNode'](_0xe517x5);
			_0xe517x1['refreshNode'](_0xe517x2)
		}
	}
	, bindResourceStore: function (_0xe517x1, _0xe517x5) {
		var _0xe517x2 = {
			update: this['onResourceStoreUpdate']
			, refresh: this['onResourceStoreRefresh']
			, remove: this['onResourceStoreRemove']
			, scope: this
		};
		if (this['resourceStore']) {
			this['mun'](this['resourceStore'], _0xe517x2)
		};
		if (_0xe517x1) {
			_0xe517x1 = Ext['data']['StoreManager']['lookup'](_0xe517x1);
			this['mon'](_0xe517x1, _0xe517x2);
			this['taskStore']['setResourceStore'](_0xe517x1);
			if (!_0xe517x5) {
				this['refresh']()
			}
		};
		this['resourceStore'] = _0xe517x1
	}
	, onResourceStoreUpdate: function () {
		this['refresh']()
	}
	, onResourceStoreRefresh: function () {
		this['refresh']()
	}
	, onResourceStoreRemove: function () {
		this['refresh']()
	}
	, onDragStarting: function (_0xe517x1, _0xe517x2, _0xe517x5) {
		if (!_0xe517x5['ctrlKey']) {
			this['deselectAllInOtherViews'](this['getViewForState'](_0xe517x2['getState']()))
		}
	}
	, onAfterTaskDrop: function () {
		this['getSelectionModel']()['deselectAll']()
	}
	, getTaskMenu: function () {
		return this['taskMenu']
	}
	, getTaskStore: function () {
		return this['taskStore']
	}
	, getResourceStore: function () {
		return this['resourceStore']
	}
	, getTaskEditor: function () {
		return this['editor']
	}
	, getSelectionModel: function () {
		if (!this['selModel']) {
			this['selModel'] = this['createSelectionModel']()
		};
		return this['selModel']
	}
	, createSelectionModel: function () {
		var _0xe517x1 = new Ext.ux.Kanban['selection'].TaskModel({
			panel: this
		});
		this['relayEvents'](_0xe517x1, ['deselect', 'select']);
		return _0xe517x1
	}
}, function () {
	Ext['apply'](Ext.ux.Kanban, {
		VERSION: '2.0.17'
	})
});
(function () {
	Ext['data']['Connection']['override']({
		parseStatus: function (_0xe517x3) {
			var _0xe517x5 = this['callOverridden'](arguments);
			if (_0xe517x3 === 0) {
				_0xe517x5['success'] = true
			};
			return _0xe517x5
		}
	})
})()
