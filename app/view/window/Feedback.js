Ext.define('Movieworld.view.window.Feedback', {
   requires: ['Movieworld.singleton.AppSettings'],
   alternateName: ['Feedback'],
   extend: 'Ext.window.Window',
   height: 400,
   width: 600,
   glyph: Glyph.getGlyph('message'),
   maximizable: true,
   title: 'Feedback',
   layout: {
      type: 'fit'
   },

   initComponent: function () {
      var me = this;

      Ext.apply(me, {
         items: [
            {
               xtype: 'form',
               bodyPadding: 10,
               defaults: {
                  anchor: '-24'
               },
               items: [
                  {
                     xtype: 'textfield',
                     name: 'name',
                     fieldLabel: 'Name',
                     allowBlank: false,
                     msgTarget: 'side',
                     listeners: {
                        'afterrender': function (field) {
                           field.focus(false, 1000);
                        }
                     }
                  },
                  {
                     xtype: 'radiogroup',
                     fieldLabel: 'Reply',
                     defaults: {
                        listeners: {
                           scope: this,
                           change: function (radio, newValue, oldValue) {
                              var me = this;
                              if (newValue === true) {
                                 var email = me.down('form [name=email]');
                                 if (radio.inputValue == 'none') {
                                    email.hide();
                                    email.disable();
                                 } else {
                                    email.show();
                                    email.enable();
                                    email.focus();
                                 }
                              }
                           }
                        }
                     },
                     items: [
                        {
                           name: 'reply',
                           inputValue: 'mail',
                           boxLabel: 'Email'
                        },
                        {
                           name: 'reply',
                           inputValue: 'phone',
                           boxLabel: 'Call me'
                        },
                        {
                           name: 'reply',
                           inputValue: 'none',
                           boxLabel: 'None',
                           checked: true
                        }
                     ]
                  },
                  {
                     xtype: 'textfield',
                     name: 'email',
                     hidden: true,
                     disabled: true,
                     fieldLabel: 'Email',
                     allowBlank: false,
                     msgTarget: 'side'
                  },
                  {
                     xtype: 'textfield',
                     name: 'subject',
                     fieldLabel: 'Subject'
                  },
                  {
                     xtype: 'textareafield',
                     height: 203,
                     width: 558,
                     name: 'message',
                     fieldLabel: 'Message',
                     allowBlank: false,
                     msgTarget: 'side'
                  }
               ]
            }
         ],
         buttons: [{
            xtype: 'tbfill'
         }, {
            xtype: 'button',
            width: 100,
            text: 'Reset Form',
            scope: me,
            handler: function (b, e) {
               me.down('form').getForm().reset();
            }
         }, {
            xtype: 'button',
            width: 100,
            text: 'Send',
            itemId: 'btnSend',
            scope: me,
            handler: function (b, e) {
               var form = me.down('form').getForm();
               if (form.isValid()) {
                  me.SendContactForm(form, e);
               }
            }
         }, {
            text: 'Close',
            scope: this,
            handler: function () {
               me.destroy();
            }
         }]
      });

      me.callParent(arguments);
   },

   SendContactForm: function (form) {

      var me = this;

      form.submit({
         clientValidation: true,
         url: AppSettings.getServer() + 'feedback/SendFeedback',
         params: {
            'module': 'tmdb'
         },
         success: function (form, action) {
            if (action.result.success === true) {
               Ext.SlideMessage.msg('Info', action.result.message);
               me.destroy();
            } else {
               Ext.Msg.show({
                  title: 'Alert',
                  msg: action.result.message,
                  buttons: Ext.Msg.OK,
                  icon: Ext.MessageBox.ERROR
               });
            }
         }
      });
   }
});