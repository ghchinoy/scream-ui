import { LitElement } from 'lit';
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/icon/icon.js';
export declare class UiSpeechRecordButton extends LitElement {
    private _context?;
    size: 'sm' | 'default' | 'lg';
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    private _handleClick;
}
