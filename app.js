Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        'ux': './ux'
    }
});

Ext.require(
   [
      'Movieworld.singleton.Toolbox',
      'Movieworld.singleton.Glyphs',
      'Movieworld.singleton.AppSettings',
      'Movieworld.view.window.videojsPlayer',
      'Ext.ux.SlideMessage',
      'Ext.tab.Panel',
      'Ext.grid.column.Template',
      'Ext.grid.plugin.DragDrop',
      'Ext.form.Label',
      'Ext.form.field.Checkbox',
      'Ext.toolbar.Spacer',
      'Ext.toolbar.Paging',
      'Ext.data.reader.Xml',
      'Movieworld.view.viewport'
   ]
);

Ext.application({
    name: 'Movieworld',
    controllers: ['movieworld'],
    launch: function() {

       setTimeout(function () {
          Ext.get('loading').fadeOut({
             remove: true
          });
       }, 250);

       Ext.create('Movieworld.view.viewport');
    }
});
