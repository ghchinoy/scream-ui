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
import { consume } from '@lit/context';
import { speechContext } from '../../utils/speech-context.js';
import '../atoms/ui-speech-record-button.js';
import '../atoms/ui-speech-cancel-button.js';
import '../atoms/ui-voice-waveform.js';
import '@material/web/button/filled-button.js';
import '@material/web/icon/icon.js';
/**
 * A composite "Pill" style voice interaction component.
 * It combines the recording button, a live waveform, and a cancel button
 * into a single cohesive UI element.
 *
 * @element ui-voice-pill
 */
let UiVoicePill = class UiVoicePill extends LitElement {
    constructor() {
        super(...arguments);
        this.disabled = false;
        this._showFeedback = false;
        this._feedbackType = null;
    }
    static { this.styles = css `
    :host {
      display: inline-block;
    }
    .pill {
      display: flex;
      align-items: center;
      background: var(--md-sys-color-surface-container-highest, #e6e0e9);
      border-radius: 100px;
      padding: var(--ui-voice-pill-padding, 4px);
      gap: var(--ui-voice-pill-gap, 8px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    .label {
      padding-left: 12px;
      font-family: inherit;
      font-weight: 500;
      color: var(--md-sys-color-on-surface, #1d1b20);
      white-space: nowrap;
    }
    .waveform-container {
      width: 0;
      overflow: hidden;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .active .waveform-container {
      width: 80px;
    }
    .feedback-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--md-sys-color-surface-container-highest);
      border-radius: inherit;
      animation: fadeIn 0.3s ease forwards;
      pointer-events: none;
      z-index: 2;
    }
    .feedback-overlay.success md-icon {
      color: var(--md-sys-color-primary, #0066cc);
    }
    .feedback-overlay.error md-icon {
      color: var(--md-sys-color-error, #ba1a1a);
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
        if (changedProperties.has('_context') && this._context) {
            const state = this._context.state;
            if (state === 'success' || state === 'error') {
                this._showFeedback = true;
                this._feedbackType = state;
                if (this._feedbackTimeout)
                    clearTimeout(this._feedbackTimeout);
                this._feedbackTimeout = setTimeout(() => {
                    this._showFeedback = false;
                    this._feedbackType = null;
                    // After feedback, we return to idle if not manually overridden
                    if (this._context?.state === 'success' ||
                        this._context?.state === 'error') {
                        // Provider should handle transition back to idle, but we can nudge it
                        // or just wait for it. ui-speech-provider simulation does this.
                    }
                }, 1500);
            }
        }
    }
    render() {
        if (!this._context)
            return html ``;
        const state = this._context.state;
        const isActive = state === 'recording' || state === 'processing' || state === 'connecting';
        return html `
      <div class="pill ${isActive ? 'active' : ''}">
        ${this.label && !isActive
            ? html `<span class="label">${this.label}</span>`
            : ''}

        <div class="waveform-container">
          <ui-voice-waveform .height=${24}></ui-voice-waveform>
        </div>

        <ui-speech-record-button
          size="sm"
          ?disabled=${this.disabled}
        ></ui-speech-record-button>
        <ui-speech-cancel-button></ui-speech-cancel-button>

        ${this._showFeedback
            ? html `
              <div class="feedback-overlay ${this._feedbackType}">
                <md-icon
                  >${this._feedbackType === 'success'
                ? 'check'
                : 'close'}</md-icon
                >
              </div>
            `
            : ''}
      </div>
    `;
    }
};
__decorate([
    consume({ context: speechContext, subscribe: true })
], UiVoicePill.prototype, "_context", void 0);
__decorate([
    property({ type: String })
], UiVoicePill.prototype, "label", void 0);
__decorate([
    property({ type: Boolean })
], UiVoicePill.prototype, "disabled", void 0);
__decorate([
    state()
], UiVoicePill.prototype, "_showFeedback", void 0);
__decorate([
    state()
], UiVoicePill.prototype, "_feedbackType", void 0);
UiVoicePill = __decorate([
    customElement('ui-voice-pill')
], UiVoicePill);
export { UiVoicePill };
//# sourceMappingURL=ui-voice-pill.js.map