/**
 * Copyright 2026 Google LLC
 */
import { LitElement, type PropertyValues } from 'lit';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/icon/icon.js';
import './ui-live-waveform.js';
export type VoiceButtonState = 'idle' | 'recording' | 'processing' | 'success' | 'error';
/**
 * A native Lit WebComponent replacement for the ElevenLabs React voice-button.
 * Now refactored to consume speechContext but maintains backward compatibility
 * for manual state control.
 */
export declare class UiVoiceButton extends LitElement {
    private _context?;
    state: VoiceButtonState;
    label?: string;
    trailing?: string;
    disabled: boolean;
    analyserNode?: AnalyserNode;
    private _showFeedback;
    private _feedbackType;
    private _feedbackTimeout?;
    static styles: import("lit").CSSResult;
    protected updated(changedProperties: PropertyValues): void;
    render(): import("lit-html").TemplateResult<1>;
    private _handleClick;
}
