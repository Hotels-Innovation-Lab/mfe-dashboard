# MFE Dashboard

A micro-frontend dashboard boilerplate: a **React 19** shell that composes independently built and deployed
remotes at runtime using **Module Federation 2.0** on **Rsbuild**, with a shared **shadcn/ui** design system
and **Zustand** state. The monorepo is managed by **pnpm** workspaces and **Turborepo**.

```
                        ┌──────────────── Browser ────────────────┐
                        │  shell (host) :3000                     │
 remotes.config.json ──▶│  ├─ layout, routing, auth, toasts       │
                        │  ├─ /overview/*  ◀── overview  :3001    │
                        │  ├─ /analytics/* ◀── analytics :3002    │
                        │  └─ /settings/*  ◀── settings  :3003    │
                        │                                         │
                        │  shared singletons: react, react-dom,   │
                        │  react-router, zustand, @mfe/shared     │
                        └─────────────────────────────────────────┘
```

## Quick start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 and sign in with any email and password (the auth is mocked).

| App         | Port | Role                                    | Exposes             |
| ----------- | ---- | --------------------------------------- | ------------------- |
| `shell`     | 3000 | Host: layout, routing, auth, toasts     | none                |
| `overview`  | 3001 | KPI cards, nested route `/activity`     | `./App`, `./Widget` |
| `analytics` | 3002 | shadcn charts (Recharts)                | `./App`, `./Widget` |
| `settings`  | 3003 | Preferences, writes to the shared store | `./App`, `./Widget` |

## Development workflows

Run commands from the repo root. There are three ways to work, depending on what you're changing.

### 1. The whole dashboard

```bash
pnpm dev
```

This starts the shell and every remote with hot reload. Open http://localhost:3000. If one server crashes, the
others keep running.

### 2. The shell plus the remote you're working on

```bash
pnpm turbo run dev --filter=@mfe/shell --filter=@mfe/analytics
```

This shows your remote inside the real layout at http://localhost:3000/analytics and on the home page. Remotes you
didn't start show a "… is unavailable" card with a Retry button. That's expected, and it's a quick way to see how
the shell handles an outage.

To run the shell alone, use `pnpm --filter @mfe/shell dev`. Every remote card will show as unavailable, but you can
work on the layout, sidebar, login and routing.

### 3. A remote on its own (standalone)

```bash
pnpm --filter @mfe/analytics dev
```

The shell isn't needed. A small dev harness (`StandaloneHost` in `@mfe/shared/host`) supplies the router, theme,
toasts and an auto-signed-in mock user. A banner at the top links to both exposed modules:

| URL                          | Renders                                             |
| ---------------------------- | --------------------------------------------------- |
| http://localhost:3002/       | `./App`, the full page, including its nested routes |
| http://localhost:3002/widget | `./Widget`, the card shown on the shell's home page |

The same pattern works for `overview` (3001) and `settings` (3003).

**Where things live in a remote**

```
apps/analytics/src/
  App.tsx        exposed as ./App: the page, mounted by the shell at /analytics/*
  Widget.tsx     exposed as ./Widget: the home-page card
  bootstrap.tsx  standalone entry only; the shell never loads it
  components/    private to this remote
  lib/           data access (mock data today)
```

Remote routes are **relative**: `<Route path="details">` becomes `/analytics/details` in the shell and `/details`
standalone. To change the theme or date range, write to the shared stores. To ask the shell for something, emit on
`eventBus`, e.g. `eventBus.emit('nav:go', { to: '/settings' })`. Never import from the shell or from another remote.

### Tests for a single package

```bash
pnpm --filter @mfe/analytics test      # add `-- --watch` for watch mode
```

## Repository layout

```
apps/
  shell/       host application
  overview/    remote
  analytics/   remote
  settings/    remote
packages/
  ui/          @mfe/ui: shadcn components, cn(), theme + Tailwind styles
  shared/      @mfe/shared: Zustand stores, auth stub, event bus, shared types
               @mfe/shared/host: HostToaster, NavigationBridge, StandaloneHost
  config/      @mfe/config: Rsbuild/MF factory, tsconfig, ESLint, Prettier, Vitest presets
docker/        nginx config template
```

## How it fits together

### Module Federation

- `packages/config/rsbuild.config.mjs` holds `defineMfeConfig()`, which every app uses. It also defines the
  **shared singletons**. `@mfe/shared` is one of them, which is why all MFEs see the same store instances and the same
  event bus.
