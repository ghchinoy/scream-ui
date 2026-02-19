# Live Connection Sample (Manual Provider Mode)

This sample demonstrates how to build a real-time, duplex audio streaming client using `@ghchinoy/lit-audio-ui`.

When integrating with backend streaming APIs (like Gemini Live or ElevenLabs WebSockets), you cannot rely on the browser's standard `<audio>` tag. You need low-level access to PCM audio buffers, both for sending microphone data to the server and for playing the server's synthesized responses.

## Why "Manual" Mode?

The library provides a headless `<ui-speech-provider>` that usually handles the microphone lifecycle automatically. However, in a real streaming architecture, the *application* needs to coordinate the microphone with the WebSocket connection. 

By setting `manual` on the provider:
```html
<ui-speech-provider manual>
```
1. The provider **stops** automatically calling `navigator.mediaDevices.getUserMedia()`.
2. Instead, it fires `@speech-request-start` and `@speech-request-stop` events when the user clicks the Voice Button.
3. Your application catches these events, handles the raw Web Audio API logic (PCM conversion, WebSockets), and then explicitly syncs its state back down into the provider so the UI components (like the `ui-orb`) animate correctly.

## Key Web Audio Patterns Demonstrated

1. **Inbound Audio (Mic to Server):** Converting `Float32` (-1.0 to 1.0) microphone data into `Int16` (-32768 to 32767) PCM binary chunks before sending over WebSockets.
2. **Outbound Audio (Server to Speaker):** Receiving `Int16` binary chunks, converting them back to `Float32`, and queuing them into sequential `AudioBuffer` objects for gapless playback.
3. **Volume RMS Calculation:** Measuring the Root Mean Square of the audio buffers to drive the `inputVolume` properties on visual components.
4. **AnalyserNode Injection:** Taking the raw WebAudio `AnalyserNode` created by your application and binding it directly to the `<ui-orb>` component for visual reactivity.

*(Note: This sample uses `ScriptProcessorNode` for simplicity because it requires no external file serving, but production applications should use `AudioWorklet` for processing audio off the main thread).*

## Running this Sample

From the root of `scream-ui`, run:
```bash
cd samples/live-connection
npm run dev
```
This starts both the Vite frontend (port 5173) and a tiny Node.js mock WebSocket server (port 8080) concurrently.