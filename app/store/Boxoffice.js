Ext.define('Movieworld.store.Boxoffice', {
   extend: 'Ext.data.Store',
   requires: ['Movieworld.singleton.AppSettings'],
   model: 'Movieworld.model.Boxoffice',
   proxy: {
      type: 'ajax',
      actionMethods: {
         read: 'POST'
      },
      url: AppSettings.getServer() +'movies/BoxOffice',
      reader: {
         rootProperty: 'records',
         type: 'json',
         idProperty: 'id',
         totalProperty: 'total'
      }
   },
   autoLoad: true
});