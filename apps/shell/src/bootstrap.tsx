import './styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { loadRemoteDefinitions } from './remotes/registry';

const root = createRoot(document.getElementById('root')!);

loadRemoteDefinitions()
  .then((remotes) =>
    root.render(
      <StrictMode>
        <App remotes={remotes} />
      </StrictMode>,
    ),
  )
  .catch((error: unknown) => {
    console.error(error);
    root.render(<p className="p-8 text-destructive">Failed to load remotes configuration.</p>);
  });
