import { DATE_RANGES, usePreferencesStore, type DateRange } from '@mfe/shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@mfe/ui/components/select';

export function DateRangeSelect() {
  const dateRange = usePreferencesStore((s) => s.dateRange);
  const setDateRange = usePreferencesStore((s) => s.setDateRange);

  return (
    <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
      <SelectTrigger size="sm" className="w-36" aria-label="Date range">
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
  );
}
