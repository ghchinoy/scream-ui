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
import '@ghchinoy/lit-audio-ui/molecules/ui-chat-list.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-chat-item.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-conversation-bar.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-typing-indicator.js';

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

  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }

    .chat-container {
      background: var(--md-sys-color-surface);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 24px;
      height: 600px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: var(--md-sys-elevation-level2);
    }

    ui-chat-list {
      flex: 1;
      --ui-chat-list-padding: 24px;
    }

    .toolbar-wrapper {
      padding: 16px;
      background: var(--md-sys-color-surface-container-low);
      border-top: 1px solid var(--md-sys-color-outline-variant);
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
                .avatarName=${m.sender === 'user' ? 'Me' : 'AI'}
                .avatarSrc=${m.sender === 'agent'
                  ? 'https://raw.githubusercontent.com/elevenlabs/ui/main/apps/www/public/avatars/01.png'
                  : ''}
              >
                ${m.isTyping
                  ? html`<ui-typing-indicator></ui-typing-indicator>`
                  : m.text}
                <div slot="meta">${m.timestamp}</div>
              </ui-chat-item>
            `,
          )}
        </ui-chat-list>

        <div class="toolbar-wrapper">
          <ui-conversation-bar
            simulation
            @message-sent=${(e: CustomEvent) =>
              this._handleSend(e.detail.message)}
          ></ui-conversation-bar>
        </div>
      </div>
    `;
  }

  private _handleSend(text: string) {
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    this._messages = [...this._messages, userMsg];

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
