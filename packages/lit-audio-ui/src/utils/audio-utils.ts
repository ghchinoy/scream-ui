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
export function createMockAnalyser(): any {
  // We return a proxy that implements getByteFrequencyData
  return {
    fftSize: 256,
    frequencyBinCount: 128,
    getByteFrequencyData: (array: Uint8Array) => {
      const time = performance.now() / 1000;
      for (let i = 0; i < array.length; i++) {
        // Generate a simple dynamic wave pattern
        const val =
          Math.sin(time * 2 + i * 0.1) * 50 +
          Math.sin(time * 5 + i * 0.2) * 30 +
          100;
        array[i] = Math.max(0, Math.min(255, val));
      }
    },
  };
}

/**
 * Creates and configures an AnalyserNode from a given MediaStream.
 *
 * @param mediaStream The stream to analyze (e.g. from getUserMedia)
 * @param options Configuration for the AnalyserNode
 * @returns An object containing the analyser, the context, and a cleanup function.
 */
export function createAudioAnalyser(
  mediaStream: MediaStream,
  options: AudioAnalyserOptions = {},
): AudioAnalyserResult {
  // Use standard AudioContext with webkit fallback
  const AudioContextClass =
    window.AudioContext ||
    ((window as any).webkitAudioContext as typeof AudioContext);

  const audioContext = new AudioContextClass();
  const source = audioContext.createMediaStreamSource(mediaStream);
  const analyser = audioContext.createAnalyser();

  if (options.fftSize !== undefined) {
    analyser.fftSize = options.fftSize;
  }
  if (options.smoothingTimeConstant !== undefined) {
    analyser.smoothingTimeConstant = options.smoothingTimeConstant;
  }
  if (options.minDecibels !== undefined) {
    analyser.minDecibels = options.minDecibels;
  }
  if (options.maxDecibels !== undefined) {
    analyser.maxDecibels = options.maxDecibels;
  }

  source.connect(analyser);

  const cleanup = () => {
    source.disconnect();
    if (audioContext.state !== 'closed') {
      audioContext.close();
    }
  };

  return {analyser, audioContext, cleanup};
}

/**
 * Normalizes raw frequency data from the AnalyserNode into an array of values between 0.0 and 1.0.
 *
 * @param analyser The AnalyserNode to read from
 * @param dataArray A pre-allocated Uint8Array to hold the raw byte data
 * @returns An array of normalized numbers (0.0 to 1.0)
 */
export function getNormalizedFrequencyData(
  analyser: AnalyserNode,
  dataArray: Uint8Array,
): number[] {
  analyser.getByteFrequencyData(dataArray as any);
  const normalizedData: number[] = [];
  for (let i = 0; i < dataArray.length; i++) {
    // getByteFrequencyData returns values between 0 and 255.
    normalizedData.push(dataArray[i] / 255);
  }
  return normalizedData;
}

/**
 * Generates an array of random normalized values.
 * Useful for "processing" states when no real audio is available.
 *
 * @param count The number of values to generate
 * @param modifier A multiplier to limit the random scale (e.g. 0.5)
 * @returns Array of random normalized numbers
 */
export function generateRandomAudioData(
  count: number,
  modifier: number = 0.5,
): number[] {
  const data: number[] = [];
  for (let i = 0; i < count; i++) {
    data.push(Math.random() * modifier);
  }
  return data;
}

/**
 * Creates an edge-fade gradient over a canvas to smoothly blend the left and right edges.
 *
 * @param ctx The canvas 2D rendering context
 * @param width The logical width of the canvas
 * @param height The logical height of the canvas
 * @param fadeWidth The physical width in pixels of the fade effect
 */
export function applyCanvasEdgeFade(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fadeWidth: number,
): void {
  if (fadeWidth <= 0 || width <= 0) return;

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  const fadePercent = Math.min(0.2, fadeWidth / width);

  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(fadePercent, 'rgba(0,0,0,1)');
  gradient.addColorStop(1 - fadePercent, 'rgba(0,0,0,1)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
}
