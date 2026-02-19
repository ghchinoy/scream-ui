/**
 * Copyright 2026 Google LLC
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../atoms/ui-message-bubble.js';

/**
 * A composite component representing a single chat message item.
 */
@customElement('ui-chat-item')
export class UiChatItem extends LitElement {
  @property({type: String}) direction: 'inbound' | 'outbound' = 'inbound';
  @property({type: String}) variant: 'contained' | 'flat' = 'contained';

  static override styles = css`
    :host {
      display: block;
      margin-bottom: var(--ui-chat-item-margin-bottom, 8px);
      width: 100%;
    }
    .item-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .item-wrapper.outbound {
      align-items: flex-end;
    }
    .item-wrapper.inbound {
      align-items: flex-start;
    }
  `;

  override render() {
    return html`
      <div class="item-wrapper ${this.direction}">
        <ui-message-bubble
          .direction=${this.direction}
          .variant=${this.variant}
        >
          <slot></slot>
        </ui-message-bubble>
      </div>
    `;
  }
}
