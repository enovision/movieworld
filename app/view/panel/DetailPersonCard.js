Ext.define('Movieworld.view.panel.DetailPersonCard', {
   requires: ['Movieworld.singleton.AppSettings'],
   extend: 'Ext.panel.Panel',
   alias: 'widget.DetailPersonCard',
   title: 'Person Details',
   layout: 'fit',
   header: false,
   glyph: Glyphs.getGlyph('users'),

   initComponent: function () {
      var me = this;

      Ext.apply(me, {
         items: [{
            xtype: 'tabpanel',
            deferredRender: 'false',
            layout: 'fit',
            items: [{
               xtype: 'panel', /* otherwise no dockedItems are possible */
               title: 'Images',
               glyph: Glyphs.getGlyph('media'),
               autoScroll: true,
               items: [{
                  xtype: 'MediaDataview',
                  itemId: 'PersonDetailProfiles',
                  _type: 'profiles',
                  _store: 'Profile',
                  listeners: {
                     MediaItemClicked: {
                        fn: me.onMediaItemClicked,
                        scope: me
                     }
                  }
               }],
               dockedItems: [{
                  xtype: 'DownloadToolbar',
                  dock: 'top',
                  hidden: true
               }]
            }, {
               title: 'Biography',
               itemId: 'Biography',
               glyph: Glyphs.getGlyph('bio'),
             //  xtype: 'panel', /* otherwise autoScroll is not working */
               tpl: me.buildXTemplateBio(),
               autoScroll: true
            }]
         }],
         dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
               text: 'Add to Compare',
               glyph: Glyphs.getGlyph('link'),
               scope: me,
               handler: function (b, e) {
                  me.fireEvent('btnCompareClicked', me._record);
               }
            }, '->', {
               xtype: 'button',
               text: 'See it on TMDb',
               disabled: true,
               iconCls: 'tmdb',
               itemId: 'btnTMDB',
               scope: me,
               handler: function (btn, e) {
                  me.fireEvent('TmdbClicked', btn);
               }
            }, {
               xtype: 'button',
               text: 'Website',
               disabled: true,
               glyph: Glyphs.getGlyph('website'),
               itemId: 'btnHomepage',
               scope: me,
               handler: function (btn, e) {
                  me.fireEvent('HomepageClicked', btn);
               }
            }]
         }, {
            xtype: 'panel',
            dock: 'top',
            itemId: 'PersonInfo',
            height: 140,
            tpl: me.buildXTemplatePerson()
         }]
      });

      me.callParent(arguments);

   },

   getDownloadToolbar: function () {
      return this.down('DownloadToolbar');
   },

   onMediaItemClicked: function (type, dataview, record, item) {
      var me = this;
      var tbar = me.getDownloadToolbar();
      tbar.resetDownload();

      var image = tbar.down('image');
      tbar.updateImage(record.get('file_w185'), 68, 45);
      tbar.storeRecord(record, item);
      tbar.show();
   },
   updatePersonContent: function (records) {
      var me = this;
      me.getDownloadToolbar().hide();

      var panel = me.query('MediaDataview');
      Ext.each(panel, function (item, idx) {
         item.update('');
      });

      var tabpanel = me.down('tabpanel');

      tabpanel.setActiveTab(0);

      me._record = records[0];
      // first record of only 1 record !!!
      var data = me._record.data;
      me.LoadMediaDataViews(me._record.get('id'));

      tabpanel.setActiveTab(1);

      var PersonInfo = me.down('#PersonInfo');
      PersonInfo.tpl.overwrite(PersonInfo.body, data);
      var Bio = me.down('#Biography');
      Bio.tpl.overwrite(Bio.body, data);

      tabpanel.setActiveTab(0);

      var btn = me.down('#btnHomepage');
      var name = me._record.get('name');
      btn.setText('Website ' + name);

      btn['_Homepage'] = me._record.get('homepage');
      // abuse the button

      if (btn._Homepage != '') {
         btn.enable();
      } else {
         btn.disable();
      }

      // TMDB ---- //
      btn = me.down('#btnTMDB');
      var id = me._record.get('id');
      btn['_tmdb_id'] = id;
      // abuse the button
      btn['_type'] = 'P';
      // abuse the button

      if (btn.id != '') {
         btn.enable();
         btn.setTooltip('Tmdb Id: ' + id);
      } else {
         btn.disable();
      }
   },
   LoadMediaDataViews: function (id) {
      var me = this;

      Ext.Ajax.request({
         url: AppSettings.getServer() + 'movies/media',
         method: 'POST',
         params: {
            id: id,
            type: 'personimages'
         },
         success: function (json) {
            var response = Ext.decode(json.responseText);
            me.down('MediaDataview').LoadMedia(id, response.records['profiles']);
         }
      });
   },
   buildXTemplatePerson: function () {

      var tpl = new Ext.XTemplate(
         '<div class="tv-info wrap"/>',
         '<img class="thumb" src="{profile_w185}"/>',
         '<div class="info">',
         '<div class="title">{name}</div>',
         '<div class="vote"></div>',
         '</div>',

         '<div class="info-2">',
         '<div class="data-field"><b>Born:&nbsp;</b>{birthday}</div>',
         '<div class="data-field"><b>Place:&nbsp;</b>{place_of_birth}</div>',
         '{[this.getDeathDay(values.deathday)]}',
         '</div>',
         '</div>',
         {
            getDeathDay: function (day) {
               if (day === '')
                  return '';
               return '<div class="data-field"><b>Died:&nbsp;</b>' + day + '</div>';
            }
         });
      return tpl;

   },
   buildXTemplateBio: function () {

      var tpl = new Ext.XTemplate(
         '<div class="person_wrap">',
         '<div class="header">Bio</div>',
         '<div class="image-wrap">',
         '<img class="thumb" src="{profile_h632}"/>',
         '</div>',
         '<div>',
         '<div class="title">{name}</div>',
         '<div class="data-field">{biography}</div>',
         '</div>',
         '</div>'
      );
      return tpl;
   }
});
