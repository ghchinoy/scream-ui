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
import {customElement, state} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
  isTyping?: boolean;
}

@customElement('demo-chat-experience')
export class DemoChatExperience extends LitElement {
  @state() private _messages: Message[] = [
    {
      id: '1',
      text: "Hello! I'm your AI assistant. Ask me anything about this library.",
      sender: 'agent',
      timestamp: '10:42 AM',
    },
  ];
  @state() private _inputValue = '';

  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
    }

    .chat-container {
      background: var(--md-sys-color-surface);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 20px;
      height: 500px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .input-area {
      padding: 16px;
      background: var(--md-sys-color-surface-container-low);
      border-top: 1px solid var(--md-sys-color-outline-variant);
      display: flex;
      gap: 12px;
      align-items: center;
    }

    input {
      flex: 1;
      height: 44px;
      border-radius: 22px;
      border: 1px solid var(--md-sys-color-outline-variant);
      padding: 0 20px;
      font-family: inherit;
      font-size: 14px;
      background: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
      outline: none;
      transition: border-color 0.2s;
    }

    input:focus {
      border-color: var(--md-sys-color-primary);
    }

    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
    }

    /* Message Animation */
    ui-chat-item {
      animation: slideIn 0.3s ease-out forwards;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  render() {
    return html`
      <div class="chat-container">
        <ui-chat-list>
          ${repeat(
            this._messages,
            m => m.id,
            m => html`
              <ui-chat-item
                .direction=${m.sender === 'user' ? 'outbound' : 'inbound'}
              >
                <div slot="avatar">
                  ${m.sender === 'agent'
                    ? html`<ui-orb
                        agentState=${m.isTyping ? 'thinking' : 'talking'}
                        style="width:32px; height:32px;"
                      ></ui-orb>`
                    : html`<div
                        style="width:32px; height:32px; border-radius:50%; background:#ddd; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700;"
                      >
                        ME
                      </div>`}
                </div>
                ${m.isTyping
                  ? html`<ui-typing-indicator></ui-typing-indicator>`
                  : m.text}
                <div slot="meta">${m.timestamp}</div>
              </ui-chat-item>
            `,
          )}
        </ui-chat-list>

        <div class="input-area">
          <ui-speech-record-button size="sm"></ui-speech-record-button>
          <input
            type="text"
            placeholder="Ask a question..."
            .value=${this._inputValue}
            @input=${(e: any) => (this._inputValue = e.target.value)}
            @keypress=${(e: KeyboardEvent) =>
              e.key === 'Enter' && this._handleSend()}
          />
          <button
            class="send-btn"
            @click=${this._handleSend}
            ?disabled=${!this._inputValue}
          >
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    `;
  }

  private _handleSend() {
    if (!this._inputValue) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: this._inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    this._messages = [...this._messages, userMsg];
    this._inputValue = '';

    // Trigger agent response
    this._simulateAgentResponse();
  }

  private _simulateAgentResponse() {
    const typingMsg: Message = {
      id: 'typing',
      text: '',
      sender: 'agent',
      timestamp: 'Thinking...',
      isTyping: true,
    };

    // Show typing indicator after a short delay
    setTimeout(() => {
      this._messages = [...this._messages, typingMsg];

      // Replace with actual response
      setTimeout(() => {
        this._messages = this._messages.filter(m => m.id !== 'typing');
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: this._getRandomResponse(),
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        this._messages = [...this._messages, response];
      }, 2000);
    }, 600);
  }

  private _getRandomResponse() {
    const responses = [
      "That's a great question! Our visualizers use high-performance Canvas math for 60fps rendering.",
      'I recommend using the ui-audio-provider for full playlist support.',
      'The ui-orb is powered by Three.js and reacts to volume in real-time.',
      'You can easily theme everything using standard CSS variables.',
      'Would you like to see a demo of our new 3D flip utility?',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
