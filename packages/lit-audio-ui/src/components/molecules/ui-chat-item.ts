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
import {classMap} from 'lit/directives/class-map.js';
import '../atoms/ui-message-bubble.js';

/**
 * MOLECULE: Chat Item
 * A functional unit grouping a message bubble with metadata (avatar, timestamp).
 * Handles alignment and layout based on direction.
 *
 * @element ui-chat-item
 *
 * @prop {string} direction - 'inbound' (agent) or 'outbound' (user).
 * @prop {string} variant - bubble style: 'contained' or 'flat'.
 */
@customElement('ui-chat-item')
export class UiChatItem extends LitElement {
  @property({type: String}) direction: 'inbound' | 'outbound' = 'inbound';
  @property({type: String}) variant: 'contained' | 'flat' = 'contained';

  static styles = css`
    :host {
      display: flex;
      width: 100%;
      margin-bottom: 1rem;
      font-family: inherit;
    }

    .item-container {
      display: flex;
      gap: 12px;
      width: 100%;
      align-items: flex-start;
    }

    .item-container.inbound {
      justify-content: flex-start;
    }

    .item-container.outbound {
      flex-direction: row-reverse;
      justify-content: flex-start; /* This correctly pushes to the right because of row-reverse */
    }

    .avatar-slot {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Hide avatar slot if no children are present */
    .avatar-slot:not(:has(*)) {
      display: none;
    }

    .content-wrapper {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-width: 80%;
    }

    .item-container.inbound .content-wrapper {
      align-items: flex-start;
    }

    .item-container.outbound .content-wrapper {
      align-items: flex-end;
    }

    .meta-slot {
      font-size: 0.7rem;
      font-weight: 500;
      opacity: 0.6;
      padding: 0 4px;
      display: flex;
      gap: 8px;
    }
  `;

  render() {
    const classes = {
      'item-container': true,
      [this.direction]: true,
    };

    return html`
      <div class=${classMap(classes)}>
        <div class="avatar-slot">
          <slot name="avatar"></slot>
        </div>

        <div class="content-wrapper">
          <ui-message-bubble .direction=${this.direction} .variant=${this.variant}>
            <slot></slot>
          </ui-message-bubble>
          <div class="meta-slot">
            <slot name="meta"></slot>
          </div>
        </div>
      </div>
    `;
  }
}
