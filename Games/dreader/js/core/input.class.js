/**
 * @file input.class.js
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

export default class Input {
    static _init() {
        Input._mouseButtonDown = new Set();
        Input._mouseButtonUp = new Set();
        Input._mouseButton = new Set();

        Input._cursorPosition = { x: 0, y: 0 };

        Input._newCursorStyle = null;

        Input._enableContextMenu = true;

        window.addEventListener('load', Input._handleLoad);
    }

    static _handleLoad() {
        const cursorMove = (x, y) => {
            Input._cursorPosition.x = x;
            Input._cursorPosition.y = y;
        };

        document.addEventListener('mousedown', e => {
            Input._mouseButtonDown.add(e.button);
            Input._mouseButton.add(e.button);
        }, false);

        document.addEventListener('mouseup', e => {
            Input._mouseButtonUp.add(e.button);
            Input._mouseButton.delete(e.button);
        }, false);

        document.addEventListener('mousemove', e => {
            cursorMove(e.clientX, e.clientY);
        }, false);

        document.addEventListener('touchstart', e => {
            Input._mouseButtonDown.add(0);
            Input._mouseButton.add(0);

            cursorMove(e.touches[0].clientX, e.touches[0].clientY);

            e.preventDefault();
        }, false);

        document.addEventListener('touchend', e => {
            Input._mouseButtonUp.add(0);
            Input._mouseButton.delete(0);
        }, false);

        document.addEventListener('touchcancel', () => {
            Input._mouseButtonUp.add(0);
            Input._mouseButton.delete(0);
        }, false);

        document.addEventListener('touchmove', e => {
            cursorMove(e.touches[0].clientX, e.touches[0].clientY);
        }, false);

        document.addEventListener('contextmenu', e => {
            if (!Input._enableContextMenu) {
                e.preventDefault();
            }
        }, false);
    }

    static getMouseButtonDown(button = 0) {
        return Input._mouseButtonDown.has(button);
    }

    static getMouseButtonUp(button = 0) {
        return Input._mouseButtonUp.has(button);
    }

    static getMouseButton(button = 0) {
        return Input._mouseButton.has(button);
    }

    static getCursorPosition(target) {
        if (target === undefined) {
            throw new Error('No target object supplied (target = { x, y })');
        }

        target.x = Input._cursorPosition.x;
        target.y = Input._cursorPosition.y;
        return target;
    }

    static setCursorStyle(style = 'auto') {
        Input._newCursorStyle = style;
    }

    static setContextMenuEnabled(enabled) {
        Input._enableContextMenu = enabled;
    }

    static resetState() {
        Input._mouseButtonDown.clear();
        Input._mouseButtonUp.clear();

        if (Input._newCursorStyle !== null) {
            if (document.body.style.cursor !== Input._newCursorStyle) {
                document.body.style.cursor = Input._newCursorStyle;
            }
            Input._newCursorStyle = null;
        }
    }
}

Input._init();
