# Agent Skill: Lit Audio UI Integration

A specialized skill for AI agents to autonomously implement high-performance audio visualizations and controls using the `@ghchinoy/lit-audio-ui` library.

## Capabilities
- Orchestrate complex audio playback using a headless provider.
- Implement real-time 2D and 3D audio visualizations (Orb, Waveforms, Spectrum).
- Construct accessible, theme-aware audio interfaces.
- Manage multi-track playlists with automatic state synchronization.

## Protocol: The "Lit Way"

### 1. Bootstrapping the Provider
Always wrap atomic components in a `<ui-audio-provider>` (for playback) or `<ui-speech-provider>` (for recording). These components manage the state machine and shared context.

### 2. Playlist & State Synchronization
When using `<ui-audio-provider>` with the `items` property:
- Listen to the `@state-change` event on the provider.
- Use `e.detail.currentIndex` to synchronize your parent component's metadata (e.g., Title, Artist, Album Art).
- The provider handles internal track advancing automatically when `autoAdvance` is true.

### 3. Visualizer "Bridge" Logic
Most visual components (`ui-orb`, `ui-spectrum-visualizer`, `ui-live-waveform`) require an `analyserNode`. 
- They attempt to consume this from context automatically.
- **Tip:** Ensure the provider has finished initializing its AudioContext (triggered by the first user interaction) before expecting visualizations to appear.

### 4. Theming & Branding (Zero-JS)
The library uses Material Design 3 tokens with semantic overrides. Use these for dark-theme consistency:
- `--md-sys-color-primary`: Main theme color (e.g., `#d0bcff`).
- `--md-sys-color-surface-container-low`: Primary background for pickers and lists.
- `--ui-speech-wave-color`: Custom color for waveforms inside buttons (prevents 'black-on-black' issues).
- `--md-list-item-label-text-color`: high-contrast text color for playlists.

### 5. Layout & 3D Environments
If a component is inside a 3D transformed container (perspective/translateZ):
- Ensure `md-menu` (inside pickers) uses `positioning="popover"`.
- Use the `<ui-3d-flip>` utility for compact "back-of-card" tracklists.
- Apply `font-family: inherit` to library components to avoid default serif fonts.

### 6. Component Utility Registry
- `<ui-audio-time-display>`: Defaults to `full` mode (`current / total`). Use `format="elapsed"` or `format="remaining"` for single values.
- `<ui-spectrum-visualizer>`: Requires a `.height` property for reliable rendering.

## Simulation Mode
For development without microphone access, enable the `simulation` property on `<ui-speech-provider>`. This generates procedural audio data and mock transcription events.

## Quality Gates
- Ensure `crossorigin="anonymous"` is set on audio/video tags to allow analysis.
- Use `color-scheme: light dark;` on host elements to support native dark-mode sensitivity.
- Verify that `manual` mode handlers clear intervals/timeouts during state transitions.
