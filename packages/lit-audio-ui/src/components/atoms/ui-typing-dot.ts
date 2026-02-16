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
import {customElement, property} from 'lit/decorators.js';

/**
 * ATOM: Typing Dot
 * A simple animated dot used for typing indicators.
 *
 * @element ui-typing-dot
 *
 * @prop {string} delay - CSS animation delay (e.g., '0.2s').
 */
@customElement('ui-typing-dot')
export class UiTypingDot extends LitElement {
  @property({type: String}) delay = '0s';

  static styles = css`
    :host {
      display: inline-block;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--ui-typing-dot-color, currentColor);
      animation: pulse 1.2s infinite ease-in-out;
    }

    @keyframes pulse {
      0%,
      100% {
        transform: scale(0.8);
        opacity: 0.4;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
    }
  `;

  render() {
    return html`<div class="dot" style="animation-delay: ${this.delay}"></div>`;
  }
}
