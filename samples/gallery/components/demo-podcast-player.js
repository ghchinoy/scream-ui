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
import { customElement, query, state } from 'lit/decorators.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-scrolling-waveform.js';
let DemoPodcastPlayer = class DemoPodcastPlayer extends LitElement {
    constructor() {
        super(...arguments);
        this._isPlaying = false;
    }
    static { this.styles = css `
    :host {
      display: block;
      font-family: inherit;
    }
    .custom-podcast-card {
      background: var(--md-sys-color-surface-container);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 320px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin: 0 auto;
    }
    .custom-podcast-header {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .custom-podcast-art {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      flex-shrink: 0;
      background: var(--md-sys-color-surface-container-highest);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .custom-podcast-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .custom-podcast-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--md-sys-color-on-surface);
      line-height: 1.2;
    }
    .custom-podcast-author {
      margin: 0;
      font-size: 0.85rem;
      color: var(--md-sys-color-on-surface-variant);
    }
    .custom-podcast-scrubber {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .waveform-view {
      background: var(--md-sys-color-surface-container-high);
      padding: 12px;
      border-radius: 12px;
      height: 48px;
      display: flex;
      align-items: center;
    }
  `; }
    render() {
        return html `
      <ui-audio-provider
        src="https://storage.googleapis.com/scream-ui-samples/speech_sample-Orus-20260213-082038.wav"
        @state-change="${this._handleState}"
      >
        <div class="custom-podcast-card">
          <div class="custom-podcast-header">
            <div class="custom-podcast-art">
              <ui-orb 
                id="orb" 
                agentState="idle"
                .colors="${['#4285F4', '#1967D2']}"
              ></ui-orb>
            </div>
            <div class="custom-podcast-info">
              <h4 class="custom-podcast-title">
                Episode 4: The WebComponent Revolution
              </h4>
              <p class="custom-podcast-author">By Orus The Storyteller</p>
            </div>
            <ui-audio-play-button></ui-audio-play-button>
          </div>
          
          <div class="waveform-view">
            <ui-scrolling-waveform
              .active=${this._isPlaying}
              .analyserNode=${this._analyser}
              height="32"
              barWidth="2"
              barGap="1"
            ></ui-scrolling-waveform>
          </div>

          <div class="custom-podcast-scrubber">
            <ui-audio-time-display format="elapsed"></ui-audio-time-display>
            <div style="flex: 1;">
              <ui-audio-progress-slider></ui-audio-progress-slider>
            </div>
            <ui-audio-time-display format="remaining"></ui-audio-time-display>
          </div>
        </div>
      </ui-audio-provider>
    `;
    }
    async firstUpdated() {
        // @ts-ignore - Ignore missing declaration file for dynamic import
        await import('@ghchinoy/lit-audio-ui/molecules/ui-orb.js');
    }
    _handleState(e) {
        this._isPlaying = e.detail.isPlaying;
        this._analyser = e.detail.analyserNode;
        if (this._orb) {
            this._orb.agentState = this._isPlaying ? 'talking' : 'idle';
        }
    }
};
__decorate([
    query('#orb')
], DemoPodcastPlayer.prototype, "_orb", void 0);
__decorate([
    state()
], DemoPodcastPlayer.prototype, "_isPlaying", void 0);
__decorate([
    state()
], DemoPodcastPlayer.prototype, "_analyser", void 0);
DemoPodcastPlayer = __decorate([
    customElement('demo-podcast-player')
], DemoPodcastPlayer);
export { DemoPodcastPlayer };
//# sourceMappingURL=demo-podcast-player.js.map