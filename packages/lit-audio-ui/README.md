# Lit Audio UI (Scream UI)

**Lit Audio UI** is a pure Web Components library providing highly polished, interactive audio UI components.

It translates complex React-based audio visualizers, 3D WebGL elements, and recording controls into native browser Web Components using [Lit](https://lit.dev/) and Material Design 3 tokens. By doing so, these components can be dropped into **any** web project—whether you use React, Vue, Angular, Svelte, or plain HTML—without requiring a Virtual DOM or specific CSS framework like Tailwind.

This repository is designed as a sister UI library to be consumed by applications like **Scream: Speech Arena**.

---

## 🎨 Available Components

The library currently ships with the following native WebComponents:

*   🎙️ **`<ui-voice-button>`**: A compound interactive button that dynamically mounts a live visualizer depending on its state. Cycles gracefully through `idle`, `recording`, `processing`, `success`, and `error` states.
*   📊 **`<ui-waveform>`**: A static, pre-computed scrubbable waveform timeline for audio playback visualization.
*   🌊 **`<ui-live-waveform>`**: A real-time visualizer that responds to an active `AudioContext`. Includes aggressive noise-gating, center-out mirroring, and a synthetic "processing" animation state.
*   🎵 **`<ui-audio-player>`**: A highly polished, customized audio player utilizing Material Web Components (`<md-slider>`, `<md-filled-icon-button>`) under the hood for a seamless playback experience.
*   🎛️ **`<ui-mic-selector>`**: Handles hardware microphone enumeration (`navigator.mediaDevices`), permissions, and displays a live audio preview directly inside a dropdown menu.
*   🎭 **`<ui-voice-picker>`**: A searchable dropdown menu (combobox) that handles rendering complex persona objects, including real-time audio previews injected directly into the menu items.

---

## 🙏 Gracious Attribution 

This project is deeply inspired by and serves as a direct port of the incredible open-source audio components designed and built by **[ElevenLabs](https://elevenlabs.io/)** (`@elevenlabs/ui`). 

We are incredibly grateful for their contribution to the open-source community. Their original React components provided the foundational audio mathematics, canvas drawing logic, and WebGL shader configurations that make these visualizers look buttery smooth and professionally polished. 

While ElevenLabs UI is locked to React, shadcn/ui, and Tailwind, this project liberates those designs into standard browser APIs.

---

## 🚀 How to Use (For Users)

As a Web Components library, you can use these elements directly in your HTML or inside any frontend framework.

### 1. Installation
Install the package via npm:
```bash
npm install scream-audio-ui
```

### 2. Import the Library
Import the components into your JavaScript/TypeScript entry point:
```javascript
// Import the entire library
import 'scream-audio-ui';

// Or import specific components
import 'scream-audio-ui/components/ui-voice-button';
import 'scream-audio-ui/components/ui-live-waveform';
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

---

## 🛠️ How to Build & Extend (For Developers)

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
   - `/src/components/`: This is where the Lit elements (`.ts`) live. Each component should be self-contained with its scoped CSS (`static styles`).
   - `/src/utils/`: Shared utilities, such as the `AudioContext` and FFT math ported from the original ElevenLabs repository.
   - `index.html`: The development workbench. Whenever you create a new component or port a feature, add a demo block here.

### Building for Production
To compile the TypeScript and bundle the library for distribution:
```bash
npm run build
```
This generates the optimized assets in the `/dist` folder.

### Linting & Formatting
We use `google/gts` (Google TypeScript Style) and the `eslint-plugin-lit` ruleset to enforce code quality and Lit best practices.
```bash
npm run lint  # Check for errors
npm run fix   # Auto-format code
```