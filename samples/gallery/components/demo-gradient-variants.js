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
 * A gallery showcasing the ui-moving-gradient component with different color variants.
 */
let DemoGradientVariants = class DemoGradientVariants extends LitElement {
    static { this.styles = css `
    :host {
      display: block;
      width: 100%;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      justify-items: center;
    }
    .variant-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 100%;
    }
    .variant-container {
      width: 100%;
      height: 120px;
      background: #0E0E0F;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .variant-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--md-sys-color-on-surface-variant);
      text-align: center;
    }
  `; }
    render() {
        return html `
      <div class="gallery-grid">
        <div class="variant-item">
          <div class="variant-container">
            <ui-moving-gradient
              agentState="listening"
              .colors="${['#0068FF', '#0077FF', '#0073FF']}"
            ></ui-moving-gradient>
          </div>
          <div class="variant-label">Deep Blue (Listening)</div>
        </div>

        <div class="variant-item">
          <div class="variant-container">
            <ui-moving-gradient
              agentState="thinking"
              .colors="${['#FF3B30', '#FF5252', '#E53935']}"
            ></ui-moving-gradient>
          </div>
          <div class="variant-label">Crimson Red (Thinking)</div>
        </div>

        <div class="variant-item">
          <div class="variant-container">
            <ui-moving-gradient
              agentState="talking"
              .colors="${['#00C853', '#4CAF50', '#00E676']}"
            ></ui-moving-gradient>
          </div>
          <div class="variant-label">Emerald Green (Talking)</div>
        </div>
      </div>
    `;
    }
};
DemoGradientVariants = __decorate([
    customElement('demo-gradient-variants')
], DemoGradientVariants);
export { DemoGradientVariants };
//# sourceMappingURL=demo-gradient-variants.js.map