import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

const canvas = document.getElementById('textCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const timeSlider = document.getElementById('timeSlider') as HTMLInputElement;

// Mock transcript with timestamps
const mockTranscript = [
  { text: "This", start: 0, end: 0.5 },
  { text: " is", start: 0.6, end: 1.0 },
  { text: " a", start: 1.1, end: 1.2 },
  { text: " prototype", start: 1.3, end: 2.0 },
  { text: " of", start: 2.1, end: 2.3 },
  { text: " the", start: 2.4, end: 2.5 },
  { text: " new", start: 2.6, end: 2.8 },
  { text: " zero-DOM", start: 2.9, end: 3.5 },
  { text: " synchronized", start: 3.6, end: 4.5 },
  { text: " transcript", start: 4.6, end: 5.5 },
  { text: " component.", start: 5.6, end: 6.5 },
  { text: " We", start: 6.6, end: 6.8 },
  { text: " are", start: 6.9, end: 7.1 },
  { text: " rendering", start: 7.2, end: 8.0 },
  { text: " everything", start: 8.1, end: 9.0 },
  { text: " purely", start: 9.1, end: 9.5 },
  { text: " on", start: 9.6, end: 9.8 },
  { text: " canvas", start: 9.9, end: 10.5 },
  { text: " using", start: 10.6, end: 11.0 },
  { text: " the", start: 11.1, end: 11.3 },
  { text: " pretext", start: 11.4, end: 12.0 },
  { text: " library.", start: 12.1, end: 13.0 }
];

timeSlider.max = "13"; // Set max to end of transcript
timeSlider.step = "0.1";

// Create full string for layout
const fullText = mockTranscript.map(t => t.text).join("");

// Font configuration
const fontSize = 24;
const fontFamily = "Inter, sans-serif";
const fontString = `bold ${fontSize}px ${fontFamily}`;
const lineHeight = fontSize * 1.5;

function resizeCanvas() {
  const width = canvas.clientWidth;
  const dpr = window.devicePixelRatio || 1;
  
  // Set physical dimensions (buffer)
  canvas.width = width * dpr;
  // Note: we'll set height after we measure the text!
  
  return { width, dpr };
}

function render(currentTime: number) {
  if (!ctx) return;
  
  const { width, dpr } = resizeCanvas();
  
  // 1. Prepare and Layout text
  // The first argument is the string, the second is the exact canvas font string
  const prepared = prepareWithSegments(fullText, fontString, { whiteSpace: 'pre-wrap' });
  
  // Provide max width and line height
  const { height, lines } = layoutWithLines(prepared, width, lineHeight);
  
  // Update canvas height now that we know how tall the text block is
  canvas.height = height * dpr;
  canvas.style.height = `${height}px`;
  
  // Scale context for retina displays
  ctx.scale(dpr, dpr);
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Set font for rendering
  ctx.font = fontString;
  ctx.textBaseline = 'top';

  // We need to map `pretext` cursor bounds (graphemes) back to our word boundaries.
  // This is a naive approach for the prototype: we track the string index.
  let charIndex = 0;
  let wordIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const y = i * lineHeight;
    
    let xOffset = 0;
    
    // We iterate over each character in the line to color words based on time
    // Alternatively, we could slice the line based on active word bounds.
    // For this prototype, we'll draw word by word by checking string indices.
    
    // Simplest prototype implementation: re-measure word by word using standard canvas
    // to apply the colors inline. (In production, we might use pretext's grapheme cursor more directly).
    const wordsInLine = line.text.split(/(?<=\s)/); // Split keeping trailing spaces
    
    for (const textPart of wordsInLine) {
      // Find the corresponding transcript word object based on raw text progression
      // (This assumes perfect string matching between mockTranscript and fullText)
      let currentWordObj = mockTranscript[wordIndex];
      
      // Advance word index if we've consumed this word
      // (Handling exact split matching can be tricky, this is a rough approx)
      
      const isActive = currentTime >= currentWordObj?.start && currentTime <= currentWordObj?.end;
      const isPast = currentTime > currentWordObj?.end;
      
      if (isActive) {
        // Active highlight background
        const wordWidth = ctx.measureText(textPart).width;
        ctx.fillStyle = '#e8def8';
        ctx.beginPath();
        ctx.roundRect(xOffset, y, wordWidth, lineHeight - 4, 4);
        ctx.fill();
        ctx.fillStyle = '#1d192b'; // Dark text
      } else if (isPast) {
        ctx.fillStyle = '#aaaaaa'; // Past text
      } else {
        ctx.fillStyle = '#444444'; // Future text
      }
      
      ctx.fillText(textPart, xOffset, y);
      xOffset += ctx.measureText(textPart).width;
      
      // Attempt to progress our mock transcript index
      if (textPart.endsWith(' ')) {
        wordIndex++;
      } else if (wordIndex < mockTranscript.length - 1 && textPart === mockTranscript[wordIndex].text.trim()) {
        wordIndex++;
      }
    }
  }
}

// Initial render
render(parseFloat(timeSlider.value));

// Listen to slider
timeSlider.addEventListener('input', (e) => {
  const val = (e.target as HTMLInputElement).value;
  render(parseFloat(val));
});

// Re-render on resize
window.addEventListener('resize', () => {
  render(parseFloat(timeSlider.value));
});
