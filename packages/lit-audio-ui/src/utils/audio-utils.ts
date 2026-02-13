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
  analyser.getByteFrequencyData(dataArray);
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
