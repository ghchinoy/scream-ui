import { LitElement } from 'lit';
import type { AgentState } from './ui-orb.js';
/**
 * A 3D WebGL 'Moving Gradient' component used to visualize AI agent states.
 */
export declare class UiMovingGradient extends LitElement {
    colors?: [string, string, string];
    stops?: [number, number, number];
    agentState: AgentState;
    inputVolume: number;
    outputVolume: number;
    volumeMode: 'auto' | 'manual';
    baseHeight: number;
    speed: number;
    private _container;
    private _renderer?;
    private _scene?;
    private _camera?;
    private _mesh?;
    private _animationFrameId;
    private _resizeObserver?;
    private _animSpeed;
    private _curIn;
    private _curOut;
    private _targetColor1;
    private _targetColor2;
    private _targetColor3;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    protected firstUpdated(): void;
    protected updated(changedProperties: Map<string, any>): void;
    private _updateColors;
    disconnectedCallback(): void;
    private _initThree;
    private _lastTime;
    private _animate;
    private _clamp01;
    private _vertexShader;
    private _fragmentShader;
}
