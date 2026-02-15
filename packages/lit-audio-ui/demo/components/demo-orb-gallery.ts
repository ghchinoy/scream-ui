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

/**
 * A gallery showcasing the ui-orb component with a variety of color schemes.
 * The order pays a subtle homage to the iconic brand colors.
 */
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
        <!-- RED -->
        <div class="orb-item">
          <div class="orb-container">
            <ui-orb 
              agentState="talking" 
              .colors="${['#EA4335', '#C5221F']}">
            </ui-orb>
          </div>
          <div class="orb-label">Crimson Ember</div>
        </div>

        <!-- YELLOW -->
        <div class="orb-item">
          <div class="orb-container">
            <ui-orb 
              agentState="thinking" 
              .colors="${['#FBBC04', '#F9AB00']}">
            </ui-orb>
          </div>
          <div class="orb-label">Electric Sun</div>
        </div>

        <!-- GREEN -->
        <div class="orb-item">
          <div class="orb-container">
            <ui-orb 
              agentState="listening" 
              .colors="${['#34A853', '#1E8E3E']}">
            </ui-orb>
          </div>
          <div class="orb-label">Forest Green</div>
        </div>

        <!-- BLUE -->
        <div class="orb-item">
          <div class="orb-container">
            <ui-orb 
              agentState="talking" 
              .colors="${['#4285F4', '#1967D2']}">
            </ui-orb>
          </div>
          <div class="orb-label">Ocean Blue</div>
        </div>
      </div>
    `;
  }
}
