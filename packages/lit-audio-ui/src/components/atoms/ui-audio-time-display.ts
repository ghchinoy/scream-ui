import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {consume} from '@lit/context';
import {
  audioPlayerContext,
  type AudioPlayerState,
} from '../../utils/audio-context';

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
@customElement('ui-audio-time-display')
export class UiAudioTimeDisplay extends LitElement {
  @consume({context: audioPlayerContext, subscribe: true})
  @property({attribute: false})
  public playerState?: AudioPlayerState;

  @property({type: String}) format: 'elapsed' | 'remaining' | 'combined' =
    'combined';

  @property({type: String}) separator = ' / ';
  @property({type: Boolean}) compact = false;

  static styles = css`
    :host {
      display: inline-block;
      font-variant-numeric: tabular-nums;
      font-size: 14px;
      color: var(--md-sys-color-on-surface-variant, #444);
      font-family: inherit;
    }
  `;

  render() {
    const current = this.playerState?.currentTime || 0;
    const total = this.playerState?.duration || 0;

    if (this.format === 'elapsed') {
      return html`${this._formatTime(current)}`;
    } else if (this.format === 'remaining') {
      const remain = Math.max(0, total - current);
      return html`-${this._formatTime(remain)}`;
    } else {
      // 'combined'
      return html`${this._formatTime(current)}${this.separator}${
        total ? this._formatTime(total) : '--:--'
      }`;
    }
  }

  private _formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) {
      return this.compact ? '0:00' : '0:00';
    }
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    let result = '';

    if (hrs > 0) {
      result += '' + hrs + ':' + (mins < 10 ? '0' : '');
    } else if (!this.compact) {
      // Show 0:XX if not compact, but we typically want M:SS
    }

    result += '' + mins + ':' + (secs < 10 ? '0' : '');
    result += '' + secs;
    return result;
  }
}
