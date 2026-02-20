/**
 * Copyright 2026 Google LLC
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
let UiConversationBar = class UiConversationBar extends LitElement {
    constructor() {
        super(...arguments);
        this.agentId = '';
        this.simulation = false;
        this._keyboardOpen = false;
        this._textInput = '';
        this._isMuted = false;
    }
    static { this.styles = css `
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
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    .visualizer-section {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      height: 40px;
      background: var(--md-sys-color-surface-container-high, #e2e2e2);
      border-radius: 12px;
      padding: 0 12px;
      overflow: hidden;
      color: var(--md-sys-color-on-surface, #1d1b20);
    }
    
    ui-mic-selector {
      --md-sys-color-on-surface: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .waveform-wrapper {
      flex: 1;
      height: 24px;
      color: var(--md-sys-color-primary, #0066cc);
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }
    
    md-icon-button {
      --md-icon-button-icon-color: var(--md-sys-color-on-surface-variant, #49454f);
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
  `; }
    render() {
        return html `
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
                @input=${(e) => (this._textInput = e.target.value)}
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
                @mute-change=${(e) => (this._isMuted = e.detail.muted)}
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
    _handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this._sendMessage();
        }
    }
    _sendMessage() {
        if (!this._textInput.trim())
            return;
        this.dispatchEvent(new CustomEvent('message-sent', {
            detail: { message: this._textInput },
            bubbles: true,
            composed: true,
        }));
        this._textInput = '';
    }
    _handleCallToggle() {
        // This would typically interface with the provider to start a real-time session
        this.dispatchEvent(new CustomEvent('call-toggle', {
            bubbles: true,
            composed: true,
        }));
    }
};
__decorate([
    property({ type: String })
], UiConversationBar.prototype, "agentId", void 0);
__decorate([
    property({ type: Boolean })
], UiConversationBar.prototype, "simulation", void 0);
__decorate([
    state()
], UiConversationBar.prototype, "_keyboardOpen", void 0);
__decorate([
    state()
], UiConversationBar.prototype, "_textInput", void 0);
__decorate([
    state()
], UiConversationBar.prototype, "_isMuted", void 0);
UiConversationBar = __decorate([
    customElement('ui-conversation-bar')
], UiConversationBar);
export { UiConversationBar };
//# sourceMappingURL=ui-conversation-bar.js.map