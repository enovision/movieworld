Ext.define('Movieworld.view.panel.DetailTvCard', {
   extend: 'Ext.tab.Panel',
   requires: ['Movieworld.view.panel.MediaPanel', 'Movieworld.view.grid.TvSeasons'],
   alias: 'widget.DetailTvCard',
   title: 'TV Program Details',
   header: false,
   glyph: Glyphs.getGlyph('tv'),
   layout: 'fit',

   deferredRender: false, // render also the posters immed!

   initComponent: function () {
      var me = this;

      Ext.apply(me, {
         items: [{
            xtype: 'panel',
            itemId: 'TvDetailInfo',
            tpl: me.buildXTemplate(),
            title: 'Overview',
            glyph: Glyphs.getGlyph('overview'),
            cls: 'DetailInfo',
            autoScroll: true,
            bodyPadding: 20
         }, {
            xtype: 'MediaPanel',
            title: 'Images',
            glyph: Glyphs.getGlyph('media'),
            tabPosition: 'left',
            itemId: 'TvDetailTab',
            _store: {
               'backdrop': 'BackdropTV',
               'poster': 'PosterTV'
            },
            listeners: {
               scope: me,
               'loadtrailers': function (trailers) {
                  me.LoadTrailers(trailers);
               }
            }
         }, {
            xtype: 'TvSeasonsGrid',
            itemId: 'TvSeasonsGrid',
            title: 'Seasons',
            glyph: Glyphs.getGlyph('seasons'),
            disabled: true
         }],
         dockedItems: [{
            xtype: 'toolbar',
            itemId: 'TopToolbar',
            dock: 'top',
            items: [{
               xtype: 'button',
               text: 'Translations',
               glyph: Glyphs.getGlyph('calendar'),
               itemId: 'btnTranslations',
               scope: me,
               handler: function (btn, e) {
                  me.fireEvent('TranslationsClicked', btn);
               }
            }, {
               xtype: 'button',
               text: 'Trailers',
               glyph: Glyphs.getGlyph('movie'),
               itemId: 'btnTrailers',
               disabled: true,
               menu: Ext.create('Ext.menu.Menu', {
                  itemId: 'menuTrailers'
               })
            }, '->', {
               xtype: 'button',
               text: 'See it on IMDB',
               disabled: true,
               iconCls: 'imdb',
               itemId: 'btnIMDB',
               scope: me,
               handler: function (btn, e) {
                  me.fireEvent('ImdbClicked', btn);
               }
            }, {
               xtype: 'button',
               text: 'See it on TMDB',
               disabled: true,
               iconCls: 'tmdb',
               itemId: 'btnTMDB',
               scope: me,
               handler: function (btn, e) {
                  me.fireEvent('TmdbClicked', btn);
               }
            }, {
               xtype: 'button',
               text: 'See it on TVDB',
               disabled: true,
               iconCls: 'tvdb',
               itemId: 'btnTVDB',
               scope: me,
               handler: function (btn, e) {
                  me.fireEvent('TvdbClicked', btn);
               }
            }, {
               xtype: 'button',
               text: 'Website',
               glyph: Glyphs.getGlyph('website'),
               disabled: true,
               itemId: 'btnHomepage',
               scope: me,
               handler: function (btn, e) {
                  me.fireEvent('HomepageClicked', btn);
               }
            }]
         }, {
            xtype: 'panel',
            dock: 'top',
            itemId: 'SeasonsInfo',
            layout: 'fit',
            tpl: me.buildXTemplateSeason()
         }]
      });

      me.callParent(arguments);
   },
   onMediaItemClicked: function (type, dataview, record, item) {
      var me = this;
      var tbar = me.down('#MovieDownloadTbar');
      tbar.resetDownload();

      var image = tbar.down('image');
      image.setSrc(record.get('file_w185'));
      tbar.storeRecord(record, item);
      tbar.doLayout();
      tbar.show();
   },
   updateTvContent: function (records) {
      var me = this;

      var TvDetailInfo = me.down('#TvDetailInfo');
      var mediaPanel = me.down('#TvDetailTab');

      me.setActiveTab(0);
      // first card is shown on click

      mediaPanel.hideDownloadTbar();

      var data = records[0].data;
      // first record of only 1 record !!!
      mediaPanel.LoadMediaDataViews(records[0].get('id'), records[0].get('type'));

      var TvSeasonsGrid = me.down('TvSeasonsGrid');
      TvSeasonsGrid.setDisabled(true);
      TvSeasonsGrid._season = false;

      if (data.seasons.length > 0) {
         var s1 = data.seasons[0].season_number;
         TvSeasonsGrid.LoadEpisodes(records[0].get('id'), s1, records[0].get('seasons'));
         // first season
      }

      var tpl = TvDetailInfo.tpl;
      tpl.overwrite(TvDetailInfo.body, data);

      var SeasonsInfo = me.down('#SeasonsInfo');
      SeasonsInfo.tpl.overwrite(SeasonsInfo.body, data);

      // TRANSLATIONS ---- //
      btn = me.down('#btnTranslations');
      btn['_id'] = records[0].get('id');
      btn['_name'] = records[0].get('name');
      btn['_thumb'] = records[0].get('poster_w185');
      btn['_first_air_date'] = records[0].get('first_air_date');

      var btn = me.down('#btnHomepage');
      var title = records[0].get('name');
      btn.setText('Website ' + title);

      btn['_Homepage'] = records[0].get('homepage');
      // abuse the button

      if (btn._Homepage !== '') {
         btn.enable();
      } else {
         btn.disable();
      }

      // TMDB ---- //
      btn = me.down('#btnTMDB');
      var id = records[0].get('id');
      btn['_tmdb_id'] = id;
      // abuse the button
      btn['_type'] = 'T';
      // abuse the button

      if (btn.id !== '') {
         btn.enable();
         btn.setTooltip('Tmdb Id: ' + id);
      } else {
         btn.disable();
      }

      // IMDB ---- //
      btn = me.down('#btnIMDB');

      var eIds = records[0].get('external_ids');

      var imdb = eIds.hasOwnProperty('imdb_id') ? eIds.imdb_id : '';

      btn['_imdb_id'] = imdb;
      // abuse the button

      if (btn._imdb_id !== '') {
         btn.enable();
         btn.setTooltip('Imdb Id: ' + imdb);
      } else {
         btn.disable();
      }

      // TVDB ---- //
      btn = me.down('#btnTVDB');
      var eIds = records[0].get('external_ids');
      btn['_tvdb_id'] = eIds.hasOwnProperty('tvdb_id') ? eIds.tvdb_id : '';
      btn['_type'] = 'T';

      if (btn._tvdb_id !== '') {
         btn.enable();
         btn.setTooltip('Tvdb Id: ' + eIds.tvdb_id);
      } else {
         btn.disable();
      }

      var vote = records[0].get('vote_average');

      $('.right.vote').raty({
         number: 10,
         start: vote,
         readOnly: true,
         path: 'resources/plugins/raty/img'
      });

      $('.tv-info .vote').raty({
         number: 10,
         start: vote,
         readOnly: true,
         path: 'resources/plugins/raty/img'
      });

   },
   LoadTrailers: function (trailers) {
      var me = this;

      var btn = me.down('#btnTrailers');
      var menu = btn.menu;
      // menu is a property !
      menu.removeAll();

      var store = Ext.StoreManager.lookup('Trailer');
      store.loadData(trailers);

      var records = store.getRange();

      btn.disable();

      Ext.each(records, function (item, idx) {
         menu.add({
            text: item.get('name'),
            _service: item.get('service'),
            iconCls: item.get('service'), // see
            // app_icons.css
            _source: item.get('source'),
            _size: item.get('size'),
            handler: function (btn) {
               me.fireEvent('TrailerClicked', btn);
            }
         });
         btn.enable();
      }, me);
   },
   buildXTemplate: function (record) {
      var tpl = new Ext.XTemplate(
         '<div class="detail_wrap_left"/>',
         '<div class="header">Facts</div>',
         '<div class="data-header">Original Title</div>',
         '<div class="data-field">{original_name}</div>',
         '<div class="data-header">Created by</div>',
         '<div>',
         '<ul class="data-field">',
         '<tpl for="created_by">',
         '<li>{name}</li>',
         '</tpl>',
         '</ul>',
         '</div>',
         '<div class="data-header">In production</div>',
         '<div class="data-field">{[this.getYN(values.in_production)]}</div>',
         '<div class="data-header">Episode runtime</div>',
         '<div>',
         '{[this.getList(values.episode_run_time)]}',
         '</div>',
         '<div class="data-header">Languages:</div>',
         '<div>',
         '{[this.getList(values.languages)]}',
         '</div>',
         '<div class="data-header">Genres</div>',
         '<div>',
         '<ul class="data-field">',
         '<tpl for="genres">',
         '<li>{name}</li>',
         '</tpl>',
         '</ul>',
         '</div>',
         '</div>',
         '<div class="detail_wrap_right">',
         '<div class="image-wrap">',
         '<img src="{poster_w185}"></img>',
         '</div>',
         '<div class="info-wrap">',
         '<div class="title">{original_name}</div>',
         '<div class="data-field">{overview}</div>',
         '</div>',
         '</div>',
         {
            getList: function (items) {
               if (items.length > 0) {
                  var o = '<ul class="data-field list">';
                  Ext.each(items, function (i) {
                     o = o + '<li>' + i + '</li>';
                  });
                  return o + '</ul>';
               } else {
                  return '';
               }
            },
            getYN: function (item) {
               return item === true ? 'Yes' : 'No';
            }
         });
      return tpl;
   },
   buildXTemplateSeason: function () {

      var tpl = new Ext.XTemplate(
         // @formatter:off
         '<div class="tv-info wrap"/>',
         '<img class="thumb" src="{poster_w185}"/>',
         '<div class="info">',
         '<div class="title">{name}</div>',
         '<div class="vote"></div>',
         '<div class="data-field">({vote_count} votes)</div>',
         '</div>',

         '<div class="info-2">',
         '<div class="data-field"><b>First Aired:&nbsp;</b>{first_air_date}</div>',
         '<div class="data-field"><b>Last Aired:&nbsp;</b>{last_air_date}</div>',
         '<div class="data-field"><b>No. of Episodes:&nbsp;</b>{number_of_episodes}</div>',
         '<div class="data-field"><b>No. of Seasons:&nbsp;</b>{number_of_seasons}</div>',
         '<div class="data-field country"><b>Country:&nbsp;</b>{[this.getFlag(values.origin_country)]}</div>',
         '<div class="data-field"><b>Status:&nbsp;</b>{status}</div>',
         '</div>',
         '</div>',
         // @formatter:on
         {
            getFlag: function (country) {
               return '<img src="./resources/img/flags/png/' + country[0].toLowerCase() + '.png" width="16px" />';
            }
         });
      return tpl;

   }
});
