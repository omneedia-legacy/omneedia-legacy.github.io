Ext.define('Ext.ux.tab.ContextMenu', {  
    alias : 'plugin.tabcontextmenu',
    mixins : {
        observable : 'Ext.util.Observable'
    },

    init : function(tabpanel) {
        this.tabPanel = tabpanel;
        this.tabPanel.addEvents('contextmenu');
        this.tabBar = tabpanel.down("tabbar");

        this.mon(this.tabPanel, {
            scope : this,
            afterlayout : this.onAfterLayout,
            single : true
        });
    },

    onAfterLayout : function() {
        this.mon(this.tabBar.el, {
            scope : this,
            contextmenu : this.onContextMenu,
            delegate : 'div.x-tab'
        });
    },

    onContextMenu : function(event, target) {
        var me = this,
            tab = me.tabBar.getChildByElement(target);

        event.preventDefault();
        this.tabPanel.fireEvent(
            'contextmenu', this.tabPanel, tab, event, target
        );
    }
});