var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { applyCanvasEdgeFade } from '../../utils/audio-utils.js';
/**
 * A native Lit WebComponent that provides a smooth, infinitely scrolling audio waveform animation.
 * Replaces the React/ElevenLabs ScrollingWaveform.
 */
let UiScrollingWaveform = class UiScrollingWaveform extends LitElement {
    constructor() {
        super(...arguments);
        this.speed = 50; // pixels per second
        this.barCount = 60;
        this.barWidth = 4;
        this.barHeight = 4;
        this.barGap = 2;
        this.barRadius = 2;
        this.fadeEdges = true;
        this.fadeWidth = 24;
        this.height = 128;
        this.active = true;
        this._animationFrameId = 0;
        this._lastTime = 0;
        // Component State
        this._bars = [];
        this._seed = Math.random();
        this._dataIndex = 0;
    }
    static { this.styles = css `
    :host {
      display: block;
      width: 100%;
    }
    .container {
      position: relative;
      width: 100%;
      overflow: hidden;
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
        // Initial populate of bars across the screen
        if (this._canvas && this._container) {
            this._populateInitialBars();
        }
        this._startAnimation();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        }
        if (this._animationFrameId) {
            cancelAnimationFrame(this._animationFrameId);
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
        }
    }
    _seededRandom(index) {
        const x = Math.sin(this._seed * 10000 + index * 137.5) * 10000;
        return x - Math.floor(x);
    }
    _populateInitialBars() {
        const rect = this._container.getBoundingClientRect();
        const step = this.barWidth + this.barGap;
        let currentX = rect.width;
        let index = 0;
        this._bars = [];
        // Fill from right to left
        while (currentX > -step) {
            this._bars.push({
                x: currentX,
                height: 0.2 + this._seededRandom(index++) * 0.6,
            });
            currentX -= step;
        }
        // Reverse so the array goes left to right
        this._bars.reverse();
    }
    _startAnimation() {
        this._lastTime = performance.now();
        const animate = (currentTime) => {
            if (!this._canvas)
                return;
            const ctx = this._canvas.getContext('2d');
            if (!ctx)
                return;
            const deltaTime = this._lastTime
                ? (currentTime - this._lastTime) / 1000
                : 0;
            this._lastTime = currentTime;
            const rect = this._canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, rect.width, rect.height);
            // Resolve color from CSS vars if not explicitly provided
            let computedBarColor = this.barColor;
            if (!computedBarColor) {
                const styles = getComputedStyle(this);
                const primary = styles
                    .getPropertyValue('--md-sys-color-primary')
                    .trim();
                computedBarColor = primary || '#0066cc';
            }
            const step = this.barWidth + this.barGap;
            const actualSpeed = this.active ? this.speed : 0;
            // Move bars to the left and decay height if inactive
            for (let i = 0; i < this._bars.length; i++) {
                this._bars[i].x -= actualSpeed * deltaTime;
                if (!this.active) {
                    // Rapidly decay existing bars to a flat line when paused
                    this._bars[i].height += (0.05 - this._bars[i].height) * 0.15;
                }
            }
            // Remove bars that have fallen off the left edge
            this._bars = this._bars.filter(bar => bar.x + this.barWidth > -step);
            // Add new bars on the right side if we have empty space
            while (this._bars.length === 0 ||
                this._bars[this._bars.length - 1].x < rect.width) {
                const lastBar = this._bars[this._bars.length - 1];
                const nextX = lastBar ? lastBar.x + step : rect.width;
                let newHeight;
                // If an explicit data array is passed in, loop through it
                const dataSource = this.peaks && this.peaks.length > 0 ? this.peaks : this.data;
                if (dataSource && dataSource.length > 0) {
                    newHeight = dataSource[this._dataIndex % dataSource.length] || 0.1;
                    this._dataIndex = (this._dataIndex + 1) % dataSource.length;
                }
                else if (this.analyserNode) {
                    // Live analyser node
                    if (!this._dataArray ||
                        this._dataArray.length !== this.analyserNode.frequencyBinCount) {
                        this._dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
                    }
                    this.analyserNode.getByteFrequencyData(this._dataArray);
                    let sum = 0;
                    const limit = Math.min(this._dataArray.length, 50); // average lower bands
                    for (let i = 0; i < limit; i++) {
                        sum += this._dataArray[i];
                    }
                    const avg = sum / limit;
                    const normalized = avg / 255;
                    // Apply curve
                    newHeight = Math.max(0.1, Math.pow(normalized, 1.5) * 1.5);
                }
                else {
                    // Otherwise, procedurally generate a bouncy, randomized wave
                    const time = Date.now() / 1000;
                    const uniqueIndex = this._bars.length + time * 0.01;
                    const wave1 = Math.sin(uniqueIndex * 0.1) * 0.2;
                    const wave2 = Math.cos(uniqueIndex * 0.05) * 0.15;
                    const randomComponent = this._seededRandom(uniqueIndex) * 0.4;
                    newHeight = Math.max(0.1, Math.min(0.9, 0.3 + wave1 + wave2 + randomComponent));
                }
                this._bars.push({
                    x: nextX,
                    height: newHeight,
                });
                // Safety valve
                if (this._bars.length > this.barCount * 2)
                    break;
            }
            // Draw all bars
            const centerY = rect.height / 2;
            for (const bar of this._bars) {
                // Only draw if within bounds
                if (bar.x < rect.width && bar.x + this.barWidth > 0) {
                    const barHeight = Math.max(this.barHeight, bar.height * rect.height * 0.8);
                    const y = centerY - barHeight / 2;
                    ctx.fillStyle = computedBarColor;
                    ctx.globalAlpha = 0.6 + bar.height * 0.4; // Increased base opacity for dark mode
                    if (this.barRadius > 0) {
                        ctx.beginPath();
                        ctx.roundRect(bar.x, y, this.barWidth, barHeight, this.barRadius);
                        ctx.fill();
                    }
                    else {
                        ctx.fillRect(bar.x, y, this.barWidth, barHeight);
                    }
                }
            }
            ctx.globalAlpha = 1;
            // Apply the same robust canvas edge fade utility used in other components
            if (this.fadeEdges && this.fadeWidth > 0) {
                applyCanvasEdgeFade(ctx, rect.width, rect.height, this.fadeWidth);
            }
            this._animationFrameId = requestAnimationFrame(animate);
        };
        this._animationFrameId = requestAnimationFrame(animate);
    }
};
__decorate([
    property({ type: Number })
], UiScrollingWaveform.prototype, "speed", void 0);
__decorate([
    property({ type: Number })
], UiScrollingWaveform.prototype, "barCount", void 0);
__decorate([
    property({ type: Number })
], UiScrollingWaveform.prototype, "barWidth", void 0);
__decorate([
    property({ type: Number })
], UiScrollingWaveform.prototype, "barHeight", void 0);
__decorate([
    property({ type: Number })
], UiScrollingWaveform.prototype, "barGap", void 0);
__decorate([
    property({ type: Number })
], UiScrollingWaveform.prototype, "barRadius", void 0);
__decorate([
    property({ type: String })
], UiScrollingWaveform.prototype, "barColor", void 0);
__decorate([
    property({ type: Boolean })
], UiScrollingWaveform.prototype, "fadeEdges", void 0);
__decorate([
    property({ type: Number })
], UiScrollingWaveform.prototype, "fadeWidth", void 0);
__decorate([
    property({ type: Number })
], UiScrollingWaveform.prototype, "height", void 0);
__decorate([
    property({ type: Array })
], UiScrollingWaveform.prototype, "data", void 0);
__decorate([
    property({ type: Array })
], UiScrollingWaveform.prototype, "peaks", void 0);
__decorate([
    property({ attribute: false })
], UiScrollingWaveform.prototype, "analyserNode", void 0);
__decorate([
    property({ type: Boolean })
], UiScrollingWaveform.prototype, "active", void 0);
__decorate([
    query('canvas')
], UiScrollingWaveform.prototype, "_canvas", void 0);
__decorate([
    query('.container')
], UiScrollingWaveform.prototype, "_container", void 0);
UiScrollingWaveform = __decorate([
    customElement('ui-scrolling-waveform')
], UiScrollingWaveform);
export { UiScrollingWaveform };
//# sourceMappingURL=ui-scrolling-waveform.js.map