import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RemoteLoader } from './RemoteLoader';

const loadRemote = vi.hoisted(() => vi.fn());
vi.mock('@module-federation/enhanced/runtime', () => ({ loadRemote }));

describe('RemoteLoader', () => {
  beforeEach(() => {
    loadRemote.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders the federated component', async () => {
    loadRemote.mockResolvedValue({ default: () => <p>remote content</p> });
    render(<RemoteLoader remote="overview" module="Widget" />);
    expect(await screen.findByText('remote content')).toBeInTheDocument();
    expect(loadRemote).toHaveBeenCalledWith('overview/Widget');
  });

  it('isolates failures and recovers on retry', async () => {
    loadRemote
      .mockRejectedValueOnce(new Error('manifest unreachable'))
      .mockResolvedValue({ default: () => <p>back online</p> });

    render(<RemoteLoader remote="analytics" module="App" />);
    expect(await screen.findByRole('alert')).toHaveTextContent('analytics is unavailable');

    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(await screen.findByText('back online')).toBeInTheDocument();
  });
});
