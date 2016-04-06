Ext.define('Movieworld.view.view.FrontrowDataview', {
   extend: 'Ext.view.View',
   requires: ['Ext.view.View', 'Ext.ux.DataView.Animated'],
   alias: 'widget.FrontrowDataview',
   deferInitialRefresh: false,
   cls: 'dataview panel',
   scrollable: true,

   _store: false,

   initComponent: function () {
      var me = this;
      Ext.apply(me, {
         store: Ext.StoreManager.lookup(me._store),
         tpl: Ext.create('Ext.XTemplate',
            '<div class="dataview wrap">',
            '<tpl for=".">',
            '<div class="dataview item {[this.getResClass()]}">',
            '<img class="dataview thumb left" src=\"{thumb}\"/>',
            '<div class="dataview right">',
            '<div class="dataview title">{name}</div>',
            '<tpl if="type==\'T\'"><div class="dataview release_date">First broadcast {release_date}</div></tpl>',
            '<tpl if="type==\'M\'"><div class="dataview release_date">Released {release_date}</div></tpl>',
            '<tpl if="vote_average &gt; 0"><div class="dataview rate">Popularity&nbsp;<span class="score">{vote_average}</span></div></tpl>',
            '</div>',
            '</div>',
            '</tpl>',
            '</div>',
            {
               scope: me,
               getResClass: function () {
                  var c = Toolbox.getResolutionClass();
                  return c;
               }
            }),
         plugins: [Ext.create('Ext.ux.DataView.Animated', {
            duration: 550,
            idProperty: 'id'
         })],
         itemSelector: 'div.dataview.item',
         overItemCls: 'dataview-hover',
         multiSelect: false
      });

      me.callParent();

      me.on('resize', function () {
         Toolbox.BrowserResize('.dataview.item');
      }, me);

   }
});
