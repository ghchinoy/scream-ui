import {LitElement, html, css} from 'lit';
import {customElement, state, query, property} from 'lit/decorators.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-conversation-bar.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-3d-flip.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-orb.js';
import './a2a-inspector.js';
import type {A2ADebugLog} from './a2a-inspector.js';
// Pre-load components that the Agent might request
import '@ghchinoy/lit-audio-ui/organisms/ui-audio-player.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-playlist.js';
import '../../../live-connection/src/components/demo-live-connection.js';
import '../../../gallery/components/demo-podcast-player.js';

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

@customElement('demo-agent-card')
export class DemoAgentCard extends LitElement {
  @property({type: String}) name = 'A2A Showcase Agent';
  @property({type: String}) status = 'Online';
  @property({type: Array}) capabilities = ['Music playback', 'Podcasts', 'Live Duplex Audio', 'Architecture Docs'];

  static styles = css`
    :host {
      display: block;
      max-width: 400px;
      font-family: inherit;
    }

    ui-3d-flip {
      width: 400px;
      height: 250px;
      display: block;
    }
    
    .card-face {
      background: var(--md-sys-color-surface-container, #f3f3f3);
      border-radius: 16px;
      padding: 24px;
      border: 1px solid var(--md-sys-color-outline-variant);
      box-sizing: border-box;
      width: 100%;
      height: 100%;
    }

    .back-face {
      background: #1e1e1e;
      color: #d4d4d4;
      display: flex;
      flex-direction: column;
      border: 1px solid #333;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .a2ui-logo {
      height: 24px;
      margin-left: auto;
      opacity: 0.8;
      content: url('/assets/A2UI_dark.svg');
    }
    
    @media (prefers-color-scheme: dark) {
      .a2ui-logo {
        content: url('/assets/A2UI_light.svg');
      }
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    h3 { margin: 0; color: var(--md-sys-color-on-surface); }
    .status { font-size: 0.85rem; color: var(--md-sys-color-primary); font-weight: 600; }
    
    .caps-container {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }

    .caps { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; }
    .cap-badge {
      background: var(--md-sys-color-surface-container-high, #e2e2e2);
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 0.75rem;
      color: var(--md-sys-color-on-surface-variant);
    }

    .json-pre {
      margin: 0;
      padding: 12px;
      background: #2d2d2d;
      border-radius: 8px;
      font-family: monospace;
      font-size: 0.75rem;
      overflow-x: auto;
      flex: 1;
      text-align: left;
    }
    .back-title {
      font-family: monospace;
      font-size: 0.85rem;
      color: #9cdcfe;
      margin: 0 0 12px 0;
      flex: 1;
    }
  `;

  render() {
    const manifestJson = {
      "@context": "https://a2aproject.org/context",
      "type": "Agent",
      "id": "urn:uuid:a2a-showcase-agent",
      "name": this.name,
      "description": "An interactive agent capable of rendering @ghchinoy/lit-audio-ui components.",
      "status": this.status.toLowerCase(),
      "capabilities": {
        "streaming": true,
        "pushNotifications": false,
        "extensions": [
          {
            "uri": "https://a2ui.org/specification/v0_8",
            "required": true,
            "description": "Supports A2UI v0.8 for dynamic UI orchestration",
            "params": {
              "catalogUrl": "https://raw.githubusercontent.com/ghchinoy/scream-ui/main/docs/a2ui_v0.8_catalog.json"
            }
          }
        ]
      },
      "additionalInterfaces": [
        {
          "transport": "websocket",
          "url": "ws://localhost:8081/ws"
        }
      ]
    };

    return html`
      <ui-3d-flip>
        
        <!-- FRONT: UI CARD -->
        <div slot="front" class="card-face">
          <div class="header">
            <div class="avatar">
              <ui-orb agentState="listening" style="width: 48px; height: 48px;"></ui-orb>
            </div>
            <div>
              <h3>${this.name}</h3>
              <div class="status">● ${this.status}</div>
            </div>
          </div>
          <div class="caps-container">
            <div class="caps">
              ${this.capabilities.map(cap => html`<span class="cap-badge">${cap}</span>`)}
            </div>
            <img class="a2ui-logo" alt="A2UI Protocol" />
          </div>
        </div>

        <md-icon-button slot="flip-icon" title="View A2A JSON Manifest" style="--md-icon-button-icon-color: var(--md-sys-color-on-surface);">
          <md-icon>data_object</md-icon>
        </md-icon-button>

        <!-- BACK: JSON MANIFEST -->
        <div slot="back" class="card-face back-face">
          <div style="display:flex; align-items:center;">
            <p class="back-title">agent-manifest.json</p>
          </div>
          <pre class="json-pre">${JSON.stringify(manifestJson, null, 2)}</pre>
        </div>

        <md-icon-button slot="flip-icon-back" title="Back to UI" style="--md-icon-button-icon-color: #ccc;">
          <md-icon>close</md-icon>
        </md-icon-button>

      </ui-3d-flip>
    `;
  }
}

