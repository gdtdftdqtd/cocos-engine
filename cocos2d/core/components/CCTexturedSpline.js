
var Base = require('./CCRendererUnderSG');

var TexturedSplineType = cc.Enum({
    CATMULL_ROM:    -1,
    B_CUBIC:        -1,
    LINEAR:         -1,
});

/**
 * !#en The TexturedSpline Component
 * !#zh 图片画线
 * @class Spline
 * @extends _RendererInSG
 */
var TexturedSpline = cc.Class({
    name: 'cc.TexturedSpline',
    extends: Base,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/TexturedSpline',
        executeInEditMode: true,
    },

    ctor: function() {
        this._type = TexturedSplineType.CATMULL_ROM;
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
                this._refreshTexturedSpline();
                if (CC_EDITOR) {
                    this.node.emit('spriteframe-changed', this);
                }
            },
            type: cc.SpriteFrame,
        },

        /**
         * !#en The TexturedSpline type.
         * !#zh
         * @property type
         * @type {TexturedSpline.Type}
         * @example
         * TexturedSpline.type = cc.TexturedSpline.Type.RECT;
         */
        _type: TexturedSplineType.CATMULL_ROM,
        type: {
            get: function () {
                return this._type;
            },
            set: function (value) {
                this._type = value;
                this._refreshTexturedSpline();
            },
            type: TexturedSplineType,
            // tooltip: CC_DEV && 'i18n:COMPONENT.TexturedSpline.type',
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
                this._refreshTexturedSpline();
            },
        },

        _subvisionLevel: {
            default: 10,
            type: cc.Integer,
        },
        subvisionLevel: {
            get: function () {
                return this._subvisionLevel;
            },
            set: function (value) {
                this._subvisionLevel = value;
                this._refreshTexturedSpline();
            },
        },
    },

    statics: {
        Type: TexturedSplineType,
    },

    // _resizeNodeToTargetNode: CC_EDITOR && function () {
    //     if(this._spriteFrame) {
    //         var rect = this._spriteFrame.getRect();
    //         this.node.setContentSize(rect.width, rect.height);
    //     }
    // },

    _initSgNode: function () {
        if (this._sgNode){
            this._sgNode.setAnchorPoint(cc.p(0,0));
        }
    },

    _createSgNode: function () {
        if (CC_JSB && !CC_EDITOR) {
            return new cc.TexturedSplineNode();
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
        this._refreshTexturedSpline();
    },

    onDisable: function () {
        this._super();
    },

    _refreshTexturedSpline: function () {
        if (!this._sgNode){
            return;
        }
        if (this._polygon.length > 0 && this._spriteFrame && this._subvisionLevel > 0) {
            this._sgNode.setPosition(cc.p(0,0));
            this._sgNode.setAnchorPoint(cc.p(0,0));
            this._sgNode.initWithTexture(this._polygon, this._polygon.length, this._subvisionLevel, this._spriteFrame.getTexture(),this._type);
        }
    },
});

if (CC_EDITOR) {
    // override __preload
    TexturedSpline.prototype.__superPreload = Base.prototype.__preload;
    TexturedSpline.prototype.__preload = function () {
        this.__superPreload();
    };
    // override onDestroy
    TexturedSpline.prototype.__superOnDestroy = Base.prototype.onDestroy;
    TexturedSpline.prototype.onDestroy = function () {
        this.__superOnDestroy();
    };
}

cc.TexturedSpline = module.exports = TexturedSpline;

