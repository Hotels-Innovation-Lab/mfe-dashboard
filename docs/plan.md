# MGM Corp Dashboard — Boilerplate Plan

## Context
Goal: a production-shaped starter for a dashboard built as micro frontends, where each section can be developed, tested, and deployed on its own while sharing one design system and one app state.

Decisions made:
- React 19 + TypeScript
- Module Federation 2.0 (`@module-federation/rsbuild-plugin`) with Rsbuild
- pnpm workspaces + Turborepo monorepo
- shadcn/ui (Tailwind v4) for the design system, Zustand for shared state
- Local: Node 25, pnpm 12.3.4 (pinned through `packageManager`). Docker/CI use Node 22 LTS.

## Repository layout
```
mgm-corp-dashboard/
├── apps/
│   ├── shell/        # host app, port 3000: layout, sidebar, routing, auth, loads remotes
│   ├── overview/     # remote, port 3001: KPI cards + a "summary" widget
│   ├── analytics/    # remote, port 3002: shadcn charts (Recharts)
│   └── settings/     # remote, port 3003: profile/theme form (writes to the shared store)
├── packages/
│   ├── ui/           # @mfe/ui: shadcn components, cn(), theme.css (CSS vars, light/dark)
│   ├── shared/       # @mfe/shared: Zustand stores, auth stub, typed event bus, shared types
│   └── config/       # @mfe/config: tsconfig bases, ESLint flat config, Prettier, Vitest preset, rsbuild MF helper
├── docker/           # nginx.conf template (SPA fallback + CORS for remotes)
├── .github/workflows/ci.yml
├── docker-compose.yml
├── turbo.json, pnpm-workspace.yaml, package.json, .nvmrc, README.md
```

## Key design points

### 1. Module Federation wiring
- A shared helper `packages/config/mf.ts` returns the `shared` config so all apps stay in sync. Singletons: `react`, `react-dom`, `react-router`, `zustand`, `@mfe/shared` (one copy means one store and one event bus at runtime). `@mfe/ui` is also shared, but not as a singleton.
- Each remote exposes:
  - `./App` is the remote's nested routes, mounted by the shell at `/overview/*`, `/analytics/*`, `/settings/*`
  - `./Widget` is a small card that the shell's home dashboard grid composes
- **Runtime remote discovery**: at boot the shell fetches `public/remotes.config.json` (`{ name, entry: ".../mf-manifest.json" }`) and calls `registerRemotes()` from `@module-federation/enhanced/runtime`. Deploying a remote then only means updating its URL in that JSON, with no shell rebuild. In dev the JSON points at localhost ports.
- Every app uses the `index.ts → import('./bootstrap')` async boundary. Every remote also runs **standalone** (its own `BrowserRouter` + mock auth) for isolated development.
- Shell-side `RemoteLoader` combines `React.lazy(loadRemote(...))`, `Suspense` with a skeleton, and a per-remote `ErrorBoundary` with a retry button. One broken remote doesn't take down the dashboard.
- Remote types come from hand-written `apps/shell/src/types/remotes.d.ts`. That keeps things simple and works with dynamic remotes. MF DTS generation can be added later.

### 2. Design system (shadcn + Tailwind v4)
- `packages/ui` is set up with shadcn monorepo mode (`components.json`). It starts with: button, card, badge, input, label, select, switch, dropdown-menu, avatar, separator, skeleton, sidebar, sheet, tooltip, sonner, chart.
- `packages/ui/src/styles/theme.css` holds the shadcn CSS variables (light/dark) plus `@theme inline` tokens.
- CSS strategy for independently deployed remotes:
  - The shell imports `tailwindcss` (preflight/base), `theme.css`, and its own utilities.
  - Each remote's exposed modules import a remote-local CSS file with only `@import "tailwindcss/utilities"` and `@source` pointing at its own `src` and `packages/ui/src`. Remotes ship their own utilities and never re-emit base styles. Standalone mode imports the full base.
- Tailwind runs through `@tailwindcss/postcss` in each Rsbuild config.

### 3. State and communication (`@mfe/shared`)
- `useAuthStore` (Zustand): `user`, `token`, `login()` (mock, returns a fake JWT/user), `logout()`, `persist` to sessionStorage. `<RequireAuth>` guard plus a `/login` page in the shell.
- `usePreferencesStore`: theme (light/dark/system) and date range. The settings remote writes it, and analytics/overview react to it. This is the demo of shared state.
- `eventBus`: a tiny typed pub/sub (`emit`/`on`/`off`, typed `EventMap`) for fire-and-forget cross-MFE events, e.g. `notify:toast` → the shell shows a sonner toast, and `nav:go` → the shell navigates.
- Rule written into the README: Zustand for shared *state*, eventBus for *events*, and nothing else is shared implicitly.

### 4. Shell
- Layout uses shadcn `Sidebar` + a header (user avatar menu, theme toggle, date-range select).
- Routes: `/login`; `/` is the home grid of `Widget`s from all remotes; `/:remote/*` loads the remote `App`. The nav items come from `remotes.config.json` (label, icon, path).

### 5. Tooling
- **Turbo tasks**: `dev` (all apps in parallel), `build`, `lint`, `typecheck`, `test`, `preview`, with caching and `dependsOn: ["^build"]` where needed.
- **Lint/format**: ESLint 9 flat config (typescript-eslint, react-hooks, jsx-a11y) and Prettier with the tailwind plugin.
- **Tests**: Vitest + React Testing Library + jsdom in every package. Seed tests cover the stores, the event bus, `RemoteLoader`'s error fallback, and one component per remote.
- **Docker**: one multi-stage Dockerfile, parametrized by `APP` (node:22-alpine `turbo prune` → build → nginx:alpine). nginx gives SPA fallback and `Access-Control-Allow-Origin` on remotes. `docker-compose.yml` runs all 4 apps on ports 3000–3003. The shell's `remotes.config.json` can be overridden with a mounted volume.
- **CI** (GitHub Actions): pnpm install with cache → `turbo run lint typecheck test build` (affected-only through `--filter=...[origin/main]` on PRs) → build Docker images (no push until a registry is configured).

## Implementation order
1. Root scaffolding: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.nvmrc`, `.gitignore`, `git init`.
2. `packages/config`: tsconfig bases, eslint, prettier, vitest, MF shared helper.
3. `packages/ui`: shadcn init + components + theme.css.
4. `packages/shared`: stores, eventBus, types, and tests.
5. `apps/shell`: Rsbuild + MF host, layout, auth, RemoteLoader, runtime registration.
6. `apps/overview`, `apps/analytics`, `apps/settings`: Rsbuild + MF remote, `App` + `Widget`, standalone bootstrap.
7. Tests, Docker, compose, CI, README (architecture diagram, how to add a new MFE, port map).

## Verification
- `pnpm install && pnpm dev` starts 4 dev servers. Open http://localhost:3000, log in with mock auth, and see the home grid with 3 remote widgets.
- Change the theme or date range in Settings. The shell and Analytics update instantly, which confirms a singleton store across MFEs. Trigger a toast from a remote, which confirms the event bus.
- Stop the analytics dev server. The shell shows an error fallback for that remote only, and retry works after restart.
- Open http://localhost:3002 directly. The remote runs standalone.
- `pnpm lint && pnpm typecheck && pnpm test && pnpm build` all pass.
- `docker compose up --build` serves the whole thing on ports 3000–3003.
- In the browser pane, check that the network tab shows `mf-manifest.json` loaded from each remote, and that the console has no duplicate-React warnings.