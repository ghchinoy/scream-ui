/**
 * Copyright 2026 Google LLC
 */
import { LitElement } from 'lit';
/**
 * A container component used in the demo to showcase individual components.
 */
export declare class UiShowcaseCard extends LitElement {
    title: string;
    description: string;
    mode: 'preview' | 'code';
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
