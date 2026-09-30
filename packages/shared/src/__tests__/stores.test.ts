import { getAccessToken, useAuthStore } from '../stores/auth';
import { usePreferencesStore } from '../stores/preferences';

describe('useAuthStore', () => {
  beforeEach(() => useAuthStore.setState({ user: null, token: null }));

  it('logs in with the mock provider and exposes the token', async () => {
    await useAuthStore.getState().login('jane@example.com', 'secret');
    expect(useAuthStore.getState().user?.email).toBe('jane@example.com');
    expect(getAccessToken()).toMatch(/^mock\./);
  });

  it('rejects empty credentials', async () => {
    await expect(useAuthStore.getState().login('', '')).rejects.toThrow();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('clears the session on logout', async () => {
    await useAuthStore.getState().login('jane@example.com', 'secret');
    useAuthStore.getState().logout();
    expect(getAccessToken()).toBeNull();
  });
});

describe('usePreferencesStore', () => {
  it('updates theme and date range', () => {
    usePreferencesStore.getState().setTheme('dark');
    usePreferencesStore.getState().setDateRange('7d');
    expect(usePreferencesStore.getState()).toMatchObject({ theme: 'dark', dateRange: '7d' });
  });
});
