import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { audioPlayerContext, type AudioPlayerState } from '../utils/audio-context';
import '@material/web/slider/slider.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';

@customElement('ui-audio-volume-slider')
export class UiAudioVolumeSlider extends LitElement {
  @consume({ context: audioPlayerContext, subscribe: true })
  @property({ attribute: false })
  public playerState?: AudioPlayerState;

  static styles = css`
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
      --md-slider-inactive-track-color: var(--md-sys-color-outline-variant, #c4c7c5);
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

    return html`
      <md-icon-button @click="${this._toggleMute}" part="button">
        <md-icon>${icon}</md-icon>
      </md-icon-button>
      <md-slider
        part="slider"
        min="0"
        max="1"
        value="${muted ? 0 : volume}"
        step="0.01"
        ?disabled="${!this.playerState?.src}"
        @input="${this._handleInput}"
      ></md-slider>
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
