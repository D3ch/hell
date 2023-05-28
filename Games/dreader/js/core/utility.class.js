/**
 * @file utility.class.js
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

export default class Utility {
    static getClosestAngle(a, b) {
        const tau = Math.PI * 2;
        const x = b - a + Math.PI;
        return x - Math.floor(x / tau) * tau - Math.PI;
    }

    static lerp(x, y, t) {
        return x + (y - x) * t;
    }

    static damp(a, b, factor, dt) {
        const t = 1 - factor ** dt;
        return a * (1 - t) + b * t;
    }

    // https://github.com/substack/point-in-polygon MIT license
    static isPointInPolygon(x, y, vertices) {
        let inside = false;

        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            const vi = vertices[i];
            const vj = vertices[j];
            const intersect = ((vi.y > y) !== (vj.y > y)) &&
                (x < (vj.x - vi.x) * (y - vi.y) / (vj.y - vi.y) + vi.x);
            if (intersect) {
                inside = !inside;
            }
        }

        return inside;
    }
}
