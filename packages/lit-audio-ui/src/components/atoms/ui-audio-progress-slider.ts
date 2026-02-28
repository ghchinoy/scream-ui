import {LitElement, html, css} from 'lit';
import {customElement, property, state, query} from 'lit/decorators.js';
import {formatAudioTime} from '../../utils/audio-utils.js';
import {consume} from '@lit/context';
import {
  audioPlayerContext,
  type AudioPlayerState,
} from '../../utils/audio-context.js';
import '@material/web/slider/slider.js';

@customElement('ui-audio-progress-slider')
export class UiAudioProgressSlider extends LitElement {
  @consume({context: audioPlayerContext, subscribe: true})
  @property({attribute: false})
  public playerState?: AudioPlayerState;

  private _isDragging = false;
  private _dragValue = 0;

  @property({type: Boolean}) hoverTimestamp = false;
  @state() private _hoverX = 0;
  @state() private _showHover = false;
  @state() private _hoverTime = 0;
  @query('md-slider') private _sliderEl!: HTMLElement;

  static styles = css`
    

    :host {
      display: flex;
      width: 100%;
      align-items: center;
      min-width: 0;
      position: relative;
    }

    .hover-tooltip {
      position: absolute;
      top: -32px;
      transform: translateX(-50%);
      background: var(--md-sys-color-inverse-surface, #313033);
      color: var(--md-sys-color-inverse-on-surface, #f4eff4);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-family: inherit;
      font-variant-numeric: tabular-nums;
      pointer-events: none;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.1s ease;
      z-index: 10;
    }
    .hover-tooltip.show {
      opacity: 1;
      visibility: visible;
    }
    /* Little downward pointing triangle */
    .hover-tooltip::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      border-width: 4px 4px 0;
      border-style: solid;
      border-color: var(--md-sys-color-inverse-surface, #313033) transparent transparent transparent;
    }

    md-slider {
      width: 100%;
      min-width: 0;
      flex: 1;
      /* Give the slider track better contrast against backgrounds */
      --md-slider-inactive-track-color: var(--md-sys-color-outline, #79747e);
    }
  `;

  render() {
    const duration = this.playerState?.duration || 0;
    const disabled = duration === 0 || !this.playerState?.src;

    // Smooth rendering: if user is actively dragging, display their local drag value,
    // otherwise display the context's current time.
    const currentValue = this._isDragging
      ? this._dragValue
      : this.playerState?.currentTime || 0;

    return html`
      <div 
        style="position: relative; width: 100%; display: flex; align-items: center;"
        @mousemove="${this._handleMouseMove}"
        @mouseenter="${() => this._showHover = true}"
        @mouseleave="${() => this._showHover = false}"
      >
        ${this.hoverTimestamp && this.playerState?.src ? html`
          <div 
            class="hover-tooltip ${this._showHover ? 'show' : ''}" 
            style="left: ${this._hoverX}px;"
          >
            ${formatAudioTime(this._hoverTime)}
          </div>
        ` : ''}
        <md-slider
        part="slider"
        aria-label="Playback progress"
        min="0"
        max="${duration || 100}"
        value="${currentValue}"
        step="0.1"
        ?disabled="${disabled}"
        @input="${this._handleInput}"
        @change="${this._handleChange}"
        ></md-slider>
      </div>
    `;
  }

  private _handleMouseMove(e: MouseEvent) {
    if (!this.hoverTimestamp || !this._sliderEl || !this.playerState?.duration) return;
    
    // Get bounding box of the md-slider track to calculate percentage.
    // Since md-slider internal track is basically 100% width, we can use its bounding rect.
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    
    // Constrain X coordinate inside the slider box
    let localX = e.clientX - rect.left;
    localX = Math.max(0, Math.min(localX, rect.width));
    
    this._hoverX = localX;
    
    const percent = localX / rect.width;
    this._hoverTime = percent * this.playerState.duration;
  }

  private _handleInput(e: Event) {
    this._isDragging = true;
    const slider = e.target as any;
    this._dragValue = slider.value;
  }

  private _handleChange(e: Event) {
    const slider = e.target as any;
    this._dragValue = slider.value;

    if (this.playerState) {
      this.playerState.seek(this._dragValue);
    }

    this._isDragging = false;
  }
}
