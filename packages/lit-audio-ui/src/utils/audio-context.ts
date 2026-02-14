import {createContext} from '@lit/context';

/**
 * The unified state and control surface of our audio player.
 */
export interface AudioPlayerState {
  src: string;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  error?: string;

  // Expose an explicit reference to the underlying AnalyserNode
  // so that visualizers (like ui-live-waveform) can connect to it!
  analyserNode?: AnalyserNode;

  // Methods to interact with the provider
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

/**
 * A unique token to identify our context.
 * Any component that uses @consume({context: audioPlayerContext})
 * will automatically receive updates when the nearest <ui-audio-provider> changes its state.
 */
export const audioPlayerContext = createContext<AudioPlayerState>(
  'ui-audio-player-context',
);
