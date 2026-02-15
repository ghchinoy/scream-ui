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

@customElement('demo-podcast-player')
export class DemoPodcastPlayer extends LitElement {
  @query('#orb') private _orb!: any;

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
      background: linear-gradient(
        135deg,
        var(--md-sys-color-primary),
        var(--md-sys-color-secondary-container)
      );
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
  `;

  render() {
    return html`
      <ui-audio-provider
        src="https://storage.googleapis.com/scream-ui-samples/speech_sample-Orus-20260213-082038.wav"
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
              <p class="custom-podcast-author">By Orus The Storyteller</p>
            </div>
            <ui-audio-play-button></ui-audio-play-button>
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
