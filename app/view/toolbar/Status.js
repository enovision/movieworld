Ext.define('Movieworld.view.toolbar.Status', {
   extend: 'Ext.toolbar.Toolbar',
   alias: 'widget.StatusToolbar',
   height: 30,
   itemId: 'statusToolbar',

   initComponent: function () {

      var me = this;

      Ext.apply(me, {
         items: [
            {
               xtype: 'label',
               text: 'Enovision GmbH, business in a browser',
               margin: '0 10 0 0'
            },
            '-',
            {
               xtype: 'label',
               text: 'enovision movieworld - version 3.0',
               margin: '0 0 0 10'
            },
            '->',
            {
               xtype: 'label',
               text: 'This product uses the TMDb API but is not endorsed or certified by TMDb.'
            },
            {
               text: 'Feedback',
               glyph: Glyphs.getGlyph('feedback'),
               scope: me,
               handler: function (btn, e) {
                  me.fireEvent('FeedbackClicked', me);
               }
            },
            {
               text: 'Credits',
               glyph: Glyphs.getGlyph('credits'),
               scope: me,
               handler: function (btn, e) {
                  me.fireEvent('CreditsClicked', me);
               }
            }
         ]
      });

      this.callParent();
   }
});