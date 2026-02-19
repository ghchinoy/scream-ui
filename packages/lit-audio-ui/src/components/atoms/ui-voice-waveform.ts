/**
 * Copyright 2026 Google LLC
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {consume} from '@lit/context';
import {speechContext, type SpeechContext} from '../../utils/speech-context.js';
import '../molecules/ui-live-waveform.js';

/**
 * A specialized version of ui-live-waveform that automatically consumes
 * state from a nearby ui-speech-provider.
 *
 * @element ui-voice-waveform
 */
@customElement('ui-voice-waveform')
export class UiVoiceWaveform extends LitElement {
  @consume({context: speechContext, subscribe: true})
  private _context?: SpeechContext;

  @property({type: Number}) barWidth = 2;
  @property({type: Number}) barGap = 1;
  @property({type: String}) barColor = 'currentColor';
  @property({type: Number}) height = 20;

  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }
  `;

  override render() {
    if (!this._context) return html``;

    const isRecording = this._context.state === 'recording';
    const isProcessing =
      this._context.state === 'processing' ||
      this._context.state === 'connecting';
    const isActive = isRecording || isProcessing;

    if (!isActive) return html``;

    return html`
      <ui-live-waveform
        .active=${isRecording}
        .processing=${isProcessing}
        .analyserNode=${this._context.analyserNode}
        .barWidth=${this.barWidth}
        .barGap=${this.barGap}
        .barColor=${this.barColor}
        .height=${this.height}
      ></ui-live-waveform>
    `;
  }
}
