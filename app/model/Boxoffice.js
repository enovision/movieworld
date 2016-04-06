Ext.require(
   ['Movieworld.singleton.Toolbox']
);

Ext.define('Movieworld.model.Boxoffice', {
   extend: 'Ext.data.Model',
   fields: [
      'id',
      'name',
      'thumb',
      'type',
      'vote_average',
      'release_date'
   ]
});