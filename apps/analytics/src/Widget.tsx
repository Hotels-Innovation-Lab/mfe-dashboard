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

import { TrafficChart } from './components/TrafficChart';
import { getTraffic } from './lib/data';

export default function AnalyticsWidget() {
  const dateRange = usePreferencesStore((s) => s.dateRange);
  const data = getTraffic(dateRange);
  const total = data.reduce((sum, d) => sum + d.desktop + d.mobile, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Traffic</CardTitle>
        <CardDescription>
          {total.toLocaleString()} visitors · {DATE_RANGES[dateRange]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TrafficChart data={data} compact className="h-24" />
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => eventBus.emit('nav:go', { to: '/analytics' })}
        >
          Open analytics
        </Button>
      </CardFooter>
    </Card>
  );
}
