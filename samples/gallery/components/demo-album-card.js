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
let DemoAlbumCard = class DemoAlbumCard extends LitElement {
    constructor() {
        super(...arguments);
        this._playlist = [
            {
                id: 'starlight',
                src: 'https://storage.googleapis.com/scream-ui-samples/starlight_silicon.mp3',
                title: 'Starlight Silicon',
                artist: 'Scream Labs',
                artwork: 'https://storage.googleapis.com/scream-ui-samples/starlight_silicon.png',
            },
            {
                id: 'deep-learning',
                src: 'https://storage.googleapis.com/scream-ui-samples/deep_learning.mp3',
                title: 'Deep Learning',
                artist: 'Neural Orchestra',
                artwork: 'https://storage.googleapis.com/scream-ui-samples/deep_learning.png',
            },
            {
                id: 'ether',
                src: 'https://storage.googleapis.com/scream-ui-samples/ether_drift.mp3',
                title: 'Ether Drift',
                artist: 'Digital Ghost',
                artwork: 'https://storage.googleapis.com/scream-ui-samples/cinematic.png',
            },
        ];
    }
    static { this.styles = css `
    :host {
      display: block;
      max-width: 320px;
      margin: 0 auto;
    }

    .album-container {
      width: 320px;
      height: 320px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
    }

    .art-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      background: #000;
    }

    .album-art {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .visualizer-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 80px;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
      display: flex;
      align-items: flex-end;
      padding: 0 12px 8px 12px;
      pointer-events: none;
    }

    .track-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 20px;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), transparent);
      color: white;
      text-align: left;
      pointer-events: none;
    }

    .track-title {
      margin: 0;
      font-weight: 700;
      font-size: 1.1rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .track-artist {
      margin: 0;
      font-size: 0.85rem;
      opacity: 0.9;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .back-content {
      width: 100%;
      height: 100%;
      background: var(--md-sys-color-surface-container-low);
      display: flex;
      flex-direction: column;
    }

    .playlist-wrapper {
      flex: 1;
      overflow-y: auto;
    }

    .controls-strip {
      padding: 12px;
      display: flex;
      justify-content: center;
      gap: 12px;
      background: var(--md-sys-color-surface-container);
      border-top: 1px solid var(--md-sys-color-outline-variant);
    }

    .flip-btn {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      pointer-events: auto; /* Ensure it's clickable above overlays */
    }

    .flip-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-size: 18px;
    }
  `; }
    render() {
        return html `
      <ui-audio-provider
        .items="${this._playlist}"
        @state-change="${() => this.requestUpdate()}"
      >
        <div class="album-container">
          <ui-3d-flip id="flip-engine">
            <!-- FRONT SIDE -->
            <div slot="front" class="art-wrapper" @click=${this._toggleFlip}>
              <img
                class="album-art"
                src="${this._getCurrentTrack()?.artwork}"
                alt="Cover"
              />

              <div class="track-overlay">
                <h4 class="track-title">${this._getCurrentTrack()?.title}</h4>
                <p class="track-artist">${this._getCurrentTrack()?.artist}</p>
              </div>

              <div class="visualizer-overlay">
                <ui-spectrum-visualizer
                  height="60"
                  barWidth="3"
                  barGap="1"
                  color="rgba(255,255,255,0.8)"
                >
                </ui-spectrum-visualizer>
              </div>
            </div>

            <!-- BACK SIDE -->
            <div slot="back" class="back-content">
              <div class="playlist-wrapper">
                <ui-playlist header="Album Tracks"></ui-playlist>
              </div>
              <div class="controls-strip">
                <ui-audio-prev-button></ui-audio-prev-button>
                <ui-audio-play-button></ui-audio-play-button>
                <ui-audio-next-button></ui-audio-next-button>
              </div>
            </div>

            <!-- CUSTOM FLIP ICONS -->
            <div slot="flip-icon" class="flip-btn" @click=${this._toggleFlip}>
              <span class="material-symbols-outlined">queue_music</span>
            </div>
            <div
              slot="flip-icon-back"
              class="flip-btn"
              @click=${this._toggleFlip}
              style="background: var(--md-sys-color-primary); color: white; border: none;"
            >
              <span class="material-symbols-outlined">image</span>
            </div>
          </ui-3d-flip>
        </div>
      </ui-audio-provider>
    `;
    }
    _toggleFlip(e) {
        e.stopPropagation(); // Prevent double-triggering if parent wrapper also has a listener
        const flip = this.shadowRoot?.getElementById('flip-engine');
        if (flip)
            flip.toggle();
    }
    _getCurrentTrack() {
        const provider = this.shadowRoot?.querySelector('ui-audio-provider');
        const index = provider?.state?.currentIndex ?? 0;
        return this._playlist[index >= 0 ? index : 0];
    }
};
__decorate([
    state()
], DemoAlbumCard.prototype, "_playlist", void 0);
DemoAlbumCard = __decorate([
    customElement('demo-album-card')
], DemoAlbumCard);
export { DemoAlbumCard };
//# sourceMappingURL=demo-album-card.js.map