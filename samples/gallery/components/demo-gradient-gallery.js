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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
/**
 * A gallery showcasing the ui-moving-gradient component.
 */
let DemoGradientGallery = class DemoGradientGallery extends LitElement {
    constructor() {
        super(...arguments);
        this._agentState = null;
        this._baseHeight = 0.05;
        this._speed = 1.0;
        this._colors = ['#0068FF', '#0077FF', '#0073FF'];
        this._stops = [0.0, 0.5, 0.86];
    }
    static { this.styles = css `
    :host {
      display: block;
      width: 100%;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
      justify-items: center;
    }
    .gradient-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
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
      background: var(--md-sys-color-surface-container);
      padding: 16px;
      border-radius: 16px;
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
      box-sizing: border-box;
    }
    
    .slider-group label {
      width: 90px;
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant);
    }
    
    .slider-group input[type="range"] {
      flex: 1;
    }
    
    .slider-group span {
      width: 40px;
      font-size: 12px;
      font-family: monospace;
      text-align: right;
      color: var(--md-sys-color-on-surface);
    }
    
    .stops-editor {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .stops-header {
      font-size: 14px;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stop-row {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--md-sys-color-surface-container-low);
      padding: 8px;
      border-radius: 8px;
    }

    .stop-pct {
      width: 60px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .stop-pct input {
      width: 40px;
      background: transparent;
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 4px;
      padding: 4px;
      color: var(--md-sys-color-on-surface);
      font-family: monospace;
    }

    .stop-color {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .stop-color input[type="color"] {
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .stop-color input[type="text"] {
      width: 70px;
      background: transparent;
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 4px;
      padding: 4px;
      color: var(--md-sys-color-on-surface);
      font-family: monospace;
      text-transform: uppercase;
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
  `; }
    _updateColor(index, val) {
        const newColors = [...this._colors];
        newColors[index] = val;
        this._colors = newColors;
    }
    _updateStop(index, val) {
        const newStops = [...this._stops];
        newStops[index] = val / 100.0;
        this._stops = newStops;
    }
    _generateCodeSnippet() {
        const colorsStr = `['${this._colors.join("', '")}']`;
        const stopsStr = `[${this._stops.join(', ')}]`;
        const agentStateStr = this._agentState ? `'${this._agentState}'` : 'null';
        return `<div style="width: 100%; height: 600px; background: #0E0E0F;">
  <ui-moving-gradient
    .agentState=\${${agentStateStr}}
    .colors="\${${colorsStr}}"
    .stops="\${${stopsStr}}"
    baseHeight="${this._baseHeight}"
    speed="${this._speed}"
  ></ui-moving-gradient>
</div>`;
    }
    render() {
        return html `
      <div class="gallery-grid">
        <ui-showcase-card title="ui-moving-gradient" description="Ambient full-screen gradient visualization.">
          <div class="gradient-item">
            <div class="gradient-container">
              <div class="screen-mock">
                <ui-moving-gradient
                  .agentState=${this._agentState}
                  .colors=${this._colors}
                  .stops=${this._stops}
                  .baseHeight=${this._baseHeight}
                  .speed=${this._speed}
                ></ui-moving-gradient>
              </div>
            </div>
            
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
                <input type="range" min="0" max="0.5" step="0.01" .value=${this._baseHeight.toString()} @input=${(e) => this._baseHeight = parseFloat(e.target.value)}>
                <span>${this._baseHeight.toFixed(2)}</span>
              </div>
              
              <div class="slider-group">
                <label>Speed:</label>
                <input type="range" min="0" max="5" step="0.1" .value=${this._speed.toString()} @input=${(e) => this._speed = parseFloat(e.target.value)}>
                <span>${this._speed.toFixed(1)}</span>
              </div>

              <div class="stops-editor">
                <div class="stops-header">
                  <span>Stops</span>
                </div>
                
                ${[0, 1, 2].map(i => html `
                  <div class="stop-row">
                    <div class="stop-pct">
                      <input 
                        type="number" 
                        min="0" max="100" 
                        .value=${Math.round(this._stops[i] * 100).toString()}
                        @change=${(e) => this._updateStop(i, parseInt(e.target.value) || 0)}
                      >
                      <span>%</span>
                    </div>
                    <div class="stop-color">
                      <input 
                        type="color" 
                        .value=${this._colors[i]}
                        @input=${(e) => this._updateColor(i, e.target.value)}
                      >
                      <input 
                        type="text" 
                        .value=${this._colors[i].toUpperCase()}
                        @change=${(e) => {
            let val = e.target.value;
            if (!val.startsWith('#'))
                val = '#' + val;
            this._updateColor(i, val);
        }}
                      >
                    </div>
                  </div>
                `)}
              </div>
              
            </div>
          </div>
          <div slot="code">${this._generateCodeSnippet()}</div>
        </ui-showcase-card>
      </div>
    `;
    }
};
__decorate([
    state()
], DemoGradientGallery.prototype, "_agentState", void 0);
__decorate([
    state()
], DemoGradientGallery.prototype, "_baseHeight", void 0);
__decorate([
    state()
], DemoGradientGallery.prototype, "_speed", void 0);
__decorate([
    state()
], DemoGradientGallery.prototype, "_colors", void 0);
__decorate([
    state()
], DemoGradientGallery.prototype, "_stops", void 0);
DemoGradientGallery = __decorate([
    customElement('demo-gradient-gallery')
], DemoGradientGallery);
export { DemoGradientGallery };
//# sourceMappingURL=demo-gradient-gallery.js.map