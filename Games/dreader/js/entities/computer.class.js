/**
 * @file computer.class.js
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
import Options from '../core/options.class.js';

import config from '../resources/config.js';

import MonitorMaterial from '../core/game/monitormaterial.class.js';

import * as THREE from '../lib/three.js/three.module.js';

export default class Computer extends Entity {
    static _init() {
        Computer._renderTargetSize = new THREE.Vector2(512, 512);

        Computer._raycaster = new THREE.Raycaster();
        Computer._tmpV0 = new THREE.Vector2();
        Computer._tmpArray = [];

        Computer._audioVolumeWind = 0.6;
        Computer._audioVolumeHum = 0.8;
        Computer._audioVolumeAtmosphere = 1;
        Computer._audioVolumeStatic = 1.5;
    }

    constructor(context, scene, options) {
        options = Options.castIfRequired(options);

        options.set('updatePriority', 2);

        super(context, scene, options);

        const tScene = scene.getThreeScene();

        this._rtMonitor = new THREE.WebGLRenderTarget(Computer._renderTargetSize.x, Computer._renderTargetSize.y);

        this._objectMonitor = tScene.getObjectByName('Monitor');

        this._objectMonitorInterior = tScene.getObjectByName('MonitorInterior');
        this._objectMonitorInterior.visible = false;

        this._objectMonitorInterior.material = new THREE.MeshBasicMaterial({ color: 0 });

        this._objectScreen = tScene.getObjectByName('Screen');
        this._objectScreen.material = new MonitorMaterial({
           map: this._rtMonitor.texture,
        });

        this._objectScreenBroken = tScene.getObjectByName('ScreenBroken');
        this._objectScreenBroken.material = this._objectScreen.material;
        this._objectScreenBroken.visible = false;

        this._objectExplosion = tScene.getObjectByName('Explosion');
        this._objectExplosion.visible = false;
        this._objectExplosion.material.blending = THREE.AdditiveBlending;
        this._objectExplosion.needsUpdate = true;

        this._lightMonitor = tScene.getObjectByName('LightMonitor_Orientation');
        this._lightScreen = tScene.getObjectByName('LightScreen_Orientation');

        this._lightMonitor.intensity *= 1.3;
        this._lightScreen.intensity *= 1.5;

        this._lightScreen.distance = 6;
        this._lightScreen.penumbra = 1;
        this._lightScreen.angle = 0.9;

        this._lightMonitorIntensity = this._lightMonitor.intensity;
        this._lightScreenIntensity = this._lightScreen.intensity;

        this._lightMonster = null;

        this._objectSky = tScene.getObjectByName('DarkSky');
        this._objectSky.visible = false;

        this._materialWireframe = new THREE.MeshBasicMaterial({
            color: 0x00aa00,
            wireframe: true,
        });

        this._shakingObjects = [];

        this._player = this.getScene().findEntityOfType(Entity.getTypeByName('Player'));

        this._audioStatic = null;
        this._audioHum = null;
        this._audioWind = null;
        this._audioAtmosphere = null;

        this._maze = null;

        this._noiseStrengthFrom = 0;
        this._noiseStrengthTo = 0;
        this._lightIntensityFrom = 1;
        this._lightIntensityTo = 1;
        this._lightIntensity = 1;
        this._noiseDuration = 1;
        this._noiseSeconds = 0;
        this._staticVolume = 1;

        this._explodeSeconds = null;

        this._audioFadeDuration = null;
        this._audioFadeSeconds = null;

        this._disabled = false;
    }

    update(context) {
        super.update(context);

        if (this._maze === null) {
            this._maze = this.getScene().findEntityOfType(Entity.getTypeByName('Maze'))
        }

        if (!this._disabled) {
            const cursorPosition = Input.getCursorPosition(Computer._tmpV0);
            cursorPosition.x = (cursorPosition.x / window.innerWidth) * 2 - 1;
            cursorPosition.y = -((cursorPosition.y / window.innerHeight) * 2 - 1);
            Computer._raycaster.setFromCamera(cursorPosition, this._player.getCamera());

            const intersects = Computer._raycaster.intersectObject(this._objectScreen, Computer._tmpArray);
            if (intersects.length > 0) {
                this._maze.setCursorPosition(intersects[0].uv);
                this._player.setHandPosition(intersects[0].uv);
            } else {
                this._maze.hideCursor();
            }
        }

        if (this._audioFadeDuration !== null) {
            this._audioFadeSeconds += context.time.elapsedSeconds;

            const t = Math.max(0, 1 - this._audioFadeSeconds / this._audioFadeDuration);

            this._audioWind.setVolume(t * Computer._audioVolumeWind * config.audio.volume);
            this._audioHum.setVolume(t * Computer._audioVolumeHum * config.audio.volume);
            this._audioAtmosphere.setVolume(t * Computer._audioVolumeAtmosphere * config.audio.volume);

            if (t === 0) {
                this._audioFadeDuration = null;
            }
        }

        this._objectScreen.material.time = context.time.totalSeconds;

        if (this._noiseSeconds >= 0) {
            this._noiseSeconds -= context.time.elapsedSeconds;
            const t = Math.max(0, this._noiseSeconds / this._noiseDuration);

            const noiseIntensity = this._noiseStrengthFrom * t + this._noiseStrengthTo * (1 - t);
            this._lightIntensity = this._lightIntensityFrom * t + this._lightIntensityTo * (1 - t);

            this._objectScreen.material.noiseStrength = noiseIntensity;

            if (this._audioStatic !== null) {
                this._audioStatic.setVolume(Math.min(noiseIntensity, 1) *
                    this._staticVolume * Computer._audioVolumeStatic * config.audio.volume);
            }
        }

        this.updateLights();

        if (this._explodeSeconds !== null) {
            this._explodeSeconds += context.time.elapsedSeconds;

            this._objectExplosion.visible = true;
            this._objectExplosion.scale.setLength(this._explodeSeconds * 4 + 0.01);

            if (this._explodeSeconds > 0.2) {
                this._explodeSeconds = null;
                this._objectExplosion.visible = false;
            }
        }

        this._shakingObjects.forEach(object => {
            object.position.set(
                THREE.MathUtils.clamp(object.position.x + Math.random() * 0.1 - 0.05, object.originalPosition.x - 0.3, object.originalPosition.x + 0.3),
                THREE.MathUtils.clamp(object.position.y + Math.random() * 0.1 - 0.05, object.originalPosition.y - 0.3, object.originalPosition.y + 0.3),
                THREE.MathUtils.clamp(object.position.z + Math.random() * 0.1 - 0.05, object.originalPosition.z - 0.3, object.originalPosition.z + 0.3));

            object.updateMatrix();
        });
    }

    getMonitorRenderTarget() {
        return this._rtMonitor;
    }

    showNoise(fromStrength, toStrength, duration, fromLightIntensity = 1, toLightIntensity = 1, staticVolume = 1) {
        this._noiseStrengthFrom = fromStrength;
        this._noiseStrengthTo = toStrength;
        this._lightIntensityFrom = fromLightIntensity;
        this._lightIntensityTo = toLightIntensity;
        this._noiseDuration = duration;
        this._noiseSeconds = duration;
        this._staticVolume = staticVolume;

        if (this._audioStatic !== null) {
            this._audioStatic.setVolume(0.01);

            AudioManager.getAudioInstance('sound__static').play();
        }
    }

    explode(context) {
        this._explodeSeconds = 0;

        this._lightMonitor.position.y += 0.5;

        const tScene = this.getScene().getThreeScene();

        this._objectMonitorInterior.visible = true;

        context.time.setTimeout(() => {
            this._objectScreen.visible = false;
            this._objectScreenBroken.visible = true;
        }, 200);

        context.time.setTimeout(() => {
            tScene.traverse(object => {
                if (object.material !== undefined && !object.material.skinning &&
                    object !== this._objectMonitor) {
                    if (object.material !== undefined) {
                        object.originalMaterial = object.material;
                    }

                    object.originalPosition = object.position.clone();

                    this._shakingObjects.push(object);
                }
            });
        }, 9500);

        context.time.setTimeout(() => {
            this._shakingObjects.forEach(object => object.material = this._materialWireframe);

            context.renderer.setClearColor('#000000');
        }, 11000);
    }

    setMonsterLights() {
        this._lightMonitor.intensity = 0;
        this._lightScreen.intensity = 0;
        this._lightMonster.intensity = 1;

        this._objectSky.visible = true;
    }

    updateLights() {
        if (this._lightMonster === null) {
            this._lightMonster = this.getScene().getThreeScene().getObjectByName('MonsterLight');
        }

        this._lightMonitor.intensity = this._lightMonitorIntensity * this._lightIntensity;
        this._lightScreen.intensity = this._lightScreenIntensity * this._lightIntensity;
        this._lightMonster.intensity = 0;

        this._objectSky.visible = false;
    }

    playAmbient() {
        if (this._audioHum === null) {
            const audioListener = new THREE.AudioListener();
            audioListener.name = 'AudioListener';
            this._player.getCamera().add(audioListener);

            this._audioStatic = new THREE.PositionalAudio(audioListener)
                .setMediaElementSource(AudioManager.getAudioInstance('sound__static'));
            this._objectMonitor.add(this._audioStatic);

            this._audioHum = new THREE.PositionalAudio(audioListener)
                .setMediaElementSource(AudioManager.getAudioInstance('sound__computer_hum'));
            AudioManager.getAudioInstance('sound__computer_hum').loop = true;
            this._objectMonitor.add(this._audioHum);

            this._audioWind = new THREE.Audio(audioListener)
                .setMediaElementSource(AudioManager.getAudioInstance('sound__wind_howling'));
            AudioManager.getAudioInstance('sound__wind_howling').loop = true;

            this._audioAtmosphere = new THREE.Audio(audioListener)
                .setMediaElementSource(AudioManager.getAudioInstance('sound__atmosphere'));
            AudioManager.getAudioInstance('sound__atmosphere').loop = true;
            this._objectMonitor.add(this._audioAtmosphere);
        }

        AudioManager.getAudioInstance('sound__computer_hum').play();
        AudioManager.getAudioInstance('sound__wind_howling').play();

        this._audioHum.setVolume(Computer._audioVolumeHum * config.audio.volume);
        this._audioWind.setVolume(Computer._audioVolumeWind * config.audio.volume);
    }

    playHorrorAmbient() {
        AudioManager.getAudioInstance('sound__atmosphere').play();

        this._audioAtmosphere.setVolume(Computer._audioVolumeAtmosphere * config.audio.volume);
    }

    fadeAmbient(duration = 0.1) {
        this._audioFadeDuration = duration;
        this._audioFadeSeconds = 0;
    }

    reset(context) {
        this._disabled = true;

        this._maze.hideCursor();

        this._shakingObjects.forEach(object => {
            object.material = object.originalMaterial;
            object.position.copy(object.originalPosition);
        });

        this._shakingObjects.length = 0;

        this._lightMonitor.position.y -= 0.5;

        this._objectScreen.visible = true;
        this._objectScreenBroken.visible = false;
        this._objectMonitorInterior.visible = false;

        context.renderer.setClearColor('#001a00');
    }
}

Computer._init();
Computer.p_register();
