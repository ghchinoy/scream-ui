/**
 * Copyright 2026 Google LLC
 */
import {LitElement, html, css, type PropertyValues} from 'lit';
import {customElement, query, property, state} from 'lit/decorators.js';
import { prepareWithSegments, layoutWithLines, type PreparedTextWithSegments, type LayoutLine } from '@chenglou/pretext';
import { computeAudioPeaks, applyCanvasEdgeFade } from '@ghchinoy/lit-audio-ui/utils/audio-utils.js';

@customElement('demo-kinetic-lyrics')
export class DemoKineticLyrics extends LitElement {
  @property({type: String}) src = '';
  @property({type: String}) lyrics = '';
  @property({type: String}) font = '16px Inter, sans-serif';
  @property({type: String}) color = '#e8def8';

  @query('canvas') private _canvas!: HTMLCanvasElement;
  @query('.container') private _container!: HTMLDivElement;
  @query('audio') private _audioEl!: HTMLAudioElement;

  @state() private _peaks: number[] | null = null;
  @state() private _isPlaying = false;

  private _resizeObserver?: ResizeObserver;
  private _preparedText: PreparedTextWithSegments | null = null;
  private _layoutLines: LayoutLine[] | null = null;
  private _animationFrameId = 0;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      background: var(--md-sys-color-surface-container-low, #1e1e1e);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--md-sys-color-outline-variant, #444);
    }
    .container {
      position: relative;
      width: 100%;
      height: 150px;
    }
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      height: 100%;
      width: 100%;
    }
    .controls {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: var(--md-sys-color-surface-container-highest, #333);
      gap: 16px;
    }
    button {
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      background: var(--md-sys-color-primary, #0066cc);
      color: var(--md-sys-color-on-primary, #fff);
      cursor: pointer;
      font-weight: bold;
    }
  `;

  render() {
    return html`
      <div class="container">
        <canvas></canvas>
      </div>
      <div class="controls">
        <button @click=${this._togglePlay}>${this._isPlaying ? 'Pause' : 'Play'}</button>
        <span style="font-size: 14px; color: var(--md-sys-color-on-surface-variant, #aaa)">
          Kinetic text responding to RMS audio peaks
        </span>
      </div>
      <audio src=${this.src} preload="auto" @ended=${() => this._isPlaying = false}></audio>
    `;
  }

  async firstUpdated() {
    this._resizeObserver = new ResizeObserver(() => {
      this._updateLayout();
    });
    this._resizeObserver.observe(this._container);

    if (this.src) {
      // Fetch ~100 peaks
      this._peaks = await computeAudioPeaks(this.src, 100);
      this._renderCanvas();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._resizeObserver) this._resizeObserver.disconnect();
    if (this._animationFrameId) cancelAnimationFrame(this._animationFrameId);
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('lyrics') || changedProperties.has('font')) {
      if (this.lyrics) {
        this._preparedText = prepareWithSegments(this.lyrics, this.font, { whiteSpace: 'pre-wrap' });
      } else {
        this._preparedText = null;
      }
      this._updateLayout();
    }
  }

  private _togglePlay() {
    if (!this._audioEl) return;
    if (this._isPlaying) {
      this._audioEl.pause();
      this._isPlaying = false;
      cancelAnimationFrame(this._animationFrameId);
    } else {
      this._audioEl.play();
      this._isPlaying = true;
      this._renderLoop();
    }
  }

  private _renderLoop() {
    if (!this._isPlaying) return;
    this._renderCanvas();
    this._animationFrameId = requestAnimationFrame(() => this._renderLoop());
  }

  private _updateLayout() {
    if (!this._preparedText || !this._container || !this._canvas) return;
    
    const width = this._container.getBoundingClientRect().width;
    const height = 150; // fixed for demo

    // Layout the text
    const lineHeight = 30; // some reasonable line height
    const { lines } = layoutWithLines(this._preparedText, width, lineHeight);
    this._layoutLines = lines;

    const dpr = window.devicePixelRatio || 1;
    this._canvas.width = width * dpr;
    this._canvas.height = height * dpr;
    this._canvas.style.width = `${width}px`;
    this._canvas.style.height = `${height}px`;

    this._renderCanvas();
  }

  private _renderCanvas() {
    if (!this._canvas || !this._layoutLines) return;
    const ctx = this._canvas.getContext('2d');
    if (!ctx) return;

    const width = this._canvas.getBoundingClientRect().width;
    const height = 150;
    const dpr = window.devicePixelRatio || 1;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    ctx.font = this.font;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.color;
    ctx.textAlign = 'left';

    const duration = this._audioEl?.duration || 1;
    const currentTime = this._audioEl?.currentTime || 0;
    const progress = duration > 0 ? currentTime / duration : 0;
    
    // Determine current peak index based on playback progress
    let currentPeak = 0.1;
    if (this._peaks && this._peaks.length > 0) {
      const peakIndex = Math.floor(progress * this._peaks.length);
      currentPeak = this._peaks[Math.min(peakIndex, this._peaks.length - 1)];
    }

    // A small pulsing effect on text scale based on RMS peak
    // Map peak (0.1 -> 1.0) to scale (1.0 -> 2.5)
    const scaleY = 1.0 + (currentPeak * 1.5);
    
    // We'll render all lines, but they stretch up and down to the music
    const lineHeight = 30;
    const totalTextHeight = this._layoutLines.length * lineHeight;
    const startY = (height - totalTextHeight) / 2 + lineHeight / 2;

    for (let i = 0; i < this._layoutLines.length; i++) {
      const line = this._layoutLines[i];
      const y = startY + i * lineHeight;

      ctx.save();
      
      // We want to scale from the center of the text line
      ctx.translate(0, y);
      ctx.scale(1, scaleY);
      ctx.translate(0, -y);

      // Color words differently based on progress? For simplicity, we just draw the line
      // But we can tint the text that has already "played"
      const lineProgressStart = i / this._layoutLines.length;
      if (progress > lineProgressStart) {
        ctx.fillStyle = '#ffffff';
        // Add a slight glow
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = currentPeak * 20;
      } else {
        ctx.fillStyle = '#888888';
        ctx.shadowBlur = 0;
      }

      ctx.fillText(line.text, 20, y);
      ctx.restore();
    }

    // Apply fade
    applyCanvasEdgeFade(ctx, width, height, 40);

    ctx.restore();
  }
}