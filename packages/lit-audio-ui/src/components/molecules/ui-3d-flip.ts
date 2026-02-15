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
import {customElement, property} from 'lit/decorators.js';
import '@material/web/icon/icon.js';

/**
 * A layout utility component that provides 3D card flipping functionality.
 * Use the 'front' and 'back' slots to define the contents.
 *
 * @element ui-3d-flip
 *
 * @prop {boolean} flipped - Whether the card is showing its back side.
 * @prop {string} axis - The axis to flip on: 'x' or 'y' (default: 'y').
 * @prop {string} duration - Animation duration (default: '0.6s').
 */
@customElement('ui-3d-flip')
export class Ui3dFlip extends LitElement {
  @property({type: Boolean, reflect: true}) flipped = false;
  @property({type: String, reflect: true}) axis: 'x' | 'y' = 'y';
  @property({type: String}) duration = '0.6s';

  static styles = css`
    :host {
      display: block;
      perspective: 1000px;
      width: 100%;
      height: 100%;
    }

    .flip-container {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      transition: transform var(--ui-3d-flip-duration, 0.6s);
      transform-style: preserve-3d;
    }

    :host([flipped]) .flip-container {
      transform: rotateY(180deg);
    }

    :host([flipped][axis='x']) .flip-container {
      transform: rotateX(180deg);
    }

    .front,
    .back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      display: flex;
      flex-direction: column;
      border-radius: inherit;
      overflow: hidden;
    }

    .back {
      transform: rotateY(180deg);
      background: var(--md-sys-color-surface, #ffffff);
    }

    :host([axis='x']) .back {
      transform: rotateX(180deg);
    }

    /* Slot for optional trigger icon */
    .flip-trigger {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 10;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

  render() {
    return html`
      <div
        class="flip-container"
        style="--ui-3d-flip-duration: ${this.duration}"
      >
        <div class="front">
          <slot name="front"></slot>
          <div class="flip-trigger" @click=${this.toggle}>
            <slot name="flip-icon">
              <!-- Default info icon if nothing provided -->
              <md-icon style="color: white; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">info</md-icon>
            </slot>
          </div>
        </div>
        <div class="back">
          <slot name="back"></slot>
          <div class="flip-trigger" @click=${this.toggle}>
            <slot name="flip-icon-back">
              <md-icon style="color: var(--md-sys-color-primary);">close</md-icon>
            </slot>
          </div>
        </div>
      </div>
    `;
  }

  public toggle() {
    this.flipped = !this.flipped;
    this.dispatchEvent(
      new CustomEvent('flip-change', {
        detail: {flipped: this.flipped},
        bubbles: true,
        composed: true,
      }),
    );
  }
}
