import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {consume} from '@lit/context';
import {
  audioPlayerContext,
  type AudioPlayerState,
} from '../../utils/audio-context.js';
import '@material/web/slider/slider.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';

@customElement('ui-audio-volume-slider')
export class UiAudioVolumeSlider extends LitElement {
  @consume({context: audioPlayerContext, subscribe: true})
  @property({attribute: false})
  public playerState?: AudioPlayerState;

  @property({type: String, reflect: true}) variant: 'inline' | 'popover' = 'inline';
  @property({type: Boolean, state: true}) private _isOpen = false;

  static styles = css`
    :host([variant="popover"]) {
      display: inline-block;
      width: auto;
      position: relative;
    }
    :host([variant="popover"]) .slider-container {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: var(--md-sys-color-surface-container-high, #e2e2e2);
      padding: 16px 8px;
      border-radius: 100px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 50;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s, visibility 0.2s;
    }
    :host([variant="popover"]) .slider-container.open {
      opacity: 1;
      visibility: visible;
    }
    :host([variant="popover"]) md-slider {
      height: 100px;
      width: 48px;
    }

    :host {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      box-sizing: border-box;
    }

    md-slider {
      flex: 1;
      min-width: 0; /* Prevent flex overflow */
      width: 100%;
      --md-slider-inactive-track-color: var(
        --md-sys-color-outline-variant,
        #c4c7c5
      );
    }

    md-icon-button {
      color: var(--md-sys-color-on-surface-variant, #444);
    }
  `;

  render() {
    const volume = this.playerState?.volume ?? 1;
    const muted = this.playerState?.muted ?? false;

    let icon = 'volume_up';
    if (muted || volume === 0) icon = 'volume_off';
    else if (volume < 0.5) icon = 'volume_down';

    const muteAriaLabel = muted ? 'Unmute audio' : 'Mute audio';

    const sliderHtml = html`
      <md-slider
        part="slider"
        aria-label="Volume"
        min="0"
        max="1"
        value="${muted ? 0 : volume}"
        step="0.01"
        ?disabled="${!this.playerState?.src}"
        @input="${this._handleInput}"
      ></md-slider>
    `;

    if (this.variant === 'popover') {
      return html`
        <div 
          @mouseenter="${() => this._isOpen = true}" 
          @mouseleave="${() => this._isOpen = false}"
          style="position: relative; display: inline-block;"
        >
          <md-icon-button
            @click="${this._toggleMute}"
            part="button"
            aria-label="${muteAriaLabel}"
          >
            <md-icon>${icon}</md-icon>
          </md-icon-button>
          <div class="slider-container ${this._isOpen ? 'open' : ''}">
            ${sliderHtml}
          </div>
        </div>
      `;
    }

    return html`
      <md-icon-button
        @click="${this._toggleMute}"
        part="button"
        aria-label="${muteAriaLabel}"
      >
        <md-icon>${icon}</md-icon>
      </md-icon-button>
      ${sliderHtml}
    `;
  }

  private _handleInput(e: Event) {
    const slider = e.target as any;
    if (this.playerState) {
      this.playerState.setVolume(slider.value);
    }
  }

  private _toggleMute() {
    if (this.playerState) {
      this.playerState.toggleMute();
    }
  }
}
