import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators.js';

@customElement('a2ui-renderer')
export class A2uiRenderer extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }
  `;

  render() {
    return html`
      <div>
        <h2>A2A Showcase Renderer</h2>
        <p>Waiting for Agent payload...</p>
      </div>
    `;
  }
}