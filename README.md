# Scream UI (Monorepo)

A pure Lit WebComponents port of the beautiful [ElevenLabs UI](https://github.com/elevenlabs/ui) components.

This repository is a monorepo containing the core component library and its development sources. It is designed with **Atomic Design** principles and is optimized for autonomous AI agent integration.

[![lit-audio-ui](https://img.shields.io/npm/v/@ghchinoy/lit-audio-ui?label=%40ghchinoy%2Flit-audio-ui)](https://www.npmjs.com/package/@ghchinoy/lit-audio-ui)
[![lit-text-ui](https://img.shields.io/npm/v/@ghchinoy/lit-text-ui?label=%40ghchinoy%2Flit-text-ui)](https://www.npmjs.com/package/@ghchinoy/lit-text-ui)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)

## 🚀 Key Features

-   **Native WebComponents:** Built with [Lit](https://lit.dev/), these components work in ANY framework (React, Vue, Angular, etc.) or vanilla HTML.
-   **Zero-JS Branding:** Completely customizable via standard CSS variables, MD3 tokens, and spacing/density tokens.
-   **Accessibility First:** Comprehensive ARIA support with dynamic labels that react to playback and recording states.
-   **High-Performance Visualizers:** Real-time 2D Canvas and 3D WebGL (Three.js) audio visualizations.
-   **Canvas-Based Text Layout:** Accurate, DOM-independent text measurement and layout using `@chenglou/pretext`.
-   **Agent Optimized:** Includes specialized `AGENT_SKILL.md` protocols for AI coding agents to autonomously build complex audio interfaces.

## 📦 Installation

The components are published to npm as standard, framework-agnostic WebComponents:

```bash
npm install @ghchinoy/lit-audio-ui   # audio & speech components
npm install @ghchinoy/lit-text-ui    # canvas-based text/transcript editor (depends on lit-audio-ui)
```

**Peer dependencies:** `lit ^3.3.1`, `@material/web ^2.0.0`, `@lit/context ^1.1.6`, and (for 3D visualizers) `three >=0.150.0`.

## ⚡ Quick Usage

Import the library (this registers all custom elements), then drop the tags into your HTML — works in any framework or plain HTML:

```html
<!-- Audio playback -->
<ui-audio-provider id="audio-prov">
  <ui-audio-player-error></ui-audio-player-error>
  <ui-audio-play-button></ui-audio-play-button>
  <ui-audio-progress-slider></ui-audio-progress-slider>
</ui-audio-provider>

<!-- Speech recording -->
<ui-speech-provider simulation>
  <ui-speech-record-button size="sm"></ui-speech-record-button>
  <ui-voice-waveform height="24"></ui-voice-waveform>
  <ui-speech-cancel-button></ui-speech-cancel-button>
</ui-speech-provider>

<script type="module">
  import '@ghchinoy/lit-audio-ui';

  const audioProv = document.getElementById('audio-prov');
  audioProv.src = 'https://example.com/sample.wav';
</script>
```

For smaller bundles, import only the components you need via subpaths:

```js
import '@ghchinoy/lit-audio-ui/molecules/ui-orb.js';
import { computeAudioPeaks } from '@ghchinoy/lit-audio-ui/utils/audio-utils.js';
```

See the [reference-agent sample](samples/reference-agent/) for a complete minimal example, and the [**live gallery**](https://ghchinoy.github.io/scream-ui/) for every component in action.

## 🧩 Component Overview

`@ghchinoy/lit-audio-ui` (custom elements are prefixed `ui-`):

-   **Providers:** `ui-audio-provider`, `ui-speech-provider` — headless state/context for the components below.
-   **Atoms:** play/next/prev buttons, progress & volume sliders, time display, record/cancel buttons, `ui-voice-waveform`, `ui-message-bubble`, and more.
-   **Molecules:** `ui-waveform`, `ui-live-waveform`, `ui-spectrum-visualizer`, `ui-orb`, `ui-voice-picker`, `ui-playlist`, `ui-conversation-bar`, `ui-chat-list`, and more.
-   **Organisms:** `ui-audio-player` (full composite player).

`@ghchinoy/lit-text-ui`: `ui-audio-tag-editor`, `ui-synced-transcript`, `ui-chat-log`.

Browse the full, interactive inventory in the [gallery](https://ghchinoy.github.io/scream-ui/).

## 📂 Repository Structure

-   **`packages/lit-audio-ui/`**: The primary, framework-agnostic component library.
    -   `src/components/atoms/`: Basic building blocks (buttons, sliders, labels).
    -   `src/components/molecules/`: Functional units (waveforms, pickers, visualizers).
    -   `src/components/organisms/`: Complex composite components.
    -   `src/components/providers/`: Headless context providers for state management.
-   **`packages/lit-text-ui/`**: A specialized, high-performance canvas-based text editor for prompt and audio tag editing powered by `@chenglou/pretext`.
-   **`samples/`**: Example applications demonstrating library usage.
    -   `gallery/`: The interactive component documentation and playground. **(This is the only sample hosted online — see [Live Demo](https://ghchinoy.github.io/scream-ui/).)**
    -   `reference-agent/`: A minimalist implementation for AI agents to follow.
    -   `live-connection/`: Real-time WebSocket streaming demo.
    -   `a2a-showcase/`: Agent-to-Agent interactive UI playground (Go backend + Lit frontend).
-   **`sources/`**: Reference material — the original UI screenshots, audio-tag notes, and design sources used to build the components.
-   **`docs/`**: Project documentation, including the [Releasing Guide](docs/RELEASING.md).

## 📖 Quick Links

-   **[Live Demo & Component Gallery](https://ghchinoy.github.io/scream-ui/)**
-   **[Framework Integration Guide](packages/lit-audio-ui/FRAMEWORKS.md)** (React, Vue, Svelte)
-   **[Agent Integration Protocol](packages/lit-audio-ui/AGENT_SKILL.md)**
-   **[Releasing Guide](docs/RELEASING.md)**

## 🛠 Developing Locally

Want to build the library from source, browse the samples, or contribute? This project uses **NPM Workspaces** and provides a `Makefile` for convenience.

### Prerequisites

-   **Node.js 20+** and **npm** (the CI builds on Node 20).
-   **Go 1.24+** — only required for the `a2a-showcase` sample.

### 1. Initial Setup

Always run installation from the repository root:

```bash
npm install    # Run once at the root to link all workspaces
make build     # Build the library and all samples
```

### 2. Explore the Gallery

```bash
make samples-gallery
```

Visit the local URL provided by Vite (e.g., `http://localhost:5173/scream-ui/`).

### 3. Try the Reference Agent

```bash
make samples-reference-agent
```

### Other Samples

```bash
make samples-live-connection   # Real-time WebSocket streaming demo
make samples-a2a-showcase      # A2A showcase — see note below
```

> **Note on `a2a-showcase`:** This sample is a hybrid app. `make samples-a2a-showcase` (via `npm run dev`) launches the Vite frontend **and** two Go backends concurrently: a host/app-shell on port `8080` and an autonomous agent on port `8081`. It requires **Go 1.24+** and a local checkout of [`a2a-go`](https://github.com/a2aproject/a2a-go) at the `replace` path declared in `samples/a2a-showcase/go.mod`. See [`samples/a2a-showcase/docs/architecture.md`](samples/a2a-showcase/docs/architecture.md) for details.

To see all available commands, run `make` or `make help` in the root directory.

### Note on Hosting

Only the **gallery** is deployed to GitHub Pages (via `.github/workflows/deploy-pages.yml`). The other samples — including `a2a-showcase` — are intended to be run locally with the commands above.

---

# License

Apache 2.0; see [`LICENSE`](LICENSE) for details.

# Disclaimer

This project is not an official Google project. It is not supported by Google and Google specifically disclaims all warranties as to its quality, merchantability, or fitness for a particular purpose.
