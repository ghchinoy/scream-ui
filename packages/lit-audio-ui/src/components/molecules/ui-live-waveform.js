/**
 * Copyright 2026 Google LLC
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { applyCanvasEdgeFade, getNormalizedFrequencyData, } from '../../utils/audio-utils.js';
/**
 * A real-time audio visualizer component.
 */
let UiLiveWaveform = class UiLiveWaveform extends LitElement {
    constructor() {
        super(...arguments);
        this.active = false;
        this.processing = false;
        this.barWidth = 3;
        this.barHeight = 4;
        this.barGap = 1;
        this.barRadius = 1.5;
        this.fadeEdges = true;
        this.fadeWidth = 24;
        this.height = 64;
        this.sensitivity = 1.0;
        this.updateRate = 30; // ms
        this._animationFrameId = 0;
        this._lastUpdateTime = 0;
        this._currentBars = [];
        this._processingTime = 0;
        this._transitionProgress = 0;
        this._lastActiveData = [];
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
        this._themeObserver = new MutationObserver(() => {
            this._renderFrame();
        });
        this._themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'style'],
        });
        this._startAnimationLoop();
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('analyserNode') && this.analyserNode) {
            this._dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
        }
        if (changedProperties.has('processing') &&
            this.processing &&
            !this.active) {
            this._processingTime = 0;
            this._transitionProgress = 0;
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._resizeObserver)
            this._resizeObserver.disconnect();
        if (this._themeObserver)
            this._themeObserver.disconnect();
        if (this._animationFrameId)
            cancelAnimationFrame(this._animationFrameId);
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
        if (ctx)
            ctx.scale(dpr, dpr);
        this._renderFrame();
    }
    _startAnimationLoop() {
        const loop = (timestamp) => {
            this._updateData(timestamp);
            this._renderFrame();
            this._animationFrameId = requestAnimationFrame(loop);
        };
        this._animationFrameId = requestAnimationFrame(loop);
    }
    _updateData(timestamp) {
        if (!this._canvas)
            return;
        const rect = this._canvas.getBoundingClientRect();
        const barCount = Math.floor(rect.width / (this.barWidth + this.barGap));
        if (this.active && this.analyserNode && this._dataArray) {
            if (timestamp - this._lastUpdateTime > this.updateRate) {
                this._lastUpdateTime = timestamp;
                const frequencies = getNormalizedFrequencyData(this.analyserNode, this._dataArray);
                const startFreq = Math.floor(frequencies.length * 0.05);
                const endFreq = Math.floor(frequencies.length * 0.4);
                const relevantData = frequencies.slice(startFreq, endFreq);
                const centerIndex = Math.floor(barCount / 2);
                const newBars = new Array(barCount).fill(0.05);
                const maxDataIndex = relevantData.length - 1;
                for (let i = 0; i <= centerIndex; i++) {
                    const dataPercent = i / centerIndex;
                    const dataIndex = Math.floor(dataPercent * maxDataIndex);
                    let val = relevantData[dataIndex] || 0;
                    if (dataPercent > 0.8)
                        val = val * (1 - (dataPercent - 0.8) * 5);
                    const scaledVal = Math.max(0.05, Math.min(1, val * this.sensitivity));
                    const rightBar = centerIndex + i;
                    const leftBar = centerIndex - i;
                    if (rightBar < barCount)
                        newBars[rightBar] = scaledVal;
                    if (leftBar >= 0)
                        newBars[leftBar] = scaledVal;
                }
                this._currentBars = newBars;
                this._lastActiveData = [...newBars];
            }
        }
        else if (this.processing && !this.active) {
            this._processingTime += 0.03;
            this._transitionProgress = Math.min(1, this._transitionProgress + 0.02);
            const processingData = new Array(barCount).fill(0.05);
            const halfCount = Math.floor(barCount / 2);
            for (let i = 0; i < barCount; i++) {
                const normalizedPosition = (i - halfCount) / halfCount;
                const centerWeight = 1 - Math.abs(normalizedPosition) * 0.4;
                const wave1 = Math.sin(this._processingTime * 1.5 + normalizedPosition * 3) * 0.25;
                const wave2 = Math.sin(this._processingTime * 0.8 - normalizedPosition * 2) * 0.2;
                const wave3 = Math.cos(this._processingTime * 2 + normalizedPosition) * 0.15;
                const combinedWave = wave1 + wave2 + wave3;
                const processingValue = (0.2 + combinedWave) * centerWeight;
                let finalValue = processingValue;
                if (this._lastActiveData.length > 0 && this._transitionProgress < 1) {
                    const lastDataIndex = Math.min(i, this._lastActiveData.length - 1);
                    const lastValue = this._lastActiveData[lastDataIndex] || 0;
                    finalValue =
                        lastValue * (1 - this._transitionProgress) +
                            processingValue * this._transitionProgress;
                }
                processingData[i] = Math.max(0.05, Math.min(1, finalValue));
            }
            this._currentBars = processingData;
        }
        else {
            if (this._currentBars.length > 0) {
                let allZero = true;
                for (let i = 0; i < this._currentBars.length; i++) {
                    this._currentBars[i] = Math.max(0.05, this._currentBars[i] * 0.85);
                    if (this._currentBars[i] > 0.06)
                        allZero = false;
                }
                if (allZero)
                    this._currentBars = [];
            }
        }
    }
    _renderFrame() {
        if (!this._canvas)
            return;
        const ctx = this._canvas.getContext('2d');
        if (!ctx)
            return;
        const rect = this._canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        const styles = getComputedStyle(this);
        let computedBarColor = this.barColor || 'currentColor';
        if (computedBarColor.startsWith('var(')) {
            const varName = computedBarColor.match(/var\(([^,)]+)/)?.[1].trim();
            if (varName) {
                const resolved = styles.getPropertyValue(varName).trim();
                if (resolved)
                    computedBarColor = resolved;
            }
        }
        if (computedBarColor === 'currentColor' || !computedBarColor) {
            computedBarColor =
                styles.getPropertyValue('--md-sys-color-primary').trim() || '#0066cc';
        }
        const step = this.barWidth + this.barGap;
        const barCount = Math.floor(rect.width / step);
        const centerY = rect.height / 2;
        for (let i = 0; i < barCount && i < this._currentBars.length; i++) {
            const value = this._currentBars[i] || 0.05;
            const x = i * step;
            const dynamicHeight = Math.max(this.barHeight, value * rect.height * 0.8);
            const y = centerY - dynamicHeight / 2;
            ctx.fillStyle = computedBarColor;
            // Increased base opacity from 0.4 to 0.6 for better dark mode visibility
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
    property({ type: Boolean })
], UiLiveWaveform.prototype, "active", void 0);
__decorate([
    property({ type: Boolean })
], UiLiveWaveform.prototype, "processing", void 0);
__decorate([
    property({ attribute: false })
], UiLiveWaveform.prototype, "analyserNode", void 0);
__decorate([
    property({ type: Number })
], UiLiveWaveform.prototype, "barWidth", void 0);
__decorate([
    property({ type: Number })
], UiLiveWaveform.prototype, "barHeight", void 0);
__decorate([
    property({ type: Number })
], UiLiveWaveform.prototype, "barGap", void 0);
__decorate([
    property({ type: Number })
], UiLiveWaveform.prototype, "barRadius", void 0);
__decorate([
    property({ type: String })
], UiLiveWaveform.prototype, "barColor", void 0);
__decorate([
    property({ type: Boolean })
], UiLiveWaveform.prototype, "fadeEdges", void 0);
__decorate([
    property({ type: Number })
], UiLiveWaveform.prototype, "fadeWidth", void 0);
__decorate([
    property({ type: Number })
], UiLiveWaveform.prototype, "height", void 0);
__decorate([
    property({ type: Number })
], UiLiveWaveform.prototype, "sensitivity", void 0);
__decorate([
    property({ type: Number })
], UiLiveWaveform.prototype, "updateRate", void 0);
__decorate([
    query('canvas')
], UiLiveWaveform.prototype, "_canvas", void 0);
__decorate([
    query('.container')
], UiLiveWaveform.prototype, "_container", void 0);
UiLiveWaveform = __decorate([
    customElement('ui-live-waveform')
], UiLiveWaveform);
export { UiLiveWaveform };
//# sourceMappingURL=ui-live-waveform.js.map