Ext.define('Movieworld.store.Translations', {
   requires: ['Movieworld.singleton.AppSettings'],
   extend: 'Ext.data.Store',
   model: 'Movieworld.model.Translations',
   proxy: {
      type: 'ajax',
      actionMethods: {
         read: 'POST'
      },
      url: AppSettings.getServer() + 'movies/TvTranslations',
      reader: {
         rootProperty: 'records.translations',
         type: 'json',
         idProperty: 'iso_639_1'
      }
   },
   autoLoad: false
});