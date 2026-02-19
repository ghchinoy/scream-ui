import { WebSocketServer } from 'ws';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wss = new WebSocketServer({ port: 8080 });

console.log('Mock Audio WebSocket server started on ws://localhost:8080');

// Use a pre-generated Gemini TTS sample from our public bucket
const AUDIO_URL = 'https://storage.googleapis.com/scream-ui-samples/speech_sample-Aoede-20260212-183352.wav';

wss.on('connection', function connection(ws) {
  console.log('Client connected');
  let streamingInterval = null;

  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    if (!isBinary) {
      try {
        const msg = JSON.parse(data.toString());
        console.log('Received JSON:', msg);
        
        if (msg.type === 'session_init') {
          // Send a state update back
          ws.send(JSON.stringify({ type: 'state', value: 'listening' }));
        } else if (msg.type === 'session_terminate') {
          ws.send(JSON.stringify({ type: 'state', value: 'processing' }));
          
          // Wait 1 second, then "talk" back
          setTimeout(() => {
            ws.send(JSON.stringify({ type: 'state', value: 'talking' }));
            streamWavFromUrl(ws, AUDIO_URL, () => {
               ws.send(JSON.stringify({ type: 'state', value: 'listening' }));
            });
          }, 1000);
        }
      } catch (e) {
        console.error('Failed to parse JSON', e);
      }
    } else {
      // It's binary PCM data from the microphone.
      // We log receiving it but don't play it back (to avoid feedback loop).
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (streamingInterval) clearInterval(streamingInterval);
  });
});

/**
 * Downloads a WAV file from a URL and streams its PCM payload over the WebSocket
 * simulating real-time audio chunking.
 */
function streamWavFromUrl(ws, url, onComplete) {
  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      console.error(`Failed to download audio. Status Code: ${response.statusCode}`);
      if (onComplete) onComplete();
      return;
    }

    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    
    response.on('end', () => {
      const fullBuffer = Buffer.concat(chunks);
      
      // Basic WAV parsing to skip the header (usually 44 bytes)
      // and extract the raw PCM data.
      let pcmData;
      if (fullBuffer.toString('utf8', 0, 4) === 'RIFF') {
        pcmData = fullBuffer.subarray(44);
      } else {
        pcmData = fullBuffer;
      }
      
      // Stream the PCM data in chunks
      // Gemini TTS defaults to 24kHz, so we'll push chunks that size.
      // (The frontend AudioContext will resample to device output automatically)
      const sampleRate = 24000; 
      const bytesPerSample = 2; // 16-bit
      const chunkSize = 4096 * bytesPerSample; // 8192 bytes
      
      let offset = 0;
      
      const interval = setInterval(() => {
        if (ws.readyState !== ws.OPEN) {
          clearInterval(interval);
          return;
        }
        
        if (offset >= pcmData.length) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return;
        }
        
        const end = Math.min(offset + chunkSize, pcmData.length);
        const chunkToStream = pcmData.subarray(offset, end);
        
        ws.send(chunkToStream);
        offset = end;
        
      }, (4096 / sampleRate) * 1000); // Send chunks roughly at real-time speed
      
    });
  }).on('error', (err) => {
    console.error('Error downloading audio:', err.message);
    if (onComplete) onComplete();
  });
}