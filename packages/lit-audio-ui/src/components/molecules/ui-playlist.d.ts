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
export declare class UiPlaylist extends LitElement {
    private playerState?;
    header: string;
    emptyText: string;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
