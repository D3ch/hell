/**
 * @file modelmanager.class.js
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

import config from '../resources/config.js';
import resources from '../resources/resources.js';

import { GLTFLoader } from '../lib/three.js/GLTFLoader.js';

export default class ModelManager {
    static _init() {
        ModelManager._models = new Map();
    }

    static asyncLoadModels() {
        const loader = new GLTFLoader();

        return Promise.all(Object.keys(resources.models).map(name => {
            const info = resources.models[name];
            const url = `./models/${info.path}${config.debug.preventCaching ? '?time=' + new Date().getTime() : ''}`;

            return new Promise((resolve, reject) => {
                if (info.type !== 'gltf') {
                    reject(new Error(`Unsupported model type "${info.type}"`));
                }

                loader.load(url, model => {
                    ModelManager._models.set(name, model);

                    resolve();
                }, undefined, () => {
                    reject(new Error(`Error loading model file "${url}"`));
                });
            });
        }));
    }

    static getModel(name) {
        const model = ModelManager._models.get(name);
        if (model === undefined) {
            throw new Error(`Model "${name}" does not exist`);
        }
        return model;
    }
}

ModelManager._init();
