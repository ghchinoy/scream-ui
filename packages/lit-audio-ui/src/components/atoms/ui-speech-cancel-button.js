var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { speechContext } from '../../utils/speech-context.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';
let UiSpeechCancelButton = class UiSpeechCancelButton extends LitElement {
    static { this.styles = css `
    :host {
      display: inline-block;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      width: 0;
      overflow: hidden;
    }
    :host([active]) {
      opacity: 1;
      visibility: visible;
      width: 40px;
    }
    md-icon-button {
      --md-icon-button-icon-color: var(
        --md-sys-color-on-surface-variant,
        #444444
      );
    }
  `; }
    render() {
        if (!this._context)
            return html ``;
        const isActive = this._context.state === 'recording' ||
            this._context.state === 'processing' ||
            this._context.state === 'error';
        // Sync attribute for CSS
        if (isActive) {
            this.setAttribute('active', '');
        }
        else {
            this.removeAttribute('active');
        }
        return html `
      <md-icon-button aria-label="Cancel recording" @click=${this._handleClick}>
        <md-icon>close</md-icon>
      </md-icon-button>
    `;
    }
    _handleClick() {
        this._context?.cancel();
    }
};
__decorate([
    consume({ context: speechContext, subscribe: true })
], UiSpeechCancelButton.prototype, "_context", void 0);
UiSpeechCancelButton = __decorate([
    customElement('ui-speech-cancel-button')
], UiSpeechCancelButton);
export { UiSpeechCancelButton };
//# sourceMappingURL=ui-speech-cancel-button.js.map