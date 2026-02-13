# Integration Strategy: Scream App & Scream Audio UI

This document outlines the strategy for adopting the `scream-audio-ui` Web Component library within the `scream` sister application.

## 1. Audit of Scream Frontend Components

The `scream` frontend currently utilizes numerous bespoke audio components that manage their own state, styling, and AudioContexts. We have identified the following candidates for replacement or refactoring:

*   **Visualizers:**
    *   `p5-audio-visualizer.ts`: Custom P5.js frequency visualizer.
        *   *Target:* Replace with `<ui-live-waveform>`.
    *   `scream-visualizer-container.ts`: Toggles between visualizers.
        *   *Target:* Update to mount `<ui-live-waveform>` instead of the P5 canvas.
*   **Voice Selection:**
    *   `voice-presets-selector.ts`, `read-aloud-voice-card.ts`, `story-cast-card.ts`: These files contain hardcoded arrays of Gemini voices (e.g., Zephyr, Orus, Puck) and custom `<select>` menus.
        *   *Target:* Consolidate using `<ui-voice-picker>`.
*   **Audio Playback:**
    *   `scream-footer-player.ts`: A monolithic, sticky footer player connected to a global `playbackContext`.
        *   *Target:* Re-architect using the Compound Audio layout (`<ui-audio-provider>`, `<ui-audio-play-button>`, `<ui-audio-progress-slider>`).
    *   `voice-result-card.ts`, `voice-sample-card.ts`: Use native `<audio>` tags for result playback.
        *   *Target:* Replace with the classic preset `<ui-audio-player>` for instant visual consistency.
*   **Recording & Input:**
    *   `recognition-controls.ts`, `voice-replication-view.ts`: Use basic buttons for recording state.
        *   *Target:* Upgrade to `<ui-voice-button>` to get the built-in state machine (idle -> recording -> processing) and the integrated micro-visualizer.
    *   `mic-selector` (if implemented natively): Use `<ui-mic-selector>`.

## 2. Gap Analysis & Library Improvements

To ensure a seamless integration, the `scream-audio-ui` library requires a few adjustments to support the `scream` application's specific data structures and UX needs:

1.  **Voice Picker Data Structure:**
    *   *Gap:* `ui-voice-picker` expects `{voiceId, name, previewUrl, labels}`. The `scream` app heavily relies on `{name, tone}` for Gemini voices.
    *   *Solution:* The `scream` app should include an adapter function to map its internal voice arrays into the `Voice` interface expected by `ui-voice-picker`. No library change needed.
2.  **Global Playback Orchestration:**
    *   *Gap:* `scream-footer-player.ts` reads from a global `playbackContext`. Our `<ui-audio-provider>` manages local state.
    *   *Solution:* In the `scream` app, the `ScreamFooterPlayer` component should render the `<ui-audio-provider>` and bind its `src` property reactively to the global `playbackState.currentUrl`.
3.  **PCM Streaming Playback:**
    *   *Gap:* `scream` uses a custom `PCMPlayer` for streaming TTS chunks.
    *   *Solution:* `<ui-live-waveform>` only requires an `AnalyserNode`. The `PCMPlayer` class in `scream` must expose its internal `AnalyserNode` so it can be passed to `<ui-live-waveform>` during live streaming.

## 3. ElevenLabs UI Gap Mitigation

A review of the original ElevenLabs UI React components revealed the following patterns that have been successfully mapped to our Lit WebComponents implementation:

1.  **Compound Transcription Layouts:**
    *   *ElevenLabs Approach:* `speech-input.tsx` uses atomic components (`<SpeechInput>`, `<SpeechInputRecordButton>`, `<SpeechInputPreview>`) driven by a central React Hook (`useScribe`).
    *   *Lit Mitigation:* We built a proof-of-concept "Compound Speech Input Architecture" in our `index.html` demo. It proves that the atomic `<ui-voice-button>` can be seamlessly wrapped in custom CSS grids and standard DOM event listeners to achieve the exact same UX—an expanding text bubble that shows partial transcripts during the `recording` state and gracefully collapses when idle—without requiring complex third-party state managers.

2.  **Voice Picker Previews:**
    *   *ElevenLabs Approach:* Injects an invisible `<audio>` player inside the combobox menu to play samples when hovering/selecting.
    *   *Lit Mitigation:* `ui-voice-picker` already implements this natively using a localized `HTMLAudioElement` that tracks the current `previewingVoiceId`, matching the functionality without overhead.

3.  **Loading States:**
    *   *ElevenLabs Approach:* `shimmering-text.tsx` uses heavy `framer-motion` calculations to animate a CSS mask.
    *   *Lit Mitigation:* Added `<ui-shimmering-text>` utilizing pure CSS `@keyframes` and `IntersectionObserver`. This is ready to replace any standard "Loading..." text strings across the `scream` app (e.g., during "I'm Feeling Lucky" script generation or Read Aloud orchestration).

## 4. Final Recommendations for `scream` Frontend

1.  **Adopt Compound `<ui-audio-provider>`:** Immediately replace `scream-footer-player.ts` with the new `@lit/context` provider pattern to vastly improve codebase maintainability.
2.  **Consolidate Comboboxes:** Deprecate `voice-presets-selector.ts` and replace it with `<ui-voice-picker>`. Write a simple data-mapping function in the `scream` application to convert `{name, tone}` pairs to the required `{voiceId, name, labels}` schema.
3.  **Replace P5.js:** Rip out `p5-audio-visualizer.ts` and `scream-visualizer-container.ts`. Mount the much lighter `<ui-live-waveform>` and pass it the active `AnalyserNode` from the `PCMPlayer`.
4.  **Enhance Transcription UX:** Use the new "Compound Speech Input" HTML/CSS pattern from the library's demo page to upgrade the `recognition-controls.ts` tab, providing users with instant, shimmering transcription feedback inline with the recording button.
