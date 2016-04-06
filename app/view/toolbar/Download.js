Ext.define('Movieworld.view.toolbar.Download', {
   requires: ['Movieworld.singleton.AppSettings'],
   extend: 'Ext.toolbar.Toolbar',
   alias: 'widget.DownloadToolbar',
   height: 74,
   initComponent: function () {
      var me = this;

      var body = Ext.getBody();

      Ext.apply(me, {
         items: [{
            xtype: 'container',
            itemId: 'image',
            maxHeight: 68,
            listeners: {
               scope: me,
               el: {
                  click: function () {
                     me.viewImage();
                  }
               }
            }
         }, '-', {
            text: 'View',
            glyph: Glyphs.getGlyph('eye'),
            scope: me,
            handler: function (btn, e) {
               me.viewImage();
            }
         }, {
            text: 'Download',
            glyph: Glyphs.getGlyph('download'),
            scope: me,
            handler: function (btn, e) {
               me.downloadClicked();
            }
         }, {
            xtype: 'container',
            itemId: 'DownloadButtons',
            defaults: {
               scope: me,
               margin: '0 0 0 10'
            },
            items: []
         }, '->', {
            glyph: Glyphs.getGlyph('hide_up'),
            tooltip: 'Collapse',
            scope: me,
            handler: function (btn, e) {
               me.hide();
            }
         }]
      });
      this.callParent();
   },
   storeRecord: function (record, item) {
      this._record = record;
      this._item = item;
   },
   updateImage: function (url, height, width) {
      var image = this.down('#image');
      image.update('<div class="image-holder"><img src="' + url + '"></img></div>');
      image.setHeight(height);
      image.setWidth(width);
      image.updateLayout();
   },
   viewImage: function () {
      $.fancybox({
         'padding': 5,
         'href': this._record.get('file_h632'),
         'transitionIn': 'elastic',
         'transitionOut': 'elastic',
         'autoScale': true,
         'titlePosition': 'outside',
         'titleCorrection': true, // this is a hack
         'overlayShow': true
      });
   },
   resetDownload: function () {
      var resolutions = this.down('container#DownloadButtons');
      resolutions.removeAll();
   },
   downloadClicked: function () {
      var me = this;
      var record = this._record;
      var resolutions = this.down('container#DownloadButtons');
      resolutions.removeAll();

      var images = {};

      Ext.iterate(record.data, function (item, value) {
         if (item.indexOf("w185") !== -1) {
            images['small'] = value;
         } else if (item.indexOf("h632") !== -1) {
            images['medium'] = value;
         } else if (item.indexOf("original") !== -1) {
            images['large'] = value;
         }
      });

      if (images) {
         resolutions.add({
            xtype: 'tbfill',
            margin: '0 0 0 20'
         });
      }

      if (images['small']) {
         resolutions.add({
            xtype: 'button',
            text: 'small',
            _href: images['small'],
            handler: me.onDownloadClicked
         });
      }

      if (images['medium']) {
         resolutions.add({
            xtype: 'button',
            text: 'medium',
            _href: images['medium'],
            handler: me.onDownloadClicked
         });
      }

      if (images['large']) {
         resolutions.add({
            xtype: 'button',
            text: 'large',
            _href: images['large'],
            handler: me.onDownloadClicked
         });
      }

   },
   onDownloadClicked: function (b) {
      var baseUrl = 'http://' + document.domain;
      if (location.port !== '') {
         baseUrl += ':' + location.port;
      }
      var serverUrl = AppSettings.getServer() + 'movies/DownLoadImage';
      var submitUrl = baseUrl + serverUrl;

      var params = {
         url: b._href // extra param on the button
      };

      this.jqdownload(submitUrl, params);
   },
   jqdownload: function (url, params) {
      if (url && params) {
         params = typeof params === 'string' ? params : $.param(params);
         var inputs = '';
         $.each(params.split('&'), function () {
            var pair = this.split('=');
            inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
         });
         $('<form action="' + url + '" method="POST">' + inputs + '</form>').appendTo('body').submit().remove();
      }
   }
}); 