import { usePreferencesStore, type ThemePreference } from '@mfe/shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@mfe/ui/components/select';

export function ThemeSelect({ id }: { id?: string }) {
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);

  return (
    <Select value={theme} onValueChange={(value) => setTheme(value as ThemePreference)}>
      <SelectTrigger id={id} className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  );
}
