import { defineMfeConfig } from '@mfe/config/rsbuild';

export default defineMfeConfig({
  name: 'settings',
  port: 3003,
  title: 'Settings (standalone)',
  // Contract with the shell — see apps/shell/src/remotes/RemoteLoader.tsx.
  exposes: {
    './App': './src/App.tsx',
    './Widget': './src/Widget.tsx',
  },
});
