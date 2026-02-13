import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@material/web/button/text-button.js';

@customElement('ui-showcase-card')
export class UiShowcaseCard extends LitElement {
  @property({ type: String }) title = 'Component';
  @property({ type: String }) description = '';
  @property({ type: String }) mode: 'preview' | 'code' = 'preview';

  static styles = css`
    :host {
      display: block;
      background: var(--md-sys-color-surface, #ffffff);
      color: var(--md-sys-color-on-surface, #1e1e1e);
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s, color 0.3s;
      overflow: hidden;
      font-family: inherit;
      border: 1px solid var(--md-sys-color-outline-variant, #c4c7c5);
    }

    .header {
      padding: 1.5rem 2rem 1rem 2rem;
    }

    .title {
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-size: 1.4rem;
      font-weight: 600;
    }

    .description {
      margin: 0;
      font-size: 0.95rem;
      color: var(--md-sys-color-on-surface-variant, #444444);
      line-height: 1.5;
    }

    .tabs {
      display: flex;
      gap: 8px;
      padding: 0 2rem;
      border-bottom: 1px solid var(--md-sys-color-outline-variant, #c4c7c5);
    }
    
    .tab-btn {
      padding: 8px 16px;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--md-sys-color-on-surface-variant, #444444);
      font-family: inherit;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-btn:hover {
      color: var(--md-sys-color-primary, #0066cc);
      background: var(--md-sys-color-surface-container-highest, #e3e3e3);
    }

    .tab-btn.active {
      color: var(--md-sys-color-primary, #0066cc);
      border-bottom-color: var(--md-sys-color-primary, #0066cc);
    }

    .content-area {
      padding: 2rem;
      position: relative;
      background: var(--md-sys-color-surface, #ffffff);
    }

    .preview-panel {
      display: none;
    }

    .preview-panel.active {
      display: block;
    }

    .code-panel {
      display: none;
      background: #1e1e1e; /* Standard terminal color */
      color: #e3e3e3;
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.85rem;
      line-height: 1.5;
      margin: 0;
    }

    .code-panel.active {
      display: block;
    }
  `;

  render() {
    return html`
      <div class="header">
        <h2 class="title">${this.title}</h2>
        ${this.description ? html`<p class="description">${this.description}</p>` : ''}
      </div>

      <div class="tabs">
        <button 
          class="tab-btn ${this.mode === 'preview' ? 'active' : ''}" 
          @click="${() => this.mode = 'preview'}"
        >Preview</button>
        <button 
          class="tab-btn ${this.mode === 'code' ? 'active' : ''}" 
          @click="${() => this.mode = 'code'}"
        >Code</button>
      </div>

      <div class="content-area">
        <div class="preview-panel ${this.mode === 'preview' ? 'active' : ''}">
          <slot></slot>
        </div>
        
        <pre class="code-panel ${this.mode === 'code' ? 'active' : ''}"><code><slot name="code"></slot></code></pre>
      </div>
    `;
  }
}
