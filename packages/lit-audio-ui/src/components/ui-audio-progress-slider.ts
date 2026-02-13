import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { audioPlayerContext, type AudioPlayerState } from '../utils/audio-context';
import '@material/web/slider/slider.js';

@customElement('ui-audio-progress-slider')
export class UiAudioProgressSlider extends LitElement {
  @consume({ context: audioPlayerContext, subscribe: true })
  @property({ attribute: false })
  public playerState?: AudioPlayerState;

  private _isDragging = false;
  private _dragValue = 0;

  static styles = css`
    :host {
      display: flex;
      width: 100%;
      align-items: center;
      min-width: 100px;
    }

    md-slider {
      width: 100%;
      /* Give the slider track better contrast against backgrounds */
      --md-slider-inactive-track-color: var(--md-sys-color-outline, #79747e);
    }
  `;

  render() {
    const duration = this.playerState?.duration || 0;
    const disabled = duration === 0 || !this.playerState?.src;
    
    // Smooth rendering: if user is actively dragging, display their local drag value, 
    // otherwise display the context's current time.
    const currentValue = this._isDragging ? this._dragValue : (this.playerState?.currentTime || 0);

    return html`
      <md-slider
        min="0"
        max="${duration || 100}"
        value="${currentValue}"
        step="0.1"
        ?disabled="${disabled}"
        @input="${this._handleInput}"
        @change="${this._handleChange}"
      ></md-slider>
    `;
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
