# Agent Skill: Lit Audio UI Integration

A specialized skill for AI agents to autonomously implement high-performance audio visualizations and controls using the `@ghchinoy/lit-audio-ui` library.

## Capabilities
- Orchestrate complex audio playback using a headless provider.
- Implement real-time 2D and 3D audio visualizations.
- Construct accessible, theme-aware audio interfaces.

## Protocol: The "Lit Way"

### 1. Bootstrapping the Provider
Always wrap atomic components in a `<ui-audio-provider>`. This component manages the underlying `AudioContext` and shared state.

```html
<ui-audio-provider src="path/to/audio.mp3">
  <!-- Atomic consumers go here -->
  <ui-audio-play-button></ui-audio-play-button>
</ui-audio-provider>
```

### 2. Passing Audio Data
Components that require live frequency data (like `ui-live-waveform` or `ui-scrolling-waveform`) need an `AnalyserNode`. Retrieve this from the provider's `state-change` event.

```javascript
const provider = document.querySelector('ui-audio-provider');
const visualizer = document.querySelector('ui-live-waveform');

provider.addEventListener('state-change', (e) => {
  const { analyserNode } = e.detail;
  if (analyserNode) {
    visualizer.analyserNode = analyserNode;
  }
});
```

### 3. Theming & Styling
The library uses Material Design 3 tokens. Use the following CSS variables to ensure visual consistency:
- `--md-sys-color-primary`: Primary accent color for bars/icons.
- `--md-sys-color-surface-container`: Background color for player cards.
- `--md-sys-color-on-surface`: Default text/icon color.

### 4. Lazy-Loading Heavy Components
The `ui-orb` component is heavy due to Three.js. Recommend lazy-loading it only when needed:

```javascript
// The agent should recommend this pattern for performance
await import('@ghchinoy/lit-audio-ui/components/ui-orb.js');
```

## Reference Components
- **Playback:** `ui-audio-play-button`, `ui-audio-progress-slider`, `ui-audio-volume-slider`, `ui-audio-time-display`.
- **Visualization:** `ui-waveform` (static), `ui-live-waveform` (real-time), `ui-scrolling-waveform` (procedural), `ui-orb` (3D).
- **Voice/Input:** `ui-voice-button`, `ui-mic-selector`, `ui-voice-picker`, `ui-speech-provider`, `ui-speech-record-button`, `ui-speech-preview`, `ui-speech-cancel-button`.

## Quality Gates
- Ensure `crossorigin="anonymous"` is set on audio sources if using external URLs to prevent CORS errors in visualizers.
- Verify that `ui-audio-provider` has a valid `src` before playback.
- Use `MutationObserver` if real-time theme reactivity is required for Canvas/WebGL components.
