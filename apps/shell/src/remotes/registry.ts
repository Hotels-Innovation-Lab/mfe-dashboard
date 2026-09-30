import type { RemoteDefinition } from '@mfe/shared';
import { registerRemotes } from '@module-federation/enhanced/runtime';

/**
 * Fetches `remotes.config.json` and registers each remote with the MF runtime.
 * The file is served next to the shell, so each environment (or a Docker volume)
 * can point at different remote URLs without rebuilding the shell.
 */
export async function loadRemoteDefinitions(): Promise<RemoteDefinition[]> {
  const response = await fetch('/remotes.config.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`remotes.config.json: HTTP ${response.status}`);

  const remotes = (await response.json()) as RemoteDefinition[];
  registerRemotes(remotes.map(({ name, entry }) => ({ name, entry })));
  return remotes;
}
