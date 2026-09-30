/**
 * @mfe/shared — the runtime contract between the shell and every remote.
 *
 * Shared as a Module Federation *singleton*, so all MFEs see the same store
 * instances and the same event bus. Keep this package small and stable:
 * breaking changes here affect every deployed MFE at once.
 */
export { useAuthStore, getAccessToken } from './stores/auth';
export { usePreferencesStore, DATE_RANGES } from './stores/preferences';
export type { DateRange, ThemePreference } from './stores/preferences';
export { eventBus } from './events';
export type { MfeEventMap, MfeEventName } from './events';
export { useApplyTheme } from './theme';
export type { User, RemoteDefinition } from './types';
