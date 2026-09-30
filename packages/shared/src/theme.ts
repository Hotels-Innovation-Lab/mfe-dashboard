import { useEffect, useSyncExternalStore } from 'react';

import { usePreferencesStore } from './stores/preferences';

const query = '(prefers-color-scheme: dark)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

/**
 * Applies the theme preference as a `.dark` class on <html>.
 * Call it once at the root of the shell (and of each remote's standalone bootstrap).
 * Returns the resolved theme.
 */
export function useApplyTheme(): 'light' | 'dark' {
  const theme = usePreferencesStore((s) => s.theme);
  const systemDark = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
  const resolved = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [resolved]);

  return resolved;
}
