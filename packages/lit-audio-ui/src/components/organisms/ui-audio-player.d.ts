import { LitElement } from 'lit';
import '../providers/ui-audio-provider.js';
import '../atoms/ui-audio-play-button.js';
import '../atoms/ui-audio-progress-slider.js';
import '../atoms/ui-audio-time-display.js';
import '../atoms/ui-audio-player-error.js';
export interface AudioPlayerItem {
    id: string | number;
    src: string;
}
/**
 * A monolithic backward-compatibility wrapper that renders the classic ElevenLabs
 * pill-shaped audio player. Internally, it relies completely on the new
 * compound <ui-audio-provider> architecture.
 */
export declare class UiAudioPlayer extends LitElement {
    item?: AudioPlayerItem;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
