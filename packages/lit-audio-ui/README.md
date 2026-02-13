# Lit Audio UI (Scream UI)

A pure Web Components (Lit) library for highly polished, interactive audio UI components.

## Purpose

This project is a framework-agnostic port of modern audio UI components. It translates complex React-based audio visualizers, 3D WebGL elements, and recording controls into native browser Web Components using [Lit](https://lit.dev/). By doing so, these components can be dropped into **any** web project—whether you use React, Vue, Angular, Svelte, or plain HTML—without requiring a Virtual DOM or specific CSS framework like Tailwind.

## Gracious Attribution 

This project is deeply inspired by and serves as a direct port of the incredible open-source audio components designed and built by **[ElevenLabs](https://elevenlabs.io/)** (`@elevenlabs/ui`). 

We are incredibly grateful for their contribution to the open-source community. Their original React components provided the foundational audio mathematics, canvas drawing logic, and WebGL shader configurations that make these visualizers look buttery smooth and professionally polished.

## How to Use (For Users)

As a Web Components library, you can use these elements directly in your HTML or inside any frontend framework.

### 1. Installation
Install the package via npm (assuming you are linking it locally or publishing it):
```bash
npm install scream-audio-ui
```

### 2. Import the Library
Import the components into your JavaScript/TypeScript entry point:
```javascript
// Import the entire library
import 'scream-audio-ui';

// Or import specific components
import 'scream-audio-ui/components/scream-voice-button';
```

### 3. Use in HTML
Once imported, the custom elements are registered with the browser and can be used like standard HTML tags:

```html
<!-- Example: A voice recording button -->
<scream-voice-button state="idle"></scream-voice-button>

<!-- Example: An audio visualizer canvas -->
<sui-live-waveform .data="${audioDataArray}"></sui-live-waveform>
```

*Note: These components utilize Material Design 3 design tokens (`--md-sys-color-*`). Ensure you have a Material theme loaded or define the CSS variables manually for the best visual experience.*

## How to Build & Extend (For Developers)

We welcome contributions! If you want to extend the components, tweak the canvas math, or add new visualizers, here is how you can get started.

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Local Development Setup

1. **Clone & Install**
   ```bash
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
   - `/src/utils/`: Shared utilities, such as the `AudioContext` and FFT math ported from the original ElevenLabs React repository.
   - `index.html`: The development workbench. Whenever you create a new component or port a feature, add a demo block here.

### Building for Production
To compile the TypeScript and bundle the library for distribution:
```bash
npm run build
```
This generates the optimized assets in the `/dist` folder.

### Linting
We use ESLint and the `eslint-plugin-lit` ruleset to enforce code quality and Lit best practices.
```bash
npm run lint
```
