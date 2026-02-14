import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {provide} from '@lit/context';
import {
  speechContext,
  type SpeechContext,
  type SpeechState,
} from '../utils/speech-context';

@customElement('ui-speech-provider')
export class UiSpeechProvider extends LitElement {
  @provide({context: speechContext})
  @state()
  private _context: SpeechContext = {
    state: 'idle',
    transcript: '',
    partialTranscript: '',
    start: () => this.start(),
    stop: () => this.stop(),
    cancel: () => this.cancel(),
  };

  @property({type: String}) state: SpeechState = 'idle';

  private _stream?: MediaStream;
  private _audioCtx?: AudioContext;
  private _analyser?: AnalyserNode;
  private _transcriptInterval?: any;
  private _fakeTranscript = [
    'I',
    ' am',
    ' recording',
    ' a',
    ' message',
    ' using',
    ' atomic',
    ' components...',
  ];

  static styles = css`
    :host {
      display: contents;
    }
  `;

  willUpdate(changedProperties: Map<string, any>) {
    if (changedProperties.has('state')) {
      this._updateContext({state: this.state});
    }
  }

  async start() {
    if (this._context.state !== 'idle') return;

    try {
      this._updateContext({state: 'connecting'});

      this._stream = await navigator.mediaDevices.getUserMedia({audio: true});

      // Set up audio analysis for visualizers
      if (!this._audioCtx) {
        this._audioCtx = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      const source = this._audioCtx.createMediaStreamSource(this._stream);
      this._analyser = this._audioCtx.createAnalyser();
      this._analyser.fftSize = 256;
      source.connect(this._analyser);

      this._updateContext({
        state: 'recording',
        analyserNode: this._analyser,
        transcript: '',
        partialTranscript: 'Listening...',
      });

      // Start mock transcription
      let wordIndex = 0;
      this._transcriptInterval = setInterval(() => {
        if (wordIndex < this._fakeTranscript.length) {
          if (wordIndex === 0) {
            this._updateContext({partialTranscript: ''});
          }
          const current = this._context.partialTranscript;
          this._updateContext({
            partialTranscript: current + this._fakeTranscript[wordIndex],
          });
          wordIndex++;
        }
      }, 500);

      this.dispatchEvent(
        new CustomEvent('speech-start', {
          bubbles: true,
          composed: true,
          detail: {stream: this._stream},
        }),
      );
    } catch (err) {
      console.error('Failed to start speech recording', err);
      this._updateContext({
        state: 'error',
        error: (err as Error).message,
      });
    }
  }

  stop() {
    if (this._context.state !== 'recording') return;

    clearInterval(this._transcriptInterval);
    this._cleanupStream();
    this._updateContext({
      state: 'processing',
      transcript: this._context.partialTranscript,
      partialTranscript: '',
    });

    this.dispatchEvent(
      new CustomEvent('speech-stop', {
        bubbles: true,
        composed: true,
      }),
    );

    // Mock processing for now - in real world, this waits for final transcript
    setTimeout(() => {
      if (this._context.state === 'processing') {
        this._updateContext({state: 'success'});
        setTimeout(() => this.cancel(), 2000);
      }
    }, 1500);
  }

  cancel() {
    clearInterval(this._transcriptInterval);
    this._cleanupStream();
    this._updateContext({
      state: 'idle',
      transcript: '',
      partialTranscript: '',
      analyserNode: undefined,
    });

    this.dispatchEvent(
      new CustomEvent('speech-cancel', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _cleanupStream() {
    if (this._stream) {
      this._stream.getTracks().forEach(track => track.stop());
      this._stream = undefined;
    }
  }

  private _updateContext(update: Partial<SpeechContext>) {
    this._context = {
      ...this._context,
      ...update,
    };
    // If external state was provided, sync it
    if (update.state) {
      this.state = update.state;
    }

    this.dispatchEvent(
      new CustomEvent('state-change', {
        bubbles: true,
        composed: true,
        detail: this._context,
      }),
    );
  }

  render() {
    return html`<slot></slot>`;
  }
}
