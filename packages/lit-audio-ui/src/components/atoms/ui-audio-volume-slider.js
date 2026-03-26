var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { audioPlayerContext, } from '../../utils/audio-context.js';
import '@material/web/slider/slider.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';
let UiAudioVolumeSlider = class UiAudioVolumeSlider extends LitElement {
    constructor() {
        super(...arguments);
        this.variant = 'inline';
        this._isOpen = false;
    }
    static { this.styles = css `
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
      width: 48px;
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
    :host([variant="popover"]) .slider-wrapper {
      width: 4px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    /* Native range input styling for vertical support */
    :host([variant="popover"]) input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      cursor: pointer;
      width: 100px;
      height: 4px;
      transform: rotate(-90deg);
      margin: 0;
      position: absolute;
    }
    :host([variant="popover"]) input[type="range"]::-webkit-slider-runnable-track {
      background: var(--md-sys-color-primary, #0066cc);
      height: 4px;
      border-radius: 2px;
    }
    :host([variant="popover"]) input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      margin-top: -6px; /* center thumb on track */
      background-color: var(--md-sys-color-primary, #0066cc);
      height: 16px;
      width: 16px;
      border-radius: 50%;
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
  `; }
    render() {
        const volume = this.playerState?.volume ?? 1;
        const muted = this.playerState?.muted ?? false;
        let icon = 'volume_up';
        if (muted || volume === 0)
            icon = 'volume_off';
        else if (volume < 0.5)
            icon = 'volume_down';
        const muteAriaLabel = muted ? 'Unmute audio' : 'Mute audio';
        if (this.variant === 'popover') {
            return html `
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
            <div class="slider-wrapper">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                .value="${muted ? '0' : volume.toString()}"
                ?disabled="${!this.playerState?.src}"
                @input="${this._handleInput}"
              />
            </div>
          </div>
        </div>
      `;
        }
        return html `
      <md-icon-button
        @click="${this._toggleMute}"
        part="button"
        aria-label="${muteAriaLabel}"
      >
        <md-icon>${icon}</md-icon>
      </md-icon-button>
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
    }
    _handleInput(e) {
        const slider = e.target;
        if (this.playerState) {
            this.playerState.setVolume(slider.value);
        }
    }
    _toggleMute() {
        if (this.playerState) {
            this.playerState.toggleMute();
        }
    }
};
__decorate([
    consume({ context: audioPlayerContext, subscribe: true }),
    property({ attribute: false })
], UiAudioVolumeSlider.prototype, "playerState", void 0);
__decorate([
    property({ type: String, reflect: true })
], UiAudioVolumeSlider.prototype, "variant", void 0);
__decorate([
    property({ type: Boolean, state: true })
], UiAudioVolumeSlider.prototype, "_isOpen", void 0);
UiAudioVolumeSlider = __decorate([
    customElement('ui-audio-volume-slider')
], UiAudioVolumeSlider);
export { UiAudioVolumeSlider };
//# sourceMappingURL=ui-audio-volume-slider.js.map