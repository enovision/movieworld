Ext.define('Movieworld.store.Poster', {
   extend: 'Ext.data.Store',
   model: 'Movieworld.model.Media',
   proxy: {
      type: 'memory',
      reader: {
         type: 'json',
         rootProperty: 'records'
      }
   },
   autoLoad: false
});