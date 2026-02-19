/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { LitElement } from 'lit';
/**
 * ATOM: Message Bubble
 * A presentational container for chat message text.
 * Ported from ElevenLabs 'MessageContent'.
 *
 * @element ui-message-bubble
 *
 * @prop {string} variant - 'contained' (default) or 'flat'.
 * @prop {string} direction - 'inbound' (agent) or 'outbound' (user).
 */
export declare class UiMessageBubble extends LitElement {
    variant: 'contained' | 'flat';
    direction: 'inbound' | 'outbound';
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
