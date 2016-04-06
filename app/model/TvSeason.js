Ext.define('Movieworld.model.TvSeason', {
   extend: 'Ext.data.Model',
   fields: [
      'tv_id',
      'season_number',
      'episode_number',
      'air_date',
      'name',
      'overview',
      'still_path',
      'season_number',
      'still_original',
      'still_path',
      'still_w92',
      'still_w185',
      'still_w300',
      'vote_average',
      'vote_count'
   ]
});

// episodes : air_date, episode_number, name, overview, still_path, vote_average,
// vote_count