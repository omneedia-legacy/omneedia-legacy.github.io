Ext.define('Ext.ux.field.NumberPicker',{
    extend: 'Ext.picker.Slot',
    requires: ['Ext.picker.Slot'],
    alias: 'widget.numberpicker',

    baseCls: Ext.baseCSSPrefix + 'numberpicker',       
    isField: true,    
    
    config: {
              
        baseCls: Ext.baseCSSPrefix + 'numberpicker',       
        isField: true,
        
        minValue: 0,
        maxValue: 100,
        placeHolder: null,
        units: null,
        name: null,
        scrollable: {
            direction: 'vertical',
            indicators: false,
            directionLock: true,
            momentumEasing: {
                minVelocity: 2
            },
            slotSnapEasing: {
                duration: 100
            }
        }
    },

    constructor: function(config) {
        config.data = [];
        for(var i = this.config.minValue; i <= this.config.maxValue; i++) {
            config.data.push({
                text: i,
                value: i
            });
        }
        this.callParent(arguments);
    },
    
    initialize: function() {
        this.callParent(arguments);
        this.callParent();

        var scroller = this.getScrollable().getScroller();

        this.on({
            scope: this,
            slotpick: 'onSlotPick'
        });
        
        scroller.on({
            scope: this,
            scroll: 'onScroll'
        });
    },
    
    onSlotPick: function(dv,val) {
        this.doSetValue(val);
    },
    
    onScroll: function(scroller, x, y) {
        var me = this,
            index = Math.round(y / (me.picker.bar ? me.picker.bar.dom.getBoundingClientRect().height : me.getViewItems()[0].getBoundingClientRect().height)),
            viewItems = me.getViewItems(),
            item = viewItems[index];
        if(item) {
            Ext.get(item).down('.x-picker-item').set({
                'data-label': (this.getPlaceHolder() ? this.getPlaceHolder()+' ' : ''),     
                'data-units': (this.getUnits() ? this.getUnits() : '')
            });                     
            Ext.get(item).getParent().select('.x-numberpicker-item').setStyle('opacity',0);
            var visibleCount = Math.ceil((Ext.get(item).up('.x-scroll-container').getHeight()/2)/Ext.get(item).getHeight());
            if(Ext.get(item).getStyle('opacity') != 1) {
                Ext.get(item).getParent().select('.x-numberpicker-item').setStyle('opacity',0);
                var prevEl = Ext.get(item).prev(),
                    prevCount = visibleCount;
                while(prevEl && prevCount > 0) {                    
                    prevEl = prevEl.setStyle('opacity',(prevCount/(visibleCount+1))).prev();
                    prevCount--;
                }
                var nextEl = Ext.get(item).next(),
                    nextCount = visibleCount;
                while(nextEl && nextCount > 0) {                    
                    nextEl = nextEl.setStyle('opacity',(nextCount/(visibleCount+1))).next();
                    nextCount--;
                }
                Ext.get(item).setStyle('opacity',1);
            }
        }
    },
    
    /*
     * Method Overrides
     */
    setupBar: function() {
        if (!this.rendered) {
            //if the component isnt rendered yet, there is no point in calculating the padding just eyt
            return;
        }

        var element = this.element,
            innerElement = this.innerElement,
            picker = this.getPicker(),
            bar = picker.bar,
            value = this.getValue(),
            showTitle = this.getShowTitle(),
            title = this.getTitle(),
            scrollable = this.getScrollable(),
            scroller = scrollable.getScroller(),
            titleHeight = 0,
            barHeight, padding;

        barHeight = (bar ? bar.dom.getBoundingClientRect().height : 0);

        if (showTitle && title) {
            titleHeight = title.element.getHeight();
        }

        padding = Math.ceil((element.getHeight() - titleHeight - barHeight) / 2);

        if (this.getVerticallyCenterItems()) {
            innerElement.setStyle({
                padding: padding + 'px 0 ' + padding + 'px'
            });
        }

        scroller.refresh();
        scroller.setSlotSnapSize(barHeight);
        this.setValue(value);
                
        if(this.getValue() === null) {
            this.container.hide();
            var placeholderEl = Ext.DomHelper.insertBefore(this.container.element,{
                tag: 'div',
                cls: 'x-field-input',
                html: '<input class="x-input-el x-numberpicker-placeholder" style="width:100%;" placeholder="'+this.getPlaceHolder()+'">',
                style: 'top:0px;'
            });
            Ext.get(placeholderEl).on('tap',function(e){
                this.next().show();
                this.destroy();
            })
        }     

    },
    
    onScrollEnd: function(scroller, x, y) {
        var me = this,
            index = Math.round(y / (me.picker.bar ? me.picker.bar.dom.getBoundingClientRect().height : me.getViewItems()[0].getBoundingClientRect().height)),
            viewItems = me.getViewItems(),
            item = viewItems[index];
        if (item) {
            me.selectedIndex = index;
            me.selectedNode = item;
            me.fireEvent('slotpick', me, me.getValue(true), me.selectedNode);
        }
    }

});