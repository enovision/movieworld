Ext.define('Movieworld.view.grid.PersonsPopular', {
   extend: 'Ext.grid.Panel',
   requires: ['Movieworld.singleton.Toolbox'],
   alias: 'widget.PersonsPopularGrid',
   border: true,
   hideHeaders: true,

   initComponent: function () {
      var me = this;

      var store = Ext.StoreManager.lookup('PersonsPopular');

      Ext.apply(me, {
         store: store,
         columns: [{
            text: 'Results',
            xtype: 'templatecolumn',
            flex: true,
            tpl: new Ext.XTemplate(
               '<div class="results item {[this.getResClass()]}">',
               '<div class="results image-wrap">',
               '<img class="results thumb" src="{thumbnail}"/>',
               '</div>',
               '<div class="results wrap">',
               '<div class="results name">{name}</div>',
               '<div class="results released">Born: {item_date}</div>',
               '</div>',
               '</div>',
               {
                  getResClass: function () {
                     var c = Toolbox.getResolutionClass();
                     return c;
                  }
               })
         }],
         viewConfig: {
            style: {
               overflow: 'auto',
               overflowX: 'hidden'
            },
            plugins: {
               ptype: 'gridviewdragdrop',
               ddGroup: 'PersonsPopularDD',
               enableDrag: true, // I can drag
               enableDrop: false // but you can't drop on me
            }
         },
         listeners: {
            beforeitemcontextmenu: function (view, record, item, index, e) {
               var enabled = record.get('type') != 'P' ? false : true;
               var menu = Ext.create('Ext.menu.Menu', {
                  items: [{
                     text: 'Add to Compare',
                     glyph: Glyphs.getGlyph('link'),
                     enabled: enabled,
                     scope: me,
                     handler: function (b, e) {
                        me.fireEvent('btnCompareClicked', record);
                     }
                  }]
               });
               e.stopEvent();
               menu.showAt(e.getXY());
            }
         }
      });

      me.callParent(arguments);

      me.on('resize', function () {
         Toolbox.BrowserResize('.results.item');
      }, me);
   }
});
