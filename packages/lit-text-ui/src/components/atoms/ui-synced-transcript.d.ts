/**
 * Copyright 2026 Google LLC
 */
import { LitElement, PropertyValues } from 'lit';
import { type AudioPlayerState } from '@ghchinoy/lit-audio-ui';
/**
 * ATOM: Synced Transcript
 * Renders a transcript with word-level highlighting synchronized to audio playback using pretext on a Canvas.
 * Consumes AudioPlayerState for timing and transcript data.
 *
 * @element ui-synced-transcript
 */
export declare class UiSyncedTranscript extends LitElement {
    playerState?: AudioPlayerState;
    private _canvas;
    font: string;
    lineHeight: number;
    textColor: string;
    activeTextColor: string;
    activeBgColor: string;
    pastTextColor: string;
    private _resizeObserver;
    private _preparedText;
    private _lastTranscriptText;
    private _layoutLines;
    private _layoutHeight;
    static styles: import("lit").CSSResult;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    updated(changedProperties: PropertyValues): void;
    private _updateLayout;
    private _renderCanvas;
    render(): import("lit-html").TemplateResult<1>;
}
