import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';

// Import our library components so they are registered
import './index.js';

/* ==========================================================================
   1. Dynamic Speech Input Widget
   ========================================================================== */
@customElement('demo-speech-input')
export class DemoSpeechInput extends LitElement {
  @state() private _state: 'idle' | 'recording' | 'processing' | 'success' | 'error' = 'idle';
  @state() private _transcript = 'Listening...';
  
  private _transcriptInterval: any;
  private _fakeTranscript = ["I", " am", " recording", " a", " message", " right", " now..."];

  static styles = css`
    :host { display: block; font-family: inherit; }
    .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; display: inline-block; line-height: 1; text-transform: none; letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr; }
    
    .speech-input-card {
      background: var(--md-sys-color-surface-container);
      border-radius: 24px;
      padding: 8px 16px;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
      max-width: 100%;
    }
    
    .speech-input-card[state="recording"] {
       border: 1px solid var(--md-sys-color-primary);
       box-shadow: 0 4px 12px rgba(0,102,204,0.15);
    }
    
    .speech-preview {
      font-size: 14px;
      color: var(--md-sys-color-on-surface-variant);
      overflow: hidden;
      white-space: nowrap;
      width: 0;
      opacity: 0;
      transition: width 0.3s ease, opacity 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    
    .speech-input-card[state="recording"] .speech-preview,
    .speech-input-card[state="processing"] .speech-preview {
      width: 180px;
      opacity: 1;
    }
    
    .speech-cancel-btn {
      background: transparent;
      border: none;
      color: var(--md-sys-color-on-surface-variant);
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      display: none;
      align-items: center;
      justify-content: center;
    }
    
    .speech-cancel-btn:hover {
      background: var(--md-sys-color-surface-container-highest);
    }
    
    .speech-input-card[state="recording"] .speech-cancel-btn {
      display: flex;
    }

    .mic-btn {
      background: transparent; border: none; padding: 6px; cursor: pointer; color: var(--md-sys-color-on-surface); border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative;
    }
    .pulse {
      position: absolute; inset: 0; background: var(--md-sys-color-primary); border-radius: 50%; opacity: 0; transform: scale(0); transition: all 0.2s ease; z-index: -1;
    }
  `;

  render() {
    const isRecording = this._state === 'recording';
    
    return html`
      <div class="speech-input-card" state="${this._state}">
        <button class="mic-btn" @click="${this._toggleRecord}" style="color: ${isRecording ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)'}">
          <span class="material-symbols-outlined" style="font-size: 20px; transform: ${isRecording ? 'scale(0.8)' : 'scale(1)'}">${isRecording ? 'stop' : 'mic'}</span>
          <div class="pulse" style="opacity: ${isRecording ? '1' : '0'}; transform: ${isRecording ? 'scale(1)' : 'scale(0)'}"></div>
        </button>
        
        <div class="speech-preview">
          <span style="flex: 1; white-space: nowrap; overflow: hidden; mask-image: linear-gradient(to right, black 80%, transparent); -webkit-mask-image: linear-gradient(to right, black 80%, transparent);">${this._transcript}</span>
          <div style="width: 32px; height: 20px; opacity: ${isRecording ? '1' : '0'}; transition: opacity 0.3s ease;">
            <ui-live-waveform height="20" barWidth="2" barGap="1" sensitivity="2.5" ?active="${isRecording}"></ui-live-waveform>
          </div>
        </div>
        
        <button class="speech-cancel-btn" title="Cancel recording" @click="${this._cancel}">
          <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
        </button>
      </div>
    `;
  }

  private _toggleRecord() {
    if (this._state === 'idle') {
      this._state = 'recording';
      this._transcript = "Listening...";
      let wordIndex = 0;
      this._transcriptInterval = setInterval(() => {
        if (wordIndex < this._fakeTranscript.length) {
          if (wordIndex === 0) this._transcript = '';
          this._transcript += this._fakeTranscript[wordIndex];
          wordIndex++;
        }
      }, 400);
    } else if (this._state === 'recording') {
      clearInterval(this._transcriptInterval);
      this._state = 'processing';
      setTimeout(() => {
        this._state = 'success';
        setTimeout(() => {
           this._state = 'idle';
           this._transcript = "Listening...";
        }, 1500);
      }, 2000);
    }
  }

  private _cancel() {
    clearInterval(this._transcriptInterval);
    this._state = 'idle';
    this._transcript = "Listening...";
  }
}

/* ==========================================================================
   2. Podcast Player Example
   ========================================================================== */
@customElement('demo-podcast-player')
export class DemoPodcastPlayer extends LitElement {
  @query('#orb') private _orb!: any;

