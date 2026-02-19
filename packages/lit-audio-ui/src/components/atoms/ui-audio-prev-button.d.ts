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
import { LitElement } from 'lit';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';
/**
 * An atomic navigation button that triggers the 'previous' track in a playlist.
 * Consumes the AudioPlayerState from the nearest ui-audio-provider.
 *
 * @element ui-audio-prev-button
 */
export declare class UiAudioPrevButton extends LitElement {
    private playerState?;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
