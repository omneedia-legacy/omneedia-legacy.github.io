Ext.define('KitchenSink.view.d3.TreeMapTooltipController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.treemap-tooltip',

    parentTemplate: null,
    leafTemplate: null,

    getParentHtml: function (node) {
        var template = this.parentTemplate;

        if (!template) {
            template = this.parentTemplate = new Ext.XTemplate(
                '<div class="tip-title">{data.name}</div>',
                '<tpl for="childNodes">',
                '<div><span class="tip-symbol">{data.name}</span><tpl if="data.description"> - {data.description}</tpl></div>',
                '<tpl if="xindex &gt; 10">...{% break; %}</tpl>',
                '</tpl>'
            );
        }
        return template.apply(node);
    },

    getLeafHtml: function (node) {
        var template = this.leafTemplate;

        if (!template) {
            template = this.leafTemplate = new Ext.XTemplate(
                '<div class="tip-company">{data.description}</div>',
                '<div>Change:&nbsp;<tpl if="data.change &gt; 0">+</tpl>{data.change}%</div>'
            );
        }
        return template.apply(node);
    },

    onTooltip: function (tooltip, node, element, event) {
        var treemap = this.lookupReference('treemap');
        
        treemap.setSelection(node);
        if (node.isLeaf()) {
            tooltip.setHtml(this.getLeafHtml(node));
        } else {
            tooltip.setHtml(this.getParentHtml(node));
        }
    }

});
