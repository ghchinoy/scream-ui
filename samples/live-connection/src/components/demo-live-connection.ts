import {LitElement, html, css} from 'lit';
import {customElement, state, query} from 'lit/decorators.js';
import '@ghchinoy/lit-audio-ui/providers/ui-speech-provider.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-orb.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-voice-button.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';
// @ts-ignore - Ignore missing declaration files for now
import type {SpeechState} from '@ghchinoy/lit-audio-ui';

@customElement('demo-live-connection')
export class DemoLiveConnection extends LitElement {
  @state() private _wsState = 'disconnected';
  @state() private _agentState = 'listening';
  
  // This represents the state we inject BACK into the speech provider
  @state() private _speechState: SpeechState = 'idle';
  @state() private _transcript = '';

  @state() private _inputVolume = 0;
  @state() private _outputVolume = 0;
  
  @query('ui-orb') private _orb: any;
  @query('ui-voice-button') private _voiceBtn: any;
  
  private _ws: WebSocket | null = null;
  private _audioCtx: AudioContext | null = null;
  private _processor: ScriptProcessorNode | null = null;
  private _source: MediaStreamAudioSourceNode | null = null;
  private _playbackQueue: AudioBuffer[] = [];
  private _isPlaying = false;
  private _micStream: MediaStream | null = null;
  private _analyser: AnalyserNode | null = null;
  
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      gap: 2rem;
      font-family: inherit;
    }

    .container {
      background: var(--md-sys-color-surface-container, #ffffff);
      border-radius: 24px;
      padding: 3rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      width: 100%;
      max-width: 400px;
    }

    .status-badge {
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-disconnected { background: #ffebee; color: #ba1a1a; }
    .status-connected { background: #e8f5e9; color: #1b5e20; }
    
    ui-orb {
      width: 200px;
      height: 200px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._connectWebSocket();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._ws) {
      this._ws.close();
    }
    this._cleanupAudio();
  }

  private _connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    this._ws = new WebSocket(wsUrl);
    
    this._ws.onopen = () => {
      this._wsState = 'connected';
      console.log('Connected to mock server');
    };
    
    this._ws.onclose = () => {
      this._wsState = 'disconnected';
      setTimeout(() => this._connectWebSocket(), 3000);
    };

    this._ws.onmessage = async (event) => {
      if (typeof event.data === 'string') {
        const msg = JSON.parse(event.data);
        if (msg.type === 'state') {
          this._agentState = msg.value;
          // Sync internal state to the voice button state if needed
          if (msg.value === 'processing') {
             this._speechState = 'processing';
          } else if (msg.value === 'talking') {
             this._speechState = 'idle'; // Reset so button becomes available
          }
          
          if (msg.value === 'talking') {
             this._outputVolume = 0.5; 
          } else {
             this._outputVolume = 0;
          }
        }
      } else {
        // Binary data (PCM 16-bit 16kHz audio from server)
        const arrayBuffer = await event.data.arrayBuffer();
        this._queuePlayback(arrayBuffer);
      }
    };
  }

  // --- MANUAL AUDIO CAPTURE ---

  private async _handleRequestStart() {
    console.log("Received speech-request-start in Manual mode");
    this._speechState = 'connecting';
    
    try {
      this._micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this._audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (this._audioCtx.state === 'suspended') {
        await this._audioCtx.resume();
      }

      this._source = this._audioCtx.createMediaStreamSource(this._micStream);
      this._analyser = this._audioCtx.createAnalyser();
      this._analyser.fftSize = 256;
      this._source.connect(this._analyser);

      // Supply the analyser to the Orb directly, since we bypassed the default provider logic
      if (this._orb) {
        this._orb.analyserNode = this._analyser;
      }
      if (this._voiceBtn) {
        this._voiceBtn.analyserNode = this._analyser;
      }

      this._processor = this._audioCtx.createScriptProcessor(4096, 1, 1);
      this._source.connect(this._processor);
      this._processor.connect(this._audioCtx.destination);
      
      this._processor.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0);
        
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        this._inputVolume = rms * 5; 
        
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7fff;
        }
        
        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
          this._ws.send(pcmData.buffer);
        }
      };

      if (this._ws && this._ws.readyState === WebSocket.OPEN) {
        this._ws.send(JSON.stringify({ type: 'session_init' }));
      }
      
      // Update provider state to 'recording'
      this._speechState = 'recording';

    } catch (e) {
      console.error(e);
      this._speechState = 'error';
    }
  }

  private _handleRequestStop() {
    console.log("Received speech-request-stop in Manual mode");
    this._cleanupAudio();
    this._inputVolume = 0;
    
    // We transition to processing state until the server replies with audio
    this._speechState = 'processing';
    
    if (this._ws && this._ws.readyState === WebSocket.OPEN) {
      this._ws.send(JSON.stringify({ type: 'session_terminate' }));
    }
  }

  private _cleanupAudio() {
    if (this._processor) {
      this._processor.disconnect();
      this._processor = null;
    }
    if (this._source) {
      this._source.disconnect();
      this._source = null;
    }
    if (this._micStream) {
      this._micStream.getTracks().forEach(t => t.stop());
      this._micStream = null;
    }
  }

  // --- AUDIO PLAYBACK (WS TO SPEAKER) ---
  
  private async _queuePlayback(arrayBuffer: ArrayBuffer) {
    if (!this._audioCtx) {
      this._audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const int16Array = new Int16Array(arrayBuffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 0x7fff;
    }

    // Gemini TTS audio is typically 24kHz, so we use that explicitly
    // If it's played at 16kHz, it sounds incredibly slow/deep.
    const audioBuffer = this._audioCtx.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);
    
    this._playbackQueue.push(audioBuffer);
    
    if (!this._isPlaying) {
      this._playNext();
    }
  }

  private _playNext() {
    if (this._playbackQueue.length === 0 || !this._audioCtx) {
      this._isPlaying = false;
      return;
    }

    this._isPlaying = true;
    const buffer = this._playbackQueue.shift();
    const source = this._audioCtx.createBufferSource();
    source.buffer = buffer!;
    
    source.connect(this._audioCtx.destination);
    
    if (this._analyser) {
       source.connect(this._analyser);
    }

    source.onended = () => {
      this._playNext();
    };

    source.start();
  }

  // --- RENDER ---

  render() {
    return html`
      <div class="container">
        <div class="status-badge ${this._wsState === 'connected' ? 'status-connected' : 'status-disconnected'}">
          ${this._wsState === 'connected' ? 'Server Connected' : 'Disconnected'}
        </div>

        <!-- 
          MANUAL MODE: The provider will not start getUserMedia automatically.
          It will emit 'speech-request-start' and 'speech-request-stop'.
          We pass the state IN from the wrapper to update the UI correctly.
        -->
        <ui-speech-provider
          manual
          .state="${this._speechState}"
          .transcript="${this._transcript}"
          @speech-request-start="${this._handleRequestStart}"
          @speech-request-stop="${this._handleRequestStop}"
        >
          <ui-orb
            .agentState="${this._agentState}"
            .inputVolume="${this._inputVolume}"
            .outputVolume="${this._outputVolume}"
          ></ui-orb>
          
          <ui-voice-button
            label="Speak to Agent"
          ></ui-voice-button>
          
        </ui-speech-provider>
      </div>
    `;
  }
}
