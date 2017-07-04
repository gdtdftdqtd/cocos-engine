/**
 * !#en shadow effect used to change the display, only used for TTF font
 * !#zh 阴影效果组件,用于字体阴影,只能用于系统字体
 * @class LabelShadow
 * @extends Component
 * @example
 *  // Create a new node and add label components.
 *  var node = new cc.Node("New Label");
 *  var label = node.addComponent(cc.Label);
 *  var shadow = node.addComponent(cc.LabelShadow);
 *  node.parent = this.node;
 */

var LabelShadow = cc.Class({
    name: 'cc.LabelShadow', extends: require('./CCComponent'),
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/LabelShadow',
        executeInEditMode: true,
        requireComponent: cc.Label,
    },

    ctor: function() {
        this._labelSGNode = null;
    },

    properties: {
        /**
         * !#en Change the shadow color
         * !#zh 改变阴影的颜色
         * @property color
         * @type {Color}
         * @example
         * shadow.color = new cc.Color(0.5, 0.3, 0.7, 1.0);;
         */
        _color: cc.color(255,255,255,255),
        _width: 1,
        _height: 1,
        color: {
            get: function() {
                return this._color;
            },
            set:function(value) {
                this._color = cc.color(value);
                if(this._labelSGNode) {
                    this._labelSGNode.setShadowColor(cc.color(this._color));
                }
            }
        },
        /**
         * !#en Change the shadow width
         * !#zh 改变阴影的宽度
         * @property width
         * @type {Number}
         * @example
         * shadow.width = 3;
         */
        width: {
            get: function() {
                return this._width;
            },
            set: function(value) {
                this._width = value;
                if(this._labelSGNode) {
                    this._labelSGNode.setShadowOffset(cc.size(this._width,this._height));
                }
            }
        },
        height: {
            get: function() {
                return this._height;
            },
            set: function(value) {
                this._height = value;
                if(this._labelSGNode) {
                    this._labelSGNode.setShadowOffset(cc.size(this._width,this._height));
                }
            }
        },
    },

    onEnable: function () {
        var label = this.node.getComponent('cc.Label');
        var sgNode = this._labelSGNode = label && label._sgNode;
        if(this._labelSGNode) {
            sgNode.setShadowed(true);
            sgNode.setShadowColor(cc.color(this._color));
            sgNode.setShadowOffset(cc.size(this._width,this._height));
        }
    },

    onDisable: function () {
        if(this._labelSGNode) {
            this._labelSGNode.setShadowed(false);
        }

        this._labelSGNode = null;
    },

});

cc.LabelShadow = module.exports = LabelShadow;