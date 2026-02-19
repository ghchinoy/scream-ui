/**
 * Copyright 2026 Google LLC
 */

import {LitElement, html, css, type PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {consume} from '@lit/context';
import {speechContext, type SpeechContext} from '../../utils/speech-context.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/icon/icon.js';
import './ui-live-waveform.js';

export type VoiceButtonState =
  | 'idle'
  | 'recording'
  | 'processing'
  | 'success'
  | 'error';

/**
 * A native Lit WebComponent replacement for the ElevenLabs React voice-button.
 * Now refactored to consume speechContext but maintains backward compatibility
 * for manual state control.
 */
@customElement('ui-voice-button')
export class UiVoiceButton extends LitElement {
  @consume({context: speechContext, subscribe: true})
  private _context?: SpeechContext;

  @property({type: String}) state: VoiceButtonState = 'idle';
  @property({type: String}) label?: string;
  @property({type: String}) trailing?: string;
  @property({type: Boolean}) disabled: boolean = false;
  @property({attribute: false}) analyserNode?: AnalyserNode;

  @state() private _showFeedback = false;
  @state() private _feedbackType: 'success' | 'error' | null = null;
  private _feedbackTimeout?: ReturnType<typeof setTimeout>;

  static override styles = css`
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
  `;

  protected override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Sync from context if available, otherwise use own state property
    const effectiveState = this._context?.state || this.state;

    if (changedProperties.has('_context') || changedProperties.has('state')) {
      if (effectiveState === 'success' || effectiveState === 'error') {
        this._showFeedback = true;
        this._feedbackType = effectiveState as 'success' | 'error';
        if (this._feedbackTimeout) clearTimeout(this._feedbackTimeout);
        this._feedbackTimeout = setTimeout(() => {
          this._showFeedback = false;
          this._feedbackType = null;
          if (
            !this._context &&
            (this.state === 'success' || this.state === 'error')
          ) {
            this.state = 'idle';
          }
        }, 1500);
      }
    }
  }

  override render() {
    const effectiveState = this._context?.state || this.state;
    const isRecording = effectiveState === 'recording';
    const isProcessing =
      effectiveState === 'processing' || effectiveState === 'connecting';
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

    return html`
      <md-filled-button
        class=${classMap(buttonClasses)}
        ?disabled=${isDisabled}
        @click=${this._handleClick}
      >
        <div class="wrapper ${isActive ? 'active' : ''}">
          ${this.label ? html`<span>${this.label}</span>` : ''}
          <div class=${classMap(slotClasses)}>
            ${isActive
              ? html`
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
            ? html`<div class="feedback-overlay success">
                <md-icon>check</md-icon>
              </div>`
            : ''}
          ${this._showFeedback && this._feedbackType === 'error'
            ? html`<div class="feedback-overlay error">
                <md-icon>close</md-icon>
              </div>`
            : ''}
        </div>
      </md-filled-button>
    `;
  }

  private _handleClick(_e: Event) {
    if (this._context) {
      if (this._context.state === 'idle') {
        this._context.start();
      } else if (this._context.state === 'recording') {
        this._context.stop();
      }
    }

    this.dispatchEvent(
      new CustomEvent('voice-button-click', {
        bubbles: true,
        composed: true,
        detail: {state: this._context?.state || this.state},
      }),
    );
  }
}
