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

### 2. Registry Collision Mitigation (CRITICAL)
In plain HTML/back-end environments (Go, Python), browsers may crash if Material Web components are loaded multiple times (e.g., `md-elevation` error).
- **Solution:** Use a "Fat Bundle" (single-file library) OR an **Import Map**.
- **Import Map Example:**
  ```html
  <script type="importmap">
  {
    "imports": {
      "lit": "https://esm.sh/lit@3.3.1",
      "@material/web/": "https://esm.sh/@material/web@2.0.0/"
    }
  }
  </script>
  ```

### 3. State-Driven Visuals (The "Sentiment" Pattern)
Drive visual components like `<ui-orb>` using application-specific logic.
- **Pattern:** Map market/AI sentiment to the `colors` property.
- **Example:** Green ramps for `improving`, red/warm ramps for `worsening`.
- **Manual Mode:** Set `volumeMode="manual"` to explicitly pass `inputVolume` (mic) and `outputVolume` (agent) for precise synchronization.

### 4. Visualizer "Bridge" Logic
Most visual components require an `analyserNode`. 
- They attempt to consume this from context automatically.
- **Tip:** When bridging to Gemini Live, manually map the PCM byte stream volume to the orb's `inputVolume` or `outputVolume`.

### 5. Theming & Branding (Zero-JS)
The library uses Material Design 3 tokens. Use these for dark-theme consistency:
- `--md-sys-color-primary`: Main theme color.
- `--ui-speech-wave-color`: Custom color for waveforms inside buttons.

### 6. Component Utility Registry
- `<ui-audio-time-display>`: Use `format="elapsed"` or `format="remaining"` for single values.
- `<ui-spectrum-visualizer>`: Requires a `.height` property for reliable rendering.

## Simulation Mode
For development without microphone access, enable the `simulation` property on `<ui-speech-provider>`. This generates procedural audio data and mock transcription events.

## Quality Gates
- **CORS:** Ensure `crossorigin="anonymous"` is set on audio/video tags.
- **Layout:** Use `positioning="popover"` for `md-menu` inside 3D containers.
- **Performance:** In plain HTML projects, prefer the single-file `.es.js` bundle to minimize network waterfall.
