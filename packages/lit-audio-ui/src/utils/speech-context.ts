import {createContext} from '@lit/context';

export type SpeechState =
  | 'idle'
  | 'connecting'
  | 'recording'
  | 'processing'
  | 'success'
  | 'error';

export interface SpeechContext {
  state: SpeechState;
  transcript: string;
  partialTranscript: string;
  error?: string;
  analyserNode?: AnalyserNode;

  // Actions
  start: () => Promise<void>;
  stop: () => void;
  cancel: () => void;
}

export const speechContext = createContext<SpeechContext>('ui-speech-context');
