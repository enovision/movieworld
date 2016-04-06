Ext.define('Movieworld.store.WorkPersons', {
   extend: 'Ext.data.Store',
   model: 'Movieworld.model.Person',
   proxy: {
      type: 'memory',
      reader: {
         type: 'json',
         rootProperty: 'records'
      }
   },
   autoLoad: false
});