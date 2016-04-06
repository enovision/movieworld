Ext.define('Movieworld.store.Search', {
   requires: ['Movieworld.singleton.AppSettings'],
   extend: 'Ext.data.Store',
   model: 'Movieworld.model.Search',
   proxy: {
      type: 'ajax',
      actionMethods: {
         read: 'POST'
      },
      url: AppSettings.getServer() + 'movies/search',
      reader: {
         rootProperty: 'records',
         type: 'json',
         idProperty: 'id',
         totalProperty: 'total'
      }
   },
   autoLoad: false
});