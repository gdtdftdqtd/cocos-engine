
var Base = require('./CCRendererUnderSG');

/**
 * !#en The EdgeSprite Component
 * !#zh 图片画线
 * @class Spline
 * @extends _RendererInSG
 */
var EdgeSprite = cc.Class({
    name: 'cc.EdgeSprite',
    extends: Base,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/EdgeSprite',
        executeInEditMode: true,
    },

    ctor: function() {

    },

    properties: {
        _spriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        spriteFrame: {
            get: function () {
                return this._spriteFrame;
            },
            set: function (value, force) {
                var lastSprite = this._spriteFrame;
                if (CC_EDITOR) {
                    if (!force && ((lastSprite && lastSprite._uuid) === (value && value._uuid))) {
                        return;
                    }
                }
                else {
                    if (lastSprite === value) {
                        return;
                    }
                }
                this._spriteFrame = value;
                this._refreshEdgeSprite();
                if (CC_EDITOR) {
                    this.node.emit('spriteframe-changed', this);
                }
            },
            type: cc.SpriteFrame,
        },

        _polygon:{
            default: [],
            type: cc.Vec2
        },
        polygon: {
            get: function () {
                if (!this._polygon) {
                    this._polygon = [];
                }
                return this._polygon;
            },
            set: function (value) {
                this._polygon.length = 0;
                if (value[0] instanceof cc.Vec2){
                    this._polygon = value;
                }
                else {
                    for (var i = 0; i < value.length; ++i) {
                        this._polygon.push(cc.v2(value[i][0], value[i][1]));
                    }
                }
                this._refreshEdgeSprite();
            },
        },
        _color: cc.color(255,255,255,255),
        color: {
            get: function() {
                return this._color;
            },
            set:function(value) {
                this._color = cc.color(value);
                if (this._sgNode) {
                    this._sgNode.setNodeColor(this._color);
                }
            }
        },
        _opacity: 255,
        opacity: {
            get: function() {
                return this._opacity;
            },
            set:function(value) {
                this._opacity = value;
                if (this._sgNode) {
                    this._sgNode.setNodeOpacity(this._opacity);
                }
            }
        },
    },

    _initSgNode: function () {
        if (this._sgNode){

        }
    },

    _createSgNode: function () {
        if (CC_JSB && !CC_EDITOR) {
            return new cc.EdgeNode();
        }
        else {
            return null;
        }
    },

    onEnable: function () {
        this._super();
        if (this._spriteFrame) {
            this._spriteFrame.ensureLoadTexture();
        }
        this._refreshEdgeSprite();
    },

    onDisable: function () {
        this._super();
    },



    _refreshEdgeSprite: function () {
        if (!this._sgNode){
            return;
        }
        if (this._polygon.length > 0 && this._spriteFrame) {
            if (!this._sgNode.getIsInit()) {
                this._sgNode.initWithTexture(this._spriteFrame.getTexture(), this._polygon, this._polygon.length);
            }
            else {
                this._sgNode.resetPath(this._polygon, this._polygon.length);
            }
        }
    },
});

if (CC_EDITOR) {
    // override __preload
    EdgeSprite.prototype.__superPreload = Base.prototype.__preload;
    EdgeSprite.prototype.__preload = function () {
        this.__superPreload();
    };
    // override onDestroy
    EdgeSprite.prototype.__superOnDestroy = Base.prototype.onDestroy;
    EdgeSprite.prototype.onDestroy = function () {
        this.__superOnDestroy();
    };
}

cc.EdgeSprite = module.exports = EdgeSprite;

