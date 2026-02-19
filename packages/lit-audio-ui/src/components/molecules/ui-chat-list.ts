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

import {LitElement, html, css, type PropertyValues} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';

/**
 * MOLECULE: Chat List
 * A scrollable container for ui-chat-items.
 * Automatically handles scrolling to the bottom when new children are added.
 *
 * @element ui-chat-list
 */
@customElement('ui-chat-list')
export class UiChatList extends LitElement {
  @query('.scroll-container') private _container!: HTMLDivElement;

  @state() private _isAtBottom = true;

  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
      overflow: hidden;
      position: relative;
    }

    .scroll-container {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      padding: var(--ui-chat-list-padding, 1rem);
      box-sizing: border-box;
      scroll-behavior: smooth;
    }

    /* Scrollbar Styling */
    .scroll-container::-webkit-scrollbar {
      width: 6px;
    }
    .scroll-container::-webkit-scrollbar-track {
      background: transparent;
    }
    .scroll-container::-webkit-scrollbar-thumb {
      background: var(--md-sys-color-outline-variant);
      border-radius: 10px;
    }

    .scroll-button {
      position: absolute;
      bottom: var(--ui-chat-list-scroll-btn-bottom, 16px);
      left: 50%;
      transform: translateX(-50%);
      background: var(--md-sys-color-surface-container-highest);
      border-radius: 50%;
      box-shadow: var(--md-sys-elevation-level2);
      z-index: 10;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .scroll-button.visible {
      opacity: 1;
      visibility: visible;
    }
  `;

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (this._isAtBottom) {
      this.scrollToBottom();
    }
  }

  /**
   * Imperatively scroll to the most recent message.
   */
  public scrollToBottom() {
    if (this._container) {
      this._container.scrollTop = this._container.scrollHeight;
    }
  }

  private _handleScroll() {
    if (!this._container) return;
    const {scrollTop, scrollHeight, clientHeight} = this._container;
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    this._isAtBottom = atBottom;
  }

  render() {
    return html`
      <div class="scroll-container" @scroll=${this._handleScroll}>
        <slot @slotchange=${this.scrollToBottom}></slot>
      </div>
      <md-icon-button
        class="scroll-button ${!this._isAtBottom ? 'visible' : ''}"
        @click=${this.scrollToBottom}
        aria-label="Scroll to bottom"
      >
        <md-icon>arrow_downward</md-icon>
      </md-icon-button>
    `;
  }
}
