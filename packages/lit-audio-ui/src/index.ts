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
export * from './components/atoms/ui-audio-play-button';
export * from './components/atoms/ui-audio-next-button';
export * from './components/atoms/ui-audio-prev-button';
export * from './components/atoms/ui-audio-progress-slider';
export * from './components/atoms/ui-audio-time-display';
export * from './components/atoms/ui-audio-volume-slider';
export * from './components/atoms/ui-speech-record-button';
export * from './components/atoms/ui-speech-cancel-button';
export * from './components/atoms/ui-shimmering-text';
export * from './components/atoms/ui-message-bubble';
export * from './components/atoms/ui-typing-dot';

// --- MOLECULES (Functional Units) ---
export * from './components/molecules/ui-waveform';
export * from './components/molecules/ui-live-waveform';
export * from './components/molecules/ui-scrolling-waveform';
export * from './components/molecules/ui-spectrum-visualizer';
export * from './components/molecules/ui-mic-selector';
export * from './components/molecules/ui-voice-picker';
export * from './components/molecules/ui-speech-preview';
export * from './components/molecules/ui-orb';
export * from './components/molecules/ui-3d-flip';
export * from './components/molecules/ui-playlist';
export * from './components/molecules/ui-showcase-card';
export * from './components/molecules/ui-voice-button';
export * from './components/molecules/scream-voice-button';
export * from './components/molecules/ui-typing-indicator';
export * from './components/molecules/ui-chat-item';
export * from './components/molecules/ui-chat-list';

// --- ORGANISMS (Composite Components) ---
export * from './components/organisms/ui-audio-player';

// --- PROVIDERS (State Orchestration) ---
export * from './components/providers/ui-audio-provider';
export * from './components/providers/ui-speech-provider';

// --- UTILS ---
export * from './utils/audio-utils';
export * from './utils/audio-context';
export * from './utils/speech-context';

// --- TYPES ---
export type {AudioPlayerState, PlaylistTrack} from './utils/audio-context';
export type {SpeechState, SpeechContext} from './utils/speech-context';
export type {AudioDevice} from './components/molecules/ui-mic-selector';
export type {VoiceItem, VoiceLabel} from './components/molecules/ui-voice-picker';
export type {AgentState} from './components/molecules/ui-orb';
export type {VoiceButtonState} from './components/molecules/ui-voice-button';
