import { LitElement } from 'lit';
export type AgentState = null | 'thinking' | 'listening' | 'talking';
/**
 * A 3D WebGL 'Orb' component used to visualize AI agent states.
 */
export declare class UiOrb extends LitElement {
    colors?: [string, string];
    agentState: AgentState;
    inputVolume: number;
    outputVolume: number;
    volumeMode: 'auto' | 'manual';
    seed: number;
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
    private _textureLoader;
    private _perlinNoiseTexture?;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    protected firstUpdated(): void;
    protected updated(changedProperties: Map<string, any>): void;
    private _updateSeed;
    private _updateColors;
    disconnectedCallback(): void;
    private _initThree;
    private _lastTime;
    private _animate;
    private _splitmix32;
    private _clamp01;
    private _vertexShader;
    private _fragmentShader;
}
