import { Box, ChartLine, LayoutDashboard, Settings, type LucideIcon } from 'lucide-react';

/** Icons referenced by name from remotes.config.json. Add entries as new remotes appear. */
const icons: Record<string, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  'chart-line': ChartLine,
  settings: Settings,
};

export const getIcon = (name: string): LucideIcon => icons[name] ?? Box;