- The shell has **no build-time remotes**. On boot it fetches `apps/shell/public/remotes.config.json` and calls
  `registerRemotes()`. To point an environment at different remote URLs, change that file (in Docker, mount over it).
  The shell doesn't need a rebuild.
- `RemoteLoader` (`apps/shell/src/remotes/RemoteLoader.tsx`) wraps each federated module in `Suspense` and its
  own error boundary with a **Retry** button. If one remote is down, the rest of the dashboard keeps working.
- Each app uses the `index.ts → import('./bootstrap')` async boundary, so shared deps get negotiated before any
  app code runs.

### State vs. events

- **State** lives in Zustand stores in `@mfe/shared`: `useAuthStore`, `usePreferencesStore`. Anyone can read them,
  and changes propagate to every MFE instantly.
- **Events** go through `eventBus` in `@mfe/shared`: fire-and-forget commands such as `notify:toast` and `nav:go`.
  The shell handles them.
- Nothing else should be shared implicitly. Remotes must not import from each other or from the shell.
- Remotes can add their own events through declaration merging on `MfeEventMap`.

### Styling

- The shell loads `@mfe/ui/styles/globals.css`: Tailwind preflight, theme variables (light/dark) and utilities.
- Exposed remote modules import `@mfe/ui/styles/remote.css`, which contains theme tokens and utilities only. That way a
  remote can never reset or restyle the host page. Standalone bootstraps load the full `globals.css`.
- Dark mode is a `.dark` class on `<html>`, applied by `useApplyTheme()` from the shared preferences store.

### Auth

`useAuthStore.login()` is a mock. To integrate a real provider (OIDC/PKCE, etc.), replace `mockAuthenticate` in
`packages/shared/src/stores/auth.ts`. Consumers only depend on `user`, `token` and `getAccessToken()`.

## Common tasks

**Add a shadcn component** to the design system:

```bash
cd packages/ui && pnpm dlx shadcn@latest add dialog
```

Then import it anywhere with `import { Dialog } from '@mfe/ui/components/dialog'`.

**Add a new remote:**

1. Copy `apps/settings` to `apps/<name>`. Then update `name` in `package.json`, and update `name`/`port`/`title` in
   `rsbuild.config.mjs`.
2. Implement `src/App.tsx` (relative `<Routes>`) and `src/Widget.tsx`. Both are default exports and both import
   `@mfe/ui/styles/remote.css`.
3. Add an entry to `apps/shell/public/remotes.config.json`. If you need a new icon, add it to
   `apps/shell/src/layout/icons.ts`.
4. Add a service to `docker-compose.yml`, and add the app to the CI Docker matrix.

## Scripts

| Command          | What it does                                              |
| ---------------- | --------------------------------------------------------- |
| `pnpm dev`       | All dev servers in parallel (HMR)                         |
| `pnpm build`     | Production builds for all apps (`apps/*/dist`)            |
| `pnpm preview`   | Build, then serve the production output on the same ports |
| `pnpm lint`      | ESLint (flat config, React Compiler rules, a11y)          |
| `pnpm typecheck` | `tsc --noEmit` in every package                           |
| `pnpm test`      | Vitest + Testing Library                                  |
| `pnpm format`    | Prettier (with Tailwind class sorting)                    |

## Docker and CI

```bash
docker compose up --build        # all four apps on :3000–3003, served by nginx
docker build --build-arg APP=analytics -t mfe-analytics .
```

The single `Dockerfile` uses `turbo prune` to build only the target app. nginx serves the result with an SPA fallback,
`no-cache` on `mf-manifest.json`/`remotes.config.json`, immutable caching on hashed assets, and CORS. Set
`CORS_ORIGIN` to your shell's origin in production.

`.github/workflows/ci.yml` runs format check, lint, typecheck, test and build. On PRs it runs these only for
affected packages. It then builds each app's Docker image. Pushing is disabled until you configure a registry.

## Production notes

- **Versioning:** `@mfe/shared` is a singleton with `requiredVersion: false`, so keep its API backwards compatible.
  Deploy additive changes first, and remove old APIs only after every remote has upgraded.
- **Types:** the remote contract (`App`/`Widget` default-exporting components) is typed by hand in
  `RemoteLoader.tsx`. For richer contracts, enable MF `dts` in `defineMfeConfig`.
- **Remote URLs:** the dev `remotes.config.json` points at `localhost`. Generate one per environment at deploy time.
