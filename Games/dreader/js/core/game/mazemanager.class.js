/**
 * @file mazemanager.class.js
 * @version 1.0.0
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

import Entity from '../entity.class.js';
import Options from '../options.class.js';

import config from '../../resources/config.js';

import * as THREE from '../../lib/three.js/three.module.js';

export default class MazeManager {
    static _init() {
        MazeManager._data = null;
    }

    static asyncLoadData() {
        const url = `./data/maze.json${config.debug.preventCaching ? '?time=' + new Date().getTime() : ''}`;

        return fetch(url, { cache: 'no-cache' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                return response.json();
            })
            .then(data => {
                MazeManager._data = data;
            })
            .catch(error => {
                throw new Error(`Error loading data file "${url}", ${error}`);
            });
    }

    static createMaze(context, scene, options) {
        const maze = Entity.createByName('Maze', context, scene, options);

        MazeManager._data.layers.forEach(layer => layer.objects.forEach(object => {
            let vertices;
            if (object.hasOwnProperty('polygon')) {
                vertices = object.polygon.map(p => new THREE.Vector2(p.x + object.x, p.y + object.y));
            } else {
                vertices = [
                    new THREE.Vector2(object.x, object.y),
                    new THREE.Vector2(object.x + object.width, object.y),
                    new THREE.Vector2(object.x + object.width, object.y + object.height),
                    new THREE.Vector2(object.x, object.y + object.height),
                ];
            }

            const options = new Options();

            options.set('name', object.name);
            options.set('type', object.type);

            if (object.properties !== undefined) {
                object.properties.forEach(property => options.set(property.name, property.value));
            }

            if (object.text !== undefined) {
                options.set('text', object.text.text);
                options.set('color', object.text.color);
                options.set('pixelsize', object.text.pixelsize * 4);
            }

            if (object.width !== undefined) {
                options.set('size', new THREE.Vector2(object.width, object.height));
            }

            maze.addObject(vertices, options);
        }));

        return maze;
    }
}

MazeManager._init();
