/**
 * Copyright 2026 Google LLC
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { audioPlayerContext, } from '../../utils/audio-context.js';
/**
 * ATOM: Timed Text
 * Renders a transcript with word-level highlighting synchronized to audio playback.
 * Consumes AudioPlayerState for timing and transcript data.
 *
 * @element ui-timed-text
 */
let UiTimedText = class UiTimedText extends LitElement {
    static { this.styles = css `
    :host {
      display: block;
      font-family: inherit;
      line-height: 1.6;
    }

    .transcript {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 6px;
    }

    .word {
      transition: all 0.2s ease;
      color: var(
        --ui-timed-text-color,
        var(--md-sys-color-on-surface-variant, #444)
      );
      border-radius: 4px;
      padding: 0 2px;
    }

    .word.active {
      color: var(
        --ui-timed-text-active-color,
        var(--md-sys-color-on-secondary-container, #1d192b)
      );
      background: var(
        --ui-timed-text-active-bg,
        var(--md-sys-color-secondary-container, #e8def8)
      );
      transform: scale(1.05);
    }

    .word.past {
      color: var(
        --ui-timed-text-past-color,
        var(--md-sys-color-on-surface, #1e1e1e)
      );
    }
  `; }
    render() {
        const transcript = this.playerState?.transcript || [];
        const currentTime = this.playerState?.currentTime || 0;
        return html `
      <slot></slot>
      ${transcript.length > 0
            ? html `
            <div class="transcript" part="container">
              ${transcript.map(word => this._renderWord(word, currentTime))}
            </div>
          `
            : ''}
    `;
    }
    _renderWord(word, currentTime) {
        const isActive = currentTime >= word.start && currentTime <= word.end;
        const isPast = currentTime > word.end;
        return html `
      <span
        class="word ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}"
        part="word ${isActive ? 'word-active' : ''} ${isPast
            ? 'word-past'
            : ''}"
        >${word.text}</span
      >
    `;
    }
};
__decorate([
    consume({ context: audioPlayerContext, subscribe: true }),
    property({ attribute: false })
], UiTimedText.prototype, "playerState", void 0);
UiTimedText = __decorate([
    customElement('ui-timed-text')
], UiTimedText);
export { UiTimedText };
//# sourceMappingURL=ui-timed-text.js.map