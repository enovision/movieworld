Ext.define('Movieworld.view.grid.TvSeasons', {
   extend: 'Ext.grid.Panel',
   requires: ['Movieworld.singleton.Toolbox'],
   alias: 'widget.TvSeasonsGrid',
   title: 'Seasons',
   border: true,
   cls: 'seasons grid',

   _tvID: false,
   _season: false,

   initComponent: function () {
      var me = this;

      function renderThumb(val, meta, record) {
         if (val.length > 0) {
            return '<img src="' + val + '"</img>';
         } else {
            return '&nbsp';
         }
      }

      var comboStore = Ext.create('Ext.data.Store', {
         fields: ['air_date', 'season_number', 'poster_w92']
      });

      Ext.apply(me, {
         store: Ext.StoreManager.lookup('TvSeason'),
         columns: [{
            text: "#",
            width: 30,
            dataIndex: 'episode_number'
         }, {
            text: "&nbsp;",
            width: 120,
            dataIndex: 'still_w92',
            renderer: renderThumb
         }, {
            text: "Aired",
            width: 100,
            dataIndex: 'air_date'
         }, {
            text: "Overview",
            xtype: 'templatecolumn',
            flex: 1,
            tpl: new Ext.XTemplate(
               '<div class="seasons item {[this.getResClass()]}">',
               '<div class="seasons wrap {[this.getVisible(values.name, values.overview)]}">',
               '<div class="name">{name}</div>',
               '<div class="overview">{overview}</div>',
               '</div>',
               '</div>',
               {
                  getResClass: function () {
                     var c = Toolbox.getResolutionClass();
                     return c;
                  },
                  getVisible: function (name, overview) {
                     if (name === '' && overview === '')
                        return 'hidden';
                     return '';
                  }
               })
         }],
         dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            itemId: 'SeasonsToolbar',
            items: [{
               xtype: 'combo',
               fieldLabel: 'Season',
               store: comboStore,
               queryMode: 'local',
               displayField: 'season_number',
               valueField: 'season_number',
               listeners: {
                  scope: me,
                  change: me.onSeasonChange
               }
            }]
         }],
         viewConfig: {
            style: {
               overflow: 'auto',
               overflowX: 'hidden'
            }
         },
         //selModel : Ext.create('Ext.selection.CellModel', {
         //}),
         listeners: {
            scope: me,
            beforecellclick: function (grid, td, cellIndex, record) {

               // below works, but there is no content, so I put it off for
               // now
               // --> this.fireEvent('griditemselected', grid, record);

               if (cellIndex !== 1)
                  return false;
            },
            cellclick: me.onCellSelected
         }
      });

      me.callParent(arguments);

      me.on('resize', function () {
         Toolbox.BrowserResize('.seasons.item');
      }, me);
   },

   LoadSeasons: function (seasons) {
      var combo = this.down('combo');
      var store = combo.store;

      store.removeAll();

      Ext.each(seasons, function (season) {
         store.add(season);
      }, this);

      combo.suspendEvents();
      combo.setValue(seasons[0].season_number);
      combo.resumeEvents();

   },

   LoadEpisodes: function (tvId, Season, allSeasons) {
      var me = this;
      me._tvId = tvId;

      if (me._season === false) {
         me.LoadSeasons(allSeasons);
      }

      me._season = Season;

      var store = this.getStore();

      store.getProxy().setExtraParams({
         id: tvId,
         season: Season
      });

      store.loadPage(1, {
         scope: me,
         callback: function (records, operation, success) {
            if (records.length === 0) {
               me.setDisabled(true);
            } else {
               me.setDisabled(false);
            }
         }
      });
   },

   onSeasonChange: function (combo, newValue) {
      this.LoadEpisodes(this._tvId, newValue);
   },

   onCellSelected: function (grid, td, column, record) {
      // if thumbnail clicked then show bigger one

      if (column === 1 && record.get('still_original')) {
         $.fancybox({
            'padding': 5,
            'href': record.get('still_original'),
            'transitionIn': 'elastic',
            'transitionOut': 'elastic',
            'width': '70%',
            'height': '70%',
            'autoScale': true,
            'titlePosition': 'outside',
            'titleCorrection': true, // this is a hack
            'overlayShow': true
         });
      }
   }
});
