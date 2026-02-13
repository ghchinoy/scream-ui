import {LitElement, html, css, type PropertyValues} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {applyCanvasEdgeFade} from '../utils/audio-utils';

@customElement('sui-waveform')
export class SuiWaveform extends LitElement {
  @property({type: Array}) data: number[] = [];
  @property({type: Number}) barWidth: number = 4;
  @property({type: Number}) barHeight: number = 4;
  @property({type: Number}) barGap: number = 2;
  @property({type: Number}) barRadius: number = 2;
  @property({type: String}) barColor?: string;
  @property({type: Boolean}) fadeEdges: boolean = true;
  @property({type: Number}) fadeWidth: number = 24;
  @property({type: Number}) height: number = 128;

  @query('canvas') private _canvas!: HTMLCanvasElement;
  @query('.container') private _container!: HTMLDivElement;

  private _resizeObserver?: ResizeObserver;

  static styles = css`
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
  `;

  render() {
    return html`
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

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('data') || changedProperties.has('barColor')) {
      this._renderWaveform();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  private _handleResize() {
    if (!this._canvas || !this._container) return;

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

  private _renderWaveform() {
    if (!this._canvas) return;
    const ctx = this._canvas.getContext('2d');
    if (!ctx) return;

    const rect = this._canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Provide a sensible default color if none provided, looking up the CSS variable cascade
    const computedBarColor =
      this.barColor ||
      getComputedStyle(this).getPropertyValue('--md-sys-color-primary') ||
      getComputedStyle(this).getPropertyValue('color') ||
      '#000';

    const barCount = Math.floor(rect.width / (this.barWidth + this.barGap));
    const centerY = rect.height / 2;

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * this.data.length);
      const value = this.data[dataIndex] || 0;
      // Value should be 0.0 to 1.0. Scale it to the height of the canvas.
      const dynamicHeight = Math.max(this.barHeight, value * rect.height * 0.8);
      const x = i * (this.barWidth + this.barGap);
      const y = centerY - dynamicHeight / 2;

      ctx.fillStyle = computedBarColor;
      ctx.globalAlpha = 0.3 + value * 0.7;

      if (this.barRadius > 0) {
        ctx.beginPath();
        ctx.roundRect(x, y, this.barWidth, dynamicHeight, this.barRadius);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, this.barWidth, dynamicHeight);
      }
    }

    if (this.fadeEdges) {
      applyCanvasEdgeFade(ctx, rect.width, rect.height, this.fadeWidth);
    }

    ctx.globalAlpha = 1;
  }
}
