import type { RemoteDefinition } from '@mfe/shared';

import { RemoteLoader } from '../remotes/RemoteLoader';

/** Dashboard home: composes the `Widget` exposed by every registered remote. */
export function HomePage({ remotes }: { remotes: RemoteDefinition[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Each card below is served by a separately deployed micro frontend.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {remotes.map((remote) => (
          <RemoteLoader key={remote.name} remote={remote.name} module="Widget" />
        ))}
      </div>
    </div>
  );
}
