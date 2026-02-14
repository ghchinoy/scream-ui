import {LitElement, html, css} from 'lit';
import {customElement, property, state, query} from 'lit/decorators.js';
import {provide} from '@lit/context';
import {
  audioPlayerContext,
  type AudioPlayerState,
} from '../utils/audio-context';

/**
 * A headless (invisible) WebComponent that manages an internal <audio> tag
 * and provides state to any child components via @lit/context.
 */
@customElement('ui-audio-provider')
export class UiAudioProvider extends LitElement {
  @property({type: String}) src = '';

  @query('audio') private _audioEl!: HTMLAudioElement;

  private _audioContext?: AudioContext;
  private _analyserNode?: AnalyserNode;
  private _mediaSource?: MediaElementAudioSourceNode;
  private _animationFrameId = 0;

  // The state object we provide to all children!
  @provide({context: audioPlayerContext})
  @state()
  public state: AudioPlayerState = {
    src: '',
    isPlaying: false,
    isBuffering: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    analyserNode: undefined,
    play: () => this.play(),
    pause: () => this.pause(),
    togglePlay: () => this._togglePlay(),
    seek: (time: number) => this._seek(time),
    setVolume: (volume: number) => this._setVolume(volume),
    toggleMute: () => this._toggleMute(),
  };

  static styles = css`
    :host {
      display: contents; /* We are completely invisible, just wrapping children */
    }
    audio {
      display: none;
    }
  `;

  render() {
    return html`
      <audio
        crossorigin="anonymous"
        src="${this.src}"
        preload="metadata"
        @loadedmetadata="${this._handleLoadedMetadata}"
        @ended="${this._handleEnded}"
        @playing="${this._handlePlaying}"
        @pause="${this._handlePause}"
        @waiting="${() => this._updateState({isBuffering: true})}"
        @canplay="${() => this._updateState({isBuffering: false})}"
        @error="${this._handleError}"
      ></audio>
      <slot></slot>
    `;
  }

  willUpdate(changed: Map<string, any>) {
    if (changed.has('src')) {
      this._updateState({
        src: this.src,
        isPlaying: false,
        currentTime: 0,
        error: undefined,
      });
    }
  }

  updated(changed: Map<string, any>) {
    if (changed.has('src') && this._audioEl) {
      // Force the browser to load the new audio file!
      this._audioEl.load();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
    }
    if (this._audioContext && this._audioContext.state !== 'closed') {
      this._audioContext.close();
    }
  }

  // --- State Mutators ---

  private _updateState(updates: Partial<AudioPlayerState>) {
    // We must create a new object reference so @lit/context detects the change
    // and re-renders consumers!
    this.state = {...this.state, ...updates};

    // Dispatch a standard DOM event so vanilla HTML/JS users can react to the player!
    this.dispatchEvent(
      new CustomEvent('state-change', {
        detail: this.state,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _setupAudioContext() {
    if (this._audioContext || !this._audioEl) return;
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      this._audioContext = new AudioContextClass();
      this._analyserNode = this._audioContext.createAnalyser();
      this._analyserNode.fftSize = 256;
      this._analyserNode.smoothingTimeConstant = 0.8;

      this._mediaSource = this._audioContext.createMediaElementSource(
        this._audioEl,
      );
      this._mediaSource.connect(this._analyserNode);
      this._analyserNode.connect(this._audioContext.destination);

      this._updateState({analyserNode: this._analyserNode});
    } catch (e) {
      console.warn('Failed to set up AudioContext for visualizer:', e);
    }
  }

  public play() {
    if (!this._audioEl.src) return;
    this._setupAudioContext();
    if (this._audioContext?.state === 'suspended') {
      this._audioContext.resume();
    }
    this._audioEl.play().catch(e => {
      console.error('Error playing audio', e);
      this._updateState({error: 'Playback failed'});
    });
  }

  public pause() {
    if (!this._audioEl) return;
    this._audioEl.pause();
  }

  private _togglePlay() {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  private _seek(time: number) {
    if (!this._audioEl) return;
    this._audioEl.currentTime = time;
    this._updateState({currentTime: time});
  }

  private _setVolume(volume: number) {
    if (!this._audioEl) return;
    this._audioEl.volume = volume;
    this._updateState({volume, muted: volume === 0});
  }

  private _toggleMute() {
    if (!this._audioEl) return;
    this._audioEl.muted = !this._audioEl.muted;
    this._updateState({muted: this._audioEl.muted});
  }

  // --- Audio Event Listeners ---

  private _handleLoadedMetadata() {
    this._updateState({duration: this._audioEl.duration});
  }

  private _handleEnded() {
    this._updateState({isPlaying: false, currentTime: 0});
    this._audioEl.currentTime = 0;
  }

  private _handlePlaying() {
    this._updateState({isPlaying: true, isBuffering: false, error: undefined});
    this._startTrackingTime();
  }

  private _handlePause() {
    this._updateState({isPlaying: false});
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
    }
  }

  private _handleError() {
    this._updateState({
      error: 'Error loading audio',
      isPlaying: false,
      isBuffering: false,
    });
  }

  private _startTrackingTime() {
    const track = () => {
      if (this._audioEl && this.state.isPlaying) {
        // Only trigger an update if the time actually changed significantly,
        // otherwise we flood Lit's render loop.
        const diff = Math.abs(
          this.state.currentTime - this._audioEl.currentTime,
        );
        if (diff > 0.05) {
          this._updateState({currentTime: this._audioEl.currentTime});
        }
        this._animationFrameId = requestAnimationFrame(track);
      }
    };
    this._animationFrameId = requestAnimationFrame(track);
  }
}
