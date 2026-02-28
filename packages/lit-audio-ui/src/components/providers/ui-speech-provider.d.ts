import { LitElement } from 'lit';
import { type SpeechState } from '../../utils/speech-context.js';
/**
 * A headless provider component that manages the speech recording lifecycle.
 * It provides a `SpeechContext` to all children components, allowing them to
 * react to recording states and access transcripts.
 *
 * It supports three modes:
 * 1. Auto (Default): Handles getUserMedia and provides a real MediaStream.
 * 2. Simulation: Provides a mock AnalyserNode and fake transcription for demos.
 * 3. Manual: Only emits intent events, leaving state management to a backend/agent.
 *
 * @element ui-speech-provider
 *
 * @prop {string} state - The current recording state ('idle', 'connecting', 'recording', 'processing', 'success', 'error').
 * @prop {boolean} simulation - Enable mock transcription and audio data for demos.
 * @prop {boolean} manual - If true, the provider will not start recording automatically but will emit requests.
 * @prop {string} transcript - The final confirmed transcript.
 * @prop {string} partialTranscript - The live, interim transcript.
 *
 * @fires speech-start - Dispatched when recording actually begins.
 * @fires speech-stop - Dispatched when recording is stopped.
 * @fires speech-request-start - Dispatched in 'manual' mode when a child wants to start.
 * @fires speech-request-stop - Dispatched in 'manual' mode when a child wants to stop.
 * @fires state-change - Dispatched whenever the internal context state changes.
 */
export declare class UiSpeechProvider extends LitElement {
    private _context;
    state: SpeechState;
    simulation: boolean;
    manual: boolean;
    transcript: string;
    partialTranscript: string;
    deviceId?: string;
    private _stream?;
    private _audioCtx?;
    private _analyser?;
    private _transcriptInterval?;
    private _fakeTranscript;
    static styles: import("lit").CSSResult;
    willUpdate(changedProperties: Map<string, any>): void;
    start(): Promise<void>;
    stop(): void;
    cancel(): void;
    private _cleanupStream;
    private _updateContext;
    render(): import("lit-html").TemplateResult<1>;
}
export interface SpeechProviderElement extends HTMLElement {
    state: SpeechState;
    simulation: boolean;
    manual: boolean;
    transcript: string;
    partialTranscript: string;
    deviceId?: string;
    start(): Promise<void> | void;
    stop(): void;
    cancel(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'ui-speech-provider': UiSpeechProvider;
    }
}
