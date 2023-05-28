/**
 * @file monitormaterial.class.js
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

const MonitorShader = {
    uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 },
        noiseStrength: { value: 0 },
        noiseTileCount: { value: 256 },
        noiseLineCount: { value: 16 },
        scanlineColor: { value: new THREE.Color(0xaaffaa) },
        scanlineStrength: { value: 0.02 },
        scanlineCount: { value: 96 },
    },
    vertexShader: `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
    `,
    fragmentShader: `
#include <common>

uniform sampler2D tDiffuse;
uniform float time;
uniform float noiseStrength;
uniform float noiseTileCount;
uniform float noiseLineCount;
uniform vec3 scanlineColor;
uniform float scanlineStrength;
uniform float scanlineCount;

varying vec2 vUv;

void main() {
    float noiseX = 1.0 + floor(vUv.x * noiseTileCount);
    float noiseY1 = 1.0 + floor(vUv.y * noiseTileCount);
    float noiseY2 = 1.0 + floor(vUv.y * noiseLineCount + rand(vec2(time)));
    float noise = min(1.0, (rand(vec2(noiseX * time, noiseY1 * time)) + rand(vec2(noiseY2 * time))) * noiseStrength);
    float blackWhite = rand(vec2(noiseX * time + 1.0, noiseY1 * time + 1.0));

    float scanline = sin(vUv.y * scanlineCount * 6.283185) * scanlineStrength;

    gl_FragColor = vec4(mix(texture2D(tDiffuse, vUv + vec2(noise * 0.03 - 0.015, 0.0)).rgb * max(1.0 - noise, 0.0), scanlineColor, scanline), 1.0);
    gl_FragColor = mix(gl_FragColor, vec4(0.0, 0.0, 0.0, 1.0), max(max(abs(0.5 - vUv.x) - 0.48, abs(0.5 - vUv.y) - 0.48), 0.0) * 30.0);
}
    `,
};

export default class MonitorMaterial extends THREE.ShaderMaterial {
    constructor(parameters) {
        super({
            type: 'MonitorMaterial',
            uniforms: THREE.UniformsUtils.clone(MonitorShader.uniforms),
            vertexShader: MonitorShader.vertexShader,
            fragmentShader: MonitorShader.fragmentShader,
        });

        this.setValues(parameters);
    }

    get map() {
        return this.uniforms.tDiffuse.value;
    }

    set map(value) {
        this.uniforms.tDiffuse.value = value;
    }

    set time(value) {
        this.uniforms.time.value = value;
    }

    set noiseStrength(value) {
        this.uniforms.noiseStrength.value = value;
    }
}
