Ext.define('Movieworld.view.panel.Detail', {
   extend: 'Ext.panel.Panel',
   requires: [
      'Movieworld.view.panel.DetailMovieCard',
      'Movieworld.view.panel.DetailTvCard',
      'Movieworld.view.panel.DetailPersonCard'
   ],
   alias: 'widget.DetailPanel',
   layout: 'card',

   initComponent: function () {
      var me = this;

      Ext.apply(me, {
         items: [
            {
               xtype: 'FrontrowPanel'
            },
            {
               xtype: 'DetailMovieCard'
            },
            {
               xtype: 'DetailTvCard'
            },
            {
               xtype: 'DetailPersonCard'
            },
            {
               xtype: 'WorkPanel'
            }]
      });

      me.callParent(arguments);
   },

   getWorkPanel: function () {
      return this.down('WorkPanel');
   }

});


