# Reference A2UI Agent Sample

This sample demonstrates a "minimalist" integration of the Scream UI library, designed to be read and replicated by other AI agents.

## Key Features
* **Zero-Config Reactivity:** Uses the atomic component pattern where children automatically react to their parent provider.
* **Agent Simulation:** The demo uses the `simulation` attribute on `<ui-speech-provider>` to allow testing without a real backend.
* **Event-Based Logic:** Shows how to listen to the `speech-stop` event to trigger an agent "reply."

## Development
```bash
npm install
npm run dev
```
