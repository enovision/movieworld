Ext.define('Movieworld.view.viewport', {
   extend: 'Ext.container.Viewport',
   id: 'MyVP',
   requires: [
      'Movieworld.view.toolbar.Status',
      'Movieworld.view.toolbar.Search',
      'Movieworld.view.toolbar.History',
      'Movieworld.view.panel.Detail',
      'Movieworld.view.panel.Search',
      'Movieworld.view.panel.Content'
   ],
   layout: 'border',
   items: [{
      xtype: 'SearchPanel',
      flex: .28,
      region: 'west'
   },
      {
         xtype: 'DetailPanel',
         region: 'center'
      },
      {
         xtype: 'ContentPanel',
         flex: .28,
         region: 'east'

      },
      {
         xtype: 'StatusToolbar',
         region: 'south',
         height: 25
      },
      {
         xtype: 'panel',
         title: 'Enovision Movieworld',
         region: 'north',
         cls: 'y-title-panel',
         border: false,
         iconCls: 'enovision',
         dockedItems: [
            {
               xtype: 'SearchToolbar',
               dock: 'top'
            },
            {
               xtype: 'HistoryToolbar',
               dock: 'top'
            }

         ],
         listeners: {
            'afterrender': function (panel) {
               var header = panel.header;
               header.setHeight(35);
            },
            beforerender: function () {
               /* Ext.get('loading').hide(); */
            }
         }
      }
   ]
});

