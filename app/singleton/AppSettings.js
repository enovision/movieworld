/**
 * @class Movieworld.singleton.AppConfig
 * Application Settings (no secrets here)
 *
 * @namespace Movieworld.singleton
 *
 * @constructor
 * @param {object} AppSettings
 * @author J.J. van de Merwe, Enovision GmbH
 */

Ext.define('Movieworld.singleton.AppSettings', {
   alternateClassName: ['AppConfig', 'AppSettings'],
   singleton: true,
   constructor: function (config) {
      this.initConfig(config);
      return this;
   },
   config: {
      iconmovie: './resources/img/icons/fugue/films.png',
      icontv: './resources/img/icons/television.png',
      iconperson: './resources/img/icons/user.png',
      server: '/server.3.0/'
   },
   getIcon: function (type) {
      if (type === 'P')
         return AppSettings.getIconperson();
      if (type === 'M')
         return AppSettings.getIconmovie();
      if (type === 'T')
         return AppSettings.getIcontv();
      return false;
   }
});