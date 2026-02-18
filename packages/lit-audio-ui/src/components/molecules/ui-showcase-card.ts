/**
 * Copyright 2026 Google LLC
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * A container component used in the demo to showcase individual components.
 */
@customElement('ui-showcase-card')
export class UiShowcaseCard extends LitElement {
  @property({type: String}) title = 'Component';
  @property({type: String}) description = '';
  @property({type: String, reflect: true}) mode: 'preview' | 'code' = 'preview';

  static override styles = css`
    :host {
      display: block;
      border-radius: 12px;
      background: var(--md-sys-color-surface-container-low, #f7f9fc);
      border: 1px solid var(--md-sys-color-outline-variant, #e0e0e0);
      overflow: hidden;
      margin-bottom: 24px;
    }
    .header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--md-sys-color-outline-variant, #e0e0e0);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title-group h3 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--md-sys-color-on-surface, #1e1e1e);
    }
    .title-group p {
      margin: 4px 0 0;
      font-size: 0.85rem;
      color: var(--md-sys-color-on-surface-variant, #444);
    }
    .content {
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100px;
    }
  `;

  override render() {
    return html`
      <div class="header">
        <div class="title-group">
          <h3>${this.title}</h3>
          ${this.description ? html`<p>${this.description}</p>` : ''}
        </div>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    `;
  }
}
