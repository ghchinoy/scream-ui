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
    // Disable Shadow DOM so that demo IDs are accessible to global scripts in index.html (optional, depending on project norm, wait, if I use slot name=code, then shadow dom is needed. The old code disabled it in a hotfix, but it used shadow dom features. Let's not add createRenderRoot unless it's necessary. Wait, looking at commit 1a8f37b, createRenderRoot was removed, meaning shadow DOM is ON.)
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
      flex-wrap: wrap;
      gap: 12px;
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
    .tabs {
      display: flex;
      gap: 8px;
    }
    .tab-btn {
      padding: 6px 12px;
      background: transparent;
      border: 1px solid var(--md-sys-color-outline, #79747e);
      border-radius: 8px;
      color: var(--md-sys-color-on-surface-variant, #444);
      font-family: inherit;
      font-weight: 500;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab-btn:hover {
      background: var(--md-sys-color-surface-container-highest, #e3e3e3);
    }
    .tab-btn.active {
      background: var(--md-sys-color-secondary-container, #e8def8);
      color: var(--md-sys-color-on-secondary-container, #1d192b);
      border-color: transparent;
    }
    .content {
      padding: var(--ui-showcase-card-content-padding, 24px);
      min-height: 100px;
      position: relative;
    }
    .preview-panel {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      gap: 16px;
    }
    :host([mode='code']) .preview-panel {
      position: absolute;
      visibility: hidden;
      pointer-events: none;
      height: 0;
      overflow: hidden;
    }
    .code-panel {
      display: none;
      background: var(--md-sys-color-surface-container-highest, #1e1e1e);
      color: var(--md-sys-color-on-surface, #e3e3e3);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.85rem;
      line-height: 1.5;
      margin: 0;
      border: 1px solid var(--md-sys-color-outline-variant, #e0e0e0);
    }
    :host([mode='code']) .code-panel {
      display: block;
    }
  `; }
    render() {
        return html `
      <div class="header">
        <div class="title-group">
          <h3>${this.title}</h3>
          ${this.description ? html `<p>${this.description}</p>` : ''}
        </div>
        <div class="tabs">
          <button
            class="tab-btn ${this.mode === 'preview' ? 'active' : ''}"
            @click=${() => { this.mode = 'preview'; }}
          >Preview</button>
          <button
            class="tab-btn ${this.mode === 'code' ? 'active' : ''}"
            @click=${() => { this.mode = 'code'; }}
          >Code</button>
        </div>
      </div>
      <div class="content">
        <div class="preview-panel">
          <slot></slot>
        </div>
        <pre class="code-panel"><code><slot name="code"></slot></code></pre>
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