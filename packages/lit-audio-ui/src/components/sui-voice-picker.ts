import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import '@material/web/icon/icon.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/button/outlined-button.js';
import '@material/web/textfield/outlined-text-field.js';
import './sui-live-waveform';

export interface VoiceLabel {
  accent?: string;
  gender?: string;
  age?: string;
  description?: string;
  'use case'?: string;
}

export interface VoiceItem {
  voiceId: string;
  name: string;
  previewUrl?: string;
  labels?: VoiceLabel;
}

/**
 * A native Lit WebComponent that provides a searchable dropdown menu for selecting 
 * a voice persona, matching the React/Radix Command component.
 */
@customElement('sui-voice-picker')
export class SuiVoicePicker extends LitElement {
  @property({ type: Array }) voices: VoiceItem[] = [];
  @property({ type: String }) value?: string;
  @property({ type: String }) placeholder = "Select a voice...";

  @state() private _searchQuery = "";
  
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

    md-outlined-button {
      width: 100%;
      --md-outlined-button-container-shape: 8px;
    }

    .trigger-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
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
      --md-menu-container-color: var(--md-sys-color-surface-container, #f3f3f3);
      max-width: 400px;
    }

    .search-container {
      padding: 8px 12px;
      background: var(--md-sys-color-surface-container, #f3f3f3);
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
    }
    
    md-outlined-text-field {
      width: 100%;
      --md-outlined-text-field-container-shape: 8px;
    }

    md-menu-item {
      --md-menu-item-hover-state-layer-color: var(--md-sys-color-on-surface-variant);
      --md-menu-item-focus-state-layer-color: var(--md-sys-color-on-surface-variant);
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
      background: rgba(0,0,0,0.4);
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
      background: rgba(0,0,0,0.6);
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
    const selectedVoice = this.voices.find(v => v.voiceId === this.value);
    
    // Filter voices based on search query
    const filteredVoices = this.voices.filter(voice => {
      if (!this._searchQuery) return true;
      
      const q = this._searchQuery.toLowerCase();
      return (
        voice.name.toLowerCase().includes(q) ||
        voice.labels?.accent?.toLowerCase().includes(q) ||
        voice.labels?.gender?.toLowerCase().includes(q) ||
        voice.labels?.age?.toLowerCase().includes(q)
      );
    });

    return html`
      <!-- Hidden audio player for previews -->
      <audio 
        @ended=${() => this._previewingVoiceId = undefined}
        @pause=${() => this._previewingVoiceId = undefined}
      ></audio>

      <!-- Anchor Button -->
      <md-outlined-button 
        id="voice-anchor" 
        @click=${this._toggleMenu}
      >
        <div class="trigger-content">
          <div class="trigger-left">
            ${selectedVoice ? html`
              <div class="trigger-icon">
                <md-icon style="font-size: 16px;">record_voice_over</md-icon>
              </div>
              <span class="trigger-text">${selectedVoice.name}</span>
            ` : html`
              <span class="trigger-text" style="color: var(--md-sys-color-on-surface-variant)">${this.placeholder}</span>
            `}
          </div>
          <md-icon style="color: var(--md-sys-color-on-surface-variant);">unfold_more</md-icon>
        </div>
      </md-outlined-button>

      <!-- Dropdown Menu -->
      <md-menu 
        id="voice-menu" 
        anchor="voice-anchor" 
        positioning="popover"
        @closed=${this._handleMenuClosed}
        
      >
        <!-- The click.stop modifier stops the menu from closing when searching -->
        <div class="search-container" @click=${(e: Event) => e.stopPropagation()}>
          <md-outlined-text-field
            placeholder="Search voices..."
            .value=${this._searchQuery}
            @input=${(e: Event) => this._searchQuery = (e.target as HTMLInputElement).value}
          >
            <md-icon slot="leading-icon">search</md-icon>
          </md-outlined-text-field>
        </div>

        ${filteredVoices.length === 0 ? html`
          <div class="empty-state">No voice found.</div>
        ` : filteredVoices.map(voice => html`
          <md-menu-item 
            @click=${() => this._selectVoice(voice.voiceId)}
            ?selected=${this.value === voice.voiceId}
          >
            <div slot="headline" class="voice-item-content">
              
              <!-- Avatar / Preview Button -->
              <div class="voice-avatar" @click=${(e: Event) => this._togglePreview(e, voice)}>
                <md-icon style="font-size: 18px;">face</md-icon>
                ${voice.previewUrl ? html`
                  <div class="play-overlay ${this._previewingVoiceId === voice.voiceId ? 'active' : ''}">
                    <md-icon style="font-size: 16px;">
                      ${this._previewingVoiceId === voice.voiceId ? 'pause' : 'play_arrow'}
                    </md-icon>
                  </div>
                ` : ''}
              </div>

              <!-- Voice Info -->
              <div class="voice-info">
                <span class="voice-name">${voice.name}</span>
                ${voice.labels ? html`
                  <div class="voice-labels">
                    ${voice.labels.accent ? html`<span>${voice.labels.accent}</span>` : ''}
                    ${voice.labels.gender ? html`<span class="label-dot">•</span> <span style="text-transform: capitalize">${voice.labels.gender}</span>` : ''}
                    ${voice.labels.age ? html`<span class="label-dot">•</span> <span style="text-transform: capitalize">${voice.labels.age}</span>` : ''}
                  </div>
                ` : ''}
              </div>
              
            </div>
            
            ${this.value === voice.voiceId ? html`<md-icon slot="end">check</md-icon>` : ''}
          </md-menu-item>
        `)}
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
    this.dispatchEvent(new CustomEvent('voice-change', {
      detail: { voiceId },
      bubbles: true,
      composed: true
    }));
  }

  private _togglePreview(e: Event, voice: VoiceItem) {
    // Prevent the menu item from closing the menu
    e.stopPropagation();
    e.preventDefault();

    if (!voice.previewUrl || !this._audioEl) return;

    if (this._previewingVoiceId === voice.voiceId) {
      this._stopPreview();
    } else {
      this._audioEl.src = voice.previewUrl;
      this._audioEl.play().catch(console.error);
      this._previewingVoiceId = voice.voiceId;
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
