Ext.define('Movieworld.view.panel.MediaPanel', {
   extend: 'Ext.tab.Panel',
   requires: [
      'Ext.view.View',
      'Movieworld.view.toolbar.Download',
      'Movieworld.view.view.MediaDataview',
      'Movieworld.singleton.AppSettings'
   ],
   alias: 'widget.MediaPanel',
   title: 'Images',
   glyph: Glyphs.getGlyph('media'),
   split: true,
   collapsible: true,
   deferredRender: false,
   activeTab: 0,

   _sliderWidth: [],
   _sliderHeight: [],

   _store: false,

   initComponent: function () {
      var me = this;

      Ext.apply(me, {

         items: [{
            title: 'Backdrops',
            xtype: 'MediaDataview',
            itemId: 'MovieDetailBackdrops',
            title: 'Backdrops',
            _type: 'backdrops',
            _store: me._store.backdrop,
            listeners: {
               MediaItemClicked: {
                  fn: me.onMediaItemClicked,
                  scope: me
               }
            }
         }, {
            title: 'Posters',
            xtype: 'MediaDataview',
            itemId: 'MovieDetailPosters',
            _type: 'posters',
            _store: me._store.poster,
            listeners: {
               'MediaItemClicked': {
                  fn: me.onMediaItemClicked,
                  scope: me
               }
            }
         }],
         dockedItems: [{
            xtype: 'toolbar',
            itemId: 'SizeFilter',
            dock: 'top',
            padding: 10,
            items: [{
               fieldLabel: 'Minimal Width',
               xtype: 'multislider',
               itemId: 'SliderWidth',
               width: 400,
               values: [400, 1920],
               increment: 20,
               minValue: 0,
               maxValue: 2000,
               listeners: {
                  scope: me,
                  changecomplete: me.onSliderChanged,
                  afterrender: function (slider) {
                     me._sliderWidth = slider.getValues();
                  }
               }
            }, '-', {
               fieldLabel: 'Minimal Height',
               xtype: 'multislider',
               width: 400,
               itemId: 'SliderHeight',
               values: [400, 1080],
               increment: 20,
               minValue: 0,
               maxValue: 1100,
               listeners: {
                  scope: me,
                  buffer: 70,
                  changecomplete: me.onSliderChanged,
                  afterrender: function (slider) {
                     me._sliderHeight = slider.getValues();
                  }
               }
            }, '-', {
               xtype: 'button',
               text: 'Reset',
               listeners: {
                  scope: me,
                  click: me.onResetClicked
               }
            }]
         }, {
            xtype: 'DownloadToolbar',
            itemId: 'MovieDownloadTbar',
            dock: 'top',
            hidden: true
         }]

      });

      me.callParent(arguments);
   },
   hideDownloadTbar: function () {
      var me = this;
      var tbar = me.down('#MovieDownloadTbar');
      tbar.hide();
   },
   onMediaItemClicked: function (type, dataview, record, item) {
      var me = this;
      var tbar = me.down('#MovieDownloadTbar');
      var width = type === 'posters' ? 48 : 120;
      tbar.resetDownload();
      tbar.updateImage(record.get('file_w185'), 68, width);
      tbar.storeRecord(record, item);
      tbar.show();
   },

   onResetClicked: function () {
      var me = this;
      var sliders = me.query('multislider');
      Ext.each(sliders, function (s) {
         s.reset();
         if (s.getItemId() === 'SliderWidth') {
            me._sliderWidth = s.getValues();
         } else {
            me._sliderHeight = s.getValues();
         }
      }, me);

      var views = me.query('MediaDataview');
      Ext.each(views, function (view) {
         var store = view.getStore();
         store.clearFilter();
      });
   },

   onSliderChanged: function (slider, newValue) {
      var me = this;
      if (slider.getItemId() === 'SliderWidth') {
         me._sliderWidth = slider.getValues();
      } else {
         me._sliderHeight = slider.getValues();
      }

      var card = me.getActiveTab();
      var store = card.getStore();

      store.clearFilter(true);

      store.filter([{
         filterFn: function (item) {
            return (item.get("width") >= me._sliderWidth[0] && item.get("width") <= me._sliderWidth[1] && item.get("height") >= me._sliderHeight[0] && item.get("height") <= me._sliderHeight[1]
            );
         }
      }]);
   },

   LoadMediaDataViews: function (id, type) {
      var me = this;

      // clear the panels first
      var panel = me.query('MediaDataview');
      Ext.each(panel, function (item, idx) {
         item.update('');
      });

      var server = AppSettings.getServer();
      var url = type === 'M' ? server + 'movies/MovieMedia' : server + 'movies/TvMedia';
      Ext.Ajax.request({
         url: url,
         method: 'POST',
         params: {
            id: id,
            type: type
         },
         success: function (json) {
            var response = Ext.decode(json.responseText);

            var backdrops = me.down('#MovieDetailBackdrops');
            var posters = me.down('#MovieDetailPosters');

            if (response.records['posters']) {
               me.setActiveTab(posters);
               posters.LoadMedia(id, response.records['posters']);
               posters.enable();
            } else {
               posters.disable();
            }
            // backdrops
            if (response.records['backdrops']) {
               me.setActiveTab(backdrops);
               backdrops.LoadMedia(id, response.records['backdrops']);
               backdrops.enable();
            } else {
               backdrops.disable();
            }

            if (!response.records['backdrops'] && !response.records['posters']) {
               me.disable(); // disable the media panel
            } else {
               me.enable();  // enable the media panel
            }

            me.fireEvent('loadtrailers', response.records['trailers']);

         }
      });
   }
});
