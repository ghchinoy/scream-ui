/**
 * Copyright 2026 Google LLC
 */
import { LitElement, type PropertyValues } from 'lit';
export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'agent';
}
export declare class UiChatLog extends LitElement {
    messages: ChatMessage[];
    private _virtualItems;
    private _visibleItems;
    private _totalHeight;
    private _viewport;
    private _resizeObserver?;
    private _availableTextWidth;
    private FONT_STRING;
    private LINE_HEIGHT;
    private PADDING_Y;
    private GAP;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    firstUpdated(): void;
    disconnectedCallback(): void;
    updated(changedProperties: PropertyValues): void;
    private _measureAvailableWidth;
    private _calculateDimensions;
    private _recalculateAllItems;
    private _handleScroll;
    private _findStartIndex;
}
