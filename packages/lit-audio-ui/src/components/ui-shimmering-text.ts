import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * A native Lit WebComponent that provides a shimmering text animation, commonly used for loading 
 * or "thinking" states. Replaces the React/Framer Motion ShimmeringText component.
 */
@customElement('ui-shimmering-text')
export class UiShimmeringText extends LitElement {
  @property({ type: String }) text = '';
  @property({ type: Number }) duration = 2; // Animation duration in seconds
  @property({ type: Number }) delay = 0; // Delay before starting animation
  @property({ type: Boolean }) repeat = true;
  @property({ type: Number }) repeatDelay = 0.5; // Pause duration between repeats
  @property({ type: Boolean }) startOnView = true;
  @property({ type: Boolean }) once = false;
  @property({ type: Number }) spread = 2; // Shimmer spread multiplier
  @property({ type: String }) color?: string; // Base text color
  @property({ type: String }) shimmerColor?: string; // Shimmer gradient color


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
      background-size: 250% 100%, auto;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      background-repeat: no-repeat, padding-box;
      
      /* Default colors fallback to MD3 tokens if available, otherwise gray/white */
      --base-color: var(--md-sys-color-on-surface-variant, #757575);
      --shimmer-color: var(--md-sys-color-on-surface, #1e1e1e);
      
      --shimmer-bg: linear-gradient(
        90deg,
        transparent calc(50% - var(--spread)),
        var(--shimmer-color),
        transparent calc(50% + var(--spread))
      );
      
      background-image: var(--shimmer-bg), linear-gradient(var(--base-color), var(--base-color));
      background-position: 100% center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    /* When active, trigger the keyframe animation */
    span.active {
      opacity: 1;
      /* Animation properties are dynamically injected via inline styles 
         to support the custom duration, delay, and repeat logic */
    }

    @keyframes shimmer {
      from { background-position: 100% center; }
      to { background-position: 0% center; }
    }
  `;

  firstUpdated() {
    if (this.startOnView) {
      this._intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
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
    
    // Construct the animation CSS string based on properties
    let animationStyle = 'none';
    if (shouldAnimate) {
       // To simulate repeatDelay in pure CSS without complex dual-keyframes, 
       // we simply extend the overall duration and only animate a percentage of it.
       // However, since we are translating a complex Framer Motion config, the cleanest 
       // pure CSS approach is to use the standard infinite loop if repeatDelay is 0.
       // If repeatDelay > 0, we can use JS to re-trigger it, OR use standard CSS.
       
       const totalCycleTime = this.duration + this.repeatDelay;
       const iterCount = this.repeat ? 'infinite' : '1';
       
       animationStyle = `shimmer ${totalCycleTime}s linear ${this.delay}s ${iterCount}`;
    }

    const inlineStyles = {
      '--spread': dynamicSpread,
      ...(this.color && { '--base-color': this.color }),
      ...(this.shimmerColor && { '--shimmer-color': this.shimmerColor }),
      'animation': animationStyle,
      // If we are not repeating and should animate, lock the final state
      'background-position': (shouldAnimate && !this.repeat) ? '0% center' : '100% center'
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
