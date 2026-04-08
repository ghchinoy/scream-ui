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
import '@ghchinoy/lit-audio-ui';
import '@ghchinoy/lit-text-ui';

@customElement('demo-audio-tag-editor')
export class DemoAudioTagEditor extends LitElement {
  @state() private _text = 'It was a dark and stormy night... [long pause] and then he saw it. [scared]';

  static styles = css`
    :host {
      display: block;
      width: 100%;
      margin: 0 auto;
      max-width: 600px;
    }
    
    .demo-container {
       padding: 24px;
       display: flex;
       flex-direction: column;
       gap: 24px;
    }
    
    .label {
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
        margin-bottom: 8px;
    }

    .output {
        background: var(--md-sys-color-surface-container-highest);
        border-radius: 8px;
        padding: 16px;
        font-family: monospace;
        color: var(--md-sys-color-on-surface-variant);
        white-space: pre-wrap;
    }
  `;

  render() {
    return html`
      <div class="demo-container">
            <div>
                <div class="label">Prompt Editor</div>
                <ui-audio-tag-editor
                    .value=${this._text}
                    @change=${(e: any) => (this._text = e.detail.value)}
                ></ui-audio-tag-editor>
            </div>
            
            <div style="margin-top: 24px;">
                <div class="label">Raw Output (Sent to API)</div>
                <div class="output">${this._text || ' '}</div>
            </div>
      </div>
    `;
  }
}
