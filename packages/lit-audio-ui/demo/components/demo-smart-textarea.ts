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
import {customElement, state} from 'lit/decorators.js';

@customElement('demo-smart-textarea')
export class DemoSmartTextarea extends LitElement {
  @state() private _text = '';

  static styles = css`
    :host {
      display: block;
      max-width: 500px;
      margin: 0 auto;
    }
    .textarea-container {
      position: relative;
      background: var(--md-sys-color-surface-container-low);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 12px;
      padding: 16px;
      transition: all 0.3s ease;
    }
    .textarea-container:focus-within {
      border-color: var(--md-sys-color-primary);
      box-shadow: 0 0 0 2px var(--md-sys-color-primary-container);
    }
    textarea {
      width: 100%;
      min-height: 120px;
      background: transparent;
      border: none;
      color: var(--md-sys-color-on-surface);
      font-family: inherit;
      font-size: 16px;
      resize: vertical;
      outline: none;
      padding: 0;
      margin-bottom: 40px;
    }
    .toolbar {
      position: absolute;
      bottom: 12px;
      left: 12px;
      right: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      pointer-events: none;
    }
    .toolbar > * {
      pointer-events: auto;
    }
    .left-tools {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `;

  render() {
    return html`
      <ui-speech-provider
        simulation
        @state-change=${this._handleStateChange}
      >
        <div class="textarea-container">
          <textarea
            .value=${this._text}
            @input=${(e: any) => (this._text = e.target.value)}
            placeholder="Tell your story..."
          ></textarea>

          <div class="toolbar">
            <div class="left-tools">
              <ui-speech-record-button size="sm"></ui-speech-record-button>
              <ui-speech-preview
                placeholder="Press mic to speak"
              ></ui-speech-preview>
            </div>
            <ui-speech-cancel-button></ui-speech-cancel-button>
          </div>
        </div>
      </ui-speech-provider>
    `;
  }

  private _handleStateChange(e: CustomEvent) {
    const {transcript, partialTranscript} = e.detail;
    if (transcript || partialTranscript) {
      this._text = partialTranscript || transcript;
    }
  }
}
