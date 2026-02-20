import {LitElement, html, css} from 'lit';
import {customElement, property, state, query} from 'lit/decorators.js';
import '@material/web/icon/icon.js';

export interface A2ADebugLog {
  source: 'client' | 'server';
  payload: any;
}

@customElement('a2a-inspector')
export class A2aInspector extends LitElement {
  @property({type: Array}) logs: A2ADebugLog[] = [];
  
  @state() private _open = false;
  @query('.debug-content') private _scrollEl!: HTMLElement;

  static styles = css`
    :host {
      display: block;
      font-family: inherit;
    }

    .debug-panel {
      position: fixed;
      top: 1rem;
      right: 1rem;
      background: var(--md-sys-color-surface-container-high, #333);
      color: var(--md-sys-color-on-surface, #eee);
      border-radius: 12px;
      width: 350px;
      max-height: 400px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 100;
      border: 1px solid var(--md-sys-color-outline-variant);
      transition: transform 0.3s ease;
      transform: translateX(calc(100% - 150px));
      overflow: hidden;
    }
    
    .debug-panel.open {
      transform: translateX(0);
    }

    .debug-header {
      padding: 8px 12px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--md-sys-color-surface-container-highest);
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      user-select: none;
      min-height: 24px;
    }

    .a2a-logo {
      height: 16px;
      content: url('/assets/a2a-logo-white.svg');
      opacity: 0.9;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .debug-content {
      padding: 12px;
      overflow-y: auto;
      font-family: monospace;
      font-size: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .debug-msg {
      padding: 6px;
      border-radius: 4px;
      background: var(--md-sys-color-surface-container);
      word-break: break-all;
    }
    .debug-msg.client {
      border-left: 3px solid var(--md-sys-color-primary, #0066cc);
    }
    .debug-msg.server {
      border-left: 3px solid var(--md-sys-color-tertiary, #cc0066);
    }
  `;

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('logs')) {
      if (this._scrollEl) {
        this._scrollEl.scrollTop = this._scrollEl.scrollHeight;
      }
    }
  }

  render() {
    return html`
      <div class="debug-panel ${this._open ? 'open' : ''}">
        <div class="debug-header" @click=${() => (this._open = !this._open)}>
          <span class="header-left">
            <img class="a2a-logo" alt="A2A Protocol" />
            Inspector
          </span>
          <md-icon style="font-size:18px;">
            ${this._open ? 'chevron_right' : 'chevron_left'}
          </md-icon>
        </div>
        ${this._open ? html`
          <div class="debug-content">
            ${this.logs.map(log => html`
              <div class="debug-msg ${log.source}">
                <strong style="color: ${log.source === 'client' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-tertiary)'}">
                  ${log.source === 'client' ? '▶ Client' : '◀ Agent'}:
                </strong><br/>
                <pre style="margin:4px 0 0 0; white-space:pre-wrap;">${JSON.stringify(log.payload, null, 2)}</pre>
              </div>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }
}