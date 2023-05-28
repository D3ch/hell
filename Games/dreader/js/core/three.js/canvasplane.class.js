/**
 * @file canvasplane.class.js
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

import * as THREE from '../../lib/three.js/three.module.js';

export default class CanvasPlane extends THREE.Mesh {
    static _init() {
        CanvasPlane._tmpV0 = new THREE.Vector3();
        CanvasPlane._tmpV1 = new THREE.Vector3();
    }

    constructor(resolutionX, resolutionY, scale = 1, anchorX = 0.5, anchorY = 0.5) {
        const canvas = document.createElement('canvas');
        canvas.width = resolutionX;
        canvas.height = resolutionY;

        const geometry = new THREE.PlaneGeometry();
        geometry.translate(0.5 - anchorX, 0.5 - anchorY, 0);
        geometry.scale(resolutionX * scale, resolutionY * scale, 1);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
        });

        super(geometry, material);

        this._ctx2d = canvas.getContext('2d');

        this._height = resolutionY * scale;
    }

    getContext2D() {
        return this._ctx2d;
    }

    updateTexture() {
        this.material.map.needsUpdate = true;
    }

    faceCamera(camera, noPitch = false, screenHeight = null) {
        const position = this.getWorldPosition(CanvasPlane._tmpV0);
        const cameraPosition = camera.getWorldPosition(CanvasPlane._tmpV1);

        if (screenHeight !== null) {
            const height = position.distanceTo(cameraPosition) * 2 *
                Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            const scale = height * screenHeight / this._height;

            this.scale.set(scale, scale, 1);
        }

        if (noPitch) {
            cameraPosition.y = position.y;
        }

        this.lookAt(cameraPosition);
    }
}

CanvasPlane._init();
