import {LitElement, html, css} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/icon/icon.js';
import '@material/web/slider/slider.js';
import '@material/web/progress/circular-progress.js';

export interface AudioPlayerItem {
  id: string | number;
  src: string;
}

/**
 * A native Lit WebComponent replacement for the ElevenLabs React audio-player.
 * It manages an internal <audio> element and binds its state to Material Web controls.
 */
@customElement('ui-audio-player')
export class UiAudioPlayer extends LitElement {
  @property({type: Object}) item?: AudioPlayerItem;

  @query('audio') private _audioEl!: HTMLAudioElement;

  @state() private _isPlaying = false;
  @state() private _isBuffering = false;
  @state() private _currentTime = 0;
  @state() private _duration = 0;

  private _animationFrameId: number = 0;
  private _isDraggingSlider = false;

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 24px;
      background: var(--md-sys-color-surface-container-high, #e2e2e2);
      border-radius: 999px; /* Pill shape */
      width: fit-content;
      font-family: inherit;
    }

    .play-button-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    md-filled-icon-button {
      --md-filled-icon-button-container-color: var(
        --md-sys-color-primary,
        #0066cc
      );
      --md-filled-icon-button-icon-color: var(
        --md-sys-color-on-primary,
        #ffffff
      );
      --md-filled-icon-button-hover-icon-color: var(
        --md-sys-color-on-primary,
        #ffffff
      );
      --md-filled-icon-button-focus-icon-color: var(
        --md-sys-color-on-primary,
        #ffffff
      );
      --md-filled-icon-button-pressed-icon-color: var(
        --md-sys-color-on-primary,
        #ffffff
      );

      --md-filled-icon-button-toggle-icon-color: var(
        --md-sys-color-on-primary,
        #ffffff
      );
      --md-filled-icon-button-selected-container-color: var(
        --md-sys-color-primary,
        #0066cc
      );
      --md-filled-icon-button-selected-icon-color: var(
        --md-sys-color-on-primary,
        #ffffff
      );
      color: var(--md-sys-color-on-primary, #ffffff);
    }

    md-icon {
      color: var(--md-sys-color-on-primary, #ffffff);
    }

    md-circular-progress {
      position: absolute;
      --md-circular-progress-size: 48px;
    }

    .time-display {
      font-variant-numeric: tabular-nums;
      font-size: 14px;
      color: var(--md-sys-color-on-surface-variant, #444);
      min-width: 85px; /* prevent jitter when times change */
    }

    .slider-container {
      width: 200px;
      display: flex;
      align-items: center;
    }

    md-slider {
      width: 100%;
    }
  `;

  render() {
    return html`
      <audio
        src="${this.item?.src || ''}"
        preload="metadata"
        @loadedmetadata="${this._handleLoadedMetadata}"
        @ended="${this._handleEnded}"
        @playing="${() => {
          this._isPlaying = true;
        }}"
        @pause="${() => {
          this._isPlaying = false;
        }}"
        @waiting="${() => {
          this._isBuffering = true;
        }}"
        @canplay="${() => {
          this._isBuffering = false;
        }}"
      ></audio>

      <div class="play-button-container">
        <md-filled-icon-button @click="${this._togglePlay}">
          <md-icon>${this._isPlaying ? 'pause' : 'play_arrow'}</md-icon>
        </md-filled-icon-button>
        ${this._isBuffering && this._isPlaying
          ? html`<md-circular-progress indeterminate></md-circular-progress>`
          : ''}
      </div>

      <div class="time-display">
        ${this._formatTime(this._currentTime)} /
        ${this._duration ? this._formatTime(this._duration) : '--:--'}
      </div>

      <div class="slider-container">
        <md-slider
          min="0"
          max="${this._duration || 100}"
          value="${this._currentTime}"
          step="0.1"
          ?disabled="${!this._duration}"
          @change="${this._handleSeekEnd}"
          @input="${this._handleSeekScrub}"
        ></md-slider>
      </div>
    `;
  }

  firstUpdated() {
    this._startTrackingTime();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
    }
  }

  private _togglePlay() {
    if (!this._audioEl.src) return;
    if (this._isPlaying) {
      this._audioEl.pause();
    } else {
      this._audioEl.play().catch(e => console.error('Error playing audio', e));
    }
  }

  private _handleLoadedMetadata() {
    this._duration = this._audioEl.duration;
  }

  private _handleEnded() {
    this._isPlaying = false;
    this._currentTime = 0;
    this._audioEl.currentTime = 0;
  }

  private _handleSeekScrub(e: Event) {
    this._isDraggingSlider = true;
    const slider = e.target as any;
    this._currentTime = slider.value;
  }

  private _handleSeekEnd(e: Event) {
    const slider = e.target as any;
    if (this._audioEl) {
      this._audioEl.currentTime = slider.value;
    }
    this._isDraggingSlider = false;
  }

  private _startTrackingTime() {
    const track = () => {
      // Only update internal time state if the user ISN'T dragging the slider,
      // otherwise they fight each other and cause jank.
      if (this._audioEl && !this._isDraggingSlider) {
        this._currentTime = this._audioEl.currentTime;
      }
      this._animationFrameId = requestAnimationFrame(track);
    };
    this._animationFrameId = requestAnimationFrame(track);
  }

  private _formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const formattedMins = mins < 10 && hrs > 0 ? '0' + mins : mins;
    const formattedSecs = secs < 10 ? '0' + secs : secs;

    return hrs > 0
      ? hrs + ':' + formattedMins + ':' + formattedSecs
      : formattedMins + ':' + formattedSecs;
  }
}
