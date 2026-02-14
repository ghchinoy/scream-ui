/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {LitElement, html, css, type PropertyValues} from 'lit';
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
  @state() private _feedbackType: 'success' | 'error' | null = null;
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
      font-family: inherit;
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
      --md-filled-button-hover-label-text-color: var(
        --md-sys-color-on-error-container,
        #410002
      );
      --md-filled-button-focus-label-text-color: var(
        --md-sys-color-on-error-container,
        #410002
      );
      --md-filled-button-pressed-label-text-color: var(
        --md-sys-color-on-error-container,
        #410002
      );
      --md-filled-button-with-icon-icon-color: var(
        --md-sys-color-on-error-container,
        #410002
      );
      --md-filled-button-with-icon-hover-icon-color: var(
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
      background: transparent;
      border: none;
      transition: all 0.3s ease;
    }

    .waveform-slot.idle {
      width: 0;
      opacity: 0;
      margin-left: -12px; /* Pull back to hide gap when idle */
    }

    .waveform-slot.recording,
    .waveform-slot.processing {
      opacity: 1;
    }

    .waveform-slot.recording {
      color: var(--md-sys-color-on-error-container, #410002);
    }

    .waveform-slot.processing {
      color: var(--md-sys-color-on-secondary-container, #001d36);
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
      background: inherit;
      border-radius: inherit;
      animation: fadeIn 0.3s ease forwards;
      pointer-events: none;
    }

    .feedback-overlay.success {
      background: var(--md-sys-color-primary-container, #d1e4ff);
    }

    .feedback-overlay.error {
      background: var(--md-sys-color-error-container, #ffdad6);
    }

    .feedback-icon {
      font-size: 16px;
    }
    .feedback-icon.success {
      color: var(--md-sys-color-on-primary-container, #001d36);
    }
    .feedback-icon.error {
      color: var(--md-sys-color-on-error-container, #410002);
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
        this._feedbackType = this.state;
        if (this._feedbackTimeout) clearTimeout(this._feedbackTimeout);
        this._feedbackTimeout = setTimeout(() => {
          this._showFeedback = false;
          this._feedbackType = null;
          // Optionally auto-reset state to idle after feedback
          if (this.state === 'success' || this.state === 'error') {
            this.state = 'idle';
          }
        }, 1500);
      } else if (this.state !== 'idle') {
        this._showFeedback = false;
        this._feedbackType = null;
      }
    }
  }

  render() {
    const isRecording = this.state === 'recording';
    const isProcessing = this.state === 'processing';
    const isDisabled = this.disabled || isProcessing;

    const showWaveform = isRecording || isProcessing;
    const showTrailing = !showWaveform && !this._showFeedback && this.trailing;

    const buttonClasses = {
      recording: isRecording,
      processing: isProcessing,
      success: this._feedbackType === 'success',
      error: this._feedbackType === 'error',
    };

    const slotClasses = {
      'waveform-slot': true,
      idle: !isRecording && !isProcessing,
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
                    barColor="currentColor"
                    height="20"
                    style="position: absolute; inset: 0;"
                  ></ui-live-waveform>
                `
              : ''}
            ${showTrailing
              ? html` <span class="trailing-text">${this.trailing}</span> `
              : ''}
          </div>

          ${this._showFeedback && this._feedbackType === 'success'
            ? html`
                <div class="feedback-overlay success">
                  <md-icon class="feedback-icon success">check</md-icon>
                </div>
              `
            : ''}
          ${this._showFeedback && this._feedbackType === 'error'
            ? html`
                <div class="feedback-overlay error">
                  <md-icon class="feedback-icon error">close</md-icon>
                </div>
              `
            : ''}
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
