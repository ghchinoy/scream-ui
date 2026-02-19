import { LitElement } from 'lit';
import { type AudioPlayerState } from '../../utils/audio-context.js';
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
export declare class UiAudioTimeDisplay extends LitElement {
    playerState?: AudioPlayerState;
    format: 'elapsed' | 'remaining' | 'combined';
    separator: string;
    compact: boolean;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    private _formatTime;
}
