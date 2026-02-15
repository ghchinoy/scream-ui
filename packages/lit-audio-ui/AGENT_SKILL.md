# Agent Skill: Lit Audio UI Integration

A specialized skill for AI agents to autonomously implement high-performance audio visualizations and controls using the `@ghchinoy/lit-audio-ui` library.

## Capabilities
- Orchestrate complex audio playback using a headless provider.
- Implement real-time 2D and 3D audio visualizations.
- Construct accessible, theme-aware audio interfaces.

## Protocol: The "Lit Way"

### 1. Bootstrapping the Provider
Always wrap atomic components in a `<ui-audio-provider>` (for playback) or `<ui-speech-provider>` (for recording). These components manage the state machine and shared context.

### 2. Headless Backend Orchestration (Manual Mode)
For production integrations with a backend/agent, use `manual` mode. This prevents the provider from auto-starting local media and allows the backend to drive the state.

```html
<ui-speech-provider manual .state="${backendState}" @speech-request-start="${onMicClick}">
  <ui-speech-record-button></ui-speech-record-button>
</ui-speech-provider>
```

### 3. Passing Audio Data
Components requiring live frequency data (like `ui-live-waveform`) need an `AnalyserNode`. Retrieve this from the provider's `state-change` event.

### 4. Theming & Branding (Zero-JS)
The library uses Material Design 3 tokens with semantic overrides. Use these for instant branding:
- `--md-sys-color-primary`: Main theme color.
- `--ui-speech-record-color`: Custom color for the record button active state.
- `--ui-speech-wave-color`: Custom color for the recording/preview waveform.
- `--ui-speech-preview-font-size`: Custom typography for transcription text.

### 5. Positioning in 3D Environments
If a component (like `ui-mic-selector`) is inside a 3D transformed container (perspective/translateZ), ensure `md-menu` uses `positioning="popover"` to prevent detachment.

### 6. Lazy-Loading Heavy Components
The `ui-orb` component is heavy (Three.js). Always use dynamic imports for it:
```javascript
await import('@ghchinoy/lit-audio-ui/components/ui-orb.js');
```

## Simulation Mode
For development without microphone access, enable the `simulation` property on `<ui-speech-provider>`. This generates procedural audio data and mock transcription events.

## Quality Gates
- Ensure `crossorigin="anonymous"` is set on audio/video tags to allow analysis.
- Use `color-scheme: light dark;` on host elements to support native dark-mode sensitivity.
- Verify that `manual` mode handlers clear intervals/timeouts during state transitions.
