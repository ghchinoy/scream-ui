# Atomic Design: Primer & Library Analysis (v2 - Agent Research Integrated)

## Part 1: The Atomic Design Primer (Lit Adaptation)
Atomic Design, pioneered by Brad Frost, is a hierarchical mental model for creating user interfaces. In Lit, this moves from abstract theory to native implementation via Custom Elements and Shadow DOM.

### The Five Stages
1.  **Atoms:** The foundational building blocks (Hydrogen). "Dumb" components like `<ui-button>`. Immutable and stateless.
2.  **Molecules:** Groups of atoms bonded together (H2O). Specialized wrappers like `<ui-search-field>` that handle local interaction logic.
3.  **Organisms:** Complex UI sections that are **Context-Aware**. They subscribe to data (e.g., `<ui-media-player>`) and orchestrate molecules.
4.  **Templates:** Layout engines. Content-agnostic skeletons using **Named Slots** to define structure.
5.  **Pages:** The Data Orchestrators. "Smart" components connected to API/Global State that populate templates.

---

## Part 2: Structural Mapping Matrix

| Atomic Stage | Lit Role / Pattern | State Responsibility | Data Flow |
| :--- | :--- | :--- | :--- |
| **Atom** | Presentational | Stateless | Props Down / Events Up |
| **Molecule** | Composite | Minimal (Ephemeral) | Slot-based Composition |
| **Organism** | Mediator | Domain (Partial) | Context / Signals |
| **Template** | Layout | Layout Grid | Multi-Slot Composition |
| **Page** | Container | Application Owner | Global Store / API |

---

## Part 3: Current Library Audit (`lit-audio-ui`)

### 🧪 Atoms
- `ui-audio-play-button`, `ui-audio-next-button`, `ui-audio-time-display`, etc.
- **Rule:** MUST NOT import contexts or services.

### 🧬 Molecules
- `ui-mic-selector`, `ui-voice-picker`.
- **Refinement:** Should prioritize slotting for icons/buttons to allow consumer customization.

### 🦠 Organisms
- `ui-audio-player`.
- **Promoted:** `ui-media-dashboard`, `ui-album-card` (from demo to library).

---

## Part 4: Construction Principles for AI Agents
To ensure inter-agent reliability, the following rules are now enforced:

1.  **The "Dumb" Atom Rule:** Atoms must have maximum configurability via CSS Variables and zero side effects.
2.  **Slot-over-Data:** Prefer `<slot>` based composition for Molecules and Organisms. Avoid passing complex JSON arrays for rendering children; allow the parent to inject components.
3.  **Explicit Context indicators:** Any component consuming `@lit/context` is automatically classified as a **Molecule** or **Organism**.
4.  **Positioning:** Use `positioning="popover"` for Atoms/Molecules that require overlays to ensure compatibility with 3D Organisms (perspective/transform contexts).

---

## Part 5: Implementation Roadmap
1.  **Modularize Exports:** Update `package.json` to reflect `atoms/`, `molecules/`, etc.
2.  **Sanitize Atoms:** Remove any accidental context dependencies from the Atom layer.
3.  **Standardize Templates:** Extract layout logic from `index.html` into reusable `<ui-layout-...>` templates.
