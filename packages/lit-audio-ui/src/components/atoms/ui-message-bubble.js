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
import { customElement, property } from 'lit/decorators.js';
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
let UiMessageBubble = class UiMessageBubble extends LitElement {
    constructor() {
        super(...arguments);
        this.variant = 'contained';
        this.direction = 'inbound';
    }
    static { this.styles = css `
    :host {
      display: inline-flex;
      max-width: 85%;
      font-family: inherit;
      color-scheme: light dark;
    }

    .bubble {
      display: flex;
      flex-direction: column;
      gap: var(--ui-message-bubble-gap, 8px);
      padding: var(--ui-message-bubble-padding, 14px 18px);
      font-size: 0.95rem;
      line-height: 1.5;
      box-sizing: border-box;
      transition:
        background-color 0.2s,
        color 0.2s;
    }

    /* Variant: Contained */
    :host([variant='contained']) .bubble {
      border-radius: var(--ui-message-bubble-radius, 16px);
    }

    :host([variant='contained'][direction='inbound']) .bubble {
      background: var(
        --ui-message-bubble-inbound-bg,
        var(--md-sys-color-surface-container-high, #e2e2e2)
      );
      color: var(--md-sys-color-on-surface);
      border-bottom-left-radius: var(--ui-message-bubble-corner-radius, 4px);
    }

    :host([variant='contained'][direction='outbound']) .bubble {
      background: var(
        --ui-message-bubble-outbound-bg,
        var(--md-sys-color-primary, #0066cc)
      );
      color: var(--md-sys-color-on-primary, #ffffff);
      border-bottom-right-radius: var(--ui-message-bubble-corner-radius, 4px);
    }

    /* Variant: Flat */
    :host([variant='flat']) .bubble {
      padding: var(--ui-message-bubble-flat-padding, 8px 0);
      background: transparent;
      color: var(--md-sys-color-on-surface);
    }

    :host([variant='flat'][direction='outbound']) .bubble {
      padding: var(--ui-message-bubble-flat-outbound-padding, 12px 16px);
      background: var(--md-sys-color-surface-container-highest);
      border-radius: var(--ui-message-bubble-flat-radius, 12px);
    }
  `; }
    render() {
        return html `
      <div class="bubble">
        <slot></slot>
      </div>
    `;
    }
};
__decorate([
    property({ type: String, reflect: true })
], UiMessageBubble.prototype, "variant", void 0);
__decorate([
    property({ type: String, reflect: true })
], UiMessageBubble.prototype, "direction", void 0);
UiMessageBubble = __decorate([
    customElement('ui-message-bubble')
], UiMessageBubble);
export { UiMessageBubble };
//# sourceMappingURL=ui-message-bubble.js.map