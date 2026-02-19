import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log('Mock Audio WebSocket server started on ws://localhost:8080');

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
            streamMockAudioResponse(ws, () => {
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
      // You could measure the RMS volume here to log it.
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (streamingInterval) clearInterval(streamingInterval);
  });
});

/**
 * Generates and streams 3 seconds of a 16kHz Int16 PCM procedural sound.
 */
function streamMockAudioResponse(ws, onComplete) {
  const sampleRate = 16000;
  const durationSeconds = 3;
  const totalSamples = sampleRate * durationSeconds;
  const chunkSize = 4096;
  
  let currentSample = 0;
  
  const interval = setInterval(() => {
    if (ws.readyState !== ws.OPEN) {
      clearInterval(interval);
      return;
    }
    
    const remaining = totalSamples - currentSample;
    const samplesToSend = Math.min(chunkSize, remaining);
    
    if (samplesToSend <= 0) {
      clearInterval(interval);
      if (onComplete) onComplete();
      return;
    }
    
    const pcmData = new Int16Array(samplesToSend);
    for (let i = 0; i < samplesToSend; i++) {
      const t = (currentSample + i) / sampleRate;
      
      // Generate a "robot" sound: Mix of two sine waves + envelope
      const wave1 = Math.sin(2 * Math.PI * 440 * t);
      const wave2 = Math.sin(2 * Math.PI * 660 * t);
      
      // Pulse envelope
      const env = Math.sin(2 * Math.PI * 2 * t) > 0 ? 1 : 0.5; 
      
      const val = (wave1 + wave2) * 0.5 * env;
      
      // Convert float [-1, 1] to Int16 [-32768, 32767]
      pcmData[i] = Math.max(-1, Math.min(1, val)) * 0x7FFF;
    }
    
    // Send as binary buffer
    ws.send(pcmData.buffer);
    currentSample += samplesToSend;
    
  }, (chunkSize / sampleRate) * 1000); // Send chunks at real-time speed
}
