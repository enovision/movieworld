Ext.require(
   ['Movieworld.singleton.Toolbox']
);

Ext.define('Movieworld.model.Person', {
   extend: 'Ext.data.Model',
   fields: [
      'adult',
      'also_known_as',
      'name',
      'id',
      'biography',
      'known_movies',
      'birthday',
      'place_of_birth',
      'deathday',
      'homepage',
      'profile_h632',
      'profile_original',
      'profile_path',
      'profile_w45',
      'profile_w185',
      'type'
   ],

   associations: [
      {
         type: 'hasMany',
         model: 'filmography',
         name: 'filmography'
      },

      {
         type: 'hasMany',
         model: 'poster',
         name: 'profile'
      }
   ]
});


