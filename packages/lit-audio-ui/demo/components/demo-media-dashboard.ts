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

import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {type PlaylistTrack} from '../../src/utils/audio-context.js';

@customElement('demo-media-dashboard')
export class DemoMediaDashboard extends LitElement {
  @state() private _playlist: PlaylistTrack[] = [
    {
      id: 'dash-1',
      src: 'https://storage.googleapis.com/scream-ui-samples/music_sample.wav',
      title: 'Global Broadcast 01',
      artist: 'Scream Network',
      artwork: 'https://storage.googleapis.com/scream-ui-samples/cinematic.png',
    },
    {
      id: 'dash-2',
      src: 'https://storage.googleapis.com/scream-ui-samples/lofi.wav',
      title: 'Midnight Transmission',
      artist: 'Digital Echo',
      artwork: 'https://storage.googleapis.com/scream-ui-samples/lofi.png',
    },
    {
      id: 'dash-3',
      src: 'https://storage.googleapis.com/scream-ui-samples/acoustic.wav',
      title: 'Subtle Frequency',
      artist: 'Acoustic AI',
      artwork: 'https://storage.googleapis.com/scream-ui-samples/acoustic.png',
    },
    {
      id: 'dash-4',
      src: 'https://storage.googleapis.com/scream-ui-samples/speech_sample-Aoede-20260212-183352.wav',
      title: 'System Intelligence Update',
      artist: 'Aoede',
      artwork: 'https://storage.googleapis.com/scream-ui-samples/lofi.png',
    },
  ];

  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      grid-template-rows: auto auto;
      gap: 1px;
      background: var(--md-sys-color-outline-variant);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 700px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    .hero-section {
      background: var(--md-sys-color-surface-container-high);
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      min-width: 0;
    }

    .now-playing-header {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .mini-art {
      width: 64px;
      height: 64px;
      border-radius: 8px;
      object-fit: cover;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .track-meta {
      flex: 1;
      min-width: 0;
    }

    .track-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .track-artist {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.7;
    }

    .viz-container {
      height: 120px;
      background: rgba(0,0,0,0.1);
      border-radius: 12px;
      overflow: hidden;
      position: relative;
    }

    .sidebar {
      background: var(--md-sys-color-surface-container);
      grid-row: 1 / 3;
      grid-column: 2;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    @media (max-width: 700px) {
      .sidebar {
        grid-row: auto;
        grid-column: 1;
        max-height: 300px;
      }
    }

    .playlist-scroll {
      flex: 1;
      overflow-y: auto;
    }

    .bottom-bar {
      grid-column: 1;
      background: var(--md-sys-color-surface-container-highest);
      padding: 16px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    @media (max-width: 700px) {
      .bottom-bar {
        grid-column: 1;
        flex-direction: column;
        gap: 16px;
      }
    }

    .nav-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .progress-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .buffering-indicator {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--md-sys-color-primary);
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { opacity: 0.4; }
      50% { opacity: 1; }
      100% { opacity: 0.4; }
    }
  `;

  render() {
    return html`
      <ui-audio-provider id="dash-provider" .items="${this._playlist}" @state-change="${() => this.requestUpdate()}">
        <div class="dashboard-grid">
          
          <!-- MAIN HERO -->
          <div class="hero-section">
            <div class="now-playing-header">
              <img class="mini-art" src="${this._getCurrentTrack()?.artwork}" alt="Art" />
              <div class="track-meta">
                <h3 class="track-title">${this._getCurrentTrack()?.title}</h3>
                <p class="track-artist">${this._getCurrentTrack()?.artist}</p>
              </div>
              ${this._isBuffering() ? html`<span class="buffering-indicator">Buffering...</span>` : ''}
            </div>

            <div class="viz-container">
              <ui-spectrum-visualizer 
                height="120" 
                barWidth="4" 
                barGap="2">
              </ui-spectrum-visualizer>
            </div>
          </div>

          <!-- SIDEBAR PLAYLIST -->
          <div class="sidebar">
            <div class="playlist-scroll">
              <ui-playlist header="Up Next"></ui-playlist>
            </div>
            <div style="padding: 16px; border-top: 1px solid var(--md-sys-color-outline-variant);">
              <ui-audio-volume-slider></ui-audio-volume-slider>
            </div>
          </div>

          <!-- BOTTOM TRANSPORT -->
          <div class="bottom-bar">
            <div class="nav-controls">
              <ui-audio-prev-button></ui-audio-prev-button>
              <ui-audio-play-button></ui-audio-play-button>
              <ui-audio-next-button></ui-audio-next-button>
            </div>

            <div class="progress-area">
              <ui-audio-progress-slider></ui-audio-progress-slider>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <ui-audio-time-display 
                  format="combined" 
                  separator=" of " 
                  style="font-size: 11px; font-weight: 600; opacity: 0.8;">
                </ui-audio-time-display>
                <span style="font-size: 10px; opacity: 0.5; font-family: monospace;">
                  INDEX: ${this._getCurrentIndex() + 1}/${this._playlist.length}
                </span>
              </div>
            </div>
          </div>

        </div>
      </ui-audio-provider>
    `;
  }

  private _getCurrentTrack() {
    const provider = this.shadowRoot?.getElementById('dash-provider') as any;
    const index = provider?.state?.currentIndex ?? 0;
    return this._playlist[index >= 0 ? index : 0];
  }

  private _getCurrentIndex() {
    const provider = this.shadowRoot?.getElementById('dash-provider') as any;
    return provider?.state?.currentIndex ?? 0;
  }

  private _isBuffering() {
    const provider = this.shadowRoot?.getElementById('dash-provider') as any;
    return provider?.state?.isBuffering ?? false;
  }
}
