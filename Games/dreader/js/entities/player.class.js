/**
 * @file player.class.js
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
import Input from '../core/input.class.js';
import ModelManager from '../core/modelmanager.class.js';
import Options from '../core/options.class.js';
import Utility from '../core/utility.class.js';

import AnimationHelper from '../core/three.js/animationhelper.class.js';

import config from '../resources/config.js';

import * as THREE from '../lib/three.js/three.module.js';

export default class Player extends Entity {
    static _init() {
        Player._tmpV0 = new THREE.Vector2();
        Player._tmpV1 = new THREE.Vector3();
    }

    constructor(context, scene, options) {
        options = Options.castIfRequired(options);

        options.set('updatePriority', 3);

        super(context, scene, options);

        const tScene = scene.getThreeScene();

        this._rig = tScene.getObjectByName('Player');

        this._camera = new THREE.PerspectiveCamera(10, 1, 0.08, 50);
        this._camera.name = 'PlayerCamera';

        const eyes = tScene.getObjectByName('Eyes');
        eyes.add(this._camera);

        const animations = ModelManager.getModel('world').animations;
        this._animator = new AnimationHelper(this._rig, animations);

        this._hand = this._rig.getObjectByName('hand_r');
        this._fingerLeft = this._rig.getObjectByName('index_01_r');
        this._fingerRight = this._rig.getObjectByName('middle_01_r');

        this._action = null;

        this._handPosition = new THREE.Vector2();
        this._handTargetPosition = new THREE.Vector2();

        this._lastFov = 0;
        this._fov = 0;
        this._fovTarget = 0;
        this._lookHeight = 0;
        this._lookHeightTarget = 0;

        this._firstUpdate = true;
        this._endingSeconds = null;
        this._mouseDisabled = false;

        this._lastMouseButtonLeft = false;
        this._lastMouseButtonRight = false;
    }

    handleResize(context) {
        super.handleResize(context);

        const size = context.renderer.getSize(Player._tmpV0);

        this._camera.aspect = size.x / size.y;
        this._camera.fov = config.debug.useFlyControls ? 90 : this._fov;
        this._camera.updateProjectionMatrix();
    }

    update(context) {
        super.update(context);

        if (this._endingSeconds !== null) {
            this._endingSeconds += context.time.elapsedSeconds;

            if (this._endingSeconds > 6) {
                this._camera.position.set(-0.1, Math.min(1.55, this._endingSeconds * 0.07), -0.5);
                this._camera.lookAt(0, 1.3, 0);

                this._fov = 30;
                this.handleResize(context);
            }

            return;
        }

        this._fov = Utility.damp(this._fov, this._fovTarget, 0.7, context.time.elapsedSeconds);
        this._lookHeight = Utility.damp(this._lookHeight, this._lookHeightTarget, 0.7, context.time.elapsedSeconds);
        if (Math.abs(this._lastFov - this._fov) > 0.000001) {
            this._lastFov = this._fov;
            this.handleResize(context);
        }

        const targetRotationX = Math.PI / 2 - this._handTargetPosition.y * 0.03;
        const targetRotationY = this._handTargetPosition.x * 0.03;
        const targetRotationZ = Math.PI + Math.sin(context.time.totalSeconds / 3) *
            0.02 + Math.sin(context.time.totalSeconds / 3) * 0.02;

        const dampFactor = this._firstUpdate ? 0 : 0.1;

        this._camera.rotation.x = Utility.damp(this._camera.rotation.x, targetRotationX, dampFactor, context.time.elapsedSeconds);
        this._camera.rotation.y = Utility.damp(this._camera.rotation.y, targetRotationY, dampFactor, context.time.elapsedSeconds);
        this._camera.rotation.z = Utility.damp(this._camera.rotation.z, targetRotationZ, dampFactor, context.time.elapsedSeconds);

        const clip = this._action.getClip();
        if (clip.name === 'Stare') {
            this._action.time = this._lookHeight * clip.duration;
        }

        this._animator.update(context.time.elapsedSeconds);

        this._handPosition.lerp(this._handTargetPosition, 0.5);
        this._hand.parent.worldToLocal(this._hand.position.set(
            -0.13 - this._handPosition.x * 0.07, 0.8, 0.31 + this._handPosition.y * 0.07));

        if (this._mouseDisabled) {
            Input.setCursorStyle('none');
            return;
        }

        const mouseButtonLeft = Input.getMouseButton();
        const mouseButtonRight = Input.getMouseButton(2);

        if (this._lastMouseButtonLeft !== mouseButtonLeft) {
            AudioManager.play(mouseButtonLeft ? 'sound__mouse_down' : 'sound__mouse_up');

            this._fingerLeft.rotation.set(-0.24, Input.getMouseButton() ? -0.82 : -0.75, -0.38);
        }
        if (this._lastMouseButtonRight !== mouseButtonRight) {
            AudioManager.play(mouseButtonRight ? 'sound__mouse_down' : 'sound__mouse_up');

            this._fingerRight.rotation.set(-0.54, Input.getMouseButton(2) ? -0.7 : -0.61, -0.12);
        }

        this._lastMouseButtonLeft = mouseButtonLeft;
        this._lastMouseButtonRight = mouseButtonRight;

        this._firstUpdate = false;
    }

    getAudioListener() {
        return this._audioListener;
    }

    getCamera() {
        return this._camera;
    }

    setHandPosition(position) {
        this._handTargetPosition.copy(position);
    };

    setFovLevel(level) {
        switch (level) {
            case 0:
                this._action = this._animator.playAction('Intro', 1, 0, 0.3, () => {
                    this._action = this._animator.playAction('Stare', 1, 0, 0);
                });
                this._fov = 15;
                this._fovTarget = 25;

                break;

            case 1:
                this._fovTarget = 43;

                break;

            case 2:
                this._fovTarget = 55;
                this._lookHeightTarget = 0.2;

                break;

            case 3:
                this._fovTarget = 61;
                this._lookHeightTarget = 0.35;

                break;

            case 4:
                this._fovTarget = 67;
                this._lookHeightTarget = 0.5;

                break;
        }
    }

    playAction(context, name) {
        switch (name) {
            case 'look_behind':
                this._action = this._animator.playAction('LookBehind', 1, 0.5, 0.6, () => {
                    this._action = this._animator.playAction('Stare', 1, 0.5, 0);
                });

                break;

            case 'gone':
                this._updating = false;

                this._rig.position.set(0, -10, 0);

                this._camera.parent.remove(this._camera);
                this._camera.position.set(2, 2.3, -2.6);
                this._camera.lookAt(0, 1, 0);

                this._fov = 80;
                this.handleResize(context);

                this._endingSeconds = 0;

                break;

            case 'ending':
                this._animator.playAction('Ending', 1, 0.5);

                this._mouseDisabled = true;

                break;
        }
    }

    jump(amount) {
        this._camera.rotation.z -= amount;
    }
}

Player._init();
Player.p_register();
