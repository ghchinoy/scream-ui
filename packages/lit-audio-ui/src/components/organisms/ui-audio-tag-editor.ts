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

import {LitElement, html, css, nothing} from 'lit';
import {customElement, property, state, query} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

// --- LEXICON ---
export interface AudioTag {
  id: string;
  label: string;
  category: 'Non-Speech' | 'Style' | 'Vocalized' | 'Pacing';
  description: string;
}

export const AUDIO_TAGS: AudioTag[] = [
  {id: 'sigh', label: '[sigh]', category: 'Non-Speech', description: 'Inserts a sigh sound.'},
  {id: 'laughing', label: '[laughing]', category: 'Non-Speech', description: 'Inserts a laugh.'},
  {id: 'uhm', label: '[uhm]', category: 'Non-Speech', description: 'Inserts a hesitation sound.'},
  {id: 'sarcasm', label: '[sarcasm]', category: 'Style', description: 'Sarcastic tone on subsequent phrase.'},
  {id: 'robotic', label: '[robotic]', category: 'Style', description: 'Makes subsequent speech sound robotic.'},
  {id: 'shouting', label: '[shouting]', category: 'Style', description: 'Increases volume.'},
  {id: 'whispering', label: '[whispering]', category: 'Style', description: 'Decreases volume.'},
  {id: 'extremely fast', label: '[extremely fast]', category: 'Style', description: 'Increases speed.'},
  {id: 'scared', label: '[scared]', category: 'Vocalized', description: 'Word is spoken; scared tone.'},
  {id: 'curious', label: '[curious]', category: 'Vocalized', description: 'Word is spoken; curious tone.'},
  {id: 'bored', label: '[bored]', category: 'Vocalized', description: 'Word is spoken; bored delivery.'},
  {id: 'short pause', label: '[short pause]', category: 'Pacing', description: '~250ms pause.'},
  {id: 'medium pause', label: '[medium pause]', category: 'Pacing', description: '~500ms pause.'},
  {id: 'long pause', label: '[long pause]', category: 'Pacing', description: '~1000ms pause.'},
];

@customElement('ui-audio-tag-editor')
export class UiAudioTagEditor extends LitElement {
  @property({type: String}) value = '';
  @property({type: String}) placeholder = 'Type here... Use [ to add tags.';

  @state() private _isSuggesting = false;
  @state() private _suggestionQuery = '';
  @state() private _cursorIndex = 0;
  @state() private _selectedIndex = 0;

