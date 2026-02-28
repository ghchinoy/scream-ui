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
 * distributed under the License.
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('demo-producer-bar')
export class DemoProducerBar extends LitElement {
  @property({type: Array}) peaks?: number[];

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .producer-bar-wrapper {
      position: relative;
      width: 100%;
      height: 64px;
      background: var(--md-sys-color-surface-container-low, #f0f0f0);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
    }
    .producer-waveform {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0.6;
    }
    .producer-slider {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
    }
    .producer-slider::part(slider) {
      --md-slider-active-track-color: rgba(0, 102, 255, 0.4);
      --md-slider-inactive-track-color: transparent;
      --md-slider-active-track-height: 64px;
      --md-slider-inactive-track-height: 64px;
      --md-slider-handle-shape: 0px;
      --md-slider-handle-width: 4px;
      --md-slider-handle-height: 64px;
    }
    .controls {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 12px;
    }
  `;

  render() {
    return html`
      <ui-audio-provider src="https://storage.googleapis.com/scream-ui-samples/neon_pulse.mp3">
        <div class="controls">
          <ui-audio-play-button></ui-audio-play-button>
          <ui-audio-time-display format="elapsed"></ui-audio-time-display>
        </div>
        
        <div class="producer-bar-wrapper">
          <ui-waveform 
            class="producer-waveform" 
            .peaks="${this.peaks}" 
            height="64" 
            align="bottom" 
            barColor="var(--md-sys-color-primary, #0066cc)" 
            fadeEdges="false"
          ></ui-waveform>
          <ui-audio-progress-slider class="producer-slider"></ui-audio-progress-slider>
        </div>
      </ui-audio-provider>
    `;
  }
}
