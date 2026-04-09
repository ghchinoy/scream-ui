
scream-ui is a Lit WebComponents pure css port of git@github.com:elevenlabs/ui.git


# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.
Run `bd prime` for workflow context, or install hooks (`bd hooks install`) for auto-injection.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Inter-Agent Communication
When working alongside other agents (e.g., in `scream-services`):
- **Reference Issue IDs:** Use specific `bd` IDs (e.g., `sui-7to`) to refer to bug fixes or feature completions.
- **Detailed Resolutions:** Always append a note (`--append-notes`) when closing an issue, explaining the impact on other systems or specific version numbers (e.g., "Fixed in v0.2.1").
- **Cross-Project Coordination:** If an issue in one project depends on a fix in another, note the foreign ID in the description or comments.

## Designing for AI Consumption (Agent-to-Agent)
- **Agnostic Logic:** Ensure "Mock" or "Simulation" logic is strictly optional (via properties). Agents building backends need to plug in real streams without fighting internal timers.
- **Context-First State:** Favor `@lit/context` for state sharing. It allows other agents to build bespoke "Composites" (like the Smart Textarea) using our atomic components without rewriting the logic.
- **Build Visibility:** When optimizing bundle size (e.g., dynamic imports), ensure sub-modules are still explicitly built and exported so other agents can `import` them granularly.
- **Theming via Tokens:** Rely on CSS variables for branding. This allows an agent working on a dashboard to re-brand the entire audio library via a single CSS file without touching the TypeScript source.

## Troubleshooting & Maintenance

### bd (Beads) Issues
If `bd` commands fail with "database disk image is malformed" or legacy errors:
1.  **Rebuild from JSONL:** `bd doctor --fix --source=jsonl` (Uses the JSONL files as the source of truth).
2.  **Legacy Fix:** If prompted about a legacy database, run `bd migrate --update-repo-id` to bind the DB to the current repo.
3.  **Sync:** Always run `bd sync` after recovery.

## Engineering Standards

### Monorepo & Workspace Guidelines
- **TSConfig Robustness:** Always use bare specifiers for extensions (e.g., `"extends": "gts/tsconfig-google.json"`) instead of relative paths like `./node_modules/...`. This ensures TypeScript can find configs regardless of hoisting.
- **CI/CD Consistency:** Avoid using `"prepare": "npm run build"` scripts inside individual workspace packages. During root `npm install`, npm may trigger these out of order, causing missing type errors (e.g., `TS2307`) if a dependency hasn't built yet. Rely on explicit, ordered build scripts in your CI pipeline instead.
- **Lockfile Sync & Native Bindings:** If package names or workspace structures change, run `npm install` at the root to regenerate the `package-lock.json`. In cross-platform CI environments (e.g., macOS dev to Linux CI), strict `npm ci` can sometimes fail to download architecture-specific native bindings (like `@rolldown/binding-linux-x64-gnu`). If this happens, use `rm -f package-lock.json && npm install` in your CI workflow to force resolution for the runner's architecture.
- **No Local File Dependencies for Publishing:** Never use local `file:../../` paths in `package.json` for dependencies if the package will be published to npm. Always use published npm versions (e.g., `^0.0.4`) to prevent installation failures for end users.
- **Stale JS Files in Source:** When porting or building with Vite/Rolldown, be aware that importing with `.js` extensions (e.g., `import './foo.js'`) can cause the bundler to silently pick up stale, previously compiled `.js` files if they are accidentally left in the `src/` directory alongside the `.ts` files. Always ensure `src/` is clean of build artifacts, and use a `"prepublishOnly": "npm run build"` script to guarantee fresh output.

### Asset Management (GCS vs Git)
- **Large Assets:** NEVER commit large audio files, high-res images, or video to the git repository.
- **Temporary Workflow:** Use the `sources/` directory (git-ignored) for local asset generation or processing.
- **Distribution:** Upload final assets to the public GCS bucket (`gs://scream-ui-samples/`) and reference them via public HTTPS URLs in the demo code.

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds


## Lit WebComponents Porting & Architecture Guidelines

When porting React/Tailwind/Radix components from `sources/ui/` into the `packages/lit-audio-ui/` library (or similar projects like `scream`), adhere strictly to these principles learned from the `sui-live-waveform` integration:

