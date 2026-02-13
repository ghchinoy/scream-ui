import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './ui-audio-provider';
import './ui-audio-play-button';
import './ui-audio-progress-slider';
import './ui-audio-time-display';

export interface AudioPlayerItem {
  id: string | number;
  src: string;
}

/**
 * A monolithic backward-compatibility wrapper that renders the classic ElevenLabs 
 * pill-shaped audio player. Internally, it relies completely on the new 
 * compound <ui-audio-provider> architecture.
 */
@customElement('ui-audio-player')
export class UiAudioPlayer extends LitElement {
  @property({ type: Object }) item?: AudioPlayerItem;

  static styles = css`
    :host {
      display: inline-block;
      width: 100%;
      max-width: 400px;
    }

    .player-pill {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 24px;
      background: var(--md-sys-color-surface-container-high, #e2e2e2);
      border-radius: 999px; /* Pill shape */
      width: fit-content;
      font-family: inherit;
    }
    
    .time-container {
      min-width: 85px; /* prevent jitter when times change */
    }

    .slider-container {
      width: 200px;
      display: flex;
      align-items: center;
    }
  `;

  render() {
    return html`
      <ui-audio-provider .src="${this.item?.src || ''}">
        <div class="player-pill" part="container">
          
          <!-- Atomic Play/Pause Button -->
          <ui-audio-play-button></ui-audio-play-button>

          <!-- Atomic Time Display (Full format: 0:00 / 0:00) -->
          <div class="time-container">
            <ui-audio-time-display format="full"></ui-audio-time-display>
          </div>

          <!-- Atomic Slider -->
          <div class="slider-container">
            <ui-audio-progress-slider></ui-audio-progress-slider>
          </div>

        </div>
      </ui-audio-provider>
    `;
  }
}
