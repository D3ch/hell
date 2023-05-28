/**
 * @file maze.class.js
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
import Utility from '../core/utility.class.js';

import CanvasPlane from '../core/three.js/canvasplane.class.js';

import * as THREE from '../lib/three.js/three.module.js';

export default class Maze extends Entity {
    static _init() {
        Maze._levelSize = new THREE.Vector2(512, 512);
        Maze._scale = 4;
    }

    constructor(context, scene, options) {
        options = Options.castIfRequired(options);

        options.set('updatePriority', -1);

        super(context, scene, options);

        const tScene = scene.getThreeScene();

        this._rtCamera = new THREE.WebGLRenderTarget(64, 64);

        this._sceneMaze = new THREE.Scene();

        this._objectBackground = new CanvasPlane(Maze._levelSize.x, Maze._levelSize.y, 1, 0, 0);
        this._objectBackground.renderOrder = -1;
        this._sceneMaze.add(this._objectBackground);

        this._objectCameraViewport = new THREE.Mesh(
            new THREE.PlaneGeometry(),
            new THREE.MeshBasicMaterial({
                map: this._rtCamera.texture,
            })
        );
        this._sceneMaze.add(this._objectCameraViewport);

        this._camera = new THREE.OrthographicCamera(0, Maze._levelSize.x, Maze._levelSize.y, 0, 1, 11);
        this._camera.position.set(0, 0, 10);
        this._sceneMaze.add(this._camera);

        this._objectCursor = new CanvasPlane(64, 64, 0.8, 0, 1.01);
        Maze.drawCursor(this._objectCursor.getContext2D(), 1, 1, 2);
        this._sceneMaze.add(this._objectCursor);

        this._objectMonster = new CanvasPlane(64, 64, 0.8, 0, 1.01);
        this._objectMonster.frustumCulled = false;
        Maze.drawCursor(this._objectMonster.getContext2D(), 1, 1, 2, '#ff0000');
        this._sceneMaze.add(this._objectMonster);


        this._computer = scene.findEntityOfType(Entity.getTypeByName('Computer'));
        this._monster = scene.findEntityOfType(Entity.getTypeByName('Monster'));

        this._levelObjects = new Map();
        this._levelIndex = 0;

        this._running = false;
        this._entered = true;

        this._finishedCallback = null;
        this._eventCallback = null;

        this._lastCursorPosition = new THREE.Vector2();
        this._cursorPosition = new THREE.Vector2(-100, 0);
        this._cursorHidden = false;

        this._dirty = true;
        this._toDraw = [];
        this._isInside = [];
    }

    update(context) {
        super.update(context);

        if (!this._running) {
            return;
        }

        let renderMonsterCamera = false;

        const dx = this._cursorPosition.x - this._lastCursorPosition.x;
        const dy = this._cursorPosition.y - this._lastCursorPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const cursorSteps = Math.ceil(distance / 8);
        const cursorStepX = dx / cursorSteps;
        const cursorStepY = dy / cursorSteps;

        this._lastCursorPosition.copy(this._cursorPosition);

        for (let step = 0; step < cursorSteps; step++) {
            this._isInside[step] = false;
        }

        const lastEntered = this._entered;

        const objects = this._levelObjects.get(this._levelIndex);
        objects.forEach(object => {
            object.toUpdate = object.enabled && (this._entered ||
                object.options.get('ignoreEntered', false) ||
                object.options.get('action', null) === 'enter');

            if (!object.toUpdate) {
                return;
            }

            object.newHovered = false;

            let x = this._cursorPosition.x;
            let y = this._cursorPosition.y;
            for (let step = 0; step <= cursorSteps; step++) {
                const hovered = Utility.isPointInPolygon(
                    x - object.position.x,
                    Maze._levelSize.y - y - object.position.y, object.vertices);
                object.newHovered = hovered || object.newHovered;

                if (hovered && object.type === 'corridor') {
                    this._isInside[step] = true;
                }

                x -= cursorStepX;
                y -= cursorStepY;
            }
        });

        if (lastEntered) {
            for (let step = 0; step < cursorSteps; step++) {
                if (!this._isInside[step]) {
                    this._running = false;

                    this._finishedCallback('lose');
                    return;
                }
            }
        }

        objects.forEach(object => {
            if (!object.toUpdate) {
                return;
            }

            if (object.type === 'monster') {
                const dx = this._cursorPosition.x - object.position.x;
                const dy = Maze._levelSize.y - this._cursorPosition.y - object.position.y;

                const length = Math.sqrt(dx * dx + dy * dy);

                object.position.x += dx / length * context.time.elapsedSeconds * 50;
                object.position.y += dy / length * context.time.elapsedSeconds * 50;

                this._objectMonster.position.x = object.position.x;
                this._objectMonster.position.y = Maze._levelSize.y - object.position.y;

                if (length < 15) {
                    this._running = false;

                    this._finishedCallback('scream_lose');
                    return;
                }
            }

            if (object.type === 'camera') {
                this._objectCameraViewport.position.set(
                    Math.round(object.position.x),
                    Math.round(Maze._levelSize.y - object.position.y),
                    2);

                const sizeX = Math.round(object.size.x - 4);
                const sizeY = Math.round(object.size.y - 4);

                if (this._rtCamera.width !== sizeX || this._rtCamera.height !== sizeY) {
                    this._rtCamera.setSize(sizeX, sizeY);
                }

                this._objectCameraViewport.scale.set(sizeX, sizeY, 1);
                renderMonsterCamera = true;
            }

            let triggered = false;

            const lastTime = object.time;
            object.time += context.time.elapsedSeconds;

            if (object.options.has('triggerTime') &&
                Math.floor(lastTime / object.options.get('triggerTime')) !==
                Math.floor(object.time / object.options.get('triggerTime'))) {
                if (object.options.get('repeat', false) && !object.options.get('noNoise', false)) {
                    AudioManager.play('sound__virtual_timer');
                }

                triggered = true;
            }

            let touchTrigger = false;
            if (object.options.get('triggerOnTouch', false) && object.newHovered) {
                triggered = true;
                touchTrigger = true;
            }

            const active = object.type === 'button' && object.newHovered && Input.getMouseButton();
            if (object.active && !active) {
                if (!object.options.get('noNoise', false)) {
                    AudioManager.play('sound__virtual_button');
                }

                triggered = true;
            }

            if (object.type === 'button' &&
                (object.hovered !== object.newHovered || object.active !== active)) {
                this._dirty = true;
            }

            object.hovered = object.newHovered;
            object.active = active;

            if (triggered) {
                object.enabled = object.options.get('repeat', false);

                let destroyed = false;

                objects.forEach(object2 => {
                    if (object2.options.get('name') === object.options.get('triggerName', null)) {
                        object2.enabled = !object2.enabled;

                        if (object2.type === 'corridor') {
                            destroyed = true;
                        }
                    }
                });

                if (touchTrigger && destroyed && !object.options.get('noNoise', false)) {
                    AudioManager.play('sound__virtual_break');
                }

                this._dirty = true;

                if (object.options.has('eventName')) {
                    this._eventCallback(object.options.get('eventName'));
                }

                switch (object.options.get('action', null)) {
                    case 'finish':
                        this.hideCursor();

                        this._running = false;

                        this._finishedCallback(object.options.get('transitionType', null));

                        break;

                    case 'enter':
                        this._entered = true;

                        break;
                }
            }
        });

        if (this._dirty) {
            this._dirty = false;

            this._toDraw.length = 0;

            this._levelObjects.get(this._levelIndex).forEach(object => {
                const entered = this._entered ||
                    object.options.get('ignoreEntered', false) ||
                    object.options.get('action', null) === 'enter';

                if (entered && object.enabled && object.type !== '') {
                    this._toDraw.push(object);
                }
            });

            const ctx = this._objectBackground.getContext2D();

            ctx.fillStyle = '#001a00';
            ctx.fillRect(0, 0, Maze._levelSize.x, Maze._levelSize.y);

            for (let layer = 0; layer < 3; layer++) {
                this._toDraw.forEach(object => {
                    Maze.drawObject(ctx, object, layer);
                });
            }

            this._objectBackground.updateTexture();
        }

        if (renderMonsterCamera) {
            context.renderer.setRenderTarget(this._rtCamera);
            this._computer.setMonsterLights();
            context.renderer.render(this.getScene().getThreeScene(), this._monster.getCamera());
            this._computer.updateLights();
        } else {
            this._objectCameraViewport.position.set(0, 0, -1);
        }
        context.renderer.setRenderTarget(this._computer.getMonitorRenderTarget());
        context.renderer.render(this._sceneMaze, this._camera);
        context.renderer.setRenderTarget(null);
    }

    addObject(vertices, options) {
        if (options.get('type') === 'grid') {
            return;
        }

        vertices.forEach(p => p.multiplyScalar(Maze._scale));

        const position = new THREE.Vector2(
            vertices.reduce((a, p) => a + p.x, 0),
            vertices.reduce((a, p) => a + p.y, 0)).divideScalar(vertices.length);

        vertices.forEach(p => p.sub(position));

        const levelIndex = Math.floor(position.x / Maze._levelSize.x);
        position.x -= levelIndex * Maze._levelSize.x + 8;

        if (!this._levelObjects.has(levelIndex)) {
            this._levelObjects.set(levelIndex, []);
        }

        this._levelObjects.get(levelIndex).push({
            type: options.get('type'),
            position: new THREE.Vector2(),
            originalPosition: position,
            vertices,
            options,
            size: options.get('size', new THREE.Vector2()).multiplyScalar(Maze._scale),
            time: 0,
            enabled: false,
            hovered: false,
            active: false,
            toUpdate: false,
            newHovered: false,
        });
    }

    startLevel(levelIndex, finishedCallback, eventCallback = null) {
        if (!this._levelObjects.has(levelIndex)) {
            this._levelObjects.set(levelIndex, []);
        }
        this._levelIndex = levelIndex;

        this._running = true;
        this._entered = false;

        this._dirty = true;

        this._finishedCallback = finishedCallback;
        this._eventCallback = eventCallback;

        this._levelObjects.get(this._levelIndex).forEach(object => {
            object.position.copy(object.originalPosition);
            object.time = 0;
            object.enabled = object.options.get('enabled', true);
            object.hovered = false;
            object.active = false;
        });

        this._objectMonster.position.set(256, 650, 3);
    }

    setCursorPosition(position) {
        this._cursorPosition.set(
            position.x * Maze._levelSize.x - 8,
            position.y * Maze._levelSize.y);

        this._objectCursor.position.set(
            this._cursorPosition.x,
            this._cursorPosition.y, 3);

        if (this._cursorHidden) {
            Input.setCursorStyle('none');
        }
        this._cursorHidden = false;
    }

    hideCursor() {
        this._cursorPosition.set(0, 0);

        this._objectCursor.position.setZ(-100);

        if (!this._cursorHidden) {
            Input.setCursorStyle();
        }
        this._cursorHidden = true;
    }

    static drawCursor(ctx, x = 0, y = 0, scale = 1, color = '#ffffff') {
        ctx.setTransform(scale, 0, 0, scale, x, y);

        ctx.beginPath();

        ctx.moveTo(0, 0);
        ctx.lineTo(13, 11.5);
        ctx.lineTo(7.1, 11.5);
        ctx.lineTo(10.1, 17.9);
        ctx.lineTo(7.3, 19.2);
        ctx.lineTo(4, 12.8);
        ctx.lineTo(0, 17);

        ctx.closePath();

        ctx.lineWidth = 1;
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000000';
        ctx.fill();
        ctx.stroke();
    }

    static drawObject(ctx, object, layer) {
        switch (object.type) {
            case 'corridor':
                ctx.beginPath();

                for (let i = 0; i < object.vertices.length; i++) {
                    const p0 = object.vertices[i];
                    const p1 = object.vertices[(i + 1) % object.vertices.length];

                    const dx = p1.x - p0.x;
                    const dy = p1.y - p0.y;
                    const l = Math.sqrt(dx * dx + dy * dy);
                    const tx = dy / l;
                    const ty = -dx / l;

                    const s = 6 - layer * 3;

                    const x0 = object.position.x + p0.x + tx * s;
                    const y0 = object.position.y + p0.y + ty * s;
                    const x1 = object.position.x + p1.x + tx * s;
                    const y1 = object.position.y + p1.y + ty * s;

                    if (i === 0) {
                        ctx.moveTo(x0, y0);
                    } else {
                        ctx.lineTo(x0, y0);
                    }
                    ctx.lineTo(x1, y1);
                }

                ctx.closePath();

                const red = object.options.get('isRed', false);

                ctx.fillStyle = layer === 1 ? '#001a00' : red ? '#b84545' : '#1d9435';

                ctx.fill();

                break;

            case 'button':
                if (layer < 2) {
                    return;
                }

                const buttonColor = object.options.get('isRed', false) ?
                    object.hovered ? '#d16161' : '#b84545' : object.active ? '#65ff5e' : object.hovered ? '#6ec85e' : '#2c8b1b';
                const borderColor = object.active ? '#ffffff' : object.hovered ? '#000000' : '#000000';
                const edgeWidth = 18;

                ctx.beginPath();

                ctx.moveTo(object.position.x - object.size.x / 2, object.position.y - object.size.y / 2);
                ctx.lineTo(object.position.x + object.size.x / 2 - edgeWidth, object.position.y - object.size.y / 2);
                ctx.lineTo(object.position.x + object.size.x / 2, object.position.y - object.size.y / 2 + edgeWidth);
                ctx.lineTo(object.position.x + object.size.x / 2, object.position.y + object.size.y / 2);
                ctx.lineTo(object.position.x - object.size.x / 2, object.position.y + object.size.y / 2);

                ctx.closePath();

                ctx.fillStyle = buttonColor;
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 4;

                ctx.fill();
                ctx.stroke();

                ctx.beginPath();

                ctx.moveTo(object.position.x + object.size.x / 2 - edgeWidth, object.position.y - object.size.y / 2);
                ctx.lineTo(object.position.x + object.size.x / 2, object.position.y - object.size.y / 2 + edgeWidth);
                ctx.lineTo(object.position.x + object.size.x / 2 - edgeWidth, object.position.y - object.size.y / 2 + edgeWidth);

                ctx.fillStyle = borderColor;

                ctx.fill();

                ctx.font = `${object.options.get('pixelsize')}px "DefaultFont"`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(object.options.get('text'), object.position.x, object.position.y);

                break;

            case 'label':
                if (layer < 2) {
                    return;
                }

                ctx.font = `${object.options.get('pixelsize')}px "DefaultFont"`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = object.options.get('color');
                ctx.fillText(object.options.get('text'), object.position.x, object.position.y);

                break;

            case 'camera':
                if (layer < 2) {
                    return;
                }

                ctx.fillStyle = '#2c8b1b';
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 4;

                ctx.fillRect(
                    object.position.x - object.size.x / 2,
                    object.position.y - object.size.y / 2 - 20, object.size.x, 20);
                ctx.strokeRect(
                    object.position.x - object.size.x / 2,
                    object.position.y - object.size.y / 2 - 20, object.size.x, 20);
                ctx.strokeRect(
                    object.position.x - object.size.x / 2,
                    object.position.y - object.size.y / 2, object.size.x, object.size.y);

                break;
        }
    }
}

Maze._init();
Maze.p_register();
