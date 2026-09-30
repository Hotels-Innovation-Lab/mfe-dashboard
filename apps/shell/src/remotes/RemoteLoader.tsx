import { Button } from '@mfe/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@mfe/ui/components/card';
import { Skeleton } from '@mfe/ui/components/skeleton';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { TriangleAlert } from 'lucide-react';
import {
  lazy,
  Suspense,
  useState,
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
} from 'react';

import { ErrorBoundary } from './ErrorBoundary';

/** Modules every remote exposes. Keep in sync with each remote's rsbuild.config.mjs. */
export type ExposedModule = 'App' | 'Widget';

const cache = new Map<string, LazyExoticComponent<ComponentType>>();

function getRemoteComponent(remote: string, module: ExposedModule, attempt: number) {
  const key = `${remote}/${module}#${attempt}`;
  let component = cache.get(key);
  if (!component) {
    component = lazy(async () => {
      const mod = await loadRemote<{ default: ComponentType }>(`${remote}/${module}`);
      if (!mod?.default) throw new Error(`Remote "${remote}/${module}" has no default export`);
      return mod;
    });
    cache.set(key, component);
  }
  return component;
}

interface RemoteLoaderProps {
  remote: string;
  module: ExposedModule;
  /** Rendered while the remote chunk downloads. */
  fallback?: ReactNode;
}

/**
 * Loads a federated module with a loading state and an isolated error boundary,
 * so one unavailable remote never takes down the rest of the dashboard.
 */
export function RemoteLoader({ remote, module, fallback }: RemoteLoaderProps) {
  const [attempt, setAttempt] = useState(0);
  const RemoteComponent = getRemoteComponent(remote, module, attempt);

  return (
    <ErrorBoundary
      key={attempt}
      fallback={(error) => (
        <RemoteError remote={remote} error={error} onRetry={() => setAttempt((n) => n + 1)} />
      )}
    >
      <Suspense fallback={fallback ?? <RemoteSkeleton />}>
        {/* Identity is stable: getRemoteComponent memoizes per remote/module/attempt. */}
        {/* eslint-disable-next-line react-hooks/static-components */}
        <RemoteComponent />
      </Suspense>
    </ErrorBoundary>
  );
}

function RemoteSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

function RemoteError({
  remote,
  error,
  onRetry,
}: {
  remote: string;
  error: Error;
  onRetry: () => void;
}) {
  return (
    <Card role="alert" className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <TriangleAlert className="size-4" />
          {remote} is unavailable
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          This module couldn&apos;t be loaded. It may be offline or mid-deploy.
        </p>
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer">Details</summary>
          <pre className="mt-2 max-h-40 overflow-auto break-all whitespace-pre-wrap">
            {error.message}
          </pre>
        </details>
        <Button size="sm" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
