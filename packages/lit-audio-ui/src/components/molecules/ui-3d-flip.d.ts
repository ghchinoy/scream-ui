/**
 * Copyright 2026 Google LLC
 */
import { LitElement } from 'lit';
import '@material/web/icon/icon.js';
/**
 * A layout utility component that provides 3D card flipping functionality.
 */
export declare class Ui3dFlip extends LitElement {
    flipped: boolean;
    axis: 'x' | 'y';
    duration: string;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    toggle(): void;
}
