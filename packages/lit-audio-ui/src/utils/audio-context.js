import { createContext } from '@lit/context';
/**
 * A unique token to identify our context.
 * Any component that uses @consume({context: audioPlayerContext})
 * will automatically receive updates when the nearest <ui-audio-provider> changes its state.
 */
export const audioPlayerContext = createContext('ui-audio-player-context');
//# sourceMappingURL=audio-context.js.map