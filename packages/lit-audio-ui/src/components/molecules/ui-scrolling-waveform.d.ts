import { LitElement } from 'lit';
/**
 * A native Lit WebComponent that provides a smooth, infinitely scrolling audio waveform animation.
 * Replaces the React/ElevenLabs ScrollingWaveform.
 */
export declare class UiScrollingWaveform extends LitElement {
    speed: number;
    barCount: number;
    barWidth: number;
    barHeight: number;
    barGap: number;
    barRadius: number;
    barColor?: string;
    fadeEdges: boolean;
    fadeWidth: number;
    height?: number | string;
    align: 'center' | 'bottom' | 'top';
    data?: number[];
    peaks?: number[];
    analyserNode?: AnalyserNode;
    active: boolean;
    private _canvas;
    private _container;
    private _resizeObserver?;
    private _animationFrameId;
    private _lastTime;
    private _dataArray?;
    private _bars;
    private _seed;
    private _dataIndex;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    firstUpdated(): void;
    disconnectedCallback(): void;
    private _handleResize;
    private _seededRandom;
    private _populateInitialBars;
    private _startAnimation;
}
