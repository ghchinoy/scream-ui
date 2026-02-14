import {createMockAnalyser} from '../src/utils/audio-utils.ts';
import './demo-layouts.ts';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Lazy-load the heavy Orb component
  await import('../src/components/ui-orb.ts');

  // 2. Setup Static Waveform
  const staticWaveform = document.getElementById(
    'demo-static-waveform',
  ) as any;
  const regenerateStaticBtn = document.getElementById('btn-regenerate-static');

  function generateStaticData() {
    const mockData = Array.from(
      {length: 200},
      () => Math.random() * 0.8 + 0.1,
    );
    if (staticWaveform) {
      staticWaveform.data = mockData;
    }
  }

  function forceStaticWaveformRedraw() {
    if (staticWaveform && staticWaveform.data) {
      staticWaveform.data = [...staticWaveform.data];
    }
  }

  generateStaticData();
  if (regenerateStaticBtn) {
    regenerateStaticBtn.addEventListener('click', generateStaticData);
  }

  // 3. Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    htmlEl.classList.add('dark');
    if (themeToggle)
      themeToggle.innerHTML =
        '<span class="material-symbols-outlined">light_mode</span>';
  }

  themeToggle?.addEventListener('click', () => {
    htmlEl.classList.toggle('dark');
    if (htmlEl.classList.contains('dark')) {
      themeToggle.innerHTML =
        '<span class="material-symbols-outlined">light_mode</span>';
    } else {
      themeToggle.innerHTML =
        '<span class="material-symbols-outlined">dark_mode</span> Dark Mode';
    }
    forceStaticWaveformRedraw();
  });

  // 4. Color Picker Logic
  const swatches = document.querySelectorAll('.color-swatch');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', (e: any) => {
      const primary = e.target.dataset.primary;
      const onPrimary = e.target.dataset.onprimary;
      document.documentElement.style.setProperty(
        '--md-sys-color-primary',
        primary,
      );
      document.documentElement.style.setProperty(
        '--md-sys-color-on-primary',
        onPrimary,
      );
      document.documentElement.style.setProperty('color', primary);
      swatches.forEach((s: any) => (s.style.borderColor = 'transparent'));
      e.target.style.borderColor = 'var(--md-sys-color-on-surface)';
      forceStaticWaveformRedraw();
    });
  });

  // 5. Auto-generate Side Navigation
  const navList = document.getElementById('nav-list');
  const sections = document.querySelectorAll('.demo-section');

  sections.forEach((section: any, secIndex) => {
    const secTitle = section.dataset.title;
    const secHeader = document.createElement('li');
    secHeader.style.fontWeight = '700';
    secHeader.style.fontSize = '0.75rem';
    secHeader.style.textTransform = 'uppercase';
    secHeader.style.letterSpacing = '0.05em';
    secHeader.style.color = 'var(--md-sys-color-primary)';
    secHeader.style.marginTop = secIndex === 0 ? '0' : '1.5rem';
    secHeader.style.marginBottom = '0.5rem';
    secHeader.textContent = secTitle;
    navList?.appendChild(secHeader);

    const showcaseCards = section.querySelectorAll('ui-showcase-card');
    showcaseCards.forEach((card: any, cardIndex: number) => {
      const anchorId = 'component-' + secIndex + '-' + cardIndex;
      card.id = anchorId;
      card.style.scrollMarginTop = '7rem';
      const rawTitle = card.getAttribute('title');
      const cleanTitle = rawTitle.includes('ui-')
        ? rawTitle.split(' ')[0]
        : rawTitle;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + anchorId;
      a.textContent = cleanTitle;
      a.style.textDecoration = 'none';
      a.style.color = 'var(--md-sys-color-on-surface-variant)';
      a.style.fontSize = '0.9rem';
      a.style.transition = 'color 0.2s';
      a.addEventListener(
        'mouseover',
        () => (a.style.color = 'var(--md-sys-color-primary)'),
      );
      a.addEventListener(
        'mouseout',
        () => (a.style.color = 'var(--md-sys-color-on-surface-variant)'),
      );
      li.appendChild(a);
      navList?.appendChild(li);
    });
  });

  // 6. Setup Live Waveform
  const liveWaveform = document.getElementById('demo-live-waveform') as any;
  const audioElement = document.getElementById(
    'demo-audio-player',
  ) as HTMLAudioElement;
  const processingBtn = document.getElementById('btn-processing');

  let audioCtx: AudioContext;
  let analyser: AnalyserNode;
  let source: MediaElementAudioSourceNode;
  let isConnected = false;

  audioElement?.addEventListener('play', () => {
    if (!isConnected) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContextClass();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.8;
      source = audioCtx.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      isConnected = true;
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (liveWaveform) {
      liveWaveform.analyserNode = analyser;
      liveWaveform.active = true;
      liveWaveform.processing = false;
    }
    if (processingBtn) processingBtn.textContent = 'Toggle "Processing" State';
  });

  audioElement?.addEventListener('pause', () => {
    if (liveWaveform) liveWaveform.active = false;
  });

  processingBtn?.addEventListener('click', () => {
    if (!liveWaveform.processing) {
      audioElement.pause();
      liveWaveform.active = false;
      liveWaveform.processing = true;
      processingBtn.textContent = 'Stop "Processing"';
    } else {
      liveWaveform.processing = false;
      processingBtn.textContent = 'Toggle "Processing" State';
    }
  });

  // 7. Setup Audio Player
  const demoPlayer = document.getElementById('demo-player') as any;
  if (demoPlayer) {
    demoPlayer.item = {
      id: 'music-1',
      src: 'https://storage.googleapis.com/scream-ui-samples/music_sample.wav',
    };
  }

  // 8. Setup Voice Button State Cycle
  const voiceBtn = document.getElementById('demo-voice-btn') as any;
  const voiceStateText = document.getElementById('demo-voice-btn-state');
  const stateCycle = ['recording', 'processing', 'success', 'error'];
  let cycleIndex = -1;
  let successToggle = true;

  voiceBtn?.addEventListener('voice-button-click', () => {
    cycleIndex = (cycleIndex + 1) % stateCycle.length;
    if (
      stateCycle[cycleIndex] === 'success' ||
      stateCycle[cycleIndex] === 'error'
    ) {
      cycleIndex = 0;
    }
    const newState = stateCycle[cycleIndex];
    voiceBtn.setAttribute('state', newState);
    if (newState === 'recording') {
      voiceBtn.analyserNode =
        typeof analyser !== 'undefined' ? analyser : createMockAnalyser();
    } else {
      voiceBtn.analyserNode = undefined;
    }

    if (newState === 'idle') voiceBtn.label = 'Start Recording';
    else if (newState === 'recording') voiceBtn.label = 'Stop Recording';
    else if (newState === 'processing') {
      voiceBtn.label = 'Analyzing...';
      setTimeout(() => {
        if (voiceBtn.getAttribute('state') === 'processing') {
          const finalState = successToggle ? 'success' : 'error';
          successToggle = !successToggle;
          cycleIndex = stateCycle.indexOf(finalState);
          voiceBtn.setAttribute('state', finalState);
          voiceBtn.label = '';
          if (voiceStateText) voiceStateText.textContent = `State: ${finalState}`;
        }
      }, 2500);
    }
    if (voiceStateText) voiceStateText.textContent = `State: ${newState}`;
  });

  const voiceObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'state'
      ) {
        const currentState = voiceBtn.getAttribute('state');
        if (currentState === 'idle') {
          cycleIndex = -1;
          voiceBtn.label = 'Start Recording';
          if (voiceStateText)
            voiceStateText.textContent = 'State: idle (auto-reset)';
        }
      }
    });
  });
  if (voiceBtn) voiceObserver.observe(voiceBtn, {attributes: true});

  // 9. Setup Mic Selector
  const micSelector = document.getElementById('demo-mic-selector');
  const micStateText = document.getElementById('demo-mic-state');
  micSelector?.addEventListener('device-change', (e: any) => {
    if (micStateText)
      micStateText.textContent = `Selected ID: ${e.detail.deviceId}`;
  });

  // 10. Setup Voice Picker
  const voicePicker = document.getElementById('demo-voice-picker') as any;
  const voicePickerState = document.getElementById('demo-voice-picker-state');
  if (voicePicker) {
    voicePicker.idKey = 'customId';
    voicePicker.titleKey = 'displayName';
    voicePicker.subtitleKey = 'trait';
    voicePicker.previewUrlKey = 'sampleAudio';
    voicePicker.useOrbs = true;
    voicePicker.colorKey = 'orbColor';
    voicePicker.voices = [
      {
        customId: 'v1',
        displayName: 'Aoede',
        sampleAudio:
          'https://storage.googleapis.com/scream-ui-samples/speech_sample-Aoede-20260212-183352.wav',
        trait: 'American • Female',
        orbColor: ['#F28B82', '#E57373'],
      },
      {
        customId: 'v2',
        displayName: 'Zephyr',
        sampleAudio:
          'https://storage.googleapis.com/scream-ui-samples/speech_sample-Zephyr-20260213-082026.wav',
        trait: 'British • Female',
        orbColor: ['#81C995', '#66BB6A'],
      },
      {
        customId: 'v3',
        displayName: 'Lyria Lo-Fi Beat',
        sampleAudio:
          'https://storage.googleapis.com/scream-ui-samples/music_sample.wav',
        trait: 'Upbeat lo-fi hip hop',
        orbColor: ['#FDE293', '#FFF176'],
      },
      {
        customId: 'v4',
        displayName: 'Orus',
        sampleAudio:
          'https://storage.googleapis.com/scream-ui-samples/speech_sample-Orus-20260213-082038.wav',
        trait: 'Australian • Male',
        orbColor: ['#AECBFA', '#64B5F6'],
      },
    ];
    voicePicker.addEventListener('voice-change', (e: any) => {
      if (voicePickerState)
        voicePickerState.textContent = `Selected Voice: ${e.detail.voiceId}`;
    });
  }

  // 11. Setup Theming Workbench
  const themeTarget = document.getElementById('theme-workbench-target');
  const recordColorInput = document.getElementById('theme-record-color');
  const waveColorInput = document.getElementById('theme-wave-color');
  const textSizeInput = document.getElementById('theme-text-size');
  const fontFamilyInput = document.getElementById('theme-font-family');

  recordColorInput?.addEventListener('input', (e: any) => {
    themeTarget?.style.setProperty('--ui-speech-record-color', e.target.value);
  });
  waveColorInput?.addEventListener('input', (e: any) => {
    themeTarget?.style.setProperty('--ui-speech-wave-color', e.target.value);
  });
  textSizeInput?.addEventListener('change', (e: any) => {
    themeTarget?.style.setProperty(
      '--ui-speech-preview-font-size',
      e.target.value,
    );
  });
  fontFamilyInput?.addEventListener('change', (e: any) => {
    themeTarget?.style.setProperty(
      '--ui-speech-preview-font-family',
      e.target.value,
    );
  });

  // 12. Setup Orb Demo
  const orb = document.getElementById('demo-orb') as any;
  const orbBtn = document.getElementById('orb-state-btn');
  const orbStates = [null, 'listening', 'thinking', 'talking'];
  let orbStateIndex = 0;
  const directBtns = document.querySelectorAll('.orb-direct-btn');

  const syncOrbButtons = (state: any) => {
    if (orbBtn)
      orbBtn.textContent = `Cycle State: ${state === null ? 'idle' : state}`;
    directBtns.forEach((btn: any) => {
      const btnState = btn.dataset.state === 'null' ? null : btn.dataset.state;
      if (btnState === state) {
        btn.style.borderColor = 'var(--md-sys-color-primary)';
        btn.style.background = 'var(--md-sys-color-primary-container)';
        btn.style.color = 'var(--md-sys-color-on-primary-container)';
      } else {
        btn.style.borderColor = 'var(--md-sys-color-outline-variant)';
        btn.style.background = 'var(--md-sys-color-surface)';
        btn.style.color = 'var(--md-sys-color-on-surface)';
      }
    });
  };

  orbBtn?.addEventListener('click', () => {
    orbStateIndex = (orbStateIndex + 1) % orbStates.length;
    const nextState = orbStates[orbStateIndex];
    if (orb) orb.agentState = nextState;
    syncOrbButtons(nextState);
  });

  directBtns.forEach((btn: any) => {
    btn.addEventListener('click', () => {
      const state = btn.dataset.state === 'null' ? null : btn.dataset.state;
      if (orb) orb.agentState = state;
      orbStateIndex = orbStates.indexOf(state);
      syncOrbButtons(state);
    });
  });

  syncOrbButtons(null);

  // 13. Link Podcast Provider
  const podcastProvider = document.getElementById('demo-podcast-provider');
  const podcastOrb = document.getElementById('podcast-orb') as any;
  podcastProvider?.addEventListener('state-change', (e: any) => {
    if (podcastOrb)
      podcastOrb.agentState = e.detail.isPlaying ? 'talking' : 'idle';
  });
});
