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


/**
 * Formats a duration in seconds into a standard MM:SS or HH:MM:SS string.
 * @param seconds The time in seconds
 * @param compact If true, omits leading zeros for minutes if under an hour.
 */
export function formatAudioTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) {
    return '0:00';
  }
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  let result = '';

  if (hrs > 0) {
    result += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  result += '' + mins + ':' + (secs < 10 ? '0' : '');
  result += '' + secs;
  return result;
}

/**
 * Computes an array of normalized RMS peaks from an audio URL using the Web Audio API.
 * 
 * @param audioUrl The URL of the audio file.
 * @param numPeaks The number of peaks to generate.
 * @returns Array of normalized floats between 0.1 and 1.0.
 */
export async function computeAudioPeaks(
  audioUrl: string,
  numPeaks: number = 100,
): Promise<number[]> {
  try {
    const response = await fetch(audioUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextClass();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const channelData = audioBuffer.getChannelData(0);
    const hopLength = Math.max(1, Math.floor(channelData.length / numPeaks));
    const peaks: number[] = [];

    // Compute RMS energy per frame with an overlapping sliding window
    for (let i = 0; i < numPeaks; i++) {
      const start = i * hopLength;
      const end = Math.min(start + hopLength * 2, channelData.length);

      let sumSquares = 0;
      for (let j = start; j < end; j++) {
        sumSquares += channelData[j] * channelData[j];
      }

      const rms = Math.sqrt(sumSquares / (end - start));
      peaks.push(rms);
    }

    // Normalize to [0.1, 1.0]
    const maxPeak = Math.max(...peaks);
    const minPeak = 0.1;

    if (maxPeak > 0) {
      for (let i = 0; i < peaks.length; i++) {
        peaks[i] = (peaks[i] / maxPeak) * 0.9 + minPeak;
      }
    } else {
      return new Array(numPeaks).fill(minPeak);
    }

    if (audioContext.state !== 'closed') audioContext.close();

    return peaks;
  } catch (error) {
    console.error('Error computing audio peaks:', error);
    return new Array(numPeaks).fill(0.1);
  }
}
