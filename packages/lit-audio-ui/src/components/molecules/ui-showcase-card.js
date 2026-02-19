/**
 * Copyright 2026 Google LLC
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
/**
 * A container component used in the demo to showcase individual components.
 */
let UiShowcaseCard = class UiShowcaseCard extends LitElement {
    constructor() {
        super(...arguments);
        this.title = 'Component';
        this.description = '';
        this.mode = 'preview';
    }
    static { this.styles = css `
    :host {
      display: block;
      border-radius: 12px;
      background: var(--md-sys-color-surface-container-low, #f7f9fc);
      border: 1px solid var(--md-sys-color-outline-variant, #e0e0e0);
      overflow: hidden;
      margin-bottom: var(--ui-showcase-card-margin-bottom, 24px);
    }
    .header {
      padding: var(--ui-showcase-card-header-padding, 16px 20px);
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
      padding: var(--ui-showcase-card-content-padding, 24px);
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      min-height: 100px;
      gap: 16px;
    }
  `; }
    render() {
        return html `
      <div class="header">
        <div class="title-group">
          <h3>${this.title}</h3>
          ${this.description ? html `<p>${this.description}</p>` : ''}
        </div>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    `;
    }
};
__decorate([
    property({ type: String })
], UiShowcaseCard.prototype, "title", void 0);
__decorate([
    property({ type: String })
], UiShowcaseCard.prototype, "description", void 0);
__decorate([
    property({ type: String, reflect: true })
], UiShowcaseCard.prototype, "mode", void 0);
UiShowcaseCard = __decorate([
    customElement('ui-showcase-card')
], UiShowcaseCard);
export { UiShowcaseCard };
//# sourceMappingURL=ui-showcase-card.js.map