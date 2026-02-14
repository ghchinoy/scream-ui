import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {consume} from '@lit/context';
import {speechContext, type SpeechContext} from '../utils/speech-context';
import './ui-live-waveform';

@customElement('ui-speech-preview')
export class UiSpeechPreview extends LitElement {
  @consume({context: speechContext, subscribe: true})
  private _context?: SpeechContext;

  @property({type: String}) placeholder = 'Jot down some thoughts...';

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      font-family: inherit;
      min-width: 120px;
    }

    .transcript {
      font-size: 14px;
      color: var(--md-sys-color-on-surface, #1e1e1e);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }

    .placeholder {
      color: var(--md-sys-color-outline, #79747e);
      font-style: italic;
    }

    .waveform-container {
      width: 48px;
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
      margin-left: -12px;
    }
  `;

  render() {
    if (!this._context) return html``;

    const {state, transcript, partialTranscript, analyserNode} = this._context;
    const isRecording = state === 'recording';
    const isProcessing = state === 'processing' || state === 'connecting';
    const hasText = transcript || partialTranscript;

    const displayTranscript = partialTranscript || transcript;

    return html`
      ${!isRecording && !isProcessing && !hasText
        ? html`<span class="placeholder">${this.placeholder}</span>`
        : html`<span class="transcript">${displayTranscript}</span>`}

      <div class="waveform-container ${isRecording || isProcessing ? '' : 'hidden'}">
        <ui-live-waveform
          .active=${isRecording}
          .processing=${isProcessing}
          .analyserNode=${analyserNode}
          barWidth="2"
          barGap="1"
          height="20"
        ></ui-live-waveform>
      </div>
    `;
  }
}
