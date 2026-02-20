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
import '@ghchinoy/lit-audio-ui/molecules/ui-chat-list.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-chat-item.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-conversation-bar.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-typing-indicator.js';
import '@ghchinoy/lit-audio-ui/molecules/ui-orb.js';
export declare class DemoChatExperience extends LitElement {
    private _messages;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    private _handleSend;
    private _simulateAgentResponse;
    private _getRandomResponse;
}
