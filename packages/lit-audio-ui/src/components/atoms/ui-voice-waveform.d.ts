/**
 * Copyright 2026 Google LLC
 */
import { LitElement } from 'lit';
import '../molecules/ui-live-waveform.js';
/**
 * A specialized version of ui-live-waveform that automatically consumes
 * state from a nearby ui-speech-provider.
 *
 * @element ui-voice-waveform
 */
export declare class UiVoiceWaveform extends LitElement {
    private _context?;
    barWidth: number;
    barGap: number;
    barColor: string;
    height: number;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
