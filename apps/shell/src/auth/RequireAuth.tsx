import { useAuthStore } from '@mfe/shared';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

export function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
