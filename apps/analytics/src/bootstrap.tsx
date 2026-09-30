// Standalone entry: only used when this remote runs on its own (http://localhost:3002).
// The shell never loads this file — it imports ./App and ./Widget directly.
import '@mfe/ui/styles/globals.css';

import { StandaloneHost } from '@mfe/shared/host';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, Route, Routes } from 'react-router';

import App from './App';
import Widget from './Widget';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StandaloneHost>
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="flex items-center gap-4 rounded-md border border-dashed px-4 py-2 text-sm text-muted-foreground">
          <span>Analytics · standalone mode</span>
          <Link className="underline" to="/">
            App
          </Link>
          <Link className="underline" to="/widget">
            Widget
          </Link>
        </div>
        <Routes>
          <Route
            path="/widget"
            element={
              <div className="max-w-sm">
                <Widget />
              </div>
            }
          />
          <Route path="/*" element={<App />} />
        </Routes>
      </div>
    </StandaloneHost>
  </StrictMode>,
);
