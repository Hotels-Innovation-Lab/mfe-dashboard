/**
 * `@mfe/shared/host` — building blocks for whatever hosts MFEs: the shell,
 * or a remote running standalone. Not federated; each host bundles its own copy.
 */
import { Toaster } from '@mfe/ui/components/sonner';
import { useEffect, type ReactNode } from 'react';
import { BrowserRouter, useNavigate } from 'react-router';
import { toast } from 'sonner';

// Import through the package name (not relative paths) so this resolves to the
// federated singleton rather than a private copy of the stores/event bus.
import { eventBus, useApplyTheme, useAuthStore } from '@mfe/shared';

/** Renders the toaster and wires `notify:toast` events to it. */
export function HostToaster() {
  const theme = useApplyTheme();

  useEffect(
    () =>
      eventBus.on('notify:toast', ({ title, description, variant }) => {
        const show =
          variant === 'success' ? toast.success : variant === 'error' ? toast.error : toast;
        show(title, { description });
      }),
    [],
  );

  return <Toaster theme={theme} richColors closeButton />;
}

/** Wires `nav:go` events to the router. Must render inside a router. */
export function NavigationBridge() {
  const navigate = useNavigate();
  useEffect(() => eventBus.on('nav:go', ({ to }) => navigate(to)), [navigate]);
  return null;
}

/**
 * Dev harness so a remote can run on its own port without the shell:
 * router, theme, toasts and an auto-signed-in mock user.
 */
export function StandaloneHost({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) void useAuthStore.getState().login('dev@example.com', 'standalone');
  }, [user]);

  return (
    <BrowserRouter>
      <NavigationBridge />
      <HostToaster />
      {user ? children : null}
    </BrowserRouter>
  );
}
