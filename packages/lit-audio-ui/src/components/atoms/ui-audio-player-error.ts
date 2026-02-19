/**
 * Copyright 2026 Google LLC
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {consume} from '@lit/context';
import {
  audioPlayerContext,
  type AudioPlayerState,
} from '../../utils/audio-context.js';
import '@material/web/icon/icon.js';

/**
 * An atomic component that displays a visual error indicator and message
 * when the audio player encounters a resource loading or playback error.
 *
 * @element ui-audio-player-error
 */
@customElement('ui-audio-player-error')
export class UiAudioPlayerError extends LitElement {
  @consume({context: audioPlayerContext, subscribe: true})
  @property({attribute: false})
  public playerState?: AudioPlayerState;

  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      color: var(--ui-audio-error-color, var(--md-sys-color-error, #ba1a1a));
      font-size: 12px;
      font-family: inherit;
      gap: 4px;
      animation: fadeIn 0.3s ease forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .error-icon {
      font-size: 18px;
    }

    .error-text {
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;

  override render() {
    const error = this.playerState?.error;
    if (!error) return html``;

    return html`
      <md-icon class="error-icon">error</md-icon>
      <span class="error-text" title="${error}">${error}</span>
    `;
  }
}
