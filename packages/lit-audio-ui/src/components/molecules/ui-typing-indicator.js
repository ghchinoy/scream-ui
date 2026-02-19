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
import '../atoms/ui-typing-dot.js';
/**
 * MOLECULE: Typing Indicator
 * A group of animated dots indicating active 'typing' or 'thinking' state.
 *
 * @element ui-typing-indicator
 */
let UiTypingIndicator = class UiTypingIndicator extends LitElement {
    static { this.styles = css `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--ui-typing-indicator-gap, 4px);
      padding: var(--ui-typing-indicator-padding, 8px 12px);
      background: var(--md-sys-color-surface-container-low);
      border-radius: 12px;
      border-bottom-left-radius: 4px;
    }
  `; }
    render() {
        return html `
      <ui-typing-dot delay="0s"></ui-typing-dot>
      <ui-typing-dot delay="0.2s"></ui-typing-dot>
      <ui-typing-dot delay="0.4s"></ui-typing-dot>
    `;
    }
};
UiTypingIndicator = __decorate([
    customElement('ui-typing-indicator')
], UiTypingIndicator);
export { UiTypingIndicator };
//# sourceMappingURL=ui-typing-indicator.js.map