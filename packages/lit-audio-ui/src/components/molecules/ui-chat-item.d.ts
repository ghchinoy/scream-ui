/**
 * Copyright 2026 Google LLC
 */
import { LitElement } from 'lit';
import '../atoms/ui-message-bubble.js';
/**
 * A composite component representing a single chat message item.
 * Supports avatars and alignment for inbound/outbound messages.
 */
export declare class UiChatItem extends LitElement {
    direction: 'inbound' | 'outbound';
    variant: 'contained' | 'flat';
    avatarSrc?: string;
    avatarName?: string;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
