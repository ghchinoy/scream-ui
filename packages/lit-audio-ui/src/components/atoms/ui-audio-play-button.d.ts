import { LitElement } from 'lit';
import { type AudioPlayerState } from '../../utils/audio-context.js';
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/icon/icon.js';
export declare class UiAudioPlayButton extends LitElement {
    playerState?: AudioPlayerState;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    private _handleClick;
}
