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
import { customElement, property, state } from 'lit/decorators.js';
/**
 * A native Lit WebComponent that provides a shimmering text animation.
 */
let UiShimmeringText = class UiShimmeringText extends LitElement {
    constructor() {
        super(...arguments);
        this.text = '';
        this.duration = 2;
        this.delay = 0;
        this.repeat = true;
        this.repeatDelay = 0.5;
        this.startOnView = true;
        this.once = false;
        this.spread = 2;
        this._isInView = false;
    }
    static { this.styles = css `
    :host {
      display: inline-block;
      font-family: inherit;
    }
    span {
      position: relative;
      display: inline-block;
      --base-color: color-mix(
        in srgb,
        var(--md-sys-color-on-surface, #1e1e1e) 20%,
        transparent
      );
      --shimmer-color: var(--md-sys-color-on-surface, #1e1e1e);
      --shimmer-bg: linear-gradient(
        90deg,
        transparent calc(50% - var(--spread)),
        var(--shimmer-color) 50%,
        transparent calc(50% + var(--spread))
      );
      background-image:
        var(--shimmer-bg), linear-gradient(var(--base-color), var(--base-color));
      background-size:
        250% 100%,
        auto;
      background-position: 100% center;
      background-repeat: no-repeat;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    span.active {
      opacity: 1;
    }
    @keyframes shimmer {
      0% {
        background-position: 100% center;
      }
      100% {
        background-position: 0% center;
      }
    }
  `; }
    firstUpdated() {
        if (this.startOnView) {
            this._intersectionObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this._isInView = true;
                        if (this.once && this._intersectionObserver) {
                            this._intersectionObserver.disconnect();
                        }
                    }
                    else if (!this.once) {
                        this._isInView = false;
                    }
                });
            });
            this._intersectionObserver.observe(this);
        }
        else {
            this._isInView = true;
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._intersectionObserver) {
            this._intersectionObserver.disconnect();
        }
    }
    render() {
        const shouldAnimate = !this.startOnView || this._isInView;
        const dynamicSpread = `${this.text.length * this.spread}px`;
        const totalCycleTime = this.duration + this.repeatDelay;
        const iterCount = this.repeat ? 'infinite' : '1';
        const inlineStyles = {
            '--spread': dynamicSpread,
            ...(this.color && { '--base-color': this.color }),
            ...(this.shimmerColor && { '--shimmer-color': this.shimmerColor }),
            'animation-name': shouldAnimate ? 'shimmer' : 'none',
            'animation-duration': `${totalCycleTime}s`,
            'animation-timing-function': 'linear',
            'animation-delay': `${this.delay}s`,
            'animation-iteration-count': iterCount,
            'background-position': shouldAnimate && !this.repeat ? '0% center' : '100% center',
        };
        const styleString = Object.entries(inlineStyles)
            .map(([k, v]) => `${k}: ${v}`)
            .join('; ');
        return html `<span
      class="${shouldAnimate ? 'active' : ''}"
      style="${styleString}"
      >${this.text}</span
    >`;
    }
};
__decorate([
    property({ type: String })
], UiShimmeringText.prototype, "text", void 0);
__decorate([
    property({ type: Number })
], UiShimmeringText.prototype, "duration", void 0);
__decorate([
    property({ type: Number })
], UiShimmeringText.prototype, "delay", void 0);
__decorate([
    property({ type: Boolean })
], UiShimmeringText.prototype, "repeat", void 0);
__decorate([
    property({ type: Number })
], UiShimmeringText.prototype, "repeatDelay", void 0);
__decorate([
    property({ type: Boolean })
], UiShimmeringText.prototype, "startOnView", void 0);
__decorate([
    property({ type: Boolean })
], UiShimmeringText.prototype, "once", void 0);
__decorate([
    property({ type: Number })
], UiShimmeringText.prototype, "spread", void 0);
__decorate([
    property({ type: String })
], UiShimmeringText.prototype, "color", void 0);
__decorate([
    property({ type: String })
], UiShimmeringText.prototype, "shimmerColor", void 0);
__decorate([
    state()
], UiShimmeringText.prototype, "_isInView", void 0);
UiShimmeringText = __decorate([
    customElement('ui-shimmering-text')
], UiShimmeringText);
export { UiShimmeringText };
//# sourceMappingURL=ui-shimmering-text.js.map