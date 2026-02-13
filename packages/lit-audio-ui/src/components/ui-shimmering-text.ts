import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

/**
 * A native Lit WebComponent that provides a shimmering text animation, commonly used for loading
 * or "thinking" states. Replaces the React/Framer Motion ShimmeringText component.
 */
@customElement('ui-shimmering-text')
export class UiShimmeringText extends LitElement {
  @property({type: String}) text = '';
  @property({type: Number}) duration = 2; // Animation duration in seconds
  @property({type: Number}) delay = 0; // Delay before starting animation
  @property({type: Boolean}) repeat = true;
  @property({type: Number}) repeatDelay = 0.5; // Pause duration between repeats
  @property({type: Boolean}) startOnView = true;
  @property({type: Boolean}) once = false;
  @property({type: Number}) spread = 2; // Shimmer spread multiplier
  @property({type: String}) color?: string; // Base text color
  @property({type: String}) shimmerColor?: string; // Shimmer gradient color

  @state() private _isInView = false;

  private _intersectionObserver?: IntersectionObserver;

  static styles = css`
    :host {
      display: inline-block;
      font-family: inherit;
    }

    span {
      position: relative;
      display: inline-block;

      /* Default colors fallback to MD3 tokens if available */
      /* Use a highly transparent base color for maximum contrast against the shimmer */
      --base-color: color-mix(in srgb, var(--md-sys-color-on-surface, #1e1e1e) 20%, transparent);
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
        auto; /* Important: this defines the size of the animated gradient */
      background-position: 100% center;
      background-repeat: no-repeat;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    /* When active, trigger the keyframe animation */
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
  `;

  firstUpdated() {
    if (this.startOnView) {
      this._intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this._isInView = true;
            if (this.once && this._intersectionObserver) {
              this._intersectionObserver.disconnect();
            }
          } else if (!this.once) {
            this._isInView = false;
          }
        });
      });
      this._intersectionObserver.observe(this);
    } else {
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
      ...(this.color && {'--base-color': this.color}),
      ...(this.shimmerColor && {'--shimmer-color': this.shimmerColor}),
      'animation-name': shouldAnimate ? 'shimmer' : 'none',
      'animation-duration': `${totalCycleTime}s`,
      'animation-timing-function': 'linear',
      'animation-delay': `${this.delay}s`,
      'animation-iteration-count': iterCount,
      'background-position':
        shouldAnimate && !this.repeat ? '0% center' : '100% center',
    };

    // Convert object to string for Lit
    const styleString = Object.entries(inlineStyles)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    return html`
      <span class="${shouldAnimate ? 'active' : ''}" style="${styleString}">
        ${this.text}
      </span>
    `;
  }
}
