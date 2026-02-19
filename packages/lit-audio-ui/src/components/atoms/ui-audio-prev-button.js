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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { audioPlayerContext, } from '../../utils/audio-context.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';
/**
 * An atomic navigation button that triggers the 'previous' track in a playlist.
 * Consumes the AudioPlayerState from the nearest ui-audio-provider.
 *
 * @element ui-audio-prev-button
 */
let UiAudioPrevButton = class UiAudioPrevButton extends LitElement {
    static { this.styles = css `
    :host {
      display: inline-block;
    }
  `; }
    render() {
        // Disable if no playlist exists or if we're at the start
        const hasPrev = this.playerState &&
            this.playerState.items.length > 0 &&
            (this.playerState.currentIndex > 0 || this.playerState.autoAdvance);
        return html `
      <md-icon-button
        aria-label="Previous track"
        ?disabled=${!hasPrev}
        @click=${() => this.playerState?.previous()}
      >
        <md-icon>skip_previous</md-icon>
      </md-icon-button>
    `;
    }
};
__decorate([
    consume({ context: audioPlayerContext, subscribe: true })
], UiAudioPrevButton.prototype, "playerState", void 0);
UiAudioPrevButton = __decorate([
    customElement('ui-audio-prev-button')
], UiAudioPrevButton);
export { UiAudioPrevButton };
//# sourceMappingURL=ui-audio-prev-button.js.map