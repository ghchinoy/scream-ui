/**
 * Copyright 2026 Google LLC
 */

import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import '../providers/ui-speech-provider.js';
import '../atoms/ui-voice-waveform.js';
import './ui-mic-selector.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/divider/divider.js';

/**
 * MOLECULE: Conversation Bar
 * A specialized interaction bar for AI conversations.
 * Combines mic selection, live visualization, and text input.
 *
 * @element ui-conversation-bar
 *
 * @prop {string} agentId - (Optional) ID of the AI agent.
 * @prop {boolean} simulation - Enable mock transcription for demos.
 *
 * @fires message-sent - Dispatched when a text message is sent. detail: { message }
 * @fires state-change - Dispatched when the conversation state changes.
 */
@customElement('ui-conversation-bar')
export class UiConversationBar extends LitElement {
  @property({type: String}) agentId = '';
  @property({type: Boolean}) simulation = false;

  @state() private _keyboardOpen = false;
  @state() private _textInput = '';
  @state() private _isMuted = false;

  static override styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: inherit;
    }

    .container {
      background: var(--md-sys-color-surface-container, #f3f3f3);
      border-radius: var(--ui-conversation-bar-radius, 24px);
      border: 1px solid var(--md-sys-color-outline-variant);
      box-shadow: var(--md-sys-elevation-level1);
      overflow: hidden;
      display: flex;
      flex-direction: column-reverse;
      transition: all 0.3s ease;
    }

    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--ui-conversation-bar-padding, 8px 16px);
      gap: 12px;
    }

    .visualizer-section {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      height: 40px;
      background: var(--md-sys-color-surface-container-high);
      border-radius: 12px;
      padding: 0 12px;
      overflow: hidden;
    }

    .waveform-wrapper {
      flex: 1;
      height: 24px;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .input-area {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
      background: var(--md-sys-color-surface-container);
    }

    .input-area.open {
      max-height: 200px;
    }

    .input-container {
      padding: 16px;
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }

    md-outlined-text-field {
      flex: 1;
      --md-outlined-text-field-container-shape: 16px;
    }

    .keyboard-toggle.active {
      background: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
    }

    md-divider {
      margin: 0;
    }
  `;

  render() {
    return html`
      <ui-speech-provider
        .simulation=${this.simulation}
        .state=${this._isMuted ? 'idle' : 'idle'}
      >
        <div class="container">
          <!-- Text Input Area (Expands upwards) -->
          <div class="input-area ${this._keyboardOpen ? 'open' : ''}">
            <div class="input-container">
              <md-outlined-text-field
                type="textarea"
                rows="2"
                placeholder="Type a message..."
                .value=${this._textInput}
                @input=${(e: Event) =>
                  (this._textInput = (e.target as any).value)}
                @keydown=${this._handleKeyDown}
              ></md-outlined-text-field>
              <md-filled-tonal-button
                ?disabled=${!this._textInput.trim()}
                @click=${this._sendMessage}
              >
                <md-icon>arrow_upward</md-icon>
              </md-filled-tonal-button>
            </div>
            <md-divider></md-divider>
          </div>

          <!-- Bottom Toolbar -->
          <div class="toolbar">
            <div class="visualizer-section">
              <ui-mic-selector
                .muted=${this._isMuted}
                @mute-change=${(e: CustomEvent) =>
                  (this._isMuted = e.detail.muted)}
              ></ui-mic-selector>

              <div class="waveform-wrapper">
                <ui-voice-waveform .height=${20}></ui-voice-waveform>
              </div>
            </div>

            <div class="controls">
              <md-icon-button
                class="keyboard-toggle ${this._keyboardOpen ? 'active' : ''}"
                @click=${() => (this._keyboardOpen = !this._keyboardOpen)}
                aria-label="Toggle keyboard"
              >
                <md-icon
                  >${this._keyboardOpen ? 'keyboard_hide' : 'keyboard'}</md-icon
                >
              </md-icon-button>

              <md-icon-button
                @click=${this._handleCallToggle}
                aria-label="Toggle voice call"
              >
                <md-icon>phone</md-icon>
              </md-icon-button>
            </div>
          </div>
        </div>
      </ui-speech-provider>
    `;
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this._sendMessage();
    }
  }

  private _sendMessage() {
    if (!this._textInput.trim()) return;

    this.dispatchEvent(
      new CustomEvent('message-sent', {
        detail: {message: this._textInput},
        bubbles: true,
        composed: true,
      }),
    );

    this._textInput = '';
  }

  private _handleCallToggle() {
    // This would typically interface with the provider to start a real-time session
    this.dispatchEvent(
      new CustomEvent('call-toggle', {
        bubbles: true,
        composed: true,
      }),
    );
  }
}
