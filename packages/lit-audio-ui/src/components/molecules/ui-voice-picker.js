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
import '@material/web/button/outlined-button.js';
import '@material/web/textfield/outlined-text-field.js';
import './ui-live-waveform.js';
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
let UiVoicePicker = class UiVoicePicker extends LitElement {
    constructor() {
        super(...arguments);
        this.voices = []; // Changed to any[] to accept generic data
        this.placeholder = 'Select a voice...';
        // Data mapping keys for generic objects
        this.idKey = 'voiceId';
        this.titleKey = 'name';
        this.subtitleKey = 'category';
        this.previewUrlKey = 'previewUrl';
        // Orb Avatar Config
        this.useOrbs = false;
        this.colorKey = 'colors';
        this._searchQuery = '';
    }
    static { this.styles = css `
    :host {
      display: inline-block;
      width: 100%;
      font-family: inherit;
      color-scheme: light dark;
    }

    .anchor-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: var(--ui-voice-picker-padding, 8px 16px);
      background: var(
        --ui-voice-picker-anchor-bg,
        var(--md-sys-color-surface-container-high, transparent)
      );
      border: 1px solid var(--md-sys-color-outline-variant, currentColor);
      border-radius: 8px;
      color: var(--md-sys-color-on-surface);
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      min-height: 48px;
      transition:
        background-color 0.2s,
        border-color 0.2s;
    }

    .anchor-button:hover {
      background: var(--md-sys-color-surface-container-highest);
    }

    .anchor-button:focus-visible {
      outline: none;
      border-color: var(--md-sys-color-primary);
      box-shadow: 0 0 0 1px var(--md-sys-color-primary);
    }

    .trigger-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      min-width: 100%;
      padding: 4px 0;
    }

    .trigger-left {
      display: flex;
      align-items: center;
      gap: var(--ui-voice-picker-trigger-gap, 12px);
      overflow: hidden;
    }

    .trigger-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .trigger-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--md-sys-color-on-surface);
    }

    md-menu {
      --md-menu-container-shape: 12px;
      --md-menu-container-color: var(
        --md-sys-color-surface-container,
        var(--md-sys-color-surface)
      );
      max-width: 400px;
      font-family: inherit;
      --md-sys-typescale-body-medium-font: inherit;
      border: 1px solid var(--md-sys-color-outline-variant);
    }

    .search-container {
      padding: 8px 12px;
      background: var(--md-sys-color-surface-container);
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      font-family: inherit;
    }

    md-outlined-text-field {
      width: 100%;
      --md-outlined-text-field-container-shape: 8px;
      font-family: inherit;
      --md-outlined-text-field-label-text-font: inherit;
      --md-outlined-text-field-input-text-font: inherit;
      --md-sys-typescale-body-large-font: inherit;
    }

    md-menu-item {
      --md-menu-item-hover-state-layer-color: var(
        --md-sys-color-on-surface-variant
      );
      --md-menu-item-focus-state-layer-color: var(
        --md-sys-color-on-surface-variant
      );
      --md-menu-item-label-text-color: var(--md-sys-color-on-surface);
      --md-menu-item-label-text-font: inherit;
      --md-sys-typescale-label-large-font: inherit;
      font-family: inherit;
    }

    .voice-item-content {
      display: flex;
      align-items: center;
      gap: var(--ui-voice-picker-item-gap, 16px);
      width: 100%;
      padding: var(--ui-voice-picker-item-padding, 8px 0);
    }

    .voice-avatar {
      position: relative;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--md-sys-color-surface-variant);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      cursor: pointer;
      overflow: hidden;
      color: var(--md-sys-color-on-surface-variant);
      z-index: 2; /* Keep above the menu item ripple */
    }

    .voice-avatar:hover .play-overlay {
      opacity: 1;
    }

    .play-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      opacity: 0;
      transition: opacity 0.2s;
      border-radius: 50%;
    }

    .play-overlay.active {
      opacity: 1;
      background: rgba(0, 0, 0, 0.6);
    }

    .voice-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      overflow: hidden;
    }

    .voice-name {
      font-weight: 500;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--md-sys-color-on-surface);
    }

    .voice-labels {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .label-dot {
      font-size: 8px;
    }

    .empty-state {
      padding: 24px;
      text-align: center;
      color: var(--md-sys-color-on-surface-variant);
      font-size: 14px;
    }
  `; }
    render() {
        const selectedVoice = this.voices.find(v => v[this.idKey] === this.value);
        // Filter voices based on search query
        const filteredVoices = this.voices.filter(voice => {
            if (!this._searchQuery)
                return true;
            const q = this._searchQuery.toLowerCase();
            return (voice[this.titleKey].toLowerCase().includes(q) ||
                voice.labels?.accent?.toLowerCase().includes(q) ||
                voice.labels?.gender?.toLowerCase().includes(q) ||
                voice.labels?.age?.toLowerCase().includes(q));
        });
        return html `
      <!-- Hidden audio player for previews -->
      <audio
        crossorigin="anonymous"
        @ended=${() => (this._previewingVoiceId = undefined)}
        @pause=${() => (this._previewingVoiceId = undefined)}
      ></audio>

      <!-- Anchor Button -->
      <button
        class="anchor-button"
        part="button"
        id="voice-anchor"
        aria-label="Select a voice persona"
        aria-haspopup="menu"
        @click=${this._toggleMenu}
      >
        <div class="trigger-content">
          <div class="trigger-left">
            ${selectedVoice
            ? html `
                  <div
                    class="trigger-icon"
                    style="${this.useOrbs ? 'overflow: hidden;' : ''}"
                  >
                    ${this.useOrbs
                ? html `<ui-orb
                          agentState="listening"
                          .colors="${selectedVoice[this.colorKey] || [
                    '#CADCFC',
                    '#A0B9D1',
                ]}"
                        ></ui-orb>`
                : html `<md-icon style="font-size: 16px;"
                          >record_voice_over</md-icon
                        >`}
                  </div>
                  <span class="trigger-text"
                    >${selectedVoice[this.titleKey] || selectedVoice.name}</span
                  >
                `
            : html `
                  <span
                    class="trigger-text"
                    style="color: var(--md-sys-color-on-surface-variant)"
                    >${this.placeholder}</span
                  >
                `}
          </div>
          <md-icon style="color: var(--md-sys-color-on-surface-variant);"
            >unfold_more</md-icon
          >
        </div>
      </button>

      <!-- Dropdown Menu -->
      <md-menu
        id="voice-menu"
        anchor="voice-anchor"
        positioning="popover"
        aria-label="Voices"
        @closed=${this._handleMenuClosed}
      >
        <!-- The click.stop modifier stops the menu from closing when searching -->
        <div
          class="search-container"
          @click=${(e) => e.stopPropagation()}
        >
          <md-outlined-text-field
            placeholder="Search voices..."
            aria-label="Search available voices"
            .value=${this._searchQuery}
            @input=${(e) => (this._searchQuery = e.target.value)}
          >
            <md-icon slot="leading-icon">search</md-icon>
          </md-outlined-text-field>
        </div>

        ${filteredVoices.length === 0
            ? html ` <div class="empty-state">No voice found.</div> `
            : filteredVoices.map(voice => html `
                <md-menu-item
                  @click=${() => this._selectVoice(voice[this.idKey])}
                  ?selected=${this.value === voice[this.idKey]}
                >
                  <div slot="headline" class="voice-item-content">
                    <!-- Avatar / Preview Button -->
                    <div
                      class="voice-avatar"
                      aria-label="Preview ${voice[this.titleKey]} voice"
                      role="button"
                      @click=${(e) => this._togglePreview(e, voice)}
                    >
                      ${this.useOrbs
                ? html `<ui-orb
                            agentState="${this._previewingVoiceId ===
                    voice[this.idKey]
                    ? 'talking'
                    : 'listening'}"
                            .colors="${voice[this.colorKey] || [
                    '#CADCFC',
                    '#A0B9D1',
                ]}"
                          ></ui-orb>`
                : html `<md-icon style="font-size: 18px;"
                            >face</md-icon
                          >`}
                      ${voice[this.previewUrlKey]
                ? html `
                            <div
                              class="play-overlay ${this._previewingVoiceId ===
                    voice[this.idKey]
                    ? 'active'
                    : ''}"
                            >
                              <md-icon style="font-size: 16px;">
                                ${this._previewingVoiceId === voice[this.idKey]
                    ? 'pause'
                    : 'play_arrow'}
                              </md-icon>
                            </div>
                          `
                : ''}
                    </div>

                    <!-- Voice Info -->
                    <div class="voice-info">
                      <span class="voice-name">${voice[this.titleKey]}</span>
                      ${voice[this.subtitleKey] || voice.labels
                ? html `
                            <div class="voice-labels">
                              ${voice[this.subtitleKey]
                    ? html `<span class="voice-badge"
                                    >${voice[this.subtitleKey]}</span
                                  >`
                    : Object.values(voice.labels || {})
                        .filter(Boolean)
                        .map(label => html `<span class="voice-badge"
                                          >${label}</span
                                        >`)}
                            </div>
                          `
                : ''}
                    </div>
                  </div>

                  ${this.value === voice[this.idKey]
                ? html `<md-icon slot="end">check</md-icon>`
                : ''}
                </md-menu-item>
              `)}
      </md-menu>
    `;
    }
    _toggleMenu() {
        if (this._menuEl) {
            this._menuEl.open = !this._menuEl.open;
        }
    }
    _handleMenuClosed() {
        this._stopPreview();
        // Intentionally not resetting the search query so it stays filtered next time you open
    }
    _selectVoice(voiceId) {
        this.value = voiceId;
        this.dispatchEvent(new CustomEvent('voice-change', {
            detail: { voiceId },
            bubbles: true,
            composed: true,
        }));
    }
    _togglePreview(e, voice) {
        // Prevent the menu item from closing the menu
        e.stopPropagation();
        e.preventDefault();
        if (!voice[this.previewUrlKey] || !this._audioEl)
            return;
        if (this._previewingVoiceId === voice[this.idKey]) {
            this._stopPreview();
        }
        else {
            this._audioEl.src = voice[this.previewUrlKey];
            this._audioEl.play().catch(console.error);
            this._previewingVoiceId = voice[this.idKey];
        }
    }
    _stopPreview() {
        if (this._audioEl) {
            this._audioEl.pause();
            this._audioEl.currentTime = 0;
        }
        this._previewingVoiceId = undefined;
    }
};
__decorate([
    property({ type: Array })
], UiVoicePicker.prototype, "voices", void 0);
__decorate([
    property({ type: String })
], UiVoicePicker.prototype, "value", void 0);
__decorate([
    property({ type: String })
], UiVoicePicker.prototype, "placeholder", void 0);
__decorate([
    property({ type: String })
], UiVoicePicker.prototype, "idKey", void 0);
__decorate([
    property({ type: String })
], UiVoicePicker.prototype, "titleKey", void 0);
__decorate([
    property({ type: String })
], UiVoicePicker.prototype, "subtitleKey", void 0);
__decorate([
    property({ type: String })
], UiVoicePicker.prototype, "previewUrlKey", void 0);
__decorate([
    property({ type: Boolean })
], UiVoicePicker.prototype, "useOrbs", void 0);
__decorate([
    property({ type: String })
], UiVoicePicker.prototype, "colorKey", void 0);
__decorate([
    state()
], UiVoicePicker.prototype, "_searchQuery", void 0);
__decorate([
    state()
], UiVoicePicker.prototype, "_previewingVoiceId", void 0);
__decorate([
    query('md-menu')
], UiVoicePicker.prototype, "_menuEl", void 0);
__decorate([
    query('audio')
], UiVoicePicker.prototype, "_audioEl", void 0);
UiVoicePicker = __decorate([
    customElement('ui-voice-picker')
], UiVoicePicker);
export { UiVoicePicker };
//# sourceMappingURL=ui-voice-picker.js.map