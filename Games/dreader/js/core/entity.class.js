/**
 * @file entity.class.js
 * @version 1.1.0
 * @license MIT License
 * Copyright 2020 Donitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Options from '../core/options.class.js';

export default class Entity {
    static _init() {
        if (this !== Entity) {
            throw new Error('Static _init called from wrong class');
        }

        Entity._typeByName = new Map();
    }

    constructor(context, scene, options) {
        options = Options.castIfRequired(options);

        this._scene = scene;

        this._destroyed = false;

        this._updatePriority = options.get('updatePriority', 0);

        scene.addEntity(this);
    }

    getScene() {
        return this._scene;
    }

    getDestroyed() {
        return this._destroyed;
    }

    destroy(context) {
        if (this._destroyed) {
            throw new Error('Entity has already been destroyed');
        }

        this._destroyed = true;

        this._scene.removeEntity(this);
    }

    handleResize(context) {
    }

    update(context) {
    }

    static p_register() {
        Entity._typeByName.set(this.name, this);
    }

    static createByName(name, context, scene, options) {
        return new (Entity.getTypeByName(name))(context, scene, options);
    }

    static getTypeByName(name) {
        const type = Entity._typeByName.get(name);
        if (type === undefined) {
            throw new Error(`Entity type "${name}" has not been registered`);
        }
        return type;
    }

    static updatePrioritySortFunc(a, b) {
        return b._updatePriority - a._updatePriority;
    }
}

Entity._init();
