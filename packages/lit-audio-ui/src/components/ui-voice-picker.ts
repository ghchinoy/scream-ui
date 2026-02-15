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
import {customElement, property, state, query} from 'lit/decorators.js';
import '@material/web/icon/icon.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/button/outlined-button.js';
import '@material/web/textfield/outlined-text-field.js';
import './ui-live-waveform';

export interface VoiceLabel {
  accent?: string;
  gender?: string;
  age?: string;
  description?: string;
  'use case'?: string;
}

export interface VoiceItem {
  [key: string]: any; // Allow any extra keys
}

/**
 * A native Lit WebComponent that provides a searchable dropdown menu for selecting
 * a voice persona, matching the React/Radix Command component.
 */
@customElement('ui-voice-picker')
export class UiVoicePicker extends LitElement {
  @property({type: Array}) voices: any[] = []; // Changed to any[] to accept generic data
  @property({type: String}) value?: string;
  @property({type: String}) placeholder = 'Select a voice...';

  // Data mapping keys for generic objects
  @property({type: String}) idKey = 'voiceId';
  @property({type: String}) titleKey = 'name';
  @property({type: String}) subtitleKey = 'category';
  @property({type: String}) previewUrlKey = 'previewUrl';

  // Orb Avatar Config
  @property({type: Boolean}) useOrbs = false;
  @property({type: String}) colorKey = 'colors';

  @state() private _searchQuery = '';

  // Track which voice is currently previewing
  @state() private _previewingVoiceId?: string;

  @query('md-menu') private _menuEl!: any;
  @query('audio') private _audioEl!: HTMLAudioElement;

  static styles = css`
    :host {
      display: inline-block;
      width: 100%;
      font-family: inherit;
    }

    .anchor-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 8px 16px;
      background: var(
        --ui-voice-picker-anchor-bg,
        var(--md-sys-color-surface-container-high, #e2e2e2)
      );
      border: 1px solid var(--md-sys-color-outline-variant, #c4c7c5);
      border-radius: 8px;
      color: var(--md-sys-color-on-surface, #1e1e1e);
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      min-height: 48px;
      transition:
        background-color 0.2s,
        border-color 0.2s;
    }

    .anchor-button:hover {
      background: var(--md-sys-color-surface-container-highest, #e3e3e3);
    }

    .anchor-button:focus-visible {
      outline: none;
      border-color: var(--md-sys-color-primary, #0066cc);
      box-shadow: 0 0 0 1px var(--md-sys-color-primary, #0066cc);
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
      gap: 12px;
      overflow: hidden;
    }

    .trigger-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--md-sys-color-primary-container, #d1e4ff);
      color: var(--md-sys-color-on-primary-container, #001d36);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .trigger-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--md-sys-color-on-surface, #1e1e1e);
    }

    md-menu {
      --md-menu-container-shape: 12px;
      --md-menu-container-color: var(
        --md-sys-color-surface-container,
        var(--md-sys-color-surface, #f3f3f3)
      );
      max-width: 400px;
      font-family: inherit;
    }

    .search-container {
      padding: 8px 12px;
      background: var(--md-sys-color-surface-container, #f3f3f3);
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      font-family: inherit;
    }

    md-outlined-text-field {
      width: 100%;
      --md-outlined-text-field-container-shape: 8px;
      font-family: inherit;
    }

    md-menu-item {
      --md-menu-item-hover-state-layer-color: var(
        --md-sys-color-on-surface-variant
      );
      --md-menu-item-focus-state-layer-color: var(
        --md-sys-color-on-surface-variant
      );
      --md-menu-item-label-text-color: var(--md-sys-color-on-surface);
      font-family: inherit;
    }

    .voice-item-content {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
      padding: 8px 0;
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
  `;

