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
import { customElement, property, state, query } from 'lit/decorators.js';
import '@material/web/icon/icon.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/divider/divider.js';
import '@material/web/button/text-button.js';
import '@material/web/button/filled-tonal-button.js';
import './ui-live-waveform.js';
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
let UiMicSelector = class UiMicSelector extends LitElement {
    constructor() {
        super(...arguments);
        this.muted = false;
        this.disabled = false;
        this._devices = [];
        this._loading = true;
        this._error = null;
        this._hasPermission = false;
        this._isMenuOpen = false;
        this._handleDeviceChange = () => {
            if (this._hasPermission) {
                this._loadDevicesWithPermission();
            }
            else {
                this._loadDevicesWithoutPermission();
            }
        };
    }
    static { this.styles = css `
    :host {
      display: inline-block;
      position: relative;
      font-family: inherit;
      color-scheme: light dark;
    }

    .anchor-button {
      display: flex;
      align-items: center;
      gap: var(--ui-mic-selector-gap, 8px);
      padding: var(--ui-mic-selector-padding, 8px 16px);
      background: var(--md-sys-color-surface-container-high, transparent);
      color: var(--md-sys-color-on-surface);
      border-radius: 999px;
      cursor: pointer;
      border: 1px solid var(--md-sys-color-outline-variant, currentColor);
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s;
      max-width: 250px;
    }

    .anchor-button:hover:not(:disabled) {
      background: var(--md-sys-color-surface-container-highest);
    }

    .anchor-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .label-text {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
    }

    md-menu {
      --md-menu-container-color: var(
        --md-sys-color-surface-container,
        var(--md-sys-color-surface)
      );
      --md-menu-container-shape: 12px;
      min-width: 280px;
      font-family: inherit;
      /* Force typescale fonts to inherit project font */
      --md-sys-typescale-body-medium-font: inherit;
      --md-sys-typescale-label-large-font: inherit;
      border: 1px solid var(--md-sys-color-outline-variant);
    }

    md-menu-item {
      font-family: inherit;
      --md-menu-item-label-text-font: inherit;
      --md-sys-typescale-label-large-font: inherit;
    }

    md-menu-item div[slot='headline'] {
      font-family: inherit;
    }

    .menu-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      gap: 12px;
      font-family: inherit;
    }

    md-text-button {
      font-family: inherit;
      --md-text-button-label-text-font: inherit;
      --md-sys-typescale-label-large-font: inherit;
    }

    .preview-waveform {
      flex: 1;
      height: 24px;
      background: var(
        --md-sys-color-surface-variant,
        var(--md-sys-color-surface-container-highest)
      );
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      align-items: center;
      padding: 0 4px;
    }
  `; }
    connectedCallback() {
        super.connectedCallback();
        this._loadDevicesWithoutPermission();
        navigator.mediaDevices.addEventListener('devicechange', this._handleDeviceChange);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        navigator.mediaDevices.removeEventListener('devicechange', this._handleDeviceChange);
        this._stopPreview();
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        // If we open the menu and don't have permission yet, trigger the prompt
        if (changedProperties.has('_isMenuOpen') && this._isMenuOpen) {
            if (!this._hasPermission && !this._loading) {
                this._loadDevicesWithPermission();
            }
            else if (this._hasPermission && !this.muted) {
                this._startPreview();
            }
        }
        // Stop preview if menu closes or user mutes
        if ((changedProperties.has('_isMenuOpen') && !this._isMenuOpen) ||
            (changedProperties.has('muted') && this.muted)) {
            this._stopPreview();
        }
        // Restart preview if unmuted while open
        if (changedProperties.has('muted') &&
            !this.muted &&
            this._isMenuOpen &&
            this._hasPermission) {
            this._startPreview();
        }
    }
    render() {
        const currentDevice = this._devices.find(d => d.deviceId === this.value) ||
            this._devices[0] || {
            label: this._loading ? 'Loading...' : 'No microphone',
        };
        return html `
      <!-- Anchor Button -->
      <button
        id="anchor-button"
        class="anchor-button"
        aria-label="Select audio input"
        aria-haspopup="menu"
        aria-expanded=${this._isMenuOpen}
        ?disabled=${this._loading || this.disabled}
        @click=${this._toggleMenu}
      >
        <md-icon>${this.muted ? 'mic_off' : 'mic'}</md-icon>
        <span class="label-text">${currentDevice.label}</span>
        <md-icon style="font-size: 18px;">unfold_more</md-icon>
      </button>

      <!-- Dropdown Menu -->
      <md-menu
        id="device-menu"
        anchor="anchor-button"
        positioning="popover"
        aria-label="Audio input devices"
        @closed=${() => (this._isMenuOpen = false)}
        @opened=${() => (this._isMenuOpen = true)}
      >
        ${this._loading
            ? html `<md-menu-item disabled
              ><div slot="headline">Loading devices...</div></md-menu-item
            >`
            : this._error
                ? html `<md-menu-item disabled
                ><div slot="headline" style="color: var(--md-sys-color-error)">
                  ${this._error}
                </div></md-menu-item
              >`
                : this._devices.map(device => html `
                  <md-menu-item
                    @click=${() => this._selectDevice(device.deviceId)}
                    ?selected=${this.value === device.deviceId ||
                    (!this.value &&
                        this._devices[0]?.deviceId === device.deviceId)}
                  >
                    <div slot="headline">${device.label}</div>
                    ${this.value === device.deviceId ||
                    (!this.value &&
                        this._devices[0]?.deviceId === device.deviceId)
                    ? html `<md-icon slot="end">check</md-icon>`
                    : ''}
                  </md-menu-item>
                `)}
        ${this._devices.length > 0
            ? html `
              <md-divider></md-divider>
              <div class="menu-footer">
                <md-text-button
                  @click=${this._toggleMute}
                  aria-label="${this.muted
                ? 'Unmute microphone'
                : 'Mute microphone'}"
                >
                  <md-icon slot="icon"
                    >${this.muted ? 'mic_off' : 'mic'}</md-icon
                  >
                  ${this.muted ? 'Unmute' : 'Mute'}
                </md-text-button>

                <div class="preview-waveform">
                  <ui-live-waveform
                    .active=${this._isMenuOpen &&
                !this.muted &&
                this._hasPermission}
                    .processing=${false}
                    .analyserNode=${this._previewAnalyser}
                    .barWidth=${3}
                    .barGap=${1}
                    .fadeEdges=${false}
                    height="16"
                  ></ui-live-waveform>
                </div>
              </div>
            `
            : ''}
      </md-menu>
    `;
    }
    _toggleMenu() {
        if (this._menuEl) {
            this._menuEl.open = !this._menuEl.open;
            this._isMenuOpen = this._menuEl.open;
        }
    }
    _selectDevice(deviceId) {
        this.value = deviceId;
        this.dispatchEvent(new CustomEvent('device-change', {
            detail: { deviceId },
            bubbles: true,
            composed: true,
        }));
        // If we switch devices while menu is open, reboot the preview
        if (this._isMenuOpen && !this.muted && this._hasPermission) {
            this._startPreview();
        }
    }
    _toggleMute(e) {
        // Stop the menu from closing when we click mute
        e.stopPropagation();
        this.muted = !this.muted;
        this.dispatchEvent(new CustomEvent('mute-change', {
            detail: { muted: this.muted },
            bubbles: true,
            composed: true,
        }));
    }
    async _loadDevicesWithoutPermission() {
        try {
            this._loading = true;
            this._error = null;
            const deviceList = await navigator.mediaDevices.enumerateDevices();
            this._parseDeviceList(deviceList);
        }
        catch (err) {
            this._error =
                err instanceof Error ? err.message : 'Failed to get audio devices';
        }
        finally {
            this._loading = false;
        }
    }
    async _loadDevicesWithPermission() {
        if (this._loading)
            return;
        try {
            this._loading = true;
            this._error = null;
            // Ask for permission by grabbing a temp stream
            const tempStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            tempStream.getTracks().forEach(track => track.stop());
            const deviceList = await navigator.mediaDevices.enumerateDevices();
            this._parseDeviceList(deviceList);
            this._hasPermission = true;
            if (this._isMenuOpen && !this.muted) {
                this._startPreview();
            }
        }
        catch (err) {
            this._error = err instanceof Error ? err.message : 'Permission denied';
        }
        finally {
            this._loading = false;
        }
    }
    _parseDeviceList(deviceList) {
        const audioInputs = deviceList
            .filter(device => device.kind === 'audioinput')
            .map(device => {
            let cleanLabel = device.label || 'Microphone';
            cleanLabel = cleanLabel.replace(/\s*\([^)]*\)/g, '').trim();
            return {
                deviceId: device.deviceId,
                label: cleanLabel,
                groupId: device.groupId,
            };
        });
        this._devices = audioInputs;
        // Auto-select first device if none selected
        if (!this.value && audioInputs.length > 0) {
            this.value = audioInputs[0].deviceId;
            this.dispatchEvent(new CustomEvent('device-change', {
                detail: { deviceId: this.value },
                bubbles: true,
                composed: true,
            }));
        }
    }
    async _startPreview() {
        this._stopPreview();
        if (!this.value)
            return;
        try {
            this._previewStream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: { exact: this.value } },
            });
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this._previewAudioContext = new AudioContextClass();
            this._previewAnalyser = this._previewAudioContext.createAnalyser();
            this._previewAnalyser.fftSize = 256;
            this._previewAnalyser.smoothingTimeConstant = 0.8;
            const source = this._previewAudioContext.createMediaStreamSource(this._previewStream);
            source.connect(this._previewAnalyser);
        }
        catch (e) {
            console.warn('Failed to start preview stream', e);
        }
    }
    _stopPreview() {
        if (this._previewStream) {
            this._previewStream.getTracks().forEach(t => t.stop());
            this._previewStream = undefined;
        }
        if (this._previewAudioContext &&
            this._previewAudioContext.state !== 'closed') {
            this._previewAudioContext.close();
            this._previewAudioContext = undefined;
        }
        this._previewAnalyser = undefined;
    }
};
__decorate([
    property({ type: String })
], UiMicSelector.prototype, "value", void 0);
__decorate([
    property({ type: Boolean })
], UiMicSelector.prototype, "muted", void 0);
__decorate([
    property({ type: Boolean })
], UiMicSelector.prototype, "disabled", void 0);
__decorate([
    state()
], UiMicSelector.prototype, "_devices", void 0);
__decorate([
    state()
], UiMicSelector.prototype, "_loading", void 0);
__decorate([
    state()
], UiMicSelector.prototype, "_error", void 0);
__decorate([
    state()
], UiMicSelector.prototype, "_hasPermission", void 0);
__decorate([
    state()
], UiMicSelector.prototype, "_isMenuOpen", void 0);
__decorate([
    state()
], UiMicSelector.prototype, "_previewAnalyser", void 0);
__decorate([
    query('md-menu')
], UiMicSelector.prototype, "_menuEl", void 0);
UiMicSelector = __decorate([
    customElement('ui-mic-selector')
], UiMicSelector);
export { UiMicSelector };
//# sourceMappingURL=ui-mic-selector.js.map