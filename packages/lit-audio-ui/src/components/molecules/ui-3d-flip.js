/**
 * Copyright 2026 Google LLC
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@material/web/icon/icon.js';
/**
 * A layout utility component that provides 3D card flipping functionality.
 */
let Ui3dFlip = class Ui3dFlip extends LitElement {
    constructor() {
        super(...arguments);
        this.flipped = false;
        this.axis = 'y';
        this.duration = '0.6s';
    }
    static { this.styles = css `
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
  `; }
    render() {
        return html `
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
    toggle() {
        this.flipped = !this.flipped;
        this.dispatchEvent(new CustomEvent('flip-change', {
            detail: { flipped: this.flipped },
            bubbles: true,
            composed: true,
        }));
    }
};
__decorate([
    property({ type: Boolean, reflect: true })
], Ui3dFlip.prototype, "flipped", void 0);
__decorate([
    property({ type: String, reflect: true })
], Ui3dFlip.prototype, "axis", void 0);
__decorate([
    property({ type: String })
], Ui3dFlip.prototype, "duration", void 0);
Ui3dFlip = __decorate([
    customElement('ui-3d-flip')
], Ui3dFlip);
export { Ui3dFlip };
//# sourceMappingURL=ui-3d-flip.js.map