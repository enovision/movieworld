Ext.define('Movieworld.view.panel.WorkPanel', {
   extend: 'Ext.panel.Panel',

   requires: [
      'Ext.dd.*'
   ],
   alias: 'widget.WorkPanel',
   layout: 'border',
   title: 'Who worked with who',
   glyph: Glyphs.getGlyph('link'),

   initComponent: function () {
      var me = this;

      var storePersons = Ext.StoreManager.lookup('WorkPersons');
      var storeMovies = Ext.StoreManager.lookup('WorkMovies');

      Ext.apply(me, {
         items: [
            {
               xtype: 'gridpanel',
               scroll: false,
               flex: .3,
               title: 'People',
               itemId: 'gridPersons',
               store: storePersons,
               region: 'west',
               border: true,
               scrollable: true,
               glyph: Glyphs.getGlyph('users'),
               columns: [
                  {
                     text: 'Results',
                     xtype: 'templatecolumn',
                     flex: 1,
                     tpl: new Ext.XTemplate(
                        '<tpl><img class="work person thumb" src="{thumbnail}"/></tpl>',
                        '<div class="work person wrap">',
                        '<tpl><div class="work person name">{name}</div></tpl>',
                        '</div>'
                     )
                  }
               ],
               viewConfig: {
                  style: {
                     overflow: 'auto',
                     overflowX: 'hidden'
                  },
                  plugins: {
                     ptype: 'gridviewdragdrop',
                     dragGroup: 'WorkPanelDDGroup',
                     dropGroup: 'WorkPanelDDGroup',
                     enableDrag: false,
                     enableDrop: true
                  }
               },
               selModel: Ext.create('Ext.selection.CheckboxModel', {
                  checkOnly: true,
                  listeners: {
                     scope: me,
                     selectionchange: function (model, selected) {
                        me.updateMovies(selected);
                     }
                  }
               }),
               dockedItems: [
                  {
                     xtype: 'toolbar',
                     dock: 'bottom',
                     items: [
                        '->', {
                           xtype: 'button',
                           glyph: Glyphs.getGlyph('delete'),
                           text: 'remove',
                           scope: me,
                           handler: function () {
                              var grid = me.down('#gridPersons');
                              var store = grid.getStore();
                              var sm = grid.getSelectionModel();
                              var selected = sm.getSelection();

                              if (selected.length > 0) {
                                 store.remove(selected);
                                 sm.deselectAll();
                              }
                           }
                        }, {
                           xtype: 'button',
                           glyph: Glyphs.getGlyph('delete'),
                           text: 'remove All',
                           scope: me,
                           handler: function (b, e) {
                              var grid = me.down('#gridPersons');
                              var store = grid.getStore();
                              store.removeAll();
                           }
                        }]
                  }
               ],
               listeners: {
                  scope: me,
                  viewready: function (grid) {
                     me.addDropTarget(grid);
                  },
                  beforeitemcontextmenu: function (view, record, item, index, e) {
                     var menu = Ext.create('Ext.menu.Menu', {
                        items: [{
                           text: 'Remove',
                           glyph: Glyphs.getGlyph('delete'),
                           scope: me,
                           handler: function (b, e) {
                              var grid = me.down('#gridPersons');
                              var store = grid.getStore();
                              store.remove(record);
                           }
                        }]
                     });
                     e.stopEvent();
                     menu.showAt(e.getXY());
                  }
               }
            },
            {
               xtype: 'gridpanel',
               title: 'Movies',
               itemId: 'gridMovies',
               store: storeMovies,
               region: 'center',
               border: true,
               scrollable: true,
               glyph: Glyphs.getGlyph('movie'),
               columns: [
                  {
                     text: 'Results',
                     xtype: 'templatecolumn',
                     flex: 1,
                     tpl: new Ext.XTemplate(
                        '<img class="work movie thumb" src="{thumbnail}"/>',
                        '<div class="work movie wrap">',
                        '<div class="work movie name">{title}</div>',
                        '<div class="work movie released">Released: {released}</div>',
                        '</div>'
                     )
                  }
               ],
               viewConfig: {
                  style: {
                     overflow: 'auto',
                     overflowX: 'hidden'
                  }
               },
               dockedItems: [
                  {
                     xtype: 'pagingtoolbar',
                     margins: '5 0 0 0',
                     store: storeMovies,
                     dock: 'bottom'
                  }
               ]
            }
         ]
      });

      me.addDropTarget = function (grid) {
         var el = grid.getView().container.dom;
         grid.DropTarget = new Ext.dd.DropTarget(
            el, {
               ddGroup: 'PersonsPopularDD',
               scope: me,
               notifyDrop: function (ddSource, e, data) {
                  var record = data.records[0];
                  var r = me.updatePersons(record);
                  if (r == false) return false;
               }
            });

         grid.DropTarget.addToGroup('SearchResultsDD');
         grid.DropTarget.addToGroup('ContentResultsDD');
      };

      me.callParent(arguments);

   },

   updatePersons: function (record) {
      // don't except double persons
      var store = Ext.StoreManager.lookup('WorkPersons');
      var id = record.get('id');
      var r = store.findRecord('id', id);
      if (r != null) {
         return false;
      } else {
         if (record.get('type') != 'P') {
            return false;
         } else {
            var tn = record.get('thumbnail');
            if (typeof(tn) == 'undefined') {
               record.set('thumbnail', record.get('profile_w185'));
            }
            store.add(record);
         }
      }
   },

   updateMovies: function (selected) {
      var me = this;

      var store = Ext.StoreManager.lookup('WorkMovies');

      var sel = [];
      Ext.each(selected, function (record, idx) {
         sel.push({
            id: record.get('id')
         });
      }, this);

      var json = Ext.encode(sel);

      store.getProxy().setExtraParams({
         selection: json
      });

      store.loadPage(1, {
         params: {
            selection: json
         },
         callback: function (records, operation, success) {
            var response = Ext.decode(operation._response.responseText);
            Ext.SlideMessage.msg('Info', response.message);
         }
      });
   }

});