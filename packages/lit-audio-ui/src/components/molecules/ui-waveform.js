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
import { applyCanvasEdgeFade } from '../../utils/audio-utils.js';
let UiWaveform = class UiWaveform extends LitElement {
    constructor() {
        super(...arguments);
        this.data = [];
        this.barWidth = 4;
        this.barHeight = 4;
        this.barGap = 2;
        this.barRadius = 2;
        this.fadeEdges = true;
        this.fadeWidth = 24;
        this.height = 128;
    }
    static { this.styles = css `
    :host {
      display: block;
      width: 100%;
    }
    .container {
      position: relative;
      width: 100%;
    }
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      height: 100%;
      width: 100%;
    }
  `; }
    render() {
        return html `
      <div class="container" style="height: ${this.height}px;">
        <canvas></canvas>
      </div>
    `;
    }
    firstUpdated() {
        this._resizeObserver = new ResizeObserver(() => {
            this._handleResize();
        });
        this._resizeObserver.observe(this._container);
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('data') || changedProperties.has('peaks') || changedProperties.has('barColor')) {
            this._renderWaveform();
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        }
    }
    _handleResize() {
        if (!this._canvas || !this._container)
            return;
        const rect = this._container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this._canvas.width = rect.width * dpr;
        this._canvas.height = rect.height * dpr;
        this._canvas.style.width = `${rect.width}px`;
        this._canvas.style.height = `${rect.height}px`;
        const ctx = this._canvas.getContext('2d');
        if (ctx) {
            ctx.scale(dpr, dpr);
            this._renderWaveform();
        }
    }
    _renderWaveform() {
        if (!this._canvas)
            return;
        const ctx = this._canvas.getContext('2d');
        if (!ctx)
            return;
        const rect = this._canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        // Provide a sensible default color if none provided, looking up the CSS variable cascade
        // Get the computed color, trimming whitespace that getPropertyValue often returns
        const styles = getComputedStyle(this);
        let computedBarColor = this.barColor;
        if (!computedBarColor) {
            const primary = styles.getPropertyValue('--md-sys-color-primary').trim();
            const color = styles.getPropertyValue('color').trim();
            computedBarColor = primary || color || '#0066cc'; // Solid fallback
        }
        const barCount = Math.floor(rect.width / (this.barWidth + this.barGap));
        const centerY = rect.height / 2;
        for (let i = 0; i < barCount; i++) {
            const dataSource = this.peaks && this.peaks.length > 0 ? this.peaks : this.data;
            const dataIndex = dataSource.length > 0 ? Math.floor((i / barCount) * dataSource.length) : 0;
            const value = dataSource[dataIndex] || 0;
            // Value should be 0.0 to 1.0. Scale it to the height of the canvas.
            const dynamicHeight = Math.max(this.barHeight, value * rect.height * 0.8);
            const x = i * (this.barWidth + this.barGap);
            const y = centerY - dynamicHeight / 2;
            ctx.fillStyle = computedBarColor;
            ctx.globalAlpha = 0.6 + value * 0.4;
            if (this.barRadius > 0) {
                ctx.beginPath();
                ctx.roundRect(x, y, this.barWidth, dynamicHeight, this.barRadius);
                ctx.fill();
            }
            else {
                ctx.fillRect(x, y, this.barWidth, dynamicHeight);
            }
        }
        if (this.fadeEdges) {
            applyCanvasEdgeFade(ctx, rect.width, rect.height, this.fadeWidth);
        }
        ctx.globalAlpha = 1;
    }
};
__decorate([
    property({ type: Array })
], UiWaveform.prototype, "data", void 0);
__decorate([
    property({ type: Array })
], UiWaveform.prototype, "peaks", void 0);
__decorate([
    property({ type: Number })
], UiWaveform.prototype, "barWidth", void 0);
__decorate([
    property({ type: Number })
], UiWaveform.prototype, "barHeight", void 0);
__decorate([
    property({ type: Number })
], UiWaveform.prototype, "barGap", void 0);
__decorate([
    property({ type: Number })
], UiWaveform.prototype, "barRadius", void 0);
__decorate([
    property({ type: String })
], UiWaveform.prototype, "barColor", void 0);
__decorate([
    property({ type: Boolean })
], UiWaveform.prototype, "fadeEdges", void 0);
__decorate([
    property({ type: Number })
], UiWaveform.prototype, "fadeWidth", void 0);
__decorate([
    property({ type: Number })
], UiWaveform.prototype, "height", void 0);
__decorate([
    query('canvas')
], UiWaveform.prototype, "_canvas", void 0);
__decorate([
    query('.container')
], UiWaveform.prototype, "_container", void 0);
UiWaveform = __decorate([
    customElement('ui-waveform')
], UiWaveform);
export { UiWaveform };
//# sourceMappingURL=ui-waveform.js.map