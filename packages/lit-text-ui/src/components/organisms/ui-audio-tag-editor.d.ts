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
export interface AudioTag {
    id: string;
    label: string;
    category: 'Non-Speech' | 'Style' | 'Vocalized' | 'Pacing';
    description: string;
}
export declare const AUDIO_TAGS: AudioTag[];
export declare class UiAudioTagEditor extends LitElement {
    value: string;
    placeholder: string;
    tags: AudioTag[];
    pillPadding: number;
    private _isSuggesting;
    private _suggestionQuery;
    private _cursorIndex;
    private _selectedIndex;
    private _suggestionPos;
    private _hoveredTag;
    private _hoverPos;
    private _textarea;
    private _canvas;
    private _resizeObserver;
    private _computedFont;
    private _computedColor;
    private _lineHeight;
    private _paddingL;
    private _paddingR;
    private _prepared;
    private _renderedTags;
    private _themeColors;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    firstUpdated(): void;
    disconnectedCallback(): void;
    refresh(): void;
    private _parseThemeColors;
    private _parseValue;
    private _triggerRender;
    private _renderCanvas;
    private _handleMouseMove;
    private _handleMouseLeave;
    private _renderTooltip;
    private _renderSuggestions;
    private _getFilteredTags;
    private _handleInput;
    private _updateCursor;
    private _checkForTrigger;
    private _handleKeyDown;
    private _insertTag;
    private _closeSuggestions;
}
