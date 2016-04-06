Ext.define('Movieworld.view.panel.Search', {
   extend: 'Ext.panel.Panel',
   alias: 'widget.SearchPanel',
   requires: [
      'Movieworld.view.grid.SearchResults',
      'Movieworld.view.grid.PersonsPopular'
   ],
   layout: 'card',
   deferredRender: false,

   initComponent: function () {
      var me = this;

      Ext.apply(me, {
         items: [
            {
               xtype: 'PersonsPopularGrid',
               itemId: 'PersonsPopularGrid',
               glyph: Glyphs.getGlyph('users'),
               title: 'Most requested Persons'
            },
            {
               xtype: 'SearchResultsGrid',
               itemId: 'SearchResultsGrid'
            }
         ]
      });

      me.callParent(arguments);
   },

   getPersonsPopularCard: function () {
      return this.down('#PersonsPopularGrid');
   },

   getSearchResultsCard: function () {
      return this.down('#ResultsGrid');
   }

});