@customElement('a2ui-renderer')
export class A2uiRenderer extends LitElement {
  @state() private _messages: {role: 'user' | 'agent'; content: string | HTMLElement}[] = [];
  @state() private _wsState = 'disconnected';
  
  private _ws: WebSocket | null = null;
  @query('.scroll-container') private _scrollContainer!: HTMLElement;
  @state() private _debugLogs: A2ADebugLog[] = [];

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
      justify-content: flex-start;
      align-items: center;
      gap: 1.5rem;
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    .badge {
      font-size: 0.75rem;
      padding: 4px 12px;
      border-radius: 999px;
      font-weight: 600;
      text-transform: uppercase;
      border: 1px solid transparent;
      cursor: pointer;
      font-family: inherit;
      transition: opacity 0.2s;
    }
    .badge:hover {
      opacity: 0.8;
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

    .message-row {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      max-width: 80%;
    }

    .message-row.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message-row.agent {
      align-self: flex-start;
    }

    .agent-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--md-sys-color-surface-container-high, #e2e2e2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }

    .message {
      padding: 1rem 1.5rem;
      border-radius: 24px;
      line-height: 1.5;
    }

    .message.user {
      background: var(--md-sys-color-primary, #0066cc);
      color: var(--md-sys-color-on-primary, white);
      border-bottom-right-radius: 4px;
    }

    .message.agent {
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
  `;

  connectedCallback() {
    super.connectedCallback();
    this._connect();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._ws) this._ws.close();
  }

  private _connect() {
    this._fetchAgentCard();
  }

  private async _fetchAgentCard() {
    try {
      // 1. A2A Discovery: Download the Agent Card
      const response = await fetch('/.well-known/agent-card.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const card = await response.json();
      console.log('✅ A2A Discovery: Downloaded Agent Card', card);
      
      // Update UI state
      this._wsState = 'connected';
    } catch (e) {
      console.error('❌ A2A Discovery Failed:', e);
      this._wsState = 'disconnected';
      setTimeout(() => this._fetchAgentCard(), 5000);
    }
  }

  private _logDebug(source: 'client' | 'server', payload: any) {
    this._debugLogs = [...this._debugLogs, {source, payload}];
  }

  // A2UI v0.8 Flat Component Parsing Engine
  private catalogMap: Record<string, string> = {
    'UiOrb': 'ui-orb',
    'UiAudioPlayer': 'ui-audio-player',
    'DemoPodcastPlayer': 'demo-podcast-player',
    'UiPlaylist': 'ui-playlist',
    'DemoAgentCard': 'demo-agent-card',
    'DemoArchitectureCard': 'demo-architecture-card',
    'DemoLiveConnection': 'demo-live-connection'
  };

  private _handleA2AEvent(rpcResponse: any) {
    // 3. A2A Execution: Parse standard a2a.Event messages
    const msg = rpcResponse.result?.message;
    if (!msg || !msg.parts) return;

    for (const part of msg.parts) {
      // Render text parts normally
      if (part.text) {
        this._messages = [...this._messages, {role: 'agent', content: part.text}];
      } 
      // Render A2UI Data parts (a2a v1 spec uses mediaType and data mapping)
      else if (part.mediaType === 'application/json+a2ui' && part.data) {
        const payload = part.data;
        if (payload.surfaceUpdate && payload.surfaceUpdate.components) {
          
          // A2UI v0.8 Core Logic: Parse the flat list of components
          for (const comp of payload.surfaceUpdate.components) {
             const tagName = this.catalogMap[comp.type];
             if (tagName) {
                console.log(`🤖 Agent requested to render A2UI component: <${tagName}>`, comp.props);
                const el = document.createElement(tagName);
                if (comp.props) {
                  for (const [key, value] of Object.entries(comp.props)) {
                    (el as any)[key] = value;
                  }
                }
                this._messages = [...this._messages, {role: 'agent', content: el}];
             } else {
                console.warn(`A2UI Warning: Received unknown component type '${comp.type}' in surfaceUpdate.`);
             }
          }
        }
      }
    }
    this._scrollToBottom();
  }

  private async _scrollToBottom() {
    await this.updateComplete;
    if (this._scrollContainer) {
      this._scrollContainer.scrollTop = this._scrollContainer.scrollHeight;
    }
  }

  private async _sendA2AInvoke(text: string) {
    if (!text || this._wsState !== 'connected') return;

    this._messages = [...this._messages, {role: 'user', content: text}];
    this._scrollToBottom();

    // 2. A2A Invocation: Build standard JSON-RPC request
    const requestPayload = {
      jsonrpc: "2.0",
      method: "SendStreamingMessage",
      params: {
        message: {
          messageId: "msg-" + Date.now().toString(),
          role: "user",
          parts: [{ text }]
        }
      },
      id: Date.now()
    };

    this._logDebug('client', requestPayload);

    try {
      const response = await fetch('/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (!response.body) return;

      // Handle the streaming SSE response
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const {done, value} = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, {stream: true});
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;

            try {
              const rpcResponse = JSON.parse(dataStr);
              this._logDebug('server', rpcResponse);
              this._handleA2AEvent(rpcResponse);
            } catch (e) {
              console.error('Failed to parse SSE JSON', e, dataStr);
            }
          }
        }
      }
    } catch (e) {
      console.error('A2A Invoke failed', e);
    }
  }

  private _handleUserSubmit(e: CustomEvent) {
    this._sendA2AInvoke(e.detail.message);
  }

  private _requestAgentInfo() {
    if (this._wsState !== 'connected') return;
    this._sendA2AInvoke("who are you");
  }

  render() {
    return html`
      <header>
        <div>
          <h1 style="margin: 0; font-size: 1.25rem;">Federated A2A Showcase</h1>
          <p style="margin: 0; font-size: 0.85rem; opacity: 0.7;">Host &lt;-&gt; Agent Protocol Demo</p>
        </div>
        <button class="badge ${this._wsState}" @click=${this._requestAgentInfo} title="View Agent Profile">
          ${this._wsState}
        </button>
      </header>

      <a2a-inspector .logs=${this._debugLogs}></a2a-inspector>

      <div class="scroll-container">
        ${this._messages.map(msg => html`
          <div class="message-row ${msg.role}">
            ${msg.role === 'agent' ? html`
              <div class="agent-avatar">
                <ui-orb agentState="idle" style="width: 32px; height: 32px;"></ui-orb>
              </div>
            ` : ''}
            <div class="message ${msg.role} ${typeof msg.content === 'string' ? '' : 'agent-component'}">
              ${msg.content}
            </div>
          </div>
        `)}
      </div>

      <div class="footer">
        <ui-conversation-bar
          @message-sent="${this._handleUserSubmit}"
          placeholder="Try 'play me a song', 'show podcast', or 'talk live'..."
        ></ui-conversation-bar>
      </div>
    `;
  }
}