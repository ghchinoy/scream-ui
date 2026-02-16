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
  function findEl(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  // 2. Setup Static Waveform
  const staticWaveform = findEl('demo-static-waveform') as any;
  const regenerateStaticBtn = findEl('btn-regenerate-static');

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
  const themeToggle = findEl('theme-toggle');
  const htmlEl = document.documentElement;

  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    htmlEl.classList.add('dark');
    if (themeToggle) themeToggle.innerHTML = '<span class="material-symbols-outlined">light_mode</span>';
  }

  themeToggle?.addEventListener('click', () => {
    htmlEl.classList.toggle('dark');
    if (htmlEl.classList.contains('dark')) {
      themeToggle.innerHTML = '<span class="material-symbols-outlined">light_mode</span>';
    } else {
      themeToggle.innerHTML = '<span class="material-symbols-outlined">dark_mode</span> Dark Mode';
    }
    forceStaticWaveformRedraw();
  });

  // 4. Color Picker Logic
  const swatches = document.querySelectorAll('.color-swatch');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', (e: any) => {
      const primary = e.target.dataset.primary;
      const onPrimary = e.target.dataset.onprimary;
      document.documentElement.style.setProperty('--md-sys-color-primary', primary);
      document.documentElement.style.setProperty('--md-sys-color-on-primary', onPrimary);
      swatches.forEach((s: any) => (s.style.borderColor = 'transparent'));
      e.target.style.borderColor = 'var(--md-sys-color-on-surface)';
      forceStaticWaveformRedraw();
    });
  });

  // 5. Auto-generate Side Navigation
  const navList = findEl('nav-list');
  const sections = document.querySelectorAll('.demo-section');

  sections.forEach((section: any, secIndex) => {
    const secTitle = section.dataset.title;
    const secHeader = document.createElement('li');
    secHeader.style.cssText = 'font-weight:700; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--md-sys-color-primary); margin-top:1.5rem; margin-bottom:0.5rem;';
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
        const capitalized = componentName.charAt(0).toUpperCase() + componentName.slice(1);
        cleanTitle = parts.length > 1 ? `${capitalized} ${parts[1]}` : capitalized;
      }

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${anchorId}`;
      a.textContent = cleanTitle;
      a.style.cssText = 'text-decoration:none; color:var(--md-sys-color-on-surface-variant); font-size:0.9rem; transition:color 0.2s;';
      a.addEventListener('mouseover', () => (a.style.color = 'var(--md-sys-color-primary)'));
      a.addEventListener('mouseout', () => (a.style.color = 'var(--md-sys-color-on-surface-variant)'));
      li.appendChild(a);
      navList?.appendChild(li);
    });
  });

  // 6. Setup Live Waveform
  const liveWaveform = findEl('demo-live-waveform') as any;
  const audioElement = findEl('demo-audio-player') as HTMLAudioElement;
  const processingBtn = findEl('btn-processing');

  let analyser: AnalyserNode;
  let isConnected = false;

  audioElement?.addEventListener('play', () => {
    if (!isConnected) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
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
      processingBtn.textContent = liveWaveform.processing ? 'Stop Processing' : 'Toggle Processing';
    }
  });

  // 11. Setup Theming Workbench
  const themeTarget = findEl('theme-workbench-target');
  const recordColorInput = findEl('theme-record-color');
  const waveColorInput = findEl('theme-wave-color');
  const textSizeInput = findEl('theme-text-size');
  const fontFamilyInput = findEl('theme-font-family');

  recordColorInput?.addEventListener('input', (e: any) => themeTarget?.style.setProperty('--ui-speech-record-color', e.target.value));
  waveColorInput?.addEventListener('input', (e: any) => themeTarget?.style.setProperty('--ui-speech-wave-color', e.target.value));
  textSizeInput?.addEventListener('change', (e: any) => themeTarget?.style.setProperty('--ui-speech-preview-font-size', e.target.value));
  fontFamilyInput?.addEventListener('change', (e: any) => themeTarget?.style.setProperty('--ui-speech-preview-font-family', e.target.value));

  // 12. Setup Orb Demo
  const orb = findEl('demo-orb') as any;
  const orbBtn = findEl('orb-state-btn');
  const orbStates = [null, 'listening', 'thinking', 'talking'];
  let orbStateIndex = 0;
  const directBtns = document.querySelectorAll('.orb-direct-btn');

  const syncOrbButtons = (state: any) => {
    if (orbBtn) orbBtn.textContent = `Cycle State: ${state || 'idle'}`;
    directBtns.forEach((btn: any) => {
      const btnState = btn.dataset.state === 'null' ? null : btn.dataset.state;
      btn.style.background = btnState === state ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface)';
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

  // 14. Setup Manual Backend Demo
  const manualProvider = findEl('manual-provider') as any;
  const backendStatus = findEl('manual-backend-status');
  let manualInterval: any;

  manualProvider?.addEventListener('speech-request-start', () => {
    if (backendStatus) backendStatus.textContent = 'Backend: HANDSHAKE...';
    setTimeout(() => {
      manualProvider.state = 'recording';
      if (backendStatus) backendStatus.textContent = 'Backend: STREAMING';
      let i = 0;
      const words = ['Simulating', ' actual', ' backend', ' data', ' stream...'];
      manualInterval = setInterval(() => {
        if (i < words.length) {
          manualProvider.partialTranscript += words[i];
          i++;
        }
      }, 600);
    }, 1000);
  });

  manualProvider?.addEventListener('speech-request-stop', () => {
    clearInterval(manualInterval);
    if (backendStatus) backendStatus.textContent = 'Backend: PROCESSING...';
    manualProvider.state = 'processing';
    setTimeout(() => {
      manualProvider.state = 'success';
      if (backendStatus) backendStatus.textContent = 'Backend: SUCCESS';
      setTimeout(() => {
        manualProvider.state = 'idle';
        manualProvider.partialTranscript = '';
        if (backendStatus) backendStatus.textContent = 'Backend: IDLE';
      }, 1500);
    }, 2000);
  });
});
