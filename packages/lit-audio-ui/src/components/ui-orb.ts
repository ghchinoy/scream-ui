import {LitElement, html, css} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import * as THREE from 'three';

export type AgentState = null | 'thinking' | 'listening' | 'talking';

@customElement('ui-orb')
export class UiOrb extends LitElement {
  @property({type: Array}) colors?: [string, string];
  @property({type: String}) agentState: AgentState = null;
  @property({type: Number}) inputVolume = 0;
  @property({type: Number}) outputVolume = 0;
  @property({type: String}) volumeMode: 'auto' | 'manual' = 'auto';
  @property({type: Number}) seed = Math.floor(Math.random() * 2 ** 32);

  @query('.container') private _container!: HTMLDivElement;

  private _renderer?: THREE.WebGLRenderer;
  private _scene?: THREE.Scene;
  private _camera?: THREE.OrthographicCamera;
  private _mesh?: THREE.Mesh<THREE.CircleGeometry, THREE.ShaderMaterial>;
  private _animationFrameId: number = 0;
  private _resizeObserver?: ResizeObserver;

  // State refs for animation loop
  private _animSpeed = 0.1;
  private _curIn = 0;
  private _curOut = 0;
  private _targetColor1!: THREE.Color;
  private _targetColor2!: THREE.Color;
  private _textureLoader = new THREE.TextureLoader();
  private _perlinNoiseTexture?: THREE.Texture;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }
    .container {
      width: 100%;
      height: 100%;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  render() {
    return html`<div class="container"></div>`;
  }

  firstUpdated() {
    this._initThree();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('colors')) {
      this._updateColors();
    }
  }

  private _updateColors() {
    if (!this._targetColor1 || !this._targetColor2) return;

    if (this.colors && this.colors.length === 2) {
      this._targetColor1.set(this.colors[0]);
      this._targetColor2.set(this.colors[1]);
    } else {
      // Fallback to MD3 tokens from computed style
      const style = getComputedStyle(this);
      const primary =
        style.getPropertyValue('--md-sys-color-primary').trim() || '#CADCFC';
      const secondary =
        style.getPropertyValue('--md-sys-color-secondary').trim() || '#A0B9D1';
      this._targetColor1.set(primary);
      this._targetColor2.set(secondary);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._animationFrameId) cancelAnimationFrame(this._animationFrameId);
    if (this._resizeObserver) this._resizeObserver.disconnect();
    if (this._renderer) this._renderer.dispose();
    if (this._mesh) {
      this._mesh.geometry.dispose();
      this._mesh.material.dispose();
    }
  }

  private async _initThree() {
    if (!this._container) return;

    this._targetColor1 = new THREE.Color();
    this._targetColor2 = new THREE.Color();
    this._updateColors();

    // Load texture
    try {
      this._perlinNoiseTexture = await this._textureLoader.loadAsync(
        'https://storage.googleapis.com/eleven-public-cdn/images/perlin-noise.png',
      );
      this._perlinNoiseTexture.wrapS = THREE.RepeatWrapping;
      this._perlinNoiseTexture.wrapT = THREE.RepeatWrapping;
    } catch (e) {
      console.warn('Failed to load perlin noise texture for orb.', e);
      return; // Need texture to run shader
    }

    const width = this._container.clientWidth;
    const height = this._container.clientHeight;

    this._scene = new THREE.Scene();

    // Orthographic camera for 2D shader work
    this._camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 10);
    this._camera.position.z = 1;

    this._renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    });
    this._renderer.setSize(width, height);
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._container.appendChild(this._renderer.domElement);

    const random = this._splitmix32(this.seed);
    const offsets = new Float32Array(
      Array.from({length: 7}, () => random() * Math.PI * 2),
    );

    const isDark =
      document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const uniforms = {
      uColor1: new THREE.Uniform(this._targetColor1),
      uColor2: new THREE.Uniform(this._targetColor2),
      uOffsets: {value: offsets},
      uPerlinTexture: new THREE.Uniform(this._perlinNoiseTexture),
      uTime: new THREE.Uniform(0),
      uAnimation: new THREE.Uniform(0.1),
      uInverted: new THREE.Uniform(isDark ? 1 : 0),
      uInputVolume: new THREE.Uniform(0),
      uOutputVolume: new THREE.Uniform(0),
      uOpacity: new THREE.Uniform(0),
    };

    const geometry = new THREE.CircleGeometry(3.5, 64);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: this._vertexShader,
      fragmentShader: this._fragmentShader,
      transparent: true,
    });

    this._mesh = new THREE.Mesh(geometry, material);
    this._scene.add(this._mesh);

    this._resizeObserver = new ResizeObserver(() => {
      if (this._container && this._renderer) {
        this._renderer.setSize(
          this._container.clientWidth,
          this._container.clientHeight,
        );
      }
    });
    this._resizeObserver.observe(this._container);

    // Watch for theme changes on HTML tag
    const observer = new MutationObserver(() => {
      if (!this._mesh) return;
      const dark = document.documentElement.classList.contains('dark');
      this._mesh.material.uniforms.uInverted.value = dark ? 1 : 0;
      this._updateColors();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    this._lastTime = performance.now();
    this._animate();
  }

  private _lastTime = 0;

  private _animate() {
    this._animationFrameId = requestAnimationFrame(() => this._animate());

    if (!this._mesh || !this._renderer || !this._scene || !this._camera) return;

    const now = performance.now();
    const delta = (now - this._lastTime) / 1000; // in seconds
    this._lastTime = now;

    const u = this._mesh.material.uniforms;
    u.uTime.value += delta * 0.5;

    if (u.uOpacity.value < 1) {
      u.uOpacity.value = Math.min(1, u.uOpacity.value + delta * 2);
    }

    let targetIn = 0;
    let targetOut = 0.3;

    if (this.volumeMode === 'manual') {
      targetIn = this._clamp01(this.inputVolume);
      targetOut = this._clamp01(this.outputVolume);
    } else {
      const t = u.uTime.value * 2;
      if (this.agentState === null) {
        targetIn = 0;
        targetOut = 0.3;
      } else if (this.agentState === 'listening') {
        targetIn = this._clamp01(0.55 + Math.sin(t * 3.2) * 0.35);
        targetOut = 0.45;
      } else if (this.agentState === 'talking') {
        targetIn = this._clamp01(0.65 + Math.sin(t * 4.8) * 0.22);
        targetOut = this._clamp01(0.75 + Math.sin(t * 3.6) * 0.22);
      } else {
        const base = 0.38 + 0.07 * Math.sin(t * 0.7);
        const wander = 0.05 * Math.sin(t * 2.1) * Math.sin(t * 0.37 + 1.2);
        targetIn = this._clamp01(base + wander);
        targetOut = this._clamp01(0.48 + 0.12 * Math.sin(t * 1.05 + 0.6));
      }
    }

    this._curIn += (targetIn - this._curIn) * 0.2;
    this._curOut += (targetOut - this._curOut) * 0.2;

    const targetSpeed = 0.1 + (1 - Math.pow(this._curOut - 1, 2)) * 0.9;
    this._animSpeed += (targetSpeed - this._animSpeed) * 0.12;

    u.uAnimation.value += delta * this._animSpeed;
    u.uInputVolume.value = this._curIn;
    u.uOutputVolume.value = this._curOut;
    u.uColor1.value.lerp(this._targetColor1, 0.08);
    u.uColor2.value.lerp(this._targetColor2, 0.08);

    this._renderer.render(this._scene, this._camera);
  }

  private _splitmix32(a: number) {
    return function () {
      a |= 0;
      a = (a + 0x9e3779b9) | 0;
      let t = a ^ (a >>> 16);
      t = Math.imul(t, 0x21f0aaad);
      t = t ^ (t >>> 15);
      t = Math.imul(t, 0x735a2d97);
      return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
    };
  }

  private _clamp01(n: number) {
    if (!Number.isFinite(n)) return 0;
    return Math.min(1, Math.max(0, n));
  }

  private _vertexShader = `
uniform float uTime;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

  private _fragmentShader = `
uniform float uTime;
uniform float uAnimation;
uniform float uInverted;
uniform float uOffsets[7];
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uInputVolume;
uniform float uOutputVolume;
uniform float uOpacity;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

const float PI = 3.14159265358979323846;

bool drawOval(vec2 polarUv, vec2 polarCenter, float a, float b, bool reverseGradient, float softness, out vec4 color) {
    vec2 p = polarUv - polarCenter;
    float oval = (p.x * p.x) / (a * a) + (p.y * p.y) / (b * b);
    float edge = smoothstep(1.0, 1.0 - softness, oval);
    if (edge > 0.0) {
        float gradient = reverseGradient ? (1.0 - (p.x / a + 1.0) / 2.0) : ((p.x / a + 1.0) / 2.0);
        gradient = mix(0.5, gradient, 0.1);
        color = vec4(vec3(gradient), 0.85 * edge);
        return true;
    }
    return false;
}

vec3 colorRamp(float grayscale, vec3 color1, vec3 color2, vec3 color3, vec3 color4) {
    if (grayscale < 0.33) {
        return mix(color1, color2, grayscale * 3.0);
    } else if (grayscale < 0.66) {
        return mix(color2, color3, (grayscale - 0.33) * 3.0);
    } else {
        return mix(color3, color4, (grayscale - 0.66) * 3.0);
    }
}

vec2 hash2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float n = mix(
        mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
        u.y
    );
    return 0.5 + 0.5 * n;
}

