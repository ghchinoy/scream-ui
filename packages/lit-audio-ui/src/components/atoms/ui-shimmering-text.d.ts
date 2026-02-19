/**
 * Copyright 2026 Google LLC
 */
import { LitElement } from 'lit';
/**
 * A native Lit WebComponent that provides a shimmering text animation.
 */
export declare class UiShimmeringText extends LitElement {
    text: string;
    duration: number;
    delay: number;
    repeat: boolean;
    repeatDelay: number;
    startOnView: boolean;
    once: boolean;
    spread: number;
    color?: string;
    shimmerColor?: string;
    private _isInView;
    private _intersectionObserver?;
    static styles: import("lit").CSSResult;
    protected firstUpdated(): void;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
