/**
 * @file gameclient.class.js
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

import AudioManager from './audiomanager.class.js';
import Context from './context.class.js';
import Input from './input.class.js';
import ModelManager from './modelmanager.class.js';
import Time from './time.class.js';

import MazeManager from './game/mazemanager.class.js';

import config from '../resources/config.js';

import MainScene from '../scenes/mainscene.class.js';

import * as THREE from '../lib/three.js/three.module.js';

export default class GameClient {
    static _init() {
        GameClient._instance = null;

        window.addEventListener('load', () => {
            let creditsVisible = false;

            const elementLoading = document.querySelector('.loading');
            const elementCredits = document.querySelector('.credits');
            const linkShowCredits = document.querySelector('.show-credits');
            linkShowCredits.addEventListener('click', () => {
                creditsVisible = !creditsVisible;

                GameClient._instance._updating = !creditsVisible;

                Input.setCursorStyle();

                elementCredits.style.visibility = creditsVisible ? 'visible' : 'hidden';
            });

            const font = new FontFace('DefaultFont', 'url(./fonts/Recursive-SemiBold.ttf)');

            font.load()
                .then(font => {
                    document.fonts.add(font);
                    return AudioManager.asyncLoadSounds();
                })
                .then(() => ModelManager.asyncLoadModels())
                .then(() => MazeManager.asyncLoadData())
                .then(() => {
                    elementLoading.style.visibility = 'hidden';
                    linkShowCredits.style.visibility = 'visible';

                    GameClient._instance = new GameClient();
                    GameClient._instance.setScene(MainScene);
                });
        });
    }

    constructor() {
        this._canvas = document.querySelector('canvas');

        this._clock = new THREE.Clock(false);

        this._renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            antialias: config.renderer.antialias,
        });
        this._renderer.setPixelRatio(window.devicePixelRatio / config.renderer.pixelSize);
        this._renderer.setClearColor('#001a00');

        this._time = new Time();
        this._context = new Context(this, this._time, this._renderer);

        this._scene = null;

        window.addEventListener('resize', this._handleResize.bind(this));

        Input.setContextMenuEnabled(false);

        this._updating = true;

        this._clock.start();
        this._renderer.setAnimationLoop(this._update.bind(this));
    }

    _handleResize() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);

        if (this._scene !== null) {
            this._scene.handleResize(this._context);
        }
    }

    _update(time) {
        this._time.addElapsedSeconds(Math.min(this._clock.getDelta(), config.maxTimestep));

        if (this._updating) {
            this._scene.update(this._context);
        }

        Input.resetState();
    }

    setScene(type) {
        if (this._scene !== null) {
            this._scene.destroy(this._context);
        }
        this._scene = new type(this._context);
        this._handleResize();
    }

    hideTitle() {
        document.querySelector('.credits').style.visibility = 'hidden';
        document.querySelector('.show-credits').style.visibility = 'hidden';
    }
}

GameClient._init();
