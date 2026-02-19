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
import { LitElement, type PropertyValues } from 'lit';
import '@material/web/icon/icon.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/divider/divider.js';
import '@material/web/button/text-button.js';
import '@material/web/button/filled-tonal-button.js';
import './ui-live-waveform.js';
export interface AudioDevice {
    deviceId: string;
    label: string;
    groupId: string;
}
/**
 * A native Lit WebComponent that provides a dropdown menu for selecting audio input devices.
 * It automatically handles permission requests, device enumeration, and provides a
 * live preview waveform of the selected input.
 *
 * @element ui-mic-selector
 *
 * @prop {string} value - The deviceId of the currently selected audio input.
 * @prop {boolean} muted - Whether the microphone is visually/logically muted in the selector.
 * @prop {boolean} disabled - Whether the selector interaction is disabled.
 *
 * @fires device-change - Dispatched when a new device is selected. detail: { deviceId }
 * @fires mute-change - Dispatched when the mute state is toggled. detail: { muted }
 */
export declare class UiMicSelector extends LitElement {
    value?: string;
    muted: boolean;
    disabled: boolean;
    private _devices;
    private _loading;
    private _error;
    private _hasPermission;
    private _isMenuOpen;
    private _previewAnalyser?;
    private _menuEl;
    private _previewStream?;
    private _previewAudioContext?;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changedProperties: PropertyValues): void;
    render(): import("lit-html").TemplateResult<1>;
    private _toggleMenu;
    private _selectDevice;
    private _toggleMute;
    private _handleDeviceChange;
    private _loadDevicesWithoutPermission;
    private _loadDevicesWithPermission;
    private _parseDeviceList;
    private _startPreview;
    private _stopPreview;
}