### 1. Framework Independence (No React, No Tailwind)
- **Do not wrap React components**. Rewrite them as pure native WebComponents using `LitElement`.
- **Component Exporting & Registration**: When adding new atomic elements to the library, you **must** export them in `packages/lit-audio-ui/src/index.ts`. Furthermore, when creating new gallery demos, ensure the demo component is explicitly imported in `samples/gallery/demo-layouts.ts`, otherwise the browser will silently fail to render the custom element.
- **Atomic Design Hierarchy**: Organize components into strict sub-directories: `atoms/` (primitives), `molecules/` (functional units), `organisms/` (composites), and `providers/` (headless state).
- **Explicit .js Extensions**: Every internal import in the `src/` directory **must** include the `.js` extension (e.g., `import {util} from './utils.js'`). Browsers performing native ESM resolution (and Vite during builds) will fail to resolve files without this extension, even if TypeScript is satisfied.
- **Replace Hooks**: `useRef` becomes `@query()`. `useEffect` for initialization becomes `firstUpdated()`. `useEffect` for reactive changes becomes `updated(changedProperties)`.
- **Three.js Uniform Reactivity**: When bridging Lit `@property` decorators to WebGL shader uniforms, do not rely solely on the animation loop. You must implement `updated(changedProperties)` to push the new property values directly into `this._mesh.material.uniforms` (e.g., `this._mesh.material.uniforms.uBaseHeight.value = this.baseHeight;`) to ensure the shader reacts instantly to DOM attribute changes.
- **Styling**: Translate Tailwind utility classes into scoped standard CSS within `static styles = css... `. Use Material Design 3 design tokens (`--md-sys-color-primary`) instead of hardcoded colors or Tailwind variables.
- **Theme Awareness**: Use `color-scheme: light dark;` on host elements. Components that use Canvas or Three.js (like `ui-orb`) must explicitly listen for theme changes to update internal uniforms. Use a `MutationObserver` on `document.documentElement` to watch for `class` attribute changes (`.dark`) and call a re-color method.
- **Resilient Rendering**: Never return an empty template (`if (!this.context) return html'';`) if a dependency is missing. Components must render a fallback state or placeholder to prevent "UI Blackouts" and allow for visual layout debugging.
- **Positioning in 3D Contexts**: Never use `positioning="fixed"` for dropdowns/menus if they might be nested inside 3D transformed containers (perspective/translateZ). Use `positioning="popover"` to leverage the modern Popover API and Anchor Positioning, preventing detached UI.
- **MWC Font Inheritance**: Material Web Components (MWC) often default to Roboto. Explicitly override these tokens in your styles to ensure they inherit the host project's typography:
  ```css
  md-menu-item { --md-menu-item-label-text-font: inherit; }
  md-outlined-text-field { --md-outlined-text-field-input-text-font: inherit; }
  ```
- **Controls**: Replace complex Radix primitives (like sliders or menus) with `@material/web` components (e.g., `<md-slider>`, `<md-filled-button>`).
- **Demo-as-Organism Pattern**: For complex interactive showcases, avoid writing global logic in `demo-app.ts`. Instead, build a local "Organism" component (e.g., `demo-chat-experience.ts`) that encapsulates the state, simulation logic, and internal IDs. This ensures the demo remains robust as components are moved or isolated.
- **Light DOM ID Lookups**: IDs projected via `<slot>` stay in the Light DOM. However, global scripts often face race conditions when looking them up. Favor an asynchronous "retry" or "find" pattern (polling) when targeting projected demo elements from a global script.
- **Layout Convention**: Center component showcase cards within their demo containers using `margin: 0 auto;` and a defined `max-width`.

### 2. Canvas & Audio Visualizer Math
The ElevenLabs UI components use highly tuned audio math. When porting this math, watch out for the following blind spots:

