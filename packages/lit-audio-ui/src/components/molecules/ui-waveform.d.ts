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
import { LitElement, type PropertyValues } from 'lit';
export declare class UiWaveform extends LitElement {
    data: number[];
    peaks?: number[];
    barWidth: number;
    barHeight: number;
    barGap: number;
    barRadius: number;
    barColor?: string;
    align: 'center' | 'bottom' | 'top';
    fadeEdges: boolean;
    fadeWidth: number;
    height?: number | string;
    private _canvas;
    private _container;
    private _resizeObserver?;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    firstUpdated(): void;
    updated(changedProperties: PropertyValues): void;
    disconnectedCallback(): void;
    private _handleResize;
    private _renderWaveform;
}
