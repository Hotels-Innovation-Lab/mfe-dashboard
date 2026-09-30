/**
 * Typed pub/sub for fire-and-forget messages between MFEs.
 * Use Zustand stores for *state*; use this for *events* (notifications, commands).
 *
 * Remotes can add events via declaration merging:
 *   declare module '@mfe/shared' { interface MfeEventMap { 'orders:created': { id: string } } }
 */
export interface MfeEventMap {
  /** Ask the shell to show a toast. */
  'notify:toast': {
    title: string;
    description?: string;
    variant?: 'default' | 'success' | 'error';
  };
  /** Ask the shell to navigate (remotes shouldn't assume the shell's route layout). */
  'nav:go': { to: string };
}

export type MfeEventName = keyof MfeEventMap;
type Handler<K extends MfeEventName> = (payload: MfeEventMap[K]) => void;

function createEventBus() {
  const handlers = new Map<MfeEventName, Set<Handler<never>>>();

  function off<K extends MfeEventName>(event: K, handler: Handler<K>) {
    handlers.get(event)?.delete(handler as Handler<never>);
  }

  return {
    /** Subscribe; returns an unsubscribe function (handy as a useEffect cleanup). */
    on<K extends MfeEventName>(event: K, handler: Handler<K>) {
      let set = handlers.get(event);
      if (!set) handlers.set(event, (set = new Set()));
      set.add(handler as Handler<never>);
      return () => off(event, handler);
    },
    off,
    emit<K extends MfeEventName>(event: K, payload: MfeEventMap[K]) {
      handlers.get(event)?.forEach((handler) => {
        try {
          (handler as Handler<K>)(payload);
        } catch (error) {
          // One faulty subscriber (possibly in another MFE) must not break the others.
          console.error(`[eventBus] handler for "${event}" threw`, error);
        }
      });
    },
    clear() {
      handlers.clear();
    },
  };
}

export const eventBus = createEventBus();
