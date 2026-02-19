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
    static { this.styles = css `
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
UiAudioVolumeSlider = __decorate([
    customElement('ui-audio-volume-slider')
], UiAudioVolumeSlider);
export { UiAudioVolumeSlider };
//# sourceMappingURL=ui-audio-volume-slider.js.map