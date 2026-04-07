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
import {
  prepareRichInline,
  walkRichInlineLineRanges,
  materializeRichInlineLineRange,
  RichInlineItem,
  PreparedRichInline
} from '@chenglou/pretext/rich-inline';

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
  
  @state() private _suggestionPos = { x: 0, y: 0 };

  @query('textarea') private _textarea!: HTMLTextAreaElement;
  @query('canvas') private _canvas!: HTMLCanvasElement;

  private _resizeObserver: ResizeObserver | null = null;
  private _computedFont = '16px system-ui';
  private _computedColor = '#000000';
  private _lineHeight = 24;
  private _padding = 16;
  
  private _items: RichInlineItem[] = [];
  private _prepared: PreparedRichInline | null = null;
  
  // Theme colors parsed once
  private _themeColors: Record<string, {bg: string, fg: string}> = {
    'Non-Speech': { bg: '#c8e6c9', fg: '#003300' }, // fallback greens
    'Style': { bg: '#bbdefb', fg: '#002266' },      // fallback blues
    'Pacing': { bg: '#e0e0e0', fg: '#333333' },     // fallback grays
    'Vocalized': { bg: '#ffe0b2', fg: '#660000' },  // fallback reds
    'Custom': { bg: '#f5f5f5', fg: '#000000' }      // fallback light gray
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      position: relative;
      font-family: var(--md-sys-typescale-body-large-font-family-name, system-ui);
    }

    .editor-wrapper {
      position: relative;
      width: 100%;
      min-height: 120px;
      background: var(--md-sys-color-surface-container-low, #f4f4f4);
      border: 1px solid var(--md-sys-color-outline-variant, #ccc);
      border-radius: 12px;
      box-sizing: border-box;
      transition: all 0.2s ease;
      cursor: text;
      overflow: hidden;
    }

    .editor-wrapper:focus-within {
      border-color: var(--md-sys-color-primary, #0066cc);
      box-shadow: 0 0 0 2px var(--md-sys-color-primary-container, #cce0ff);
    }

    .shared-text-styles {
      margin: 0;
      padding: 16px;
      font-family: inherit;
      font-size: 16px;
      line-height: 1.5;
      letter-spacing: normal;
      text-align: left;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
    }

    .background-canvas {
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none; /* Let clicks pass through */
      z-index: 1;
    }

    .foreground-textarea {
      position: absolute;
      top: 0;
      left: 0;
      resize: vertical;
      /* Make text transparent to reveal canvas beneath */
      color: transparent;
      background: transparent;
      caret-color: var(--md-sys-color-primary, #0066cc);
      z-index: 2;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .foreground-textarea::placeholder {
      color: var(--md-sys-color-on-surface-variant, #666);
      opacity: 0.6;
    }

    /* Suggestions Menu */
    .suggestions-menu {
      position: absolute;
      z-index: 10;
      background: var(--md-sys-color-surface-container-high, #fff);
      border: 1px solid var(--md-sys-color-outline-variant, #ddd);
      border-radius: 8px;
      box-shadow: var(--md-sys-elevation-3, 0 4px 6px rgba(0,0,0,0.1));
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
      background: var(--md-sys-color-secondary-container, #e6f0fa);
    }

    .suggestion-label {
      font-weight: 600;
      color: var(--md-sys-color-on-surface, #000);
      font-size: 14px;
    }

    .suggestion-desc {
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant, #666);
    }
    
    .suggestion-category {
       font-size: 10px;
       text-transform: uppercase;
       letter-spacing: 0.5px;
       color: var(--md-sys-color-primary, #0066cc);
    }
  `;

  render() {
    return html`<div class="editor-wrapper"><canvas class="background-canvas"></canvas><textarea class="foreground-textarea shared-text-styles" .value=${this.value} placeholder=${this.placeholder} @input=${this._handleInput} @keydown=${this._handleKeyDown} @click=${this._updateCursor} @keyup=${this._updateCursor} @scroll=${this._triggerRender} spellcheck="false"></textarea></div>${this._renderSuggestions()}`;
  }
  
  firstUpdated() {
    this._parseThemeColors();
    
    // Extract exact computed font details for Pretext measurement
    const computed = window.getComputedStyle(this._textarea);
    const hostComputed = window.getComputedStyle(this);
    this._computedFont = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
    this._computedColor = hostComputed.color;
    this._lineHeight = parseFloat(computed.lineHeight) || 24;
    this._padding = parseFloat(computed.paddingTop) || 16;
    
    this._resizeObserver = new ResizeObserver(() => this._triggerRender());
    this._resizeObserver.observe(this._textarea);
    
    this._parseValue();
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  private _parseThemeColors() {
    // Attempt to grab colors from CSS variables on the host element
    const computed = window.getComputedStyle(this);
    
    const getVar = (name: string, fallback: string) => {
        const val = computed.getPropertyValue(name).trim();
        return val || fallback;
    };
    
    this._themeColors['Non-Speech'] = { 
        bg: getVar('--md-sys-color-tertiary-container', '#c8e6c9'),
        fg: getVar('--md-sys-color-on-tertiary-container', '#003300')
    };
    this._themeColors['Style'] = { 
        bg: getVar('--md-sys-color-secondary-container', '#bbdefb'),
        fg: getVar('--md-sys-color-on-secondary-container', '#002266')
    };
    this._themeColors['Pacing'] = { 
        bg: getVar('--md-sys-color-surface-variant', '#e0e0e0'),
        fg: getVar('--md-sys-color-on-surface-variant', '#333333')
    };
    this._themeColors['Vocalized'] = { 
        bg: getVar('--md-sys-color-error-container', '#ffe0b2'),
        fg: getVar('--md-sys-color-on-error-container', '#660000')
    };
    this._themeColors['Custom'] = { 
        bg: getVar('--md-sys-color-surface-container-highest', '#f5f5f5'),
        fg: getVar('--md-sys-color-on-surface', '#000000')
    };
  }

  private _parseValue() {
    const parts = this.value.split(/(\[.*?\])/g);
    this._items = [];
    
    for (const part of parts) {
      if (!part) continue;
      
      if (part.startsWith('[') && part.endsWith(']')) {
        // Tags must not have extraWidth or break constraints, otherwise Pretext drifts from textarea
        this._items.push({
            text: part,
            font: this._computedFont
        });
      } else {
        // Normal text
        this._items.push({
            text: part,
            font: this._computedFont
        });
      }
    }
    
    // Prepare the Pretext layout engine with the parsed items
    this._prepared = prepareRichInline(this._items);
    this._triggerRender();
  }

  private _triggerRender() {
    requestAnimationFrame(() => this._renderCanvas());
  }

  private _renderCanvas() {
    if (!this._canvas || !this._textarea || !this._prepared) return;
    
    // Refresh theme colors on each render to support dynamic dark-mode toggling
    this._parseThemeColors();
    this._computedColor = window.getComputedStyle(this).color;
    
    const ctx = this._canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = this._textarea.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    
    const dpr = window.devicePixelRatio || 1;
    this._canvas.width = rect.width * dpr;
    this._canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // The available width for text to wrap
    const layoutWidth = rect.width - (this._padding * 2);
    
    // Offset rendering by padding and textarea scroll position
    ctx.translate(this._padding - this._textarea.scrollLeft, this._padding - this._textarea.scrollTop);
    
    // Canvas textBaseline aligns top of font to Y.
    // Tweak to align natively with Textarea baseline
    ctx.textBaseline = 'top';
    const textYOffset = 2; // Magic number offset to align Canvas text with Textarea text
    
    let y = 0;
    
    // Calculate cursor drop-down pos while we walk the layout
    let currentGlobalStrIndex = 0;
    
    // Walk through the Pretext computed layout lines
    walkRichInlineLineRanges(this._prepared, layoutWidth, (range) => {
      const line = materializeRichInlineLineRange(this._prepared!, range);
      let x = 0;
      
      for (const frag of line.fragments) {
        x += frag.gapBefore;
        
        // Track coordinate for Autocomplete
        if (this._isSuggesting && this._cursorIndex >= currentGlobalStrIndex && this._cursorIndex <= currentGlobalStrIndex + frag.text.length) {
            const localIndex = this._cursorIndex - currentGlobalStrIndex;
            ctx.font = this._computedFont;
            const subWidth = ctx.measureText(frag.text.substring(0, localIndex)).width;
            
            this._suggestionPos = {
                x: x + subWidth - this._textarea.scrollLeft,
                y: y + this._lineHeight - this._textarea.scrollTop
            };
        }
        
        currentGlobalStrIndex += frag.text.length;
        
        const item = this._items[frag.itemIndex];
        const isTag = frag.text.startsWith('[') && frag.text.endsWith(']');
        
        if (isTag) {
            const innerText = frag.text.slice(1, -1).toLowerCase();
            const tag = AUDIO_TAGS.find(t => t.id === innerText);
            const category = tag ? tag.category : 'Custom';
            const colors = this._themeColors[category];
            
            // Draw Pill Background
            ctx.fillStyle = colors.bg;
            
            // polyfill for roundRect (Safari < 16 doesn't have it)
            if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(x - 2, y + 2, frag.occupiedWidth + 4, this._lineHeight - 4, 4);
                ctx.fill();
                if (category === 'Custom') {
                    ctx.strokeStyle = this._themeColors['Pacing'].fg;
                    ctx.setLineDash([2, 2]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            } else {
                ctx.fillRect(x - 2, y + 2, frag.occupiedWidth + 4, this._lineHeight - 4);
            }
            
            // Draw Pill Text
            ctx.fillStyle = colors.fg;
            ctx.font = item.font;
            ctx.fillText(frag.text, x, y + textYOffset);
            
        } else {
            // Draw Regular Text
            ctx.fillStyle = this._computedColor;
            ctx.font = item.font;
            ctx.fillText(frag.text, x, y + textYOffset);
        }
        
        x += frag.occupiedWidth;
      }
      y += this._lineHeight;
    });
  }

  private _renderSuggestions() {
    if (!this._isSuggesting) return nothing;

    const filteredTags = this._getFilteredTags();
    if (filteredTags.length === 0) return nothing;

    return html`
      <div class="suggestions-menu" style="left: ${this._padding + this._suggestionPos.x}px; top: ${this._padding + this._suggestionPos.y + 4}px;">
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
    this._parseValue();
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
          this._triggerRender(); // Re-calculate suggestion dropdown position
      }
  }

  private _checkForTrigger() {
    if (this._cursorIndex === 0) {
      this._closeSuggestions();
      return;
    }

    const textBeforeCursor = this.value.slice(0, this._cursorIndex);
    const lastOpenBracket = textBeforeCursor.lastIndexOf('[');
    const lastCloseBracket = textBeforeCursor.lastIndexOf(']');

    if (lastOpenBracket !== -1 && lastOpenBracket > lastCloseBracket) {
      this._isSuggesting = true;
      this._suggestionQuery = textBeforeCursor.slice(lastOpenBracket + 1);
      
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
        
        const newCursorPos = newTextBefore.length + fullTagLabel.length + 1;
        
        this.updateComplete.then(() => {
             this._textarea.focus();
             this._textarea.setSelectionRange(newCursorPos, newCursorPos);
             this._updateCursor();
             this._parseValue();
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
