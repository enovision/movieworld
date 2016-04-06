Ext.define('Movieworld.view.window.Translations', {
   extend: 'Ext.window.Window',
   height: 600,
   width: 400,
   glyph: Glyphs.getGlyph('translation'),
   title: 'Translations',
   layout: {
      type: 'fit'
   },
   modal: true,

   _id: false,
   _name: false,
   _thumb: false,
   _first_air_date: false,

   initComponent: function () {
      var me = this;

      Ext.apply(me, {
         items: [{
            xtype: 'grid',
            store: Ext.StoreMgr.lookup('Translations'),
            autoScroll: true,
            layout: 'fit',
            columns: [{
               text: "&nbsp;",
               width: 30,
               dataIndex: 'iso_639_1',
               renderer: function (val) {
                  return '<img src="./resources/img/flags/png/' + val.toLowerCase() + '.png" width="16px" />';
               }
            }, {
               text: "Name",
               flex: 1,
               dataIndex: 'name'
            }, {
               text: "English name",
               flex: 1,
               dataIndex: 'english_name'
            }]
         }],
         dockedItems: [{
            xtype: 'panel',
            frame: true,
            itemId: 'TopPanel',
            dock: 'top',
            height: 100,
            tpl: me.buildXTemplate()
         }],
         buttons: [{
            text: 'Close',
            scope: this,
            handler: function () {
               me.destroy();
            }
         }]
      });

      me.on('afterrender', function () {
         var store = Ext.StoreMgr.lookup('Translations');
         store.removeAll();
         store.loadPage(1, {
            params: {
               id: me._id
            },
            callback: function () {

               store.sort('name');

               var tb = me.down('#TopPanel');

               var data = {
                  _name: me._name,
                  _thumb: me._thumb,
                  _first_air_date: me._first_air_date
               };

               var panel = me.down('#TopPanel');
               panel.tpl.overwrite(panel.body, data);
            }
         });
      }, me);

      me.callParent(arguments);
   },

   buildXTemplate: function () {
      var tpl = new Ext.XTemplate(
         // @formatter:off
         '<div class="release-info">',
         '<img class="thumb" src="{_thumb}"/>',
         '<div class="wrap">',
         '<div class="title">{_name}</div>',
         '<div class="released">First Aired: {_first_air_date}</div>',
         '</div>',
         '</div>'
         // @formatter:on
      );
      return tpl;
   }
}); 