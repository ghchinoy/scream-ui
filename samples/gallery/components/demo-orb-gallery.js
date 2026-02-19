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
import { customElement } from 'lit/decorators.js';
/**
 * A gallery showcasing the ui-orb component with a variety of color schemes and seed configurations.
 * The order pays a subtle homage to the iconic brand colors.
 */
let DemoOrbGallery = class DemoOrbGallery extends LitElement {
    static { this.styles = css `
    :host {
      display: block;
      width: 100%;
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
    .orb-meta {
      font-size: 10px;
      font-family: monospace;
      opacity: 0.6;
    }
  `; }
    render() {
        return html `
      <div class="gallery-grid">
        <!-- RED -->
        <div class="orb-item">
          <div class="orb-container">
            <ui-orb
              agentState="talking"
              seed="12345"
              .colors="${['#EA4335', '#C5221F']}"
            >
            </ui-orb>
          </div>
          <div class="orb-label">Crimson Ember</div>
          <div class="orb-meta">seed: 12345</div>
        </div>

        <!-- YELLOW -->
        <div class="orb-item">
          <div class="orb-container">
            <ui-orb
              agentState="thinking"
              seed="67890"
              .colors="${['#FBBC04', '#F9AB00']}"
            >
            </ui-orb>
          </div>
          <div class="orb-label">Electric Sun</div>
          <div class="orb-meta">seed: 67890</div>
        </div>

        <!-- GREEN -->
        <div class="orb-item">
          <div class="orb-container">
            <ui-orb
              agentState="listening"
              seed="11111"
              .colors="${['#34A853', '#1E8E3E']}"
            >
            </ui-orb>
          </div>
          <div class="orb-label">Forest Green</div>
          <div class="orb-meta">seed: 11111</div>
        </div>

        <!-- BLUE -->
        <div class="orb-item">
          <div class="orb-container">
            <ui-orb
              agentState="talking"
              seed="99999"
              .colors="${['#4285F4', '#1967D2']}"
            >
            </ui-orb>
          </div>
          <div class="orb-label">Ocean Blue</div>
          <div class="orb-meta">seed: 99999</div>
        </div>
      </div>
    `;
    }
};
DemoOrbGallery = __decorate([
    customElement('demo-orb-gallery')
], DemoOrbGallery);
export { DemoOrbGallery };
//# sourceMappingURL=demo-orb-gallery.js.map