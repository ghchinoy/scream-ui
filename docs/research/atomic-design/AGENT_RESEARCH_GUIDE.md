# Agent Instruction: Atomic Design Deep-Dive

## Objective
Analyze the current `lit-audio-ui` component library and propose a formal refactor to align with Brad Frost's Atomic Design principles.

## Research Areas

### 1. Component Hierarchy
- Review `packages/lit-audio-ui/src/components/`.
- Classify every component into its appropriate bucket: **Atom**, **Molecule**, or **Organism**.
- **Constraint:** Atoms should have NO dependencies on other library components.

### 2. State & Context Mapping
- Identify which components currently consume `@lit/context`.
- **Goal:** Determine if context-consumption is a valid indicator of a **Molecule** or **Organism**.
- Should Atoms remain "pure" (props-only) to increase reusability outside of our providers?

### 3. CSS Variable Strategy
- Analyze how "Atoms" share design tokens.
- Propose a way to manage shared styles (typography, primary colors) without duplicating CSS in every Shadow DOM.

### 4. Naming & Export Strategy
- Propose a naming convention that signals the component level (e.g., `ui-atom-play-button` vs `ui-play-button`).
- Analyze the impact of a directory-based export strategy:
  `@ghchinoy/lit-audio-ui/atoms`
  `@ghchinoy/lit-audio-ui/molecules`

## Success Criteria
1.  **A component map:** A JSON or Markdown list of all components categorized by level.
2.  **A refactor plan:** A step-by-step proposal for moving files and updating exports.
3.  **A "Sub-atomic" proposal:** Guidelines for how Design Tokens (CSS Variables) are inherited from the root to the atoms.

## Reference
- See `docs/research/atomic-design/PRIMER_AND_ANALYSIS.md` for existing component classification.
