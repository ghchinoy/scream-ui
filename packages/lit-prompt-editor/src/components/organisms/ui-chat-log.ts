/**
 * Copyright 2026 Google LLC
 */

import {LitElement, html, css, type PropertyValues} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import { prepare, layout } from '@chenglou/pretext';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
}

interface VirtualItem {
  message: ChatMessage;
  height: number;
  offsetTop: number;
}

@customElement('ui-chat-log')
export class UiChatLog extends LitElement {
  @property({type: Array}) messages: ChatMessage[] = [];

  @state() private _virtualItems: VirtualItem[] = [];
  @state() private _visibleItems: VirtualItem[] = [];
  @state() private _totalHeight: number = 0;

  @query('.viewport') private _viewport!: HTMLDivElement;

  private _resizeObserver?: ResizeObserver;
  private _availableTextWidth: number = 0;

  // CSS matched constants
  private FONT_STRING = "16px Inter, sans-serif";
  private LINE_HEIGHT = 24; 
  private PADDING_Y = 24; // 12px top + 12px bottom padding inside bubble
  private GAP = 12; // 12px gap between bubbles

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 400px;
    }
    .viewport {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      background: var(--md-sys-color-surface, #121212);
      border-radius: 8px;
      position: relative;
      box-sizing: border-box;
      border: 1px solid var(--md-sys-color-outline-variant, #444);
    }
    .scroll-sizer {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }
    .chat-bubble {
      position: absolute;
      left: 16px;
      right: 16px;
      background: var(--md-sys-color-surface-container-highest, #3a3a3a);
      border-radius: 8px;
      box-sizing: border-box;
      overflow: hidden;
    }
    .chat-bubble.user {
      background: var(--md-sys-color-primary-container, #004499);
      color: var(--md-sys-color-on-primary-container, #fff);
      margin-left: 20%;
    }
    .chat-bubble.agent {
      background: var(--md-sys-color-surface-container-highest, #3a3a3a);
      color: var(--md-sys-color-on-surface, #eee);
      margin-right: 20%;
    }
    .chat-text {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      line-height: 24px;
      padding: 12px 16px;
      white-space: pre-wrap;
      word-break: normal;
      overflow-wrap: break-word;
      margin: 0;
    }
  `;

  render() {
    return html`
      <div class="viewport" @scroll=${this._handleScroll}>
        <div class="scroll-sizer" style="height: ${this._totalHeight}px"></div>
        <div class="render-surface">
          ${this._visibleItems.map(item => html`
            <div class="chat-bubble ${item.message.sender}" style="top: ${item.offsetTop}px; height: ${item.height}px;">
              <p class="chat-text">${item.message.text}</p>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  firstUpdated() {
    this._resizeObserver = new ResizeObserver(() => {
      this._measureAvailableWidth();
      this._recalculateAllItems();
    });
    this._resizeObserver.observe(this._viewport);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('messages')) {
      this._recalculateAllItems();
      
      // Auto-scroll to bottom on new messages
      if (this._viewport) {
        // Wait for render to calculate scrollHeight
        requestAnimationFrame(() => {
          this._viewport.scrollTop = this._viewport.scrollHeight;
        });
      }
    }
  }

  private _measureAvailableWidth() {
    if (!this._viewport) return;
    const viewportWidth = this._viewport.clientWidth;
    // 32px left/right margins, 32px inner padding, and account for the 20% margin constraint
    // 20% of viewport width is roughly the constraint for user/agent bubbles
    const sideMargin = viewportWidth * 0.2;
    this._availableTextWidth = viewportWidth - 32 - 32 - sideMargin;
  }

  private _calculateDimensions(text: string, currentOffset: number): { height: number, offsetTop: number } {
    if (this._availableTextWidth <= 0) return { height: 100, offsetTop: currentOffset };
    
    const prepared = prepare(text, this.FONT_STRING, { whiteSpace: 'pre-wrap' });
    const { height } = layout(prepared, this._availableTextWidth, this.LINE_HEIGHT);
    
    return {
      height: height + this.PADDING_Y,
      offsetTop: currentOffset
    };
  }

  private _recalculateAllItems() {
    if (!this.messages) return;
    
    let currentOffset = this.GAP;
    this._virtualItems = this.messages.map(msg => {
      const { height, offsetTop } = this._calculateDimensions(msg.text, currentOffset);
      currentOffset += height + this.GAP;
      return { message: msg, height, offsetTop };
    });
    
    this._totalHeight = currentOffset;
    this._handleScroll();
  }

  private _handleScroll() {
    if (!this._viewport || this._virtualItems.length === 0) return;
    
    const scrollTop = this._viewport.scrollTop;
    const viewportHeight = this._viewport.clientHeight;
    
    const renderTop = Math.max(0, scrollTop - viewportHeight);
    const renderBottom = scrollTop + viewportHeight * 2;

    const startIndex = this._findStartIndex(renderTop);
    
    let endIndex = startIndex;
    while (endIndex < this._virtualItems.length && this._virtualItems[endIndex].offsetTop <= renderBottom) {
      endIndex++;
    }

    this._visibleItems = this._virtualItems.slice(startIndex, endIndex);
  }

  private _findStartIndex(scrollTop: number): number {
    let low = 0;
    let high = this._virtualItems.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const item = this._virtualItems[mid];
      if (item.offsetTop + item.height < scrollTop) {
        low = mid + 1;
      } else if (item.offsetTop > scrollTop) {
        high = mid - 1;
      } else {
        return mid;
      }
    }
    return Math.max(0, low);
  }
}
