Ext.define('Movieworld.view.toolbar.History', {
   extend: 'Ext.toolbar.Toolbar',
   alias: 'widget.HistoryToolbar',
   itemId: 'historyToolbar',
   height: 50,
   hidden: true,

   initComponent: function () {

      var me = this;

      Ext.apply(me, {
         items: []
      });

      this.callParent();

   },

   UpdateHistory: function (name, type, record) {
      var me = this;

      var items = me.query('[breadcrumb]');

      if (items.length === 7) {
         if (me.down('#moreHistory') === null) {
            me.add({
               xtype: 'button',
               text: 'More History',
               breadcrumb: true,
               scale: 'large',
               itemId: 'moreHistory',
               glyph: Glyphs.getGlyph('history'),
               menu: Ext.create('Ext.menu.Menu')
            });
         }
      }

      record.set('type', type); // otherwise the event will not listen well

      var menu = (me.down('#moreHistory') !== null) ? me.down('#moreHistory').menu : me;

      var iconCls = '';
      var glyph = '';
      var icon = '';

      if (items.length < 7) {
         iconCls = type === 'P' ? 'history thumb' : (type === 'M' ? 'movie_reel' : 'television_32');
         icon = type === 'P' ? record.get('profile_w45') : '';
         xtype = 'button';
      } else {
         glyph = type === 'P' ? 'users' : (type === 'M' ? 'movie' : 'tv');
         var xtype = 'menuitem';
      }

      var text = type === 'M' ? record.get('title') : record.get('name');

      menu.add({
         xtype: xtype,
         scale: 'large',
         icon: icon,
         iconCls: iconCls,
         glyph: Glyphs.getGlyph(glyph),
         breadcrumb: true,
         text: text,
         _record: record,
         handler: function (btn) {
            var record = btn._record;
            me.fireEvent('HistoryClicked', record);
         }
      });

      me.show();
   },

   ClearHistory: function () {
      var me = this;
      var b = me.query('[breadcrumb]');
      Ext.each(b, function (item, idx) {
         item.destroy();
      }, me);
      me.hide();
   }

});