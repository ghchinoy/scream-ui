/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import '@material/web/icon/icon.js';

// --- ATOMS (Basic Building Blocks) ---
export * from './components/atoms/ui-audio-play-button.js';
export * from './components/atoms/ui-audio-next-button.js';
export * from './components/atoms/ui-audio-prev-button.js';
export * from './components/atoms/ui-audio-progress-slider.js';
export * from './components/atoms/ui-audio-time-display.js';
export * from './components/atoms/ui-audio-volume-slider.js';
export * from './components/atoms/ui-speech-record-button.js';
export * from './components/atoms/ui-speech-cancel-button.js';
export * from './components/atoms/ui-voice-waveform.js';
export * from './components/atoms/ui-shimmering-text.js';
export * from './components/atoms/ui-message-bubble.js';
export * from './components/atoms/ui-typing-dot.js';

// --- MOLECULES (Functional Units) ---
export * from './components/molecules/ui-waveform.js';
export * from './components/molecules/ui-live-waveform.js';
export * from './components/molecules/ui-scrolling-waveform.js';
export * from './components/molecules/ui-spectrum-visualizer.js';
export * from './components/molecules/ui-mic-selector.js';
export * from './components/molecules/ui-voice-picker.js';
export * from './components/molecules/ui-speech-preview.js';
export * from './components/molecules/ui-orb.js';
export * from './components/molecules/ui-3d-flip.js';
export * from './components/molecules/ui-playlist.js';
export * from './components/molecules/ui-showcase-card.js';
export * from './components/molecules/ui-voice-button.js';
export * from './components/molecules/ui-voice-pill.js';
export * from './components/molecules/scream-voice-button.js';
export * from './components/molecules/ui-typing-indicator.js';
export * from './components/molecules/ui-chat-item.js';
export * from './components/molecules/ui-chat-list.js';

// --- ORGANISMS (Composite Components) ---
export * from './components/organisms/ui-audio-player.js';

// --- PROVIDERS (State Orchestration) ---
export * from './components/providers/ui-audio-provider.js';
export * from './components/providers/ui-speech-provider.js';

// --- UTILS ---
export * from './utils/audio-utils.js';
export * from './utils/audio-context.js';
export * from './utils/speech-context.js';

// --- TYPES ---
export type {AudioPlayerState, PlaylistTrack} from './utils/audio-context.js';
export type {SpeechState, SpeechContext} from './utils/speech-context.js';
export type {AudioDevice} from './components/molecules/ui-mic-selector.js';
export type {
  VoiceItem,
  VoiceLabel,
} from './components/molecules/ui-voice-picker.js';
export type {AgentState} from './components/molecules/ui-orb.js';
export type {VoiceButtonState} from './components/molecules/ui-voice-button.js';
