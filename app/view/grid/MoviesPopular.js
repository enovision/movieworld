Ext.define('Movieworld.view.grid.MoviesPopular', {
   extend: 'Ext.grid.Panel',
   requires: ['Movieworld.singleton.Toolbox'],
   alias: 'widget.MoviesPopularGrid',
   border: true,
   hideHeaders: true,

   initComponent: function () {
      var me = this;

      var store = Ext.StoreManager.lookup('MoviesPopular');

      Ext.apply(me, {
         store: store,
         columns: [{
            text: 'Results',
            xtype: 'templatecolumn',
            flex: true,
            tpl: new Ext.XTemplate(
               '<div class="results item {[this.getResClass()]}">',
               '<div class="results image-wrap">',
               '<img class="results thumb" src="{thumbnail}"/>',
               '</div>',
               '<div class="results wrap">',
               '<div class="results name">{name}</div>',
               '<div class="results released">Released: {item_date}</div>',
               '</div>',
               '</div>',
               {
                  getResClass: function () {
                     var c = Toolbox.getResolutionClass();
                     return c;
                  }
               })
         }],
         viewConfig: {
            style: {
               overflow: 'auto',
               overflowX: 'hidden'
            }
         }
      });

      me.callParent(arguments);

      me.on('resize', function () {
         Toolbox.BrowserResize('.results.item');
      }, me);

   }
}); 