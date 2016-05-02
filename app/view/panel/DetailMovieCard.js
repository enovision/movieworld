Ext.define('Movieworld.view.panel.DetailMovieCard', {
   extend: 'Ext.tab.Panel',
   alias: 'widget.DetailMovieCard',
   title: 'Movie Details',
   header: false,
   glyph: Glyphs.getGlyph('movie'),
   layout: 'fit',
   deferredRender: false,
   requires: [
      'Ext.button.Button',
      'Ext.data.StoreManager',
      'Ext.layout.container.Fit',
      'Ext.menu.Menu',
      'Ext.panel.Panel',
      'Ext.toolbar.Fill',
      'Movieworld.singleton.Glyphs',
      'Movieworld.view.panel.MediaPanel'
   ],
   initComponent: function () {
      var me = this;

      Ext.apply(me, {
         items: [{
            xtype: 'panel',
            itemId: 'MovieDetailInfo',
            cls: 'DetailInfo',
            title: 'Overview',
            glyph: Glyphs.getGlyph('overview'),
            tpl: me.buildXTemplate(),
            autoScroll: true,
            bodyPadding: 20

         }, {
            xtype: 'MediaPanel',
            itemId: 'MovieDetailTab',
            title: 'Images',
            tabPosition: 'left',
            _store: {
               'backdrop': 'Backdrop',
               'poster': 'Poster'
            },

            listeners: {
               scope: me,
               'loadtrailers': function (trailers) {
                  me.LoadTrailers(trailers);
               }
            }
         }],
         dockedItems: [{
            xtype: 'toolbar',
            itemId: 'TopToolbar',
            dock: 'top',
            items: [{
               xtype: 'button',
               text: 'Release Info',
               glyph: Glyphs.getGlyph('calendar'),
               itemId: 'btnRelease',
               scope: me,
               handler: function (btn) {
                  me.fireEvent('ReleaseClicked', btn);
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
               text: 'Website',
               glyph: Glyphs.getGlyph('website'),
               disabled: true,
               itemId: 'btnHomepage',
               scope: me,
               handler: function (btn) {
                  me.fireEvent('HomepageClicked', btn);
               }
            }]
         }, {
            xtype: 'panel',
            dock: 'top',
            itemId: 'MovieInfo',
            height: 140,
            tpl: me.buildXTemplateMovie()
         }]
      });

      me.callParent(arguments);
   },
   updateMovieContent: function (records) {
      var me = this;

      var mediaPanel = me.down('#MovieDetailTab');
      mediaPanel.hideDownloadTbar();

      var data = records[0].data;
      // first record of only 1 record !!!
      mediaPanel.LoadMediaDataViews(records[0].get('id'), records[0].get('type'));

      var MovieDetailInfo = panel = me.down('#MovieDetailInfo');
      var tpl = MovieDetailInfo.tpl;
      tpl.overwrite(panel.body, data);

      var MovieInfo = me.down('#MovieInfo');
      MovieInfo.tpl.overwrite(MovieInfo.body, data);

      var toolbar = me.down('toolbar');

      var btn = toolbar.down('#btnHomepage');
      var title = records[0].get('title');
      btn.setText('Website ' + title);

      btn['_Homepage'] = records[0].get('homepage');
      // abuse the button

      if (btn._Homepage !== '') {
         btn.enable();
      } else {
         btn.disable();
      }

      // IMDB ---- //
      btn = toolbar.down('#btnIMDB');
      var imdb = records[0].get('imdb_id');

      btn['_imdb_id'] = imdb;
      // abuse the button

      if (btn._imdb_id !== '') {
         btn.enable();
         btn.setTooltip('Imdb Id: ' + imdb);
      } else {
         btn.disable();
      }

      // TMDB ---- //
      btn = toolbar.down('#btnTMDB');
      var id = records[0].get('id');
      btn['_tmdb_id'] = id;
      // abuse the button
      btn['_type'] = 'M';
      // abuse the button

      if (btn.id !== '') {
         btn.enable();
         btn.setTooltip('Tmdb Id: ' + id);
      } else {
         btn.disable();
      }

      // RELEASES ---- //
      btn = toolbar.down('#btnRelease');
      btn['_movieId'] = id;
      btn['_movieTitle'] = records[0].get('title');
      btn['_movieThumb'] = records[0].get('poster_w92');
      btn['_movieReleased'] = records[0].get('release_date');

      var vote = records[0].get('vote_average');

      $('.vote').raty({
         number: 10,
         start: vote,
         readOnly: true,
         path: 'resources/javascript/raty/img'
      });
   },

   LoadTrailers: function (trailers) {
      var me = this;

      var btn = me.down('toolbar #btnTrailers');
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

   buildXTemplate: function () {

      var tpl = new Ext.XTemplate(
         '<div class="detail_wrap_left"/>',
         '<div class="header">Facts</div>',
         '<div class="data-header">Original Title</div>',
         '<div class="data-field">{original_title}</div>',
         '<div class="data-header">Tagline</div>',
         '<div class="data-field">{tagline}</div>',
         '<div class="data-header">Production Companies</div>',
         '<div>',
         '<ul class="data-field">',
         '<tpl for="production_companies">',
         '<li>{name}</li>',
         '</tpl>',
         '</ul>',
         '</div>',
         '<div class="data-header">Production Countries</div>',
         '<div>',
         '<ul class="data-field">',
         '<tpl for="production_countries">',
         '<li>{name}</li>',
         '</tpl>',
         '</ul>',
         '</div>',
         '<div class="data-header">Spoken Languages</div>',
         '<div>',
         '<ul class="data-field">',
         '<tpl for="spoken_languages">',
         '<li>{name}</li>',
         '</tpl>',
         '</ul>',
         '</div>',
         '<div class="data-header">Adult</div>',
         '<div class="data-field">{[this.getYN(values.adult)]}</div>',
         '<div class="data-header">Budget</div>',
         '<div class="data-field">{[Toolbox.ConvertNumber(values.budget)]}</div>',
         '<div class="data-header">Revenue</div>',
         '<div class="data-field">{[Toolbox.ConvertNumber(values.revenue)]}</div>',
         '<div class="data-header">Genres</div>',
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
         '<div class="title">{original_title}</div>',
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
      // @formatter:on
      return tpl;
   },
   buildXTemplateMovie: function () {

      var tpl = new Ext.XTemplate(
         // @formatter:off
         '<div class="tv-info wrap"/>',
         '<img class="thumb" src="{poster_w185}"/>',
         '<div class="info">',
         '<div class="title">{title}</div>',
         '<div class="vote"></div>',
         '<div class="data-field">({vote_count} votes)</div>',
         '</div>',

         '<div class="info-2">',
         '<div class="data-field"><b>Released:&nbsp;</b>{release_date}</div>',
         '<div class="data-field"><b>Budget:&nbsp;</b>{[Toolbox.ConvertNumber(values.budget)]}</div>',
         '<div class="data-field"><b>Runtime:&nbsp;</b>{runtime}</div>',
         '<div class="data-field"><b>Status:&nbsp;</b>{status}</div>',
         '</div>',
         '</div>'
         // @formatter:on
      );
      return tpl;

   }
});
