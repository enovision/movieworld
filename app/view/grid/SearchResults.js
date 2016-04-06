Ext.define('Movieworld.view.grid.SearchResults', {
   extend: 'Ext.grid.Panel',
   requires: [
      'Ext.data.StoreManager',
      'Ext.form.field.Checkbox',
      'Ext.grid.column.Template',
      'Ext.grid.plugin.DragDrop',
      'Ext.menu.Menu',
      'Ext.toolbar.Paging',
      'Movieworld.singleton.AppSettings',
      'Movieworld.singleton.Glyphs',
      'Movieworld.singleton.Toolbox'
   ],
   alias: 'widget.SearchResultsGrid',
   title: 'Search Results',
   border: true,
   hideHeaders: true,

   initComponent: function () {
      var me = this;

      Ext.apply(me, {
         store: Ext.StoreManager.lookup('Search'),
         columns: [{
            text: 'Results',
            xtype: 'templatecolumn',
            tpl: new Ext.XTemplate(
               '<div class="results item {[this.getResClass()]}">',
               '<div class="results image-wrap">',
               '<img class="results thumb " src="{thumbnail}"/>',
               '</div>',
               '<div class="results wrap">',
               '<span class="results type"><img src="{[this.getIcon(values.type)]}"/></span>',
               '<div class="results name">{name}</div>',
               '<tpl if="type ==\'M\'"><div class="results released">Released: {released}</div></tpl>',
               '<tpl if="type ==\'T\'"><div class="results released">First Broadcast: {released}</div></tpl>',
               '</div>', {
                  scope: me,
                  getIcon: function (type) {
                     return AppSettings.getIcon(type);
                  },
                  getResClass: function () {
                     var c = Toolbox.getResolutionClass();
                     return c;
                  }
               }),
            flex: 1
         }],
         dockedItems: [{
            xtype: 'toolbar',
            itemId: 'TopToolbar',
            dock: 'top',
            defaults: {
               xtype: 'checkboxfield',
               checked: true
            },
            items: [{
               boxLabel: 'Movies',
               itemId: 'chkMovies'
            }, {
               boxLabel: 'TV',
               itemId: 'chkTV'
            }, {
               boxLabel: 'People',
               itemId: 'chkPeople'
            }]
         }, {
            xtype: 'pagingtoolbar',
            itemId: 'pagingTbar',
            margins: '5 0 0 0',
            store: Ext.StoreManager.lookup('Search'),
            dock: 'bottom'
         }],
         viewConfig: {
            style: {
               overflow: 'auto',
               overflowX: 'hidden'
            },
            plugins: {
               ptype: 'gridviewdragdrop',
               ddGroup: 'SearchResultsDD',
               enableDrag: true, // I can drag
               enableDrop: false
               // but you can't drop on me
            }
         },
         listeners: {
            beforeitemcontextmenu: function (view, record, item, index, e) {
               var enabled = record.get('type') === 'P' ? true : false;
               var menu = Ext.create('Ext.menu.Menu', {
                  items: [{
                     text: 'Add to Compare',
                     glyph: Glyphs.getGlyph('link'),
                     enabled: enabled,
                     scope: me,
                     handler: function (b, e) {
                        me.fireEvent('btnCompareClicked',
                           record);
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