import type { RemoteDefinition } from '@mfe/shared';
import { Separator } from '@mfe/ui/components/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@mfe/ui/components/sidebar';
import { Outlet } from 'react-router';

import { AppSidebar } from './AppSidebar';
import { DateRangeSelect } from './DateRangeSelect';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

export function AppLayout({ remotes }: { remotes: RemoteDefinition[] }) {
  return (
    <SidebarProvider>
      <AppSidebar remotes={remotes} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <div className="ml-auto flex items-center gap-2">
            <DateRangeSelect />
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
