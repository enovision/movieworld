Ext.require(
   ['Movieworld.singleton.Toolbox']
);
Ext.define('Movieworld.model.Media', {
   extend: 'Ext.data.Model',
   fields: [
      'id',
      'file_w300',
      'file_w185',
      'file_w45',
      'iso_639_1',
      'file_h632',
      'aspect_ratio',
      'file_original',
      'width',
      'height',
      'vote_average',
      'vote_count',
      'service',
      'name',
      'source',
      'size'
   ]
});

// posters  : file_w185, file_h632, file_original, width, height, vote_average, vote_count
// backdrops: file_w185, file_h632, file_original, width, height, vote_average, vote_count
// profiles : file_w185, file_h632, file_original, width, height
// trailers : service, name, source, size