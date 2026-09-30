// Utilities-only CSS: the shell provides preflight + theme values.
import '@mfe/ui/styles/remote.css';

import {
  DATE_RANGES,
  eventBus,
  useAuthStore,
  usePreferencesStore,
  type DateRange,
} from '@mfe/shared';
import { Badge } from '@mfe/ui/components/badge';
import { Button } from '@mfe/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@mfe/ui/components/card';
import { Label } from '@mfe/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@mfe/ui/components/select';
import { Navigate, Route, Routes } from 'react-router';

import { ThemeSelect } from './components/ThemeSelect';

/** Mounted by the shell at `/settings/*`. */
export default function SettingsApp() {
  return (
    <Routes>
      <Route index element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}

function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const dateRange = usePreferencesStore((s) => s.dateRange);
  const setDateRange = usePreferencesStore((s) => s.setDateRange);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Changes here are written to the shared store and picked up by every MFE instantly.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Provided by the shell&apos;s auth store.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm">
          <div>
            <div className="font-medium">{user?.name}</div>
            <div className="text-muted-foreground">{user?.email}</div>
          </div>
          <div className="flex gap-1">
            {user?.roles.map((role) => (
              <Badge key={role} variant="secondary">
                {role}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Theme</Label>
            <ThemeSelect id="theme" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="date-range">Default date range</Label>
            <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
              <SelectTrigger id="date-range" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DATE_RANGES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cross-MFE events</CardTitle>
          <CardDescription>
            Fire events the shell listens for on the shared event bus.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              eventBus.emit('notify:toast', {
                title: 'Settings saved',
                description: 'Sent from the settings remote via eventBus.',
                variant: 'success',
              })
            }
          >
            Send test notification
          </Button>
          <Button variant="outline" onClick={() => eventBus.emit('nav:go', { to: '/analytics' })}>
            Go to analytics
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
