Ext.define('Movieworld.model.Tv', {
   extend: 'Ext.data.Model',
   fields: [
      // @formatter:off
      "backdrop_path", "created_by", "episode_run_time",
      "first_air_date",
      "genres",
      "homepage",
      "id",
      "in_production",
      "languages", // array
      "last_air_date", "name", "networks", "number_of_episodes",
      "number_of_seasons", "original_name", "origin_country",
      "overview", "popularity", "poster_path", "seasons", "first_season",
      "status", "vote_average", "vote_count", "poster_w185", 'external_ids',
      "type"
      // @formatter:on
   ]
});

// created_by : id, name, profile_path
// episode_run_time : integers
// languages : strings country_codes
// origin_country : string country_codes
// genres : id, name
// networks : id, name
// external_ids : imdb_id,freebase_id, freebase_mid, tvdb_id, tvrage_id
// seasons : air_date, poster_path, season_number, poster_original, poster_path, poster_w92, poster_w154, 
//           poster_w185, poster_w342, poster_w500, poster_w780
