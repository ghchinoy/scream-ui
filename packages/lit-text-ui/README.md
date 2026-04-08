# Lit Text UI

A high-performance Canvas-based text editor component library for AI prompt experiences and synchronized audio-transcript playback, powered by [Pretext](https://github.com/chenglou/pretext) and [Lit](https://lit.dev/).

This library complements the `lit-audio-ui` package, focusing on text layout, kinetic lyrics rendering, and interactive editing, while avoiding the layout reflow bottlenecks common with traditional DOM-based text handling.

Take a look at the [interactive gallery and documentation](https://ghchinoy.github.io/scream-ui/) to see the components in action.

## Why Canvas Text?

When building experiences like real-time text generation (AI streaming) or sub-second word highlighting (synchronized TTS playback), typical HTML text rapidly triggers browser "layout thrashing".

By leveraging `@chenglou/pretext`, this library measures and renders multiline text directly to a `<canvas>`, making it ideal for 60fps animations, highlight syncing, and large volumes of streaming text.

## How to Use

### 1. Installation
```bash
npm install @ghchinoy/lit-text-ui
```

### 2. Import the Library
```javascript
// Import the entire library
import '@ghchinoy/lit-text-ui';

// Or import specific components
import '@ghchinoy/lit-text-ui/organisms/ui-audio-tag-editor.js';
import '@ghchinoy/lit-text-ui/atoms/ui-synced-transcript.js';
```

### 3. Required Fonts & Icons
This library inherits fonts from your host application. To ensure identical rendering in the canvas as standard DOM text, please explicitly define your fonts or inherit Material 3 design tokens:

```css
:root {
  --md-sys-typescale-body-large-font-family-name: "Inter", system-ui, sans-serif;
}
```

## Available Components

### 🧪 Atoms (Primitives)
*   **`<ui-synced-transcript>`**: A canvas-based text block that accepts word-level timestamps to provide smooth, sub-millisecond highlighting synchronized with audio playback.

### 🧬 Organisms (Composites)
*   **`<ui-audio-tag-editor>`**: A specialized text area with an interactive, autocomplete-driven dropdown for inserting and displaying "audio style tags" (e.g., `[laughing]`, `[short pause]`) as formatted pills over raw text.
*   **`<ui-chat-log>`**: A high-performance canvas log for large, streaming text generations.

## Customizing The `ui-audio-tag-editor`

The `ui-audio-tag-editor` component supports custom audio markup tags and adjustable rendering to match your API's required prompt formats.

```html
<ui-audio-tag-editor 
  .tags=${myCustomTags} 
  pillPadding="8"
  @change=${(e) => console.log('Raw prompt sent to API:', e.detail.value)}
></ui-audio-tag-editor>
```

Your `tags` property must implement the `AudioTag` interface:
```typescript
interface AudioTag {
  id: string;       // e.g., 'sigh' (translates to '[sigh]' in text)
  label: string;    // Displayed in the dropdown e.g. '[sigh]'
  category: string; // Used for coloring (e.g. 'Non-Speech', 'Style')
  description: string;
}
```

## 🎨 Theming

Customize colors via standard CSS variables (Material Design 3 compatible):

```css
:root {
  /* Colors */
  --md-sys-color-primary: #0066cc;
  --md-sys-color-surface-container-highest: #f5f5f5;
}
```

## 📚 Samples & Demos

Check out the following resources in the repository:
*   **[Interactive Gallery](../../samples/gallery)**: Comprehensive showcase of all components.

# License

Apache 2.0; see [`LICENSE`](LICENSE) for details.
