Ext.define('Movieworld.view.panel.Frontrow', {
   extend: 'Ext.tab.Panel',
   requires: ['Movieworld.view.view.FrontrowDataview'],
   alias: 'widget.FrontrowPanel',
   layout: 'fit',
   title: 'Home',
   glyph: Glyphs.getGlyph('frontrow'),

   deferredRender: false,

   initComponent: function () {
      var me = this;

      var tbarItems = [{
         xtype: 'label',
         text: 'Sort:'
      }, {
         xtype: 'button',
         text: 'Title',
         glyph: Glyphs.getGlyph('sort_desc'),
         scope: me,
         handler: function (btn, e) {
            me.SortClicked(btn, 'name');
         }
      }, {
         xtype: 'button',
         text: 'Popularity',
         glyph: Glyphs.getGlyph('sort_asc'),
         scope: me,
         handler: function (btn, e) {
            me.SortClicked(btn, 'vote_average');
         }
      }];

      Ext.apply(me, {
         items: [{
            itemId: 'Popular',
            title: 'Popular',
            glyph: Glyphs.getGlyph('movie'),
            layout: 'fit',
            items: [{
               xtype: 'FrontrowDataview',
               _store: 'Popular',
               listeners: {
                  scope: me,
                  itemclick: function (dataview, record, item, index, e) {
                     me.DataviewItemClicked(dataview, record, item, index, e);
                  }
               }
            }],
            dockedItems: [{
               xtype: 'toolbar',
               itemId: 'TopToolbar',
               dock: 'top',
               items: tbarItems
            }]
         }, {
            title: 'In the cinema',
            glyph: Glyphs.getGlyph('calendar'),
            itemId: 'Boxoffice',
            layout: 'fit',
            items: [{
               xtype: 'FrontrowDataview',
               _store: 'Boxoffice',
               listeners: {
                  scope: me,
                  itemclick: function (dataview, record, item, index, e) {
                     me.DataviewItemClicked(dataview, record, item, index, e);
                  }
               }
            }],
            dockedItems: [{
               xtype: 'toolbar',
               itemId: 'TopToolbar',
               dock: 'top',
               items: tbarItems
            }]
         }, {
            title: 'Now on TV',
            glyph: Glyphs.getGlyph('tv'),
            itemId: 'BoxofficeTV',
            layout: 'fit',
            items: [{
               xtype: 'FrontrowDataview',
               _store: 'BoxofficeTV',
               listeners: {
                  scope: me,
                  itemclick: function (dataview, record, item, index, e) {
                     me.DataviewItemClicked(dataview, record, item, index, e);
                  }
               }
            }],
            dockedItems: [{
               xtype: 'toolbar',
               itemId: 'TopToolbar',
               dock: 'top',
               items: tbarItems
            }]
         }, {
            itemId: 'PopularTV',
            title: 'TV Popular',
            glyph: Glyphs.getGlyph('star'),
            layout: 'fit',
            items: [{
               xtype: 'FrontrowDataview',
               _store: 'PopularTV',
               listeners: {
                  scope: me,
                  itemclick: function (dataview, record, item, index, e) {
                     me.DataviewItemClicked(dataview, record, item, index, e);
                  }
               }
            }],
            dockedItems: [{
               xtype: 'toolbar',
               itemId: 'TopToolbar',
               dock: 'top',
               items: tbarItems
            }]
         }]
      });

      me.callParent(arguments);
   },

   // --------------------------------------------------------------------------
   // event handlers : DataView (Frontrow)
   // --------------------------------------------------------------------------

   SortClicked: function (btn, field) {
      var me = this;

      var card = me.getActiveTab();
      card.down('FrontrowDataview').getStore().sort(field);

      if (btn.glyph == Glyphs.getGlyph('sort_asc')) {
         btn.setGlyph(Glyphs.getGlyph('sort_desc'));
      } else {
         btn.setGlyph(Glyphs.getGlyph('sort_asc'));
      }
   },

   DataviewItemClicked: function (dataview, rec, Index) {
      var me = this;
      // rec.set('type', 'M');
      this.fireEvent('griditemclicked', false, rec);
   }
});
