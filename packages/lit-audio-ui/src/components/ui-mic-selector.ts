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

import {LitElement, html, css, PropertyValues} from 'lit';
import {customElement, property, state, query} from 'lit/decorators.js';
import '@material/web/icon/icon.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/divider/divider.js';
import '@material/web/button/text-button.js';
import '@material/web/button/filled-tonal-button.js';
import './ui-live-waveform';

export interface AudioDevice {
  deviceId: string;
  label: string;
  groupId: string;
}

/**
 * A native Lit WebComponent that provides a dropdown menu for selecting audio input devices.
 * Replaces the React/Radix MicSelector.
 */
@customElement('ui-mic-selector')
export class UiMicSelector extends LitElement {
  @property({type: String}) value?: string;
  @property({type: Boolean}) muted = false;
  @property({type: Boolean}) disabled = false;

  @state() private _devices: AudioDevice[] = [];
  @state() private _loading = true;
  @state() private _error: string | null = null;
  @state() private _hasPermission = false;
  @state() private _isMenuOpen = false;
  @state() private _previewAnalyser?: AnalyserNode;

  @query('md-menu') private _menuEl!: any; // MWC Menu

  private _previewStream?: MediaStream;
  private _previewAudioContext?: AudioContext;

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      font-family: inherit;
    }

    .anchor-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--md-sys-color-surface-container-high, #e2e2e2);
      color: var(--md-sys-color-on-surface, #1e1e1e);
      border-radius: 999px;
      cursor: pointer;
      border: none;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s;
      max-width: 250px;
    }

    .anchor-button:hover:not(:disabled) {
      background: var(--md-sys-color-surface-container-highest, #e3e3e3);
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
        var(--md-sys-color-surface, #ffffff)
      );
      --md-menu-container-shape: 12px;
      min-width: 280px;
    }

    .menu-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      gap: 12px;
    }

    .preview-waveform {
      flex: 1;
      height: 24px;
      background: var(
        --md-sys-color-surface-variant,
        var(--md-sys-color-surface-container-highest, #e1e2e1)
      );
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      align-items: center;
      padding: 0 4px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._loadDevicesWithoutPermission();
    navigator.mediaDevices.addEventListener(
      'devicechange',
      this._handleDeviceChange,
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    navigator.mediaDevices.removeEventListener(
      'devicechange',
      this._handleDeviceChange,
    );
    this._stopPreview();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // If we open the menu and don't have permission yet, trigger the prompt
    if (changedProperties.has('_isMenuOpen') && this._isMenuOpen) {
      if (!this._hasPermission && !this._loading) {
        this._loadDevicesWithPermission();
      } else if (this._hasPermission && !this.muted) {
        this._startPreview();
      }
    }

    // Stop preview if menu closes or user mutes
    if (
      (changedProperties.has('_isMenuOpen') && !this._isMenuOpen) ||
      (changedProperties.has('muted') && this.muted)
    ) {
      this._stopPreview();
    }

    // Restart preview if unmuted while open
    if (
      changedProperties.has('muted') &&
      !this.muted &&
      this._isMenuOpen &&
      this._hasPermission
    ) {
      this._startPreview();
    }
  }

  render() {
    const currentDevice = this._devices.find(d => d.deviceId === this.value) ||
      this._devices[0] || {
        label: this._loading ? 'Loading...' : 'No microphone',
      };

    return html`
      <!-- Anchor Button -->
      <button
        id="anchor-button"
        class="anchor-button"
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
        @closed=${() => (this._isMenuOpen = false)}
        @opened=${() => (this._isMenuOpen = true)}
      >
        ${this._loading
          ? html`<md-menu-item disabled
              ><div slot="headline">Loading devices...</div></md-menu-item
            >`
          : this._error
            ? html`<md-menu-item disabled
                ><div slot="headline" style="color: var(--md-sys-color-error)">
                  ${this._error}
                </div></md-menu-item
              >`
            : this._devices.map(
                device => html`
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
                      ? html`<md-icon slot="end">check</md-icon>`
                      : ''}
                  </md-menu-item>
                `,
              )}
        ${this._devices.length > 0
          ? html`
              <md-divider></md-divider>
              <div class="menu-footer">
                <md-text-button @click=${this._toggleMute}>
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

  private _toggleMenu() {
    if (this._menuEl) {
      this._menuEl.open = !this._menuEl.open;
      this._isMenuOpen = this._menuEl.open;
    }
  }

  private _selectDevice(deviceId: string) {
    this.value = deviceId;
    this.dispatchEvent(
      new CustomEvent('device-change', {
        detail: {deviceId},
        bubbles: true,
        composed: true,
      }),
    );

    // If we switch devices while menu is open, reboot the preview
    if (this._isMenuOpen && !this.muted && this._hasPermission) {
      this._startPreview();
    }
  }

  private _toggleMute(e: Event) {
    // Stop the menu from closing when we click mute
    e.stopPropagation();

    this.muted = !this.muted;
    this.dispatchEvent(
      new CustomEvent('mute-change', {
        detail: {muted: this.muted},
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleDeviceChange = () => {
    if (this._hasPermission) {
      this._loadDevicesWithPermission();
    } else {
      this._loadDevicesWithoutPermission();
    }
  };

  private async _loadDevicesWithoutPermission() {
    try {
      this._loading = true;
      this._error = null;

      const deviceList = await navigator.mediaDevices.enumerateDevices();
      this._parseDeviceList(deviceList);
    } catch (err) {
      this._error =
        err instanceof Error ? err.message : 'Failed to get audio devices';
    } finally {
      this._loading = false;
    }
  }

  private async _loadDevicesWithPermission() {
    if (this._loading) return;
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
    } catch (err) {
      this._error = err instanceof Error ? err.message : 'Permission denied';
    } finally {
      this._loading = false;
    }
  }

  private _parseDeviceList(deviceList: MediaDeviceInfo[]) {
    const audioInputs = deviceList
      .filter(device => device.kind === 'audioinput')
      .map(device => {
        let cleanLabel =
          device.label || 'Microphone ${device.deviceId.slice(0, 8)}';
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
      this.dispatchEvent(
        new CustomEvent('device-change', {
          detail: {deviceId: this.value},
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private async _startPreview() {
    this._stopPreview();
    if (!this.value) return;

    try {
      this._previewStream = await navigator.mediaDevices.getUserMedia({
        audio: {deviceId: {exact: this.value}},
      });

      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      this._previewAudioContext = new AudioContextClass();
      this._previewAnalyser = this._previewAudioContext.createAnalyser();
      this._previewAnalyser.fftSize = 256;
      this._previewAnalyser.smoothingTimeConstant = 0.8;

      const source = this._previewAudioContext.createMediaStreamSource(
        this._previewStream,
      );
      source.connect(this._previewAnalyser);
    } catch (e) {
      console.warn('Failed to start preview stream', e);
    }
  }

  private _stopPreview() {
    if (this._previewStream) {
      this._previewStream.getTracks().forEach(t => t.stop());
      this._previewStream = undefined;
    }
    if (
      this._previewAudioContext &&
      this._previewAudioContext.state !== 'closed'
    ) {
      this._previewAudioContext.close();
      this._previewAudioContext = undefined;
    }
    this._previewAnalyser = undefined;
  }
}
