Ext.require(
   ['Movieworld.singleton.Toolbox']
);

Ext.define('Movieworld.model.Search', {
   extend: 'Ext.data.Model',
   fields: [
      'type',
      'score',
      'language',
      'popularity',
      'vote_average',
      'release_date',
      'name',
      'title',
      'original_name',
      'id',
      'thumbnail',
      'alternate_name',
      'released',
      'birthday',
      'item_date',
      'roles'
   ]
});

// roles is for the WorkPanel Movies
// array of id, character for every person compared