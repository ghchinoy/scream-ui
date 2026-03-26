var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { audioPlayerContext, } from '../../utils/audio-context.js';
import '@material/web/slider/slider.js';
let UiAudioProgressSlider = class UiAudioProgressSlider extends LitElement {
    constructor() {
        super(...arguments);
        this._isDragging = false;
        this._dragValue = 0;
    }
    static { this.styles = css `
    :host {
      display: flex;
      width: 100%;
      align-items: center;
      min-width: 0;
    }

    md-slider {
      width: 100%;
      min-width: 0;
      flex: 1;
      /* Give the slider track better contrast against backgrounds */
      --md-slider-inactive-track-color: var(--md-sys-color-outline, #79747e);
    }
  `; }
    render() {
        const duration = this.playerState?.duration || 0;
        const disabled = duration === 0 || !this.playerState?.src;
        // Smooth rendering: if user is actively dragging, display their local drag value,
        // otherwise display the context's current time.
        const currentValue = this._isDragging
            ? this._dragValue
            : this.playerState?.currentTime || 0;
        return html `
      <md-slider
        aria-label="Playback progress"
        min="0"
        max="${duration || 100}"
        value="${currentValue}"
        step="0.1"
        ?disabled="${disabled}"
        @input="${this._handleInput}"
        @change="${this._handleChange}"
      ></md-slider>
    `;
    }
    _handleInput(e) {
        this._isDragging = true;
        const slider = e.target;
        this._dragValue = slider.value;
    }
    _handleChange(e) {
        const slider = e.target;
        this._dragValue = slider.value;
        if (this.playerState) {
            this.playerState.seek(this._dragValue);
        }
        this._isDragging = false;
    }
};
__decorate([
    consume({ context: audioPlayerContext, subscribe: true }),
    property({ attribute: false })
], UiAudioProgressSlider.prototype, "playerState", void 0);
UiAudioProgressSlider = __decorate([
    customElement('ui-audio-progress-slider')
], UiAudioProgressSlider);
export { UiAudioProgressSlider };
//# sourceMappingURL=ui-audio-progress-slider.js.map