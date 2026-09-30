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

import { getKpis } from './lib/data';

/** Compact card rendered on the shell's home dashboard. */
export default function OverviewWidget() {
  const dateRange = usePreferencesStore((s) => s.dateRange);
  const kpis = getKpis(dateRange);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>{DATE_RANGES[dateRange]}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {kpis.slice(0, 2).map((kpi) => (
          <div key={kpi.id}>
            <div className="text-xs text-muted-foreground">{kpi.label}</div>
            <div className="text-xl font-semibold tabular-nums">{kpi.value}</div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => eventBus.emit('nav:go', { to: '/overview' })}
        >
          Open overview
        </Button>
      </CardFooter>
    </Card>
  );
}