  @query('textarea') private _textarea!: HTMLTextAreaElement;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      position: relative;
      font-family: var(--md-sys-typescale-body-large-font-family-name, inherit);
    }

    .editor-wrapper {
      position: relative;
      width: 100%;
      min-height: 120px;
      background: var(--md-sys-color-surface-container-low);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 12px;
      box-sizing: border-box;
      transition: all 0.2s ease;
      cursor: text;
      overflow: hidden;
    }

    .editor-wrapper:focus-within {
      border-color: var(--md-sys-color-primary);
      box-shadow: 0 0 0 2px var(--md-sys-color-primary-container);
    }

    /* 
     * CRITICAL: The background layer and the textarea must have exactly 
     * the same box model, typography, and whitespace handling.
     */
    .shared-text-styles {
      margin: 0;
      padding: 16px;
      font-family: inherit;
      font-size: 16px;
      line-height: 1.5;
      letter-spacing: normal;
      word-wrap: break-word;
      white-space: pre-wrap;
      box-sizing: border-box;
      width: 100%;
      min-height: 100%;
      border: none;
      outline: none;
    }

    .background-layer {
      color: var(--md-sys-color-on-surface);
      pointer-events: none; /* Let clicks pass through to textarea */
      overflow: hidden; /* Important for scroll syncing */
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .foreground-textarea {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      resize: vertical;
      /* The Illusion: Make text transparent, but keep the caret visible */
      color: transparent;
      background: transparent;
      caret-color: var(--md-sys-color-primary);
    }

    .foreground-textarea::placeholder {
      color: var(--md-sys-color-on-surface-variant);
      opacity: 0.6;
    }

    /* Tag Styling */
    .tag-pill {
      color: var(--md-sys-color-on-secondary-container);
      background-color: var(--md-sys-color-secondary-container);
      /* Use box-shadow instead of padding to avoid changing the text width */
      box-shadow: 0 0 0 2px var(--md-sys-color-secondary-container);
      border-radius: 2px;
    }

    .tag-pill.category-non-speech {
      background-color: var(--md-sys-color-tertiary-container);
      color: var(--md-sys-color-on-tertiary-container);
      box-shadow: 0 0 0 2px var(--md-sys-color-tertiary-container);
    }
    
    .tag-pill.category-pacing {
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      box-shadow: 0 0 0 2px var(--md-sys-color-surface-variant);
    }

    .tag-pill.category-custom {
      background-color: var(--md-sys-color-surface-container-highest);
      color: var(--md-sys-color-on-surface);
      box-shadow: 0 0 0 2px var(--md-sys-color-surface-container-highest);
      border: 1px dashed var(--md-sys-color-outline);
    }

    /* Suggestions Menu */
    .suggestions-menu {
      position: absolute;
      bottom: 100%;
      left: 0;
      z-index: 10;
      margin-bottom: 8px;
      background: var(--md-sys-color-surface-container-high);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 8px;
      box-shadow: var(--md-sys-elevation-3);
      max-height: 250px;
      overflow-y: auto;
      width: max-content;
      min-width: 250px;
      display: flex;
      flex-direction: column;
      padding: 4px 0;
    }

    .suggestion-item {
      padding: 8px 16px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .suggestion-item:hover,
    .suggestion-item.selected {
      background: var(--md-sys-color-secondary-container);
    }

    .suggestion-label {
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      font-size: 14px;
    }

    .suggestion-desc {
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant);
    }
    
    .suggestion-category {
       font-size: 10px;
       text-transform: uppercase;
       letter-spacing: 0.5px;
       color: var(--md-sys-color-primary);
    }
  `;

  render() {
    return html`<div class="editor-wrapper"><div class="background-layer shared-text-styles" aria-hidden="true">${this._renderBackground()}</div><textarea class="foreground-textarea shared-text-styles" .value=${this.value} placeholder=${this.placeholder} @input=${this._handleInput} @keydown=${this._handleKeyDown} @click=${this._updateCursor} @keyup=${this._updateCursor} @scroll=${this._handleScroll} spellcheck="false"></textarea></div>${this._renderSuggestions()}`;
  }

  private _renderBackground() {
    if (!this.value) {
        // Render a zero-width space or break so the container doesn't collapse
        return html`<br>`;
    }
    
    // Split by brackets, keeping the brackets. 
    // e.g. "Hi [sigh] there" -> ["Hi ", "[sigh]", " there"]
    const parts = this.value.split(/(\[.*?\])/g);
    
    const renderedParts = parts.map(part => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const innerText = part.slice(1, -1).toLowerCase();
        // Check if it's a known tag
        const tag = AUDIO_TAGS.find(t => t.id === innerText);
        if (tag) {
           const classes = {
               'tag-pill': true,
               'category-non-speech': tag.category === 'Non-Speech',
               'category-pacing': tag.category === 'Pacing',
               'category-style': tag.category === 'Style',
               'category-vocalized': tag.category === 'Vocalized',
           };
           return html`<span class=${classMap(classes)}>${part}</span>`;
        }
        // Custom tag
        return html`<span class="tag-pill category-custom">${part}</span>`;
      }
      // Regular text (ensure spaces are preserved)
      return html`<span>${part}</span>`;
    });

    // Add an extra <br> if the value ends with a newline to ensure the div height matches the textarea
    if (this.value.endsWith('\n')) {
        renderedParts.push(html`<br>`);
    }

    return renderedParts;
  }

  private _handleScroll(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    const bg = this.shadowRoot?.querySelector('.background-layer') as HTMLElement;
    if (bg) {
        bg.scrollTop = target.scrollTop;
        bg.scrollLeft = target.scrollLeft;
    }
  }

  private _renderSuggestions() {
    if (!this._isSuggesting) return nothing;

    const filteredTags = this._getFilteredTags();
    if (filteredTags.length === 0) return nothing;

    return html`
      <div class="suggestions-menu">
        ${filteredTags.map(
          (tag, index) => html`
            <div
              class="suggestion-item ${index === this._selectedIndex ? 'selected' : ''}"
              @click=${() => this._insertTag(tag.label)}
            >
              <div style="display: flex; justify-content: space-between; align-items: center;">
                 <span class="suggestion-label">${tag.label}</span>
                 <span class="suggestion-category">${tag.category}</span>
              </div>
              <span class="suggestion-desc">${tag.description}</span>
            </div>
          `
        )}
      </div>
    `;
  }

  private _getFilteredTags() {
    const query = this._suggestionQuery.toLowerCase();
    return AUDIO_TAGS.filter((tag) =>
      tag.label.toLowerCase().includes(query) || tag.id.includes(query)
    );
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;
    this._updateCursor();
    
    this._checkForTrigger();
    
    this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
    }));
  }

  private _updateCursor() {
      if (this._textarea) {
          this._cursorIndex = this._textarea.selectionStart;
      }
  }

  private _checkForTrigger() {
    if (this._cursorIndex === 0) {
      this._closeSuggestions();
      return;
    }

    // Look backward from the cursor to find the start of a tag '['
    const textBeforeCursor = this.value.slice(0, this._cursorIndex);
    const lastOpenBracket = textBeforeCursor.lastIndexOf('[');
    const lastCloseBracket = textBeforeCursor.lastIndexOf(']');

    // If we found an open bracket and no close bracket after it, we are typing a tag
    if (lastOpenBracket !== -1 && lastOpenBracket > lastCloseBracket) {
      this._isSuggesting = true;
      this._suggestionQuery = textBeforeCursor.slice(lastOpenBracket + 1); // everything after '['
      
      // Reset selection if query changed, or ensure it's in bounds
      const filtered = this._getFilteredTags();
      if (this._selectedIndex >= filtered.length) {
          this._selectedIndex = Math.max(0, filtered.length - 1);
      }
    } else {
      this._closeSuggestions();
    }
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (!this._isSuggesting) return;

    const filteredTags = this._getFilteredTags();
    if (filteredTags.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this._selectedIndex = (this._selectedIndex + 1) % filteredTags.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._selectedIndex = (this._selectedIndex - 1 + filteredTags.length) % filteredTags.length;
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        this._insertTag(filteredTags[this._selectedIndex].label);
        break;
      case 'Escape':
        this._closeSuggestions();
        break;
    }
  }

  private _insertTag(fullTagLabel: string) {
    const textBeforeCursor = this.value.slice(0, this._cursorIndex);
    const textAfterCursor = this.value.slice(this._cursorIndex);
    
    const lastOpenBracket = textBeforeCursor.lastIndexOf('[');
    
    if (lastOpenBracket !== -1) {
        const newTextBefore = textBeforeCursor.slice(0, lastOpenBracket);
        
        this.value = newTextBefore + fullTagLabel + ' ' + textAfterCursor;
        
        // Move cursor to after the inserted tag and the space
        const newCursorPos = newTextBefore.length + fullTagLabel.length + 1;
        
        // Wait for render before setting selection
        this.updateComplete.then(() => {
             this._textarea.focus();
             this._textarea.setSelectionRange(newCursorPos, newCursorPos);
             this._updateCursor();
        });
        
        this.dispatchEvent(new CustomEvent('change', {
            detail: { value: this.value },
            bubbles: true,
            composed: true
        }));
    }
    
    this._closeSuggestions();
  }

  private _closeSuggestions() {
    this._isSuggesting = false;
    this._suggestionQuery = '';
    this._selectedIndex = 0;
  }
}
