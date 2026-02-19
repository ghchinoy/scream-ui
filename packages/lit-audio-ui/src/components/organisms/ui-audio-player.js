var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../providers/ui-audio-provider.js';
import '../atoms/ui-audio-play-button.js';
import '../atoms/ui-audio-progress-slider.js';
import '../atoms/ui-audio-time-display.js';
import '../atoms/ui-audio-player-error.js';
/**
 * A monolithic backward-compatibility wrapper that renders the classic ElevenLabs
 * pill-shaped audio player. Internally, it relies completely on the new
 * compound <ui-audio-provider> architecture.
 */
let UiAudioPlayer = class UiAudioPlayer extends LitElement {
    static { this.styles = css `
    :host {
      display: inline-block;
      width: 100%;
      max-width: 400px;
    }

    .player-pill {
      display: flex;
      align-items: center;
      gap: var(--ui-audio-player-gap, 16px);
      padding: var(--ui-audio-player-padding, 12px 24px);
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
  `; }
    render() {
        return html `
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

          <!-- Visual Error Indicator -->
          <ui-audio-player-error></ui-audio-player-error>
        </div>
      </ui-audio-provider>
    `;
    }
};
__decorate([
    property({ type: Object })
], UiAudioPlayer.prototype, "item", void 0);
UiAudioPlayer = __decorate([
    customElement('ui-audio-player')
], UiAudioPlayer);
export { UiAudioPlayer };
//# sourceMappingURL=ui-audio-player.js.map