Ext.define('Movieworld.controller.movieworld', {
   extend: 'Ext.app.Controller',

   models: ['Tv', 'TvEpisode', 'TvSeason', 'Movie', 'Person', 'Media', 'Content', 'Search', 'Detail', 'Boxoffice', 'Credits', 'ChangeLog', 'ReleaseInfo', 'Translations'],
   stores: ['Tv', 'TvSeason', 'Movie', 'Person', 'Content', 'Search', 'Detail',
      'Boxoffice', 'Popular', 'BoxofficeTV', 'PopularTV', 'Poster', 'Backdrop', 'PosterTV',
      'BackdropTV', 'Trailer', 'Profile', 'PersonsPopular', 'MoviesPopular', 'Credits',
      'ChangeLog', 'ReleaseInfo', 'WorkMovies', 'WorkPersons', 'Translations'],

   views: [
      'panel.Search', 'panel.Content', 'panel.Detail', 'panel.DetailMovieCard', 'panel.DetailTvCard',
      'panel.DetailPersonCard', 'panel.WorkPanel', 'panel.Frontrow', 'grid.SearchResults', 'grid.ContentResults', 'grid.MoviesPopular', 'grid.PersonsPopular', 'toolbar.Search', 'toolbar.Status', 'toolbar.History', 'window.Feedback', 'window.Credits', 'window.ReleaseInfo',
      'grid.TvSeasons', 'window.Translations'
   ],

   refs: [{
      ref: 'SearchToolbar',
      selector: 'SearchToolbar'
   }, {
      ref: 'HistoryToolbar',
      selector: 'HistoryToolbar'
   }, {
      ref: 'SearchGrid',
      selector: 'SearchPanel #SearchResultsGrid'
   }, {
      ref: 'ResultGridToolbar',
      selector: 'SearchResultsGrid #TopToolbar'
   }, {
      ref: 'PersonsPopularGrid',
      selector: 'SearchPanel #PersonsPopularGrid'
   }, {
      ref: 'DetailPanel',
      selector: 'DetailPanel'
   }, {
      ref: 'DetailMovieCard',
      selector: 'DetailMovieCard'
   }, {
      ref: 'DetailTvCard',
      selector: 'DetailTvCard'
   }, {
      ref: 'DetailWorkPanel',
      selector: 'DetailWorkPanel'
   }, {
      ref: 'DetailPersonCard',
      selector: 'DetailPersonCard'
   }, {
      ref: 'SearchPanel',
      selector: 'SearchPanel'
   }, {
      ref: 'ContentPanel',
      selector: 'ContentPanel'
   }, {
      ref: 'WorkPanel',
      selector: 'WorkPanel'
   }, {
      ref: 'WorkPanelMovies',
      selector: 'WorkPanel #gridMovies'
   }, {
      ref: 'ContentResultsGrid',
      selector: 'ContentResultsGrid'
   }, {
      ref: 'TvSeasonsGrid',
      selector: 'TvSeasonsGrid'
   }],

   init: function () {
      var me = this;

      // listeners on instances of our classes
      me.control({
         'SearchToolbar': {
            scope: me,
            SearchClicked: me.onSearchClicked,
            ResetSearchClicked: me.onResetSearchClicked,
            BoxOfficeClicked: me.onBoxOfficeClicked,
            CreditsClicked: me.onCreditsClicked,
            FeedbackClicked: me.onFeedbackClicked,
            ClearHistoryClicked: me.onClearHistoryClicked,
            WorkClicked: me.onWorkClicked
         },
         'StatusToolbar': {
            scope: me,
            FeedbackClicked: me.onFeedbackClicked,
            CreditsClicked: me.onCreditsClicked
         },
         'HistoryToolbar': {
            scope: me,
            HistoryClicked: me.onHistoryClicked
         },
         'SearchToolbar checkboxfield': {
            scope: me,
            change: me.onSearchCheckboxClicked
         },
         'SearchResultsGrid': {
            scope: me,
            itemclick: me.onGridItemClicked,
            btnCompareClicked: me.onAddToCompareClicked
         },
         'SearchResultsGrid #TopToolbar checkboxfield': {
            scope: me,
            change: me.onSearchGridCheckboxClicked
         },
         'PersonsPopularGrid': {
            scope: me,
            itemclick: me.onGridItemClicked,
            btnCompareClicked: me.onAddToCompareClicked
         },
         'MoviesPopularGrid': {
            scope: me,
            itemclick: me.onGridItemClicked
         },
         'ContentResultsGrid': {
            scope: me,
            itemclick: me.onGridItemClicked,
            btnCompareClicked: me.onAddToCompareClicked
         },
         'WorkPanel #gridMovies': {
            scope: me,
            itemclick: me.onGridItemClicked
         },
         'WorkPanel #gridPersons': {
            scope: me,
            itemdblclick: me.onGridItemClicked
         },
         'DetailPersonCard': {
            scope: me,
            HomepageClicked: me.onDetailHomepageClicked,
            TmdbClicked: me.onDetailTmdbClicked,
            btnCompareClicked: me.onAddToCompareClicked
         },
         'DetailMovieCard': {
            scope: me,
            HomepageClicked: me.onDetailHomepageClicked,
            ImdbClicked: me.onDetailImdbClicked,
            TmdbClicked: me.onDetailTmdbClicked,
            ReleaseClicked: me.onDetailReleaseClicked,
            MediaItemClicked: me.onMediaItemClicked,
            TrailerClicked: me.onTrailerClicked
         },
         'DetailTvCard': {
            scope: me,
            HomepageClicked: me.onDetailHomepageClicked,
            TmdbClicked: me.onDetailTmdbClicked,
            TvdbClicked: me.onDetailTvdbClicked,
            ImdbClicked: me.onDetailImdbClicked,
            MediaItemClicked: me.onMediaItemClicked,
            TrailerClicked: me.onTrailerClicked,
            TranslationsClicked: me.onTranslationsClicked
         },
         'FrontrowPanel': {
            scope: me,
            griditemclicked: me.onGridItemClicked
         },
         'TvSeasonsGrid': {
            scope: me,
            griditemselected: me.onTvEpisodeSelected
         }
      });

      // listeners on this controller itself
      me.on('LoadDetailPanelContent', me.onLoadDetailPanelContent, me);
   },

   // --------------------------------------------------------------------------
   // event handlers : SearchToolbar + StatusToolbar + HistoryToolbar
   // --------------------------------------------------------------------------

   onSearchClicked: function (SearchField, Movies, Persons) {
      var me = this;
      var store = me.getSearchStore();

      var panel = me.getSearchPanel();
      panel.getLayout().setActiveItem(1);

      var proxy = store.getProxy();
      proxy.setExtraParams({
         search: SearchField.getValue(),
         chkMovies: true,
         chkPersons: true,
         chkTV: true
      });

      store.loadPage(1);
   },

   onResetSearchClicked: function (toolbar) {
      var me = this;
      me.getSearchStore().removeAll();
      // set checkboxes back on
      var chk = toolbar.query('checkboxfield');
      Ext.each(chk, function (obj, idx) {
         obj.setValue(true);
      });

      var panel = me.getSearchPanel();
      panel.getLayout().setActiveItem(1);
   },

   onSearchCheckboxClicked: function (checkbox, newValue, oldValue) {
      var me = this;
      var toolbar = me.getSearchToolbar();
      var chkMovies = toolbar.down('#chkMovies').getValue();
      var chkPeople = toolbar.down('#chkPeople').getValue();
      var chkTV = toolbar.down('#chkTV').getValue();
      var itemId = checkbox.itemId;

      var ResultGridToolbar = me.getResultGridToolbar();
      ResultGridToolbar.down('#' + itemId).setValue(newValue);

      var store = me.getSearchStore();
      store.clearFilter(true);
      // silent

      store.filter([{
         filterFn: function (item) {

            var types = [];
            if (chkMovies)
               types.push('M');
            if (chkPeople)
               types.push('P');
            if (chkTV)
               types.push('T');

            if (types.indexOf(item.get('type')) !== -1) {
               return item;
            }
         }
      }]);

      var panel = me.getSearchPanel();
      panel.getLayout().setActiveItem(1);

   },

   onBoxOfficeClicked: function () {
      var me = this;
      var panel = me.getDetailPanel();
      panel.getLayout().setActiveItem(0);

      me.getPersonsPopularStore().loadPage(1);

      panel = me.getSearchPanel();
      panel.getLayout().setActiveItem(0);

      me.getMoviesPopularStore().loadPage(1);

      panel = me.getContentPanel();
      panel.getLayout().setActiveItem(0);
   },

   onWorkClicked: function () {
      var me = this;
      var panel = me.getDetailPanel();
      panel.getLayout().setActiveItem(4);
   },

   onFeedbackClicked: function () {
      Ext.create('Movieworld.view.window.Feedback').show();
   },

   onCreditsClicked: function () {
      Ext.create('Movieworld.view.window.Credits').show();
   },

   onHistoryClicked: function (rec) {
      var me = this;
      me.onGridItemClicked('history', rec);
   },

   onClearHistoryClicked: function (rec) {
      var me = this;
      var History = me.getHistoryToolbar();
      History.ClearHistory();
   },

   // --------------------------------------------------------------------------
   // event handlers : Any Grid Item Clicked
   // --------------------------------------------------------------------------

   onTvEpisodeSelected: function (grid, record) {
      var me = this;

      var store = me.getContentStore();

      var proxy = store.getProxy();
      proxy.setExtraParams({
         id: record.get('tv_id'),
         season: record.get('season_number'),
         episode: record.get('episode_number'),
         type: 'E'
      });

      var resultsGrid = me.getContentResultsGrid();
      resultsGrid.down('#RoleToolbar').hide();

      store.loadPage(1);

   },

   onGridItemClicked: function (grid, record) {
      var me = this;

      var UpdateHistory = grid == 'history' ? false : true;

      var Id = record.get('id');
      var Type = record.get('type');

      me.fireEvent('LoadDetailPanelContent', Id, Type, UpdateHistory);

      var panel = me.getContentPanel();
      panel.getLayout().setActiveItem(1);

      var store = me.getContentStore();

      var proxy = store.getProxy();

      proxy.setExtraParams({
         id: Id,
         type: Type,
         role: 'A'
      });

      var resultsGrid = me.getContentResultsGrid();
      resultsGrid.down('#RoleSelecter').items.items[0].setValue(true);
      if (Type !== 'P') {
         resultsGrid.down('#RoleToolbar').hide();
      } else {
         resultsGrid.down('#RoleToolbar').show();
      }

      store.loadPage(1);
   },

   // --------------------------------------------------------------------------
   // events related to the people compare panel
   // --------------------------------------------------------------------------

   onAddToCompareClicked: function (record) {
      var me = this;
      var panel = me.getWorkPanel();
      panel.updatePersons(record);

   },

   // --------------------------------------------------------------------------
   // event handlers : ResultsGrid (checkboxes)
   // --------------------------------------------------------------------------

   onSearchGridCheckboxClicked: function (checkbox, newValue, oldValue) {

      var me = this;
      var toolbar = me.getSearchToolbar();

      var itemId = checkbox.itemId;
      toolbar.down('#' + itemId).setValue(newValue);

   },

   // --------------------------------------------------------------------------
   // event handlers : DetailPanel (panel)
   // --------------------------------------------------------------------------

   onLoadDetailPanelContent: function (id, type, UpdateHistory) {
      var me = this;
      var panel = me.getDetailPanel();

      if (typeof (UpdateHistory) == 'undefined') {
         UpdateHistory = true;
      }

      if (type == 'P') {
         var card = me.getDetailPersonCard();
         me.getPersonStore().loadPage(1, {
            params: {
               id: id
            },
            callback: function (records, operation, success) {
               panel.getLayout().setActiveItem(card);
               card.updatePersonContent(records);
               var History = me.getHistoryToolbar();
               var name = records[0].get('name');
               var record = records[0];
               if (UpdateHistory == true) {
                  History.UpdateHistory(name, 'P', record);
               }
            }
         });

      } else if (type == 'M') {
         card = me.getDetailMovieCard();
         me.getMovieStore().loadPage(1, {
            params: {
               id: id,
               type: type
            },
            callback: function (records, operation, success) {
               panel.getLayout().setActiveItem(card);
               // parent
               card.updateMovieContent(records);
               // child
               var History = me.getHistoryToolbar();
               var name = records[0].get('title');
               var record = records[0];
               if (UpdateHistory == true) {
                  History.UpdateHistory(name, 'M', record);
               }
            }
         });
      } else {
         card = me.getDetailTvCard();
         me.getTvStore().loadPage(1, {
            params: {
               id: id,
               type: type
            },
            callback: function (records, operation, success) {
               panel.getLayout().setActiveItem(card);
               // parent
               card.updateTvContent(records);
               // child
               var History = me.getHistoryToolbar();
               var name = records[0].get('title');
               var record = records[0];
               if (UpdateHistory == true) {
                  History.UpdateHistory(name, type, record);
               }
            }
         });
      }
   },

   onDetailHomepageClicked: function (button) {
      var page = button._Homepage;
      // abused the button a bit
      window.open(page, '_blank');
   },

   onDetailImdbClicked: function (button) {
      var page = 'http://www.imdb.com/title/' + button._imdb_id;
      window.open(page, '_blank');
   },

   onDetailTmdbClicked: function (button) {
      var type = button._type == 'M' ? 'movie' : (button._type == 'T' ? 'tv' : 'person');
      var page = 'http://www.themoviedb.org/' + type + '/' + button._tmdb_id;
      window.open(page, '_blank');
   },

   onDetailTvdbClicked: function (button) {
      var page = 'http://thetvdb.com/index.php?tab=series&id=' + button._tvdb_id;
      window.open(page, '_blank');
   },

   onDetailReleaseClicked: function (button) {
      var win = Ext.create('Movieworld.view.window.ReleaseInfo', {
         _movieId: button._movieId,
         _movieTitle: button._movieTitle,
         _movieThumb: button._movieThumb,
         _movieReleased: button._movieReleased
      }).show();
   },

   onTranslationsClicked: function (button) {
      var win = Ext.create('Movieworld.view.window.Translations', {
         _id: button._id,
         _name: button._name,
         _thumb: button._thumb,
         _first_air_date: button._first_air_date
      }).show();
   },

   onTrailerClicked: function (button) {

      // text
      // _service
      // _source
      // _size

      var width = 800;
      var height = 450;

      if (button._service == 'youtube') {
         var href = 'http://www.youtube.com/v/' + button._source + '&fs=1;autoplay=1';
         if (button._size == 'HD') {
            href = href + '&hd=1';
         }
         var type = 'swf';

         var win = Ext.create('videojsPlayerWindow', {
            title: button.text,
            width: width,
            height: height,
            items : [{
               xtype : 'videojsPlayerPanel',
               enableYoutube : true,
               video : href,
               autoPlayVideo : true,
               showUrlLoad : false,
               showPlaylist : false,
               showRecent : false
            }]
         }).show();

      } else {
         href = button._source;
         var content = '<object width="' + width + '" height="' + height + '" pluginspage="http://www.apple.com/quicktime/download" data="' + href + '" type="video/quicktime"><param name="autoplay" value="true"><param name="scale" value="tofit"><param name="controller" value="true"><param name="enablejavascript" value="true"><param name="src" value="' + href + '"><param name="loop" value="false"></object>';
         href = false;
         type = 'html';

         $.fancybox({
            'padding': 0,
            'autoScale': false,
            'transitionIn': 'none',
            'transitionOut': 'none',
            'title': button.text,
            'width': '70%',
            'height': '70%',
            'maxwidth': width,
            'maxheight': 800,
            'href': href,
            'type': type,
            'content': content,
            'swf': {
               'wmode': 'transparent',
               'allowfullscreen': 'true'
            }
         });

      }
   }
});