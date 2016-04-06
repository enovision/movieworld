Ext.define('Movieworld.model.TvEpisode', {
   extend: 'Ext.data.Model',
   fields: [
      "air_date",
      "episode_number",
      "name",
      "overview",
      "id",
      "production_code",
      "season_number",
      "still_path",
      "vote_average",
      "vote_count",
      //  /3/tv/{id}/season/{season_number}/episode/{episode_number}/external_ids
      "imdb_id",
      "freebase_id",
      "freebase_mid",
      "tvdb_id",
      "tvrage_id",
      // /3/tv/{id}/season/{season_number}/episode/{episode_number}/images
      "images",
      // /3/tv/{id}/season/{season_number}/episode/{episode_number}/credits
      "credits",
      // /3/tv/{id}/season/{season_number}/episode/{episode_number}/videos
      "videos"
   ]
});

// images: id, stills[aspect_ratio, file_path, height, iso_639_1, vote_average, vote_count, width]
// credits: character, credit_id, id, name, profile_path, order 
// videos: id, results[id, iso_639_1, key, name, site, size, type