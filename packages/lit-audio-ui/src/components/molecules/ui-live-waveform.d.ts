/**
 * Copyright 2026 Google LLC
 */
import { LitElement, type PropertyValues } from 'lit';
/**
 * A real-time audio visualizer component.
 */
export declare class UiLiveWaveform extends LitElement {
    active: boolean;
    processing: boolean;
    analyserNode?: AnalyserNode;
    barWidth: number;
    barHeight: number;
    barGap: number;
    barRadius: number;
    barColor?: string;
    fadeEdges: boolean;
    fadeWidth: number;
    height: number;
    sensitivity: number;
    updateRate: number;
    private _canvas;
    private _container;
    private _animationFrameId;
    private _lastUpdateTime;
    private _resizeObserver?;
    private _themeObserver?;
    private _dataArray?;
    private _currentBars;
    private _processingTime;
    private _transitionProgress;
    private _lastActiveData;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    protected firstUpdated(): void;
    protected updated(changedProperties: PropertyValues): void;
    disconnectedCallback(): void;
    private _handleResize;
    private _startAnimationLoop;
    private _updateData;
    private _renderFrame;
}
