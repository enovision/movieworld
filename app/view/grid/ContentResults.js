Ext.define('Movieworld.view.grid.ContentResults', {
   extend: 'Ext.grid.Panel',
   requires: ['Movieworld.singleton.Toolbox'],
   alias: 'widget.ContentResultsGrid',
   title: 'Results Movies/Cast',
   hideHeaders: true,

   _typeLoaded: false,

   initComponent: function () {
      var me = this;

      var store = Ext.StoreManager.lookup('Content');

      Ext.apply(me, {
         store: store,
         columns: [{
            text: 'Results',
            xtype: 'templatecolumn',
            flex: 1,
            tpl: new Ext.XTemplate(
               '<div class="results item {[this.getResClass()]}">',
               '<img class="results thumb" src="{thumbnail}"/>',
               '<div class="results wrap">',
               '<div class="results image-wrap">',
               '<span class="results type"><img src="{[this.getIcon(values.type)]}"/></span>',
               '</div>',
               '<tpl if="type ==\'P\'"><div class="results name">{name}</div></tpl>',
               '<tpl if="type ==\'P\'"><div class="results character">{character}</div></tpl>',
               '<tpl if="type ==\'P\'"><div class="results job ">{job}</div></tpl>',
               '<tpl if="type ==\'M\'"><div class="results title">{title}</div></tpl>',
               '<tpl if="type ==\'M\'"><div class="results character ">{character}</div></tpl>',
               '<tpl if="type ==\'M\'"><div class="results character ">{job}</div></tpl>',
               '<tpl if="type ==\'M\'"><div class="results released ">Released: {released}</div></tpl>',
               '<tpl if="type ==\'T\'"><div class="results title">{title}</div></tpl>',
               '<tpl if="type ==\'T\'"><div class="results character ">{character}</div></tpl>',
               '<tpl if="type ==\'T\'"><div class="results character ">{job}</div></tpl>',
               '<tpl if="type ==\'T\'"><div class="results released ">First Broadcast: {released}</div></tpl>',
               '</div>',
               '</div>',
               {
                  getIcon: function (type) {
                     return AppSettings.getIcon(type);
                  },
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
               ddGroup: 'ContentResultsDD',
               enableDrag: true, // I can drag
               enableDrop: false
               // but you can't drop on me
            }
         },
         listeners: {
            beforeitemcontextmenu: function (view, record, item, index, e) {
               var disabled = record.get('type') === 'P' ? false : true;
               var menu = Ext.create('Ext.menu.Menu', {
                  items: [{
                     text: 'Add to Compare',
                     glyph: Glyphs.getGlyph('link'),
                     disabled: disabled,
                     scope: me,
                     handler: function (b, e) {
                        me.fireEvent('btnCompareClicked', record);
                     }
                  }]
               });
               e.stopEvent();
               menu.showAt(e.getXY());
            }
         },
         dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            itemId: 'RoleToolbar',
            items: [{
               xtype: 'radiogroup',
               itemId: 'RoleSelecter',
               defaults: {
                  width: '100'
               },
               items: [{
                  boxLabel: 'Acting&nbsp;',
                  name: 'role',
                  inputValue: 'A',
                  checked: true
               }, {
                  boxLabel: 'Other&nbsp;',
                  name: 'role',
                  inputValue: 'O'
               }, {
                  boxLabel: 'TV',
                  name: 'role',
                  inputValue: 'T'
               }],
               listeners: {
                  scope: me,
                  change: me.onRoleChanged
               }
            }]
         }, {
            xtype: 'pagingtoolbar',
            itemId: 'pagingTbar',
            margins: '5 0 0 0',
            store: store,
            dock: 'bottom'
         }]
      });

      me.callParent(arguments);

      me.on('resize', function () {
         Toolbox.BrowserResize('.results.item');
      }, me);
   },

   onRoleChanged: function (radio, newValue) {
      var store = this.getStore();
      store.getProxy().setExtraParam('role', newValue.role);
      store.loadPage(1);
   }
});
