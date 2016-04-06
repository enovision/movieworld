Ext.require(
   ['Movieworld.singleton.Toolbox']
);

Ext.define('Movieworld.model.ReleaseInfo', {
   extend: 'Ext.data.Model',
   fields: [
      'iso_3166_1',
      'release_date',
      'certification'
   ]
});