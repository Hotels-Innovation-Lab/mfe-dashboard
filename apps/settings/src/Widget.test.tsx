import { eventBus, usePreferencesStore } from '@mfe/shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SettingsWidget from './Widget';

describe('SettingsWidget', () => {
  beforeEach(() => usePreferencesStore.setState({ theme: 'light' }));

  it('writes the theme to the shared store', async () => {
    render(<SettingsWidget />);
    await userEvent.click(screen.getByRole('switch', { name: 'Dark mode' }));
    expect(usePreferencesStore.getState().theme).toBe('dark');
  });

  it('asks the host to navigate via the event bus', async () => {
    const onNavigate = vi.fn();
    const off = eventBus.on('nav:go', onNavigate);
    render(<SettingsWidget />);
    await userEvent.click(screen.getByRole('button', { name: 'All settings' }));
    expect(onNavigate).toHaveBeenCalledWith({ to: '/settings' });
    off();
  });
});
