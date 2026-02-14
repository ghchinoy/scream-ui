import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {consume} from '@lit/context';
import {speechContext, type SpeechContext} from '../utils/speech-context';
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/icon/icon.js';

@customElement('ui-speech-record-button')
export class UiSpeechRecordButton extends LitElement {
  @consume({context: speechContext, subscribe: true})
  private _context?: SpeechContext;

  @property({type: String}) size: 'sm' | 'default' | 'lg' = 'default';

  static styles = css`
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
  `;

  render() {
    if (!this._context) return html``;

    const {state} = this._context;
    const isRecording = state === 'recording';
    const isProcessing = state === 'processing' || state === 'connecting';

    let icon = 'mic';
    if (isRecording) icon = 'stop';
    if (isProcessing) icon = 'hourglass_empty';
    if (state === 'success') icon = 'check';
    if (state === 'error') icon = 'error';

    return html`
      <md-filled-icon-button
        class="${state}"
        ?disabled=${isProcessing}
        @click=${this._handleClick}
      >
        <md-icon>${icon}</md-icon>
      </md-filled-icon-button>
    `;
  }

  private _handleClick() {
    if (!this._context) return;
    if (this._context.state === 'idle') {
      this._context.start();
    } else if (this._context.state === 'recording') {
      this._context.stop();
    }
  }
}
