import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemePreference = 'light' | 'dark' | 'system';

export const DATE_RANGES = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
} as const;
export type DateRange = keyof typeof DATE_RANGES;

interface PreferencesState {
  theme: ThemePreference;
  dateRange: DateRange;
  setTheme: (theme: ThemePreference) => void;
  setDateRange: (range: DateRange) => void;
}

/** Cross-MFE user preferences. Written by settings/shell, read by everyone. */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      dateRange: '30d',
      setTheme: (theme) => set({ theme }),
      setDateRange: (dateRange) => set({ dateRange }),
    }),
    { name: 'mfe-preferences' },
  ),
);
