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
import { consume } from '@lit/context';
import { speechContext } from '../../utils/speech-context.js';
import '../molecules/ui-live-waveform.js';
/**
 * A specialized version of ui-live-waveform that automatically consumes
 * state from a nearby ui-speech-provider.
 *
 * @element ui-voice-waveform
 */
let UiVoiceWaveform = class UiVoiceWaveform extends LitElement {
    constructor() {
        super(...arguments);
        this.barWidth = 2;
        this.barGap = 1;
        this.barColor = 'currentColor';
        this.height = 20;
    }
    static { this.styles = css `
    :host {
      display: block;
      width: 100%;
    }
  `; }
    render() {
        if (!this._context)
            return html ``;
        const isRecording = this._context.state === 'recording';
        const isProcessing = this._context.state === 'processing' ||
            this._context.state === 'connecting';
        const isActive = isRecording || isProcessing;
        if (!isActive)
            return html ``;
        return html `
      <ui-live-waveform
        .active=${isRecording}
        .processing=${isProcessing}
        .analyserNode=${this._context.analyserNode}
        .barWidth=${this.barWidth}
        .barGap=${this.barGap}
        .barColor=${this.barColor}
        .height=${this.height}
      ></ui-live-waveform>
    `;
    }
};
__decorate([
    consume({ context: speechContext, subscribe: true })
], UiVoiceWaveform.prototype, "_context", void 0);
__decorate([
    property({ type: Number })
], UiVoiceWaveform.prototype, "barWidth", void 0);
__decorate([
    property({ type: Number })
], UiVoiceWaveform.prototype, "barGap", void 0);
__decorate([
    property({ type: String })
], UiVoiceWaveform.prototype, "barColor", void 0);
__decorate([
    property({ type: Number })
], UiVoiceWaveform.prototype, "height", void 0);
UiVoiceWaveform = __decorate([
    customElement('ui-voice-waveform')
], UiVoiceWaveform);
export { UiVoiceWaveform };
//# sourceMappingURL=ui-voice-waveform.js.map