  render() {
    const selectedVoice = this.voices.find(v => v[this.idKey] === this.value);

    // Filter voices based on search query
    const filteredVoices = this.voices.filter(voice => {
      if (!this._searchQuery) return true;

      const q = this._searchQuery.toLowerCase();
      return (
        voice[this.titleKey].toLowerCase().includes(q) ||
        voice.labels?.accent?.toLowerCase().includes(q) ||
        voice.labels?.gender?.toLowerCase().includes(q) ||
        voice.labels?.age?.toLowerCase().includes(q)
      );
    });

    return html`
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
        @click=${this._toggleMenu}
      >
        <div class="trigger-content">
          <div class="trigger-left">
            ${selectedVoice
              ? html`
                  <div
                    class="trigger-icon"
                    style="${this.useOrbs ? 'overflow: hidden;' : ''}"
                  >
                    ${this.useOrbs
                      ? html`<ui-orb
                          agentState="listening"
                          .colors="${selectedVoice[this.colorKey] || [
                            '#CADCFC',
                            '#A0B9D1',
                          ]}"
                        ></ui-orb>`
                      : html`<md-icon style="font-size: 16px;"
                          >record_voice_over</md-icon
                        >`}
                  </div>
                  <span class="trigger-text"
                    >${selectedVoice[this.titleKey] || selectedVoice.name}</span
                  >
                `
              : html`
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
        positioning="fixed"
        @closed=${this._handleMenuClosed}
      >
        <!-- The click.stop modifier stops the menu from closing when searching -->
        <div
          class="search-container"
          @click=${(e: Event) => e.stopPropagation()}
        >
          <md-outlined-text-field
            placeholder="Search voices..."
            .value=${this._searchQuery}
            @input=${(e: Event) =>
              (this._searchQuery = (e.target as HTMLInputElement).value)}
          >
            <md-icon slot="leading-icon">search</md-icon>
          </md-outlined-text-field>
        </div>

        ${filteredVoices.length === 0
          ? html` <div class="empty-state">No voice found.</div> `
          : filteredVoices.map(
              voice => html`
                <md-menu-item
                  @click=${() => this._selectVoice(voice[this.idKey])}
                  ?selected=${this.value === voice[this.idKey]}
                >
                  <div slot="headline" class="voice-item-content">
                    <!-- Avatar / Preview Button -->
                    <div
                      class="voice-avatar"
                      @click=${(e: Event) => this._togglePreview(e, voice)}
                    >
                      ${this.useOrbs
                        ? html`<ui-orb
                            agentState="${this._previewingVoiceId ===
                            voice[this.idKey]
                              ? 'talking'
                              : 'listening'}"
                            .colors="${voice[this.colorKey] || [
                              '#CADCFC',
                              '#A0B9D1',
                            ]}"
                          ></ui-orb>`
                        : html`<md-icon style="font-size: 18px;"
                            >face</md-icon
                          >`}
                      ${voice[this.previewUrlKey]
                        ? html`
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
                        ? html`
                            <div class="voice-labels">
                              ${voice[this.subtitleKey]
                                ? html`<span class="voice-badge"
                                    >${voice[this.subtitleKey]}</span
                                  >`
                                : Object.values(voice.labels || {})
                                    .filter(Boolean)
                                    .map(
                                      label =>
                                        html`<span class="voice-badge"
                                          >${label}</span
                                        >`,
                                    )}
                            </div>
                          `
                        : ''}
                    </div>
                  </div>

                  ${this.value === voice[this.idKey]
                    ? html`<md-icon slot="end">check</md-icon>`
                    : ''}
                </md-menu-item>
              `,
            )}
      </md-menu>
    `;
  }

  private _toggleMenu() {
    if (this._menuEl) {
      this._menuEl.open = !this._menuEl.open;
    }
  }

  private _handleMenuClosed() {
    this._stopPreview();
    // Intentionally not resetting the search query so it stays filtered next time you open
  }

  private _selectVoice(voiceId: string) {
    this.value = voiceId;
    this.dispatchEvent(
      new CustomEvent('voice-change', {
        detail: {voiceId},
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _togglePreview(e: Event, voice: VoiceItem) {
    // Prevent the menu item from closing the menu
    e.stopPropagation();
    e.preventDefault();

    if (!voice[this.previewUrlKey] || !this._audioEl) return;

    if (this._previewingVoiceId === voice[this.idKey]) {
      this._stopPreview();
    } else {
      this._audioEl.src = voice[this.previewUrlKey];
      this._audioEl.play().catch(console.error);
      this._previewingVoiceId = voice[this.idKey];
    }
  }

  private _stopPreview() {
    if (this._audioEl) {
      this._audioEl.pause();
      this._audioEl.currentTime = 0;
    }
    this._previewingVoiceId = undefined;
  }
}
