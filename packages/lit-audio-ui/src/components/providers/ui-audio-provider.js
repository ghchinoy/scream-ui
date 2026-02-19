var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { audioPlayerContext, } from '../../utils/audio-context.js';
/**
 * A headless (invisible) WebComponent that manages an internal <audio> tag
 * and provides state to any child components via @lit/context.
 * It also handles playlist orchestration and auto-advancing tracks.
 */
let UiAudioProvider = class UiAudioProvider extends LitElement {
    constructor() {
        super(...arguments);
        this.src = '';
        this.items = [];
        this.autoAdvance = true;
        this._animationFrameId = 0;
        // The state object we provide to all children!
        this.state = {
            src: '',
            isPlaying: false,
            isBuffering: false,
            currentTime: 0,
            duration: 0,
            volume: 1,
            muted: false,
            items: [],
            currentIndex: -1,
            autoAdvance: true,
            analyserNode: undefined,
            play: () => this.play(),
            pause: () => this.pause(),
            togglePlay: () => this._togglePlay(),
            seek: (time) => this._seek(time),
            setVolume: (volume) => this._setVolume(volume),
            toggleMute: () => this._toggleMute(),
            next: () => this.next(),
            previous: () => this.previous(),
            select: (index) => this.select(index),
        };
    }
    static { this.styles = css `
    :host {
      display: contents; /* We are completely invisible, just wrapping children */
    }
    audio {
      display: none;
    }
  `; }
    render() {
        return html `
      <audio
        crossorigin="anonymous"
        src="${this.src}"
        preload="metadata"
        @loadedmetadata="${this._handleLoadedMetadata}"
        @ended="${this._handleEnded}"
        @playing="${this._handlePlaying}"
        @pause="${this._handlePause}"
        @waiting="${() => this._updateState({ isBuffering: true })}"
        @canplay="${() => this._updateState({ isBuffering: false })}"
        @error="${this._handleError}"
      ></audio>
      <slot></slot>
    `;
    }
    willUpdate(changed) {
        if (changed.has('src')) {
            this._updateState({
                src: this.src,
                isPlaying: false,
                currentTime: 0,
                error: undefined,
            });
        }
        if (changed.has('items')) {
            this._updateState({ items: this.items });
            // If we have items but no src, initialize to the first item
            if (this.items.length > 0 &&
                !this.src &&
                this.state.currentIndex === -1) {
                this.select(0);
            }
        }
        if (changed.has('autoAdvance')) {
            this._updateState({ autoAdvance: this.autoAdvance });
        }
    }
    updated(changed) {
        if (changed.has('src') && this._audioEl) {
            // Force the browser to load the new audio file!
            this._audioEl.load();
            // If it was playing, keep playing
            if (this.state.isPlaying) {
                this.play();
            }
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
    _updateState(updates) {
        // We must create a new object reference so @lit/context detects the change
        // and re-renders consumers!
        this.state = { ...this.state, ...updates };
        // Dispatch a standard DOM event so vanilla HTML/JS users can react to the player!
        this.dispatchEvent(new CustomEvent('state-change', {
            detail: this.state,
            bubbles: true,
            composed: true,
        }));
    }
    _setupAudioContext() {
        if (this._audioContext || !this._audioEl)
            return;
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this._audioContext = new AudioContextClass();
            this._analyserNode = this._audioContext.createAnalyser();
            this._analyserNode.fftSize = 256;
            this._analyserNode.smoothingTimeConstant = 0.8;
            this._mediaSource = this._audioContext.createMediaElementSource(this._audioEl);
            this._mediaSource.connect(this._analyserNode);
            this._analyserNode.connect(this._audioContext.destination);
            this._updateState({ analyserNode: this._analyserNode });
        }
        catch (e) {
            console.warn('Failed to set up AudioContext for visualizer:', e);
        }
    }
    play() {
        if (!this._audioEl.src)
            return;
        this._setupAudioContext();
        if (this._audioContext?.state === 'suspended') {
            this._audioContext.resume();
        }
        this._audioEl.play().catch(e => {
            console.error('Error playing audio', e);
            this._updateState({ error: 'Playback failed' });
        });
    }
    pause() {
        if (!this._audioEl)
            return;
        this._audioEl.pause();
    }
    _togglePlay() {
        if (this.state.isPlaying) {
            this.pause();
        }
        else {
            this.play();
        }
    }
    _seek(time) {
        if (!this._audioEl)
            return;
        this._audioEl.currentTime = time;
        this._updateState({ currentTime: time });
    }
    _setVolume(volume) {
        if (!this._audioEl)
            return;
        this._audioEl.volume = volume;
        this._updateState({ volume, muted: volume === 0 });
    }
    _toggleMute() {
        if (!this._audioEl)
            return;
        this._audioEl.muted = !this._audioEl.muted;
        this._updateState({ muted: this._audioEl.muted });
    }
    next() {
        if (this.items.length === 0)
            return;
        const nextIndex = (this.state.currentIndex + 1) % this.items.length;
        this.select(nextIndex);
    }
    previous() {
        if (this.items.length === 0)
            return;
        const prevIndex = (this.state.currentIndex - 1 + this.items.length) % this.items.length;
        this.select(prevIndex);
    }
    select(index) {
        if (index >= 0 && index < this.items.length) {
            const track = this.items[index];
            this.src = track.src;
            this._updateState({
                currentIndex: index,
                src: track.src,
                currentTime: 0,
                transcript: track.transcript,
            });
        }
    }
    // --- Audio Event Listeners ---
    _handleLoadedMetadata() {
        this._updateState({ duration: this._audioEl.duration });
    }
    _handleEnded() {
        if (this.autoAdvance && this.items.length > 0) {
            // If we're at the last track, loop back to start
            this.next();
            this.play();
        }
        else {
            this._updateState({ isPlaying: false, currentTime: 0 });
            this._audioEl.currentTime = 0;
        }
    }
    _handlePlaying() {
        this._updateState({ isPlaying: true, isBuffering: false, error: undefined });
        this._startTrackingTime();
    }
    _handlePause() {
        this._updateState({ isPlaying: false });
        if (this._animationFrameId) {
            cancelAnimationFrame(this._animationFrameId);
        }
    }
    _handleError() {
        this._updateState({
            error: 'Error loading audio',
            isPlaying: false,
            isBuffering: false,
        });
    }
    _startTrackingTime() {
        const track = () => {
            if (this._audioEl && this.state.isPlaying) {
                // Only trigger an update if the time actually changed significantly,
                // otherwise we flood Lit's render loop.
                const diff = Math.abs(this.state.currentTime - this._audioEl.currentTime);
                if (diff > 0.05) {
                    this._updateState({ currentTime: this._audioEl.currentTime });
                }
                this._animationFrameId = requestAnimationFrame(track);
            }
        };
        this._animationFrameId = requestAnimationFrame(track);
    }
};
__decorate([
    property({ type: String })
], UiAudioProvider.prototype, "src", void 0);
__decorate([
    property({ type: Array })
], UiAudioProvider.prototype, "items", void 0);
__decorate([
    property({ type: Boolean })
], UiAudioProvider.prototype, "autoAdvance", void 0);
__decorate([
    query('audio')
], UiAudioProvider.prototype, "_audioEl", void 0);
__decorate([
    provide({ context: audioPlayerContext }),
    state()
], UiAudioProvider.prototype, "state", void 0);
UiAudioProvider = __decorate([
    customElement('ui-audio-provider')
], UiAudioProvider);
export { UiAudioProvider };
//# sourceMappingURL=ui-audio-provider.js.map