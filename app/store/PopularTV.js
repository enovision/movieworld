Ext.define('Movieworld.store.PopularTV', {
   requires: ['Movieworld.singleton.AppSettings'],
   extend: 'Ext.data.Store',
   model: 'Movieworld.model.Boxoffice',
   proxy: {
      type: 'ajax',
      actionMethods: {
         read: 'POST'
      },
      url: AppSettings.getServer() + 'movies/PopularTV',
      reader: {
         rootProperty: 'records',
         type: 'json',
         idProperty: 'id',
         totalProperty: 'total'
      }
   },
   autoLoad: true
});