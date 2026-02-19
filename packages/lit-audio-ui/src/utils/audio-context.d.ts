/**
 * Represents a single word in a timed transcript.
 */
export interface TranscriptWord {
    text: string;
    start: number;
    end: number;
}
/**
 * Represents a single track in a playlist.
 */
export interface PlaylistTrack {
    id?: string;
    src: string;
    title?: string;
    artist?: string;
    artwork?: string;
    transcript?: TranscriptWord[];
    [key: string]: any;
}
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
    transcript?: TranscriptWord[];
    items: PlaylistTrack[];
    currentIndex: number;
    autoAdvance: boolean;
    analyserNode?: AnalyserNode;
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    next: () => void;
    previous: () => void;
    select: (index: number) => void;
}
/**
 * A unique token to identify our context.
 * Any component that uses @consume({context: audioPlayerContext})
 * will automatically receive updates when the nearest <ui-audio-provider> changes its state.
 */
export declare const audioPlayerContext: {
    __context__: AudioPlayerState;
};
