Ext.define('Movieworld.store.Popular', {
   requires: ['Movieworld.singleton.AppSettings'],
   extend: 'Ext.data.Store',
   model: 'Movieworld.model.Boxoffice',
   proxy: {
      type: 'ajax',
      actionMethods: {
         read: 'POST'
      },
      url: AppSettings.getServer() + 'movies/Popular',
      reader: {
         rootProperty: 'records',
         type: 'json',
         idProperty: 'id',
         totalProperty: 'total'
      }
   },
   autoLoad: true
});