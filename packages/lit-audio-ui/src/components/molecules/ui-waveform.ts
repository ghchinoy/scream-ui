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

import {LitElement, html, css, type PropertyValues} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import { prepareWithSegments, layoutWithLines, type PreparedTextWithSegments } from '@chenglou/pretext';
import {applyCanvasEdgeFade, computeAudioPeaks} from '../../utils/audio-utils.js';

@customElement('ui-waveform')
export class UiWaveform extends LitElement {
  @property({type: String}) src?: string;
  @property({type: Array}) data: number[] = [];
  @property({type: Array}) peaks?: number[];
  @property({type: Number}) barWidth: number = 4;
  @property({type: Number}) barHeight: number = 4;
  @property({type: Number}) barGap: number = 2;
  @property({type: Number}) barRadius: number = 2;
  @property({type: String}) barColor?: string;
  @property({type: String}) align: 'center' | 'bottom' | 'top' = 'center';
  @property({type: Boolean}) fadeEdges: boolean = true;
  @property({type: Number}) fadeWidth: number = 24;
  @property() height?: number | string;

  // Pretext overlay properties
  @property({type: String}) overlayText?: string;
  @property({type: String}) overlayFont: string = '14px Inter, sans-serif';
  @property({type: String}) overlayColor: string = '#ffffff';

  @state() private _computedPeaks: number[] | null = null;
  private _preparedOverlayText: PreparedTextWithSegments | null = null;

  @query('canvas') private _canvas!: HTMLCanvasElement;
  @query('.container') private _container!: HTMLDivElement;

  private _resizeObserver?: ResizeObserver;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 128px; /* default height, can be overridden by CSS */
    }
    .container {
      position: relative;
      width: 100%;
      height: 100%;
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
    const h = this.height !== undefined 
      ? (typeof this.height === 'number' || !isNaN(Number(this.height)) ? `${this.height}px` : this.height) 
      : '100%';
    return html`
      <div class="container" style="height: ${h};">
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

  async updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    
    let needsRender = false;

    if (changedProperties.has('overlayText') || changedProperties.has('overlayFont')) {
      if (this.overlayText) {
        this._preparedOverlayText = prepareWithSegments(this.overlayText, this.overlayFont, { whiteSpace: 'pre-wrap' });
      } else {
        this._preparedOverlayText = null;
      }
      needsRender = true;
    }

    if (changedProperties.has('src') && this.src) {
      this._computedPeaks = null; // Clear old peaks while loading
      this._renderWaveform(); // Trigger a render to clear/show loading state if we want one
      
      try {
        const width = this._container?.getBoundingClientRect().width || 800;
        const estimatedBarCount = Math.max(10, Math.floor(width / (this.barWidth + this.barGap)));
        
        this._computedPeaks = await computeAudioPeaks(this.src, estimatedBarCount);
      } catch (e) {
        console.error('Failed to compute audio peaks for src:', this.src, e);
      }
    }

    if (needsRender || changedProperties.has('data') || changedProperties.has('peaks') || changedProperties.has('src') || changedProperties.has('barColor') || changedProperties.has('align') || changedProperties.has('_computedPeaks') || changedProperties.has('overlayColor')) {
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
    this._renderWaveform();
  }

  private _renderWaveform() {
    if (!this._canvas || !this._container) return;

    const rect = this._container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const targetWidth = Math.round(rect.width * dpr);
    const targetHeight = Math.round(rect.height * dpr);

    const ctx = this._canvas.getContext('2d');
    if (!ctx) return;

    if (this._canvas.width !== targetWidth || this._canvas.height !== targetHeight) {
      this._canvas.width = targetWidth;
      this._canvas.height = targetHeight;
      this._canvas.style.width = `${rect.width}px`;
      this._canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    } else {
      ctx.clearRect(0, 0, rect.width, rect.height);
    }

    // Provide a sensible default color if none provided, looking up the CSS variable cascade
    const styles = getComputedStyle(this);
    let computedBarColor = this.barColor;
    if (!computedBarColor) {
      const primary = styles.getPropertyValue('--md-sys-color-primary').trim();
      const color = styles.getPropertyValue('color').trim();
      computedBarColor = primary || color || '#0066cc'; // Solid fallback
    }

    const barCount = Math.floor(rect.width / (this.barWidth + this.barGap));
    const centerY = rect.height / 2;
    
    const totalBarsWidth = barCount * (this.barWidth + this.barGap) - this.barGap;
    const startX = Math.max(0, (rect.width - totalBarsWidth) / 2);

    // Determine priority of data sources: explicitly provided peaks > computed peaks > realtime data
    const dataSource = this.peaks && this.peaks.length > 0 
      ? this.peaks 
      : (this._computedPeaks && this._computedPeaks.length > 0 
        ? this._computedPeaks 
        : this.data);

    for (let i = 0; i < barCount; i++) {
      const dataIndex = dataSource.length > 0 ? Math.floor((i / barCount) * dataSource.length) : 0;
      const value = dataSource[dataIndex] || 0.1; // Provide a tiny baseline if no data
      const dynamicHeight = Math.max(this.barHeight, value * rect.height * 0.8);
      const x = startX + i * (this.barWidth + this.barGap);
      
      let y = centerY - dynamicHeight / 2;
      if (this.align === 'bottom') {
        y = rect.height - dynamicHeight;
      } else if (this.align === 'top') {
        y = 0;
      }

      ctx.fillStyle = computedBarColor;
      ctx.globalAlpha = 0.6 + value * 0.4;

      if (this.barRadius > 0) {
        ctx.beginPath();
        ctx.roundRect(x, y, this.barWidth, dynamicHeight, this.barRadius);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, this.barWidth, dynamicHeight);
      }
    }

    ctx.globalAlpha = 1;

    // Draw Pretext Overlay if defined
    if (this._preparedOverlayText) {
      const lineHeight = parseInt(this.overlayFont, 10) * 1.5 || 20; 
      const { lines } = layoutWithLines(this._preparedOverlayText, rect.width - 20, lineHeight);
      
      ctx.font = this.overlayFont;
      ctx.fillStyle = this.overlayColor;
      ctx.textBaseline = 'top';

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i].text, 10, 10 + i * lineHeight);
      }
    }

    if (this.fadeEdges) {
      applyCanvasEdgeFade(ctx, rect.width, rect.height, this.fadeWidth);
    }
  }
}
