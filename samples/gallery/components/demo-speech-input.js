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
import '@ghchinoy/lit-audio-ui/providers/ui-speech-provider.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-voice-button.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-voice-pill.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-mic-selector.js';
import '@ghchinoy/lit-audio-ui/atoms/ui-speech-record-button.js';
import '@ghchinoy/lit-audio-ui/atoms/ui-speech-cancel-button.js';
let DemoSpeechInput = class DemoSpeechInput extends LitElement {
    constructor() {
        super(...arguments);
        this._state = 'idle';
        this._transcript = 'Listening...';
        this._fakeTranscript = [
            'I',
            ' am',
            ' recording',
            ' a',
            ' message',
            ' right',
            ' now...',
        ];
    }
    static { this.styles = css `
    :host {
      display: block;
      font-family: inherit;
    }
    .container {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    .section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    h3 {
      margin: 0;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--md-sys-color-outline);
    }
    .speech-input-card {
      background: var(--md-sys-color-surface-container);
      border-radius: 24px;
      padding: 8px 16px;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      max-width: fit-content;
    }
    .speech-input-card[state='recording'] {
      border: 1px solid var(--md-sys-color-primary);
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
    }
    .speech-preview {
      font-size: 14px;
      color: var(--md-sys-color-on-surface-variant);
      overflow: hidden;
      white-space: nowrap;
      width: 0;
      opacity: 0;
      transition:
        width 0.3s ease,
        opacity 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .speech-input-card[state='recording'] .speech-preview,
    .speech-input-card[state='processing'] .speech-preview {
      width: 180px;
      opacity: 1;
    }
    .mic-btn {
      background: transparent;
      border: none;
      padding: 6px;
      cursor: pointer;
      color: var(--md-sys-color-on-surface);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
    }
    .pulse {
      position: absolute;
      inset: 0;
      background: var(--md-sys-color-primary);
      border-radius: 50%;
      opacity: 0;
      transform: scale(0);
      transition: all 0.2s ease;
      z-index: -1;
    }
    .grid {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
    }
  `; }
    render() {
        const isRecording = this._state === 'recording';
        return html `
      <ui-speech-provider simulation .deviceId="${this._selectedDeviceId}">
        <div class="container">
          <div class="section">
            <h3>Standard Buttons & Hardware Selection</h3>
            <div class="grid">
              <ui-voice-button label="Record"></ui-voice-button>
              <ui-voice-pill label="Start Talking"></ui-voice-pill>
              <ui-mic-selector @device-change="${this._handleDeviceChange}"></ui-mic-selector>
            </div>
          </div>

          <div class="section">
            <h3>Atomic Elements (Composition)</h3>
            <div class="grid">
              <ui-speech-record-button></ui-speech-record-button>
              <ui-speech-cancel-button></ui-speech-cancel-button>
              <div style="width: 100px;">
                <ui-voice-waveform .height=${32}></ui-voice-waveform>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Custom Inline Input</h3>
            <div class="speech-input-card" state="${this._state}">
              <button
                class="mic-btn"
                @click="${this._toggleRecord}"
                style="color: ${isRecording
            ? 'var(--md-sys-color-on-primary)'
            : 'var(--md-sys-color-on-surface)'}"
              >
                <span class="material-symbols-outlined"
                  >${isRecording ? 'stop' : 'mic'}</span
                >
                <div
                  class="pulse"
                  style="opacity: ${isRecording
            ? '1'
            : '0'}; transform: ${isRecording ? 'scale(1)' : 'scale(0)'}"
                ></div>
              </button>

              <div class="speech-preview">
                <span
                  style="flex: 1; white-space: nowrap; overflow: hidden; mask-image: linear-gradient(to right, black 80%, transparent); -webkit-mask-image: linear-gradient(to right, black 80%, transparent);"
                  >${this._transcript}</span
                >
                <div
                  style="width: 32px; height: 20px; opacity: ${isRecording
            ? '1'
            : '0'}; transition: opacity 0.3s ease;"
                >
                  <ui-live-waveform
                    height="20"
                    barWidth="2"
                    barGap="1"
                    sensitivity="2.5"
                    ?active="${isRecording}"
                  ></ui-live-waveform>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ui-speech-provider>
    `;
    }
    _toggleRecord() {
        if (this._state === 'idle') {
            this._state = 'recording';
            this._transcript = 'Listening...';
            let wordIndex = 0;
            this._transcriptInterval = setInterval(() => {
                if (wordIndex < this._fakeTranscript.length) {
                    if (wordIndex === 0)
                        this._transcript = '';
                    this._transcript += this._fakeTranscript[wordIndex];
                    wordIndex++;
                }
            }, 400);
        }
        else if (this._state === 'recording') {
            clearInterval(this._transcriptInterval);
            this._state = 'processing';
            setTimeout(() => {
                this._state = 'success';
                setTimeout(() => {
                    this._state = 'idle';
                    this._transcript = 'Listening...';
                }, 1500);
            }, 2000);
        }
    }
    _handleDeviceChange(e) {
        this._selectedDeviceId = e.detail.deviceId;
        console.log('Hardware mic selected:', this._selectedDeviceId);
    }
};
__decorate([
    state()
], DemoSpeechInput.prototype, "_state", void 0);
__decorate([
    state()
], DemoSpeechInput.prototype, "_transcript", void 0);
__decorate([
    state()
], DemoSpeechInput.prototype, "_selectedDeviceId", void 0);
DemoSpeechInput = __decorate([
    customElement('demo-speech-input')
], DemoSpeechInput);
export { DemoSpeechInput };
//# sourceMappingURL=demo-speech-input.js.map