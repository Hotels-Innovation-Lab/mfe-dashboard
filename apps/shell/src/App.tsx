import type { RemoteDefinition } from '@mfe/shared';
import { HostToaster, NavigationBridge } from '@mfe/shared/host';
import { TooltipProvider } from '@mfe/ui/components/tooltip';
import { BrowserRouter, Route, Routes } from 'react-router';

import { RequireAuth } from './auth/RequireAuth';
import { AppLayout } from './layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RemoteLoader } from './remotes/RemoteLoader';

export function App({ remotes }: { remotes: RemoteDefinition[] }) {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <NavigationBridge />
        <HostToaster />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <RequireAuth>
                <AppLayout remotes={remotes} />
              </RequireAuth>
            }
          >
            <Route index element={<HomePage remotes={remotes} />} />
            {remotes.map((remote) => (
              <Route
                key={remote.name}
                path={`${remote.path}/*`}
                element={<RemoteLoader remote={remote.name} module="App" />}
              />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}
