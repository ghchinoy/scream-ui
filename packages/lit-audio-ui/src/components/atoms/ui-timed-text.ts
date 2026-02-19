/**
 * Copyright 2026 Google LLC
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {consume} from '@lit/context';
import {
  audioPlayerContext,
  type AudioPlayerState,
  type TranscriptWord,
} from '../../utils/audio-context.js';

/**
 * ATOM: Timed Text
 * Renders a transcript with word-level highlighting synchronized to audio playback.
 * Consumes AudioPlayerState for timing and transcript data.
 *
 * @element ui-timed-text
 */
@customElement('ui-timed-text')
export class UiTimedText extends LitElement {
  @consume({context: audioPlayerContext, subscribe: true})
  @property({attribute: false})
  public playerState?: AudioPlayerState;

  static override styles = css`
    :host {
      display: block;
      font-family: inherit;
      line-height: 1.6;
    }

    .transcript {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 6px;
    }

    .word {
      transition: all 0.2s ease;
      color: var(
        --ui-timed-text-color,
        var(--md-sys-color-on-surface-variant, #444)
      );
      border-radius: 4px;
      padding: 0 2px;
    }

    .word.active {
      color: var(
        --ui-timed-text-active-color,
        var(--md-sys-color-on-secondary-container, #1d192b)
      );
      background: var(
        --ui-timed-text-active-bg,
        var(--md-sys-color-secondary-container, #e8def8)
      );
      transform: scale(1.05);
    }

    .word.past {
      color: var(
        --ui-timed-text-past-color,
        var(--md-sys-color-on-surface, #1e1e1e)
      );
    }
  `;

  override render() {
    const transcript = this.playerState?.transcript || [];
    const currentTime = this.playerState?.currentTime || 0;

    if (transcript.length === 0) {
      return html`<slot></slot>`;
    }

    return html`
      <div class="transcript" part="container">
        ${transcript.map(word => this._renderWord(word, currentTime))}
      </div>
    `;
  }

  private _renderWord(word: TranscriptWord, currentTime: number) {
    const isActive = currentTime >= word.start && currentTime <= word.end;
    const isPast = currentTime > word.end;

    return html`
      <span
        class="word ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}"
        part="word ${isActive ? 'word-active' : ''} ${isPast
          ? 'word-past'
          : ''}"
        >${word.text}</span
      >
    `;
  }
}
