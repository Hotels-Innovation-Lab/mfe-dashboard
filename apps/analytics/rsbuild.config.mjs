import { defineMfeConfig } from '@mfe/config/rsbuild';

export default defineMfeConfig({
  name: 'analytics',
  port: 3002,
  title: 'Analytics (standalone)',
  // Contract with the shell — see apps/shell/src/remotes/RemoteLoader.tsx.
  exposes: {
    './App': './src/App.tsx',
    './Widget': './src/Widget.tsx',
  },
});
