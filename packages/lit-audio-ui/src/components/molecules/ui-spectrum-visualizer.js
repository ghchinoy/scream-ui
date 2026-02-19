/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { audioPlayerContext, } from '../../utils/audio-context.js';
import { getNormalizedFrequencyData } from '../../utils/audio-utils.js';
/**
 * A standard frequency spectrum visualizer (bars).
 * Automatically consumes AudioPlayerState from the nearest ui-audio-provider.
 *
 * @element ui-spectrum-visualizer
 *
 * @prop {number} barWidth - Width of each spectrum bar (default: 4).
 * @prop {number} barGap - Gap between bars (default: 2).
 * @prop {number} height - Container height (default: 100).
 * @prop {string} color - Bar color. Falls back to --md-sys-color-primary.
 */
let UiSpectrumVisualizer = class UiSpectrumVisualizer extends LitElement {
    constructor() {
        super(...arguments);
        this.barWidth = 4;
        this.barGap = 2;
        this.height = 100;
        this._animationFrameId = 0;
    }
    static { this.styles = css `
    :host {
      display: block;
      width: 100%;
      overflow: hidden;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `; }
    render() {
        return html `<canvas style="height: ${this.height}px;"></canvas>`;
    }
    firstUpdated() {
        this._startLoop();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        cancelAnimationFrame(this._animationFrameId);
    }
    _startLoop() {
        const loop = () => {
            this._renderFrame();
            this._animationFrameId = requestAnimationFrame(loop);
        };
        this._animationFrameId = requestAnimationFrame(loop);
    }
    _renderFrame() {
        if (!this._canvas || !this.playerState?.analyserNode)
            return;
        const analyser = this.playerState.analyserNode;
        if (!this._dataArray) {
            this._dataArray = new Uint8Array(analyser.frequencyBinCount);
        }
        const ctx = this._canvas.getContext('2d');
        if (!ctx)
            return;
        const rect = this._canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        if (this._canvas.width !== rect.width * dpr) {
            this._canvas.width = rect.width * dpr;
            this._canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }
        ctx.clearRect(0, 0, rect.width, rect.height);
        const frequencies = getNormalizedFrequencyData(analyser, this._dataArray);
        const step = this.barWidth + this.barGap;
        const barCount = Math.floor(rect.width / step);
        // Resolve color
        const styles = getComputedStyle(this);
        let barColor = this.color;
        if (!barColor) {
            barColor =
                styles.getPropertyValue('--md-sys-color-primary').trim() || '#0066cc';
        }
        ctx.fillStyle = barColor;
        for (let i = 0; i < barCount; i++) {
            // Map bar index to frequency data (linear for simple spectrum)
            const dataIndex = Math.floor((i / barCount) * (frequencies.length * 0.6));
            const value = frequencies[dataIndex] || 0;
            const barHeight = value * rect.height;
            const x = i * step;
            const y = rect.height - barHeight;
            ctx.fillRect(x, y, this.barWidth, barHeight);
        }
    }
};
__decorate([
    consume({ context: audioPlayerContext, subscribe: true })
], UiSpectrumVisualizer.prototype, "playerState", void 0);
__decorate([
    property({ type: Number })
], UiSpectrumVisualizer.prototype, "barWidth", void 0);
__decorate([
    property({ type: Number })
], UiSpectrumVisualizer.prototype, "barGap", void 0);
__decorate([
    property({ type: Number })
], UiSpectrumVisualizer.prototype, "height", void 0);
__decorate([
    property({ type: String })
], UiSpectrumVisualizer.prototype, "color", void 0);
__decorate([
    query('canvas')
], UiSpectrumVisualizer.prototype, "_canvas", void 0);
UiSpectrumVisualizer = __decorate([
    customElement('ui-spectrum-visualizer')
], UiSpectrumVisualizer);
export { UiSpectrumVisualizer };
//# sourceMappingURL=ui-spectrum-visualizer.js.map