# Lit Audio UI

A lightweight, framework-agnostic Web Components library for high-performance audio visualization and control, built natively for the browser using [Lit](https://lit.dev/).

Take a look at the [interactive gallery and documentation](https://ghchinoy.github.io/scream-ui/) to see the components in action.

## Why Lit Web Components?

When building complex, high-frequency audio visualizers (like real-time canvas waveforms), performance and bundle size are critical. By leveraging **Lit** and native Web Components, this library offers distinct advantages:

* **Microscopic Footprint:** No massive framework runtimes. Lit simply provides lightweight, reactive syntactic sugar over standard browser APIs.
* **Blazing Fast Canvas & Audio:** Direct DOM access means no Virtual DOM bottlenecks when piping 60fps data directly into `<canvas>` elements.
* **Framework Agnostic:** Compiles to standard HTML tags. Drop these into React, Vue, Angular, Svelte, or vanilla HTML with zero friction.
* **Atomic Design:** Organized into **Atoms, Molecules, Organisms, and Providers** for maximum reusability.

## How to Use (For AI Agents)

If you are an AI coding agent integrating this library into an application, please refer to the [AGENT_SKILL.md](https://github.com/ghchinoy/scream-ui/blob/main/packages/lit-audio-ui/AGENT_SKILL.md) for specialized integration protocols, state management patterns, and "Zero-JS" branding guidelines.

## How to Use (For Users)

### 1. Installation
```bash
npm install @ghchinoy/lit-audio-ui
```

### 2. Import the Library
```javascript
// Import the entire library
import '@ghchinoy/lit-audio-ui';

// Or import specific categories for better tree-shaking
import '@ghchinoy/lit-audio-ui/atoms/ui-audio-play-button.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-live-waveform.js';
```

### 3. Use in HTML
Once imported, custom elements are registered and used like standard HTML tags:

```html
<!-- Example: A voice recording button -->
<ui-voice-button state="idle" label="Start Recording"></ui-voice-button>

<!-- Example: An audio visualizer canvas linked to an AnalyserNode -->
<ui-live-waveform .analyserNode="${myAudioAnalyser}"></ui-live-waveform>
```

## Available Components

### 🧪 Atoms (Primitives)
*   **`<ui-audio-play-button>`**: Context-aware play/pause toggle.
*   **`<ui-audio-next-button>` / `<ui-audio-prev-button>`**: Playlist navigation buttons.
*   **`<ui-audio-progress-slider>`**: Reactive scrubber for playback.
*   **`<ui-audio-time-display>`**: Flexible time visualizer (elapsed, remaining, combined).
*   **`<ui-speech-record-button>`**: Atomic trigger for recording context.
*   **`<ui-shimmering-text>`**: Pure CSS text loading effect.

### 🧬 Molecules (Functional Units)
*   **`<ui-live-waveform>`**: Real-time visualizer for an active `AudioContext`.
*   **`<ui-spectrum-visualizer>`**: Traditional frequency-bar spectrum.
*   **`<ui-orb>`**: 3D WebGL (Three.js) agent visualizer.
*   **`<ui-3d-flip>`**: Layout utility for 3D card-flipping interactions.
*   **`<ui-playlist>`**: Reactive list component for queue management.
*   **`<ui-mic-selector>`**: Hardware enumeration and permission handler.
*   **`<ui-voice-picker>`**: Searchable persona selector with audio previews.

### 🧩 Providers (State)
*   **`<ui-audio-provider>`**: Headless state machine for playback and playlists.
*   **`<ui-speech-provider>`**: Headless lifecycle manager for voice recording (Auto, Simulation, or Manual mode).

## Theming (Material Design 3)

Customize colors and typography via standard CSS variables:

```css
:root {
  --md-sys-color-primary: #0066cc;
  --ui-speech-record-color: #ff4444; /* Custom branding */
  --ui-speech-preview-font-size: 18px;
}
```

## Acknowledgements

Deeply inspired by the beautiful, open-source audio components built by **[ElevenLabs](https://elevenlabs.io/)** (`@elevenlabs/ui`). This project reimplement those designs as standard, universal browser APIs.

# License

Apache 2.0; see [`LICENSE`](LICENSE) for details.
