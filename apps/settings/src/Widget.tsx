import '@mfe/ui/styles/remote.css';

import { DATE_RANGES, eventBus, usePreferencesStore } from '@mfe/shared';
import { Button } from '@mfe/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@mfe/ui/components/card';
import { Label } from '@mfe/ui/components/label';
import { Switch } from '@mfe/ui/components/switch';

export default function SettingsWidget() {
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const dateRange = usePreferencesStore((s) => s.dateRange);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Theme: {theme} · {DATE_RANGES[dateRange]}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <Switch
          id="widget-dark-mode"
          checked={theme === 'dark'}
          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        />
        <Label htmlFor="widget-dark-mode">Dark mode</Label>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => eventBus.emit('nav:go', { to: '/settings' })}
        >
          All settings
        </Button>
      </CardFooter>
    </Card>
  );
}
