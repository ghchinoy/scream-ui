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

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {consume} from '@lit/context';
import {
  audioPlayerContext,
  type AudioPlayerState,
} from '../../utils/audio-context.js';
import '@material/web/icon/icon.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';

/**
 * A reactive list component that displays and manages a playlist.
 * Consumes AudioPlayerState from the nearest ui-audio-provider.
 *
 * @element ui-playlist
 *
 * @prop {string} header - Title for the playlist header (default: 'Queue').
 * @prop {string} emptyText - Message to show when the playlist is empty.
 */
@customElement('ui-playlist')
export class UiPlaylist extends LitElement {
  @consume({context: audioPlayerContext, subscribe: true})
  private playerState?: AudioPlayerState;

  @property({type: String}) header = 'Queue';
  @property({type: String}) emptyText = 'No tracks in queue';

  static styles = css`
    :host {
      display: block;
      background: var(--md-sys-color-surface-container-low, transparent);
      border-radius: 12px;
      overflow: hidden;
      font-family: inherit;
      color-scheme: light dark;
    }

    .playlist-header {
      padding: var(--ui-playlist-header-padding, 16px 20px);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--md-sys-color-primary, #0066cc);
      background: var(--md-sys-color-surface-container-low);
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
    }

    md-list {
      background: transparent;
      --md-list-container-color: transparent;
    }

    md-list-item {
      --md-list-item-label-text-font: inherit;
      --md-list-item-supporting-text-font: inherit;
      --md-list-item-label-text-color: var(--md-sys-color-on-surface);
      --md-list-item-supporting-text-color: var(
        --md-sys-color-on-surface-variant
      );
      cursor: pointer;
    }

    md-list-item[selected] {
      --md-list-item-label-text-color: var(--md-sys-color-primary);
      background: var(--md-sys-color-primary-container);
    }

    .now-playing-icon {
      color: var(--md-sys-color-primary);
      font-size: 18px;
    }

    .empty-state {
      padding: var(--ui-playlist-empty-padding, 32px);
      text-align: center;
      color: var(--md-sys-color-on-surface-variant);
      font-size: 0.9rem;
    }
  `;

  render() {
    const items = this.playerState?.items || [];
    const currentIndex = this.playerState?.currentIndex ?? -1;

    return html`
      <div class="playlist-header">${this.header}</div>

      ${items.length === 0
        ? html`<div class="empty-state">${this.emptyText}</div>`
        : html`
            <md-list>
              ${items.map(
                (track, index) => html`
                  <md-list-item
                    ?selected=${index === currentIndex}
                    @click=${() => this.playerState?.select(index)}
                  >
                    <div slot="headline">
                      ${track.title || 'Untitled Track'}
                    </div>
                    <div slot="supporting-text">
                      ${track.artist || 'Unknown Artist'}
                    </div>
                    ${index === currentIndex
                      ? html`<md-icon slot="start" class="now-playing-icon"
                          >${this.playerState?.isPlaying
                            ? 'graphic_eq'
                            : 'play_arrow'}</md-icon
                        >`
                      : html`<md-icon slot="start">music_note</md-icon>`}
                  </md-list-item>
                `,
              )}
            </md-list>
          `}
    `;
  }
}
