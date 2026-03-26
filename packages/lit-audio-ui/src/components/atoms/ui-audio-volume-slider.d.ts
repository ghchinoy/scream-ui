import { LitElement } from 'lit';
import { type AudioPlayerState } from '../../utils/audio-context.js';
import '@material/web/slider/slider.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';
export declare class UiAudioVolumeSlider extends LitElement {
    playerState?: AudioPlayerState;
    variant: 'inline' | 'popover';
    private _isOpen;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    private _handleInput;
    private _toggleMute;
}
