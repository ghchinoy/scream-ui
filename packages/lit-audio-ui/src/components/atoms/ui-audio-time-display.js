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
 * A reactive time display component that shows playback progress.
 * Consumes AudioPlayerState from the nearest ui-audio-provider.
 *
 * @element ui-audio-time-display
 *
 * @prop {string} format - Display mode: 'elapsed', 'remaining', or 'combined' (default).
 * @prop {string} separator - The string to use between current and total time in 'combined' mode (default: ' / ').
 * @prop {boolean} compact - If true, omits leading zeros and hours for a cleaner look.
 */
let UiAudioTimeDisplay = class UiAudioTimeDisplay extends LitElement {
    constructor() {
        super(...arguments);
        this.format = 'combined';
        this.separator = ' / ';
        this.compact = false;
    }
    static { this.styles = css `
    :host {
      display: inline-block;
      font-variant-numeric: tabular-nums;
      font-size: 14px;
      color: var(--md-sys-color-on-surface-variant, #444);
      font-family: inherit;
    }
  `; }
    render() {
        const current = this.playerState?.currentTime || 0;
        const total = this.playerState?.duration || 0;
        if (this.format === 'elapsed') {
            return html `${this._formatTime(current)}`;
        }
        else if (this.format === 'remaining') {
            const remain = Math.max(0, total - current);
            return html `-${this._formatTime(remain)}`;
        }
        else {
            // 'combined'
            return html `${this._formatTime(current)}${this.separator}${total
                ? this._formatTime(total)
                : '--:--'}`;
        }
    }
    _formatTime(seconds) {
        if (!seconds || isNaN(seconds)) {
            return this.compact ? '0:00' : '0:00';
        }
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        let result = '';
        if (hrs > 0) {
            result += '' + hrs + ':' + (mins < 10 ? '0' : '');
        }
        else if (!this.compact) {
            // Show 0:XX if not compact, but we typically want M:SS
        }
        result += '' + mins + ':' + (secs < 10 ? '0' : '');
        result += '' + secs;
        return result;
    }
};
__decorate([
    consume({ context: audioPlayerContext, subscribe: true }),
    property({ attribute: false })
], UiAudioTimeDisplay.prototype, "playerState", void 0);
__decorate([
    property({ type: String })
], UiAudioTimeDisplay.prototype, "format", void 0);
__decorate([
    property({ type: String })
], UiAudioTimeDisplay.prototype, "separator", void 0);
__decorate([
    property({ type: Boolean })
], UiAudioTimeDisplay.prototype, "compact", void 0);
UiAudioTimeDisplay = __decorate([
    customElement('ui-audio-time-display')
], UiAudioTimeDisplay);
export { UiAudioTimeDisplay };
//# sourceMappingURL=ui-audio-time-display.js.map