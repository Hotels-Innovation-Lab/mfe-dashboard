// Utilities-only CSS: the shell provides preflight + theme values.
import '@mfe/ui/styles/remote.css';

import { DATE_RANGES, usePreferencesStore } from '@mfe/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@mfe/ui/components/card';
import { Navigate, Route, Routes } from 'react-router';

import { ChannelChart } from './components/ChannelChart';
import { TrafficChart } from './components/TrafficChart';
import { getChannels, getTraffic } from './lib/data';

/** Mounted by the shell at `/analytics/*`. */
export default function AnalyticsApp() {
  return (
    <Routes>
      <Route index element={<AnalyticsPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}

function AnalyticsPage() {
  const dateRange = usePreferencesStore((s) => s.dateRange);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">{DATE_RANGES[dateRange]}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Traffic</CardTitle>
            <CardDescription>Daily visitors by device</CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficChart data={getTraffic(dateRange)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Channels</CardTitle>
            <CardDescription>Visits by acquisition channel</CardDescription>
          </CardHeader>
          <CardContent>
            <ChannelChart data={getChannels(dateRange)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
