/**
 * Copyright 2026 Google LLC
 */
import {LitElement, html, css, type PropertyValues} from 'lit';
import {customElement, query, property} from 'lit/decorators.js';
import { prepareWithSegments, layoutWithLines, type PreparedTextWithSegments, type LayoutLine } from '@chenglou/pretext';

@customElement('demo-masked-gradient')
export class DemoMaskedGradient extends LitElement {
  @property({type: String}) text = 'This is a masked gradient visualizer.\n\nThe canvas is filled with black, but the text is drawn in white.\n\nWith mix-blend-mode: multiply, the black hides the background, and the white text lets the animated gradient shine through!';
  @property({type: String}) font = '18px Inter, sans-serif';

  @query('canvas') private _canvas!: HTMLCanvasElement;
  @query('.container') private _container!: HTMLDivElement;

  private _resizeObserver?: ResizeObserver;
  private _preparedText: PreparedTextWithSegments | null = null;
  private _layoutLines: LayoutLine[] | null = null;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 300px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--md-sys-color-outline-variant, #444);
      background: #000;
    }
    .container {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .gradient-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      /* We can reuse the ui-moving-gradient under the canvas! */
    }
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      height: 100%;
      width: 100%;
      /* Mix blend mode will punch the text out so the gradient shows through! */
      mix-blend-mode: multiply;
      background: #000;
    }
  `;

  render() {
    return html`
      <div class="container">
        <!-- The vibrant animated background -->
        <div class="gradient-bg">
          <ui-moving-gradient agentState="thinking" baseHeight="1.0" .colors=${['#FF3B30', '#0077FF', '#00C853']}></ui-moving-gradient>
        </div>
        <!-- The canvas that draws white text on a black background, multiplied over the gradient -->
        <canvas></canvas>
      </div>
    `;
  }

  firstUpdated() {
    this._resizeObserver = new ResizeObserver(() => {
      this._updateLayout();
    });
    this._resizeObserver.observe(this._container);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._resizeObserver) this._resizeObserver.disconnect();
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('text') || changedProperties.has('font')) {
      if (this.text) {
        this._preparedText = prepareWithSegments(this.text, this.font, { whiteSpace: 'pre-wrap' });
      } else {
        this._preparedText = null;
      }
      this._updateLayout();
    }
  }

  private _updateLayout() {
    if (!this._preparedText || !this._container || !this._canvas) return;
    
    const width = this._container.getBoundingClientRect().width;
    const height = this._container.getBoundingClientRect().height;

    // Layout the text tightly
    const lineHeight = 24; 
    const { lines } = layoutWithLines(this._preparedText, width - 40, lineHeight);
    this._layoutLines = lines;

    const dpr = window.devicePixelRatio || 1;
    this._canvas.width = width * dpr;
    this._canvas.height = height * dpr;
    this._canvas.style.width = `${width}px`;
    this._canvas.style.height = `${height}px`;

    this._renderCanvas(width, height, dpr);
  }

  private _renderCanvas(width: number, height: number, dpr: number) {
    if (!this._canvas || !this._layoutLines) return;
    const ctx = this._canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(dpr, dpr);
    
    // Fill with black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Draw text in white
    ctx.font = this.font;
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'top';

    const lineHeight = 24;
    for (let i = 0; i < this._layoutLines.length; i++) {
      const line = this._layoutLines[i];
      ctx.fillText(line.text, 20, 20 + i * lineHeight);
    }

    ctx.restore();
  }
}