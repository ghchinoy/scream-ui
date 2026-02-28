# Framework Integration Guide

`@ghchinoy/lit-audio-ui` is built using standard Web Components (Lit), making it compatible with any frontend framework. However, some frameworks (like React) require a bit of boilerplate to handle custom events and property syncing.

This guide provides lightweight "recipes" to make the library feel native in your framework of choice.

## React

React doesn't automatically sync data to Web Component properties or listen to custom events via JSX. Use these hooks to bridge the gap.

### `useAudioState` Hook

Copy this into your project (e.g., `hooks/use-audio-state.ts`):

```typescript
import { useState, useEffect, RefObject } from 'react';
import type { AudioPlayerState } from '@ghchinoy/lit-audio-ui';

export function useAudioState(ref: RefObject<any>) {
  const [state, setState] = useState<AudioPlayerState | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleStateChange = (e: CustomEvent<AudioPlayerState>) => {
      setState({ ...e.detail });
    };

    el.addEventListener('state-change', handleStateChange);
    // Initial state capture
    if (el.state) setState({ ...el.state });

    return () => el.removeEventListener('state-change', handleStateChange);
  }, [ref]);

  return state;
}
```

### Usage Example

```tsx
import { useRef } from 'react';
import { useAudioState } from './hooks/use-audio-state';
import '@ghchinoy/lit-audio-ui';

function MyPlayer() {
  const providerRef = useRef(null);
  const audioState = useAudioState(providerRef);

  return (
    <div>
      <ui-audio-provider ref={providerRef} src="audio.mp3">
        <ui-audio-play-button></ui-audio-play-button>
        {audioState?.isPlaying && <p>Now Playing...</p>}
      </ui-audio-provider>
    </div>
  );
}
```

## Vue 3

Vue has excellent support for Web Components. Simply enable them in your Vite/Vue config and use `@` for events.

### Config

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('ui-')
        }
      }
    })
  ]
})
```

### Usage

```vue
<script setup>
import { ref } from 'vue';
import '@ghchinoy/lit-audio-ui';

const audioState = ref(null);
const handleState = (e) => {
  audioState.value = e.detail;
};
</script>

<template>
  <ui-audio-provider src="track.mp3" @state-change="handleState">
    <ui-audio-play-button />
    <span v-if="audioState?.isPlaying">Playing</span>
  </ui-audio-provider>
</template>
```

## Svelte

Svelte works natively with Web Components. No special configuration is required.

```svelte
<script>
  import '@ghchinoy/lit-audio-ui';
  let isPlaying = false;

  function handleState(e) {
    isPlaying = e.detail.isPlaying;
  }
</script>

<ui-audio-provider src="music.mp3" on:state-change={handleState}>
  <ui-audio-play-button />
  {#if isPlaying}
    <p>Music is live!</p>
  {/if}
</ui-audio-provider>
```

## Strict TypeScript Environments (GTS)
When using the library in projects with strict TypeScript rules (like `gts`), you can import explicit element types to avoid `Unexpected any` errors when calling component methods directly.

```ts
import type { AudioProviderElement, SpeechProviderElement } from '@ghchinoy/lit-audio-ui';

// Example: Accessing the provider directly
const provider = document.querySelector('ui-audio-provider') as AudioProviderElement;
provider.play();
console.log(provider.state.currentTime);
```