  static styles = css`
    :host { display: block; font-family: inherit; }
    .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; display: inline-block; line-height: 1; text-transform: none; letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr; }

    .custom-podcast-card {
      background: var(--md-sys-color-surface-container);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 320px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .custom-podcast-header { display: flex; gap: 16px; align-items: center; }
    .custom-podcast-art {
      width: 80px; height: 80px; border-radius: 8px; flex-shrink: 0;
      background: linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-secondary-container));
      display: flex; align-items: center; justify-content: center; overflow: hidden;
    }
    .custom-podcast-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .custom-podcast-title { margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--md-sys-color-on-surface); line-height: 1.2; }
    .custom-podcast-author { margin: 0; font-size: 0.85rem; color: var(--md-sys-color-on-surface-variant); }
    .custom-podcast-scrubber { display: flex; align-items: center; gap: 12px; }
  `;

  render() {
    return html`
      <ui-audio-provider src="https://storage.googleapis.com/scream-ui-samples/speech_sample-Orus-20260213-082038.wav" @state-change="${this._handleState}">
        <div class="custom-podcast-card">
          <div class="custom-podcast-header">
            <div class="custom-podcast-art">
              <ui-orb id="orb" agentState="idle"></ui-orb>
            </div>
            <div class="custom-podcast-info">
              <h4 class="custom-podcast-title">Episode 4: The WebComponent Revolution</h4>
              <p class="custom-podcast-author">By Orus The Storyteller</p>
            </div>
            <ui-audio-play-button></ui-audio-play-button>
          </div>
          <div class="custom-podcast-scrubber">
            <ui-audio-time-display format="elapsed"></ui-audio-time-display>
            <div style="flex: 1;"><ui-audio-progress-slider></ui-audio-progress-slider></div>
            <ui-audio-time-display format="remaining"></ui-audio-time-display>
          </div>
        </div>
      </ui-audio-provider>
    `;
  }

  private _handleState(e: CustomEvent) {
    if (this._orb) {
      this._orb.agentState = e.detail.isPlaying ? 'talking' : 'idle';
    }
  }
}

/* ==========================================================================
   3. Lyria Music Player
   ========================================================================== */
@customElement('demo-lyria-player')
export class DemoLyriaPlayer extends LitElement {
  @query('#music-provider') private _provider!: any;
  @query('#music-scroller') private _scroller!: any;

  static styles = css`
    :host { display: block; font-family: inherit; }
    .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; display: inline-block; line-height: 1; text-transform: none; letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr; }

    .music-player-card {
      background: var(--md-sys-color-surface-container);
      border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 16px;
      max-width: 400px; box-sizing: border-box; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .music-track-selector {
       display: flex; gap: 12px; align-items: center; border-bottom: 1px solid var(--md-sys-color-outline-variant); padding-bottom: 16px;
    }
    .music-controls {
       display: flex; justify-content: space-between; align-items: center;
    }
  `;

  render() {
    return html`
      <ui-audio-provider id="music-provider" src="https://storage.googleapis.com/scream-ui-samples/acoustic.wav" @state-change="${this._handleState}">
        <div class="music-player-card">
          <div class="music-track-selector">
            <span class="material-symbols-outlined" style="color: var(--md-sys-color-primary);">library_music</span>
            <select @change="${this._changeTrack}" style="flex: 1; padding: 8px; border-radius: 8px; border: 1px solid var(--md-sys-color-outline-variant); background: var(--md-sys-color-surface); color: var(--md-sys-color-on-surface); font-family: inherit;">
              <option value="https://storage.googleapis.com/scream-ui-samples/acoustic.wav">Calm Acoustic Guitar</option>
              <option value="https://storage.googleapis.com/scream-ui-samples/lofi.wav">Chill Lo-Fi Beat</option>
              <option value="https://storage.googleapis.com/scream-ui-samples/cinematic.wav">Cinematic Orchestral Brass</option>
            </select>
          </div>
          <div style="height: 60px; background: #000; border-radius: 8px; overflow: hidden; position: relative;">
             <ui-scrolling-waveform id="music-scroller" speed="50" height="60" barWidth="4" barGap="2" active="false"></ui-scrolling-waveform>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <ui-audio-time-display format="elapsed" style="font-size: 12px; opacity: 0.8;"></ui-audio-time-display>
            <div style="flex: 1;"><ui-audio-progress-slider></ui-audio-progress-slider></div>
            <ui-audio-time-display format="remaining" style="font-size: 12px; opacity: 0.8;"></ui-audio-time-display>
          </div>
          <div class="music-controls">
            <ui-audio-play-button></ui-audio-play-button>
            <ui-audio-volume-slider style="width: 140px; flex-shrink: 0;"></ui-audio-volume-slider>
          </div>
        </div>
      </ui-audio-provider>
    `;
  }

  private async _changeTrack(e: Event) {
    const select = e.target as HTMLSelectElement;
    if (this._provider) {
      this._provider.src = select.value;
      await this._provider.updateComplete;
      this._provider.play();
    }
  }

  private _handleState(e: CustomEvent) {
    const state = e.detail;
    if (this._scroller) {
      this._scroller.active = state.isPlaying;
      if (state.analyserNode) {
        this._scroller.analyserNode = state.analyserNode;
      }
    }
  }
}
