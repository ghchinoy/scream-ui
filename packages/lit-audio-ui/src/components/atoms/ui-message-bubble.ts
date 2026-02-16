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
 * ATOM: Message Bubble
 * A presentational container for chat message text.
 * Ported from ElevenLabs 'MessageContent'.
 *
 * @element ui-message-bubble
 *
 * @prop {string} variant - 'contained' (default) or 'flat'.
 * @prop {string} direction - 'inbound' (agent) or 'outbound' (user).
 */
@customElement('ui-message-bubble')
export class UiMessageBubble extends LitElement {
  @property({type: String}) variant: 'contained' | 'flat' = 'contained';
  @property({type: String}) direction: 'inbound' | 'outbound' = 'inbound';

  static styles = css`
    :host {
      display: inline-flex;
      max-width: 85%;
      font-family: inherit;
      color-scheme: light dark;
    }

    .bubble {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 16px;
      font-size: 0.9rem;
      line-height: 1.5;
      overflow: hidden;
      box-sizing: border-box;
      transition: background-color 0.2s, color 0.2s;
    }

    /* Variant: Contained */
    :host([variant='contained']) .bubble {
      border-radius: 12px;
    }

    :host([variant='contained'][direction='inbound']) .bubble {
      background: var(
        --ui-message-bubble-inbound-bg,
        var(--md-sys-color-surface-container-low, #f3f3f3)
      );
      color: var(--md-sys-color-on-surface);
      border-bottom-left-radius: 4px;
    }

    :host([variant='contained'][direction='outbound']) .bubble {
      background: var(
        --ui-message-bubble-outbound-bg,
        var(--md-sys-color-primary, #0066cc)
      );
      color: var(--md-sys-color-on-primary, #ffffff);
      border-bottom-right-radius: 4px;
    }

    /* Variant: Flat */
    :host([variant='flat']) .bubble {
      padding: 8px 0;
      background: transparent;
      color: var(--md-sys-color-on-surface);
    }

    :host([variant='flat'][direction='outbound']) .bubble {
      padding: 12px 16px;
      background: var(--md-sys-color-surface-container-highest);
      border-radius: 12px;
    }
  `;

  render() {
    return html`
      <div class="bubble">
        <slot></slot>
      </div>
    `;
  }
}
