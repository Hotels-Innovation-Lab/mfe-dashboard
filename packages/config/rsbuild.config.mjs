import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import tailwindcss from '@tailwindcss/postcss';

/**
 * Dependencies shared across every MFE at runtime.
 * Singletons guarantee one React tree, one router context and one copy of the
 * shared Zustand stores / event bus, no matter which app loaded first.
 */
export const sharedDependencies = {
  react: { singleton: true },
  'react-dom': { singleton: true },
  'react-router': { singleton: true },
  zustand: { singleton: true },
  '@mfe/shared': { singleton: true, requiredVersion: false },
};

/**
 * Rsbuild config factory used by every app (host and remotes).
 *
 * @param {object} options
 * @param {string} options.name      Federation container name (must be a valid JS identifier).
 * @param {number} options.port      Dev/preview server port.
 * @param {string} options.title     HTML document title.
 * @param {Record<string, string>} [options.exposes]  Modules exposed by a remote.
 */
export function defineMfeConfig({ name, port, title, exposes }) {
  return defineConfig({
    plugins: [
      pluginReact(),
      pluginModuleFederation({
        name,
        exposes,
        // The shell registers remotes at runtime from remotes.config.json.
        remotes: {},
        shared: sharedDependencies,
        dts: false,
      }),
    ],
    source: {
      entry: { index: './src/index.ts' },
    },
    html: {
      title,
    },
    server: {
      port: Number(process.env.PORT ?? port),
      strictPort: true,
      // Remotes are fetched cross-origin by the shell. Dev/preview only — nginx sets this in Docker.
      cors: { origin: /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/ },
      historyApiFallback: true,
    },
    dev: {
      // Absolute prefix so chunks resolve against this app's origin when loaded by the shell.
      assetPrefix: `http://localhost:${port}/`,
    },
    output: {
      // `auto` derives the public path from the script URL, so a build works on any origin.
      assetPrefix: process.env.ASSET_PREFIX ?? 'auto',
    },
    tools: {
      postcss: (_config, { addPlugins }) => {
        addPlugins(tailwindcss());
      },
    },
  });
}
