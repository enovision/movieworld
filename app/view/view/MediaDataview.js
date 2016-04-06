	Ext.define('Movieworld.view.view.MediaDataview', {
   extend: 'Ext.view.View',
   requires: ['Ext.ux.DataView.Animated'],
   alias: 'widget.MediaDataview',
   // deferInitialRefresh : false,
   cls: 'mediaview panel',
   multiSelect: false,
   scrollable: true,

   _store: false,
   _type: 'posters', // can be posters or backdrops

   initComponent: function () {
      var me = this;

      Ext.apply(me, {
         store: Ext.StoreManager.lookup(me._store),
         tpl: Ext.create('Ext.XTemplate',
            '<div class="mediaview wrap  {[this.getResClass()]} {[this.getClass()]}">',
            '<tpl for=".">',
            '<div id="id-{id}" class="mediaview item" href=\"{file_h632}\" rel=\"gallery\" >',
            '<div class="mediaview image-wrap">',
            '<img class="mediaview thumb" title=\"{title}\" src=\"{file_w300}\"/>',
            '</div>',
            '<div class="mediaview name">{name}</div>',
            '<div class="mediaview statistics">',
            '<ul>',
            '<li>w:<span class="inverse">{width}</span></li>',
            '<li>h:<span class="inverse">{height}</span></li>',
            '<tpl if="vote_average &gt; 0"><li>p:<span class="inverse">{[this.getVote(values.vote_average)]}</span></li></tpl>',
            '</ul>',
            '</div>',
            '</div>',
            '</tpl>',
            '</div>',
            {
               scope: me,
               getClass: function () {
                  return me._type;
               },
               getVote: function (rate) {
                  return Ext.util.Format.number(rate, '0.0');
               },
               getResClass: function () {
                  return Toolbox.getResolutionClass();
               }
            }),
         itemSelector: 'div.mediaview.item',
         overItemCls: 'mediaview-hover'
      });

      me.on('itemclick', function (dataview, record, item, index, e) {
         me.fireEvent('MediaItemClicked', me._type, dataview, record, item, index, e);
      }, me);

      me.callParent();
   },
   LoadMedia: function (id, records) {
      var me = this;

      me.update('', false, function () {
         var store = me.getStore();
         store.loadData(records);
      });
   }
});
