/**
 * @class Ext.ux.panel.videoPlayer
 * @alias widget.videojsPanelPlayer
 * @alternateClassName videojsPlayerPanel
 * Videoplayer for Ext JS 4, based on the videojs player.
 * Link to videoplayer: http://www.videojs.com/
 * Version 0.1
 * @author  J.J. van de Merwe
 * http://www.enovision.net
 *
 */

Ext.define('Ext.ux.videojs.videojsPlayer', {
   extend: 'Ext.panel.Panel',
   requires: [
      'Ext.form.field.Display', 'Ext.slider.Single', 'Ext.form.Label',
      'Ext.window.MessageBox', 'Ext.resizer.Splitter', 'Ext.data.proxy.LocalStorage',
      'Ext.data.Model', 'Ext.data.Store'
   ],
   alternateClassName: ['videojsPlayerPanel'],
   alias: 'widget.videojsPlayerPanel',
   bodyCls: 'videojs videojspanel',
   layout: {
      type: 'fit'
   },
   /**
    * Supported extensions for this player
    * @private
    * @cfg {Array} supportedXtensions
    * Currently loaded video
    */
   supportedXtensions: ['webm', 'mp4', 'ogg', 'wmv'],
   /**
    * @private
    * @cfg {Object/Boolean} [currentVideo=false]
    * Currently loaded video
    */
   currentVideo: false,
   /**
    * @private
    * @cfg {Object/Boolean} [currentTrack=false]
    * Currently loaded track
    */
   currentTrack: false,
   /**
    * Background color of the video body
    * @private
    * @cfg {String} [bodyBackgroundColor='#000']
    */
   bodyBackgroundColor: '#000',
   /**
    * @private
    * @cfg {Boolean} [errorFlag=true]
    * Dynamically changing when trying to play a video
    */
   errorFlag: true, /* this changes to false if video can be played */
   /**
    * @private
    * @cfg {Object} config
    * Smart references to FontAwesome characters
    */
   config: {
      /**
       * Glyph for the Play Button
       */
      'play': 'xf04b@FontAwesome',
      /**
       * Glyph for the Pause Button
       */
      'pause': 'xf04c@FontAwesome',
      /**
       * Glyph for the Stop Button
       */
      'stop': 'xf04d@FontAwesome',
      /**
       * Glyph for the Fullscreen Button
       */
      'fullScreen': 'xf065@FontAwesome',
      /**
       * Glyph for the Repeat/Replay Button
       */
      'repeat': 'xf021@FontAwesome',
      /**
       * Glyph for the Mute (volume off) Button
       */
      'volumeOff': 'xf026@FontAwesome',
      /**
       * Glyph for the Volume (on) Button
       */
      'volumeOn': 'xf028@FontAwesome',
      /**
       * Glyph for the URL Load Button
       */
      'urlLoad': 'xf07b@FontAwesome',
      /**
       * Glyph for the Recently Played Button
       */
      'recent': 'xf022@FontAwesome',
      /**
       * Glyph for the Playlist Button
       */
      'playlist': 'xf001@FontAwesome',
      /**
       * Glyph for Closed Caption
       */
      'cC': 'xf20a@FontAwesome'
   },
   /**
    * @hidden
    * @cfg {Object} options
    * Default options for the videojs videoplayer API

    *
    * Values:
    *   +  controls enable the events of the control bar (default: true)
    *   +  ytcontrols enable the youtube controls (default: false)
    *   +  autoplay only works on PC's not on iPad (default: false)
    *   +  preload possible values 'auto', 'meta', 'none' (default: 'auto')
    *   +  poster load a poster by default on the player (default: '')
    *   +  loop (default: false)
    *   +  width (default: 'auto')
    *   +  height (default: 'auto')
    *   +  techOrder: (default: ["html5", "flash"])
    *
    */
   options: {
      controls: true,
      ytcontrols: false,
      autoplay: false,
      preload: 'auto',
      poster: '',
      loop: false,
      width: 'auto',
      height: 'auto',
      techOrder: ['html5', 'flash', 'youtube', 'vimeo']
   },
   /**
    * @cfg {Number} [initVolume=0.2]
    * Initial volume level, between 0 and 1, with increments of 0.1
    */
   initVolume: 0.2,
   /**
    * @cfg {Boolean} [autoPlayVideo=true]
    * `true` to play loaded video automatically, `false` to just load it.
    */
   autoPlayVideo: true,
   /**
    * @cfg {Boolean} [autoLoadVideo=true]
    * `true` to load the first video of a playlist automatically.
    */
   autoLoadVideo: true,
   /**
    * @cfg {Boolean} [enableYoutube=false]
    * `true` to make the player a Youtube player.
    */
   enableYoutube: false,
   /*
    * @cfg {Boolean/Object} tracks
    * See {@link #videos} for more information
    */
   tracks: false,
   /**
    * @cfg {Boolean/String} [video=false]
    * url of a video to be loaded, use the
    *
    */
   video: false,
   /**
    * @cfg {Boolean/Array} videos
    * Object of the videos initially loaded
    *
    * The videos Array contains of objects that contain information about
    * the videos to be loaded.
    *
    *   + title  [required]
    *     (String) General title of the video that shows up in the playlist
    * combobox
    *   + src  [required]
    *     (Array) Array of objects with the 'type' and 'src' elements, see
    * sample below
    *     Sources can be local or remote, remote play success depends on the
    *     remote external site
    *     It is required to have at least one 'src' object declared
    *   + poster
    *     (String) Link to the image that will show up as a poster when the
    * video is loaded
    *   + tracks
    *     (Array) Array of objects that describe the textTracks that will be
    * loaded
    *      with the video. It is not required to declare the 'tracks' array in
    * the 'videos'
    *      array, when no tracks available, leave this element away.
    *
    * Tracks configuration per object in the 'tracks' array:
    *
    *   + kind [required]
    *     (String) possible values:
    *     + 'subtitles'
    *     + 'captions'
    *     + 'chapters'
    *   + id
    *     (String) Unique id for the track
    *   + src  [required]
    *     (String) URL to the .vtt file, see example below
    *   + srcLang  [required]
    *     (String) 2 character ISO code for language f.e. 'en', 'de', 'nl'
    *   + label
    *     (String) descriptive text description, like 'English Instruction'
    *   + language
    *     (String) descriptive language description like f.e. 'Dutch', 'English'
    *
    *
    * # Example usage
    *
    *     @example
    *         videos : [{
     *    			 title : 'Instruction Video',
     *			     src : [{
     * 	        		  'type' : 'video/mp4',
     *		              'src' : 'http://www.example.com/movie.mp4'
     *			     }, {
     *      		      'type' : 'video/webm',
     *			          'src' : 'http://www.example.com/movie.webm'
     *     			 }, {
     *            		  'type' : 'video/ogg',
     *		              'src' : 'http://www.example.com/movie.ogg'
     *			     }],
     *			     poster : 'http://example.com/thumbs/movieposter.jpg',
     * 			     tracks : [{
     *                    kind : 'subtitles',
     *			          id : 'englishtrack',
     *            		  src : 'http://www.example.com/captions.vtt',
     *            		  srcLang : 'en',
     *            		  language : 'English',
     *            		  label : 'English'
     *     			 }, {
     *            		  kind : 'subtitles',
     *            		  id : 'germantrack',
     *            		  src : 'http://www.example.com/de-captions.vtt',
     *            		  srcLang : 'en',
     *            		  language : 'German',
     *            		  label : 'German'
     *     			 }, {
     *            		  kind : 'captions',
     *            		  id : 'speakertrack',
     *            		  src : 'http://www.example.com/speakers.vtt',
     *            		  srcLang : 'en',
     *            		  language : 'English',
     *            		  label : 'Speakers'
     *               }]
     * 			}, {
     *    			 title : 'Local Instruction Video',
     * 			     src : [{
     *                    'type' : 'video/mp4',
     * 		              'src' : '/video/movie-2.mp4'
     *    			 }, {
     *            		  'type' : 'video/webm',
     *            		  'src' : '/video/video-2.webm'
     *    			 }, {
     *            		  'type' : 'video/wmv',
     *            		  'src' : '/video/movie-2.wmv'
     *    			 }],
     *    			 poster : '/video/video-2-poster.jpg',
     *				 tracks : [{
     *                    kind : 'captions',
     *		              id : 'englishtrack',
     *       		      src : '/video/captions.vtt',
     *            		  srcLang : 'en',
     *       		      language : 'English',
     *            		  label : 'Captions'
     *    			}]
     * 	        }]
    *
    */
   videos: false,
   /**
    * @cfg {Boolean} [showUrlLoad=true]
    * Show the load URL button on the panel, 'true' when yes, 'false' when no
    * set to 'false' when the player is used for showing only one video at a
    * time
    */
   showUrlLoad: true,
   /**
    * @cfg {Boolean} [showPlaylist=true]
    * Show the playlist button on the panel, 'true' when yes, 'false' when no
    * set to 'false' when the player is used for showing only one video at a
    * time
    */
   showPlaylist: true,
   /**
    * @cfg {Boolean} [showRecent=true]
    * Show the recently played button on the panel, 'true' when yes, 'false'
    * when no
    * set to 'false' when the player is used for showing only one video at a
    * time
    */
   showRecent: true,

   initComponent: function (config) {
      var me = this;

      me.initConfig(config);

      if (me.autoPlayVideo) {
         me.options.autoplay = true;
      }

      if (me.enableYoutube) {
         delete me.options.techOrder;
         me.options['techOrder'] = ['youtube'];
      }

      Ext.apply(me, {
         currentVolume: me.initVolume,
         bodyStyle: {
            background: me.bodyBackgroundColor
         },
         html: '<video controls class="vjs-default-skin"></video>',
         dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            defaults: {
               xtype: 'button'
            },
            items: [{
               glyph: me.getPlay(), /* play */
               glyphPlay: me.getPlay(),
               glyphPause: me.getPause(),
               tooltip: 'Click to Play',
               enableToggle: true,
               itemId: 'btnPlay',
               listeners: {
                  scope: me,
                  toggle: me.onPlayClicked
               }
            }, {
               glyph: me.getStop(), /* stop */
               itemId: 'btnStop',
               listeners: {
                  scope: me,
                  click: me.onStopClicked
               }
            }, {
               xtype: 'splitter',
               hidden: me.showPlaylist || me.showUrlLoad || me.showRecent ? false : true
            }, {
               xtype: 'container',
               hidden: me.showPlaylist || me.showUrlLoad || me.showRecent ? false : true,
               defaults: {
                  xtype: 'button',
                  cls: 'x-btn-default-toolbar-small',
                  margin: '0 10 0 0'
               },
               items: [{
                  glyph: me.getUrlLoad(), /* stop */
                  hidden: me.showUrlLoad ? false : true,
                  tooltip: 'Open URL',
                  listeners: {
                     scope: me,
                     click: me.onUrlLoadClicked
                  }
               }, {
                  glyph: me.getRecent(), /* stop */
                  itemId: 'RecentPlayed',
                  disabled: true,
                  hidden: me.showRecent ? false : true,
                  tooltip: 'Recently played',
                  menu: Ext.create('Ext.menu.Menu', {
                     itemId: 'RecentMenu',
                     items: [{
                        text: 'Clear list',
                        deleteMe: false,
                        scope: me,
                        handler: me.clearRecent
                     }, '-']
                  })
               }, {
                  glyph: me.getPlaylist(), /* stop */
                  tooltip: 'Playlist',
                  disabled: true,
                  itemId: 'Playlist',
                  hidden: me.showPlaylist ? false : true,
                  menu: Ext.create('Ext.menu.Menu', {
                     itemId: 'PlaylistMenu'
                  })
               }]
            }, '->', {
               /* glyph : me.getCc(), */
               glyph: me.getCC(),
               tooltip: 'CC',
               itemId: 'btnSubtitles',
               hidden: true,
               //enableToggle : true,
               menu: Ext.create('Ext.menu.Menu', {
                  itemId: 'CaptionsMenu',
                  items: [{
                     text: 'Off',
                     deleteMe: false,
                     scope: me,
                     handler: function (btn) {
                        me.loadTrack(-1);
                     }
                  }, '-']
               })
            }, {
               glyph: me.getFullScreen(), /* stop */
               tooltip: 'Fullscreen',
               listeners: {
                  scope: me,
                  click: me.onFullScreenClicked
               }
            }]
         }, {
            xtype: 'toolbar',
            dock: 'bottom',
            items: [{
               xtype: 'displayfield',
               itemId: 'tPlayed',
               width: 40,
               value: me.format(0)
            }, {
               xtype: 'slider',
               itemId: 'pSlider',
               flex: 1,
               minValue: 0,
               increment: 1, /* seconds */
               value: 0,
               tipText: function (thumb) {
                  return me.format(thumb.value);
               },
               listeners: {
                  scope: me,
                  dragstart: me.onPauseVideo,
                  drag: me.onProgressDrag,
                  dragend: me.onPlayClicked
               }
            }, {
               xtype: 'displayfield',
               itemId: 'tTotal',
               width: 40,
               value: me.format(0)
            }, {
               glyph: me.getVolumeOff(), /* mute */
               listeners: {
                  scope: me,
                  click: me.onMuteClicked
               }
            }, {
               xtype: 'slider',
               itemId: 'vSlider',
               minValue: 0,
               increment: 1,
               maxValue: 10,
               flex: .3,
               labelWidth: 40,
               value: me.initVolume * 10,
               listeners: {
                  scope: me,
                  drag: me.onVolumeChange,
                  dragend: me.onVolumeChanged
               }
            }, {
               glyph: me.getVolumeOn(), /* mute off */
               listeners: {
                  scope: me,
                  click: me.onMuteOffClicked
               }
            }]
         }]
      });

      me.callParent(arguments);

      me.on('beforedestroy', function () {
         /* destroy the videojs object */
         me.videojs.dispose();
      }, me);

      me.on('afterrender', me.onAfterRender, me);

   },

   onAfterRender: function () {
      var me = this;

      /* disable browser context menu */
      /* Ext.getBody().on("contextmenu", Ext.emptyFn, null,
       * {preventDefault: true}); */

      me.down('#pSlider').el.on('click', me.onProgressSliderClicked, me);
      me.down('#vSlider').el.on('click', me.onVolumeSliderClicked, me);
      me.loadApi();
   },

   /**
    * Clears the recently played videos menu/store
    * @param {Object} btn Clear Recent Button
    */
   clearRecent: function (btn) {
      var me = this;
      var menu = this.query('#RecentMenu menuitem');
      me.recentStore.removeAll();
      me.recentStore.sync();
      Ext.each(menu, function (item, idx) {
         if (typeof item.deleteMe === 'undefined' && item.xtype === 'menuitem') {
            item.destroy();
         }
      }, me);

      me.down('#RecentPlayed').disable();
   },
   /**
    * Initializes the videojs API and loads requested videos
    * @private
    */
   loadApi: function () {
      var me = this;
      /* get the <video> element */
      var el = me.body.dom.firstChild;

      var vj = videojs(el, me.options);
      vj.ready(function () {
         me.videojs = this;
         me.initStores();
         /* hide the big play button */
         this.bigPlayButton.hide();
         /* hide the loading spinner */
         this.loadingSpinner.hide();
         /* setoff the player controls by default */
         this.controls(false);
         /* add a class to make things responsible working */
         this.addClass('vjs-video-wrapper');
         /* scope this = videojs player */
         me.videojsReady = true, me.bindEvents();
         /* set volume */
         this.volume(me.initVolume);
         /* if video is passed then load it here */
         if (me.videos || me.video) {
            me.loadVideoStore();
         }
      });
   },
   /**
    * Initiate the used stores
    */
   initStores: function () {
      var me = this;

      Ext.applyIf(me, {

         playlistStore: Ext.create('Ext.data.Store', {
            fields: ['id', 'src', 'tracks', 'poster'],
            proxy: {
               type: 'memory',
               id: 'vjPlaylist'
            }
         })
      });

      if (Ext.supports.LocalStorage) {

         /* localstorage recent items */
         Ext.applyIf(me, {
            recentStore: Ext.create('Ext.data.Store', {
               fields: ['id', 'video'],
               proxy: {
                  type: 'localstorage',
                  id: 'vjRecent'
               }
            })
         });

         me.recentStore.load({
            scope: me,
            callback: me.loadRecent
         });
      }
   },
   /**
    * Loads the recently played videos from Localstorage
    * @param {Ext.data.Model} records Recent records from local storage
    * @param {Object} operation
    * @param {Object} success
    */
   loadRecent: function (records, operation, success) {
      var me = this;
      if (records.length > 0) {
         Ext.each(records, function (record, idx) {
            var v = record.get('video');
            var r = Ext.isString(v) ? Ext.decode(v) : v;
            me.addRecentItem(r.video, r.poster, r.tracks);
         }, me);
         me.down('#RecentPlayed').enable();
      }
   },

   /**
    * Loads the requested video(s)
    * @private
    * @return {Boolean}
    */
   loadVideoStore: function () {
      var me = this;
      var vj = me.videojs;
      var menu = me.down('#Playlist').menu;

      if (Ext.isArray(me.videos)) {

         Ext.each(me.videos, function (video) {
            if (video.hasOwnProperty('src')) {
               me.playlistStore.add({
                  src: video.src, // src is obligated !!!
                  poster: video.hasOwnProperty('poster') ? video.poster : false,
                  tracks: video.hasOwnProperty('tracks') ? video.tracks : false
               });

               menu.add({
                  text: video.title,
                  scope: me,
                  handler: function (btn) {
                     me.loadPlaylistVideo(record);
                  }
               });

            }
         });

         if (me.autoLoadVideo) {
            var first = me.playlistStore.first();
            if (typeof (first) !== 'undefined') {
               me.loadPlaylistVideo(first, me.autoPlayVideo);
               me.down('#Playlist').enable();
               /* TODO, don't show when only 1 video */
            }
         }

      } else {
         if (Ext.isString(me.video)) {
            me.resetPlayer(me.video, me.poster, me.track || false);
         } else {
            return false;
         }
      }
   },

   /**
    * Bind the videojs player events to functions in this panel
    * @private
    */
   bindEvents: function () {
      var me = this;
      var vj = me.videojs;
      //@formatter:off
      /* Fired when the duration of the media resource is first known or changed */
      vj.on('durationchange', function () {
         me.onVideojsDurationChange();
      });
      /* Fired when the end of the media resource is reached (currentTime == duration) */
      vj.on('ended', function () {
         me.onVideojsEnded();
      });
      /* Fired when the loaded file can't be played */
      vj.on('notsupported', function () {
         me.onVideojsNotSupported();
      });
      /* Fired when there is an error in playback */
      vj.on('error', function (e) {
         me.onVideojsError();
      });
      /* Fired the first time a video is played */
      vj.on('firstplay', Ext.emptyFn);
      /* Fired when the player switches in or out of fullscreen mode */
      vj.on('fullscreenchange', function () {
         me.onVideojsFullScreenChange();
      });
      /* Fired when the player has finished downloading the source data */
      vj.on('loadedalldata', Ext.emptyFn);
      /* Fired when the player has downloaded data at the current playback position */
      vj.on('loadeddata', Ext.emptyFn);
      /* Fired when the player has initial duration and dimension information */
      vj.on('loadedmetadata', function () {
         me.onVideojsLoadedMetaData();
      });
      /* Fired when the user agent begins looking for media data */
      vj.on('loadstart', Ext.emptyFn);
      /* Fired whenever the media has been paused */
      vj.on('pause', function () {
         me.onVideojsPause();
      });
      /* Fired whenever the media begins or resumes playback */
      vj.on('play', function () {
         me.onVideojsPlay();
      });
      /* Fired while the user agent is downloading media data */
      vj.on('progress', Ext.emptyFn);
      /* Fired when the current playback position has changed */
      vj.on('timeupdate', function () {
         me.onVideojsTimeUpdate();
      });
      /* Fired when the volume changes */
      vj.on('volumechange', Ext.emptyFn);
      /* Fired when the video is resized */
      vj.on('resize', Ext.emptyFn);
      //@formatter:off
   },
   /**
    * Simple error routine that shows an error when the player can't play
    * a requested or loaded video
    * @private
    */
   onVideojsError: function () {
      this.errorFlag = true;
      Ext.MessageBox.show({
         title: 'Playing error',
         msg: 'The video with this URL can\'t be played, try another one',
         buttons: Ext.MessageBox.OK,
         icon: Ext.MessageBox.ERROR
      });
   },
   /**
    * Executed when a loaded file is not supported
    * @private
    * @param {String} message
    *
    */
   onVideojsNotSupported: function (message) {
      /* pause any video currently playing */
      var vj = this.videojs.pause();
   },
   /**
    * Executed after videojs pause buttons has been clicked
    * @private
    */
   onVideojsPause: function () {
      /*this.onPlayClicked('videojs', false, true); */
   },
   /**
    * Executed after videojs play buttons has been clicked
    * @private
    */
   onVideojsPlay: function () {
      /* this.onPlayClicked('videojs', true, true); */
   },
   /**
    * Executed after videojs has loaded the metadata of a video
    * @private
    */
   onVideojsLoadedMetaData: function () {
      this.errorFlag = false;
      var v = this.currentVideo;
      this.addRecentItem(v.video, v.poster, v.tracks);
   },
   /**
    * Executed when the fullscreen state of videojs has changed
    * @private
    */
   onVideojsFullScreenChange: function () {
      var me = this;
      var vj = me.videojs;
      if (vj.isFullScreen() === true) {
         vj.controls(true);
         /* set player controls off */
      } else {
         vj.controls(false);
         /* set player controls off */
      }
   },
   /**
    * Executed when the duration value of a video changes
    * @private
    */
   onVideojsDurationChange: function () {
      var me = this;
      var duration = me.videojs.duration();
      me.down('#pSlider').setMaxValue(duration);
      me.down('#tTotal').setValue(me.format(duration));
   },

   /**
    * Executed when the videojs API sends back an update of the playing
    * time
    * @private
    */
   onVideojsTimeUpdate: function () {
      var me = this;
      var s = me.down('#pSlider');
      if (s.dragging === false) {
         var time = me.videojs.currentTime();
         s.setValue(time);
         me.down('#tPlayed').setValue(me.format(time));
      }
      ;
   },
   /**
    * Executed when the videojs API has changed the volume value
    * @private
    */
   onVideojsVolumeChange: function () {
      var me = this;
      var s = me.down('#vSlider');
      if (s.dragging === false) {
         /* somehow muted() doesn't set the volume to 0 */
         var volume = me.videojs.muted() ? 0 : me.videojs.volume();
         // s.setValue(volume);
      }
   },
   /**
    * Executes when the user clicks the 'stop video' button
    */
   onVideojsEnded: function () {
      var me = this;
      var vj = me.videojs;
      vj.bigPlayButton.hide();
      this.resetPlayer(vj.currentSrc(), vj.poster(), vj.textTracks() || false);
   },

   /* event handling panel */

   /**
    * Executed when the user clicks on the 'Open URL' button
    * @private
    */
   onUrlLoadClicked: function () {
      Ext.MessageBox.prompt('Load video', 'URL:', this.loadVideo, this);
   },
   /**
    * Video Loader
    * Returns false if video can't be loaded
    * @private
    * @param {Object} Button
    * @param {String} Url to video
    * @return {Boolean}
    */
   loadVideo: function (btn, url) {
      var me = this;

      if (btn !== 'ok' && btn !== 'recent') {
         return false;
      }

      if (me.getVideoType(url) === false) {
         /* show an error */
         me.onVideojsError();
         return false;
      }

      var video = [{
         src: url,
         type: me.getVideoType(url)
      }];

      /* no captions (yet) when url is directly loaded */
      me.down('#btnSubtitles').hide();

      /* play the video automatically */
      me.resetPlayer(video, false, false, true);

   },
   /**
    * Executed when the user clicks on the playing time slider
    * @param {Object} Event
    */
   onProgressSliderClicked: function (e) {
      var me = this;
      var vj = me.videojs;
      var slider = me.down('#pSlider');
      vj.pause();
      var newValue = slider.getValue();
      vj.currentTime(newValue);
      me.down('#tPlayed').setValue(me.format(newValue));
      vj.play();
   },
   /**
    * Executes when the user drags the time slider
    * @param {Object} slider Time Slider
    */
   onProgressDrag: function (slider) {
      var me = this;
      var newValue = slider.getValue();
      me.videojs.currentTime(newValue);
      me.down('#tPlayed').setValue(me.format(newValue));
   },
   /**
    * Executes when the user clicks on the 'play/resume' button
    * @param {Object} Button
    * @param {Boolean} pressed
    * @param {Boolean} noevent
    */
   onPlayClicked: function (b, pressed) {
      if (b === 'videojs') {
         b = this.down('#btnPlay');
         b.pressed = pressed;
      }

      if (b.getXType() === 'button') {
         if (pressed) {
            this.videojs.play();
            b.setGlyph(b.glyphPause).setTooltip('Click to Pause');
         } else {
            this.videojs.pause();
            b.setGlyph(b.glyphPlay).setTooltip('Click to Resume');
         }
      }
   },
   /**
    * Executes when the user clicks on the 'stop' button
    * @param {Object} Button
    * @param {Boolean} pressed
    */
   onStopClicked: function (b) {
      var vj = this.videojs;
      vj.trigger('ended');
   },
   /**
    * Executes when the user clicks on the 'pause' button
    * @param {Object} Button
    * @param {Object} Event
    */
   onPauseVideo: function (b, e) {
      this.videojs.pause();
   },
   /**
    * Executes when the user clicks on the 'cc' or 'subtitles' button
    * @param {Object} Button
    * @param {Boolean} pressed
    */
   onSubtitlesClicked: function (b, pressed) {
      var me = this;
      var vj = me.videojs;
      var track = vj.textTracks()[0];
      if (pressed) {
         track.show();
      } else {
         track.hide();
      }
   },
   /**
    * Executed after the user has clicked on the fullscreen button
    * @private
    */
   onFullScreenClicked: function () {
      var vj = this.videojs;
      if (vj.paused()) {
         vj.play();
      }
      vj.requestFullScreen();
   },
   /**
    * Executes when the user clicks on the volume slider
    * @param {Object} Event
    */
   onVolumeSliderClicked: function (e) {
      var me = this;
      var slider = me.down('#vSlider');
      me.onVolumeChange(slider);
   },
   /**
    * Called when the volume has changed
    * @private
    * @param {Object} Volumeslider
    */
   onVolumeChange: function (slider) {
      var newValue = slider.getValue();
      this.videojs.muted(false);
      this.videojs.volume(newValue / 10);
   },
   /**
    * Executes after the volume change is complete after dragging
    * @private
    * @param {Object} Volumeslider
    */
   onVolumeChanged: function (slider) {
      this.videojs.muted(false);
      this.currentVolume = slider.getValue() / 10;
   },
   /**
    * Executed when the user clicks on the 'mute' button
    * @param {Object} Button
    * @param {Object} Event
    */
   onMuteClicked: function (b, e) {
      this.videojs.muted(true);
      this.down('#vSlider').setValue(0, false);
   },
   /**
    * Executed when the user clicks on the 'mute off' button
    * The volume is restored to the last known volume before
    * clicking the mute button
    * @param {Object} Button
    * @param {Object} Event
    */
   onMuteOffClicked: function (b, e) {
      this.videojs.muted(false);
      this.down('#vSlider').setValue(this.currentVolume * 10);
   },
   /**
    * Video loader from a playlist
    * @private
    * @param {Object} record Ext.model.Model
    * @param {Boolean} autoPlay overrides the autoPlay on first video
    */
   loadPlaylistVideo: function (record, autoPlay) {
      var me = this;
      var autoPlay = typeof(autoPlay) === 'undefined' ? true : autoPlay;
      var vj = me.videojs;

      /* when video loaded from Playlist play it automatically */
      me.resetPlayer(record.get('src'), record.get('poster'), record.get('tracks'), autoPlay);
   },
   /**
    * Reset/Start the video
    * @private
    * @param {String} url Url to Video
    * @param {String} poster Url/Link to to poster image
    * @param {Object/Boolean} tracks Tracks object to this video
    */
   resetPlayer: function (url, poster, tracks, autoPlay) {
      var me = this;
      var autoPlay = autoPlay || false;
      var ap = me.autoPlayVideo || autoPlay;
      var poster = poster || false;
      var tracks = tracks || false;

      var b = me.down('#btnPlay');
      var glyph = ap ? b.glyphPause : b.glyphPlay;
      var tt = ap ? 'Click to Pause' : 'Click to Play';
      var pressed = ap ? true : false;
      b.setGlyph(glyph)
         .toggle(pressed, true)
         .setTooltip(tt);

      me.switchStopButton(url);

      me.videojs.src(url);
      /* switch off captions */
      me.loadTrack(-1);

      if (tracks) {
         me.loadTracks(tracks);
      } else {
         me.down('#btnSubtitles').hide();
      }

      if (poster && typeof(poster) !== 'undefined') {
         me.videojs.poster(poster);
      } else {
         me.videojs.poster('');
      }
      me.currentVideo = {
         video: url,
         poster: poster,
         tracks: tracks
      };
      me.errorFlag = true;
      if (ap) {
         me.videojs.play();
      }
   },
   /**
    * Hide/Show Stop Button (like with Vimeo)
    * @private
    * @param {Array/String} url Video URL
    */
   switchStopButton: function (url) {
      var me = this;

      if (Ext.isString(url)) {
         var u = url;
      } else {
         u = url[0].src;
      }

      if (me.getVideoType(u) === 'video/vimeo' || me.autoPlay === true) {
         me.down('#btnStop').hide();
      } else {
         me.down('#btnStop').show();
      }
   },
   /**
    * Loading tracks
    * @private
    * @param {Array} tracks Video TextTracks
    */
   loadTracks: function (tracks) {
      var me = this;
      var vj = me.videojs;

      var menu = me.down('#CaptionsMenu');

      var menuItems = menu.query('menuitem');
      Ext.each(menuItems, function (item, idx) {
         if (typeof (item.deleteMe) === 'undefined' && item.xtype === 'menuitem') {
            item.destroy();
         }
      }, me);

      Ext.each(tracks, function (track) {
         var t = vj.addTextTrack(track.kind, track.label, track.language, track);
         menu.add({
            text: track.label,
            scope: me,
            handler: function (btn) {
               me.loadTrack(t);
            }
         });
      }, me);

      me.down('#btnSubtitles').show();

   },
   /**
    * Load an individual track, called by the loadTracks function
    * returns false when the subtitles have to be switched off
    * @private
    * @param {Object} track Video TextTrack
    * @return {Boolean}
    */
   loadTrack: function (track) {
      var me = this;
      var vj = me.videojs;
      /* switch off the current Track showing */
      if (Ext.isObject(me.currentTrack)) {
         me.currentTrack.hide();
      }
      /* if idx = -1, then stop here */
      if (track === -1) {
         return false;
      }
      /* save the chosen track in this object */
      me.currentTrack = track;
      track.show();
   },
   /**
    * Add a video to the recent items, after the video can play successfully
    * @private
    * @param {Object} video Last played video object
    * @param {String} poster
    * @param {Object} tracks Tracks with this video
    * @param {Boolean} loader suspend adding the items to the recent list
    * @return {Boolean}
    */
   addRecentItem: function (video, poster, tracks, loader) {
      var me = this;

      var poster = poster || false;
      var tracks = tracks || false;

      if (typeof video === 'undefined' || (me.errorFlag && typeof( loader ) !== 'undefined')) {
         return false;
      }

      if (Ext.isArray(video)) {
         var text = video[0].src;
      } else if (Ext.isString(video)) {
         text = video;
      }

      var vObj = [{
         src: text,
         type: me.getVideoType(text)
      }];

      var menu = me.down('#RecentPlayed').menu;
      me.down('#RecentPlayed').enable();

      var b = me.query('#RecentMenu menuitem');
      var inList = false;
      Ext.each(b, function (item, idx) {
         if (item.text === text) {
            inList = true;
            return false;
         }
      }, me);

      if (inList === false) {
         menu.add({
            text: text,
            scope: me,
            handler: function (btn) {
               me.resetPlayer(vObj, poster, tracks, true);
            }
         });

         this.recentStore.add({
            video: Ext.encode({
               video: vObj,
               poster: poster,
               tracks: tracks
            })
         });
         this.recentStore.sync();

      }
   },
   /**
    * Time formatting function
    * Thanks to the Flowplayer jQuery plugin
    * @private
    * @param {Number} sec Time in seconds to be formatted
    * @return {String} Edited Time in seconds ('hh:mm:ss')
    */
   format: function (sec) {

      function zeropad(val) {
         val = parseInt(val, 10);
         return val >= 10 ? val : "0" + val;
      }

      sec = sec || 0;

      var h = Math.floor(sec / 3600),
         min = Math.floor(sec / 60);

      sec = sec - (min * 60);

      if (h >= 1) {
         min -= h * 60;
         return h + ":" + zeropad(min) + ":" + zeropad(sec);
      }

      return zeropad(min) + ":" + zeropad(sec);
   },
   /**
    *  Get the proper type of the video to be played
    * @private
    * @param {String} url Video URL
    * @return {String} type Video type
    */
   getVideoType: function (url) {
      if (typeof(url) === 'undefined') return 'video/mp4';

      if (this.YoutubeVideoId(url) !== false) {
         return 'video/youtube';
      } else if (this.VimeoVideoId(url) !== false) {
         return 'video/vimeo';
      } else {
         var extension = url.split('.').pop();
         if (this.supportedXtensions.indexOf(extension) === 1) {
            return 'video/' + extension;
         } else {
            return false;
         }
      }
   },
   /**
    * JavaScript function to match (and return) the video Id
    * of any valid Youtube Url, given as input string.
    * @author: Stephan Schmitz <eyecatchup@gmail.com>
    * @url: http://stackoverflow.com/a/10315969/624466
    */
   VimeoVideoId: function (url) {
      if (typeof(url) === 'undefined') return false;
      var p = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
      return (url.match(p)) ? RegExp.$1 : false;
   },
   /**
    * JavaScript function to match (and return) the video Id
    * of any valid Youtube Url, given as input string.
    * @author: Stephan Schmitz <eyecatchup@gmail.com>
    * @url: http://stackoverflow.com/a/10315969/624466
    */
   YoutubeVideoId: function (url) {
      if (typeof(url) === 'undefined') return false;
      var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      return (url.match(p)) ? RegExp.$1 : false;
   }
});
