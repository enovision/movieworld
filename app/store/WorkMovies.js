Ext.define('Movieworld.store.WorkMovies', {
   requires: ['Movieworld.singleton.AppSettings'],
   extend: 'Ext.data.Store',
   model: 'Movieworld.model.Search', // please notice !!!
   proxy: {
      type: 'ajax',
      actionMethods: {
         read: 'POST'
      },
      url: AppSettings.getServer() + 'movies/WorkCompare',
      reader: {
         rootProperty: 'records',
         type: 'json',
         idProperty: 'id',
         totalProperty: 'total'
      }
   },
   autoLoad: false
});