float sharpRing(vec3 decomposed, float time) {
    float ringStart = 1.0;
    float ringWidth = 0.3;
    float noiseScale = 5.0;
    float noise = mix(
        noise2D(vec2(decomposed.x, time) * noiseScale),
        noise2D(vec2(decomposed.y, time) * noiseScale),
        decomposed.z
    );
    noise = (noise - 0.5) * 2.5;
    return ringStart + noise * ringWidth * 1.5;
}

float smoothRing(vec3 decomposed, float time) {
    float ringStart = 0.9;
    float ringWidth = 0.2;
    float noiseScale = 6.0;
    float noise = mix(
        noise2D(vec2(decomposed.x, time) * noiseScale),
        noise2D(vec2(decomposed.y, time) * noiseScale),
        decomposed.z
    );
    noise = (noise - 0.5) * 5.0;
    return ringStart + noise * ringWidth;
}

float flow(vec3 decomposed, float time) {
    return mix(
        texture(uPerlinTexture, vec2(time, decomposed.x / 2.0)).r,
        texture(uPerlinTexture, vec2(time, decomposed.y / 2.0)).r,
        decomposed.z
    );
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float radius = length(uv);
    float theta = atan(uv.y, uv.x);
    if (theta < 0.0) theta += 2.0 * PI;

    vec3 decomposed = vec3(
        theta / (2.0 * PI),
        mod(theta / (2.0 * PI) + 0.5, 1.0) + 1.0,
        abs(theta / PI - 1.0)
    );

    float noise = flow(decomposed, radius * 0.03 - uAnimation * 0.2) - 0.5;
    theta += noise * mix(0.08, 0.25, uOutputVolume);

    vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
    float originalCenters[7] = float[7](0.0, 0.5 * PI, 1.0 * PI, 1.5 * PI, 2.0 * PI, 2.5 * PI, 3.0 * PI);
    float centers[7];
    for (int i = 0; i < 7; i++) {
        centers[i] = originalCenters[i] + 0.5 * sin(uTime / 20.0 + uOffsets[i]);
    }

    float a, b;
    vec4 ovalColor;

    for (int i = 0; i < 7; i++) {
        float noise = texture(uPerlinTexture, vec2(mod(centers[i] + uTime * 0.05, 1.0), 0.5)).r;
        a = 0.5 + noise * 0.3;
        b = noise * mix(3.5, 2.5, uInputVolume);
        bool reverseGradient = (i % 2 == 1);
        float distTheta = min(
            abs(theta - centers[i]),
            min(abs(theta + 2.0 * PI - centers[i]), abs(theta - 2.0 * PI - centers[i]))
        );
        if (drawOval(vec2(distTheta, radius), vec2(0.0, 0.0), a, b, reverseGradient, 0.6, ovalColor)) {
            color.rgb = mix(color.rgb, ovalColor.rgb, ovalColor.a);
            color.a = max(color.a, ovalColor.a);
        }
    }
    
    float ringRadius1 = sharpRing(decomposed, uTime * 0.1);
    float ringRadius2 = smoothRing(decomposed, uTime * 0.1);
    float inputRadius1 = radius + uInputVolume * 0.2;
    float inputRadius2 = radius + uInputVolume * 0.15;
    float opacity1 = mix(0.2, 0.6, uInputVolume);
    float opacity2 = mix(0.15, 0.45, uInputVolume);

    float ringAlpha1 = (inputRadius2 >= ringRadius1) ? opacity1 : 0.0;
    float ringAlpha2 = smoothstep(ringRadius2 - 0.05, ringRadius2 + 0.05, inputRadius1) * opacity2;
    float totalRingAlpha = max(ringAlpha1, ringAlpha2);
    
    vec3 ringColor = vec3(1.0);
    color.rgb = 1.0 - (1.0 - color.rgb) * (1.0 - ringColor * totalRingAlpha);

    vec3 color1 = vec3(0.0, 0.0, 0.0);
    vec3 color2 = uColor1;
    vec3 color3 = uColor2;
    vec3 color4 = vec3(1.0, 1.0, 1.0);

    float luminance = mix(color.r, 1.0 - color.r, uInverted);
    color.rgb = colorRamp(luminance, color1, color2, color3, color4);
    color.a *= uOpacity;

    gl_FragColor = color;
}
`;
}
