import { eventBus } from '../events';

afterEach(() => eventBus.clear());

describe('eventBus', () => {
  it('delivers payloads to subscribers', () => {
    const handler = vi.fn();
    eventBus.on('nav:go', handler);
    eventBus.emit('nav:go', { to: '/analytics' });
    expect(handler).toHaveBeenCalledWith({ to: '/analytics' });
  });

  it('stops delivering after unsubscribe', () => {
    const handler = vi.fn();
    const unsubscribe = eventBus.on('nav:go', handler);
    unsubscribe();
    eventBus.emit('nav:go', { to: '/' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('isolates a throwing handler from the others', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const good = vi.fn();
    eventBus.on('notify:toast', () => {
      throw new Error('boom');
    });
    eventBus.on('notify:toast', good);
    eventBus.emit('notify:toast', { title: 'hi' });
    expect(good).toHaveBeenCalledOnce();
  });
});
