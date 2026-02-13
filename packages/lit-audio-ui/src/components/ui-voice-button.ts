import {LitElement, html, css, PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/icon/icon.js';
import './ui-live-waveform';

export type VoiceButtonState =
  | 'idle'
  | 'recording'
  | 'processing'
  | 'success'
  | 'error';

/**
 * A native Lit WebComponent replacement for the ElevenLabs React voice-button.
 */
@customElement('ui-voice-button')
export class UiVoiceButton extends LitElement {
  @property({type: String}) state: VoiceButtonState = 'idle';
  @property({type: String}) label?: string;
  @property({type: String}) trailing?: string;
  @property({type: Boolean}) disabled: boolean = false;
  @property({attribute: false}) analyserNode?: AnalyserNode;

  // Internal state for the success/error transient feedback
  @state() private _showFeedback = false;
  private _feedbackTimeout?: ReturnType<typeof setTimeout>;

  static styles = css`
    :host {
      display: inline-block;
      --ui-waveform-height: 24px;
      --ui-waveform-width: 96px;
    }

    .wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    md-filled-button,
    md-outlined-button {
      transition: all 0.2s ease-in-out;
    }

    /* Customize the button depending on the state */
    md-filled-button.recording {
      --md-filled-button-container-color: var(
        --md-sys-color-error-container,
        #ffdad6
      );
      --md-filled-button-label-text-color: var(
        --md-sys-color-on-error-container,
        #410002
      );
    }

    md-filled-button.processing {
      --md-filled-button-container-color: var(
        --md-sys-color-secondary-container,
        #cce5ff
      );
      --md-filled-button-label-text-color: var(
        --md-sys-color-on-secondary-container,
        #001d36
      );
    }

    md-filled-button.success {
      --md-filled-button-container-color: var(
        --md-sys-color-primary-container,
        #d1e4ff
      );
      --md-filled-button-label-text-color: var(
        --md-sys-color-on-primary-container,
        #001d36
      );
    }

    .waveform-slot {
      position: relative;
      width: var(--ui-waveform-width);
      height: var(--ui-waveform-height);
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--md-sys-color-surface-container-highest, #e3e3e3);
      border: 1px solid var(--md-sys-color-outline-variant, #c4c7c5);
      transition: background-color 0.3s ease;
    }

    .waveform-slot.recording {
      background: var(--md-sys-color-error-container, #ffdad6);
      border-color: transparent;
    }

    .waveform-slot.processing {
      background: var(--md-sys-color-secondary-container, #cce5ff);
      border-color: transparent;
    }

    .trailing-text {
      font-family: monospace;
      font-size: 11px;
      color: var(--md-sys-color-on-surface-variant, #444);
      font-weight: 500;
      user-select: none;
    }

    .feedback-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--md-sys-color-surface, #fff);
      animation: fadeIn 0.3s ease forwards;
    }

    .feedback-icon {
      font-size: 16px;
    }
    .feedback-icon.success {
      color: var(--md-sys-color-primary, #0066cc);
    }
    .feedback-icon.error {
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
  `;

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('state')) {
      if (this.state === 'success' || this.state === 'error') {
        this._showFeedback = true;
        if (this._feedbackTimeout) clearTimeout(this._feedbackTimeout);
        this._feedbackTimeout = setTimeout(() => {
          this._showFeedback = false;
          // Optionally auto-reset state to idle after feedback
          if (this.state === 'success' || this.state === 'error') {
            this.state = 'idle';
          }
        }, 1500);
      } else {
        this._showFeedback = false;
      }
    }
  }

  render() {
    const isRecording = this.state === 'recording';
    const isProcessing = this.state === 'processing';
    const isSuccess = this.state === 'success';
    const isError = this.state === 'error';
    const isDisabled = this.disabled || isProcessing;

    const showWaveform = isRecording || isProcessing;
    const showTrailing = !showWaveform && !this._showFeedback && this.trailing;

    const buttonClasses = {
      recording: isRecording,
      processing: isProcessing,
      success: isSuccess && this._showFeedback,
      error: isError && this._showFeedback,
    };

    const slotClasses = {
      'waveform-slot': true,
      recording: isRecording,
      processing: isProcessing,
    };

    return html`
      <md-filled-button
        class=${classMap(buttonClasses)}
        ?disabled=${isDisabled}
        @click=${this._handleClick}
      >
        <div class="wrapper">
          ${this.label ? html`<span>${this.label}</span>` : ''}

          <div class=${classMap(slotClasses)}>
            ${showWaveform
              ? html`
                  <ui-live-waveform
                    .active=${isRecording}
                    .processing=${isProcessing}
                    .analyserNode=${this.analyserNode}
                    .barWidth=${2}
                    .barGap=${1}
                    .barRadius=${4}
                    .fadeEdges=${false}
                    .sensitivity=${1.8}
                    height="20"
                    style="position: absolute; inset: 0;"
                  ></ui-live-waveform>
                `
              : ''}
            ${showTrailing
              ? html` <span class="trailing-text">${this.trailing}</span> `
              : ''}
            ${this._showFeedback && isSuccess
              ? html`
                  <div class="feedback-overlay">
                    <md-icon class="feedback-icon success">check</md-icon>
                  </div>
                `
              : ''}
            ${this._showFeedback && isError
              ? html`
                  <div class="feedback-overlay">
                    <md-icon class="feedback-icon error">close</md-icon>
                  </div>
                `
              : ''}
          </div>
        </div>
      </md-filled-button>
    `;
  }

  private _handleClick(_e: Event) {
    this.dispatchEvent(
      new CustomEvent('voice-button-click', {
        bubbles: true,
        composed: true,
        detail: {state: this.state},
      }),
    );
  }
}
