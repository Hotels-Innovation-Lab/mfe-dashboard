import { defineMfeConfig } from '@mfe/config/rsbuild';

export default defineMfeConfig({
  name: 'overview',
  port: 3001,
  title: 'Overview (standalone)',
  // Contract with the shell — see apps/shell/src/remotes/RemoteLoader.tsx.
  exposes: {
    './App': './src/App.tsx',
    './Widget': './src/Widget.tsx',
  },
});
