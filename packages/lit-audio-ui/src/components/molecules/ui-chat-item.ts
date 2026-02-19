/**
 * Copyright 2026 Google LLC
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../atoms/ui-message-bubble.js';

/**
 * A composite component representing a single chat message item.
 * Supports avatars and alignment for inbound/outbound messages.
 */
@customElement('ui-chat-item')
export class UiChatItem extends LitElement {
  @property({type: String}) direction: 'inbound' | 'outbound' = 'inbound';
  @property({type: String}) variant: 'contained' | 'flat' = 'contained';
  @property({type: String}) avatarSrc?: string;
  @property({type: String}) avatarName?: string;

  static override styles = css`
    :host {
      display: block;
      margin-bottom: var(--ui-chat-item-margin-bottom, 8px);
      width: 100%;
    }
    .item-wrapper {
      display: flex;
      width: 100%;
      gap: var(--ui-chat-item-gap, 8px);
      align-items: flex-end;
    }
    .item-wrapper.outbound {
      flex-direction: row-reverse;
    }
    .item-wrapper.inbound {
      flex-direction: row;
    }
    .avatar {
      width: var(--ui-chat-item-avatar-size, 32px);
      height: var(--ui-chat-item-avatar-size, 32px);
      border-radius: 50%;
      background: var(--md-sys-color-surface-container-highest);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      font-size: 12px;
      font-weight: 500;
      color: var(--md-sys-color-on-surface-variant);
      border: 1px solid var(--md-sys-color-outline-variant);
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `;

  override render() {
    return html`
      <div class="item-wrapper ${this.direction}">
        ${this.avatarSrc || this.avatarName
          ? html`
              <div class="avatar" aria-hidden="true">
                ${this.avatarSrc
                  ? html`<img src="${this.avatarSrc}" alt="" />`
                  : html`<span>${this.avatarName?.slice(0, 2) || 'AI'}</span>`}
              </div>
            `
          : ''}
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
