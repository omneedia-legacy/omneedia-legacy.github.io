/**
 * IconCombo (combobox with icons)
 *
 * @author  Holger Schäfer
 */
Ext.define('Ext.ux.form.field.IconCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.iconcombo',

    config: {
        /**
         * @cfg {String} iconClsField
         * Field that contains the icon class. Defaults to 'iconCls'. Optional.
         */
        iconClsField: 'iconCls'
    },

    /**
     * Initialize component
     */
    initComponent: function() {
        var iconFieldSubTpl = Ext.clone(this.fieldSubTpl);
        if (Ext.isArray(iconFieldSubTpl)) {
            iconFieldSubTpl.push('<div class="ux-icon-combo-icon"></div>');
        }
        Ext.apply(this, {
            scope: this,
			listeners: {
				select: function (comboBox, records) {
					var record = records[0];
					comboBox.inputEl.addCls(record.get(comboBox.iconClsField));
				}
			},
            tpl: Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '<div class="x-boundlist-item ux-icon-combo-item {' + this.iconClsField + '}">',
                    '{' + this.displayField + '}',
                    '</div>',
                    '</tpl>',
                    { compiled: true, disableFormats: true }
            ),
            // add wrapping DIV container around TDs because position:relative is not defined on TD
            beforeSubTpl: '<div class="ux-icon-combo-wrap">',
            fieldSubTpl: iconFieldSubTpl,
            afterSubTpl: '</div>',
            renderSelectors: {
                iconClsEl: '.ux-icon-combo-icon'
            }
        });
        this.callParent(arguments);
    },

    /**
     * Set icon class
     */
    setIconCls: function() {
        if (this.rendered) {
            var rec = this.store.findRecord(this.valueField, this.getValue());
            if (rec) {
                var newIconCls = rec.get(this.iconClsField);
                this.iconClsEl.replaceCls(this.oldIconCls, newIconCls);
                this.oldIconCls = newIconCls;
            }
        } else {
            this.on('render', this.setIconCls, this, { single: true });
        }
    },

    /**
     * Set value
     * @param value Value
     */
    setValue: function(value) {
        this.callParent(arguments);
        this.setIconCls();
    }
});