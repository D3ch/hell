/**
 * @file world.class.js
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
import ModelManager from '../core/modelmanager.class.js';
import Options from '../core/options.class.js';

import config from '../resources/config.js';

import * as THREE from '../lib/three.js/three.module.js';

export default class World extends Entity {
    constructor(context, scene, options) {
        options = Options.castIfRequired(options);
        super(context, scene, options);

        const tScene = scene.getThreeScene();

        const gltf = ModelManager.getModel('world');

        gltf.scene.children.slice(0).forEach(object => {
            tScene.add(object);
        });

        tScene.getObjectByName('Explosion').renderOrder = -7;
        tScene.getObjectByName('MouseMat').renderOrder = -6;
        tScene.getObjectByName('Keyboard').renderOrder = -5;
        tScene.getObjectByName('Screen').renderOrder = -4;
        tScene.getObjectByName('ScreenBroken').renderOrder = -4;
        tScene.getObjectByName('Monitor').renderOrder = -3;
        tScene.getObjectByName('MonitorInterior').renderOrder = -2;
        tScene.getObjectByName('Table').renderOrder = -1;
        tScene.getObjectByName('Sky').renderOrder = 1;

        tScene.getObjectByName('LightMonitor_Orientation').distance = 1;

        const sky = tScene.getObjectByName('Sky');
        sky.material = new THREE.MeshBasicMaterial({
            map: sky.material.map,
        });

        this._tree = tScene.getObjectByName('Tree');
    }

    update(context) {
        super.update(context);

        this._tree.rotation.set(Math.sin(context.time.totalSeconds * 4) *
            Math.sin(context.time.totalSeconds) *
            Math.sin(context.time.totalSeconds / 2) * 0.05, 0, 0);
    }
}

World.p_register();
