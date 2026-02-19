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
import './ui-live-waveform.js';
let UiSpeechPreview = class UiSpeechPreview extends LitElement {
    constructor() {
        super(...arguments);
        this.placeholder = 'Jot down some thoughts...';
    }
    static { this.styles = css `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--ui-speech-preview-gap, 8px);
      font-family: inherit;
      min-width: 0;
      color: var(--md-sys-color-primary);
    }

    .transcript {
      font-size: var(--ui-speech-preview-font-size, 14px);
      font-family: var(--ui-speech-preview-font-family, inherit);
      color: var(--md-sys-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }

    .placeholder {
      color: var(--md-sys-color-on-surface-variant);
      opacity: 0.7;
      font-style: italic;
    }

    .waveform-container {
      width: 32px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .hidden {
      width: 0;
      opacity: 0;
      pointer-events: none;
      margin-left: -8px;
    }
  `; }
    render() {
        const { state = 'idle', transcript = '', partialTranscript = '', analyserNode = undefined, } = this._context || {};
        const isRecording = state === 'recording';
        const isProcessing = state === 'processing' || state === 'connecting';
        const hasText = transcript || partialTranscript;
        const displayTranscript = partialTranscript || transcript;
        return html `
      ${!isRecording && !isProcessing && !hasText
            ? html `<span class="placeholder">${this.placeholder}</span>`
            : html `<span class="transcript">${displayTranscript}</span>`}

      <div
        class="waveform-container ${isRecording || isProcessing
            ? ''
            : 'hidden'}"
      >
        <ui-live-waveform
          .active=${isRecording}
          .processing=${isProcessing}
          .analyserNode=${analyserNode}
          barWidth="2"
          barGap="1"
          height="20"
          barColor="var(--ui-speech-wave-color, currentColor)"
        ></ui-live-waveform>
      </div>
    `;
    }
};
__decorate([
    consume({ context: speechContext, subscribe: true })
], UiSpeechPreview.prototype, "_context", void 0);
__decorate([
    property({ type: String })
], UiSpeechPreview.prototype, "placeholder", void 0);
UiSpeechPreview = __decorate([
    customElement('ui-speech-preview')
], UiSpeechPreview);
export { UiSpeechPreview };
//# sourceMappingURL=ui-speech-preview.js.map