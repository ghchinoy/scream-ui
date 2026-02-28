import { LitElement } from 'lit';
import { type AudioPlayerState, type PlaylistTrack } from '../../utils/audio-context.js';
/**
 * A headless (invisible) WebComponent that manages an internal <audio> tag
 * and provides state to any child components via @lit/context.
 * It also handles playlist orchestration and auto-advancing tracks.
 */
export declare class UiAudioProvider extends LitElement {
    src: string;
    items: PlaylistTrack[];
    autoAdvance: boolean;
    private _audioEl;
    private _audioContext?;
    private _analyserNode?;
    private _mediaSource?;
    private _animationFrameId;
    state: AudioPlayerState;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    willUpdate(changed: Map<string, any>): void;
    updated(changed: Map<string, any>): void;
    disconnectedCallback(): void;
    private _updateState;
    private _setupAudioContext;
    play(): void;
    pause(): void;
    private _togglePlay;
    private _seek;
    private _setVolume;
    private _toggleMute;
    next(): void;
    previous(): void;
    select(index: number): void;
    private _handleLoadedMetadata;
    private _handleEnded;
    private _handlePlaying;
    private _handlePause;
    private _handleError;
    private _startTrackingTime;
}
export interface AudioProviderElement extends HTMLElement {
    src: string;
    items: PlaylistTrack[];
    autoAdvance: boolean;
    state: AudioPlayerState;
    play(): void;
    pause(): void;
    next(): void;
    previous(): void;
    select(index: number): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'ui-audio-provider': UiAudioProvider;
    }
}
