/**
 * @file options.class.js
 * @version 1.5.0
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

export default class Options {
    /**
     * @param {...object} [objects or other Options instances]
     */
    constructor() {
        this._values = new Map();

        for (let i = 0; i < arguments.length; i++) {
            const obj = arguments[i];

            if (obj === undefined) {
                continue;
            } else if (obj instanceof Options) {
                obj._values.forEach((value, key) => {
                    this._values.set(key, value);
                });
            } else if (obj instanceof Object) {
                for (let key in obj) {
                    const s = String(key);
                    if (Object.prototype.hasOwnProperty.call(obj, s)) {
                       this._values.set(s, obj[s]);
                    }
                }
            } else {
                throw new Error('Arguments must be objects or other Options instances');
            }
        }
    }

    has(key) {
        return this._values.has(key);
    }

    get(key, defaultValue = undefined, logSameAsDefault = true) {
        if (this._values.has(key)) {
            const value = this._values.get(key);

            if (logSameAsDefault && value === defaultValue) {
                console.debug(`Option "${key}"="${value}" is the same as the default value`);
            }

            return value;
        }

        if (defaultValue === undefined) {
            throw new Error(`Option "${key}" does not exist and there is no default value`);
        }

        return defaultValue;
    }

    set(key, value, logRedandantSet = true) {
        if (logRedandantSet && this._values.has(key)) {
            const oldValue = this._values.get(key);

            if (oldValue === value) {
                console.debug(`Option "${key}"="${oldValue}" is set to the same value multiple times`);
            }
        }

        this._values.set(key, value);
    }

    static castIfRequired(options) {
        return options instanceof Options ? options : new Options(options);
    }
}
