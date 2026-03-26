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
import {type AgentState} from '@ghchinoy/lit-audio-ui';

/**
 * A gallery showcasing the ui-moving-gradient component.
 */
@customElement('demo-gradient-gallery')
export class DemoGradientGallery extends LitElement {
  @state() private _agentState: AgentState = null;
  @state() private _baseHeight = 0.05;
  @state() private _speed = 1.0;
  
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      justify-items: center;
    }
    .gradient-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 100%;
      max-width: 400px;
    }
    .gradient-container {
      width: 100%;
      height: 600px;
      background: var(--md-sys-color-surface-container-highest);
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    
    .screen-mock {
      width: 100%;
      height: 100%;
      background: #0E0E0F;
      position: relative;
      overflow: hidden;
    }
    
    .screen-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      padding: 24px;
      pointer-events: none;
      z-index: 10;
    }
    
    .top-bar {
      display: flex;
      justify-content: space-between;
      color: white;
      font-family: sans-serif;
      font-size: 14px;
      margin-bottom: 20px;
    }
    
    .logo {
      font-weight: bold;
      font-size: 20px;
      background: linear-gradient(90deg, #4285F4, #EA4335, #FBBC04, #34A853);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .gradient-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--md-sys-color-on-surface-variant);
      text-align: center;
    }
    
    .controls {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 12px;
      width: 100%;
    }
    
    .button-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .slider-group {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 0 16px;
      box-sizing: border-box;
    }
    
    .slider-group label {
      width: 90px;
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant);
    }
    
    .slider-group input {
      flex: 1;
    }
    
    .slider-group span {
      width: 40px;
      font-size: 12px;
      font-family: monospace;
      text-align: right;
      color: var(--md-sys-color-on-surface);
    }
    
    button {
      padding: 8px 16px;
      border-radius: 16px;
      border: 1px solid var(--md-sys-color-outline);
      background: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
      cursor: pointer;
      font-family: inherit;
    }
    
    button:hover {
      background: var(--md-sys-color-surface-container-high);
    }
    
    button.active {
      background: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      border-color: var(--md-sys-color-primary);
    }
  `;

  render() {
    return html`
      <div class="gallery-grid">
        <div class="gradient-item">
          <div class="gradient-container">
            <div class="screen-mock">
              <ui-moving-gradient
                .agentState=${this._agentState}
                .colors="${['#0068FF', '#0077FF', '#0073FF']}"
                .baseHeight=${this._baseHeight}
                .speed=${this._speed}
              ></ui-moving-gradient>
            </div>
          </div>
          <div class="gradient-label">Blue Gradient Variant</div>
          
          <div class="controls">
            <div class="button-group">
              <button 
                class=${this._agentState === null ? 'active' : ''}
                @click=${() => this._agentState = null}>Idle</button>
              <button 
                class=${this._agentState === 'listening' ? 'active' : ''}
                @click=${() => this._agentState = 'listening'}>User Speaking</button>
              <button 
                class=${this._agentState === 'thinking' ? 'active' : ''}
                @click=${() => this._agentState = 'thinking'}>Thinking</button>
              <button 
                class=${this._agentState === 'talking' ? 'active' : ''}
                @click=${() => this._agentState = 'talking'}>AI Talking</button>
            </div>
            
            <div class="slider-group">
              <label>Base Height:</label>
              <input type="range" min="0" max="0.5" step="0.01" .value=${this._baseHeight.toString()} @input=${(e: Event) => this._baseHeight = parseFloat((e.target as HTMLInputElement).value)}>
              <span>${this._baseHeight.toFixed(2)}</span>
            </div>
            
            <div class="slider-group">
              <label>Speed:</label>
              <input type="range" min="0" max="5" step="0.1" .value=${this._speed.toString()} @input=${(e: Event) => this._speed = parseFloat((e.target as HTMLInputElement).value)}>
              <span>${this._speed.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
