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
/**
 * Core Audio Processing Utilities
 * Ported from ElevenLabs UI for pure Web Components usage.
 */
export interface AudioAnalyserOptions {
    fftSize?: number;
    smoothingTimeConstant?: number;
    minDecibels?: number;
    maxDecibels?: number;
}
export interface AudioAnalyserResult {
    analyser: AnalyserNode;
    audioContext: AudioContext;
    cleanup: () => void;
}
/**
 * Creates a mock AnalyserNode that generates procedural data.
 * Useful for demo environments where microphone access is not available.
 *
 * @returns A partial AnalyserNode-like object.
 */
export declare function createMockAnalyser(): any;
/**
 * Creates and configures an AnalyserNode from a given MediaStream.
 *
 * @param mediaStream The stream to analyze (e.g. from getUserMedia)
 * @param options Configuration for the AnalyserNode
 * @returns An object containing the analyser, the context, and a cleanup function.
 */
export declare function createAudioAnalyser(mediaStream: MediaStream, options?: AudioAnalyserOptions): AudioAnalyserResult;
/**
 * Normalizes raw frequency data from the AnalyserNode into an array of values between 0.0 and 1.0.
 *
 * @param analyser The AnalyserNode to read from
 * @param dataArray A pre-allocated Uint8Array to hold the raw byte data
 * @returns An array of normalized numbers (0.0 to 1.0)
 */
export declare function getNormalizedFrequencyData(analyser: AnalyserNode, dataArray: Uint8Array): number[];
/**
 * Generates an array of random normalized values.
 * Useful for "processing" states when no real audio is available.
 *
 * @param count The number of values to generate
 * @param modifier A multiplier to limit the random scale (e.g. 0.5)
 * @returns Array of random normalized numbers
 */
export declare function generateRandomAudioData(count: number, modifier?: number): number[];
/**
 * Creates an edge-fade gradient over a canvas to smoothly blend the left and right edges.
 *
 * @param ctx The canvas 2D rendering context
 * @param width The logical width of the canvas
 * @param height The logical height of the canvas
 * @param fadeWidth The physical width in pixels of the fade effect
 */
export declare function applyCanvasEdgeFade(ctx: CanvasRenderingContext2D, width: number, height: number, fadeWidth: number): void;
