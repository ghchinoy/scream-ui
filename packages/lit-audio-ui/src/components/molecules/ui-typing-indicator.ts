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
import '../atoms/ui-typing-dot.js';

/**
 * MOLECULE: Typing Indicator
 * A group of animated dots indicating active 'typing' or 'thinking' state.
 *
 * @element ui-typing-indicator
 */
@customElement('ui-typing-indicator')
export class UiTypingIndicator extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      background: var(--md-sys-color-surface-container-low);
      border-radius: 12px;
      border-bottom-left-radius: 4px;
    }
  `;

  render() {
    return html`
      <ui-typing-dot delay="0s"></ui-typing-dot>
      <ui-typing-dot delay="0.2s"></ui-typing-dot>
      <ui-typing-dot delay="0.4s"></ui-typing-dot>
    `;
  }
}
