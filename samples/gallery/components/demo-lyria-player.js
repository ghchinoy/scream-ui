/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
let DemoLyriaPlayer = class DemoLyriaPlayer extends LitElement {
    constructor() {
        super(...arguments);
        this._playlist = [
            {
                id: 'acoustic',
                src: 'https://storage.googleapis.com/scream-ui-samples/acoustic.wav',
                title: 'Calm Acoustic Guitar',
                artist: 'Lyria AI',
                artwork: 'https://storage.googleapis.com/scream-ui-samples/acoustic.png',
            },
            {
                id: 'lofi',
                src: 'https://storage.googleapis.com/scream-ui-samples/lofi.wav',
                title: 'Chill Lo-Fi Beat',
                artist: 'Lyria AI',
                artwork: 'https://storage.googleapis.com/scream-ui-samples/lofi.png',
            },
            {
                id: 'cinematic',
                src: 'https://storage.googleapis.com/scream-ui-samples/cinematic.wav',
                title: 'Cinematic Orchestral',
                artist: 'Lyria AI',
                artwork: 'https://storage.googleapis.com/scream-ui-samples/cinematic.png',
            },
        ];
    }
    static { this.styles = css `
    :host {
      display: block;
      font-family: inherit;
    }
    .music-player-card {
      background: var(--md-sys-color-surface-container);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 700px;
      box-sizing: border-box;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin: 0 auto;
    }
    .player-layout {
      display: flex;
      gap: 24px;
      align-items: center;
    }
    @media (max-width: 500px) {
      .player-layout {
        flex-direction: column;
      }
    }
    .album-art {
      width: 160px;
      height: 160px;
      border-radius: 12px;
      object-fit: cover;
      flex-shrink: 0;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      background: var(--md-sys-color-surface-container-highest);
    }
    .player-controls {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
    }
    .track-info {
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      padding-bottom: 12px;
    }
    .track-title {
      margin: 0;
      font-weight: 700;
      font-size: 1.2rem;
    }
    .track-artist {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.7;
    }
    .music-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
  `; }
    render() {
        return html `
      <ui-audio-provider
        id="music-provider"
        .items="${this._playlist}"
        @state-change="${this._handleState}"
      >
        <div class="music-player-card">
          <div class="player-layout">
            <img
              class="album-art"
              src="${this._getCurrentTrack()?.artwork}"
              alt="Album Art"
            />

            <div class="player-controls">
              <div class="track-info">
                <h3 class="track-title">${this._getCurrentTrack()?.title}</h3>
                <p class="track-artist">${this._getCurrentTrack()?.artist}</p>
              </div>

              <div
                style="height: 40px; border-radius: 8px; overflow: hidden; position: relative;"
              >
                <ui-scrolling-waveform
                  id="music-scroller"
                  speed="50"
                  height="40"
                  barWidth="3"
                  barGap="1"
                  ?active="${false}"
                ></ui-scrolling-waveform>
              </div>

              <div class="music-controls">
                <!-- Track Controls -->
                <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                  <ui-audio-prev-button></ui-audio-prev-button>
                  <ui-audio-play-button></ui-audio-play-button>
                  <ui-audio-next-button></ui-audio-next-button>
                </div>

                <!-- Progress / Scrubber -->
                <div style="flex: 1; display: flex; align-items: center; gap: 12px; padding: 0 16px; min-width: 0;">
                  <ui-audio-time-display
                    format="elapsed"
                    style="font-size: 12px; opacity: 0.8;"
                  ></ui-audio-time-display>
                  <div style="flex: 1; min-width: 0; width: 100%;">
                    <ui-audio-progress-slider style="width: 100%; display: block;"></ui-audio-progress-slider>
                  </div>
                  <ui-audio-time-display
                    format="remaining"
                    style="font-size: 12px; opacity: 0.8;"
                  ></ui-audio-time-display>
                </div>

                <!-- Volume Popover -->
                <div style="display: flex; justify-content: flex-end; flex-shrink: 0;">
                  <ui-audio-volume-slider variant="popover"></ui-audio-volume-slider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ui-audio-provider>
    `;
    }
    _getCurrentTrack() {
        const provider = this.shadowRoot?.getElementById('music-provider');
        if (provider && provider.state.currentIndex !== -1) {
            return this._playlist[provider.state.currentIndex];
        }
        return this._playlist[0];
    }
    _handleState(e) {
        const state = e.detail;
        if (this._scroller) {
            this._scroller.active = state.isPlaying;
            if (state.analyserNode) {
                this._scroller.analyserNode = state.analyserNode;
            }
        }
        this.requestUpdate(); // Ensure current track info updates when index changes
    }
};
__decorate([
    query('#music-scroller')
], DemoLyriaPlayer.prototype, "_scroller", void 0);
__decorate([
    state()
], DemoLyriaPlayer.prototype, "_playlist", void 0);
DemoLyriaPlayer = __decorate([
    customElement('demo-lyria-player')
], DemoLyriaPlayer);
export { DemoLyriaPlayer };
//# sourceMappingURL=demo-lyria-player.js.map