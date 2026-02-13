import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@material/web/button/filled-button.js';
import '@material/web/icon/icon.js';

export type VoiceState =
  | 'idle'
  | 'recording'
  | 'processing'
  | 'success'
  | 'error';

/**
 * A basic demonstration of the ported audio button.
 */
@customElement('scream-voice-button')
export class ScreamVoiceButton extends LitElement {
  @property({type: String}) state: VoiceState = 'idle';

  static styles = css`
    :host {
      display: inline-block;
    }

    md-filled-button {
      --md-filled-button-container-shape: 999px;
    }

    md-filled-button.recording {
      --md-filled-button-container-color: var(--md-sys-color-error, #ba1a1a);
      --md-filled-button-label-text-color: var(
        --md-sys-color-on-error,
        #ffffff
      );
    }
  `;

  render() {
    return html`
      <md-filled-button class="${this.state}" @click="${this._handleClick}">
        <md-icon slot="icon">
          ${this.state === 'recording' ? 'stop' : 'mic'}
        </md-icon>

        ${this.state === 'recording' ? 'Recording...' : 'Speak'}
      </md-filled-button>
    `;
  }

  private _handleClick() {
    this.state = this.state === 'idle' ? 'recording' : 'idle';
    this.dispatchEvent(
      new CustomEvent('voice-toggle', {
        bubbles: true,
        composed: true,
        detail: {state: this.state},
      }),
    );
  }
}
