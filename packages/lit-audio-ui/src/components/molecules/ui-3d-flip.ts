/**
 * Copyright 2026 Google LLC
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@material/web/icon/icon.js';

/**
 * A layout utility component that provides 3D card flipping functionality.
 */
@customElement('ui-3d-flip')
export class Ui3dFlip extends LitElement {
  @property({type: Boolean, reflect: true}) flipped = false;
  @property({type: String, reflect: true}) axis: 'x' | 'y' = 'y';
  @property({type: String}) duration = '0.6s';

  static override styles = css`
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

  override render() {
    return html`
      <div
        class="flip-container"
        style="--ui-3d-flip-duration: ${this.duration}"
      >
        <div class="front">
          <slot name="front"></slot>
          <div class="flip-trigger" @click=${this.toggle}>
            <slot name="flip-icon"
              ><md-icon
                style="color: white; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"
                >info</md-icon
              ></slot
            >
          </div>
        </div>
        <div class="back">
          <slot name="back"></slot>
          <div class="flip-trigger" @click=${this.toggle}>
            <slot name="flip-icon-back"
              ><md-icon style="color: var(--md-sys-color-primary);"
                >close</md-icon
              ></slot
            >
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
