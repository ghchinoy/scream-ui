/**
 * Copyright 2026 Google LLC
 */
import { LitElement } from 'lit';
import '../providers/ui-speech-provider.js';
import '../atoms/ui-voice-waveform.js';
import './ui-mic-selector.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/divider/divider.js';
/**
 * MOLECULE: Conversation Bar
 * A specialized interaction bar for AI conversations.
 * Combines mic selection, live visualization, and text input.
 *
 * @element ui-conversation-bar
 *
 * @prop {string} agentId - (Optional) ID of the AI agent.
 * @prop {boolean} simulation - Enable mock transcription for demos.
 *
 * @fires message-sent - Dispatched when a text message is sent. detail: { message }
 * @fires state-change - Dispatched when the conversation state changes.
 */
export declare class UiConversationBar extends LitElement {
    agentId: string;
    simulation: boolean;
    private _keyboardOpen;
    private _textInput;
    private _isMuted;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    private _handleKeyDown;
    private _sendMessage;
    private _handleCallToggle;
}
