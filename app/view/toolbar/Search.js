Ext.define('Movieworld.view.toolbar.Search', {
   extend: 'Ext.toolbar.Toolbar',
   alias: 'widget.SearchToolbar',
   itemId: 'searchToolbar',

   _searchWidth: 300,

   initComponent: function () {

      var me = this;

      Ext.apply(me, {
         items: [{
            text: 'Home',
            glyph: Glyphs.getGlyph('frontrow'),
            scope: me,
            handler: function (btn, e) {
               me.fireEvent('BoxOfficeClicked', me);
            }
         }, '-', {
            xtype: 'textfield',
            fieldLabel: 'Search',
            emptyText: 'Please enter search...',
            labelWidth: 50,
            width: me._searchWidth,
            listeners: {
               scope: me,
               specialkey: function (field, e) {
                  if (e.getKey() == e.ENTER) {
                     var chkMovies = me.down('#chkMovies').getValue();
                     var chkPeople = me.down('#chkPeople').getValue();
                     var chkTV = me.down('#chkTV').getValue();
                     me.fireEvent('SearchClicked', field, chkMovies, chkPeople, chkTV);
                  }
               },
               afterrender: function (field) {
                  me.searchfield = field;
               }
            }
         }, {
            xtype: 'button',
            tooltip: 'Search',
            glyph: Glyphs.getGlyph('search'),
            scope: me,
            handler: function (b, e) {
               var chkMovies = me.down('#chkMovies').getValue();
               var chkPeople = me.down('#chkPeople').getValue();
               var chkTV = me.down('#chkTV').getValue();
               me.fireEvent('SearchClicked', me.searchfield, chkMovies, chkPeople, chkTV);
            }
         }, {
            tooltip: 'Reset Search',
            glyph: Glyphs.getGlyph('reset'),
            scope: me,
            handler: function (btn, e) {
               var s = me.searchfield;
               if (s.getValue() !== '') {
                  s.setValue('');

                  me.fireEvent('ResetSearchClicked', me);
               }
            }
         }, {
            xtype: 'tbspacer'
         }, {
            xtype: 'checkboxfield',
            boxLabel: 'Movies',
            itemId: 'chkMovies',
            checked: true
         }, {
            xtype: 'checkboxfield',
            boxLabel: 'TV',
            itemId: 'chkTV',
            checked: true
         }, {
            xtype: 'tbspacer'
         }, {
            xtype: 'checkboxfield',
            boxLabel: 'People',
            itemId: 'chkPeople',
            checked: true
         }, '-', {
            text: 'Who worked with who',
            glyph: Glyphs.getGlyph('link'),
            tooltip: 'Did your favorite actors play together?',
            scope: me,
            handler: function (btn, e) {
               me.fireEvent('WorkClicked', me);
            }
         }, '->', {
            text: 'Clear History',
            glyph: Glyphs.getGlyph('history'),
            scope: me,
            handler: function (btn, e) {
               me.fireEvent('ClearHistoryClicked', me);
            }
         }, {
            text: 'Feedback',
            glyph: Glyphs.getGlyph('feedback'),
            scope: me,
            handler: function (btn, e) {
               me.fireEvent('FeedbackClicked', me);
            }
         }, {
            text: 'Credits',
            glyph: Glyphs.getGlyph('credits'),
            scope: me,
            handler: function (btn, e) {
               me.fireEvent('CreditsClicked', me);
            }
         }]
      });

      this.callParent();
   }
});