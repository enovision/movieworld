Ext.define('Movieworld.view.window.videojsPlayer', {
    extend : 'Ext.window.Window',
    requires : ['Ext.ux.videojs.videojsPlayer'],
    alias : 'widget.videojsPlayerWindow',
    closeable : true,
    maximizable : true,
    alternateClassName : ['videojsPlayerWindow'],
    height : 400,
    width : 600,
    layout : 'fit',
    title : 'Videojs API Demo',
    modal : true,
    initComponent : function() {
        var me = this;
        Ext.applyIf(me, {});
        me.callParent(arguments);
    }
});
