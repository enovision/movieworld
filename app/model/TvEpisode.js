Ext.define('Movieworld.model.TvEpisode', {
   extend: 'Ext.data.Model',
   fields: [
      // @formatter:off
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
      "still_original",
      "still_w92",
      "still_w185",
      "still_w300",
      // /3/tv/{id}/season/{season_number}/episode/{episode_number}/credits
      "credits",
      // /3/tv/{id}/season/{season_number}/episode/{episode_number}/videos
      "videos"
      // @formatter:on
   ]
});

// images: id, stills[aspect_ratio, file_path, height, iso_639_1, vote_average, vote_count, width]
// credits: character, credit_id, id, name, profile_path, order 
// videos: id, results[id, iso_639_1, key, name, site, size, type