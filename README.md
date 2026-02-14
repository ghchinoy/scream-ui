# Lit Audio UI

A lightweight, framework-agnostic Web Components library for high-performance audio visualization and control, built natively for the browser using [Lit](https://lit.dev/).

## Why Lit Web Components?

When building complex, high-frequency audio visualizers (like real-time canvas waveforms), performance and bundle size are critical. Traditional React/ShadcnUI libraries often bring significant overhead due to Virtual DOM reconciliation loops and heavy CSS framework dependencies (like Tailwind).

By leveraging **Lit** and native Web Components, this library offers distinct advantages:

* **Microscopic Footprint:** No massive framework runtimes. Lit simply provides lightweight, reactive syntactic sugar over standard browser APIs.
* **Blazing Fast Canvas & Audio:** Direct DOM access means no Virtual DOM bottlenecks when piping 60fps `AnalyserNode` data directly into `<canvas>` elements.
* **Framework Agnostic:** Because they compile to standard HTML tags (e.g., `<ui-live-waveform>`), you can drop these components into **any** frontend stack—React, Vue, Angular, Svelte, or vanilla HTML—with zero friction.
* **Scoped Styling:** Uses standard CSS variables and Material Design 3 tokens. No Tailwind installation, complex class merging, or CSS-in-JS runtime required.
* **Atomic Composition:** Powered by `@lit/context`, the complex monolithic audio players are broken down into atomic, highly composable state machines.

## How to Use the Lit Components (For Users)

As a Web Components library, you can use these elements directly in your HTML or inside any frontend framework.

### 1. Installation
Install the package via npm (assuming you are linking it locally or publishing it):
```bash
npm install ui-audio
```

### 2. Import the Library
Import the components into your JavaScript/TypeScript entry point:
```javascript
// Import the entire library
import 'ui-audio';

// Or import specific components
import 'ui-audio/components/ui-voice-button';
import 'ui-audio/components/ui-live-waveform';
```

### 3. Use in HTML
Once imported, the custom elements are registered with the browser and can be used like standard HTML tags:

```html
<!-- Example: A voice recording button -->
<ui-voice-button state="idle" label="Start Recording"></ui-voice-button>

<!-- Example: An audio visualizer canvas linked to an AnalyserNode -->
<ui-live-waveform .analyserNode="${myAudioAnalyser}"></ui-live-waveform>
```

### 4. Theming (Material Design 3)
These components are deeply theme-aware and utilize Material Design 3 design tokens. To customize their colors (or support light/dark modes), simply define the CSS variables in your stylesheet:

```css
:root {
  --md-sys-color-primary: #0066cc;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-surface-container: #f3f3f3;
  /* ...other MD3 tokens */
}

.dark {
  --md-sys-color-primary: #a8c7fa;
  --md-sys-color-on-primary: #003062;
  --md-sys-color-surface-container: #212121;
}
```

## Available Components

The library currently ships with the following native WebComponents:

*   🎙️ **`<ui-voice-button>`**: A compound interactive button that dynamically mounts a live visualizer depending on its state. Cycles gracefully through `idle`, `recording`, `processing`, `success`, and `error` states.
*   📊 **`<ui-waveform>`**: A static, pre-computed scrubbable waveform timeline for audio playback visualization.
*   🌊 **`<ui-live-waveform>`**: A real-time visualizer that responds to an active `AudioContext`. Includes aggressive noise-gating, center-out mirroring, and a synthetic "processing" animation state.
*   〰️ **`<ui-scrolling-waveform>`**: An infinitely scrolling procedural audio visualization animation. Perfect for active "listening" states where a live `AnalyserNode` is unavailable.
*   🎵 **`<ui-audio-player>`**: A classic monolithic pill-shaped audio player.
*   🧩 **Compound Audio Architecture**: Use `<ui-audio-provider>`, `<ui-audio-play-button>`, `<ui-audio-progress-slider>`, and `<ui-audio-time-display>` to construct entirely custom audio layouts powered by a headless state machine via `@lit/context`.
*   ✨ **`<ui-shimmering-text>`**: A pure CSS, dependency-free text loading effect translating complex gradients into native `@keyframes`.
*   🎛️ **`<ui-mic-selector>`**: Handles hardware microphone enumeration (`navigator.mediaDevices`), permissions, and displays a live audio preview directly inside a dropdown menu.
*   🎭 **`<ui-voice-picker>`**: A searchable dropdown menu (combobox) that handles rendering complex persona objects, including real-time audio previews injected directly into the menu items.


## How to Build & Extend (For Developers)

We welcome contributions! If you want to extend the components, tweak the canvas math, or add new visualizers, here is how you can get started.

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Local Development Setup

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd packages/lit-audio-ui
   npm install
   ```

2. **Start the Dev Server**
   This will start a local Vite development server. It serves the `index.html` file, which acts as our component workbench and functional test bed.
   ```bash
   npm run dev
   ```

3. **Code Structure**
   - `/packages/lit-audio-ui/src/components/`: This is where the Lit elements (`.ts`) live. Each component should be self-contained with its scoped CSS (`static styles`).
   - `/packages/lit-audio-ui/src/utils/`: Shared utilities, such as the `AudioContext` and FFT math ported from the original ElevenLabs React repository.
   - `/packages/lit-audio-ui/index.html`: The development workbench. Whenever you create a new component or port a feature, add a demo block here.

### Building for Production
To compile the TypeScript and bundle the library for distribution:
```bash
cd packages/lit-audio-ui
npm run build
```
This generates the optimized assets in the `/dist` folder.

### Linting
We use `google/gts` (Google TypeScript Style) and the `eslint-plugin-lit` ruleset to enforce code quality and Lit best practices.
```bash
cd packages/lit-audio-ui
npm run lint
npm run fix
```


## Acknowledgements

This project is deeply inspired by the beautiful, open-source audio components designed and built by **[ElevenLabs](https://elevenlabs.io/)** (`@elevenlabs/ui`). 

We are incredibly grateful for their contribution to the open-source community. Their original repository provided the foundational audio mathematics, canvas drawing logic, and WebGL shader configurations that make these visualizers look buttery smooth. While their library focuses heavily on the React ecosystem, this project reimagines those beautiful designs as standard, universal browser APIs.

# License

Apache 2.0; see [`LICENSE`](LICENSE) for details.


# Disclaimer

This project is not an official Google project. It is not supported by
Google and Google specifically disclaims all warranties as to its quality,
merchantability, or fitness for a particular purpose.