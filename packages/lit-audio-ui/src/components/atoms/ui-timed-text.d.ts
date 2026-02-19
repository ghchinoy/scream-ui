/**
 * Copyright 2026 Google LLC
 */
import { LitElement } from 'lit';
import { type AudioPlayerState } from '../../utils/audio-context.js';
/**
 * ATOM: Timed Text
 * Renders a transcript with word-level highlighting synchronized to audio playback.
 * Consumes AudioPlayerState for timing and transcript data.
 *
 * @element ui-timed-text
 */
export declare class UiTimedText extends LitElement {
    playerState?: AudioPlayerState;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    private _renderWord;
}
