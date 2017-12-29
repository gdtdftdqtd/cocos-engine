/**
 * Created by chenhongliang on 2017/12/28.
 */

var GraphicsOpacity = cc.Class({
    name: 'cc.GraphicsOpacity', extends: require('./CCComponent'),
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/GraphicsOpacity',
        executeInEditMode: true,
        requireComponent: cc.Graphics,
    },

    ctor: function() {
        this._graphicsSGNode = null;
    },

    properties: {
        _opacity: 255,
        opacity: {
            get: function() {
                return this._opacity;
            },
            set: function(value) {
                if (this._opacity !== value) {
                    if (this._graphicsSGNode) {
                        this._opacity = value;
                        this._graphicsSGNode.setGraphicsOpacity(value);
                    }
                }
            },
            range: [ 0, 255 ]
        },
        opacityNode: {
            default: null,
            type: cc.Node,
        }
    },

    onEnable: function () {
        var graphics = this.node.getComponent('cc.Graphics');
        this._graphicsSGNode = graphics && graphics._sgNode;
        if(this._graphicsSGNode) {
            if (this.opacityNode){
                this.opacity = this.opacityNode.opacity;
            }
            else {
                this.opacity = this.node.opacity;
            }
        }
    },

    onDisable: function () {
        this._labelSGNode = null;
    },

    update: function (dt) {
        if (this.opacityNode){
            this.opacity = this.opacityNode.opacity;
        }
        else {
            this.opacity = this.node.opacity;
        }
    },

});

cc.GraphicsOpacity = module.exports = GraphicsOpacity;

