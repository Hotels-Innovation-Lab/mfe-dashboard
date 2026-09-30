export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

/** One entry in the shell's `remotes.config.json`. */
export interface RemoteDefinition {
  /** Federation container name, e.g. `analytics`. */
  name: string;
  /** URL of the remote's `mf-manifest.json`. */
  entry: string;
  /** Sidebar label. */
  label: string;
  /** Route prefix in the shell, e.g. `/analytics`. */
  path: string;
  /** lucide-react icon name used in the sidebar. */
  icon: string;
}
