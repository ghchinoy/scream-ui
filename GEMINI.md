
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
- **Replace Hooks**: `useRef` becomes `@query()`. `useEffect` for initialization becomes `firstUpdated()`. `useEffect` for reactive changes becomes `updated(changedProperties)`.
- **Styling**: Translate Tailwind utility classes into scoped standard CSS within `static styles = css... `. Use Material Design 3 design tokens (`--md-sys-color-primary`) instead of hardcoded colors or Tailwind variables.
- **Controls**: Replace complex Radix primitives (like sliders or menus) with `@material/web` components (e.g., `<md-slider>`, `<md-filled-button>`).

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