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
import { customElement, state } from 'lit/decorators.js';
let DemoMediaDashboard = class DemoMediaDashboard extends LitElement {
    constructor() {
        super(...arguments);
        this._playlist = [
            {
                id: 'dash-1',
                src: 'https://storage.googleapis.com/scream-ui-samples/neon_pulse.mp3',
                title: 'Neon Pulse',
                artist: 'Scream Network',
                artwork: 'https://storage.googleapis.com/scream-ui-samples/cinematic.png',
            },
            {
                id: 'dash-2',
                src: 'https://storage.googleapis.com/scream-ui-samples/neural_flux.mp3',
                title: 'Neural Flux',
                artist: 'Digital Echo',
                artwork: 'https://storage.googleapis.com/scream-ui-samples/neural_flux.png',
            },
            {
                id: 'dash-3',
                src: 'https://storage.googleapis.com/scream-ui-samples/digital_horizon.mp3',
                title: 'Digital Horizon',
                artist: 'Acoustic AI',
                artwork: 'https://storage.googleapis.com/scream-ui-samples/acoustic.png',
            },
            {
                id: 'dash-4',
                src: 'https://storage.googleapis.com/scream-ui-samples/latent_space.mp3',
                title: 'Latent Space',
                artist: 'Scream Labs',
                artwork: 'https://storage.googleapis.com/scream-ui-samples/lofi.png',
            },
        ];
    }
    static { this.styles = css `
    :host {
      display: block;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      grid-template-rows: auto auto;
      gap: 1px;
      background: var(--md-sys-color-outline-variant);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      color: var(--md-sys-color-on-surface);
    }

    @media (max-width: 700px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    .hero-section {
      background: var(--md-sys-color-surface-container-high);
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      min-width: 0;
    }

    .now-playing-header {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .mini-art {
      width: 64px;
      height: 64px;
      border-radius: 8px;
      object-fit: cover;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .track-meta {
      flex: 1;
      min-width: 0;
    }

    .track-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .track-artist {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.7;
    }

    .viz-container {
      height: 120px;
      background: var(
        --md-sys-color-surface-container-lowest,
        rgba(0, 0, 0, 0.05)
      );
      border-radius: 12px;
      overflow: hidden;
      position: relative;
    }

    .sidebar {
      background: var(--md-sys-color-surface-container);
      grid-row: 1 / 3;
      grid-column: 2;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    @media (max-width: 700px) {
      .sidebar {
        grid-row: auto;
        grid-column: 1;
        max-height: 300px;
      }
    }

    .playlist-scroll {
      flex: 1;
      overflow-y: auto;
    }

    .bottom-bar {
      grid-column: 1;
      background: var(--md-sys-color-surface-container-highest);
      padding: 16px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    @media (max-width: 700px) {
      .bottom-bar {
        grid-column: 1;
        flex-direction: column;
        gap: 16px;
      }
    }

    .nav-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .progress-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .buffering-indicator {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--md-sys-color-primary);
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% {
        opacity: 0.4;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.4;
      }
    }
  `; }
    render() {
        return html `
      <ui-audio-provider
        id="dash-provider"
        .items="${this._playlist}"
        @state-change="${() => this.requestUpdate()}"
      >
        <div class="dashboard-grid">
          <!-- MAIN HERO -->
          <div class="hero-section">
            <div class="now-playing-header">
              <img
                class="mini-art"
                src="${this._getCurrentTrack()?.artwork}"
                alt="Art"
              />
              <div class="track-meta">
                <h3 class="track-title">${this._getCurrentTrack()?.title}</h3>
                <p class="track-artist">${this._getCurrentTrack()?.artist}</p>
              </div>
              ${this._isBuffering()
            ? html `<span class="buffering-indicator">Buffering...</span>`
            : ''}
            </div>

            <div class="viz-container">
              <ui-spectrum-visualizer height="120" barWidth="4" barGap="2">
              </ui-spectrum-visualizer>
            </div>
          </div>

          <!-- SIDEBAR PLAYLIST -->
          <div class="sidebar">
            <div class="playlist-scroll">
              <ui-playlist header="Up Next"></ui-playlist>
            </div>
            <div
              style="padding: 16px; border-top: 1px solid var(--md-sys-color-outline-variant);"
            >
              <ui-audio-volume-slider></ui-audio-volume-slider>
            </div>
          </div>

          <!-- BOTTOM TRANSPORT -->
          <div class="bottom-bar">
            <div class="nav-controls">
              <ui-audio-prev-button></ui-audio-prev-button>
              <ui-audio-play-button></ui-audio-play-button>
              <ui-audio-next-button></ui-audio-next-button>
            </div>

            <div class="progress-area">
              <ui-audio-progress-slider></ui-audio-progress-slider>
              <div
                style="display: flex; justify-content: space-between; align-items: center;"
              >
                <ui-audio-time-display
                  format="combined"
                  separator=" of "
                  style="font-size: 11px; font-weight: 600; opacity: 0.8;"
                >
                </ui-audio-time-display>
                <span
                  style="font-size: 10px; opacity: 0.5; font-family: monospace;"
                >
                  INDEX: ${this._getCurrentIndex() + 1}/${this._playlist.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ui-audio-provider>
    `;
    }
    _getCurrentTrack() {
        const provider = this.shadowRoot?.getElementById('dash-provider');
        const index = provider?.state?.currentIndex ?? 0;
        return this._playlist[index >= 0 ? index : 0];
    }
    _getCurrentIndex() {
        const provider = this.shadowRoot?.getElementById('dash-provider');
        return provider?.state?.currentIndex ?? 0;
    }
    _isBuffering() {
        const provider = this.shadowRoot?.getElementById('dash-provider');
        return provider?.state?.isBuffering ?? false;
    }
};
__decorate([
    state()
], DemoMediaDashboard.prototype, "_playlist", void 0);
DemoMediaDashboard = __decorate([
    customElement('demo-media-dashboard')
], DemoMediaDashboard);
export { DemoMediaDashboard };
//# sourceMappingURL=demo-media-dashboard.js.map