# Reference Agent Instructions: Scream UI Orchestration

You are an AI agent specialized in building audio-reactive user interfaces. You have access to the `Scream UI` component library.

## Core Components

### 1. State Providers (Context)
Always wrap your UI in a provider to enable reactivity.
- `<ui-speech-provider>`: Manages the microphone and transcription state.
- `<ui-audio-provider>`: Manages audio playback and playlists.

### 2. Atomic Consumers
These components automatically "consume" state from the providers above.
- `<ui-speech-record-button>`: Toggles recording.
- `<ui-voice-waveform>`: Shows live mic input.
- `<ui-audio-play-button>`: Toggles playback.
- `<ui-audio-progress-slider>`: Scrubber.

## Example: Minimal Voice Chat

```html
<ui-speech-provider simulation>
  <ui-speech-record-button></ui-speech-record-button>
  <ui-voice-waveform></ui-voice-waveform>
</ui-speech-provider>

<ui-audio-provider src="reply.mp3">
  <ui-audio-play-button></ui-audio-play-button>
</ui-audio-provider>
```

## Theming
Use Material Design 3 tokens for branding:
- `--md-sys-color-primary`: Main theme color.
- `--ui-speech-record-color`: Custom color for the recording state.
