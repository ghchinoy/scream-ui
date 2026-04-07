/**
 * Copyright 2026 Google LLC
 */

import {LitElement, html, css, PropertyValues} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {consume} from '@lit/context';
import { prepareWithSegments, layoutWithLines, type PreparedTextWithSegments, type LayoutLine } from '@chenglou/pretext';
import {
  audioPlayerContext,
  type AudioPlayerState,
} from '@ghchinoy/lit-audio-ui';

/**
 * ATOM: Synced Transcript
 * Renders a transcript with word-level highlighting synchronized to audio playback using pretext on a Canvas.
 * Consumes AudioPlayerState for timing and transcript data.
 *
 * @element ui-synced-transcript
 */
@customElement('ui-synced-transcript')
export class UiSyncedTranscript extends LitElement {
  @consume({context: audioPlayerContext, subscribe: true})
  @property({attribute: false})
  public playerState?: AudioPlayerState;

  @query('canvas') private _canvas!: HTMLCanvasElement;

  @property({type: String})
  public font = '16px Inter, sans-serif';

  @property({type: Number})
  public lineHeight = 24;
  
  @property({type: String})
  public textColor = '#444444'; // CSS variable fallback
  
  @property({type: String})
  public activeTextColor = '#1d192b';
  
  @property({type: String})
  public activeBgColor = '#e8def8';
  
  @property({type: String})
  public pastTextColor = '#aaaaaa';

  private _resizeObserver: ResizeObserver;
  private _preparedText: PreparedTextWithSegments | null = null;
  private _lastTranscriptText: string = '';
  private _layoutLines: LayoutLine[] | null = null;
  private _layoutHeight: number = 0;

  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .container {
      width: 100%;
      position: relative;
    }
    canvas {
      display: block;
      width: 100%;
    }
  `;

  constructor() {
    super();
    this._resizeObserver = new ResizeObserver(() => {
      this._updateLayout();
      this._renderCanvas();
    });
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver.disconnect();
  }

  override firstUpdated() {
    const container = this.shadowRoot?.querySelector('.container');
    if (container) {
      this._resizeObserver.observe(container);
    }
    
    // Read CSS variables for colors if they exist
    const style = getComputedStyle(this);
    const color = style.getPropertyValue('--ui-timed-text-color').trim();
    if (color) this.textColor = color;
    
    const activeColor = style.getPropertyValue('--ui-timed-text-active-color').trim();
    if (activeColor) this.activeTextColor = activeColor;
    
    const activeBg = style.getPropertyValue('--ui-timed-text-active-bg').trim();
    if (activeBg) this.activeBgColor = activeBg;
    
    const pastColor = style.getPropertyValue('--ui-timed-text-past-color').trim();
    if (pastColor) this.pastTextColor = pastColor;
  }

  override updated(changedProperties: PropertyValues) {
    if (changedProperties.has('playerState') || changedProperties.has('font') || changedProperties.has('lineHeight')) {
      const transcript = this.playerState?.transcript || [];
      const fullText = transcript.map((t: any) => t.text).join("");
      
      if (fullText !== this._lastTranscriptText || changedProperties.has('font')) {
        this._lastTranscriptText = fullText;
        if (fullText) {
            this._preparedText = prepareWithSegments(fullText, this.font, { whiteSpace: 'pre-wrap' });
        } else {
            this._preparedText = null;
        }
        this._updateLayout();
      }
      this._renderCanvas();
    }
  }

  private _updateLayout() {
    if (!this._preparedText || !this._canvas) return;
    const container = this.shadowRoot?.querySelector('.container');
    if (!container) return;

    const containerEl = container as HTMLElement;
    const width = containerEl.clientWidth;
    if (width === 0) return;

    const { height, lines } = layoutWithLines(this._preparedText, width, this.lineHeight);
    this._layoutLines = lines;
    this._layoutHeight = height;

    const dpr = window.devicePixelRatio || 1;
    this._canvas.width = width * dpr;
    this._canvas.height = height * dpr;
    // Let CSS handle width: 100%, just set the height
    this._canvas.style.height = `${height}px`;

    // In order for Lit to know the host should be the right height, we could style the container height
    containerEl.style.height = `${height}px`;  }

  private _renderCanvas() {
    if (!this._canvas || !this._layoutLines) return;
    const container = this.shadowRoot?.querySelector('.container');
    if (!container) return;

    const ctx = this._canvas.getContext('2d');
    if (!ctx) return;

    const width = (container as HTMLElement).clientWidth;
    const height = this._layoutHeight;
    const dpr = window.devicePixelRatio || 1;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    
    ctx.font = this.font;
    ctx.textBaseline = 'top';

    const transcript = this.playerState?.transcript || [];
    const currentTime = this.playerState?.currentTime || 0;

    let wordIndex = 0;
    
    for (let i = 0; i < this._layoutLines.length; i++) {
      const line = this._layoutLines[i];
      const y = i * this.lineHeight;
      
      let xOffset = 0;
      
      // Simple word by word split for rendering highlights
      const wordsInLine = line.text.split(/(?<=\s)/);
      
      for (const textPart of wordsInLine) {
        let currentWordObj = transcript[wordIndex];
        
        const isActive = currentWordObj && currentTime >= currentWordObj.start && currentTime <= currentWordObj.end;
        const isPast = currentWordObj && currentTime > currentWordObj.end;
        
        const wordWidth = ctx.measureText(textPart).width;

        if (isActive) {
          ctx.fillStyle = this.activeBgColor;
          ctx.beginPath();
          // Adding a little padding to the background
          ctx.roundRect(xOffset, y, wordWidth, this.lineHeight - 4, 4);
          ctx.fill();
          ctx.fillStyle = this.activeTextColor;
        } else if (isPast) {
          ctx.fillStyle = this.pastTextColor;
        } else {
          ctx.fillStyle = this.textColor;
        }
        
        ctx.fillText(textPart, xOffset, y);
        xOffset += wordWidth;
        
        if (textPart.endsWith(' ')) {
          wordIndex++;
        } else if (wordIndex < transcript.length - 1 && textPart === transcript[wordIndex].text.trim()) {
          wordIndex++;
        }
      }
    }

    ctx.restore();
  }

  override render() {
    return html`
      <div class="container">
        <canvas></canvas>
      </div>
    `;
  }
}
