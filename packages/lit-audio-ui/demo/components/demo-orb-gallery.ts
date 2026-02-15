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
import {customElement} from 'lit/decorators.js';

@customElement('demo-orb-gallery')
export class DemoOrbGallery extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 24px;
      justify-items: center;
    }
    .orb-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .orb-container {
      width: 140px;
      height: 140px;
      background: var(--md-sys-color-surface-container-highest);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .orb-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--md-sys-color-on-surface-variant);
      text-align: center;
    }
  `;

  render() {
    return html`
      <div class="gallery-grid">
        <div class="orb-item">
          <div class="orb-container">
            <ui-orb agentState="listening"></ui-orb>
          </div>
          <div class="orb-label">Default (Listening)</div>
        </div>

        <div class="orb-item">
          <div class="orb-container">
            <ui-orb 
              agentState="thinking" 
              .colors="${['#81C995', '#66BB6A']}">
            </ui-orb>
          </div>
          <div class="orb-label">Forest Green (Thinking)</div>
        </div>

        <div class="orb-item">
          <div class="orb-container">
            <ui-orb 
              agentState="talking" 
              .colors="${['#FDE293', '#FFF176']}">
            </ui-orb>
          </div>
          <div class="orb-label">Electric Sun (Talking)</div>
        </div>

        <div class="orb-item">
          <div class="orb-container">
            <ui-orb 
              agentState="listening" 
              .colors="${['#F28B82', '#E57373']}">
            </ui-orb>
          </div>
          <div class="orb-label">Sunset Coral (Listening)</div>
        </div>
      </div>
    `;
  }
}
