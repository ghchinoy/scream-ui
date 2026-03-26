var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import * as THREE from 'three';
/**
 * A 3D WebGL 'Moving Gradient' component used to visualize AI agent states.
 */
let UiMovingGradient = class UiMovingGradient extends LitElement {
    constructor() {
        super(...arguments);
        this.agentState = null;
        this.inputVolume = 0;
        this.outputVolume = 0;
        this.volumeMode = 'auto';
        this.baseHeight = 0.05;
        this.speed = 1.0;
        this._animationFrameId = 0;
        this._animSpeed = 1.0;
        this._curIn = 0;
        this._curOut = 0;
        this._lastTime = 0;
        this._vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;
        this._fragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uInputVolume;
uniform float uOutputVolume;
uniform float uOpacity;
uniform float uAspect;
uniform float uBaseHeight;
uniform float uStop1;
uniform float uStop2;
uniform float uStop3;

varying vec2 vUv;

// Simple 2D noise function
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    // Normalize coordinates
    vec2 uv = vUv;
    
    // Total combined activity (0.0 to ~1.0)
    float activity = max(uInputVolume, uOutputVolume);
    
    // Base glow height (how far up from the bottom it starts)
    // Idle is very low (uBaseHeight), active pushes it up (to uBaseHeight + 0.35)
    float baseHeight = uBaseHeight + (activity * 0.35);
    
    // Create an undulating wave effect along the X axis
    // Combine several sine waves and noise for a natural feel
    float wave1 = sin(uv.x * 3.0 + uTime * 0.5) * 0.02;
    float wave2 = cos(uv.x * 5.0 - uTime * 0.8) * 0.015;
    
    // Add noise that scales with activity
    float n = snoise(vec2(uv.x * 2.0 - uTime * 0.2, uTime * 0.1));
    float noiseWave = n * (0.02 + activity * 0.08);
    
    // Calculate the threshold y-value for this x position
    float yThreshold = baseHeight + wave1 + wave2 + noiseWave;
    
    // Smooth gradient from the bottom up to the threshold
    // Softness expands slightly when active
    float softness = 0.2 + (activity * 0.1);
    
    // Distance from the "top" of the wave.
    // > 0 means below the wave (solid), < 0 means above (transparent)
    float dist = yThreshold - uv.y;
    
    // Alpha falls off smoothly above the wave threshold, and is solid below it
    float alpha = smoothstep(-softness, 0.05, dist);
    
    // If it's the very bottom of the screen, force opacity up so it doesn't detach
    alpha = max(alpha, smoothstep(0.05, 0.0, uv.y) * 0.5);
    
    // Mix colors based on height and X position to give the gradient a "sweep"
    float colorMix = smoothstep(0.0, yThreshold, uv.y) + (sin(uv.x * 2.0 + uTime) * 0.2);
    
    // map the 0.0 -> 1.0 range of colorMix to the 3 colors using the stops
    float c = clamp(colorMix, 0.0, 1.0);
    vec3 finalColor;
    if (c <= uStop2) {
      float t = (c - uStop1) / max(0.001, uStop2 - uStop1);
      finalColor = mix(uColor1, uColor2, clamp(t, 0.0, 1.0));
    } else {
      float t = (c - uStop2) / max(0.001, uStop3 - uStop2);
      finalColor = mix(uColor2, uColor3, clamp(t, 0.0, 1.0));
    }
    
    // Add a slight bright rim at the edge of the wave when active
    float rim = smoothstep(0.0, 0.05, dist) * smoothstep(0.1, 0.0, dist);
    finalColor += vec3(rim * activity * 0.3); // Add brightness at the rim
    
    gl_FragColor = vec4(finalColor, alpha * uOpacity);
}
`;
    }
    static { this.styles = css `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
      background-color: #0E0E0F;
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
  `; }
    render() {
        return html `<div class="container"></div>`;
    }
    firstUpdated() {
        this._initThree();
    }
    updated(changedProperties) {
        if (changedProperties.has('colors')) {
            this._updateColors();
        }
        if (this._mesh) {
            if (changedProperties.has('baseHeight')) {
                this._mesh.material.uniforms.uBaseHeight.value = this.baseHeight;
            }
            if (changedProperties.has('stops')) {
                const s = this.stops || [0.0, 0.5, 0.86];
                this._mesh.material.uniforms.uStop1.value = s[0];
                this._mesh.material.uniforms.uStop2.value = s[1];
                this._mesh.material.uniforms.uStop3.value = s[2];
            }
        }
    }
    _updateColors() {
        if (!this._targetColor1 || !this._targetColor2 || !this._targetColor3)
            return;
        if (this.colors && this.colors.length >= 3) {
            this._targetColor1.set(this.colors[0]);
            this._targetColor2.set(this.colors[1]);
            this._targetColor3.set(this.colors[2]);
        }
        else {
            // Default to the requested blue variants
            this._targetColor1.set('#0068FF');
            this._targetColor2.set('#0077FF');
            this._targetColor3.set('#0073FF');
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._animationFrameId)
            cancelAnimationFrame(this._animationFrameId);
        if (this._resizeObserver)
            this._resizeObserver.disconnect();
        if (this._renderer)
            this._renderer.dispose();
        if (this._mesh) {
            this._mesh.geometry.dispose();
            this._mesh.material.dispose();
        }
    }
    async _initThree() {
        if (!this._container)
            return;
        this._targetColor1 = new THREE.Color();
        this._targetColor2 = new THREE.Color();
        this._targetColor3 = new THREE.Color();
        this._updateColors();
        const width = this._container.clientWidth;
        const height = this._container.clientHeight;
        this._scene = new THREE.Scene();
        this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this._camera.position.z = 1;
        this._renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            premultipliedAlpha: true,
        });
        this._renderer.setSize(width, height);
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._container.appendChild(this._renderer.domElement);
        const s = this.stops || [0.0, 0.5, 0.86];
        const uniforms = {
            uColor1: new THREE.Uniform(this._targetColor1),
            uColor2: new THREE.Uniform(this._targetColor2),
            uColor3: new THREE.Uniform(this._targetColor3),
            uTime: new THREE.Uniform(0),
            uInputVolume: new THREE.Uniform(0),
            uOutputVolume: new THREE.Uniform(0),
            uOpacity: new THREE.Uniform(0),
            uAspect: new THREE.Uniform(width / height),
            uBaseHeight: new THREE.Uniform(this.baseHeight),
            uStop1: new THREE.Uniform(s[0]),
            uStop2: new THREE.Uniform(s[1]),
            uStop3: new THREE.Uniform(s[2]),
        };
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: this._vertexShader,
            fragmentShader: this._fragmentShader,
            transparent: true,
            blending: THREE.NormalBlending,
        });
        this._mesh = new THREE.Mesh(geometry, material);
        this._scene.add(this._mesh);
        this._resizeObserver = new ResizeObserver(() => {
            if (this._container && this._renderer && this._mesh) {
                const w = this._container.clientWidth;
                const h = this._container.clientHeight;
                this._renderer.setSize(w, h);
                this._mesh.material.uniforms.uAspect.value = w / h;
            }
        });
        this._resizeObserver.observe(this._container);
        this._lastTime = performance.now();
        this._animate();
    }
    _animate() {
        this._animationFrameId = requestAnimationFrame(() => this._animate());
        if (!this._mesh || !this._renderer || !this._scene || !this._camera)
            return;
        const now = performance.now();
        const delta = (now - this._lastTime) / 1000;
        this._lastTime = now;
        const u = this._mesh.material.uniforms;
        if (u.uOpacity.value < 1) {
            u.uOpacity.value = Math.min(1, u.uOpacity.value + delta * 2);
        }
        let targetIn = 0;
        let targetOut = 0;
        if (this.volumeMode === 'manual') {
            targetIn = this._clamp01(this.inputVolume);
            targetOut = this._clamp01(this.outputVolume);
        }
        else {
            const t = u.uTime.value;
            if (this.agentState === null) {
                targetIn = 0;
                targetOut = 0;
            }
            else if (this.agentState === 'listening') {
                targetIn = this._clamp01(0.3 + Math.sin(t * 2.0) * 0.15);
                targetOut = 0;
            }
            else if (this.agentState === 'talking') {
                targetIn = 0;
                targetOut = this._clamp01(0.6 + Math.sin(t * 4.0) * 0.3);
            }
            else if (this.agentState === 'thinking') {
                targetIn = 0;
                targetOut = this._clamp01(0.2 + Math.sin(t * 1.5) * 0.1);
            }
            else {
                // Fallback for any other state
                targetIn = 0;
                targetOut = 0;
            }
        }
        this._curIn += (targetIn - this._curIn) * 0.15;
        this._curOut += (targetOut - this._curOut) * 0.15;
        // Adjust speed based on state
        let targetSpeed = this.speed;
        if (this.agentState === 'talking')
            targetSpeed = this.speed * 2.5;
        if (this.agentState === 'thinking')
            targetSpeed = this.speed * 1.5;
        if (this.agentState === 'listening')
            targetSpeed = this.speed * 1.2;
        // Add volume modifier to speed
        targetSpeed += (this._curIn + this._curOut) * 2.0 * this.speed;
        this._animSpeed += (targetSpeed - this._animSpeed) * 0.1;
        u.uTime.value += delta * this._animSpeed;
        u.uInputVolume.value = this._curIn;
        u.uOutputVolume.value = this._curOut;
        u.uColor1.value.lerp(this._targetColor1, 0.05);
        u.uColor2.value.lerp(this._targetColor2, 0.05);
        this._renderer.render(this._scene, this._camera);
    }
    _clamp01(n) {
        if (!Number.isFinite(n))
            return 0;
        return Math.min(1, Math.max(0, n));
    }
};
__decorate([
    property({ type: Array })
], UiMovingGradient.prototype, "colors", void 0);
__decorate([
    property({ type: Array })
], UiMovingGradient.prototype, "stops", void 0);
__decorate([
    property({ type: String })
], UiMovingGradient.prototype, "agentState", void 0);
__decorate([
    property({ type: Number })
], UiMovingGradient.prototype, "inputVolume", void 0);
__decorate([
    property({ type: Number })
], UiMovingGradient.prototype, "outputVolume", void 0);
__decorate([
    property({ type: String })
], UiMovingGradient.prototype, "volumeMode", void 0);
__decorate([
    property({ type: Number })
], UiMovingGradient.prototype, "baseHeight", void 0);
__decorate([
    property({ type: Number })
], UiMovingGradient.prototype, "speed", void 0);
__decorate([
    query('.container')
], UiMovingGradient.prototype, "_container", void 0);
UiMovingGradient = __decorate([
    customElement('ui-moving-gradient')
], UiMovingGradient);
export { UiMovingGradient };
//# sourceMappingURL=ui-moving-gradient.js.map