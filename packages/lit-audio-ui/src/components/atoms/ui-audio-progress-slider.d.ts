import { LitElement } from 'lit';
import { type AudioPlayerState } from '../../utils/audio-context.js';
import '@material/web/slider/slider.js';
export declare class UiAudioProgressSlider extends LitElement {
    playerState?: AudioPlayerState;
    private _isDragging;
    private _dragValue;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    private _handleInput;
    private _handleChange;
}
