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

import './demo-layouts.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Lazy-load the heavy Orb component
  await import('../src/components/molecules/ui-orb.js');

  // Helper to find elements regardless of where they are in the DOM
  async function findEl(id: string): Promise<HTMLElement | null> {
    const el = document.getElementById(id);
    if (el) return el;

    // Retry polling for projected content
    return new Promise(resolve => {
      let attempts = 0;
      const interval = setInterval(() => {
        const found = document.getElementById(id);
        if (found || attempts > 10) {
          clearInterval(interval);
          resolve(found);
        }
        attempts++;
      }, 100);
    });
  }

  // 2. Setup Static Waveform
  const staticWaveform = (await findEl('demo-static-waveform')) as any;
  const regenerateStaticBtn = await findEl('btn-regenerate-static');

  function generateStaticData() {
    const mockData = Array.from({length: 200}, () => Math.random() * 0.8 + 0.1);
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
  regenerateStaticBtn?.addEventListener('click', generateStaticData);

  // 3. Theme Toggle Logic
  const themeToggle = await findEl('theme-toggle');
  const htmlEl = document.documentElement;

  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
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
      swatches.forEach((s: any) => (s.style.borderColor = 'transparent'));
      e.target.style.borderColor = 'var(--md-sys-color-on-surface)';
      forceStaticWaveformRedraw();
    });
  });

  // 5. Auto-generate Side Navigation
  const navList = await findEl('nav-list');
  const sections = document.querySelectorAll('.demo-section');

  sections.forEach((section: any, secIndex) => {
    const secTitle = section.dataset.title;
    const secHeader = document.createElement('li');
    secHeader.style.cssText =
      'font-weight:700; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--md-sys-color-primary); margin-top:1.5rem; margin-bottom:0.5rem;';
    if (secIndex === 0) secHeader.style.marginTop = '0';
    secHeader.textContent = secTitle;
    navList?.appendChild(secHeader);

    const showcaseCards = section.querySelectorAll('ui-showcase-card');
    showcaseCards.forEach((card: any, cardIndex: number) => {
      const anchorId = `component-${secIndex}-${cardIndex}`;
      card.id = anchorId;
      card.style.scrollMarginTop = '7rem';

      const rawTitle = card.getAttribute('title');
      let cleanTitle = rawTitle;
      if (rawTitle.includes('ui-')) {
        const parts = rawTitle.split(' ');
        const componentName = parts[0].replace('ui-', '');
        const capitalized =
          componentName.charAt(0).toUpperCase() + componentName.slice(1);
        cleanTitle =
          parts.length > 1 ? `${capitalized} ${parts[1]}` : capitalized;
      }

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${anchorId}`;
      a.textContent = cleanTitle;
      a.style.cssText =
        'text-decoration:none; color:var(--md-sys-color-on-surface-variant); font-size:0.9rem; transition:color 0.2s;';
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
  const liveWaveform = (await findEl('demo-live-waveform')) as any;
  const audioElement = (await findEl('demo-audio-player')) as HTMLAudioElement;
  const processingBtn = await findEl('btn-processing');

  let analyser: AnalyserNode;
  let isConnected = false;

  audioElement?.addEventListener('play', () => {
    if (!isConnected) {
      const audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      const source = audioCtx.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      isConnected = true;
    }
    if (liveWaveform) {
      liveWaveform.analyserNode = analyser;
      liveWaveform.active = true;
    }
  });

  processingBtn?.addEventListener('click', () => {
    if (liveWaveform) {
      liveWaveform.processing = !liveWaveform.processing;
      processingBtn.textContent = liveWaveform.processing
        ? 'Stop Processing'
        : 'Toggle Processing';
    }
  });

  // 8. Setup Voice Button State Cycle
  const voiceBtn = (await findEl('demo-voice-btn')) as any;
  const voiceStateText = await findEl('demo-voice-btn-state');
  const stateCycle = ['recording', 'processing', 'success', 'error'];
  let cycleIndex = -1;
  let successToggle = true;

  voiceBtn?.addEventListener('voice-button-click', () => {
    cycleIndex = (cycleIndex + 1) % stateCycle.length;
    const newState = stateCycle[cycleIndex];
    voiceBtn.setAttribute('state', newState);

    // In a real app, we'd use a real analyser here
    if (newState === 'recording') {
      voiceBtn.analyserNode = typeof analyser !== 'undefined' ? analyser : null;
    } else {
      voiceBtn.analyserNode = undefined;
    }

    if (newState === 'processing') {
      setTimeout(() => {
        if (voiceBtn.getAttribute('state') === 'processing') {
          const finalState = successToggle ? 'success' : 'error';
          successToggle = !successToggle;
          cycleIndex = stateCycle.indexOf(finalState);
          voiceBtn.setAttribute('state', finalState);
          if (voiceStateText)
            voiceStateText.textContent = `State: ${finalState}`;
        }
      }, 2500);
    }
    if (voiceStateText) voiceStateText.textContent = `State: ${newState}`;
  });

  // 9. Setup Mic Selector
  const micSelector = await findEl('demo-mic-selector');
  const micStateText = await findEl('demo-mic-state');
  micSelector?.addEventListener('device-change', (e: any) => {
    if (micStateText)
      micStateText.textContent = `Selected ID: ${e.detail.deviceId}`;
  });

  // 10. Setup Voice Picker
  const voicePicker = (await findEl('demo-voice-picker')) as any;
  const voicePickerState = await findEl('demo-voice-picker-state');
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

  // 12. Setup Orb Demo
  const orb = (await findEl('demo-orb')) as any;
  const orbBtn = await findEl('orb-state-btn');
  const orbStates = [null, 'listening', 'thinking', 'talking'];
  let orbStateIndex = 0;
  const directBtns = document.querySelectorAll('.orb-direct-btn');

  const syncOrbButtons = (state: any) => {
    if (orbBtn) orbBtn.textContent = `Cycle State: ${state || 'idle'}`;
    directBtns.forEach((btn: any) => {
      const btnState = btn.dataset.state === 'null' ? null : btn.dataset.state;
      btn.style.background =
        btnState === state
          ? 'var(--md-sys-color-primary-container)'
          : 'var(--md-sys-color-surface)';
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
});
