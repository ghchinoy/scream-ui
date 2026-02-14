import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {consume} from '@lit/context';
import {speechContext, type SpeechContext} from '../utils/speech-context';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';

@customElement('ui-speech-cancel-button')
export class UiSpeechCancelButton extends LitElement {
  @consume({context: speechContext, subscribe: true})
  private _context?: SpeechContext;

  static styles = css`
    :host {
      display: none;
    }
    :host([active]) {
      display: inline-block;
    }
  `;

  render() {
    if (!this._context) return html``;

    const isActive =
      this._context.state === 'recording' ||
      this._context.state === 'processing' ||
      this._context.state === 'error';

    // Sync attribute for CSS
    if (isActive) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }

    return html`
      <md-icon-button @click=${this._handleClick}>
        <md-icon>close</md-icon>
      </md-icon-button>
    `;
  }

  private _handleClick() {
    this._context?.cancel();
  }
}
