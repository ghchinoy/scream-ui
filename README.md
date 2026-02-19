# Scream UI (Monorepo)

A pure Lit WebComponents port of the beautiful [ElevenLabs UI](https://github.com/elevenlabs/ui) components.

This repository is a monorepo containing the core component library and its development sources. It is designed with **Atomic Design** principles and is optimized for autonomous AI agent integration.

## 📂 Repository Structure

-   **`packages/lit-audio-ui/`**: The primary, framework-agnostic component library.
    -   `src/components/atoms/`: Basic building blocks (buttons, sliders, labels).
    -   `src/components/molecules/`: Functional units (waveforms, pickers, visualizers).
    -   `src/components/organisms/`: Complex composite components.
    -   `src/components/providers/`: Headless context providers for state management.
-   **`sources/ui/`**: The original React/Tailwind/Radix source code from ElevenLabs (used as porting reference).
-   **`docs/research/`**: Architectural analysis and primers (e.g., Atomic Design strategy).

## 🚀 Key Features

-   **Native WebComponents:** Built with [Lit](https://lit.dev/), these components work in ANY framework (React, Vue, Angular, etc.) or vanilla HTML.
-   **Zero-JS Branding:** Completely customizable via standard CSS variables, MD3 tokens, and newly added spacing/density tokens.
-   **Accessibility First:** Comprehensive ARIA support with dynamic labels that react to playback and recording states.
-   **High-Performance Visualizers:** Real-time 2D Canvas and 3D WebGL (Three.js) audio visualizations.
-   **Agent Optimized:** Includes specialized `AGENT_SKILL.md` protocols for AI coding agents to autonomously build complex audio interfaces.

## 📖 Quick Links

-   **[Live Demo & Component Gallery](https://ghchinoy.github.io/scream-ui/)**
-   **[Atomic Design Primer](docs/research/atomic-design/PRIMER_AND_ANALYSIS.md)** (Local)
-   **[Framework Integration Guide](packages/lit-audio-ui/FRAMEWORKS.md)** (React, Vue, Svelte)
-   **[Agent Integration Protocol](packages/lit-audio-ui/AGENT_SKILL.md)**

## 🛠 Getting Started

This project uses **NPM Workspaces**. Always run installation from the root.

### 1. Initial Setup
```bash
npm install    # Run once at the root to link all packages
npm run build  # Build the library and all samples
```

### 2. Explore the Gallery
```bash
cd samples/gallery
npm run dev
```
Visit `http://localhost:5173/scream-ui/`

### 3. Try the Reference Agent
```bash
cd samples/reference-agent
npm run dev
```
Visit `http://localhost:5173/`

---

# License

Apache 2.0; see [`LICENSE`](LICENSE) for details.

# Disclaimer

This project is not an official Google project. It is not supported by Google and Google specifically disclaims all warranties as to its quality, merchantability, or fitness for a particular purpose.
