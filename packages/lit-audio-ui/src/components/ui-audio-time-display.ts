import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { audioPlayerContext, type AudioPlayerState } from '../utils/audio-context';

@customElement('ui-audio-time-display')
export class UiAudioTimeDisplay extends LitElement {
  @consume({ context: audioPlayerContext, subscribe: true })
  @property({ attribute: false })
  public playerState?: AudioPlayerState;

  @property({ type: String }) format: 'elapsed' | 'remaining' | 'full' = 'full';

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
      // 'full'
      return html`${this._formatTime(current)} / ${total ? this._formatTime(total) : '--:--'}`;
    }
  }

  private _formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    let result = '';
    if (hrs > 0) {
      result += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }
    result += '' + mins + ':' + (secs < 10 ? '0' : '');
    result += '' + secs;
    return result;
  }
}
