Ext.require(
   ['Movieworld.singleton.Toolbox']
);

Ext.define('Movieworld.model.Movie', {
   extend: 'Ext.data.Model',
   fields: [
      'adult',
      'backdrop_original',
      'backdrop_path',
      'backdrop_w300',
      'backdrop_w780',
      'backdrop_w1280',
      'belongs_to_collection',
      'budget',
      'first_air_date',
      'last_air_date',
      'genres',
      'homepage',
      'id',
      'imdb_id',
      'name',
      'number_of_seasons',
      'networks',
      'seasons',
      'number_of_episodes',
      'original_title',
      'overview',
      'popularity',
      'poster_original',
      'poster_path',
      'poster_w92',
      'poster_w154',
      'poster_w185',
      'poster_w342',
      'poster_w500',
      'production_companies',
      'production_countries',
      'release_date',
      'revenue',
      'runtime',
      'spoken_languages',
      'tagline',
      'title',
      'vote_average',
      'vote_count',
      'type'
   ]
});

// genres : id, name
// production_companies : name, id
// production_countries : iso_3166, name
// spoken_languages : iso_639_1, name


