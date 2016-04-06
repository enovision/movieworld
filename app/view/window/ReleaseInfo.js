Ext.define('Movieworld.view.window.ReleaseInfo', {
   extend: 'Ext.window.Window',
   height: 500,
   width: 350,
   glyph: Glyphs.getGlyph('calendar'),
   title: 'Release Info',
   layout: {
      type: 'fit'
   },
   modal: true,

   _movieId: false,
   _movieTitle: false,
   _movieThumb: false,
   _movieReleased: false,

   initComponent: function () {
      var me = this;

      Ext.apply(me, {
         items: [{
            xtype: 'grid',
            store: Ext.StoreMgr.lookup('ReleaseInfo'),
            autoScroll: true,
            layout: 'fit',
            columns: [{
               text: "&nbsp;",
               width: 30,
               dataIndex: 'iso_3166_1',
               renderer: function (val) {
                  return '<img src="./resources/img/flags/png/' + val.toLowerCase() + '.png" width="16px" />';
               }
            }, {
               text: "Released",
               flex: .4,
               dataIndex: 'release_date'
            }, {
               text: "Certification",
               flex: .4,
               dataIndex: 'certification'
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
            glyph: Glyphs.getGlyph('close'),
            handler: function () {
               me.destroy();
            }
         }]
      });

      me.on('afterrender', function () {
         var store = Ext.StoreMgr.lookup('ReleaseInfo');
         store.removeAll();
         store.loadPage(1, {
            params: {
               movieId: me._movieId
            },
            callback: function () {
               var tb = me.down('#TopPanel');

               var data = {
                  _movieTitle: me._movieTitle,
                  _movieThumb: me._movieThumb,
                  _movieReleased: me._movieReleased
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
         '<img class="thumb" src="{_movieThumb}"/>',
         '<div class="wrap">',
         '<div class="title">{_movieTitle}</div>',
         '<div class="released">Released: {_movieReleased}</div>',
         '</div>',
         '</div>'
         // @formatter:on
      );
      return tpl;
   }
}); 