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
import '@material/web/icon/icon.js';
/**
 * An atomic component that displays a visual error indicator and message
 * when the audio player encounters a resource loading or playback error.
 *
 * @element ui-audio-player-error
 */
let UiAudioPlayerError = class UiAudioPlayerError extends LitElement {
    static { this.styles = css `
    :host {
      display: inline-flex;
      align-items: center;
      color: var(--ui-audio-error-color, var(--md-sys-color-error, #ba1a1a));
      font-size: 12px;
      font-family: inherit;
      gap: 4px;
      animation: fadeIn 0.3s ease forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .error-icon {
      font-size: 18px;
    }

    .error-text {
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `; }
    render() {
        const error = this.playerState?.error;
        if (!error)
            return html ``;
        return html `
      <md-icon class="error-icon">error</md-icon>
      <span class="error-text" title="${error}">${error}</span>
    `;
    }
};
__decorate([
    consume({ context: audioPlayerContext, subscribe: true }),
    property({ attribute: false })
], UiAudioPlayerError.prototype, "playerState", void 0);
UiAudioPlayerError = __decorate([
    customElement('ui-audio-player-error')
], UiAudioPlayerError);
export { UiAudioPlayerError };
//# sourceMappingURL=ui-audio-player-error.js.map