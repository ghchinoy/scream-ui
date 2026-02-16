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
import {customElement, query} from 'lit/decorators.js';

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

  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }

    .scroll-container {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      padding: 1rem;
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
  `;

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    this.scrollToBottom();
  }

  /**
   * Imperatively scroll to the most recent message.
   */
  public scrollToBottom() {
    if (this._container) {
      this._container.scrollTop = this._container.scrollHeight;
    }
  }

  render() {
    return html`
      <div class="scroll-container">
        <slot @slotchange=${this.scrollToBottom}></slot>
      </div>
    `;
  }
}
