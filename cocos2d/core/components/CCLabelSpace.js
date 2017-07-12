/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * !#en Outline effect used to change the display, only used for TTF font
 * !#zh 描边效果组件,用于字体描边,只能用于系统字体
 * @class LabelSpace
 * @extends Component
 * @example
 *  // Create a new node and add label components.
 *  var node = new cc.Node("New Label");
 *  var label = node.addComponent(cc.Label);
 *  var outline = node.addComponent(cc.LabelSpace);
 *  node.parent = this.node;
 */

var LabelSpace = cc.Class({
    name: 'cc.LabelSpace', extends: require('./CCComponent'),
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/LabelSpace',
        executeInEditMode: true,
        requireComponent: cc.Label,
    },

    ctor: function() {
        this._label = null;
    },

    properties: {
        _space: 1,
        space: {
            get: function() {
                return this._space;
            },
            set: function(value) {
                this._space = value;
            }
        },
    },

    onEnable: function () {
        this._label = this.node.getComponent('cc.Label');
        if (this._label) {
            this._label.worldSpace = this._space;
        }
    },

    onDisable: function () {
        if(this._label) {
            this._label.worldSpace = 0;
        }

        this._label = null;
    },

});

cc.LabelSpace = module.exports = LabelSpace;
