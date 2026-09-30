import type { RemoteDefinition } from '@mfe/shared';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@mfe/ui/components/sidebar';
import { Boxes, Home } from 'lucide-react';
import { NavLink, useLocation } from 'react-router';

import { getIcon } from './icons';

export function AppSidebar({ remotes }: { remotes: RemoteDefinition[] }) {
  const { pathname } = useLocation();
  const items = [
    { label: 'Home', path: '/', Icon: Home },
    ...remotes.map((r) => ({ label: r.label, path: r.path, Icon: getIcon(r.icon) })),
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5 font-semibold">
          <Boxes className="size-5 shrink-0" />
          <span className="truncate group-data-[collapsible=icon]:hidden">MFE Dashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarMenu>
            {items.map(({ label, path, Icon }) => (
              <SidebarMenuItem key={path}>
                <SidebarMenuButton
                  asChild
                  tooltip={label}
                  isActive={path === '/' ? pathname === '/' : pathname.startsWith(path)}
                >
                  <NavLink to={path}>
                    <Icon />
                    <span>{label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
