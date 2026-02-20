import {LitElement, html, css} from 'lit';
import {customElement, state, query} from 'lit/decorators.js';
import '@material/web/icon/icon.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-conversation-bar.js';
// Pre-load components that the Agent might request
import '@ghchinoy/lit-audio-ui/organisms/ui-audio-player.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-playlist.js';
import '../../../live-connection/src/components/demo-live-connection.js';
import '../../../gallery/components/demo-podcast-player.js';

interface A2APayload {
  type: 'text' | 'a2ui_render';
  text?: string;
  component?: string;
  props?: Record<string, any>;
}

@customElement('demo-architecture-card')
export class DemoArchitectureCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: var(--md-sys-color-surface-container, #f3f3f3);
      border-radius: 16px;
      padding: 24px;
      border: 1px solid var(--md-sys-color-outline-variant);
      max-width: 600px;
    }
    h3 {
      margin-top: 0;
      color: var(--md-sys-color-primary);
    }
    p {
      font-size: 0.9rem;
      line-height: 1.5;
      color: var(--md-sys-color-on-surface-variant);
    }
    img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      margin-top: 16px;
      background: white;
    }
  `;
  render() {
    return html`
      <h3>Simulated Federation Architecture</h3>
      <p>
        This showcase demonstrates how to orchestrate UI components dynamically using an Agent-to-Agent (A2A) protocol. 
        Instead of a monolithic app, the <b>Host</b> (serving the UI) and the <b>Agent</b> (the LLM brain) are separate services connected via WebSockets.
      </p>
      <p>
        When you type a request, the Agent evaluates the intent and returns an <i>A2UI Payload</i> (a JSON object specifying a WebComponent tag). The Host renderer then dynamically instantiates that Lit component!
      </p>
      <img src="/docs/architecture.png" alt="A2A Architecture Diagram" />
    `;
  }
}

@customElement('a2ui-renderer')
export class A2uiRenderer extends LitElement {
  @state() private _messages: {role: 'user' | 'agent'; content: string | HTMLElement}[] = [];
  @state() private _wsState = 'disconnected';
  
  private _ws: WebSocket | null = null;
  @query('.scroll-container') private _scrollContainer!: HTMLElement;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100vw;
      height: 100vh;
      background: var(--md-sys-color-surface, #fcfcfc);
      font-family: system-ui, -apple-system, sans-serif;
    }

    header {
      background: var(--md-sys-color-surface-container, #f3f3f3);
      padding: 1rem 2rem;
      border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    .badge {
      font-size: 0.75rem;
      padding: 4px 8px;
      border-radius: 999px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge.connected { background: #e8f5e9; color: #1b5e20; }
    .badge.disconnected { background: #ffebee; color: #ba1a1a; }

    .scroll-container {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .message {
      max-width: 80%;
      padding: 1rem 1.5rem;
      border-radius: 24px;
      line-height: 1.5;
    }

    .message.user {
      align-self: flex-end;
      background: var(--md-sys-color-primary, #0066cc);
      color: var(--md-sys-color-on-primary, white);
      border-bottom-right-radius: 4px;
    }

    .message.agent {
      align-self: flex-start;
      background: var(--md-sys-color-surface-container-high, #e2e2e2);
      color: var(--md-sys-color-on-surface, #1d1b20);
      border-bottom-left-radius: 4px;
    }

    .message.agent-component {
      align-self: flex-start;
      background: transparent;
      padding: 0;
      max-width: 100%;
    }

    .footer {
      padding: 2rem;
      background: linear-gradient(to top, var(--md-sys-color-surface) 50%, transparent);
      display: flex;
      justify-content: center;
    }
    
    ui-conversation-bar {
      width: 100%;
      max-width: 800px;
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
      transform: translateX(calc(100% - 40px));
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
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      user-select: none;
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

  @state() private _debugOpen = false;
  @state() private _debugLogs: {source: 'client' | 'server', payload: any}[] = [];
  @query('.debug-content') private _debugScroll!: HTMLElement;

  connectedCallback() {
    super.connectedCallback();
    this._connect();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._ws) this._ws.close();
  }

  private _connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // We connect to the HOST, which proxies us to the AGENT
    this._ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    this._ws.onopen = () => {
      this._wsState = 'connected';
      console.log('Connected to Host proxy -> Agent LLM');
    };

    this._ws.onclose = () => {
      this._wsState = 'disconnected';
      setTimeout(() => this._connect(), 3000);
    };

    this._ws.onmessage = (event) => {
      try {
        const payload: A2APayload = JSON.parse(event.data);
        this._logDebug('server', payload);
        this._handleA2APayload(payload);
      } catch (e) {
        console.error('Failed to parse A2A payload', e);
      }
    };
  }

  private _logDebug(source: 'client' | 'server', payload: any) {
    this._debugLogs = [...this._debugLogs, {source, payload}];
    this.updateComplete.then(() => {
       if (this._debugScroll) {
          this._debugScroll.scrollTop = this._debugScroll.scrollHeight;
       }
    });
  }

  private _handleA2APayload(payload: A2APayload) {
    if (payload.type === 'text' && payload.text) {
      this._messages = [...this._messages, {role: 'agent', content: payload.text}];
    } 
    else if (payload.type === 'a2ui_render' && payload.component) {
      // 🚀 The Magic: Dynamically instantiating Lit WebComponents based on Agent intent!
      console.log(`🤖 Agent requested to render: <${payload.component}>`, payload.props);
      const el = document.createElement(payload.component);
      
      // Inject the props
      if (payload.props) {
        for (const [key, value] of Object.entries(payload.props)) {
          // If the prop is an object/array, we have to set it as a property, not an attribute.
          (el as any)[key] = value;
        }
      }
      
      this._messages = [...this._messages, {role: 'agent', content: el}];
    }

    this._scrollToBottom();
  }

  private async _scrollToBottom() {
    await this.updateComplete;
    if (this._scrollContainer) {
      this._scrollContainer.scrollTop = this._scrollContainer.scrollHeight;
    }
  }

  private _handleUserSubmit(e: CustomEvent) {
    const text = e.detail.message;
    if (!text || this._wsState !== 'connected') return;

    this._messages = [...this._messages, {role: 'user', content: text}];
    this._scrollToBottom();

    // Send to the agent
    const payload = {text};
    this._logDebug('client', payload);
    this._ws!.send(JSON.stringify(payload));
  }

  render() {
    return html`
      <header>
        <div>
          <h1 style="margin: 0; font-size: 1.25rem;">Federated A2A Showcase</h1>
          <p style="margin: 0; font-size: 0.85rem; opacity: 0.7;">Host &lt;-&gt; Agent Protocol Demo</p>
        </div>
        <span class="badge ${this._wsState}">${this._wsState}</span>
      </header>

      <!-- DEBUG PANEL -->
      <div class="debug-panel ${this._debugOpen ? 'open' : ''}">
        <div class="debug-header" @click=${() => (this._debugOpen = !this._debugOpen)}>
          <span style="display:flex; align-items:center; gap: 4px;"><md-icon style="font-size:16px;">bug_report</md-icon>A2A Inspector</span>
          <md-icon style="font-size:18px;">
            ${this._debugOpen ? 'chevron_right' : 'chevron_left'}
          </md-icon>
        </div>
        ${this._debugOpen ? html`
          <div class="debug-content">
            ${this._debugLogs.map(log => html`
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

      <div class="scroll-container">
        ${this._messages.map(msg => html`
          <div class="message ${msg.role} ${typeof msg.content === 'string' ? '' : 'agent-component'}">
            ${msg.content}
          </div>
        `)}
      </div>

      <div class="footer">
        <!-- Re-using our library's UI component for the chat bar! -->
        <ui-conversation-bar
          @message-sent="${this._handleUserSubmit}"
          placeholder="Try 'play me a song', 'show podcast', or 'talk live'..."
        ></ui-conversation-bar>
      </div>
    `;
  }
}