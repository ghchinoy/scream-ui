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
import {customElement} from 'lit/decorators.js';
import {consume} from '@lit/context';
import {
  audioPlayerContext,
  type AudioPlayerState,
} from '../../utils/audio-context.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';

/**
 * An atomic navigation button that triggers the 'next' track in a playlist.
 * Consumes the AudioPlayerState from the nearest ui-audio-provider.
 *
 * @element ui-audio-next-button
 */
@customElement('ui-audio-next-button')
export class UiAudioNextButton extends LitElement {
  @consume({context: audioPlayerContext, subscribe: true})
  private playerState?: AudioPlayerState;

  static styles = css`
    :host {
      display: inline-block;
    }
  `;

  render() {
    // Disable if no playlist exists or if we're at the end and autoAdvance is false
    const hasNext =
      this.playerState &&
      this.playerState.items.length > 0 &&
      (this.playerState.currentIndex < this.playerState.items.length - 1 ||
        this.playerState.autoAdvance);

    return html`
      <md-icon-button
        aria-label="Next track"
        ?disabled=${!hasNext}
        @click=${() => this.playerState?.next()}
      >
        <md-icon>skip_next</md-icon>
      </md-icon-button>
    `;
  }
}
