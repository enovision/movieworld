Ext.define('Movieworld.store.ReleaseInfo', {
   requires: ['Movieworld.singleton.AppSettings'],
   extend: 'Ext.data.Store',
   model: 'Movieworld.model.ReleaseInfo',
   proxy: {
      type: 'ajax',
      actionMethods: {
         read: 'POST'
      },
      url: AppSettings.getServer() + 'movies/MovieReleaseInfo',
      reader: {
         rootProperty: 'countries',
         type: 'json',
         idProperty: 'iso_3166_1'
      }
   },
   autoLoad: false
});