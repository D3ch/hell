/**
 * @file monster.class.js
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
import ModelManager from '../core/modelmanager.class.js';
import Options from '../core/options.class.js';

import AnimationHelper from '../core/three.js/animationhelper.class.js';

import config from '../resources/config.js';

import * as THREE from '../lib/three.js/three.module.js';
import { SkeletonUtils } from '../lib/three.js/SkeletonUtils.js';

export default class Monster extends Entity {
    constructor(context, scene, options) {
        options = Options.castIfRequired(options);

        options.set('updatePriority', 1);

        super(context, scene, options);

        const tScene = scene.getThreeScene();

        const gltf = ModelManager.getModel('monster');

        this._rigReal = gltf.scene.getObjectByName('Monster');
        this._rigReal.position.set(0, -10, 0);
        this._rigReal.scale.set(1.3, 1.3, 1.3);

        this._rigVirtual = SkeletonUtils.clone(this._rigReal);
        this._rigVirtual.position.set(0, -10, 0);
        this._rigVirtual.scale.set(1.3, 1.3, 1.3);

        this._rigVirtual.traverse(object => object.frustumCulled = false);
        this._rigReal.traverse(object => object.frustumCulled = false);

        this._rigReal.remove(this._rigReal.getObjectByName('LowPoly'));
        this._rigVirtual.remove(this._rigVirtual.getObjectByName('HighPoly'));

        this._objectReal = this._rigReal.getObjectByName('HighPoly');
        this._objectReal.scale.set(0.01, 0.01, 0.01);

        this._objectVirtual = this._rigVirtual.getObjectByName('LowPoly');
        this._objectVirtual.scale.set(0.01, 0.01, 0.01);

        this._animatorReal = new AnimationHelper(this._rigReal, gltf.animations);
        this._animatorVirtual = new AnimationHelper(this._rigVirtual, gltf.animations);

        this._objectVirtual.material = new THREE.MeshBasicMaterial({
            color: 0xaa0000,
            skinning: true,
            wireframe: true,
        });

        this._objectReal.material = new THREE.MeshLambertMaterial({
            map: this._objectReal.material.map,
            emissive: 0xffffff,
            emissiveMap: this._objectReal.material.emissiveMap,
            skinning: true,
            specularMap: this._objectReal.material.metalnessMap,
        });

        tScene.add(this._rigReal);

        this._camera = new THREE.PerspectiveCamera(60, 1, 0.1, 50);
        this._camera.name = 'MonsterCamera';
        this._camera.rotateZ(Math.PI);
        this._camera.rotateX(-Math.PI / 2);
        this._rigReal.getObjectByName('camera').add(this._camera);

        this._lightMonster = new THREE.PointLight(0x00ff00, 0.01, 5);
        this._lightMonster.name = 'MonsterLight';
        this._camera.add(this._lightMonster);

        const transition = scene.findEntityOfType(Entity.getTypeByName('Transition'));
        transition.getTransitionScene().add(this._rigVirtual);

        this._objectFrame = tScene.getObjectByName('Frame000');
        this._objectChair = tScene.getObjectByName('Chair001');

        this._objectNeck = this._rigReal.getObjectByName('neck_01');

        this._player = scene.findEntityOfType(Entity.getTypeByName('Player'));

        this._action = null;
        this._actionName = null;
        this._secondsSinceStart = 0;
    }

    update(context) {
        super.update(context);

        this._secondsSinceStart += context.time.elapsedSeconds;

        let walkDistance;

        switch (this._actionName) {
            case 'touch_window':
                this._animatorReal.update(context.time.elapsedSeconds);

                break;

            case 'leave_window':
                this._animatorReal.update(context.time.elapsedSeconds);

                break;

            case 'close_door':
                const angle = Math.max(0, 0.2 - this._secondsSinceStart * 0.01) * Math.sin(context.time.totalSeconds * 2);
                this._objectFrame.rotation.set(0, 0, angle);

                break;

            case 'stare':
                this._rigReal.position.set(0, 0.1, -2.9);

                this._animatorReal.update(context.time.elapsedSeconds);

                break;

            case 'walk':
                walkDistance = Math.min(2.5, Math.max(0, this._secondsSinceStart - 5) * 0.09);

                this._rigReal.position.set(0, 0.1, -2.9 + walkDistance);

                const stepOld = this._action === null ? 0 : this._action.time / this._action.getClip().duration;

                this._animatorReal.update(context.time.elapsedSeconds);

                const stepNew = this._action === null ? 0 : this._action.time / this._action.getClip().duration;

                if (stepOld < 0.3 && stepNew >= 0.3 || stepOld < 0.8 && stepNew >= 0.8) {
                    AudioManager.play('sound__footstep', Math.min(0.8, this._secondsSinceStart / 20));
                }

                break;

            case 'behind_monitor':
                this._animatorReal.update(context.time.elapsedSeconds);

                break;

            case 'encounter':
                walkDistance = Math.min(2.5, Math.max(0, this._secondsSinceStart - 5) * 0.2);
                this._rigVirtual.position.set(23 - walkDistance, -8.4, -5.25);

                this._animatorVirtual.update(context.time.elapsedSeconds);

                break;

            case 'scream':
                this._animatorVirtual.update(context.time.elapsedSeconds);

                break;

            case 'ending':
                this._animatorReal.update(context.time.elapsedSeconds);

                const shakiness = Math.max(0, this._secondsSinceStart - 11) * 0.05;
                this._objectNeck.rotateX((Math.random() - 0.5) * shakiness);
                this._objectNeck.rotateY((Math.random() - 0.5) * shakiness);
                this._objectNeck.rotateZ((Math.random() - 0.5) * shakiness);
                this._objectNeck.updateMatrix();

                break;
        }
    }

    getCamera() {
        return this._camera;
    }

    playAction(context, name, finishedCallback = null) {
        this._actionName = name;
        this._secondsSinceStart = 0;

        switch (name) {
            case 'touch_window':
                this._animatorReal.playAction('TouchWindow', 1, 0, 0.1);
                this._rigReal.position.set(-0.2, -0.35, 1.5);
                this._rigReal.rotation.set(0, Math.PI, 0);

                break;

            case 'leave_window':
                this._animatorReal.playAction('LeaveWindow', 1, 0.1, 1);

                break;

            case 'close_door':
                this._objectChair.rotateY(-0.8);

                break;

            case 'stare':
                this._rigReal.rotation.set(0, 0, 0);

                this._animatorReal.playAction('Grab', Infinity, 0.1, 0);

                break;

            case 'walk':
                this._rigReal.rotation.set(0, 0, 0);

                this._action = this._animatorReal.playAction('Walk', 4, 2, 0.3, () => {
                    this._action = null;

                    context.time.setTimeout(() => {
                        AudioManager.play('sound__footstep', 0.8);

                        this._animatorReal.playAction('Grab', 1, 1, 0.4, () => {
                            finishedCallback();
                        });
                    }, 1000);
                });

                break;

            case 'hide':
                this._rigReal.position.set(0, -1000, 0);

                break;

            case 'behind_monitor':
                this._rigReal.position.set(0.1, -0.05, 1);
                this._rigReal.rotation.set(0, Math.PI, 0);

                this._animatorReal.playAction('BehindMonitor', 1, 0, 1, () => {
                    this._rigReal.position.set(0, -10, 0);
                });

                break;

            case 'encounter':
                this._rigVirtual.rotation.set(0, -Math.PI / 2, 0);

                this._animatorVirtual.playAction('Walk', 5, 0, 0.5);

                break;

            case 'scream':
                this._rigVirtual.position.set(100.3, -1.37, 0);
                this._rigVirtual.rotation.set(0, -Math.PI / 2, 0);

                this._animatorVirtual.playAction('Scream', 5, 0, 0.2);

                break;

            case 'ending':
                this._rigReal.position.set(0.07, -0.3, 1.1);
                this._rigReal.rotation.set(0, Math.PI, 0);

                this._animatorReal.playAction('Ending', 1);

                break;
        }
    }
}

Monster.p_register();
