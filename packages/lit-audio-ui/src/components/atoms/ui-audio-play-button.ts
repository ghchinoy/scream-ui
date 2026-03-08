import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {consume} from '@lit/context';
import {
  audioPlayerContext,
  type AudioPlayerState,
} from '../../utils/audio-context.js';
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/icon/icon.js';

@customElement('ui-audio-play-button')
export class UiAudioPlayButton extends LitElement {
  @consume({context: audioPlayerContext, subscribe: true})
  @property({attribute: false})
  public playerState?: AudioPlayerState;

  static styles = css`
    :host {
      display: inline-flex;
      position: relative;
      align-items: center;
      justify-content: center;
      font-family: inherit;
    }

    md-filled-icon-button {
      --md-filled-icon-button-container-color: var(
        --md-sys-color-primary,
        #0066cc
      );
      --md-filled-icon-button-icon-color: var(
        --md-sys-color-on-primary,
        #ffffff
      );
      --md-filled-icon-button-hover-icon-color: var(
        --md-sys-color-on-primary,
        #ffffff
      );
      --md-filled-icon-button-focus-icon-color: var(
        --md-sys-color-on-primary,
        #ffffff
      );
      --md-filled-icon-button-pressed-icon-color: var(
        --md-sys-color-on-primary,
        #ffffff
      );

      --md-filled-icon-button-toggle-icon-color: var(
        --md-sys-color-on-primary,
        #ffffff
      );
      --md-filled-icon-button-selected-container-color: var(
        --md-sys-color-primary,
        #0066cc
      );
      --md-filled-icon-button-selected-icon-color: var(
        --md-sys-color-on-primary,
        #ffffff
      );
      color: var(--md-sys-color-on-primary, #ffffff);
    }

    md-filled-icon-button.error {
      --md-filled-icon-button-container-color: var(
        --ui-audio-error-color,
        var(--md-sys-color-error, #ba1a1a)
      );
      --md-filled-icon-button-icon-color: var(--md-sys-color-on-error, #ffffff);
    }

    md-circular-progress {
      --md-circular-progress-size: 24px;
    }
  `;

  render() {
    const isPlaying = this.playerState?.isPlaying ?? false;
    const isBuffering = this.playerState?.isBuffering ?? false;
    const hasError = !!this.playerState?.error;
    const ariaLabel = hasError
      ? 'Audio error'
      : isPlaying
        ? 'Pause audio'
        : 'Play audio';

    return html`
      <md-filled-icon-button
        part="button"
        class="${hasError ? 'error' : ''}"
        aria-label="${ariaLabel}"
        @click="${this._handleClick}"
        ?disabled="${!this.playerState?.src}"
      >
        ${isBuffering && isPlaying && !hasError
          ? html`<md-circular-progress indeterminate></md-circular-progress>`
          : html`<md-icon>${hasError ? 'error' : isPlaying ? 'pause' : 'play_arrow'}</md-icon>`}
      </md-filled-icon-button>
    `;
  }

  private _handleClick() {
    if (this.playerState) {
      this.playerState.togglePlay();
    }
  }
}
