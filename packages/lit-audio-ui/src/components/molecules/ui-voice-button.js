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
import { classMap } from 'lit/directives/class-map.js';
import { consume } from '@lit/context';
import { speechContext } from '../../utils/speech-context.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/icon/icon.js';
import './ui-live-waveform.js';
/**
 * A native Lit WebComponent replacement for the ElevenLabs React voice-button.
 * Now refactored to consume speechContext but maintains backward compatibility
 * for manual state control.
 */
let UiVoiceButton = class UiVoiceButton extends LitElement {
    constructor() {
        super(...arguments);
        this.state = 'idle';
        this.disabled = false;
        this._showFeedback = false;
        this._feedbackType = null;
    }
    static { this.styles = css `
    :host {
      display: inline-block;
      --ui-waveform-height: 24px;
      --ui-waveform-width: 96px;
    }
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      /* Dynamic gap based on state to ensure perfect centering */
      gap: 0;
      min-width: 100%;
      transition: gap 0.3s ease;
    }
    .wrapper.active {
      gap: 12px;
    }
    md-filled-button,
    md-outlined-button {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
      min-width: 140px;
    }
    md-filled-button.recording {
      --md-filled-button-container-color: var(
        --ui-speech-record-color,
        #ffdad6
      );
      --md-filled-button-label-text-color: #410002;
    }
    .waveform-slot {
      position: relative;
      width: 0;
      height: var(--ui-waveform-height);
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
      opacity: 0;
    }
    .waveform-slot.active {
      width: var(--ui-waveform-width);
      opacity: 1;
    }
    .feedback-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: inherit;
      border-radius: inherit;
      animation: fadeIn 0.3s ease forwards;
      pointer-events: none;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 0.9;
      }
    }
  `; }
    updated(changedProperties) {
        super.updated(changedProperties);
        // Sync from context if available, otherwise use own state property
        const effectiveState = this._context?.state || this.state;
        if (changedProperties.has('_context') || changedProperties.has('state')) {
            if (effectiveState === 'success' || effectiveState === 'error') {
                this._showFeedback = true;
                this._feedbackType = effectiveState;
                if (this._feedbackTimeout)
                    clearTimeout(this._feedbackTimeout);
                this._feedbackTimeout = setTimeout(() => {
                    this._showFeedback = false;
                    this._feedbackType = null;
                    if (!this._context &&
                        (this.state === 'success' || this.state === 'error')) {
                        this.state = 'idle';
                    }
                }, 1500);
            }
        }
    }
    render() {
        const effectiveState = this._context?.state || this.state;
        const isRecording = effectiveState === 'recording';
        const isProcessing = effectiveState === 'processing' || effectiveState === 'connecting';
        const isActive = isRecording || isProcessing;
        const isDisabled = this.disabled || isProcessing;
        const buttonClasses = {
            recording: isRecording,
            processing: isProcessing,
            success: this._feedbackType === 'success',
            error: this._feedbackType === 'error',
        };
        const slotClasses = {
            'waveform-slot': true,
            active: isActive,
        };
        const effectiveAnalyser = this._context?.analyserNode || this.analyserNode;
        return html `
      <md-filled-button
        class=${classMap(buttonClasses)}
        ?disabled=${isDisabled}
        @click=${this._handleClick}
      >
        <div class="wrapper ${isActive ? 'active' : ''}">
          ${this.label ? html `<span>${this.label}</span>` : ''}
          <div class=${classMap(slotClasses)}>
            ${isActive
            ? html `
                  <ui-live-waveform
                    .active=${isRecording}
                    .processing=${isProcessing}
                    .analyserNode=${effectiveAnalyser}
                    .barWidth=${2}
                    .barGap=${1}
                    barColor="currentColor"
                    height="20"
                    style="position: absolute; inset: 0;"
                  ></ui-live-waveform>
                `
            : ''}
          </div>
          ${this._showFeedback && this._feedbackType === 'success'
            ? html `<div class="feedback-overlay success">
                <md-icon>check</md-icon>
              </div>`
            : ''}
          ${this._showFeedback && this._feedbackType === 'error'
            ? html `<div class="feedback-overlay error">
                <md-icon>close</md-icon>
              </div>`
            : ''}
        </div>
      </md-filled-button>
    `;
    }
    _handleClick(_e) {
        if (this._context) {
            if (this._context.state === 'idle') {
                this._context.start();
            }
            else if (this._context.state === 'recording') {
                this._context.stop();
            }
        }
        this.dispatchEvent(new CustomEvent('voice-button-click', {
            bubbles: true,
            composed: true,
            detail: { state: this._context?.state || this.state },
        }));
    }
};
__decorate([
    consume({ context: speechContext, subscribe: true })
], UiVoiceButton.prototype, "_context", void 0);
__decorate([
    property({ type: String })
], UiVoiceButton.prototype, "state", void 0);
__decorate([
    property({ type: String })
], UiVoiceButton.prototype, "label", void 0);
__decorate([
    property({ type: String })
], UiVoiceButton.prototype, "trailing", void 0);
__decorate([
    property({ type: Boolean })
], UiVoiceButton.prototype, "disabled", void 0);
__decorate([
    property({ attribute: false })
], UiVoiceButton.prototype, "analyserNode", void 0);
__decorate([
    state()
], UiVoiceButton.prototype, "_showFeedback", void 0);
__decorate([
    state()
], UiVoiceButton.prototype, "_feedbackType", void 0);
UiVoiceButton = __decorate([
    customElement('ui-voice-button')
], UiVoiceButton);
export { UiVoiceButton };
//# sourceMappingURL=ui-voice-button.js.map