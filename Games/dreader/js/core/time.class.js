/**
 * @file time.class.js
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

export default class Time {
    constructor() {
        this.timeScale = 1;

        this.elapsedSeconds = 0;
        this.totalSeconds = 0;

        this.unscaledElapsedSeconds = 0;
        this.unscaledTotalSeconds = 0;

        this._timeouts = [];
    }

    reset() {
        this.timeScale = 1;

        this.elapsedSeconds = 0;
        this.totalSeconds = 0;

        this.unscaledElapsedSeconds = 0;
        this.unscaledTotalSeconds = 0;
    }

    addElapsedSeconds(elapsedSeconds) {
        this.elapsedSeconds = this.timeScale * elapsedSeconds;
        this.totalSeconds += this.timeScale * elapsedSeconds;

        this.unscaledElapsedSeconds = elapsedSeconds;
        this.unscaledTotalSeconds += elapsedSeconds;

        if (this._timeouts.length === 0) {
            return;
        }

        const length = this._timeouts.length;
        for (let i = 0; i < length; i++) {
            const timeout = this._timeouts[i];

            timeout.ms -= elapsedSeconds * 1000 * (timeout.scaled ? this.timeScale : 1);

            if (!timeout.cleared && timeout.ms <= 0) {
                timeout.func(...timeout.args);
                timeout.cleared = true;
            }
        }

        for (let i = length - 1; i > -1; i--) {
            if (this._timeouts[i].cleared) {
                this._timeouts.splice(i, 1);
            }
        }
    }

    setTimeout(func, ms, ...args) {
        const timeout = { func, ms, scaled: false, cleared: false, args };

        this._timeouts.push(timeout);

        return timeout;
    }

    setTimeoutScaled(func, ms, ...args) {
        const timeout = { func, ms, scaled: true, cleared: false, args };

        this._timeouts.push(timeout);

        return timeout;
    }

    clearTimeout(timeout) {
        timeout.cleared = true;
    }
}
