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
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/button/outlined-button.js';
import '@material/web/textfield/outlined-text-field.js';
import './ui-live-waveform.js';
export interface VoiceLabel {
    accent?: string;
    gender?: string;
    age?: string;
    description?: string;
    'use case'?: string;
}
export interface VoiceItem {
    [key: string]: any;
}
/**
 * A native Lit WebComponent that provides a searchable dropdown menu for selecting
 * a voice persona. It supports custom data mapping, optional 3D 'Orb' avatars,
 * and built-in audio preview capabilities.
 *
 * @element ui-voice-picker
 *
 * @prop {Array} voices - The list of voice objects to display.
 * @prop {string} value - The ID of the currently selected voice.
 * @prop {string} placeholder - Text to display when no voice is selected.
 * @prop {string} idKey - Key in the voice object to use as the unique ID (default: 'voiceId').
 * @prop {string} titleKey - Key in the voice object to use as the display name (default: 'name').
 * @prop {string} subtitleKey - Key in the voice object to use as the category/subtitle (default: 'category').
 * @prop {string} previewUrlKey - Key in the voice object containing the preview audio URL.
 * @prop {boolean} useOrbs - Whether to display 3D ui-orb avatars for each voice.
 *
 * @fires voice-change - Dispatched when a voice is selected. detail: { voiceId }
 */
export declare class UiVoicePicker extends LitElement {
    voices: any[];
    value?: string;
    placeholder: string;
    idKey: string;
    titleKey: string;
    subtitleKey: string;
    previewUrlKey: string;
    useOrbs: boolean;
    colorKey: string;
    private _searchQuery;
    private _previewingVoiceId?;
    private _menuEl;
    private _audioEl;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    private _toggleMenu;
    private _handleMenuClosed;
    private _selectVoice;
    private _togglePreview;
    private _stopPreview;
}
