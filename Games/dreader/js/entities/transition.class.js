/**
 * @file transition.class.js
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

import AudioManager from '../core/audiomanager.class.js';
import Entity from '../core/entity.class.js';
import Options from '../core/options.class.js';

import * as THREE from '../lib/three.js/three.module.js';

export default class Transition extends Entity {
    constructor(context, scene, options) {
        options = Options.castIfRequired(options);
        super(context, scene, options);

        const tScene = scene.getThreeScene();

        this._sceneTransition = new THREE.Scene();

        const materialWireframe = new THREE.LineBasicMaterial({
            color: 0x00aa00,
        });

        const materialWireframeRed = new THREE.LineBasicMaterial({
            color: 0xaa0000,
        });

        const originalMaze = tScene.getObjectByName('Maze');
        tScene.remove(originalMaze);

        this._objectMaze = new THREE.LineSegments(
            new THREE.EdgesGeometry(originalMaze.geometry), materialWireframe);
        this._sceneTransition.add(this._objectMaze);

        const originalDoor = originalMaze.getObjectByName('MazeDoor');
        this._objectDoor = new THREE.LineSegments(
            new THREE.EdgesGeometry(originalDoor.geometry), materialWireframe);
        this._objectDoor.position.copy(originalDoor.position);
        this._sceneTransition.add(this._objectDoor);

        const originalMask = originalMaze.getObjectByName('Mask');
        this._objectMask = new THREE.LineSegments(
            new THREE.EdgesGeometry(originalMask.geometry), materialWireframeRed);
        this._objectMask.position.copy(originalMask.position);
        this._objectMask.visible = false;
        this._sceneTransition.add(this._objectMask);

        const originalHead = originalMaze.getObjectByName('MonsterHead');
        const objectHead = new THREE.LineSegments(
            new THREE.EdgesGeometry(originalHead.geometry), materialWireframeRed);

        this._objectHeads = Array.from({ length: 6 }, (_, i) => {
            const objectNewHead = objectHead.clone();
            const coordinates = originalMaze.getObjectByName('MonsterHead00' + i);
            this._sceneTransition.add(objectNewHead);

            objectNewHead.position.copy(coordinates.position);
            objectNewHead.visible = false;

            return objectNewHead;
        });

        this._camera = new THREE.PerspectiveCamera(90, 1, 0.01, 5);
        this._sceneTransition.add(this._camera);

        this._computer = scene.findEntityOfType(Entity.getTypeByName('Computer'));

        this._finished = true;
        this._finishedCallback = null;
        this._time = 0;
        this._transitionName = null;
        this._ending = false;
    }

    update(context) {
        super.update(context);

        if (this._finished) {
            return;
        }

        this._time += context.time.elapsedSeconds;

        let done = false;

        switch (this._transitionName) {
            case 'enter':
                this._camera.position.set(4.5, 0, -7.2 - this._time * 0.3);
                this._camera.rotation.set(0, -0.1, this._time * 0.03);
                this._objectDoor.rotation.set(0, this._time * 0.5, 0);
                done = this._time >= 3;

                break;

            case 'descend':
                this._camera.position.set(
                    Math.cos(-this._time * 0.6) * 4.6,
                    -this._time * 1.5 * 0.6,
                    -10 + Math.sin(-this._time * 0.6) * 4.6);
                this._camera.rotation.set(0, this._time * 0.6 - 0.2, this._time * 0.2);
                done = this._time >= 1.5;

                break;

            case 'proceed':
                this._camera.position.set(2 + this._time, -7, -5.25);
                this._camera.rotation.set(0, -Math.PI / 2, 0);
                done = this._time >= 3;

                break;

            case 'proceed_fast':
                this._camera.position.set(2 + this._time * 2, -7, -5.25);
                this._camera.rotation.set(0, -Math.PI / 2, Math.sin(this._time * 7) * 0.05);
                done = this._time >= 3;

                break;

            case 'encounter':
                const distance = Math.pow(Math.max(0, 4 - this._time / 2), 2);

                this._camera.position.set(17.5 - distance, -7.05, -5.25);
                this._camera.rotation.set(0, -Math.PI / 2, 0);
                done = this._time >= 13;

                break;

            case 'scream':
                this._camera.position.set(100, 0, 0);
                this._camera.rotation.set(0, -Math.PI / 2, 0);
                done = this._time >= 1;

                break;

            case 'ending':
                this._camera.position.set(30 + this._time * 0.75, -7.05, -5.25);
                this._camera.rotation.set(0, -Math.PI / 2, 0);

                this._objectHeads.forEach((head, i) => {
                    head.position.setY(Math.sin(i * 13 + this._time) * 0.5 - 7);
                    head.lookAt(this._camera.position);
                });

               this._objectMask.position.setZ(this._camera.position.z);
               this._objectMask.position.setY(this._camera.position.y);
               this._objectMask.rotation.set(0, Math.max(-Math.PI / 2, 2 - this._time / 2), 0);

                if (this._time > 5) {
                    this._objectMask.position.x -= context.time.elapsedSeconds / 3;
                }

                done = this._time >= 12;

                break;
        }

        if (done) {
            this._finished = true;
            this._ending = false;
            this._finishedCallback();
        }

        if (!this._ending) {
            context.renderer.setRenderTarget(this._computer.getMonitorRenderTarget());
        }

        context.renderer.render(this._sceneTransition, this._camera);

        if (!this._ending) {
            context.renderer.setRenderTarget(null);
        }
    }

    getTransitionScene() {
        return this._sceneTransition;
    }

    playAction(context, name, finishedCallback, ending = false) {
        this._transitionName = name;
        this._finished = false;
        this._finishedCallback = finishedCallback;
        this._ending = ending;
        this._time = 0;

        if (ending) {
            const size = context.renderer.getSize(new THREE.Vector2());

            this._camera.aspect = size.x / size.y;
            this._camera.far = 100;
            this._camera.updateProjectionMatrix();
        }

        switch (name) {
            case 'enter':
                if (!ending) {
                    AudioManager.play('sound__virtual_door');
                }

                break;

            case 'descend':
                if (!ending) {
                    for (let i = 0; i < 7; i++) {
                        context.time.setTimeout(() => {
                            AudioManager.play('sound__virtual_footstep');
                        }, 100 + i * 200);
                    }
                }

                break;

            case 'proceed':
                if (!ending) {
                    for (let i = 0; i < 6; i++) {
                        context.time.setTimeout(() => {
                            AudioManager.play('sound__virtual_footstep');
                        }, 100 + i * 500);
                    }
                }

                break;

            case 'proceed_fast':
                for (let i = 0; i < 10; i++) {
                    context.time.setTimeout(() => {
                        AudioManager.play('sound__virtual_footstep');
                    }, 100 + i * 300);
                }

                break;

            case 'encounter':
                for (let i = 0; i < 15; i++) {
                    context.time.setTimeout(() => {
                        AudioManager.play('sound__virtual_footstep');
                    }, 100 + i * (200 + i * 20));
                }

                break;

            case 'scream':

                break;

            case 'ending':
                this._objectMask.visible = true;

                this._objectHeads.forEach(head => {
                    head.visible = true;
                });
        }
    }

    isEnding() {
        return this._ending;
    }

    stop() {
        this._finished = true;
        this._ending = false;
    }
}

Transition.p_register();
