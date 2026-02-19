var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { speechContext } from '../../utils/speech-context.js';
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/icon/icon.js';
let UiSpeechRecordButton = class UiSpeechRecordButton extends LitElement {
    constructor() {
        super(...arguments);
        this.size = 'default';
    }
    static { this.styles = css `
    :host {
      display: inline-block;
    }
    md-filled-icon-button {
      --md-filled-icon-button-container-width: 48px;
      --md-filled-icon-button-container-height: 48px;
      --md-filled-icon-button-icon-size: 24px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    :host([size='sm']) md-filled-icon-button {
      --md-filled-icon-button-container-width: 32px;
      --md-filled-icon-button-container-height: 32px;
      --md-filled-icon-button-icon-size: 18px;
    }
    :host([size='lg']) md-filled-icon-button {
      --md-filled-icon-button-container-width: 64px;
      --md-filled-icon-button-container-height: 64px;
      --md-filled-icon-button-icon-size: 32px;
    }

    .recording {
      --md-filled-icon-button-container-color: var(
        --ui-speech-record-color,
        var(--md-sys-color-error, #ba1a1a)
      );
    }
    .processing {
      --md-filled-icon-button-container-color: var(
        --ui-speech-processing-color,
        var(--md-sys-color-secondary, #0066cc)
      );
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
      100% {
        opacity: 1;
      }
    }
  `; }
    render() {
        const state = this._context?.state || 'idle';
        const isRecording = state === 'recording';
        const isProcessing = state === 'processing' || state === 'connecting';
        let icon = 'mic';
        if (isRecording)
            icon = 'stop';
        if (isProcessing)
            icon = 'hourglass_empty';
        if (state === 'success')
            icon = 'check';
        if (state === 'error')
            icon = 'error';
        let ariaLabel = 'Start recording';
        if (isRecording)
            ariaLabel = 'Stop recording';
        if (isProcessing)
            ariaLabel = 'Processing speech';
        if (state === 'success')
            ariaLabel = 'Recording successful';
        if (state === 'error')
            ariaLabel = 'Recording failed';
        return html `
      <md-filled-icon-button
        class="${state}"
        aria-label="${ariaLabel}"
        ?disabled=${isProcessing || !this._context}
        @click=${this._handleClick}
      >
        <md-icon>${icon}</md-icon>
      </md-filled-icon-button>
    `;
    }
    _handleClick() {
        if (!this._context)
            return;
        if (this._context.state === 'idle') {
            this._context.start();
        }
        else if (this._context.state === 'recording') {
            this._context.stop();
        }
    }
};
__decorate([
    consume({ context: speechContext, subscribe: true })
], UiSpeechRecordButton.prototype, "_context", void 0);
__decorate([
    property({ type: String })
], UiSpeechRecordButton.prototype, "size", void 0);
UiSpeechRecordButton = __decorate([
    customElement('ui-speech-record-button')
], UiSpeechRecordButton);
export { UiSpeechRecordButton };
//# sourceMappingURL=ui-speech-record-button.js.map