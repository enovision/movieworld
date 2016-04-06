Ext.define('Movieworld.singleton.Glyphs', {
   singleton: true,
   alternateClassName: ['Glyphs', 'Glyph'],

   constructor: function (config) {
      this.initConfig(config);
   },

   config: {
      // Icons that have been addressed directly
      webfont: 'FontAwesome',
      movie: 'xf008',
      calendar: 'xf073',
      overview: 'xf0f6',
      seasons: 'xf06c',
      bio: 'xf08a',
      translation: 'xf040',
      vimeo: 'xf194',
      youtube: 'xf167',
      quicktime: 'xf179',
      apple: 'xf179',
      tv: 'xf109',
      star: 'xf005',
      link: 'xf0c1',
      workers: 'xf0c1',
      software: 'xf085',
      website: 'xf0ac',
      legal: 'xf0e3',
      download: 'xf019',
      hide_up: 'xf077',
      hide_down: 'xf078',
      search: 'xf002',
      log: 'xf0c9',
      cc: 'xf20a', // Closed Captions (subtitles)
      history: 'xf1da',
      eye: 'xf06e',
      feedback: 'xf10d',
      credits: 'xf087',
      close: 'xf00d',
      'reset': 'xf00d', // reset search
      sort_asc: 'xf15d',
      sort_desc: 'xf15e',
      users: 'xf007',
      save: 'xf0c7', // 'xf00c',
      frontrow: 'xf015', // home
      media: 'xf03e',
      gallery: 'xf03e',
      'delete': 'xf014'

   },
   setIcon  : function(glyph) {
      return Glyphs.getGlyph(glyph);
   },
   getIcon  : function(glyph) {
      return Glyphs.getGlyph(glyph);
   },
   getGlyph : function(glyph) {
      var font = Glyphs.getWebfont();
      if (typeof Glyphs.config[glyph] === 'undefined') {
         return false;
      }
      return Glyphs.config[glyph] + '@' + font;
   }
});
