/**
 * Copyright 2026 Google LLC
 */
import { LitElement } from 'lit';
import { type AudioPlayerState } from '../../utils/audio-context.js';
import '@material/web/icon/icon.js';
/**
 * An atomic component that displays a visual error indicator and message
 * when the audio player encounters a resource loading or playback error.
 *
 * @element ui-audio-player-error
 */
export declare class UiAudioPlayerError extends LitElement {
    playerState?: AudioPlayerState;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
