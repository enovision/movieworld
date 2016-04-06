Ext.define('Movieworld.store.Person', {
   extend: 'Ext.data.Store',
   requires: ['Movieworld.singleton.AppSettings'],
   model: 'Movieworld.model.Person',
   proxy: {
      type: 'ajax',
      actionMethods: {
         read: 'POST'
      },
      url: AppSettings.getServer() + 'movies/personinfo',
      reader: {
         rootProperty: 'records',
         type: 'json',
         idProperty: 'id',
         totalProperty: 'total'
      }
   },
   autoLoad: false
});