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

import {LitElement, html, css} from 'lit';
import {customElement, query} from 'lit/decorators.js';
import '../../src/components/atoms/ui-timed-text.js';

@customElement('demo-podcast-player')
export class DemoPodcastPlayer extends LitElement {
  @query('#orb') private _orb!: any;

  private _mockTranscript = [
    { text: "Welcome", start: 0, end: 0.5 },
    { text: "to", start: 0.5, end: 0.7 },
    { text: "this", start: 0.7, end: 1.0 },
    { text: "episode", start: 1.0, end: 1.5 },
    { text: "on", start: 1.5, end: 1.7 },
    { text: "Web", start: 1.7, end: 2.0 },
    { text: "Components.", start: 2.0, end: 2.5 },
    { text: "We", start: 2.5, end: 2.8 },
    { text: "are", start: 2.8, end: 3.0 },
    { text: "building", start: 3.0, end: 3.5 },
    { text: "accessible", start: 3.5, end: 4.2 },
    { text: "and", start: 4.2, end: 4.4 },
    { text: "high", start: 4.4, end: 4.7 },
    { text: "performance", start: 4.7, end: 5.5 },
    { text: "UI", start: 5.5, end: 5.8 },
    { text: "library", start: 5.8, end: 6.3 },
    { text: "for", start: 6.3, end: 6.5 },
    { text: "everyone.", start: 6.5, end: 7.2 }
  ];

  static styles = css`
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
    .transcript-view {
      background: var(--md-sys-color-surface-container-high);
      padding: 12px;
      border-radius: 12px;
      font-size: 0.9rem;
    }
  `;

  render() {
    return html`
      <ui-audio-provider
        src="https://storage.googleapis.com/scream-ui-samples/speech_sample-Orus-20260213-082038.wav"
        .transcript=${this._mockTranscript}
        @state-change="${this._handleState}"
      >
        <div class="custom-podcast-card">
          <div class="custom-podcast-header">
            <div class="custom-podcast-art">
              <ui-orb id="orb" agentState="idle"></ui-orb>
            </div>
            <div class="custom-podcast-info">
              <h4 class="custom-podcast-title">
                Episode 4: The WebComponent Revolution
              </h4>
              <h5 class="custom-podcast-author">By Orus The Storyteller</h5>
            </div>
            <ui-audio-play-button></ui-audio-play-button>
          </div>
          
          <div class="transcript-view">
            <ui-timed-text>
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; opacity: 0.6; display: block; margin-bottom: 4px;">Transcript</span>
            </ui-timed-text>
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
    await import('../../src/components/molecules/ui-orb.js');
  }

  private _handleState(e: CustomEvent) {
    if (this._orb) {
      this._orb.agentState = e.detail.isPlaying ? 'talking' : 'idle';
    }
  }
}