- **Frequency Spectrum Slicing**: The original code often uses arbitrary percentage cutoffs (e.g., `0.05 * length` to `0.4 * length`) assuming a low 16kHz sample rate. High-quality TTS models (like Gemini) output at 44.1kHz or 48kHz. **Human speech fundamentals live between 85Hz and 300Hz.** If you blindly copy a `0.05` cutoff on a 48kHz track with a 256/512 FFT size, you will chop off the entire body of the human voice and only render high-frequency "S" and "T" sibilance. Adjust the slice (e.g., `0` or `1` up to `0.3`) to capture the voice perfectly.
- **Symmetrical Rendering Math**: Avoid using `Array.push()` inside loop logic to build mirrored arrays (left side counting down, right side counting up). Float rounding errors during porting cause the array halves to overlap or duplicate. **Rule:** Pre-allocate the array (`new Array(barCount)`) and explicitly assign indices symmetrically (`newBars[centerIndex + i] = value; newBars[centerIndex - i] = value`).
- **Aliasing on Bars**: If your visualizer skips over frequencies because there are more bins than physical bars, you will miss audio peaks (causing flat visualizations). Calculate the **average energy** across the frequency bins that fall under that bar's physical width, rather than sampling a single index.
- **Visual Texture**: Linear frequency mapping clumps the vocal bass into a few bars. Apply a non-linear curve (e.g., `Math.pow(normalizedPosition, 1.5)`) to stretch the low frequencies across the center and compress the highs toward the edges. Add a noise gate (`Math.max(0, val - threshold)`) to prevent room noise from generating fat, solid blocks.
- **Safari/WebKit Canvas Blending Bugs**: Using `ctx.globalCompositeOperation = 'destination-out'` with a transparent gradient to fade the edges of a canvas often completely clips the canvas center in WebKit browsers due to hardware acceleration bugs. **Rule:** Invert the mask. Use `destination-in` and draw an *opaque* gradient over the parts of the canvas you want to keep.

### 3. Headless Debugging for Canvas UI
Visual components are difficult to verify blindly. Instead of relying solely on the user to check the browser rendering:
- **Write local Puppeteer tests**: Create temporary Node.js scripts using `puppeteer` and `express` in a `/scripts/testing/` directory. (Ensure this directory is in `.gitignore`).
- **Evaluate Internal State**: Use `page.evaluate()` to dump the internal Lit component arrays (e.g., `el._currentBars`) to the terminal.
- **Mock Interactions**: Programmatically trigger component states (e.g., `page.click('#btn-processing')`) and log the resulting math output. This drastically accelerates debugging for geometry and data mapping issues without needing visual confirmation for every small math tweak.

### 4. Architectural Patterns: Lit compound components via @lit/context
The `packages/lit-audio-ui` sub-project demonstrates an advanced Web Components architectural pattern for moving from "Monolithic" elements to "Compound" atomic elements.
If you need to build highly flexible layouts (like the `ui-audio-player`), follow this pattern:
1.  **Define a Protocol:** Create an interface for your state (e.g., `AudioPlayerState`) and export a `createContext()` token from `@lit/context`.
2.  **Create a Headless Provider:** Build a `<ui-audio-provider>` component that manages the internal logic (e.g. the `<audio>` tag and its event listeners). It should have `:host { display: contents; }` and use the `@provide({ context: myContextToken })` decorator on its state object. **Crucially, the provider must completely overwrite the state object reference (`this.state = {...this.state, newValues}`) to trigger reactive updates in consumers.**
3.  **Create Atomic Consumers:** Build small, single-purpose components (e.g., `<ui-audio-play-button>`, `<ui-audio-progress-slider>`). They use the `@consume({ context: myContextToken, subscribe: true })` decorator to receive the state and render UI.
This allows developers to write custom HTML layouts while sharing a single underlying state machine!

### 5. Live Streaming & Manual Provider Orchestration
When building applications that require real-time, duplex audio streaming (e.g., Gemini Live, ElevenLabs WebSockets), do not rely on the browser's standard `<audio>` tag or the automatic lifecycles of the UI providers.
*   **Use `manual` Mode:** Headless providers (like `<ui-speech-provider>`) should be set to `manual` mode. This stops them from imperatively calling `getUserMedia` or managing the `AudioContext`.
*   **Event-Driven Intent:** In manual mode, the provider strictly handles visual state syncing (button spinners, orb animations) and emits *intent* events (`@speech-request-start`).
*   **Application-Level Audio Routing:** The application layer must catch these intent events, handle the Web Audio API boilerplate (capturing the mic, converting `Float32` to `Int16` PCM, and managing the WebSocket connection), and then inject the resulting `AnalyserNode` and volume metrics back into the UI components.
*   **ScriptProcessor vs. AudioWorklet:** While `ScriptProcessorNode` is easier for simple demos, production agents must use `AudioWorklet` to process PCM chunks off the main UI thread to prevent audio stuttering during heavy DOM updates.