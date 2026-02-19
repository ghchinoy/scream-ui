/**
 * Copyright 2026 Google LLC
 */
import { LitElement, type PropertyValues } from 'lit';
import '../atoms/ui-speech-record-button.js';
import '../atoms/ui-speech-cancel-button.js';
import '../atoms/ui-voice-waveform.js';
import '@material/web/button/filled-button.js';
import '@material/web/icon/icon.js';
/**
 * A composite "Pill" style voice interaction component.
 * It combines the recording button, a live waveform, and a cancel button
 * into a single cohesive UI element.
 *
 * @element ui-voice-pill
 */
export declare class UiVoicePill extends LitElement {
    private _context?;
    label?: string;
    disabled: boolean;
    private _showFeedback;
    private _feedbackType;
    private _feedbackTimeout?;
    static styles: import("lit").CSSResult;
    protected updated(changedProperties: PropertyValues): void;
    render(): import("lit-html").TemplateResult<1>;
}
