/**
 * @file mainscene.class.js
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

import Entity from '../core/entity.class.js';
import Scene from '../core/scene.class.js';

import MazeManager from '../core/game/mazemanager.class.js';

import * as THREE from '../lib/three.js/three.module.js';

export default class MainScene extends Scene {
    getThreeScene() {
        return this._tScene;
    }

    constructor(context) {
        super(context);

        this._tScene = new THREE.Scene();
        this._tScene.name = 'Scene';

        Entity.createByName('World', context, this);
        this._camera = Entity.createByName('Player', context, this).getCamera();
        Entity.createByName('Computer', context, this);
        this._transition = Entity.createByName('Transition', context, this);
        Entity.createByName('Monster', context, this);
        MazeManager.createMaze(context, this);
        Entity.createByName('Director', context, this);

        context.renderer.compile(this._tScene, this._camera);
    }

    update(context) {
        super.update(context);

        if (!this._transition.isEnding()) {
            context.renderer.render(this._tScene, this._camera);
        }
    }
}
