Ext.define('Ext.ux.SlideMessage', {
   singleton: true,
   alternateClassName: ['Ext.SlideMsg', 'Ext.SlideMessage'],

   constructor: function () {

      var msgCt;

      function createBox(t, s) {
         return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
      }

      return {
         msg: function (title, format, delay) {
            delay = typeof delay === 'undefined' ? 1000 : delay;
            if (!msgCt) {
               msgCt = Ext.DomHelper.insertFirst(document.body, {
                  id: 'msg-div'
               }, true);
            }
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            m.slideIn('t').ghost("t", {
               delay: delay,
               remove: true
            });
         },

         init: function () {
         }
      };
   }
});