import { usePreferencesStore } from '@mfe/shared';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import OverviewApp from './App';

describe('OverviewApp', () => {
  it('renders KPIs for the shared date range and reacts to changes', () => {
    usePreferencesStore.setState({ dateRange: '7d' });
    render(
      <MemoryRouter>
        <OverviewApp />
      </MemoryRouter>,
    );
    expect(screen.getByText('Last 7 days')).toBeInTheDocument();
    expect(screen.getByText('$29,526')).toBeInTheDocument();

    act(() => usePreferencesStore.getState().setDateRange('30d'));
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
  });
});
