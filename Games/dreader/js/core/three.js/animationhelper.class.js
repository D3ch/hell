/**
 * @file animationhelper.class.js
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

export default class AnimationHelper {
    constructor(rootObject, animations) {
        this._animations = animations;

        this._mixer = new THREE.AnimationMixer(rootObject);
        this._mixer.addEventListener('finished', e => {
            if (e.action.finishedCallback !== null) {
                e.action.finishedCallback();
            }
        });

        this._action = null
    }

    update(elapsedSeconds) {
        this._mixer.update(elapsedSeconds);
    }

    stopAllAction() {
        this._mixer.stopAllAction();
    }

    playAction(animationName, repetitions = Infinity,
        crossFadeDuration = 0, timescale = 1, finishedCallback = null) {
        const animation = this._animations.find(animation => animation.name === animationName);
        if (animation === undefined) {
            throw new Error(`Animation "${animationName}" does not exist`);
        }

        const lastAction = this._action;

        this._action = this._mixer.clipAction(animation);
        this._action.finishedCallback = finishedCallback;
        this._action.repetitions = repetitions;
        this._action.timeScale = timescale;
        this._action.clampWhenFinished = true;
        this._action.stop();

        if (lastAction !== null) {
            if (crossFadeDuration > 0) {
                this._action.crossFadeFrom(lastAction, crossFadeDuration);
            } else {
                lastAction.stop();
            }
        }

        this._action.play();

        return this._action;
    }

    setTimeScale(value) {
        if (this._action !== null) {
            this._action.timeScale = value;
        }
    }
}
