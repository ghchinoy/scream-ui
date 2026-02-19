export type SpeechState = 'idle' | 'connecting' | 'recording' | 'processing' | 'success' | 'error';
export interface SpeechContext {
    state: SpeechState;
    transcript: string;
    partialTranscript: string;
    error?: string;
    analyserNode?: AnalyserNode;
    start: () => Promise<void>;
    stop: () => void;
    cancel: () => void;
}
export declare const speechContext: {
    __context__: SpeechContext;
};
