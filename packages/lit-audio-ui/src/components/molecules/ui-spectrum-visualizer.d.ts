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
 * A standard frequency spectrum visualizer (bars).
 * Automatically consumes AudioPlayerState from the nearest ui-audio-provider.
 *
 * @element ui-spectrum-visualizer
 *
 * @prop {number} barWidth - Width of each spectrum bar (default: 4).
 * @prop {number} barGap - Gap between bars (default: 2).
 * @prop {number} height - Container height (default: 100).
 * @prop {string} color - Bar color. Falls back to --md-sys-color-primary.
 */
export declare class UiSpectrumVisualizer extends LitElement {
    private playerState?;
    barWidth: number;
    barGap: number;
    height: number;
    color?: string;
    private _canvas;
    private _animationFrameId;
    private _dataArray?;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    firstUpdated(): void;
    disconnectedCallback(): void;
    private _startLoop;
    private _renderFrame;
}
